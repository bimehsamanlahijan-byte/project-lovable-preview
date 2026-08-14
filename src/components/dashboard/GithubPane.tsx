import { useEffect, useState } from "react";
import { Github, Plus, Trash2, Save, RefreshCw, UploadCloud, CheckCircle2 } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { githubCheckAccount, githubPublishSnapshot } from "@/lib/github.functions";
import { notifyFailed, notifySaved } from "@/lib/notify";
import {
  DEFAULT_GITHUB_SYNC,
  GITHUB_SETTING_KEY,
  type GithubAccount,
  type GithubSyncSettings,
} from "@/lib/site-config";

const input = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

function blankAccount(index: number): GithubAccount {
  return {
    id: `acc_${Date.now()}_${index}`,
    label: `اکانت ${index + 1}`,
    secretName: index === 0 ? "GITHUB_API_KEY" : `GITHUB_API_KEY_${index + 1}`,
    owner: "",
    repo: "",
    branch: "main",
    path: "lovable/site-content.json",
    isDefault: index === 0,
  };
}

export function GithubPane() {
  const [cfg, setCfg] = useState<GithubSyncSettings>(DEFAULT_GITHUB_SYNC);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");

  useEffect(() => {
    adminReadSetting<GithubSyncSettings>(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC).then((v) =>
      setCfg({ ...v, accounts: v.accounts?.length ? v.accounts : [blankAccount(0)] }),
    );
  }, []);

  const update = (id: string, patch: Partial<GithubAccount>) =>
    setCfg((p) => ({ ...p, accounts: p.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));

  const save = async (next: GithubSyncSettings = cfg) => {
    setCfg(next);
    await adminWriteSetting(GITHUB_SETTING_KEY, next);
  };

  const makeDefault = (id: string) =>
    void save({ ...cfg, accounts: cfg.accounts.map((a) => ({ ...a, isDefault: a.id === id })) });

  const test = async (acc: GithubAccount) => {
    setBusy(acc.id);
    const res = await githubCheckAccount({ data: { secretName: acc.secretName } });
    setBusy("");
    setStatus((p) => ({
      ...p,
      [acc.id]: res.ok ? `متصل به حساب ${res.login || "گیت‌هاب"}` : `اتصال ناموفق: ${res.error}`,
    }));
    if (res.ok) notifySaved("اتصال گیت‌هاب");
    else notifyFailed("اتصال گیت‌هاب", res.error);
  };

  const publish = async (acc: GithubAccount) => {
    if (!acc.owner || !acc.repo) return notifyFailed("انتشار در گیت‌هاب", "نام مالک و مخزن الزامی است.");
    setBusy(acc.id);
    const res = await githubPublishSnapshot({
      data: {
        secretName: acc.secretName,
        owner: acc.owner,
        repo: acc.repo,
        branch: acc.branch,
        path: acc.path,
        note: "انتشار دستی از پیشخوان",
      },
    });
    setBusy("");
    if (res.ok) {
      setStatus((p) => ({ ...p, [acc.id]: `آخرین ارسال موفق: ${res.sha.slice(0, 7)}` }));
      notifySaved("ارسال تغییرات به گیت‌هاب");
    } else {
      notifyFailed("ارسال تغییرات به گیت‌هاب", res.error);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
            <Github className="w-6 h-6" /> اتصال و انتشار در گیت‌هاب
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            هر تغییری که در پیشخوان ذخیره می‌شود می‌تواند به‌صورت خودکار در مخزن گیت‌هاب ثبت شود.
          </p>
        </div>
        <button
          onClick={() => void save()}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white"
        >
          <Save className="w-4 h-4" /> ذخیره تنظیمات
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 space-y-3">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={cfg.autoSync}
            onChange={(e) => void save({ ...cfg, autoSync: e.target.checked })}
          />
          <span className="font-bold text-slate-700">
            ارسال خودکار به گیت‌هاب پس از هر تغییر در پیشخوان
          </span>
        </label>
        <p className="text-[11px] text-slate-500 leading-6">
          با فعال بودن این گزینه، پس از هر ذخیره در پیشخوان یک نسخه به‌روز از محتوای سایت در مخزن پیش‌فرض
          ثبت می‌شود و از همان مخزن روی هر هاست (از جمله Cloudflare) قابل انتشار است.
        </p>
      </div>

      <div className="space-y-4">
        {cfg.accounts.map((acc, i) => (
          <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#0b1e3f]">{acc.label || `اکانت ${i + 1}`}</span>
                {acc.isDefault && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!acc.isDefault && (
                  <button onClick={() => makeDefault(acc.id)} className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300">
                    انتخاب به‌عنوان پیش‌فرض
                  </button>
                )}
                <button
                  onClick={() => void test(acc)}
                  disabled={busy === acc.id}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> تست اتصال
                </button>
                <button
                  onClick={() => void publish(acc)}
                  disabled={busy === acc.id}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0b1e3f] text-white flex items-center gap-1.5 disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> ارسال به گیت‌هاب
                </button>
                <button
                  onClick={() =>
                    void save({ ...cfg, accounts: cfg.accounts.filter((a) => a.id !== acc.id) })
                  }
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  aria-label="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">نام نمایشی</span>
                <input value={acc.label} onChange={(e) => update(acc.id, { label: e.target.value })} className={input} />
              </label>
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">نام کلید اتصال</span>
                <input dir="ltr" value={acc.secretName} onChange={(e) => update(acc.id, { secretName: e.target.value })} className={input} />
              </label>
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">مالک مخزن (کاربر/سازمان)</span>
                <input dir="ltr" value={acc.owner} onChange={(e) => update(acc.id, { owner: e.target.value })} className={input} />
              </label>
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">نام مخزن</span>
                <input dir="ltr" value={acc.repo} onChange={(e) => update(acc.id, { repo: e.target.value })} className={input} />
              </label>
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">شاخه</span>
                <input dir="ltr" value={acc.branch} onChange={(e) => update(acc.id, { branch: e.target.value })} className={input} />
              </label>
              <label className="text-xs">
                <span className="block font-bold text-slate-600 mb-1">مسیر فایل</span>
                <input dir="ltr" value={acc.path} onChange={(e) => update(acc.id, { path: e.target.value })} className={input} />
              </label>
            </div>

            {status[acc.id] && (
              <div className="mt-3 text-[11px] text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {status[acc.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => void save({ ...cfg, accounts: [...cfg.accounts, blankAccount(cfg.accounts.length)] })}
        className="mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
      >
        <Plus className="w-4 h-4" /> افزودن اکانت گیت‌هاب
      </button>

      <p className="mt-4 text-[11px] text-slate-500 leading-6">
        برای استفاده از چند اکانت، هر اکانت گیت‌هاب را یک‌بار از بخش کانکتورهای Lovable متصل کنید؛ نام کلید
        اتصال هر اکانت را در همین جدول وارد کنید (مثلاً <code dir="ltr">GITHUB_API_KEY</code> و
        <code dir="ltr"> GITHUB_API_KEY_2</code>).
      </p>
    </div>
  );
}
