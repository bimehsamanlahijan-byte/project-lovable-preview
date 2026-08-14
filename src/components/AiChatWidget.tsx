import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Loader2 } from "lucide-react";
import {
  DEFAULT_AI,
  DEFAULT_WIDGETS,
  readSetting,
  type AiAssistantSettings,
  type WidgetsAppearance,
} from "@/lib/site-config";
import { WidgetLauncher } from "./WidgetLauncher";

type Msg = { role: "user" | "assistant"; content: string };

const NAVY = "#0b1e3f";
const RED = "#16305f"; // navy accent (Saman navy theme)

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<AiAssistantSettings>(DEFAULT_AI);
  const [ui, setUi] = useState<WidgetsAppearance>(DEFAULT_WIDGETS);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    readSetting<AiAssistantSettings>("ai_assistant", DEFAULT_AI).then(setCfg);
    readSetting<WidgetsAppearance>("widgets", DEFAULT_WIDGETS).then(setUi);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy, open]);

  if (!cfg.enabled) return null;

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20) }),
      });
      const data = (await res.json()) as { ok: boolean; reply?: string; error?: string };
      if (!res.ok || !data.ok || !data.reply) {
        setError(
          data.error === "rate_limited"
            ? "تعداد درخواست‌ها زیاد است، چند لحظه بعد تلاش کنید."
            : data.error === "credits_exhausted"
              ? "اعتبار سرویس هوش مصنوعی به پایان رسیده است."
              : "پاسخ‌گویی هوش مصنوعی موقتاً ممکن نیست.",
        );
      } else {
        setMsgs((p) => [...p, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setError("خطای شبکه — اتصال اینترنت را بررسی کنید.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div dir="rtl" className="fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-3">
      {open && (
        <div
          style={{ width: `min(92vw, ${ui.widthPx}px)`, height: `min(76vh, ${ui.heightPx}px)` }}
          className="rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          <div
            className="flex items-center justify-between gap-2 px-4 py-3 text-white"
            style={{ background: `linear-gradient(to left, ${NAVY}, ${RED})` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {ui.aiIconUrl ? (
                <img src={ui.aiIconUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/60" />
              ) : (
                <Bot className="w-5 h-5 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{cfg.title}</div>
                <div className="text-[10px] opacity-80" dir="ltr">
                  {cfg.model}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="بستن" className="p-1 rounded-lg hover:bg-white/20">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            <div className="text-xs bg-white border border-slate-200 rounded-xl p-3 leading-6 text-slate-700">
              {cfg.welcome}
            </div>
            {msgs.map((m, i) => (
              <div
                key={i}
                style={m.role === "user" ? { backgroundColor: NAVY } : undefined}
                className={`max-w-[85%] text-xs leading-6 rounded-2xl px-3 py-2 whitespace-pre-wrap ${
                  m.role === "user"
                    ? "text-white ms-auto rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> در حال پاسخ‌گویی…
              </div>
            )}
            {error && <div className="text-xs text-rose-600 bg-rose-50 rounded-xl p-2">{error}</div>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="p-2 border-t border-slate-200 flex items-center gap-2 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سؤال خود را بنویسید…"
              className="flex-1 text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-[#0b1e3f]"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              style={{ backgroundColor: RED }}
              className="p-2 rounded-xl text-white disabled:opacity-50"
              aria-label="ارسال"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <WidgetLauncher
        onClick={() => setOpen((v) => !v)}
        iconUrl={ui.aiIconUrl}
        Icon={Bot}
        label={ui.aiLauncherLabel}
        size={ui.launcherSizePx}
        open={open}
      />
    </div>
  );
}
