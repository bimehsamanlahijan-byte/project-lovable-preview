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

/** The only contact/sales details the assistant may ever hand to a customer. */
export type AiAgencyInfo = {
  name: string;
  address: string;
  landline: string;
  mobile: string;
  telegram: string;
  email: string;
  hours: string;
  note: string;
};

/** Consultative analyst behaviour of the assistant. */
export type AiAdvisorSettings = {
  /** Act as an insurance consultant (interpret, compare, recommend). */
  consultative: boolean;
  /** Include the analysis step (pros, limits, comparison). */
  analyze: boolean;
  /** Soft answer-length target in words. */
  maxWords: number;
};

export type AiAssistantSettings = {
  enabled: boolean;
  /** Provider id from src/lib/ai-providers.ts (lovable, cloudflare, google, ...). */
  provider: string;
  model: string;
  title: string;
  welcome: string;
  systemPrompt: string;
  temperature: number;
  linkPolicy?: import("./ai-link-policy").AiLinkPolicy;
  agency?: AiAgencyInfo;
  advisor?: AiAdvisorSettings;
};

export const DEFAULT_AI_AGENCY: AiAgencyInfo = {
  name: "بیمه سامان — نمایندگی آذرخش (لاهیجان)",
  address: "لاهیجان، خیابان امام خمینی، روبروی بانک توسعه و تعاون، مجتمع پارادایس",
  landline: "01342249250",
  mobile: "09116169215",
  telegram: "",
  email: "info@parsianbimeh.ir",
  hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
  note: "صدور، تمدید و مشاوره همه رشته‌های بیمه سامان فقط از طریق همین نمایندگی و همین وب‌سایت.",
};

export const DEFAULT_AI_ADVISOR: AiAdvisorSettings = {
  consultative: true,
  analyze: true,
  maxWords: 320,
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
  provider: "lovable",
  model: "google/gemini-3.6-flash",
  title: "دستیار هوشمند بیمه سامان",
  welcome: "سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.",
  systemPrompt:
    "شما دستیار هوشمند و مشاور بیمه در نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی پاسخ دهید، اطلاعات محصولات بیمه سامان را تفسیر و تحلیل کنید و اولویت پاسخ همیشه دانش تأییدشده نمایندگی است.",
  temperature: 0.4,
  linkPolicy: { enabled: true, internalDomains: ["si24.ir"], salesDomain: "saman8452.ir", allowedUrls: ["https://saman8452.ir/"] },
  agency: DEFAULT_AI_AGENCY,
  advisor: DEFAULT_AI_ADVISOR,
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

export const DASHBOARD_LOGO = headerLogo;

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
  mobileCtaScale: number;
  mobileDotsScale: number;
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
  mobileCtaScale: 75,
  mobileDotsScale: 70,
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
  centerImageSizeDesktop: number;
  centerImageSizeTablet: number;
  centerImageSizeMobile: number;
  centerTitle: string;
  centerSubtitle: string;
  /* needle length per breakpoint (px) */
  needleLenDesktop: number;
  needleLenTablet: number;
  needleLenMobile: number;
  /* orbit geometry per breakpoint */
  wheelRadiusDesktop: number;
  wheelRadiusTablet: number;
  wheelRadiusMobile: number;
  wheelItemSizeDesktop: number;
  wheelItemSizeTablet: number;
  wheelItemSizeMobile: number;
  /* center text offset per breakpoint (px) */
  centerTextXDesktop: number;
  centerTextYDesktop: number;
  centerTextXTablet: number;
  centerTextYTablet: number;
  centerTextXMobile: number;
  centerTextYMobile: number;
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
  { v: "none", label: "بدون انیمیشن" },
  { v: "slide", label: "جابجایی نرم (Slide)" },
  { v: "pulse", label: "تپش ملایم" },
  { v: "wave", label: "موج" },
] as const;

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
  centerImageSizeDesktop: 56,
  centerImageSizeTablet: 54,
  centerImageSizeMobile: 42,
  centerTitle: "بیمه‌نامه‌های سامان",
  centerSubtitle: "روی هر بیمه قرار بگیرید",
  needleLenDesktop: 150,
  needleLenTablet: 160,
  needleLenMobile: 82,
  wheelRadiusDesktop: 41,
  wheelRadiusTablet: 41,
  wheelRadiusMobile: 38,
  wheelItemSizeDesktop: 68,
  wheelItemSizeTablet: 64,
  wheelItemSizeMobile: 44,
  centerTextXDesktop: 0,
  centerTextYDesktop: 0,
  centerTextXTablet: 0,
  centerTextYTablet: 0,
  centerTextXMobile: 0,
  centerTextYMobile: 0,
  innerMode: "collapse",
  innerLabel: "ارائه کلیه خدمات بیمه‌ای در سریع‌ترین زمان ممکن",
  innerAnimMs: 500,
  tickerGapPx: 320,
  tickerSpeedSec: 40,
  tickerSchematic: true,
  tickerBarColorA: "#f87171",
  tickerBarColorB: "#3b5a86",
  tickerBarAnim: "slide",
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

/* ---------- Wheel section background (editable image / timed slideshow) ---------- */
export type WheelBgImage = {
  url: string;
  label: string;
  /** Zoom in percent (100 = original cover size). */
  zoom: number;
  /** Focal point in percent. */
  posX: number;
  posY: number;
  /** Optional targeting used by the calendar modes. */
  season?: 0 | 1 | 2 | 3 | null;
  month?: number | null;
  hour?: number | null;
};

export type WheelBackgroundSettings = {
  enabled: boolean;
  /** static | interval (timed slideshow) | hourly | daily | monthly | seasonal */
  mode: "static" | "interval" | "hourly" | "daily" | "monthly" | "seasonal";
  intervalMs: number;
  fadeMs: number;
  fit: "cover" | "contain";
  /** White veil over the photo so the text stays readable (0..100). */
  overlay: number;
  images: WheelBgImage[];
};

export const DEFAULT_WHEEL_BACKGROUND: WheelBackgroundSettings = {
  enabled: true,
  mode: "interval",
  intervalMs: 8000,
  fadeMs: 900,
  fit: "cover",
  overlay: 25,
  images: [],
};

export type WheelWidgetSettings = {
  enabled: boolean;
  name: string;
  html: string;
};

export const DEFAULT_WHEEL_WIDGET: WheelWidgetSettings = {
  enabled: false,
  name: "",
  html: "",
};

export type HomeArticle = {
  id: string;
  title: string;
  excerpt: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  href: string;
};

export type HomePartner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  buttonHref: string;
};

export type HomeContentSettings = {
  appImageUrl: string;
  appTitle: string;
  appDescription: string;
  appButtonLabel: string;
  appButtonHref: string;
  articles: HomeArticle[];
  partners: HomePartner[];
};

export const DEFAULT_HOME_CONTENT: HomeContentSettings = {
  appImageUrl: "",
  appTitle: "اپلیکیشن بیمه سامان",
  appDescription:
    "با اپلیکیشن بیمه سامان، تجربه‌ای جدید از مدیریت بیمه‌های خود را در دستانتان خواهید داشت. این اپلیکیشن به شما امکان می‌دهد به راحتی و در هر زمان و مکانی به تمامی خدمات بیمه‌ای خود دسترسی پیدا کنید.",
  appButtonLabel: "دانلود اپلیکیشن",
  appButtonHref: "#",
  articles: [
    { id: "article-1", title: "ذخایر فنی مؤسسات بیمه - مصوب ۸۷/۱۰/۲۵", excerpt: "شورای عالی بیمه در راستای اجرای ماده ۶۱ قانون تأسیس بیمه مرکزی ایران و بیمه‌گری...", mediaUrl: "", mediaType: "image", href: "#" },
    { id: "article-2", title: "شرایط عمومی بیمه نامه تجهیزات و ماشین‌آلات پیمانکاری", excerpt: "نظر به پیشنهاد کتبی بیمه‌گزار مذکور مشخصات، شرکت سهامی بیمه سامان...", mediaUrl: "", mediaType: "image", href: "#" },
    { id: "article-3", title: "شرایط ثبت‌نام بیمه تامین اجتماعی", excerpt: "داشتن بیمه تامین اجتماعی، اولین قدم برای پشتیبانی مالی و سرمایه‌گذاری روی آینده است...", mediaUrl: "", mediaType: "image", href: "#" },
    { id: "article-4", title: "پرداخت دیه به نرخ روز", excerpt: "آیا می‌دانید اگر بین زمان حادثه و پرداخت خسارت چند ماه یا حتی چند سال فاصله بیفتد...", mediaUrl: "", mediaType: "image", href: "#" },
  ],
  partners: ["بانک سامان", "سامان‌بوم", "تامین سرمایه سامان", "کارگزاری سامان", "لیزینگ سامان", "صرافی سامان"].map((title, index) => ({
    id: `partner-${index + 1}`,
    title,
    description: "",
    imageUrl: "",
    buttonLabel: "",
    buttonHref: "#",
  })),
};

export type WeeklyEventAnimation = "fade" | "slide" | "zoom" | "float" | "pulse";
export type WeeklyEventBanner = {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  href: string;
  side: "left" | "right";
  slot: number;
  animation: WeeklyEventAnimation;
  widgetHtml: string;
  widgetName: string;
  enabled: boolean;
};

export type WeeklyEventsSettings = { banners: WeeklyEventBanner[] };
export const DEFAULT_WEEKLY_EVENTS: WeeklyEventsSettings = { banners: [] };

export const WHEEL_BG_MODES = [
  { v: "static", label: "ثابت (فقط تصویر اول)" },
  { v: "interval", label: "اسلاید زمان‌دار (لحظه‌ای)" },
  { v: "hourly", label: "تغییر ساعتی" },
  { v: "daily", label: "تغییر روزانه" },
  { v: "monthly", label: "تغییر ماهانه" },
  { v: "seasonal", label: "تغییر فصلی" },
] as const;

/** Picks the active background image index for the given time. */
export function pickWheelBgIndex(cfg: WheelBackgroundSettings, now: Date, tick: number): number {
  const n = cfg.images.length;
  if (n === 0) return -1;
  switch (cfg.mode) {
    case "static":
      return 0;
    case "interval":
      return tick % n;
    case "hourly":
      return now.getHours() % n;
    case "daily": {
      const start = new Date(now.getFullYear(), 0, 0);
      const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
      return day % n;
    }
    case "monthly":
      return now.getMonth() % n;
    case "seasonal":
      return Math.floor(((now.getMonth() + 1) % 12) / 3) % n;
    default:
      return 0;
  }
}
