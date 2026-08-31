import { createFileRoute } from "@tanstack/react-router";

/** Password-gated upload endpoint for site assets (logos, icons, images). */
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { isUnlocked } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const form = await request.formData();
        const file = form.get("file");
        const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9/_-]/gi, "");
        if (!(file instanceof File)) return new Response("No file", { status: 400 });
        const maxBytes = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 16 * 1024 * 1024;
        if (file.size > maxBytes) return new Response("File too large", { status: 413 });

        const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().slice(0, 8);
        const path = `${folder || "misc"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage
          .from("site-assets")
          .upload(path, await file.arrayBuffer(), {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (error) return Response.json({ error: error.message }, { status: 500 });

        return Response.json({ path, url: `/api/public/asset/${path}` });
      },
    },
  },
});
