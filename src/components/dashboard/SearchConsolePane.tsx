import { useEffect, useState } from "react";
import { CheckCircle2, Globe, Loader2, Rocket, Save, Trash2, XCircle } from "lucide-react";

import { adminReadSetting } from "@/lib/admin-db";
import { AI_ENGINES_KEY, DEFAULT_AI_ENGINES, type AiEnginesSettings } from "@/lib/ai-engine";
import { deleteGscKey, gscAutoRun, gscStatus, saveGscKey } from "@/lib/gsc.functions";
import { notifyFailed, notifySaved } from "@/lib/notify";
import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from "@/lib/seo-url";
import { AiEngineSelect } from "./AiEngineSelect";
import { GlassHelp, GlassModal, Steps } from "./GlassHelp";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
type Run = Awaited<ReturnType<typeof gscAutoRun>>;

/** «سرچ کنسول گوگل» — one-click register + analyze for both domains. */
export function SearchConsolePane() {
  const [status, setStatus] = useState<{ configured: boolean; email: string }>({ configured: false, email: "" });
  const [json, setJson] = useState("");
  const [d1, setD1] = useState(PRIMARY_DOMAIN);
  const [d2, setD2] = useState(SECONDARY_DOMAIN);
  const [engine, setEngine] = useState(DEFAULT_AI_ENGINES.seoCompetitor);
  const [busy, setBusy] = useState("");
  const [run, setRun] = useState<Run | null>(null);

  async function load() {
    try {
      setStatus(await gscStatus());
      const e = await adminReadSetting<AiEnginesSettings>(AI_ENGINES_KEY, DEFAULT_AI_ENGINES);
      setEngine(e.seoCompetitor);
    } catch (e: any) {
      notifyFailed("سرچ کنسول", e?.message || String(e));
    }
  }
  useEffect(() => void load(), []);

  async function saveKey() {
    setBusy("save");
    try {
      const r = await saveGscKey({ data: { json: json.trim() } });
      if (!r.ok) return notifyFailed("کلید گوگل", r.error || "");
      notifySaved("کلید گوگل در بخش خصوصی ذخیره شد");
      setJson("");
      await load();
    } catch (e: any) {
      notifyFailed("کلید گوگل", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  async function autoRun() {
    setBusy("run");
    try {
      const r = await gscAutoRun({ data: { domains: [d1, d2].filter(Boolean), provider: engine.provider, model: engine.model } });
      if (!r.ok) return notifyFailed("سرچ کنسول", r.error);
      setRun(r);
    } catch (e: any) {
      notifyFailed("سرچ کنسول", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]">
            <Globe className="h-4 w-4" /> سرچ کنسول گوگل
          </h2>
          <GlassHelp title="راهنمای قدم‌به‌قدم ساخت کلید گوگل" label="راهنمای ساخت کلید">
            <Steps
              items={[
                <>به <a dir="ltr" className="underline" href="https://console.cloud.google.com" target="_blank" rel="noreferrer">console.cloud.google.com</a> بروید و یک پروژه جدید بسازید.</>,
                "از «APIs & Services → Library» دو سرویس «Google Search Console API» و «Site Verification API» را جستجو و Enable کنید.",
                "به «IAM & Admin → Service Accounts» بروید، «Create service account» بزنید و یک نام دلخواه بدهید.",
                "روی حساب ساخته‌شده کلیک کنید → برگه «Keys» → «Add key → Create new key» → نوع JSON. یک فایل دانلود می‌شود.",
                "محتوای کامل فایل JSON را در کادر همین صفحه بچسبانید و «ذخیره کلید» را بزنید.",
                "اگر سایت قبلاً در سرچ کنسول با حساب دیگری ثبت شده: در search.google.com/search-console → Settings → Users and permissions، ایمیل حساب سرویس را با دسترسی Owner اضافه کنید.",
                "دکمه «ثبت و آنالیز خودکار هر دو دامنه» را بزنید. اگر تأیید مالکیت نیاز به DNS داشت، رکورد TXT نمایش‌داده‌شده را در Cloudflare → DNS → Add record (نوع TXT، نام @) ثبت و دوباره دکمه را بزنید.",
              ]}
            />
          </GlassHelp>
        </div>

        {status.configured ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-700">
            <span>
              کلید گوگل ثبت شده: <span dir="ltr">{status.email}</span>
            </span>
            <button
              className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2 py-1 font-bold"
              onClick={async () => {
                if (!confirm("کلید گوگل حذف شود؟")) return;
                await deleteGscKey();
                await load();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> حذف
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea dir="ltr" rows={5} value={json} onChange={(e) => setJson(e.target.value)} className={inputCls} placeholder='{"type":"service_account","client_email":"...","private_key":"..."}' />
            <button onClick={() => void saveKey()} disabled={!json.trim() || !!busy} className="flex items-center gap-2 rounded-xl bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره کلید
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs">
            <span className="mb-1 block font-bold text-slate-600">دامنه اول</span>
            <input dir="ltr" value={d1} onChange={(e) => setD1(e.target.value)} className={inputCls} />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-bold text-slate-600">دامنه دوم</span>
            <input dir="ltr" value={d2} onChange={(e) => setD2(e.target.value)} className={inputCls} />
          </label>
        </div>
        <div className="mt-3">
          <AiEngineSelect value={engine} onChange={setEngine} label="موتور هوش مصنوعی برای تحلیل" />
        </div>
        <button onClick={() => void autoRun()} disabled={!status.configured || !!busy} className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
          {busy === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} ثبت و آنالیز خودکار هر دو دامنه
        </button>
        {!status.configured && <p className="mt-2 text-[11px] text-slate-400">ابتدا کلید گوگل را ثبت کنید.</p>}
      </div>

      {run?.ok && (
        <GlassModal title="نتیجه ثبت و آنالیز سرچ کنسول" onClose={() => setRun(null)}>
          <p className="rounded-xl bg-[#0b1e3f]/5 p-2">
            تحلیل با موتور: <b dir="ltr">{run.engine}</b>
          </p>
          {run.reports.map((r) => (
            <div key={r.domain} className="rounded-xl border border-white/60 bg-white/60 p-3">
              <div dir="ltr" className="mb-2 font-extrabold text-[#0b1e3f]">{r.domain}</div>
              <ul className="space-y-1">
                {r.steps.map((s) => (
                  <li key={s.step} className="flex items-start gap-1.5">
                    {s.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <XCircle className="h-4 w-4 shrink-0 text-rose-600" />}
                    <span><b>{s.step}:</b> {s.detail}</span>
                  </li>
                ))}
              </ul>
              {"verifyToken" in r && r.verifyToken && (
                <div dir="ltr" className="mt-2 break-all rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800">TXT: {r.verifyToken}</div>
              )}
              {"stats" in r && r.stats && (
                <div className="mt-2 text-[11px]">
                  کلیک: {r.stats.clicks} | نمایش: {r.stats.impressions} | CTR: {(r.stats.ctr * 100).toFixed(1)}٪ | میانگین رتبه: {r.stats.position.toFixed(1)}
                </div>
              )}
              {r.topQueries.length > 0 && (
                <div className="mt-2 text-[11px]">
                  پرتکرارترین جستجوها: {r.topQueries.slice(0, 8).map((q) => q.query).join("، ")}
                </div>
              )}
            </div>
          ))}
          <h4 className="font-extrabold text-[#0b1e3f]">راهنمایی‌های هوش مصنوعی</h4>
          <p className="whitespace-pre-line rounded-xl bg-white/70 p-3">{run.advice}</p>
        </GlassModal>
      )}
    </div>
  );
}
