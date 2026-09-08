// Generates the wrangler config next to the real build output.
// The output directory/entry name comes from the Nitro build manifest (nitro.json),
// which can be dist/ locally and .output/ elsewhere — never assume a fixed path.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function findManifests(dir, depth = 0, found = []) {
  if (depth > 3) return found;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const e of entries) {
    if (e.isFile() && e.name === "nitro.json") found.push(dir);
    else if (
      e.isDirectory() &&
      e.name !== "node_modules" &&
      e.name !== "src" &&
      !e.name.startsWith(".git")
    ) {
      findManifests(path.join(dir, e.name), depth + 1, found);
    }
  }
  return found;
}

const serverCandidates = ["server/index.mjs", "server/index.js", "index.mjs", "_worker.js"];
const assetCandidates = ["public", "client", "static", "assets"];

function inspect(outDir) {
  const main = serverCandidates.find((p) => fs.existsSync(path.join(outDir, p)));
  const assets = assetCandidates.find((p) => {
    const full = path.join(outDir, p);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });
  return main && assets ? { outDir, main, assets } : null;
}

const roots = [...findManifests(root), path.join(root, "dist"), path.join(root, ".output")];
let resolved = null;
for (const dir of roots) {
  const hit = inspect(dir);
  if (hit) {
    resolved = hit;
    break;
  }
}

if (!resolved) {
  console.error("Build output not found. Run `bun run build` first.");
  for (const dir of [root, path.join(root, "dist"), path.join(root, ".output")]) {
    try {
      console.error(`- ${dir}: ${fs.readdirSync(dir).join(", ")}`);
    } catch {
      console.error(`- ${dir}: (missing)`);
    }
  }
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

// The deploy step may run from dist/ (fixed in the workflow file), so always emit
// the config in dist/ with paths relative to it, pointing at the real output dir.
const configDir = path.join(root, "dist");
fs.mkdirSync(configDir, { recursive: true });
const rel = (p2) => {
  const r = path.relative(configDir, path.join(resolved.outDir, p2)).split(path.sep).join("/");
  return r.startsWith(".") ? r : `./${r}`;
};
const configPath = path.join(configDir, "wrangler.json");
const existing = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, "utf8"))
  : {};

const config = {
  ...existing,
  name,
  main: rel(resolved.main),
  compatibility_date: existing.compatibility_date ?? "2025-09-01",
  compatibility_flags: [...new Set([...(existing.compatibility_flags ?? []), "nodejs_compat"])],
  assets: { ...(existing.assets ?? {}), binding: "ASSETS", directory: rel(resolved.assets) },
  // Never declare vars/secrets here: Cloudflare-side variables must stay untouched.
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`Wrote ${configPath}`);
console.log(JSON.stringify(config, null, 2));

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `dir=dist\n`,
  );
}
