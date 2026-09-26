import { i as useSession$1 } from "./request-response-DrMnHfig.mjs";
import { r as getSessionSecret, s as loadRuntimeEnv, t as envValue } from "./server-env-CcxwNfrB.mjs";
import { createHash, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-auth.server-Q5OP7V4S.js
function sessionConfig() {
	return {
		password: getSessionSecret(),
		name: "azarakhsh-dashboard",
		maxAge: 604800,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/"
		}
	};
}
async function getGateSession() {
	await loadRuntimeEnv();
	return useSession$1(sessionConfig());
}
function passwordMatches(input, expected) {
	const a = createHash("sha256").update(input, "utf8").digest();
	const b = createHash("sha256").update(expected, "utf8").digest();
	return timingSafeEqual(a, b);
}
async function isUnlocked() {
	await loadRuntimeEnv();
	const secret = getSessionSecret();
	if (!secret || secret.length < 32) return false;
	try {
		return (await getGateSession()).data.unlocked === true;
	} catch {
		return false;
	}
}
async function requireUnlocked() {
	if (!await isUnlocked()) throw new Error("UNAUTHORIZED");
}
async function readPrivateSetting(key) {
	try {
		const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
		const { data } = await (await getSupabaseAdmin()).from("admin_private_settings").select("value").eq("key", key).maybeSingle();
		return data?.value ?? null;
	} catch (e) {
		console.error("[readPrivateSetting]", e);
		return null;
	}
}
async function writePrivateSetting(key, value) {
	try {
		const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
		const { error } = await (await getSupabaseAdmin()).from("admin_private_settings").upsert({
			key,
			value,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "key" });
		return { error: error ? error.message : null };
	} catch (e) {
		console.error("[writePrivateSetting]", e);
		return { error: e instanceof Error ? e.message : "خطای نامشخص" };
	}
}
var PASSWORD_KEY = "dashboard_password";
async function hashPassword(plain) {
	return (await import("../_libs/bcryptjs.mjs").then((n) => n.t)).hash(plain, 10);
}
/**
* Verifies the dashboard password against the hash stored in the database.
* If no hash exists yet, falls back to the DASHBOARD_PASSWORD env var once and
* migrates it into the database so it can be changed from the site itself.
*/
async function verifyDashboardPassword(input) {
	const plainInput = input ?? "";
	const stored = await readPrivateSetting(PASSWORD_KEY);
	if (stored?.hash) {
		if (await (await import("../_libs/bcryptjs.mjs").then((n) => n.t)).compare(plainInput, stored.hash)) return { ok: true };
	}
	const envPassword = envValue("DASHBOARD_PASSWORD");
	if (!envPassword) return stored?.hash ? { ok: false } : {
		ok: false,
		reason: "not-configured"
	};
	if (!passwordMatches(plainInput, envPassword)) return { ok: false };
	await writePrivateSetting(PASSWORD_KEY, {
		hash: await hashPassword(plainInput),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
}
async function setDashboardPassword(next) {
	return writePrivateSetting(PASSWORD_KEY, {
		hash: await hashPassword(next),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function dashboardPasswordSource() {
	if ((await readPrivateSetting(PASSWORD_KEY))?.hash) return "database";
	return envValue("DASHBOARD_PASSWORD") ? "env" : "none";
}
/** Tables the dashboard is allowed to manage. */
var ADMIN_TABLES = [
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
	"ai_sources",
	"chat_room_messages",
	"customer_documents",
	"document_categories",
	"telegram_bots",
	"telegram_flows",
	"telegram_runs",
	"telegram_updates",
	"site_users",
	"auth_identities",
	"telegram_users",
	"login_requirements",
	"login_logs"
];
async function runAdminOp(op) {
	if (!ADMIN_TABLES.includes(op.table)) throw new Error("TABLE_NOT_ALLOWED");
	const { getSupabaseAdmin, hasServiceKey } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	if (!await hasServiceKey()) return {
		data: null,
		count: null,
		error: { message: "کلید سرور بک‌اند (SUPABASE_SERVICE_ROLE_KEY) در محیط اجرا ثبت نشده است؛ به همین دلیل تغییرات ذخیره نمی‌شود. این مقدار را در Secrets همان Worker/Pages در Cloudflare ثبت و دوباره Deploy کنید." }
	};
	const from = (await getSupabaseAdmin()).from(op.table);
	let q;
	if (op.action === "insert") q = from.insert(op.values);
	else if (op.action === "upsert") q = from.upsert(op.values, op.onConflict ? { onConflict: op.onConflict } : void 0);
	else if (op.action === "update") q = from.update(op.values);
	else if (op.action === "delete") q = from.delete();
	else q = from.select(op.select ?? "*", {
		count: op.count ? "exact" : void 0,
		head: op.head ?? false
	});
	if (op.match) for (const [k, v] of Object.entries(op.match)) q = q.eq(k, v);
	if (op.action !== "select" && op.select) q = q.select(op.select);
	if (op.action === "select") {
		if (op.order) q = q.order(op.order.column, { ascending: op.order.ascending });
		if (op.limit) q = q.limit(op.limit);
	}
	if (op.single === "single") q = q.single();
	else if (op.single === "maybeSingle") q = q.maybeSingle();
	const res = await q;
	return {
		data: res.data ?? null,
		count: res.count ?? null,
		error: res.error ? { message: res.error.message } : null
	};
}
//#endregion
export { ADMIN_TABLES, dashboardPasswordSource, getGateSession, isUnlocked, readPrivateSetting, requireUnlocked, runAdminOp, setDashboardPassword, verifyDashboardPassword, writePrivateSetting };
