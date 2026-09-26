import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as Phone, Nt as ChevronLeft, jt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ItemPage-XRZNggAV.js
var import_jsx_runtime = require_jsx_runtime();
function ItemPage({ title, subtitle, breadcrumbs = [], highlights = [], children, ctaLabel = "مشاوره و خرید آنلاین", ctaHref = "/contact" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceWheel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "page-hero gradient-hero text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto px-4 py-12 md:py-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								className: "hover:underline",
								children: "خانه"
							}), breadcrumbs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3 h-3" }), c.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: c.href,
									className: "hover:underline",
									children: c.label
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label })]
							}, c.label))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl md:text-4xl font-extrabold mb-3",
							children: title
						}),
						subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm md:text-base opacity-90 max-w-2xl leading-7",
							children: subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: ctaHref,
							className: "inline-flex items-center gap-2 mt-6 bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-sm shadow-glow hover:scale-105 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), ctaLabel]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "container mx-auto px-4 py-12 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-2 space-y-6",
						children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm md:text-base leading-8 text-muted-foreground",
							children: [
								"این صفحه مربوط به «",
								title,
								"» است. برای دریافت اطلاعات کامل، مشاوره رایگان و خرید آنلاین بیمه‌نامه با کارشناسان بیمه سامان در ارتباط باشید."
							]
						})
					}), highlights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl shadow-soft p-6 sticky top-28",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-lg font-extrabold mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-5 bg-gradient-to-b from-primary to-primary-glow rounded-full" }), "پوشش‌ها و مزایا"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2 text-sm leading-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-primary flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h })]
								}, h))
							})]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { ItemPage as t };
