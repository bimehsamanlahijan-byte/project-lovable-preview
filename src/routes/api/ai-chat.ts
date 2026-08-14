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

type Settings = {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  enabled?: boolean;
};

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (status: number, body: unknown) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
          });

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json(400, { ok: false, error: "invalid_json" });
        }
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return json(400, { ok: false, error: "validation_failed" });

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return json(500, { ok: false, error: "ai_not_configured" });

        // Load assistant settings + approved knowledge from the database (public read).
        let settings: Settings = {};
        let knowledge = "";
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
          const key =
            process.env["SUPABASE_PUBLISHABLE_KEY"] ||
            process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
            process.env["SUPABASE_ANON_KEY"];
          if (url && key) {
            const db = createClient(url, key, {
              auth: { persistSession: false, autoRefreshToken: false },
            });
            const [{ data: s }, { data: kb }] = await Promise.all([
              db.from("site_settings").select("value").eq("key", "ai_assistant").maybeSingle(),
              db
                .from("ai_knowledge")
                .select("title, content")
                .eq("is_active", true)
                .order("position", { ascending: true })
                .limit(60),
            ]);
            settings = (s?.value as Settings) ?? {};
            knowledge = (kb ?? [])
              .map((k: { title: string; content: string }) => `### ${k.title}\n${k.content}`)
              .join("\n\n");
          }
        } catch (e) {
          console.error("[ai-chat] settings load failed", e);
        }

        if (settings.enabled === false) return json(403, { ok: false, error: "assistant_disabled" });

        const systemPrompt = [
          settings.systemPrompt ||
            "شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی پاسخ دهید.",
          knowledge
            ? `دانش تأییدشده نمایندگی (این اطلاعات معتبرترین منبع است و بر دانش عمومی شما اولویت دارد):\n${knowledge}`
            : "",
          "اگر پاسخ در دانش تأییدشده نیست، صادقانه بگو و کاربر را به مشاوره تلفنی نمایندگی راهنمایی کن.",
        ]
          .filter(Boolean)
          .join("\n\n");

        const model = settings.model || "google/gemini-3.6-flash";
        const body: Record<string, unknown> = {
          model,
          messages: [{ role: "system", content: systemPrompt }, ...parsed.data.messages],
        };
        if (typeof settings.temperature === "number") body.temperature = settings.temperature;
        if (model.startsWith("openai/gpt-5.6")) body.reasoning_effort = "none";

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("[ai-chat] gateway error", res.status, text);
            if (res.status === 429) return json(429, { ok: false, error: "rate_limited" });
            if (res.status === 402) return json(402, { ok: false, error: "credits_exhausted" });
            return json(502, { ok: false, error: "gateway_error" });
          }

          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (!reply) return json(502, { ok: false, error: "empty_reply" });
          return json(200, { ok: true, reply, model });
        } catch (e) {
          console.error("[ai-chat] request failed", e);
          return json(502, { ok: false, error: "gateway_unreachable" });
        }
      },
    },
  },
});
