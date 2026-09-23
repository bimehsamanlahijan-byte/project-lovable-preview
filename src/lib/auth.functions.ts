/** Client-callable server functions for the central login system. */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { LoginRequirement, PublicUser } from "./auth/registry";

export const authMe = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ user: PublicUser | null }> => {
    const { currentUserId } = await import("./auth/session.server");
    const { getPublicUser } = await import("./auth/store.server");
    const id = await currentUserId();
    if (!id) return { user: null };
    return { user: await getPublicUser(id) };
  },
);

export const authLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { signOut } = await import("./auth/session.server");
  await signOut();
  return { ok: true };
});

export const authModuleAccess = createServerFn({ method: "GET" })
  .inputValidator((d: { module: string }) => z.object({ module: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { checkModuleAccess } = await import("./auth/guard.server");
    const res = await checkModuleAccess(data.module);
    if (res.ok) return { allowed: true, mode: res.mode, user: res.user, loginUrl: null as string | null };
    return { allowed: false, mode: "required" as const, user: null, loginUrl: res.loginUrl };
  });

export const authSavePhone = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; consent: boolean }) =>
    z.object({ phone: z.string().trim().min(8).max(20), consent: z.literal(true) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { currentUserId } = await import("./auth/session.server");
    const { saveConsentedPhone } = await import("./auth/store.server");
    const id = await currentUserId();
    if (!id) return { ok: false, error: "ابتدا وارد شوید." };
    await saveConsentedPhone(id, data.phone);
    return { ok: true, error: null as string | null };
  });

export const authRemovePhone = createServerFn({ method: "POST" }).handler(async () => {
  const { currentUserId } = await import("./auth/session.server");
  const { clearPhone } = await import("./auth/store.server");
  const id = await currentUserId();
  if (!id) return { ok: false };
  await clearPhone(id);
  return { ok: true };
});

/** Public read of the login rules, used by the site to decide what to show. */
export const authRequirements = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ requirements: LoginRequirement[] }> => {
    const { readRequirements } = await import("./auth/store.server");
    return { requirements: await readRequirements() };
  },
);
