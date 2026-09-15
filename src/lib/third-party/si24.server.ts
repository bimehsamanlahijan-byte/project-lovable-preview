/**
 * Server-side proxy to the SI24 third-party insurance API.
 * Credentials live only here (environment variables) — never in the browser.
 */
import { envValue, loadRuntimeEnv } from "@/lib/server-env";
import { readStoredAccessToken } from "./settings.server";

export const SI24_DEFAULT_BASE = "https://3rdparty-shop-api.si24.ir";

async function config() {
  await loadRuntimeEnv();
  const stored = await readStoredAccessToken();
  return {
    baseUrl: (envValue("SI24_API_BASE_URL") ?? SI24_DEFAULT_BASE).replace(/\/+$/, ""),
    token: stored ?? envValue("SI24_ACCESS_TOKEN", "SI24_API_TOKEN", "SI24_BEARER_TOKEN"),
    requestId: envValue("SI24_REQUEST_ID"),
    timeoutMs: Number(envValue("SI24_TIMEOUT_MS") ?? 20000),
  };
}

/** True when the access credential needed for the inquiry system is available. */
export async function hasAccessCredential(): Promise<boolean> {
  return Boolean((await config()).token);
}

export type Si24Result<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  message?: string;
};

/** پیام‌های کاربرپسند برای هر وضعیت خطا */
export function friendlyMessage(status: number, apiMessage?: string): string {
  if (apiMessage && apiMessage.trim() && status < 500) return apiMessage.trim();
  switch (status) {
    case 0:
      return "ارتباط با سامانه استعلام برقرار نشد. اتصال اینترنت خود را بررسی کنید.";
    case 408:
      return "پاسخ سامانه استعلام در زمان مجاز دریافت نشد. دوباره تلاش کنید.";
    case 400:
      return "اطلاعات ارسال‌شده مورد قبول سامانه استعلام نیست. ورودی‌ها را بررسی کنید.";
    case 401:
    case 403:
      return "دسترسی به سامانه استعلام تأیید نشد. لطفاً کمی بعد دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.";
    case 404:
      return "اطلاعات درخواستی در سامانه استعلام یافت نشد.";
    case 409:
      return "برای این پلاک درخواست فعالی وجود دارد.";
    case 429:
      return "تعداد درخواست‌ها زیاد است. چند لحظه بعد دوباره تلاش کنید.";
    default:
      return "سامانه استعلام در حال حاضر پاسخ‌گو نیست. لطفاً بعداً تلاش کنید.";
  }
}

export async function si24Request<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown; requestId?: string } = {},
): Promise<Si24Result<T>> {
  const cfg = await config();
  if (!cfg.token) {
    console.error("[si24] access credential is not configured");
    return {
      ok: false,
      status: 503,
      error: "connection_error",
      message: "ارتباط با سامانه استعلام برقرار نشد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.",
    };
  }
  const url = `${cfg.baseUrl}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (cfg.token) headers["Authorization"] = `Bearer ${cfg.token}`;
  const rid = init.requestId ?? cfg.requestId;
  if (rid) headers["request-id"] = rid;

  try {
    const res = await fetch(url, {
      method: init.method ?? "GET",
      headers,
      signal: controller.signal,
      ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
    });
    const text = await res.text();
    let parsed: any = undefined;
    try {
      parsed = text ? JSON.parse(text) : undefined;
    } catch {
      parsed = undefined;
    }

    if (!res.ok) {
      console.error("[si24] request failed", {
        url,
        status: res.status,
        body: text.slice(0, 800),
      });
      return {
        ok: false,
        status: res.status,
        error: "si24_error",
        message: friendlyMessage(res.status, parsed?.message),
      };
    }
    return { ok: true, status: res.status, data: (parsed?.data ?? parsed) as T };
  } catch (err) {
    const aborted = (err as Error)?.name === "AbortError";
    console.error("[si24] network error", { url, error: String(err) });
    return {
      ok: false,
      status: aborted ? 408 : 0,
      error: aborted ? "timeout" : "network_error",
      message: friendlyMessage(aborted ? 408 : 0),
    };
  } finally {
    clearTimeout(timer);
  }
}
