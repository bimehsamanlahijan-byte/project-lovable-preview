import { useState, type ReactNode } from "react";
import { HelpCircle, X } from "lucide-react";

/** Frosted-glass help window used by the SEO / AI-keys / Search Console panes. */
export function GlassHelp({ title, children, label = "راهنما" }: { title: string; children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/70 px-2 py-1 text-[11px] font-bold text-[#0b1e3f] hover:bg-white"
      >
        <HelpCircle className="h-3.5 w-3.5" /> {label}
      </button>
      {open && <GlassModal title={title} onClose={() => setOpen(false)}>{children}</GlassModal>}
    </>
  );
}

export function GlassModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div dir="rtl" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/40 bg-white/75 p-6 text-slate-700 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-[#0b1e3f]">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white" aria-label="بستن">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 text-xs leading-6">{children}</div>
      </div>
    </div>
  );
}

/** Numbered step list helper. */
export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="list-inside list-decimal space-y-1">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ol>
  );
}

/** Cloudflare + cPanel env-var steps shared by every engine guide. */
export function EnvVarSteps({ name }: { name: string }) {
  return (
    <>
      <h4 className="font-extrabold text-[#0b1e3f]">ثبت متغیر در Cloudflare</h4>
      <Steps
        items={[
          "وارد dash.cloudflare.com شوید و از منوی چپ «Workers & Pages» را باز کنید.",
          "پروژه سایت را انتخاب کنید و به برگه «Settings» بروید.",
          "بخش «Variables and Secrets» → دکمه «Add».",
          <>نوع را «Secret» بگذارید، نام را دقیقاً <code dir="ltr" className="rounded bg-slate-100 px-1">{name}</code> بنویسید و کلید را در Value بچسبانید.</>,
          "«Deploy» یا «Save and deploy» را بزنید تا روی سایت اعمال شود.",
        ]}
      />
      <h4 className="font-extrabold text-[#0b1e3f]">ثبت متغیر در سی‌پنل (cPanel)</h4>
      <Steps
        items={[
          "وارد سی‌پنل هاست شوید.",
          "بخش «Setup Node.js App» (یا «Application Manager») را باز کنید.",
          "روی برنامه سایت «Edit» بزنید.",
          <>در قسمت «Environment variables» دکمه «Add Variable»، نام <code dir="ltr" className="rounded bg-slate-100 px-1">{name}</code> و مقدار کلید را وارد کنید.</>,
          "«Save» و سپس «Restart» را بزنید.",
        ]}
      />
      <p className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
        راه ساده‌تر: کلید را همین‌جا در پیشخوان وارد کنید؛ در بخش خصوصی دیتابیس ذخیره می‌شود و نیازی به ثبت متغیر نیست.
      </p>
    </>
  );
}
