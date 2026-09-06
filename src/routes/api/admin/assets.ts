import { createFileRoute } from "@tanstack/react-router";

/**
 * Safely normalizes and sanitizes asset paths to prevent directory traversal attacks.
 */
function clean(p: string): string {
  if (!p || typeof p !== "string") return "";
  // Remove null bytes and standardize backslashes to forward slashes
  const sanitized = p.replace(/\0/g, "").replace(/\\/g, "/");
  // Filter out empty parts, current directory '.' and parent directory '..'
  const parts = sanitized.split("/").filter((part) => part && part !== "." && part !== "..");
  return parts.join("/");
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
        const { getStorage } = await import("@/lib/storage.server");
        const { client, bucket: BUCKET } = await getStorage();
        const { data, error } = await client.storage.from(BUCKET).list(folder, {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) return Response.json({ error: error.message }, { status: 500 });

        const files = (data ?? [])
          .filter((e) => e.id !== null)
          .map((e) => {
            const path = clean(folder ? `${folder}/${e.name}` : e.name);
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

        const { getStorage } = await import("@/lib/storage.server");
        const { client, bucket: BUCKET } = await getStorage();
        const { error } = await client.storage.from(BUCKET).remove(paths);
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ ok: true, removed: paths.length });
      },
    },
  },
});
