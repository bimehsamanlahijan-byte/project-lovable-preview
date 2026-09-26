import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-pages.functions-BHEnbJ40.js
/**
* Public server functions for custom pages.
*
* These are intentionally UNAUTHENTICATED: custom pages are public content
* (stored in site_settings which anon can SELECT), and the public `/p/<slug>`
* route reads them at SSR time. Admin writes go through the existing
* adminWriteSetting (auth-gated) in the dashboard pane.
*/
var getCustomPage_createServerFn_handler = createServerRpc({
	id: "01945445deba1e21ebd58750f949f470320a3be9f6f22119d716aa99e55d8223",
	name: "getCustomPage",
	filename: "src/lib/custom-pages.functions.ts"
}, (opts) => getCustomPage.__executeServer(opts));
var getCustomPage = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getCustomPage_createServerFn_handler, async ({ data }) => {
	const { readCustomPage } = await import("./custom-pages.server-BlP7gk6a.mjs");
	return await readCustomPage(data.slug);
});
var listCustomPages_createServerFn_handler = createServerRpc({
	id: "b71bbb3e0ae0614a42f218b0254197b3347d9419edf873392a2923dfc6bb5f6a",
	name: "listCustomPages",
	filename: "src/lib/custom-pages.functions.ts"
}, (opts) => listCustomPages.__executeServer(opts));
var listCustomPages = createServerFn({ method: "GET" }).handler(listCustomPages_createServerFn_handler, async () => {
	const { readCustomPages } = await import("./custom-pages.server-BlP7gk6a.mjs");
	const pages = await readCustomPages();
	return Object.values(pages).map((p) => ({
		slug: p.slug,
		title: p.title,
		published: p.published
	}));
});
var extractPageFromUrl_createServerFn_handler = createServerRpc({
	id: "2ff6f6d079f974eeb7b3611de163e97c849b02d3cf5889c3ec73d1d4ddd477be",
	name: "extractPageFromUrl",
	filename: "src/lib/custom-pages.functions.ts"
}, (opts) => extractPageFromUrl.__executeServer(opts));
var extractPageFromUrl = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(extractPageFromUrl_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { extractFromUrl } = await import("./extract-content.server-7GJZo8mR.mjs");
	return await extractFromUrl(data.url);
});
var fetchPageHtml_createServerFn_handler = createServerRpc({
	id: "e0f7d77f6e15e15e91d647b15fae01c6c646c0e7166c6e7b776d2bc2bd0c62e4",
	name: "fetchPageHtml",
	filename: "src/lib/custom-pages.functions.ts"
}, (opts) => fetchPageHtml.__executeServer(opts));
var fetchPageHtml = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(fetchPageHtml_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	let u;
	try {
		u = new URL(data.url.trim());
	} catch {
		return {
			ok: false,
			error: "آدرس معتبر نیست."
		};
	}
	if (!/^https?:$/.test(u.protocol)) return {
		ok: false,
		error: "فقط آدرس http/https مجاز است."
	};
	const host = u.hostname.toLowerCase();
	if (host === "localhost" || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return {
		ok: false,
		error: "این آدرس مجاز نیست."
	};
	try {
		const res = await fetch(u.href, {
			redirect: "follow",
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
				Accept: "text/html,application/xhtml+xml",
				"Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8"
			}
		});
		if (!res.ok) return {
			ok: false,
			error: "سایت مقصد پاسخ نداد (کد " + res.status + ")."
		};
		const html = await res.text();
		if (html.length > 6e6) return {
			ok: false,
			error: "صفحه خیلی بزرگ است."
		};
		return {
			ok: true,
			html,
			finalUrl: res.url || u.href
		};
	} catch (e) {
		return {
			ok: false,
			error: "دریافت صفحه ممکن نشد: " + (e?.message || String(e))
		};
	}
});
//#endregion
export { extractPageFromUrl_createServerFn_handler, fetchPageHtml_createServerFn_handler, getCustomPage_createServerFn_handler, listCustomPages_createServerFn_handler };
