import { supabase } from "@/integrations/supabase/client";

export type SocialLayout = {
  layout: "row" | "grid" | "column";
  align: "start" | "center" | "end";
  gap: number;
  shape: "circle" | "rounded" | "square";
  showLabels: boolean;
  showUsernames: boolean;
};

export type AiAssistantSettings = {
  enabled: boolean;
  model: string;
  title: string;
  welcome: string;
  systemPrompt: string;
  temperature: number;
};

export type LiveChatSettings = { enabled: boolean; title: string; welcome: string };
export type DocsIntakeSettings = {
  enabled: boolean;
  title: string;
  maxSizeMb: number;
  acceptedTypes: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  username: string | null;
  url: string;
  icon_key: string | null;
  custom_icon_url: string | null;
  size_px: number;
  position: number;
  is_active: boolean;
};

export const DEFAULT_SOCIAL_LAYOUT: SocialLayout = {
  layout: "row",
  align: "start",
  gap: 12,
  shape: "circle",
  showLabels: false,
  showUsernames: true,
};

export const DEFAULT_AI: AiAssistantSettings = {
  enabled: true,
  model: "google/gemini-3.6-flash",
  title: "دستیار هوشمند بیمه سامان",
  welcome: "سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.",
  systemPrompt:
    "شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی پاسخ دهید و تنها بر اساس دانش تأییدشده پاسخ دهید.",
  temperature: 0.4,
};

export const DEFAULT_LIVE_CHAT: LiveChatSettings = {
  enabled: true,
  title: "چت روم آنلاین",
  welcome: "به چت روم آنلاین نمایندگی آذرخش خوش آمدید.",
};

export const DEFAULT_DOCS: DocsIntakeSettings = {
  enabled: true,
  title: "ارسال مدارک بیمه",
  maxSizeMb: 10,
  acceptedTypes: "image/*,application/pdf",
};

/* ---------- Floating widgets (live chat + AI assistant) ---------- */
export type WidgetsAppearance = {
  widthPx: number;
  heightPx: number;
  launcherSizePx: number;
  aiIconUrl: string;
  chatIconUrl: string;
  aiLauncherLabel: string;
  chatLauncherLabel: string;
  showSocialInChat: boolean;
  socialTitle: string;
};

export const DEFAULT_WIDGETS: WidgetsAppearance = {
  widthPx: 370,
  heightPx: 560,
  launcherSizePx: 56,
  aiIconUrl: "",
  chatIconUrl: "",
  aiLauncherLabel: "مشاور هوشمند",
  chatLauncherLabel: "چت روم آنلاین",
  showSocialInChat: true,
  socialTitle: "گفتگو در شبکه‌های اجتماعی",
};


export const AI_MODELS = [
  { value: "google/gemini-3.6-flash", label: "Gemini 3.6 Flash (پیشنهادی — سریع)" },
  { value: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (کم‌هزینه)" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (دقیق‌تر)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5.6-terra", label: "GPT-5.6 Terra" },
  { value: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna (سریع)" },
  { value: "openai/gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { value: "openai/gpt-5.5", label: "GPT-5.5 (قوی‌ترین)" },
];

export const SOCIAL_PLATFORMS = [
  { value: "telegram", label: "تلگرام" },
  { value: "whatsapp", label: "واتساپ" },
  { value: "instagram", label: "اینستاگرام" },
  { value: "eitaa", label: "ایتا" },
  { value: "bale", label: "بله" },
  { value: "rubika", label: "روبیکا" },
  { value: "soroush", label: "سروش پلاس" },
  { value: "igap", label: "آی‌گپ" },
  { value: "gap", label: "گپ" },
  { value: "viber", label: "وایبر" },
  { value: "facebook", label: "فیسبوک" },
  { value: "x", label: "ایکس (توییتر)" },
  { value: "linkedin", label: "لینکدین" },
  { value: "youtube", label: "یوتیوب" },
  { value: "aparat", label: "آپارات" },
  { value: "phone", label: "تلفن" },
  { value: "email", label: "ایمیل" },
  { value: "website", label: "وب‌سایت" },
];

export async function readSetting<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (error || !data?.value) return fallback;
  return { ...fallback, ...(data.value as object) } as T;
}

export async function writeSetting(key: string, value: unknown) {
  return supabase.from("site_settings").upsert({ key, value: value as never, updated_at: new Date().toISOString() });
}

export function sessionId() {
  if (typeof window === "undefined") return "ssr";
  const k = "azarakhsh_session_id";
  let v = window.localStorage.getItem(k);
  if (!v) {
    v = Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(k, v);
  }
  return v;
}

/* ---------- Branding (logos, icons, titles) ---------- */
export type Branding = {
  siteTitle: string;
  siteDescription: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  dashboardLogoUrl: string;
  logoHeightHeader: number;
  logoHeightFooter: number;
  logoHeightDashboard: number;
  brandFont: string;
};

export const DASHBOARD_LOGO = "https://si8452.ir/img/logoheder.png";

export const DEFAULT_BRANDING: Branding = {
  siteTitle: "بیمه سامان — نمایندگی آذرخش",
  siteDescription: "خدمات بیمه‌ای سامان، صدور آنلاین و پیگیری خسارت — نمایندگی آذرخش",
  headerLogoUrl: "",
  footerLogoUrl: "",
  faviconUrl: "",
  dashboardLogoUrl: DASHBOARD_LOGO,
  logoHeightHeader: 48,
  logoHeightFooter: 40,
  logoHeightDashboard: 34,
  brandFont: "",
};

/* ---------- Splash / preloader screen (Cloudflare-style logo before entry) ---------- */
export type SplashSettings = {
  enabled: boolean;
  logoUrl: string;
  /** Raw HTML/SVG embed used instead of an uploaded logo when filled. */
  logoCode: string;
  logoHeight: number;
  bgColor: string;
  barColor: string;
  showBar: boolean;
  text: string;
  textColor: string;
  minMs: number;
  oncePerSession: boolean;
};

export const DEFAULT_SPLASH: SplashSettings = {
  enabled: true,
  logoUrl: DASHBOARD_LOGO,
  logoCode: "",
  logoHeight: 72,
  bgColor: "#ffffff",
  barColor: "#0b1e3f",
  showBar: true,
  text: "",
  textColor: "#0b1e3f",
  minMs: 900,
  oncePerSession: false,
};

/* ---------- Hero slider (editable from the visual editor) ---------- */
export type HeroSlide = {
  img: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
};

export type HeroSliderSettings = {
  autoplay: boolean;
  autoplayMs: number;
  loop: boolean;
  fit: "cover" | "contain";
  heightMode: "ratio" | "fixed";
  ratioW: number;
  ratioH: number;
  heightPx: number;
  slides: HeroSlide[];
};

export const DEFAULT_HERO_SLIDER: HeroSliderSettings = {
  autoplay: true,
  autoplayMs: 5000,
  loop: true,
  fit: "cover",
  heightMode: "ratio",
  ratioW: 1200,
  ratioH: 360,
  heightPx: 420,
  slides: [],
};

/* ---------- Wheel intro (buy-online CTA + reveal animation) ---------- */
export type WheelIntroSettings = {
  enabled: boolean;
  buttonText: string;
  hintText: string;
  animation: "explode" | "zoom" | "spin" | "flip" | "fade";
  durationMs: number;
  particles: boolean;
  /* floating CTA placement */
  float: boolean;
  buttonScale: number;
  buttonX: number;
  buttonY: number;
  /* center disc of the wheel */
  centerImageUrl: string;
  centerImageSize: number;
  centerTitle: string;
  centerSubtitle: string;
  /* how the section behaves on inner pages (non-home) */
  innerMode: "full" | "collapse" | "modal" | "bubble";
  innerLabel: string;
  innerAnimMs: number;
};

export const WHEEL_INNER_MODES = [
  { v: "full", label: "نمایش کامل (مثل صفحه اصلی)" },
  { v: "collapse", label: "جمع‌شده (باز و بسته شدن نرم)" },
  { v: "modal", label: "پنجره پاپ‌آپ" },
  { v: "bubble", label: "دایره کوچک شناور" },
] as const;

export const DEFAULT_WHEEL_INTRO: WheelIntroSettings = {
  enabled: true,
  buttonText: "خرید آنلاین بیمه",
  hintText: "برای دیدن همه بیمه‌نامه‌ها کلیک کنید",
  animation: "explode",
  durationMs: 900,
  particles: true,
  float: true,
  buttonScale: 1,
  buttonX: 0,
  buttonY: 0,
  centerImageUrl: "",
  centerImageSize: 56,
  centerTitle: "بیمه‌نامه‌های سامان",
  centerSubtitle: "روی هر بیمه قرار بگیرید",
  innerMode: "collapse",
  innerLabel: "ارائه کلیه خدمات بیمه‌ای در سریع‌ترین زمان ممکن",
  innerAnimMs: 500,
};


export const VE_ANIMATIONS = [
  { v: "", label: "بدون انیمیشن" },
  { v: "ve-fade-in", label: "محو شدن (Fade)" },
  { v: "ve-slide-up", label: "بالا آمدن" },
  { v: "ve-slide-right", label: "ورود از راست" },
  { v: "ve-slide-left", label: "ورود از چپ" },
  { v: "ve-zoom-in", label: "بزرگ‌نمایی" },
  { v: "ve-bounce", label: "پرش" },
  { v: "ve-pulse", label: "تپش" },
  { v: "ve-shake", label: "لرزش" },
  { v: "ve-float", label: "شناور" },
  { v: "ve-flip", label: "چرخش سه‌بعدی" },
  { v: "ve-glow", label: "درخشش" },
];

/* ---------- GitHub sync ---------- */
export const GITHUB_SETTING_KEY = "github_sync";

export type GithubAccount = {
  id: string;
  label: string;
  secretName: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  isDefault: boolean;
};

export type GithubSyncSettings = {
  autoSync: boolean;
  accounts: GithubAccount[];
};

export const DEFAULT_GITHUB_SYNC: GithubSyncSettings = {
  autoSync: false,
  accounts: [],
};
