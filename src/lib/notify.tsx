import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Check, Copy, X } from "lucide-react";

export type NotifyKind = "success" | "error";
export type NotifyPayload = { kind: NotifyKind; title: string; detail?: string };

const EVENT = "admin:notify";

export function notify(payload: NotifyPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<NotifyPayload>(EVENT, { detail: payload }));
}

export function notifySaved(what: string) {
  notify({
    kind: "success",
    title: "عملیات با موفقیت انجام شد",
    detail: `${what} ذخیره و روی وب‌سایت اصلی منتشر شد و هم‌اکنون برای بازدیدکنندگان قابل مشاهده است.`,
  });
}

export function notifyFailed(what: string, reason?: string) {
  notify({
    kind: "error",
    title: "عملیات انجام نشد",
    detail: reason ? `${what}: ${reason}` : `${what} ذخیره نشد. لطفاً دوباره تلاش کنید.`,
  });
}

/** Big, elegant confirmation banner. Mount once inside the dashboard. */
export function AdminToaster() {
  const [item, setItem] = useState<(NotifyPayload & { id: number }) | null>(null);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const detail = (e as CustomEvent<NotifyPayload>).detail;
      setItem({ ...detail, id: Date.now() });
      if (detail.kind === "error") {
        setPrompt(buildRepairPrompt(detail));
        setCopied(false);
      }
    };
    window.addEventListener(EVENT, onEvt);
    return () => window.removeEventListener(EVENT, onEvt);
  }, []);

  useEffect(() => {
    if (!item) return;
    if (item.kind === "error") return;
    const t = window.setTimeout(() => setItem(null), 3800);
    return () => window.clearTimeout(t);
  }, [item]);

  if (!item) return null;
  const ok = item.kind === "success";

  return (
    <div
      dir="rtl"
      className="fixed inset-x-0 top-4 z-[9999] flex justify-center px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto w-full max-w-md rounded-xl px-4 py-3 shadow-xl ring-1 backdrop-blur text-white animate-[admin-toast-in_.35s_ease-out] ${
          ok
            ? "bg-gradient-to-l from-emerald-600 to-emerald-500 ring-emerald-300/50"
            : "bg-gradient-to-l from-rose-600 to-rose-500 ring-rose-300/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 grid place-items-center flex-shrink-0">
            {ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold leading-6">{item.title}</div>
            {item.detail && <div className="text-xs opacity-95 leading-5 mt-0.5 break-words">{persianReason(item.detail)}</div>}
          </div>
          <button type="button" onClick={() => setItem(null)} className="p-1 rounded-md hover:bg-white/15" aria-label="بستن">
            <X className="w-4 h-4" />
          </button>
        </div>
        {!ok && (
          <div className="mt-3 rounded-lg bg-white/10 p-2.5">
            <label className="block text-[11px] font-bold mb-1.5">پرامپت فنی قابل ویرایش</label>
            <textarea
              dir="ltr"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="w-full resize-y rounded-md border border-white/25 bg-black/15 px-2.5 py-2 text-[10px] leading-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(prompt);
                setCopied(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-bold text-rose-700"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "کپی شد" : "کپی پرامپت"}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes admin-toast-in{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function persianReason(detail: string) {
  if (detail.includes("Missing Supabase environment variable")) {
    return "اتصال امن پایگاه داده در محیط اجرا کامل نیست. اتصال سرویس ابری را بررسی کنید.";
  }
  if (detail.includes("UNAUTHORIZED")) return "نشست مدیریت منقضی شده است؛ دوباره وارد پیشخوان شوید.";
  return detail;
}

function buildRepairPrompt(item: NotifyPayload) {
  const route = typeof window === "undefined" ? "/dashboard" : window.location.pathname;
  return `You are debugging a TanStack Start v1 + React 19 application deployed to Cloudflare.\n\nUser-visible failure: ${item.title}\nTechnical detail: ${item.detail ?? "No technical detail was returned"}\nRoute: ${route}\n\nPlease identify the root cause, inspect the server/client boundary and environment configuration, propose the smallest secure fix, and provide exact code changes. Do not expose secrets, weaken database access policies, or move privileged operations to the browser. Also check for related failures in sibling save paths.`;
}
