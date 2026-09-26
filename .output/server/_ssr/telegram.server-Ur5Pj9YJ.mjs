//#region node_modules/.nitro/vite/services/ssr/assets/telegram.server-Ur5Pj9YJ.js
var API = "https://api.telegram.org";
async function tg(token, method, body) {
	const res = await fetch(`${API}/bot${token}/${method}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	const json = await res.json();
	if (!res.ok || !json.ok) throw new Error(`Telegram ${method} failed [${res.status}]: ${json.description ?? "unknown"}`);
	return json.result;
}
function parseChatIds(raw) {
	return (raw ?? "").split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
}
async function runFlowSteps(token, steps, defaultChatIds) {
	const log = [];
	let sent = 0;
	for (const [i, step] of steps.entries()) {
		const targets = step.chatIds ? parseChatIds(step.chatIds) : defaultChatIds;
		if (step.type === "delay") {
			const ms = Math.min(Math.max((step.seconds ?? 1) * 1e3, 0), 2e4);
			await new Promise((r) => setTimeout(r, ms));
			log.push(`#${i + 1} delay ${ms}ms`);
			continue;
		}
		for (const chat_id of targets) {
			if (step.type === "sendMessage") await tg(token, "sendMessage", {
				chat_id,
				text: step.text ?? "",
				parse_mode: step.parseMode || void 0,
				disable_web_page_preview: step.disablePreview ?? false
			});
			else if (step.type === "sendPhoto") await tg(token, "sendPhoto", {
				chat_id,
				photo: step.photoUrl ?? "",
				caption: step.text || void 0,
				parse_mode: step.parseMode || void 0
			});
			else if (step.type === "forward") await tg(token, "forwardMessage", {
				chat_id,
				from_chat_id: step.fromChatId ?? "",
				message_id: step.messageId ?? 0
			});
			sent += 1;
			log.push(`#${i + 1} ${step.type} → ${chat_id}`);
		}
	}
	return {
		sent,
		log
	};
}
//#endregion
export { parseChatIds, runFlowSteps, tg };
