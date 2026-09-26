import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, FileJson, Loader2, RefreshCw, Upload } from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { notifyFailed, notifySaved } from "@/lib/notify";
import {
  CUSTOM_PAGES_KEY,
  sanitizeSlug,
  type Block,
  type CustomPage,
  type CustomPagesMap,
} from "@/lib/custom-pages";
import {
  DEFAULT_GRABBER_OPTIONS,
  buildGrabberScript,
  looksLikeGrabbedPage,
  type GrabberOptions,
} from "@/lib/page-grabber-script";

/**
 * «دانلود صفحه» pane.
 *
 * Generates the browser snippet that grabs a fully rendered page (including
 * pages behind a login, which the server-side extractor can never reach) and
 * imports the resulting JSON back into the Page Builder as a draft page.
 */
export function PageGrabberPane({ onOpenBuilder }: { onOpenBuilder?: (slug: string) => void }) {
  const [opts, setOpts] = useState<GrabberOptions>(DEFAULT_GRABBER_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [json, setJson] = useState("");
  const fileInput = useRef<HTMLInputElement | null>(null);

  const script = useMemo(() => buildGrabberScript(opts), [opts]);

  const patch = (p: Partial<GrabberOptions>) => setOpts((o) => ({ ...o, ...p }));

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notifyFailed("کپی اسکریپت", "مرورگر اجازه کپی نداد؛ متن را دستی انتخاب و کپی کنید.");
    }
  }

  function downloadScript() {
    const blob = new Blob([script], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "page-grabber.js";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 3000);
  }

  async function onPickFile(file: File | null | undefined) {
    if (!file) return;
    const text = await file.text();
    setJson(text);
  }

  async function importJson() {
    const raw = json.trim();
    if (!raw) return notifyFailed("بارگذاری صفحه", "ابتدا محتوای فایل JSON را بچسبانید یا فایل را انتخاب کنید.");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e: any) {
      return notifyFailed("بارگذاری صفحه", "فایل JSON معتبر نیست: " + (e?.message || ""));
    }
    if (!looksLikeGrabbedPage(parsed)) {
      return notifyFailed("بارگذاری صفحه", "ساختار فایل با خروجی ویجت دانلود صفحه همخوانی ندارد.");
    }
    const src = parsed as Partial<CustomPage> & { blocks: Block[] };
    const slug = sanitizeSlug(String(src.slug || src.title || "grabbed-page"));
    const page: CustomPage = {
      slug,
      title: String(src.title || slug),
      description: String(src.description || ""),
      blocks: (src.blocks || []).filter((b) => b && typeof b === "object" && typeof b.type === "string"),
      seoTitle: String(src.seoTitle || src.title || ""),
      seoDescription: String(src.seoDescription || src.description || ""),
      published: false,
      updatedAt: new Date().toISOString(),
    };
    if (!page.blocks.length) return notifyFailed("بارگذاری صفحه", "هیچ بلوکی در فایل پیدا نشد.");

    setBusy(true);
    const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
    const next: CustomPagesMap = { ...map };
    let finalSlug = slug;
    if (next[finalSlug]) {
      const ok = window.confirm(`صفحه‌ای با نامک «${finalSlug}» وجود دارد. جایگزین شود؟\n(لغو = ساخت نسخه جدید)`);
      if (!ok) finalSlug = sanitizeSlug(`${slug}-${Date.now().toString(36).slice(-4)}`);
    }
    next[finalSlug] = { ...page, slug: finalSlug };
    const res = (await adminWriteSetting(CUSTOM_PAGES_KEY, next)) as { ok?: boolean; error?: { message?: string } };
    setBusy(false);
    if (res.ok === false) return notifyFailed("بارگذاری صفحه", res.error?.message || "خطای دیتابیس");
    notifySaved(`صفحه «${page.title}» با ${page.blocks.length} بلوک`);
    setJson("");
    onOpenBuilder?.(finalSlug);
  }

  const card = "rounded-xl border border-border bg-card p-4 space-y-3";
  const inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
  const btn = "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold";

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-xl font-extrabold text-[#0b1e3f]">دانلود صفحه (ویجت استخراج کامل)</h1>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          این ابزار یک اسکریپت آماده می‌سازد که روی هر صفحه‌ای در مرورگر خودتان اجرا می‌شود — حتی صفحه‌هایی که پشت
          ورود کاربری هستند یا با جاوااسکریپت ساخته می‌شوند — و کل محتوای صفحه را به شکل یک فایل JSON دانلود می‌کند.
          سپس همان فایل را اینجا بارگذاری می‌کنید تا به صورت یک صفحهٔ پیش‌نویس در صفحه‌ساز ساخته شود.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Script */}
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-card-foreground">۱) اسکریپت آماده</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyScript} className={btn}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "کپی شد" : "کپی اسکریپت"}
              </button>
              <button type="button" onClick={downloadScript} className={btn}>
                <Download className="h-3.5 w-3.5" /> دانلود page-grabber.js
              </button>
              <button type="button" onClick={() => setOpts(DEFAULT_GRABBER_OPTIONS)} className={btn}>
                <RefreshCw className="h-3.5 w-3.5" /> بازنشانی تنظیمات
              </button>
            </div>
          </div>
          <textarea
            readOnly
            dir="ltr"
            value={script}
            onFocus={(e) => e.currentTarget.select()}
            className="h-[360px] w-full rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] leading-5"
          />
          <div className="rounded-lg bg-muted/50 p-3 text-[11px] leading-6 text-muted-foreground">
            <div className="font-bold text-card-foreground">روش ۱ — اسکریپت‌ساز خودکار (Snippets)</div>
            صفحهٔ موردنظر را باز کنید → کلید F12 → تب <b dir="ltr">Sources</b> → بخش <b dir="ltr">Snippets</b> →
            <b dir="ltr"> + New snippet</b> → اسکریپت بالا را بچسبانید → <b dir="ltr">Ctrl + Enter</b>.
            <div className="mt-2 font-bold text-card-foreground">روش ۲ — تزریق دستی با Notepad</div>
            دکمهٔ «دانلود page-grabber.js» را بزنید (یا اسکریپت را در Notepad ذخیره کنید) → صفحهٔ موردنظر را باز کنید →
            F12 → تب <b dir="ltr">Console</b> → متن فایل را بچسبانید → Enter. اگر مرورگر هشدار چسباندن داد، عبارت
            <b dir="ltr"> allow pasting</b> را تایپ کنید و Enter بزنید.
            <div className="mt-2">در هر دو روش، فایل <b dir="ltr">page-&lt;slug&gt;.json</b> دانلود می‌شود.</div>
          </div>
        </section>

        {/* Options + import */}
        <aside className="space-y-4">
          <section className={card}>
            <div className="text-sm font-extrabold text-card-foreground">تنظیمات اسکریپت</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["clone", "کپی کامل و عینِ صفحه", "طرح، فونت، رنگ، تصویر و ویدیو دقیقاً مثل صفحهٔ اصلی؛ هدر و فوتر با سایت شما جایگزین می‌شود."],
                ["blocks", "بلوک‌های ساده", "فقط متن و تصاویر به بلوک‌های صفحه‌ساز تبدیل می‌شود."],
              ] as const).map(([m, label, hint]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => patch({ mode: m })}
                  className={`rounded-lg border p-2 text-right text-xs ${opts.mode === m ? "border-primary bg-primary/10 font-bold" : "border-border"}`}
                >
                  <div>{label}</div>
                  <div className="mt-1 text-[10px] leading-5 text-muted-foreground">{hint}</div>
                </button>
              ))}
            </div>
            <label className="block text-xs text-muted-foreground">
              نامک پیشنهادی (خالی = از آدرس صفحه)
              <input dir="ltr" className={inputCls} value={opts.slug} onChange={(e) => patch({ slug: e.target.value })} />
            </label>
            <label className="block text-xs text-muted-foreground">
              حداکثر کاراکتر هر بلوک متن
              <input
                type="number"
                dir="ltr"
                min={500}
                max={20000}
                className={inputCls}
                value={opts.maxChars}
                onChange={(e) => patch({ maxChars: Number(e.target.value) })}
              />
            </label>
            {([
              ["images", "تصاویر"],
              ["galleries", "گالری‌ها"],
              ["buttons", "دکمه‌ها (CTA)"],
              ["videos", "ویدیو و iframe"],
              ["clipboard", "کپی خروجی در کلیپ‌بورد"],
            ] as [keyof GrabberOptions, string][]).map(([k, label]) => (
              <label key={String(k)} className="flex items-center gap-2 text-xs text-card-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(opts[k])}
                  onChange={(e) => patch({ [k]: e.target.checked } as Partial<GrabberOptions>)}
                />
                {label}
              </label>
            ))}
          </section>

          <section className={card}>
            <div className="text-sm font-extrabold text-card-foreground">۲) بارگذاری خروجی در صفحه‌ساز</div>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void onPickFile(e.target.files?.[0])}
            />
            <button type="button" onClick={() => fileInput.current?.click()} className={btn}>
              <FileJson className="h-3.5 w-3.5" /> انتخاب فایل JSON
            </button>
            <textarea
              dir="ltr"
              rows={7}
              placeholder='{"slug":"...","title":"...","blocks":[...]}'
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 font-mono text-[11px]"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void importJson()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              ساخت صفحه از این فایل
            </button>
            <p className="text-[11px] leading-6 text-muted-foreground">
              صفحه به صورت «پیش‌نویس» ساخته می‌شود؛ بعد از بررسی در صفحه‌ساز می‌توانید آن را منتشر کنید.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
