#!/bin/bash
# Called by .cpanel.yml from the cPanel repository clone.
# Config (outside git): ~/.cpanel-deploy.env
#   APP_ROOT=/home/USER/samanapp        # "Application root" of Setup Node.js App (required)
#   NODE_BIN_DIR=/home/USER/nodevenv/samanapp/20/bin   # optional, auto-detected
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONF="$HOME/.cpanel-deploy.env"
[ -f "$CONF" ] && . "$CONF"

if [ -z "${APP_ROOT:-}" ]; then
  echo "[deploy] APP_ROOT not set. Create $CONF with APP_ROOT=/home/USER/APP_FOLDER" >&2
  exit 1
fi

# Find the Node.js binary provided by cPanel "Setup Node.js App".
if [ -z "${NODE_BIN_DIR:-}" ]; then
  APP_NAME="$(basename "$APP_ROOT")"
  NODE_BIN_DIR="$(ls -d "$HOME"/nodevenv/"$APP_NAME"/*/bin 2>/dev/null | sort -V | tail -1 || true)"
fi
[ -n "${NODE_BIN_DIR:-}" ] && export PATH="$NODE_BIN_DIR:$PATH"
command -v node >/dev/null || { echo "[deploy] node not found" >&2; exit 1; }
echo "[deploy] node $(node -v) | repo $REPO_DIR -> $APP_ROOT"

# VITE_* values are baked into the browser bundle: read them from the app's .env.
if [ -f "$APP_ROOT/.env" ]; then
  set -a; . "$APP_ROOT/.env"; set +a
fi

cd "$REPO_DIR"
if [ -f PREBUILT ] && [ -f .output/server/index.mjs ]; then
  # "cpanel-build" branch: already built on Node 22 by GitHub Actions.
  echo "[deploy] prebuilt output found ($(cat PREBUILT)) — skipping build"
else
  # Building on the host needs Node >= 20.19 (Vite 8). Prefer the cpanel-build branch.
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund
  npm run build:cpanel
fi

mkdir -p "$APP_ROOT/tmp" "$APP_ROOT/cpanel" "$APP_ROOT/scripts"
rm -rf "$APP_ROOT/.output.new"
cp -R .output "$APP_ROOT/.output.new"
rm -rf "$APP_ROOT/.output.old"
[ -d "$APP_ROOT/.output" ] && mv "$APP_ROOT/.output" "$APP_ROOT/.output.old"
mv "$APP_ROOT/.output.new" "$APP_ROOT/.output"
rm -rf "$APP_ROOT/.output.old"

cp app.cjs package.json "$APP_ROOT/"
cp cpanel/websocket-polyfill.cjs "$APP_ROOT/cpanel/"
[ -f scripts/build-cpanel.mjs ] && cp scripts/build-cpanel.mjs "$APP_ROOT/scripts/"
if [ -d node_modules/ws ]; then
  mkdir -p "$APP_ROOT/node_modules"
  rm -rf "$APP_ROOT/node_modules/ws"
  cp -R node_modules/ws "$APP_ROOT/node_modules/ws"
fi

# Restart Passenger.
touch "$APP_ROOT/tmp/restart.txt"
echo "[deploy] done — Passenger restart requested"
