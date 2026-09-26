/* eslint-disable */
/**
 * AI-powered page extraction for the Page Builder (server-only).
 *
 * The deterministic extractor (`extract-content.server.ts`) keeps the DOM
 * shape of the source page; this one hands the cleaned text of a single page to
 * the selected AI engine (default: Lovable AI) and asks it to rebuild that
 * page as real Page Builder blocks — so every heading, paragraph, list, image
 * and call to action becomes its own selectable, editable block in the Visual
 * Editor instead of one frozen HTML clone.
 *
 * The source site's header, footer, nav and widgets are never imported: the
 * page renders inside our own SiteHeader / SiteFooter.
 */
import { newBlockId, type Block, type BlockType } from "./custom-pages";

export type AiBlocksResult =
  | { ok: true; title: string; description: string; blocks: Block[]; engine: string }
  | { ok: false; error: string };

const ALLOWED: BlockType[] = ["hero", "text", "cta", "cards", "image", "gallery", "divider"];

/** Reads a remote page and returns its main text plus image URLs and meta. */
export async function readPageForAi(url: string): Promise<
  | { ok: true; title: string; description: string; text: string; images: string[]; finalUrl: string }
  | { ok: false; error: string }
> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.trim());
  } catch {
    return { ok: false, error: "آدرس معتبر نیست." };
  }
  if (!/^https?:$/.test(parsedUrl.protocol)) return { ok: false, error: "فقط آدرس http/https مجاز است." };
  const host = parsedUrl.hostname.toLowerCase();
  if (
    host === "localhost" ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return { ok: false, error: "این آدرس مجاز نیست." };
  }

  let res: Response;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    res = await fetch(parsedUrl.href, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.8",
      },
    });
    clearTimeout(timer);
  } catch (e: any) {
    return { ok: false, error: "دریافت صفحه ممکن نشد: " + (e?.message || String(e)) };
  }
  if (!res.ok) return { ok: false, error: `سایت مقصد پاسخ نداد (کد ${res.status}).` };
  const html = (await res.text()).slice(0, 3_000_000);
  const finalUrl = res.url || parsedUrl.href;

  const { parseHTML } = await import("linkedom");
  const { document } = parseHTML(html);
  for (const sel of [
    "script", "style", "noscript", "nav", "header", "footer", "aside", "iframe", "svg", "form",
    "[role='navigation']", "[role='banner']", "[role='contentinfo']",
    ".cookie", ".popup", ".modal", ".sidebar", ".comments", "#comments", ".ads", ".advertisement",
    ".elementor-location-header", ".elementor-location-footer",
  ]) {
    document.querySelectorAll(sel).forEach((n: Element) => n.remove());
  }

  const meta = (sel: string) =>
    document.querySelector(sel)?.getAttribute("content")?.replace(/\s+/g, " ").trim() || "";
  const title =
    meta("meta[property='og:title']") ||
    (document.querySelector("title")?.textContent || "").trim() ||
    (document.querySelector("h1")?.textContent || "").trim();
  const description = meta("meta[name='description']") || meta("meta[property='og:description']");

  const main =
    document.querySelector("article, main, [role='main'], .entry-content, .post-content, #content") ||
    document.body;

  const parts: string[] = [];
  main?.querySelectorAll("h1,h2,h3,h4,p,li,td,th,blockquote,figcaption,a.btn,button").forEach((node: Element) => {
    const tag = node.tagName.toLowerCase();
    const text = (node.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return;
    if (/^h[1-4]$/.test(tag)) parts.push(`${"#".repeat(Number(tag[1]))} ${text}`);
    else if (tag === "li") parts.push(`- ${text}`);
    else parts.push(text);
  });

  const images: string[] = [];
  main?.querySelectorAll("img").forEach((img: Element) => {
    const raw = img.getAttribute("src") || img.getAttribute("data-src") || "";
    if (!raw || raw.startsWith("data:")) return;
    try {
      const abs = new URL(raw, finalUrl).href;
      if (!images.includes(abs)) images.push(abs);
    } catch {
      /* ignore */
    }
  });

  const text = parts.join("\n").slice(0, 18_000);
  if (text.replace(/\s/g, "").length < 40) {
    return { ok: false, error: "محتوای متنی قابل خواندنی در این صفحه پیدا نشد." };
  }
  return { ok: true, title, description, text, images: images.slice(0, 24), finalUrl };
}

function firstJson(raw: string): any {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1]! : raw;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** Normalizes whatever the model returned into safe, editable blocks. */
function toBlocks(raw: any, images: string[]): Block[] {
  const list = Array.isArray(raw) ? raw : [];
  const blocks: Block[] = [];
  for (const item of list.slice(0, 60)) {
    const type = String(item?.type || "text") as BlockType;
    if (!ALLOWED.includes(type)) continue;
    const p = item?.props && typeof item.props === "object" ? item.props : item;
    const str = (v: unknown, max = 6000) => (typeof v === "string" ? v.slice(0, max) : "");
    let props: Record<string, any> = {};
    if (type === "hero") {
      props = {
        title: str(p.title, 200),
        subtitle: str(p.subtitle, 400),
        bgImage: str(p.bgImage) || "",
        ctaText: str(p.ctaText, 60),
        ctaHref: str(p.ctaHref, 300),
        align: "right",
      };
    } else if (type === "text") {
      props = { title: str(p.title, 200), body: str(p.body), align: "right" };
      if (!props.title && !props.body) continue;
    } else if (type === "cta") {
      props = {
        title: str(p.title, 200),
        body: str(p.body, 600),
        buttonLabel: str(p.buttonLabel, 60) || "تماس با ما",
        buttonHref: str(p.buttonHref, 300) || "/contact",
        bg: "#0b1e3f",
      };
    } else if (type === "cards") {
      const items = (Array.isArray(p.items) ? p.items : []).slice(0, 8).map((c: any) => ({
        title: str(c?.title, 160),
        text: str(c?.text, 400),
        image: str(c?.image, 500),
      }));
      if (!items.length) continue;
      props = { columns: String(Math.min(items.length, 4)), items };
    } else if (type === "image") {
      const src = str(p.src, 500) || images[0] || "";
      if (!src) continue;
      props = { src, alt: str(p.alt, 160), href: "", width: "boxed" };
    } else if (type === "gallery") {
      const imgs = (Array.isArray(p.images) ? p.images : images).filter(Boolean).slice(0, 12);
      if (imgs.length < 2) continue;
      props = { images: imgs, columns: "3" };
    } else if (type === "divider") {
      props = {};
    }
    blocks.push({ id: newBlockId(), type, props });
  }
  return blocks;
}

/**
 * Builds one page's blocks with the selected AI engine.
 * Each page is processed on its own, from its own content.
 */
export async function aiExtractPage(args: {
  url: string;
  provider?: string;
  model?: string;
  instructions?: string;
}): Promise<AiBlocksResult> {
  const page = await readPageForAi(args.url);
  if (!page.ok) return { ok: false, error: page.error };

  const { runModel } = await import("./site-ai.server");
  const system = [
    "تو یک مهندس محتوا و سئوکار فارسی‌زبان هستی که محتوای یک صفحه وب را به بلاک‌های یک صفحه‌ساز تبدیل می‌کند.",
    "قواعد مهم:",
    "۱) فقط محتوای اصلی همان صفحه را بازسازی کن؛ منو، هدر، فوتر، تماس با ما، شبکه‌های اجتماعی و ویجت‌های سایت مبدأ را هرگز نیاور (سایت ما هدر و فوتر خودش را دارد).",
    "۲) هر تیتر، پاراگراف، فهرست، تصویر و فراخوان باید یک بلاک جداگانه باشد تا در ویرایشگر بصری قابل انتخاب و ویرایش باشد. متن‌های طولانی را در چند بلاک بشکن.",
    "۳) متن‌ها را به فارسی روان و سئو‌محور بازنویسی کن؛ نام برند، شماره تماس و آدرس سایت مبدأ را حذف کن.",
    "۴) فقط JSON معتبر برگردان، بدون توضیح اضافه.",
    'ساختار: {"title":"","description":"","blocks":[{"type":"hero|text|cta|cards|image|gallery|divider","props":{...}}]}',
    "props هر نوع: hero{title,subtitle,ctaText,ctaHref} | text{title,body} | cta{title,body,buttonLabel,buttonHref} | cards{items:[{title,text,image}]} | image{src,alt} | gallery{images:[]} | divider{}",
    args.instructions ? `دستور تکمیلی مدیر سایت: ${args.instructions}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const user = [
    `آدرس صفحه: ${page.finalUrl}`,
    `عنوان فعلی: ${page.title}`,
    `توضیح فعلی: ${page.description}`,
    page.images.length ? `تصاویر موجود (در صورت نیاز استفاده کن):\n${page.images.join("\n")}` : "",
    "متن صفحه:",
    page.text,
  ]
    .filter(Boolean)
    .join("\n");

  const out = await runModel(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { provider: args.provider, model: args.model, temperature: 0.3 },
  );
  if (!out.ok) return { ok: false, error: `هوش مصنوعی پاسخ نداد (${out.error})` };

  const json = firstJson(out.text);
  if (!json) return { ok: false, error: "پاسخ هوش مصنوعی قابل خواندن نبود؛ دوباره تلاش کنید." };
  const blocks = toBlocks(json.blocks, page.images);
  if (!blocks.length) return { ok: false, error: "هوش مصنوعی بلاکی تولید نکرد." };
  if (!blocks.some((b) => b.type === "hero")) {
    blocks.unshift({
      id: newBlockId(),
      type: "hero",
      props: {
        title: String(json.title || page.title || "صفحه").slice(0, 200),
        subtitle: String(json.description || page.description || "").slice(0, 400),
        bgImage: "",
        ctaText: "",
        ctaHref: "",
        align: "right",
      },
    });
  }
  return {
    ok: true,
    title: String(json.title || page.title || "صفحه").slice(0, 120),
    description: String(json.description || page.description || "").slice(0, 300),
    blocks,
    engine: `${args.provider || "lovable"} / ${args.model || "پیش‌فرض"}`,
  };
}
