import { createFileRoute } from "@tanstack/react-router";

/** Reports which AI providers have their keys configured (never returns key values). */
export const Route = createFileRoute("/api/admin/ai-providers")({
  server: {
    handlers: {
      GET: async () => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const { AI_PROVIDERS } = await import("@/lib/ai-providers");
        const { envValue, loadRuntimeEnv } = await import("@/lib/server-env");
        await loadRuntimeEnv();

        const status = AI_PROVIDERS.map((p) => ({
          id: p.id,
          hasKey: Boolean(envValue(...p.keyNames)),
          missing: [
            ...(envValue(...p.keyNames) ? [] : [p.keyNames[0]!]),
            ...(p.extraNames ?? []).filter((n) => !envValue(n)),
          ],
        }));

        return Response.json({ ok: true, status });
      },
    },
  },
});
