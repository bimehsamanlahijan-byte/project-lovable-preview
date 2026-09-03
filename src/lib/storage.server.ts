import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readPrivateSetting, writePrivateSetting } from "./dashboard-auth.server";

export const STORAGE_TARGET_KEY = "custom_supabase_storage";

export type StorageTarget = {
  url?: string;
  serviceKey?: string;
  bucket?: string;
  updatedAt?: string;
};

/** Reads the optional personal-Supabase override used for media storage. */
export async function readStorageTarget(): Promise<StorageTarget | null> {
  return readPrivateSetting<StorageTarget>(STORAGE_TARGET_KEY);
}

export async function writeStorageTarget(next: StorageTarget) {
  return writePrivateSetting(STORAGE_TARGET_KEY, {
    ...next,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Returns the Supabase client + bucket used for site media.
 * Falls back to the project's own admin client when no override is configured.
 */
export async function getStorage(): Promise<{
  client: SupabaseClient;
  bucket: string;
  custom: boolean;
  host: string;
}> {
  const target = await readStorageTarget();
  if (target?.url && target.serviceKey) {
    const client = createClient(target.url, target.serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return {
      client: client as unknown as SupabaseClient,
      bucket: target.bucket || "site-assets",
      custom: true,
      host: safeHost(target.url),
    };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return {
    client: supabaseAdmin as unknown as SupabaseClient,
    bucket: "site-assets",
    custom: false,
    host: safeHost(process.env["SUPABASE_URL"] ?? ""),
  };
}

export function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
