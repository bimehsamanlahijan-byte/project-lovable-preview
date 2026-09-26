import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { B as MessageSquarePlus, Gt as ArrowLeft, It as ChartColumn, o as Users } from "../_libs/lucide-react.mjs";
import { t as ItemPage } from "./ItemPage-XRZNggAV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners-uCxPcLvZ.js
var import_jsx_runtime = require_jsx_runtime();
function PartnersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ItemPage, {
		title: "همکاران تیم 8452",
		subtitle: "به باشگاه بازاریابان و همکاران معرف تیم 8452 بیمه سامان خوش آمدید؛ فروش خود را ثبت کنید و وضعیت پورسانت را لحظه‌ای ببینید.",
		breadcrumbs: [{ label: "همکاران تیم 8452" }],
		ctaLabel: "ورود به پنل همکاران",
		ctaHref: "/partners/dashboard",
		highlights: [
			"مشاهده درصد پورسانت اختصاصی هر همکار",
			"گزارش میزان فروش به تفکیک شاخه بیمه‌ای",
			"ثبت انتقاد و پیشنهاد با کد رهگیری"
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 text-sm md:text-base leading-8 text-muted-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تیم ۸۴۵۲ مجموعه‌ای از بازاریابان و همکاران معرف بیمه سامان است. هر همکار با کد اختصاصی خود می‌تواند وارد پنل همکاران شود و وضعیت پورسانت، میزان فروش و انواع بیمه‌نامه‌هایی را که در هر شاخه بیمه‌ای فروخته است مشاهده کند." })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid md:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/partners/apply",
					className: "group bg-card rounded-3xl p-6 shadow-elegant border border-border hover:border-primary hover:-translate-y-1 transition block",
					"aria-label": "عضویت در تیم ۸۴۵۲ و ثبت درخواست همکاری",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-8 h-8 text-primary mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-extrabold mb-2",
							children: "عضویت در تیم"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-7",
							children: "فرم درخواست همکاری را تکمیل کنید تا اطلاعات شما برای بررسی عضویت در تیم ۸۴۵۲ ثبت شود."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-4 inline-flex items-center gap-1 text-primary text-sm font-bold",
							children: ["تکمیل فرم درخواست", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 transition-transform group-hover:-translate-x-1" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/partners/dashboard",
					className: "bg-card rounded-3xl p-6 shadow-elegant border border-border hover:border-primary transition block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-8 h-8 text-primary mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-extrabold mb-2",
							children: "پنل فروش و پورسانت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-7",
							children: "با کد همکاری خود وارد شوید و گزارش فروش و پورسانت‌تان را ببینید."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/suggestions",
					className: "bg-card rounded-3xl p-6 shadow-elegant border border-border hover:border-primary transition block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "w-8 h-8 text-primary mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-extrabold mb-2",
							children: "انتقادات و پیشنهادات"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-7",
							children: "نظر، انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید."
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { PartnersPage as component };
