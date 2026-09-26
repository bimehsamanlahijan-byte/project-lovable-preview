// WebSocket compatibility layer for cPanel (Node.js 20) deployments.
//
// Node 22 (Cloudflare Worker build / newer hosts) exposes a native global
// WebSocket. Node 20 does not, so libraries that need realtime connections
// fail with: "Node.js detected but native WebSocket not found".
//
// This file is ONLY loaded by app.cjs (the cPanel startup file). It never runs
// in the Cloudflare Worker build.
"use strict";

function log(message) {
  console.log(`[cpanel][ws] ${message}`);
}

function installWebSocket() {
  if (typeof globalThis.WebSocket === "function") {
    return { ok: true, source: "native" };
  }

  // 1) Bundled/installed `ws` package (works on any Node >= 18).
  try {
    const ws = require("ws");
    const Impl = ws.WebSocket || ws;
    globalThis.WebSocket = Impl;
    if (!globalThis.WebSocketPair && ws.WebSocketServer) {
      globalThis.WebSocketServer = ws.WebSocketServer;
    }
    return { ok: true, source: "ws" };
  } catch {
    // fall through
  }

  // 2) Node's experimental WebSocket flag (Node 20.x), via self re-exec.
  try {
    const flags = process.allowedNodeEnvironmentFlags;
    const supportsFlag = flags && flags.has("--experimental-websocket");
    const alreadyTried = process.env.CPANEL_WS_REEXEC === "1";
    if (supportsFlag && !alreadyTried) {
      return { ok: false, reexec: true };
    }
  } catch {
    // ignore
  }

  return { ok: false };
}

module.exports = { installWebSocket, log };
