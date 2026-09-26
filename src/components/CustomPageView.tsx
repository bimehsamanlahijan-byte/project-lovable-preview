import { useEffect, useState } from "react";
import type { Block } from "@/lib/custom-pages";

/**
 * Block renderer shared by the public `/p/<slug>` route and the live preview
 * inside the Page Builder pane. Each block renders as real, selectable DOM
 * (not raw HTML), so the Visual Editor and Inspector can target it.
 *
 * Inline styles keep blocks self-contained and immune to the site's CSS so a
 * custom page always looks intentional. The palette mirrors the site theme:
 * navy #0b1e3f, accent red #c81e35.
 */

const NAVY = "#0b1e3f";
const RED = "#c81e35";

function sanitizeHtml(value: string): string {
  return value
    .replace(/<(script|style|iframe|object|embed|form|meta|link)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|meta|link)\b[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)[\s\S]*?\2/gi, "");
}

/** Video hosts whose embeds are kept inside cloned pages. */
const VIDEO_HOSTS = /^(https?:)?\/\/([a-z0-9-]+\.)*(youtube\.com|youtube-nocookie\.com|youtu\.be|aparat\.com|vimeo\.com|player\.vimeo\.com|dailymotion\.com|arvancloud\.ir|arvancloud\.com|namava\.ir|filimo\.com|google\.com|googleusercontent\.com)\//i;

/**
 * Sanitizer for full-page clones: keeps inline styles, <video>/<source>,
 * <svg> and embeds from known video hosts; strips scripts, handlers and
 * anything that could hijack the page. Forms become plain containers.
 */
export function sanitizeCloneHtml(value: string): string {
  return value
    .replace(/<(script|object|embed|meta|link|base|noscript|template)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|object|embed|meta|link|base)\b[^>]*\/?\s*>/gi, "")
    .replace(/<style[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<iframe\b([^>]*)>([\s\S]*?)<\/iframe\s*>/gi, (m, attrs: string) => {
      const src = /\ssrc\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? "";
      return VIDEO_HOSTS.test(src) ? m : "";
    })
    .replace(/<(\/?)form\b/gi, "<$1div")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src|action|formaction|xlink:href)\s*=\s*(["'])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi, "");
}

/** Only @font-face / @keyframes / plain rules; no @import or script-ish tricks. */
export function sanitizeCloneCss(value: string): string {
  return value
    .replace(/<\/?style[^>]*>/gi, "")
    .replace(/@import[^;]*;/gi, "")
    .replace(/expression\s*\(/gi, "(")
    .replace(/javascript:/gi, "");
}

function btnPrimary(label: string, href: string) {
  return (
    <a
      href={href || "#"}
      style={{
        display: "inline-block",
        marginTop: 18,
        background: "#fff",
        color: NAVY,
        fontWeight: 800,
        fontSize: 14,
        padding: "10px 24px",
        borderRadius: 999,
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  const p = block.props ?? {};
  const id = block.id;

  switch (block.type) {
    case "hero": {
      const align = p.align || "center";
      return (
        <section
          id={id}
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: align,
            background: p.bgImage ? NAVY : `linear-gradient(120deg, ${NAVY}, ${RED})`,
          }}
        >
          {p.bgImage ? (
            <>
              <img
                src={p.bgImage}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(11,30,63,0.55)" }} />
            </>
          ) : null}
          <div style={{ position: "relative", padding: "48px 16px", color: "#fff", maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{p.title}</h1>
            {p.subtitle ? (
              <p style={{ marginTop: 12, fontSize: 16, opacity: 0.9, lineHeight: 1.9 }}>{p.subtitle}</p>
            ) : null}
            {p.ctaText ? btnPrimary(p.ctaText, p.ctaHref || "#") : null}
          </div>
        </section>
      );
    }
    case "text": {
      const align = p.align || "right";
      return (
        <section id={id} style={{ padding: "32px 16px", maxWidth: 900, margin: "0 auto", textAlign: align }}>
          {p.title ? (
            <h2 style={{ fontWeight: 800, fontSize: 22, color: NAVY, margin: 0 }}>{p.title}</h2>
          ) : null}
          {p.body ? (
            <p style={{ marginTop: 10, color: "#475569", fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap" }}>
              {p.body}
            </p>
          ) : null}
        </section>
      );
    }
    case "cta": {
      return (
        <section
          id={id}
          style={{
            margin: "24px 16px",
            padding: 28,
            borderRadius: 24,
            background: p.bg || NAVY,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>{p.title}</h2>
          {p.body ? <p style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>{p.body}</p> : null}
          {p.buttonLabel ? btnPrimary(p.buttonLabel, p.buttonHref || "#") : null}
        </section>
      );
    }
    case "cards": {
      const cols = Number(p.columns) || 3;
      const items: { title?: string; text?: string; image?: string }[] = Array.isArray(p.items) ? p.items : [];
      return (
        <section
          id={id}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            gap: 12,
            padding: "24px 16px",
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 18,
                textAlign: "center",
              }}
            >
              {it.image && (
                 <img src={it.image} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 12, margin: "0 auto 12px" }} />
              )}
              <h3 style={{ fontWeight: 800, color: NAVY, fontSize: 15, margin: 0 }}>{it.title}</h3>
              {it.text ? (
                <p style={{ marginTop: 6, color: "#64748b", fontSize: 12, lineHeight: 1.8 }}>{it.text}</p>
              ) : null}
            </div>
          ))}
        </section>
      );
    }
    case "image": {
      if (!p.src) return null;
      const wrap = p.width === "boxed" ? 900 : "100%";
      const img = (
        <img
          src={p.src}
          alt={p.alt || ""}
          style={{ width: "100%", borderRadius: 16, display: "block", objectFit: "cover" }}
        />
      );
      return (
        <section id={id} style={{ padding: 16, maxWidth: wrap, margin: "0 auto" }}>
          {p.href ? <a href={p.href}>{img}</a> : img}
        </section>
      );
    }
    case "gallery": {
      const cols = Number(p.columns) || 3;
      const images: string[] = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
      if (!images.length) return null;
      return (
        <section
          id={id}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
            gap: 10,
            padding: 16,
          }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "4 / 3" }}
            />
          ))}
        </section>
      );
    }
    case "video": {
      if (!p.src) return null;
      return (
        <section id={id} style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
          <video
            src={p.src}
            poster={p.poster || undefined}
            controls
            style={{ width: "100%", borderRadius: 16, background: "#000" }}
          />
        </section>
      );
    }
    case "divider":
      return <div id={id} style={{ height: 1, background: "#e2e8f0", margin: "24px 16px" }} />;
    case "clone": {
      const css = sanitizeCloneCss(String(p.css || ""));
      return (
        <section id={id} data-page-clone="1" style={{ width: "100%", overflow: "hidden" }}>
          {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
          <div
            style={{ maxWidth: p.maxWidth || undefined, margin: "0 auto", direction: "rtl" }}
            dangerouslySetInnerHTML={{ __html: sanitizeCloneHtml(String(p.html || "")) }}
          />
        </section>
      );
    }
    case "html":
      return (
        <section
          id={id}
          style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.html || "") }}
        />
      );
    default:
      return null;
  }
}

export function CustomPageContent({ blocks, acceptPreviewUpdates = false }: { blocks: Block[]; acceptPreviewUpdates?: boolean }) {
  const [previewBlocks, setPreviewBlocks] = useState<Block[] | null>(null);

  useEffect(() => {
    if (!acceptPreviewUpdates) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const payload = event.data as { type?: string; blocks?: Block[] };
      if (payload.type === "pb:blocks" && Array.isArray(payload.blocks)) setPreviewBlocks(payload.blocks);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "pb:ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, [acceptPreviewUpdates]);

  const renderedBlocks = previewBlocks ?? blocks;
  return (
    <main data-page-builder-content>
      {renderedBlocks.map((block) => (
        <div id={`page-block-${block.id}`} data-page-block={block.type} key={block.id}>
          <BlockRenderer block={block} />
        </div>
      ))}
    </main>
  );
}
