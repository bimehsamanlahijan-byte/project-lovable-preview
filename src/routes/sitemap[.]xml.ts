import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { normalizeBase } from "@/lib/seo-config";
import { originFromRequest, readSeoConfig } from "@/lib/seo.server";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const seo = await readSeoConfig();
        const base = normalizeBase(seo.siteUrl) || originFromRequest(request);

        const urls = seo.pages
          .filter((e) => e.inSitemap !== false)
          .map((e) =>
            [
              "  <url>",
              `    <loc>${base}${e.path === "/" ? "/" : e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
          );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
