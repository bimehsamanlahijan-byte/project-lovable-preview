import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { i as getSupabasePublishableKey, o as getSupabaseUrl, s as loadRuntimeEnv } from "./server-env-CcxwNfrB.mjs";
import { n as SEO_SETTING_KEY, t as DEFAULT_SEO } from "./seo-config-B5a56N7O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo.server-C8my3jo3.js
var seo_server_exports = /* @__PURE__ */ __exportAll({
	originFromRequest: () => originFromRequest,
	readSeoConfig: () => readSeoConfig
});
/** Reads the dashboard-managed SEO settings with the public (anon) key. */
async function readSeoConfig() {
	try {
		await loadRuntimeEnv();
		const url = getSupabaseUrl();
		const key = getSupabasePublishableKey();
		if (!url || !key) return DEFAULT_SEO;
		const res = await fetch(`${url}/rest/v1/site_settings?select=value&key=eq.${SEO_SETTING_KEY}&limit=1`, {
			headers: {
				apikey: key,
				Accept: "application/json"
			},
			cache: "no-store"
		});
		if (!res.ok) return DEFAULT_SEO;
		const value = (await res.json())?.[0]?.value;
		if (!value) return DEFAULT_SEO;
		return {
			...DEFAULT_SEO,
			...value,
			pages: value.pages?.length ? value.pages : DEFAULT_SEO.pages
		};
	} catch {
		return DEFAULT_SEO;
	}
}
function originFromRequest(request) {
	try {
		const u = new URL(request.url);
		return `${request.headers.get("x-forwarded-proto") ?? u.protocol.replace(":", "")}://${request.headers.get("host") ?? u.host}`;
	} catch {
		return "";
	}
}
//#endregion
export { readSeoConfig as n, seo_server_exports as r, originFromRequest as t };
