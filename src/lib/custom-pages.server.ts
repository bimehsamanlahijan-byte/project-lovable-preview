import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { CUSTOM_PAGES_KEY, type CustomPagesMap, type CustomPage } from "./custom-pages";

/**
 * Server-only reads of custom pages. Custom pages are public data (the
 * `site_settings` row has an anon SELECT policy), so we read them with the
 * service-role admin client for SSR — no auth required to read.
 */
export async function readCustomPages(): Promise<CustomPagesMap> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", CUSTOM_PAGES_KEY)
      .maybeSingle();
    if (error || !data?.value) return {};
    const value = data.value as CustomPagesMap | { pages?: CustomPagesMap };
    // Tolerate either a bare map or { pages: map }.
    if (value && typeof value === "object" && "pages" in value && (value as any).pages) {
      return (value as { pages: CustomPagesMap }).pages;
    }
    return (value as CustomPagesMap) ?? {};
  } catch {
    return {};
  }
}

export async function readCustomPage(slug: string): Promise<CustomPage | null> {
  const pages = await readCustomPages();
  return pages[slug] ?? null;
}
