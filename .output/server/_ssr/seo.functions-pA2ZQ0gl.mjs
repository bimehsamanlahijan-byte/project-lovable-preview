import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as getRequest } from "./request-response-DrMnHfig.mjs";
import { r as normalizeBase } from "./seo-config-B5a56N7O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo.functions-pA2ZQ0gl.js
var getSeoConfig_createServerFn_handler = createServerRpc({
	id: "5dd234dbf199d0bf950451d8a21bfef21a7d838e655a678d66e019e355c5be5a",
	name: "getSeoConfig",
	filename: "src/lib/seo.functions.ts"
}, (opts) => getSeoConfig.__executeServer(opts));
var getSeoConfig = createServerFn({ method: "GET" }).handler(getSeoConfig_createServerFn_handler, async () => {
	const { readSeoConfig, originFromRequest } = await import("./seo.server-C8my3jo3.mjs").then((n) => n.r);
	const seo = await readSeoConfig();
	let origin = normalizeBase(seo.siteUrl);
	if (!origin) try {
		origin = originFromRequest(getRequest());
	} catch {
		origin = "";
	}
	return {
		...seo,
		origin
	};
});
//#endregion
export { getSeoConfig_createServerFn_handler };
