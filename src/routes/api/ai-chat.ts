import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (status: number, body: unknown) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
          });

        // Central login system: enforce the module rule server-side.
        {
          const { denyIfLoginRequired } = await import("@/lib/auth/guard.server");
          const denied = await denyIfLoginRequired("ai_chat", request);
          if (denied) return denied;
          // After a login, the chat is unlocked for a limited number of questions.
          const { checkModuleAccess } = await import("@/lib/auth/guard.server");
          const access = await checkModuleAccess("ai_chat", request);
          if (access.ok && access.user && access.mode !== "none") {
            const { AI_CHAT_FREE_QUESTIONS } = await import("@/lib/auth/registry");
            const { getUserSession } = await import("@/lib/auth/session.server");
            const session = await getUserSession();
            const used = session.data.aiCount ?? 0;
            if (used >= AI_CHAT_FREE_QUESTIONS) {
              return json(429, { ok: false, error: "question_limit", limit: AI_CHAT_FREE_QUESTIONS });
            }
            await session.update({ aiCount: used + 1 });
          }
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json(400, { ok: false, error: "invalid_json" });
        }
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return json(400, { ok: false, error: "validation_failed" });

        const { answerWithSiteAi } = await import("@/lib/site-ai.server");
        const out = await answerWithSiteAi(parsed.data.messages);
        if (!out.ok) return json(out.status, { ok: false, error: out.error });
        return json(200, { ok: true, reply: out.reply, model: out.model, provider: out.provider });
      },
    },
  },
});
