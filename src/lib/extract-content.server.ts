/* eslint-disable */
/**
 * Server-only content extraction for the Page Builder.
 *
 * Given a URL, fetch the page, strip the source site's Header/Footer/nav and
 * chrome, isolate the main content, and convert it into the same Block model
 * the Page Builder / Visual Editor / Inspector use — so every extracted
 * element is a real, selectable DOM node, not raw HTML.
 *
 * Runs in the Worker runtime: uses fetch + linkedom (pure-JS DOM, no native
 * bindings). Never reaches for the filesystem or child_process.
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

const STRIP = ["script", "style", "noscript", "nav", "header", "footer", "aside", "form", "iframe", "template", "svg", "button"];

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

/** Resolve srcset/src to a single best absolute URL. */
function bestImg(img: Element, base: string): string {
  const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
  if (srcset) {
    const first = srcset.split(",")[0]?.trim().split(" ")[0];
    if (first) return absUrl(first, base);
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

  // Strip chrome and non-content nodes.
  for (const sel of STRIP) {
    document.querySelectorAll(sel).forEach((n: Element) => n.remove());
}

  // Title / description
  const title =
    textOf(document.querySelector("meta[property='og:title']")) ||
    textOf(document.querySelector("title")) ||
    textOf(document.querySelector("h1")) ||
    "صفحه استخراج‌شده";
  const description =
    textOf(document.querySelector("meta[name='description']")) ||
    textOf(document.querySelector("meta[property='og:description']")) ||
    "";

  // Main content container.
  const main =
    document.querySelector("main") ||
    document.querySelector("article") ||
    document.querySelector("[role='main']") ||
    document.querySelector("#content") ||
    document.body;

  const blocks: Block[] = [];
  const MAX = 40;

  function push(block: Block) {
    if (blocks.length >= MAX) return;
    blocks.push(block);
  }

  function walk(node: Element) {
    if (!node || blocks.length >= MAX) return;
    const tag = node.tagName?.toLowerCase?.();
    if (!tag) return;

    // Headings → text block (hero if first h1).
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

    // Image.
    if (tag === "img") {
      const src = bestImg(node, url);
      if (src) push({ id: newBlockId(), type: "image", props: { src, alt: node.getAttribute("alt") || "", href: "", width: "full" } });
      return;
    }
    if (tag === "figure") {
      const img = node.querySelector("img");
      if (img) {
        const src = bestImg(img, url);
        if (src) push({ id: newBlockId(), type: "image", props: { src, alt: img.getAttribute("alt") || "", href: "", width: "full" } });
      }
      const cap = textOf(node.querySelector("figcaption"));
      if (cap) push({ id: newBlockId(), type: "text", props: { title: "", body: cap, align: "right" } });
      return;
    }

    // Paragraph / list → text.
    if (tag === "p") {
      const txt = textOf(node);
      if (txt) push({ id: newBlockId(), type: "text", props: { title: "", body: txt, align: "right" } });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      const items = Array.from(node.querySelectorAll(":scope > li"))
        .map((li) => `• ${textOf(li)}`)
        .filter(Boolean);
      if (items.length) push({ id: newBlockId(), type: "text", props: { title: "", body: items.join("\n"), align: "right" } });
      return;
    }

    // A standalone block-level link → CTA.
    if (tag === "a") {
      const href = absUrl(node.getAttribute("href") || "", url);
      const label = textOf(node);
      if (label && href) push({ id: newBlockId(), type: "cta", props: { title: "", body: "", buttonLabel: label, buttonHref: href, bg: "#0b1e3f" } });
      return;
    }

    // A group of similar children → cards (max 6).
    if (tag === "section" || tag === "div" || tag === "ul" || tag === "article") {
      const direct = Array.from(node.children).filter((c: Element) => c.tagName);
      // Detect card-like cluster: >=2 children each with a heading or image.
      if (direct.length >= 2 && direct.length <= 8) {
        const cards = direct
          .map((c: Element) => {
            const h = textOf(c.querySelector("h2,h3,h4,.title,.card-title")) || textOf(c.querySelector("a"));
            const img = c.querySelector("img");
            const body = textOf(c.querySelector("p")) || textOf(c);
            return { title: h, text: body.slice(0, 160), image: img ? bestImg(img, url) : "" };
          })
          .filter((c) => c.title || c.text);
        if (cards.length === direct.length && cards.length >= 2) {
          push({
            id: newBlockId(),
            type: "cards",
            props: {
              columns: String(Math.min(cards.length, 4)),
              items: cards.map((c) => ({ title: c.title, text: c.text, image: c.image })),
            },
          });
          return;
        }
      }
      // Gallery: a div/ul full of images only.
      const imgs = Array.from(node.querySelectorAll("img"));
      if (imgs.length >= 3 && imgs.length <= 12 && direct.every((c: Element) => c.querySelector("img") || c.tagName?.toLowerCase() === "img")) {
        push({
          id: newBlockId(),
          type: "gallery",
          props: { images: imgs.map((i) => bestImg(i, url)).filter(Boolean), columns: "3" },
        });
        return;
      }
      // Otherwise descend into children in order.
      for (const child of direct) walk(child);
      return;
    }

    // Fallback: descend.
    for (const child of Array.from(node.children)) walk(child as Element);
  }

  if (main) {
    // If main's own direct text is meaningful and there are no block children, capture it.
    const kids = Array.from(main.children).filter((c: Element) => c.tagName);
    if (kids.length === 0 && textOf(main)) {
      push({ id: newBlockId(), type: "text", props: { title: title, body: textOf(main).slice(0, 4000), align: "right" } });
    } else {
      for (const child of kids) walk(child as Element);
    }
  }

  if (blocks.length === 0) {
    return { ok: false, error: "محتوای قابل استخراجی در صفحه پیدا نشد (احتمالاً صفحه محتوا را با جاوااسکریپت بارگذاری می‌کند)." };
  }

  return { ok: true, title: title.slice(0, 120), description: description.slice(0, 300), blocks };
}
