import { createFileRoute } from "@tanstack/react-router";

type TgUpdate = {
  update_id?: number;
  message?: { chat?: { id?: number }; from?: { username?: string; first_name?: string }; text?: string };
  edited_message?: { chat?: { id?: number }; from?: { username?: string }; text?: string };
  channel_post?: { chat?: { id?: number }; text?: string };
};

/** Incoming Telegram webhook: /api/public/telegram/webhook/<botId> */
export const Route = createFileRoute("/api/public/telegram/webhook/$botId")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const botId = (params as { botId: string }).botId;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: bot } = await supabaseAdmin
          .from("telegram_bots")
          .select("id, bot_token, webhook_secret, default_chat_ids, is_active")
          .eq("id", botId)
          .maybeSingle();
        if (!bot) return new Response("Unknown bot", { status: 404 });

        const provided = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!bot.webhook_secret || provided !== bot.webhook_secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as TgUpdate;
        const msg = update.message ?? update.edited_message ?? update.channel_post;
        if (typeof update.update_id !== "number" || !msg) return Response.json({ ok: true });

        const processWebhookBackground = async () => {
          await supabaseAdmin.from("telegram_updates").upsert(
            {
              update_id: update.update_id,
              bot_id: bot.id,
              chat_id: msg.chat?.id ?? null,
              from_user:
                (update.message?.from?.username ?? update.message?.from?.first_name) ?? null,
              text: msg.text ?? null,
              payload: update as never,
              raw: update as never,
            },
            { onConflict: "update_id" },
          );

          // Keyword-triggered automation flows
          const text = (msg.text ?? "").trim();
          if (text && bot.is_active) {
            const { data: flows } = await supabaseAdmin
              .from("telegram_flows")
              .select("id, steps, trigger_keyword, trigger_type, is_active")
              .eq("bot_id", bot.id)
              .eq("trigger_type", "keyword")
              .eq("is_active", true);

            const { parseChatIds, runFlowSteps } = await import("@/lib/telegram.server");
            for (const flow of flows ?? []) {
              const kw = (flow.trigger_keyword ?? "").trim();
              if (!kw || !text.includes(kw)) continue;
              try {
                const res = await runFlowSteps(
                  bot.bot_token,
                  (flow.steps ?? []) as never,
                  msg.chat?.id ? [String(msg.chat.id)] : parseChatIds(bot.default_chat_ids),
                );
                await supabaseAdmin.from("telegram_runs").insert({
                  flow_id: flow.id,
                  bot_id: bot.id,
                  status: "ok",
                  message: `اجرای خودکار با کلیدواژه «${kw}» — ${res.sent} پیام`,
                  details: { log: res.log } as never,
                });
              } catch (e) {
                await supabaseAdmin.from("telegram_runs").insert({
                  flow_id: flow.id,
                  bot_id: bot.id,
                  status: "error",
                  message: e instanceof Error ? e.message : String(e),
                });
              }
            }
          }
        };

        // Fire-and-forget in background to respond immediately to Telegram webhook ping
        void processWebhookBackground();

        return Response.json({ ok: true });
      },
    },
  },
});
