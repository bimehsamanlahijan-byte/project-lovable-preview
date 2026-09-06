import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(8).max(20),
  policyNumber: z.string().trim().max(50).optional().or(z.literal("")),
  accidentDate: z.string().trim().max(30).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const Route = createFileRoute("/api/report-damage")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ ok: false, error: "validation_failed", issues: parsed.error.issues }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const { createClient } = await import("@supabase/supabase-js");
const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("@/lib/server-env");
          await loadRuntimeEnv();
          const url = getSupabaseUrl()!;
          const key = getSupabaseServiceKey()!;
          const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

          const { error } = await supabase.from("damage_reports").insert({
            full_name: parsed.data.fullName,
            phone: parsed.data.phone,
            policy_number: parsed.data.policyNumber || null,
            accident_date: parsed.data.accidentDate || null,
            description: parsed.data.description || null,
          });

          if (error) {
            return new Response(
              JSON.stringify({ ok: false, error: "db_error", details: error.message }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }
        } catch {
          return new Response(
            JSON.stringify({ ok: false, error: "server_error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
