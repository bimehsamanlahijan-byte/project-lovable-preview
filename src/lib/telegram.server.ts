/** Telegram Bot API helpers (server only). */

export type FlowStep = {
  type: "sendMessage" | "sendPhoto" | "delay" | "forward";
  text?: string;
  photoUrl?: string;
  chatIds?: string;
  seconds?: number;
  parseMode?: "HTML" | "Markdown" | "";
  disablePreview?: boolean;
  fromChatId?: string;
  messageId?: number;
};

const API = "https://api.telegram.org";

export async function tg(token: string, method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; result?: unknown; description?: string };
  if (!res.ok || !json.ok) {
    throw new Error(`Telegram ${method} failed [${res.status}]: ${json.description ?? "unknown"}`);
  }
  return json.result;
}

export function parseChatIds(raw: string | null | undefined): string[] {
  return (raw ?? "")
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function runFlowSteps(
  token: string,
  steps: FlowStep[],
  defaultChatIds: string[],
): Promise<{ sent: number; log: string[] }> {
  const log: string[] = [];
  let sent = 0;

  for (const [i, step] of steps.entries()) {
    const targets = step.chatIds ? parseChatIds(step.chatIds) : defaultChatIds;

    if (step.type === "delay") {
      const ms = Math.min(Math.max((step.seconds ?? 1) * 1000, 0), 20000);
      await new Promise((r) => setTimeout(r, ms));
      log.push(`#${i + 1} delay ${ms}ms`);
      continue;
    }

    for (const chat_id of targets) {
      if (step.type === "sendMessage") {
        await tg(token, "sendMessage", {
          chat_id,
          text: step.text ?? "",
          parse_mode: step.parseMode || undefined,
          disable_web_page_preview: step.disablePreview ?? false,
        });
      } else if (step.type === "sendPhoto") {
        await tg(token, "sendPhoto", {
          chat_id,
          photo: step.photoUrl ?? "",
          caption: step.text || undefined,
          parse_mode: step.parseMode || undefined,
        });
      } else if (step.type === "forward") {
        await tg(token, "forwardMessage", {
          chat_id,
          from_chat_id: step.fromChatId ?? "",
          message_id: step.messageId ?? 0,
        });
      }
      sent += 1;
      log.push(`#${i + 1} ${step.type} → ${chat_id}`);
    }
  }

  return { sent, log };
}
