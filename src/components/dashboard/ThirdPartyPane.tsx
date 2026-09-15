import { useEffect, useState } from "react";
import { Car, RefreshCw, Save, KeyRound, Eye, EyeOff } from "lucide-react";
import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { notify } from "@/lib/notify";

const SETTING_KEY = "third_party_si24";

type Inquiry = {
  inquiry_id: string;
  reference_code: string | null;
  tracking_code: string | null;
  si24_tracking_code: string | null;
  status: string | null;
  error_message: string | null;
  request_payload: any;
  vehicle_data: any;
  quote_data: any;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  attempted: "شروع ناقص",
  start_failed: "خطا در استعلام",
  started: "استعلام آغاز شد",
  vehicle_submitted: "مشخصات خودرو ثبت شد",
  price_failed: "خطا در قیمت‌گذاری",
  priced: "قیمت دریافت شد",
};

function faDate(value: string) {
  try {
    return new Date(value).toLocaleString("fa-IR");
  } catch {
    return value;
  }
}

function money(value: unknown) {
  return typeof value === "number" ? value.toLocaleString("fa-IR") + " ریال" : "—";
}

/** فروش آنلاین بیمه‌نامه → بیمه شخص ثالث: همهٔ درخواست‌ها + کلید اتصال سامانه */
export function ThirdPartyPane() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setBusy(true);
    const res = await adminDb("third_party_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setError(res.error?.message ?? null);
    setRows((res.data as Inquiry[]) ?? []);
    setBusy(false);
  }

  async function loadToken() {
    const saved = await adminReadSetting<{ token: string }>(SETTING_KEY, { token: "" });
    setHasToken(Boolean(saved.token));
    setToken(saved.token ?? "");
  }

  useEffect(() => {
    void load();
    void loadToken();
  }, []);

  async function saveToken() {
    setSaving(true);
    try {
      await adminWriteSetting(SETTING_KEY, { token: token.trim() });
      setHasToken(Boolean(token.trim()));
      notify({ kind: "success", title: "کلید اتصال ذخیره شد" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2 font-bold text-slate-800">
          <KeyRound className="h-5 w-5 text-sky-600" />
          کلید اتصال سامانه استعلام
        </div>
        <p className="mb-3 text-sm leading-6 text-slate-600">
          تا زمانی که این کلید ثبت نشود، مراحل استعلام و قیمت‌گذاری بیمه شخص ثالث با پیام
          «ارتباط با سامانه استعلام برقرار نشد» متوقف می‌شود، اما اطلاعات کاربر با شناسهٔ
          مستقل در همین صفحه ثبت خواهد شد.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[280px] flex-1">
            <input
              type={show ? "text" : "password"}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={hasToken ? "کلید ذخیره‌شده — برای تغییر مقدار جدید را وارد کنید" : "کلید اتصال را وارد کنید"}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 left-2 my-auto h-6 text-slate-400"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={saveToken}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            ذخیره
          </button>
          <span className={`text-xs font-bold ${hasToken ? "text-emerald-600" : "text-amber-600"}`}>
            {hasToken ? "ثبت شده" : "ثبت نشده"}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Car className="h-5 w-5 text-sky-600" />
            درخواست‌های بیمه شخص ثالث ({rows.length.toLocaleString("fa-IR")})
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-1.5 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
        )}
        {!error && rows.length === 0 && !busy && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            هنوز درخواستی ثبت نشده است.
          </div>
        )}

        <div className="space-y-2">
          {rows.map((row) => {
            const owner = row.request_payload?.owner ?? {};
            const plaque = row.request_payload?.plaque ?? {};
            const isOpen = open === row.inquiry_id;
            return (
              <div key={row.inquiry_id} className="rounded-xl border border-slate-200">
                <button
                  onClick={() => setOpen(isOpen ? null : row.inquiry_id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-right"
                >
                  <span className="font-bold text-slate-800" dir="ltr">
                    {row.reference_code ?? row.tracking_code ?? row.inquiry_id.slice(0, 8)}
                  </span>
                  <span className="text-sm text-slate-600">{owner.mobile ?? "—"}</span>
                  <span className="text-xs text-slate-500">{faDate(row.created_at)}</span>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                    {STATUS_LABELS[row.status ?? ""] ?? row.status ?? "—"}
                  </span>
                </button>
                {isOpen && (
                  <div className="grid gap-2 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 sm:grid-cols-2">
                    <div>کد ملی: {owner.nationalCode ?? "—"}</div>
                    <div>کد پستی: {owner.postalCode ?? "—"}</div>
                    <div>تاریخ تولد: {owner.birthDate ?? "—"}</div>
                    <div>
                      پلاک: {plaque.segment2 ?? "—"} {plaque.letter ?? ""} {plaque.segment1 ?? ""} - {plaque.region ?? ""}
                    </div>
                    <div>کد رهگیری سامانه: {row.si24_tracking_code ?? "—"}</div>
                    <div>مدل خودرو: {row.vehicle_data?.builtYear ?? "—"}</div>
                    <div>حق بیمه: {money(row.quote_data?.premium ?? row.quote_data?.payableAmount)}</div>
                    {row.error_message && (
                      <div className="text-rose-600 sm:col-span-2">وضعیت خطا: {row.error_message}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
