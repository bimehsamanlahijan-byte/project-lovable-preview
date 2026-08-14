import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(120),
  nationalId: z.string().trim().min(1).max(20),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  province: z.string().trim().max(50).optional().or(z.literal("")),
  insuranceType: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const Route = createFileRoute("/api/consult")({
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
          const url = process.env.SUPABASE_URL!;
          const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

          const { error } = await supabase.from("contact_messages").insert({
            full_name: parsed.data.fullName,
            national_id: parsed.data.nationalId,
            phone: parsed.data.phone,
            email: parsed.data.email || null,
            province: parsed.data.province || null,
            insurance_type: parsed.data.insuranceType || null,
            description: parsed.data.description || null,
          });

          if (error) {
            return new Response(
              JSON.stringify({ ok: false, error: "db_error", details: error.message }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }
        } catch (e) {
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
