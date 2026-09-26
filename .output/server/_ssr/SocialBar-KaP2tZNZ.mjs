import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Ce41MEoO.mjs";
import { S as readSetting, a as DEFAULT_BRANDING, b as logoheder_default, u as DEFAULT_SOCIAL_LAYOUT } from "./site-config-DDR4aELm.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { $ as Instagram, J as Linkedin, M as Phone, S as Send, V as MessageCircle, W as Mail, c as Twitter, gt as Facebook, lt as Globe, n as Youtube } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SocialBar-KaP2tZNZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logofooter_default = "/assets/logofooter-BmZ5Hpz5.png";
var navItems = [
	{
		label: "صفحه اصلی",
		href: "/"
	},
	{
		label: "انواع بیمه‌ها",
		href: "/insurance",
		children: [
			{
				label: "بیمه آتش‌سوزی",
				href: "/insurance/fire",
				children: [
					{
						label: "بیمه منازل مسکونی",
						href: "/insurance/fire/residential"
					},
					{
						label: "بیمه آتش‌سوزی صنعتی",
						href: "/insurance/fire/industrial"
					},
					{
						label: "بیمه آتش‌سوزی غیرصنعتی",
						href: "/insurance/fire/non-industrial"
					},
					{
						label: "بیمه عیوب اساسی و پنهان ساختمان",
						href: "/insurance/fire/hidden-defects"
					}
				]
			},
			{
				label: "بیمه اتومبیل",
				href: "/insurance/car",
				children: [
					{
						label: "بیمه شخص ثالث",
						href: "/insurance/car/third-party"
					},
					{
						label: "بیمه بدنه",
						href: "/insurance/car/body"
					},
					{
						label: "بیمه حوادث راننده",
						href: "/insurance/car/driver-accident"
					}
				]
			},
			{
				label: "بیمه باربری",
				href: "/insurance/cargo",
				children: [
					{
						label: "بیمه باربری وارداتی",
						href: "/insurance/cargo/import-cargo"
					},
					{
						label: "بیمه باربری صادراتی",
						href: "/insurance/cargo/export-cargo"
					},
					{
						label: "بیمه باربری داخلی",
						href: "/insurance/cargo/internal-cargo"
					}
				]
			},
			{
				label: "بیمه تجهیزات الکترونیک",
				href: "/insurance/e-e",
				children: [{
					label: "بیمه موبایل و تبلت",
					href: "/insurance/e-e/phone"
				}, {
					label: "بیمه تجهیزات الکترونیک",
					href: "/insurance/e-e/equipment"
				}]
			},
			{
				label: "بیمه درمان",
				href: "/insurance/health",
				children: [
					{
						label: "بیمه درمان خانواده",
						href: "/insurance/health/private-health"
					},
					{
						label: "بیمه درمان گروهی",
						href: "/insurance/health/group"
					},
					{
						label: "بیمه درمان مسافرتی",
						href: "/insurance/health/travel-health"
					}
				]
			},
			{
				label: "بیمه زندگی",
				href: "/insurance/life",
				children: [
					{
						label: "بیمه عمر بر پایه طلا (زرسام)",
						href: "/insurance/life/gold"
					},
					{
						label: "بیمه عمر و سرمایه‌گذاری",
						href: "/insurance/life/investment"
					},
					{
						label: "بیمه عمر زمانی",
						href: "/insurance/life/term"
					},
					{
						label: "بیمه مانده بدهکار",
						href: "/insurance/life/debit-balance"
					},
					{
						label: "بیمه حوادث انفرادی",
						href: "/insurance/life/accident/individual-personal-accident"
					},
					{
						label: "بیمه حوادث گروهی",
						href: "/insurance/life/accident/group-accident"
					}
				]
			},
			{
				label: "بیمه کشتی و هواپیما",
				href: "/insurance/marine-aviation",
				children: [{
					label: "بیمه بدنه شناور",
					href: "/insurance/marine-aviation/hull"
				}, {
					label: "بیمه بدنه هواپیما",
					href: "/insurance/marine-aviation/aircraft"
				}]
			},
			{
				label: "بیمه مسئولیت",
				href: "/insurance/liability",
				children: [
					{
						label: "بیمه مسئولیت کارفرما",
						href: "/insurance/liability/employer"
					},
					{
						label: "بیمه مسئولیت حرفه‌ای پزشکان",
						href: "/insurance/liability/medical"
					},
					{
						label: "بیمه مسئولیت سازندگان ابنیه",
						href: "/insurance/liability/construction"
					},
					{
						label: "بیمه مسئولیت عمومی",
						href: "/insurance/liability/general"
					}
				]
			},
			{
				label: "بیمه مسافرتی",
				href: "/insurance/travel"
			},
			{
				label: "بیمه مهندسی",
				href: "/insurance/engineering",
				children: [
					{
						label: "تمام خطر پیمانکاران",
						href: "/insurance/engineering/contractor-all-risk"
					},
					{
						label: "بیمه سازه‌های تکمیل‌شده",
						href: "/insurance/engineering/completed-structures"
					},
					{
						label: "بیمه ماشین‌آلات",
						href: "/insurance/engineering/machinery"
					}
				]
			},
			{
				label: "بیمه‌های خاص",
				href: "/insurance/special"
			},
			{
				label: "انواع بیمه‌های سامان",
				href: "/insurance"
			}
		]
	},
	{
		label: "فروشگاه آنلاین",
		href: "/third-party",
		children: [{
			label: "بیمه شخص ثالث",
			href: "/third-party"
		}]
	},
	{
		label: "خدمات الکترونیک",
		href: "/e-services",
		children: [
			{
				label: "استعلام وضعیت بیمه‌نامه",
				href: "/e-services/insurance-status"
			},
			{
				label: "کارتابل بیمه‌گذاران",
				href: "/e-services/insured-dashboard"
			},
			{
				label: "پرداخت آنلاین حق بیمه",
				href: "/e-services/insurance-payment"
			}
		]
	},
	{
		label: "همکاران تیم 8452",
		href: "/partners",
		children: [{
			label: "پنل فروش و پورسانت همکاران",
			href: "/partners/dashboard"
		}, {
			label: "درخواست همکاری در فروش",
			href: "/partners/apply"
		}]
	},
	{
		label: "انتقادات و پیشنهادات",
		href: "/suggestions"
	},
	{
		label: "ارتباط با ما",
		href: "/contact"
	},
	{
		label: "مجله و خبر",
		href: "/blog"
	}
];
var SITE_LOGO = logofooter_default;
var SITE_LOGO_HEADER = logoheder_default;
var SITE_CONTACT = {
	address: "لاهیجان، خیابان امام خمینی، روبروی بانک توسعه و تعاون، مجتمع پارادایس",
	mobilePhone: "09116169215",
	landlinePhone: "01342249250",
	email: "info@parsianbimeh.ir"
};
/** Live branding values, readable by every visitor. */
function useBranding() {
	const [branding, setBranding] = (0, import_react.useState)({
		...DEFAULT_BRANDING,
		headerLogoUrl: SITE_LOGO_HEADER,
		footerLogoUrl: SITE_LOGO
	});
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const { data } = await supabase.from("site_settings").select("value").eq("key", "branding").maybeSingle();
			if (!alive || !data?.value) return;
			const v = data.value;
			setBranding((prev) => ({
				...prev,
				...Object.fromEntries(Object.entries(v).filter(([, val]) => val !== "" && val != null))
			}));
		})();
		return () => {
			alive = false;
		};
	}, []);
	return branding;
}
var PLATFORM_META = {
	telegram: {
		color: "#229ED9",
		Icon: Send
	},
	whatsapp: {
		color: "#25D366",
		Icon: MessageCircle
	},
	instagram: {
		color: "#E1306C",
		Icon: Instagram
	},
	facebook: {
		color: "#1877F2",
		Icon: Facebook
	},
	linkedin: {
		color: "#0A66C2",
		Icon: Linkedin
	},
	youtube: {
		color: "#FF0000",
		Icon: Youtube
	},
	x: {
		color: "#111827",
		Icon: Twitter
	},
	phone: {
		color: "#0EA5E9",
		Icon: Phone
	},
	email: {
		color: "#6B7280",
		Icon: Mail
	},
	website: {
		color: "#0F766E",
		Icon: Globe
	},
	eitaa: {
		color: "#F5A623",
		text: "ایتا"
	},
	bale: {
		color: "#00A6A6",
		text: "بله"
	},
	rubika: {
		color: "#8B5CF6",
		text: "روبیکا"
	},
	soroush: {
		color: "#1D4ED8",
		text: "سروش"
	},
	igap: {
		color: "#0891B2",
		text: "آی‌گپ"
	},
	gap: {
		color: "#16A34A",
		text: "گپ"
	},
	viber: {
		color: "#7360F2",
		text: "وایبر"
	},
	aparat: {
		color: "#E11D48",
		text: "آپارات"
	}
};
function SocialIcon({ platform, iconKey, customIconUrl, size, shape = "circle", label }) {
	const meta = PLATFORM_META[(iconKey || platform || "").toLowerCase()] ?? {
		color: "#334155",
		text: (label || platform || "?").slice(0, 4)
	};
	const radius = shape === "circle" ? "9999px" : shape === "rounded" ? "14px" : "4px";
	if (customIconUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: customIconUrl,
		alt: label || platform,
		loading: "lazy",
		style: {
			width: size,
			height: size,
			borderRadius: radius
		},
		className: "object-cover shadow-sm"
	});
	const Icon = meta.Icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: {
			width: size,
			height: size,
			borderRadius: radius,
			backgroundColor: meta.color
		},
		className: "inline-grid place-items-center text-white shadow-sm shrink-0",
		"aria-hidden": "true",
		children: Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-1/2 h-1/2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { fontSize: Math.max(9, size * .3) },
			className: "font-extrabold leading-none px-0.5",
			children: meta.text
		})
	});
}
/**
* Public site: icons only — the username is never printed next to the icon.
* The dashboard preview passes `adminPreview` so the site owner can still see
* which account each icon points to.
*/
function SocialBar({ className = "", adminPreview = false }) {
	const [links, setLinks] = (0, import_react.useState)([]);
	const [layout, setLayout] = (0, import_react.useState)(DEFAULT_SOCIAL_LAYOUT);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [{ data }, cfg] = await Promise.all([supabase.from("social_links").select("*").eq("is_active", true).order("position", { ascending: true }), readSetting("social_layout", DEFAULT_SOCIAL_LAYOUT)]);
			if (!alive) return;
			setLinks(data ?? []);
			setLayout(cfg);
		})();
		return () => {
			alive = false;
		};
	}, []);
	if (links.length === 0) return null;
	const justify = layout.align === "center" ? "justify-center" : layout.align === "end" ? "justify-end" : "justify-start";
	const containerClass = layout.layout === "grid" ? `grid grid-cols-3 sm:grid-cols-4 ${justify}` : layout.layout === "column" ? `flex flex-col ${layout.align === "center" ? "items-center" : layout.align === "end" ? "items-end" : "items-start"}` : `flex flex-wrap items-center ${justify}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${containerClass} ${className}`,
		style: { gap: layout.gap },
		children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: l.url,
			target: l.url.startsWith("http") ? "_blank" : void 0,
			rel: "noopener noreferrer",
			title: l.label,
			"aria-label": l.label,
			className: "flex items-center gap-2 hover:opacity-80 transition",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialIcon, {
				platform: l.platform,
				iconKey: l.icon_key,
				customIconUrl: l.custom_icon_url,
				size: l.size_px,
				shape: layout.shape,
				label: l.label
			}), adminPreview && (layout.showLabels || layout.showUsernames) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs leading-5",
				children: [layout.showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold",
					children: l.label
				}), layout.showUsernames && l.username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "opacity-80 block",
					dir: "ltr",
					children: l.username
				})]
			})]
		}, l.id))
	});
}
//#endregion
export { SocialIcon as a, SocialBar as i, SITE_LOGO as n, navItems as o, SITE_LOGO_HEADER as r, useBranding as s, SITE_CONTACT as t };
