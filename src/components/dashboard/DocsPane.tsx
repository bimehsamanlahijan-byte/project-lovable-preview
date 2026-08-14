import { adminSignedUrl } from "@/lib/admin.functions";
import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Download, RefreshCw } from "lucide-react";
import { DEFAULT_DOCS, type DocsIntakeSettings } from "@/lib/site-config";

type Doc = {
  id: string; session_id: string; full_name: string; phone: string; category: string | null;
  note: string | null; file_path: string; file_name: string; size_bytes: number | null;
  status: string; created_at: string;
};
type Cat = { id: string; label: string; position: number; is_active: boolean };
const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const STATUSES = ["new", "reviewing", "approved", "rejected"];
const STATUS_FA: Record<string, string> = { new: "جدید", reviewing: "در بررسی", approved: "تأیید شده", rejected: "رد شده" };

export function DocsPane() {
  const [cfg, setCfg] = useState<DocsIntakeSettings>(DEFAULT_DOCS);
  const [cats, setCats] = useState<Cat[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    setCfg(await adminReadSetting<DocsIntakeSettings>("docs_intake", DEFAULT_DOCS));
    const [c, d] = await Promise.all([
      adminDb("document_categories").select("*").order("position", { ascending: true }),
      adminDb("customer_documents").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setCats((c.data ?? []) as Cat[]);
    setDocs((d.data ?? []) as Doc[]);
  }
  useEffect(() => {
    void load();
  }, []);

  async function save() {
    const s = await adminWriteSetting("docs_intake", cfg);
    const r = await Promise.all(
      cats.map((c) =>
        adminDb("document_categories").update({ label: c.label, position: c.position, is_active: c.is_active }).eq("id", c.id),
      ),
    );
    setMsg(s.error || r.some((x) => x.error) ? "ذخیره ناقص انجام شد." : "ذخیره شد ✓");
  }

  async function addCat() {
    const { data, error } = await adminDb("document_categories")
      .insert({ label: "دسته جدید", position: cats.length + 1, is_active: true })
      .select()
      .single();
    if (!error && data) setCats((p) => [...p, data as Cat]);
  }

  async function open(path: string) {
    const res = await adminSignedUrl({ data: { bucket: "customer-documents", path } });
    if (!res.url) return setMsg("دریافت فایل ممکن نشد.");
    window.open(res.url, "_blank", "noopener");
  }


  async function setStatus(id: string, status: string) {
    setDocs((p) => p.map((d) => (d.id === id ? { ...d, status } : d)));
    await adminDb("customer_documents").update({ status }).eq("id", id);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f]">مخزن مدارک مشتریان</h1>
          <p className="text-sm text-slate-500 mt-1">مدارک ارسالی از چت سایت، همراه با دسته‌های قابل ویرایش.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            <RefreshCw className="w-4 h-4" /> بازخوانی
          </button>
          <button onClick={() => void save()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white">
            <Save className="w-4 h-4" /> ذخیره تنظیمات
          </button>
        </div>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-4 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان بخش ارسال مدارک</span>
          <input value={cfg.title} onChange={(e) => setCfg({ ...cfg, title: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">حداکثر حجم (مگابایت)</span>
          <input type="number" value={cfg.maxSizeMb} onChange={(e) => setCfg({ ...cfg, maxSizeMb: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">فرمت‌های مجاز</span>
          <input dir="ltr" value={cfg.acceptedTypes} onChange={(e) => setCfg({ ...cfg, acceptedTypes: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs flex items-end gap-2">
          <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
          <span className="font-bold text-slate-600">فعال بودن ارسال مدارک</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[#0b1e3f]">دسته‌های مدارک (منوی قابل ویرایش)</h2>
          <button onClick={() => void addCat()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
            <Plus className="w-4 h-4" /> دسته جدید
          </button>
        </div>
        <div className="space-y-2">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <input value={c.label} onChange={(e) => setCats((p) => p.map((x) => (x.id === c.id ? { ...x, label: e.target.value } : x)))} className={inputCls} />
              <input type="number" value={c.position} onChange={(e) => setCats((p) => p.map((x) => (x.id === c.id ? { ...x, position: Number(e.target.value) } : x)))} className="w-20 text-xs rounded-lg border border-slate-300 px-2 py-2" />
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 shrink-0">
                <input type="checkbox" checked={c.is_active} onChange={(e) => setCats((p) => p.map((x) => (x.id === c.id ? { ...x, is_active: e.target.checked } : x)))} /> فعال
              </label>
              <button
                onClick={async () => {
                  await adminDb("document_categories").delete().eq("id", c.id);
                  setCats((p) => p.filter((x) => x.id !== c.id));
                }}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                aria-label="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 text-sm font-extrabold text-[#0b1e3f]">
          مدارک دریافتی ({docs.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {["نام", "تلفن", "دسته", "فایل", "وضعیت", "تاریخ", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-right font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{d.full_name}</td>
                  <td className="px-4 py-3" dir="ltr">{d.phone}</td>
                  <td className="px-4 py-3">{d.category ?? "—"}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate" title={d.file_name}>{d.file_name}</td>
                  <td className="px-4 py-3">
                    <select value={d.status} onChange={(e) => void setStatus(d.id, e.target.value)} className="text-xs rounded-lg border border-slate-300 px-2 py-1">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_FA[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(d.created_at).toLocaleDateString("fa-IR")}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => void open(d.file_path)} className="flex items-center gap-1 text-teal-700 font-bold">
                      <Download className="w-4 h-4" /> دریافت
                    </button>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">مدرکی دریافت نشده است.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
