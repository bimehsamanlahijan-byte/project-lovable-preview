import { n as LOGIN_MODULES } from "./registry-DLN8hP8L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-DTpY_R4D.js
async function db() {
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	return getSupabaseAdmin();
}
/** Finds the site user behind a provider identity, creating it on first login. */
async function upsertIdentity(input) {
	const supabase = await db();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const { data: existing } = await supabase.from("auth_identities").select("id, user_id").eq("provider", input.provider).eq("provider_user_id", input.providerUserId).maybeSingle();
	const found = existing;
	if (found) {
		await supabase.from("auth_identities").update({
			last_login_at: now,
			data: input.data ?? {}
		}).eq("id", found.id);
		await supabase.from("site_users").update({ last_login_at: now }).eq("id", found.user_id);
		return found.user_id;
	}
	const { data: created, error } = await supabase.from("site_users").insert({
		display_name: input.displayName ?? null,
		last_login_at: now
	}).select("id").single();
	if (error || !created) throw new Error(error?.message ?? "USER_CREATE_FAILED");
	const userId = created.id;
	const { error: idErr } = await supabase.from("auth_identities").insert({
		user_id: userId,
		provider: input.provider,
		provider_user_id: input.providerUserId,
		data: input.data ?? {},
		last_login_at: now
	});
	if (idErr) throw new Error(idErr.message);
	return userId;
}
async function upsertTelegramUser(userId, p) {
	await (await db()).from("telegram_users").upsert({
		telegram_id: Number(p.telegramId),
		user_id: userId,
		telegram_username: p.username ?? null,
		first_name: p.firstName ?? null,
		last_name: p.lastName ?? null,
		profile_photo: p.photo ?? null,
		is_verified: p.verified ?? true,
		last_login: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "telegram_id" });
}
async function logLogin(entry) {
	try {
		await (await db()).from("login_logs").insert({
			user_id: entry.userId ?? null,
			login_method: entry.method,
			telegram_id: entry.telegramId ? Number(entry.telegramId) : null,
			module: entry.module ?? null,
			status: entry.status,
			ip: entry.ip ?? null,
			user_agent: entry.userAgent ?? null
		});
	} catch (e) {
		console.error("[logLogin]", e);
	}
}
/** Public profile of the signed-in user (safe to send to the browser). */
async function getPublicUser(userId) {
	const supabase = await db();
	const { data: user } = await supabase.from("site_users").select("id, display_name, phone, phone_consent_at, is_active").eq("id", userId).maybeSingle();
	const u = user;
	if (!u || !u.is_active) return null;
	const { data: tg } = await supabase.from("telegram_users").select("telegram_id, telegram_username, profile_photo, is_verified, is_active").eq("user_id", userId).maybeSingle();
	const t = tg;
	const { data: identity } = await supabase.from("auth_identities").select("provider").eq("user_id", userId).limit(1).maybeSingle();
	return {
		id: u.id,
		displayName: u.display_name,
		phone: u.phone,
		hasPhoneConsent: Boolean(u.phone_consent_at),
		provider: identity?.provider ?? "unknown",
		telegram: t ? {
			id: String(t.telegram_id),
			username: t.telegram_username,
			photo: t.profile_photo,
			verified: t.is_verified
		} : null
	};
}
/** Stores the phone number only when the user explicitly consented. */
async function saveConsentedPhone(userId, phone) {
	const supabase = await db();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await supabase.from("site_users").update({
		phone,
		phone_consent_at: now
	}).eq("id", userId);
	await supabase.from("telegram_users").update({ phone_number: phone }).eq("user_id", userId);
}
async function clearPhone(userId) {
	const supabase = await db();
	await supabase.from("site_users").update({
		phone: null,
		phone_consent_at: null
	}).eq("id", userId);
	await supabase.from("telegram_users").update({ phone_number: null }).eq("user_id", userId);
}
/** Login requirements for every known module, with sane defaults. */
async function readRequirements() {
	const defaults = LOGIN_MODULES.map((m) => ({
		module_key: m.key,
		label: m.label,
		mode: "none",
		methods: ["telegram"]
	}));
	try {
		const { data } = await (await db()).from("login_requirements").select("module_key, label, mode, methods, updated_at");
		const rows = data ?? [];
		const byKey = new Map(rows.map((r) => [r.module_key, r]));
		const merged = defaults.map((d) => ({
			...d,
			...byKey.get(d.module_key) ?? {}
		}));
		for (const row of rows) if (!merged.some((m) => m.module_key === row.module_key)) merged.push(row);
		return merged;
	} catch (e) {
		console.error("[readRequirements]", e);
		return defaults;
	}
}
async function readRequirement(moduleKey) {
	return (await readRequirements()).find((r) => r.module_key === moduleKey) ?? {
		module_key: moduleKey,
		label: moduleKey,
		mode: "none",
		methods: ["telegram"]
	};
}
//#endregion
export { clearPhone, getPublicUser, logLogin, readRequirement, readRequirements, saveConsentedPhone, upsertIdentity, upsertTelegramUser };
