import { useEffect, useState } from "react";
import { Database, RefreshCw, CheckCircle2, XCircle, HardDrive, KeyRound } from "lucide-react";
import { clearStorageTarget, saveStorageTarget, storageTargetInfo } from "@/lib/admin.functions";
import { notify } from "@/lib/notify";

type Status = {
  env: Record<string, boolean>;
  buckets: { name: string; public: boolean }[];
  tables: { table: string; count: number | null }[];
  error: string | null;
};

const ENV_LABELS: Record<string, string> = {
  SUPABASE_URL: "نشانی بک‌اند",
  SUPABASE_PUBLISHABLE_KEY: "کلید عمومی",
  SUPABASE_SERVICE_ROLE_KEY: "کلید سرور (لازم برای آپلود و حذف فایل)",
  SESSION_SECRET: "کلید رمزنگاری نشست پیشخوان",
};

/** Backend (database + storage) connection panel: health, buckets and table row counts. */
export function BackendPane() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<{ custom: boolean; url: string; bucket: string; host: string } | null>(null);
  const [form, setForm] = useState({ url: "", serviceKey: "", bucket: "site-assets" });
  const [saving, setSaving] = useState(false);

  async function loadTarget() {
    try {
      const t = await storageTargetInfo();
      setTarget(t);
      setForm((f) => ({ ...f, url: t.url, bucket: t.bucket }));
    } catch {
      /* ignore */
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await saveStorageTarget({ data: form });
      if (!res.ok) notify({ kind: "error", title: "ذخیره نشد", detail: res.error });
      else
        notify({
          kind: res.warning ? "error" : "success",
          title: res.warning ? "با هشدار ذخیره شد" : "اتصال ذخیره شد",
          detail: res.warning ?? undefined,
        });
      await loadTarget();
      await load();
    } catch (e) {
      notify({ kind: "error", title: "خطا", detail: e instanceof Error ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setSaving(true);
    try {
      await clearStorageTarget();
      setForm({ url: "", serviceKey: "", bucket: "site-assets" });
      notify({ kind: "success", title: "به بک‌اند پیش‌فرض برگشت" });
      await loadTarget();
    } finally {
      setSaving(false);
    }
  }

  async function load() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/backend");
      setStatus((await res.json()) as Status);
    } catch (e) {
      setStatus({
        env: {},
        buckets: [],
        tables: [],
        error: e instanceof Error ? e.message : "خطا در دریافت وضعیت",
      });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    void loadTarget();
  }, []);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-extrabold text-slate-800">اتصال بک‌اند (دیتابیس و فضای فایل)</h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => void load()}
            className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> بررسی وضعیت
          </button>
        </div>
        <p className="text-[11px] leading-5 text-slate-500">
          اگر دکمه آپلود در نسخه منتشرشده روی Cloudflare خطا می‌دهد، دلیلش نبودن «کلید سرور» در متغیرهای
          محیطی Worker است. کافی است مقدارهای <code>SUPABASE_URL</code>،{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>، <code>SUPABASE_PUBLISHABLE_KEY</code> و{" "}
          <code>SESSION_SECRET</code> در تنظیمات همان Worker ثبت شوند؛ سپس این صفحه باید همه موارد را
          «تنظیم شده» نشان دهد.
        </p>

        {status?.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{status.error}</p>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(status?.env ?? {}).map(([k, ok]) => (
            <div key={k} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              {ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs font-bold text-slate-800">{ENV_LABELS[k] ?? k}</span>
              <span className="mr-auto text-[11px] text-slate-500">{ok ? "تنظیم شده" : "تنظیم نشده"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-extrabold text-slate-800">اتصال Supabase شخصی (برای فایل و عکس)</h3>
        </div>
        <p className="text-[11px] leading-5 text-slate-500">
          پروژه فعلی فایل‌ها را روی این سرویس ذخیره می‌کند:{" "}
          <b className="font-mono text-slate-700">{target?.host || "—"}</b>{" "}
          {target?.custom ? "(اکانت شخصی شما)" : "(بک‌اند پیش‌فرض پروژه)"}. برای استفاده از اکانت
          Supabase خودتان، نشانی پروژه و کلید <code>service_role</code> را وارد کنید؛ از آن پس آپلود،
          حذف و مشاهده فایل‌ها از همان اکانت انجام می‌شود.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            dir="ltr"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://xxxx.supabase.co"
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
          <input
            dir="ltr"
            value={form.bucket}
            onChange={(e) => setForm({ ...form, bucket: e.target.value })}
            placeholder="site-assets"
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
          <input
            dir="ltr"
            type="password"
            value={form.serviceKey}
            onChange={(e) => setForm({ ...form, serviceKey: e.target.value })}
            placeholder="service_role secret key"
            className="sm:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            ذخیره و آزمایش اتصال
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void reset()}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            بازگشت به بک‌اند پیش‌فرض
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-extrabold text-slate-800">باکت‌های فایل</h3>
        </div>
        {status?.buckets.length ? (
          <ul className="flex flex-wrap gap-2">
            {status.buckets.map((b) => (
              <li key={b.name} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700">
                {b.name} — {b.public ? "عمومی" : "خصوصی"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500">باکتی یافت نشد.</p>
        )}
        <p className="text-[11px] text-slate-500">
          ویرایش دستی عکس و ویدئو از منوی «کتابخانه رسانه (عکس/ویدئو)» انجام می‌شود.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <h3 className="text-sm font-extrabold text-slate-800">جدول‌های دیتابیس</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(status?.tables ?? []).map((t) => (
            <div
              key={t.table}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs"
            >
              <span className="font-bold text-slate-800">{t.table}</span>
              <span className="text-slate-500">{t.count ?? "-"} ردیف</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
