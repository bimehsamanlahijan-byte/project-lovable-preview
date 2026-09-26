// cPanel / Phusion Passenger startup file.
// Set this file as "Application startup file" in cPanel → Setup Node.js App.
// It only boots the Node build produced by `npm run build:cpanel`
// (.output/server/index.mjs). The Cloudflare build (dist/) is untouched.
"use strict";

const path = require("node:path");
const fs = require("node:fs");

// Load .env from the app root if present (cPanel env vars also work).
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined || process.env[m[1]] === "") process.env[m[1]] = value;
  }
}

// Map APP_DB_* names onto the names the app expects (same as vite.config.ts).
const aliases = {
  SUPABASE_URL: "APP_DB_URL",
  VITE_SUPABASE_URL: "APP_DB_URL",
  SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  VITE_SUPABASE_PUBLISHABLE_KEY: "APP_DB_PUBLISHABLE_KEY",
  SUPABASE_SERVICE_ROLE_KEY: "APP_DB_SERVICE_ROLE_KEY",
};
for (const [target, source] of Object.entries(aliases)) {
  if (process.env[source] && !process.env[target]) process.env[target] = process.env[source];
}

// Passenger provides PORT; Nitro's node-server listens on PORT / HOST.
process.env.NITRO_PORT = process.env.NITRO_PORT || process.env.PORT || "3000";
process.env.NITRO_HOST = process.env.NITRO_HOST || process.env.HOST || "127.0.0.1";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

// --- WebSocket compatibility (Node 20 on cPanel has no global WebSocket) ---
try {
  const { installWebSocket, log } = require("./cpanel/websocket-polyfill.cjs");
  const result = installWebSocket();
  if (result.ok) {
    if (result.source !== "native") log(`WebSocket polyfill enabled (${result.source}).`);
  } else if (result.reexec) {
    // Node 20 supports WebSocket behind a flag: restart this process with it.
    const { spawnSync } = require("node:child_process");
    log("restarting with --experimental-websocket (Node 20 compatibility)");
    const child = spawnSync(
      process.execPath,
      ["--experimental-websocket", __filename, ...process.argv.slice(2)],
      { stdio: "inherit", env: { ...process.env, CPANEL_WS_REEXEC: "1" } },
    );
    process.exit(child.status ?? 1);
  } else {
    log(
      'no WebSocket implementation found. Run "npm install ws" in the app root ' +
        "or use Node.js 22+ so realtime/AI chat features work.",
    );
  }
} catch (error) {
  console.error("[cpanel][ws] polyfill failed:", error);
}

const serverEntry = path.join(__dirname, ".output", "server", "index.mjs");
if (!fs.existsSync(serverEntry)) {
  console.error(
    `[cpanel] Build output not found at ${serverEntry}.\n` +
      `Run "npm run build:cpanel" first and upload the .output folder.`,
  );
  process.exit(1);
}

import(serverEntry).catch((error) => {
  console.error("[cpanel] Failed to start server:", error);
  process.exit(1);
});
