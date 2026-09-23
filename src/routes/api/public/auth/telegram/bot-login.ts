import { createFileRoute } from "@tanstack/react-router";

/**
 * POST → starts a bot login (returns the t.me deep link).
 * GET  → polls; signs the visitor in once the bot received their phone number.
 */
export const Route = createFileRoute("/api/public/auth/telegram/bot-login")({
  server: {
    handlers: {
      POST: async () => {
        const { envValueAsync } = await import("@/lib/server-env");
        const { createNonce, getBotUsername } = await import("@/lib/auth/bot-login.server");
        const { getUserSession } = await import("@/lib/auth/session.server");

        const botToken = await envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN");
        if (!botToken) return Response.json({ ok: false, error: "bot_not_configured" }, { status: 503 });
        const username = await getBotUsername(botToken);
        if (!username) return Response.json({ ok: false, error: "bot_unreachable" }, { status: 502 });

        const nonce = createNonce();
        const session = await getUserSession();
        await session.update({ loginNonce: nonce });
        return Response.json({
          ok: true,
          botUrl: `https://t.me/${username}?start=login_${nonce}`,
          botUsername: username,
        });
      },
      GET: async ({ request }) => {
        const { claim, isValidNonce } = await import("@/lib/auth/bot-login.server");
        const { getUserSession, signIn } = await import("@/lib/auth/session.server");
        const { getPublicUser, logLogin } = await import("@/lib/auth/store.server");

        const session = await getUserSession();
        const nonce = session.data.loginNonce;
        if (!nonce || !isValidNonce(nonce)) return Response.json({ ok: false, status: "no_request" });

        const userId = await claim(nonce);
        if (!userId) return Response.json({ ok: false, status: "pending" });

        await signIn(userId, "telegram");
        await session.update({ loginNonce: undefined, aiCount: 0 });
        await logLogin({
          userId,
          method: "telegram_bot",
          module: "ai_chat",
          status: "success",
          ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for"),
          userAgent: request.headers.get("user-agent"),
        });
        return Response.json({ ok: true, status: "done", user: await getPublicUser(userId) });
      },
    },
  },
});
