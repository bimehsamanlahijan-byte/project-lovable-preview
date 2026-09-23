/** Database layer for the central login system (service-role, server only). */
import type { LoginMode, LoginRequirement, PublicUser } from "./registry";
import { LOGIN_MODULES } from "./registry";

async function db() {
  const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
  return getSupabaseAdmin();
}

export type IdentityInput = {
  provider: string;
  providerUserId: string;
  displayName?: string | null;
  data?: Record<string, unknown>;
};

/** Finds the site user behind a provider identity, creating it on first login. */
export async function upsertIdentity(input: IdentityInput): Promise<string> {
  const supabase = await db();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("auth_identities" as never)
    .select("id, user_id")
    .eq("provider", input.provider)
    .eq("provider_user_id", input.providerUserId)
    .maybeSingle();

  const found = existing as { id: string; user_id: string } | null;
  if (found) {
    await supabase
      .from("auth_identities" as never)
      .update({ last_login_at: now, data: (input.data ?? {}) as never } as never)
      .eq("id", found.id);
    await supabase
      .from("site_users" as never)
      .update({ last_login_at: now } as never)
      .eq("id", found.user_id);
    return found.user_id;
  }

  const { data: created, error } = await supabase
    .from("site_users" as never)
    .insert({ display_name: input.displayName ?? null, last_login_at: now } as never)
    .select("id")
    .single();
  if (error || !created) throw new Error(error?.message ?? "USER_CREATE_FAILED");
  const userId = (created as { id: string }).id;

  const { error: idErr } = await supabase.from("auth_identities" as never).insert({
    user_id: userId,
    provider: input.provider,
    provider_user_id: input.providerUserId,
    data: (input.data ?? {}) as never,
    last_login_at: now,
  } as never);
  if (idErr) throw new Error(idErr.message);
  return userId;
}

export type TelegramProfile = {
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photo?: string | null;
  verified?: boolean;
};

export async function upsertTelegramUser(userId: string, p: TelegramProfile) {
  const supabase = await db();
  await supabase.from("telegram_users" as never).upsert(
    {
      telegram_id: Number(p.telegramId),
      user_id: userId,
      telegram_username: p.username ?? null,
      first_name: p.firstName ?? null,
      last_name: p.lastName ?? null,
      profile_photo: p.photo ?? null,
      is_verified: p.verified ?? true,
      last_login: new Date().toISOString(),
    } as never,
    { onConflict: "telegram_id" },
  );
}

export async function logLogin(entry: {
  userId?: string | null;
  method: string;
  telegramId?: string | null;
  module?: string | null;
  status: "success" | "failed" | "denied";
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    const supabase = await db();
    await supabase.from("login_logs" as never).insert({
      user_id: entry.userId ?? null,
      login_method: entry.method,
      telegram_id: entry.telegramId ? Number(entry.telegramId) : null,
      module: entry.module ?? null,
      status: entry.status,
      ip: entry.ip ?? null,
      user_agent: entry.userAgent ?? null,
    } as never);
  } catch (e) {
    console.error("[logLogin]", e);
  }
}

/** Public profile of the signed-in user (safe to send to the browser). */
export async function getPublicUser(userId: string): Promise<PublicUser | null> {
  const supabase = await db();
  const { data: user } = await supabase
    .from("site_users" as never)
    .select("id, display_name, phone, phone_consent_at, is_active")
    .eq("id", userId)
    .maybeSingle();
  const u = user as
    | { id: string; display_name: string | null; phone: string | null; phone_consent_at: string | null; is_active: boolean }
    | null;
  if (!u || !u.is_active) return null;

  const { data: tg } = await supabase
    .from("telegram_users" as never)
    .select("telegram_id, telegram_username, profile_photo, is_verified, is_active")
    .eq("user_id", userId)
    .maybeSingle();
  const t = tg as
    | { telegram_id: number; telegram_username: string | null; profile_photo: string | null; is_verified: boolean; is_active: boolean }
    | null;

  const { data: identity } = await supabase
    .from("auth_identities" as never)
    .select("provider")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  return {
    id: u.id,
    displayName: u.display_name,
    phone: u.phone,
    hasPhoneConsent: Boolean(u.phone_consent_at),
    provider: (identity as { provider?: string } | null)?.provider ?? "unknown",
    telegram: t
      ? {
          id: String(t.telegram_id),
          username: t.telegram_username,
          photo: t.profile_photo,
          verified: t.is_verified,
        }
      : null,
  };
}

/** Stores the phone number only when the user explicitly consented. */
export async function saveConsentedPhone(userId: string, phone: string) {
  const supabase = await db();
  const now = new Date().toISOString();
  await supabase
    .from("site_users" as never)
    .update({ phone, phone_consent_at: now } as never)
    .eq("id", userId);
  await supabase
    .from("telegram_users" as never)
    .update({ phone_number: phone } as never)
    .eq("user_id", userId);
}

export async function clearPhone(userId: string) {
  const supabase = await db();
  await supabase
    .from("site_users" as never)
    .update({ phone: null, phone_consent_at: null } as never)
    .eq("id", userId);
  await supabase
    .from("telegram_users" as never)
    .update({ phone_number: null } as never)
    .eq("user_id", userId);
}

/** Login requirements for every known module, with sane defaults. */
export async function readRequirements(): Promise<LoginRequirement[]> {
  const defaults: LoginRequirement[] = LOGIN_MODULES.map((m) => ({
    module_key: m.key,
    label: m.label,
    mode: "none" as LoginMode,
    methods: ["telegram"],
  }));
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("login_requirements" as never)
      .select("module_key, label, mode, methods, updated_at");
    const rows = (data ?? []) as unknown as LoginRequirement[];
    const byKey = new Map(rows.map((r) => [r.module_key, r]));
    const merged = defaults.map((d) => ({ ...d, ...(byKey.get(d.module_key) ?? {}) }));
    for (const row of rows) if (!merged.some((m) => m.module_key === row.module_key)) merged.push(row);
    return merged;
  } catch (e) {
    console.error("[readRequirements]", e);
    return defaults;
  }
}

export async function readRequirement(moduleKey: string): Promise<LoginRequirement> {
  const all = await readRequirements();
  return (
    all.find((r) => r.module_key === moduleKey) ?? {
      module_key: moduleKey,
      label: moduleKey,
      mode: "none",
      methods: ["telegram"],
    }
  );
}
