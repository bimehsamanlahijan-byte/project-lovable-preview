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
