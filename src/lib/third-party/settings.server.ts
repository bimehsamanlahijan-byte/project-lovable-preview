/**
 * Server-only reader for third-party (شخص ثالث) settings stored in the database.
 * The access token can be saved from the dashboard instead of an env variable.
 */
import { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } from "@/lib/server-env";

export const THIRD_PARTY_SETTING_KEY = "third_party_si24";

let cache: { value: string | null; at: number } | null = null;
const TTL_MS = 30_000;

/** Reads the saved access token from site_settings (returns null when absent). */
export async function readStoredAccessToken(): Promise<string | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  await loadRuntimeEnv();
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await client
      .from("site_settings")
      .select("value")
      .eq("key", THIRD_PARTY_SETTING_KEY)
      .maybeSingle();
    const raw = (data as { value?: { token?: string } } | null)?.value?.token;
    const token = typeof raw === "string" && raw.trim() !== "" ? raw.trim() : null;
    cache = { value: token, at: Date.now() };
    return token;
  } catch (err) {
    console.error("[third-party] reading stored settings failed", err);
    return null;
  }
}

/** Clears the in-process cache (used right after the dashboard saves a value). */
export function invalidateStoredAccessToken() {
  cache = null;
}
