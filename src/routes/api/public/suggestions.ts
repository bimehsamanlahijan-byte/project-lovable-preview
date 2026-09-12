import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(8).max(20),
  category: z.enum(["suggestion", "criticism"]).default("suggestion"),
  message: z.string().trim().min(1).max(2000),
});

export const Route = createFileRoute("/api/public/suggestions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "validation_failed", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        try {
          const { createClient } = await import("@supabase/supabase-js");
          const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import(
            "@/lib/server-env"
          );
          await loadRuntimeEnv();
          const supabase = createClient(getSupabaseUrl()!, getSupabaseServiceKey()!, {
            auth: { autoRefreshToken: false, persistSession: false },
          });

          const { data, error } = await supabase
            .from("suggestions")
            .insert({
              full_name: parsed.data.fullName,
              phone: parsed.data.phone,
              category: parsed.data.category,
              message: parsed.data.message,
            })
            .select("tracking_id, received_at")
            .single();

          if (error) {
            return Response.json(
              { ok: false, error: "db_error", details: error.message },
              { status: 500 },
            );
          }

          return Response.json({ ok: true, trackingId: data.tracking_id, receivedAt: data.received_at });
        } catch {
          return Response.json({ ok: false, error: "server_error" }, { status: 500 });
        }
      },
    },
  },
});
