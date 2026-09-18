/**
 * Applies a new order for the header's main (root) menu items.
 *
 * The visual editor reports the labels of the top-level items in their new
 * order; here they are matched against the stored rows and only `position`
 * is rewritten (never an INSERT, never a label change).
 */
import { adminDb } from "@/lib/admin-db";

type Row = {
  id: string;
  label: string;
  parent_id: string | null;
  position: number;
  device: "desktop" | "mobile" | "tablet" | "both";
};

export type ApplyMenuOrderResult =
  | { ok: true; updated: number }
  | { ok: false; error: string };

export async function applyRootMenuOrder(
  order: string[],
  device: "desktop" | "mobile" | "tablet",
): Promise<ApplyMenuOrderResult> {
  const { data, error } = await adminDb("site_menu_items")
    .select("*")
    .order("position", { ascending: true });
  if (error) return { ok: false, error: error.message };

  const rows = ((data as Row[]) || []).filter((r) => !r.parent_id);
  if (rows.length === 0) {
    return {
      ok: false,
      error: "منوی سایت هنوز در پایگاه داده ذخیره نشده است؛ ابتدا «همگام‌سازی با منوی سایت» را بزنید.",
    };
  }

  const visible = rows.filter((r) => r.device === "both" || r.device === device);
  const byLabel = new Map<string, Row>();
  for (const r of visible) if (!byLabel.has(r.label.trim())) byLabel.set(r.label.trim(), r);

  const ordered: Row[] = [];
  for (const label of order) {
    const row = byLabel.get(label.trim());
    if (row && !ordered.includes(row)) ordered.push(row);
  }
  // Anything the header did not report keeps its relative order at the end.
  for (const r of visible) if (!ordered.includes(r)) ordered.push(r);

  let updated = 0;
  for (let i = 0; i < ordered.length; i++) {
    const row = ordered[i]!;
    if (row.position === i) continue;
    const { error: upErr } = await adminDb("site_menu_items")
      .update({ position: i } as any)
      .eq("id", row.id);
    if (upErr) return { ok: false, error: upErr.message };
    updated++;
  }
  return { ok: true, updated };
}
