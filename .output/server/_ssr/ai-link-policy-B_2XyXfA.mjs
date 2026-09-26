import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-link-policy-B_2XyXfA.js
var ai_link_policy_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_LINK_POLICY: () => DEFAULT_LINK_POLICY,
	normalizePolicy: () => normalizePolicy,
	policyPrompt: () => policyPrompt,
	sanitizeCustomerReply: () => sanitizeCustomerReply,
	sanitizeKnowledge: () => sanitizeKnowledge
});
var DEFAULT_LINK_POLICY = {
	enabled: true,
	internalDomains: ["si24.ir"],
	salesDomain: "saman8452.ir",
	allowedUrls: ["https://saman8452.ir/"]
};
var host = (d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
function normalizePolicy(p) {
	const m = {
		...DEFAULT_LINK_POLICY,
		...p ?? {}
	};
	return {
		enabled: m.enabled !== false,
		internalDomains: (m.internalDomains ?? []).map(host).filter(Boolean),
		salesDomain: host(m.salesDomain || DEFAULT_LINK_POLICY.salesDomain),
		allowedUrls: (m.allowedUrls ?? []).map((u) => u.trim()).filter(Boolean)
	};
}
var esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var URL_RE = /(?:https?:\/\/|www\.)[^\s<>()"'«»،]+/gi;
var canon = (u) => u.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/[/.,;:!?]+$/, "").toLowerCase();
function hostOf(u) {
	try {
		return new URL(/^https?:/i.test(u) ? u : `https://${u}`).hostname.replace(/^www\./, "").toLowerCase();
	} catch {
		return "";
	}
}
/** Returns a safe replacement for a URL, or "" to drop it. */
function resolveUrl(u, p) {
	const h = hostOf(u);
	const allowed = p.allowedUrls.find((a) => canon(a) === canon(u));
	if (allowed) return allowed;
	const home = p.allowedUrls.find((a) => hostOf(a) === p.salesDomain && canon(a) === p.salesDomain);
	const isInternal = p.internalDomains.some((d) => h === d || h.endsWith(`.${d}`));
	const isSales = h === p.salesDomain || h.endsWith(`.${p.salesDomain}`);
	if ((isInternal || isSales) && home) return home;
	return "";
}
/** Sanitizes the final answer shown to customers. */
function sanitizeCustomerReply(text, raw) {
	const p = normalizePolicy(raw);
	if (!p.enabled) return text;
	let out = text;
	out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
		const r = resolveUrl(url, p);
		return r ? `[${label}](${r})` : label;
	});
	out = out.replace(URL_RE, (u, offset, full) => {
		if (full[offset - 1] === "(" && full[offset - 2] === "]") return u;
		return resolveUrl(u, p);
	});
	for (const d of p.internalDomains) {
		const base = d.split(".")[0];
		out = out.replace(new RegExp(`(?:www\\.)?${esc(d)}`, "gi"), "");
		if (base.length >= 3) out = out.replace(new RegExp(`\\b${esc(base)}\\b`, "gi"), "");
	}
	return out.replace(/[ \t]{2,}/g, " ").replace(/\(\s*\)/g, "").trim();
}
/** Removes internal-source URLs from knowledge before it reaches the model. */
function sanitizeKnowledge(text, raw) {
	const p = normalizePolicy(raw);
	if (!p.enabled) return text;
	return text.replace(URL_RE, (u) => {
		const h = hostOf(u);
		return p.internalDomains.some((d) => h === d || h.endsWith(`.${d}`)) ? "" : u;
	});
}
function policyPrompt(raw) {
	const p = normalizePolicy(raw);
	if (!p.enabled) return "";
	return [
		"قوانین قطعی لینک و منبع (هرگز نقض نشود):",
		`- منابع داخلی (${p.internalDomains.join("، ") || "—"} و فایل‌های دانش) فقط برای دانش داخلی هستند؛ نام یا آدرس آن‌ها را هرگز به کاربر نگو، معرفی، تبلیغ یا پیشنهاد نکن و کاربر را برای خرید، ثبت درخواست، مشاوره یا مشاهده محصول به آن‌ها هدایت نکن.`,
		`- تنها مرجع خرید، ثبت سفارش، درخواست، مشاوره و هر اقدام تجاری: ${p.salesDomain}`,
		`- فقط این لینک‌های مجاز را در پاسخ بگذار و هرگز لینک حدسی یا ساختگی تولید نکن: ${p.allowedUrls.join(" ، ") || `https://${p.salesDomain}/`}`,
		"- اگر منبع پاسخ را ذکر می‌کنی، فقط عنوان موضوع یا نام دانش را بگو، نه نام یا آدرس سایت منبع داخلی."
	].join("\n");
}
//#endregion
export { ai_link_policy_exports as n, DEFAULT_LINK_POLICY as t };
