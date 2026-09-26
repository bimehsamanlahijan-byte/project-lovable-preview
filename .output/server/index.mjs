globalThis.__nitro_main__ = import.meta.url;
import { a as serve, i as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"c5b-65v/N8eGLkqpOj3aHUJKnqEEASI\"",
		"mtime": "2026-09-26T13:32:40.853Z",
		"size": 3163,
		"path": "../public/favicon.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-26T13:32:40.853Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/InsuranceWheel-dWxkFbFM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c8c-a3CQ8U0q1Htp9lGnA9yf4KGt0gY\"",
		"mtime": "2026-09-26T13:32:38.922Z",
		"size": 23692,
		"path": "../public/assets/InsuranceWheel-dWxkFbFM.js"
	},
	"/assets/ItemPage-D6IbHijf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aaf-Af8vda2PPWReIQe0xLoLNSoTk9w\"",
		"mtime": "2026-09-26T13:32:38.922Z",
		"size": 2735,
		"path": "../public/assets/ItemPage-D6IbHijf.js"
	},
	"/assets/LongformSections-BIdr3oFf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95de-o3mX5aePeCIkM0xMcnfT7Rubzgs\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 38366,
		"path": "../public/assets/LongformSections-BIdr3oFf.js"
	},
	"/assets/SiteFooter-B5MnyQX2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b9a-dtx2ltE8i9BemaEfXCHYcLfs/lU\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 11162,
		"path": "../public/assets/SiteFooter-B5MnyQX2.js"
	},
	"/assets/SocialBar-EOEEVZTh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75f-Bl2Gs0q2XubmVJ6J6p/Fbehzrqw\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 1887,
		"path": "../public/assets/SocialBar-EOEEVZTh.js"
	},
	"/assets/_-Bu2p7t2E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2004-1OXKU51G/XPFT+pbKnQc2H/Cz2A\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 8196,
		"path": "../public/assets/_-Bu2p7t2E.js"
	},
	"/assets/app-promo-Bj2vxY8W.jpg": {
		"type": "image/jpeg",
		"etag": "\"10b25-iOOq8jXo6wReqK6uptQty1dbX8w\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 68389,
		"path": "../public/assets/app-promo-Bj2vxY8W.jpg"
	},
	"/assets/arrow-left-DnwbX7FK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-UtN8QKrOC0y2MbJXk0NzHj80G+Y\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 154,
		"path": "../public/assets/arrow-left-DnwbX7FK.js"
	},
	"/assets/badge-check-IXz-B7eN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-JJi5Dy7WwRrpFeK8zqwj9tShBdw\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 305,
		"path": "../public/assets/badge-check-IXz-B7eN.js"
	},
	"/assets/banner-1-CqMF0EmX.jpg": {
		"type": "image/jpeg",
		"etag": "\"386b7-fuPj/orLFQ+XvejuIab8Mv9L1d8\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 231095,
		"path": "../public/assets/banner-1-CqMF0EmX.jpg"
	},
	"/assets/banner-10-7yW1P5WZ.jpg": {
		"type": "image/jpeg",
		"etag": "\"363eb-H3Jxmz4oOqf/GyUjXL39fHPkjTY\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 222187,
		"path": "../public/assets/banner-10-7yW1P5WZ.jpg"
	},
	"/assets/banner-2-BIbrC5kO.jpg": {
		"type": "image/jpeg",
		"etag": "\"2dd5a-f9sEQUv7F5AoZtYHQB4rBiyOaLc\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 187738,
		"path": "../public/assets/banner-2-BIbrC5kO.jpg"
	},
	"/assets/banner-3-DrX61gkg.jpg": {
		"type": "image/jpeg",
		"etag": "\"3d2c4-he6dSh+C214PgloSX54bb+Z9rr0\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 250564,
		"path": "../public/assets/banner-3-DrX61gkg.jpg"
	},
	"/assets/banner-4-rynd7K9y.jpg": {
		"type": "image/jpeg",
		"etag": "\"4d50d-BDblirnZODqTyEmmfnybxr5cWMg\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 316685,
		"path": "../public/assets/banner-4-rynd7K9y.jpg"
	},
	"/assets/banner-5-CjhiASAb.jpg": {
		"type": "image/jpeg",
		"etag": "\"31805-TrMYo7VdLqEcDBpYKhKvk7INzYc\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 202757,
		"path": "../public/assets/banner-5-CjhiASAb.jpg"
	},
	"/assets/banner-6-4kFlbi04.jpg": {
		"type": "image/jpeg",
		"etag": "\"2cdc8-wVMAMRYV6gcW5mmBU67ZSTgMGPU\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 183752,
		"path": "../public/assets/banner-6-4kFlbi04.jpg"
	},
	"/assets/banner-7-DNFSqC2M.jpg": {
		"type": "image/jpeg",
		"etag": "\"481a6-2kc8u6L2knUlqFhzuSIclJwKVUs\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 295334,
		"path": "../public/assets/banner-7-DNFSqC2M.jpg"
	},
	"/assets/blog-DEf44waB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"921-CKrF8dQiLomGbuqxuqxyUuLxMIY\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 2337,
		"path": "../public/assets/blog-DEf44waB.js"
	},
	"/assets/branches-CN9b-SoF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"257-Cb/cwfVALjUKNmlvs2VGojYS/RQ\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 599,
		"path": "../public/assets/branches-CN9b-SoF.js"
	},
	"/assets/banner-9-DSJVmi8z.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f618-7cdvD4vNdmbG5ohI30ihpvd9PlA\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 194072,
		"path": "../public/assets/banner-9-DSJVmi8z.jpg"
	},
	"/assets/brand-logo-Bv8BWdEF.gif": {
		"type": "image/gif",
		"etag": "\"27bbe-vfdquiNMpoAIDhhH+9wNN6viCtw\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 162750,
		"path": "../public/assets/brand-logo-Bv8BWdEF.gif"
	},
	"/assets/banner-8-TkVk__rh.jpg": {
		"type": "image/jpeg",
		"etag": "\"5267a-dKLpQjYuhRDkVONWs+SXljvELkQ\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 337530,
		"path": "../public/assets/banner-8-TkVk__rh.jpg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-26T13:32:40.853Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/cat-car-8Nyfbyvd.jpg": {
		"type": "image/jpeg",
		"etag": "\"23319-TpWNa/mqEjffRKmGoHnPtDDcmaw\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 144153,
		"path": "../public/assets/cat-car-8Nyfbyvd.jpg"
	},
	"/assets/cat-cargo-BSRiutlm.jpg": {
		"type": "image/jpeg",
		"etag": "\"204c1-R1652sfSFrkCtNCztTyUMI4guZQ\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 132289,
		"path": "../public/assets/cat-cargo-BSRiutlm.jpg"
	},
	"/assets/cat-electronics-CVxq4DXs.jpg": {
		"type": "image/jpeg",
		"etag": "\"b915-G4jOFfHVwht9bmS7ppcHqt8e5y0\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 47381,
		"path": "../public/assets/cat-electronics-CVxq4DXs.jpg"
	},
	"/assets/cat-engineering-DJUuSoza.jpg": {
		"type": "image/jpeg",
		"etag": "\"19feb-DlUlML9QVMsYXo43bb3OAJbNq4E\"",
		"mtime": "2026-09-26T13:32:38.924Z",
		"size": 106475,
		"path": "../public/assets/cat-engineering-DJUuSoza.jpg"
	},
	"/assets/cat-fire-CaqLxJXM.jpg": {
		"type": "image/jpeg",
		"etag": "\"12feb-WO7sqYZzUlrQxtf2DPcGpU2NSCM\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 77803,
		"path": "../public/assets/cat-fire-CaqLxJXM.jpg"
	},
	"/assets/cat-health-CzBsI5Y1.jpg": {
		"type": "image/jpeg",
		"etag": "\"16b4e-CJ+Ozh3Mh0JuxZ5bnUzpATtFh9M\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 93006,
		"path": "../public/assets/cat-health-CzBsI5Y1.jpg"
	},
	"/assets/cat-eservices-CPcoYZvJ.jpg": {
		"type": "image/jpeg",
		"etag": "\"ffc9-QWTJij6choJCETc/NCSV+4l9pT8\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 65481,
		"path": "../public/assets/cat-eservices-CPcoYZvJ.jpg"
	},
	"/assets/cat-liability-BLAvui6n.jpg": {
		"type": "image/jpeg",
		"etag": "\"15865-SYV/opdGy+vmGxaDMkSyozL4ez8\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 88165,
		"path": "../public/assets/cat-liability-BLAvui6n.jpg"
	},
	"/assets/cat-life-VdbxVzxW.jpg": {
		"type": "image/jpeg",
		"etag": "\"198a3-nEvLx/P0N+ilZuVBdU5RwfD3uBA\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 104611,
		"path": "../public/assets/cat-life-VdbxVzxW.jpg"
	},
	"/assets/chart-column-CjAJeGC-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0-4ZD5rMIYtFJdJHT5u+ErBtI9Tio\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 240,
		"path": "../public/assets/chart-column-CjAJeGC-.js"
	},
	"/assets/cat-marine-BaATUaXG.jpg": {
		"type": "image/jpeg",
		"etag": "\"13f41-3N/fx6f0vFXHGfD5TDoel4uefPI\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 81729,
		"path": "../public/assets/cat-marine-BaATUaXG.jpg"
	},
	"/assets/cat-travel-BvXSesqx.jpg": {
		"type": "image/jpeg",
		"etag": "\"e27b-LczjhzV8uvb9DcsgsUmK+m7vntQ\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 57979,
		"path": "../public/assets/cat-travel-BvXSesqx.jpg"
	},
	"/assets/contact-zY868Acs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1244-DGbtn+JwaOU6WdCmObN4u5su7M4\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 4676,
		"path": "../public/assets/contact-zY868Acs.js"
	},
	"/assets/e-services.index-BKdtqIrr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"644-pzKR1o34KtZIwao8gFn6fiU6lpA\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 1604,
		"path": "../public/assets/e-services.index-BKdtqIrr.js"
	},
	"/assets/dashboard-DhX0KZvK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6544a-SoEiUk7pDxnMwDWM+fElM1P71aU\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 414794,
		"path": "../public/assets/dashboard-DhX0KZvK.js"
	},
	"/assets/github.functions-DySM1dRQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f-ZlJZbD4jacZ+IF1aW7PTbIg8tRE\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 79,
		"path": "../public/assets/github.functions-DySM1dRQ.js"
	},
	"/assets/insurance-content-aIhHdvg_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"766e-tslhihABZzD0QHRpGotzvnEYubQ\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 30318,
		"path": "../public/assets/insurance-content-aIhHdvg_.js"
	},
	"/assets/insurance-hubs-Bw4vXRVS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6952-UGCwUOY5kA2rDhqdntY4HQrKe3U\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 26962,
		"path": "../public/assets/insurance-hubs-Bw4vXRVS.js"
	},
	"/assets/insurance.index-C6t1LJ2a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68e-BwzhcnWYMAjeRYHM/FuVWze4JVI\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 1678,
		"path": "../public/assets/insurance.index-C6t1LJ2a.js"
	},
	"/assets/insurance.travel-DLfXie6I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35ca-7P2jZjRzRh/nJaxyzoSLtOkXk1Q\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 13770,
		"path": "../public/assets/insurance.travel-DLfXie6I.js"
	},
	"/assets/jsx-runtime-D3jfb0Ew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22c5-Qh7NbnnF5pPMnr2eoPNshytf37o\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 8901,
		"path": "../public/assets/jsx-runtime-D3jfb0Ew.js"
	},
	"/assets/login-DPYtzFJk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1498-WOdeeNA/x44H13ts8PJoVPahWa8\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 5272,
		"path": "../public/assets/login-DPYtzFJk.js"
	},
	"/assets/logofooter-BmZ5Hpz5.png": {
		"type": "image/png",
		"etag": "\"44e9-hCBTWSGXOfDrk/9JOk1VeJYRwMk\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 17641,
		"path": "../public/assets/logofooter-BmZ5Hpz5.png"
	},
	"/assets/index-J-d_6WOb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e192-XDsVuhsx3FgV+m0r5O77jPX9cug\"",
		"mtime": "2026-09-26T13:32:38.921Z",
		"size": 582034,
		"path": "../public/assets/index-J-d_6WOb.js"
	},
	"/assets/darmanet-centers-CXtV24c2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1322e9-I3qqMoNmXRp6CROcXdDaE4r2lC4\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 1254121,
		"path": "../public/assets/darmanet-centers-CXtV24c2.js"
	},
	"/assets/logoheder-DarmsdwL.png": {
		"type": "image/png",
		"etag": "\"7f555-By+2ptzOZ33KJlVavgeZNmy8Zso\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 521557,
		"path": "../public/assets/logoheder-DarmsdwL.png"
	},
	"/assets/message-square-DAqssRFx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"276-eX5nV+sUUoBvNeqKap3BRulc7iA\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 630,
		"path": "../public/assets/message-square-DAqssRFx.js"
	},
	"/assets/message-square-plus-CQro-o7U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12b-VoOB0nogJ4d4719uiEvDirvL6/I\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 299,
		"path": "../public/assets/message-square-plus-CQro-o7U.js"
	},
	"/assets/notify-CrCjM4OJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e-Bl7lzc5vKN7x2rD2Gwe/x/x2L0E\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 94,
		"path": "../public/assets/notify-CrCjM4OJ.js"
	},
	"/assets/p._slug-BXb7m8JR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bf4-GWZT5AHZETdQLBovpFSRpd2pgfs\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 7156,
		"path": "../public/assets/p._slug-BXb7m8JR.js"
	},
	"/assets/partner-code-D2o0X5vl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-IslTLzusS2KfIwmkAIHwJ/41KxA\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 313,
		"path": "../public/assets/partner-code-D2o0X5vl.js"
	},
	"/assets/partners-D0TT8D-8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d86-cDHYxVSja/D92DSDPbucmjfzGxQ\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 3462,
		"path": "../public/assets/partners-D0TT8D-8.js"
	},
	"/assets/partners.dashboard-DKNhBGPI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16b7-eFq2fR8V7YJuz80Avhax6Ad4pCs\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 5815,
		"path": "../public/assets/partners.dashboard-DKNhBGPI.js"
	},
	"/assets/partners_.apply-B6flF10L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22e8-oInAH91BP4mu0j0bjTJw49bqk98\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 8936,
		"path": "../public/assets/partners_.apply-B6flF10L.js"
	},
	"/assets/registry-D_stL01d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"346-HhlaW6iQL3t/UddAZE4VXlkw05o\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 838,
		"path": "../public/assets/registry-D_stL01d.js"
	},
	"/assets/reporting-C9udJ02i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1335-5F325WZ0WFUc466GXFLZPnTZuos\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 4917,
		"path": "../public/assets/reporting-C9udJ02i.js"
	},
	"/assets/routes-Duxj3NWe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e20e-hmI35V07akNEk6AEM+uo/xOhuto\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 57870,
		"path": "../public/assets/routes-Duxj3NWe.js"
	},
	"/assets/seo.functions-CgIZxRnv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b0-Z/WeN8bRHxYx9scuQrkATjtmeK0\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 176,
		"path": "../public/assets/seo.functions-CgIZxRnv.js"
	},
	"/assets/site-config-CExYtiiz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37117-KWnx+y/YNw/r1KUnCjhQ7kjMPyo\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 225559,
		"path": "../public/assets/site-config-CExYtiiz.js"
	},
	"/assets/sparkles-Bm08E4As.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"345-jGQVNBuj0Du1ggJ6pGf96r0ZtQU\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 837,
		"path": "../public/assets/sparkles-Bm08E4As.js"
	},
	"/assets/suggestions-CtXyDdDw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1116-uxjExERSOjfHy0n0sz3JI/7Fl8g\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 4374,
		"path": "../public/assets/suggestions-CtXyDdDw.js"
	},
	"/assets/third-party-DRxvJlHG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a1a-lsq6+wUW1Htc4lmeoP6g9KVEHFQ\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 27162,
		"path": "../public/assets/third-party-DRxvJlHG.js"
	},
	"/assets/users-BXXFL1s5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127-ZgCtMUhkfOLRGmnrw3HZZ86QFtk\"",
		"mtime": "2026-09-26T13:32:38.923Z",
		"size": 295,
		"path": "../public/assets/users-BXXFL1s5.js"
	},
	"/assets/styles-BynKHV_F.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"22669-6KMhhcENEk32c+UyS9yRX5OPb7A\"",
		"mtime": "2026-09-26T13:32:38.925Z",
		"size": 140905,
		"path": "../public/assets/styles-BynKHV_F.css"
	},
	"/css/jalalidatepicker.min.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1f2c-eMdh6A+WmEUmIDybUBGdfPhB5Rw\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 7980,
		"path": "../public/css/jalalidatepicker.min.css"
	},
	"/data/iran-cities.json": {
		"type": "application/json",
		"etag": "\"4802-8gthkADWIbrHy0DyrcNxtdm6y30\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 18434,
		"path": "../public/data/iran-cities.json"
	},
	"/insurance/index.html": {
		"type": "text/html; charset=utf-8",
		"etag": "\"3afc-jeox7p4JzpgzVFdyNe46qQgtVZU\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 15100,
		"path": "../public/insurance/index.html"
	},
	"/insurance/logo (1).png": {
		"type": "image/png",
		"etag": "\"28f9-NDok16/p0oWp5wmD4Ec3wdB9//o\"",
		"mtime": "2026-09-26T13:32:40.839Z",
		"size": 10489,
		"path": "../public/insurance/logo (1).png"
	},
	"/insurance2/index.html": {
		"type": "text/html; charset=utf-8",
		"etag": "\"3afc-jeox7p4JzpgzVFdyNe46qQgtVZU\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 15100,
		"path": "../public/insurance2/index.html"
	},
	"/insurance2/logo (1).png": {
		"type": "image/png",
		"etag": "\"28f9-NDok16/p0oWp5wmD4Ec3wdB9//o\"",
		"mtime": "2026-09-26T13:32:40.839Z",
		"size": 10489,
		"path": "../public/insurance2/logo (1).png"
	},
	"/fonts/AnjomanMaxFN-BlackIt.woff2": {
		"type": "font/woff2",
		"etag": "\"9314-kz/N0qN646SPVPIKEc9tQhlbwVA\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 37652,
		"path": "../public/fonts/AnjomanMaxFN-BlackIt.woff2"
	},
	"/fonts/AnjomanMaxFN-BoldIt.woff2": {
		"type": "font/woff2",
		"etag": "\"9674-KsXsoq82vdUFXd4D6cE4QuVEDog\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 38516,
		"path": "../public/fonts/AnjomanMaxFN-BoldIt.woff2"
	},
	"/fonts/AnjomanMaxFN-Bold.woff2": {
		"type": "font/woff2",
		"etag": "\"8f50-A/ekn+iU/PB6ywmg5yv7cHw/zrY\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 36688,
		"path": "../public/fonts/AnjomanMaxFN-Bold.woff2"
	},
	"/fonts/AnjomanMaxFN-LightIt.woff2": {
		"type": "font/woff2",
		"etag": "\"94ac-hnmBj+oFPEzJhXIJn8wzURyAK44\"",
		"mtime": "2026-09-26T13:32:40.836Z",
		"size": 38060,
		"path": "../public/fonts/AnjomanMaxFN-LightIt.woff2"
	},
	"/fonts/AnjomanMaxFN-Medium.woff2": {
		"type": "font/woff2",
		"etag": "\"8d34-vZmPSAVU1SUmjU+9Q/vIgbiFUR0\"",
		"mtime": "2026-09-26T13:32:40.836Z",
		"size": 36148,
		"path": "../public/fonts/AnjomanMaxFN-Medium.woff2"
	},
	"/fonts/AnjomanMaxFN-Light.woff2": {
		"type": "font/woff2",
		"etag": "\"8d84-Snt4O5ZZOard5NClwKvh/ClgKpA\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 36228,
		"path": "../public/fonts/AnjomanMaxFN-Light.woff2"
	},
	"/fonts/AnjomanMaxFN-MediumIt.woff2": {
		"type": "font/woff2",
		"etag": "\"94ec-bW6ZEm/PbFt0TiVgXzNrFDnBkRY\"",
		"mtime": "2026-09-26T13:32:40.836Z",
		"size": 38124,
		"path": "../public/fonts/AnjomanMaxFN-MediumIt.woff2"
	},
	"/fonts/AnjomanMaxFN-Regular.woff2": {
		"type": "font/woff2",
		"etag": "\"8dd8-x9EjhluFIJ8z6YTL5oKMC0fmFfs\"",
		"mtime": "2026-09-26T13:32:40.838Z",
		"size": 36312,
		"path": "../public/fonts/AnjomanMaxFN-Regular.woff2"
	},
	"/fonts/AnjomanMaxFN-Black.woff2": {
		"type": "font/woff2",
		"etag": "\"8b54-D8BAnVr2rT2oGzsfpnnttgITc28\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 35668,
		"path": "../public/fonts/AnjomanMaxFN-Black.woff2"
	},
	"/fonts/AnjomanMaxFN-SemiBoldIt.woff2": {
		"type": "font/woff2",
		"etag": "\"967c-qe8qLG6vLsMn0PFL3KzKNb85uks\"",
		"mtime": "2026-09-26T13:32:40.839Z",
		"size": 38524,
		"path": "../public/fonts/AnjomanMaxFN-SemiBoldIt.woff2"
	},
	"/js/jalalidatepicker.min.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4bf9-GUV0mpxZd+iv7g/oDeWi2UF7rqQ\"",
		"mtime": "2026-09-26T13:32:40.833Z",
		"size": 19449,
		"path": "../public/js/jalalidatepicker.min.js"
	},
	"/fonts/yekan/IRANYekanX-Black.woff2": {
		"type": "font/woff2",
		"etag": "\"66ac-I6H7vT+3mGyJcLWcnOfgcI4uxzc\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 26284,
		"path": "../public/fonts/yekan/IRANYekanX-Black.woff2"
	},
	"/fonts/yekan/IRANYekanX-Bold.woff2": {
		"type": "font/woff2",
		"etag": "\"7094-Z0Q2nz9IXQldaAq3Bf7LScEkq/w\"",
		"mtime": "2026-09-26T13:32:40.843Z",
		"size": 28820,
		"path": "../public/fonts/yekan/IRANYekanX-Bold.woff2"
	},
	"/fonts/yekan/IRANYekanX-DemiBold.woff2": {
		"type": "font/woff2",
		"etag": "\"7048-tNQJdwY7xDiaGWV/KsXmKZU2o4A\"",
		"mtime": "2026-09-26T13:32:40.843Z",
		"size": 28744,
		"path": "../public/fonts/yekan/IRANYekanX-DemiBold.woff2"
	},
	"/fonts/yekan/IRANYekanX-ExtraBlack.woff2": {
		"type": "font/woff2",
		"etag": "\"6cf8-aRzvPlgUT12kVFYJC1zQpI7mc8c\"",
		"mtime": "2026-09-26T13:32:40.843Z",
		"size": 27896,
		"path": "../public/fonts/yekan/IRANYekanX-ExtraBlack.woff2"
	},
	"/fonts/yekan/IRANYekanX-ExtraBold.woff2": {
		"type": "font/woff2",
		"etag": "\"7018-drhBzE+EYvY+ODDLTIrd8eHsjwQ\"",
		"mtime": "2026-09-26T13:32:40.843Z",
		"size": 28696,
		"path": "../public/fonts/yekan/IRANYekanX-ExtraBold.woff2"
	},
	"/fonts/yekan/IRANYekanX-Heavy.woff2": {
		"type": "font/woff2",
		"etag": "\"6780-APEMNeGeMG82bdpcXxmwQsia/IE\"",
		"mtime": "2026-09-26T13:32:40.843Z",
		"size": 26496,
		"path": "../public/fonts/yekan/IRANYekanX-Heavy.woff2"
	},
	"/fonts/yekan/IRANYekanX-Light.woff2": {
		"type": "font/woff2",
		"etag": "\"6e18-fca8ik6bYdG2LGZs/4s+/dPnRAg\"",
		"mtime": "2026-09-26T13:32:40.848Z",
		"size": 28184,
		"path": "../public/fonts/yekan/IRANYekanX-Light.woff2"
	},
	"/fonts/yekan/IRANYekanX-Medium.woff2": {
		"type": "font/woff2",
		"etag": "\"7030-C36UlRE5Ojx98glf0uTbzkJt3pU\"",
		"mtime": "2026-09-26T13:32:40.848Z",
		"size": 28720,
		"path": "../public/fonts/yekan/IRANYekanX-Medium.woff2"
	},
	"/fonts/yekan/IRANYekanX-Regular.woff2": {
		"type": "font/woff2",
		"etag": "\"66b4-mNMU3u4FSgXZGKqum2PSyIZPZdE\"",
		"mtime": "2026-09-26T13:32:40.849Z",
		"size": 26292,
		"path": "../public/fonts/yekan/IRANYekanX-Regular.woff2"
	},
	"/fonts/yekan/IRANYekanX-Thin.woff2": {
		"type": "font/woff2",
		"etag": "\"64e0-/5+nMnrHpt+/CdYRk9SleegfcV4\"",
		"mtime": "2026-09-26T13:32:40.849Z",
		"size": 25824,
		"path": "../public/fonts/yekan/IRANYekanX-Thin.woff2"
	},
	"/fonts/AnjomanMaxFN-It.woff2": {
		"type": "font/woff2",
		"etag": "\"94ec-w+mF9SVZyf3YvyI/sWTXDeN8qGE\"",
		"mtime": "2026-09-26T13:32:40.834Z",
		"size": 38124,
		"path": "../public/fonts/AnjomanMaxFN-It.woff2"
	},
	"/fonts/AnjomanMaxFN-SemiBold.woff2": {
		"type": "font/woff2",
		"etag": "\"8ec4-yZOpis83h1OmXhB0EKbLxxieUF4\"",
		"mtime": "2026-09-26T13:32:40.838Z",
		"size": 36548,
		"path": "../public/fonts/AnjomanMaxFN-SemiBold.woff2"
	},
	"/fonts/yekan/IRANYekanX-UltraLight.woff2": {
		"type": "font/woff2",
		"etag": "\"6d70-rhu22KrUD35dPdUvFe2FNX4sU7M\"",
		"mtime": "2026-09-26T13:32:40.852Z",
		"size": 28016,
		"path": "../public/fonts/yekan/IRANYekanX-UltraLight.woff2"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_0k9ZE7 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_0k9ZE7
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
