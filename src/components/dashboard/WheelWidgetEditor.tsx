import { unzipSync, strFromU8 } from "fflate";
import { useEffect, useRef, useState } from "react";
import { FileArchive, Save, Trash2 } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { DEFAULT_WHEEL_WIDGET, type WheelWidgetSettings } from "@/lib/site-config";

export function WheelWidgetEditor() {
  const [cfg, setCfg] = useState(DEFAULT_WHEEL_WIDGET); const [msg, setMsg] = useState(""); const file = useRef<HTMLInputElement>(null);
  useEffect(() => { void adminReadSetting<WheelWidgetSettings>("wheel_widget", DEFAULT_WHEEL_WIDGET).then(setCfg); }, []);
  async function readZip(zip: File) {
    if (zip.size > 16 * 1024 * 1024) { setMsg("حجم ZIP باید کمتر از ۱۶ مگابایت باشد."); return; }
    try {
      const entries = unzipSync(new Uint8Array(await zip.arrayBuffer()));
      const names = Object.keys(entries);
      const entry = names.find((n) => /(^|\/)index\.html?$/i.test(n)) ?? names.find((n) => /\.html?$/i.test(n));
      if (!entry || !entries[entry]) { setMsg("فایل index.html داخل ZIP پیدا نشد."); return; }
      setCfg({ enabled: true, name: zip.name, html: strFromU8(entries[entry]) }); setMsg("بسته آماده است؛ برای اعمال، ذخیره کنید.");
    } catch { setMsg("ZIP معتبر نیست یا خوانده نشد."); }
  }
  async function save() { const r = await adminWriteSetting("wheel_widget", cfg); setMsg(r.ok ? "ویجت ذخیره شد ✓" : "ذخیره انجام نشد"); }
  return <section dir="rtl" className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
    <div><h2 className="font-extrabold text-slate-900">انیمیشن و ویجت بخش خدمات بیمه‌ای</h2><p className="mt-1 text-[11px] leading-6 text-slate-500">کد آماده یا ZIP خودکفا با فایل index.html را وارد کنید. ویجت در محیط محدود اجرا می‌شود و تصویر پس‌زمینه ذخیره‌شده دست‌نخورده می‌ماند.</p></div>
    <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={cfg.enabled} onChange={(e)=>setCfg({...cfg,enabled:e.target.checked})}/> نمایش ویجت روی تصویر</label>
    <input className="w-full rounded-lg border px-3 py-2 text-xs" value={cfg.name} onChange={(e)=>setCfg({...cfg,name:e.target.value})} placeholder="نام ویجت"/>
    <textarea dir="ltr" className="min-h-48 w-full rounded-lg border px-3 py-2 text-left font-mono text-xs" value={cfg.html} onChange={(e)=>setCfg({...cfg,html:e.target.value})} placeholder="کد HTML / CSS / JavaScript آماده"/>
    <input ref={file} type="file" accept=".zip,application/zip" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(f) void readZip(f); e.currentTarget.value="";}}/>
    <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>file.current?.click()} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"><FileArchive className="h-4 w-4"/>بارگذاری ZIP</button><button type="button" onClick={()=>setCfg(DEFAULT_WHEEL_WIDGET)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700"><Trash2 className="h-4 w-4"/>پاک‌کردن ویجت</button><button type="button" onClick={()=>void save()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Save className="h-4 w-4"/>ذخیره</button></div>
    {msg && <p className="text-xs font-bold text-emerald-700">{msg}</p>}
  </section>;
}