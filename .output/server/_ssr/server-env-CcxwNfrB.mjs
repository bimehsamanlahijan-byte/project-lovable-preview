import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-env-CcxwNfrB.js
var server_env_CcxwNfrB_exports = /* @__PURE__ */ __exportAll({
	a: () => getSupabaseServiceKey,
	c: () => server_env_exports,
	i: () => getSupabasePublishableKey,
	n: () => envValueAsync,
	o: () => getSupabaseUrl,
	r: () => getSessionSecret,
	s: () => loadRuntimeEnv,
	t: () => envValue
});
var server_env_exports = /* @__PURE__ */ __exportAll$1({
	SESSION_SECRET_NAMES: () => SESSION_SECRET_NAMES,
	SUPABASE_PUBLISHABLE_NAMES: () => SUPABASE_PUBLISHABLE_NAMES,
	SUPABASE_SERVICE_KEY_NAMES: () => SUPABASE_SERVICE_KEY_NAMES,
	SUPABASE_URL_NAMES: () => SUPABASE_URL_NAMES,
	envValue: () => envValue,
	envValueAsync: () => envValueAsync,
	getSessionSecret: () => getSessionSecret,
	getSupabasePublishableKey: () => getSupabasePublishableKey,
	getSupabaseServiceKey: () => getSupabaseServiceKey,
	getSupabaseUrl: () => getSupabaseUrl,
	loadRuntimeEnv: () => loadRuntimeEnv
});
var cloudflareEnv;
var cloudflareEnvLoaded = false;
/** Loads the Worker binding object once (no-op outside Cloudflare). */
async function loadRuntimeEnv() {
	if (cloudflareEnvLoaded) return;
	cloudflareEnvLoaded = true;
	try {
		cloudflareEnv = (await import(
			/* @vite-ignore */
			"cloudflare:workers"
))?.env;
	} catch {
		cloudflareEnv = void 0;
	}
}
function bags() {
	const g = globalThis;
	return [
		typeof process !== "undefined" ? process.env : void 0,
		cloudflareEnv,
		g.__env__,
		g.env
	];
}
/** First non-empty value among the given names, across all runtime sources. */
function envValue(...names) {
	for (const bag of bags()) {
		if (!bag) continue;
		for (const name of names) {
			const raw = bag[name];
			if (typeof raw === "string" && raw.trim() !== "") return raw.trim();
		}
	}
}
/** Same as envValue but makes sure the Worker bindings were loaded first. */
async function envValueAsync(...names) {
	const direct = envValue(...names);
	if (direct) return direct;
	await loadRuntimeEnv();
	return envValue(...names);
}
var SUPABASE_URL_NAMES = [
	"EXTERNAL_SUPABASE_URL",
	"SUPABASE_URL",
	"VITE_SUPABASE_URL",
	"APP_SUPABASE_URL",
	"APP_DB_URL"
];
var SUPABASE_PUBLISHABLE_NAMES = [
	"EXTERNAL_SUPABASE_PUBLISHABLE_KEY",
	"SUPABASE_PUBLISHABLE_KEY",
	"VITE_SUPABASE_PUBLISHABLE_KEY",
	"SUPABASE_ANON_KEY",
	"APP_SUPABASE_PUBLISHABLE_KEY",
	"APP_DB_PUBLISHABLE_KEY"
];
/** Every name a Supabase service/secret key is commonly stored under. */
var SUPABASE_SERVICE_KEY_NAMES = [
	"EXTERNAL_SUPABASE_SERVICE_ROLE_KEY",
	"SUPABASE_SERVICE_ROLE_KEY",
	"SUPABASE_SERVICE_KEY",
	"SUPABASE_SECRET_KEY",
	"SUPABASE_SERVICE_ROLE",
	"SERVICE_ROLE_KEY",
	"APP_SUPABASE_SERVICE_ROLE_KEY",
	"APP_DB_SERVICE_ROLE_KEY"
];
var SESSION_SECRET_NAMES = ["SESSION_SECRET", "DASHBOARD_SESSION_SECRET"];
function getSupabaseUrl() {
	return envValue(...SUPABASE_URL_NAMES);
}
function getSupabasePublishableKey() {
	return envValue(...SUPABASE_PUBLISHABLE_NAMES);
}
function getSupabaseServiceKey() {
	return envValue(...SUPABASE_SERVICE_KEY_NAMES);
}
function getSessionSecret() {
	return envValue(...SESSION_SECRET_NAMES);
}
//#endregion
export { getSupabaseServiceKey as a, server_env_CcxwNfrB_exports as c, getSupabasePublishableKey as i, envValueAsync as n, getSupabaseUrl as o, getSessionSecret as r, loadRuntimeEnv as s, envValue as t };
