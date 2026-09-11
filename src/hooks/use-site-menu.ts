import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { navItems, type NavItem } from "@/components/site-data";

type Row = {
  id: string;
  parent_id: string | null;
  label: string;
  href: string | null;
  position: number;
  device: "desktop" | "mobile" | "tablet" | "both";
  is_active: boolean;
};

function buildTree(rows: Row[], device: "desktop" | "mobile" | "tablet"): NavItem[] {
  const usable = rows.filter((r) => r.is_active && (r.device === "both" || r.device === device));
  const byParent = new Map<string | null, Row[]>();
  // Dedupe exact duplicates (same parent + label + href) so a row saved twice
  // by an older buggy version never renders twice in the header.
  const seenKeys = new Set<string>();
  for (const r of usable) {
    const key = `${r.parent_id ?? ""}|${r.label}|${r.href ?? ""}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    const list = byParent.get(r.parent_id) ?? [];
    list.push(r);
    byParent.set(r.parent_id, list);
  }
  const walk = (parent: string | null): NavItem[] =>
    (byParent.get(parent) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((r) => {
        const children = walk(r.id);
        return {
          label: r.label,
          ...(r.href ? { href: r.href } : {}),
          ...(children.length ? { children } : {}),
        } as NavItem;
      });
  return walk(null);
}

/**
 * Live navigation. Falls back to the built-in structure whenever the
 * dashboard has not defined any menu item yet, so the site is never empty.
 */
export function useSiteMenu(device: "desktop" | "mobile" | "tablet" = "desktop"): NavItem[] {
  const [items, setItems] = useState<NavItem[]>(navItems);

  useEffect(() => {
    let alive = true;
    void supabase
      .from("site_menu_items")
      .select("id, parent_id, label, href, position, device, is_active")
      .then(({ data, error }) => {
        if (!alive || error || !data?.length) return;
        const tree = buildTree(data as Row[], device);
        if (tree.length) setItems(tree);
      });
    return () => {
      alive = false;
    };
  }, [device]);

  return items;
}

/** Current viewport bucket: mobile < 768px, tablet 768–1023px, desktop >= 1024px. */
export function useDeviceKind(): "desktop" | "tablet" | "mobile" {
  const read = (): "desktop" | "tablet" | "mobile" => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  };
  const [kind, setKind] = useState<"desktop" | "tablet" | "mobile">(read);
  useEffect(() => {
    const onResize = () => setKind(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return kind;
}
