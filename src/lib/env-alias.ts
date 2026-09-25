// Personal Supabase credentials can use any of the supported external/app
// prefixes because the platform reserves the standard SUPABASE_* names.
const ALIASES: Record<string, string[]> = {
  SUPABASE_URL: ["EXTERNAL_SUPABASE_URL", "APP_SUPABASE_URL", "APP_DB_URL"],
  VITE_SUPABASE_URL: ["EXTERNAL_SUPABASE_URL", "APP_SUPABASE_URL", "APP_DB_URL"],
  SUPABASE_PUBLISHABLE_KEY: [
    "EXTERNAL_SUPABASE_PUBLISHABLE_KEY",
    "APP_SUPABASE_PUBLISHABLE_KEY",
    "APP_DB_PUBLISHABLE_KEY",
  ],
  VITE_SUPABASE_PUBLISHABLE_KEY: [
    "EXTERNAL_SUPABASE_PUBLISHABLE_KEY",
    "APP_SUPABASE_PUBLISHABLE_KEY",
    "APP_DB_PUBLISHABLE_KEY",
  ],
  SUPABASE_SERVICE_ROLE_KEY: [
    "EXTERNAL_SUPABASE_SERVICE_ROLE_KEY",
    "APP_SUPABASE_SERVICE_ROLE_KEY",
    "APP_DB_SERVICE_ROLE_KEY",
  ],
  SUPABASE_ANON_KEY: [
    "EXTERNAL_SUPABASE_PUBLISHABLE_KEY",
    "APP_SUPABASE_PUBLISHABLE_KEY",
    "APP_DB_PUBLISHABLE_KEY",
  ],
};

export function applyEnvAliases(env?: unknown): void {
  const source = (env && typeof env === "object" ? (env as Record<string, string>) : {}) as Record<
    string,
    string | undefined
  >;
  const target = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (!target) return;

  for (const [alias, originals] of Object.entries(ALIASES)) {
    const value = originals
      .flatMap((original) => [target[original], source[original]])
      .find((candidate) => Boolean(candidate)) ?? source[alias];
    if (value && !target[alias]) target[alias] = value;
  }
}
