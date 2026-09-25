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
  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)?.slice(1).map(Number);
  const blockedIpv4 = ipv4 && (
    ipv4.some((part) => part > 255) ||
    ipv4[0] === 0 || ipv4[0] === 10 || ipv4[0] === 127 ||
    (ipv4[0] === 169 && ipv4[1] === 254) ||
    (ipv4[0] === 172 && (ipv4[1] ?? 0) >= 16 && (ipv4[1] ?? 0) <= 31) ||
    (ipv4[0] === 192 && ipv4[1] === 168) ||
    (ipv4[0] === 100 && (ipv4[1] ?? 0) >= 64 && (ipv4[1] ?? 0) <= 127) ||
    (ipv4[0] ?? 0) >= 224
  );
  return (
    h === "localhost" ||
    h === "" ||
    h.endsWith(".local") ||
    h === "metadata.google.internal" ||
    h.endsWith(".internal") ||
    Boolean(blockedIpv4) ||
    /^(::1|::$|fe[89ab][0-9a-f]:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:|::ffff:)/i.test(h) ||
    /^\d+$/.test(h)
  );
}

function validateRemoteUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password || isBlockedHost(parsed.hostname)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function fetchHtml(start: URL): Promise<{ response: Response; finalUrl: string } | { error: string }> {
  let current = start;
  for (let hop = 0; hop < 5; hop += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let response: Response;
    try {
      response = await fetch(current.href, {
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml;q=0.9" },
        redirect: "manual",
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error && error.name === "AbortError" ? "زمان دریافت صفحه به پایان رسید." : "دریافت صفحه ناموفق بود.";
      return { error: message };
    }
    clearTimeout(timeout);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      const next = location ? validateRemoteUrl(new URL(location, current).href) : null;
      if (!next) return { error: "تغییرمسیر صفحه به یک آدرس غیرمجاز انجام شد." };
      current = next;
      continue;
    }
    return { response, finalUrl: current.href };
  }
  return { error: "تعداد تغییرمسیرهای صفحه بیش از حد مجاز است." };
}

async function readLimitedText(response: Response, maxBytes = 2_500_000): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error("حجم صفحه بیش از حد مجاز است.");
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

export async function extractFromUrl(rawUrl: string): Promise<ExtractResult> {
  const url = (rawUrl || "").trim();
  if (!url) return { ok: false, error: "آدرس URL خالی است." };
  const parsed = validateRemoteUrl(url);
  if (!parsed) return { ok: false, error: "آدرس URL نامعتبر یا غیرمجاز است." };
  const fetched = await fetchHtml(parsed);
  if ("error" in fetched) return { ok: false, error: fetched.error };
  const res = fetched.response;
  if (!res.ok) return { ok: false, error: `کد HTTP ${res.status}` };
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    return { ok: false, error: "آدرس واردشده یک صفحه HTML نیست." };
  }
  const declaredSize = Number(res.headers.get("content-length") || 0);
  if (declaredSize > 2_500_000) return { ok: false, error: "حجم صفحه بیش از حد مجاز است." };
  let html: string;
  try {
    html = await readLimitedText(res);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "خواندن صفحه ناموفق بود." };
  }
  const baseUrl = fetched.finalUrl;
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
    const src = bestImg(img, baseUrl);
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
      const href = absUrl(node.getAttribute("href") || "", baseUrl);
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
            return { title: h, text: body.slice(0, 160), image: img ? bestImg(img, baseUrl) : "" };
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
        push({ id: newBlockId(), type: "gallery", props: { images: imgs.map((i) => bestImg(i, baseUrl)).filter(Boolean), columns: "3" } });
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
