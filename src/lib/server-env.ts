/**
 * Runtime environment reader that works on both Node (dev) and Cloudflare Workers.
 *
 * On Cloudflare, variables and secrets are bindings on the Worker `env` object.
 * Depending on the compatibility flags and the deploy method they are not always
 * mirrored into `process.env`, which silently broke every dashboard write
 * (the admin database client needs the service key at request time).
 *
 * This helper looks the value up in every place it can legitimately live and
 * accepts the common alternative names used by Supabase/Cloudflare setups.
 */

type EnvBag = Record<string, unknown> | undefined;

let cloudflareEnv: EnvBag;
let cloudflareEnvLoaded = false;

/** Loads the Worker binding object once (no-op outside Cloudflare). */
export async function loadRuntimeEnv(): Promise<void> {
  if (cloudflareEnvLoaded) return;
  cloudflareEnvLoaded = true;
  try {
    // Built with a computed specifier so bundlers don't try to resolve
    // "cloudflare:workers" when the build target isn't a Worker.
    const specifier = "cloudflare" + ":workers";
    const mod = (await import(/* @vite-ignore */ specifier)) as { env?: Record<string, unknown> };
    cloudflareEnv = mod?.env;
  } catch {
    cloudflareEnv = undefined;
  }
}

function bags(): EnvBag[] {
  const g = globalThis as Record<string, any>;
  return [
    typeof process !== "undefined" ? (process.env as unknown as EnvBag) : undefined,
    cloudflareEnv,
    g.__env__ as EnvBag,
    g.env as EnvBag,
  ];
}

/** First non-empty value among the given names, across all runtime sources. */
export function envValue(...names: string[]): string | undefined {
  for (const bag of bags()) {
    if (!bag) continue;
    for (const name of names) {
      const raw = bag[name];
      if (typeof raw === "string" && raw.trim() !== "") return raw.trim();
    }
  }
  return undefined;
}

/** Same as envValue but makes sure the Worker bindings were loaded first. */
export async function envValueAsync(...names: string[]): Promise<string | undefined> {
  const direct = envValue(...names);
  if (direct) return direct;
  await loadRuntimeEnv();
  return envValue(...names);
}

export const SUPABASE_URL_NAMES = ["SUPABASE_URL", "VITE_SUPABASE_URL"];

export const SUPABASE_PUBLISHABLE_NAMES = [
  "SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
];

/** Every name a Supabase service/secret key is commonly stored under. */
export const SUPABASE_SERVICE_KEY_NAMES = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE",
  "SERVICE_ROLE_KEY",
];

export const SESSION_SECRET_NAMES = ["SESSION_SECRET", "DASHBOARD_SESSION_SECRET"];

export function getSupabaseUrl() {
  return envValue(...SUPABASE_URL_NAMES);
}

export function getSupabasePublishableKey() {
  return envValue(...SUPABASE_PUBLISHABLE_NAMES);
}

export function getSupabaseServiceKey() {
  return envValue(...SUPABASE_SERVICE_KEY_NAMES);
}

export function getSessionSecret() {
  return envValue(...SESSION_SECRET_NAMES);
}
