import { createFileRoute } from "@tanstack/react-router";

/** Public read-only proxy for files stored in the private site-assets bucket. */
export const Route = createFileRoute("/api/public/asset/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Bad path", { status: 400 });

        const { getStorage } = await import("@/lib/storage.server");
        const { client, bucket } = await getStorage();
        const { data, error } = await client.storage.from(bucket).download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            // Immutable paths (timestamped filenames) → long-lived edge + browser cache.
            "Cache-Control": "public, max-age=31536000, immutable",
            "CDN-Cache-Control": "public, max-age=31536000",
          },
        });
      },
    },
  },
});
