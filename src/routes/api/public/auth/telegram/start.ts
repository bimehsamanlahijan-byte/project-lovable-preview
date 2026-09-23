import { createFileRoute } from "@tanstack/react-router";

/** Starts the Telegram login: /api/public/auth/telegram/start */
export const Route = createFileRoute("/api/public/auth/telegram/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { telegramConfig, callbackUrl } = await import("@/lib/auth/telegram.server");
        const { getUserSession } = await import("@/lib/auth/session.server");
        const url = new URL(request.url);
        const moduleKey = url.searchParams.get("module") ?? "";
        const next = sanitizeNext(url.searchParams.get("next"));

        const cfg = await telegramConfig();
        if (!cfg.clientId) {
          return Response.json(
            { error: "ورود با تلگرام هنوز پیکربندی نشده است (TELEGRAM_CLIENT_ID)." },
            { status: 503 },
          );
        }

        const state = crypto.randomUUID();
        try {
          const session = await getUserSession();
          await session.update({ oauthState: `${state}|${moduleKey}|${next}` });
        } catch {
          return Response.json({ error: "SESSION_SECRET تنظیم نشده است." }, { status: 503 });
        }

        const redirectUri = callbackUrl(url.origin);
        const authorize = new URL(cfg.authUrl);
        authorize.searchParams.set("client_id", cfg.clientId);
        authorize.searchParams.set("redirect_uri", redirectUri);
        authorize.searchParams.set("response_type", "code");
        authorize.searchParams.set("scope", "openid profile");
        authorize.searchParams.set("state", state);

        return new Response(null, { status: 302, headers: { Location: authorize.toString() } });
      },
    },
  },
});

function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
