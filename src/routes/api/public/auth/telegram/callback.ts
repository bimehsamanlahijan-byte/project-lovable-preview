import { createFileRoute } from "@tanstack/react-router";

/**
 * Telegram login callback: /api/public/auth/telegram/callback
 * Accepts both the OIDC authorization code and the classic Login Widget payload.
 * All verification happens here on the server.
 */
export const Route = createFileRoute("/api/public/auth/telegram/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});

async function handle(request: Request): Promise<Response> {
  const { exchangeCode, verifyWidgetPayload, callbackUrl } = await import(
    "@/lib/auth/telegram.server"
  );
  const { getUserSession, signIn } = await import("@/lib/auth/session.server");
  const { upsertIdentity, upsertTelegramUser, logLogin } = await import("@/lib/auth/store.server");

  const url = new URL(request.url);
  const params: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) params[k] = v;
  if (request.method === "POST") {
    try {
      const form = await request.formData();
      for (const [k, v] of form.entries()) params[k] = String(v);
    } catch {
      /* not a form post */
    }
  }

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent");

  let moduleKey = "";
  let next = "/";
  let claims: Awaited<ReturnType<typeof verifyWidgetPayload>> = null;

  try {
    if (params["code"]) {
      const session = await getUserSession();
      const stored = session.data.oauthState ?? "";
      const [state, mod, storedNext] = stored.split("|");
      if (!state || params["state"] !== state) {
        return fail("درخواست ورود معتبر نیست. دوباره تلاش کنید.");
      }
      moduleKey = mod ?? "";
      next = storedNext || "/";
      claims = await exchangeCode(params["code"], callbackUrl(url.origin));
    } else if (params["hash"]) {
      claims = await verifyWidgetPayload(params);
      moduleKey = params["module"] ?? "";
      next = params["next"]?.startsWith("/") ? params["next"] : "/";
    }
  } catch (e) {
    console.error("[telegram callback]", e);
    await logLogin({ method: "telegram", module: moduleKey, status: "failed", ip, userAgent });
    return fail("ورود با تلگرام انجام نشد. لطفاً دوباره تلاش کنید.");
  }

  if (!claims) {
    await logLogin({ method: "telegram", module: moduleKey, status: "failed", ip, userAgent });
    return fail("پاسخ تلگرام معتبر نبود.");
  }

  const displayName = [claims.firstName, claims.lastName].filter(Boolean).join(" ") || claims.username || null;
  const userId = await upsertIdentity({
    provider: "telegram",
    providerUserId: claims.id,
    displayName,
    data: { username: claims.username ?? null },
  });
  await upsertTelegramUser(userId, {
    telegramId: claims.id,
    username: claims.username,
    firstName: claims.firstName,
    lastName: claims.lastName,
    photo: claims.photo,
    verified: true,
  });
  await signIn(userId, "telegram");
  await logLogin({
    userId,
    method: "telegram",
    telegramId: claims.id,
    module: moduleKey || null,
    status: "success",
    ip,
    userAgent,
  });

  return new Response(null, { status: 302, headers: { Location: next || "/" } });
}

function fail(message: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: `/login?error=${encodeURIComponent(message)}` },
  });
}
