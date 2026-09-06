import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  nationalId: z.string().trim().min(5).max(20),
  passport: z.string().trim().max(30).optional().or(z.literal("")),
  birthDate: z.string().trim().max(20).optional().or(z.literal("")),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  zone: z.string().trim().max(40),
  zoneLabel: z.string().trim().max(80),
  duration: z.string().trim().max(10),
  durationLabel: z.string().trim().max(60),
  ceilingLabel: z.string().trim().max(60),
  ageLabel: z.string().trim().max(60),
  travelers: z.number().int().min(1).max(10),
  startDate: z.string().trim().max(20).optional().or(z.literal("")),
  premium: z.number().int().min(0),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

function trackingCode() {
  return "TRV-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100);
}

function sanitizeText(str: string): string {
  return str.replace(/[\0\x01-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

export const Route = createFileRoute("/api/travel-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (v: unknown, status: number) =>
          new Response(JSON.stringify(v), { status, headers: { "Content-Type": "application/json" } });

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "invalid_json" }, 400);
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) return json({ ok: false, error: "validation_failed", issues: parsed.error.issues }, 400);

        const d = parsed.data;
        const code = trackingCode();
        const description = sanitizeText([
          `کد پیگیری: ${code}`,
          `مقصد: ${d.zoneLabel}`,
          `مدت سفر: ${d.durationLabel}`,
          `سقف پوشش: ${d.ceilingLabel}`,
          `رده سنی: ${d.ageLabel}`,
          `تعداد مسافر: ${d.travelers}`,
          d.startDate ? `تاریخ شروع سفر: ${d.startDate}` : "",
          d.passport ? `شماره گذرنامه: ${d.passport}` : "",
          d.birthDate ? `تاریخ تولد: ${d.birthDate}` : "",
          `حق بیمه برآوردی: ${d.premium} ریال`,
          d.note ? `توضیحات: ${d.note}` : "",
        ]
          .filter(Boolean)
          .join("\n"));

        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
          const { error } = await supabase.from("contact_messages").insert({
            full_name: d.fullName,
            national_id: d.nationalId,
            phone: d.phone,
            email: d.email || null,
            province: null,
            insurance_type: "خرید آنلاین بیمه مسافرتی",
            description,
          });
          if (error) return json({ ok: false, error: "db_error", details: error.message }, 500);
        } catch {
          return json({ ok: false, error: "server_error" }, 500);
        }

        return json({ ok: true, code }, 200);
      },
    },
  },
});
