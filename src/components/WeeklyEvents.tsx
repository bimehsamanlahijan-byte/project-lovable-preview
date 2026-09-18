import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { buildSandboxDocument } from "@/lib/overlays";
import { DEFAULT_WEEKLY_EVENTS, type WeeklyEventBanner, type WeeklyEventsSettings } from "@/lib/site-config";

const DISMISSED = "weekly-events-dismissed-v1";
function EventCard({ item, dismiss }: { item: WeeklyEventBanner; dismiss: () => void }) {
  return <aside className={`weekly-event weekly-event-${item.animation} relative overflow-hidden rounded-lg border border-border bg-card shadow-elegant`} aria-label={item.title || "رویداد هفته"}>
    <button type="button" onClick={dismiss} aria-label="بستن بنر" className="absolute right-1 top-1 z-10 grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground shadow"><X className="h-4 w-4"/></button>
    {item.widgetHtml ? <iframe title={item.widgetName || item.title || "ویجت رویداد"} sandbox="allow-scripts" srcDoc={buildSandboxDocument(item.widgetHtml)} className="aspect-[4/3] w-full border-0"/> : item.imageUrl ? <a href={item.href || "#"}><img src={item.imageUrl} alt={item.title || "بنر رویداد هفته"} className="aspect-[4/3] w-full object-cover"/></a> : null}
    {(item.title || item.text) && <div className="p-3">{item.title&&<h3 className="text-sm font-extrabold">{item.title}</h3>}{item.text&&<p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>}</div>}
  </aside>;
}
export function WeeklyEvents() {
  const cfg = useSiteSetting<WeeklyEventsSettings>("weekly_events", DEFAULT_WEEKLY_EVENTS); const [gone,setGone]=useState<string[]>([]);
  useEffect(()=>{try{setGone(JSON.parse(localStorage.getItem(DISMISSED)||"[]"))}catch{setGone([])}},[]);
  const dismiss=(id:string)=>setGone((v)=>{const next=[...new Set([...v,id])]; localStorage.setItem(DISMISSED,JSON.stringify(next)); return next;});
  const render=(side:"left"|"right")=>cfg.banners.filter((b)=>b.enabled&&b.side===side&&!gone.includes(b.id)).sort((a,b)=>a.slot-b.slot).slice(0,6);
  return <>{(["left","right"] as const).map((side)=>{const list=render(side); return list.length?<div key={side} className={`fixed top-28 z-30 hidden w-52 space-y-3 2xl:block ${side==="left"?"left-4":"right-4"}`}>{list.map((b)=><EventCard key={b.id} item={b} dismiss={()=>dismiss(b.id)}/>)}</div>:null;})}</>;
}