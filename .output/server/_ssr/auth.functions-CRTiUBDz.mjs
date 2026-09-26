import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { a as objectType, o as stringType, r as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.functions-CRTiUBDz.js
/** Client-callable server functions for the central login system. */
var authMe_createServerFn_handler = createServerRpc({
	id: "98c5bcb3b72fbe2099cc9ac391d03bc87b126212406abe7e768aefeb16f8a303",
	name: "authMe",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authMe.__executeServer(opts));
var authMe = createServerFn({ method: "GET" }).handler(authMe_createServerFn_handler, async () => {
	const { currentUserId } = await import("./session.server-ekuxcXp7.mjs");
	const { getPublicUser } = await import("./store.server-DTpY_R4D.mjs");
	const id = await currentUserId();
	if (!id) return { user: null };
	return { user: await getPublicUser(id) };
});
var authLogout_createServerFn_handler = createServerRpc({
	id: "be81e5a401961bbfe224593f60636087be35b75a6984dd9a10e238c19055ae99",
	name: "authLogout",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authLogout.__executeServer(opts));
var authLogout = createServerFn({ method: "POST" }).handler(authLogout_createServerFn_handler, async () => {
	const { signOut } = await import("./session.server-ekuxcXp7.mjs");
	await signOut();
	return { ok: true };
});
var authModuleAccess_createServerFn_handler = createServerRpc({
	id: "fdc8e3045e4193e2c6a325df5a82aaed2aeefc164a9db37d2f889812a504a773",
	name: "authModuleAccess",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authModuleAccess.__executeServer(opts));
var authModuleAccess = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ module: stringType().min(1) }).parse(d)).handler(authModuleAccess_createServerFn_handler, async ({ data }) => {
	const { checkModuleAccess } = await import("./guard.server-CDCOsKwV.mjs");
	const res = await checkModuleAccess(data.module);
	if (res.ok) return {
		allowed: true,
		mode: res.mode,
		user: res.user,
		loginUrl: null
	};
	return {
		allowed: false,
		mode: "required",
		user: null,
		loginUrl: res.loginUrl
	};
});
var authSavePhone_createServerFn_handler = createServerRpc({
	id: "c19e588b0ac9cbfa2e3bceffe02cb89dcb1c3ff8aa1d0dcd5f96fe1a2ffe21de",
	name: "authSavePhone",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authSavePhone.__executeServer(opts));
var authSavePhone = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	phone: stringType().trim().min(8).max(20),
	consent: literalType(true)
}).parse(d)).handler(authSavePhone_createServerFn_handler, async ({ data }) => {
	const { currentUserId } = await import("./session.server-ekuxcXp7.mjs");
	const { saveConsentedPhone } = await import("./store.server-DTpY_R4D.mjs");
	const id = await currentUserId();
	if (!id) return {
		ok: false,
		error: "ابتدا وارد شوید."
	};
	await saveConsentedPhone(id, data.phone);
	return {
		ok: true,
		error: null
	};
});
var authRemovePhone_createServerFn_handler = createServerRpc({
	id: "2a1e3bf2d00be27b1b6b26c582c617d51b03d5773365033a0876ff1e18c6d8de",
	name: "authRemovePhone",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authRemovePhone.__executeServer(opts));
var authRemovePhone = createServerFn({ method: "POST" }).handler(authRemovePhone_createServerFn_handler, async () => {
	const { currentUserId } = await import("./session.server-ekuxcXp7.mjs");
	const { clearPhone } = await import("./store.server-DTpY_R4D.mjs");
	const id = await currentUserId();
	if (!id) return { ok: false };
	await clearPhone(id);
	return { ok: true };
});
var authRequirements_createServerFn_handler = createServerRpc({
	id: "e2d24556c8dd51c755a580ac415b75aaee3a91ab3a066ef42a441ce213b01c70",
	name: "authRequirements",
	filename: "src/lib/auth.functions.ts"
}, (opts) => authRequirements.__executeServer(opts));
var authRequirements = createServerFn({ method: "GET" }).handler(authRequirements_createServerFn_handler, async () => {
	const { readRequirements } = await import("./store.server-DTpY_R4D.mjs");
	return { requirements: await readRequirements() };
});
//#endregion
export { authLogout_createServerFn_handler, authMe_createServerFn_handler, authModuleAccess_createServerFn_handler, authRemovePhone_createServerFn_handler, authRequirements_createServerFn_handler, authSavePhone_createServerFn_handler };
