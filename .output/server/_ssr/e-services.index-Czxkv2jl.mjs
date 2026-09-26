import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Nt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { o as navItems } from "./SocialBar-KaP2tZNZ.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/e-services.index-Czxkv2jl.js
var import_jsx_runtime = require_jsx_runtime();
function EServicesIndex() {
	const items = navItems.find((n) => n.label === "خدمات الکترونیک")?.children ?? [];
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
						children: "خدمات الکترونیک"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base opacity-90 max-w-2xl leading-7",
						children: "خدمات آنلاین بیمه سامان را به‌صورت شبانه‌روزی و بدون مراجعه حضوری دریافت کنید."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "container mx-auto px-4 py-12 md:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
					children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: c.href ?? "#",
						className: "group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm md:text-base group-hover:text-primary transition",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5 text-primary opacity-70 group-hover:-translate-x-1 transition" })]
					}, c.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { EServicesIndex as component };
