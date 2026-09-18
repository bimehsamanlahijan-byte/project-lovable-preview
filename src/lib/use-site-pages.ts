import { useMemo } from "react";
import { useRouter } from "@tanstack/react-router";

import { EDITOR_PAGES, type EditorPage } from "@/lib/editor-pages";

/** Route ids that must never show up as an editable site page. */
function isEditableRouteId(id: string): boolean {
  if (!id.startsWith("/")) return false;
  if (id.includes("$")) return false; // dynamic / splat routes
  if (id.includes("_")) return false; // layout / pathless routes
  if (id.startsWith("/api")) return false;
  if (id === "/dashboard") return false;
  if (/\.(txt|xml)$/i.test(id)) return false;
  return true;
}

/**
 * Every page of the site that the visual editor can open.
 *
 * Built from the router itself, so any page added later (a brand-new route
 * file) automatically gets its «ویرایش بصری» button — no manual list to keep
 * in sync. The curated labels in EDITOR_PAGES win when both know a path.
 */
export function useSitePages(): EditorPage[] {
  const router = useRouter();
  return useMemo(() => {
    const list: EditorPage[] = [];
    const push = (p: EditorPage) => {
      if (!p.path) return;
      if (list.some((x) => x.path === p.path)) return;
      list.push(p);
    };
    for (const p of EDITOR_PAGES) push(p);

    const byId = (router as unknown as { routesById?: Record<string, unknown> }).routesById ?? {};
    for (const id of Object.keys(byId)) {
      if (!isEditableRouteId(id)) continue;
      const path = id === "/" ? "/" : id.replace(/\/$/, "");
      push({ path, label: path });
    }
    return list;
  }, [router]);
}
