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

/**
 * One-click builder: fetch the raw HTML of a page so the dashboard can render
 * it in a hidden frame and run the full-copy script on it automatically.
 */
export const fetchPageHtml = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    let u: URL;
    try { u = new URL(data.url.trim()); } catch { return { ok: false as const, error: "آدرس معتبر نیست." }; }
    if (!/^https?:$/.test(u.protocol)) return { ok: false as const, error: "فقط آدرس http/https مجاز است." };
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
      return { ok: false as const, error: "این آدرس مجاز نیست." };
    }
    try {
      const res = await fetch(u.href, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8",
        },
      });
      if (!res.ok) return { ok: false as const, error: "سایت مقصد پاسخ نداد (کد " + res.status + ")." };
      const html = await res.text();
      if (html.length > 6_000_000) return { ok: false as const, error: "صفحه خیلی بزرگ است." };
      return { ok: true as const, html, finalUrl: res.url || u.href };
    } catch (e: any) {
      return { ok: false as const, error: "دریافت صفحه ممکن نشد: " + (e?.message || String(e)) };
    }
  });
