import { useEffect, useState } from "react";
import { Globe, Loader2, Plus, RefreshCw, Trash2, Save } from "lucide-react";

type Source = {
  id: string;
  title: string;
  url: string;
  branch: string | null;
  is_active: boolean;
  auto_approve: boolean;
  interval_hours: number;
  position: number;
  last_synced_at: string | null;
  last_status: string | null;
  last_error: string | null;
  last_chars: number | null;
};

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

async function api(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/ai-sources", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => ({ ok: false, error: "network" }))) as {
    ok: boolean;
    error?: string;
    results?: { title: string; ok: boolean; error?: string }[];
  };
}

const fa = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" }) : "—";

/**
 * Independent, controllable knowledge sources: official Saman Insurance pages the
 * assistant refreshes itself, plus manual refresh and per-source approval.
 */
export function KnowledgeSourcesSection() {
  const [rows, setRows] = useState<Source[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [draft, setDraft] = useState({ title: "", url: "", branch: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai-sources");
      const json = (await res.json()) as { ok: boolean; sources?: Source[]; error?: string };
      if (json.ok) setRows(json.sources ?? []);
      else setMsg(`خواندن منابع انجام نشد: ${json.error ?? ""}`);
    } catch {
      setMsg("خطای شبکه در خواندن منابع.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function add() {
    if (!/^https?:\/\//i.test(draft.url.trim())) {
      setMsg("نشانی منبع باید با https:// شروع شود.");
      return;
    }
    const res = await api({
      action: "add",
      title: draft.title.trim() || "منبع جدید",
      url: draft.url.trim(),
      branch: draft.branch.trim() || null,
    });
    setMsg(res.ok ? "منبع اضافه شد ✓" : `اضافه نشد: ${res.error ?? ""}`);
    if (res.ok) {
      setDraft({ title: "", url: "", branch: "" });
      await load();
    }
  }

  async function saveRow(row: Source) {
    setBusyId(row.id);
    const res = await api({
      action: "update",
      id: row.id,
      patch: {
        title: row.title,
        url: row.url,
        branch: row.branch,
        is_active: row.is_active,
        auto_approve: row.auto_approve,
        interval_hours: row.interval_hours,
      },
    });
    setBusyId(null);
    setMsg(res.ok ? "ذخیره شد ✓" : `ذخیره نشد: ${res.error ?? ""}`);
  }

  async function syncRow(id: string) {
    setBusyId(id);
    setMsg("");
    const res = await api({ action: "sync", id });
    setBusyId(null);
    setMsg(res.ok ? "اطلاعات این منبع بروزرسانی شد ✓" : `بروزرسانی نشد: ${res.error ?? ""}`);
    await load();
  }

  async function syncAll() {
    setSyncingAll(true);
    setMsg("");
    const res = await api({ action: "syncAll" });
    setSyncingAll(false);
    const failed = (res.results ?? []).filter((r) => !r.ok);
    setMsg(
      res.ok
        ? failed.length === 0
          ? "همه منابع بروزرسانی شدند ✓"
          : `بروزرسانی انجام شد؛ ${failed.length} منبع ناموفق بود: ${failed.map((f) => f.title).join("، ")}`
        : `بروزرسانی نشد: ${res.error ?? ""}`,
    );
    await load();
  }

  async function remove(id: string) {
    setBusyId(id);
    const res = await api({ action: "remove", id });
    setBusyId(null);
    if (res.ok) setRows((p) => p.filter((r) => r.id !== id));
    else setMsg(`حذف نشد: ${res.error ?? ""}`);
  }

  const patch = (id: string, p: Partial<Source>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h2 className="text-sm font-extrabold text-[#0b1e3f] flex items-center gap-2">
          <Globe className="w-4 h-4" /> منابع اطلاعاتی هوش مصنوعی (بروزرسانی از سایت رسمی بیمه سامان)
        </h2>
        <button
          onClick={() => void syncAll()}
          disabled={syncingAll}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
        >
          {syncingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          بروزرسانی همه منابع
        </button>
      </div>
      <p className="text-[11px] text-slate-500 mb-4 leading-6">
        هر منبع یک صفحه رسمی بیمه سامان است. با بروزرسانی، متن صفحه خوانده و به یک برگه دانش فارسی (پوشش‌ها، استثناها،
        شرایط و مدارک) تبدیل می‌شود و در «دانش تأییدشده» با عنوان «منبع رسمی — …» ذخیره می‌گردد. نشانی سایت منبع هرگز به
        مشتری نشان داده نمی‌شود و فقط اطلاعات تماس و فروش نمایندگی آذرخش به کاربر داده می‌شود.
      </p>

      {msg && <div className="mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 leading-6">{msg}</div>}

      <div className="grid md:grid-cols-12 gap-2 mb-5 items-end">
        <label className="md:col-span-3 text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان منبع</span>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} placeholder="مثلاً بیمه درمان تکمیلی" />
        </label>
        <label className="md:col-span-5 text-xs">
          <span className="block font-bold text-slate-600 mb-1">نشانی صفحه رسمی</span>
          <input dir="ltr" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} className={inputCls} placeholder="https://www.samaninsurance.ir/..." />
        </label>
        <label className="md:col-span-2 text-xs">
          <span className="block font-bold text-slate-600 mb-1">شاخه بیمه</span>
          <input value={draft.branch} onChange={(e) => setDraft({ ...draft, branch: e.target.value })} className={inputCls} />
        </label>
        <button onClick={() => void add()} className="md:col-span-2 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
          <Plus className="w-4 h-4" /> افزودن منبع
        </button>
      </div>

      {loading && <div className="text-xs text-slate-500 py-4 text-center">در حال خواندن منابع…</div>}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3">
            <label className="md:col-span-3 text-xs">
              <span className="block font-bold text-slate-600 mb-1">عنوان</span>
              <input value={r.title} onChange={(e) => patch(r.id, { title: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-5 text-xs">
              <span className="block font-bold text-slate-600 mb-1">نشانی</span>
              <input dir="ltr" value={r.url} onChange={(e) => patch(r.id, { url: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">شاخه</span>
              <input value={r.branch ?? ""} onChange={(e) => patch(r.id, { branch: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">هر چند ساعت</span>
              <input type="number" min={1} value={r.interval_hours} onChange={(e) => patch(r.id, { interval_hours: Number(e.target.value) || 168 })} className={inputCls} />
            </label>

            <div className="md:col-span-12 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <input type="checkbox" checked={r.is_active} onChange={(e) => patch(r.id, { is_active: e.target.checked })} /> فعال
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <input type="checkbox" checked={r.auto_approve} onChange={(e) => patch(r.id, { auto_approve: e.target.checked })} /> انتشار خودکار برای هوش مصنوعی
              </label>
              <span className="text-[11px] text-slate-500">
                آخرین بروزرسانی: {fa(r.last_synced_at)}
                {r.last_status ? ` — وضعیت: ${r.last_status === "ok" ? "موفق" : r.last_status === "pending_review" ? "در انتظار تأیید" : "ناموفق"}` : ""}
                {r.last_chars ? ` — ${r.last_chars} کاراکتر` : ""}
              </span>
              {r.last_error && <span className="text-[11px] text-rose-600">خطا: {r.last_error}</span>}

              <div className="flex items-center gap-2 ms-auto">
                <button onClick={() => void saveRow(r)} disabled={busyId === r.id} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> ذخیره
                </button>
                <button onClick={() => void syncRow(r.id)} disabled={busyId === r.id} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-50">
                  {busyId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} بروزرسانی
                </button>
                <button onClick={() => void remove(r.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label="حذف">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-6">هنوز منبعی ثبت نشده است.</div>
        )}
      </div>

      <p className="mt-4 text-[11px] text-slate-500 leading-6">
        بروزرسانی خودکار زمان‌بندی‌شده: یک زمان‌بند (Cron) را به نشانی <span dir="ltr">/api/public/ai-sources/refresh</span> با
        هدر <span dir="ltr">Authorization: Bearer &lt;AI_SOURCES_CRON_SECRET&gt;</span> وصل کنید تا منابعی که زمان بروزرسانی‌شان
        رسیده، خودکار تازه شوند.
      </p>
    </div>
  );
}
