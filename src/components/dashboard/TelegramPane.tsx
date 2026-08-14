import { useEffect, useMemo, useState } from "react";
import { Bot, Plus, Save, Trash2, RefreshCw, Play, Link2, Zap, Info } from "lucide-react";
import { adminDb } from "@/lib/admin-db";
import { telegramGetInfo, telegramRunFlow, telegramSetWebhook } from "@/lib/admin.functions";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const cardCls = "bg-white rounded-2xl border border-slate-200 p-4";

type TgBot = {
  id: string;
  name: string;
  bot_token: string;
  bot_username: string | null;
  webhook_secret: string | null;
  default_chat_ids: string | null;
  is_active: boolean;
};

type Step = {
  type: "sendMessage" | "sendPhoto" | "delay" | "forward";
  text?: string;
  photoUrl?: string;
  chatIds?: string;
  seconds?: number;
  parseMode?: "HTML" | "Markdown" | "";
  fromChatId?: string;
  messageId?: number;
};

type TgFlow = {
  id: string;
  bot_id: string | null;
  name: string;
  trigger_type: string;
  trigger_keyword: string | null;
  schedule_cron: string | null;
  steps: Step[];
  is_active: boolean;
};

type TgRun = {
  id: string;
  flow_id: string | null;
  status: string;
  message: string | null;
  created_at: string;
};

export function TelegramPane() {
  const [bots, setBots] = useState<TgBot[]>([]);
  const [flows, setFlows] = useState<TgFlow[]>([]);
  const [runs, setRuns] = useState<TgRun[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function load() {
    const [b, f, r] = await Promise.all([
      adminDb("telegram_bots").select("*").order("created_at", { ascending: true }),
      adminDb("telegram_flows").select("*").order("created_at", { ascending: true }),
      adminDb("telegram_runs").select("*").order("created_at", { ascending: false }).limit(30),
    ]);
    setBots((b.data ?? []) as TgBot[]);
    setFlows((f.data ?? []) as TgFlow[]);
    setRuns((r.data ?? []) as TgRun[]);
  }
  useEffect(() => {
    void load();
  }, []);

  const botName = useMemo(
    () => (id: string | null) => bots.find((b) => b.id === id)?.name ?? "—",
    [bots],
  );

  async function addBot() {
    await adminDb("telegram_bots").insert({
      name: "ربات جدید",
      bot_token: "",
      default_chat_ids: "",
      is_active: true,
    });
    void load();
  }

  async function saveBot(b: TgBot) {
    setBusy(true);
    const res = await adminDb("telegram_bots")
      .update({
        name: b.name,
        bot_token: b.bot_token,
        bot_username: b.bot_username,
        default_chat_ids: b.default_chat_ids,
        is_active: b.is_active,
      })
      .eq("id", b.id);
    setBusy(false);
    setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "ربات ذخیره شد ✓");
  }

  async function removeBot(id: string) {
    if (!confirm("این ربات و همه اتوماسیون‌هایش حذف شود؟")) return;
    await adminDb("telegram_bots").delete().eq("id", id);
    void load();
  }

  async function hook(b: TgBot) {
    setBusy(true);
    try {
      const url = `${origin}/api/public/telegram/webhook/${b.id}`;
      const res = await telegramSetWebhook({ data: { botId: b.id, url } });
      setMsg(res.ok ? `وب‌هوک متصل شد: ${url}` : "اتصال وب‌هوک ناموفق بود.");
      void load();
    } catch (e) {
      setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
    }
    setBusy(false);
  }

  async function info(b: TgBot) {
    setBusy(true);
    try {
      const res = await telegramGetInfo({ data: { botId: b.id } });
      setMsg(
        `ربات: @${res.me?.["username"] ?? "?"} — وب‌هوک: ${res.hook?.["url"] || "متصل نیست"} — در صف: ${res.hook?.["pending_update_count"] ?? 0}`,
      );
    } catch (e) {
      setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
    }
    setBusy(false);
  }

  async function addFlow() {
    await adminDb("telegram_flows").insert({
      bot_id: bots[0]?.id ?? null,
      name: "اتوماسیون جدید",
      trigger_type: "manual",
      steps: [{ type: "sendMessage", text: "سلام! این یک پیام تبلیغاتی آزمایشی است." }],
      is_active: true,
    });
    void load();
  }

  async function saveFlow(f: TgFlow) {
    setBusy(true);
    const res = await adminDb("telegram_flows")
      .update({
        bot_id: f.bot_id,
        name: f.name,
        trigger_type: f.trigger_type,
        trigger_keyword: f.trigger_keyword,
        schedule_cron: f.schedule_cron,
        steps: f.steps,
        is_active: f.is_active,
      })
      .eq("id", f.id);
    setBusy(false);
    setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "اتوماسیون ذخیره شد ✓");
  }

  async function runFlow(id: string) {
    setBusy(true);
    try {
      const res = await telegramRunFlow({ data: { flowId: id } });
      setMsg(res.ok ? `اجرا شد — ${res.sent} پیام ارسال شد.` : `خطا: ${res.error}`);
    } catch (e) {
      setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
    }
    setBusy(false);
    void load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
            <Bot className="w-6 h-6" /> ربات تلگرام و اتوماسیون
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-6">
            با توکن اختصاصی خودتان ربات را متصل کنید، کانال‌ها و گروه‌ها را تعریف کنید و زنجیره‌ای از
            پیام‌ها را به‌صورت خودکار ارسال کنید.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            <RefreshCw className="w-4 h-4" /> بازخوانی
          </button>
          <button onClick={() => void addBot()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
            <Plus className="w-4 h-4" /> ربات جدید
          </button>
          <button onClick={() => void addFlow()} disabled={bots.length === 0} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
            <Zap className="w-4 h-4" /> اتوماسیون جدید
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3 break-all" dir="auto">
          {msg}
        </div>
      )}

      <div className={`${cardCls} mb-6 flex gap-2 text-[11px] text-slate-600 leading-6`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0b1e3f]" />
        <div>
          توکن ربات را از <b dir="ltr">@BotFather</b> بگیرید. برای ارسال به کانال، ربات را ادمین کانال کنید و
          شناسه کانال را به شکل <code dir="ltr">@channelname</code> یا <code dir="ltr">-1001234567890</code> وارد کنید.
          چند شناسه را با کاما یا خط جدید از هم جدا کنید.
        </div>
      </div>

      {/* Bots */}
      <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3">ربات‌ها</h2>
      <div className="space-y-3 mb-8">
        {bots.length === 0 && (
          <div className={`${cardCls} text-xs text-slate-500`}>هنوز رباتی اضافه نشده است.</div>
        )}
        {bots.map((b) => (
          <div key={b.id} className={`${cardCls} grid md:grid-cols-12 gap-3 items-end`}>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">نام ربات</span>
              <input value={b.name} onChange={(e) => setBots((s) => s.map((x) => (x.id === b.id ? { ...x, name: e.target.value } : x)))} className={inputCls} />
            </label>
            <label className="md:col-span-4 text-xs">
              <span className="block font-bold text-slate-600 mb-1">توکن ربات</span>
              <input dir="ltr" type="password" value={b.bot_token} placeholder="123456:ABC-..." onChange={(e) => setBots((s) => s.map((x) => (x.id === b.id ? { ...x, bot_token: e.target.value } : x)))} className={inputCls} />
            </label>
            <label className="md:col-span-4 text-xs">
              <span className="block font-bold text-slate-600 mb-1">کانال/گروه‌های پیش‌فرض</span>
              <input dir="ltr" value={b.default_chat_ids ?? ""} placeholder="@mychannel, -1001234567890" onChange={(e) => setBots((s) => s.map((x) => (x.id === b.id ? { ...x, default_chat_ids: e.target.value } : x)))} className={inputCls} />
            </label>
            <label className="md:col-span-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <input type="checkbox" checked={b.is_active} onChange={(e) => setBots((s) => s.map((x) => (x.id === b.id ? { ...x, is_active: e.target.checked } : x)))} /> فعال
            </label>
            <div className="md:col-span-1 flex justify-end">
              <button onClick={() => void removeBot(b.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label="حذف">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="md:col-span-12 flex flex-wrap gap-2 pt-1 border-t border-slate-100 mt-1">
              <button onClick={() => void saveBot(b)} disabled={busy} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
                <Save className="w-4 h-4" /> ذخیره
              </button>
              <button onClick={() => void hook(b)} disabled={busy} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50">
                <Link2 className="w-4 h-4" /> اتصال وب‌هوک
              </button>
              <button onClick={() => void info(b)} disabled={busy} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
                <Info className="w-4 h-4" /> وضعیت ربات
              </button>
              <code dir="ltr" className="text-[10px] text-slate-500 self-center break-all">
                {origin}/api/public/telegram/webhook/{b.id}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Flows */}
      <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3">اتوماسیون‌ها (ارسال زنجیره‌ای)</h2>
      <div className="space-y-4 mb-8">
        {flows.length === 0 && (
          <div className={`${cardCls} text-xs text-slate-500`}>هنوز اتوماسیونی ساخته نشده است.</div>
        )}
        {flows.map((f) => (
          <div key={f.id} className={cardCls}>
            <div className="grid md:grid-cols-12 gap-3 items-end mb-3">
              <label className="md:col-span-3 text-xs">
                <span className="block font-bold text-slate-600 mb-1">نام اتوماسیون</span>
                <input value={f.name} onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, name: e.target.value } : x)))} className={inputCls} />
              </label>
              <label className="md:col-span-3 text-xs">
                <span className="block font-bold text-slate-600 mb-1">ربات</span>
                <select value={f.bot_id ?? ""} onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, bot_id: e.target.value } : x)))} className={inputCls}>
                  {bots.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </label>
              <label className="md:col-span-2 text-xs">
                <span className="block font-bold text-slate-600 mb-1">نوع اجرا</span>
                <select value={f.trigger_type} onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, trigger_type: e.target.value } : x)))} className={inputCls}>
                  <option value="manual">دستی</option>
                  <option value="keyword">با کلیدواژه در چت</option>
                </select>
              </label>
              <label className="md:col-span-2 text-xs">
                <span className="block font-bold text-slate-600 mb-1">کلیدواژه</span>
                <input value={f.trigger_keyword ?? ""} onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, trigger_keyword: e.target.value } : x)))} className={inputCls} />
              </label>
              <label className="md:col-span-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <input type="checkbox" checked={f.is_active} onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, is_active: e.target.checked } : x)))} /> فعال
              </label>
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={async () => {
                    if (!confirm("این اتوماسیون حذف شود؟")) return;
                    await adminDb("telegram_flows").delete().eq("id", f.id);
                    void load();
                  }}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                  aria-label="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {(f.steps ?? []).map((st, i) => (
                <div key={i} className="grid md:grid-cols-12 gap-2 items-end bg-slate-50 rounded-xl p-3">
                  <label className="md:col-span-2 text-xs">
                    <span className="block font-bold text-slate-600 mb-1">گام {i + 1}</span>
                    <select
                      value={st.type}
                      onChange={(e) =>
                        setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.map((y, j) => (j === i ? { ...y, type: e.target.value as Step["type"] } : y)) } : x)))
                      }
                      className={inputCls}
                    >
                      <option value="sendMessage">ارسال پیام</option>
                      <option value="sendPhoto">ارسال تصویر</option>
                      <option value="delay">مکث</option>
                      <option value="forward">فوروارد پیام</option>
                    </select>
                  </label>

                  {st.type === "delay" ? (
                    <label className="md:col-span-3 text-xs">
                      <span className="block font-bold text-slate-600 mb-1">ثانیه</span>
                      <input type="number" min={1} max={20} value={st.seconds ?? 2}
                        onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.map((y, j) => (j === i ? { ...y, seconds: Number(e.target.value) } : y)) } : x)))}
                        className={inputCls} />
                    </label>
                  ) : (
                    <>
                      <label className="md:col-span-5 text-xs">
                        <span className="block font-bold text-slate-600 mb-1">
                          {st.type === "sendPhoto" ? "متن زیر تصویر" : "متن پیام"}
                        </span>
                        <textarea rows={2} value={st.text ?? ""}
                          onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)) } : x)))}
                          className={inputCls} />
                      </label>
                      {st.type === "sendPhoto" && (
                        <label className="md:col-span-3 text-xs">
                          <span className="block font-bold text-slate-600 mb-1">آدرس تصویر</span>
                          <input dir="ltr" value={st.photoUrl ?? ""}
                            onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.map((y, j) => (j === i ? { ...y, photoUrl: e.target.value } : y)) } : x)))}
                            className={inputCls} />
                        </label>
                      )}
                      <label className="md:col-span-3 text-xs">
                        <span className="block font-bold text-slate-600 mb-1">مقصد (خالی = پیش‌فرض ربات)</span>
                        <input dir="ltr" value={st.chatIds ?? ""}
                          onChange={(e) => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.map((y, j) => (j === i ? { ...y, chatIds: e.target.value } : y)) } : x)))}
                          className={inputCls} />
                      </label>
                    </>
                  )}

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: x.steps.filter((_, j) => j !== i) } : x)))}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                      aria-label="حذف گام"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setFlows((s) => s.map((x) => (x.id === f.id ? { ...x, steps: [...(x.steps ?? []), { type: "sendMessage", text: "" }] } : x)))}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200"
              >
                <Plus className="w-4 h-4" /> افزودن گام
              </button>
              <button onClick={() => void saveFlow(f)} disabled={busy} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
                <Save className="w-4 h-4" /> ذخیره
              </button>
              <button onClick={() => void runFlow(f.id)} disabled={busy} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50">
                <Play className="w-4 h-4" /> اجرای فوری
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Runs */}
      <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3">تاریخچه اجرا</h2>
      <div className={`${cardCls} overflow-x-auto`}>
        {runs.length === 0 ? (
          <p className="text-xs text-slate-500">هنوز اجرایی ثبت نشده است.</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="text-slate-500">
              <tr>
                <th className="text-right py-2">اتوماسیون</th>
                <th className="text-right py-2">وضعیت</th>
                <th className="text-right py-2">پیام</th>
                <th className="text-right py-2">زمان</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="py-2">{flows.find((f) => f.id === r.flow_id)?.name ?? botName(null)}</td>
                  <td className={`py-2 font-bold ${r.status === "ok" ? "text-emerald-600" : "text-rose-600"}`}>
                    {r.status === "ok" ? "موفق" : "خطا"}
                  </td>
                  <td className="py-2 text-slate-600">{r.message}</td>
                  <td className="py-2 text-slate-500">{new Date(r.created_at).toLocaleString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
