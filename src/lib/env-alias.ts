// The personal Supabase credentials are stored as APP_DB_* secrets because the
// SUPABASE_*/VITE_SUPABASE_* names are reserved by the platform. On the deployed
// Worker, env is injected per request, so map the aliases at request time too.
const ALIASES: Record<string, string> = {
  SUPABASE_URL: "APP_DB_URL",
  VITE_SUPABASE_URL: "APP_DB_URL",
  SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  VITE_SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  SUPABASE_SERVICE_ROLE_KEY: "APP_DB_SERVICE_ROLE_KEY",
  SUPABASE_ANON_KEY: "APP_DB_PUBLISHABLE_KEY",
};

export function applyEnvAliases(env?: unknown): void {
  const source = (env && typeof env === "object" ? (env as Record<string, string>) : {}) as Record<
    string,
    string | undefined
  >;
  const target = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (!target) return;

  for (const [alias, original] of Object.entries(ALIASES)) {
    const value = target[original] ?? source[original] ?? source[alias];
    if (value && !target[alias]) target[alias] = value;
  }
}
