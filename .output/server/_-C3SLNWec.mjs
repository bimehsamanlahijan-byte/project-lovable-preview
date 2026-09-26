import { r as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { M as Phone, Tt as Construction, jt as CircleCheck, y as ShieldCheck } from "./_libs/lucide-react.mjs";
import { o as navItems, t as SITE_CONTACT } from "./_ssr/SocialBar-KaP2tZNZ.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/SiteFooter-HIYvUQRB.mjs";
import { v as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as InsuranceWheel } from "./_ssr/InsuranceWheel-CM9D7N44.mjs";
import { t as insuranceContent } from "./_ssr/insurance-content-BZZMaCrZ.mjs";
import { t as hubContent } from "./_ssr/insurance-hubs-y-2JY2Q6.mjs";
import { n as pageImage, t as LongformSections } from "./_ssr/LongformSections-1Q75GVwA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_-C3SLNWec.js
var import_jsx_runtime = require_jsx_runtime();
var allContent = {
	...insuranceContent,
	...hubContent
};
function findLabel(path) {
	const target = "/" + path.replace(/^\/+|\/+$/g, "");
	const stack = [...navItems];
	while (stack.length) {
		const item = stack.shift();
		if (item.href === target) return item.label;
		if (item.children) stack.push(...item.children);
	}
	return null;
}
function DynamicPage() {
	const { _splat } = useParams({ strict: false });
	const fullPath = "/" + (_splat ?? "").replace(/^\/+|\/+$/g, "");
	if (allContent[fullPath]) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentPage, { path: fullPath });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderConstruction, {});
}
function ContentPage({ path }) {
	const content = allContent[path];
	const navLabel = findLabel(path) ?? content.title;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceWheel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "page-hero relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: pageImage(path),
						alt: content.title,
						width: 1280,
						height: 720,
						className: "absolute inset-0 w-full h-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 gradient-hero opacity-90" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative container mx-auto px-4 py-16 md:py-24 text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/",
										className: "hover:underline",
										children: "خانه"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/insurance",
										className: "hover:underline",
										children: "انواع بیمه‌ها"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: navLabel })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow",
								children: content.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm md:text-lg opacity-95 max-w-3xl leading-9",
								children: content.intro
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 mt-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/insurance",
									className: "bg-white/15 backdrop-blur border border-white/30 rounded-full px-6 py-3 text-sm font-bold hover:bg-white/25 transition",
									children: "مشاهده همه بیمه‌ها"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${SITE_CONTACT.mobilePhone}`,
									dir: "ltr",
									className: "bg-card text-primary rounded-full px-6 py-3 text-sm font-extrabold shadow-soft hover:shadow-glow transition inline-flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }),
										" ",
										SITE_CONTACT.mobilePhone
									]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "container mx-auto px-4 py-12 grid md:grid-cols-2 gap-6",
				children: [content.coverages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl shadow-soft p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-extrabold",
							children: "پوشش‌های بیمه‌ای"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: content.coverages.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm leading-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl shadow-soft p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-extrabold",
							children: "مزایا"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: content.benefits.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm leading-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b })]
						}, i))
					})]
				})]
			}),
			content.faq && content.faq.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "container mx-auto px-4 pb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-extrabold mb-4",
					children: "سؤالات متداول"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: content.faq.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold mb-2 text-sm",
							children: f.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-7",
							children: f.a
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LongformSections, { path }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "container mx-auto px-4 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-3xl shadow-soft p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold mb-3",
							children: "دریافت مشاوره و استعلام قیمت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mb-6 text-sm leading-7",
							children: "جهت دریافت مشاوره رایگان و استعلام قیمت با کارشناسان ما تماس بگیرید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-3 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SITE_CONTACT.mobilePhone}`,
								dir: "ltr",
								className: "inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), SITE_CONTACT.mobilePhone]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SITE_CONTACT.landlinePhone}`,
								dir: "ltr",
								className: "inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), SITE_CONTACT.landlinePhone]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function UnderConstruction() {
	const { _splat } = useParams({ strict: false });
	const path = _splat ?? "";
	const segments = path.split("/").filter(Boolean);
	const title = findLabel(path) ?? decodeURIComponent(segments[segments.length - 1] ?? "");
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
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/",
									className: "hover:underline",
									children: "خانه"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title || "صفحه" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl md:text-4xl font-extrabold mb-3",
							children: title || "صفحه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm md:text-base opacity-90 max-w-2xl leading-7",
							children: "این بخش از سایت در حال بروزرسانی است."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "container mx-auto px-4 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl mx-auto text-center bg-card border border-border rounded-3xl shadow-soft p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Construction, { className: "w-10 h-10 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-extrabold mb-3",
							children: "در حال بروزرسانی و تولید محتوا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground leading-7 mb-6",
							children: [
								"صفحه «",
								title || "مورد نظر",
								"» در حال بروزرسانی و تولید محتوا می‌باشد. جهت کسب اطلاعات بیشتر با شماره‌های زیر تماس حاصل فرمایید:"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-3 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SITE_CONTACT.mobilePhone}`,
								dir: "ltr",
								className: "inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), SITE_CONTACT.mobilePhone]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SITE_CONTACT.landlinePhone}`,
								dir: "ltr",
								className: "inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), SITE_CONTACT.landlinePhone]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { DynamicPage as component };
