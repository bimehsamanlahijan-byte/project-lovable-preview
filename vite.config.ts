// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Mirror .env into process.env so server-side code (dashboard writes, SSR)
// can read SUPABASE_* during local dev. On Cloudflare these come from the
// Worker bindings instead.
const fileEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
for (const [key, value] of Object.entries(fileEnv)) {
  if (process.env[key] === undefined || process.env[key] === "") process.env[key] = value;
}

// The personal Supabase credentials are stored as APP_DB_* secrets (SUPABASE_*/VITE_*
// names are reserved by the platform). Map them onto the names the app expects.
const credentialAliases: Record<string, string> = {
  SUPABASE_URL: "APP_DB_URL",
  VITE_SUPABASE_URL: "APP_DB_URL",
  SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  VITE_SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  SUPABASE_SERVICE_ROLE_KEY: "APP_DB_SERVICE_ROLE_KEY",
};
for (const [target, source] of Object.entries(credentialAliases)) {
  const value = process.env[source];
  if (value && !process.env[target]) process.env[target] = value;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
