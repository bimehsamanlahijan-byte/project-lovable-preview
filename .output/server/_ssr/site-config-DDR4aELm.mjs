import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as supabase } from "./client-Ce41MEoO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-config-DDR4aELm.js
var site_config_DDR4aELm_exports = /* @__PURE__ */ __exportAll({
	C: () => logoheder_default,
	S: () => site_config_exports,
	_: () => VE_ANIMATIONS,
	a: () => DEFAULT_BRANDING,
	b: () => pickWheelBgIndex,
	c: () => DEFAULT_HERO_SLIDER,
	d: () => DEFAULT_SPLASH,
	f: () => DEFAULT_WHEEL_BACKGROUND,
	g: () => SOCIAL_PLATFORMS,
	h: () => GITHUB_SETTING_KEY,
	i: () => DEFAULT_AI_AGENCY,
	l: () => DEFAULT_LIVE_CHAT,
	m: () => DEFAULT_WIDGETS,
	n: () => DEFAULT_AI,
	o: () => DEFAULT_DOCS,
	p: () => DEFAULT_WHEEL_INTRO,
	r: () => DEFAULT_AI_ADVISOR,
	s: () => DEFAULT_GITHUB_SYNC,
	t: () => DASHBOARD_LOGO,
	u: () => DEFAULT_SOCIAL_LAYOUT,
	v: () => WHEEL_BG_MODES,
	x: () => readSetting,
	y: () => WHEEL_INNER_MODES
});
var logoheder_default = "/assets/logoheder-DarmsdwL.png";
var site_config_exports = /* @__PURE__ */ __exportAll$1({
	DASHBOARD_LOGO: () => DASHBOARD_LOGO,
	DEFAULT_AI: () => DEFAULT_AI,
	DEFAULT_AI_ADVISOR: () => DEFAULT_AI_ADVISOR,
	DEFAULT_AI_AGENCY: () => DEFAULT_AI_AGENCY,
	DEFAULT_BRANDING: () => DEFAULT_BRANDING,
	DEFAULT_DOCS: () => DEFAULT_DOCS,
	DEFAULT_GITHUB_SYNC: () => DEFAULT_GITHUB_SYNC,
	DEFAULT_HERO_SLIDER: () => DEFAULT_HERO_SLIDER,
	DEFAULT_LIVE_CHAT: () => DEFAULT_LIVE_CHAT,
	DEFAULT_SOCIAL_LAYOUT: () => DEFAULT_SOCIAL_LAYOUT,
	DEFAULT_SPLASH: () => DEFAULT_SPLASH,
	DEFAULT_WHEEL_BACKGROUND: () => DEFAULT_WHEEL_BACKGROUND,
	DEFAULT_WHEEL_INTRO: () => DEFAULT_WHEEL_INTRO,
	DEFAULT_WIDGETS: () => DEFAULT_WIDGETS,
	GITHUB_SETTING_KEY: () => GITHUB_SETTING_KEY,
	SOCIAL_PLATFORMS: () => SOCIAL_PLATFORMS,
	VE_ANIMATIONS: () => VE_ANIMATIONS,
	WHEEL_BG_MODES: () => WHEEL_BG_MODES,
	WHEEL_INNER_MODES: () => WHEEL_INNER_MODES,
	pickWheelBgIndex: () => pickWheelBgIndex,
	readSetting: () => readSetting
});
var DEFAULT_AI_AGENCY = {
	name: "بیمه سامان — نمایندگی آذرخش (لاهیجان)",
	address: "لاهیجان، خیابان امام خمینی، روبروی بانک توسعه و تعاون، مجتمع پارادایس",
	landline: "01342249250",
	mobile: "09116169215",
	telegram: "",
	email: "info@parsianbimeh.ir",
	hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
	note: "صدور، تمدید و مشاوره همه رشته‌های بیمه سامان فقط از طریق همین نمایندگی و همین وب‌سایت."
};
var DEFAULT_AI_ADVISOR = {
	consultative: true,
	analyze: true,
	maxWords: 320
};
var DEFAULT_SOCIAL_LAYOUT = {
	layout: "row",
	align: "start",
	gap: 12,
	shape: "circle",
	showLabels: false,
	showUsernames: true
};
var DEFAULT_AI = {
	enabled: true,
	provider: "lovable",
	model: "google/gemini-3.6-flash",
	title: "دستیار هوشمند بیمه سامان",
	welcome: "سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.",
	systemPrompt: "شما دستیار هوشمند و مشاور بیمه در نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی پاسخ دهید، اطلاعات محصولات بیمه سامان را تفسیر و تحلیل کنید و اولویت پاسخ همیشه دانش تأییدشده نمایندگی است.",
	temperature: .4,
	linkPolicy: {
		enabled: true,
		internalDomains: ["si24.ir"],
		salesDomain: "saman8452.ir",
		allowedUrls: ["https://saman8452.ir/"]
	},
	agency: DEFAULT_AI_AGENCY,
	advisor: DEFAULT_AI_ADVISOR
};
var DEFAULT_LIVE_CHAT = {
	enabled: true,
	title: "چت روم آنلاین",
	welcome: "به چت روم آنلاین نمایندگی آذرخش خوش آمدید."
};
var DEFAULT_DOCS = {
	enabled: true,
	title: "ارسال مدارک بیمه",
	maxSizeMb: 10,
	acceptedTypes: "image/*,application/pdf"
};
var DEFAULT_WIDGETS = {
	widthPx: 370,
	heightPx: 560,
	launcherSizePx: 56,
	aiIconUrl: "",
	chatIconUrl: "",
	aiLauncherLabel: "مشاور هوشمند",
	chatLauncherLabel: "چت روم آنلاین",
	showSocialInChat: true,
	socialTitle: "گفتگو در شبکه‌های اجتماعی"
};
var SOCIAL_PLATFORMS = [
	{
		value: "telegram",
		label: "تلگرام"
	},
	{
		value: "whatsapp",
		label: "واتساپ"
	},
	{
		value: "instagram",
		label: "اینستاگرام"
	},
	{
		value: "eitaa",
		label: "ایتا"
	},
	{
		value: "bale",
		label: "بله"
	},
	{
		value: "rubika",
		label: "روبیکا"
	},
	{
		value: "soroush",
		label: "سروش پلاس"
	},
	{
		value: "igap",
		label: "آی‌گپ"
	},
	{
		value: "gap",
		label: "گپ"
	},
	{
		value: "viber",
		label: "وایبر"
	},
	{
		value: "facebook",
		label: "فیسبوک"
	},
	{
		value: "x",
		label: "ایکس (توییتر)"
	},
	{
		value: "linkedin",
		label: "لینکدین"
	},
	{
		value: "youtube",
		label: "یوتیوب"
	},
	{
		value: "aparat",
		label: "آپارات"
	},
	{
		value: "phone",
		label: "تلفن"
	},
	{
		value: "email",
		label: "ایمیل"
	},
	{
		value: "website",
		label: "وب‌سایت"
	}
];
async function readSetting(key, fallback) {
	const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
	if (error || !data?.value) return fallback;
	return {
		...fallback,
		...data.value
	};
}
var DASHBOARD_LOGO = logoheder_default;
var DEFAULT_BRANDING = {
	siteTitle: "بیمه سامان — نمایندگی آذرخش",
	siteDescription: "خدمات بیمه‌ای سامان، صدور آنلاین و پیگیری خسارت — نمایندگی آذرخش",
	headerLogoUrl: "",
	footerLogoUrl: "",
	faviconUrl: "",
	dashboardLogoUrl: DASHBOARD_LOGO,
	logoHeightHeader: 48,
	logoHeightFooter: 40,
	logoHeightDashboard: 34,
	brandFont: ""
};
var DEFAULT_SPLASH = {
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
	oncePerSession: false
};
var DEFAULT_HERO_SLIDER = {
	autoplay: true,
	autoplayMs: 5e3,
	loop: true,
	fit: "cover",
	heightMode: "ratio",
	ratioW: 1200,
	ratioH: 360,
	heightPx: 420,
	mobileCtaScale: 75,
	mobileDotsScale: 70,
	slides: []
};
var WHEEL_INNER_MODES = [
	{
		v: "full",
		label: "نمایش کامل (مثل صفحه اصلی)"
	},
	{
		v: "collapse",
		label: "جمع‌شده (باز و بسته شدن نرم)"
	},
	{
		v: "modal",
		label: "پنجره پاپ‌آپ"
	},
	{
		v: "bubble",
		label: "دایره کوچک شناور"
	}
];
var DEFAULT_WHEEL_INTRO = {
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
	tickerBarAnim: "slide"
};
var VE_ANIMATIONS = [
	{
		v: "",
		label: "بدون انیمیشن"
	},
	{
		v: "ve-fade-in",
		label: "محو شدن (Fade)"
	},
	{
		v: "ve-slide-up",
		label: "بالا آمدن"
	},
	{
		v: "ve-slide-right",
		label: "ورود از راست"
	},
	{
		v: "ve-slide-left",
		label: "ورود از چپ"
	},
	{
		v: "ve-zoom-in",
		label: "بزرگ‌نمایی"
	},
	{
		v: "ve-bounce",
		label: "پرش"
	},
	{
		v: "ve-pulse",
		label: "تپش"
	},
	{
		v: "ve-shake",
		label: "لرزش"
	},
	{
		v: "ve-float",
		label: "شناور"
	},
	{
		v: "ve-flip",
		label: "چرخش سه‌بعدی"
	},
	{
		v: "ve-glow",
		label: "درخشش"
	}
];
var GITHUB_SETTING_KEY = "github_sync";
var DEFAULT_GITHUB_SYNC = {
	autoSync: false,
	accounts: []
};
var DEFAULT_WHEEL_BACKGROUND = {
	enabled: true,
	mode: "interval",
	intervalMs: 8e3,
	fadeMs: 900,
	fit: "cover",
	overlay: 25,
	images: []
};
[
	"بانک سامان",
	"سامان‌بوم",
	"تامین سرمایه سامان",
	"کارگزاری سامان",
	"لیزینگ سامان",
	"صرافی سامان"
].map((title, index) => ({
	id: `partner-${index + 1}`,
	title,
	description: "",
	imageUrl: "",
	buttonLabel: "",
	buttonHref: "#"
}));
var WHEEL_BG_MODES = [
	{
		v: "static",
		label: "ثابت (فقط تصویر اول)"
	},
	{
		v: "interval",
		label: "اسلاید زمان‌دار (لحظه‌ای)"
	},
	{
		v: "hourly",
		label: "تغییر ساعتی"
	},
	{
		v: "daily",
		label: "تغییر روزانه"
	},
	{
		v: "monthly",
		label: "تغییر ماهانه"
	},
	{
		v: "seasonal",
		label: "تغییر فصلی"
	}
];
/** Picks the active background image index for the given time. */
function pickWheelBgIndex(cfg, now, tick) {
	const n = cfg.images.length;
	if (n === 0) return -1;
	switch (cfg.mode) {
		case "static": return 0;
		case "interval": return tick % n;
		case "hourly": return now.getHours() % n;
		case "daily": {
			const start = new Date(now.getFullYear(), 0, 0);
			return Math.floor((now.getTime() - start.getTime()) / 864e5) % n;
		}
		case "monthly": return now.getMonth() % n;
		case "seasonal": return Math.floor((now.getMonth() + 1) % 12 / 3) % n;
		default: return 0;
	}
}
//#endregion
export { site_config_DDR4aELm_exports as C, readSetting as S, VE_ANIMATIONS as _, DEFAULT_BRANDING as a, logoheder_default as b, DEFAULT_HERO_SLIDER as c, DEFAULT_SPLASH as d, DEFAULT_WHEEL_BACKGROUND as f, SOCIAL_PLATFORMS as g, GITHUB_SETTING_KEY as h, DEFAULT_AI_AGENCY as i, DEFAULT_LIVE_CHAT as l, DEFAULT_WIDGETS as m, DEFAULT_AI as n, DEFAULT_DOCS as o, DEFAULT_WHEEL_INTRO as p, DEFAULT_AI_ADVISOR as r, DEFAULT_GITHUB_SYNC as s, DASHBOARD_LOGO as t, DEFAULT_SOCIAL_LAYOUT as u, WHEEL_BG_MODES as v, pickWheelBgIndex as x, WHEEL_INNER_MODES as y };
