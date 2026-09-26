import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/bot-login.server-OJCpzhfp.js
/**
* "Login via Telegram bot + share phone number" flow (server only).
*
* 1. The site creates a one-time nonce, binds it to the visitor's session cookie
*    and opens t.me/<bot>?start=login_<nonce>.
* 2. The bot asks the user to press "send my phone number" (request_contact).
* 3. On a verified contact the bot creates / updates the site user, stores the
*    phone and marks the nonce as completed.
* 4. The site polls; only the browser holding the same session nonce can claim it.
*/
var TTL_MS = 6e5;
var DONE_PREFIX = "bot_login:";
var PENDING_PREFIX = "bot_login_pending:";
async function db() {
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	return getSupabaseAdmin();
}
async function put(key, value) {
	await (await db()).from("site_settings").upsert({
		key,
		value,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "key" });
}
async function get(key) {
	const { data } = await (await db()).from("site_settings").select("value").eq("key", key).maybeSingle();
	return data?.value ?? null;
}
async function del(key) {
	await (await db()).from("site_settings").delete().eq("key", key);
}
function fresh(v) {
	return Boolean(v && typeof v.at === "number" && Date.now() - v.at < TTL_MS);
}
function isValidNonce(n) {
	return /^[A-Za-z0-9_-]{16,48}$/.test(n);
}
function createNonce() {
	return randomBytes(18).toString("base64url");
}
var cachedUsername = null;
async function getBotUsername(botToken) {
	if (cachedUsername) return cachedUsername;
	try {
		const { tg } = await import("./telegram.server-Ur5Pj9YJ.mjs");
		cachedUsername = (await tg(botToken, "getMe", {})).username ?? null;
		return cachedUsername;
	} catch (e) {
		console.error("[bot-login] getMe", e);
		return null;
	}
}
/** Bot side: remember which nonce this Telegram user started with. */
async function setPending(telegramId, nonce) {
	await put(PENDING_PREFIX + telegramId, {
		nonce,
		at: Date.now()
	});
}
async function takePending(telegramId) {
	const v = await get(PENDING_PREFIX + telegramId);
	await del(PENDING_PREFIX + telegramId);
	return fresh(v) ? String(v.nonce) : null;
}
async function markDone(nonce, userId) {
	await put(DONE_PREFIX + nonce, {
		userId,
		at: Date.now()
	});
}
/** Site side: returns the user id once the bot finished, consuming the nonce. */
async function claim(nonce) {
	const v = await get(DONE_PREFIX + nonce);
	if (!v) return null;
	await del(DONE_PREFIX + nonce);
	return fresh(v) ? String(v.userId) : null;
}
//#endregion
export { claim, createNonce, getBotUsername, isValidNonce, markDone, setPending, takePending };
