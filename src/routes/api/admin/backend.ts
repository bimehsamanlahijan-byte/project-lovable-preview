import { createFileRoute } from "@tanstack/react-router";

/** Password-gated backend (Supabase) health + browsing endpoint for the dashboard. */
export const Route = createFileRoute("/api/admin/backend")({
  server: {
    handlers: {
      GET: async () => {
        const { isUnlocked, ADMIN_TABLES } = await import("@/lib/dashboard-auth.server");
        if (!(await isUnlocked())) return new Response("Unauthorized", { status: 401 });

        const {
          getSessionSecret,
          getSupabasePublishableKey,
          getSupabaseServiceKey,
          getSupabaseUrl,
          loadRuntimeEnv,
        } = await import("@/lib/server-env");
        await loadRuntimeEnv();

        const env = {
          SUPABASE_URL: Boolean(getSupabaseUrl()),
          SUPABASE_PUBLISHABLE_KEY: Boolean(getSupabasePublishableKey()),
          SUPABASE_SERVICE_ROLE_KEY: Boolean(getSupabaseServiceKey()),
          SESSION_SECRET: Boolean(getSessionSecret()),
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
          const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
          const supabaseAdmin = await getSupabaseAdmin();
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
