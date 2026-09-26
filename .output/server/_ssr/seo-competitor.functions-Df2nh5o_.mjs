import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo-competitor.functions-Df2nh5o_.js
/**
* Dashboard-only server functions for the SEO competitor analyzer and the
* Page Builder's AI extraction. All of them require an unlocked dashboard
* session, because they spend AI credits and fetch remote pages.
*/
var aiExtractPageBlocks_createServerFn_handler = createServerRpc({
	id: "0aad7e8ca5f443bbaa9fa7fd8bc57195b89d4c5ef0972b568a8dcf09cb8e9e23",
	name: "aiExtractPageBlocks",
	filename: "src/lib/seo-competitor.functions.ts"
}, (opts) => aiExtractPageBlocks.__executeServer(opts));
var aiExtractPageBlocks = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(aiExtractPageBlocks_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { aiExtractPage } = await import("./ai-blocks.server-Dz_eENGG.mjs");
	return await aiExtractPage(data);
});
var competitorTopPages_createServerFn_handler = createServerRpc({
	id: "96fbf1299891f04c4c0c5b6c275f0c5868c0efc56dd0f3741b44017f33efbc59",
	name: "competitorTopPages",
	filename: "src/lib/seo-competitor.functions.ts"
}, (opts) => competitorTopPages.__executeServer(opts));
var competitorTopPages = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(competitorTopPages_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { discoverTopPages } = await import("./seo-competitor.server-Dk9mAwhP.mjs");
	return {
		ok: true,
		pages: await discoverTopPages(data.url, 15)
	};
});
var analyzeCompetitorSite_createServerFn_handler = createServerRpc({
	id: "5bf025fcb7dd01e6dbcb588c89e3ef5d8ca65c7f121d55b77297756421637d40",
	name: "analyzeCompetitorSite",
	filename: "src/lib/seo-competitor.functions.ts"
}, (opts) => analyzeCompetitorSite.__executeServer(opts));
var analyzeCompetitorSite = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(analyzeCompetitorSite_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { analyzeCompetitor } = await import("./seo-competitor.server-Dk9mAwhP.mjs");
	return await analyzeCompetitor(data);
});
var scanSiteSeo_createServerFn_handler = createServerRpc({
	id: "07ea5359fe57739f5f2971ada9db8dc42e8459bc3a74abe90382ac9750afd057",
	name: "scanSiteSeo",
	filename: "src/lib/seo-competitor.functions.ts"
}, (opts) => scanSiteSeo.__executeServer(opts));
var scanSiteSeo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(scanSiteSeo_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { scanMySite } = await import("./seo-competitor.server-Dk9mAwhP.mjs");
	return await scanMySite(data);
});
var aiRewritePage_createServerFn_handler = createServerRpc({
	id: "f1cfd3c6e541049fd195f096380d755ae3f8cf16765a085a87c13a57effe29de",
	name: "aiRewritePage",
	filename: "src/lib/seo-competitor.functions.ts"
}, (opts) => aiRewritePage.__executeServer(opts));
var aiRewritePage = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(aiRewritePage_createServerFn_handler, async ({ data }) => {
	const { requireUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	await requireUnlocked();
	const { aiRewritePageForSeo } = await import("./seo-competitor.server-Dk9mAwhP.mjs");
	return await aiRewritePageForSeo(data);
});
//#endregion
export { aiExtractPageBlocks_createServerFn_handler, aiRewritePage_createServerFn_handler, analyzeCompetitorSite_createServerFn_handler, competitorTopPages_createServerFn_handler, scanSiteSeo_createServerFn_handler };
