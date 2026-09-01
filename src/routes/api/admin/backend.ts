import { createFileRoute } from "@tanstack/react-router";

/** Password-gated backend (Supabase) health + browsing endpoint for the dashboard. */
export const Route = createFileRoute("/api/admin/backend")({
  server: {
    handlers: {
      GET: async () => {
        const { isUnlocked, ADMIN_TABLES } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const env = {
          SUPABASE_URL: Boolean(process.env["SUPABASE_URL"]),
          SUPABASE_PUBLISHABLE_KEY: Boolean(process.env["SUPABASE_PUBLISHABLE_KEY"]),
          SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env["SUPABASE_SERVICE_ROLE_KEY"]),
          SESSION_SECRET: Boolean(process.env["SESSION_SECRET"]),
        };

        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
          return Response.json({
            env,
            buckets: [],
            tables: [],
            error:
              "کلید دسترسی سرور (SUPABASE_SERVICE_ROLE_KEY) یا نشانی بک‌اند در محیط اجرا تنظیم نشده است؛ به همین دلیل آپلود فایل در نسخه منتشرشده خطا می‌دهد.",
          });
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: buckets } = await supabaseAdmin.storage.listBuckets();

          const tables: { table: string; count: number | null }[] = [];
          for (const t of ADMIN_TABLES) {
            const { count } = await supabaseAdmin
              .from(t as never)
              .select("*", { count: "exact", head: true });
            tables.push({ table: t, count: count ?? null });
          }

          return Response.json({
            env,
            buckets: (buckets ?? []).map((b) => ({ name: b.name, public: b.public })),
            tables,
            error: null,
          });
        } catch (e) {
          return Response.json({
            env,
            buckets: [],
            tables: [],
            error: e instanceof Error ? e.message : "خطای نامشخص در اتصال به بک‌اند",
          });
        }
      },
    },
  },
});
