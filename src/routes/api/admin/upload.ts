import { createFileRoute } from "@tanstack/react-router";

/** Password-gated upload endpoint for site assets (logos, icons, images, videos). */
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { isUnlocked } = await import("@/lib/dashboard-auth.server");
          if (!(await isUnlocked()))
            return Response.json({ error: "نشست مدیریت منقضی شده است؛ دوباره وارد شوید." }, { status: 401 });

          const { readStorageTarget } = await import("@/lib/storage.server");
          const override = await readStorageTarget();
          const hasOverride = Boolean(override?.url && override?.serviceKey);
          const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("@/lib/server-env");
          await loadRuntimeEnv();
          if (!hasOverride && (!getSupabaseUrl() || !getSupabaseServiceKey())) {
            return Response.json(
              {
                error:
                  "کلید سرور بک‌اند (SUPABASE_SERVICE_ROLE_KEY) در محیط اجرا تنظیم نشده است؛ آپلود ممکن نیست.",
              },
              { status: 503 },
            );
          }

          const form = await request.formData();
          const file = form.get("file");
          const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9/_-]/gi, "");
          if (!(file instanceof File)) return Response.json({ error: "فایلی ارسال نشد." }, { status: 400 });
          const maxBytes = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 16 * 1024 * 1024;
          if (file.size > maxBytes) return Response.json({ error: "حجم فایل بیش از حد مجاز است." }, { status: 413 });

          const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().slice(0, 8);
          const path = `${folder || "misc"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

          const { getStorage } = await import("@/lib/storage.server");
          const { client, bucket } = await getStorage();
          const { error } = await client.storage
            .from(bucket)
            .upload(path, await file.arrayBuffer(), {
              contentType: file.type || "application/octet-stream",
              upsert: false,
            });
          if (error) return Response.json({ error: error.message }, { status: 500 });

          return Response.json({ path, url: `/api/public/asset/${path}` });
        } catch (e) {
          return Response.json(
            { error: e instanceof Error ? e.message : "خطای نامشخص در آپلود" },
            { status: 500 },
          );
        }
      },
    },
  },
});
