import { a as getSupabaseServiceKey, o as getSupabaseUrl, s as loadRuntimeEnv, t as envValue } from "./server-env-CcxwNfrB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/si24.server-0JV3NeIP.js
/**
* Server-only reader for third-party (شخص ثالث) settings stored in the database.
* The access token can be saved from the dashboard instead of an env variable.
*/
var THIRD_PARTY_SETTING_KEY = "third_party_si24";
var cache = null;
var TTL_MS = 3e4;
/** Reads the saved access token from site_settings (returns null when absent). */
async function readStoredAccessToken() {
	if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
	await loadRuntimeEnv();
	const url = getSupabaseUrl();
	const key = getSupabaseServiceKey();
	if (!url || !key) return null;
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { data } = await createClient(url, key, { auth: {
			persistSession: false,
			autoRefreshToken: false
		} }).from("site_settings").select("value").eq("key", THIRD_PARTY_SETTING_KEY).maybeSingle();
		const raw = data?.value?.token;
		const token = typeof raw === "string" && raw.trim() !== "" ? raw.trim() : null;
		cache = {
			value: token,
			at: Date.now()
		};
		return token;
	} catch (err) {
		console.error("[third-party] reading stored settings failed", err);
		return null;
	}
}
async function config() {
	await loadRuntimeEnv();
	const stored = await readStoredAccessToken();
	return {
		baseUrl: (envValue("SI24_API_BASE_URL") ?? "https://3rdparty-shop-api.si24.ir").replace(/\/+$/, ""),
		token: stored ?? envValue("SI24_ACCESS_TOKEN", "SI24_API_TOKEN", "SI24_BEARER_TOKEN"),
		requestId: envValue("SI24_REQUEST_ID"),
		timeoutMs: Number(envValue("SI24_TIMEOUT_MS") ?? 2e4)
	};
}
/** پیام‌های کاربرپسند برای هر وضعیت خطا */
function friendlyMessage(status, apiMessage) {
	if (apiMessage && apiMessage.trim() && status < 500) return apiMessage.trim();
	switch (status) {
		case 0: return "ارتباط با سامانه استعلام برقرار نشد. اتصال اینترنت خود را بررسی کنید.";
		case 408: return "پاسخ سامانه استعلام در زمان مجاز دریافت نشد. دوباره تلاش کنید.";
		case 400: return "اطلاعات ارسال‌شده مورد قبول سامانه استعلام نیست. ورودی‌ها را بررسی کنید.";
		case 401:
		case 403: return "دسترسی به سامانه استعلام تأیید نشد. لطفاً کمی بعد دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.";
		case 404: return "اطلاعات درخواستی در سامانه استعلام یافت نشد.";
		case 409: return "برای این پلاک درخواست فعالی وجود دارد.";
		case 429: return "تعداد درخواست‌ها زیاد است. چند لحظه بعد دوباره تلاش کنید.";
		default: return "سامانه استعلام در حال حاضر پاسخ‌گو نیست. لطفاً بعداً تلاش کنید.";
	}
}
async function si24Request(path, init = {}) {
	const cfg = await config();
	if (!cfg.token) {
		console.error("[si24] access credential is not configured");
		return {
			ok: false,
			status: 503,
			error: "connection_error",
			message: "ارتباط با سامانه استعلام برقرار نشد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید."
		};
	}
	const url = `${cfg.baseUrl}${path}`;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json"
	};
	if (cfg.token) headers["Authorization"] = `Bearer ${cfg.token}`;
	const rid = init.requestId ?? cfg.requestId;
	if (rid) headers["request-id"] = rid;
	try {
		const res = await fetch(url, {
			method: init.method ?? "GET",
			headers,
			signal: controller.signal,
			...init.body !== void 0 ? { body: JSON.stringify(init.body) } : {}
		});
		const text = await res.text();
		let parsed = void 0;
		try {
			parsed = text ? JSON.parse(text) : void 0;
		} catch {
			parsed = void 0;
		}
		if (!res.ok) {
			console.error("[si24] request failed", {
				url,
				status: res.status,
				body: text.slice(0, 800)
			});
			return {
				ok: false,
				status: res.status,
				error: "si24_error",
				message: friendlyMessage(res.status, parsed?.message)
			};
		}
		return {
			ok: true,
			status: res.status,
			data: parsed?.data ?? parsed
		};
	} catch (err) {
		const aborted = err?.name === "AbortError";
		console.error("[si24] network error", {
			url,
			error: String(err)
		});
		return {
			ok: false,
			status: aborted ? 408 : 0,
			error: aborted ? "timeout" : "network_error",
			message: friendlyMessage(aborted ? 408 : 0)
		};
	} finally {
		clearTimeout(timer);
	}
}
//#endregion
export { si24Request };
