import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Nt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-BOdO8RPO.js
var import_jsx_runtime = require_jsx_runtime();
var posts = [
	"زرسام بیمه سامان؛ نسل جدید بیمه‌های زندگی با سرمایه‌گذاری مبتنی بر طلا",
	"میانگین پرداخت روزانه خسارت بیمه سامان، بیش از ۳۷ میلیارد تومان",
	"رکورد ۱۴ هزار تراکنش در اپلیکیشن بیمه سامان؛ خدمات پایدار",
	"پایداری مداوم شریان پاسخگویی بیمه سامان در دوران بحران",
	"پرداخت ۳۷۰ میلیارد ریال خسارت به بیمه‌گزار شرکت بیمه سامان",
	"شرایط عمومی بیمه تمام خطر نصب",
	"مالیات نقل و انتقال خودرو",
	"تفاوت برگ سبز و سند خودرو",
	"شرایط عمومی بیمه‌نامه عیوب اساسی و پنهان ساختمان"
];
function Blog() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceWheel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "page-hero gradient-hero text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto px-4 py-12 md:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-extrabold mb-3",
						children: "مجله و خبر"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base opacity-90 max-w-2xl leading-7",
						children: "آخرین اخبار، مقالات آموزشی و راهنمای بیمه‌های سامان را اینجا دنبال کنید."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "container mx-auto px-4 py-12 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
					children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#",
						className: "group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm md:text-base leading-7 group-hover:text-primary transition",
							children: p
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-xs text-primary opacity-80",
							children: ["ادامه مطلب ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })]
						})]
					}, p))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Blog as component };
