import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Bot, Loader2 } from "lucide-react";
import { AI_MODELS, DEFAULT_AI, type AiAssistantSettings } from "@/lib/site-config";

type Know = { id: string; title: string; content: string; tags: string | null; position: number; is_active: boolean };
const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

export function AiPane() {
  const [cfg, setCfg] = useState<AiAssistantSettings>(DEFAULT_AI);
  const [rows, setRows] = useState<Know[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [test, setTest] = useState("");
  const [testOut, setTestOut] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    void (async () => {
      setCfg(await adminReadSetting<AiAssistantSettings>("ai_assistant", DEFAULT_AI));
      const { data } = await adminDb("ai_knowledge").select("*").order("position", { ascending: true });
      setRows((data ?? []) as Know[]);
    })();
  }, []);

  async function saveAll() {
    setBusy(true);
    setMsg("");
    const s = await adminWriteSetting("ai_assistant", cfg);
    const res = await Promise.all(
      rows.map((r) =>
        adminDb("ai_knowledge")
          .update({ title: r.title, content: r.content, tags: r.tags, position: r.position, is_active: r.is_active })
          .eq("id", r.id),
      ),
    );
    setBusy(false);
    setMsg(s.error || res.some((r) => r.error) ? "ذخیره ناقص انجام شد." : "تنظیمات و دانش ذخیره شد ✓");
  }

  async function addRow() {
    const { data, error } = await adminDb("ai_knowledge")
      .insert({ title: "موضوع جدید", content: "توضیح صحیح و تأییدشده را اینجا بنویسید.", position: rows.length + 1, is_active: true })
      .select()
      .single();
    if (!error && data) setRows((r) => [...r, data as Know]);
  }

  async function remove(id: string) {
    await adminDb("ai_knowledge").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  async function runTest() {
    if (!test.trim()) return;
    setTesting(true);
    setTestOut("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: test.trim() }] }),
      });
      const data = (await res.json()) as { ok: boolean; reply?: string; error?: string };
      setTestOut(data.ok && data.reply ? data.reply : `خطا: ${data.error ?? res.status}`);
    } catch {
      setTestOut("خطای شبکه");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f]">چت هوش مصنوعی</h1>
          <p className="text-sm text-slate-500 mt-1">
            انتخاب موتور هوش مصنوعی، دستور رفتاری و اصلاح اطلاعات محصولات بیمه سامان.
          </p>
        </div>
        <button onClick={() => void saveAll()} disabled={busy} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
          <Save className="w-4 h-4" /> ذخیره
        </button>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">موتور هوش مصنوعی</span>
          <select value={cfg.model} onChange={(e) => setCfg({ ...cfg, model: e.target.value })} className={inputCls}>
            {AI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">عنوان پنجره چت</span>
          <input value={cfg.title} onChange={(e) => setCfg({ ...cfg, title: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">پیام خوش‌آمد</span>
          <input value={cfg.welcome} onChange={(e) => setCfg({ ...cfg, welcome: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs md:col-span-2">
          <span className="block font-bold text-slate-600 mb-1">دستور رفتاری (به هوش مصنوعی چه چیزی را توضیح دهد)</span>
          <textarea rows={5} value={cfg.systemPrompt} onChange={(e) => setCfg({ ...cfg, systemPrompt: e.target.value })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">میزان خلاقیت ({cfg.temperature})</span>
          <input type="range" min={0} max={1} step={0.1} value={cfg.temperature} onChange={(e) => setCfg({ ...cfg, temperature: Number(e.target.value) })} className="w-full" />
        </label>
        <label className="text-xs flex items-end gap-2">
          <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش دستیار در سایت</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[#0b1e3f]">دانش تأییدشده (اصلاح اطلاعات بیمه سامان)</h2>
          <button onClick={() => void addRow()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
            <Plus className="w-4 h-4" /> مورد جدید
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mb-4 leading-6">
          هر موردی که اینجا ثبت شود برای هوش مصنوعی معتبرتر از دانش عمومی آن است؛ اگر پاسخی نادرست بود، اطلاعات صحیح را اینجا ثبت کنید.
        </p>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3">
              <label className="md:col-span-4 text-xs">
                <span className="block font-bold text-slate-600 mb-1">عنوان</span>
                <input value={r.title} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, title: e.target.value } : x)))} className={inputCls} />
              </label>
              <label className="md:col-span-4 text-xs">
                <span className="block font-bold text-slate-600 mb-1">برچسب‌ها</span>
                <input value={r.tags ?? ""} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, tags: e.target.value } : x)))} className={inputCls} />
              </label>
              <label className="md:col-span-2 text-xs">
                <span className="block font-bold text-slate-600 mb-1">ترتیب</span>
                <input type="number" value={r.position} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, position: Number(e.target.value) } : x)))} className={inputCls} />
              </label>
              <div className="md:col-span-2 flex items-end justify-between">
                <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <input type="checkbox" checked={r.is_active} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, is_active: e.target.checked } : x)))} /> فعال
                </label>
                <button onClick={() => void remove(r.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label="حذف">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <label className="md:col-span-12 text-xs">
                <span className="block font-bold text-slate-600 mb-1">متن صحیح</span>
                <textarea rows={4} value={r.content} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, content: e.target.value } : x)))} className={inputCls} />
              </label>
            </div>
          ))}
          {rows.length === 0 && <div className="text-xs text-slate-500 text-center py-6">موردی ثبت نشده است.</div>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-extrabold text-[#0b1e3f] mb-3 flex items-center gap-2">
          <Bot className="w-4 h-4" /> آزمایش پاسخ
        </h2>
        <div className="flex gap-2">
          <input value={test} onChange={(e) => setTest(e.target.value)} placeholder="مثلاً: بیمه عمر و تشکیل سرمایه سامان چه پوشش‌هایی دارد؟" className={inputCls} />
          <button onClick={() => void runTest()} disabled={testing} className="text-xs px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 shrink-0">
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : "ارسال"}
          </button>
        </div>
        {testOut && <div className="mt-3 text-xs leading-6 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">{testOut}</div>}
        <p className="mt-3 text-[11px] text-slate-500">برای اعمال تنظیمات جدید در آزمایش، ابتدا دکمه «ذخیره» را بزنید.</p>
      </div>
    </div>
  );
}
