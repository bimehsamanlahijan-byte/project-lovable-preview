/**
 * Visual editor shared logic.
 * Overrides are persisted in the database (site_settings → visual_overrides)
 * so every visitor of the live site sees them, with a localStorage copy used
 * for instant paint before the remote value arrives.
 */
import { supabase } from "@/integrations/supabase/client";

export type Override = {
  text?: string;
  html?: string;
  href?: string;
  target?: string;
  rel?: string;
  style?: Record<string, string>;
  /** Hover / touch-active styles (desktop hover + mobile tap). */
  hover?: Record<string, string>;
  /** When true, hover styles also apply to inner elements (icons, svg, spans). */
  hoverDeep?: boolean;
  hidden?: boolean;
  /** Extra HTML block inserted right after this element. */
  block?: string;
};



export type OverrideMap = Record<string, Override>;

export const VE_STORAGE_KEY = "site-visual-overrides-v1";
export const VE_EDIT_PARAM = "ve";
export const VE_SETTING_KEY = "visual_overrides";

export function loadOverrides(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OverrideMap) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(map: OverrideMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VE_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Published overrides, readable by every visitor. */
export async function loadRemoteOverrides(): Promise<OverrideMap | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", VE_SETTING_KEY)
    .maybeSingle();
  if (error || !data?.value) return null;
  const value = data.value as { map?: OverrideMap } | OverrideMap;
  return ((value as { map?: OverrideMap }).map ?? (value as OverrideMap)) || null;
}


/** Stable-ish CSS path for an element. */
export function getSelector(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== "body") {
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const sameTag = Array.from(parent.children).filter(
      (c) => c.tagName === node!.tagName,
    );
    const idx = sameTag.indexOf(node) + 1;
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${idx})` : tag);
    node = parent;
  }
  return `body > ${parts.join(" > ")}`;
}

export function applyOverride(el: HTMLElement, ov: Override, selector?: string) {
  if (ov.html !== undefined) el.innerHTML = ov.html;
  else if (ov.text !== undefined) el.textContent = ov.text;
  if (ov.href !== undefined && ov.href !== "") {
    el.setAttribute("href", ov.href);
    makeNavigable(el, ov.href, ov.target);
  }
  if (ov.target) el.setAttribute("target", ov.target);
  if (ov.rel) el.setAttribute("rel", ov.rel);
  if (ov.hidden) el.style.setProperty("display", "none", "important");
  if (ov.style) {
    // Don't fight the hover runtime while this element is hovered/pressed.
    let held: Record<string, string> = {};
    const raw = el.getAttribute("data-ve-hover-prev");
    if (raw) {
      try {
        held = JSON.parse(raw) as Record<string, string>;
      } catch {
        held = {};
      }
    }
    for (const [k, v] of Object.entries(ov.style)) {
      if (!v) continue;
      if (k in held) {
        held[k] = v;
        continue;
      }
      el.style.setProperty(k, v, "important");
    }
    if (raw) el.setAttribute("data-ve-hover-prev", JSON.stringify(held));
  }

  if (selector) applyBlock(el, selector, ov.block);
}

/**
 * A link added from the dashboard can land on an element that is not an
 * anchor (button, div, span, heading…). Setting `href` alone does nothing
 * there, so we make the element genuinely clickable on the live site.
 */
function makeNavigable(el: HTMLElement, href: string, target?: string) {
  el.style.setProperty("cursor", "pointer");
  el.style.setProperty("pointer-events", "auto");
  el.dataset["veHref"] = href;
  el.dataset["veTarget"] = target ?? "";
  if (el.tagName.toLowerCase() === "a") return;
  if (el.dataset["veNav"] === "1") return;
  el.dataset["veNav"] = "1";
  if (!el.getAttribute("role")) el.setAttribute("role", "link");
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
  const go = () => {
    const url = el.dataset["veHref"] ?? href;
    if (!url) return;
    if ((el.dataset["veTarget"] ?? "") === "_blank") window.open(url, "_blank", "noopener");
    else window.location.assign(url);
  };
  el.addEventListener("click", (e) => {
    if (document.documentElement.classList.contains("ve-select-mode")) return;
    e.preventDefault();
    go();
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
}

/** Keeps an inserted HTML block in sync as a sibling right after `el`. */
function applyBlock(el: HTMLElement, selector: string, block?: string) {
  const parent = el.parentElement;
  if (!parent) return;
  const key = selector.replace(/"/g, "'");
  let node: HTMLElement | null = null;
  try {
    node = parent.querySelector(`[data-ve-block="${key}"]`) as HTMLElement | null;
  } catch {
    node = null;
  }
  if (!block) {
    node?.remove();
    return;
  }
  if (!node) {
    node = document.createElement("ve-block");
    node.style.display = "block";
    node.setAttribute("data-ve-block", key);
    el.insertAdjacentElement("afterend", node);
  }
  if (node.innerHTML !== block) node.innerHTML = block;
}

const VE_HOVER_STYLE_ID = "ve-hover-styles";
/** Class added on touchstart so phones/tablets get the same hover colors. */
export const VE_TOUCH_CLASS = "ve-touch-hover";

/** Latest hover definitions, used by the JS hover runtime. */
let hoverMap: OverrideMap = {};

/** Builds one stylesheet with all hover / touch rules of the override map. */
export function applyHoverStyles(map: OverrideMap) {
  hoverMap = map;
  if (typeof document === "undefined") return;
  const rules: string[] = [];
  for (const [selector, ov] of Object.entries(map)) {
    const hover = ov.hover;
    if (!hover) continue;
    const body = Object.entries(hover)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v} !important;`)
      .join("");
    if (!body) continue;
    const targets = [`${selector}:hover`, `${selector}.${VE_TOUCH_CLASS}`];
    if (ov.hoverDeep) {
      targets.push(`${selector}:hover *`, `${selector}.${VE_TOUCH_CLASS} *`);
    }
    rules.push(`${targets.join(", ")} { ${body} }`);
  }
  let tag = document.getElementById(VE_HOVER_STYLE_ID) as HTMLStyleElement | null;
  if (!rules.length) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("style");
    tag.id = VE_HOVER_STYLE_ID;
    document.head.appendChild(tag);
  }
  const css = rules.join("\n");
  if (tag.textContent !== css) tag.textContent = css;
}

/** Finds the override entry whose selector matches `el` or one of its parents. */
function findHoverTarget(
  start: HTMLElement | null,
): { el: HTMLElement; hover: Record<string, string>; deep: boolean } | null {
  let node: HTMLElement | null = start;
  while (node && node.nodeType === 1) {
    for (const [selector, ov] of Object.entries(hoverMap)) {
      const hover = ov.hover;
      if (!hover || !Object.values(hover).some(Boolean)) continue;
      let matches = false;
      try {
        matches = node.matches(selector);
      } catch {
        matches = false;
      }
      if (matches) return { el: node, hover, deep: ov.hoverDeep === true };
    }
    node = node.parentElement;
  }
  return null;
}

const VE_PREV_ATTR = "data-ve-hover-prev";

/**
 * Applies hover styles inline (with !important) because the base overrides are
 * themselves inline !important, which no stylesheet rule can beat.
 */
function setHover(el: HTMLElement, hover: Record<string, string>, deep: boolean) {
  const targets: HTMLElement[] = [el];
  if (deep) targets.push(...(Array.from(el.querySelectorAll("*")) as HTMLElement[]));
  for (const t of targets) {
    if (t.hasAttribute(VE_PREV_ATTR)) continue;
    const prev: Record<string, string> = {};
    for (const [k, v] of Object.entries(hover)) {
      if (!v) continue;
      prev[k] = t.style.getPropertyValue(k);
      t.style.setProperty(k, v, "important");
    }
    t.setAttribute(VE_PREV_ATTR, JSON.stringify(prev));
  }
}

function clearHover(el: HTMLElement) {
  const targets = [el, ...(Array.from(el.querySelectorAll("*")) as HTMLElement[])];
  for (const t of targets) {
    const raw = t.getAttribute(VE_PREV_ATTR);
    if (raw === null) continue;
    t.removeAttribute(VE_PREV_ATTR);
    let prev: Record<string, string> = {};
    try {
      prev = JSON.parse(raw) as Record<string, string>;
    } catch {
      prev = {};
    }
    for (const [k, v] of Object.entries(prev)) {
      if (v) t.style.setProperty(k, v, "important");
      else t.style.removeProperty(k);
    }
  }
}

/** Mouse hover + touch activation for every element that has hover overrides. */
export function enableTouchHover(): () => void {
  if (typeof document === "undefined") return () => {};
  let active: HTMLElement | null = null;

  const clear = () => {
    if (!active) return;
    active.classList.remove(VE_TOUCH_CLASS);
    clearHover(active);
    active = null;
  };

  const activate = (target: HTMLElement | null, touch: boolean) => {
    const found = findHoverTarget(target);
    if (!found) {
      clear();
      return;
    }
    if (active === found.el) return;
    clear();
    active = found.el;
    if (touch) active.classList.add(VE_TOUCH_CLASS);
    setHover(found.el, found.hover, found.deep);
  };

  const onOver = (e: Event) => activate(e.target as HTMLElement, false);
  const onOut = (e: MouseEvent) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (active && to && active.contains(to)) return;
    clear();
  };
  const onStart = (e: TouchEvent) => activate(e.target as HTMLElement, true);

  document.addEventListener("mouseover", onOver, true);
  document.addEventListener("mouseout", onOut, true);
  document.addEventListener("touchstart", onStart, true);
  document.addEventListener("touchend", clear, true);
  document.addEventListener("touchcancel", clear, true);
  document.addEventListener("touchmove", clear, true);
  return () => {
    clear();
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("mouseout", onOut, true);
    document.removeEventListener("touchstart", onStart, true);
    document.removeEventListener("touchend", clear, true);
    document.removeEventListener("touchcancel", clear, true);
    document.removeEventListener("touchmove", clear, true);
  };
}


export function applyAll(map: OverrideMap) {
  if (typeof document === "undefined") return;
  for (const [selector, ov] of Object.entries(map)) {
    let el: HTMLElement | null = null;
    try {
      el = document.querySelector(selector) as HTMLElement | null;
    } catch {
      el = null;
    }
    if (el) applyOverride(el, ov, selector);
  }
  applyHoverStyles(map);
}


