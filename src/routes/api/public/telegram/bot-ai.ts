import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Saman insurance bot webhook: Telegram → here → AI → Telegram.
 * Bot token, AI keys and provider settings live in server secrets / settings;
 * nothing sensitive is exposed and no admin data is ever answered by the bot.
 */
export const Route = createFileRoute("/api/public/telegram/bot-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { envValueAsync } = await import("@/lib/server-env");
        const botToken = await envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN");
        if (!botToken) return new Response("Bot not configured", { status: 503 });

        const expected = webhookSecret(botToken);
        const provided = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        const a = Buffer.from(expected);
        const b = Buffer.from(provided);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as {
          message?: {
            chat?: { id?: number; type?: string };
            text?: string;
            from?: { id?: number; username?: string; first_name?: string; last_name?: string };
            contact?: { phone_number?: string; user_id?: number; first_name?: string; last_name?: string };
          };
        };
        const msg = update.message;
        const chatId = msg?.chat?.id;
        const text = (msg?.text ?? "").trim();
        if (!chatId) return Response.json({ ok: true });

        // --- Site login through the bot (always active, independent of AI settings) ---
        {
          const handled = await handleBotLogin(botToken, chatId, text, msg);
          if (handled) return Response.json({ ok: true });
        }
        if (!text) return Response.json({ ok: true });
        if (msg?.chat?.type !== "private") return Response.json({ ok: true });

        const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
        const supabase = await getSupabaseAdmin();
        const { data: row } = await supabase
          .from("site_settings" as never)
          .select("value")
          .eq("key", "login_bot_config")
          .maybeSingle();
        const cfg = ((row as { value?: Record<string, unknown> } | null)?.value ?? {}) as {
          enabled?: boolean;
          aiEnabled?: boolean;
          useSiteAi?: boolean;
          requireLogin?: boolean;
          aiProvider?: string;
          aiModel?: string;
          systemPrompt?: string;
        };
        if (cfg.enabled === false) return Response.json({ ok: true, disabled: true });

        const { tg } = await import("@/lib/telegram.server");
        const fromId = msg?.from?.id;

        // 1) Telegram login first: until the user shares their phone, only the login card is shown.
        if (cfg.requireLogin !== false && fromId) {
          const { data: tu } = await supabase
            .from("telegram_users" as never)
            .select("phone_number, is_active")
            .eq("telegram_id", fromId)
            .maybeSingle();
          const u = tu as { phone_number: string | null; is_active: boolean } | null;
          if (!u || !u.phone_number) {
            await sendLoginCard(botToken, chatId);
            return Response.json({ ok: true, login: "required" });
          }
          if (u.is_active === false) {
            await tg(botToken, "sendMessage", { chat_id: chatId, text: "دسترسی شما توسط مدیر غیرفعال شده است." });
            return Response.json({ ok: true });
          }
          await supabase
            .from("telegram_users" as never)
            .update({ last_login: new Date().toISOString() } as never)
            .eq("telegram_id", fromId);
        }

        if (text === "/start" || text === "/ai") {
          await tg(botToken, "sendMessage", {
            chat_id: chatId,
            text: "🤖 سلام! من دستیار هوشمند بیمه سامان هستم. سؤال بیمه‌ای خود را بنویسید.",
            reply_markup: { remove_keyboard: true },
          });
          return Response.json({ ok: true });
        }
        const question = text.replace(/^\/ai\s+/, "");

        // 2) Answer with the same AI assistant as the website chat (settings + knowledge base).
        let reply = "متأسفانه الان امکان پاسخ‌گویی نیست. لطفاً کمی بعد دوباره تلاش کنید.";
        await tg(botToken, "sendChatAction", { chat_id: chatId, action: "typing" }).catch(() => null);
        if (cfg.useSiteAi !== false) {
          const { answerWithSiteAi } = await import("@/lib/site-ai.server");
          const out = await answerWithSiteAi([{ role: "user", content: question.slice(0, 4000) }]);
          if (out.ok) reply = out.reply;
          else console.error("[bot-ai] site ai", out.status, out.error);
        } else if (cfg.aiEnabled) {
          reply = (await askAi(question, cfg)) ?? reply;
        }

        await tg(botToken, "sendMessage", { chat_id: chatId, text: reply });
        return Response.json({ ok: true });
      },
    },
  },
});

export function webhookSecret(botToken: string) {
  return createHash("sha256").update(`telegram-bot-ai:${botToken}`).digest("base64url");
}

const PROVIDER_URLS: Record<string, string> = {
  google: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  mistral: "https://api.mistral.ai/v1/chat/completions",
  deepseek: "https://api.deepseek.com/v1/chat/completions",
  together: "https://api.together.xyz/v1/chat/completions",
  cerebras: "https://api.cerebras.ai/v1/chat/completions",
  github: "https://models.github.ai/inference/chat/completions",
  nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
  huggingface: "https://router.huggingface.co/v1/chat/completions",
};

async function askAi(
  text: string,
  cfg: { aiProvider?: string; aiModel?: string; systemPrompt?: string },
): Promise<string | null> {
  try {
    const { envValue, loadRuntimeEnv } = await import("@/lib/server-env");
    const { getProvider } = await import("@/lib/ai-providers");
    await loadRuntimeEnv();
    const provider = getProvider(cfg.aiProvider ?? "lovable");
    const key = envValue(...provider.keyNames);
    if (!key) return null;

    const isLovable = provider.id === "lovable";
    const url = isLovable
      ? "https://ai.gateway.lovable.dev/v1/chat/completions"
      : PROVIDER_URLS[provider.id] ?? "https://ai.gateway.lovable.dev/v1/chat/completions";
    const headers: Record<string, string> = isLovable
      ? { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" }
      : { "Content-Type": "application/json", Authorization: `Bearer ${key}` };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: cfg.aiModel ?? "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: cfg.systemPrompt ?? "دستیار بیمه سامان لاهیجان هستی." },
          { role: "user", content: text.slice(0, 2000) },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[bot-ai]", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error("[bot-ai]", e);
    return null;
  }
}

type BotMsg = {
  chat?: { id?: number; type?: string };
  from?: { id?: number; username?: string; first_name?: string; last_name?: string };
  contact?: { phone_number?: string; user_id?: number; first_name?: string; last_name?: string };
};

/** Returns true when the update belonged to the site-login flow. */
async function handleBotLogin(
  botToken: string,
  chatId: number,
  text: string,
  msg: BotMsg | undefined,
): Promise<boolean> {
  const { tg } = await import("@/lib/telegram.server");
  const login = await import("@/lib/auth/bot-login.server");
  const fromId = msg?.from?.id;
  if (!fromId || msg?.chat?.type !== "private") return false;

  const startMatch = text.match(/^\/start\s+login_([A-Za-z0-9_-]{16,48})$/);
  if (startMatch) {
    await login.setPending(String(fromId), startMatch[1]);
    await tg(botToken, "sendMessage", {
      chat_id: chatId,
      text:
        "👋 به بیمه سامان لاهیجان خوش آمدید.\n\nبرای فعال شدن چت هوش مصنوعی در سایت، روی دکمه‌ی «📱 ارسال شماره من» در پایین بزنید.",
      reply_markup: {
        keyboard: [[{ text: "📱 ارسال شماره من", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return true;
  }

  // Only Telegram's verified contact share is accepted — typed numbers are rejected
  // so nobody can log in with someone else's phone number.
  const contact = msg?.contact;
  if (!contact) return false;
  if (contact.user_id !== fromId || !contact.phone_number) {
    await tg(botToken, "sendMessage", {
      chat_id: chatId,
      text: "لطفاً فقط شماره‌ی خودتان را با دکمه‌ی «📱 ارسال شماره من» ارسال کنید.",
    });
    return true;
  }

  // With a pending nonce the login also unlocks the website chat; without one it is a bot-only login.
  const nonce = await login.takePending(String(fromId));

  const store = await import("@/lib/auth/store.server");
  const phone = contact.phone_number.startsWith("+") ? contact.phone_number : `+${contact.phone_number}`;
  const name = [msg?.from?.first_name, msg?.from?.last_name].filter(Boolean).join(" ") || null;
  const userId = await store.upsertIdentity({
    provider: "telegram",
    providerUserId: String(fromId),
    displayName: name,
    data: { username: msg?.from?.username ?? null, via: "bot_contact" },
  });
  await store.upsertTelegramUser(userId, {
    telegramId: String(fromId),
    username: msg?.from?.username ?? null,
    firstName: msg?.from?.first_name ?? null,
    lastName: msg?.from?.last_name ?? null,
    verified: true,
  });
  await store.saveConsentedPhone(userId, phone);
  if (nonce) await login.markDone(nonce, userId);
  await store.logLogin({
    userId,
    method: nonce ? "telegram_bot_site" : "telegram_bot",
    telegramId: String(fromId),
    module: nonce ? "ai_chat" : "telegram_bot",
    status: "success",
  });

  await tg(botToken, "sendMessage", {
    chat_id: chatId,
    text: nonce
      ? "✅ ورود شما تأیید شد. به سایت برگردید؛ چت هوش مصنوعی فعال شد. همین‌جا در ربات هم می‌توانید سؤال بپرسید."
      : "✅ ورود شما تأیید شد. حالا سؤال بیمه‌ای خود را بنویسید تا دستیار هوشمند پاسخ دهد.",
    reply_markup: { remove_keyboard: true },
  });
  return true;
}


async function sendLoginCard(botToken: string, chatId: number) {
  const { tg } = await import("@/lib/telegram.server");
  await tg(botToken, "sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    text:
      "🔐 <b>ورود با تلگرام — بیمه سامان</b>\n\n" +
      "برای استفاده از دستیار هوشمند بیمه، ابتدا وارد شوید.\n" +
      "👇 روی دکمه‌ی <b>«📱 ارسال شماره من»</b> در پایین صفحه بزنید.",
    reply_markup: {
      keyboard: [[{ text: "📱 ارسال شماره من", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}
