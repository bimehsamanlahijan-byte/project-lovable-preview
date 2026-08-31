import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "site-assets";

function clean(p: string) {
  return p.replace(/^\/+/, "").replace(/\.\./g, "");
}

/** Password-gated media library: list and delete files in the site-assets bucket. */
export const Route = createFileRoute("/api/admin/assets")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const url = new URL(request.url);
        const folder = clean(url.searchParams.get("folder") ?? "");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(folder, {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) return Response.json({ error: error.message }, { status: 500 });

        const files = (data ?? [])
          .filter((e) => e.id !== null)
          .map((e) => {
            const path = folder ? `${folder}/${e.name}` : e.name;
            return {
              name: e.name,
              path,
              url: `/api/public/asset/${path}`,
              size: (e.metadata as { size?: number } | null)?.size ?? null,
              mime: (e.metadata as { mimetype?: string } | null)?.mimetype ?? null,
              createdAt: e.created_at ?? null,
            };
          });
        const folders = (data ?? []).filter((e) => e.id === null).map((e) => e.name);
        return Response.json({ files, folders });
      },

      DELETE: async ({ request }) => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json().catch(() => null)) as { paths?: string[] } | null;
        const paths = (body?.paths ?? []).map(clean).filter(Boolean);
        if (!paths.length) return Response.json({ error: "No paths" }, { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ ok: true, removed: paths.length });
      },
    },
  },
});
