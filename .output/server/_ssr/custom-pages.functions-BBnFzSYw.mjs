import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-kcIQd4y9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-pages.functions-BBnFzSYw.js
/**
* Public server functions for custom pages.
*
* These are intentionally UNAUTHENTICATED: custom pages are public content
* (stored in site_settings which anon can SELECT), and the public `/p/<slug>`
* route reads them at SSR time. Admin writes go through the existing
* adminWriteSetting (auth-gated) in the dashboard pane.
*/
var getCustomPage = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("01945445deba1e21ebd58750f949f470320a3be9f6f22119d716aa99e55d8223"));
var listCustomPages = createServerFn({ method: "GET" }).handler(createSsrRpc("b71bbb3e0ae0614a42f218b0254197b3347d9419edf873392a2923dfc6bb5f6a"));
/**
* Page Builder — extract a page's main content from a URL and return it as
* editable Blocks (strips the source site's header/footer/nav). This expensive
* operation is restricted to an unlocked dashboard session.
*/
var extractPageFromUrl = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("2ff6f6d079f974eeb7b3611de163e97c849b02d3cf5889c3ec73d1d4ddd477be"));
/**
* One-click builder: fetch the raw HTML of a page so the dashboard can render
* it in a hidden frame and run the full-copy script on it automatically.
*/
var fetchPageHtml = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("e0f7d77f6e15e15e91d647b15fae01c6c646c0e7166c6e7b776d2bc2bd0c62e4"));
//#endregion
export { listCustomPages as i, fetchPageHtml as n, getCustomPage as r, extractPageFromUrl as t };
