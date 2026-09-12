import { createFileRoute } from "@tanstack/react-router";

/** Public partner stats: a partner enters their code and sees commission,
 *  total sales and per-branch breakdown. */
export const Route = createFileRoute("/api/public/partner-stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const code = new URL(request.url).searchParams.get("code")?.trim();
        if (!code) {
          return Response.json({ ok: false, error: "code_required" }, { status: 400 });
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

          const { data: partner, error: pErr } = await supabase
            .from("partners")
            .select("id, code, full_name, commission_percent, is_active")
            .eq("code", code)
            .maybeSingle();

          if (pErr) {
            return Response.json({ ok: false, error: "db_error", details: pErr.message }, { status: 500 });
          }
          if (!partner || !partner.is_active) {
            return Response.json({ ok: false, error: "partner_not_found" }, { status: 404 });
          }

          const { data: sales, error: sErr } = await supabase
            .from("partner_sales")
            .select("insurance_branch, policy_type, amount, sold_at")
            .eq("partner_id", partner.id)
            .order("sold_at", { ascending: false });

          if (sErr) {
            return Response.json({ ok: false, error: "db_error", details: sErr.message }, { status: 500 });
          }

          const rows = sales ?? [];
          const totalAmount = rows.reduce((s, r) => s + (r.amount || 0), 0);
          const byBranch: Record<string, { branch: string; count: number; amount: number; types: Record<string, number> }> = {};
          for (const r of rows) {
            const b = (byBranch[r.insurance_branch] ??= {
              branch: r.insurance_branch,
              count: 0,
              amount: 0,
              types: {},
            });
            b.count += 1;
            b.amount += r.amount || 0;
            if (r.policy_type) b.types[r.policy_type] = (b.types[r.policy_type] ?? 0) + 1;
          }

          return Response.json({
            ok: true,
            partner: {
              code: partner.code,
              fullName: partner.full_name,
              commissionPercent: partner.commission_percent,
            },
            totalSales: rows.length,
            totalAmount,
            commissionAmount: Math.round((totalAmount * partner.commission_percent) / 100),
            branches: Object.values(byBranch).map((b) => ({
              branch: b.branch,
              count: b.count,
              amount: b.amount,
              types: Object.entries(b.types).map(([label, count]) => ({ label, count })),
            })),
          });
        } catch {
          return Response.json({ ok: false, error: "server_error" }, { status: 500 });
        }
      },
    },
  },
});
