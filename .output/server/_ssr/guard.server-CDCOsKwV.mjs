import { currentUserId } from "./session.server-ekuxcXp7.mjs";
import { getPublicUser, logLogin, readRequirement } from "./store.server-DTpY_R4D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guard.server-CDCOsKwV.js
/** Server-side enforcement of the central login requirements. */
/**
* Checks a module against the central login settings. Frontend guards are only
* for comfort — every API that protects a module calls this.
*/
async function checkModuleAccess(moduleKey, req) {
	const requirement = await readRequirement(moduleKey);
	const userId = await currentUserId();
	const user = userId ? await getPublicUser(userId) : null;
	if (requirement.mode === "required" && !user) {
		await logLogin({
			method: "guard",
			module: moduleKey,
			status: "denied",
			ip: req?.headers.get("cf-connecting-ip") ?? req?.headers.get("x-forwarded-for") ?? null,
			userAgent: req?.headers.get("user-agent") ?? null
		});
		return {
			ok: false,
			status: 401,
			error: "برای استفاده از این بخش ابتدا باید وارد شوید.",
			loginUrl: `/login?module=${encodeURIComponent(moduleKey)}`
		};
	}
	return {
		ok: true,
		user,
		mode: requirement.mode
	};
}
/** Convenience wrapper for API routes: returns a Response when access is denied. */
async function denyIfLoginRequired(moduleKey, req) {
	const res = await checkModuleAccess(moduleKey, req);
	if (res.ok) return null;
	return Response.json({
		error: res.error,
		loginRequired: true,
		loginUrl: res.loginUrl
	}, { status: res.status });
}
//#endregion
export { checkModuleAccess, denyIfLoginRequired };
