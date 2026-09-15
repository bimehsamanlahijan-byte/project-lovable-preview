import { createFileRoute } from "@tanstack/react-router";

/** Sends vehicle/previous-insurance/discount data and asks SI24 for the real price. */
export const Route = createFileRoute("/api/third-party/$trackingCode/calculate-price")({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const { si24Request } = await import("@/lib/third-party/si24.server");
        const { updateInquiry } = await import("@/lib/third-party/store.server");

        const trackingCode = params.trackingCode;
        if (!trackingCode) {
          return Response.json({ ok: false, message: "کد رهگیری نامعتبر است." }, { status: 400 });
        }

        let body: any = {};
        try {
          body = await request.json();
        } catch {
          body = {};
        }

        const manual = body?.manualData;
        if (manual) {
          const manualResult = await si24Request(
            `/api/insurance-requests/${encodeURIComponent(trackingCode)}/manual-data`,
            { method: "PUT", body: manual },
          );
          if (!manualResult.ok) {
            return Response.json(
              { ok: false, error: manualResult.error, message: manualResult.message },
              { status: manualResult.status || 502 },
            );
          }
          await updateInquiry(trackingCode, {
            vehicle_data: manual.vehicle ?? null,
            previous_insurance_data: manual.insuranceData ?? null,
            status: "vehicle_submitted",
          });
        }

        const result = await si24Request<any>(
          `/api/insurance-requests/${encodeURIComponent(trackingCode)}/calculate-price`,
          { method: "POST", body: body?.payload ?? {} },
        );

        if (!result.ok) {
          await updateInquiry(trackingCode, { status: "price_failed" });
          return Response.json(
            { ok: false, error: result.error, message: result.message },
            { status: result.status || 502 },
          );
        }

        await updateInquiry(trackingCode, { quote_data: result.data ?? null, status: "priced" });
        return Response.json({ ok: true, data: result.data });
      },
    },
  },
});
