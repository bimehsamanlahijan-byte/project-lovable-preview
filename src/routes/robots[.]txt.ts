import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { normalizeBase } from "@/lib/seo-config";
import { originFromRequest, readSeoConfig } from "@/lib/seo.server";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const seo = await readSeoConfig();
        const base = normalizeBase(seo.siteUrl) || originFromRequest(request);

        const body = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /dashboard",
          "",
          base ? `Sitemap: ${base}/sitemap.xml` : null,
          "",
        ]
          .filter((l) => l !== null)
          .join("\n");

        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
