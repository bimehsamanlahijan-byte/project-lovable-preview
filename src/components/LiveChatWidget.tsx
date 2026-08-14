import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Send, X, Paperclip, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_DOCS,
  DEFAULT_LIVE_CHAT,
  DEFAULT_WIDGETS,
  readSetting,
  sessionId,
  type DocsIntakeSettings,
  type LiveChatSettings,
  type SocialLink,
  type WidgetsAppearance,
} from "@/lib/site-config";
import { SocialIcon } from "./SocialIcon";
import { WidgetLauncher } from "./WidgetLauncher";

type RoomMsg = {
  id: string;
  session_id: string;
  display_name: string;
  body: string;
  is_staff: boolean;
  created_at: string;
};

const NAVY = "#0b1e3f";
const RED = "#16305f"; // navy accent (Saman navy theme)

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "docs">("chat");
  const [cfg, setCfg] = useState<LiveChatSettings>(DEFAULT_LIVE_CHAT);
  const [docsCfg, setDocsCfg] = useState<DocsIntakeSettings>(DEFAULT_DOCS);
  const [ui, setUi] = useState<WidgetsAppearance>(DEFAULT_WIDGETS);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [msgs, setMsgs] = useState<RoomMsg[]>([]);
  const [name, setName] = useState("مهمان");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const sid = sessionId();

  useEffect(() => {
    readSetting<LiveChatSettings>("live_chat", DEFAULT_LIVE_CHAT).then(setCfg);
    readSetting<DocsIntakeSettings>("docs_intake", DEFAULT_DOCS).then(setDocsCfg);
    readSetting<WidgetsAppearance>("widgets", DEFAULT_WIDGETS).then(setUi);
    supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("position", { ascending: true })
      .then(({ data }) => setSocials((data ?? []) as SocialLink[]));
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("azarakhsh_chat_name") : null;
    if (saved) setName(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("chat_room_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (alive) setMsgs(((data ?? []) as RoomMsg[]).slice().reverse());
    })();

    const channel = supabase
      .channel("chat_room_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_room_messages" },
        (payload) => setMsgs((p) => [...p, payload.new as RoomMsg]),
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, tab, open]);

  if (!cfg.enabled) return null;

  async function send() {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    const display = name.trim() || "مهمان";
    window.localStorage.setItem("azarakhsh_chat_name", display);
    const { error } = await supabase
      .from("chat_room_messages")
      .insert({ session_id: sid, display_name: display, body });
    if (!error) setInput("");
    setSending(false);
  }

  return (
    <div dir="rtl" className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div
          style={{ width: `min(92vw, ${ui.widthPx}px)`, height: `min(76vh, ${ui.heightPx}px)` }}
          className="rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          <div
            className="flex items-center justify-between gap-2 px-4 py-3 text-white"
            style={{ background: `linear-gradient(to right, ${NAVY}, ${RED})` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {ui.chatIconUrl ? (
                <img src={ui.chatIconUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/60" />
              ) : (
                <MessagesSquare className="w-5 h-5 shrink-0" />
              )}
              <div className="text-sm font-bold truncate">{cfg.title}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="بستن" className="p-1 rounded-lg hover:bg-white/20">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex text-xs border-b border-slate-200 bg-slate-50">
            {(
              [
                ["chat", "گفتگوی آنلاین"],
                ["docs", docsCfg.title],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={tab === k ? { color: NAVY, borderColor: RED } : undefined}
                className={`flex-1 py-2.5 font-bold transition ${
                  tab === k ? "bg-white border-b-2" : "text-slate-500"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {tab === "chat" ? (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
                <div className="text-xs bg-white border border-slate-200 rounded-xl p-3 leading-6 text-slate-700">
                  {cfg.welcome}
                </div>
                {msgs.map((m) => {
                  const mine = m.session_id === sid;
                  return (
                    <div
                      key={m.id}
                      style={mine ? { backgroundColor: NAVY } : undefined}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-6 whitespace-pre-wrap ${
                        mine
                          ? "text-white ms-auto rounded-br-sm"
                          : m.is_staff
                            ? "bg-amber-50 border border-amber-200 text-slate-800"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                      }`}
                    >
                      <div className={`text-[10px] mb-0.5 ${mine ? "text-white/80" : "text-slate-500"}`}>
                        {m.is_staff ? "پشتیبانی نمایندگی" : m.display_name}
                      </div>
                      {m.body}
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {ui.showSocialInChat && socials.length > 0 && (
                <div className="px-3 py-2 border-t border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-slate-500 mb-1.5">{ui.socialTitle}</div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {socials.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target={s.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        title={`${s.label}${s.username ? ` — ${s.username}` : ""}`}
                        className="hover:opacity-80 transition"
                      >
                        <SocialIcon
                          platform={s.platform}
                          iconKey={s.icon_key}
                          customIconUrl={s.custom_icon_url}
                          size={26}
                          shape="circle"
                          label={s.label}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2 border-t border-slate-200 bg-white space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام شما"
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-[#0b1e3f]"
                />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="پیام خود را بنویسید…"
                    className="flex-1 text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-[#0b1e3f]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    style={{ backgroundColor: RED }}
                    className="p-2 rounded-xl text-white disabled:opacity-50"
                    aria-label="ارسال"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <DocsUpload cfg={docsCfg} sid={sid} />
          )}
        </div>
      )}

      <WidgetLauncher
        onClick={() => setOpen((v) => !v)}
        iconUrl={ui.chatIconUrl}
        Icon={MessagesSquare}
        label={ui.chatLauncherLabel}
        size={ui.launcherSizePx}
        open={open}
      />
    </div>
  );
}

function DocsUpload({ cfg, sid }: { cfg: DocsIntakeSettings; sid: string }) {
  const [cats, setCats] = useState<{ id: string; label: string }[]>([]);
  const [form, setForm] = useState({ full_name: "", phone: "", category: "", note: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("document_categories")
      .select("id,label")
      .eq("is_active", true)
      .order("position", { ascending: true })
      .then(({ data }) => setCats((data ?? []) as { id: string; label: string }[]));
  }, []);

  if (!cfg.enabled)
    return <div className="p-4 text-xs text-slate-500">ارسال مدارک فعلاً غیرفعال است.</div>;

  async function submit() {
    setError(null);
    if (!form.full_name.trim() || !form.phone.trim()) return setError("نام و شماره تماس الزامی است.");
    if (files.length === 0) return setError("حداقل یک فایل انتخاب کنید.");
    const tooBig = files.find((f) => f.size > cfg.maxSizeMb * 1024 * 1024);
    if (tooBig) return setError(`حجم فایل «${tooBig.name}» بیش از ${cfg.maxSizeMb} مگابایت است.`);

    setBusy(true);
    try {
      for (const file of files) {
        const safe = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${sid}/${Date.now()}_${safe}`;
        const up = await supabase.storage.from("customer-documents").upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
        if (up.error) throw up.error;
        const ins = await supabase.from("customer_documents").insert({
          session_id: sid,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          category: form.category || null,
          note: form.note.trim() || null,
          file_path: path,
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
        });
        if (ins.error) throw ins.error;
      }
      setDone(true);
      setFiles([]);
    } catch (e) {
      console.error(e);
      setError("ارسال مدارک انجام نشد، دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="flex-1 grid place-items-center p-6 text-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        <div className="text-sm font-bold text-slate-800">مدارک شما با موفقیت ارسال شد</div>
        <p className="text-xs text-slate-500 leading-6">
          کارشناسان نمایندگی آذرخش پس از بررسی با شما تماس می‌گیرند.
        </p>
        <button onClick={() => setDone(false)} className="text-xs font-bold underline" style={{ color: NAVY }}>
          ارسال مدارک جدید
        </button>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
      <p className="text-[11px] text-slate-600 leading-6 bg-white border border-slate-200 rounded-xl p-3">
        برای بیمه شدن، مدارک خود را از این بخش ارسال کنید. فایل‌ها در مخزن امن نمایندگی ذخیره می‌شود.
      </p>
      <input
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        placeholder="نام و نام خانوادگی *"
        className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
      />
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="شماره تماس *"
        className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
      />
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
      >
        <option value="">نوع بیمه / دسته مدارک</option>
        {cats.map((c) => (
          <option key={c.id} value={c.label}>
            {c.label}
          </option>
        ))}
      </select>
      <textarea
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        placeholder="توضیحات (اختیاری)"
        rows={2}
        className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white"
      />
      <label className="flex items-center gap-2 text-xs bg-white border border-dashed border-slate-300 rounded-xl px-3 py-3 cursor-pointer">
        <Paperclip className="w-4 h-4 text-slate-500" />
        <span className="flex-1 text-slate-600">
          {files.length ? `${files.length} فایل انتخاب شد` : `انتخاب فایل (حداکثر ${cfg.maxSizeMb} مگابایت)`}
        </span>
        <input
          type="file"
          multiple
          accept={cfg.acceptedTypes}
          className="hidden"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </label>
      {error && <div className="text-xs text-rose-600 bg-rose-50 rounded-xl p-2">{error}</div>}
      <button
        onClick={() => void submit()}
        disabled={busy}
        style={{ backgroundColor: RED }}
        className="w-full py-2.5 rounded-xl text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />} ارسال مدارک
      </button>
    </div>
  );
}
