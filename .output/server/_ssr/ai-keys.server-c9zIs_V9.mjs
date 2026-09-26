import { readPrivateSetting, writePrivateSetting } from "./dashboard-auth.server-Q5OP7V4S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-keys.server-c9zIs_V9.js
/**
* AI provider keys stored in the PRIVATE settings table (service-role only).
* Visitors can never read them; the dashboard only receives masked values.
* Stored under admin_private_settings key "ai_provider_keys".
*/
var AI_KEYS_SETTING = "ai_provider_keys";
var GOOGLE_SA_SETTING = "google_service_account";
var cache = null;
async function readAllKeys(fresh = false) {
	if (!fresh && cache && Date.now() - cache.at < 3e4) return cache.data;
	const data = await readPrivateSetting("ai_provider_keys") ?? {};
	cache = {
		at: Date.now(),
		data
	};
	return data;
}
async function dbProviderKey(providerId) {
	try {
		const k = (await readAllKeys())[providerId];
		return k?.key ? k : null;
	} catch {
		return null;
	}
}
async function saveProviderKey(providerId, key, extra) {
	const all = await readAllKeys(true);
	all[providerId] = {
		key: key.trim(),
		extra: extra?.trim() || void 0,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	cache = null;
	return writePrivateSetting(AI_KEYS_SETTING, all);
}
async function deleteProviderKey(providerId) {
	const all = await readAllKeys(true);
	delete all[providerId];
	cache = null;
	return writePrivateSetting(AI_KEYS_SETTING, all);
}
function mask(v) {
	if (!v) return "";
	if (v.length <= 8) return "••••";
	return `${v.slice(0, 4)}••••${v.slice(-4)}`;
}
//#endregion
export { GOOGLE_SA_SETTING, dbProviderKey, deleteProviderKey, mask, readAllKeys, saveProviderKey };
