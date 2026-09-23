/** Server-side enforcement of the central login requirements. */
import { currentUserId } from "./session.server";
import { getPublicUser, logLogin, readRequirement } from "./store.server";
import type { PublicUser } from "./registry";

export type GuardResult =
  | { ok: true; user: PublicUser | null; mode: "required" | "optional" | "none" }
  | { ok: false; status: 401; error: string; loginUrl: string };

/**
 * Checks a module against the central login settings. Frontend guards are only
 * for comfort — every API that protects a module calls this.
 */
export async function checkModuleAccess(
  moduleKey: string,
  req?: Request,
): Promise<GuardResult> {
  const requirement = await readRequirement(moduleKey);
  const userId = await currentUserId();
  const user = userId ? await getPublicUser(userId) : null;

  if (requirement.mode === "required" && !user) {
    await logLogin({
      method: "guard",
      module: moduleKey,
      status: "denied",
      ip: req?.headers.get("cf-connecting-ip") ?? req?.headers.get("x-forwarded-for") ?? null,
      userAgent: req?.headers.get("user-agent") ?? null,
    });
    return {
      ok: false,
      status: 401,
      error: "برای استفاده از این بخش ابتدا باید وارد شوید.",
      loginUrl: `/login?module=${encodeURIComponent(moduleKey)}`,
    };
  }

  return { ok: true, user, mode: requirement.mode };
}

/** Convenience wrapper for API routes: returns a Response when access is denied. */
export async function denyIfLoginRequired(
  moduleKey: string,
  req: Request,
): Promise<Response | null> {
  const res = await checkModuleAccess(moduleKey, req);
  if (res.ok) return null;
  return Response.json(
    { error: res.error, loginRequired: true, loginUrl: res.loginUrl },
    { status: res.status },
  );
}
