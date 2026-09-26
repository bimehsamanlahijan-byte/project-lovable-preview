import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Ce41MEoO.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Search, H as Menu, M as Phone, Nt as ChevronLeft, Pt as ChevronDown, U as MapPin, g as Smartphone } from "../_libs/lucide-react.mjs";
import { i as SocialBar, o as navItems, r as SITE_LOGO_HEADER, s as useBranding, t as SITE_CONTACT } from "./SocialBar-KaP2tZNZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteFooter-HIYvUQRB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function buildTree(rows, device) {
	const usable = rows.filter((r) => r.is_active && (r.device === "both" || r.device === device));
	const byParent = /* @__PURE__ */ new Map();
	const seenKeys = /* @__PURE__ */ new Set();
	for (const r of usable) {
		const key = `${r.parent_id ?? ""}|${r.label}|${r.href ?? ""}`;
		if (seenKeys.has(key)) continue;
		seenKeys.add(key);
		const list = byParent.get(r.parent_id) ?? [];
		list.push(r);
		byParent.set(r.parent_id, list);
	}
	const walk = (parent) => (byParent.get(parent) ?? []).sort((a, b) => a.position - b.position).map((r) => {
		const children = walk(r.id);
		return {
			label: r.label,
			...r.href ? { href: r.href } : {},
			...children.length ? { children } : {}
		};
	});
	return walk(null);
}
/** Identity of a nav item: its link when it has one, otherwise its label. */
function keyOf(n) {
	return (n.href ?? "").trim() || `label:${n.label.trim()}`;
}
/**
* Merges the dashboard-managed menu with the built-in one.
*
* The saved menu is authoritative for order, labels and nesting, but any
* built-in entry that was never imported into the database (e.g. pages added
* after the last import) is appended instead of silently disappearing from the
* header. Merging is recursive so new sub-items show up too.
*/
function mergeWithDefaults(saved, defaults) {
	const savedKeys = /* @__PURE__ */ new Set();
	const collect = (list) => {
		for (const n of list) {
			savedKeys.add(keyOf(n));
			if (n.children) collect(n.children);
		}
	};
	collect(saved);
	const result = [...saved.map((n) => {
		const match = defaults.find((d) => keyOf(d) === keyOf(n) || d.label.trim() === n.label.trim());
		if (!match?.children?.length) return n;
		const missingKids = match.children.filter((c) => !savedKeys.has(keyOf(c)));
		if (!missingKids.length) return n;
		return {
			...n,
			children: [...n.children ?? [], ...missingKids]
		};
	})];
	const sameItem = (a, b) => keyOf(a) === keyOf(b) || a.label.trim() === b.label.trim();
	defaults.forEach((d, di) => {
		if (savedKeys.has(keyOf(d)) || result.some((n) => sameItem(n, d))) return;
		let at = result.length;
		for (let i = di - 1; i >= 0; i--) {
			const idx = result.findIndex((n) => sameItem(n, defaults[i]));
			if (idx !== -1) {
				at = idx + 1;
				break;
			}
		}
		if (at === result.length) for (let i = di + 1; i < defaults.length; i++) {
			const idx = result.findIndex((n) => sameItem(n, defaults[i]));
			if (idx !== -1) {
				at = idx;
				break;
			}
		}
		result.splice(at, 0, d);
	});
	return result;
}
/**
* Live navigation. Falls back to the built-in structure whenever the
* dashboard has not defined any menu item yet, so the site is never empty.
*/
function useSiteMenu(device = "desktop") {
	const [items, setItems] = (0, import_react.useState)(navItems);
	(0, import_react.useEffect)(() => {
		let alive = true;
		supabase.from("site_menu_items").select("id, parent_id, label, href, position, device, is_active").then(({ data, error }) => {
			if (!alive || error || !data?.length) return;
			const tree = buildTree(data, device);
			if (tree.length) setItems(mergeWithDefaults(tree, navItems));
		});
		return () => {
			alive = false;
		};
	}, [device]);
	return items;
}
/** Current viewport bucket: mobile < 768px, tablet 768–1023px, desktop >= 1024px. */
function useDeviceKind() {
	const read = () => {
		if (typeof window === "undefined") return "desktop";
		const w = window.innerWidth;
		return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
	};
	const [kind, setKind] = (0, import_react.useState)(read);
	(0, import_react.useEffect)(() => {
		const onResize = () => setKind(read());
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	return kind;
}
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mobileSub, setMobileSub] = (0, import_react.useState)(null);
	const branding = useBranding();
	const kind = useDeviceKind();
	const desktopMenu = useSiteMenu(kind === "tablet" ? "tablet" : "desktop");
	const mobileMenu = useSiteMenu(kind === "tablet" ? "tablet" : "mobile");
	const taps = (0, import_react.useRef)(0);
	const tapTimer = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-50 bg-white border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:flex items-center justify-between py-2 text-xs text-muted-foreground border-b border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/insurance",
								className: "hover:text-primary transition",
								children: "صدور آنلاین بیمه"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "hover:text-primary transition",
								children: "دانلود اپلیکیشن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "hover:text-primary transition",
								children: "پرتال سهامداران و نمایندگان"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "جستجو کنید ...",
							className: "bg-muted rounded-full pr-9 pl-4 py-1.5 w-64 outline-none focus:ring-2 focus:ring-ring transition"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 py-4 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "flex items-center gap-3 min-w-0 shrink",
							"aria-label": "بیمه سامان",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: branding.headerLogoUrl || SITE_LOGO_HEADER,
								alt: "بیمه سامان",
								style: { height: branding.logoHeightHeader },
								className: "w-auto max-w-[140px] sm:max-w-none object-contain",
								loading: "eager"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"data-ve-nav": "desktop",
							className: "hidden xl:flex items-center gap-1 text-sm font-medium whitespace-nowrap",
							children: desktopMenu.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-ve-nav-item": n.label,
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: n.href ?? "#",
									className: "px-3 py-2 rounded-lg hover:bg-muted hover:text-primary transition flex items-center gap-1",
									children: [n.label, n.children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" })]
								}), n.children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute top-full right-0 pt-2 min-w-[230px] z-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-card border border-border rounded-2xl shadow-elegant p-2",
										children: n.children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative group/sub",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: c.href ?? "#",
												className: "flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-soft hover:text-primary transition",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), c.children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5 opacity-60" })]
											}), c.children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "invisible opacity-0 group-hover/sub:visible group-hover/sub:opacity-100 transition-all absolute top-0 right-full pl-2 min-w-[220px] z-50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-card border border-border rounded-2xl shadow-elegant p-2",
													children: c.children.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: g.href ?? "#",
														className: "block px-3 py-2 rounded-lg text-sm hover:bg-primary-soft hover:text-primary transition",
														children: g.label
													}, g.label))
												})
											})]
										}, c.label))
									})
								})]
							}, n.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SITE_CONTACT.mobilePhone}`,
								className: "hidden md:inline-flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-soft hover:shadow-glow transition",
								dir: "ltr",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									role: "presentation",
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										taps.current += 1;
										if (tapTimer.current) window.clearTimeout(tapTimer.current);
										tapTimer.current = window.setTimeout(() => {
											taps.current = 0;
										}, 4e3);
										if (taps.current >= 20) {
											taps.current = 0;
											window.location.href = "/dashboard";
										}
									},
									className: "inline-flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SITE_CONTACT.mobilePhone })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "xl:hidden p-2 shrink-0",
								onClick: () => setOpen(!open),
								"aria-label": "menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6" })
							})]
						})
					]
				}),
				open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:hidden pb-4 flex flex-col gap-1 max-h-[calc(100dvh-80px)] overflow-y-auto",
					children: mobileMenu.map((n) => {
						const isOpen = mobileSub === n.label;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border",
							children: [n.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMobileSub(isOpen ? null : n.label),
								className: "w-full flex items-center justify-between py-3 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}` })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: n.href ?? "#",
								className: "block py-3 text-sm font-medium",
								children: n.label
							}), n.children && isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pb-3 pr-3 flex flex-col gap-1",
								children: n.children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: c.href ?? "#",
									className: "py-2 text-sm text-muted-foreground hover:text-primary transition",
									children: ["• ", c.label]
								}, c.label))
							})]
						}, n.label);
					})
				})
			]
		})
	});
}
function SiteFooter() {
	const branding = useBranding();
	const taps = (0, import_react.useRef)(0);
	const tapTimer = (0, import_react.useRef)(null);
	const countTap = (e) => {
		e.preventDefault();
		e.stopPropagation();
		taps.current += 1;
		if (tapTimer.current) window.clearTimeout(tapTimer.current);
		tapTimer.current = window.setTimeout(() => {
			taps.current = 0;
		}, 4e3);
		if (taps.current >= 20) {
			taps.current = 0;
			window.location.href = "/dashboard";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-20 gradient-hero text-primary-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-4 gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: branding.footerLogoUrl || "/assets/logofooter-BmZ5Hpz5.png",
								alt: "بیمه سامان",
								style: { height: branding.logoHeightFooter },
								className: "w-auto object-contain",
								loading: "lazy"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-7 opacity-85",
							children: "ارائه دهنده بهترین خدمات بیمه‌ای با بیش از دو دهه تجربه و ۱۰۰۰ نمایندگی فعال در سراسر کشور."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold mb-4",
							children: "دسترسی سریع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm opacity-85",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/e-services",
									className: "hover:opacity-100 hover:underline",
									children: "خدمات الکترونیک"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/insurance",
									className: "hover:opacity-100 hover:underline",
									children: "انواع بیمه‌ها"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/branches",
									className: "hover:opacity-100 hover:underline",
									children: "شعب و نمایندگان"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/blog",
									className: "hover:opacity-100 hover:underline",
									children: "مجله و خبر"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold mb-4",
							children: "پشتیبانی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm opacity-85",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/contact",
									className: "hover:opacity-100 hover:underline",
									children: "تماس با ما"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/contact",
									className: "hover:opacity-100 hover:underline",
									children: "سوالات پرتکرار"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/contact",
									className: "hover:opacity-100 hover:underline",
									children: "ثبت شکایت"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/reporting",
									className: "hover:opacity-100 hover:underline",
									children: "گزارشگری و افشای اطلاعات"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-bold mb-4",
							children: "ارتباط با ما"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-3 text-sm opacity-85",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 ltr-num",
									dir: "ltr",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${SITE_CONTACT.landlinePhone}`,
										className: "hover:underline",
										children: SITE_CONTACT.landlinePhone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 ltr-num",
									dir: "ltr",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										role: "presentation",
										onClick: countTap,
										className: "inline-flex p-1 -m-1 cursor-pointer select-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${SITE_CONTACT.mobilePhone}`,
										className: "hover:underline",
										children: SITE_CONTACT.mobilePhone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2 leading-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SITE_CONTACT.address })]
								})
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/15 mt-10 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold mb-4 text-sm",
						children: "ما را در شبکه‌های اجتماعی دنبال کنید"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialBar, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/15 mt-10 pt-6 text-center text-xs opacity-80 leading-6",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).toLocaleDateString("fa-IR", { year: "numeric" }),
						" — تمام حقوق متعلق به بیمه سامان نمایندگی آذرخش می‌باشد."
					]
				})
			]
		})
	});
}
//#endregion
export { SiteHeader as n, SiteFooter as t };
