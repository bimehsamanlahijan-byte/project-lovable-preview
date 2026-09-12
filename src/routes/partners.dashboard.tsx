import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Percent, Wallet, Layers } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/partners/dashboard")({
  head: () => ({
    meta: [
      { title: "پنل همکاران تیم 8452 | بیمه سامان" },
      {
        name: "description",
        content: "مشاهده وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای برای همکاران تیم 8452.",
      },
      { property: "og:title", content: "پنل همکاران تیم 8452 | بیمه سامان" },
      { property: "og:description", content: "گزارش فروش و پورسانت همکاران و بازاریابان تیم 8452." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerDashboardPage,
});

type Stats = {
  partner: { code: string; fullName: string; commissionPercent: number };
  totalSales: number;
  totalAmount: number;
  commissionAmount: number;
  branches: { branch: string; count: number; amount: number; types: { label: string; count: number }[] }[];
};

const fmt = (n: number) => n.toLocaleString("fa-IR");

function PartnerDashboardPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setStats(null);
    try {
      const r = await fetch(`/api/public/partner-stats?code=${encodeURIComponent(code.trim())}`);
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStats(data as Stats);
      } else if (r.status === 404) {
        setError("همکاری با این کد یافت نشد یا غیرفعال است.");
      } else {
        setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
      }
    } catch {
      setError("خطا در ارتباط با سرور.");
    }
    setLoading(false);
  };

  const maxBranch = stats ? Math.max(...stats.branches.map((b) => b.amount), 1) : 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">پنل همکاران تیم 8452</h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl leading-7">
            کد همکاری خود را وارد کنید تا وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای را ببینید.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        <form
          onSubmit={load}
          className="bg-card rounded-3xl p-6 md:p-8 shadow-elegant border border-border flex flex-col md:flex-row gap-3 md:items-end max-w-2xl"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">کد همکاری</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً 8452-001"
              dir="ltr"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition text-left"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60"
          >
            {loading ? "در حال دریافت..." : "مشاهده گزارش"}
          </button>
        </form>

        {error && (
          <div className="mt-6 max-w-2xl text-sm text-center rounded-xl px-4 py-3 bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {stats && (
          <div className="mt-8 space-y-6">
            <div className="bg-card rounded-3xl p-6 shadow-elegant border border-border">
              <div className="font-extrabold text-lg">{stats.partner.fullName}</div>
              <div className="text-xs text-muted-foreground mt-1" dir="ltr">{stats.partner.code}</div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Percent className="w-6 h-6" />} label="درصد پورسانت" value={`${fmt(stats.partner.commissionPercent)}٪`} />
              <StatCard icon={<Layers className="w-6 h-6" />} label="تعداد فروش" value={fmt(stats.totalSales)} />
              <StatCard icon={<BarChart3 className="w-6 h-6" />} label="میزان فروش (ریال)" value={fmt(stats.totalAmount)} />
              <StatCard icon={<Wallet className="w-6 h-6" />} label="پورسانت شما (ریال)" value={fmt(stats.commissionAmount)} />
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-elegant border border-border">
              <h2 className="font-extrabold text-lg mb-5">فروش به تفکیک شاخه بیمه‌ای</h2>
              {stats.branches.length === 0 ? (
                <p className="text-sm text-muted-foreground">هنوز فروشی ثبت نشده است.</p>
              ) : (
                <div className="space-y-5">
                  {stats.branches.map((b) => (
                    <div key={b.branch}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-bold">{b.branch}</span>
                        <span className="text-muted-foreground">
                          {fmt(b.count)} فروش — {fmt(b.amount)} ریال
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all"
                          style={{ width: `${Math.max(4, Math.round((b.amount / maxBranch) * 100))}%` }}
                        />
                      </div>
                      {b.types.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {b.types.map((t) => (
                            <span key={t.label} className="text-xs bg-primary-soft text-primary rounded-full px-3 py-1">
                              {t.label} ({fmt(t.count)})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-3xl p-5 shadow-elegant border border-border">
      <div className="text-primary mb-2">{icon}</div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-extrabold text-lg" dir="ltr">{value}</div>
    </div>
  );
}
