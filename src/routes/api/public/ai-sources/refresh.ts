import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled refresh of the assistant's official knowledge sources.
 * Protected by a bearer secret so only the agency's own scheduler can call it.
 * Configure AI_SOURCES_CRON_SECRET (or LOVABLE_CRON_SECRET) and point a cron job here.
 */
export const Route = createFileRoute("/api/public/ai-sources/refresh")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { envValueAsync } = await import("@/lib/server-env");
        const secret = await envValueAsync("AI_SOURCES_CRON_SECRET", "LOVABLE_CRON_SECRET");
        if (!secret) return new Response("Scheduler not configured", { status: 503 });

        const provided = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1] ?? "";
        const { createHash, timingSafeEqual } = await import("node:crypto");
        const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();
        if (!provided || !timingSafeEqual(digest(provided), digest(secret))) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { syncDueSources } = await import("@/lib/ai-sources.server");
        try {
          const out = await syncDueSources(4);
          return Response.json({ ok: true, ...out });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "refresh_failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
