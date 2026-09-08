// Runtime public configuration bridge.
//
// On Cloudflare the Supabase URL/publishable key are Worker runtime variables,
// so they are NOT baked into the browser bundle at build time. The server
// renders them into an inline <script> in <head>; the browser reads them from
// window.__PUBLIC_ENV__ before any app code runs.

export type PublicEnv = {
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

declare global {
  interface Window {
    __PUBLIC_ENV__?: PublicEnv;
  }
}

export function readPublicEnv(): PublicEnv {
  if (typeof window !== "undefined" && window.__PUBLIC_ENV__) {
    return window.__PUBLIC_ENV__;
  }
  // Dynamic lookup on purpose: a static `process.env.X` would be replaced at
  // build time and inlined as undefined into the client bundle.
  const env = ((globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process?.env ?? {}) as Record<string, string | undefined>;
  return {
    SUPABASE_URL: env["SUPABASE_URL"] || env["VITE_SUPABASE_URL"],
    SUPABASE_PUBLISHABLE_KEY:
      env["SUPABASE_PUBLISHABLE_KEY"] || env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  };
}

export function publicEnvScript(): string {
  const json = JSON.stringify(readPublicEnv() ?? {}).replace(/</g, "\\u003c");
  return `window.__PUBLIC_ENV__=${json};`;
}
