import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2, Upload } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import {
  DEFAULT_HERO_SLIDER,
  DEFAULT_WHEEL_INTRO,
  type HeroSlide,
  type HeroSliderSettings,
  type WheelIntroSettings,
} from "@/lib/site-config";

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

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold text-slate-600 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-slate-400 mt-1 leading-5">{hint}</span>}
    </label>
  );
}

/** Slider + wheel-intro animation settings, editable from the visual editor menu. */
export function SliderPane() {
  const [cfg, setCfg] = useState<HeroSliderSettings>(DEFAULT_HERO_SLIDER);
  const [wheel, setWheel] = useState<WheelIntroSettings>(DEFAULT_WHEEL_INTRO);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const targetIdx = useRef<number>(0);

  useEffect(() => {
    void (async () => {
      setCfg(await adminReadSetting<HeroSliderSettings>("hero_slider", DEFAULT_HERO_SLIDER));
      setWheel(await adminReadSetting<WheelIntroSettings>("wheel_intro", DEFAULT_WHEEL_INTRO));
    })();
  }, []);

  const slides = cfg.slides ?? [];
  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    setCfg((p) => ({ ...p, slides: p.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));

  const save = async () => {
    setBusy(true);
    setMsg("");
    const a = await adminWriteSetting("hero_slider", cfg);
    const b = await adminWriteSetting("wheel_intro", wheel);
    setBusy(false);
    setMsg(a.error || b.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
  };

  return (
    <div className="space-y-5" dir="rtl">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            const url = await uploadFile(f, "slider");
            setSlide(targetIdx.current, { img: url });
          } catch {
            setMsg("آپلود ناموفق بود");
          }
          setBusy(false);
          e.target.value = "";
        }}
      />

      <section className={cardCls}>
        <h2 className="font-extrabold text-[#0b1e3f] mb-1">اسلایدر صفحه اصلی</h2>
        <p className="text-[11px] text-slate-500 leading-6 mb-4">
          تصاویر اسلایدر را آپلود یا آدرس‌دهی کنید، ابعاد و سرعت گردش را تعیین کنید و اسلاید اضافه یا حذف کنید.
          ابعاد پیشنهادی تصویر: ۱۹۲۰×۵۸۰ پیکسل (نسبت ۱۲۰۰×۳۶۰)، حجم کمتر از ۸ مگابایت، فرمت JPG یا WEBP.
          اگر هیچ اسلایدی اضافه نکنید، تصاویر پیش‌فرض سایت نمایش داده می‌شوند.
        </p>

        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <Row label="گردش خودکار">
            <select value={cfg.autoplay ? "1" : "0"} onChange={(e) => setCfg({ ...cfg, autoplay: e.target.value === "1" })} className={inputCls}>
              <option value="1">فعال</option>
              <option value="0">غیرفعال</option>
            </select>
          </Row>
          <Row label={`سرعت اسلایدر: ${cfg.autoplayMs} میلی‌ثانیه`} hint="هرچه عدد کمتر، گردش سریع‌تر">
            <input type="range" min={1500} max={12000} step={250} value={cfg.autoplayMs}
              onChange={(e) => setCfg({ ...cfg, autoplayMs: Number(e.target.value) })} className="w-full" />
          </Row>
          <Row label="نحوه نمایش تصویر">
            <select value={cfg.fit} onChange={(e) => setCfg({ ...cfg, fit: e.target.value as "cover" | "contain" })} className={inputCls}>
              <option value="cover">پر کردن کادر (Cover)</option>
              <option value="contain">نمایش کامل تصویر (Contain)</option>
            </select>
          </Row>
          <Row label="حلقه بی‌پایان">
            <select value={cfg.loop ? "1" : "0"} onChange={(e) => setCfg({ ...cfg, loop: e.target.value === "1" })} className={inputCls}>
              <option value="1">فعال</option>
              <option value="0">غیرفعال</option>
            </select>
          </Row>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-5">
          <Row label="نوع ابعاد">
            <select value={cfg.heightMode} onChange={(e) => setCfg({ ...cfg, heightMode: e.target.value as "ratio" | "fixed" })} className={inputCls}>
              <option value="ratio">نسبت تصویر</option>
              <option value="fixed">ارتفاع ثابت</option>
            </select>
          </Row>
          {cfg.heightMode === "ratio" ? (
            <>
              <Row label="عرض نسبت">
                <input dir="ltr" value={cfg.ratioW} onChange={(e) => setCfg({ ...cfg, ratioW: Number(e.target.value) || 1200 })} className={inputCls} />
              </Row>
              <Row label="ارتفاع نسبت">
                <input dir="ltr" value={cfg.ratioH} onChange={(e) => setCfg({ ...cfg, ratioH: Number(e.target.value) || 360 })} className={inputCls} />
              </Row>
            </>
          ) : (
            <Row label="ارتفاع (پیکسل)">
              <input dir="ltr" value={cfg.heightPx} onChange={(e) => setCfg({ ...cfg, heightPx: Number(e.target.value) || 420 })} className={inputCls} />
            </Row>
          )}
        </div>

        <div className="space-y-3">
          {slides.map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 grid md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-2 bg-slate-50 rounded-lg h-20 flex items-center justify-center overflow-hidden">
                {s.img ? <img src={s.img} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
              </div>
              <div className="md:col-span-6 space-y-2">
                <input dir="ltr" placeholder="آدرس تصویر" value={s.img} onChange={(e) => setSlide(i, { img: e.target.value })} className={inputCls} />
                <input placeholder="عنوان" value={s.title} onChange={(e) => setSlide(i, { title: e.target.value })} className={inputCls} />
                <input placeholder="زیرعنوان" value={s.subtitle} onChange={(e) => setSlide(i, { subtitle: e.target.value })} className={inputCls} />
              </div>
              <div className="md:col-span-3 space-y-2">
                <input placeholder="متن دکمه" value={s.cta} onChange={(e) => setSlide(i, { cta: e.target.value })} className={inputCls} />
                <input dir="ltr" placeholder="لینک دکمه" value={s.href} onChange={(e) => setSlide(i, { href: e.target.value })} className={inputCls} />
              </div>
              <div className="md:col-span-1 flex md:flex-col gap-2">
                <button onClick={() => { targetIdx.current = i; fileRef.current?.click(); }}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600" title="آپلود تصویر">
                  <Upload className="w-4 h-4" />
                </button>
                <button onClick={() => setCfg({ ...cfg, slides: slides.filter((_, idx) => idx !== i) })}
                  className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600" title="حذف اسلاید">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setCfg({ ...cfg, slides: [...slides, { img: "", title: "", subtitle: "", cta: "", href: "" }] })}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> افزودن اسلاید
          </button>
        </div>
      </section>

      <section className={cardCls}>
        <h2 className="font-extrabold text-[#0b1e3f] mb-1">دکمه خرید آنلاین و انیمیشن چرخ‌وفلک</h2>
        <p className="text-[11px] text-slate-500 leading-6 mb-4">
          دکمه ورودی بخش «ارائه کلیه خدمات بیمه‌ای»؛ با کلیک کاربر، چرخ‌وفلک با انیمیشن انتخابی وارد صحنه می‌شود.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <Row label="وضعیت دکمه">
            <select value={wheel.enabled ? "1" : "0"} onChange={(e) => setWheel({ ...wheel, enabled: e.target.value === "1" })} className={inputCls}>
              <option value="1">فعال (چرخ‌وفلک مخفی تا کلیک)</option>
              <option value="0">غیرفعال (نمایش مستقیم)</option>
            </select>
          </Row>
          <Row label="متن دکمه">
            <input value={wheel.buttonText} onChange={(e) => setWheel({ ...wheel, buttonText: e.target.value })} className={inputCls} />
          </Row>
          <Row label="متن راهنما زیر دکمه">
            <input value={wheel.hintText} onChange={(e) => setWheel({ ...wheel, hintText: e.target.value })} className={inputCls} />
          </Row>
          <Row label="نوع انیمیشن ورود">
            <select value={wheel.animation} onChange={(e) => setWheel({ ...wheel, animation: e.target.value as WheelIntroSettings["animation"] })} className={inputCls}>
              <option value="explode">انفجاری (چرخش و بزرگ‌شدن)</option>
              <option value="zoom">بزرگ‌نمایی</option>
              <option value="spin">چرخش کامل</option>
              <option value="flip">چرخش سه‌بعدی</option>
              <option value="fade">محو شدن</option>
            </select>
          </Row>
          <Row label={`مدت انیمیشن: ${wheel.durationMs} میلی‌ثانیه`}>
            <input type="range" min={300} max={2500} step={50} value={wheel.durationMs}
              onChange={(e) => setWheel({ ...wheel, durationMs: Number(e.target.value) })} className="w-full" />
          </Row>
          <Row label="ذرات انفجار">
            <select value={wheel.particles ? "1" : "0"} onChange={(e) => setWheel({ ...wheel, particles: e.target.value === "1" })} className={inputCls}>
              <option value="1">فعال</option>
              <option value="0">غیرفعال</option>
            </select>
          </Row>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy}
          className="bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-60">
          <Save className="w-4 h-4" /> ذخیره تنظیمات
        </button>
        {msg && <span className="text-xs font-bold text-emerald-600">{msg}</span>}
      </div>
    </div>
  );
}

export default SliderPane;
