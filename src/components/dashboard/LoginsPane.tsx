import { useEffect, useMemo, useState } from "react";
import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { notifyFailed, notifySaved } from "@/lib/notify";
import {
  LOGIN_MODES_ORDER,
  type LoginsTab,
} from "./logins-shared";
import {
  LOGIN_MODE_LABELS,
  LOGIN_MODULES,
  LOGIN_PROVIDERS,
  TELEGRAM_CALLBACK_PATH,
  type LoginMode,
  type LoginRequirement,
} from "@/lib/auth/registry";

/* ---------------- shared bits ---------------- */

const TABS: { key: LoginsTab; label: string }[] = [
  { key: "requirements", label: "مدیریت لاگین‌ها" },
  { key: "telegram", label: "لاگین تلگرام" },
  { key: "users", label: "کاربران لاگین شده" },
  { key: "logs", label: "گزارش ورودها" },
  { key: "bot", label: "ربات بیمه سامان" },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
      <div className="font-extrabold text-sm text-[#0b1e3f] mb-3">{title}</div>
      {children}
    </div>
  );
}

export function LoginsPane({ initialTab = "requirements" }: { initialTab?: LoginsTab }) {
  const [tab, setTab] = useState<LoginsTab>(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              tab === t.key ? "bg-[#0b1e3f] text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "requirements" && <RequirementsTab />}
      {tab === "telegram" && <TelegramLoginTab />}
      {tab === "users" && <UsersTab />}
      {tab === "logs" && <LogsTab />}
      {tab === "bot" && <BotTab />}
    </div>
  );
}

/* ---------------- 1) module login requirements ---------------- */

function RequirementsTab() {
  const [rows, setRows] = useState<LoginRequirement[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await adminDb("login_requirements").select("*");
    const stored = (res.data as LoginRequirement[] | null) ?? [];
    const byKey = new Map(stored.map((r) => [r.module_key, r]));
    setRows(
      LOGIN_MODULES.map((m) => ({
        module_key: m.key,
        label: m.label,
        mode: (byKey.get(m.key)?.mode ?? "none") as LoginMode,
        methods: byKey.get(m.key)?.methods ?? ["telegram"],
      })),
    );
  };
  useEffect(() => {
    void load();
  }, []);

  const save = async (row: LoginRequirement) => {
    setBusy(true);
    const res = await adminDb("login_requirements").upsert(
      {
        module_key: row.module_key,
        label: row.label,
        mode: row.mode,
        methods: row.methods,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "module_key" },
    );
    setBusy(false);
    if (res.error) notifyFailed("تنظیمات ورود", res.error.message);
    else notifySaved("تنظیمات ورود");
  };

  return (
    <Card title="ورود لازم برای هر بخش سایت">
      <p className="text-[11px] text-slate-500 leading-6 mb-3">
        برای هر ماژول مشخص کنید ورود اجباری، اختیاری یا بدون نیاز به ورود باشد و کدام روش‌های ورود
        مجاز باشند. این تنظیم علاوه بر ظاهر سایت، در سمت سرور هم اعمال می‌شود.
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={row.module_key} className="rounded-xl border border-slate-100 p-3">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="text-sm font-bold text-[#0b1e3f]">{row.label}</div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={row.mode}
                  onChange={(e) => {
                    const mode = e.target.value as LoginMode;
                    setRows((prev) => prev.map((r, j) => (i === j ? { ...r, mode } : r)));
                  }}
                  className="rounded-lg border border-slate-200 text-xs px-2 py-1.5"
                >
                  {LOGIN_MODES_ORDER.map((m) => (
                    <option key={m} value={m}>
                      {LOGIN_MODE_LABELS[m]}
                    </option>
                  ))}
                </select>
                <button
                  disabled={busy}
                  onClick={() => void save(rows[i]!)}
                  className="rounded-lg bg-[#0b1e3f] text-white text-xs font-bold px-3 py-1.5 disabled:opacity-40"
                >
                  ذخیره
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {LOGIN_PROVIDERS.map((p) => (
                <label key={p.id} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    disabled={!p.available}
                    checked={row.methods.includes(p.id)}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, j) =>
                          i === j
                            ? {
                                ...r,
                                methods: e.target.checked
                                  ? [...new Set([...r.methods, p.id])]
                                  : r.methods.filter((m) => m !== p.id),
                              }
                            : r,
                        ),
                      )
                    }
                  />
                  {p.label}
                  {!p.available && <span className="text-slate-300">(به‌زودی)</span>}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- 2) telegram login ---------------- */

function TelegramLoginTab() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://saman8452.ir";
  const callback = `https://saman8452.ir${TELEGRAM_CALLBACK_PATH}`;

  return (
    <div className="space-y-4">
      <Card title="مسیرهای ورود با تلگرام">
        <div className="space-y-2 text-xs">
          <Row label="Redirect URI (در تلگرام ثبت شود)" value={callback} />
          <Row label="Redirect URI این دامنه" value={`${origin}${TELEGRAM_CALLBACK_PATH}`} />
          <Row label="شروع ورود" value={`${origin}/api/public/auth/telegram/start`} />
          <Row label="صفحه ورود کاربران" value={`${origin}/login`} />
        </div>
      </Card>
      <Card title="کلیدهای مورد نیاز (فقط در Secrets سرور)">
        <ul className="text-xs text-slate-600 leading-7 list-disc pr-5">
          <li>TELEGRAM_CLIENT_ID — شناسه کلاینت تلگرام</li>
          <li>TELEGRAM_CLIENT_SECRET — کلید محرمانه تلگرام (هرگز در سایت نمایش داده نمی‌شود)</li>
          <li>TELEGRAM_LOGIN_BOT_TOKEN — توکن ربات برای اعتبارسنجی ویجت ورود</li>
          <li>SESSION_SECRET — کلید رمزنگاری نشست کاربران (حداقل ۳۲ کاراکتر)</li>
        </ul>
        <p className="text-[11px] text-slate-400 mt-2">
          مقدار این کلیدها هیچ‌گاه در پیشخوان یا مرورگر خوانده نمی‌شود؛ فقط در سرور استفاده می‌شوند.
        </p>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <code className="font-mono text-[11px] text-[#0b1e3f] break-all">{value}</code>
    </div>
  );
}

/* ---------------- 3) logged-in users ---------------- */

type TgUser = {
  telegram_id: number;
  user_id: string;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
};

function UsersTab() {
  const [rows, setRows] = useState<TgUser[]>([]);
  const load = async () => {
    const res = await adminDb("telegram_users")
      .select("*")
      .order("last_login", { ascending: false })
      .limit(200);
    setRows(((res.data as TgUser[] | null) ?? []));
  };
  useEffect(() => {
    void load();
  }, []);

  const toggle = async (row: TgUser) => {
    await adminDb("telegram_users")
      .update({ is_active: !row.is_active })
      .eq("telegram_id", row.telegram_id);
    await load();
  };

  return (
    <Card title={`کاربران واردشده با تلگرام (${rows.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="p-2 text-right">نام</th>
              <th className="p-2 text-right">یوزرنیم</th>
              <th className="p-2 text-right">Telegram ID</th>
              <th className="p-2 text-right">شماره</th>
              <th className="p-2 text-right">آخرین ورود</th>
              <th className="p-2 text-right">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.telegram_id} className="border-t border-slate-100">
                <td className="p-2">{[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}</td>
                <td className="p-2">{r.telegram_username ? `@${r.telegram_username}` : "—"}</td>
                <td className="p-2 font-mono">{r.telegram_id}</td>
                <td className="p-2">{r.phone_number ?? "ثبت نشده"}</td>
                <td className="p-2">{r.last_login ? new Date(r.last_login).toLocaleString("fa-IR") : "—"}</td>
                <td className="p-2">
                  <button
                    onClick={() => void toggle(r)}
                    className={`rounded-lg px-2 py-1 font-bold ${
                      r.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {r.is_active ? "فعال" : "غیرفعال"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  هنوز کاربری وارد نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------------- 4) login logs ---------------- */

type LogRow = {
  id: string;
  user_id: string | null;
  login_method: string | null;
  telegram_id: number | null;
  module: string | null;
  status: string;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

function LogsTab() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    void adminDb("login_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300)
      .then((res) => setRows(((res.data as LogRow[] | null) ?? [])));
  }, []);

  const shown = useMemo(
    () =>
      rows.filter((r) =>
        filter
          ? [r.login_method, r.module, r.status, String(r.telegram_id ?? "")].join(" ").includes(filter)
          : true,
      ),
    [rows, filter],
  );

  return (
    <Card title="گزارش ورودها">
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="جستجو بر اساس روش، ماژول یا وضعیت…"
        className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="p-2 text-right">زمان</th>
              <th className="p-2 text-right">روش</th>
              <th className="p-2 text-right">ماژول</th>
              <th className="p-2 text-right">Telegram ID</th>
              <th className="p-2 text-right">وضعیت</th>
              <th className="p-2 text-right">IP</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-2">{new Date(r.created_at).toLocaleString("fa-IR")}</td>
                <td className="p-2">{r.login_method ?? "—"}</td>
                <td className="p-2">{r.module ?? "—"}</td>
                <td className="p-2 font-mono">{r.telegram_id ?? "—"}</td>
                <td className="p-2">
                  <span
                    className={`rounded px-2 py-0.5 ${
                      r.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-2 font-mono">{r.ip ?? "—"}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  رکوردی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------------- 5) Saman insurance bot ---------------- */

export const LOGIN_BOT_SETTING_KEY = "login_bot_config";

type BotConfig = {
  enabled: boolean;
  botUsername: string;
  botTitle: string;
  aiEnabled: boolean;
  aiProvider: string;
  aiModel: string;
  systemPrompt: string;
};

const DEFAULT_BOT: BotConfig = {
  enabled: false,
  botUsername: "SamInsuranceBot",
  botTitle: "بیمه سامان لاهیجان",
  aiEnabled: false,
  aiProvider: "lovable",
  aiModel: "google/gemini-2.5-flash",
  systemPrompt: "تو دستیار هوشمند نمایندگی بیمه سامان لاهیجان هستی. فقط درباره خدمات بیمه پاسخ بده.",
};

function BotTab() {
  const [cfg, setCfg] = useState<BotConfig>(DEFAULT_BOT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void adminReadSetting<BotConfig>(LOGIN_BOT_SETTING_KEY, DEFAULT_BOT).then((v) => {
      setCfg(v);
      setLoaded(true);
    });
  }, []);

  const webhook = `https://saman8452.ir/api/public/telegram/bot-ai`;

  return (
    <div className="space-y-4">
      <Card title="ربات بیمه سامان">
        {!loaded ? (
          <div className="text-xs text-slate-400">در حال بارگذاری…</div>
        ) : (
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cfg.enabled}
                onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })}
              />
              ربات فعال باشد
            </label>
            <Field label="نام ربات">
              <input
                value={cfg.botTitle}
                onChange={(e) => setCfg({ ...cfg, botTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </Field>
            <Field label="یوزرنیم ربات">
              <input
                value={cfg.botUsername}
                onChange={(e) => setCfg({ ...cfg, botUsername: e.target.value.replace(/^@/, "") })}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </Field>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cfg.aiEnabled}
                onChange={(e) => setCfg({ ...cfg, aiEnabled: e.target.checked })}
              />
              پاسخ‌گویی هوش مصنوعی در ربات فعال باشد
            </label>
            <Field label="ارائه‌دهنده هوش مصنوعی">
              <input
                value={cfg.aiProvider}
                onChange={(e) => setCfg({ ...cfg, aiProvider: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </Field>
            <Field label="مدل">
              <input
                value={cfg.aiModel}
                onChange={(e) => setCfg({ ...cfg, aiModel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </Field>
            <Field label="دستور سیستمی">
              <textarea
                value={cfg.systemPrompt}
                onChange={(e) => setCfg({ ...cfg, systemPrompt: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </Field>
            <button
              onClick={() => void adminWriteSetting(LOGIN_BOT_SETTING_KEY, cfg)}
              className="rounded-lg bg-[#0b1e3f] text-white font-bold px-4 py-2"
            >
              ذخیره تنظیمات ربات
            </button>
          </div>
        )}
      </Card>

      <Card title="اتصال ربات به هوش مصنوعی">
        <div className="space-y-2 text-xs">
          <Row label="آدرس Webhook ربات" value={webhook} />
          <p className="text-[11px] text-slate-500 leading-6">
            توکن ربات فقط از Secrets سرور (TELEGRAM_LOGIN_BOT_TOKEN) خوانده می‌شود و هرگز در
            پیشخوان یا مرورگر نمایش داده نمی‌شود. اطلاعات مدیریتی سایت از طریق ربات در دسترس
            کاربران نیست.
          </p>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-slate-600 mb-1">{label}</div>
      {children}
    </div>
  );
}
