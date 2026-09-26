import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { dashboardPasswordSource, getGateSession, isUnlocked, requireUnlocked, runAdminOp, setDashboardPassword, verifyDashboardPassword } from "./dashboard-auth.server-Q5OP7V4S.mjs";
import { parseChatIds, runFlowSteps, tg } from "./telegram.server-Ur5Pj9YJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CuLDK4iZ.js
var dashboardStatus_createServerFn_handler = createServerRpc({
	id: "67a0e7a66668c32491729b143de3bfb1242d582e4240e1dd02c8bd59a0240842",
	name: "dashboardStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => dashboardStatus.__executeServer(opts));
var dashboardStatus = createServerFn({ method: "GET" }).handler(dashboardStatus_createServerFn_handler, async () => {
	return { unlocked: await isUnlocked() };
});
var unlockDashboard_createServerFn_handler = createServerRpc({
	id: "0ce868ec34b17ffd8108c60f02767f2543c7f2744241e14503b22117d02507d7",
	name: "unlockDashboard",
	filename: "src/lib/admin.functions.ts"
}, (opts) => unlockDashboard.__executeServer(opts));
var unlockDashboard = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(unlockDashboard_createServerFn_handler, async ({ data }) => {
	const { getSessionSecret, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	await loadRuntimeEnv();
	const sessionSecret = getSessionSecret();
	if (!sessionSecret || sessionSecret.length < 32) return {
		ok: false,
		reason: "no-session-secret"
	};
	try {
		const res = await verifyDashboardPassword(data.password ?? "");
		if (!res.ok) return {
			ok: false,
			reason: res.reason
		};
		await (await getGateSession()).update({ unlocked: true });
		return { ok: true };
	} catch (e) {
		console.error("[unlockDashboard]", e);
		return {
			ok: false,
			reason: "server-error",
			message: e instanceof Error ? e.message : "خطای نامشخص سرور"
		};
	}
});
var dashboardPasswordInfo_createServerFn_handler = createServerRpc({
	id: "75d239cc9e72973400f9fd9ad206c57b3a00f57c0f6d0b3039fcfa5936326e03",
	name: "dashboardPasswordInfo",
	filename: "src/lib/admin.functions.ts"
}, (opts) => dashboardPasswordInfo.__executeServer(opts));
var dashboardPasswordInfo = createServerFn({ method: "GET" }).handler(dashboardPasswordInfo_createServerFn_handler, async () => {
	await requireUnlocked();
	return { source: await dashboardPasswordSource() };
});
var changeDashboardPassword_createServerFn_handler = createServerRpc({
	id: "8892024b89a0b0447cd2686a50c663eb500050c8da717bd5db5eb2da9059fc3c",
	name: "changeDashboardPassword",
	filename: "src/lib/admin.functions.ts"
}, (opts) => changeDashboardPassword.__executeServer(opts));
var changeDashboardPassword = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(changeDashboardPassword_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	if (!(await verifyDashboardPassword(data.current ?? "")).ok) return {
		ok: false,
		error: "رمز فعلی نادرست است."
	};
	const next = (data.next ?? "").trim();
	if (next.length < 10) return {
		ok: false,
		error: "رمز جدید باید حداقل ۱۰ نویسه باشد."
	};
	const res = await setDashboardPassword(next);
	if (res.error) return {
		ok: false,
		error: res.error
	};
	return { ok: true };
});
var lockDashboard_createServerFn_handler = createServerRpc({
	id: "9c0c39ecea61ac7c7af85dff415071dbbea1f4acfb449ab7e79f5e37a0be4a92",
	name: "lockDashboard",
	filename: "src/lib/admin.functions.ts"
}, (opts) => lockDashboard.__executeServer(opts));
var lockDashboard = createServerFn({ method: "POST" }).handler(lockDashboard_createServerFn_handler, async () => {
	await (await getGateSession()).clear();
	return { ok: true };
});
var adminExec_createServerFn_handler = createServerRpc({
	id: "cd28b0093c6a8ede3abd9454e88fea469d3817c82e73af6f61346a077a9d5a7f",
	name: "adminExec",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminExec.__executeServer(opts));
var adminExec = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(adminExec_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	return await runAdminOp(data);
});
var telegramSetWebhook_createServerFn_handler = createServerRpc({
	id: "6d61ddcb570a811cd52a1c93d6e111d2f0121c29dfc473640acb136ada505110",
	name: "telegramSetWebhook",
	filename: "src/lib/admin.functions.ts"
}, (opts) => telegramSetWebhook.__executeServer(opts));
var telegramSetWebhook = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(telegramSetWebhook_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	const bot = await runAdminOp({
		table: "telegram_bots",
		action: "select",
		match: { id: data.botId },
		single: "single"
	});
	if (!bot.data) throw new Error("BOT_NOT_FOUND");
	const secret = bot.data.webhook_secret || Math.random().toString(36).slice(2) + Date.now().toString(36);
	await tg(bot.data.bot_token, "setWebhook", {
		url: data.url,
		secret_token: secret,
		allowed_updates: [
			"message",
			"edited_message",
			"channel_post",
			"callback_query"
		]
	});
	await runAdminOp({
		table: "telegram_bots",
		action: "update",
		values: { webhook_secret: secret },
		match: { id: data.botId }
	});
	return {
		ok: true,
		secret
	};
});
var telegramGetInfo_createServerFn_handler = createServerRpc({
	id: "11eb8a581a1ccadbaf196063b21ce8dda729954812e248b1787c912bb56f07c5",
	name: "telegramGetInfo",
	filename: "src/lib/admin.functions.ts"
}, (opts) => telegramGetInfo.__executeServer(opts));
var telegramGetInfo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(telegramGetInfo_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	const bot = await runAdminOp({
		table: "telegram_bots",
		action: "select",
		match: { id: data.botId },
		single: "single"
	});
	if (!bot.data) throw new Error("BOT_NOT_FOUND");
	return {
		me: await tg(bot.data.bot_token, "getMe", {}),
		hook: await tg(bot.data.bot_token, "getWebhookInfo", {})
	};
});
var telegramRunFlow_createServerFn_handler = createServerRpc({
	id: "08ca19700bd34ed643ffcfa4df6b09380bed19c84dbc9a9893c084e08f51e216",
	name: "telegramRunFlow",
	filename: "src/lib/admin.functions.ts"
}, (opts) => telegramRunFlow.__executeServer(opts));
var telegramRunFlow = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(telegramRunFlow_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	const flow = await runAdminOp({
		table: "telegram_flows",
		action: "select",
		match: { id: data.flowId },
		single: "single"
	});
	if (!flow.data?.bot_id) throw new Error("FLOW_OR_BOT_MISSING");
	const bot = await runAdminOp({
		table: "telegram_bots",
		action: "select",
		match: { id: flow.data.bot_id },
		single: "single"
	});
	if (!bot.data) throw new Error("BOT_NOT_FOUND");
	try {
		const result = await runFlowSteps(bot.data.bot_token, flow.data.steps ?? [], parseChatIds(bot.data.default_chat_ids));
		await runAdminOp({
			table: "telegram_runs",
			action: "insert",
			values: {
				flow_id: flow.data.id,
				bot_id: flow.data.bot_id,
				status: "ok",
				message: `${result.sent} پیام ارسال شد`,
				details: { log: result.log }
			}
		});
		return {
			ok: true,
			sent: result.sent,
			log: result.log
		};
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
				details: {}
			}
		});
		return {
			ok: false,
			error: message
		};
	}
});
var adminSignedUrl_createServerFn_handler = createServerRpc({
	id: "3e3ee91f0fffa18c6fba0fb43f6d072cd7043a07e4f5c8b6a272024335b5a7a4",
	name: "adminSignedUrl",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSignedUrl.__executeServer(opts));
var adminSignedUrl = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(adminSignedUrl_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	if (!["customer-documents", "site-assets"].includes(data.bucket)) throw new Error("BAD_BUCKET");
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	const { data: res, error } = await (await getSupabaseAdmin()).storage.from(data.bucket).createSignedUrl(data.path, data.expiresIn ?? 300);
	if (error || !res) return {
		url: "",
		error: error?.message ?? "failed"
	};
	return {
		url: res.signedUrl,
		error: null
	};
});
var storageTargetInfo_createServerFn_handler = createServerRpc({
	id: "87eb6f0e5e1249232be13d061d82969468df7324f2c20db9db43f22bc9c58c98",
	name: "storageTargetInfo",
	filename: "src/lib/admin.functions.ts"
}, (opts) => storageTargetInfo.__executeServer(opts));
var storageTargetInfo = createServerFn({ method: "GET" }).handler(storageTargetInfo_createServerFn_handler, async () => {
	await requireUnlocked();
	const { readStorageTarget, safeHost } = await import("./storage.server-CiW3rdAV.mjs");
	const t = await readStorageTarget();
	return {
		custom: Boolean(t?.url && t?.serviceKey),
		url: t?.url ?? "",
		bucket: t?.bucket ?? "site-assets",
		host: t?.url ? safeHost(t.url) : safeHost((await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c)).getSupabaseUrl() ?? ""),
		updatedAt: t?.updatedAt ?? null
	};
});
var saveStorageTarget_createServerFn_handler = createServerRpc({
	id: "c6c4661cffc860e229a1f5c71b24075426b810c14b684027ff52583f38d915a7",
	name: "saveStorageTarget",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveStorageTarget.__executeServer(opts));
var saveStorageTarget = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(saveStorageTarget_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	const { writeStorageTarget } = await import("./storage.server-CiW3rdAV.mjs");
	if ((data.mode ?? "personal") === "lovable") {
		const res = await writeStorageTarget({
			url: "",
			serviceKey: "",
			bucket: "site-assets"
		});
		if (res.error) return {
			ok: false,
			error: res.error
		};
		return {
			ok: true,
			warning: null
		};
	}
	let url = (data.url ?? "").trim();
	try {
		url = new URL(url).origin;
	} catch {
		url = url.replace(/\/(rest|storage|auth)\/v1.*$/, "").replace(/\/+$/, "");
	}
	const serviceKey = (data.serviceKey ?? "").trim();
	const bucket = (data.bucket ?? "site-assets").trim() || "site-assets";
	if (!/^https:\/\/.+/.test(url)) return {
		ok: false,
		error: "نشانی پروژه باید با https:// شروع شود."
	};
	if (serviceKey.length < 20) return {
		ok: false,
		error: "کلید سرویس‌رول نامعتبر است."
	};
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const { error: probeError } = await createClient(url, serviceKey, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} }).storage.from(bucket).list("", { limit: 1 });
	if (probeError) return {
		ok: false,
		error: `اتصال برقرار نشد و ذخیره نشد: ${probeError.message} — نشانی، کلید service_role و نام باکت را بررسی کنید.`
	};
	const res = await writeStorageTarget({
		url,
		serviceKey,
		bucket
	});
	if (res.error) return {
		ok: false,
		error: res.error
	};
	const { readStorageTarget } = await import("./storage.server-CiW3rdAV.mjs");
	const saved = await readStorageTarget();
	if (!saved?.url || !saved.serviceKey) return {
		ok: false,
		error: "ذخیره در دیتابیس تأیید نشد (کلید سرور روی Cloudflare تنظیم نشده است)."
	};
	return {
		ok: true,
		warning: null
	};
});
var clearStorageTarget_createServerFn_handler = createServerRpc({
	id: "ca83406260384d63445188fd729fa48e34e8a3883b3fd9a9617036e4a12255fd",
	name: "clearStorageTarget",
	filename: "src/lib/admin.functions.ts"
}, (opts) => clearStorageTarget.__executeServer(opts));
var clearStorageTarget = createServerFn({ method: "POST" }).handler(clearStorageTarget_createServerFn_handler, async () => {
	await requireUnlocked();
	const { writeStorageTarget } = await import("./storage.server-CiW3rdAV.mjs");
	await writeStorageTarget({
		url: "",
		serviceKey: "",
		bucket: "site-assets"
	});
	return { ok: true };
});
async function defaultBotToken() {
	const { envValueAsync } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	return envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN");
}
var defaultBotStatus_createServerFn_handler = createServerRpc({
	id: "bcd358f3a7a446bec28a69c7517086d4f0e4af0463bb148ac8ce95d8a7b62c60",
	name: "defaultBotStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => defaultBotStatus.__executeServer(opts));
var defaultBotStatus = createServerFn({ method: "POST" }).handler(defaultBotStatus_createServerFn_handler, async () => {
	await requireUnlocked();
	const token = await defaultBotToken();
	if (!token) return { configured: false };
	try {
		const me = await tg(token, "getMe", {});
		const hook = await tg(token, "getWebhookInfo", {});
		return {
			configured: true,
			username: me.username ?? null,
			name: me.first_name ?? null,
			webhookUrl: hook.url ?? "",
			pending: hook.pending_update_count ?? 0,
			lastError: hook.last_error_message ?? null
		};
	} catch (e) {
		return {
			configured: true,
			error: e instanceof Error ? e.message : "telegram_error"
		};
	}
});
var defaultBotSetWebhook_createServerFn_handler = createServerRpc({
	id: "52412bbdf06baee5de6acc8788feb70d9ff28a25e22aa31c6a774861157c78e4",
	name: "defaultBotSetWebhook",
	filename: "src/lib/admin.functions.ts"
}, (opts) => defaultBotSetWebhook.__executeServer(opts));
var defaultBotSetWebhook = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(defaultBotSetWebhook_createServerFn_handler, async ({ data }) => {
	await requireUnlocked();
	const token = await defaultBotToken();
	if (!token) return {
		ok: false,
		error: "TELEGRAM_BOT_TOKEN تنظیم نشده است."
	};
	const origin = new URL(data.origin);
	if (origin.protocol !== "https:") return {
		ok: false,
		error: "آدرس باید HTTPS باشد."
	};
	const { createHash } = await import("node:crypto");
	const secret = createHash("sha256").update(`telegram-bot-ai:${token}`).digest("base64url");
	const url = `${origin.origin}/api/public/telegram/bot-ai`;
	await tg(token, "setWebhook", {
		url,
		secret_token: secret,
		allowed_updates: [
			"message",
			"edited_message",
			"callback_query"
		]
	});
	return {
		ok: true,
		url
	};
});
//#endregion
export { adminExec_createServerFn_handler, adminSignedUrl_createServerFn_handler, changeDashboardPassword_createServerFn_handler, clearStorageTarget_createServerFn_handler, dashboardPasswordInfo_createServerFn_handler, dashboardStatus_createServerFn_handler, defaultBotSetWebhook_createServerFn_handler, defaultBotStatus_createServerFn_handler, lockDashboard_createServerFn_handler, saveStorageTarget_createServerFn_handler, storageTargetInfo_createServerFn_handler, telegramGetInfo_createServerFn_handler, telegramRunFlow_createServerFn_handler, telegramSetWebhook_createServerFn_handler, unlockDashboard_createServerFn_handler };
