/** Link policy for customer-facing AI answers: internal sources never leak, sales links only from the whitelist. */
export type AiLinkPolicy = {
  enabled: boolean;
  /** Internal-only knowledge sources (domains). Never shown to customers. */
  internalDomains: string[];
  /** The only customer-facing sales domain. */
  salesDomain: string;
  /** Exact, real URLs on the sales domain that may be shown. */
  allowedUrls: string[];
};

export const DEFAULT_LINK_POLICY: AiLinkPolicy = {
  enabled: true,
  internalDomains: ["si24.ir"],
  salesDomain: "saman8452.ir",
  allowedUrls: ["https://saman8452.ir/"],
};

const host = (d: string) =>
  d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

export function normalizePolicy(p?: Partial<AiLinkPolicy> | null): AiLinkPolicy {
  const m = { ...DEFAULT_LINK_POLICY, ...(p ?? {}) };
  return {
    enabled: m.enabled !== false,
    internalDomains: (m.internalDomains ?? []).map(host).filter(Boolean),
    salesDomain: host(m.salesDomain || DEFAULT_LINK_POLICY.salesDomain),
    allowedUrls: (m.allowedUrls ?? []).map((u) => u.trim()).filter(Boolean),
  };
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const URL_RE = /(?:https?:\/\/|www\.)[^\s<>()"'«»،]+/gi;
const canon = (u: string) => u.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/[/.,;:!?]+$/, "").toLowerCase();

function hostOf(u: string): string {
  try {
    return new URL(/^https?:/i.test(u) ? u : `https://${u}`).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Returns a safe replacement for a URL, or "" to drop it. */
function resolveUrl(u: string, p: AiLinkPolicy): string {
  const h = hostOf(u);
  const allowed = p.allowedUrls.find((a) => canon(a) === canon(u));
  if (allowed) return allowed;
  const home = p.allowedUrls.find((a) => hostOf(a) === p.salesDomain && canon(a) === p.salesDomain);
  const isInternal = p.internalDomains.some((d) => h === d || h.endsWith(`.${d}`));
  const isSales = h === p.salesDomain || h.endsWith(`.${p.salesDomain}`);
  // Internal or unverified sales URLs fall back to the verified sales home page (never guessed paths).
  if ((isInternal || isSales) && home) return home;
  return "";
}

/** Sanitizes the final answer shown to customers. */
export function sanitizeCustomerReply(text: string, raw?: Partial<AiLinkPolicy> | null): string {
  const p = normalizePolicy(raw);
  if (!p.enabled) return text;
  let out = text;
  // Markdown links: [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const r = resolveUrl(url, p);
    return r ? `[${label}](${r})` : label;
  });
  // Bare URLs (skip ones already inside markdown parentheses we just produced)
  out = out.replace(URL_RE, (u, offset: number, full: string) => {
    if (full[offset - 1] === "(" && full[offset - 2] === "]") return u;
    return resolveUrl(u, p);
  });
  // Any remaining textual mention of internal domains / brand handle.
  for (const d of p.internalDomains) {
    const base = d.split(".")[0];
    out = out.replace(new RegExp(`(?:www\\.)?${esc(d)}`, "gi"), "");
    if (base.length >= 3) out = out.replace(new RegExp(`\\b${esc(base)}\\b`, "gi"), "");
  }
  return out.replace(/[ \t]{2,}/g, " ").replace(/\(\s*\)/g, "").trim();
}

/** Removes internal-source URLs from knowledge before it reaches the model. */
export function sanitizeKnowledge(text: string, raw?: Partial<AiLinkPolicy> | null): string {
  const p = normalizePolicy(raw);
  if (!p.enabled) return text;
  return text.replace(URL_RE, (u) => {
    const h = hostOf(u);
    return p.internalDomains.some((d) => h === d || h.endsWith(`.${d}`)) ? "" : u;
  });
}

export function policyPrompt(raw?: Partial<AiLinkPolicy> | null): string {
  const p = normalizePolicy(raw);
  if (!p.enabled) return "";
  return [
    "قوانین قطعی لینک و منبع (هرگز نقض نشود):",
    `- منابع داخلی (${p.internalDomains.join("، ") || "—"} و فایل‌های دانش) فقط برای دانش داخلی هستند؛ نام یا آدرس آن‌ها را هرگز به کاربر نگو، معرفی، تبلیغ یا پیشنهاد نکن و کاربر را برای خرید، ثبت درخواست، مشاوره یا مشاهده محصول به آن‌ها هدایت نکن.`,
    `- تنها مرجع خرید، ثبت سفارش، درخواست، مشاوره و هر اقدام تجاری: ${p.salesDomain}`,
    `- فقط این لینک‌های مجاز را در پاسخ بگذار و هرگز لینک حدسی یا ساختگی تولید نکن: ${p.allowedUrls.join(" ، ") || `https://${p.salesDomain}/`}`,
    "- اگر منبع پاسخ را ذکر می‌کنی، فقط عنوان موضوع یا نام دانش را بگو، نه نام یا آدرس سایت منبع داخلی.",
  ].join("\n");
}
