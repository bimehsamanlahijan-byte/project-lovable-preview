import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  DownloadCloud,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Wand2,
  Sparkles,
  Bug,
  FilePlus2,
  Globe,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { notifyFailed, notifySaved } from "@/lib/notify";
import {
  BLOCK_TYPES,
  CUSTOM_PAGES_KEY,
  emptyPage,
  makeBlock,
  pageUrl,
  sanitizeSlug,
  type Block,
  type BlockType,
  type CustomPage,
  type CustomPagesMap,
} from "@/lib/custom-pages";
import { githubPublishSnapshot } from "@/lib/github.functions";
import { extractPageFromUrl, fetchPageHtml } from "@/lib/custom-pages.functions";
import { buildGrabberScript, DEFAULT_GRABBER_OPTIONS } from "@/lib/page-grabber-script";
import { DEFAULT_GITHUB_SYNC, GITHUB_SETTING_KEY, type GithubSyncSettings } from "@/lib/site-config";
import { AI_ENGINES_KEY, DEFAULT_AI_ENGINES, type AiEnginesSettings } from "@/lib/ai-engine";
import { aiExtractPageBlocks } from "@/lib/seo-competitor.functions";
import { AiEngineSelect } from "./AiEngineSelect";

/**
 * Page Builder pane.
 *
 * Workflow: create/edit a custom page from composable blocks → live preview →
 * save to site_settings → open in the Visual Editor / Inspector for fine
 * visual editing → publish through the existing GitHub Build/Commit/Deploy
 * workflow (no parallel deploy system).
 *
 * Image / gallery / video fields integrate with the existing Media Library via
 * `/api/admin/assets?folder=media`.
 */
export function PageBuilderPane({
  onOpenVisualEditor,
  onOpenInspector,
  onOpenGrabber,
}: {
  onOpenVisualEditor: (path: string) => void;
  onOpenInspector: (path: string) => void;
  /** Opens the "دانلود صفحه" script generator pane. */
  onOpenGrabber?: () => void;
}) {
  const [pages, setPages] = useState<CustomPagesMap>({});
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<CustomPage | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mediaFor, setMediaFor] = useState<{ blockId: string; apply: (url: string) => void } | null>(null);
  const [extractUrl, setExtractUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [autoBuilding, setAutoBuilding] = useState(false);
  const [autoStep, setAutoStep] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [pagesOpen, setPagesOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(0);
  const [engines, setEngines] = useState<AiEnginesSettings>(DEFAULT_AI_ENGINES);
  const [aiBuilding, setAiBuilding] = useState(false);
  const previewFrame = useRef<HTMLIFrameElement | null>(null);
  const previewBox = useRef<HTMLDivElement | null>(null);

  const sendPreview = () => {
    if (!draft || !previewFrame.current?.contentWindow) return;
    previewFrame.current.contentWindow.postMessage({ type: "pb:blocks", blocks: draft.blocks }, window.location.origin);
  };

  useEffect(() => {
    const element = previewBox.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setPreviewWidth(element.clientWidth));
    observer.observe(element);
    setPreviewWidth(element.clientWidth);
    return () => observer.disconnect();
  }, [draft, previewDevice]);

  useEffect(() => {
    const timer = window.setTimeout(sendPreview, 80);
    return () => window.clearTimeout(timer);
  }, [draft?.blocks]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === previewFrame.current?.contentWindow && event.data?.type === "pb:ready") sendPreview();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [draft?.blocks]);

  async function runExtract() {
    if (!draft) return;
    const u = extractUrl.trim();
    if (!u) return notifyFailed("استخراج محتوا", "ابتدا یک URL وارد کنید.");
    setExtracting(true);
    try {
      const res = await extractPageFromUrl({ data: { url: u } });
      if (!res.ok) {
        notifyFailed("استخراج محتوا", res.error || "خطای ناشناخته");
        return;
      }
      const next = {
        ...draft,
        title: res.title && res.title.trim() ? res.title : draft.title,
        description: res.description && res.description.trim() ? res.description : draft.description,
        seoTitle: res.title && res.title.trim() ? res.title : draft.seoTitle,
        seoDescription: res.description && res.description.trim() ? res.description : draft.seoDescription,
        blocks: res.blocks && res.blocks.length ? res.blocks : draft.blocks,
        updatedAt: new Date().toISOString(),
      };
      setDraft(next);
      setDirty(true);
      notifySaved("استخراج محتوا");
    } catch (e: any) {
      notifyFailed("استخراج محتوا", e?.message || String(e));
    } finally {
      setExtracting(false);
    }
  }

  async function runAutoBuild() {
    if (!draft) return;
    const u = extractUrl.trim();
    if (!u) return notifyFailed("صفحه‌ساز خودکار", "ابتدا آدرس صفحه را در کادر بالا وارد کنید.");
    setAutoBuilding(true);
    let frame: HTMLIFrameElement | null = null;
    try {
      setAutoStep("در حال دریافت صفحه…");
      const res = await fetchPageHtml({ data: { url: u } });
      if (!res.ok) { notifyFailed("صفحه‌ساز خودکار", res.error); return; }
      setAutoStep("در حال بارگذاری طرح و فونت‌ها…");
      const base = res.finalUrl;
      let html = res.html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<base\b[^>]*>/gi, "")
        .replace(/<meta[^>]+http-equiv=["']?(refresh|content-security-policy)[^>]*>/gi, "");
      // lazy images → real sources so they appear in the copy
      html = html.replace(/<img\b([^>]*?)\sdata-(?:lazy-)?src=(["'])([^"']+)\2/gi, (_m, a, q, src) => `<img${a} src=${q}${src}${q}`);
      const baseTag = `<base href="${base.replace(/"/g, "&quot;")}">`;
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`) : baseTag + html;
      frame = document.createElement("iframe");
      frame.setAttribute("aria-hidden", "true");
      frame.style.cssText = "position:fixed;left:-20000px;top:0;width:1366px;height:900px;border:0;opacity:0;pointer-events:none";
      document.body.appendChild(frame);
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        frame!.addEventListener("load", done, { once: true });
        setTimeout(done, 15000);
        frame!.srcdoc = html;
      });
      await new Promise((r) => setTimeout(r, 2000));
      try { await (frame.contentDocument as any)?.fonts?.ready; } catch { /* ignore */ }
      setAutoStep("در حال کپی کامل صفحه…");
      // mode "blocks": every part of the page becomes a separate, editable block
      // (hero/text/image/cards/...) so the visual editor can select and change it.
      const script = buildGrabberScript({ ...DEFAULT_GRABBER_OPTIONS, mode: "blocks", slug: draft.slug, silent: true, sourceUrl: base, clipboard: false });
      const page = (frame.contentWindow as any).eval(script);
      if (!page || !Array.isArray(page.blocks) || !page.blocks.length) {
        notifyFailed("صفحه‌ساز خودکار", "محتوایی پیدا نشد. این سایت احتمالاً محتوایش را با جاوااسکریپت می‌سازد؛ از روش اسکریپت دستی استفاده کنید.");
        return;
      }
      const next = {
        ...draft,
        title: page.title || draft.title,
        description: page.description || draft.description,
        seoTitle: page.seoTitle || page.title || draft.seoTitle,
        seoDescription: page.seoDescription || draft.seoDescription,
        blocks: page.blocks,
        updatedAt: new Date().toISOString(),
      };
      setDraft(next);
      setDirty(true);
      notifySaved("صفحه‌ساز خودکار — صفحه ساخته شد؛ برای ماندگاری «ذخیره» را بزنید");
    } catch (e: any) {
      notifyFailed("صفحه‌ساز خودکار", e?.message || String(e));
    } finally {
      frame?.remove();
      setAutoBuilding(false);
      setAutoStep("");
    }
  }

  /** AI extraction: the selected engine turns the source page into editable blocks. */
  async function runAiBuild() {
    if (!draft) return;
    const u = extractUrl.trim();
    if (!u) return notifyFailed("استخراج با هوش مصنوعی", "ابتدا آدرس صفحه را وارد کنید.");
    setAiBuilding(true);
    try {
      const res = await aiExtractPageBlocks({
        data: { url: u, provider: engines.pageBuilder.provider, model: engines.pageBuilder.model },
      });
      if (!res.ok) { notifyFailed("استخراج با هوش مصنوعی", res.error); return; }
      setDraft({
        ...draft,
        title: res.title || draft.title,
        description: res.description || draft.description,
        seoTitle: res.title || draft.seoTitle,
        seoDescription: res.description || draft.seoDescription,
        blocks: res.blocks,
        updatedAt: new Date().toISOString(),
      });
      setDirty(true);
      notifySaved("هوش مصنوعی صفحه را ساخت — همه اجزا قابل ویرایش هستند؛ «ذخیره» را بزنید");
    } catch (e: any) {
      notifyFailed("استخراج با هوش مصنوعی", e?.message || String(e));
    } finally {
      setAiBuilding(false);
    }
  }

  async function saveEngines(next: AiEnginesSettings) {
    setEngines(next);
    const r = await adminWriteSetting(AI_ENGINES_KEY, next);
    if (r.error) notifyFailed("ذخیره موتور هوش مصنوعی", r.error.message);
  }

  async function reload() {
    const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
    setPages(map);
    setEngines(await adminReadSetting<AiEnginesSettings>(AI_ENGINES_KEY, DEFAULT_AI_ENGINES));
    if (!selectedSlug) {
      const first = Object.keys(map)[0] ?? null;
      if (first) {
        setSelectedSlug(first);
        setDraft(map[first]);
        setDirty(false);
      } else {
        setSelectedSlug(null);
        setDraft(null);
      }
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectPage(slug: string | null) {
    setSelectedSlug(slug);
    setDirty(false);
    setDraft(slug && pages[slug] ? pages[slug] : null);
  }

  function newPage() {
    const base = `page-${Date.now().toString(36).slice(-4)}`;
    const p = emptyPage(base);
    setDraft(p);
    setSelectedSlug(null);
    setDirty(true);
  }

  function patchDraft(patch: Partial<CustomPage>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
  }

  function addBlock(type: BlockType) {
    if (!draft) return;
    patchDraft({ blocks: [...draft.blocks, makeBlock(type)] });
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    if (!draft) return;
    patchDraft({
      blocks: draft.blocks.map((b) => (b.id === id ? { ...b, ...patch, props: { ...b.props, ...(patch.props ?? {}) } } : b)),
    });
  }

  function setBlockProp(id: string, key: string, value: any) {
    if (!draft) return;
    patchDraft({
      blocks: draft.blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, [key]: value } } : b)),
    });
  }

  function moveBlock(id: string, dir: -1 | 1) {
    if (!draft) return;
    const idx = draft.blocks.findIndex((b) => b.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= draft.blocks.length) return;
    const next = [...draft.blocks];
    const [it] = next.splice(idx, 1);
    next.splice(j, 0, it);
    patchDraft({ blocks: next });
  }

  function removeBlock(id: string) {
    if (!draft) return;
    patchDraft({ blocks: draft.blocks.filter((b) => b.id !== id) });
  }

  async function savePage(): Promise<string | null> {
    if (!draft) return null;
    const slug = sanitizeSlug(draft.slug);
    if (!slug) {
      notifyFailed("ذخیره صفحه", "نامک (slug) معتبر نیست.");
      return null;
    }
    const next: CustomPage = { ...draft, slug, updatedAt: new Date().toISOString() };
    setBusy(true);
    const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
    // If slug changed and old slug existed, remove the old entry.
    const cleaned: CustomPagesMap = { ...map };
    if (selectedSlug && selectedSlug !== slug) delete cleaned[selectedSlug];
    cleaned[slug] = next;
    const res = (await adminWriteSetting(CUSTOM_PAGES_KEY, cleaned)) as { ok?: boolean; error?: { message?: string } };
    setBusy(false);
    if (res.ok === false) {
      notifyFailed("ذخیره صفحه", res.error?.message || "خطای دیتابیس");
      return null;
    }
    setPages(cleaned);
    setSelectedSlug(slug);
    setDraft(next);
    setDirty(false);
    notifySaved("صفحه");
    return slug;
  }

  /**
   * The Visual Editor / Inspector / live view all load the *public* URL
   * `/p/<slug>`, which only exists once the page is stored. Opening an unsaved
   * (or edited-but-unsaved) draft therefore showed a ۴۰۴ inside the editor
   * iframe. Save first, then hand over the real saved slug.
   */
  async function openSaved(open: (path: string) => void) {
    if (!draft) return;
    const slug = selectedSlug && !dirty ? selectedSlug : await savePage();
    if (!slug) return;
    open(pageUrl(slug));
  }

  async function duplicatePage(slug: string) {
    const src = pages[slug];
    if (!src) return;
    const copy: CustomPage = {
      ...src,
      slug: sanitizeSlug(`${src.slug}-copy`),
      title: `${src.title} (کپی)`,
      updatedAt: new Date().toISOString(),
      blocks: src.blocks.map((b) => ({ ...b, id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` })),
      published: false,
    };
    setBusy(true);
    const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
    map[copy.slug] = copy;
    await adminWriteSetting(CUSTOM_PAGES_KEY, map);
    setBusy(false);
    setPages(map);
    setSelectedSlug(copy.slug);
    setDraft(copy);
    setDirty(false);
    notifySaved("صفحه (کپی)");
  }

  async function deletePage(slug: string) {
    if (!confirm(`حذف صفحه «${slug}»؟ این عمل قابل بازگشت نیست.`)) return;
    setBusy(true);
    const map = await adminReadSetting<CustomPagesMap>(CUSTOM_PAGES_KEY, {});
    delete map[slug];
    await adminWriteSetting(CUSTOM_PAGES_KEY, map);
    setBusy(false);
    setPages(map);
    if (selectedSlug === slug) selectPage(Object.keys(map)[0] ?? null);
    notifySaved("حذف صفحه");
  }

  async function publishToGithub() {
    if (!draft) return;
    if (dirty) await savePage();
    setBusy(true);
    const cfg = await adminReadSetting<GithubSyncSettings>(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC);
    const acc = cfg.accounts.find((a) => a.isDefault) ?? cfg.accounts[0];
    if (!acc) {
      setBusy(false);
      return notifyFailed("انتشار در گیت‌هاب", "هیچ حساب گیت‌هابی متصل نیست. ابتدا از تب «اتصال گیت‌هاب» یک حساب اضافه کنید.");
    }
    const res = await githubPublishSnapshot({
      data: {
        secretName: acc.secretName,
        owner: acc.owner,
        repo: acc.repo,
        branch: acc.branch,
        path: acc.path,
        note: `انتشار صفحه‌ساز: ${draft.title}`,
      },
    });
    setBusy(false);
    if (res.ok) notifySaved("ارسال به گیت‌هاب (Build/Commit/Deploy)");
    else notifyFailed("ارسال به گیت‌هاب", res.error);
  }

  const list = Object.values(pages).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const inputCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm w-full";
  const btnCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50";
  const primaryBtn = "px-3 py-2 rounded-xl bg-[#0b1e3f] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#15294a] disabled:opacity-50";

  return (
    <div className="min-w-0">
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <FilePlus2 className="h-6 w-6 shrink-0" /> صفحه‌ساز
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">ساخت و تنظیم صفحه در کنار پیش‌نمایش زنده</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setPagesOpen((open) => !open)} className={btnCls} aria-expanded={pagesOpen}>
            <FilePlus2 className="h-4 w-4" /> صفحات ساخته‌شده
            {list.length > 0 && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{list.length}</span>}
          </button>
          <button type="button" onClick={newPage} className={primaryBtn}>
            <Plus className="h-4 w-4" /> صفحه جدید
          </button>
          <button type="button" onClick={() => void savePage()} disabled={!draft || busy} className={primaryBtn}>
            <Save className="h-4 w-4" /> ذخیره
          </button>
          <button type="button" onClick={() => void publishToGithub()} disabled={!draft || busy} className={primaryBtn}>
            <Github className="h-4 w-4" /> انتشار در گیت‌هاب
          </button>
        </div>

        {pagesOpen && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:left-auto sm:w-[360px]">
            <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2 text-xs font-bold text-card-foreground">
              <span>صفحات ساخته‌شده</span>
              <button type="button" onClick={() => setPagesOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-background" aria-label="بستن">✕</button>
            </div>
            <ul className="max-h-[55vh] divide-y divide-border overflow-y-auto">
              {list.length === 0 && <li className="px-3 py-8 text-center text-xs text-muted-foreground">هنوز صفحه‌ای نساخته‌اید.</li>}
              {list.map((pageItem) => {
                const active = selectedSlug === pageItem.slug;
                return (
                  <li key={pageItem.slug}>
                    <button
                      type="button"
                      onClick={() => { selectPage(pageItem.slug); setPagesOpen(false); }}
                      className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 text-right transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{pageItem.title || pageItem.slug}</span>
                        <span className="block truncate text-[11px] opacity-70" dir="ltr">/p/{pageItem.slug}</span>
                      </span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${active ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground"}`}>
                        {pageItem.published ? "منتشر" : "پیش‌نویس"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {!draft ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          از دکمه «صفحات ساخته‌شده» یک صفحه را انتخاب کنید یا «صفحه جدید» را بزنید.
        </div>
      ) : (
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Large live preview — first grid track is on the right in RTL. */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold text-card-foreground">پیش‌نمایش زنده — {draft.title || draft.slug}</div>
                <div className="truncate text-[11px] text-muted-foreground" dir="ltr">/p/{draft.slug}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {dirty && <span className="text-[11px] font-bold text-amber-600">ذخیره نشده</span>}
                <div className="flex overflow-hidden rounded-lg border border-border">
                  <button type="button" onClick={() => setPreviewDevice("desktop")} title="دسکتاپ" aria-label="دسکتاپ" className={`p-2 ${previewDevice === "desktop" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}><Monitor className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setPreviewDevice("tablet")} title="تبلت" aria-label="تبلت" className={`p-2 ${previewDevice === "tablet" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}><Tablet className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setPreviewDevice("mobile")} title="موبایل" aria-label="موبایل" className={`p-2 ${previewDevice === "mobile" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}><Smartphone className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            <div ref={previewBox} className="min-h-[520px] overflow-hidden bg-muted lg:min-h-[680px]">
              {previewDevice === "desktop" ? (
                <div className="w-full overflow-hidden" style={{ height: Math.round(860 * (previewWidth ? Math.min(1, previewWidth / 1440) : 1)) }}>
                  <iframe ref={previewFrame} src="/p/__page-builder-preview?pbPreview=1" title="پیش‌نمایش صفحه‌ساز" onLoad={sendPreview} className="border-0 bg-background" style={{ width: 1440, height: 860, transform: `scale(${previewWidth ? Math.min(1, previewWidth / 1440) : 1})`, transformOrigin: "top right" }} />
                </div>
              ) : (
                <div className={previewDevice === "mobile" ? "mx-auto w-full max-w-[390px]" : "mx-auto w-full max-w-[834px]"}>
                  <iframe ref={previewFrame} src="/p/__page-builder-preview?pbPreview=1" title="پیش‌نمایش صفحه‌ساز" onLoad={sendPreview} className="h-[75vh] w-full border-0 bg-background" />
                </div>
              )}
            </div>
          </section>

          {/* Settings and block controls — compact column on the left. */}
          <aside className="min-w-0 space-y-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pl-1">
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-bold text-card-foreground">تنظیمات صفحه</div>
              <label className="block text-xs text-muted-foreground">عنوان
                <input className={inputCls} value={draft.title} onChange={(e) => patchDraft({ title: e.target.value })} />
              </label>
              <label className="block text-xs text-muted-foreground">نامک (slug) → /p/…
                <input dir="ltr" className={inputCls} value={draft.slug} onChange={(e) => patchDraft({ slug: e.target.value })} />
              </label>
              <label className="block text-xs text-muted-foreground">توضیح کوتاه
                <textarea className={inputCls} rows={2} value={draft.description} onChange={(e) => patchDraft({ description: e.target.value })} />
              </label>
              <label className="block text-xs text-muted-foreground">عنوان سئو
                <input className={inputCls} value={draft.seoTitle} onChange={(e) => patchDraft({ seoTitle: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={draft.published} onChange={(e) => patchDraft({ published: e.target.checked })} />
                منتشر (index در گوگل)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => void openSaved(onOpenVisualEditor)} className={btnCls}><Wand2 className="h-3.5 w-3.5" /> ویرایشگر بصری</button>
                <button type="button" onClick={() => void openSaved(onOpenInspector)} className={btnCls}><Bug className="h-3.5 w-3.5" /> موس ایرادیاب</button>
                {onOpenGrabber && (
                  <button type="button" onClick={onOpenGrabber} className={btnCls} title="ساخت اسکریپت دانلود کامل یک صفحه و بارگذاری خروجی آن"><DownloadCloud className="h-3.5 w-3.5" /> اسکریپت دانلود صفحه</button>
                )}
                <button type="button" onClick={() => void openSaved((p) => window.open(p, "_blank", "noopener"))} className={btnCls}><ExternalLink className="h-3.5 w-3.5" /> مشاهده زنده</button>
                <button type="button" onClick={() => void duplicatePage(draft.slug)} className={btnCls}><Copy className="h-3.5 w-3.5" /> کپی</button>
                <button type="button" onClick={() => void deletePage(draft.slug)} className={btnCls}><Trash2 className="h-3.5 w-3.5" /> حذف</button>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-card-foreground"><Globe className="h-3.5 w-3.5" /> استخراج محتوا از URL</div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <input dir="ltr" className={inputCls} placeholder="https://example.com/page" value={extractUrl} onChange={(e) => setExtractUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !extracting) void runExtract(); }} />
                <button type="button" onClick={() => void runExtract()} disabled={extracting} className={primaryBtn}>{extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}</button>
              </div>
              <button type="button" onClick={() => void runAiBuild()} disabled={aiBuilding || autoBuilding || extracting} className={`${primaryBtn} w-full justify-center`}>
                {aiBuilding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {aiBuilding ? "هوش مصنوعی در حال ساخت صفحه…" : "ساخت صفحه با هوش مصنوعی (پیشنهادی)"}
              </button>
              <button type="button" onClick={() => void runAutoBuild()} disabled={autoBuilding || extracting || aiBuilding} className={`${btnCls} w-full justify-center`}>
                {autoBuilding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {autoBuilding ? autoStep || "در حال ساخت…" : "صفحه‌ساز خودکار (بدون هوش مصنوعی)"}
              </button>
              <p className="text-[11px] leading-5 text-muted-foreground">
                آدرس صفحه را وارد کنید؛ محتوای همان صفحه به اجزای جداگانه (تیتر، متن، تصویر، کارت…) تبدیل می‌شود و همه در ویرایشگر بصری قابل انتخاب و ویرایش هستند. هدر و فوتر سایت شما همیشه حفظ می‌شود.
              </p>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <AiEngineSelect
                  value={engines.pageBuilder}
                  onChange={(pageBuilder) => void saveEngines({ ...engines, pageBuilder })}
                  label="موتور هوش مصنوعی صفحه‌ساز"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-xs font-bold text-card-foreground">افزودن اجزای صفحه</div>
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((blockType) => (
                  <button key={blockType.type} type="button" onClick={() => addBlock(blockType.type)} className="flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-bold hover:bg-muted">
                    <span className="shrink-0">{blockType.icon}</span><span className="truncate">{blockType.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="text-xs font-bold text-card-foreground">اجزای صفحه</div>
              {draft.blocks.length === 0 && <div className="py-4 text-center text-xs text-muted-foreground">یک جزء به صفحه اضافه کنید.</div>}
              {draft.blocks.map((block, index) => (
                <BlockEditor key={block.id} block={block} index={index} total={draft.blocks.length} onMove={(dir) => moveBlock(block.id, dir)} onRemove={() => removeBlock(block.id)} onProp={(key, value) => setBlockProp(block.id, key, value)} onPickMedia={(apply) => setMediaFor({ blockId: block.id, apply })} />
              ))}
            </div>
          </aside>
        </div>
      )}

      {mediaFor && draft && (
        <MediaPicker onClose={() => setMediaFor(null)} onPick={(url) => { mediaFor.apply(url); setMediaFor(null); }} />
      )}
    </div>
  );
}

/* ---------------- Block editor ---------------- */

function BlockEditor({
  block,
  index,
  total,
  onMove,
  onRemove,
  onProp,
  onPickMedia,
}: {
  block: Block;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onProp: (key: string, value: any) => void;
  onPickMedia: (apply: (url: string) => void) => void;
}) {
  const [open, setOpen] = useState(false);
  const p = block.props ?? {};
  const inputCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm w-full";
  const meta = BLOCK_TYPES.find((b) => b.type === block.type);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-sm">{meta?.icon}</span>
        <button onClick={() => setOpen((v) => !v)} className="text-xs font-bold flex-1 text-right hover:underline">
          {meta?.label} <span className="text-slate-400">#{index + 1}</span>
        </button>
        <button onClick={() => onMove(-1)} disabled={index === 0} className="p-1 rounded hover:bg-white disabled:opacity-30">
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onMove(1)} disabled={index === total - 1} className="p-1 rounded hover:bg-white disabled:opacity-30">
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button onClick={onRemove} className="p-1 rounded hover:bg-white text-red-600">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          <BlockProps block={block} onProp={onProp} onPickMedia={onPickMedia} inputCls={inputCls} />
        </div>
      )}
    </div>
  );
}

function MediaButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold flex items-center gap-1 hover:bg-slate-50">
      <ImageIcon className="w-3 h-3" /> از کتابخانه رسانه
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-xs text-slate-500 block">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function BlockProps({
  block,
  onProp,
  onPickMedia,
  inputCls,
}: {
  block: Block;
  onProp: (key: string, value: any) => void;
  onPickMedia: (apply: (url: string) => void) => void;
  inputCls: string;
}) {
  const p = block.props ?? {};
  switch (block.type) {
    case "hero":
      return (
        <>
          <Field label="عنوان">
            <input className={inputCls} value={p.title ?? ""} onChange={(e) => onProp("title", e.target.value)} />
          </Field>
          <Field label="توضیح">
            <input className={inputCls} value={p.subtitle ?? ""} onChange={(e) => onProp("subtitle", e.target.value)} />
          </Field>
          <Field label="تصویر پس‌زمینه (اختیاری)">
            <div className="flex gap-2">
              <input dir="ltr" className={inputCls} value={p.bgImage ?? ""} onChange={(e) => onProp("bgImage", e.target.value)} placeholder="https://… یا خالی برای گرادیان" />
              <MediaButton onClick={() => onPickMedia((url) => onProp("bgImage", url))} />
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="متن دکمه">
              <input className={inputCls} value={p.ctaText ?? ""} onChange={(e) => onProp("ctaText", e.target.value)} />
            </Field>
            <Field label="لینک دکته">
              <input dir="ltr" className={inputCls} value={p.ctaHref ?? ""} onChange={(e) => onProp("ctaHref", e.target.value)} />
            </Field>
            <Field label="تراز">
              <select className={inputCls} value={p.align ?? "center"} onChange={(e) => onProp("align", e.target.value)}>
                <option value="center">مرکز</option>
                <option value="right">راست</option>
                <option value="left">چپ</option>
              </select>
            </Field>
          </div>
        </>
      );
    case "text":
      return (
        <>
          <Field label="عنوان">
            <input className={inputCls} value={p.title ?? ""} onChange={(e) => onProp("title", e.target.value)} />
          </Field>
          <Field label="متن">
            <textarea className={inputCls} rows={4} value={p.body ?? ""} onChange={(e) => onProp("body", e.target.value)} />
          </Field>
          <Field label="تراز">
            <select className={inputCls} value={p.align ?? "right"} onChange={(e) => onProp("align", e.target.value)}>
              <option value="right">راست</option>
              <option value="center">مرکز</option>
              <option value="left">چپ</option>
            </select>
          </Field>
        </>
      );
    case "cta":
      return (
        <>
          <Field label="عنوان">
            <input className={inputCls} value={p.title ?? ""} onChange={(e) => onProp("title", e.target.value)} />
          </Field>
          <Field label="توضیح">
            <input className={inputCls} value={p.body ?? ""} onChange={(e) => onProp("body", e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="متن دکمه">
              <input className={inputCls} value={p.buttonLabel ?? ""} onChange={(e) => onProp("buttonLabel", e.target.value)} />
            </Field>
            <Field label="لینک">
              <input dir="ltr" className={inputCls} value={p.buttonHref ?? ""} onChange={(e) => onProp("buttonHref", e.target.value)} />
            </Field>
            <Field label="رنگ پس‌زمینه">
              <input dir="ltr" className={inputCls} value={p.bg ?? "#0b1e3f"} onChange={(e) => onProp("bg", e.target.value)} />
            </Field>
          </div>
        </>
      );
    case "cards": {
      const items: { title?: string; text?: string }[] = Array.isArray(p.items) ? p.items : [];
      return (
        <>
          <Field label="تعداد ستون‌ها">
            <select className={inputCls} value={p.columns ?? "3"} onChange={(e) => onProp("columns", e.target.value)}>
              <option value="2">۲</option>
              <option value="3">۳</option>
              <option value="4">۴</option>
            </select>
          </Field>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Field label={`کارت ${i + 1} عنوان`}>
                  <input className={inputCls} value={it.title ?? ""} onChange={(e) => {
                    const next = [...items]; next[i] = { ...next[i], title: e.target.value }; onProp("items", next);
                  }} />
                </Field>
              </div>
              <div className="col-span-6">
                <Field label="متن">
                  <input className={inputCls} value={it.text ?? ""} onChange={(e) => {
                    const next = [...items]; next[i] = { ...next[i], text: e.target.value }; onProp("items", next);
                  }} />
                </Field>
              </div>
              <button onClick={() => onProp("items", items.filter((_, j) => j !== i))} className="col-span-1 mb-1 p-1 text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => onProp("items", [...items, { title: "کارت جدید", text: "" }])} className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold">
            + افزودن کارت
          </button>
        </>
      );
    }
    case "image":
      return (
        <>
          <Field label="آدرس تصویر">
            <div className="flex gap-2">
              <input dir="ltr" className={inputCls} value={p.src ?? ""} onChange={(e) => onProp("src", e.target.value)} />
              <MediaButton onClick={() => onPickMedia((url) => onProp("src", url))} />
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="متن جایگزین (alt)">
              <input className={inputCls} value={p.alt ?? ""} onChange={(e) => onProp("alt", e.target.value)} />
            </Field>
            <Field label="لینک (اختیاری)">
              <input dir="ltr" className={inputCls} value={p.href ?? ""} onChange={(e) => onProp("href", e.target.value)} />
            </Field>
            <Field label="عرض">
              <select className={inputCls} value={p.width ?? "full"} onChange={(e) => onProp("width", e.target.value)}>
                <option value="full">تمام‌عرض</option>
                <option value="boxed">وسط‌چین</option>
              </select>
            </Field>
          </div>
        </>
      );
    case "gallery": {
      const images: string[] = Array.isArray(p.images) ? p.images : [];
      return (
        <>
          <Field label="تعداد ستون‌ها">
            <select className={inputCls} value={p.columns ?? "3"} onChange={(e) => onProp("columns", e.target.value)}>
              <option value="2">۲</option>
              <option value="3">۳</option>
              <option value="4">۴</option>
            </select>
          </Field>
          {images.map((src, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Field label={`تصویر ${i + 1}`}>
                  <input dir="ltr" className={inputCls} value={src} onChange={(e) => {
                    const next = [...images]; next[i] = e.target.value; onProp("images", next);
                  }} />
                </Field>
              </div>
              <MediaButton onClick={() => onPickMedia((url) => { const next = [...images]; next[i] = url; onProp("images", next); })} />
              <button onClick={() => onProp("images", images.filter((_, j) => j !== i))} className="mb-1 p-1 text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => onProp("images", [...images, ""])} className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold">
            + افزودن تصویر
          </button>
        </>
      );
    }
    case "video":
      return (
        <>
          <Field label="آدرس ویدیو">
            <div className="flex gap-2">
              <input dir="ltr" className={inputCls} value={p.src ?? ""} onChange={(e) => onProp("src", e.target.value)} />
              <MediaButton onClick={() => onPickMedia((url) => onProp("src", url))} />
            </div>
          </Field>
          <Field label="پوستر (اختیاری)">
            <div className="flex gap-2">
              <input dir="ltr" className={inputCls} value={p.poster ?? ""} onChange={(e) => onProp("poster", e.target.value)} />
              <MediaButton onClick={() => onPickMedia((url) => onProp("poster", url))} />
            </div>
          </Field>
        </>
      );
    case "divider":
      return <p className="text-xs text-slate-400">بدون تنظیمات.</p>;
    case "clone":
      return (
        <>
          <p className="text-[11px] leading-6 text-slate-500">
            این بلوک کپی کامل صفحهٔ مبدأ است (طرح، فونت، رنگ، ویدیو). جزئیات را با «ویرایشگر بصری» روی خود صفحه ویرایش کنید.
          </p>
          <Field label="حداکثر عرض (مثلاً 1200px — خالی = عرض اصلی)">
            <input dir="ltr" className={inputCls} value={p.maxWidth ?? ""} onChange={(e) => onProp("maxWidth", e.target.value)} />
          </Field>
          <Field label="کد HTML (پیشرفته)">
            <textarea dir="ltr" className={inputCls} rows={6} value={p.html ?? ""} onChange={(e) => onProp("html", e.target.value)} />
          </Field>
          <Field label="CSS و فونت‌ها (پیشرفته)">
            <textarea dir="ltr" className={inputCls} rows={4} value={p.css ?? ""} onChange={(e) => onProp("css", e.target.value)} />
          </Field>
        </>
      );
    case "html":
      return (
        <Field label="کد HTML">
          <textarea dir="ltr" className={inputCls} rows={6} value={p.html ?? ""} onChange={(e) => onProp("html", e.target.value)} />
        </Field>
      );
    default:
      return null;
  }
}

/* ---------------- Media picker ---------------- */

function MediaPicker({ onClose, onPick }: { onClose: () => void; onPick: (url: string) => void }) {
  const [items, setItems] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`/api/admin/assets?folder=media`)
      .then((r) => r.json())
      .then((j: { files?: { url: string; name: string }[]; error?: string }) => {
        if (alive) {
          setItems(j.files ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-sm">کتابخانه رسانه</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <div className="text-center text-sm text-slate-400 py-10">در حال بارگذاری…</div>
          ) : items.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-10">
              رسانه‌ای در پوشه <code>media</code> نیست. ابتدا از تب «کتابخانه رسانه» فایل آپلود کنید.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {items.map((it) => {
                const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(it.url);
                return (
                  <button
                    key={it.url}
                    onClick={() => onPick(it.url)}
                    className="rounded-xl overflow-hidden border border-slate-200 hover:border-[#0b1e3f] aspect-square bg-slate-100"
                    title={it.name}
                  >
                    {isVideo ? (
                      <video src={it.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      <img src={it.url} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
