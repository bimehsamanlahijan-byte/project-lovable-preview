import { useEffect } from "react";

import {
  applyAll,
  applyHoverStyles,
  enableTouchHover,
  getSelector,
  readLabel,
  scopeKey,
  loadOverrides,
  loadRemoteOverrides,
  saveOverrides,
  VE_EDIT_PARAM,
  type Override,
  type OverrideMap,
} from "@/lib/visual-editor";


/**
 * Mounted once in the root route.
 * - Applies published overrides (database) on every page of the live site.
 * - With ?ve=1 (dashboard iframe) it enables click-to-select editing and
 *   reports the full override map back so the dashboard can publish it.
 */
export function VisualEditorRuntime() {
  useEffect(() => {
    let map: OverrideMap = loadOverrides();
    let started = false;
    let startTimer: number | undefined;
    const params = new URLSearchParams(window.location.search);
    const isEditing = params.get(VE_EDIT_PARAM) === "1";
    const isInspecting = params.get("inspect") === "1";

    /* ---------- code / error inspector (dashboard → «ایرادیاب و کدیاب») ---------- */
    let stopInspector: (() => void) | undefined;
    if (isInspecting) stopInspector = startInspector();

    const reapply = () => {
      // Hover / touch CSS is a stylesheet, never touches the hydrated DOM,
      // so it can be applied immediately.
      applyHoverStyles(map);
      if (started) applyAll(map);
    };

    // Direct DOM overrides must wait until React has finished hydrating lazy
    // route content; changing it earlier makes server/client markup diverge.
    let startedOnce = false;
    const startApplying = () => {
      if (startedOnce) return;
      startedOnce = true;
      startTimer = window.setTimeout(() => {
        started = true;
        applyAll(map);
        obs.observe(document.body, { childList: true, subtree: true });
      }, 350);
    };

    applyHoverStyles(map);

    void loadRemoteOverrides().then((remote) => {
      if (remote) {
        map = remote;
        saveOverrides(map);
        reapply();
      }
    });

    const obs = new MutationObserver(() => {
      window.requestAnimationFrame(reapply);
    });
    // Touch devices get the same hover colors while a finger is on the element.
    const stopTouchHover = enableTouchHover();
    // Some pages keep long-lived requests open, so `load` may never fire —
    // never gate the overrides on it alone.
    if (document.readyState === "complete") startApplying();
    else {
      window.addEventListener("load", startApplying, { once: true });
      window.setTimeout(startApplying, 1200);
    }


    if (!isEditing) {
      return () => {
        obs.disconnect();
        stopTouchHover();
        stopInspector?.();
        window.removeEventListener("load", startApplying);
        if (startTimer !== undefined) window.clearTimeout(startTimer);
      };
    }


    /* ---------- editing mode ---------- */
    document.documentElement.classList.add("ve-editing");
    const style = document.createElement("style");
    style.textContent = `
      .ve-editing.ve-select-mode * { cursor: crosshair !important; }
      .ve-hover { outline: 2px dashed #2563eb !important; outline-offset: 2px; }
      .ve-selected { outline: 3px solid #0b1e3f !important; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    /** "select" = click picks an element, "interact" = the site behaves normally. */
    let mode: "select" | "interact" = "select";
    const applyModeClass = () => {
      document.documentElement.classList.toggle("ve-select-mode", mode === "select");
    };
    applyModeClass();

    let selected: HTMLElement | null = null;
    let hovered: HTMLElement | null = null;

    const post = (msg: unknown) => window.parent?.postMessage(msg, "*");
    const publish = () => post({ type: "ve:map", map });

    const describe = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return {
        selector: getSelector(el),
        tag: el.tagName.toLowerCase(),
        // Text nodes only, so buttons/links that contain an icon (header menu
        // items like «انواع بیمه‌نامه‌ها») still expose an editable label.
        text: readLabel(el),
        html: el.innerHTML.length < 4000 ? el.innerHTML : "",
        href: (el as HTMLAnchorElement).getAttribute?.("href") ?? "",
        computed: {
          color: rgbToHex(cs.color),
          "background-color": rgbToHex(cs.backgroundColor),
          "font-size": cs.fontSize,
          "font-weight": cs.fontWeight,
          "font-family": cs.fontFamily,
          "text-align": cs.textAlign,
        },
      };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (hovered && hovered !== selected) hovered.classList.remove("ve-hover");
      hovered = t;
      if (t !== selected) t.classList.add("ve-hover");
    };

    const select = (t: HTMLElement) => {
      if (selected) selected.classList.remove("ve-selected");
      selected = t;
      t.classList.remove("ve-hover");
      t.classList.add("ve-selected");
      post({ type: "ve:selected", payload: describe(t) });
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // Interact mode: let the real site behave (wheel opens, menus, tabs…).
      // Alt+click still selects the element under the cursor.
      if (mode === "interact" && !e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      select(t);
    };

    /* Keep ?ve=1 across in-frame navigation and report the current path. */
    const reportPath = () =>
      post({ type: "ve:navigate", path: window.location.pathname + window.location.search });

    const ensureEditParam = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get(VE_EDIT_PARAM) !== "1") {
        url.searchParams.set(VE_EDIT_PARAM, "1");
        window.history.replaceState(window.history.state, "", url.toString());
      }
    };

    const origPush = window.history.pushState.bind(window.history);
    const origReplace = window.history.replaceState.bind(window.history);
    window.history.pushState = function (...args: Parameters<History["pushState"]>) {
      origPush(...args);
      window.setTimeout(() => {
        ensureEditParam();
        reportPath();
      }, 0);
    };
    window.history.replaceState = function (...args: Parameters<History["replaceState"]>) {
      origReplace(...args);
      window.setTimeout(reportPath, 0);
    };
    const onPop = () => {
      ensureEditParam();
      reportPath();
    };
    window.addEventListener("popstate", onPop);

    const onMessage = (e: MessageEvent) => {
      const data = e.data as {
        type?: string;
        selector?: string;
        patch?: Override;
        mode?: "select" | "interact";
      };
      if (!data || typeof data.type !== "string") return;

      if (data.type === "ve:mode") {
        mode = data.mode === "interact" ? "interact" : "select";
        applyModeClass();
        return;
      }

      if (data.type === "ve:update" && data.selector) {
        const key = scopeKey(window.location.pathname, data.selector);
        const prev = map[key] ?? map[data.selector] ?? {};
        const patch = data.patch ?? {};
        map = {
          ...map,
          [key]: {
            ...prev,
            ...patch,
            style: { ...(prev.style ?? {}), ...(patch.style ?? {}) },
            hover: { ...(prev.hover ?? {}), ...(patch.hover ?? {}) },
          },
        };

        saveOverrides(map);
        reapply();
        publish();
      } else if (data.type === "ve:reset" && data.selector) {
        const next = { ...map };
        delete next[scopeKey(window.location.pathname, data.selector)];
        delete next[data.selector];
        map = next;
        saveOverrides(map);
        publish();
        window.location.reload();
      } else if (data.type === "ve:resetAll") {
        map = {};
        saveOverrides(map);
        publish();
        window.location.reload();
      }
    };

    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("click", onClick, true);

    /* Touch support: tap selects in select mode, long-press selects in
       interact mode (Alt+click is impossible on phones and tablets). */
    let pressTimer: number | undefined;
    let pressTarget: HTMLElement | null = null;
    let longPressed = false;
    const onTouchStart = (e: TouchEvent) => {
      longPressed = false;
      pressTarget = e.target as HTMLElement;
      if (pressTimer) window.clearTimeout(pressTimer);
      pressTimer = window.setTimeout(() => {
        if (!pressTarget) return;
        longPressed = true;
        select(pressTarget);
      }, 550);
    };
    const cancelPress = () => {
      if (pressTimer) window.clearTimeout(pressTimer);
      pressTimer = undefined;
    };
    const onTouchEnd = (e: TouchEvent) => {
      cancelPress();
      if (longPressed) {
        e.preventDefault();
        e.stopPropagation();
        longPressed = false;
      }
    };
    document.addEventListener("touchstart", onTouchStart, true);
    document.addEventListener("touchmove", cancelPress, true);
    document.addEventListener("touchend", onTouchEnd, true);
    document.addEventListener("touchcancel", cancelPress, true);

    window.addEventListener("message", onMessage);
    post({ type: "ve:ready", path: window.location.pathname + window.location.search });

    return () => {
      obs.disconnect();
      stopTouchHover();
      stopInspector?.();
      window.removeEventListener("load", startApplying);
      if (startTimer !== undefined) window.clearTimeout(startTimer);

      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("click", onClick, true);
      cancelPress();
      document.removeEventListener("touchstart", onTouchStart, true);
      document.removeEventListener("touchmove", cancelPress, true);
      document.removeEventListener("touchend", onTouchEnd, true);
      document.removeEventListener("touchcancel", cancelPress, true);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("popstate", onPop);
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      style.remove();
      document.documentElement.classList.remove("ve-editing");
      document.documentElement.classList.remove("ve-select-mode");
    };

  }, []);

  return null;
}

/**
 * Code / error inspector ("موس ایرادیاب").
 * Enabled with ?inspect=1 — hovering highlights an element and clicking sends a
 * full technical report (selector, markup, styles, source component and any
 * captured runtime errors) to the dashboard so the admin can copy it and hand
 * it to the developer.
 */
function startInspector(): () => void {
  const errors: string[] = [];
  const pushError = (msg: string) => {
    errors.push(`[${new Date().toISOString()}] ${msg}`);
    if (errors.length > 30) errors.shift();
  };
  const onErr = (e: ErrorEvent) =>
    pushError(`${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`);
  const onRej = (e: PromiseRejectionEvent) => pushError(`Unhandled promise: ${String(e.reason)}`);
  window.addEventListener("error", onErr);
  window.addEventListener("unhandledrejection", onRej);

  const origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    pushError(`console.error: ${args.map((a) => (a instanceof Error ? a.message : String(a))).join(" ")}`);
    origError(...args);
  };

  const style = document.createElement("style");
  style.textContent = `
    .ve-inspect * { cursor: crosshair !important; }
    .ve-inspect-hit { outline: 2px solid #dc2626 !important; outline-offset: 2px; }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add("ve-inspect");

  /** "select" = a plain click reports the element, "interact" = the site behaves
      normally and only Alt+click / long-press reports (needed to reach
      sub-pages, dropdown links and button targets). */
  let mode: "select" | "interact" = "select";
  const onModeMsg = (e: MessageEvent) => {
    const d = e.data as { type?: string; mode?: "select" | "interact" };
    if (d?.type === "ve:mode") {
      mode = d.mode === "interact" ? "interact" : "select";
      document.documentElement.classList.toggle("ve-inspect", mode === "select");
    }
  };
  window.addEventListener("message", onModeMsg);

  let hovered: HTMLElement | null = null;
  const onOver = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    hovered?.classList.remove("ve-inspect-hit");
    hovered = t;
    t.classList.add("ve-inspect-hit");
  };


  const sourceOf = (el: HTMLElement): string => {
    const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
    if (!key) return "";
    let fiber = (el as unknown as Record<string, any>)[key];
    const chain: string[] = [];
    let depth = 0;
    while (fiber && depth < 12) {
      const name =
        typeof fiber.type === "function"
          ? fiber.type.displayName || fiber.type.name
          : typeof fiber.type === "string"
            ? null
            : fiber.type?.displayName || null;
      if (name) chain.push(name);
      const src = fiber._debugSource;
      if (src?.fileName) return `${src.fileName}:${src.lineNumber} (${chain.join(" ← ")})`;
      fiber = fiber.return;
      depth += 1;
    }
    return chain.length ? `کامپوننت‌ها: ${chain.join(" ← ")}` : "";
  };

  const report = (el: HTMLElement) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const html = el.outerHTML.length > 4000 ? `${el.outerHTML.slice(0, 4000)}…` : el.outerHTML;
    const payload = {
      selector: getSelector(el),
      tag: el.tagName.toLowerCase(),
      id: el.id || "",
      classes: el.className && typeof el.className === "string" ? el.className : "",
      text: (el.textContent ?? "").trim().slice(0, 400),
      html,
      inner: el.innerHTML.length < 4000 ? el.innerHTML : "",
      href: el.getAttribute("href") ?? "",
      source: sourceOf(el),
      url: window.location.href,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      box: `${Math.round(rect.width)}×${Math.round(rect.height)} @ ${Math.round(rect.left)},${Math.round(rect.top)}`,
      styles: {
        color: cs.color,
        background: cs.backgroundColor,
        "font-size": cs.fontSize,
        display: cs.display,
        position: cs.position,
        "z-index": cs.zIndex,
      },
      errors: [...errors],
      userAgent: navigator.userAgent,
    };
    window.parent?.postMessage({ type: "ve:inspect", payload }, "*");
  };

  const onClick = (e: MouseEvent) => {
    // In interact mode the real site keeps working (links, dropdowns, buttons)
    // so the admin can walk into sub-pages; Alt+click still grabs the element.
    if (mode === "interact" && !e.altKey) return;
    e.preventDefault();
    e.stopPropagation();
    report(e.target as HTMLElement);
  };

  /* Touch: tap reports in select mode, long-press reports in interact mode. */
  let pressTimer: number | undefined;
  let pressTarget: HTMLElement | null = null;
  const onTouchStart = (e: TouchEvent) => {
    pressTarget = e.target as HTMLElement;
    if (pressTimer) window.clearTimeout(pressTimer);
    pressTimer = window.setTimeout(() => {
      if (pressTarget) report(pressTarget);
    }, 550);
  };
  const cancelPress = () => {
    if (pressTimer) window.clearTimeout(pressTimer);
    pressTimer = undefined;
  };

  document.addEventListener("mouseover", onOver, true);
  document.addEventListener("click", onClick, true);
  document.addEventListener("touchstart", onTouchStart, true);
  document.addEventListener("touchmove", cancelPress, true);
  document.addEventListener("touchend", cancelPress, true);
  document.addEventListener("touchcancel", cancelPress, true);
  window.parent?.postMessage({ type: "ve:inspect-ready", path: window.location.pathname }, "*");

  return () => {
    console.error = origError;
    window.removeEventListener("error", onErr);
    window.removeEventListener("unhandledrejection", onRej);
    window.removeEventListener("message", onModeMsg);
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("click", onClick, true);
    cancelPress();
    document.removeEventListener("touchstart", onTouchStart, true);
    document.removeEventListener("touchmove", cancelPress, true);
    document.removeEventListener("touchend", cancelPress, true);
    document.removeEventListener("touchcancel", cancelPress, true);
    hovered?.classList.remove("ve-inspect-hit");
    document.documentElement.classList.remove("ve-inspect");
    style.remove();
  };
}


function rgbToHex(v: string) {
  const m = v.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Number(n).toString(16).padStart(2, "0"))
      .join("")
  );
}
