/**
 * Central login registry (client-safe).
 *
 * Every module of the site that can be protected, and every login provider the
 * system knows about, is declared here. Adding a new provider later only means
 * adding an entry plus its server-side handler — the admin UI, the guards and
 * the logs pick it up automatically.
 */

export type LoginMode = "required" | "optional" | "none";

export type ModuleKey =
  | "third_party"
  | "inquiries"
  | "ai_chat"
  | "live_chat"
  | "damage_report"
  | "documents";

export const LOGIN_MODULES: { key: ModuleKey; label: string }[] = [
  { key: "third_party", label: "استعلام و خرید بیمه شخص ثالث" },
  { key: "inquiries", label: "سایر استعلام‌ها" },
  { key: "ai_chat", label: "چت هوش مصنوعی" },
  { key: "live_chat", label: "چت آنلاین" },
  { key: "damage_report", label: "اعلام خسارت" },
  { key: "documents", label: "مخزن مدارک مشتریان" },
];

export type ProviderId = "telegram" | "phone" | "email" | "google";

export const LOGIN_PROVIDERS: {
  id: ProviderId;
  label: string;
  /** Implemented and usable right now. */
  available: boolean;
  startPath?: string;
}[] = [
  { id: "telegram", label: "ورود با تلگرام", available: true, startPath: "/api/public/auth/telegram/start" },
  { id: "phone", label: "ورود با شماره موبایل", available: false },
  { id: "email", label: "ورود با ایمیل", available: false },
  { id: "google", label: "ورود با گوگل", available: false },
];

export const LOGIN_MODE_LABELS: Record<LoginMode, string> = {
  required: "ورود اجباری",
  optional: "ورود اختیاری",
  none: "بدون نیاز به ورود",
};

export type LoginRequirement = {
  module_key: string;
  label: string | null;
  mode: LoginMode;
  methods: string[];
  updated_at?: string;
};

export type PublicUser = {
  id: string;
  displayName: string | null;
  phone: string | null;
  hasPhoneConsent: boolean;
  provider: string;
  telegram: {
    id: string;
    username: string | null;
    photo: string | null;
    verified: boolean;
  } | null;
};

export const TELEGRAM_CALLBACK_PATH = "/api/public/auth/telegram/callback";
export const TELEGRAM_START_PATH = "/api/public/auth/telegram/start";

/** Free AI chat questions granted after a Telegram login. */
export const AI_CHAT_FREE_QUESTIONS = 5;
