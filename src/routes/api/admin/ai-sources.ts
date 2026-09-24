import { createFileRoute } from "@tanstack/react-router";

/** Dashboard-only management of the assistant's knowledge sources. */
export const Route = createFileRoute("/api/admin/ai-sources")({
  server: {
    handlers: {
      GET: async () => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });
        const { listSources } = await import("@/lib/ai-sources.server");
        try {
          return Response.json({ ok: true, sources: await listSources() });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "list_failed" },
            { status: 500 },
          );
        }
      },
      POST: async ({ request }) => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
        }

        const api = await import("@/lib/ai-sources.server");
        const action = String(body.action ?? "");
        const id = typeof body.id === "string" ? body.id : "";

        try {
          switch (action) {
            case "add": {
              const url = String(body.url ?? "").trim();
              if (!/^https?:\/\//i.test(url))
                return Response.json({ ok: false, error: "invalid_url" }, { status: 400 });
              const res = await api.addSource({
                title: String(body.title ?? "منبع جدید"),
                url,
                branch: typeof body.branch === "string" ? body.branch : null,
                interval_hours: Number(body.interval_hours ?? 168) || 168,
                auto_approve: body.auto_approve !== false,
              });
              return Response.json(res, { status: res.ok ? 200 : 500 });
            }
            case "update": {
              if (!id) return Response.json({ ok: false, error: "missing_id" }, { status: 400 });
              const res = await api.updateSource(id, (body.patch ?? {}) as never);
              return Response.json(res, { status: res.ok ? 200 : 500 });
            }
            case "remove": {
              if (!id) return Response.json({ ok: false, error: "missing_id" }, { status: 400 });
              const res = await api.removeSource(id);
              return Response.json(res, { status: res.ok ? 200 : 500 });
            }
            case "sync": {
              if (!id) return Response.json({ ok: false, error: "missing_id" }, { status: 400 });
              const res = await api.syncSource(id);
              return Response.json(res, { status: res.ok ? 200 : 502 });
            }
            case "syncAll": {
              const res = await api.syncAllSources();
              return Response.json({ ok: true, ...res });
            }
            default:
              return Response.json({ ok: false, error: "unknown_action" }, { status: 400 });
          }
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "request_failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
