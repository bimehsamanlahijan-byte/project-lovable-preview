import { useEffect, useState } from "react";
import { BadgeCheck, Link2, RefreshCw, Save, Send, Users } from "lucide-react";
import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { defaultBotSetWebhook, defaultBotStatus } from "@/lib/admin.functions";

const KEY = "login_bot_config";

type Cfg = {
  enabled: boolean;
  requireLogin: boolean;
  useSiteAi: boolean;
  aiEnabled: boolean;
  botUsername: string;
  botTitle: string;
  [k: string]: unknown;
};

const DEF: Cfg = {
  enabled: true,
  requireLogin: true,
  useSiteAi: true,
  aiEnabled: true,
  botUsername: "SamInsuranceBot",
  botTitle: "بیمه سامان لاهیجان",
};

type Status = Awaited<ReturnType<typeof defaultBotStatus>>;

type TgUser = {
  telegram_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
};

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("fa-IR") : "—");

/** Default Saman bot: same bot as the site login + website AI assistant. */
export function DefaultBotCard() {
  const [cfg, setCfg] = useState<Cfg>(DEF);
  const [status, setStatus] = useState<Status | null>(null);
  const [users, setUsers] = useState<TgUser[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [c, s, u] = await Promise.all([
      adminReadSetting<Cfg>(KEY, DEF),
      defaultBotStatus().catch(() => null),
      adminDb("telegram_users").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setCfg({ ...DEF, ...c });
    setStatus(s);
    setUsers((u.data ?? []) as TgUser[]);
  }
  useEffect(() => {
    void load();
  }, []);

  async function save() {
    setBusy(true);
    const res = await adminWriteSetting(KEY, cfg);
    setBusy(false);
    setMsg((res as { error?: unknown })?.error ? "ذخیره نشد" : "تنظیمات ربات ذخیره شد ✓");
  }

  async function hook() {
    setBusy(true);
    try {
      const r = await defaultBotSetWebhook({ data: { origin: window.location.origin } });
      setMsg(r.ok ? `وب‌هوک ثبت شد: ${r.url}` : r.error);
    } catch (e) {
      setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
    }
    setBusy(false);
    void load();
  }

  async function toggleUser(u: TgUser) {
    await adminDb("telegram_users").update({ is_active: !u.is_active }).eq("telegram_id", u.telegram_id);
    void load();
  }

  const ok = status && "username" in status && status.username;

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-l from-sky-50 to-white p-4 mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-[#0b1e3f] flex items-center gap-2">
              ربات پیش‌فرض سایت
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">پیش‌فرض</span>
            </div>
            <div className="text-xs text-slate-500">
              {ok ? `@${status.username}` : status && !status.configured ? "توکن TELEGRAM_BOT_TOKEN در سرور تنظیم نشده" : "در حال بررسی…"}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            <RefreshCw className="w-4 h-4" /> بررسی
          </button>
          <button disabled={busy} onClick={() => void hook()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-white border border-sky-300 text-sky-700">
            <Link2 className="w-4 h-4" /> ثبت وب‌هوک روی همین دامنه
          </button>
          <button disabled={busy} onClick={() => void save()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-sky-600 text-white">
            <Save className="w-4 h-4" /> ذخیره
          </button>
        </div>
      </div>

      {status && "webhookUrl" in status && (
        <div className="text-[11px] text-slate-600 bg-white rounded-xl border border-slate-200 p-2 leading-6" dir="ltr">
          webhook: {status.webhookUrl || "—"} · pending: {status.pending}
          {status.lastError ? ` · last error: ${status.lastError}` : ""}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        {(
          [
            ["enabled", "ربات فعال باشد"],
            ["requireLogin", "اول ورود با ارسال شماره تلگرام"],
            ["useSiteAi", "پاسخ با همان هوش مصنوعی چت سایت"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-2.5">
            <input type="checkbox" checked={Boolean(cfg[k])} onChange={(e) => setCfg({ ...cfg, [k]: e.target.checked })} />
            {label}
          </label>
        ))}
      </div>

      {msg && <div className="text-xs text-sky-800">{msg}</div>}

      <div>
        <div className="text-xs font-bold text-[#0b1e3f] mb-2 flex items-center gap-1">
          <Users className="w-4 h-4" /> کاربران واردشده با تلگرام ({users.length})
        </div>
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-2 text-right">نام</th>
                <th className="p-2 text-right">یوزرنیم</th>
                <th className="p-2 text-right">شماره</th>
                <th className="p-2 text-right">اولین ورود</th>
                <th className="p-2 text-right">آخرین فعالیت</th>
                <th className="p-2 text-right">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.telegram_id} className="border-t border-slate-100">
                  <td className="p-2">{[u.first_name, u.last_name].filter(Boolean).join(" ") || "—"}</td>
                  <td className="p-2" dir="ltr">{u.telegram_username ? `@${u.telegram_username}` : "—"}</td>
                  <td className="p-2 font-mono" dir="ltr">{u.phone_number ?? "—"}</td>
                  <td className="p-2">{fmt(u.created_at)}</td>
                  <td className="p-2">{fmt(u.last_login)}</td>
                  <td className="p-2">
                    <button onClick={() => void toggleUser(u)} className={`px-2 py-0.5 rounded-full ${u.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {u.is_active ? <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> فعال</span> : "غیرفعال"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">هنوز کاربری از طریق ربات وارد نشده است.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
