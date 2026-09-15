import { createFileRoute } from "@tanstack/react-router";

/** Read-only lookup proxy: /api/third-party/lookups/<name> → SI24 lookups. */
export const Route = createFileRoute("/api/third-party/lookups/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { si24Request } = await import("@/lib/third-party/si24.server");
        const splat = (params as { _splat?: string })._splat ?? "";
        const search = new URL(request.url).search;

        const allow: Record<string, string> = {
          carGroups: "/api/Lookups/carGroups",
          carUsages: "/api/Lookups/carUsages",
          "vehicle-brands": "/api/Lookups/vehicle-brands",
          carFuelType: "/api/Lookups/carFuelType",
          insuranceCompanies: "/api/Lookups/insuranceCompanies",
          "financial-coverages": "/api/Lookups/financial-coverages",
        };

        let path: string | undefined = allow[splat];

        const kinds = /^carBrand\/([^/]+)\/kinds$/.exec(splat);
        if (kinds) path = `/api/Lookups/carBrand/${encodeURIComponent(kinds[1]!)}/kinds`;

        const address = /^address\/(\d{10})$/.exec(splat);
        if (address) path = `/api/address/${address[1]}`;

        if (!path) {
          return Response.json({ ok: false, error: "unknown_lookup" }, { status: 404 });
        }

        const result = await si24Request(`${path}${search}`);
        return Response.json(
          result.ok
            ? { ok: true, data: result.data }
            : { ok: false, error: result.error, message: result.message },
          { status: result.ok ? 200 : result.status || 502 },
        );
      },
    },
  },
});
