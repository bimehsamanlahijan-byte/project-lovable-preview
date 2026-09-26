/**
 * AI provider keys stored in the PRIVATE settings table (service-role only).
 * Visitors can never read them; the dashboard only receives masked values.
 * Stored under admin_private_settings key "ai_provider_keys".
 */
import { readPrivateSetting, writePrivateSetting } from "./dashboard-auth.server";

export const AI_KEYS_SETTING = "ai_provider_keys";
export const GOOGLE_SA_SETTING = "google_service_account";

export type StoredKey = { key: string; extra?: string; updatedAt?: string };
export type StoredKeys = Record<string, StoredKey>;

let cache: { at: number; data: StoredKeys } | null = null;

export async function readAllKeys(fresh = false): Promise<StoredKeys> {
  if (!fresh && cache && Date.now() - cache.at < 30_000) return cache.data;
  const data = (await readPrivateSetting<StoredKeys>(AI_KEYS_SETTING)) ?? {};
  cache = { at: Date.now(), data };
  return data;
}

export async function dbProviderKey(providerId: string): Promise<StoredKey | null> {
  try {
    const all = await readAllKeys();
    const k = all[providerId];
    return k?.key ? k : null;
  } catch {
    return null;
  }
}

export async function saveProviderKey(providerId: string, key: string, extra?: string) {
  const all = await readAllKeys(true);
  all[providerId] = { key: key.trim(), extra: extra?.trim() || undefined, updatedAt: new Date().toISOString() };
  cache = null;
  return writePrivateSetting(AI_KEYS_SETTING, all);
}

export async function deleteProviderKey(providerId: string) {
  const all = await readAllKeys(true);
  delete all[providerId];
  cache = null;
  return writePrivateSetting(AI_KEYS_SETTING, all);
}

export function mask(v: string | undefined): string {
  if (!v) return "";
  if (v.length <= 8) return "••••";
  return `${v.slice(0, 4)}••••${v.slice(-4)}`;
}
