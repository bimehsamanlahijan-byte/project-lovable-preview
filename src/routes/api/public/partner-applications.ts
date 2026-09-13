import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  nationalId: z.string().trim().regex(/^\d{10}$/),
  birthYear: z.string().trim().max(4).optional().default(""),
  gender: z.enum(["male", "female"]).default("male"),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().max(160).optional().default(""),
  province: z.string().trim().max(60).optional().default(""),
  city: z.string().trim().max(60).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  education: z.string().trim().max(60).optional().default(""),
  fieldOfStudy: z.string().trim().max(120).optional().default(""),
  experience: z.string().trim().max(60).optional().default(""),
  insuranceLicense: z.enum(["yes", "no", "in_progress"]).default("no"),
  cooperationType: z.string().trim().max(60).optional().default(""),
  branches: z.array(z.string().trim().max(120)).max(20).optional().default([]),
  monthlyTarget: z.string().trim().max(20).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
});

export const Route = createFileRoute("/api/public/partner-applications")({
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
        const d = parsed.data;

        try {
          const { createClient } = await import("@supabase/supabase-js");
          const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import(
            "@/lib/server-env"
          );
          await loadRuntimeEnv();
          const supabase = createClient(getSupabaseUrl()!, getSupabaseServiceKey()!, {
            auth: { autoRefreshToken: false, persistSession: false },
          });

          const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const row: Record<string, unknown> = {
            applicant_id: `PA-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`,
            full_name: d.fullName,
            national_id: d.nationalId,
            birth_year: d.birthYear,
            gender: d.gender,
            phone: d.phone,
            email: d.email,
            province: d.province,
            city: d.city,
            address: d.address,
            education: d.education,
            field_of_study: d.fieldOfStudy,
            experience: d.experience,
            insurance_license: d.insuranceLicense,
            cooperation_type: d.cooperationType,
            branches: d.branches,
            monthly_target: d.monthlyTarget,
            description: d.description,
          };

          // Older deployed databases may lack some columns: drop unknown ones and retry.
          let data: Record<string, unknown> | null = null;
          let lastError = "";
          for (let attempt = 0; attempt < 30; attempt += 1) {
            const result = await supabase
              .from("partner_applications")
              .insert(row)
              .select("*")
              .single();

            if (!result.error) {
              data = result.data as Record<string, unknown>;
              break;
            }

            lastError = result.error.message;
            const unknownColumn = lastError.match(/Could not find the '([^']+)' column/)?.[1];
            if (unknownColumn && unknownColumn in row) {
              delete row[unknownColumn];
              continue;
            }
            break;
          }

          if (!data) {
            return Response.json({ ok: false, error: "db_error", details: lastError }, { status: 500 });
          }

          return Response.json({
            ok: true,
            applicantId: (data["applicant_id"] ?? data["id"]) as string,
            receivedAt: (data["received_at"] ?? data["created_at"]) as string,
            columns: Object.keys(data),
          });
        } catch {
          return Response.json({ ok: false, error: "server_error" }, { status: 500 });
        }
      },
    },
  },
});
