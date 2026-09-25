import { createServerFn } from "@tanstack/react-start";

/**
 * Public server functions for custom pages.
 *
 * These are intentionally UNAUTHENTICATED: custom pages are public content
 * (stored in site_settings which anon can SELECT), and the public `/p/<slug>`
 * route reads them at SSR time. Admin writes go through the existing
 * adminWriteSetting (auth-gated) in the dashboard pane.
 */

export const getCustomPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { readCustomPage } = await import("./custom-pages.server");
    return await readCustomPage(data.slug);
  });

export const listCustomPages = createServerFn({ method: "GET" }).handler(async () => {
  const { readCustomPages } = await import("./custom-pages.server");
  const pages = await readCustomPages();
  return Object.values(pages).map((p) => ({
    slug: p.slug,
    title: p.title,
    published: p.published,
  }));
});

/**
 * Page Builder — extract a page's main content from a URL and return it as
 * editable Blocks (strips the source site's header/footer/nav). This expensive
 * operation is restricted to an unlocked dashboard session.
 */
export const extractPageFromUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { extractFromUrl } = await import("./extract-content.server");
    return await extractFromUrl(data.url);
  });
