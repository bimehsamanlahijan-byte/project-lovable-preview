import { o as __toESM } from "../_runtime.mjs";
import { t as publicEnvScript } from "./client-Ce41MEoO.mjs";
import { S as readSetting, d as DEFAULT_SPLASH } from "./site-config-DDR4aELm.mjs";
import { i as require_react, n as QueryClientProvider, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as ClientOnly, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getSupabaseServiceKey, i as getSupabasePublishableKey, o as getSupabaseUrl, r as getSessionSecret, s as loadRuntimeEnv, t as envValue } from "./server-env-CcxwNfrB.mjs";
import { t as AI_PROVIDERS } from "./ai-providers-BH3QpR-b.mjs";
import { a as objectType, i as numberType, n as enumType, o as stringType, r as literalType, t as arrayType } from "../_libs/zod.mjs";
import { r as normalizeBase } from "./seo-config-B5a56N7O.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$44 } from "./p._slug-B0OFFzme.mjs";
import { n as readSeoConfig, t as originFromRequest } from "./seo.server-C8my3jo3.mjs";
import { createHash, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-sZ478Zpd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BynKHV_F.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var SESSION_KEY = "site_splash_shown";
/**
* Cloudflare-style loading screen: shows the brand logo on a solid background
* before the site is revealed. Fully configurable from the dashboard
* (لوگو، آیکن‌ها و عنوان → صفحه بارگذاری).
*/
function SplashScreen() {
	const [cfg, setCfg] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(true);
	const [fading, setFading] = (0, import_react.useState)(false);
	const [mounted] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (window.location.pathname.startsWith("/dashboard") || window.location.search.includes("ve=1") || window.location.search.includes("inspect=1")) {
			setVisible(false);
			return;
		}
		let alive = true;
		readSetting("splash", DEFAULT_SPLASH).then((v) => {
			if (alive) setCfg(v);
		}).catch(() => {
			if (alive) setCfg(DEFAULT_SPLASH);
		});
		const failsafe = window.setTimeout(() => {
			if (alive) setCfg((c) => c ?? DEFAULT_SPLASH);
		}, 2500);
		return () => {
			alive = false;
			window.clearTimeout(failsafe);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!cfg) return;
		const elapsed = Date.now() - mounted;
		const seen = cfg.oncePerSession && window.sessionStorage.getItem(SESSION_KEY) === "1";
		if (!cfg.enabled || seen) {
			setVisible(false);
			return;
		}
		const hide = window.setTimeout(() => {
			setFading(true);
			window.setTimeout(() => {
				setVisible(false);
				try {
					window.sessionStorage.setItem(SESSION_KEY, "1");
				} catch {}
			}, 400);
		}, Math.max(0, Math.max(300, cfg.minMs) - elapsed));
		return () => window.clearTimeout(hide);
	}, [cfg]);
	const view = cfg ?? DEFAULT_SPLASH;
	if (!visible || cfg && !cfg.enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		style: {
			background: view.bgColor,
			opacity: fading ? 0 : 1
		},
		className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400",
		children: [
			view.logoCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { dangerouslySetInnerHTML: { __html: view.logoCode } }) : view.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: view.logoUrl,
				alt: "",
				style: { height: view.logoHeight },
				className: "w-auto object-contain"
			}) : null,
			view.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-sm font-bold",
				style: { color: view.textColor },
				children: view.text
			}),
			view.showBar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 h-1 w-32 overflow-hidden rounded-full",
				style: { background: `${view.barColor}22` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-1/3 animate-[splashbar_1.1s_ease-in-out_infinite] rounded-full",
					style: { background: view.barColor }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes splashbar{0%{transform:translateX(-120%)}100%{transform:translateX(320%)}}` })
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$43 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "/css/jalalidatepicker.min.css"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: publicEnvScript() } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$43.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: null })
		]
	});
}
var $$splitComponentImporter$15 = () => import("./routes-DGvzoP69.mjs");
var Route$42 = createFileRoute("/")({
	loader: async () => {
		const { getSeoConfig } = await import("./seo.functions-aJRkee_c.mjs");
		try {
			return await getSeoConfig();
		} catch {
			return null;
		}
	},
	head: ({ loaderData }) => {
		const seo = loaderData ?? null;
		const base = seo?.origin ?? "";
		const title = seo?.defaultTitle || "بیمه سامان | خرید آنلاین انواع بیمه";
		const description = seo?.defaultDescription || "خرید آنلاین انواع بیمه شخص ثالث، عمر، درمان، مسافرتی، آتش‌سوزی و موبایل از بیمه سامان.";
		const sitelinks = (seo?.pages ?? []).filter((p) => p.sitelink && p.path !== "/");
		const graph = [{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: seo?.siteName || "بیمه سامان — نمایندگی آذرخش",
			url: base ? `${base}/` : "/",
			inLanguage: "fa-IR",
			...seo?.searchUrlTemplate ? { potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: seo.searchUrlTemplate
				},
				"query-input": "required name=search_term_string"
			} } : {}
		}, ...sitelinks.map((p) => ({
			"@context": "https://schema.org",
			"@type": "SiteNavigationElement",
			name: p.title,
			description: p.description,
			url: `${base}${p.path}`
		}))];
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				}
			],
			links: [{
				rel: "canonical",
				href: base ? `${base}/` : "/"
			}],
			scripts: graph.map((g) => ({
				type: "application/ld+json",
				children: JSON.stringify(g)
			}))
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("../_-C3SLNWec.mjs");
var Route$41 = createFileRoute("/$")({
	head: () => ({ meta: [{ title: "صفحه" }, {
		name: "description",
		content: "صفحه داخلی سایت"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./blog-BOdO8RPO.mjs");
var Route$40 = createFileRoute("/blog")({
	head: () => ({ meta: [{ title: "مجله و خبر | بیمه سامان" }, {
		name: "description",
		content: "آخرین اخبار، مقالات آموزشی و راهنمای بیمه‌های سامان در مجله و خبر بیمه سامان."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./branches-v_6mLP0c.mjs");
var Route$39 = createFileRoute("/branches")({
	head: () => ({ meta: [{ title: "شعب و نمایندگان | بیمه سامان" }, {
		name: "description",
		content: "فهرست شعب و نمایندگان بیمه سامان در سراسر کشور؛ جستجوی نزدیک‌ترین نمایندگی به شما."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./contact-D3ZTpggm.mjs");
var Route$38 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "ارتباط با ما | بیمه سامان" }, {
		name: "description",
		content: "راه‌های ارتباط با بیمه سامان؛ شماره تماس، آدرس دفتر مرکزی و ثبت درخواست مشاوره."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard-Bleboj4S.mjs");
/**
* Turns any menu link into an internal site path when it points at this site,
* so pages the user adds by hand (no leading slash, or a full URL of our own
* domain) can still be opened in the visual editor. Returns null for links
* that really live on another website.
*/
/**
* Some menu buttons intentionally send visitors to the external checkout,
* while their editable landing page lives inside this site.
*/
var Route$37 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "پیشخوان مدیریت | بیمه سامان — نمایندگی آذرخش" },
		{
			name: "description",
			content: "پیشخوان مدیریت محتوای وب‌سایت"
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
/** One distinct side-stripe color per top-level group. */
var $$splitComponentImporter$9 = () => import("./login-BN_ABnyf.mjs");
var Route$36 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "ورود کاربران | بیمه سامان — نمایندگی آذرخش" },
		{
			name: "description",
			content: "ورود امن به خدمات آنلاین نمایندگی بیمه سامان لاهیجان با حساب تلگرام."
		},
		{
			property: "og:title",
			content: "ورود کاربران | بیمه سامان لاهیجان"
		},
		{
			property: "og:description",
			content: "ورود امن به خدمات آنلاین نمایندگی بیمه سامان لاهیجان."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	validateSearch: (s) => ({
		module: typeof s["module"] === "string" ? s["module"] : void 0,
		next: typeof s["next"] === "string" ? s["next"] : void 0,
		error: typeof s["error"] === "string" ? s["error"] : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./partners-uCxPcLvZ.mjs");
var Route$35 = createFileRoute("/partners")({
	head: () => ({ meta: [
		{ title: "همکاران تیم 8452 | بیمه سامان" },
		{
			name: "description",
			content: "صفحه همکاران و بازاریابان تیم 8452 بیمه سامان؛ مشاهده وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای."
		},
		{
			property: "og:title",
			content: "همکاران تیم 8452 | بیمه سامان"
		},
		{
			property: "og:description",
			content: "اتوماسیون بازاریابان و همکاران معرف تیم 8452؛ مشاهده پورسانت و فروش هر همکار."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./reporting-e8cduMFO.mjs");
var Route$34 = createFileRoute("/reporting")({
	head: () => ({ meta: [{ title: "گزارشگری و افشای اطلاعات | بیمه سامان" }, {
		name: "description",
		content: "گزارش‌های مالی، صورت‌های مالی و افشای اطلاعات شرکت سهامی بیمه سامان."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$33 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async ({ request }) => {
	const seo = await readSeoConfig();
	const base = normalizeBase(seo.siteUrl) || originFromRequest(request);
	const body = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /dashboard",
		"",
		base ? `Sitemap: ${base}/sitemap.xml` : null,
		""
	].filter((l) => l !== null).join("\n");
	return new Response(body, { headers: {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var Route$32 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const seo = await readSeoConfig();
	const base = normalizeBase(seo.siteUrl) || originFromRequest(request);
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...seo.pages.filter((e) => e.inSitemap !== false).map((e) => [
			"  <url>",
			`    <loc>${base}${e.path === "/" ? "/" : e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			"  </url>"
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$6 = () => import("./suggestions-BJkdRgRG.mjs");
var Route$31 = createFileRoute("/suggestions")({
	head: () => ({ meta: [
		{ title: "انتقادات و پیشنهادات | بیمه سامان" },
		{
			name: "description",
			content: "ثبت انتقاد و پیشنهاد برای بیمه سامان با کد رهگیری؛ هر پیام با تاریخ و ساعت دریافت در پیشخوان مدیریت ثبت می‌شود."
		},
		{
			property: "og:title",
			content: "انتقادات و پیشنهادات | بیمه سامان"
		},
		{
			property: "og:description",
			content: "نظر، انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./third-party-BPzyxtki.mjs");
var Route$30 = createFileRoute("/third-party")({
	head: () => ({ meta: [
		{ title: "خرید آنلاین بیمه شخص ثالث | بیمه پارسیان لاهیجان" },
		{
			name: "description",
			content: "استعلام قیمت و خرید آنلاین بیمه شخص ثالث خودرو در چند مرحله ساده؛ ثبت پلاک، مشخصات خودرو و دریافت قیمت دقیق از سامانه استعلام."
		},
		{
			property: "og:title",
			content: "خرید آنلاین بیمه شخص ثالث | بیمه پارسیان لاهیجان"
		},
		{
			property: "og:description",
			content: "استعلام قیمت واقعی بیمه شخص ثالث خودرو و خرید آنلاین بدون مراجعه حضوری."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var schema$5 = objectType({ messages: arrayType(objectType({
	role: enumType(["user", "assistant"]),
	content: stringType().trim().min(1).max(4e3)
})).min(1).max(30) });
var Route$29 = createFileRoute("/api/ai-chat")({ server: { handlers: { POST: async ({ request }) => {
	const json = (status, body) => new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
	{
		const { denyIfLoginRequired } = await import("./guard.server-CDCOsKwV.mjs");
		const denied = await denyIfLoginRequired("ai_chat", request);
		if (denied) return denied;
		const { checkModuleAccess } = await import("./guard.server-CDCOsKwV.mjs");
		const access = await checkModuleAccess("ai_chat", request);
		if (access.ok && access.user && access.mode !== "none") {
			const { AI_CHAT_FREE_QUESTIONS } = await import("./registry-DLN8hP8L.mjs").then((n) => n.a).then((n) => n.a);
			const { getUserSession } = await import("./session.server-ekuxcXp7.mjs");
			const session = await getUserSession();
			const used = session.data.aiCount ?? 0;
			if (used >= AI_CHAT_FREE_QUESTIONS) return json(429, {
				ok: false,
				error: "question_limit",
				limit: AI_CHAT_FREE_QUESTIONS
			});
			await session.update({ aiCount: used + 1 });
		}
	}
	let raw;
	try {
		raw = await request.json();
	} catch {
		return json(400, {
			ok: false,
			error: "invalid_json"
		});
	}
	const parsed = schema$5.safeParse(raw);
	if (!parsed.success) return json(400, {
		ok: false,
		error: "validation_failed"
	});
	const { answerWithSiteAi } = await import("./site-ai.server-BnKgEAdd.mjs");
	const out = await answerWithSiteAi(parsed.data.messages);
	if (!out.ok) return json(out.status, {
		ok: false,
		error: out.error
	});
	return json(200, {
		ok: true,
		reply: out.reply,
		model: out.model,
		provider: out.provider
	});
} } } });
var schema$4 = objectType({
	fullName: stringType().trim().min(1).max(120),
	nationalId: stringType().trim().min(1).max(20),
	phone: stringType().trim().min(8).max(20),
	email: stringType().trim().email().max(200).optional().or(literalType("")),
	province: stringType().trim().max(50).optional().or(literalType("")),
	insuranceType: stringType().trim().max(80).optional().or(literalType("")),
	description: stringType().trim().max(2e3).optional().or(literalType(""))
});
var Route$28 = createFileRoute("/api/consult")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({
			ok: false,
			error: "invalid_json"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const parsed = schema$4.safeParse(body);
	if (!parsed.success) return new Response(JSON.stringify({
		ok: false,
		error: "validation_failed",
		issues: parsed.error.issues
	}), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const { error } = await createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} }).from("contact_messages").insert({
			full_name: parsed.data.fullName,
			national_id: parsed.data.nationalId,
			phone: parsed.data.phone,
			email: parsed.data.email || null,
			province: parsed.data.province || null,
			insurance_type: parsed.data.insuranceType || null,
			description: parsed.data.description || null
		});
		if (error) return new Response(JSON.stringify({
			ok: false,
			error: "db_error",
			details: error.message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} catch (e) {
		return new Response(JSON.stringify({
			ok: false,
			error: "server_error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
} } } });
var schema$3 = objectType({
	fullName: stringType().trim().min(1).max(120),
	phone: stringType().trim().min(8).max(20),
	policyNumber: stringType().trim().max(50).optional().or(literalType("")),
	accidentDate: stringType().trim().max(30).optional().or(literalType("")),
	description: stringType().trim().max(2e3).optional().or(literalType(""))
});
var Route$27 = createFileRoute("/api/report-damage")({ server: { handlers: { POST: async ({ request }) => {
	{
		const { denyIfLoginRequired } = await import("./guard.server-CDCOsKwV.mjs");
		const denied = await denyIfLoginRequired("damage_report", request);
		if (denied) return denied;
	}
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({
			ok: false,
			error: "invalid_json"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const parsed = schema$3.safeParse(body);
	if (!parsed.success) return new Response(JSON.stringify({
		ok: false,
		error: "validation_failed",
		issues: parsed.error.issues
	}), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const { error } = await createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} }).from("damage_reports").insert({
			full_name: parsed.data.fullName,
			phone: parsed.data.phone,
			policy_number: parsed.data.policyNumber || null,
			accident_date: parsed.data.accidentDate || null,
			description: parsed.data.description || null
		});
		if (error) return new Response(JSON.stringify({
			ok: false,
			error: "db_error",
			details: error.message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({
			ok: false,
			error: "server_error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
} } } });
var schema$2 = objectType({
	fullName: stringType().trim().min(2).max(120),
	nationalId: stringType().trim().min(5).max(20),
	passport: stringType().trim().max(30).optional().or(literalType("")),
	birthDate: stringType().trim().max(20).optional().or(literalType("")),
	phone: stringType().trim().min(8).max(20),
	email: stringType().trim().email().max(200).optional().or(literalType("")),
	zone: stringType().trim().max(40),
	zoneLabel: stringType().trim().max(80),
	duration: stringType().trim().max(10),
	durationLabel: stringType().trim().max(60),
	ceilingLabel: stringType().trim().max(60),
	ageLabel: stringType().trim().max(60),
	travelers: numberType().int().min(1).max(10),
	startDate: stringType().trim().max(20).optional().or(literalType("")),
	premium: numberType().int().min(0),
	note: stringType().trim().max(1e3).optional().or(literalType(""))
});
function trackingCode() {
	return "TRV-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100);
}
var Route$26 = createFileRoute("/api/travel-order")({ server: { handlers: { POST: async ({ request }) => {
	const json = (v, status) => new Response(JSON.stringify(v), {
		status,
		headers: { "Content-Type": "application/json" }
	});
	let body;
	try {
		body = await request.json();
	} catch {
		return json({
			ok: false,
			error: "invalid_json"
		}, 400);
	}
	const parsed = schema$2.safeParse(body);
	if (!parsed.success) return json({
		ok: false,
		error: "validation_failed",
		issues: parsed.error.issues
	}, 400);
	const d = parsed.data;
	const code = trackingCode();
	const description = [
		`کد پیگیری: ${code}`,
		`مقصد: ${d.zoneLabel}`,
		`مدت سفر: ${d.durationLabel}`,
		`سقف پوشش: ${d.ceilingLabel}`,
		`رده سنی: ${d.ageLabel}`,
		`تعداد مسافر: ${d.travelers}`,
		d.startDate ? `تاریخ شروع سفر: ${d.startDate}` : "",
		d.passport ? `شماره گذرنامه: ${d.passport}` : "",
		d.birthDate ? `تاریخ تولد: ${d.birthDate}` : "",
		`حق بیمه برآوردی: ${d.premium} ریال`,
		d.note ? `توضیحات: ${d.note}` : ""
	].filter(Boolean).join("\n");
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const { error } = await createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} }).from("contact_messages").insert({
			full_name: d.fullName,
			national_id: d.nationalId,
			phone: d.phone,
			email: d.email || null,
			province: null,
			insurance_type: "خرید آنلاین بیمه مسافرتی",
			description
		});
		if (error) return json({
			ok: false,
			error: "db_error",
			details: error.message
		}, 500);
	} catch {
		return json({
			ok: false,
			error: "server_error"
		}, 500);
	}
	return json({
		ok: true,
		code
	}, 200);
} } } });
var $$splitComponentImporter$4 = () => import("./e-services.index-Czxkv2jl.mjs");
var Route$25 = createFileRoute("/e-services/")({
	head: () => ({ meta: [{ title: "خدمات الکترونیک | بیمه سامان" }, {
		name: "description",
		content: "خدمات الکترونیک بیمه سامان؛ استعلام وضعیت بیمه‌نامه، کارتابل بیمه‌گذاران و پرداخت آنلاین حق بیمه."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./insurance.index-DdSZNCmD.mjs");
var Route$24 = createFileRoute("/insurance/")({
	head: () => ({ meta: [{ title: "انواع بیمه‌های سامان | خرید آنلاین بیمه" }, {
		name: "description",
		content: "مشاهده و خرید آنلاین انواع بیمه‌های سامان شامل شخص ثالث، عمر، درمان، مسافرتی، آتش‌سوزی، باربری و موبایل."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./insurance.travel-BUtKjQMN.mjs");
var Route$23 = createFileRoute("/insurance/travel")({
	head: () => ({ meta: [
		{ title: "خرید آنلاین بیمه مسافرتی | نمایندگی آذرخش بیمه سامان" },
		{
			name: "description",
			content: "استعلام لحظه‌ای نرخ و خرید آنلاین بیمه مسافرتی مورد تأیید سفارت‌ها؛ انتخاب مقصد، مدت سفر و سقف پوشش تا ۱۰۰ هزار یورو و ثبت آنی درخواست صدور."
		},
		{
			property: "og:title",
			content: "خرید آنلاین بیمه مسافرتی — بیمه سامان آذرخش"
		},
		{
			property: "og:description",
			content: "نرخ لحظه‌ای بیمه مسافرتی شنگن، آسیا و آمریکا و ثبت آنلاین درخواست صدور بیمه‌نامه."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./partners.dashboard-Czo2IRmL.mjs");
var Route$22 = createFileRoute("/partners/dashboard")({
	head: () => ({ meta: [
		{ title: "پنل همکاران تیم 8452 | بیمه سامان" },
		{
			name: "description",
			content: "مشاهده وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای برای همکاران تیم 8452."
		},
		{
			property: "og:title",
			content: "پنل همکاران تیم 8452 | بیمه سامان"
		},
		{
			property: "og:description",
			content: "گزارش فروش و پورسانت همکاران و بازاریابان تیم 8452."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./partners_.apply-DnFsZOdQ.mjs");
var Route$21 = createFileRoute("/partners_/apply")({
	head: () => ({ meta: [
		{ title: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲" },
		{
			name: "description",
			content: "فرم درخواست همکاری در فروش و عضویت در تیم ۸۴۵۲ بیمه سامان."
		},
		{
			property: "og:title",
			content: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲"
		},
		{
			property: "og:description",
			content: "ثبت درخواست عضویت و همکاری در فروش با تیم ۸۴۵۲ بیمه سامان."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Reports which AI providers have their keys configured (never returns key values). */
var Route$20 = createFileRoute("/api/admin/ai-providers")({ server: { handlers: { GET: async () => {
	const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
	const { AI_PROVIDERS } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
	const { envValue, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	await loadRuntimeEnv();
	const status = AI_PROVIDERS.map((p) => ({
		id: p.id,
		hasKey: Boolean(envValue(...p.keyNames)),
		missing: [...envValue(...p.keyNames) ? [] : [p.keyNames[0]], ...(p.extraNames ?? []).filter((n) => !envValue(n))]
	}));
	return Response.json({
		ok: true,
		status
	});
} } } });
/** Dashboard-only management of the assistant's knowledge sources. */
var Route$19 = createFileRoute("/api/admin/ai-sources")({ server: { handlers: {
	GET: async () => {
		const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
		if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
		const { listSources } = await import("./ai-sources.server-B3xKCqI8.mjs");
		try {
			return Response.json({
				ok: true,
				sources: await listSources()
			});
		} catch (e) {
			return Response.json({
				ok: false,
				error: e instanceof Error ? e.message : "list_failed"
			}, { status: 500 });
		}
	},
	POST: async ({ request }) => {
		const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
		if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
		let body;
		try {
			body = await request.json();
		} catch {
			return Response.json({
				ok: false,
				error: "invalid_json"
			}, { status: 400 });
		}
		const api = await import("./ai-sources.server-B3xKCqI8.mjs");
		const action = String(body.action ?? "");
		const id = typeof body.id === "string" ? body.id : "";
		try {
			switch (action) {
				case "add": {
					const url = String(body.url ?? "").trim();
					if (!/^https?:\/\//i.test(url)) return Response.json({
						ok: false,
						error: "invalid_url"
					}, { status: 400 });
					const res = await api.addSource({
						title: String(body.title ?? "منبع جدید"),
						url,
						branch: typeof body.branch === "string" ? body.branch : null,
						interval_hours: Number(body.interval_hours ?? 168) || 168,
						auto_approve: body.auto_approve !== false
					});
					return Response.json(res, { status: res.ok ? 200 : 500 });
				}
				case "update": {
					if (!id) return Response.json({
						ok: false,
						error: "missing_id"
					}, { status: 400 });
					const res = await api.updateSource(id, body.patch ?? {});
					return Response.json(res, { status: res.ok ? 200 : 500 });
				}
				case "remove": {
					if (!id) return Response.json({
						ok: false,
						error: "missing_id"
					}, { status: 400 });
					const res = await api.removeSource(id);
					return Response.json(res, { status: res.ok ? 200 : 500 });
				}
				case "sync": {
					if (!id) return Response.json({
						ok: false,
						error: "missing_id"
					}, { status: 400 });
					const res = await api.syncSource(id);
					return Response.json(res, { status: res.ok ? 200 : 502 });
				}
				case "syncAll": {
					const res = await api.syncAllSources();
					return Response.json({
						ok: true,
						...res
					});
				}
				default: return Response.json({
					ok: false,
					error: "unknown_action"
				}, { status: 400 });
			}
		} catch (e) {
			return Response.json({
				ok: false,
				error: e instanceof Error ? e.message : "request_failed"
			}, { status: 500 });
		}
	}
} } });
/**
* Safely normalizes and sanitizes asset paths to prevent directory traversal attacks.
*/
function clean(p) {
	if (!p || typeof p !== "string") return "";
	return p.replace(/\0/g, "").replace(/\\/g, "/").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
}
/** Password-gated media library: list and delete files in the site-assets bucket. */
var Route$18 = createFileRoute("/api/admin/assets")({ server: { handlers: {
	GET: async ({ request }) => {
		const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
		if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
		const folder = clean(new URL(request.url).searchParams.get("folder") ?? "");
		const { getStorage } = await import("./storage.server-CiW3rdAV.mjs");
		const { client, bucket: BUCKET } = await getStorage();
		const { data, error } = await client.storage.from(BUCKET).list(folder, {
			limit: 500,
			sortBy: {
				column: "created_at",
				order: "desc"
			}
		});
		if (error) return Response.json({ error: error.message }, { status: 500 });
		const files = (data ?? []).filter((e) => e.id !== null).map((e) => {
			const path = clean(folder ? `${folder}/${e.name}` : e.name);
			return {
				name: e.name,
				path,
				url: `/api/public/asset/${path}`,
				size: e.metadata?.size ?? null,
				mime: e.metadata?.mimetype ?? null,
				createdAt: e.created_at ?? null
			};
		});
		const folders = (data ?? []).filter((e) => e.id === null).map((e) => e.name);
		return Response.json({
			files,
			folders
		});
	},
	DELETE: async ({ request }) => {
		const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
		if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
		const paths = ((await request.json().catch(() => null))?.paths ?? []).map(clean).filter(Boolean);
		if (!paths.length) return Response.json({ error: "No paths" }, { status: 400 });
		const { getStorage } = await import("./storage.server-CiW3rdAV.mjs");
		const { client, bucket: BUCKET } = await getStorage();
		const { error } = await client.storage.from(BUCKET).remove(paths);
		if (error) return Response.json({ error: error.message }, { status: 500 });
		return Response.json({
			ok: true,
			removed: paths.length
		});
	}
} } });
/** Password-gated backend (Supabase) health + browsing endpoint for the dashboard. */
var Route$17 = createFileRoute("/api/admin/backend")({ server: { handlers: { GET: async () => {
	const { isUnlocked, ADMIN_TABLES } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
	if (!await isUnlocked()) return new Response("Unauthorized", { status: 401 });
	const { getSessionSecret, getSupabasePublishableKey, getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	await loadRuntimeEnv();
	const env = {
		SUPABASE_URL: Boolean(getSupabaseUrl()),
		SUPABASE_PUBLISHABLE_KEY: Boolean(getSupabasePublishableKey()),
		SUPABASE_SERVICE_ROLE_KEY: Boolean(getSupabaseServiceKey()),
		SESSION_SECRET: Boolean(getSessionSecret())
	};
	if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({
		env,
		buckets: [],
		tables: [],
		error: "کلید دسترسی سرور (SUPABASE_SERVICE_ROLE_KEY) یا نشانی بک‌اند در محیط اجرا تنظیم نشده است؛ به همین دلیل آپلود فایل در نسخه منتشرشده خطا می‌دهد."
	});
	try {
		const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
		const supabaseAdmin = await getSupabaseAdmin();
		const { data: buckets } = await supabaseAdmin.storage.listBuckets();
		const tables = [];
		for (const t of ADMIN_TABLES) {
			const { count } = await supabaseAdmin.from(t).select("*", {
				count: "exact",
				head: true
			});
			tables.push({
				table: t,
				count: count ?? null
			});
		}
		return Response.json({
			env,
			buckets: (buckets ?? []).map((b) => ({
				name: b.name,
				public: b.public
			})),
			tables,
			error: null
		});
	} catch (e) {
		return Response.json({
			env,
			buckets: [],
			tables: [],
			error: e instanceof Error ? e.message : "خطای نامشخص در اتصال به بک‌اند"
		});
	}
} } } });
/** Password-gated upload endpoint for site assets (logos, icons, images, videos). */
var Route$16 = createFileRoute("/api/admin/upload")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const { isUnlocked } = await import("./dashboard-auth.server-Q5OP7V4S.mjs");
		if (!await isUnlocked()) return Response.json({ error: "نشست مدیریت منقضی شده است؛ دوباره وارد شوید." }, { status: 401 });
		const { readStorageTarget } = await import("./storage.server-CiW3rdAV.mjs");
		const override = await readStorageTarget();
		const hasOverride = Boolean(override?.url && override?.serviceKey);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		if (!hasOverride && (!getSupabaseUrl() || !getSupabaseServiceKey())) return Response.json({ error: "کلید سرور بک‌اند (SUPABASE_SERVICE_ROLE_KEY) در محیط اجرا تنظیم نشده است؛ آپلود ممکن نیست." }, { status: 503 });
		const form = await request.formData();
		const file = form.get("file");
		const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9/_-]/gi, "");
		if (!(file instanceof File)) return Response.json({ error: "فایلی ارسال نشد." }, { status: 400 });
		const maxBytes = file.type.startsWith("video/") ? 104857600 : 16777216;
		if (file.size > maxBytes) return Response.json({ error: "حجم فایل بیش از حد مجاز است." }, { status: 413 });
		const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().slice(0, 8);
		const path = `${folder || "misc"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const { getStorage } = await import("./storage.server-CiW3rdAV.mjs");
		const { client, bucket } = await getStorage();
		const { error } = await client.storage.from(bucket).upload(path, await file.arrayBuffer(), {
			contentType: file.type || "application/octet-stream",
			upsert: false
		});
		if (error) return Response.json({ error: error.message }, { status: 500 });
		return Response.json({
			path,
			url: `/api/public/asset/${path}`
		});
	} catch (e) {
		return Response.json({ error: e instanceof Error ? e.message : "خطای نامشخص در آپلود" }, { status: 500 });
	}
} } } });
/**
* Compatibility proxy for overlay iframes.
*
* Many external sites refuse to be framed (X-Frame-Options / CSP
* frame-ancestors) or block non-browser clients. This route fetches the page
* server-side with browser-like headers, strips the framing restrictions and
* injects a <base> tag so relative assets keep working.
*
* Read-only: only GET, only http(s), no cookies forwarded.
*/
var BROWSER_HEADERS = {
	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
	accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
	"accept-language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
	"upgrade-insecure-requests": "1",
	"sec-fetch-dest": "document",
	"sec-fetch-mode": "navigate",
	"sec-fetch-site": "none",
	"sec-fetch-user": "?1"
};
function injectBase(html, url) {
	const baseTag = `<base href="${url}">`;
	if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`);
	return `${baseTag}${html}`;
}
var Route$15 = createFileRoute("/api/public/embed")({ server: { handlers: { GET: async ({ request }) => {
	const target = new URL(request.url).searchParams.get("url");
	if (!target) return new Response("missing url", { status: 400 });
	let parsed;
	try {
		parsed = new URL(target);
	} catch {
		return new Response("invalid url", { status: 400 });
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return new Response("unsupported protocol", { status: 400 });
	let upstream;
	try {
		upstream = await fetch(parsed.toString(), {
			headers: {
				...BROWSER_HEADERS,
				referer: parsed.origin + "/"
			},
			redirect: "follow"
		});
	} catch {
		return new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;padding:16px;direction:rtl">دسترسی به این آدرس ممکن نشد.</body>`, {
			status: 502,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
	const type = upstream.headers.get("content-type") ?? "application/octet-stream";
	const headers = new Headers({
		"content-type": type,
		"cache-control": "public, max-age=60",
		"x-robots-tag": "noindex"
	});
	if (type.includes("text/html")) {
		const html = injectBase(await upstream.text(), parsed.toString());
		return new Response(html, {
			status: upstream.status,
			headers
		});
	}
	return new Response(upstream.body, {
		status: upstream.status,
		headers
	});
} } } });
/**
* Non-sensitive health check for the dashboard runtime configuration.
*
* Reports only whether each value is present (plus the project ref parsed out
* of the Supabase URL, which is public). No key material is ever returned.
*/
var Route$14 = createFileRoute("/api/public/env-check")({ server: { handlers: { GET: async () => {
	await loadRuntimeEnv();
	const url = getSupabaseUrl();
	const publishable = getSupabasePublishableKey();
	const service = getSupabaseServiceKey();
	const session = getSessionSecret();
	const projectRef = url ? url.match(/https?:\/\/([^.]+)\./)?.[1] ?? null : null;
	let serviceKeyRef = null;
	if (service?.startsWith("eyJ")) try {
		const part = service.split(".")[1];
		if (part) serviceKeyRef = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))).ref ?? null;
	} catch {
		serviceKeyRef = null;
	}
	let dbProbe = {
		status: null,
		message: null
	};
	if (url && service) try {
		const r = await fetch(`${url}/rest/v1/site_settings?select=key&limit=1`, { headers: {
			apikey: service,
			Authorization: `Bearer ${service}`
		} });
		const text = await r.text();
		dbProbe = {
			status: r.status,
			message: r.ok ? null : text.slice(0, 120)
		};
	} catch (e) {
		dbProbe = {
			status: null,
			message: e instanceof Error ? e.message : "fetch failed"
		};
	}
	const aiProviders = AI_PROVIDERS.map((p) => ({
		id: p.id,
		hasKey: Boolean(envValue(...p.keyNames)),
		missingExtras: (p.extraNames ?? []).filter((n) => !envValue(n))
	}));
	return Response.json({
		ai: {
			ready: aiProviders.filter((p) => p.hasKey && p.missingExtras.length === 0).map((p) => p.id),
			providers: aiProviders
		},
		supabaseUrl: url ?? null,
		projectRef,
		hasPublishableKey: Boolean(publishable),
		hasServiceKey: Boolean(service),
		hasSessionSecret: Boolean(session),
		sessionSecretLongEnough: (session?.length ?? 0) >= 32,
		serviceKeyRef,
		canWrite: Boolean(url && service && (session?.length ?? 0) >= 32),
		dbProbe
	}, { headers: { "cache-control": "no-store" } });
} } } });
var schema$1 = objectType({
	fullName: stringType().trim().min(2).max(120),
	nationalId: stringType().trim().regex(/^\d{10}$/),
	birthYear: stringType().trim().max(4).optional().default(""),
	gender: enumType(["male", "female"]).default("male"),
	phone: stringType().trim().min(8).max(20),
	email: stringType().trim().max(160).optional().default(""),
	province: stringType().trim().max(60).optional().default(""),
	city: stringType().trim().max(60).optional().default(""),
	address: stringType().trim().max(300).optional().default(""),
	education: stringType().trim().max(60).optional().default(""),
	fieldOfStudy: stringType().trim().max(120).optional().default(""),
	experience: stringType().trim().max(60).optional().default(""),
	insuranceLicense: enumType([
		"yes",
		"no",
		"in_progress"
	]).default("no"),
	cooperationType: stringType().trim().max(60).optional().default(""),
	branches: arrayType(stringType().trim().max(120)).max(20).optional().default([]),
	monthlyTarget: stringType().trim().max(20).optional().default(""),
	description: stringType().trim().max(2e3).optional().default("")
});
var Route$13 = createFileRoute("/api/public/partner-applications")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({
			ok: false,
			error: "invalid_json"
		}, { status: 400 });
	}
	const parsed = schema$1.safeParse(body);
	if (!parsed.success) return Response.json({
		ok: false,
		error: "validation_failed",
		issues: parsed.error.issues
	}, { status: 400 });
	const d = parsed.data;
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const supabase = createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} });
		const row = {
			applicant_id: `PA-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1e3 + Math.random() * 9e3)}`,
			full_name: d.fullName,
			national_id: d.nationalId,
			birth_year: d.birthYear,
			gender: d.gender,
			phone: d.phone,
			email: d.email,
			province: d.province,
			city: d.city,
			address: d.address,
			education: d.education,
			field_of_study: d.fieldOfStudy,
			experience: d.experience,
			insurance_license: d.insuranceLicense,
			cooperation_type: d.cooperationType,
			branches: d.branches,
			monthly_target: d.monthlyTarget,
			description: d.description,
			request_key: crypto.randomUUID(),
			form_nonce: crypto.randomUUID(),
			fullname: d.fullName,
			birth_date: d.birthYear,
			mobile: d.phone,
			insurance_experience: d.experience,
			type_cooperation: d.cooperationType || null,
			status: "new"
		};
		let data = null;
		let lastError = "";
		for (let attempt = 0; attempt < 30; attempt += 1) {
			const result = await supabase.from("partner_applications").insert(row).select("*").single();
			if (!result.error) {
				data = result.data;
				break;
			}
			lastError = result.error.message;
			const unknownColumn = lastError.match(/Could not find the '([^']+)' column/)?.[1];
			if (unknownColumn && unknownColumn in row) {
				delete row[unknownColumn];
				continue;
			}
			const missingColumn = lastError.match(/null value in column "([^"]+)"/)?.[1];
			if (missingColumn && !row[missingColumn]) {
				row[missingColumn] = /(key|nonce|uuid)$/.test(missingColumn) ? crypto.randomUUID() : "-";
				continue;
			}
			break;
		}
		if (!data) return Response.json({
			ok: false,
			error: "db_error",
			details: lastError
		}, { status: 500 });
		return Response.json({
			ok: true,
			applicantId: data["applicant_id"] ?? data["id"],
			receivedAt: data["received_at"] ?? data["created_at"],
			columns: Object.keys(data)
		});
	} catch {
		return Response.json({
			ok: false,
			error: "server_error"
		}, { status: 500 });
	}
} } } });
/** Public partner stats: a partner enters their code and sees commission,
*  total sales and per-branch breakdown. */
var Route$12 = createFileRoute("/api/public/partner-stats")({ server: { handlers: { GET: async ({ request }) => {
	const code = new URL(request.url).searchParams.get("code")?.trim();
	if (!code) return Response.json({
		ok: false,
		error: "code_required"
	}, { status: 400 });
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const supabase = createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} });
		const { data: partner, error: pErr } = await supabase.from("partners").select("id, code, full_name, commission_percent, is_active").eq("code", code).maybeSingle();
		if (pErr) return Response.json({
			ok: false,
			error: "db_error",
			details: pErr.message
		}, { status: 500 });
		if (!partner || !partner.is_active) return Response.json({
			ok: false,
			error: "partner_not_found"
		}, { status: 404 });
		const { data: sales, error: sErr } = await supabase.from("partner_sales").select("insurance_branch, policy_type, amount, sold_at").eq("partner_id", partner.id).order("sold_at", { ascending: false });
		if (sErr) return Response.json({
			ok: false,
			error: "db_error",
			details: sErr.message
		}, { status: 500 });
		const rows = sales ?? [];
		const totalAmount = rows.reduce((s, r) => s + (r.amount || 0), 0);
		const byBranch = {};
		for (const r of rows) {
			const b = byBranch[r.insurance_branch] ??= {
				branch: r.insurance_branch,
				count: 0,
				amount: 0,
				types: {}
			};
			b.count += 1;
			b.amount += r.amount || 0;
			if (r.policy_type) b.types[r.policy_type] = (b.types[r.policy_type] ?? 0) + 1;
		}
		return Response.json({
			ok: true,
			partner: {
				code: partner.code,
				fullName: partner.full_name,
				commissionPercent: partner.commission_percent
			},
			totalSales: rows.length,
			totalAmount,
			commissionAmount: Math.round(totalAmount * partner.commission_percent / 100),
			branches: Object.values(byBranch).map((b) => ({
				branch: b.branch,
				count: b.count,
				amount: b.amount,
				types: Object.entries(b.types).map(([label, count]) => ({
					label,
					count
				}))
			}))
		});
	} catch {
		return Response.json({
			ok: false,
			error: "server_error"
		}, { status: 500 });
	}
} } } });
var schema = objectType({
	fullName: stringType().trim().min(1).max(120),
	phone: stringType().trim().min(8).max(20),
	category: enumType(["suggestion", "criticism"]).default("suggestion"),
	message: stringType().trim().min(1).max(2e3)
});
var Route$11 = createFileRoute("/api/public/suggestions")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({
			ok: false,
			error: "invalid_json"
		}, { status: 400 });
	}
	const parsed = schema.safeParse(body);
	if (!parsed.success) return Response.json({
		ok: false,
		error: "validation_failed",
		issues: parsed.error.issues
	}, { status: 400 });
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		await loadRuntimeEnv();
		const { data, error } = await createClient(getSupabaseUrl(), getSupabaseServiceKey(), { auth: {
			autoRefreshToken: false,
			persistSession: false
		} }).from("suggestions").insert({
			full_name: parsed.data.fullName,
			phone: parsed.data.phone,
			category: parsed.data.category,
			message: parsed.data.message
		}).select("tracking_id, received_at").single();
		if (error) return Response.json({
			ok: false,
			error: "db_error",
			details: error.message
		}, { status: 500 });
		return Response.json({
			ok: true,
			trackingId: data.tracking_id,
			receivedAt: data.received_at
		});
	} catch {
		return Response.json({
			ok: false,
			error: "server_error"
		}, { status: 500 });
	}
} } } });
/** Starts an inquiry on SI24 and stores the customer + inquiry locally. */
var Route$10 = createFileRoute("/api/third-party/start")({ server: { handlers: { POST: async ({ request }) => {
	{
		const { denyIfLoginRequired } = await import("./guard.server-CDCOsKwV.mjs");
		const denied = await denyIfLoginRequired("third_party", request);
		if (denied) return denied;
	}
	const { si24Request } = await import("./si24.server-0JV3NeIP.mjs");
	const { upsertCustomer, createAttempt, updateAttempt, newReferenceCode } = await import("./store.server-Dhm1frb4.mjs");
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({
			ok: false,
			message: "درخواست نامعتبر است."
		}, { status: 400 });
	}
	const plaque = body?.plaque;
	const owner = body?.owner;
	if (!(plaque && owner && plaque.letter && Number.isFinite(Number(plaque.region)) && Number.isFinite(Number(plaque.segment1)) && Number.isFinite(Number(plaque.segment2)) && /^\d{10}$/.test(String(owner.nationalCode ?? "")) && /^\d{10}$/.test(String(owner.postalCode ?? "")) && /^09\d{9}$/.test(String(owner.mobile ?? "")) && typeof owner.birthDate === "string" && owner.birthDate.length > 0)) return Response.json({
		ok: false,
		error: "validation_error",
		message: "اطلاعات پلاک یا مالک کامل نیست."
	}, { status: 400 });
	const payload = {
		plaque: {
			region: Number(plaque.region),
			letter: String(plaque.letter),
			segment1: Number(plaque.segment1),
			segment2: Number(plaque.segment2)
		},
		owner: {
			nationalCode: String(owner.nationalCode),
			birthDate: String(owner.birthDate),
			mobile: String(owner.mobile),
			postalCode: String(owner.postalCode)
		}
	};
	const customerId = await upsertCustomer({
		nationalCode: payload.owner.nationalCode,
		mobile: payload.owner.mobile,
		birthDate: payload.owner.birthDate,
		postalCode: payload.owner.postalCode
	});
	const referenceCode = newReferenceCode();
	const inquiryId = await createAttempt({
		customerId,
		referenceCode,
		requestPayload: payload
	});
	const result = await si24Request("/api/insurance-requests/start", {
		method: "POST",
		body: payload
	});
	if (!result.ok) {
		await updateAttempt(referenceCode, {
			status: "start_failed",
			error_message: result.message ?? result.error ?? "unknown_error"
		});
		return Response.json({
			ok: false,
			error: result.error,
			message: result.message,
			referenceCode
		}, { status: result.status || 502 });
	}
	const trackingCode = result.data?.trackingCode ?? result.data?.data?.trackingCode;
	if (!trackingCode) {
		console.error("[third-party] start returned no tracking code", result.data);
		await updateAttempt(referenceCode, {
			status: "start_failed",
			error_message: "no_tracking_code"
		});
		return Response.json({
			ok: false,
			message: "پاسخ سامانه استعلام معتبر نبود. دوباره تلاش کنید.",
			referenceCode
		}, { status: 502 });
	}
	await updateAttempt(referenceCode, {
		status: "started",
		tracking_code: trackingCode,
		si24_tracking_code: trackingCode,
		error_message: null
	});
	return Response.json({
		ok: true,
		trackingCode,
		referenceCode,
		customerId,
		inquiryId
	});
} } } });
/**
* Scheduled refresh of the assistant's official knowledge sources.
* Protected by a bearer secret so only the agency's own scheduler can call it.
* Configure AI_SOURCES_CRON_SECRET (or LOVABLE_CRON_SECRET) and point a cron job here.
*/
var Route$9 = createFileRoute("/api/public/ai-sources/refresh")({ server: { handlers: { POST: async ({ request }) => {
	const { envValueAsync } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	const secret = await envValueAsync("AI_SOURCES_CRON_SECRET", "LOVABLE_CRON_SECRET");
	if (!secret) return new Response("Scheduler not configured", { status: 503 });
	const provided = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1] ?? "";
	const { createHash, timingSafeEqual } = await import("node:crypto");
	const digest = (v) => createHash("sha256").update(v, "utf8").digest();
	if (!provided || !timingSafeEqual(digest(provided), digest(secret))) return new Response("Unauthorized", { status: 401 });
	const { syncDueSources } = await import("./ai-sources.server-B3xKCqI8.mjs");
	try {
		const out = await syncDueSources(4);
		return Response.json({
			ok: true,
			...out
		});
	} catch (e) {
		return Response.json({
			ok: false,
			error: e instanceof Error ? e.message : "refresh_failed"
		}, { status: 500 });
	}
} } } });
/** Public read-only proxy for files stored in the private site-assets bucket. */
var Route$8 = createFileRoute("/api/public/asset/$")({ server: { handlers: { GET: async ({ params }) => {
	const path = params._splat ?? "";
	if (!path || path.includes("..")) return new Response("Bad path", { status: 400 });
	const { getStorage } = await import("./storage.server-CiW3rdAV.mjs");
	const { client, bucket } = await getStorage();
	const { data, error } = await client.storage.from(bucket).download(path);
	if (error || !data) return new Response("Not found", { status: 404 });
	return new Response(await data.arrayBuffer(), { headers: {
		"Content-Type": data.type || "application/octet-stream",
		"Cache-Control": "public, max-age=31536000, immutable",
		"CDN-Cache-Control": "public, max-age=31536000"
	} });
} } } });
/**
* Saman insurance bot webhook: Telegram → here → AI → Telegram.
* Bot token, AI keys and provider settings live in server secrets / settings;
* nothing sensitive is exposed and no admin data is ever answered by the bot.
*/
var Route$7 = createFileRoute("/api/public/telegram/bot-ai")({ server: { handlers: { POST: async ({ request }) => {
	const { envValueAsync } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	const botToken = await envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN");
	if (!botToken) return new Response("Bot not configured", { status: 503 });
	const expected = webhookSecret(botToken);
	const provided = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
	const a = Buffer.from(expected);
	const b = Buffer.from(provided);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Unauthorized", { status: 401 });
	const msg = (await request.json()).message;
	const chatId = msg?.chat?.id;
	const text = (msg?.text ?? "").trim();
	if (!chatId) return Response.json({ ok: true });
	if (await handleBotLogin(botToken, chatId, text, msg)) return Response.json({ ok: true });
	if (!text) return Response.json({ ok: true });
	if (msg?.chat?.type !== "private") return Response.json({ ok: true });
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	const supabase = await getSupabaseAdmin();
	const { data: row } = await supabase.from("site_settings").select("value").eq("key", "login_bot_config").maybeSingle();
	const cfg = row?.value ?? {};
	if (cfg.enabled === false) return Response.json({
		ok: true,
		disabled: true
	});
	const { tg } = await import("./telegram.server-Ur5Pj9YJ.mjs");
	const fromId = msg?.from?.id;
	if (cfg.requireLogin !== false && fromId) {
		const { data: tu } = await supabase.from("telegram_users").select("phone_number, is_active").eq("telegram_id", fromId).maybeSingle();
		const u = tu;
		if (!u || !u.phone_number) {
			await sendLoginCard(botToken, chatId);
			return Response.json({
				ok: true,
				login: "required"
			});
		}
		if (u.is_active === false) {
			await tg(botToken, "sendMessage", {
				chat_id: chatId,
				text: "دسترسی شما توسط مدیر غیرفعال شده است."
			});
			return Response.json({ ok: true });
		}
		await supabase.from("telegram_users").update({ last_login: (/* @__PURE__ */ new Date()).toISOString() }).eq("telegram_id", fromId);
	}
	if (text === "/start" || text === "/ai") {
		await tg(botToken, "sendMessage", {
			chat_id: chatId,
			text: "🤖 سلام! من دستیار هوشمند بیمه سامان هستم. سؤال بیمه‌ای خود را بنویسید.",
			reply_markup: { remove_keyboard: true }
		});
		return Response.json({ ok: true });
	}
	const question = text.replace(/^\/ai\s+/, "");
	let reply = "متأسفانه الان امکان پاسخ‌گویی نیست. لطفاً کمی بعد دوباره تلاش کنید.";
	await tg(botToken, "sendChatAction", {
		chat_id: chatId,
		action: "typing"
	}).catch(() => null);
	if (cfg.useSiteAi !== false) {
		const { answerWithSiteAi } = await import("./site-ai.server-BnKgEAdd.mjs");
		const out = await answerWithSiteAi([{
			role: "user",
			content: question.slice(0, 4e3)
		}]);
		if (out.ok) reply = out.reply;
		else console.error("[bot-ai] site ai", out.status, out.error);
	} else if (cfg.aiEnabled) reply = await askAi(question, cfg) ?? reply;
	await tg(botToken, "sendMessage", {
		chat_id: chatId,
		text: reply
	});
	return Response.json({ ok: true });
} } } });
function webhookSecret(botToken) {
	return createHash("sha256").update(`telegram-bot-ai:${botToken}`).digest("base64url");
}
var PROVIDER_URLS = {
	google: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
	groq: "https://api.groq.com/openai/v1/chat/completions",
	openrouter: "https://openrouter.ai/api/v1/chat/completions",
	mistral: "https://api.mistral.ai/v1/chat/completions",
	deepseek: "https://api.deepseek.com/v1/chat/completions",
	together: "https://api.together.xyz/v1/chat/completions",
	cerebras: "https://api.cerebras.ai/v1/chat/completions",
	github: "https://models.github.ai/inference/chat/completions",
	nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
	huggingface: "https://router.huggingface.co/v1/chat/completions"
};
async function askAi(text, cfg) {
	try {
		const { envValue, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		const { getProvider } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
		await loadRuntimeEnv();
		const provider = getProvider(cfg.aiProvider ?? "lovable");
		const key = envValue(...provider.keyNames);
		if (!key) return null;
		const isLovable = provider.id === "lovable";
		const url = isLovable ? "https://ai.gateway.lovable.dev/v1/chat/completions" : PROVIDER_URLS[provider.id] ?? "https://ai.gateway.lovable.dev/v1/chat/completions";
		const headers = isLovable ? {
			"Content-Type": "application/json",
			"Lovable-API-Key": key,
			"X-Lovable-AIG-SDK": "fetch"
		} : {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		};
		const res = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify({
				model: cfg.aiModel ?? "google/gemini-2.5-flash",
				messages: [{
					role: "system",
					content: cfg.systemPrompt ?? "دستیار بیمه سامان لاهیجان هستی."
				}, {
					role: "user",
					content: text.slice(0, 2e3)
				}]
			})
		});
		if (!res.ok) {
			console.error("[bot-ai]", res.status, await res.text());
			return null;
		}
		return (await res.json()).choices?.[0]?.message?.content ?? null;
	} catch (e) {
		console.error("[bot-ai]", e);
		return null;
	}
}
/** Returns true when the update belonged to the site-login flow. */
async function handleBotLogin(botToken, chatId, text, msg) {
	const { tg } = await import("./telegram.server-Ur5Pj9YJ.mjs");
	const login = await import("./bot-login.server-OJCpzhfp.mjs");
	const fromId = msg?.from?.id;
	if (!fromId || msg?.chat?.type !== "private") return false;
	const startMatch = text.match(/^\/start\s+login_([A-Za-z0-9_-]{16,48})$/);
	if (startMatch) {
		await login.setPending(String(fromId), startMatch[1]);
		await tg(botToken, "sendMessage", {
			chat_id: chatId,
			text: "👋 به بیمه سامان لاهیجان خوش آمدید.\n\nبرای ورود، دکمه‌ی «🔑 لاگین» را که داخل نوار تایپ (بالای کادر پیام) قرار دارد بزنید.\n\nاگر از تلگرام وب یا دسکتاپ استفاده می‌کنید و دکمه کار نکرد، کافی است شماره‌ی موبایل خودتان را تایپ و ارسال کنید (مثال: 09121234567).",
			reply_markup: {
				keyboard: [[{
					text: "🔑 لاگین",
					request_contact: true
				}]],
				resize_keyboard: true,
				one_time_keyboard: true
			}
		});
		return true;
	}
	const contact = msg?.contact;
	let phone = null;
	let via = "bot_contact";
	if (contact) {
		if (contact.user_id !== fromId || !contact.phone_number) {
			await tg(botToken, "sendMessage", {
				chat_id: chatId,
				text: "لطفاً فقط شماره‌ی خودتان را ارسال کنید (دکمه‌ی «🔑 لاگین» یا نوشتن شماره‌ی موبایل خودتان)."
			});
			return true;
		}
		phone = contact.phone_number.startsWith("+") ? contact.phone_number : `+${contact.phone_number}`;
	} else {
		const digits = text.replace(/[^\d+]/g, "");
		const m = /^(?:\+98|0098|98|0)?(9\d{9})$/.exec(digits) ?? null;
		if (!m) return false;
		phone = `+98${m[1]}`;
		via = "bot_typed_phone";
	}
	const nonce = await login.takePending(String(fromId));
	const store = await import("./store.server-DTpY_R4D.mjs");
	const name = [msg?.from?.first_name, msg?.from?.last_name].filter(Boolean).join(" ") || null;
	const userId = await store.upsertIdentity({
		provider: "telegram",
		providerUserId: String(fromId),
		displayName: name,
		data: {
			username: msg?.from?.username ?? null,
			via
		}
	});
	await store.upsertTelegramUser(userId, {
		telegramId: String(fromId),
		username: msg?.from?.username ?? null,
		firstName: msg?.from?.first_name ?? null,
		lastName: msg?.from?.last_name ?? null,
		verified: true
	});
	await store.saveConsentedPhone(userId, phone);
	if (nonce) await login.markDone(nonce, userId);
	await store.logLogin({
		userId,
		method: nonce ? "telegram_bot_site" : "telegram_bot",
		telegramId: String(fromId),
		module: nonce ? "ai_chat" : "telegram_bot",
		status: "success"
	});
	await tg(botToken, "sendMessage", {
		chat_id: chatId,
		text: nonce ? "✅ ورود شما تأیید شد. به سایت برگردید؛ چت هوش مصنوعی فعال شد. همین‌جا در ربات هم می‌توانید سؤال بپرسید." : "✅ ورود شما تأیید شد. حالا سؤال بیمه‌ای خود را بنویسید تا دستیار هوشمند پاسخ دهد.",
		reply_markup: { remove_keyboard: true }
	});
	return true;
}
async function sendLoginCard(botToken, chatId) {
	const { tg } = await import("./telegram.server-Ur5Pj9YJ.mjs");
	await tg(botToken, "sendMessage", {
		chat_id: chatId,
		parse_mode: "HTML",
		text: "🔐 <b>ورود با تلگرام — بیمه سامان</b>\n\nبرای استفاده از دستیار هوشمند بیمه، ابتدا وارد شوید.\n👇 دکمه‌ی <b>«🔑 لاگین»</b> را که داخل نوار تایپ (بالای کادر پیام) قرار دارد بزنید.\n\nاگر دکمه در تلگرام وب یا دسکتاپ کار نکرد، شماره‌ی موبایل خودتان را تایپ و ارسال کنید (مثال: 09121234567).",
		reply_markup: {
			keyboard: [[{
				text: "🔑 لاگین",
				request_contact: true
			}]],
			resize_keyboard: true,
			one_time_keyboard: true
		}
	});
}
/** Sends vehicle/previous-insurance/discount data and asks SI24 for the real price. */
var Route$6 = createFileRoute("/api/third-party/$trackingCode/calculate-price")({ server: { handlers: { POST: async ({ params, request }) => {
	const { si24Request } = await import("./si24.server-0JV3NeIP.mjs");
	const { updateInquiry } = await import("./store.server-Dhm1frb4.mjs");
	const trackingCode = params.trackingCode;
	if (!trackingCode) return Response.json({
		ok: false,
		message: "کد رهگیری نامعتبر است."
	}, { status: 400 });
	let body = {};
	try {
		body = await request.json();
	} catch {
		body = {};
	}
	const manual = body?.manualData;
	if (manual) {
		const manualResult = await si24Request(`/api/insurance-requests/${encodeURIComponent(trackingCode)}/manual-data`, {
			method: "PUT",
			body: manual
		});
		if (!manualResult.ok) return Response.json({
			ok: false,
			error: manualResult.error,
			message: manualResult.message
		}, { status: manualResult.status || 502 });
		await updateInquiry(trackingCode, {
			vehicle_data: manual.vehicle ?? null,
			previous_insurance_data: manual.insuranceData ?? null,
			status: "vehicle_submitted"
		});
	}
	const result = await si24Request(`/api/insurance-requests/${encodeURIComponent(trackingCode)}/calculate-price`, {
		method: "POST",
		body: body?.payload ?? {}
	});
	if (!result.ok) {
		await updateInquiry(trackingCode, { status: "price_failed" });
		return Response.json({
			ok: false,
			error: result.error,
			message: result.message
		}, { status: result.status || 502 });
	}
	await updateInquiry(trackingCode, {
		quote_data: result.data ?? null,
		status: "priced"
	});
	return Response.json({
		ok: true,
		data: result.data
	});
} } } });
/** Full summary of an inquiry (price, coverages) straight from the SI24 API. */
var Route$5 = createFileRoute("/api/third-party/$trackingCode/summary")({ server: { handlers: { GET: async ({ params }) => {
	const { si24Request } = await import("./si24.server-0JV3NeIP.mjs");
	const { updateInquiry, getInquiry } = await import("./store.server-Dhm1frb4.mjs");
	const trackingCode = params.trackingCode;
	if (!trackingCode) return Response.json({
		ok: false,
		message: "کد رهگیری نامعتبر است."
	}, { status: 400 });
	const result = await si24Request(`/api/insurance-requests/${encodeURIComponent(trackingCode)}/full-summary`);
	if (!result.ok) {
		const saved = await getInquiry(trackingCode);
		if (saved?.full_summary) return Response.json({
			ok: true,
			data: saved.full_summary,
			stale: true
		});
		return Response.json({
			ok: false,
			error: result.error,
			message: result.message
		}, { status: result.status || 502 });
	}
	await updateInquiry(trackingCode, {
		full_summary: result.data ?? null,
		status: "summary"
	});
	return Response.json({
		ok: true,
		data: result.data
	});
} } } });
/** Read-only lookup proxy: /api/third-party/lookups/<name> → SI24 lookups. */
var Route$4 = createFileRoute("/api/third-party/lookups/$")({ server: { handlers: { GET: async ({ params, request }) => {
	const { si24Request } = await import("./si24.server-0JV3NeIP.mjs");
	const splat = params._splat ?? "";
	const search = new URL(request.url).search;
	let path = {
		carGroups: "/api/Lookups/carGroups",
		carUsages: "/api/Lookups/carUsages",
		"vehicle-brands": "/api/Lookups/vehicle-brands",
		carFuelType: "/api/Lookups/carFuelType",
		insuranceCompanies: "/api/Lookups/insuranceCompanies",
		"financial-coverages": "/api/Lookups/financial-coverages"
	}[splat];
	const kinds = /^carBrand\/([^/]+)\/kinds$/.exec(splat);
	if (kinds) path = `/api/Lookups/carBrand/${encodeURIComponent(kinds[1])}/kinds`;
	const address = /^address\/(\d{10})$/.exec(splat);
	if (address) path = `/api/address/${address[1]}`;
	if (!path) return Response.json({
		ok: false,
		error: "unknown_lookup"
	}, { status: 404 });
	const result = await si24Request(`${path}${search}`);
	return Response.json(result.ok ? {
		ok: true,
		data: result.data
	} : {
		ok: false,
		error: result.error,
		message: result.message
	}, { status: result.ok ? 200 : result.status || 502 });
} } } });
/**
* POST → starts a bot login (returns the t.me deep link).
* GET  → polls; signs the visitor in once the bot received their phone number.
*/
var Route$3 = createFileRoute("/api/public/auth/telegram/bot-login")({ server: { handlers: {
	POST: async () => {
		const { envValueAsync } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
		const { createNonce, getBotUsername } = await import("./bot-login.server-OJCpzhfp.mjs");
		const { getUserSession } = await import("./session.server-ekuxcXp7.mjs");
		const botToken = await envValueAsync("TELEGRAM_LOGIN_BOT_TOKEN", "TELEGRAM_BOT_TOKEN");
		if (!botToken) return Response.json({
			ok: false,
			error: "bot_not_configured"
		}, { status: 503 });
		const username = await getBotUsername(botToken);
		if (!username) return Response.json({
			ok: false,
			error: "bot_unreachable"
		}, { status: 502 });
		const nonce = createNonce();
		await (await getUserSession()).update({ loginNonce: nonce });
		return Response.json({
			ok: true,
			botUrl: `https://t.me/${username}?start=login_${nonce}`,
			botUsername: username
		});
	},
	GET: async ({ request }) => {
		const { claim, isValidNonce } = await import("./bot-login.server-OJCpzhfp.mjs");
		const { getUserSession, signIn } = await import("./session.server-ekuxcXp7.mjs");
		const { getPublicUser, logLogin } = await import("./store.server-DTpY_R4D.mjs");
		const session = await getUserSession();
		const nonce = session.data.loginNonce;
		if (!nonce || !isValidNonce(nonce)) return Response.json({
			ok: false,
			status: "no_request"
		});
		const userId = await claim(nonce);
		if (!userId) return Response.json({
			ok: false,
			status: "pending"
		});
		await signIn(userId, "telegram");
		await session.update({
			loginNonce: void 0,
			aiCount: 0
		});
		await logLogin({
			userId,
			method: "telegram_bot",
			module: "ai_chat",
			status: "success",
			ip: request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for"),
			userAgent: request.headers.get("user-agent")
		});
		return Response.json({
			ok: true,
			status: "done",
			user: await getPublicUser(userId)
		});
	}
} } });
/**
* Telegram login callback: /api/public/auth/telegram/callback
* Accepts both the OIDC authorization code and the classic Login Widget payload.
* All verification happens here on the server.
*/
var Route$2 = createFileRoute("/api/public/auth/telegram/callback")({ server: { handlers: {
	GET: async ({ request }) => handle(request),
	POST: async ({ request }) => handle(request)
} } });
async function handle(request) {
	const { exchangeCode, verifyWidgetPayload, callbackUrl } = await import("./telegram.server-Eo8giKuZ.mjs");
	const { getUserSession, signIn } = await import("./session.server-ekuxcXp7.mjs");
	const { upsertIdentity, upsertTelegramUser, logLogin } = await import("./store.server-DTpY_R4D.mjs");
	const url = new URL(request.url);
	const params = {};
	for (const [k, v] of url.searchParams.entries()) params[k] = v;
	if (request.method === "POST") try {
		const form = await request.formData();
		for (const [k, v] of form.entries()) params[k] = String(v);
	} catch {}
	const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
	const userAgent = request.headers.get("user-agent");
	let moduleKey = "";
	let next = "/";
	let claims = null;
	try {
		if (params["code"]) {
			const [state, mod, storedNext] = ((await getUserSession()).data.oauthState ?? "").split("|");
			if (!state || params["state"] !== state) return fail("درخواست ورود معتبر نیست. دوباره تلاش کنید.");
			moduleKey = mod ?? "";
			next = storedNext || "/";
			claims = await exchangeCode(params["code"], callbackUrl(url.origin));
		} else if (params["hash"]) {
			claims = await verifyWidgetPayload(params);
			moduleKey = params["module"] ?? "";
			next = params["next"]?.startsWith("/") ? params["next"] : "/";
		}
	} catch (e) {
		console.error("[telegram callback]", e);
		await logLogin({
			method: "telegram",
			module: moduleKey,
			status: "failed",
			ip,
			userAgent
		});
		return fail("ورود با تلگرام انجام نشد. لطفاً دوباره تلاش کنید.");
	}
	if (!claims) {
		await logLogin({
			method: "telegram",
			module: moduleKey,
			status: "failed",
			ip,
			userAgent
		});
		return fail("پاسخ تلگرام معتبر نبود.");
	}
	const displayName = [claims.firstName, claims.lastName].filter(Boolean).join(" ") || claims.username || null;
	const userId = await upsertIdentity({
		provider: "telegram",
		providerUserId: claims.id,
		displayName,
		data: { username: claims.username ?? null }
	});
	await upsertTelegramUser(userId, {
		telegramId: claims.id,
		username: claims.username,
		firstName: claims.firstName,
		lastName: claims.lastName,
		photo: claims.photo,
		verified: true
	});
	await signIn(userId, "telegram");
	await logLogin({
		userId,
		method: "telegram",
		telegramId: claims.id,
		module: moduleKey || null,
		status: "success",
		ip,
		userAgent
	});
	return new Response(null, {
		status: 302,
		headers: { Location: next || "/" }
	});
}
function fail(message) {
	return new Response(null, {
		status: 302,
		headers: { Location: `/login?error=${encodeURIComponent(message)}` }
	});
}
/** Starts the Telegram login: /api/public/auth/telegram/start */
var Route$1 = createFileRoute("/api/public/auth/telegram/start")({ server: { handlers: { GET: async ({ request }) => {
	const { telegramConfig, callbackUrl } = await import("./telegram.server-Eo8giKuZ.mjs");
	const { getUserSession } = await import("./session.server-ekuxcXp7.mjs");
	const url = new URL(request.url);
	const moduleKey = url.searchParams.get("module") ?? "";
	const next = sanitizeNext(url.searchParams.get("next"));
	const cfg = await telegramConfig();
	if (!cfg.clientId) return Response.json({ error: "ورود با تلگرام هنوز پیکربندی نشده است (TELEGRAM_CLIENT_ID)." }, { status: 503 });
	const state = crypto.randomUUID();
	try {
		await (await getUserSession()).update({ oauthState: `${state}|${moduleKey}|${next}` });
	} catch {
		return Response.json({ error: "SESSION_SECRET تنظیم نشده است." }, { status: 503 });
	}
	const redirectUri = callbackUrl(url.origin);
	const authorize = new URL(cfg.authUrl);
	authorize.searchParams.set("client_id", cfg.clientId);
	authorize.searchParams.set("redirect_uri", redirectUri);
	authorize.searchParams.set("response_type", "code");
	authorize.searchParams.set("scope", "openid profile");
	authorize.searchParams.set("state", state);
	return new Response(null, {
		status: 302,
		headers: { Location: authorize.toString() }
	});
} } } });
function sanitizeNext(raw) {
	if (!raw) return "/";
	if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
	return raw;
}
/** Incoming Telegram webhook: /api/public/telegram/webhook/<botId> */
var Route = createFileRoute("/api/public/telegram/webhook/$botId")({ server: { handlers: { POST: async ({ request, params }) => {
	const botId = params.botId;
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	const supabaseAdmin = await getSupabaseAdmin();
	const { data: bot } = await supabaseAdmin.from("telegram_bots").select("id, bot_token, webhook_secret, default_chat_ids, is_active").eq("id", botId).maybeSingle();
	if (!bot) return new Response("Unknown bot", { status: 404 });
	const provided = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
	if (bot.webhook_secret && provided !== bot.webhook_secret) return new Response("Unauthorized", { status: 401 });
	const update = await request.json();
	const msg = update.message ?? update.edited_message ?? update.channel_post;
	if (typeof update.update_id !== "number" || !msg) return Response.json({ ok: true });
	await supabaseAdmin.from("telegram_updates").upsert({
		update_id: update.update_id,
		bot_id: bot.id,
		chat_id: msg.chat?.id ?? null,
		from_user: update.message?.from?.username ?? update.message?.from?.first_name ?? null,
		text: msg.text ?? null,
		payload: update,
		raw: update
	}, { onConflict: "update_id" });
	const text = (msg.text ?? "").trim();
	if (text && bot.is_active) {
		const { data: flows } = await supabaseAdmin.from("telegram_flows").select("id, steps, trigger_keyword, trigger_type, is_active").eq("bot_id", bot.id).eq("trigger_type", "keyword").eq("is_active", true);
		const { parseChatIds, runFlowSteps } = await import("./telegram.server-Ur5Pj9YJ.mjs");
		for (const flow of flows ?? []) {
			const kw = (flow.trigger_keyword ?? "").trim();
			if (!kw || !text.includes(kw)) continue;
			try {
				const res = await runFlowSteps(bot.bot_token, flow.steps ?? [], msg.chat?.id ? [String(msg.chat.id)] : parseChatIds(bot.default_chat_ids));
				await supabaseAdmin.from("telegram_runs").insert({
					flow_id: flow.id,
					bot_id: bot.id,
					status: "ok",
					message: `اجرای خودکار با کلیدواژه «${kw}» — ${res.sent} پیام`,
					details: { log: res.log }
				});
			} catch (e) {
				await supabaseAdmin.from("telegram_runs").insert({
					flow_id: flow.id,
					bot_id: bot.id,
					status: "error",
					message: e instanceof Error ? e.message : String(e)
				});
			}
		}
	}
	return Response.json({ ok: true });
} } } });
var IndexRoute = Route$42.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$43
});
var SplatRoute = Route$41.update({
	id: "/$",
	path: "/$",
	getParentRoute: () => Route$43
});
var BlogRoute = Route$40.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$43
});
var BranchesRoute = Route$39.update({
	id: "/branches",
	path: "/branches",
	getParentRoute: () => Route$43
});
var ContactRoute = Route$38.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$43
});
var DashboardRoute = Route$37.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$43
});
var LoginRoute = Route$36.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$43
});
var PartnersRoute = Route$35.update({
	id: "/partners",
	path: "/partners",
	getParentRoute: () => Route$43
});
var ReportingRoute = Route$34.update({
	id: "/reporting",
	path: "/reporting",
	getParentRoute: () => Route$43
});
var RobotsDottxtRoute = Route$33.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$43
});
var SitemapDotxmlRoute = Route$32.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$43
});
var SuggestionsRoute = Route$31.update({
	id: "/suggestions",
	path: "/suggestions",
	getParentRoute: () => Route$43
});
var ThirdPartyRoute = Route$30.update({
	id: "/third-party",
	path: "/third-party",
	getParentRoute: () => Route$43
});
var ApiAiChatRoute = Route$29.update({
	id: "/api/ai-chat",
	path: "/api/ai-chat",
	getParentRoute: () => Route$43
});
var ApiConsultRoute = Route$28.update({
	id: "/api/consult",
	path: "/api/consult",
	getParentRoute: () => Route$43
});
var ApiReportDamageRoute = Route$27.update({
	id: "/api/report-damage",
	path: "/api/report-damage",
	getParentRoute: () => Route$43
});
var ApiTravelOrderRoute = Route$26.update({
	id: "/api/travel-order",
	path: "/api/travel-order",
	getParentRoute: () => Route$43
});
var EServicesIndexRoute = Route$25.update({
	id: "/e-services/",
	path: "/e-services/",
	getParentRoute: () => Route$43
});
var InsuranceIndexRoute = Route$24.update({
	id: "/insurance/",
	path: "/insurance/",
	getParentRoute: () => Route$43
});
var InsuranceTravelRoute = Route$23.update({
	id: "/insurance/travel",
	path: "/insurance/travel",
	getParentRoute: () => Route$43
});
var PSlugRoute = Route$44.update({
	id: "/p/$slug",
	path: "/p/$slug",
	getParentRoute: () => Route$43
});
var PartnersDashboardRoute = Route$22.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => PartnersRoute
});
var PartnersApplyRoute = Route$21.update({
	id: "/partners_/apply",
	path: "/partners/apply",
	getParentRoute: () => Route$43
});
var ApiAdminAiProvidersRoute = Route$20.update({
	id: "/api/admin/ai-providers",
	path: "/api/admin/ai-providers",
	getParentRoute: () => Route$43
});
var ApiAdminAiSourcesRoute = Route$19.update({
	id: "/api/admin/ai-sources",
	path: "/api/admin/ai-sources",
	getParentRoute: () => Route$43
});
var ApiAdminAssetsRoute = Route$18.update({
	id: "/api/admin/assets",
	path: "/api/admin/assets",
	getParentRoute: () => Route$43
});
var ApiAdminBackendRoute = Route$17.update({
	id: "/api/admin/backend",
	path: "/api/admin/backend",
	getParentRoute: () => Route$43
});
var ApiAdminUploadRoute = Route$16.update({
	id: "/api/admin/upload",
	path: "/api/admin/upload",
	getParentRoute: () => Route$43
});
var ApiPublicEmbedRoute = Route$15.update({
	id: "/api/public/embed",
	path: "/api/public/embed",
	getParentRoute: () => Route$43
});
var ApiPublicEnvCheckRoute = Route$14.update({
	id: "/api/public/env-check",
	path: "/api/public/env-check",
	getParentRoute: () => Route$43
});
var ApiPublicPartnerApplicationsRoute = Route$13.update({
	id: "/api/public/partner-applications",
	path: "/api/public/partner-applications",
	getParentRoute: () => Route$43
});
var ApiPublicPartnerStatsRoute = Route$12.update({
	id: "/api/public/partner-stats",
	path: "/api/public/partner-stats",
	getParentRoute: () => Route$43
});
var ApiPublicSuggestionsRoute = Route$11.update({
	id: "/api/public/suggestions",
	path: "/api/public/suggestions",
	getParentRoute: () => Route$43
});
var ApiThirdPartyStartRoute = Route$10.update({
	id: "/api/third-party/start",
	path: "/api/third-party/start",
	getParentRoute: () => Route$43
});
var ApiPublicAiSourcesRefreshRoute = Route$9.update({
	id: "/api/public/ai-sources/refresh",
	path: "/api/public/ai-sources/refresh",
	getParentRoute: () => Route$43
});
var ApiPublicAssetSplatRoute = Route$8.update({
	id: "/api/public/asset/$",
	path: "/api/public/asset/$",
	getParentRoute: () => Route$43
});
var ApiPublicTelegramBotAiRoute = Route$7.update({
	id: "/api/public/telegram/bot-ai",
	path: "/api/public/telegram/bot-ai",
	getParentRoute: () => Route$43
});
var ApiThirdPartyTrackingCodeCalculatePriceRoute = Route$6.update({
	id: "/api/third-party/$trackingCode/calculate-price",
	path: "/api/third-party/$trackingCode/calculate-price",
	getParentRoute: () => Route$43
});
var ApiThirdPartyTrackingCodeSummaryRoute = Route$5.update({
	id: "/api/third-party/$trackingCode/summary",
	path: "/api/third-party/$trackingCode/summary",
	getParentRoute: () => Route$43
});
var ApiThirdPartyLookupsSplatRoute = Route$4.update({
	id: "/api/third-party/lookups/$",
	path: "/api/third-party/lookups/$",
	getParentRoute: () => Route$43
});
var ApiPublicAuthTelegramBotLoginRoute = Route$3.update({
	id: "/api/public/auth/telegram/bot-login",
	path: "/api/public/auth/telegram/bot-login",
	getParentRoute: () => Route$43
});
var ApiPublicAuthTelegramCallbackRoute = Route$2.update({
	id: "/api/public/auth/telegram/callback",
	path: "/api/public/auth/telegram/callback",
	getParentRoute: () => Route$43
});
var ApiPublicAuthTelegramStartRoute = Route$1.update({
	id: "/api/public/auth/telegram/start",
	path: "/api/public/auth/telegram/start",
	getParentRoute: () => Route$43
});
var ApiPublicTelegramWebhookBotIdRoute = Route.update({
	id: "/api/public/telegram/webhook/$botId",
	path: "/api/public/telegram/webhook/$botId",
	getParentRoute: () => Route$43
});
var PartnersRouteChildren = { PartnersDashboardRoute };
var rootRouteChildren = {
	IndexRoute,
	SplatRoute,
	BlogRoute,
	BranchesRoute,
	ContactRoute,
	DashboardRoute,
	LoginRoute,
	PartnersRoute: PartnersRoute._addFileChildren(PartnersRouteChildren),
	ReportingRoute,
	RobotsDottxtRoute,
	SitemapDotxmlRoute,
	SuggestionsRoute,
	ThirdPartyRoute,
	ApiAiChatRoute,
	ApiConsultRoute,
	ApiReportDamageRoute,
	ApiTravelOrderRoute,
	InsuranceTravelRoute,
	PSlugRoute,
	PartnersApplyRoute,
	EServicesIndexRoute,
	InsuranceIndexRoute,
	ApiAdminAiProvidersRoute,
	ApiAdminAiSourcesRoute,
	ApiAdminAssetsRoute,
	ApiAdminBackendRoute,
	ApiAdminUploadRoute,
	ApiPublicEmbedRoute,
	ApiPublicEnvCheckRoute,
	ApiPublicPartnerApplicationsRoute,
	ApiPublicPartnerStatsRoute,
	ApiPublicSuggestionsRoute,
	ApiThirdPartyStartRoute,
	ApiPublicAiSourcesRefreshRoute,
	ApiPublicAssetSplatRoute,
	ApiPublicTelegramBotAiRoute,
	ApiThirdPartyTrackingCodeCalculatePriceRoute,
	ApiThirdPartyTrackingCodeSummaryRoute,
	ApiThirdPartyLookupsSplatRoute,
	ApiPublicAuthTelegramBotLoginRoute,
	ApiPublicAuthTelegramCallbackRoute,
	ApiPublicAuthTelegramStartRoute,
	ApiPublicTelegramWebhookBotIdRoute
};
var routeTree = Route$43._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
