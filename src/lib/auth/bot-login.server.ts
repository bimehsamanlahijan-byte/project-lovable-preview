/**
 * "Login via Telegram bot + share phone number" flow (server only).
 *
 * 1. The site creates a one-time nonce, binds it to the visitor's session cookie
 *    and opens t.me/<bot>?start=login_<nonce>.
 * 2. The bot asks the user to press "send my phone number" (request_contact).
 * 3. On a verified contact the bot creates / updates the site user, stores the
 *    phone and marks the nonce as completed.
 * 4. The site polls; only the browser holding the same session nonce can claim it.
 */
import { randomBytes } from "node:crypto";

const TTL_MS = 10 * 60 * 1000;
const DONE_PREFIX = "bot_login:";
const PENDING_PREFIX = "bot_login_pending:";

async function db() {
  const { getSupabaseAdmin } = await import("@/lib/cloud-admin.server");
  return getSupabaseAdmin();
}

async function put(key: string, value: Record<string, unknown>) {
  const supabase = await db();
  await supabase
    .from("site_settings" as never)
    .upsert({ key, value, updated_at: new Date().toISOString() } as never, { onConflict: "key" });
}

async function get(key: string): Promise<Record<string, unknown> | null> {
  const supabase = await db();
  const { data } = await supabase.from("site_settings" as never).select("value").eq("key", key).maybeSingle();
  return ((data as { value?: Record<string, unknown> } | null)?.value ?? null) as Record<string, unknown> | null;
}

async function del(key: string) {
  const supabase = await db();
  await supabase.from("site_settings" as never).delete().eq("key", key);
}

function fresh(v: Record<string, unknown> | null) {
  return Boolean(v && typeof v.at === "number" && Date.now() - (v.at as number) < TTL_MS);
}

export function isValidNonce(n: string) {
  return /^[A-Za-z0-9_-]{16,48}$/.test(n);
}

export function createNonce() {
  return randomBytes(18).toString("base64url");
}

let cachedUsername: string | null = null;
export async function getBotUsername(botToken: string): Promise<string | null> {
  if (cachedUsername) return cachedUsername;
  try {
    const { tg } = await import("@/lib/telegram.server");
    const me = (await tg(botToken, "getMe", {})) as { username?: string };
    cachedUsername = me.username ?? null;
    return cachedUsername;
  } catch (e) {
    console.error("[bot-login] getMe", e);
    return null;
  }
}

/** Bot side: remember which nonce this Telegram user started with. */
export async function setPending(telegramId: string, nonce: string) {
  await put(PENDING_PREFIX + telegramId, { nonce, at: Date.now() });
}

export async function takePending(telegramId: string): Promise<string | null> {
  const v = await get(PENDING_PREFIX + telegramId);
  await del(PENDING_PREFIX + telegramId);
  return fresh(v) ? String(v!.nonce) : null;
}

export async function markDone(nonce: string, userId: string) {
  await put(DONE_PREFIX + nonce, { userId, at: Date.now() });
}

/** Site side: returns the user id once the bot finished, consuming the nonce. */
export async function claim(nonce: string): Promise<string | null> {
  const v = await get(DONE_PREFIX + nonce);
  if (!v) return null;
  await del(DONE_PREFIX + nonce);
  return fresh(v) ? String(v.userId) : null;
}
