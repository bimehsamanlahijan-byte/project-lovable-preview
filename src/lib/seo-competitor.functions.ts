import { createServerFn } from "@tanstack/react-start";

/**
 * Dashboard-only server functions for the SEO competitor analyzer and the
 * Page Builder's AI extraction. All of them require an unlocked dashboard
 * session, because they spend AI credits and fetch remote pages.
 */

export const aiExtractPageBlocks = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string; provider?: string; model?: string; instructions?: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { aiExtractPage } = await import("./ai-blocks.server");
    return await aiExtractPage(data);
  });

export const competitorTopPages = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { discoverTopPages } = await import("./seo-competitor.server");
    const pages = await discoverTopPages(data.url, 15);
    return { ok: true as const, pages };
  });

export const analyzeCompetitorSite = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      competitorUrl: string;
      myUrls: string[];
      keyword?: string;
      analyzer?: string;
      provider?: string;
      model?: string;
      extraNotes?: string;
      myAltOrigin?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { analyzeCompetitor } = await import("./seo-competitor.server");
    return await analyzeCompetitor(data);
  });

export const scanSiteSeo = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      origin: string;
      paths: string[];
      competitorUrl?: string;
      keyword?: string;
      analyzer?: string;
      provider?: string;
      model?: string;
      altOrigin?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { scanMySite } = await import("./seo-competitor.server");
    return await scanMySite(data);
  });

export const aiRewritePage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      targetUrl: string;
      competitorUrl?: string;
      keyword?: string;
      guidance?: string;
      provider?: string;
      model?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { aiRewritePageForSeo } = await import("./seo-competitor.server");
    return await aiRewritePageForSeo(data);
  });
