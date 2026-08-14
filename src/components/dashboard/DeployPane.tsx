import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { useEffect, useState } from "react";
import { Cloud, Save, Copy, Check } from "lucide-react";


type Deploy = {
  domain: string;
  wwwRedirect: boolean;
  projectName: string;
  buildCommand: string;
  outputDir: string;
  notes: string;
};

const DEFAULT_DEPLOY: Deploy = {
  domain: "example.ir",
  wwwRedirect: true,
  projectName: "azarakhsh-saman",
  buildCommand: "bun run build",
  outputDir: ".output/public",
  notes: "پس از اتصال دامنه، رکورد CNAME را در پنل دامنه به Cloudflare Pages منتقل کنید.",
};

const ENV_VARS = [
  ["LOVABLE_API_KEY", "کلید دروازه هوش مصنوعی — برای کارکرد همه موتورهای هوش مصنوعی در Cloudflare الزامی است (Secret)"],
  ["SUPABASE_URL", "آدرس سرویس داده و مخزن مدارک (سمت سرور)"],
  ["SUPABASE_PUBLISHABLE_KEY", "کلید عمومی سرویس داده (سمت سرور)"],
  ["VITE_SUPABASE_URL", "همان آدرس سرویس داده برای سمت مرورگر"],
  ["VITE_SUPABASE_PUBLISHABLE_KEY", "کلید عمومی سمت مرورگر"],
  ["VITE_SUPABASE_PROJECT_ID", "شناسه پروژه سرویس داده"],
];

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

export function DeployPane() {
  const [cfg, setCfg] = useState<Deploy>(DEFAULT_DEPLOY);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    adminReadSetting<Deploy>("cloudflare_deploy", DEFAULT_DEPLOY).then(setCfg);
  }, []);

  const copy = async (t: string) => {
    await navigator.clipboard.writeText(t);
    setCopied(t);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
            <Cloud className="w-6 h-6" /> انتشار در Cloudflare و دامنه اختصاصی
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            تنظیمات و کلیدهای موردنیاز تا هوش مصنوعی، چت و مخزن مدارک روی Cloudflare کار کند.
          </p>
        </div>
        <button
          onClick={async () => {
            const r = await adminWriteSetting("cloudflare_deploy", cfg);
            setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓");
          }}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white"
        >
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">دامنه اختصاصی</span>
          <input dir="ltr" value={cfg.domain} onChange={(e) => setCfg({ ...cfg, domain: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">نام پروژه در Cloudflare</span>
          <input dir="ltr" value={cfg.projectName} onChange={(e) => setCfg({ ...cfg, projectName: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">دستور بیلد</span>
          <input dir="ltr" value={cfg.buildCommand} onChange={(e) => setCfg({ ...cfg, buildCommand: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">پوشه خروجی</span>
          <input dir="ltr" value={cfg.outputDir} onChange={(e) => setCfg({ ...cfg, outputDir: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">یادداشت‌ها</span>
          <textarea rows={3} value={cfg.notes} onChange={(e) => setCfg({ ...cfg, notes: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={cfg.wwwRedirect} onChange={(e) => setCfg({ ...cfg, wwwRedirect: e.target.checked })} />
          <span className="font-bold text-slate-600">انتقال www به دامنه اصلی</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3">متغیرهای محیطی موردنیاز در Cloudflare</h2>
        <div className="space-y-2">
          {ENV_VARS.map(([k, d]) => (
            <div key={k} className="flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-2">
              <code dir="ltr" className="text-[11px] font-bold text-[#0b1e3f] shrink-0">{k}</code>
              <span className="text-[11px] text-slate-500 flex-1">{d}</span>
              <button onClick={() => void copy(k)} className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0" aria-label="کپی">
                {copied === k ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500 leading-6">
          این مقادیر را در Cloudflare Pages → Settings → Variables and Secrets، برای هر دو محیط Production و Preview ثبت کنید.
          بدون <code dir="ltr">LOVABLE_API_KEY</code> چت هوش مصنوعی روی Cloudflare پاسخ نمی‌دهد.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3">مراحل انتشار</h2>
        <ol className="text-xs text-slate-600 space-y-2 leading-6 list-decimal ps-5">
          <li>در Cloudflare Pages پروژه‌ای با نام <b dir="ltr">{cfg.projectName}</b> بسازید و مخزن گیت را متصل کنید.</li>
          <li>
            دستور بیلد: <code dir="ltr">{cfg.buildCommand}</code> و پوشه خروجی: <code dir="ltr">{cfg.outputDir}</code>
          </li>
          <li>متغیرهای بالا را ثبت کنید (کلیدها را به‌صورت Secret).</li>
          <li>
            در بخش Custom domains دامنه <b dir="ltr">{cfg.domain}</b>
            {cfg.wwwRedirect && (
              <>
                {" "}و <b dir="ltr">www.{cfg.domain}</b>
              </>
            )}{" "}
            را اضافه و رکوردهای DNS پیشنهادی Cloudflare را ثبت کنید.
          </li>
          <li>پس از فعال شدن SSL، آدرس دامنه را در تنظیمات ورود/احراز هویت به فهرست مجاز اضافه کنید.</li>
        </ol>
        <p className="mt-3 text-[11px] text-slate-500">راهنمای کامل در فایل <code dir="ltr">CLOUDFLARE.md</code> پروژه موجود است.</p>
      </div>
    </div>
  );
}
