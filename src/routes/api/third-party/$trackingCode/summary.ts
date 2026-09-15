import { createFileRoute } from "@tanstack/react-router";

/** Full summary of an inquiry (price, coverages) straight from the SI24 API. */
export const Route = createFileRoute("/api/third-party/$trackingCode/summary")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { si24Request } = await import("@/lib/third-party/si24.server");
        const { updateInquiry, getInquiry } = await import("@/lib/third-party/store.server");

        const trackingCode = params.trackingCode;
        if (!trackingCode) {
          return Response.json({ ok: false, message: "کد رهگیری نامعتبر است." }, { status: 400 });
        }

        const result = await si24Request<any>(
          `/api/insurance-requests/${encodeURIComponent(trackingCode)}/full-summary`,
        );

        if (!result.ok) {
          // Fall back to the last summary we stored for this inquiry.
          const saved = await getInquiry(trackingCode);
          if (saved?.full_summary) {
            return Response.json({ ok: true, data: saved.full_summary, stale: true });
          }
          return Response.json(
            { ok: false, error: result.error, message: result.message },
            { status: result.status || 502 },
          );
        }

        await updateInquiry(trackingCode, { full_summary: result.data ?? null, status: "summary" });
        return Response.json({ ok: true, data: result.data });
      },
    },
  },
});
