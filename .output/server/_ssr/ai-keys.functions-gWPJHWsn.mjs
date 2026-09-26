import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-keys.functions-gWPJHWsn.js
/**
* Dashboard-only: manage AI provider keys (masked listing, save, delete, test).
* Every call requires an unlocked dashboard session.
*/
async function gate() {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
}
var listAiKeys_createServerFn_handler = createServerRpc({
	id: "403714a7e8eb5f6af1ed7898821c0c0caeab90e6065ca8447b83bd8c6e7e7292",
	name: "listAiKeys",
	filename: "src/lib/ai-keys.functions.ts"
}, (opts) => listAiKeys.__executeServer(opts));
var listAiKeys = createServerFn({ method: "POST" }).handler(listAiKeys_createServerFn_handler, async () => {
	await gate();
	const { readAllKeys, mask } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const { AI_PROVIDERS } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
	const { envValue, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	await loadRuntimeEnv();
	const stored = await readAllKeys(true);
	return AI_PROVIDERS.map((p) => ({
		id: p.id,
		stored: Boolean(stored[p.id]?.key),
		masked: mask(stored[p.id]?.key),
		extraMasked: stored[p.id]?.extra ? mask(stored[p.id]?.extra) : "",
		updatedAt: stored[p.id]?.updatedAt ?? "",
		inEnv: Boolean(envValue(...p.keyNames))
	}));
});
var saveAiKey_createServerFn_handler = createServerRpc({
	id: "238e5c93e0dc348e4f9a2b1ba675696892783ebf5b792e56af34753beb4f158d",
	name: "saveAiKey",
	filename: "src/lib/ai-keys.functions.ts"
}, (opts) => saveAiKey.__executeServer(opts));
var saveAiKey = createServerFn({ method: "POST" }).inputValidator((d) => {
	if (!d?.provider || typeof d.key !== "string" || d.key.trim().length < 8 || d.key.length > 4e3) throw new Error("کلید معتبر نیست.");
	return d;
}).handler(saveAiKey_createServerFn_handler, async ({ data }) => {
	await gate();
	const { saveProviderKey } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const r = await saveProviderKey(data.provider, data.key, data.extra);
	return {
		ok: !r.error,
		error: r.error
	};
});
var deleteAiKey_createServerFn_handler = createServerRpc({
	id: "c226965fae99a379e11c7d23f2c18199ab7d2ede26a80b42ebde00c2a3e9868f",
	name: "deleteAiKey",
	filename: "src/lib/ai-keys.functions.ts"
}, (opts) => deleteAiKey.__executeServer(opts));
var deleteAiKey = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(deleteAiKey_createServerFn_handler, async ({ data }) => {
	await gate();
	const { deleteProviderKey } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const r = await deleteProviderKey(data.provider);
	return {
		ok: !r.error,
		error: r.error
	};
});
var testAiKey_createServerFn_handler = createServerRpc({
	id: "e963acd95e03f9328d6b2f0ed5cf1f0bc6a1668e6117df8e690040190db897d5",
	name: "testAiKey",
	filename: "src/lib/ai-keys.functions.ts"
}, (opts) => testAiKey.__executeServer(opts));
var testAiKey = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(testAiKey_createServerFn_handler, async ({ data }) => {
	await gate();
	const { getProvider } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
	const { runModel } = await import("./site-ai.server-BnKgEAdd.mjs");
	const p = getProvider(data.provider);
	const model = data.model || p.models[0]?.value || "";
	const started = Date.now();
	const out = await runModel([{
		role: "user",
		content: "فقط بنویس: سلام"
	}], {
		provider: p.id,
		model
	});
	const ms = Date.now() - started;
	if (!out.ok) {
		const err = String(out.error);
		return {
			ok: false,
			error: err.startsWith("missing_key") ? "کلیدی برای این موتور ثبت نشده است." : /401|403|invalid|unauthor/i.test(err) ? "کلید اشتباه است یا دسترسی ندارد." : /429/.test(err) ? "سهمیه این کلید تمام شده است (۴۲۹)." : err.slice(0, 300),
			model,
			ms
		};
	}
	return {
		ok: true,
		reply: out.text.slice(0, 120),
		model,
		ms
	};
});
//#endregion
export { deleteAiKey_createServerFn_handler, listAiKeys_createServerFn_handler, saveAiKey_createServerFn_handler, testAiKey_createServerFn_handler };
