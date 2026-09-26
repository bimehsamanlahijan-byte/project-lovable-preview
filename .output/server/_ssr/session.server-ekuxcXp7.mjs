import { i as useSession$1 } from "./request-response-DrMnHfig.mjs";
import { r as getSessionSecret, s as loadRuntimeEnv } from "./server-env-CcxwNfrB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session.server-ekuxcXp7.js
/** Secure, server-side session for site visitors (separate from the admin gate). */
function config(password) {
	return {
		password,
		name: "saman-user",
		maxAge: 2592e3,
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/"
		}
	};
}
async function getUserSession() {
	await loadRuntimeEnv();
	const secret = getSessionSecret();
	if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_MISSING");
	return useSession$1(config(secret));
}
/** Returns the signed-in user id, or null. Never throws. */
async function currentUserId() {
	try {
		return (await getUserSession()).data.userId ?? null;
	} catch {
		return null;
	}
}
async function signIn(userId, provider) {
	await (await getUserSession()).update({
		userId,
		provider,
		oauthState: void 0
	});
}
async function signOut() {
	try {
		await (await getUserSession()).clear();
	} catch {}
}
//#endregion
export { currentUserId, getUserSession, signIn, signOut };
