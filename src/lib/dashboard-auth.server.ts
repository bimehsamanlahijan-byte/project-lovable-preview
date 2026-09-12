import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { envValue, getSessionSecret, loadRuntimeEnv } from "./server-env";

export type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: getSessionSecret()!,
    name: "azarakhsh-dashboard",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export async function getGateSession() {
  await loadRuntimeEnv();
  return useSession<GateSession>(sessionConfig());
}

export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function isUnlocked(): Promise<boolean> {
  await loadRuntimeEnv();
  const secret = getSessionSecret();
  if (!secret || secret.length < 32) return false;
  try {
    const session = await getGateSession();
    return session.data.unlocked === true;
  } catch {
    return false;
  }
}

export async function requireUnlocked(): Promise<void> {
  if (!(await isUnlocked())) throw new Error("UNAUTHORIZED");
}

/* ---------- Private (service-role only) admin settings ---------- */

export async function readPrivateSetting<T>(key: string): Promise<T | null> {
  // Never throw: when the service-role key is missing on the Worker we fall back
  // to the DASHBOARD_PASSWORD env var instead of breaking the login request.
  try {
    const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
    const supabaseAdmin = await getSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("admin_private_settings" as never)
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return ((data as { value?: T } | null)?.value ?? null) as T | null;
  } catch (e) {
    console.error("[readPrivateSetting]", e);
    return null;
  }
}

export async function writePrivateSetting(key: string, value: unknown) {
  try {
    const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("admin_private_settings" as never)
      .upsert({ key, value, updated_at: new Date().toISOString() } as never, { onConflict: "key" });
    return { error: error ? error.message : null };
  } catch (e) {
    console.error("[writePrivateSetting]", e);
    return { error: e instanceof Error ? e.message : "خطای نامشخص" };
  }
}

/* ---------- Dashboard password stored in the database (bcrypt) ---------- */

const PASSWORD_KEY = "dashboard_password";

export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(plain, 10);
}

/**
 * Verifies the dashboard password against the hash stored in the database.
 * If no hash exists yet, falls back to the DASHBOARD_PASSWORD env var once and
 * migrates it into the database so it can be changed from the site itself.
 */
export async function verifyDashboardPassword(input: string): Promise<
  { ok: true } | { ok: false; reason?: "not-configured" }
> {
  const plainInput = input ?? "";
  const stored = await readPrivateSetting<{ hash?: string }>(PASSWORD_KEY);
  if (stored?.hash) {
    const bcrypt = await import("bcryptjs");
    return (await bcrypt.compare(plainInput, stored.hash)) ? { ok: true } : { ok: false };
  }

  const envPassword = envValue("DASHBOARD_PASSWORD");
  if (!envPassword) return { ok: false, reason: "not-configured" };
  if (!passwordMatches(plainInput, envPassword)) return { ok: false };
  await writePrivateSetting(PASSWORD_KEY, {
    hash: await hashPassword(plainInput),
    updatedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function setDashboardPassword(next: string) {
  return writePrivateSetting(PASSWORD_KEY, {
    hash: await hashPassword(next),
    updatedAt: new Date().toISOString(),
  });
}

export async function dashboardPasswordSource(): Promise<"database" | "env" | "none"> {
  const stored = await readPrivateSetting<{ hash?: string }>(PASSWORD_KEY);
  if (stored?.hash) return "database";
  return envValue("DASHBOARD_PASSWORD") ? "env" : "none";
}


/** Tables the dashboard is allowed to manage. */
export const ADMIN_TABLES = [
  "contact_messages",
  "suggestions",
  "partners",
  "partner_sales",
  "partner_applications",
  "damage_reports",
  "site_menu_items",
  "site_footer_sections",
  "site_footer_links",
  "site_settings",
  "social_links",
  "ai_knowledge",
  "chat_room_messages",
  "customer_documents",
  "document_categories",
  "telegram_bots",
  "telegram_flows",
  "telegram_runs",
  "telegram_updates",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

export type AdminOp = {
  table: string;
  action: "select" | "insert" | "update" | "upsert" | "delete";
  values?: unknown;
  match?: Record<string, unknown>;
  select?: string;
  order?: { column: string; ascending: boolean };
  limit?: number;
  count?: boolean;
  head?: boolean;
  single?: "single" | "maybeSingle" | null;
  onConflict?: string;
};

export async function runAdminOp(op: AdminOp) {
  if (!(ADMIN_TABLES as readonly string[]).includes(op.table)) {
    throw new Error("TABLE_NOT_ALLOWED");
  }
  const { getSupabaseAdmin, hasServiceKey } = await import("@/integrations/supabase/client.server");
  if (!(await hasServiceKey())) {
    return {
      data: null as unknown,
      count: null as number | null,
      error: {
        message:
          "کلید سرور بک‌اند (SUPABASE_SERVICE_ROLE_KEY) در محیط اجرا ثبت نشده است؛ به همین دلیل تغییرات ذخیره نمی‌شود. این مقدار را در Secrets همان Worker/Pages در Cloudflare ثبت و دوباره Deploy کنید.",
      },
    };
  }
  const supabaseAdmin = await getSupabaseAdmin();
  const from = supabaseAdmin.from(op.table as never);
  let q: any;

  if (op.action === "insert") q = from.insert(op.values as never);
  else if (op.action === "upsert")
    q = from.upsert(op.values as never, op.onConflict ? { onConflict: op.onConflict } : undefined);
  else if (op.action === "update") q = from.update(op.values as never);
  else if (op.action === "delete") q = from.delete();
  else
    q = from.select(op.select ?? "*", {
      count: op.count ? "exact" : undefined,
      head: op.head ?? false,
    } as never);

  if (op.match) for (const [k, v] of Object.entries(op.match)) q = q.eq(k, v as never);

  if (op.action !== "select" && op.select) q = q.select(op.select);
  if (op.action === "select") {
    if (op.order) q = q.order(op.order.column, { ascending: op.order.ascending });
    if (op.limit) q = q.limit(op.limit);
  }
  if (op.single === "single") q = q.single();
  else if (op.single === "maybeSingle") q = q.maybeSingle();

  const res = await q;
  return {
    data: (res.data ?? null) as unknown,
    count: (res.count ?? null) as number | null,
    error: res.error ? { message: res.error.message } : null,
  };
}
