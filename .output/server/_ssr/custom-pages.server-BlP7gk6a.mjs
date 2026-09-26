import { n as CUSTOM_PAGES_KEY } from "./custom-pages-BHkSwtZN.mjs";
import { t as supabaseAdmin } from "./client.server-DxECWN17.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-pages.server-BlP7gk6a.js
/**
* Server-only reads of custom pages. Custom pages are public data (the
* `site_settings` row has an anon SELECT policy), so we read them with the
* service-role admin client for SSR — no auth required to read.
*/
async function readCustomPages() {
	try {
		const { data, error } = await supabaseAdmin.from("site_settings").select("value").eq("key", CUSTOM_PAGES_KEY).maybeSingle();
		if (error || !data?.value) return {};
		const value = data.value;
		if (value && typeof value === "object" && "pages" in value && value.pages) return value.pages;
		return value ?? {};
	} catch {
		return {};
	}
}
async function readCustomPage(slug) {
	return (await readCustomPages())[slug] ?? null;
}
//#endregion
export { readCustomPage, readCustomPages };
