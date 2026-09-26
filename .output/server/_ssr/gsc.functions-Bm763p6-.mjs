import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gsc.functions-Bm763p6-.js
async function gate() {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
}
var gscStatus_createServerFn_handler = createServerRpc({
	id: "01b6dc6cb10fc413a9f507d4c659eebdc7fb7e0dd4f44f6253512530b8a329d1",
	name: "gscStatus",
	filename: "src/lib/gsc.functions.ts"
}, (opts) => gscStatus.__executeServer(opts));
var gscStatus = createServerFn({ method: "POST" }).handler(gscStatus_createServerFn_handler, async () => {
	await gate();
	const { loadServiceAccount } = await import("./gsc.server-DB1SX6P6.mjs");
	const sa = await loadServiceAccount();
	return {
		configured: Boolean(sa),
		email: sa?.client_email ?? ""
	};
});
var saveGscKey_createServerFn_handler = createServerRpc({
	id: "d575ccf66974465d962616b1e744a26b1a96f559e06b0e2f27b909ab1fcf7c0e",
	name: "saveGscKey",
	filename: "src/lib/gsc.functions.ts"
}, (opts) => saveGscKey.__executeServer(opts));
var saveGscKey = createServerFn({ method: "POST" }).inputValidator((d) => {
	const parsed = JSON.parse(d?.json || "{}");
	if (!parsed.client_email || !parsed.private_key) throw new Error("فایل JSON کلید سرویس گوگل معتبر نیست.");
	return d;
}).handler(saveGscKey_createServerFn_handler, async ({ data }) => {
	await gate();
	const { writePrivateSetting } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	const { GOOGLE_SA_SETTING } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const r = await writePrivateSetting(GOOGLE_SA_SETTING, { json: data.json });
	return {
		ok: !r.error,
		error: r.error
	};
});
var deleteGscKey_createServerFn_handler = createServerRpc({
	id: "4140ee2e486bb1ffd55f39a21832d9084983f40c6870a27b96036b353bd531c9",
	name: "deleteGscKey",
	filename: "src/lib/gsc.functions.ts"
}, (opts) => deleteGscKey.__executeServer(opts));
var deleteGscKey = createServerFn({ method: "POST" }).handler(deleteGscKey_createServerFn_handler, async () => {
	await gate();
	const { writePrivateSetting } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	const { GOOGLE_SA_SETTING } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const r = await writePrivateSetting(GOOGLE_SA_SETTING, null);
	return {
		ok: !r.error,
		error: r.error
	};
});
var gscAutoRun_createServerFn_handler = createServerRpc({
	id: "9b7a546f9e6c0c294a36ed2fb37250cfe340683eafe758f1a1754564f9d652b0",
	name: "gscAutoRun",
	filename: "src/lib/gsc.functions.ts"
}, (opts) => gscAutoRun.__executeServer(opts));
var gscAutoRun = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(gscAutoRun_createServerFn_handler, async ({ data }) => {
	await gate();
	const { loadServiceAccount, registerAndAnalyze } = await import("./gsc.server-DB1SX6P6.mjs");
	const { cleanOrigin } = await import("./seo-url-u7NDYTbH.mjs").then((n) => n.o);
	const sa = await loadServiceAccount();
	if (!sa) return {
		ok: false,
		error: "ابتدا کلید سرویس گوگل (فایل JSON) را ثبت کنید."
	};
	const reports = [];
	for (const raw of data.domains.slice(0, 2)) {
		const origin = cleanOrigin(raw);
		if (!origin) continue;
		try {
			reports.push(await registerAndAnalyze(origin, sa));
		} catch (e) {
			reports.push({
				domain: origin,
				steps: [{
					step: "اتصال به گوگل",
					ok: false,
					detail: e instanceof Error ? e.message : String(e)
				}],
				topQueries: [],
				sitemaps: []
			});
		}
	}
	const { getProvider } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
	const provider = getProvider(data.provider);
	const model = data.model || provider.models[0]?.value || "";
	const { runModel } = await import("./site-ai.server-BnKgEAdd.mjs");
	const out = await runModel([{
		role: "system",
		content: "تو متخصص سئوی فارسی هستی. گزارش سرچ کنسول دو دامنه یک نمایندگی بیمه را بررسی کن و به زبان ساده، فهرست‌وار و عملی بگو چه کارهایی انجام شود. حداکثر ۱۲ بند."
	}, {
		role: "user",
		content: JSON.stringify(reports).slice(0, 12e3)
	}], {
		provider: provider.id,
		model,
		temperature: .3
	});
	return {
		ok: true,
		reports,
		engine: `${provider.label} / ${model}`,
		advice: out.ok ? out.text : `تحلیل هوش مصنوعی انجام نشد: ${out.error}`,
		clientEmail: sa.client_email
	};
});
//#endregion
export { deleteGscKey_createServerFn_handler, gscAutoRun_createServerFn_handler, gscStatus_createServerFn_handler, saveGscKey_createServerFn_handler };
