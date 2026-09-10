import { useEffect, useState } from "react";
import { Save, Loader2, BookOpen } from "lucide-react";
import { adminDb } from "@/lib/admin-db";

type Row = {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  position: number;
  is_active: boolean;
};

const BRANCHES = [
  "شخص ثالث",
  "بدنه خودرو",
  "عمر و تشکیل سرمایه",
  "درمان تکمیلی",
  "آتش‌سوزی",
  "مسئولیت",
  "مسافرتی",
  "حوادث انفرادی",
  "باربری",
  "مهندسی",
  "انرژی",
  "بیمه‌های خرد و اعتباری",
];

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const tagOf = (b: string) => `sales:${b}`;

/** Editable sales playbook per insurance branch; stored as approved AI knowledge. */
export function SalesPlaybookSection() {
  const [branch, setBranch] = useState(BRANCHES[0]!);
  const [rows, setRows] = useState<Row[]>([]);
  const [pitch, setPitch] = useState("");
  const [objections, setObjections] = useState("");
  const [payment, setPayment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await adminDb("ai_knowledge").select("*").like("tags", "sales:%");
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  useEffect(() => {
    const row = rows.find((r) => r.tags === tagOf(branch));
    const parts = (row?.content ?? "").split("\n---\n");
    setPitch(parts[0] ?? "");
    setObjections(parts[1] ?? "");
    setPayment(parts[2] ?? "");
  }, [branch, rows]);

  async function save() {
    setBusy(true);
    setMsg("");
    const content = [pitch.trim(), objections.trim(), payment.trim()].join("\n---\n");
    const title = `روش فروش ${branch}`;
    const tags = tagOf(branch);
    const existing = rows.find((r) => r.tags === tags);
    if (existing) {
      const { error } = await adminDb("ai_knowledge").update({ title, content, is_active: true }).eq("id", existing.id);
      if (!error) setRows((p) => p.map((r) => (r.id === existing.id ? { ...r, title, content } : r)));
      setMsg(error ? "ذخیره نشد." : "ذخیره شد ✓");
    } else {
      const { data, error } = await adminDb("ai_knowledge")
        .insert({ title, content, tags, position: 100 + BRANCHES.indexOf(branch), is_active: true })
        .select()
        .single();
      if (!error && data) setRows((p) => [...p, data as Row]);
      setMsg(error ? "ذخیره نشد." : "ذخیره شد ✓");
    }
    setBusy(false);
  }

  const filled = rows.filter((r) => (r.content ?? "").trim().length > 0).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-extrabold text-[#0b1e3f] flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> روش‌های فروش هر شاخه بیمه
        </h2>
        <span className="text-[11px] text-slate-500">{filled} شاخه تکمیل شده</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-4 leading-6">
        متن فروش، پاسخ به اعتراض‌های رایج و روش‌های پرداخت هر شاخه را اینجا بنویسید؛ هوش مصنوعی مثل یک نماینده حرفه‌ای
        بیمه سامان از همین اطلاعات استفاده می‌کند.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {BRANCHES.map((b) => {
          const has = rows.some((r) => r.tags === tagOf(b) && (r.content ?? "").trim());
          return (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`text-[11px] px-3 py-1.5 rounded-full border ${
                branch === b ? "bg-[#0b1e3f] text-white border-[#0b1e3f]" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              {has ? "✓ " : ""}
              {b}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">روش و متن فروش</span>
          <textarea rows={6} value={pitch} onChange={(e) => setPitch(e.target.value)} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">پاسخ به اعتراض‌های مشتری</span>
          <textarea rows={6} value={objections} onChange={(e) => setObjections(e.target.value)} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">روش‌های پرداخت و اقساط</span>
          <textarea rows={6} value={payment} onChange={(e) => setPayment(e.target.value)} className={inputCls} />
        </label>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => void save()}
          disabled={busy}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} ذخیره این شاخه
        </button>
        {msg && <span className="text-[11px] text-slate-600">{msg}</span>}
      </div>
    </div>
  );
}
