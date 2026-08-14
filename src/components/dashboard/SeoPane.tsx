import { useEffect, useState } from "react";
import { Search, Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { DEFAULT_SEO, SEO_SETTING_KEY, normalizeBase, type SeoConfig, type SeoPage } from "@/lib/seo-config";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

export function SeoPane() {
  const [cfg, setCfg] = useState<SeoConfig>(DEFAULT_SEO);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminReadSetting<SeoConfig>(SEO_SETTING_KEY, DEFAULT_SEO).then(setCfg);
  }, []);

  const setPage = (i: number, patch: Partial<SeoPage>) =>
    setCfg((c) => ({ ...c, pages: c.pages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) }));

  const move = (i: number, dir: -1 | 1) =>
    setCfg((c) => {
      const pages = [...c.pages];
      const j = i + dir;
      if (j < 0 || j >= pages.length) return c;
      [pages[i], pages[j]] = [pages[j], pages[i]];
      return { ...c, pages };
    });

  const add = () =>
    setCfg((c) => ({
      ...c,
      pages: [
        ...c.pages,
        {
          id: `p-${Date.now()}`,
          path: "/",
          title: "صفحه جدید",
          description: "",
          sitelink: true,
          inSitemap: true,
          priority: "0.8",
          changefreq: "weekly",
        },
      ],
    }));

  const base = normalizeBase(cfg.siteUrl);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
            <Search className="w-6 h-6" /> سئو و نمایش صفحات در نتایج گوگل
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            صفحه‌هایی که می‌خواهید زیر دامنه اصلی در نتایج گوگل (سایت‌لینک) دیده شوند را اینجا بسازید و مرتب کنید.
          </p>
        </div>
        <button
          onClick={async () => {
            const r = await adminWriteSetting(SEO_SETTING_KEY, cfg);
            setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓ (نقشه سایت به‌روز شد)");
          }}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white"
        >
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">آدرس دامنه اصلی (با https)</span>
          <input dir="ltr" placeholder="https://example.ir" value={cfg.siteUrl}
            onChange={(e) => setCfg({ ...cfg, siteUrl: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">نام سایت (برای گوگل)</span>
          <input value={cfg.siteName} onChange={(e) => setCfg({ ...cfg, siteName: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان پیش‌فرض صفحه اصلی</span>
          <input value={cfg.defaultTitle} onChange={(e) => setCfg({ ...cfg, defaultTitle: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">آدرس جستجوی داخلی (اختیاری)</span>
          <input dir="ltr" placeholder="https://example.ir/search?q={search_term_string}" value={cfg.searchUrlTemplate}
            onChange={(e) => setCfg({ ...cfg, searchUrlTemplate: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">توضیح پیش‌فرض (متنی که زیر عنوان در گوگل دیده می‌شود)</span>
          <textarea rows={2} value={cfg.defaultDescription}
            onChange={(e) => setCfg({ ...cfg, defaultDescription: e.target.value })} className={inputCls} />
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
          <a dir="ltr" href="/sitemap.xml" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#0b1e3f] font-bold">
            <ExternalLink className="w-3.5 h-3.5" /> /sitemap.xml
          </a>
          <a dir="ltr" href="/robots.txt" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#0b1e3f] font-bold">
            <ExternalLink className="w-3.5 h-3.5" /> /robots.txt
          </a>
          <span>پس از ذخیره، نقشه سایت را در Google Search Console ثبت کنید تا صفحات سریع‌تر ایندکس شوند.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-[#0b1e3f]">صفحات سایت (ترتیب = اولویت نمایش زیر نتیجه اصلی)</h2>
          <button onClick={add} className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
            <Plus className="w-4 h-4" /> افزودن صفحه
          </button>
        </div>

        <div className="space-y-3">
          {cfg.pages.map((p, i) => (
            <div key={p.id} className="border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-2 items-center">
              <div className="md:col-span-3">
                <input dir="ltr" value={p.path} onChange={(e) => setPage(i, { path: e.target.value })} className={inputCls} placeholder="/insurance" />
              </div>
              <div className="md:col-span-3">
                <input value={p.title} onChange={(e) => setPage(i, { title: e.target.value })} className={inputCls} placeholder="عنوان" />
              </div>
              <div className="md:col-span-3">
                <input value={p.description} onChange={(e) => setPage(i, { description: e.target.value })} className={inputCls} placeholder="توضیح کوتاه" />
              </div>
              <div className="md:col-span-3 flex items-center justify-between gap-2 flex-wrap">
                <label className="text-[11px] flex items-center gap-1">
                  <input type="checkbox" checked={p.sitelink} onChange={(e) => setPage(i, { sitelink: e.target.checked })} />
                  زیر نتیجه گوگل
                </label>
                <label className="text-[11px] flex items-center gap-1">
                  <input type="checkbox" checked={p.inSitemap !== false} onChange={(e) => setPage(i, { inSitemap: e.target.checked })} />
                  نقشه سایت
                </label>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(i, -1)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="بالا">
                    <ArrowUp className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => move(i, 1)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="پایین">
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setCfg((c) => ({ ...c, pages: c.pages.filter((_, idx) => idx !== i) }))}
                    className="p-1.5 rounded-lg hover:bg-rose-50"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
              {base && (
                <div dir="ltr" className="md:col-span-12 text-[11px] text-slate-400">{base}{p.path}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
