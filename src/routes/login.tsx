import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authLogout, authMe, authRemovePhone, authSavePhone } from "@/lib/auth.functions";
import { LOGIN_PROVIDERS, type PublicUser } from "@/lib/auth/registry";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود کاربران | بیمه سامان — نمایندگی آذرخش" },
      { name: "description", content: "ورود امن به خدمات آنلاین نمایندگی بیمه سامان لاهیجان با حساب تلگرام." },
      { property: "og:title", content: "ورود کاربران | بیمه سامان لاهیجان" },
      { property: "og:description", content: "ورود امن به خدمات آنلاین نمایندگی بیمه سامان لاهیجان." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    module: typeof s["module"] === "string" ? (s["module"] as string) : undefined,
    next: typeof s["next"] === "string" ? (s["next"] as string) : undefined,
    error: typeof s["error"] === "string" ? (s["error"] as string) : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = useSearch({ from: "/login" });
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    void authMe()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const startUrl = (path: string) => {
    const p = new URLSearchParams();
    if (search.module) p.set("module", search.module);
    if (search.next) p.set("next", search.next);
    return `${path}?${p.toString()}`;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#eef2f8] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <h1 className="text-xl font-extrabold text-[#0b1e3f] text-center">ورود به خدمات آنلاین</h1>
        <p className="mt-2 text-sm text-slate-500 text-center">
          بیمه سامان — نمایندگی آذرخش لاهیجان
        </p>

        {search.error && (
          <div className="mt-4 rounded-xl bg-red-50 text-red-700 text-xs p-3">{search.error}</div>
        )}

        {loading ? (
          <div className="mt-8 text-center text-sm text-slate-400">در حال بررسی وضعیت ورود…</div>
        ) : user ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="font-bold text-[#0b1e3f]">
                {user.displayName ?? "کاربر"}{" "}
                {user.telegram?.username ? (
                  <span className="text-slate-400 text-xs">@{user.telegram.username}</span>
                ) : null}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                روش ورود: {user.provider === "telegram" ? "تلگرام" : user.provider}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                شماره تماس: {user.phone ?? "ثبت نشده"}
              </div>
            </div>

            {!user.phone ? (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-bold text-[#0b1e3f]">ثبت اختیاری شماره تماس</div>
                <p className="text-xs text-slate-500 mt-1 leading-6">
                  ثبت شماره کاملاً اختیاری است و تلگرام آن را به‌صورت خودکار در اختیار سایت
                  نمی‌گذارد. فقط در صورتی که خودتان بخواهید، برای پیگیری خدمات ذخیره می‌شود.
                </p>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثلاً 09121234567"
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  با ذخیره شماره تماسم موافقم.
                </label>
                <button
                  disabled={!consent || phone.trim().length < 8}
                  onClick={async () => {
                    const res = await authSavePhone({ data: { phone: phone.trim(), consent: true } });
                    setMsg(res.ok ? "شماره ذخیره شد." : (res.error ?? "ذخیره نشد."));
                    if (res.ok) setUser((u) => (u ? { ...u, phone: phone.trim(), hasPhoneConsent: true } : u));
                  }}
                  className="mt-3 w-full rounded-xl bg-[#0b1e3f] text-white text-sm font-bold py-2.5 disabled:opacity-40"
                >
                  ذخیره شماره
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  await authRemovePhone();
                  setUser((u) => (u ? { ...u, phone: null, hasPhoneConsent: false } : u));
                  setMsg("شماره حذف شد.");
                }}
                className="w-full rounded-xl border border-slate-200 text-sm py-2.5"
              >
                حذف شماره تماس من
              </button>
            )}

            {msg && <div className="text-xs text-emerald-600 text-center">{msg}</div>}

            <div className="flex gap-2">
              <a href={search.next ?? "/"} className="flex-1 text-center rounded-xl bg-[#c81e35] text-white text-sm font-bold py-2.5">
                ادامه
              </a>
              <button
                onClick={async () => {
                  await authLogout();
                  window.location.href = "/";
                }}
                className="flex-1 rounded-xl border border-slate-200 text-sm py-2.5"
              >
                خروج از حساب
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {LOGIN_PROVIDERS.map((p) =>
              p.available && p.startPath ? (
                <a
                  key={p.id}
                  href={startUrl(p.startPath)}
                  className="block text-center rounded-xl bg-[#229ED9] text-white text-sm font-bold py-3"
                >
                  {p.label}
                </a>
              ) : (
                <div
                  key={p.id}
                  className="rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs text-center py-3"
                >
                  {p.label} — به‌زودی
                </div>
              ),
            )}
            <p className="text-[11px] text-slate-400 leading-6 text-center">
              ورود از طریق حساب تلگرام شما انجام می‌شود. شماره تلفن فقط با اجازه خودتان و در مرحله
              بعد ثبت می‌شود.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
