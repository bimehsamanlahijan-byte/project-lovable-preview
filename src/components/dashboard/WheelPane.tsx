import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Save, Trash2, Upload } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { DEFAULT_WHEEL_INTRO, type WheelIntroSettings } from "@/lib/site-config";

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

/** Floating buy-online button + wheel center logo settings. */
export function WheelPane() {
  const [cfg, setCfg] = useState<WheelIntroSettings>(DEFAULT_WHEEL_INTRO);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    void (async () => {
      setCfg(await adminReadSetting<WheelIntroSettings>("wheel_intro", DEFAULT_WHEEL_INTRO));
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    setMsg("");
    const r = await adminWriteSetting("wheel_intro", cfg);
    setBusy(false);
    setMsg(r.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
  };

  const move = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.round(((clientX - r.left - r.width / 2) / r.width) * 200);
    const y = Math.round(((clientY - r.top - r.height / 2) / r.height) * 200);
    setCfg((p) => ({
      ...p,
      buttonX: Math.max(-120, Math.min(120, x)),
      buttonY: Math.max(-120, Math.min(120, y)),
    }));
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
            const url = await uploadFile(f, "wheel");
            setCfg((p) => ({ ...p, centerImageUrl: url }));
          } catch {
            setMsg("آپلود ناموفق بود");
          }
          setBusy(false);
          e.target.value = "";
        }}
      />

      <section className={cardCls}>
        <h2 className="font-extrabold text-[#0b1e3f] mb-1">دکمه شناور «خرید آنلاین»</h2>
        <p className="text-[11px] text-slate-500 leading-6 mb-4">
          دکمه را داخل کادر پیش‌نمایش بکشید تا جای آن روی پس‌زمینه چرخ‌وفلک تعیین شود؛ اندازه و حالت شناور را هم می‌توانید تغییر دهید.
        </p>

        <div className="grid md:grid-cols-[320px_1fr] gap-5 items-start">
          <div
            ref={stageRef}
            className="relative aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden select-none"
            onMouseMove={(e) => dragging.current && move(e.clientX, e.clientY)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (dragging.current && t) move(t.clientX, t.clientY);
            }}
            onTouchEnd={() => (dragging.current = false)}
          >
            <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-slate-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onMouseDown={() => (dragging.current = true)}
                onTouchStart={() => (dragging.current = true)}
                className="cursor-move rounded-full px-5 py-2.5 text-white font-extrabold text-xs bg-gradient-to-l from-red-700 to-red-500 shadow-lg ring-4 ring-white/70"
                style={{
                  transform: `translate(${cfg.buttonX}%, ${cfg.buttonY}%) scale(${cfg.buttonScale})`,
                }}
              >
                {cfg.buttonText || "خرید آنلاین بیمه"}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Row label="متن دکمه">
              <input value={cfg.buttonText} onChange={(e) => setCfg({ ...cfg, buttonText: e.target.value })} className={inputCls} />
            </Row>
            <Row label="متن زیر دکمه">
              <input value={cfg.hintText} onChange={(e) => setCfg({ ...cfg, hintText: e.target.value })} className={inputCls} />
            </Row>
            <Row label={`اندازه دکمه: ${Math.round(cfg.buttonScale * 100)}%`}>
              <input type="range" min={50} max={200} step={5} value={Math.round(cfg.buttonScale * 100)}
                onChange={(e) => setCfg({ ...cfg, buttonScale: Number(e.target.value) / 100 })} className="w-full" />
            </Row>
            <Row label="حالت شناور (بالا و پایین رفتن آرام)">
              <select value={cfg.float ? "1" : "0"} onChange={(e) => setCfg({ ...cfg, float: e.target.value === "1" })} className={inputCls}>
                <option value="1">فعال</option>
                <option value="0">غیرفعال</option>
              </select>
            </Row>
            <Row label={`جابجایی افقی: ${cfg.buttonX}%`}>
              <input type="range" min={-120} max={120} value={cfg.buttonX}
                onChange={(e) => setCfg({ ...cfg, buttonX: Number(e.target.value) })} className="w-full" />
            </Row>
            <Row label={`جابجایی عمودی: ${cfg.buttonY}%`}>
              <input type="range" min={-120} max={120} value={cfg.buttonY}
                onChange={(e) => setCfg({ ...cfg, buttonY: Number(e.target.value) })} className="w-full" />
            </Row>
          </div>
        </div>
      </section>

      <section className={cardCls}>
        <h2 className="font-extrabold text-[#0b1e3f] mb-1">دایره وسط چرخ‌وفلک (لوگو و نوشته‌ها)</h2>
        <p className="text-[11px] text-slate-500 leading-6 mb-4">
          می‌توانید به‌جای آیکن سپر، لوگو یا عکس دلخواه آپلود کنید و عنوان و زیرعنوان وسط چرخ را تغییر دهید.
        </p>
        <div className="grid md:grid-cols-4 gap-3 items-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 aspect-square grid place-items-center overflow-hidden">
            {cfg.centerImageUrl ? (
              <img src={cfg.centerImageUrl} alt="" className="w-full h-full object-contain p-3" />
            ) : (
              <ImageIcon className="w-7 h-7 text-slate-400" />
            )}
          </div>
          <div className="md:col-span-3 grid sm:grid-cols-2 gap-3">
            <Row label="آدرس تصویر / لوگو">
              <input dir="ltr" value={cfg.centerImageUrl} onChange={(e) => setCfg({ ...cfg, centerImageUrl: e.target.value })} className={inputCls} />
            </Row>
            <Row label={`اندازه تصویر: ${cfg.centerImageSize}px`}>
              <input type="range" min={32} max={140} value={cfg.centerImageSize}
                onChange={(e) => setCfg({ ...cfg, centerImageSize: Number(e.target.value) })} className="w-full" />
            </Row>
            <Row label="عنوان وسط چرخ">
              <input value={cfg.centerTitle} onChange={(e) => setCfg({ ...cfg, centerTitle: e.target.value })} className={inputCls} />
            </Row>
            <Row label="زیرعنوان وسط چرخ">
              <input value={cfg.centerSubtitle} onChange={(e) => setCfg({ ...cfg, centerSubtitle: e.target.value })} className={inputCls} />
            </Row>
            <div className="flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> آپلود تصویر
              </button>
              {cfg.centerImageUrl && (
                <button onClick={() => setCfg({ ...cfg, centerImageUrl: "" })}
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" /> حذف تصویر
                </button>
              )}
            </div>
          </div>
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

export default WheelPane;
