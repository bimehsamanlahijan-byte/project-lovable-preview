/** Secure, server-side session for site visitors (separate from the admin gate). */
import { useSession } from "@tanstack/react-start/server";
import { getSessionSecret, loadRuntimeEnv } from "../server-env";

export type UserSession = {
  userId?: string;
  provider?: string;
  /** Short-lived anti-CSRF state for OAuth/OIDC round trips. */
  oauthState?: string;
};

function config(password: string) {
  return {
    password,
    name: "saman-user",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export async function getUserSession() {
  await loadRuntimeEnv();
  const secret = getSessionSecret();
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_MISSING");
  return useSession<UserSession>(config(secret));
}

/** Returns the signed-in user id, or null. Never throws. */
export async function currentUserId(): Promise<string | null> {
  try {
    const session = await getUserSession();
    return session.data.userId ?? null;
  } catch {
    return null;
  }
}

export async function signIn(userId: string, provider: string) {
  const session = await getUserSession();
  await session.update({ userId, provider, oauthState: undefined });
}

export async function signOut() {
  try {
    const session = await getUserSession();
    await session.clear();
  } catch {
    /* no session to clear */
  }
}
