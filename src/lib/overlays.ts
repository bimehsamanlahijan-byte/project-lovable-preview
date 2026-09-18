/**
 * Overlay layers for the visual editor.
 *
 * An overlay is an independent layer painted ON TOP of existing page content.
 * It is never merged into the original markup: overlays are stored as separate
 * JSON objects (site_settings → `visual_overlays`) and rendered at runtime into
 * their own root container, so the underlying section/widget HTML stays intact.
 *
 * While an overlay is visible with `interaction.block = true`, the element
 * underneath receives no mouse / touch / pointer event — even when the overlay
 * background is fully transparent — while content inside the overlay stays
 * fully interactive.
 */
import { supabase } from "@/integrations/supabase/client";

export type OverlayDevice = "desktop" | "tablet" | "mobile";

export type OverlayBox = { top: number; left: number; width: number; height: number };

export type OverlayContentKind = "none" | "text" | "image" | "html" | "iframe" | "widget";

export type OverlayContent = {
  kind: OverlayContentKind;
  /** Plain text / rich label shown inside the overlay. */
  text?: string;
  textStyle?: Record<string, string>;
  image?: {
    src?: string;
    width?: string;
    height?: string;
    objectFit?: string;
    radius?: string;
    href?: string;
  };
  button?: { label?: string; href?: string; bg?: string; color?: string; radius?: string };
  html?: string;
  css?: string;
  js?: string;
  iframeSrc?: string;
  /**
   * Compatibility mode for external links: route the iframe through
   * /api/public/embed so sites that refuse framing (X-Frame-Options /
   * CSP frame-ancestors) or block bots still render inside the overlay.
   */
  iframeProxy?: boolean;
  /** Self-contained widget document (e.g. extracted from a ZIP package). */
  widget?: { name?: string; html?: string };
};

export type OverlayInteraction = {
  /** Block every pointer/mouse/touch event from reaching the element below. */
  block: boolean;
  action: "none" | "url" | "popup" | "modal" | "js" | "toggle" | "widget";
  url?: string;
  target?: string;
  js?: string;
  popupHtml?: string;
  hover?: Record<string, string>;
};

export type OverlayStyle = {
  background?: string;
  opacity?: number;
  border?: string;
  radius?: string;
  shadow?: string;
  rotation?: number;
  backdrop?: string;
  padding?: string;
  align?: string;
  justify?: string;
};

export type OverlayItem = {
  type: "overlay";
  id: string;
  /** Page path the overlay belongs to ("/" , "/third-party" …). */
  page: string;
  label?: string;
  mode: "cover" | "cover-content" | "interactive" | "transparent";
  /** CSS selector of the element the overlay is attached to (Attached mode). */
  target?: string | null;
  attach: "fixed" | "attached";
  /** Desktop geometry, in document pixels (page coordinates). */
  box: OverlayBox;
  responsive: {
    sameForAll: boolean;
    tablet?: Partial<OverlayBox>;
    mobile?: Partial<OverlayBox>;
  };
  style: OverlayStyle;
  content: OverlayContent;
  interaction: OverlayInteraction;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  createdAt: number;
};

export const OVERLAY_SETTING_KEY = "visual_overlays";
export const OVERLAY_STORAGE_KEY = "site-visual-overlays-v1";
export const OVERLAY_ROOT_ID = "ve-overlay-root";

export function newOverlayId(): string {
  return `ov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeOverlayPath(path: string): string {
  const clean = (path || "/").split("?")[0]!.split("#")[0]!;
  const trimmed = clean.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function createOverlay(page: string, box: OverlayBox, target?: string | null): OverlayItem {
  return {
    type: "overlay",
    id: newOverlayId(),
    page: normalizeOverlayPath(page),
    label: "لایه پوشاننده",
    mode: "cover-content",
    target: target ?? null,
    attach: target ? "attached" : "fixed",
    box,
    responsive: { sameForAll: true },
    style: {
      background: "rgba(11, 30, 63, 0.55)",
      opacity: 1,
      radius: "12px",
      padding: "16px",
      align: "center",
      justify: "center",
    },
    content: { kind: "text", text: "برای مشاهده اطلاعات بیشتر کلیک کنید", textStyle: { color: "#ffffff", "font-size": "16px", "font-weight": "700", "text-align": "center" } },
    interaction: { block: true, action: "none" },
    zIndex: 60,
    locked: false,
    visible: true,
    createdAt: Date.now(),
  };
}

/** Geometry of an overlay for the given device (falls back to the base box). */
export function boxForDevice(item: OverlayItem, device: OverlayDevice): OverlayBox {
  if (item.responsive?.sameForAll || device === "desktop") return item.box;
  const patch = device === "mobile" ? item.responsive?.mobile : item.responsive?.tablet;
  return { ...item.box, ...(patch ?? {}) };
}

export function overlaysForPage(list: OverlayItem[], path: string): OverlayItem[] {
  const here = normalizeOverlayPath(path);
  return list.filter((o) => normalizeOverlayPath(o.page) === here);
}

/* ---------------- persistence ---------------- */

export function loadLocalOverlays(): OverlayItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OVERLAY_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as OverlayItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalOverlays(list: OverlayItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

/** Published overlays, readable by every visitor of the live site. */
export async function loadRemoteOverlays(): Promise<OverlayItem[] | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", OVERLAY_SETTING_KEY)
    .maybeSingle();
  if (error || !data?.value) return null;
  const value = data.value as { list?: OverlayItem[] } | OverlayItem[];
  const list = Array.isArray(value) ? value : value.list;
  return Array.isArray(list) ? list : null;
}

/* ---------------- sanitising ---------------- */

/** Removes scripts and event attributes from author-provided HTML. */
export function sanitizeOverlayHtml(raw: string): string {
  if (typeof window === "undefined" || !raw) return raw || "";
  const doc = new DOMParser().parseFromString(raw, "text/html");
  for (const tag of ["script", "object", "embed", "base", "meta", "link"]) {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  }
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || attr.value.toLowerCase().startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

/** Single sandboxed document for HTML+CSS+JS content and ZIP widgets. */
export function buildSandboxDocument(html: string, css?: string, js?: string): string {
  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;font-family:inherit;background:transparent}</style>
${css ? `<style>${css}</style>` : ""}</head>
<body>${html}${js ? `<script>try{${js}}catch(e){console.error(e)}<\/script>` : ""}</body></html>`;
}
