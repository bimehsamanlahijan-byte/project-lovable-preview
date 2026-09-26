import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/github.functions-__tsr-J2.js
var githubCheckAccount_createServerFn_handler = createServerRpc({
	id: "d030c2e0bafea736828049dd0284dbd430ffab2130dac89c587382df40a5e881",
	name: "githubCheckAccount",
	filename: "src/lib/github.functions.ts"
}, (opts) => githubCheckAccount.__executeServer(opts));
var githubCheckAccount = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(githubCheckAccount_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { githubWhoAmI } = await import("./github.server-DRD1zCFt.mjs");
	try {
		const me = await githubWhoAmI(data.secretName || "GITHUB_API_KEY");
		return {
			ok: true,
			login: me.login,
			name: me.name
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		};
	}
});
var githubPublishSnapshot_createServerFn_handler = createServerRpc({
	id: "2c93638c92e48561626500d885a7eacee0909bed2f9bfe2df541ab75689a08d1",
	name: "githubPublishSnapshot",
	filename: "src/lib/github.functions.ts"
}, (opts) => githubPublishSnapshot.__executeServer(opts));
var githubPublishSnapshot = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(githubPublishSnapshot_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked, runAdminOp } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { githubCommitFile } = await import("./github.server-DRD1zCFt.mjs");
	const settings = await runAdminOp({
		table: "site_settings",
		action: "select",
		select: "key, value, updated_at"
	});
	const snapshot = JSON.stringify({
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		note: data.note ?? "",
		settings: settings.data
	}, null, 2);
	try {
		return {
			ok: true,
			...await githubCommitFile({
				secretName: data.secretName || "GITHUB_API_KEY",
				owner: data.owner,
				repo: data.repo,
				branch: data.branch || "main",
				path: data.path || "lovable/site-content.json",
				content: snapshot,
				message: data.note?.trim() || "به‌روزرسانی محتوای سایت از پیشخوان"
			})
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		};
	}
});
//#endregion
export { githubCheckAccount_createServerFn_handler, githubPublishSnapshot_createServerFn_handler };
