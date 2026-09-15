import { createFileRoute } from "@tanstack/react-router";

/** Starts an inquiry on SI24 and stores the customer + inquiry locally. */
export const Route = createFileRoute("/api/third-party/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { si24Request } = await import("@/lib/third-party/si24.server");
        const { upsertCustomer, createAttempt, updateAttempt, newReferenceCode } = await import(
          "@/lib/third-party/store.server"
        );

        let body: any;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, message: "درخواست نامعتبر است." }, { status: 400 });
        }

        const plaque = body?.plaque;
        const owner = body?.owner;
        const valid =
          plaque &&
          owner &&
          plaque.letter &&
          Number.isFinite(Number(plaque.region)) &&
          Number.isFinite(Number(plaque.segment1)) &&
          Number.isFinite(Number(plaque.segment2)) &&
          /^\d{10}$/.test(String(owner.nationalCode ?? "")) &&
          /^\d{10}$/.test(String(owner.postalCode ?? "")) &&
          /^09\d{9}$/.test(String(owner.mobile ?? "")) &&
          typeof owner.birthDate === "string" &&
          owner.birthDate.length > 0;

        if (!valid) {
          return Response.json(
            { ok: false, error: "validation_error", message: "اطلاعات پلاک یا مالک کامل نیست." },
            { status: 400 },
          );
        }

        const payload = {
          plaque: {
            region: Number(plaque.region),
            letter: String(plaque.letter),
            segment1: Number(plaque.segment1),
            segment2: Number(plaque.segment2),
          },
          owner: {
            nationalCode: String(owner.nationalCode),
            birthDate: String(owner.birthDate),
            mobile: String(owner.mobile),
            postalCode: String(owner.postalCode),
          },
        };

        // Every attempt is recorded first, so incomplete or failed purchases
        // still show up in the dashboard with their own reference id.
        const customerId = await upsertCustomer({
          nationalCode: payload.owner.nationalCode,
          mobile: payload.owner.mobile,
          birthDate: payload.owner.birthDate,
          postalCode: payload.owner.postalCode,
        });
        const referenceCode = newReferenceCode();
        const inquiryId = await createAttempt({
          customerId,
          referenceCode,
          requestPayload: payload,
        });

        const result = await si24Request<any>("/api/insurance-requests/start", {
          method: "POST",
          body: payload,
        });

        if (!result.ok) {
          await updateAttempt(referenceCode, {
            status: "start_failed",
            error_message: result.message ?? result.error ?? "unknown_error",
          });
          return Response.json(
            { ok: false, error: result.error, message: result.message, referenceCode },
            { status: result.status || 502 },
          );
        }

        const trackingCode: string | undefined =
          result.data?.trackingCode ?? result.data?.data?.trackingCode;
        if (!trackingCode) {
          console.error("[third-party] start returned no tracking code", result.data);
          await updateAttempt(referenceCode, {
            status: "start_failed",
            error_message: "no_tracking_code",
          });
          return Response.json(
            { ok: false, message: "پاسخ سامانه استعلام معتبر نبود. دوباره تلاش کنید.", referenceCode },
            { status: 502 },
          );
        }

        await updateAttempt(referenceCode, {
          status: "started",
          tracking_code: trackingCode,
          si24_tracking_code: trackingCode,
          error_message: null,
        });

        return Response.json({ ok: true, trackingCode, referenceCode, customerId, inquiryId });
      },
    },
  },
});
