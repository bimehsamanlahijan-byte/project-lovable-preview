// Nitro's cloudflare-module preset emits dist/server/index.mjs + dist/client
// but no wrangler config, so we generate one here at the dist root.
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const serverEntry = path.join(distDir, "server/index.mjs");
const clientDir = path.join(distDir, "client");

if (!fs.existsSync(serverEntry)) {
  console.error(`Missing build output: ${serverEntry}. Run \`bun run build\` first.`);
  process.exit(1);
}
if (!fs.existsSync(clientDir)) {
  console.error(`Missing build output: ${clientDir}. Run \`bun run build\` first.`);
  process.exit(1);
}

const name = process.env.WORKER_NAME;
if (!name) {
  console.error(
    "WORKER_NAME is required so the deploy targets the existing Cloudflare Worker " +
      "(deploying under a different name would create a new Worker without your secrets). " +
      "Set the CLOUDFLARE_WORKER_NAME GitHub Actions secret to the exact Worker name.",
  );
  process.exit(1);
}

const configPath = path.join(distDir, "wrangler.json");
const existing = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, "utf8"))
  : {};

const config = {
  ...existing,
  name,
  main: "server/index.mjs",
  compatibility_date: existing.compatibility_date ?? "2025-09-01",
  compatibility_flags: [...new Set([...(existing.compatibility_flags ?? []), "nodejs_compat"])],
  assets: { ...(existing.assets ?? {}), binding: "ASSETS", directory: "./client" },
  // Never declare vars/secrets here: Cloudflare-side variables must stay untouched.
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`Wrote ${configPath}`);
console.log(JSON.stringify(config, null, 2));
