import { useEffect, useState } from "react";
import { Images, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import {
  DEFAULT_WHEEL_BACKGROUND,
  WHEEL_BG_MODES,
  pickWheelBgIndex,
  type WheelBackgroundSettings,
  type WheelBgImage,
} from "@/lib/site-config";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const cardCls = "bg-white rounded-2xl border border-slate-200 p-5";
const MEDIA_FOLDERS = ["media", "images", "banners", "misc"];

type Asset = { name: string; path: string; url: string; mime: string | null };

const emptyImage = (): WheelBgImage => ({ url: "", label: "تصویر جدید", zoom: 100, posX: 50, posY: 50 });

/** Editable background (image list + zoom + timed / calendar slideshow) for the wheel section. */
export function WheelBackgroundEditor() {
  const [cfg, setCfg] = useState<WheelBackgroundSettings>(DEFAULT_WHEEL_BACKGROUND);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [folder, setFolder] = useState("media");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [pickerFor, setPickerFor] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      setCfg(await adminReadSetting<WheelBackgroundSettings>("wheel_background", DEFAULT_WHEEL_BACKGROUND));
    })();
  }, []);

  async function loadAssets() {
    try {
      const res = await fetch(`/api/admin/assets?folder=${encodeURIComponent(folder)}`);
      const json = (await res.json()) as { files?: Asset[] };
      setAssets((json.files ?? []).filter((f) => !f.mime?.startsWith("video/")));
    } catch {
      setAssets([]);
    }
  }

  useEffect(() => {
    if (pickerFor !== null) void loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerFor, folder]);

  const patch = (i: number, p: Partial<WheelBgImage>) =>
    setCfg((c) => ({ ...c, images: c.images.map((im, idx) => (idx === i ? { ...im, ...p } : im)) }));

  async function save() {
    setBusy(true);
    setMsg("");
    const r = await adminWriteSetting("wheel_background", cfg);
    setBusy(false);
    setMsg(r.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
  }

  const previewIndex = pickWheelBgIndex(cfg, new Date(), 0);
  const preview = cfg.images[previewIndex];

  return (
    <section className={cardCls} dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h2 className="font-extrabold text-[#0b1e3f]">تصویر پس‌زمینه سکشن «خدمات بیمه‌ای»</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCfg((c) => ({ ...c, images: [...c.images, emptyImage()] }))}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white"
          >
            <Plus className="w-4 h-4" /> تصویر جدید
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> ذخیره
          </button>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-6 mb-4">
        تصویرها را از «کتابخانه رسانه» انتخاب کنید یا نشانی آن‌ها را بچسبانید. برای هر تصویر می‌توانید
        بزرگ‌نمایی و مرکز کادر را تنظیم کنید و نوع چرخش را روی اسلاید زمان‌دار، ساعتی، روزانه، ماهانه یا
        فصلی بگذارید (مناسب بنر ویژه و تصویر طبیعت در فصل‌های سال).
      </p>
      {msg && <div className="mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">نوع چرخش</span>
          <select
            value={cfg.mode}
            onChange={(e) => setCfg({ ...cfg, mode: e.target.value as WheelBackgroundSettings["mode"] })}
            className={inputCls}
          >
            {WHEEL_BG_MODES.map((m) => (
              <option key={m.v} value={m.v}>{m.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">زمان هر اسلاید (ثانیه)</span>
          <input
            type="number"
            min={2}
            max={600}
            value={Math.round((cfg.intervalMs || 8000) / 1000)}
            onChange={(e) => setCfg({ ...cfg, intervalMs: Math.max(2, Number(e.target.value)) * 1000 })}
            className={inputCls}
          />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">سرعت محوشدن (میلی‌ثانیه)</span>
          <input
            type="number"
            min={0}
            max={4000}
            step={100}
            value={cfg.fadeMs}
            onChange={(e) => setCfg({ ...cfg, fadeMs: Number(e.target.value) })}
            className={inputCls}
          />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">نحوه پرشدن کادر</span>
          <select
            value={cfg.fit}
            onChange={(e) => setCfg({ ...cfg, fit: e.target.value as WheelBackgroundSettings["fit"] })}
            className={inputCls}
          >
            <option value="cover">پر کردن کامل</option>
            <option value="contain">نمایش کامل تصویر</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">شفافیت پرده سفید: {cfg.overlay}%</span>
          <input
            type="range"
            min={0}
            max={90}
            value={cfg.overlay}
            onChange={(e) => setCfg({ ...cfg, overlay: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-4">
        <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
        نمایش تصویر پس‌زمینه روی سایت
      </label>

      {preview?.url && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 h-40 relative bg-slate-100">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url("${preview.url}")`,
              backgroundSize: cfg.fit === "contain" ? "contain" : "cover",
              backgroundPosition: `${preview.posX}% ${preview.posY}%`,
              transform: `scale(${Math.max(50, preview.zoom) / 100})`,
              transformOrigin: `${preview.posX}% ${preview.posY}%`,
            }}
          />
          <div className="absolute inset-0 bg-white" style={{ opacity: cfg.overlay / 100 }} />
          <span className="absolute bottom-2 right-2 text-[11px] bg-white/80 rounded px-2 py-1 font-bold">
            پیش‌نمایش تصویر فعال: {preview.label}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {cfg.images.map((img, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-2 h-16 rounded-lg bg-slate-100 overflow-hidden">
              {img.url ? <img src={img.url} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <label className="md:col-span-3 text-xs">
              <span className="block font-bold text-slate-600 mb-1">نام تصویر</span>
              <input value={img.label} onChange={(e) => patch(i, { label: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-5 text-xs">
              <span className="block font-bold text-slate-600 mb-1">نشانی تصویر</span>
              <input dir="ltr" value={img.url} onChange={(e) => patch(i, { url: e.target.value })} placeholder="/api/public/asset/media/..." className={inputCls} />
            </label>
            <div className="md:col-span-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => setPickerFor(pickerFor === i ? null : i)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-2 py-2 text-[11px] font-bold text-slate-700"
              >
                <Images className="w-3.5 h-3.5" /> کتابخانه
              </button>
              <button
                type="button"
                onClick={() => setCfg((c) => ({ ...c, images: c.images.filter((_, idx) => idx !== i) }))}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                aria-label="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <label className="md:col-span-4 text-xs">
              <span className="block font-bold text-slate-600 mb-1">بزرگ‌نمایی: {img.zoom}%</span>
              <input type="range" min={100} max={300} value={img.zoom} onChange={(e) => patch(i, { zoom: Number(e.target.value) })} className="w-full" />
            </label>
            <label className="md:col-span-4 text-xs">
              <span className="block font-bold text-slate-600 mb-1">مرکز افقی: {img.posX}%</span>
              <input type="range" min={0} max={100} value={img.posX} onChange={(e) => patch(i, { posX: Number(e.target.value) })} className="w-full" />
            </label>
            <label className="md:col-span-4 text-xs">
              <span className="block font-bold text-slate-600 mb-1">مرکز عمودی: {img.posY}%</span>
              <input type="range" min={0} max={100} value={img.posY} onChange={(e) => patch(i, { posY: Number(e.target.value) })} className="w-full" />
            </label>

            {pickerFor === i && (
              <div className="md:col-span-12 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <select value={folder} onChange={(e) => setFolder(e.target.value)} className="text-xs rounded-lg border border-slate-300 px-2 py-1.5 bg-white">
                    {MEDIA_FOLDERS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => void loadAssets()} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <RefreshCw className="w-3.5 h-3.5" /> بازخوانی
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto">
                  {assets.map((a) => (
                    <button
                      key={a.path}
                      type="button"
                      onClick={() => {
                        patch(i, { url: a.url, label: img.label || a.name });
                        setPickerFor(null);
                      }}
                      className="rounded-lg overflow-hidden border border-slate-200 hover:border-red-400"
                    >
                      <img src={a.url} alt={a.name} loading="lazy" className="h-16 w-full object-cover" />
                    </button>
                  ))}
                  {assets.length === 0 && <p className="text-[11px] text-slate-500 col-span-full">در این پوشه تصویری نیست.</p>}
                </div>
              </div>
            )}
          </div>
        ))}
        {cfg.images.length === 0 && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-6 text-center">
            هنوز تصویری اضافه نشده؛ تا زمانی که تصویری ثبت نشود، پس‌زمینه فعلی سایت نمایش داده می‌شود.
          </p>
        )}
      </div>
    </section>
  );
}
