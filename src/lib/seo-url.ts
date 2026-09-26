/**
 * URL helpers for the SEO tools (client-safe).
 *
 * Fixes duplicated addresses such as
 *   https://bimehsaman8452.ir/https://bimehsaman8452.ir
 * and provides the second-domain fallback + plain-language fetch errors.
 */

export const PRIMARY_DOMAIN = "https://bimehsaman8452.ir";
export const SECONDARY_DOMAIN = "https://saman8452.ir";

/** Returns a clean origin ("https://host") from any messy input, or "". */
export function cleanOrigin(input: string | undefined | null): string {
  let raw = (input || "").trim();
  if (!raw) return "";
  // Keep only the LAST absolute URL when the address was pasted twice.
  const all = raw.match(/https?:\/\/[^\s]+?(?=https?:\/\/|$)/gi);
  if (all && all.length > 1) raw = all[all.length - 1]!;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw.replace(/^\/+/, "")}`;
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
}

/** Joins an origin and a path without ever duplicating the domain. */
export function joinUrl(origin: string, path: string): string {
  const base = cleanOrigin(origin);
  const p = (path || "/").trim();
  if (/^https?:\/\//i.test(p)) {
    // Path itself is an absolute URL (possibly doubled) — clean it.
    const o = cleanOrigin(p);
    try {
      const last = p.slice(p.toLowerCase().lastIndexOf("http"));
      const u = new URL(last);
      return o + u.pathname + u.search;
    } catch {
      return o || p;
    }
  }
  return base + (p.startsWith("/") ? p : `/${p}`);
}

/** Replaces the origin of a URL (used for the second-domain fallback). */
export function swapOrigin(url: string, origin: string): string {
  try {
    const u = new URL(url);
    return cleanOrigin(origin) + u.pathname + u.search;
  } catch {
    return url;
  }
}

/** Turns HTTP/network errors into a simple Persian explanation. */
export function explainFetchError(error: string | undefined): string {
  const e = String(error || "");
  if (/\b522\b/.test(e))
    return "خطای ۵۲۲: Cloudflare نتوانست به سرور (هاست) سایت وصل شود. یعنی سایت پشت Cloudflare است ولی هاست خاموش، کند یا IP آن در Cloudflare اشتباه ثبت شده است.";
  if (/\b521\b/.test(e)) return "خطای ۵۲۱: سرور سایت اتصال Cloudflare را رد کرد (وب‌سرور هاست خاموش است).";
  if (/\b52[34]\b/.test(e)) return "خطای Cloudflare: سرور سایت در زمان مقرر پاسخ نداد.";
  if (/\b404\b/.test(e)) return "خطای ۴۰۴: این صفحه روی سایت وجود ندارد.";
  if (/\b403\b/.test(e)) return "خطای ۴۰۳: سایت اجازه خواندن صفحه را نداد (فایروال یا محافظ ربات).";
  if (/\b5\d\d\b/.test(e)) return `خطای سرور سایت (${e}).`;
  if (/fetch failed|timeout|ENOTFOUND|network/i.test(e)) return "به سایت وصل نشد (دامنه در دسترس نیست یا زمان پاسخ تمام شد).";
  return e || "خطای نامشخص";
}
