/**
 * Compatibility proxy for overlay iframes.
 *
 * Many external sites refuse to be framed (X-Frame-Options / CSP
 * frame-ancestors) or block non-browser clients. This route fetches the page
 * server-side with browser-like headers, strips the framing restrictions and
 * injects a <base> tag so relative assets keep working.
 *
 * Read-only: only GET, only http(s), no cookies forwarded.
 */
import { createFileRoute } from "@tanstack/react-router";

const BROWSER_HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
  "upgrade-insecure-requests": "1",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
};

function injectBase(html: string, url: string): string {
  const baseTag = `<base href="${url}">`;
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`);
  return `${baseTag}${html}`;
}

export const Route = createFileRoute("/api/public/embed")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const target = new URL(request.url).searchParams.get("url");
        if (!target) return new Response("missing url", { status: 400 });

        let parsed: URL;
        try {
          parsed = new URL(target);
        } catch {
          return new Response("invalid url", { status: 400 });
        }
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return new Response("unsupported protocol", { status: 400 });
        }

        let upstream: Response;
        try {
          upstream = await fetch(parsed.toString(), {
            headers: { ...BROWSER_HEADERS, referer: parsed.origin + "/" },
            redirect: "follow",
          });
        } catch {
          return new Response(
            `<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;padding:16px;direction:rtl">دسترسی به این آدرس ممکن نشد.</body>`,
            { status: 502, headers: { "content-type": "text/html; charset=utf-8" } },
          );
        }

        const type = upstream.headers.get("content-type") ?? "application/octet-stream";
        const headers = new Headers({
          "content-type": type,
          "cache-control": "public, max-age=60",
          "x-robots-tag": "noindex",
        });

        if (type.includes("text/html")) {
          const html = injectBase(await upstream.text(), parsed.toString());
          return new Response(html, { status: upstream.status, headers });
        }
        return new Response(upstream.body, { status: upstream.status, headers });
      },
    },
  },
});
