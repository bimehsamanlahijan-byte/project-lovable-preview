/**
 * Drag-to-reorder for the header's main menu inside the visual editor.
 *
 * Works with both mouse and touch (pointer events). It only rearranges the DOM
 * for live feedback; the new order is reported to the dashboard, which asks the
 * user for confirmation before writing it to the database.
 */

export type MenuOrderPayload = {
  order: string[];
  moved: string;
  index: number;
  before: string | null;
};

export type MenuSorter = {
  setOn(on: boolean): void;
  destroy(): void;
};

const ITEM_SELECTOR = "[data-ve-nav-item]";

function labelOf(el: HTMLElement) {
  return el.getAttribute("data-ve-nav-item") ?? "";
}

export function createMenuSorter(onOrder: (p: MenuOrderPayload) => void): MenuSorter {
  const style = document.createElement("style");
  style.textContent = `
    .ve-ms-on ${ITEM_SELECTOR} {
      cursor: grab !important;
      touch-action: none;
      outline: 1px dashed rgba(22,163,74,.7);
      outline-offset: 2px;
      border-radius: 8px;
    }
    .ve-ms-on ${ITEM_SELECTOR} a, .ve-ms-on ${ITEM_SELECTOR} button { pointer-events: none !important; }
    .ve-ms-drag { opacity: .45 !important; background: rgba(22,163,74,.12); }
    .ve-ms-target { outline: 2px solid #16a34a !important; }
  `;
  document.head.appendChild(style);

  let on = false;
  let dragging: HTMLElement | null = null;
  let startOrder: string[] = [];

  const items = () => Array.from(document.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
  const orderNow = () => items().map(labelOf).filter(Boolean);

  const clearTargets = () => {
    for (const el of items()) el.classList.remove("ve-ms-target");
  };

  const onDown = (e: PointerEvent) => {
    if (!on) return;
    const el = (e.target as HTMLElement | null)?.closest?.(ITEM_SELECTOR) as HTMLElement | null;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    dragging = el;
    startOrder = orderNow();
    el.classList.add("ve-ms-drag");
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* capture is best-effort */
    }
  };

  const onMove = (e: PointerEvent) => {
    if (!on || !dragging) return;
    e.preventDefault();
    dragging.style.pointerEvents = "none";
    const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    dragging.style.pointerEvents = "";
    const target = under?.closest?.(ITEM_SELECTOR) as HTMLElement | null;
    clearTargets();
    if (!target || target === dragging || target.parentElement !== dragging.parentElement) return;
    target.classList.add("ve-ms-target");
    const rect = target.getBoundingClientRect();
    const beforeTarget = e.clientX > rect.left + rect.width / 2; // RTL row
    target.parentElement?.insertBefore(dragging, beforeTarget ? target : target.nextSibling);
  };

  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const moved = labelOf(dragging);
    dragging.classList.remove("ve-ms-drag");
    dragging = null;
    clearTargets();
    const order = orderNow();
    if (order.join("|") === startOrder.join("|")) return;
    const index = order.indexOf(moved);
    onOrder({ order, moved, index, before: order[index + 1] ?? null });
  };

  const attach = () => {
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
  };
  const detach = () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("pointermove", onMove, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("pointercancel", onUp, true);
  };

  return {
    setOn(next: boolean) {
      on = next;
      document.documentElement.classList.toggle("ve-ms-on", next);
      if (next) attach();
      else {
        detach();
        clearTargets();
        if (dragging) dragging.classList.remove("ve-ms-drag");
        dragging = null;
      }
    },
    destroy() {
      detach();
      document.documentElement.classList.remove("ve-ms-on");
      style.remove();
    },
  };
}
