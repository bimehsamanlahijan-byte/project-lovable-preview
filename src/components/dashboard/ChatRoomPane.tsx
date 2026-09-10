import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { useEffect, useRef, useState } from "react";
import { Save, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_LIVE_CHAT, type LiveChatSettings } from "@/lib/site-config";

type RoomMsg = { id: string; session_id: string; display_name: string; body: string; is_staff: boolean; created_at: string };
const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

export function ChatRoomPane() {
  const [cfg, setCfg] = useState<LiveChatSettings>(DEFAULT_LIVE_CHAT);
  const [msgs, setMsgs] = useState<RoomMsg[]>([]);
  const [reply, setReply] = useState("");
  const [activeSid, setActiveSid] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void (async () => {
      setCfg(await adminReadSetting<LiveChatSettings>("live_chat", DEFAULT_LIVE_CHAT));
      const { data } = await adminDb("chat_room_messages").select("*").order("created_at", { ascending: false }).limit(120);
      setMsgs(((data ?? []) as RoomMsg[]).slice().reverse());
    })();

    const channel = supabase
      .channel("dash_chat_room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_room_messages" }, (p) =>
        setMsgs((x) => [...x, p.new as RoomMsg]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, activeSid]);

  const threads = (() => {
    const map = new Map<string, { sid: string; name: string; last: string; at: string }>();
    for (const m of msgs) {
      if (!m.session_id || m.session_id === "staff") continue;
      const prev = map.get(m.session_id);
      map.set(m.session_id, {
        sid: m.session_id,
        name: m.is_staff ? (prev?.name ?? "بازدیدکننده") : m.display_name,
        last: m.body,
        at: m.created_at,
      });
    }
    return [...map.values()].sort((a, b) => (a.at < b.at ? 1 : -1));
  })();

  useEffect(() => {
    if (!activeSid && threads.length) setActiveSid(threads[0]!.sid);
  }, [threads, activeSid]);

  const thread = activeSid ? msgs.filter((m) => m.session_id === activeSid) : [];

  async function send() {
    const body = reply.trim();
    if (!body) return;
    if (!activeSid) {
      setMsg("ابتدا یک گفتگو را انتخاب کنید.");
      return;
    }
    const { error } = await adminDb("chat_room_messages")
      .insert({ session_id: activeSid, display_name: "پشتیبانی نمایندگی", body, is_staff: true });
    if (error) setMsg("ارسال پیام کارشناس نیاز به ورود دارد.");
    else setReply("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f]">چت روم آنلاین</h1>
          <p className="text-sm text-slate-500 mt-1">مشاهده و پاسخ به گفتگوهای زنده بازدیدکنندگان.</p>
        </div>
        <button
          onClick={async () => {
            const r = await adminWriteSetting("live_chat", cfg);
            setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓");
          }}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white"
        >
          <Save className="w-4 h-4" /> ذخیره تنظیمات
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-3 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان چت روم</span>
          <input value={cfg.title} onChange={(e) => setCfg({ ...cfg, title: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">پیام خوش‌آمد</span>
          <input value={cfg.welcome} onChange={(e) => setCfg({ ...cfg, welcome: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs flex items-end gap-2">
          <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش چت روم در سایت</span>
        </label>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-3 h-[60vh] overflow-y-auto">
        <div className="text-xs font-bold text-slate-600 mb-2">گفتگوها</div>
        {threads.length === 0 && <div className="text-[11px] text-slate-400">گفتگویی وجود ندارد.</div>}
        {threads.map((t) => (
          <button
            key={t.sid}
            onClick={() => setActiveSid(t.sid)}
            className={`w-full text-right rounded-xl px-3 py-2 mb-1 text-[11px] ${activeSid === t.sid ? "bg-teal-600 text-white" : "bg-slate-50 hover:bg-slate-100"}`}
          >
            <div className="font-bold truncate">{t.name}</div>
            <div className="opacity-70 truncate" dir="ltr">{t.sid.slice(0, 10)}…</div>
            <div className="opacity-70 truncate">{t.last}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
          {thread.map((m) => (
            <div key={m.id} className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs leading-6 ${m.is_staff ? "bg-teal-600 text-white ms-auto" : "bg-white border border-slate-200"}`}>
              <div className={`text-[10px] mb-0.5 ${m.is_staff ? "text-white/80" : "text-slate-500"}`}>
                {m.display_name} — {new Date(m.created_at).toLocaleTimeString("fa-IR")}
              </div>
              {m.body}
              {!m.is_staff && (
                <button
                  onClick={async () => {
                    await adminDb("chat_room_messages").delete().eq("id", m.id);
                    setMsgs((p) => p.filter((x) => x.id !== m.id));
                  }}
                  className="ms-2 text-rose-600 align-middle"
                  aria-label="حذف پیام"
                >
                  <Trash2 className="w-3 h-3 inline" />
                </button>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="p-3 border-t border-slate-200 flex gap-2"
        >
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="پاسخ کارشناس…" className={inputCls} />
          <button type="submit" className="p-2 rounded-xl bg-teal-600 text-white shrink-0" aria-label="ارسال">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
