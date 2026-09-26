import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { readPrivateSetting, writePrivateSetting } from "./dashboard-auth.server-Q5OP7V4S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage.server-CiW3rdAV.js
var STORAGE_TARGET_KEY = "custom_supabase_storage";
/** Reads the optional personal-Supabase override used for media storage. */
async function readStorageTarget() {
	return readPrivateSetting(STORAGE_TARGET_KEY);
}
async function writeStorageTarget(next) {
	return writePrivateSetting(STORAGE_TARGET_KEY, {
		...next,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
/**
* Returns the Supabase client + bucket used for site media.
* Falls back to the project's own admin client when no override is configured.
*/
async function getStorage() {
	const target = await readStorageTarget();
	if (target?.url && target.serviceKey) return {
		client: createClient(target.url, target.serviceKey, { auth: {
			persistSession: false,
			autoRefreshToken: false
		} }),
		bucket: target.bucket || "site-assets",
		custom: true,
		host: safeHost(target.url)
	};
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	const { getSupabaseUrl } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	return {
		client: await getSupabaseAdmin(),
		bucket: "site-assets",
		custom: false,
		host: safeHost(getSupabaseUrl() ?? "")
	};
}
function safeHost(url) {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}
//#endregion
export { getStorage, readStorageTarget, safeHost, writeStorageTarget };
