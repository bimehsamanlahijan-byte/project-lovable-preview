import headerLogo from "@/assets/logoheder.png";
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
  title: "ط¯ط³طھغŒط§ط± ظ‡ظˆط´ظ…ظ†ط¯ ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ†",
  welcome: "ط³ظ„ط§ظ…! ط¯ط±ط¨ط§ط±ظ‡ ط§ظ†ظˆط§ط¹ ط¨غŒظ…ظ‡â€Œظ‡ط§غŒ ط³ط§ظ…ط§ظ†طŒ ط´ط±ط§غŒط· ظˆ ظ…ط¯ط§ط±ع© ط§ط² ظ…ظ† ط¨ظ¾ط±ط³غŒط¯.",
  systemPrompt:
    "ط´ظ…ط§ ط¯ط³طھغŒط§ط± ظ‡ظˆط´ظ…ظ†ط¯ ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´ ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ† ظ‡ط³طھغŒط¯. ظپظ‚ط· ط¨ظ‡ ظپط§ط±ط³غŒ ظ¾ط§ط³ط® ط¯ظ‡غŒط¯ ظˆ طھظ†ظ‡ط§ ط¨ط± ط§ط³ط§ط³ ط¯ط§ظ†ط´ طھط£غŒغŒط¯ط´ط¯ظ‡ ظ¾ط§ط³ط® ط¯ظ‡غŒط¯.",
  temperature: 0.4,
};

export const DEFAULT_LIVE_CHAT: LiveChatSettings = {
  enabled: true,
  title: "ع†طھ ط±ظˆظ… ط¢ظ†ظ„ط§غŒظ†",
  welcome: "ط¨ظ‡ ع†طھ ط±ظˆظ… ط¢ظ†ظ„ط§غŒظ† ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´ ط®ظˆط´ ط¢ظ…ط¯غŒط¯.",
};

export const DEFAULT_DOCS: DocsIntakeSettings = {
  enabled: true,
  title: "ط§ط±ط³ط§ظ„ ظ…ط¯ط§ط±ع© ط¨غŒظ…ظ‡",
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
  aiLauncherLabel: "ظ…ط´ط§ظˆط± ظ‡ظˆط´ظ…ظ†ط¯",
  chatLauncherLabel: "ع†طھ ط±ظˆظ… ط¢ظ†ظ„ط§غŒظ†",
  showSocialInChat: true,
  socialTitle: "ع¯ظپطھع¯ظˆ ط¯ط± ط´ط¨ع©ظ‡â€Œظ‡ط§غŒ ط§ط¬طھظ…ط§ط¹غŒ",
};


export const AI_MODELS = [
  { value: "google/gemini-3.6-flash", label: "Gemini 3.6 Flash (ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ â€” ط³ط±غŒط¹)" },
  { value: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { value: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (ع©ظ…â€Œظ‡ط²غŒظ†ظ‡)" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (ط¯ظ‚غŒظ‚â€Œطھط±)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5.6-terra", label: "GPT-5.6 Terra" },
  { value: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna (ط³ط±غŒط¹)" },
  { value: "openai/gpt-5.4-mini", label: "GPT-5.4 Mini" },
  { value: "openai/gpt-5.5", label: "GPT-5.5 (ظ‚ظˆغŒâ€Œطھط±غŒظ†)" },
];

export const SOCIAL_PLATFORMS = [
  { value: "telegram", label: "طھظ„ع¯ط±ط§ظ…" },
  { value: "whatsapp", label: "ظˆط§طھط³ط§ظ¾" },
  { value: "instagram", label: "ط§غŒظ†ط³طھط§ع¯ط±ط§ظ…" },
  { value: "eitaa", label: "ط§غŒطھط§" },
  { value: "bale", label: "ط¨ظ„ظ‡" },
  { value: "rubika", label: "ط±ظˆط¨غŒع©ط§" },
  { value: "soroush", label: "ط³ط±ظˆط´ ظ¾ظ„ط§ط³" },
  { value: "igap", label: "ط¢غŒâ€Œع¯ظ¾" },
  { value: "gap", label: "ع¯ظ¾" },
  { value: "viber", label: "ظˆط§غŒط¨ط±" },
  { value: "facebook", label: "ظپغŒط³ط¨ظˆع©" },
  { value: "x", label: "ط§غŒع©ط³ (طھظˆغŒغŒطھط±)" },
  { value: "linkedin", label: "ظ„غŒظ†ع©ط¯غŒظ†" },
  { value: "youtube", label: "غŒظˆطھغŒظˆط¨" },
  { value: "aparat", label: "ط¢ظ¾ط§ط±ط§طھ" },
  { value: "phone", label: "طھظ„ظپظ†" },
  { value: "email", label: "ط§غŒظ…غŒظ„" },
  { value: "website", label: "ظˆط¨â€Œط³ط§غŒطھ" },
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

export const DASHBOARD_LOGO = headerLogo;

export const DEFAULT_BRANDING: Branding = {
  siteTitle: "ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ† â€” ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´",
  siteDescription: "ط®ط¯ظ…ط§طھ ط¨غŒظ…ظ‡â€Œط§غŒ ط³ط§ظ…ط§ظ†طŒ طµط¯ظˆط± ط¢ظ†ظ„ط§غŒظ† ظˆ ظ¾غŒع¯غŒط±غŒ ط®ط³ط§ط±طھ â€” ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´",
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
  /* announcement ticker */
  tickerGapPx: number;
  tickerSpeedSec: number;
  tickerSchematic: boolean;
  tickerBarColorA: string;
  tickerBarColorB: string;
  tickerBarAnim: "none" | "slide" | "pulse" | "wave";
};

export const TICKER_BAR_ANIMS = [
  { v: "none", label: "ط¨ط¯ظˆظ† ط§ظ†غŒظ…غŒط´ظ†" },
  { v: "slide", label: "ط¬ط§ط¨ط¬ط§غŒغŒ ظ†ط±ظ… (Slide)" },
  { v: "pulse", label: "طھظ¾ط´ ظ…ظ„ط§غŒظ…" },
  { v: "wave", label: "ظ…ظˆط¬" },
] as const;

export const WHEEL_INNER_MODES = [
  { v: "full", label: "ظ†ظ…ط§غŒط´ ع©ط§ظ…ظ„ (ظ…ط«ظ„ طµظپط­ظ‡ ط§طµظ„غŒ)" },
  { v: "collapse", label: "ط¬ظ…ط¹â€Œط´ط¯ظ‡ (ط¨ط§ط² ظˆ ط¨ط³طھظ‡ ط´ط¯ظ† ظ†ط±ظ…)" },
  { v: "modal", label: "ظ¾ظ†ط¬ط±ظ‡ ظ¾ط§ظ¾â€Œط¢ظ¾" },
  { v: "bubble", label: "ط¯ط§غŒط±ظ‡ ع©ظˆع†ع© ط´ظ†ط§ظˆط±" },
] as const;

export const DEFAULT_WHEEL_INTRO: WheelIntroSettings = {
  enabled: true,
  buttonText: "ط®ط±غŒط¯ ط¢ظ†ظ„ط§غŒظ† ط¨غŒظ…ظ‡",
  hintText: "ط¨ط±ط§غŒ ط¯غŒط¯ظ† ظ‡ظ…ظ‡ ط¨غŒظ…ظ‡â€Œظ†ط§ظ…ظ‡â€Œظ‡ط§ ع©ظ„غŒع© ع©ظ†غŒط¯",
  animation: "explode",
  durationMs: 900,
  particles: true,
  float: true,
  buttonScale: 1,
  buttonX: 0,
  buttonY: 0,
  centerImageUrl: "",
  centerImageSize: 56,
  centerTitle: "ط¨غŒظ…ظ‡â€Œظ†ط§ظ…ظ‡â€Œظ‡ط§غŒ ط³ط§ظ…ط§ظ†",
  centerSubtitle: "ط±ظˆغŒ ظ‡ط± ط¨غŒظ…ظ‡ ظ‚ط±ط§ط± ط¨ع¯غŒط±غŒط¯",
  innerMode: "collapse",
  innerLabel: "ط§ط±ط§ط¦ظ‡ ع©ظ„غŒظ‡ ط®ط¯ظ…ط§طھ ط¨غŒظ…ظ‡â€Œط§غŒ ط¯ط± ط³ط±غŒط¹â€Œطھط±غŒظ† ط²ظ…ط§ظ† ظ…ظ…ع©ظ†",
  innerAnimMs: 500,
  tickerGapPx: 320,
  tickerSpeedSec: 40,
  tickerSchematic: true,
  tickerBarColorA: "#f87171",
  tickerBarColorB: "#3b5a86",
  tickerBarAnim: "slide",
};


export const VE_ANIMATIONS = [
  { v: "", label: "ط¨ط¯ظˆظ† ط§ظ†غŒظ…غŒط´ظ†" },
  { v: "ve-fade-in", label: "ظ…ط­ظˆ ط´ط¯ظ† (Fade)" },
  { v: "ve-slide-up", label: "ط¨ط§ظ„ط§ ط¢ظ…ط¯ظ†" },
  { v: "ve-slide-right", label: "ظˆط±ظˆط¯ ط§ط² ط±ط§ط³طھ" },
  { v: "ve-slide-left", label: "ظˆط±ظˆط¯ ط§ط² ع†ظ¾" },
  { v: "ve-zoom-in", label: "ط¨ط²ط±ع¯â€Œظ†ظ…ط§غŒغŒ" },
  { v: "ve-bounce", label: "ظ¾ط±ط´" },
  { v: "ve-pulse", label: "طھظ¾ط´" },
  { v: "ve-shake", label: "ظ„ط±ط²ط´" },
  { v: "ve-float", label: "ط´ظ†ط§ظˆط±" },
  { v: "ve-flip", label: "ع†ط±ط®ط´ ط³ظ‡â€Œط¨ط¹ط¯غŒ" },
  { v: "ve-glow", label: "ط¯ط±ط®ط´ط´" },
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


