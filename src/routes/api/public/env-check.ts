import { createFileRoute } from "@tanstack/react-router";
import {
  loadRuntimeEnv,
  getSupabaseUrl,
  getSupabasePublishableKey,
  getSupabaseServiceKey,
  getSessionSecret,
} from "@/lib/server-env";

/**
 * Non-sensitive health check for the dashboard runtime configuration.
 *
 * Reports only whether each value is present (plus the project ref parsed out
 * of the Supabase URL, which is public). No key material is ever returned.
 */
export const Route = createFileRoute("/api/public/env-check")({
  server: {
    handlers: {
      GET: async () => {
        await loadRuntimeEnv();

        const url = getSupabaseUrl();
        const publishable = getSupabasePublishableKey();
        const service = getSupabaseServiceKey();
        const session = getSessionSecret();

        const projectRef = url ? (url.match(/https?:\/\/([^.]+)\./)?.[1] ?? null) : null;

        // Which project does the service key belong to? (ref only, never the key)
        let serviceKeyRef: string | null = null;
        if (service?.startsWith("eyJ")) {
          try {
            const part = service.split(".")[1];
            if (part) {
              const json = JSON.parse(
                atob(part.replace(/-/g, "+").replace(/_/g, "/")),
              ) as { ref?: string };
              serviceKeyRef = json.ref ?? null;
            }
          } catch {
            serviceKeyRef = null;
          }
        }



        // Live probe: can the service key actually read a dashboard table?
        let dbProbe: { status: number | null; message: string | null } = {
          status: null,
          message: null,
        };
        if (url && service) {
          try {
            const r = await fetch(`${url}/rest/v1/site_settings?select=key&limit=1`, {
              headers: { apikey: service, Authorization: `Bearer ${service}` },
            });
            const text = await r.text();
            dbProbe = {
              status: r.status,
              message: r.ok ? null : text.slice(0, 120),
            };
          } catch (e) {
            dbProbe = { status: null, message: e instanceof Error ? e.message : "fetch failed" };
          }
        }

        return Response.json(
          {
            supabaseUrl: url ?? null,
            projectRef,
            hasPublishableKey: Boolean(publishable),
            hasServiceKey: Boolean(service),
            hasSessionSecret: Boolean(session),
            sessionSecretLongEnough: (session?.length ?? 0) >= 32,
            serviceKeyRef,
            canWrite: Boolean(url && service && (session?.length ?? 0) >= 32),
            dbProbe,
          },
          { headers: { "cache-control": "no-store" } },
        );

      },
    },
  },
});
