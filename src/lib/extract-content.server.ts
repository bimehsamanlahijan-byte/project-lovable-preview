/* eslint-disable */
/**
 * Server-only content extraction for the Page Builder.
 *
 * Given a URL, fetch the page, strip the source site's Header/Footer/nav and
 * chrome, isolate the main content, and convert it into the same Block model
 * the Page Builder / Visual Editor / Inspector use — so every extracted
 * element is a real, selectable DOM node, not raw HTML.
 */
import { parseHTML } from "linkedom";
import { newBlockId, type Block } from "./custom-pages";

export type ExtractResult = {
  ok: boolean;
  error?: string;
  title?: string;
  description?: string;
  blocks?: Block[];
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const STRIP = [
  "script", "style", "noscript", "nav", "header", "footer", "aside", "form", "iframe", "template", "svg",
  "[role='navigation']", "[role='banner']", "[role='contentinfo']", ".breadcrumb", ".breadcrumbs", ".cookie",
  ".cookie-banner", ".popup", ".modal", ".sidebar", ".share-buttons", ".social-share", ".related-posts",
  ".comments", "#comments", ".advertisement", ".ads", ".elementor-location-header", ".elementor-location-footer",
];

function absUrl(href: string, base: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function textOf(node: Element | null): string {
  return (node?.textContent || "").replace(/\s+/g, " ").trim();
}

function metaContent(document: Document, selector: string): string {
  return document.querySelector(selector)?.getAttribute("content")?.replace(/\s+/g, " ").trim() || "";
}

/** Resolve srcset/src to a single best absolute URL. */
function bestImg(img: Element, base: string): string {
  const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
  if (srcset) {
    const candidates = srcset
      .split(",")
      .map((part) => part.trim().split(/\s+/))
      .filter((part) => part[0]);
    const best = candidates.at(-1)?.[0];
    if (best) return absUrl(best, base);
  }
  const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
  return src ? absUrl(src, base) : "";
}

function isBlockedHost(hostname: string): boolean {
  const h = (hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  return (
    h === "localhost" ||
    h === "" ||
    h.endsWith(".local") ||
    h === "metadata.google.internal" ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.|::1|fe80:)/.test(h)
  );
}

export async function extractFromUrl(rawUrl: string): Promise<ExtractResult> {
  const url = (rawUrl || "").trim();
  if (!url) return { ok: false, error: "آدرس URL خالی است." };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "آدرس URL نامعتبر است." };
  }
  if (!/^https?:$/.test(parsed.protocol)) return { ok: false, error: "فقط http/https پشتیبانی می‌شود." };
  if (isBlockedHost(parsed.hostname)) return { ok: false, error: "دسترسی به این میزبان مجاز نیست." };
  let res: Response;
  try {
    res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,*/*" }, redirect: "follow" });
  } catch (e: any) {
    return { ok: false, error: `دریافت صفحه ناموفق: ${e?.message || e}` };
  }
  if (!res.ok) return { ok: false, error: `کد HTTP ${res.status}` };
  const html = await res.text();
  const { document } = parseHTML(html);

  for (const sel of STRIP) {
    document.querySelectorAll(sel).forEach((n: Element) => n.remove());
  }

  const title =
    metaContent(document, "meta[property='og:title']") ||
    textOf(document.querySelector("title")) ||
    textOf(document.querySelector("h1")) ||
    "صفحه استخراج‌شده";
  const description =
    metaContent(document, "meta[name='description']") ||
    metaContent(document, "meta[property='og:description']") ||
    "";

  const candidates = Array.from(
    document.querySelectorAll(
      "article, main, [role='main'], .entry-content, .post-content, .page-content, .elementor-widget-theme-post-content, #content, #main",
    ),
  );
  const main = candidates
    .filter((node) => textOf(node).length >= 120)
    .sort((a, b) => {
      const score = (node: Element) =>
        textOf(node).length + node.querySelectorAll("h1,h2,h3,p,li,table,img").length * 120;
      return score(b) - score(a);
    })[0] || document.body;

  const blocks: Block[] = [];
  const MAX = 60;
  const seenImages = new Set<string>();

  function push(block: Block) {
    if (blocks.length >= MAX) return;
    const previous = blocks.at(-1);
    if (block.type === "text" && previous?.type === "text" && !block.props.title && !previous.props.title) {
      const body = [previous.props.body, block.props.body].filter(Boolean).join("\n\n");
      if (body.length <= 6000) {
        previous.props.body = body;
        return;
      }
    }
    blocks.push(block);
  }

  function pushImage(img: Element, width: "full" | "boxed" = "boxed") {
    const src = bestImg(img, url);
    if (!src || src.startsWith("data:") || seenImages.has(src)) return;
    const widthAttr = Number(img.getAttribute("width") || 0);
    const heightAttr = Number(img.getAttribute("height") || 0);
    if ((widthAttr && widthAttr < 120) || (heightAttr && heightAttr < 80)) return;
    seenImages.add(src);
    push({ id: newBlockId(), type: "image", props: { src, alt: img.getAttribute("alt") || "", href: "", width } });
  }

  function tableText(table: Element): string {
    return Array.from(table.querySelectorAll("tr"))
      .map((row) => Array.from(row.querySelectorAll(":scope > th, :scope > td")).map(textOf).filter(Boolean).join(" | "))
      .filter(Boolean)
      .join("\n");
  }

  function isButtonLikeLink(node: Element): boolean {
    const cls = `${node.getAttribute("class") || ""} ${node.getAttribute("role") || ""}`.toLowerCase();
    const parentTag = node.parentElement?.tagName?.toLowerCase();
    return /button|btn|cta/.test(cls) || parentTag === "button";
  }

  function walk(node: Element) {
    if (!node || blocks.length >= MAX) return;
    const tag = node.tagName?.toLowerCase?.();
    if (!tag) return;

    // Headings
    if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
      const txt = textOf(node);
      if (!txt) return;
      if (tag === "h1" && blocks.length === 0) {
        push({ id: newBlockId(), type: "hero", props: { title: txt, subtitle: "", bgImage: "", ctaText: "", ctaHref: "", align: "right" } });
      } else {
        push({ id: newBlockId(), type: "text", props: { title: txt, body: "", align: "right" } });
      }
      return;
    }

    // Images
    if (tag === "img") {
      pushImage(node);
      return;
    }
    if (tag === "figure") {
      const img = node.querySelector("img");
      if (img) {
        pushImage(img);
      }
      const cap = textOf(node.querySelector("figcaption"));
      if (cap) push({ id: newBlockId(), type: "text", props: { title: "", body: cap, align: "right" } });
      return;
    }

    if (tag === "p") {
      const txt = textOf(node);
      if (txt.length >= 2) push({ id: newBlockId(), type: "text", props: { title: "", body: txt, align: "right" } });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      const items = Array.from(node.querySelectorAll(":scope > li"))
        .map((li) => `• ${textOf(li)}`)
        .filter(Boolean);
      if (items.length) push({ id: newBlockId(), type: "text", props: { title: "", body: items.join("\n"), align: "right" } });
      return;
    }

    if (tag === "table") {
      const body = tableText(node);
      if (body) push({ id: newBlockId(), type: "text", props: { title: "", body, align: "right" } });
      return;
    }

    if (tag === "a") {
      const href = absUrl(node.getAttribute("href") || "", url);
      const label = textOf(node);
      if (label && label.length < 80 && href && isButtonLikeLink(node)) {
        push({ id: newBlockId(), type: "cta", props: { title: "", body: "", buttonLabel: label, buttonHref: href, bg: "#0b1e3f" } });
      }
      return;
    }

    // Containers
    if (tag === "section" || tag === "div" || tag === "article") {
      const direct = Array.from(node.children).filter((c: Element) => c.tagName);
      
      // Only treat repeated, genuinely card-like children as cards. Generic
      // content wrappers often have 2–8 children and caused the old extractor
      // to collapse whole articles into inaccurate cards.
      if (direct.length >= 2 && direct.length <= 8) {
        const cards = direct
          .map((c: Element) => {
            const h = textOf(c.querySelector("h2,h3,h4,.title")) || textOf(c.querySelector("a"));
            const img = c.querySelector("img");
            const body = textOf(c.querySelector("p")) || textOf(c);
            return { title: h, text: body.slice(0, 160), image: img ? bestImg(img, url) : "" };
          })
          .filter((c) => c.title || c.text);
        const cardSignals = direct.filter((c) => c.querySelector("img") && c.querySelector("h2,h3,h4,.title,.card-title")).length;
        if (cards.length === direct.length && cards.length >= 2 && cardSignals >= Math.ceil(direct.length / 2)) {
          push({ id: newBlockId(), type: "cards", props: { columns: String(Math.min(cards.length, 4)), items: cards.map((c) => ({ title: c.title, text: c.text, image: c.image })) } });
          return;
        }
      }

      // Gallery detection
      const imgs = Array.from(node.querySelectorAll("img"));
      if (imgs.length >= 3 && imgs.length <= 12 && direct.every((c: Element) => c.querySelector("img") || c.tagName?.toLowerCase() === "img")) {
        push({ id: newBlockId(), type: "gallery", props: { images: imgs.map((i) => bestImg(i, url)).filter(Boolean), columns: "3" } });
        return;
      }

      // Grouping consecutive text elements
      let buffer: string[] = [];
      const flushText = () => {
        if (!buffer.length) return;
        push({ id: newBlockId(), type: "text", props: { title: "", body: buffer.join("\n\n"), align: "right" } });
        buffer = [];
      };
      for (const child of Array.from(node.children)) {
        const cTag = child.tagName?.toLowerCase();
        if (cTag === "p" || cTag === "ul" || cTag === "ol") {
          const txt = cTag === "ul" || cTag === "ol" 
            ? Array.from(child.querySelectorAll(":scope > li")).map(li => `• ${textOf(li)}`).join("\n")
            : textOf(child);
          if (txt) buffer.push(txt);
        } else {
          flushText();
          walk(child as Element);
        }
      }
      flushText();
      return;
    }

    for (const child of Array.from(node.children)) walk(child as Element);
  }

  if (main) {
    const kids = Array.from(main.children).filter((c: Element) => c.tagName);
    if (kids.length === 0 && textOf(main)) {
      push({ id: newBlockId(), type: "text", props: { title: title, body: textOf(main).slice(0, 4000), align: "right" } });
    } else {
      for (const child of kids) walk(child as Element);
    }
  }

  if (!blocks.some((block) => block.type === "hero")) {
    blocks.unshift({
      id: newBlockId(),
      type: "hero",
      props: { title: textOf(main.querySelector("h1")) || title, subtitle: description, bgImage: "", ctaText: "", ctaHref: "", align: "right" },
    });
  }
  if (blocks.length === 0) return { ok: false, error: "محتوای قابل استخراجی پیدا نشد." };
  return { ok: true, title: title.slice(0, 120), description: description.slice(0, 300), blocks };
}
