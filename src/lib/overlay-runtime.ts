/**
 * Overlay rendering + editing engine (framework-free so it can run on the live
 * site and inside the editor iframe alike).
 *
 * Structure per overlay:
 *
 *   #ve-overlay-root            (absolute, page coordinates, pointer-events:none)
 *   └── .ve-ov  [data-ov-id]    (absolute, own z-index, pointer-events:auto)
 *       ├── content (text / image / html / iframe / widget)
 *       └── editor handles (only in the visual editor)
 *
 * The layer sits above the original element, so the element underneath stops
 * receiving mouse / touch / pointer events while content inside the overlay
 * remains clickable. Original markup is never modified.
 */
import {
  boxForDevice,
  buildSandboxDocument,
  createOverlay,
  OVERLAY_ROOT_ID,
  overlaysForPage,
  sanitizeOverlayHtml,
  type OverlayBox,
  type OverlayDevice,
  type OverlayItem,
} from "./overlays";
import { getSelector } from "./visual-editor";

type Handlers = {
  device: OverlayDevice;
  editing: boolean;
  getList: () => OverlayItem[];
  onChange: (item: OverlayItem) => void;
  onCreate: (item: OverlayItem) => void;
  onSelect: (item: OverlayItem | null) => void;
};

export type OverlayController = {
  refresh: () => void;
  setTool: (on: boolean) => void;
  createFromSelector: (selector: string) => void;
  select: (id: string | null) => void;
  destroy: () => void;
};

const HANDLE_DIRS = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;

export function mountOverlays(h: Handlers): OverlayController {
  if (typeof document === "undefined") {
    return { refresh: () => {}, setTool: () => {}, createFromSelector: () => {}, select: () => {}, destroy: () => {} };
  }

  const root = document.createElement("div");
  root.id = OVERLAY_ROOT_ID;
  root.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:0;pointer-events:none;z-index:40;";
  document.body.appendChild(root);

  const style = document.createElement("style");
  style.textContent = `
    #${OVERLAY_ROOT_ID} .ve-ov { position:absolute; box-sizing:border-box; pointer-events:auto; display:flex; overflow:hidden; }
    #${OVERLAY_ROOT_ID} .ve-ov[data-block="0"] { pointer-events:none; }
    #${OVERLAY_ROOT_ID} .ve-ov[data-block="0"] > * { pointer-events:auto; }
    #${OVERLAY_ROOT_ID} .ve-ov iframe { width:100%; height:100%; border:0; background:transparent; }
    #${OVERLAY_ROOT_ID} .ve-ov-body { width:100%; height:100%; display:flex; flex-direction:column; gap:10px; align-items:inherit; justify-content:inherit; }
    #${OVERLAY_ROOT_ID} .ve-ov-btn { display:inline-block; padding:8px 16px; font-weight:700; text-decoration:none; cursor:pointer; border:0; }
    .ve-ov-editing #${OVERLAY_ROOT_ID} .ve-ov { outline:1px dashed rgba(37,99,235,.9); }
    .ve-ov-editing #${OVERLAY_ROOT_ID} .ve-ov[data-selected="1"] { outline:2px solid #2563eb; }
    .ve-ov-h { position:absolute; width:12px; height:12px; background:#fff; border:2px solid #2563eb; border-radius:3px; z-index:5; }
    .ve-ov-badge { position:absolute; top:-22px; inset-inline-start:0; background:#2563eb; color:#fff; font:700 10px/1.6 monospace; padding:1px 6px; border-radius:6px; white-space:nowrap; z-index:6; }
    .ve-ov-catcher { position:fixed; inset:0; z-index:2147480000; cursor:crosshair; background:rgba(37,99,235,.06); touch-action:none; -webkit-user-select:none; user-select:none; }
    .ve-ov-draft { position:fixed; border:2px dashed #2563eb; background:rgba(37,99,235,.15); z-index:2147480001; pointer-events:none; }
    .ve-ov-hint { position:fixed; display:none; border:2px solid #22c55e; background:rgba(34,197,94,.14); z-index:2147480001; pointer-events:none; }
  `;
  document.head.appendChild(style);
  if (h.editing) document.documentElement.classList.add("ve-ov-editing");

  let selectedId: string | null = null;
  const nodes = new Map<string, HTMLElement>();
  /** Signature of the last render for an overlay, to avoid rebuilding content. */
  const signatures = new Map<string, string>();

  const pageList = () => overlaysForPage(h.getList(), window.location.pathname);

  /* ---------- geometry ---------- */
  const targetBox = (selector: string): OverlayBox | null => {
    let el: Element | null = null;
    try {
      el = document.querySelector(selector);
    } catch {
      el = null;
    }
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top + window.scrollY),
      left: Math.round(r.left + window.scrollX),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  };

  const geometry = (item: OverlayItem): OverlayBox => {
    if (item.attach === "attached" && item.target) {
      const box = targetBox(item.target);
      if (box) return box;
    }
    return boxForDevice(item, h.device);
  };

  /* ---------- content ---------- */
  const renderContent = (item: OverlayItem): string => {
    const c = item.content ?? { kind: "none" };
    const textStyle = Object.entries(c.textStyle ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    const btn = c.button?.label
      ? `<a class="ve-ov-btn" data-ov-btn="1" href="${c.button.href || "#"}" style="background:${c.button.bg || "#0b1e3f"};color:${c.button.color || "#fff"};border-radius:${c.button.radius || "10px"}">${c.button.label}</a>`
      : "";

    if (c.kind === "text") {
      return `<div class="ve-ov-body"><div style="${textStyle}">${sanitizeOverlayHtml(c.text ?? "")}</div>${btn}</div>`;
    }
    if (c.kind === "image") {
      const img = `<img src="${c.image?.src ?? ""}" alt="" style="width:${c.image?.width || "100%"};height:${c.image?.height || "100%"};object-fit:${c.image?.objectFit || "cover"};border-radius:${c.image?.radius || "0"}" />`;
      const wrapped = c.image?.href ? `<a href="${c.image.href}" style="display:block;width:100%;height:100%">${img}</a>` : img;
      return `<div class="ve-ov-body">${wrapped}${btn}</div>`;
    }
    if (c.kind === "iframe") {
      const raw = c.iframeSrc ?? "";
      const src = c.iframeProxy && raw ? `/api/public/embed?url=${encodeURIComponent(raw)}` : raw;
      return `<iframe src="${escapeAttr(src)}" sandbox="allow-scripts allow-forms allow-popups allow-same-origin" referrerpolicy="no-referrer" loading="lazy"></iframe>`;
    }
    if (c.kind === "widget") {
      const doc = c.widget?.html ?? "";
      return `<iframe sandbox="allow-scripts allow-forms allow-popups" srcdoc="${escapeAttr(doc)}"></iframe>`;
    }
    if (c.kind === "html") {
      // JS needs a sandbox; plain HTML/CSS is inlined so it inherits site fonts.
      if (c.js && c.js.trim()) {
        return `<iframe sandbox="allow-scripts allow-forms allow-popups" srcdoc="${escapeAttr(buildSandboxDocument(c.html ?? "", c.css, c.js))}"></iframe>`;
      }
      const css = c.css ? `<style>${c.css}</style>` : "";
      return `<div class="ve-ov-body">${css}<div style="${textStyle}">${sanitizeOverlayHtml(c.html ?? "")}</div>${btn}</div>`;
    }
    return btn ? `<div class="ve-ov-body">${btn}</div>` : "";
  };

  const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  /* ---------- click actions ---------- */
  const runAction = (item: OverlayItem, e: Event) => {
    const target = e.target as HTMLElement | null;
    // Buttons / links inside the overlay keep their own behaviour.
    if (target?.closest("a[href], button, input, select, textarea, iframe")) return;
    const it = item.interaction ?? { block: true, action: "none" };
    if (it.action === "url" && it.url) {
      // Compatibility only affects content embedded inside the overlay. A
      // click-through must use the real destination in a top-level tab so
      // the destination's own security/anti-bot checks can run normally.
      if (it.target === "_blank") window.open(it.url, "_blank", "noopener");
      else window.location.assign(it.url);

    } else if ((it.action === "popup" || it.action === "modal") && it.popupHtml) {
      openPopup(it.popupHtml, it.action === "modal");
    } else if (it.action === "js" && it.js) {
      try {
        runSandboxedScript(it.js);
      } catch {
        /* ignore */
      }
    } else if (it.action === "toggle") {
      const node = nodes.get(item.id);
      if (node) node.style.display = node.style.display === "none" ? "flex" : "none";
    }
  };

  /* ---------- layer building ---------- */
  const build = (item: OverlayItem): HTMLElement => {
    const node = document.createElement("div");
    node.className = "ve-ov";
    node.dataset["ovId"] = item.id;
    node.addEventListener("click", (e) => {
      if (h.editing) return;
      runAction(item, e);
    });
    // Block every pointer family on the element below, even when transparent.
    for (const type of ["pointerdown", "mousedown", "touchstart", "wheel"]) {
      node.addEventListener(type, (e) => {
        const it = item.interaction ?? { block: true };
        if (!h.editing && it.block) e.stopPropagation();
      });
    }
    root.appendChild(node);
    return node;
  };

  const paint = (item: OverlayItem, node: HTMLElement) => {
    const box = geometry(item);
    const s = item.style ?? {};
    const it = item.interaction ?? { block: true, action: "none" };
    const transparent = item.mode === "transparent";
    node.dataset["block"] = it.block ? "1" : "0";
    node.dataset["selected"] = selectedId === item.id ? "1" : "0";
    node.style.top = `${box.top}px`;
    node.style.left = `${box.left}px`;
    node.style.width = `${box.width}px`;
    node.style.height = `${box.height}px`;
    node.style.zIndex = String(item.zIndex ?? 60);
    node.style.background = transparent ? "transparent" : (s.background ?? "transparent");
    node.style.opacity = String(s.opacity ?? 1);
    node.style.border = s.border ?? "";
    node.style.borderRadius = s.radius ?? "";
    node.style.boxShadow = s.shadow ?? "";
    node.style.padding = s.padding ?? "";
    node.style.alignItems = s.align ?? "center";
    node.style.justifyContent = s.justify ?? "center";
    node.style.backdropFilter = s.backdrop ?? "";
    node.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";
    node.style.display = item.visible === false ? "none" : "flex";
    node.style.cursor = h.editing ? (item.locked ? "not-allowed" : "move") : it.action !== "none" ? "pointer" : "";

    const contentHtml = item.mode === "cover" ? "" : renderContent(item);
    const sig = JSON.stringify([contentHtml, h.editing, selectedId === item.id, item.locked]);
    if (signatures.get(item.id) !== sig) {
      signatures.set(item.id, sig);
      node.innerHTML = contentHtml;
      if (h.editing) addEditorChrome(item, node);
    }
  };

  const addEditorChrome = (item: OverlayItem, node: HTMLElement) => {
    const badge = document.createElement("div");
    badge.className = "ve-ov-badge";
    badge.dataset["ovBadge"] = "1";
    badge.textContent = `${item.label || "Overlay"} — ${Math.round(geometry(item).width)}×${Math.round(geometry(item).height)}`;
    node.appendChild(badge);
    if (selectedId !== item.id || item.locked) return;
    for (const dir of HANDLE_DIRS) {
      const hd = document.createElement("div");
      hd.className = "ve-ov-h";
      hd.dataset["ovDir"] = dir;
      Object.assign(hd.style, handlePosition(dir));
      node.appendChild(hd);
    }
  };

  const handlePosition = (dir: string): Partial<CSSStyleDeclaration> => {
    const mid = "calc(50% - 6px)";
    const map: Record<string, Partial<CSSStyleDeclaration>> = {
      nw: { top: "-6px", left: "-6px", cursor: "nwse-resize" },
      n: { top: "-6px", left: mid, cursor: "ns-resize" },
      ne: { top: "-6px", right: "-6px", cursor: "nesw-resize" },
      e: { top: mid, right: "-6px", cursor: "ew-resize" },
      se: { bottom: "-6px", right: "-6px", cursor: "nwse-resize" },
      s: { bottom: "-6px", left: mid, cursor: "ns-resize" },
      sw: { bottom: "-6px", left: "-6px", cursor: "nesw-resize" },
      w: { top: mid, left: "-6px", cursor: "ew-resize" },
    };
    return map[dir] ?? {};
  };

  /* ---------- render loop ---------- */
  const refresh = () => {
    const list = pageList();
    const ids = new Set(list.map((o) => o.id));
    for (const [id, node] of nodes) {
      if (!ids.has(id)) {
        node.remove();
        nodes.delete(id);
        signatures.delete(id);
      }
    }
    root.style.height = `${document.documentElement.scrollHeight}px`;
    for (const item of list) {
      let node = nodes.get(item.id);
      if (!node) {
        node = build(item);
        nodes.set(item.id, node);
      }
      paint(item, node);
    }
  };

  refresh();
  let raf = 0;
  const tick = () => {
    refresh();
    raf = window.setTimeout(tick, h.editing ? 250 : 500);
  };
  raf = window.setTimeout(tick, 300);
  const onResize = () => refresh();
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onResize, true);

  /* ---------- editing: create / move / resize ---------- */
  let catcher: HTMLElement | null = null;
  let draft: HTMLElement | null = null;
  let hint: HTMLElement | null = null;

  /** Element under a viewport point, ignoring the tool's own helper layers. */
  const pickElement = (x: number, y: number): Element | null => {
    const hidden: HTMLElement[] = [];
    for (const el of [catcher, draft, root]) {
      if (el) {
        hidden.push(el);
        el.style.visibility = "hidden";
      }
    }
    const el = document.elementFromPoint(x, y);
    for (const el2 of hidden) el2.style.visibility = "";
    if (!el || el === document.documentElement || el === document.body) return null;
    return el;
  };

  const setTool = (on: boolean) => {
    if (!h.editing) return;
    if (!on) {
      catcher?.remove();
      catcher = null;
      draft?.remove();
      draft = null;
      hint?.remove();
      hint = null;
      return;
    }
    if (catcher) return;
    catcher = document.createElement("div");
    catcher.className = "ve-ov-catcher";
    catcher.style.touchAction = "none";
    document.body.appendChild(catcher);
    hint = document.createElement("div");
    hint.className = "ve-ov-hint";
    document.body.appendChild(hint);

    let start: { x: number; y: number } | null = null;
    let moved = false;

    const showHint = (x: number, y: number) => {
      const el = pickElement(x, y);
      if (!hint) return;
      if (!el) {
        hint.style.display = "none";
        return;
      }
      const r = el.getBoundingClientRect();
      Object.assign(hint.style, {
        display: "block",
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      });
    };

    const finish = (item: OverlayItem) => {
      selectedId = item.id;
      h.onCreate(item);
      h.onSelect(item);
      setTool(false);
      refresh();
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        catcher?.setPointerCapture(e.pointerId);
      } catch {
        /* not capturable */
      }
      start = { x: e.clientX, y: e.clientY };
      moved = false;
      draft?.remove();
      draft = document.createElement("div");
      draft.className = "ve-ov-draft";
      Object.assign(draft.style, { left: `${e.clientX}px`, top: `${e.clientY}px`, width: "0px", height: "0px" });
      document.body.appendChild(draft);
    };

    const onMove = (e: PointerEvent) => {
      if (!start) {
        showHint(e.clientX, e.clientY);
        return;
      }
      e.preventDefault();
      const w = Math.abs(e.clientX - start.x);
      const hh = Math.abs(e.clientY - start.y);
      if (w > 6 || hh > 6) moved = true;
      if (draft) {
        Object.assign(draft.style, {
          left: `${Math.min(start.x, e.clientX)}px`,
          top: `${Math.min(start.y, e.clientY)}px`,
          width: `${w}px`,
          height: `${hh}px`,
        });
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!start) return;
      const s = start;
      start = null;
      draft?.remove();
      draft = null;
      if (hint) hint.style.display = "none";
      try {
        catcher?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      // A tap / simple click attaches the layer to the element under the point.
      if (!moved) {
        const el = pickElement(e.clientX, e.clientY);
        if (el) {
          const selector = getSelector(el);
          const box = targetBox(selector);
          if (box) {
            finish(createOverlay(window.location.pathname, box, selector));
            return;
          }
        }
      }
      const box: OverlayBox = {
        left: Math.round(Math.min(s.x, e.clientX) + window.scrollX),
        top: Math.round(Math.min(s.y, e.clientY) + window.scrollY),
        width: Math.max(60, Math.round(Math.abs(e.clientX - s.x))),
        height: Math.max(40, Math.round(Math.abs(e.clientY - s.y))),
      };
      finish(createOverlay(window.location.pathname, box));
    };

    const onCancel = () => {
      start = null;
      draft?.remove();
      draft = null;
    };

    catcher.addEventListener("pointerdown", onDown, { passive: false });
    catcher.addEventListener("pointermove", onMove, { passive: false });
    catcher.addEventListener("pointerup", onUp);
    catcher.addEventListener("pointercancel", onCancel);
    catcher.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    catcher.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  };

  const createFromSelector = (selector: string) => {
    const box = targetBox(selector) ?? { top: 80, left: 40, width: 320, height: 200 };
    const item = createOverlay(window.location.pathname, box, selector);
    selectedId = item.id;
    h.onCreate(item);
    h.onSelect(item);
    refresh();
  };

  let dragState:
    | { id: string; dir: string | null; startX: number; startY: number; box: OverlayBox }
    | null = null;

  const onPointerDown = (e: PointerEvent) => {
    if (!h.editing) return;
    const target = e.target as HTMLElement;
    const layer = target.closest(".ve-ov") as HTMLElement | null;
    if (!layer) return;
    const id = layer.dataset["ovId"];
    if (!id) return;
    const item = pageList().find((o) => o.id === id);
    if (!item) return;
    if (selectedId !== id) {
      selectedId = id;
      signatures.clear();
      h.onSelect(item);
      refresh();
    }
    if (item.locked) return;
    const dir = target.dataset["ovDir"] ?? null;
    dragState = { id, dir, startX: e.clientX, startY: e.clientY, box: { ...geometry(item) } };
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragState) return;
    const item = pageList().find((o) => o.id === dragState!.id);
    if (!item) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const b = { ...dragState.box };
    const dir = dragState.dir;
    if (!dir) {
      b.left += dx;
      b.top += dy;
    } else {
      if (dir.includes("w")) {
        b.left += dx;
        b.width -= dx;
      }
      if (dir.includes("e")) b.width += dx;
      if (dir.includes("n")) {
        b.top += dy;
        b.height -= dy;
      }
      if (dir.includes("s")) b.height += dy;
    }
    b.width = Math.max(24, Math.round(b.width));
    b.height = Math.max(24, Math.round(b.height));
    b.top = Math.round(b.top);
    b.left = Math.round(b.left);
    const next: OverlayItem = { ...item, attach: "fixed", box: applyDeviceBox(item, b, h.device) ? item.box : b };
    // Per-breakpoint editing writes into the responsive patch instead.
    if (!item.responsive?.sameForAll && h.device !== "desktop") {
      next.box = item.box;
      next.responsive = { ...item.responsive, [h.device]: b } as OverlayItem["responsive"];
    } else {
      next.box = b;
    }
    h.onChange(next);
    const node = nodes.get(item.id);
    if (node) {
      paint(next, node);
      const badge = node.querySelector('[data-ov-badge="1"]');
      if (badge) badge.textContent = `${next.label || "Overlay"} — ${b.width}×${b.height} @ ${b.left},${b.top}`;
    }
  };

  const applyDeviceBox = (item: OverlayItem, _b: OverlayBox, device: OverlayDevice) =>
    !item.responsive?.sameForAll && device !== "desktop";

  const onPointerUp = () => {
    dragState = null;
  };

  if (h.editing) {
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerup", onPointerUp, true);
  }

  return {
    refresh: () => {
      signatures.clear();
      refresh();
    },
    setTool,
    createFromSelector,
    select: (id) => {
      selectedId = id;
      signatures.clear();
      refresh();
    },
    destroy: () => {
      window.clearTimeout(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      catcher?.remove();
      draft?.remove();
      root.remove();
      style.remove();
      document.documentElement.classList.remove("ve-ov-editing");
    },
  };
}

/** Simple popup / modal used by overlay click actions. */
function openPopup(html: string, modal: boolean) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;${modal ? "background:rgba(0,0,0,.55)" : ""}`;
  const box = document.createElement("div");
  box.style.cssText =
    "background:#fff;border-radius:16px;padding:20px;max-width:min(90vw,560px);max-height:85vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)";
  box.innerHTML = sanitizeOverlayHtml(html);
  const close = document.createElement("button");
  close.textContent = "بستن";
  close.style.cssText =
    "margin-top:14px;padding:8px 18px;border:0;border-radius:10px;background:#0b1e3f;color:#fff;font-weight:700;cursor:pointer";
  close.onclick = () => wrap.remove();
  box.appendChild(close);
  wrap.appendChild(box);
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) wrap.remove();
  });
  document.body.appendChild(wrap);
}

/** Runs author JavaScript inside a throwaway sandboxed iframe. */
function runSandboxedScript(js: string) {
  const frame = document.createElement("iframe");
  frame.sandbox.add("allow-scripts");
  frame.style.display = "none";
  frame.srcdoc = `<script>try{${js}}catch(e){}<\/script>`;
  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 3000);
}
