/**
 * Right-hand settings panel for overlay layers (visual editor).
 * Sends patches to the editor iframe; the iframe owns the live list and
 * reports it back (ve:ov-list) for publishing.
 */
import { unzipSync, strFromU8 } from "fflate";
import { Pipette, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { OverlayContentKind, OverlayItem } from "@/lib/overlays";

const inputCls = "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm";
const labelCls = "block text-[11px] font-bold text-slate-600 mb-1";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

/** Native color input + eyedropper (where the browser supports it). */
function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const pick = async () => {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> } }).EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const res = await new EyeDropperCtor().open();
      onChange(res.sRGBHex);
    } catch {
      /* user cancelled */
    }
  };
  const hex = /^#([0-9a-f]{6})$/i.test(value) ? value : "#0b1e3f";
  return (
    <div className="flex items-center gap-1.5">
      <input type="color" value={hex} onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white" />
      <input dir="ltr" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="#0b1e3f یا rgba(...)" className={inputCls} />
      {"EyeDropper" in window && (
        <button type="button" onClick={() => void pick()} title="قطره‌چکان"
          className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">
          <Pipette className="w-4 h-4 text-slate-600" />
        </button>
      )}
    </div>
  );
}

export function OverlayPanel({
  item,
  onPatch,
  onDelete,
  onClose,
}: {
  item: OverlayItem;
  onPatch: (id: string, patch: Partial<OverlayItem>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const c = item.content ?? { kind: "none" as const };
  const s = item.style ?? {};
  const it = item.interaction ?? { block: true, action: "none" as const };

  const patchContent = (p: Partial<OverlayItem["content"]>) =>
    onPatch(item.id, { content: { ...c, ...p } });
  const patchStyle = (p: Partial<OverlayItem["style"]>) =>
    onPatch(item.id, { style: { ...s, ...p } });
  const patchInteraction = (p: Partial<OverlayItem["interaction"]>) =>
    onPatch(item.id, { interaction: { ...it, ...p } });

  const onZip = async (file: File) => {
    setBusy(true);
    try {
      const files = unzipSync(new Uint8Array(await file.arrayBuffer()));
      const names = Object.keys(files);
      const entry =
        names.find((n) => /(^|\/)index\.html?$/i.test(n)) ?? names.find((n) => /\.html?$/i.test(n));
      if (!entry) {
        alert("داخل فایل ZIP هیچ فایل HTML پیدا نشد.");
        return;
      }
      patchContent({ kind: "widget", widget: { name: file.name, html: strFromU8(files[entry]!) } });
    } catch {
      alert("خواندن فایل ZIP ممکن نشد.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border-2 border-blue-600/40 bg-blue-50/40 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#0b1e3f]">لایه پوشاننده</h3>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => { if (confirm("این لایه حذف شود؟")) onDelete(item.id); }}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200" title="حذف لایه">
            <Trash2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-slate-300 bg-white" title="بستن">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Row label="نام لایه">
        <input value={item.label ?? ""} onChange={(e) => onPatch(item.id, { label: e.target.value })} className={inputCls} />
      </Row>

      <div className="grid grid-cols-2 gap-2">
        <Row label="حالت لایه">
          <select value={item.mode} onChange={(e) => onPatch(item.id, { mode: e.target.value as OverlayItem["mode"] })} className={inputCls}>
            <option value="cover">فقط پوشش (بدون محتوا)</option>
            <option value="cover-content">پوشش + محتوا</option>
            <option value="interactive">تعاملی</option>
            <option value="transparent">شفاف (نامرئی)</option>
          </select>
        </Row>
        <Row label="ترتیب لایه (z-index)">
          <input type="number" dir="ltr" value={item.zIndex} onChange={(e) => onPatch(item.id, { zIndex: Number(e.target.value) || 0 })} className={inputCls} />
        </Row>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={item.visible} onChange={(e) => onPatch(item.id, { visible: e.target.checked })} />
          نمایش لایه
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={item.locked} onChange={(e) => onPatch(item.id, { locked: e.target.checked })} />
          قفل (جابه‌جایی ممنوع)
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={item.responsive?.sameForAll !== false}
            onChange={(e) => onPatch(item.id, { responsive: { ...item.responsive, sameForAll: e.target.checked } })} />
          یکسان در همه اندازه‌ها
        </label>
      </div>

      {/* ---------- content ---------- */}
      <Row label="نوع محتوا">
        <select value={c.kind} onChange={(e) => patchContent({ kind: e.target.value as OverlayContentKind })} className={inputCls}>
          <option value="none">بدون محتوا</option>
          <option value="text">متن</option>
          <option value="image">تصویر</option>
          <option value="html">HTML / CSS / JS</option>
          <option value="iframe">iframe (صفحه دیگر)</option>
          <option value="widget">ویجت (فایل ZIP)</option>
        </select>
      </Row>

      {c.kind === "text" && (
        <>
          <Row label="متن">
            <textarea rows={3} value={c.text ?? ""} onChange={(e) => patchContent({ text: e.target.value })} className={inputCls} />
          </Row>
          <Row label="رنگ متن">
            <ColorField value={c.textStyle?.["color"] ?? "#ffffff"} onChange={(v) => patchContent({ textStyle: { ...c.textStyle, color: v } })} />
          </Row>
          <div className="grid grid-cols-2 gap-2">
            <Row label="اندازه فونت">
              <input dir="ltr" value={c.textStyle?.["font-size"] ?? "16px"} onChange={(e) => patchContent({ textStyle: { ...c.textStyle, "font-size": e.target.value } })} className={inputCls} />
            </Row>
            <Row label="تراز متن">
              <select value={c.textStyle?.["text-align"] ?? "center"} onChange={(e) => patchContent({ textStyle: { ...c.textStyle, "text-align": e.target.value } })} className={inputCls}>
                <option value="right">راست</option>
                <option value="center">وسط</option>
                <option value="left">چپ</option>
              </select>
            </Row>
          </div>
        </>
      )}

      {c.kind === "image" && (
        <>
          <Row label="آدرس تصویر">
            <input dir="ltr" value={c.image?.src ?? ""} onChange={(e) => patchContent({ image: { ...c.image, src: e.target.value } })} className={inputCls} placeholder="https://…" />
          </Row>
          <Row label="لینک تصویر (اختیاری)">
            <input dir="ltr" value={c.image?.href ?? ""} onChange={(e) => patchContent({ image: { ...c.image, href: e.target.value } })} className={inputCls} placeholder="https://…" />
          </Row>
        </>
      )}

      {c.kind === "html" && (
        <>
          <Row label="HTML">
            <textarea dir="ltr" rows={4} value={c.html ?? ""} onChange={(e) => patchContent({ html: e.target.value })} className={`${inputCls} font-mono text-xs`} />
          </Row>
          <Row label="CSS">
            <textarea dir="ltr" rows={3} value={c.css ?? ""} onChange={(e) => patchContent({ css: e.target.value })} className={`${inputCls} font-mono text-xs`} />
          </Row>
          <Row label="JavaScript (در محیط امن اجرا می‌شود)">
            <textarea dir="ltr" rows={3} value={c.js ?? ""} onChange={(e) => patchContent({ js: e.target.value })} className={`${inputCls} font-mono text-xs`} />
          </Row>
        </>
      )}

      {c.kind === "iframe" && (
        <Row label="آدرس iframe">
          <input dir="ltr" value={c.iframeSrc ?? ""} onChange={(e) => patchContent({ iframeSrc: e.target.value })} className={inputCls} placeholder="https://…" />
        </Row>
      )}

      <label className="flex items-start gap-2 text-xs rounded-xl border border-blue-200 bg-blue-50/60 p-2">
        <input type="checkbox" className="mt-0.5" checked={c.iframeProxy === true}
          onChange={(e) => patchContent({ iframeProxy: e.target.checked })} />
        <span>
          <span className="font-bold">حالت سازگاری برای لینک خارجی / بک‌لینک</span>
          <span className="block text-[10px] text-slate-500 leading-5">
            یک نسخهٔ فقط‌خواندنی از مسیر سازگاری درخواست می‌شود. اگر سایت مقصد تأیید انسانی بخواهد، مقصد را در تب جدا باز کنید؛ سامانهٔ امنیتی آن سایت دور زده نمی‌شود.
          </span>
        </span>
      </label>


      {c.kind === "widget" && (
        <Row label={c.widget?.name ? `ویجت فعلی: ${c.widget.name}` : "فایل ZIP ویجت (دارای index.html)"}>
          <input type="file" accept=".zip" disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void onZip(f); }}
            className="w-full text-xs" />
        </Row>
      )}

      {/* ---------- button ---------- */}
      <details className="rounded-xl border border-slate-200 bg-white p-2">
        <summary className="text-[11px] font-bold text-slate-600 cursor-pointer">دکمه داخل لایه (اختیاری)</summary>
        <div className="mt-2 space-y-2">
          <input value={c.button?.label ?? ""} onChange={(e) => patchContent({ button: { ...c.button, label: e.target.value } })} placeholder="متن دکمه" className={inputCls} />
          <input dir="ltr" value={c.button?.href ?? ""} onChange={(e) => patchContent({ button: { ...c.button, href: e.target.value } })} placeholder="https://…" className={inputCls} />
          <ColorField value={c.button?.bg ?? "#0b1e3f"} onChange={(v) => patchContent({ button: { ...c.button, bg: v } })} />
        </div>
      </details>

      {/* ---------- style ---------- */}
      <Row label="رنگ پس‌زمینه لایه">
        <ColorField value={s.background ?? "rgba(11,30,63,0.55)"} onChange={(v) => patchStyle({ background: v })} />
      </Row>
      <div className="grid grid-cols-2 gap-2">
        <Row label={`شفافیت: ${Math.round((s.opacity ?? 1) * 100)}٪`}>
          <input type="range" min={0} max={100} value={Math.round((s.opacity ?? 1) * 100)}
            onChange={(e) => patchStyle({ opacity: Number(e.target.value) / 100 })} className="w-full" dir="ltr" />
        </Row>
        <Row label="گردی گوشه‌ها">
          <input dir="ltr" value={s.radius ?? ""} onChange={(e) => patchStyle({ radius: e.target.value })} placeholder="12px" className={inputCls} />
        </Row>
      </div>

      {/* ---------- interaction ---------- */}
      <label className="flex items-center gap-1.5 text-xs">
        <input type="checkbox" checked={it.block} onChange={(e) => patchInteraction({ block: e.target.checked })} />
        مسدود کردن کلیک روی عنصر زیرین
      </label>
      <Row label="کنش کلیک روی لایه">
        <select value={it.action} onChange={(e) => patchInteraction({ action: e.target.value as OverlayItem["interaction"]["action"] })} className={inputCls}>
          <option value="none">هیچ‌کدام</option>
          <option value="url">باز کردن لینک</option>
          <option value="popup">پاپ‌آپ</option>
          <option value="modal">مودال</option>
          <option value="js">اجرای کد</option>
          <option value="toggle">نمایش / مخفی</option>
        </select>
      </Row>
      {it.action === "url" && (
        <div className="grid grid-cols-2 gap-2">
          <input dir="ltr" value={it.url ?? ""} onChange={(e) => patchInteraction({ url: e.target.value })} placeholder="https://…" className={inputCls} />
          <select value={it.target ?? "_self"} onChange={(e) => patchInteraction({ target: e.target.value })} className={inputCls}>
            <option value="_self">همین صفحه</option>
            <option value="_blank">تب جدید</option>
          </select>
        </div>
      )}
      {(it.action === "popup" || it.action === "modal") && (
        <textarea rows={3} value={it.popupHtml ?? ""} onChange={(e) => patchInteraction({ popupHtml: e.target.value })}
          placeholder="متن یا HTML پاپ‌آپ" className={inputCls} />
      )}
      {it.action === "js" && (
        <textarea dir="ltr" rows={3} value={it.js ?? ""} onChange={(e) => patchInteraction({ js: e.target.value })}
          placeholder="کد JavaScript" className={`${inputCls} font-mono text-xs`} />
      )}

      <p className="text-[10px] text-slate-500 leading-5">
        برای جابه‌جایی یا تغییر اندازه، لایه را داخل پیش‌نمایش بکشید یا از دستگیره‌های گوشه استفاده کنید.
      </p>
    </div>
  );
}
