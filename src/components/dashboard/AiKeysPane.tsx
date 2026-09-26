import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, KeyRound, Loader2, Pencil, PlugZap, Save, Trash2, XCircle } from "lucide-react";

import { AI_PROVIDERS } from "@/lib/ai-providers";
import { KEY_GUIDES } from "@/lib/ai-key-guides";
import { deleteAiKey, listAiKeys, saveAiKey, testAiKey } from "@/lib/ai-keys.functions";
import { notifyFailed, notifySaved } from "@/lib/notify";
import { EnvVarSteps, GlassHelp, Steps } from "./GlassHelp";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const btn = "flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold hover:bg-slate-50 disabled:opacity-50";

type Row = Awaited<ReturnType<typeof listAiKeys>>[number];
type Test = Awaited<ReturnType<typeof testAiKey>>;

/** «کلیدهای هوش مصنوعی» — enter / edit / delete / test each engine's key. */
export function AiKeysPane() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<string>("");
  const [key, setKey] = useState("");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState("");
  const [tests, setTests] = useState<Record<string, Test>>({});

  async function load() {
    try {
      setRows(await listAiKeys());
    } catch (e: any) {
      notifyFailed("کلیدهای هوش مصنوعی", e?.message || String(e));
    }
  }
  useEffect(() => void load(), []);

  async function save(id: string) {
    setBusy(`save:${id}`);
    try {
      const r = await saveAiKey({ data: { provider: id, key, extra } });
      if (!r.ok) return notifyFailed("ذخیره کلید", r.error || "");
      notifySaved("کلید در بخش خصوصی ذخیره شد");
      setEditing("");
      setKey("");
      setExtra("");
      await load();
    } catch (e: any) {
      notifyFailed("ذخیره کلید", e?.message || String(e));
    } finally {
      setBusy("");
    }
  }

  async function remove(id: string) {
    if (!confirm("کلید این موتور حذف شود؟")) return;
    setBusy(`del:${id}`);
    const r = await deleteAiKey({ data: { provider: id } });
    setBusy("");
    if (!r.ok) return notifyFailed("حذف کلید", r.error || "");
    notifySaved("کلید حذف شد");
    await load();
  }

  async function test(id: string) {
    setBusy(`test:${id}`);
    try {
      const r = await testAiKey({ data: { provider: id } });
      setTests((t) => ({ ...t, [id]: r }));
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]">
          <KeyRound className="h-4 w-4" /> کلیدهای API موتورهای هوش مصنوعی
        </h2>
        <p className="text-[11px] text-slate-500">
          کلیدها در بخش خصوصی دیتابیس ذخیره می‌شوند و بازدیدکننده سایت هرگز آن‌ها را نمی‌بیند؛ اینجا هم فقط چند حرف اول و آخر نمایش داده می‌شود.
        </p>
      </div>

      {AI_PROVIDERS.map((p) => {
        const row = rows.find((r) => r.id === p.id);
        const guide = KEY_GUIDES[p.id];
        const t = tests[p.id];
        return (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-extrabold text-[#0b1e3f]">{p.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {row?.stored ? (
                    <>ذخیره‌شده: <span dir="ltr">{row.masked}</span></>
                  ) : row?.inEnv ? (
                    "از متغیر سرور خوانده می‌شود"
                  ) : (
                    "کلیدی ثبت نشده"
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <GlassHelp title={`راهنمای کلید ${p.label}`}>
                  {guide && (
                    <>
                      <h4 className="font-extrabold text-[#0b1e3f]">محل گرفتن کلید</h4>
                      <a dir="ltr" href={guide.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#0b1e3f] underline">
                        <ExternalLink className="h-3.5 w-3.5" /> {guide.url}
                      </a>
                      <Steps items={guide.steps} />
                    </>
                  )}
                  <EnvVarSteps name={p.keyNames[0]!} />
                  {p.extraNames?.map((n) => (
                    <p key={n}>متغیر دوم لازم: <code dir="ltr" className="rounded bg-slate-100 px-1">{n}</code> (همان مراحل بالا).</p>
                  ))}
                </GlassHelp>
                <button className={btn} onClick={() => { setEditing(editing === p.id ? "" : p.id); setKey(""); setExtra(""); }}>
                  <Pencil className="h-3.5 w-3.5" /> {row?.stored ? "ویرایش" : "وارد کردن"}
                </button>
                {row?.stored && (
                  <button className={btn} disabled={!!busy} onClick={() => void remove(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> حذف
                  </button>
                )}
                <button className={btn} disabled={!!busy} onClick={() => void test(p.id)}>
                  {busy === `test:${p.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlugZap className="h-3.5 w-3.5" />} آزمایش اتصال
                </button>
              </div>
            </div>

            {editing === p.id && (
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  <input dir="ltr" type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} className={inputCls} placeholder={`${p.keyNames[0]} را اینجا بچسبانید`} />
                  {p.extraNames?.length ? (
                    <input dir="ltr" value={extra} onChange={(e) => setExtra(e.target.value)} className={inputCls} placeholder={p.extraNames[0]} />
                  ) : null}
                </div>
                <button className="flex items-center justify-center gap-1 rounded-lg bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={!key.trim() || !!busy} onClick={() => void save(p.id)}>
                  {busy === `save:${p.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره
                </button>
              </div>
            )}

            {t && (
              <div className={`mt-3 flex items-start gap-2 rounded-xl p-2 text-[11px] ${t.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {t.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                <span>
                  {t.ok ? `اتصال برقرار است (${t.ms} میلی‌ثانیه، مدل ${t.model}). پاسخ: ${t.reply}` : `اتصال ناموفق: ${t.error}`}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
