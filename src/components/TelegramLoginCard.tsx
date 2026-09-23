import { useEffect, useRef, useState } from "react";
import { Loader2, Send, ShieldCheck, Smartphone } from "lucide-react";

/** Telegram-styled login card shown inside the AI chat. */
export function TelegramLoginCard({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<"idle" | "starting" | "waiting" | "error">("idle");
  const [botUrl, setBotUrl] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  async function start() {
    setState("starting");
    try {
      const res = await fetch("/api/public/auth/telegram/bot-login", { method: "POST" });
      const data = (await res.json()) as { ok: boolean; botUrl?: string };
      if (!data.ok || !data.botUrl) throw new Error("start_failed");
      setBotUrl(data.botUrl);
      window.open(data.botUrl, "_blank", "noopener");
      setState("waiting");
      const startedAt = Date.now();
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(async () => {
        if (Date.now() - startedAt > 10 * 60 * 1000) {
          if (timer.current) clearInterval(timer.current);
          setState("error");
          return;
        }
        try {
          const r = await fetch("/api/public/auth/telegram/bot-login");
          const d = (await r.json()) as { ok: boolean };
          if (d.ok) {
            if (timer.current) clearInterval(timer.current);
            onDone();
          }
        } catch {
          /* keep polling */
        }
      }, 2500);
    } catch {
      setState("error");
    }
  }

  return (
    <div
      className="rounded-2xl p-[2px] shadow-lg"
      style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9 45%, #7c4dff)" }}
    >
      <div className="rounded-[14px] bg-white p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow"
            style={{ background: "linear-gradient(135deg, #37BBFE, #007DBB)" }}
          >
            <Send className="w-4 h-4 -rotate-12" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">ورود سریع با تلگرام</div>
            <div className="text-[11px] text-slate-500">برای ادامه‌ی گفتگو، یک بار وارد شوید</div>
          </div>
        </div>

        <ul className="text-[11px] leading-6 text-slate-600 space-y-1">
          <li className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-sky-500" /> در ربات روی «ارسال شماره من» بزنید
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> پس از تأیید، ۵ سؤال رایگان فعال می‌شود
          </li>
        </ul>

        <button
          type="button"
          onClick={() => void start()}
          disabled={state === "starting"}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #2AABEE, #229ED9)" }}
        >
          {state === "starting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {state === "waiting" ? "باز کردن دوباره‌ی ربات" : "ورود با تلگرام"}
        </button>

        {state === "waiting" && (
          <div className="flex items-center gap-2 text-[11px] text-sky-700 bg-sky-50 rounded-lg p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> در انتظار ارسال شماره در ربات…
            {botUrl && (
              <a href={botUrl} target="_blank" rel="noopener noreferrer" className="ms-auto underline">
                ربات
              </a>
            )}
          </div>
        )}
        {state === "error" && (
          <div className="text-[11px] text-rose-600 bg-rose-50 rounded-lg p-2">
            اتصال به ربات برقرار نشد. دوباره تلاش کنید.
          </div>
        )}
      </div>
    </div>
  );
}
