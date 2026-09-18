import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Images, Plus, Save, Trash2, Upload } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { DEFAULT_HOME_CONTENT, type HomeContentSettings } from "@/lib/site-config";

const input = "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs";
type Asset = { name: string; url: string; mime: string | null };

async function upload(file: File, folder: string) {
  const body = new FormData(); body.append("file", file); body.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json() as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "آپلود انجام نشد");
  return json.url;
}

function MediaChoice({ value, onChange, accept = "image/*,video/*" }: { value: string; onChange: (v: string) => void; accept?: string }) {
  const [open, setOpen] = useState(false); const [assets, setAssets] = useState<Asset[]>([]); const file = useRef<HTMLInputElement>(null);
  async function library() { const r = await fetch("/api/admin/assets?folder=media"); const j = await r.json() as { files?: Asset[] }; setAssets(j.files ?? []); setOpen(true); }
  return <div className="space-y-2">
    <input dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} placeholder="نشانی رسانه" className={input} />
    <div className="flex gap-2">
      <input ref={file} type="file" accept={accept} className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) onChange(await upload(f, "media")); e.currentTarget.value = ""; }} />
      <button type="button" onClick={() => file.current?.click()} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-bold"><Upload className="h-3.5 w-3.5" /> آپلود</button>
      <button type="button" onClick={() => void library()} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-bold"><Images className="h-3.5 w-3.5" /> کتابخانه</button>
    </div>
    {open && <div className="grid max-h-52 grid-cols-4 gap-2 overflow-auto rounded-xl border bg-slate-50 p-2">{assets.map((a) => <button type="button" key={a.url} onClick={() => { onChange(a.url); setOpen(false); }} className="aspect-square overflow-hidden rounded-lg border bg-white">{a.mime?.startsWith("video/") ? <video src={a.url} muted className="h-full w-full object-cover" /> : <img src={a.url} alt={a.name} className="h-full w-full object-cover" />}</button>)}</div>}
  </div>;
}

export function HomeContentPane() {
  const [cfg, setCfg] = useState(DEFAULT_HOME_CONTENT); const [msg, setMsg] = useState("");
  useEffect(() => { void adminReadSetting<HomeContentSettings>("home_content", DEFAULT_HOME_CONTENT).then(setCfg); }, []);
  const save = async () => { const r = await adminWriteSetting("home_content", cfg); setMsg(r.ok ? "ذخیره شد ✓" : "ذخیره انجام نشد"); };
  const move = (kind: "articles" | "partners", i: number, d: number) => { const list = [...cfg[kind]]; const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j]!, list[i]!]; setCfg({ ...cfg, [kind]: list }); };
  return <div dir="rtl" className="space-y-5">
    <section className="rounded-2xl border bg-white p-5 space-y-3"><h2 className="font-extrabold text-slate-900">اپلیکیشن بیمه سامان</h2><div className="grid gap-3 md:grid-cols-2"><MediaChoice value={cfg.appImageUrl} onChange={(v) => setCfg({ ...cfg, appImageUrl: v })} accept="image/*" /><div className="space-y-2"><input className={input} value={cfg.appTitle} onChange={(e) => setCfg({...cfg, appTitle:e.target.value})} placeholder="عنوان"/><textarea className={input} rows={4} value={cfg.appDescription} onChange={(e) => setCfg({...cfg, appDescription:e.target.value})}/><div className="grid grid-cols-2 gap-2"><input className={input} value={cfg.appButtonLabel} onChange={(e)=>setCfg({...cfg,appButtonLabel:e.target.value})} placeholder="متن دکمه"/><input dir="ltr" className={input} value={cfg.appButtonHref} onChange={(e)=>setCfg({...cfg,appButtonHref:e.target.value})} placeholder="لینک"/></div></div></div></section>
    <section className="rounded-2xl border bg-white p-5 space-y-3"><div className="flex justify-between"><h2 className="font-extrabold">کارت‌های مقاله</h2><button type="button" onClick={()=>setCfg({...cfg,articles:[...cfg.articles,{id:crypto.randomUUID(),title:"مقاله جدید",excerpt:"",mediaUrl:"",mediaType:"image",href:"#"}]})} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"><Plus className="h-4 w-4"/>افزودن</button></div>{cfg.articles.map((a,i)=><div key={a.id} className="grid gap-2 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]"><MediaChoice value={a.mediaUrl} onChange={(v)=>setCfg({...cfg,articles:cfg.articles.map((x,n)=>n===i?{...x,mediaUrl:v,mediaType:/\.(mp4|webm|mov)(\?|$)/i.test(v)?"video":"image"}:x)})}/><div className="space-y-2"><input className={input} value={a.title} onChange={(e)=>setCfg({...cfg,articles:cfg.articles.map((x,n)=>n===i?{...x,title:e.target.value}:x)})}/><textarea className={input} value={a.excerpt} onChange={(e)=>setCfg({...cfg,articles:cfg.articles.map((x,n)=>n===i?{...x,excerpt:e.target.value}:x)})}/><input dir="ltr" className={input} value={a.href} onChange={(e)=>setCfg({...cfg,articles:cfg.articles.map((x,n)=>n===i?{...x,href:e.target.value}:x)})}/></div><div className="flex md:flex-col"><button onClick={()=>move("articles",i,-1)}><ArrowUp className="h-4 w-4"/></button><button onClick={()=>move("articles",i,1)}><ArrowDown className="h-4 w-4"/></button><button onClick={()=>setCfg({...cfg,articles:cfg.articles.filter((_,n)=>n!==i)})}><Trash2 className="h-4 w-4 text-rose-600"/></button></div></div>)}</section>
    <section className="rounded-2xl border bg-white p-5 space-y-3"><div className="flex justify-between"><h2 className="font-extrabold">شرکای تجاری</h2><button type="button" onClick={()=>setCfg({...cfg,partners:[...cfg.partners,{id:crypto.randomUUID(),title:"شریک جدید",description:"",imageUrl:"",buttonLabel:"",buttonHref:"#"}]})} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"><Plus className="h-4 w-4"/>افزودن</button></div>{cfg.partners.map((p,i)=><div key={p.id} className="grid gap-2 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]"><MediaChoice value={p.imageUrl} onChange={(v)=>setCfg({...cfg,partners:cfg.partners.map((x,n)=>n===i?{...x,imageUrl:v}:x)})} accept="image/*"/><div className="grid gap-2 sm:grid-cols-2"><input className={input} value={p.title} onChange={(e)=>setCfg({...cfg,partners:cfg.partners.map((x,n)=>n===i?{...x,title:e.target.value}:x)})}/><input className={input} value={p.description} onChange={(e)=>setCfg({...cfg,partners:cfg.partners.map((x,n)=>n===i?{...x,description:e.target.value}:x)})}/><input className={input} value={p.buttonLabel} onChange={(e)=>setCfg({...cfg,partners:cfg.partners.map((x,n)=>n===i?{...x,buttonLabel:e.target.value}:x)})} placeholder="متن دکمه"/><input dir="ltr" className={input} value={p.buttonHref} onChange={(e)=>setCfg({...cfg,partners:cfg.partners.map((x,n)=>n===i?{...x,buttonHref:e.target.value}:x)})}/></div><div className="flex md:flex-col"><button onClick={()=>move("partners",i,-1)}><ArrowUp className="h-4 w-4"/></button><button onClick={()=>move("partners",i,1)}><ArrowDown className="h-4 w-4"/></button><button onClick={()=>setCfg({...cfg,partners:cfg.partners.filter((_,n)=>n!==i)})}><Trash2 className="h-4 w-4 text-rose-600"/></button></div></div>)}</section>
    <button type="button" onClick={()=>void save()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"><Save className="h-4 w-4"/>ذخیره محتوای صفحه اصلی</button>{msg&&<span className="mr-3 text-xs font-bold text-emerald-700">{msg}</span>}
  </div>;
}