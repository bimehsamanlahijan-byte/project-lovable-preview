import { DEFAULT_SEO, SEO_SETTING_KEY, type SeoConfig } from "./seo-config";

/** Reads the dashboard-managed SEO settings with the public (anon) key. */
export async function readSeoConfig(): Promise<SeoConfig> {
  try {
    const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return DEFAULT_SEO;
    const res = await fetch(
      `${url}/rest/v1/site_settings?select=value&key=eq.${SEO_SETTING_KEY}&limit=1`,
      { headers: { apikey: key, Accept: "application/json" } },
    );
    if (!res.ok) return DEFAULT_SEO;
    const rows = (await res.json()) as Array<{ value?: Partial<SeoConfig> }>;
    const value = rows?.[0]?.value;
    if (!value) return DEFAULT_SEO;
    return { ...DEFAULT_SEO, ...value, pages: value.pages?.length ? value.pages : DEFAULT_SEO.pages };
  } catch {
    return DEFAULT_SEO;
  }
}

export function originFromRequest(request: Request) {
  try {
    const u = new URL(request.url);
    const proto = request.headers.get("x-forwarded-proto") ?? u.protocol.replace(":", "");
    const host = request.headers.get("host") ?? u.host;
    return `${proto}://${host}`;
  } catch {
    return "";
  }
}
