import { createServerFn } from "@tanstack/react-start";
import {
  dashboardPasswordSource,
  getGateSession,
  isUnlocked,
  requireUnlocked,
  runAdminOp,
  setDashboardPassword,
  verifyDashboardPassword,
  type AdminOp,
} from "./dashboard-auth.server";
import { parseChatIds, runFlowSteps, tg, type FlowStep } from "./telegram.server";

export const dashboardStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { unlocked: await isUnlocked() };
});

export const unlockDashboard = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const { getSessionSecret, loadRuntimeEnv } = await import("./server-env");
    await loadRuntimeEnv();
    const sessionSecret = getSessionSecret();
    if (!sessionSecret || sessionSecret.length < 32) {
      return { ok: false as const, reason: "no-session-secret" as const };
    }
    try {
      const res = await verifyDashboardPassword(data.password ?? "");
      if (!res.ok) return { ok: false as const, reason: res.reason };
      const session = await getGateSession();
      await session.update({ unlocked: true });
      return { ok: true as const };
    } catch (e) {
      console.error("[unlockDashboard]", e);
      return {
        ok: false as const,
        reason: "server-error" as const,
        message: e instanceof Error ? e.message : "خطای نامشخص سرور",
      };
    }
  });

export const dashboardPasswordInfo = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  return { source: await dashboardPasswordSource() };
});

export const changeDashboardPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { current: string; next: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const check = await verifyDashboardPassword(data.current ?? "");
    if (!check.ok) return { ok: false as const, error: "رمز فعلی نادرست است." };
    const next = (data.next ?? "").trim();
    if (next.length < 10) return { ok: false as const, error: "رمز جدید باید حداقل ۱۰ نویسه باشد." };
    const res = await setDashboardPassword(next);
    if (res.error) return { ok: false as const, error: res.error };
    return { ok: true as const };
  });

export const lockDashboard = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getGateSession();
  await session.clear();
  return { ok: true as const };
});


export const adminExec = createServerFn({ method: "POST" })
  .inputValidator((data: AdminOp) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const res = await runAdminOp(data);
    return res as { data: any; count: number | null; error: { message: string } | null };
  });

export const telegramSetWebhook = createServerFn({ method: "POST" })
  .inputValidator((data: { botId: string; url: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const bot = (await runAdminOp({
      table: "telegram_bots",
      action: "select",
      match: { id: data.botId },
      single: "single",
    })) as { data: { bot_token: string; webhook_secret: string | null } | null };
    if (!bot.data) throw new Error("BOT_NOT_FOUND");
    const secret =
      bot.data.webhook_secret || Math.random().toString(36).slice(2) + Date.now().toString(36);
    await tg(bot.data.bot_token, "setWebhook", {
      url: data.url,
      secret_token: secret,
      allowed_updates: ["message", "edited_message", "channel_post", "callback_query"],
    });
    await runAdminOp({
      table: "telegram_bots",
      action: "update",
      values: { webhook_secret: secret },
      match: { id: data.botId },
    });
    return { ok: true as const, secret };
  });

export const telegramGetInfo = createServerFn({ method: "POST" })
  .inputValidator((data: { botId: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const bot = (await runAdminOp({
      table: "telegram_bots",
      action: "select",
      match: { id: data.botId },
      single: "single",
    })) as { data: { bot_token: string } | null };
    if (!bot.data) throw new Error("BOT_NOT_FOUND");
    const me = (await tg(bot.data.bot_token, "getMe", {})) as any;
    const hook = (await tg(bot.data.bot_token, "getWebhookInfo", {})) as any;
    return { me, hook } as { me: Record<string, any>; hook: Record<string, any> };
  });

export const telegramRunFlow = createServerFn({ method: "POST" })
  .inputValidator((data: { flowId: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const flow = (await runAdminOp({
      table: "telegram_flows",
      action: "select",
      match: { id: data.flowId },
      single: "single",
    })) as {
      data: { id: string; bot_id: string | null; steps: FlowStep[]; name: string } | null;
    };
    if (!flow.data?.bot_id) throw new Error("FLOW_OR_BOT_MISSING");

    const bot = (await runAdminOp({
      table: "telegram_bots",
      action: "select",
      match: { id: flow.data.bot_id },
      single: "single",
    })) as { data: { bot_token: string; default_chat_ids: string | null } | null };
    if (!bot.data) throw new Error("BOT_NOT_FOUND");

    try {
      const result = await runFlowSteps(
        bot.data.bot_token,
        (flow.data.steps ?? []) as FlowStep[],
        parseChatIds(bot.data.default_chat_ids),
      );
      await runAdminOp({
        table: "telegram_runs",
        action: "insert",
        values: {
          flow_id: flow.data.id,
          bot_id: flow.data.bot_id,
          status: "ok",
          message: `${result.sent} پیام ارسال شد`,
          details: { log: result.log },
        },
      });
      return { ok: true as const, sent: result.sent, log: result.log };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await runAdminOp({
        table: "telegram_runs",
        action: "insert",
        values: {
          flow_id: flow.data.id,
          bot_id: flow.data.bot_id,
          status: "error",
          message,
          details: {},
        },
      });
      return { ok: false as const, error: message };
    }
  });

export const adminSignedUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { bucket: string; path: string; expiresIn?: number }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (!["customer-documents", "site-assets"].includes(data.bucket)) throw new Error("BAD_BUCKET");
    const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
    const supabaseAdmin = await getSupabaseAdmin();
    const { data: res, error } = await supabaseAdmin.storage
      .from(data.bucket)
      .createSignedUrl(data.path, data.expiresIn ?? 300);
    if (error || !res) return { url: "" as string, error: error?.message ?? "failed" };
    return { url: res.signedUrl, error: null as string | null };
  });

/* ---------- Personal Supabase storage target (URL + service key) ---------- */

export const storageTargetInfo = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const { readStorageTarget, safeHost } = await import("./storage.server");
  const t = await readStorageTarget();
  return {
    custom: Boolean(t?.url && t?.serviceKey),
    url: t?.url ?? "",
    bucket: t?.bucket ?? "site-assets",
    host: t?.url ? safeHost(t.url) : safeHost((await import("./server-env")).getSupabaseUrl() ?? ""),
    updatedAt: t?.updatedAt ?? null,
  };
});

export const saveStorageTarget = createServerFn({ method: "POST" })
  .inputValidator((data: { mode?: "lovable" | "personal"; url: string; serviceKey: string; bucket?: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { writeStorageTarget } = await import("./storage.server");

    // Explicit choice: keep using the backend Lovable created for this project.
    if ((data.mode ?? "personal") === "lovable") {
      const res = await writeStorageTarget({ url: "", serviceKey: "", bucket: "site-assets" });
      if (res.error) return { ok: false as const, error: res.error };
      return { ok: true as const, warning: null };
    }

    // Accept pasted REST/dashboard URLs too: keep only the project origin.
    let url = (data.url ?? "").trim();
    try {
      url = new URL(url).origin;
    } catch {
      url = url.replace(/\/(rest|storage|auth)\/v1.*$/, "").replace(/\/+$/, "");
    }
    const serviceKey = (data.serviceKey ?? "").trim();
    const bucket = (data.bucket ?? "site-assets").trim() || "site-assets";
    if (!/^https:\/\/.+/.test(url)) return { ok: false as const, error: "نشانی پروژه باید با https:// شروع شود." };
    if (serviceKey.length < 20) return { ok: false as const, error: "کلید سرویس‌رول نامعتبر است." };

    // Test the connection BEFORE saving, so no false "saved" message appears.
    const { createClient } = await import("@supabase/supabase-js");
    const probe = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: probeError } = await probe.storage.from(bucket).list("", { limit: 1 });
    if (probeError) {
      return {
        ok: false as const,
        error: `اتصال برقرار نشد و ذخیره نشد: ${probeError.message} — نشانی، کلید service_role و نام باکت را بررسی کنید.`,
      };
    }

    const res = await writeStorageTarget({ url, serviceKey, bucket });
    if (res.error) return { ok: false as const, error: res.error };

    // Confirm the value really landed in the database before reporting success.
    const { readStorageTarget } = await import("./storage.server");
    const saved = await readStorageTarget();
    if (!saved?.url || !saved.serviceKey) {
      return { ok: false as const, error: "ذخیره در دیتابیس تأیید نشد (کلید سرور روی Cloudflare تنظیم نشده است)." };
    }
    return { ok: true as const, warning: null };
  });


export const clearStorageTarget = createServerFn({ method: "POST" }).handler(async () => {
  await requireUnlocked();
  const { writeStorageTarget } = await import("./storage.server");
  await writeStorageTarget({ url: "", serviceKey: "", bucket: "site-assets" });
  return { ok: true as const };
});
