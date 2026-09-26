import { useEffect, useState } from "react";
import {
  ExternalLink,
  Gauge,
  Loader2,
  Save,
  Search,
  Sparkles,
  Swords,
  Wand2,
} from "lucide-react";

import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { notifyFailed, notifySaved } from "@/lib/notify";
import {
  AI_ENGINES_KEY,
  ANALYZERS,
  DEFAULT_AI_ENGINES,
  getAnalyzer,
  type AiEnginesSettings,
} from "@/lib/ai-engine";
import { DEFAULT_SEO, SEO_SETTING_KEY, normalizeBase, type SeoConfig } from "@/lib/seo-config";
import {
  CUSTOM_PAGES_KEY,
  emptyPage,
  sanitizeSlug,
  type CustomPagesMap,
} from "@/lib/custom-pages";
import {
  aiRewritePage,
  analyzeCompetitorSite,
  competitorTopPages,
  scanSiteSeo,
} from "@/lib/seo-competitor.functions";
import { AiEngineSelect } from "./AiEngineSelect";
import { GlassHelp, GlassModal, Steps } from "./GlassHelp";
import { SECONDARY_DOMAIN, cleanOrigin, joinUrl } from "@/lib/seo-url";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const btn = "flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold hover:bg-slate-50 disabled:opacity-50";
const primary = "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white font-bold disabled:opacity-50";

type Analysis = Awaited<ReturnType<typeof analyzeCompetitorSite>>;
type Scan = Awaited<ReturnType<typeof scanSiteSeo>>;

/**
 * «آنالیز وب‌سایت رقیب» — lives inside the SEO menu.
 *
 * Step 1: target keyword + competitor URL (from Google's first result).
 * Step 2: website analyzer finds the competitor's top pages (switchable source,
 *         including the external Traffic Checker used in the training video).
 * Step 3: the selected AI engine (default Lovable AI) reports the competitor's
 *         weaknesses, our gaps, keywords, a content plan and a backlink plan.
 * Step 4: one click per page rewrites our content with that plan and stores it
 *         as an editable Page-Builder page.
 */
export function CompetitorPane() {
  const [engines, setEngines] = useState<AiEnginesSettings>(DEFAULT_AI_ENGINES);
  const [seo, setSeo] = useState<SeoConfig>(DEFAULT_SEO);
  const [keyword, setKeyword] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [topPages, setTopPages] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);
  const [notes, setNotes] = useState("");
  const [domain2, setDomain2] = useState(SECONDARY_DOMAIN);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    void (async () => {
      setEngines(await adminReadSetting<AiEnginesSettings>(AI_ENGINES_KEY, DEFAULT_AI_ENGINES));
      setSeo(await adminReadSetting<SeoConfig>(SEO_SETTING_KEY, DEFAULT_SEO));
    })();
  }, []);

  const analyzer = getAnalyzer(engines.analyzer);
  const origin = cleanOrigin(normalizeBase(seo.siteUrl));
  const myPaths = seo.pages.map((p) => p.path);

  async function saveEngines(next: AiEnginesSettings) {
    setEngines(next);
    const res = await adminWriteSetting(AI_ENGINES_KEY, next);
    if (res.error) notifyFailed("ذخیره موتور هوش مصنوعی", res.error.message);
  }

  async function findTopPages() {
    if (!competitorUrl.trim()) return notifyFailed("آنالیز رقیب", "آدرس سایت رقیب را وارد کنید.");
    setBusy("top");
    try {
      const res = await competitorTopPages({ data: { url: competitorUrl.trim() } });
      setTopPages(res.pages);
      if (!res.pages.length) notifyFailed("صفحات رقیب", "صفحه‌ای پیدا نشد؛ آدرس صفحه پرترافیک را دستی وارد کنید.");
      else notifySaved(`${res.pages.length} صفحه رقیب پیدا شد`);
    } catch (e: any) {
      notifyFailed("صفحات رقیب", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  async function runAnalysis() {
    if (!competitorUrl.trim()) return notifyFailed("آنالیز رقیب", "آدرس صفحه رقیب را وارد کنید.");
    setBusy("analyze");
    setAnalysis(null);
    try {
      const res = await analyzeCompetitorSite({
        data: {
          competitorUrl: competitorUrl.trim(),
          myUrls: origin ? myPaths.slice(0, 6).map((p) => joinUrl(origin, p)) : [],
          myAltOrigin: cleanOrigin(domain2) || undefined,
          keyword: keyword.trim(),
          analyzer: engines.analyzer,
          provider: engines.seoCompetitor.provider,
          model: engines.seoCompetitor.model,
          extraNotes: notes.trim(),
        },
      });
      setAnalysis(res);
      if (!res.ok) notifyFailed("آنالیز رقیب", res.error);
      else {
        notifySaved("تحلیل رقیب آماده شد");
        setShowResult(true);
      }
    } catch (e: any) {
      notifyFailed("آنالیز رقیب", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  async function runScan() {
    if (!origin) return notifyFailed("اسکن سایت", "ابتدا آدرس دامنه را در تنظیمات سئو ذخیره کنید.");
    setBusy("scan");
    setScan(null);
    try {
      const res = await scanSiteSeo({
        data: {
          origin,
          paths: myPaths,
          competitorUrl: competitorUrl.trim() || undefined,
          keyword: keyword.trim() || undefined,
          analyzer: engines.analyzer,
          provider: engines.seoCompetitor.provider,
          model: engines.seoCompetitor.model,
          altOrigin: cleanOrigin(domain2) || undefined,
        },
      });
      setScan(res);
      if (!res.ok) notifyFailed("اسکن سایت", res.error);
      else {
        if (res.analysis) {
          setAnalysis(res.analysis);
          setShowResult(true);
        }
        notifySaved("اسکن کلی سایت انجام شد");
      }
    } catch (e: any) {
      notifyFailed("اسکن سایت", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  /** Rewrites one of our pages with the plan and stores it as an editable page. */
  async function rewritePage(path: string, guidance: string, title: string, description: string) {
    if (!origin) return notifyFailed("به‌روزرسانی محتوا", "ابتدا آدرس دامنه را در تنظیمات سئو ذخیره کنید.");
    setBusy(`rewrite:${path}`);
    try {
      const res = await aiRewritePage({
        data: {
          targetUrl: joinUrl(origin, path),
          competitorUrl: competitorUrl.trim() || undefined,
          keyword: keyword.trim() || undefined,
          guidance,
          provider: engines.seoCompetitor.provider,
          model: engines.seoCompetitor.model,
        },
      });
      if (!res.ok) return notifyFailed("به‌روزرسانی محتوا", res.error);
      const slug = sanitizeSlug(`seo-${path.replace(/^\//, "") || "home"}`);
      const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
      const base = map[slug] ?? emptyPage(slug);
      map[slug] = {
        ...base,
        slug,
        title: title || res.title || base.title,
        description: description || res.description || base.description,
        seoTitle: title || res.title || base.seoTitle,
        seoDescription: description || res.description || base.seoDescription,
        blocks: res.blocks,
        updatedAt: new Date().toISOString(),
      };
      const saved = await adminWriteSetting(CUSTOM_PAGES_KEY, map);
      if (saved.error) return notifyFailed("ذخیره صفحه", saved.error.message);
      notifySaved(`محتوای سئو‌شده ساخته شد: /p/${slug} — در صفحه‌ساز و ویرایشگر بصری قابل ویرایش است`);
    } catch (e: any) {
      notifyFailed("به‌روزرسانی محتوا", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  const report = analysis?.ok ? analysis.report : null;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]">
          <Swords className="h-4 w-4" /> آنالیز وب‌سایت رقیب (ترفند سه‌مرحله‌ای)
          <span className="mr-auto flex gap-1.5">
            <GlassHelp title="راهنمای آنالیز رقیب">
              <Steps
                items={[
                  "کلمه کلیدی هدف (مثلاً «بیمه بدنه لاهیجان») را در گوگل جستجو کنید.",
                  "آدرس اولین سایت رقیب را در کادر «آدرس سایت یا صفحه رقیب» بچسبانید.",
                  "«یافتن صفحات پرترافیک رقیب» را بزنید و از فهرست، مهم‌ترین صفحه را با «تحلیل این صفحه» انتخاب کنید.",
                  "موتور هوش مصنوعی و ابزار آنالیز را انتخاب کنید (پیش‌فرض Lovable AI و آنالیزور داخلی).",
                  "«تحلیل نقاط ضعف رقیب» را بزنید؛ پنجره نتیجه نشان می‌دهد با کدام موتور و کدام روش تحلیل شده.",
                  "در «برنامه محتوا» برای هر صفحه «ساخت محتوای قوی‌تر» را بزنید؛ صفحه در صفحه‌ساز قابل ویرایش است.",
                ]}
              />
            </GlassHelp>
            <GlassHelp title="دامنه دوم و خطای ۵۲۲" label="دامنه دوم / خطاها">
              <p>سایت شما دو دامنه دارد. اگر صفحه‌ای از دامنه اول باز نشود، همان صفحه از دامنه دوم خوانده می‌شود و در نتیجه ذکر می‌شود.</p>
              <p><b>خطای ۵۲۲</b> یعنی Cloudflare نتوانسته به هاست سایت وصل شود. معمولاً هاست خاموش یا کند است، یا IP هاست در بخش DNS کلودفلر اشتباه ثبت شده. از پشتیبانی هاست بپرسید سرور روشن است و IP درست را در Cloudflare → DNS ثبت کنید.</p>
              <p>آدرس‌های تکراری مثل <span dir="ltr">https://site.ir/https://site.ir</span> به‌صورت خودکار اصلاح می‌شوند.</p>
            </GlassHelp>
            <GlassHelp title="روش‌های آنالیز" label="روش‌ها">
              {ANALYZERS.map((a) => (
                <p key={a.id}><b>{a.label}:</b> {a.note}</p>
              ))}
            </GlassHelp>
          </span>
        </h2>
        <p className="mb-4 text-[11px] text-slate-500">
          ۱) کلمه کلیدی را در گوگل جستجو کنید و آدرس رقیب اول را اینجا بگذارید. ۲) پرترافیک‌ترین صفحه‌اش را پیدا کنید.
          ۳) هوش مصنوعی نقاط ضعف آن را می‌گوید و محتوای شما را قوی‌تر می‌سازد.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs">
            <span className="mb-1 block font-bold text-slate-600">کلمه کلیدی هدف</span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className={inputCls} placeholder="مثلاً بیمه مسافرتی لاهیجان" />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-bold text-slate-600">آدرس سایت یا صفحه رقیب</span>
            <input dir="ltr" value={competitorUrl} onChange={(e) => setCompetitorUrl(e.target.value)} className={inputCls} placeholder="https://competitor.ir/insurance" />
          </label>
          <label className="text-xs md:col-span-2">
            <span className="mb-1 block font-bold text-slate-600">دامنه دوم سایت من (اگر دامنه اول باز نشد از این خوانده می‌شود)</span>
            <input dir="ltr" value={domain2} onChange={(e) => setDomain2(e.target.value)} className={inputCls} placeholder="https://saman8452.ir" />
          </label>
          <label className="text-xs md:col-span-2">
            <span className="mb-1 block font-bold text-slate-600">یادداشت برای هوش مصنوعی (اختیاری)</span>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} placeholder="مثلاً روی بیمه درمان تکمیلی و شهر لاهیجان تمرکز کن." />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <AiEngineSelect
            value={engines.seoCompetitor}
            onChange={(seoCompetitor) => void saveEngines({ ...engines, seoCompetitor })}
            label="موتور هوش مصنوعی این بخش"
          />
          <label className="mt-3 block text-xs">
            <span className="mb-1 block font-bold text-slate-600">ابزار آنالیز وب‌سایت (قابل تغییر)</span>
            <select
              value={engines.analyzer}
              onChange={(e) => void saveEngines({ ...engines, analyzer: e.target.value as AiEnginesSettings["analyzer"] })}
              className={inputCls}
            >
              {ANALYZERS.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-slate-400">{analyzer.note}</span>
          </label>
          {analyzer.externalUrl && (
            <a
              dir="ltr"
              href={`${analyzer.externalUrl}${competitorUrl.trim() ? `?domain=${encodeURIComponent(competitorUrl.trim())}` : ""}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b1e3f]"
            >
              <ExternalLink className="h-3.5 w-3.5" /> باز کردن Traffic Checker برای این دامنه
            </a>
          )}
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <Save className="h-3.5 w-3.5" /> انتخاب موتور و ابزار به‌صورت خودکار ذخیره می‌شود.
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => void findTopPages()} disabled={!!busy} className={btn}>
            {busy === "top" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} یافتن صفحات پرترافیک رقیب
          </button>
          <button onClick={() => void runAnalysis()} disabled={!!busy} className={primary}>
            {busy === "analyze" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} تحلیل نقاط ضعف رقیب
          </button>
          <button onClick={() => void runScan()} disabled={!!busy} className={btn}>
            {busy === "scan" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />} اسکن کلی سئوی سایت من
          </button>
        </div>

        {topPages.length > 0 && (
          <ul className="mt-4 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-3 text-[11px]">
            {topPages.map((u) => (
              <li key={u} className="flex items-center justify-between gap-2">
                <a dir="ltr" href={u} target="_blank" rel="noreferrer" className="truncate text-slate-600 hover:underline">{u}</a>
                <button onClick={() => setCompetitorUrl(u)} className="shrink-0 rounded-lg border border-slate-300 px-2 py-1 font-bold">تحلیل این صفحه</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showResult && analysis?.ok && (
        <GlassModal title="نتیجه آنالیز رقیب" onClose={() => setShowResult(false)}>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white/70 p-2"><b>موتور هوش مصنوعی:</b> <span dir="ltr">{analysis.engine}</span></div>
            <div className="rounded-xl bg-white/70 p-2"><b>روش آنالیز:</b> {getAnalyzer(analysis.analyzer).label}</div>
            <div className="rounded-xl bg-white/70 p-2 sm:col-span-2"><b>صفحه رقیب:</b> <span dir="ltr">{analysis.competitor.url}</span> {analysis.competitor.ok ? "✓ خوانده شد" : `— ${analysis.competitor.error ?? ""}`}</div>
          </div>
          {analysis.mine.some((m: any) => m.via || !m.ok) && (
            <ul className="list-inside list-disc text-amber-700">
              {analysis.mine.map((m: any) => (m.via || !m.ok) && <li key={m.url}><span dir="ltr">{m.url}</span>: {m.via || m.error}</li>)}
            </ul>
          )}
          {analysis.report.summary && <p className="whitespace-pre-line rounded-xl bg-white/70 p-3">{analysis.report.summary}</p>}
          <ListCard title="نقاط ضعف رقیب" items={analysis.report.competitorWeaknesses.slice(0, 5)} tone="rose" />
          <ListCard title="کارهای سریع" items={analysis.report.quickWins.slice(0, 5)} tone="emerald" />
          <p className="text-[11px] text-slate-500">جزئیات کامل و برنامه محتوا زیر همین صفحه نمایش داده شده است.</p>
        </GlassModal>
      )}

      {scan?.ok && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-extrabold text-[#0b1e3f]">نتیجه اسکن کلی سایت</h3>
          <div className="space-y-2">
            {scan.pages.map((p) => (
              <div key={p.url} className="rounded-xl border border-slate-200 p-3 text-[11px]">
                <div dir="ltr" className="font-bold text-slate-700">{p.url}</div>
                <div className="mt-1 text-slate-500">
                  کلمات: {p.words ?? 0} | تیترها: {p.headings?.length ?? 0} | تصاویر: {p.images ?? 0}
                </div>
                {p.issues.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-rose-600">
                    {p.issues.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                ) : (
                  <div className="mt-1 text-emerald-600">ایراد آشکاری پیدا نشد ✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-[11px] text-slate-400">
            موتور: {analysis?.ok ? analysis.engine : ""} — ابزار آنالیز: {analyzer.label}
          </div>
          {report.summary && (
            <p className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-700">{report.summary}</p>
          )}

          <ListCard title="نقاط ضعف رقیب (فرصت‌های شما)" items={report.competitorWeaknesses} tone="rose" />
          <ListCard title="نقاط قوت رقیب (باید جبران شود)" items={report.competitorStrengths} tone="slate" />
          <ListCard title="کمبودهای سایت ما" items={report.myGaps} tone="amber" />
          <ListCard title="کارهای سریع و زودبازده" items={report.quickWins} tone="emerald" />
          <ListCard title="برنامه لینک‌سازی" items={report.backlinks} tone="slate" />

          {report.keywords.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-extrabold text-[#0b1e3f]">کلمات کلیدی هدف</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead className="text-slate-500">
                    <tr><th className="p-1 text-right">کلمه</th><th className="p-1 text-right">نیت کاربر</th><th className="p-1 text-right">صفحه پیشنهادی</th></tr>
                  </thead>
                  <tbody>
                    {report.keywords.map((k, i) => (
                      <tr key={`${k.keyword}-${i}`} className="border-t border-slate-100">
                        <td className="p-1 font-bold text-slate-700">{k.keyword}</td>
                        <td className="p-1 text-slate-500">{k.intent}</td>
                        <td dir="ltr" className="p-1 text-slate-500">{k.where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.contentPlan.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-extrabold text-[#0b1e3f]">برنامه محتوا — هر صفحه با یک کلیک به‌روز می‌شود</h4>
              <div className="space-y-2">
                {report.contentPlan.map((c, i) => (
                  <div key={`${c.path}-${i}`} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div dir="ltr" className="text-[11px] font-bold text-slate-700">{c.path}</div>
                        <div className="text-xs font-bold text-[#0b1e3f]">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.action} — {c.description}</div>
                      </div>
                      <button
                        onClick={() => void rewritePage(c.path, [c.description, ...c.outline].filter(Boolean).join("\n"), c.title, c.description)}
                        disabled={!!busy}
                        className={primary}
                      >
                        {busy === `rewrite:${c.path}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} ساخت محتوای قوی‌تر
                      </button>
                    </div>
                    {c.outline.length > 0 && (
                      <ul className="mt-2 list-inside list-disc text-[11px] text-slate-600">
                        {c.outline.map((o, j) => <li key={`${o}-${j}`}>{o}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "rose" | "emerald" | "amber" | "slate" }) {
  if (!items.length) return null;
  const color =
    tone === "rose" ? "text-rose-600" : tone === "emerald" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : "text-slate-600";
  return (
    <div>
      <h4 className="mb-1 text-xs font-extrabold text-[#0b1e3f]">{title}</h4>
      <ul className={`list-inside list-disc space-y-1 text-[11px] leading-5 ${color}`}>
        {items.map((it, i) => <li key={`${it}-${i}`}>{it}</li>)}
      </ul>
    </div>
  );
}
