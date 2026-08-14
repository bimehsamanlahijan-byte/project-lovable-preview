import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { navItems, type NavItem } from "@/components/site-data";

type Row = {
  id: string;
  parent_id: string | null;
  label: string;
  href: string | null;
  position: number;
  device: "desktop" | "mobile" | "both";
  is_active: boolean;
};

function buildTree(rows: Row[], device: "desktop" | "mobile"): NavItem[] {
  const usable = rows.filter((r) => r.is_active && (r.device === "both" || r.device === device));
  const byParent = new Map<string | null, Row[]>();
  for (const r of usable) {
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
export function useSiteMenu(device: "desktop" | "mobile" = "desktop"): NavItem[] {
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
