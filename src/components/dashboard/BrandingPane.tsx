import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Save, Upload, RefreshCw } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { DASHBOARD_LOGO, DEFAULT_BRANDING, DEFAULT_SPLASH, DEFAULT_WIDGETS, type Branding, type SplashSettings, type WidgetsAppearance } from "@/lib/site-config";
import { SITE_LOGO, SITE_LOGO_HEADER } from "@/components/site-data";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const cardCls = "bg-white rounded-2xl border border-slate-200 p-5";

async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as { url: string };
  return json.url;
}

function LogoField({
  label,
  value,
  fallback,
  height,
  onChange,
}: {
  label: string;
  value: string;
  fallback?: string;
  height: number;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const src = value || fallback || "";
  return (
    <div className="grid md:grid-cols-12 gap-3 items-end">
      <div className="md:col-span-2 flex items-center justify-center bg-slate-50 rounded-xl p-2 min-h-16">
        {src ? (
          <img src={src} alt={label} style={{ height }} className="object-contain" />
        ) : (
          <ImageIcon className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <label className="md:col-span-7 text-xs">
        <span className="block font-bold text-slate-600 mb-1">{label}</span>
        <input dir="ltr" value={value} placeholder="/api/public/asset/... یا https://..." onChange={(e) => onChange(e.target.value)} className={inputCls} />
      </label>
      <div className="md:col-span-3 flex gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            try {
              onChange(await uploadFile(f, "branding"));
            } catch (err) {
              alert(`آپلود ناموفق: ${err instanceof Error ? err.message : String(err)}`);
            }
            setBusy(false);
          }}
        />
        <button onClick={() => ref.current?.click()} disabled={busy} className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50">
          <Upload className="w-4 h-4" /> {busy ? "..." : "آپلود"}
        </button>
        {value && (
          <button onClick={() => onChange("")} className="text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            حذف
          </button>
        )}
      </div>
    </div>
  );
}

function SplashSection() {
  const [s, setS] = useState<SplashSettings>(DEFAULT_SPLASH);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void adminReadSetting<SplashSettings>("splash", DEFAULT_SPLASH).then(setS);
  }, []);

  async function save() {
    const res = await adminWriteSetting("splash", s);
    setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "صفحه بارگذاری ذخیره شد ✓");
  }

  return (
    <div className={`${cardCls} mt-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-extrabold text-[#0b1e3f]">صفحه بارگذاری سایت (لوگو پیش از ورود)</h2>
        <button onClick={() => void save()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white">
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div
        className="mb-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-8"
        style={{ background: s.bgColor }}
      >
        {s.logoCode ? (
          <div dangerouslySetInnerHTML={{ __html: s.logoCode }} />
        ) : s.logoUrl ? (
          <img src={s.logoUrl} alt="splash" style={{ height: s.logoHeight }} className="object-contain" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-400" />
        )}
        {s.text && <div className="mt-3 text-xs font-bold" style={{ color: s.textColor }}>{s.text}</div>}
        {s.showBar && (
          <div className="mt-4 h-1 w-28 rounded-full overflow-hidden" style={{ background: `${s.barColor}22` }}>
            <div className="h-full w-1/3 rounded-full" style={{ background: s.barColor }} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <LogoField label="لوگوی صفحه بارگذاری" value={s.logoUrl} fallback={DEFAULT_SPLASH.logoUrl} height={40} onChange={(logoUrl) => setS({ ...s, logoUrl })} />
      </div>

      <label className="text-xs block mb-5">
        <span className="block font-bold text-slate-600 mb-1">جاسازی کد (SVG/HTML) به‌جای آپلود لوگو — در صورت پر بودن، جایگزین تصویر می‌شود</span>
        <textarea dir="ltr" rows={3} value={s.logoCode} onChange={(e) => setS({ ...s, logoCode: e.target.value })} className={`${inputCls} font-mono`} placeholder="<svg ...>...</svg>" />
      </label>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">رنگ پس‌زمینه</span>
          <div className="flex gap-2">
            <input type="color" value={s.bgColor} onChange={(e) => setS({ ...s, bgColor: e.target.value })} className="h-9 w-12 rounded-lg border border-slate-300" />
            <input dir="ltr" value={s.bgColor} onChange={(e) => setS({ ...s, bgColor: e.target.value })} className={inputCls} />
          </div>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">رنگ نوار بارگذاری</span>
          <div className="flex gap-2">
            <input type="color" value={s.barColor} onChange={(e) => setS({ ...s, barColor: e.target.value })} className="h-9 w-12 rounded-lg border border-slate-300" />
            <input dir="ltr" value={s.barColor} onChange={(e) => setS({ ...s, barColor: e.target.value })} className={inputCls} />
          </div>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">رنگ متن</span>
          <div className="flex gap-2">
            <input type="color" value={s.textColor} onChange={(e) => setS({ ...s, textColor: e.target.value })} className="h-9 w-12 rounded-lg border border-slate-300" />
            <input dir="ltr" value={s.textColor} onChange={(e) => setS({ ...s, textColor: e.target.value })} className={inputCls} />
          </div>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">ارتفاع لوگو (px)</span>
          <input type="number" value={s.logoHeight} onChange={(e) => setS({ ...s, logoHeight: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">مدت نمایش (میلی‌ثانیه)</span>
          <input type="number" value={s.minMs} onChange={(e) => setS({ ...s, minMs: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">متن زیر لوگو (اختیاری)</span>
          <input value={s.text} onChange={(e) => setS({ ...s, text: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={s.enabled} onChange={(e) => setS({ ...s, enabled: e.target.checked })} />
          <span className="font-bold text-slate-600">فعال بودن صفحه بارگذاری</span>
        </label>
        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={s.showBar} onChange={(e) => setS({ ...s, showBar: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش نوار بارگذاری</span>
        </label>
        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={s.oncePerSession} onChange={(e) => setS({ ...s, oncePerSession: e.target.checked })} />
          <span className="font-bold text-slate-600">فقط یک‌بار در هر بازدید</span>
        </label>
      </div>
    </div>
  );
}

function WidgetsSection() {
  const [w, setW] = useState<WidgetsAppearance>(DEFAULT_WIDGETS);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void adminReadSetting<WidgetsAppearance>("widgets", DEFAULT_WIDGETS).then(setW);
  }, []);

  async function save() {
    const res = await adminWriteSetting("widgets", w);
    setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "پنجره‌های شناور ذخیره شد ✓");
  }

  return (
    <div className={`${cardCls} mt-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-extrabold text-[#0b1e3f]">پنجره‌های شناور (چت آنلاین و هوش مصنوعی)</h2>
        <button onClick={() => void save()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white">
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="space-y-5 mb-5">
        <LogoField label="آیکن دایره‌ای چت آنلاین (سمت راست)" value={w.chatIconUrl} height={40} onChange={(chatIconUrl) => setW({ ...w, chatIconUrl })} />
        <LogoField label="آیکن دایره‌ای دستیار هوش مصنوعی (سمت چپ)" value={w.aiIconUrl} height={40} onChange={(aiIconUrl) => setW({ ...w, aiIconUrl })} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عرض پنجره (px)</span>
          <input type="number" value={w.widthPx} onChange={(e) => setW({ ...w, widthPx: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">ارتفاع پنجره (px)</span>
          <input type="number" value={w.heightPx} onChange={(e) => setW({ ...w, heightPx: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">اندازه آیکن دایره‌ای (px)</span>
          <input type="number" value={w.launcherSizePx} onChange={(e) => setW({ ...w, launcherSizePx: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان دکمه چت آنلاین</span>
          <input value={w.chatLauncherLabel} onChange={(e) => setW({ ...w, chatLauncherLabel: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان دکمه هوش مصنوعی</span>
          <input value={w.aiLauncherLabel} onChange={(e) => setW({ ...w, aiLauncherLabel: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان بخش شبکه‌های اجتماعی در چت</span>
          <input value={w.socialTitle} onChange={(e) => setW({ ...w, socialTitle: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs flex items-center gap-2 md:col-span-3">
          <input type="checkbox" checked={w.showSocialInChat} onChange={(e) => setW({ ...w, showSocialInChat: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش دکمه‌های شبکه‌های اجتماعی داخل پنجره چت آنلاین</span>
        </label>
      </div>
      <p className="mt-3 text-[11px] text-slate-500 leading-6">
        آیکن‌ها و فهرست شبکه‌های اجتماعی از منوی «شبکه‌های اجتماعی» پیشخوان قابل افزودن، ویرایش و حذف است.
      </p>
    </div>
  );
}

export function BrandingPane() {
  const [cfg, setCfg] = useState<Branding>(DEFAULT_BRANDING);
  const [msg, setMsg] = useState("");

  async function load() {
    setCfg(await adminReadSetting<Branding>("branding", DEFAULT_BRANDING));
  }
  useEffect(() => {
    void load();
  }, []);

  async function save() {
    const res = await adminWriteSetting("branding", cfg);
    setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "ذخیره شد ✓ — روی سایت اعمال شد.");
  }


  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
            <ImageIcon className="w-6 h-6" /> لوگو، آیکن‌ها و عنوان سایت
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            لوگوی هدر و فوتر، آیکن نوار مرورگر (favicon) و عنوان/توضیح سایت را آپلود و ویرایش کنید.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            <RefreshCw className="w-4 h-4" /> بازخوانی
          </button>
          <button onClick={() => void save()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white">
            <Save className="w-4 h-4" /> ذخیره
          </button>
        </div>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className={`${cardCls} space-y-5 mb-6`}>
        <LogoField label="لوگوی هدر" value={cfg.headerLogoUrl} fallback={SITE_LOGO_HEADER} height={cfg.logoHeightHeader} onChange={(headerLogoUrl) => setCfg({ ...cfg, headerLogoUrl })} />
        <LogoField label="لوگوی فوتر" value={cfg.footerLogoUrl} fallback={SITE_LOGO} height={cfg.logoHeightFooter} onChange={(footerLogoUrl) => setCfg({ ...cfg, footerLogoUrl })} />
        <LogoField label="آیکن نوار مرورگر (favicon)" value={cfg.faviconUrl} fallback="/favicon.png" height={24} onChange={(faviconUrl) => setCfg({ ...cfg, faviconUrl })} />
        <LogoField label="لوگوی پیشخوان مدیریت" value={cfg.dashboardLogoUrl} fallback={DASHBOARD_LOGO} height={cfg.logoHeightDashboard} onChange={(dashboardLogoUrl) => setCfg({ ...cfg, dashboardLogoUrl })} />
      </div>

      <div className={`${cardCls} grid md:grid-cols-2 gap-4`}>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">عنوان سایت (تایتل مرورگر و نتایج جستجو)</span>
          <input value={cfg.siteTitle} onChange={(e) => setCfg({ ...cfg, siteTitle: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">توضیح کوتاه سایت</span>
          <textarea rows={2} value={cfg.siteDescription} onChange={(e) => setCfg({ ...cfg, siteDescription: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">ارتفاع لوگوی هدر (px)</span>
          <input type="number" value={cfg.logoHeightHeader} onChange={(e) => setCfg({ ...cfg, logoHeightHeader: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">ارتفاع لوگوی فوتر (px)</span>
          <input type="number" value={cfg.logoHeightFooter} onChange={(e) => setCfg({ ...cfg, logoHeightFooter: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">ارتفاع لوگوی پیشخوان (px)</span>
          <input type="number" value={cfg.logoHeightDashboard} onChange={(e) => setCfg({ ...cfg, logoHeightDashboard: Number(e.target.value) })} className={inputCls} />
        </label>
      </div>

      <SplashSection />
      <WidgetsSection />
    </div>

  );
}
