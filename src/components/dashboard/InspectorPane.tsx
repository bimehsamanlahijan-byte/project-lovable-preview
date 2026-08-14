import { useEffect, useRef, useState } from "react";
import { Bug, Copy, Monitor, RefreshCw, Save, Smartphone, Trash2 } from "lucide-react";
import { EDITOR_PAGES } from "@/lib/editor-pages";
import { adminWriteSetting } from "@/lib/admin-db";
import { VE_SETTING_KEY, type OverrideMap } from "@/lib/visual-editor";

type Report = {
  selector: string;
  tag: string;
  id: string;
  classes: string;
  text: string;
  html: string;
  inner?: string;
  href?: string;
  source: string;
  url: string;
  viewport: string;
  box: string;
  styles: Record<string, string>;
  errors: string[];
  userAgent: string;
};

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
const cardCls = "bg-white rounded-2xl border border-slate-200 p-5";
const btnCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs flex items-center gap-1.5";

function toText(r: Report) {
  return [
    "### گزارش ایرادیاب سایت",
    `صفحه: ${r.url}`,
    `المنت: <${r.tag}>  |  انتخابگر: ${r.selector}`,
    r.id ? `id: ${r.id}` : "",
    r.classes ? `class: ${r.classes}` : "",
    r.href ? `لینک: ${r.href}` : "",
    r.source ? `منبع کد: ${r.source}` : "",
    `ابعاد: ${r.box}  |  ویوپورت: ${r.viewport}`,
    r.text ? `متن: ${r.text}` : "",
    "",
    "استایل‌ها:",
    ...Object.entries(r.styles).map(([k, v]) => `  ${k}: ${v}`),
    "",
    "HTML:",
    r.html,
    "",
    r.errors.length ? "خطاهای ثبت‌شده:" : "خطای جاوااسکریپتی ثبت نشد.",
    ...r.errors,
    "",
    `User-Agent: ${r.userAgent}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function InspectorPane() {
  const [page, setPage] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [mode, setMode] = useState<"select" | "interact">("select");
  const [wide, setWide] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [published, setPublished] = useState(false);
  const [editHtml, setEditHtml] = useState("");
  const [editText, setEditText] = useState("");
  const [editHref, setEditHref] = useState("");
  const frame = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as {
        type?: string;
        payload?: Report;
        path?: string;
        map?: OverrideMap;
      };
      if (d?.type === "ve:inspect" && d.payload) {
        setReport(d.payload);
        setEditHtml(d.payload.inner ?? "");
        setEditText(d.payload.text ?? "");
        setEditHref(d.payload.href ?? "");
        setCopied(false);
        setSavedOk(false);
      }
      if (d?.type === "ve:map" && d.map) {
        void adminWriteSetting(VE_SETTING_KEY, { map: d.map });
        setPublished(true);
        window.setTimeout(() => setPublished(false), 2000);
      }
      if ((d?.type === "ve:ready" || d?.type === "ve:navigate" || d?.type === "ve:inspect-ready") && d.path) {
        setCurrentPath(d.path.replace(/[?&]ve=1/, "").replace(/[?&]inspect=1/, "").replace(/\?$/, "") || "/");
      }
      if (d?.type === "ve:ready" || d?.type === "ve:inspect-ready") {
        frame.current?.contentWindow?.postMessage({ type: "ve:mode", mode: modeRef.current }, "*");
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const modeRef = useRef<"select" | "interact">("select");
  useEffect(() => {
    modeRef.current = mode;
    frame.current?.contentWindow?.postMessage({ type: "ve:mode", mode }, "*");
  }, [mode]);

  const srcFor = (p: string) => `${p}${p.includes("?") ? "&" : "?"}ve=1&inspect=1`;

  async function copy() {
    if (!report) return;
    await navigator.clipboard.writeText(toText(report));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  /** Apply the corrected markup/text/link to the live site (saved online). */
  function applyFix() {
    if (!report) return;
    const patch: Record<string, unknown> = {};
    if (editHtml && editHtml !== (report.inner ?? "")) patch.html = editHtml;
    else if (editText && editText !== report.text) patch.text = editText;
    if (editHref !== (report.href ?? "")) patch.href = editHref;
    frame.current?.contentWindow?.postMessage(
      { type: "ve:update", selector: report.selector, patch },
      "*",
    );
    setSavedOk(true);
    window.setTimeout(() => setSavedOk(false), 2500);
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2">
          <Bug className="w-6 h-6" /> موس ایرادیاب و کدیاب
        </h1>
        <p className="text-sm text-slate-500 mt-1 leading-6">
          روی هر بخش از سایت کلیک کنید تا کد، استایل و خطاهای احتمالی همان بخش استخراج شود؛ سپس می‌توانید همان‌جا کد را
          اصلاح و به‌صورت آنلاین روی سایت جایگزین کنید.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={page}
          onChange={(e) => { setPage(e.target.value); setReport(null); }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
        >
          {EDITOR_PAGES.map((p) => (
            <option key={p.path} value={p.path}>{p.label}</option>
          ))}
        </select>

        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
          <button onClick={() => setDevice("desktop")}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "desktop" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Monitor className="w-3.5 h-3.5" /> دسکتاپ
          </button>
          <button onClick={() => setDevice("mobile")}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "mobile" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Smartphone className="w-3.5 h-3.5" /> موبایل
          </button>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
          <button onClick={() => setMode("select")}
            className={`px-3 py-2 text-xs font-bold ${mode === "select" ? "bg-[#0b1e3f] text-white" : ""}`}>
            حالت انتخاب
          </button>
          <button onClick={() => setMode("interact")}
            className={`px-3 py-2 text-xs font-bold ${mode === "interact" ? "bg-[#0b1e3f] text-white" : ""}`}>
            حالت تعامل
          </button>
        </div>

        <button onClick={() => { if (frame.current) frame.current.src = `${srcFor(page)}&t=${Date.now()}`; }} className={btnCls}>
          <RefreshCw className="w-3.5 h-3.5" /> بازخوانی
        </button>
        <button onClick={() => setWide((w) => !w)} className={btnCls}>
          {wide ? "نمای معمولی" : "نمای بزرگ"}
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = customPath.trim();
            if (!p) return;
            const path = p.startsWith("/") ? p : `/${p}`;
            setPage(path);
            setReport(null);
            if (frame.current) frame.current.src = `${srcFor(path)}&t=${Date.now()}`;
          }}
          className="flex items-center gap-1"
        >
          <input value={customPath} onChange={(e) => setCustomPath(e.target.value)} dir="ltr"
            placeholder="/insurance/car/body" className={`${inputCls} w-56`} />
          <button type="submit" className={btnCls}>باز کن</button>
        </form>

        {published && <span className="text-[11px] text-emerald-600 font-bold px-2">روی سایت منتشر شد ✓</span>}
        <span className="text-[11px] text-slate-500 font-mono px-2" dir="ltr">{currentPath}</span>
      </div>

      <p className="text-[11px] text-slate-500 mb-3 leading-6">
        در «حالت تعامل» سایت کاملاً واقعی کار می‌کند و می‌توانید وارد زیرصفحه‌ها، لینک‌های بک‌لینک و دکمه‌ها شوید؛ برای
        گرفتن کد یک عنصر در این حالت، در کامپیوتر Alt را نگه دارید و کلیک کنید و در موبایل انگشت را روی عنصر نگه دارید.
      </p>

      <div className={wide ? "grid gap-5" : "grid lg:grid-cols-3 gap-5"}>
        <div className={`${cardCls} ${wide ? "" : "lg:col-span-2"} overflow-hidden`}>
          <div className="mx-auto" style={{ width: device === "mobile" ? 390 : "100%" }}>
            <iframe
              ref={frame}
              src={srcFor(page)}
              title="inspector"
              className={`w-full rounded-xl border border-slate-200 bg-white ${wide ? "h-[85vh]" : "h-[70vh]"}`}
            />
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-[#0b1e3f]">گزارش انتخاب‌شده</h2>
            <div className="flex gap-2">
              <button onClick={() => setReport(null)} className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> پاک
              </button>
              <button onClick={() => void copy()} disabled={!report} className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-50 flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> {copied ? "کپی شد ✓" : "کپی گزارش"}
              </button>
            </div>
          </div>

          {report ? (
            <div className="space-y-3">
              <textarea readOnly dir="ltr" value={toText(report)}
                className="w-full h-[26vh] text-[11px] font-mono rounded-xl border border-slate-200 p-3 bg-slate-50" />

              <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="text-xs font-extrabold text-[#0b1e3f]">اصلاح و جایگزینی آنلاین</div>

                <label className="block text-[11px] text-slate-500">کد داخلی (HTML/SVG)</label>
                <textarea rows={5} dir="ltr" value={editHtml} onChange={(e) => setEditHtml(e.target.value)}
                  className="w-full text-[11px] font-mono rounded-lg border border-slate-300 p-2" />

                <label className="block text-[11px] text-slate-500">متن</label>
                <textarea rows={2} value={editText} onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2" />

                <label className="block text-[11px] text-slate-500">لینک (href / بک‌لینک)</label>
                <input dir="ltr" value={editHref} onChange={(e) => setEditHref(e.target.value)} className={inputCls} />

                <button onClick={applyFix}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0b1e3f] text-white text-xs font-bold flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {savedOk ? "اعمال شد ✓" : "جایگزینی و انتشار آنلاین"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-6">
              با موس (یا لمس در موبایل) روی هر عنصر داخل پیش‌نمایش کلیک کنید تا گزارش کامل آن اینجا ساخته شود؛ سپس
              می‌توانید کد را اصلاح و روی سایت جایگزین کنید یا با «کپی گزارش» برای توسعه‌دهنده بفرستید.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
