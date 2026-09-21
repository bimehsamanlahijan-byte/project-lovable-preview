#!/usr/bin/env node
// Builds the project for cPanel (Node.js / Passenger) WITHOUT touching the
// default Cloudflare build. It only switches the server preset to "node-server"
// for this single run. Output: .output/server/index.mjs + .output/public
import { spawnSync } from "node:child_process";

const env = { ...process.env, NITRO_PRESET: "node-server", NODE_ENV: "production" };
delete env.LOVABLE_SANDBOX;
delete env.DEV_SERVER__PROJECT_PATH;

const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(cmd, ["vite", "build"], { stdio: "inherit", env });
process.exit(result.status ?? 1);
