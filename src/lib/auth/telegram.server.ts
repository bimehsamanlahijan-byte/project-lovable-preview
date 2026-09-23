/**
 * Telegram login provider (server only).
 *
 * Supports both shapes Telegram offers today:
 *  1. OAuth2 / OpenID Connect authorization-code flow (client id + secret).
 *  2. The classic Login Widget payload, verified with the bot token HMAC.
 *
 * Nothing secret ever reaches the browser: the client id is only used to build
 * the authorize URL, the secret and the bot token stay in the runtime env.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { envValueAsync } from "../server-env";
import { TELEGRAM_CALLBACK_PATH } from "./registry";

const DEFAULT_AUTH_URL = "https://oauth.telegram.org/authorize";
const DEFAULT_TOKEN_URL = "https://oauth.telegram.org/token";
const DEFAULT_USERINFO_URL = "https://oauth.telegram.org/userinfo";

export async function telegramConfig() {
  const [clientId, clientSecret, botToken, botUsername, authUrl, tokenUrl, userinfoUrl, siteUrl] =
    await Promise.all([
      envValueAsync("TELEGRAM_CLIENT_ID", "TELEGRAM_OIDC_CLIENT_ID"),
      envValueAsync("TELEGRAM_CLIENT_SECRET", "TELEGRAM_OIDC_CLIENT_SECRET"),
      envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN"),
      envValueAsync("TELEGRAM_LOGIN_BOT_USERNAME"),
      envValueAsync("TELEGRAM_OIDC_AUTH_URL"),
      envValueAsync("TELEGRAM_OIDC_TOKEN_URL"),
      envValueAsync("TELEGRAM_OIDC_USERINFO_URL"),
      envValueAsync("PUBLIC_SITE_URL", "SITE_URL"),
    ]);

  return {
    clientId: clientId ?? null,
    clientSecret: clientSecret ?? null,
    botToken: botToken ?? null,
    botUsername: botUsername ?? "SamInsuranceBot",
    authUrl: authUrl || DEFAULT_AUTH_URL,
    tokenUrl: tokenUrl || DEFAULT_TOKEN_URL,
    userinfoUrl: userinfoUrl || DEFAULT_USERINFO_URL,
    siteUrl: (siteUrl || "https://saman8452.ir").replace(/\/+$/, ""),
  };
}

export function callbackUrl(origin: string) {
  return `${origin.replace(/\/+$/, "")}${TELEGRAM_CALLBACK_PATH}`;
}

export type TelegramClaims = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photo?: string | null;
};

/** Exchanges the OIDC code for the user's claims. */
export async function exchangeCode(
  code: string,
  redirectUri: string,
): Promise<TelegramClaims> {
  const cfg = await telegramConfig();
  if (!cfg.clientId || !cfg.clientSecret) throw new Error("TELEGRAM_OIDC_NOT_CONFIGURED");

  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`TELEGRAM_TOKEN_FAILED [${res.status}]: ${body}`);

  const token = JSON.parse(body) as { access_token?: string; id_token?: string };

  if (token.id_token) {
    const claims = decodeJwtPayload(token.id_token);
    if (claims?.sub) {
      return {
        id: String(claims.sub),
        username: (claims["username"] as string) ?? (claims["preferred_username"] as string) ?? null,
        firstName: (claims["given_name"] as string) ?? (claims["first_name"] as string) ?? null,
        lastName: (claims["family_name"] as string) ?? (claims["last_name"] as string) ?? null,
        photo: (claims["picture"] as string) ?? (claims["photo_url"] as string) ?? null,
      };
    }
  }

  if (!token.access_token) throw new Error("TELEGRAM_TOKEN_EMPTY");
  const infoRes = await fetch(cfg.userinfoUrl, {
    headers: { Authorization: `Bearer ${token.access_token}`, Accept: "application/json" },
  });
  const infoBody = await infoRes.text();
  if (!infoRes.ok) throw new Error(`TELEGRAM_USERINFO_FAILED [${infoRes.status}]: ${infoBody}`);
  const info = JSON.parse(infoBody) as Record<string, unknown>;
  const id = info["sub"] ?? info["id"];
  if (!id) throw new Error("TELEGRAM_USERINFO_NO_ID");
  return {
    id: String(id),
    username: (info["username"] as string) ?? null,
    firstName: (info["first_name"] as string) ?? (info["given_name"] as string) ?? null,
    lastName: (info["last_name"] as string) ?? (info["family_name"] as string) ?? null,
    photo: (info["photo_url"] as string) ?? (info["picture"] as string) ?? null,
  };
}

function decodeJwtPayload(jwt: string): Record<string, unknown> | null {
  try {
    const part = jwt.split(".")[1];
    if (!part) return null;
    const json = Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Verifies a classic Telegram Login Widget payload against the bot token. */
export async function verifyWidgetPayload(
  params: Record<string, string>,
): Promise<TelegramClaims | null> {
  const cfg = await telegramConfig();
  if (!cfg.botToken) return null;
  const { hash, ...rest } = params;
  if (!hash || !rest["id"]) return null;

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const secret = createHash("sha256").update(cfg.botToken).digest();
  const expected = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(hash);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const authDate = Number(rest["auth_date"] ?? 0);
  if (authDate && Date.now() / 1000 - authDate > 86400) return null;

  return {
    id: String(rest["id"]),
    username: rest["username"] ?? null,
    firstName: rest["first_name"] ?? null,
    lastName: rest["last_name"] ?? null,
    photo: rest["photo_url"] ?? null,
  };
}
