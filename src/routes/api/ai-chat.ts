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
  provider?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  enabled?: boolean;
};

/** Resolves the OpenAI-compatible endpoint + auth headers for a provider. */
async function resolveTarget(providerId: string): Promise<
  | { ok: true; url: string; headers: Record<string, string> }
  | { ok: false; error: string }
> {
  const { envValue, loadRuntimeEnv } = await import("@/lib/server-env");
  const { getProvider } = await import("@/lib/ai-providers");
  await loadRuntimeEnv();

  const provider = getProvider(providerId);
  const key = envValue(...provider.keyNames);
  if (!key) return { ok: false, error: `missing_key_${provider.keyNames[0]}` };

  const bearer = { "Content-Type": "application/json", Authorization: `Bearer ${key}` };

  switch (provider.id) {
    case "lovable":
      return {
        ok: true,
        url: "https://ai.gateway.lovable.dev/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
      };
    case "cloudflare": {
      const account = envValue("CLOUDFLARE_ACCOUNT_ID");
      if (!account) return { ok: false, error: "missing_key_CLOUDFLARE_ACCOUNT_ID" };
      return {
        ok: true,
        url: `https://api.cloudflare.com/client/v4/accounts/${account}/ai/v1/chat/completions`,
        headers: bearer,
      };
    }
    case "google":
      return {
        ok: true,
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        headers: bearer,
      };
    case "groq":
      return { ok: true, url: "https://api.groq.com/openai/v1/chat/completions", headers: bearer };
    case "openrouter":
      return { ok: true, url: "https://openrouter.ai/api/v1/chat/completions", headers: bearer };
    case "mistral":
      return { ok: true, url: "https://api.mistral.ai/v1/chat/completions", headers: bearer };
    case "deepseek":
      return { ok: true, url: "https://api.deepseek.com/v1/chat/completions", headers: bearer };
    case "together":
      return { ok: true, url: "https://api.together.xyz/v1/chat/completions", headers: bearer };
    case "cerebras":
      return { ok: true, url: "https://api.cerebras.ai/v1/chat/completions", headers: bearer };
    case "github":
      return { ok: true, url: "https://models.github.ai/inference/chat/completions", headers: bearer };
    case "nvidia":
      return { ok: true, url: "https://integrate.api.nvidia.com/v1/chat/completions", headers: bearer };
    case "huggingface":
      return { ok: true, url: "https://router.huggingface.co/v1/chat/completions", headers: bearer };
    default:
      return { ok: false, error: "unknown_provider" };
  }
}

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

        // Load assistant settings + approved knowledge from the database (public read).
        let settings: Settings = {};
        let knowledge = "";
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const { getSupabasePublishableKey, getSupabaseUrl, loadRuntimeEnv } = await import("@/lib/server-env");
          await loadRuntimeEnv();
          const url = getSupabaseUrl();
          const key = getSupabasePublishableKey();
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
                .limit(120),
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
          "مواردی که با «روش فروش» شروع می‌شوند، راهنمای فروش و روش‌های پرداخت همان شاخه است؛ مانند یک نماینده حرفه‌ای بیمه سامان با لحن مشاوره‌ای از آن‌ها استفاده کن.",
          "اگر پاسخ در دانش تأییدشده نیست، صادقانه بگو و کاربر را به مشاوره تلفنی نمایندگی راهنمایی کن.",
        ]
          .filter(Boolean)
          .join("\n\n");

        const providerId = settings.provider || "lovable";
        const target = await resolveTarget(providerId);
        if (!target.ok) return json(500, { ok: false, error: target.error });

        const model = settings.model || "google/gemini-3.6-flash";
        const body: Record<string, unknown> = {
          model,
          messages: [{ role: "system", content: systemPrompt }, ...parsed.data.messages],
        };
        if (typeof settings.temperature === "number") body.temperature = settings.temperature;
        if (providerId === "lovable" && model.startsWith("openai/gpt-5")) {
          delete body.temperature;
          if (model.startsWith("openai/gpt-5.6")) body.reasoning_effort = "none";
        }

        try {
          const res = await fetch(target.url, {
            method: "POST",
            headers: target.headers,
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("[ai-chat] gateway error", providerId, res.status, text);
            if (res.status === 429) return json(429, { ok: false, error: "rate_limited" });
            if (res.status === 402) return json(402, { ok: false, error: "credits_exhausted" });
            if (res.status === 401 || res.status === 403)
              return json(502, { ok: false, error: "provider_auth_failed" });
            return json(502, { ok: false, error: "gateway_error" });
          }

          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (!reply) return json(502, { ok: false, error: "empty_reply" });
          return json(200, { ok: true, reply, model, provider: providerId });
        } catch (e) {
          console.error("[ai-chat] request failed", e);
          return json(502, { ok: false, error: "gateway_unreachable" });
        }
      },
    },
  },
});
