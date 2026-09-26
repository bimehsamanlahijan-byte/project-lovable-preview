import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Ce41MEoO.mjs";
import { _ as VE_ANIMATIONS, a as DEFAULT_BRANDING, b as logoheder_default, c as DEFAULT_HERO_SLIDER, d as DEFAULT_SPLASH, f as DEFAULT_WHEEL_BACKGROUND, g as SOCIAL_PLATFORMS, h as GITHUB_SETTING_KEY, i as DEFAULT_AI_AGENCY, l as DEFAULT_LIVE_CHAT, m as DEFAULT_WIDGETS, n as DEFAULT_AI, o as DEFAULT_DOCS, p as DEFAULT_WHEEL_INTRO, r as DEFAULT_AI_ADVISOR, s as DEFAULT_GITHUB_SYNC, t as DASHBOARD_LOGO, u as DEFAULT_SOCIAL_LAYOUT, v as WHEEL_BG_MODES, x as pickWheelBgIndex, y as WHEEL_INNER_MODES } from "./site-config-DDR4aELm.mjs";
import { i as require_react, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { At as CircleQuestionMark, B as MessageSquarePlus, C as Search, D as Plus, Dt as CloudUpload, E as RefreshCw, Et as Cloud, F as PanelBottom, Ft as Check, G as LogOut, H as Menu, Ht as BookOpen, I as MoveHorizontal, K as Lock, Kt as ArrowDown, L as Monitor, Lt as Car, Nt as ChevronLeft, O as PlugZap, Ot as CloudDownload, P as Pencil, Q as KeyRound, R as MessageSquare, S as Send, St as Database, T as Rocket, Ut as BadgeCheck, Vt as Bot, Wt as ArrowUp, X as LayoutDashboard, Y as Link2, _t as Eye, ct as GripVertical, d as Trash2, dt as Gauge, et as Info, f as Tablet, ft as FolderOpen, g as Smartphone, h as Sparkles, ht as FileBraces, i as WandSparkles, j as Pipette, jt as CircleCheck, k as Play, kt as CircleX, lt as Globe, nt as Images, o as Users, p as Swords, pt as FilePlusCorner, q as LoaderCircle, r as X, s as Upload, st as HardDrive, t as Zap, tt as Image, u as TriangleAlert, ut as Github, vt as EyeOff, w as Save, wt as Copy, x as Share2, xt as Download, yt as ExternalLink, z as MessagesSquare, zt as Bug } from "../_libs/lucide-react.mjs";
import { a as SocialIcon, i as SocialBar, n as SITE_LOGO, o as navItems, r as SITE_LOGO_HEADER, s as useBranding } from "./SocialBar-KaP2tZNZ.mjs";
import { A as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as insuranceContent } from "./insurance-content-BZZMaCrZ.mjs";
import { t as hubContent } from "./insurance-hubs-y-2JY2Q6.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as makeBlock, n as CUSTOM_PAGES_KEY, o as pageUrl, r as emptyPage, s as sanitizeSlug, t as BLOCK_TYPES } from "./custom-pages-BHkSwtZN.mjs";
import { t as DEFAULT_LINK_POLICY } from "./ai-link-policy-B_2XyXfA.mjs";
import { r as getProvider, t as AI_PROVIDERS } from "./ai-providers-BH3QpR-b.mjs";
import { i as TELEGRAM_CALLBACK_PATH, n as LOGIN_MODULES, r as LOGIN_PROVIDERS, t as LOGIN_MODE_LABELS } from "./registry-DLN8hP8L.mjs";
import { t as createSsrRpc } from "./createSsrRpc-kcIQd4y9.mjs";
import { a as joinUrl, n as SECONDARY_DOMAIN, r as cleanOrigin, t as PRIMARY_DOMAIN } from "./seo-url-u7NDYTbH.mjs";
import { n as SEO_SETTING_KEY, r as normalizeBase, t as DEFAULT_SEO } from "./seo-config-B5a56N7O.mjs";
import { i as listCustomPages, n as fetchPageHtml, t as extractPageFromUrl } from "./custom-pages.functions-BBnFzSYw.mjs";
import { n as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Bleboj4S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var githubCheckAccount = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("d030c2e0bafea736828049dd0284dbd430ffab2130dac89c587382df40a5e881"));
var githubPublishSnapshot = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("2c93638c92e48561626500d885a7eacee0909bed2f9bfe2df541ab75689a08d1"));
var EVENT = "admin:notify";
function notify(payload) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent(EVENT, { detail: payload }));
}
function notifySaved(what) {
	notify({
		kind: "success",
		title: "عملیات با موفقیت انجام شد",
		detail: `${what} ذخیره و روی وب‌سایت اصلی منتشر شد و هم‌اکنون برای بازدیدکنندگان قابل مشاهده است.`
	});
}
function notifyFailed(what, reason) {
	notify({
		kind: "error",
		title: "عملیات انجام نشد",
		detail: reason ? `${what}: ${reason}` : `${what} ذخیره نشد. لطفاً دوباره تلاش کنید.`
	});
}
/** Big, elegant confirmation banner. Mount once inside the dashboard. */
function AdminToaster() {
	const [item, setItem] = (0, import_react.useState)(null);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onEvt = (e) => {
			const detail = e.detail;
			setItem({
				...detail,
				id: Date.now()
			});
			if (detail.kind === "error") {
				setPrompt(buildRepairPrompt(detail));
				setCopied(false);
			}
		};
		window.addEventListener(EVENT, onEvt);
		return () => window.removeEventListener(EVENT, onEvt);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!item) return;
		if (item.kind === "error") return;
		const t = window.setTimeout(() => setItem(null), 3800);
		return () => window.clearTimeout(t);
	}, [item]);
	if (!item) return null;
	const ok = item.kind === "success";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		className: "fixed inset-x-0 top-4 z-[9999] flex justify-center px-4 pointer-events-none",
		role: "status",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `pointer-events-auto w-full max-w-md rounded-xl px-4 py-3 shadow-xl ring-1 backdrop-blur text-white animate-[admin-toast-in_.35s_ease-out] ${ok ? "bg-gradient-to-l from-emerald-600 to-emerald-500 ring-emerald-300/50" : "bg-gradient-to-l from-rose-600 to-rose-500 ring-rose-300/50"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-lg bg-white/20 grid place-items-center flex-shrink-0",
						children: ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-extrabold leading-6",
							children: item.title
						}), item.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs opacity-95 leading-5 mt-0.5 break-words",
							children: persianReason(item.detail)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setItem(null),
						className: "p-1 rounded-md hover:bg-white/15",
						"aria-label": "بستن",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})
				]
			}), !ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-lg bg-white/10 p-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-[11px] font-bold mb-1.5",
						children: "پرامپت فنی قابل ویرایش"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						dir: "ltr",
						value: prompt,
						onChange: (event) => setPrompt(event.target.value),
						rows: 5,
						className: "w-full resize-y rounded-md border border-white/25 bg-black/15 px-2.5 py-2 text-[10px] leading-4 text-white outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: async () => {
							await navigator.clipboard.writeText(prompt);
							setCopied(true);
						},
						className: "mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-bold text-rose-700",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), copied ? "کپی شد" : "کپی پرامپت"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes admin-toast-in{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:none}}` })]
	});
}
function persianReason(detail) {
	if (detail.includes("Missing Supabase environment variable")) return "اتصال امن پایگاه داده در محیط اجرا کامل نیست. اتصال سرویس ابری را بررسی کنید.";
	if (detail.includes("UNAUTHORIZED")) return "نشست مدیریت منقضی شده است؛ دوباره وارد پیشخوان شوید.";
	return detail;
}
function buildRepairPrompt(item) {
	const route = typeof window === "undefined" ? "/dashboard" : window.location.pathname;
	return `You are debugging a TanStack Start v1 + React 19 application deployed to Cloudflare.\n\nUser-visible failure: ${item.title}\nTechnical detail: ${item.detail ?? "No technical detail was returned"}\nRoute: ${route}\n\nPlease identify the root cause, inspect the server/client boundary and environment configuration, propose the smallest secure fix, and provide exact code changes. Do not expose secrets, weaken database access policies, or move privileged operations to the browser. Also check for related failures in sibling save paths.`;
}
var dashboardStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("67a0e7a66668c32491729b143de3bfb1242d582e4240e1dd02c8bd59a0240842"));
var unlockDashboard = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("0ce868ec34b17ffd8108c60f02767f2543c7f2744241e14503b22117d02507d7"));
createServerFn({ method: "GET" }).handler(createSsrRpc("75d239cc9e72973400f9fd9ad206c57b3a00f57c0f6d0b3039fcfa5936326e03"));
createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("8892024b89a0b0447cd2686a50c663eb500050c8da717bd5db5eb2da9059fc3c"));
var lockDashboard = createServerFn({ method: "POST" }).handler(createSsrRpc("9c0c39ecea61ac7c7af85dff415071dbbea1f4acfb449ab7e79f5e37a0be4a92"));
var adminExec = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("cd28b0093c6a8ede3abd9454e88fea469d3817c82e73af6f61346a077a9d5a7f"));
var telegramSetWebhook = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("6d61ddcb570a811cd52a1c93d6e111d2f0121c29dfc473640acb136ada505110"));
var telegramGetInfo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("11eb8a581a1ccadbaf196063b21ce8dda729954812e248b1787c912bb56f07c5"));
var telegramRunFlow = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("08ca19700bd34ed643ffcfa4df6b09380bed19c84dbc9a9893c084e08f51e216"));
var adminSignedUrl = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("3e3ee91f0fffa18c6fba0fb43f6d072cd7043a07e4f5c8b6a272024335b5a7a4"));
var storageTargetInfo = createServerFn({ method: "GET" }).handler(createSsrRpc("87eb6f0e5e1249232be13d061d82969468df7324f2c20db9db43f22bc9c58c98"));
var saveStorageTarget = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("c6c4661cffc860e229a1f5c71b24075426b810c14b684027ff52583f38d915a7"));
var clearStorageTarget = createServerFn({ method: "POST" }).handler(createSsrRpc("ca83406260384d63445188fd729fa48e34e8a3883b3fd9a9617036e4a12255fd"));
var defaultBotStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("bcd358f3a7a446bec28a69c7517086d4f0e4af0463bb148ac8ce95d8a7b62c60"));
var defaultBotSetWebhook = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("52412bbdf06baee5de6acc8788feb70d9ff28a25e22aa31c6a774861157c78e4"));
var Builder = class {
	op;
	constructor(op) {
		this.op = op;
	}
	eq(column, value) {
		this.op.match = {
			...this.op.match ?? {},
			[column]: value
		};
		return this;
	}
	order(column, opts) {
		this.op.order = {
			column,
			ascending: opts?.ascending ?? true
		};
		return this;
	}
	limit(n) {
		this.op.limit = n;
		return this;
	}
	select(columns = "*") {
		this.op.select = columns;
		return this;
	}
	single() {
		this.op.single = "single";
		return this;
	}
	maybeSingle() {
		this.op.single = "maybeSingle";
		return this;
	}
	async run() {
		try {
			return await adminExec({ data: this.op });
		} catch (e) {
			return {
				data: null,
				count: null,
				error: { message: e instanceof Error ? e.message : String(e) }
			};
		}
	}
	then(onfulfilled, onrejected) {
		return this.run().then(onfulfilled, onrejected);
	}
};
/**
* Password-gated admin data access.
* Mirrors the small subset of the supabase client API the dashboard uses,
* but every call runs server-side behind the dashboard session cookie.
*/
function adminDb(table) {
	return {
		select(columns = "*", opts) {
			return new Builder({
				table,
				action: "select",
				select: columns,
				count: opts?.count === "exact",
				head: opts?.head ?? false
			});
		},
		insert(values) {
			return new Builder({
				table,
				action: "insert",
				values
			});
		},
		upsert(values, opts) {
			return new Builder({
				table,
				action: "upsert",
				values,
				onConflict: opts?.onConflict
			});
		},
		update(values) {
			return new Builder({
				table,
				action: "update",
				values
			});
		},
		delete() {
			return new Builder({
				table,
				action: "delete"
			});
		}
	};
}
async function adminReadSetting(key, fallback) {
	const value = (await adminDb("site_settings").select("value").eq("key", key).maybeSingle()).data?.value;
	if (!value) return fallback;
	return {
		...fallback,
		...value
	};
}
async function adminWriteSetting(key, value) {
	const res = await adminDb("site_settings").upsert({
		key,
		value,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "key" });
	const { notifySaved, notifyFailed } = await import("./notify-CYP5Wd5H.mjs");
	let err = res?.error?.message ?? null;
	if (!err) {
		const check = await adminDb("site_settings").select("key").eq("key", key).maybeSingle();
		const checkErr = check?.error?.message ?? null;
		if (checkErr) err = checkErr;
		else if (!check.data) err = "نوشتن در دیتابیس انجام نشد (کلید سرور تنظیم نشده است).";
	}
	if (err) notifyFailed("تغییرات", err);
	else {
		notifySaved("تغییرات");
		autoPushToGithub(key);
	}
	return {
		...res,
		ok: !err,
		error: err ? { message: err } : null
	};
}
/** Mirrors the saved content to the default GitHub repo when auto-sync is on. */
async function autoPushToGithub(changedKey) {
	try {
		const { GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC } = await import("./site-config-DDR4aELm.mjs").then((n) => n.C).then((n) => n.S);
		if (changedKey === GITHUB_SETTING_KEY) return;
		const cfg = await adminReadSetting(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC);
		if (!cfg.autoSync) return;
		const acc = cfg.accounts.find((a) => a.isDefault) ?? cfg.accounts[0];
		if (!acc?.owner || !acc.repo) return;
		const { githubPublishSnapshot } = await import("./github.functions-CxuqlQNR.mjs");
		const res = await githubPublishSnapshot({ data: {
			secretName: acc.secretName,
			owner: acc.owner,
			repo: acc.repo,
			branch: acc.branch,
			path: acc.path,
			note: `به‌روزرسانی خودکار از پیشخوان (${changedKey})`
		} });
		const { notifySaved, notifyFailed } = await import("./notify-CYP5Wd5H.mjs");
		if (res.ok) notifySaved("ارسال خودکار به گیت‌هاب");
		else if (!String(res.error ?? "").includes("GITHUB_TOKEN_MISSING")) notifyFailed("ارسال خودکار به گیت‌هاب", res.error);
	} catch {}
}
var inputCls$19 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function SocialPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [layout, setLayout] = (0, import_react.useState)(DEFAULT_SOCIAL_LAYOUT);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [nonce, setNonce] = (0, import_react.useState)(0);
	async function load() {
		const [{ data }, cfg] = await Promise.all([adminDb("social_links").select("*").order("position", { ascending: true }), adminReadSetting("social_layout", DEFAULT_SOCIAL_LAYOUT)]);
		setRows(data ?? []);
		setLayout(cfg);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	function patch(id, p) {
		setRows((r) => r.map((x) => x.id === id ? {
			...x,
			...p
		} : x));
	}
	async function addRow() {
		const { data, error } = await adminDb("social_links").insert({
			platform: "telegram",
			label: "تلگرام",
			username: "@azarakhsh",
			url: "https://t.me/azarakhsh",
			icon_key: "telegram",
			size_px: 36,
			position: rows.length + 1,
			is_active: true
		}).select().single();
		if (!error && data) setRows((r) => [...r, data]);
	}
	async function saveAll() {
		setBusy(true);
		setMsg("");
		const results = await Promise.all(rows.map((r) => adminDb("social_links").update({
			platform: r.platform,
			label: r.label,
			username: r.username,
			url: r.url,
			icon_key: r.icon_key,
			custom_icon_url: r.custom_icon_url,
			size_px: r.size_px,
			position: r.position,
			is_active: r.is_active
		}).eq("id", r.id)));
		const cfg = await adminWriteSetting("social_layout", layout);
		setBusy(false);
		const failed = results.some((r) => r.error) || cfg.error;
		setMsg(failed ? "ذخیره برخی موارد انجام نشد." : "با موفقیت ذخیره شد ✓");
		setNonce((n) => n + 1);
	}
	async function remove(id) {
		await adminDb("social_links").delete().eq("id", id);
		setRows((r) => r.filter((x) => x.id !== id));
		setNonce((n) => n + 1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f]",
				children: "شبکه‌های اجتماعی فوتر"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "افزودن، حذف، تغییر نام کاربری، اندازه لوگو و نوع چینش برای هر شبکه."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void load(),
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), " بازخوانی"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void addRow(),
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " شبکه جدید"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void saveAll(),
						disabled: busy,
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره همه"]
					})
				]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-4 mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "نوع چینش"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: layout.layout,
						onChange: (e) => setLayout({
							...layout,
							layout: e.target.value
						}),
						className: inputCls$19,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "row",
								children: "ردیفی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "grid",
								children: "شبکه‌ای"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "column",
								children: "ستونی"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "تراز"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: layout.align,
						onChange: (e) => setLayout({
							...layout,
							align: e.target.value
						}),
						className: inputCls$19,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "start",
								children: "راست‌چین"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "center",
								children: "وسط"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "end",
								children: "چپ‌چین"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "فاصله (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: layout.gap,
						onChange: (e) => setLayout({
							...layout,
							gap: Number(e.target.value)
						}),
						className: inputCls$19
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "شکل لوگو"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: layout.shape,
						onChange: (e) => setLayout({
							...layout,
							shape: e.target.value
						}),
						className: inputCls$19,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "circle",
								children: "دایره"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rounded",
								children: "گرد"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "square",
								children: "مربع"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: layout.showLabels,
						onChange: (e) => setLayout({
							...layout,
							showLabels: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "نمایش نام شبکه (فقط در پیشخوان)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: layout.showUsernames,
						onChange: (e) => setLayout({
							...layout,
							showUsernames: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "نمایش نام کاربری (فقط در پیشخوان)"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-[#0b1e3f] rounded-2xl p-5 mb-6 text-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-bold mb-3 opacity-80",
				children: "پیش‌نمایش (فقط برای شما — در سایت تنها آیکن دیده می‌شود)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialBar, { adminPreview: true }, nonce)]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-4 grid md:grid-cols-12 gap-3 items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-1 flex justify-center pb-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialIcon, {
							platform: r.platform,
							iconKey: r.icon_key,
							customIconUrl: r.custom_icon_url,
							size: r.size_px,
							shape: layout.shape,
							label: r.label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "شبکه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: r.platform,
							onChange: (e) => {
								const p = SOCIAL_PLATFORMS.find((x) => x.value === e.target.value);
								patch(r.id, {
									platform: e.target.value,
									icon_key: e.target.value,
									label: p?.label ?? r.label
								});
							},
							className: inputCls$19,
							children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.value,
								children: p.label
							}, p.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان نمایشی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: r.label,
							onChange: (e) => patch(r.id, { label: e.target.value }),
							className: inputCls$19
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نام کاربری"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: r.username ?? "",
							onChange: (e) => patch(r.id, { username: e.target.value }),
							className: inputCls$19
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "لینک"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: r.url,
							onChange: (e) => patch(r.id, { url: e.target.value }),
							className: inputCls$19
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "اندازه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 16,
							max: 96,
							value: r.size_px,
							onChange: (e) => patch(r.id, { size_px: Number(e.target.value) }),
							className: inputCls$19
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "ترتیب"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: r.position,
							onChange: (e) => patch(r.id, { position: Number(e.target.value) }),
							className: inputCls$19
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1 text-[11px] font-bold text-slate-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: r.is_active,
								onChange: (e) => patch(r.id, { is_active: e.target.checked })
							}), " فعال"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void remove(r.id),
							className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
							"aria-label": "حذف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-12 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "آدرس لوگوی سفارشی (اختیاری)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: r.custom_icon_url ?? "",
							onChange: (e) => patch(r.id, { custom_icon_url: e.target.value }),
							placeholder: "https://...",
							className: inputCls$19
						})]
					})
				]
			}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-slate-500 bg-white rounded-2xl p-8 text-center",
				children: "هنوز شبکه‌ای اضافه نشده است."
			})]
		})
	] });
}
var BRANCHES = [
	"شخص ثالث",
	"بدنه خودرو",
	"عمر و تشکیل سرمایه",
	"درمان تکمیلی",
	"آتش‌سوزی",
	"مسئولیت",
	"مسافرتی",
	"حوادث انفرادی",
	"باربری",
	"مهندسی",
	"انرژی",
	"بیمه‌های خرد و اعتباری"
];
var inputCls$18 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var tagOf = (b) => `sales:${b}`;
/** Editable sales playbook per insurance branch; stored as approved AI knowledge. */
function SalesPlaybookSection() {
	const [branch, setBranch] = (0, import_react.useState)(BRANCHES[0]);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [pitch, setPitch] = (0, import_react.useState)("");
	const [objections, setObjections] = (0, import_react.useState)("");
	const [payment, setPayment] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await adminDb("ai_knowledge").select("*");
			setRows((data ?? []).filter((r) => typeof r.tags === "string" && r.tags.startsWith("sales:")));
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		const parts = (rows.find((r) => r.tags === tagOf(branch))?.content ?? "").split("\n---\n");
		setPitch(parts[0] ?? "");
		setObjections(parts[1] ?? "");
		setPayment(parts[2] ?? "");
	}, [branch, rows]);
	async function save() {
		setBusy(true);
		setMsg("");
		const content = [
			pitch.trim(),
			objections.trim(),
			payment.trim()
		].join("\n---\n");
		const title = `روش فروش ${branch}`;
		const tags = tagOf(branch);
		const existing = rows.find((r) => r.tags === tags);
		if (existing) {
			const { error } = await adminDb("ai_knowledge").update({
				title,
				content,
				is_active: true
			}).eq("id", existing.id);
			if (!error) setRows((p) => p.map((r) => r.id === existing.id ? {
				...r,
				title,
				content
			} : r));
			setMsg(error ? "ذخیره نشد." : "ذخیره شد ✓");
		} else {
			const { data, error } = await adminDb("ai_knowledge").insert({
				title,
				content,
				tags,
				position: 100 + BRANCHES.indexOf(branch),
				is_active: true
			}).select().single();
			if (!error && data) setRows((p) => [...p, data]);
			setMsg(error ? "ذخیره نشد." : "ذخیره شد ✓");
		}
		setBusy(false);
	}
	const filled = rows.filter((r) => (r.content ?? "").trim().length > 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f] flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }), " روش‌های فروش هر شاخه بیمه"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-slate-500",
					children: [filled, " شاخه تکمیل شده"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500 mb-4 leading-6",
				children: "متن فروش، پاسخ به اعتراض‌های رایج و روش‌های پرداخت هر شاخه را اینجا بنویسید؛ هوش مصنوعی مثل یک نماینده حرفه‌ای بیمه سامان از همین اطلاعات استفاده می‌کند."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 mb-4",
				children: BRANCHES.map((b) => {
					const has = rows.some((r) => r.tags === tagOf(b) && (r.content ?? "").trim());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setBranch(b),
						className: `text-[11px] px-3 py-1.5 rounded-full border ${branch === b ? "bg-[#0b1e3f] text-white border-[#0b1e3f]" : "bg-slate-50 border-slate-200 text-slate-600"}`,
						children: [has ? "✓ " : "", b]
					}, b);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "روش و متن فروش"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 6,
							value: pitch,
							onChange: (e) => setPitch(e.target.value),
							className: inputCls$18
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "پاسخ به اعتراض‌های مشتری"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 6,
							value: objections,
							onChange: (e) => setObjections(e.target.value),
							className: inputCls$18
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "روش‌های پرداخت و اقساط"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 6,
							value: payment,
							onChange: (e) => setPayment(e.target.value),
							className: inputCls$18
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void save(),
					disabled: busy,
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره این شاخه"]
				}), msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-slate-600",
					children: msg
				})]
			})
		]
	});
}
var inputCls$17 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
async function api(body) {
	return await (await fetch("/api/admin/ai-sources", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})).json().catch(() => ({
		ok: false,
		error: "network"
	}));
}
var fa = (iso) => iso ? new Date(iso).toLocaleString("fa-IR", {
	dateStyle: "short",
	timeStyle: "short"
}) : "—";
/**
* Independent, controllable knowledge sources: official Saman Insurance pages the
* assistant refreshes itself, plus manual refresh and per-source approval.
*/
function KnowledgeSourcesSection() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [syncingAll, setSyncingAll] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({
		title: "",
		url: "",
		branch: ""
	});
	async function load() {
		setLoading(true);
		try {
			const json = await (await fetch("/api/admin/ai-sources")).json();
			if (json.ok) setRows(json.sources ?? []);
			else setMsg(`خواندن منابع انجام نشد: ${json.error ?? ""}`);
		} catch {
			setMsg("خطای شبکه در خواندن منابع.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function add() {
		if (!/^https?:\/\//i.test(draft.url.trim())) {
			setMsg("نشانی منبع باید با https:// شروع شود.");
			return;
		}
		const res = await api({
			action: "add",
			title: draft.title.trim() || "منبع جدید",
			url: draft.url.trim(),
			branch: draft.branch.trim() || null
		});
		setMsg(res.ok ? "منبع اضافه شد ✓" : `اضافه نشد: ${res.error ?? ""}`);
		if (res.ok) {
			setDraft({
				title: "",
				url: "",
				branch: ""
			});
			await load();
		}
	}
	async function saveRow(row) {
		setBusyId(row.id);
		const res = await api({
			action: "update",
			id: row.id,
			patch: {
				title: row.title,
				url: row.url,
				branch: row.branch,
				is_active: row.is_active,
				auto_approve: row.auto_approve,
				interval_hours: row.interval_hours
			}
		});
		setBusyId(null);
		setMsg(res.ok ? "ذخیره شد ✓" : `ذخیره نشد: ${res.error ?? ""}`);
	}
	async function syncRow(id) {
		setBusyId(id);
		setMsg("");
		const res = await api({
			action: "sync",
			id
		});
		setBusyId(null);
		setMsg(res.ok ? "اطلاعات این منبع بروزرسانی شد ✓" : `بروزرسانی نشد: ${res.error ?? ""}`);
		await load();
	}
	async function syncAll() {
		setSyncingAll(true);
		setMsg("");
		const res = await api({ action: "syncAll" });
		setSyncingAll(false);
		const failed = (res.results ?? []).filter((r) => !r.ok);
		setMsg(res.ok ? failed.length === 0 ? "همه منابع بروزرسانی شدند ✓" : `بروزرسانی انجام شد؛ ${failed.length} منبع ناموفق بود: ${failed.map((f) => f.title).join("، ")}` : `بروزرسانی نشد: ${res.error ?? ""}`);
		await load();
	}
	async function remove(id) {
		setBusyId(id);
		const res = await api({
			action: "remove",
			id
		});
		setBusyId(null);
		if (res.ok) setRows((p) => p.filter((r) => r.id !== id));
		else setMsg(`حذف نشد: ${res.error ?? ""}`);
	}
	const patch = (id, p) => setRows((prev) => prev.map((r) => r.id === id ? {
		...r,
		...p
	} : r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f] flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4" }), " منابع اطلاعاتی هوش مصنوعی (بروزرسانی از سایت رسمی بیمه سامان)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void syncAll(),
					disabled: syncingAll,
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50",
					children: [syncingAll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "بروزرسانی همه منابع"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500 mb-4 leading-6",
				children: "هر منبع یک صفحه رسمی بیمه سامان است. با بروزرسانی، متن صفحه خوانده و به یک برگه دانش فارسی (پوشش‌ها، استثناها، شرایط و مدارک) تبدیل می‌شود و در «دانش تأییدشده» با عنوان «منبع رسمی — …» ذخیره می‌گردد. نشانی سایت منبع هرگز به مشتری نشان داده نمی‌شود و فقط اطلاعات تماس و فروش نمایندگی آذرخش به کاربر داده می‌شود."
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 leading-6",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-12 gap-2 mb-5 items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان منبع"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.title,
							onChange: (e) => setDraft({
								...draft,
								title: e.target.value
							}),
							className: inputCls$17,
							placeholder: "مثلاً بیمه درمان تکمیلی"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نشانی صفحه رسمی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: draft.url,
							onChange: (e) => setDraft({
								...draft,
								url: e.target.value
							}),
							className: inputCls$17,
							placeholder: "https://www.samaninsurance.ir/..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "شاخه بیمه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.branch,
							onChange: (e) => setDraft({
								...draft,
								branch: e.target.value
							}),
							className: inputCls$17
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void add(),
						className: "md:col-span-2 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن منبع"]
					})
				]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-slate-500 py-4 text-center",
				children: "در حال خواندن منابع…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "عنوان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: r.title,
								onChange: (e) => patch(r.id, { title: e.target.value }),
								className: inputCls$17
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "نشانی"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: r.url,
								onChange: (e) => patch(r.id, { url: e.target.value }),
								className: inputCls$17
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "شاخه"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: r.branch ?? "",
								onChange: (e) => patch(r.id, { branch: e.target.value }),
								className: inputCls$17
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "هر چند ساعت"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								value: r.interval_hours,
								onChange: (e) => patch(r.id, { interval_hours: Number(e.target.value) || 168 }),
								className: inputCls$17
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-12 flex flex-wrap items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-1.5 text-[11px] font-bold text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: r.is_active,
										onChange: (e) => patch(r.id, { is_active: e.target.checked })
									}), " فعال"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-1.5 text-[11px] font-bold text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: r.auto_approve,
										onChange: (e) => patch(r.id, { auto_approve: e.target.checked })
									}), " انتشار خودکار برای هوش مصنوعی"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-500",
									children: [
										"آخرین بروزرسانی: ",
										fa(r.last_synced_at),
										r.last_status ? ` — وضعیت: ${r.last_status === "ok" ? "موفق" : r.last_status === "pending_review" ? "در انتظار تأیید" : "ناموفق"}` : "",
										r.last_chars ? ` — ${r.last_chars} کاراکتر` : ""
									]
								}),
								r.last_error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-rose-600",
									children: ["خطا: ", r.last_error]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 ms-auto",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => void saveRow(r),
											disabled: busyId === r.id,
											className: "flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-3.5 h-3.5" }), " ذخیره"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => void syncRow(r.id),
											disabled: busyId === r.id,
											className: "flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-50",
											children: [busyId === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " بروزرسانی"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => void remove(r.id),
											className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
											"aria-label": "حذف",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})
									]
								})
							]
						})
					]
				}, r.id)), !loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-slate-500 text-center py-6",
					children: "هنوز منبعی ثبت نشده است."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-[11px] text-slate-500 leading-6",
				children: [
					"بروزرسانی خودکار زمان‌بندی‌شده: یک زمان‌بند (Cron) را به نشانی ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: "/api/public/ai-sources/refresh"
					}),
					" با هدر ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: "Authorization: Bearer <AI_SOURCES_CRON_SECRET>"
					}),
					" وصل کنید تا منابعی که زمان بروزرسانی‌شان رسیده، خودکار تازه شوند."
				]
			})
		]
	});
}
var inputCls$16 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function AiPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_AI);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [test, setTest] = (0, import_react.useState)("");
	const [testOut, setTestOut] = (0, import_react.useState)("");
	const [testing, setTesting] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			setCfg(await adminReadSetting("ai_assistant", DEFAULT_AI));
			const { data } = await adminDb("ai_knowledge").select("*").order("position", { ascending: true });
			setRows(data ?? []);
			try {
				const json = await (await fetch("/api/admin/ai-providers")).json();
				setStatus(json.status ?? []);
			} catch {
				setStatus([]);
			}
		})();
	}, []);
	async function saveAll() {
		setBusy(true);
		setMsg("");
		const s = await adminWriteSetting("ai_assistant", cfg);
		const res = await Promise.all(rows.map((r) => adminDb("ai_knowledge").update({
			title: r.title,
			content: r.content,
			tags: r.tags,
			position: r.position,
			is_active: r.is_active
		}).eq("id", r.id)));
		setBusy(false);
		setMsg(s.error || res.some((r) => r.error) ? "ذخیره ناقص انجام شد." : "تنظیمات و دانش ذخیره شد ✓");
	}
	async function addRow() {
		const { data, error } = await adminDb("ai_knowledge").insert({
			title: "موضوع جدید",
			content: "توضیح صحیح و تأییدشده را اینجا بنویسید.",
			position: rows.length + 1,
			is_active: true
		}).select().single();
		if (!error && data) setRows((r) => [...r, data]);
	}
	async function remove(id) {
		await adminDb("ai_knowledge").delete().eq("id", id);
		setRows((r) => r.filter((x) => x.id !== id));
	}
	async function runTest() {
		if (!test.trim()) return;
		setTesting(true);
		setTestOut("");
		try {
			const res = await fetch("/api/ai-chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: [{
					role: "user",
					content: test.trim()
				}] })
			});
			const data = await res.json();
			setTestOut(data.ok && data.reply ? data.reply : `خطا: ${data.error ?? res.status}`);
		} catch {
			setTestOut("خطای شبکه");
		} finally {
			setTesting(false);
		}
	}
	const activeProvider = getProvider(cfg.provider);
	const activeMissing = status.find((s) => s.id === activeProvider.id)?.missing ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f]",
				children: "چت هوش مصنوعی"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "انتخاب موتور هوش مصنوعی، دستور رفتاری و اصلاح اطلاعات محصولات بیمه سامان."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => void saveAll(),
				disabled: busy,
				className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "سرویس‌دهنده هوش مصنوعی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: cfg.provider ?? "lovable",
							onChange: (e) => {
								const p = getProvider(e.target.value);
								setCfg({
									...cfg,
									provider: p.id,
									model: p.models[0]?.value ?? cfg.model
								});
							},
							className: inputCls$16,
							children: AI_PROVIDERS.map((p) => {
								const st = status.find((s) => s.id === p.id);
								const mark = st ? st.missing.length === 0 ? "✓" : "•" : "";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p.id,
									children: `${mark} ${p.label}`
								}, p.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px] text-slate-400 mt-1 leading-5",
							children: activeProvider.note
						}),
						activeMissing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-[10px] text-rose-600 mt-1 leading-5",
							children: [
								"برای فعال شدن این سرویس، متغیر(های) ",
								activeMissing.join("، "),
								" را در تنظیمات Cloudflare (Workers → Settings → Variables) ثبت کنید."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "مدل"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: cfg.model,
							onChange: (e) => setCfg({
								...cfg,
								model: e.target.value
							}),
							className: inputCls$16,
							children: [activeProvider.models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.value,
								children: m.label
							}, m.value)), !activeProvider.models.some((m) => m.value === cfg.model) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: cfg.model,
								children: cfg.model
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: cfg.model,
							onChange: (e) => setCfg({
								...cfg,
								model: e.target.value
							}),
							placeholder: "نام مدل دلخواه",
							className: `${inputCls$16} mt-2`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "عنوان پنجره چت"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.title,
						onChange: (e) => setCfg({
							...cfg,
							title: e.target.value
						}),
						className: inputCls$16
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "پیام خوش‌آمد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.welcome,
						onChange: (e) => setCfg({
							...cfg,
							welcome: e.target.value
						}),
						className: inputCls$16
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "دستور رفتاری (به هوش مصنوعی چه چیزی را توضیح دهد)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 5,
						value: cfg.systemPrompt,
						onChange: (e) => setCfg({
							...cfg,
							systemPrompt: e.target.value
						}),
						className: inputCls$16
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: [
							"میزان خلاقیت (",
							cfg.temperature,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 1,
						step: .1,
						value: cfg.temperature,
						onChange: (e) => setCfg({
							...cfg,
							temperature: Number(e.target.value)
						}),
						className: "w-full"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: cfg.enabled,
						onChange: (e) => setCfg({
							...cfg,
							enabled: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "نمایش دستیار در سایت"
					})]
				})
			]
		}),
		(() => {
			const lp = {
				...DEFAULT_LINK_POLICY,
				...cfg.linkPolicy ?? {}
			};
			const setLp = (patch) => setCfg({
				...cfg,
				linkPolicy: {
					...lp,
					...patch
				}
			});
			const lines = (v) => v.split("\n").map((x) => x.trim()).filter(Boolean);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f] mb-1",
						children: "قوانین لینک و منابع (فهرست مجاز فروش)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 mb-3",
						children: "منابع داخلی فقط برای دانش هوش مصنوعی استفاده می‌شوند و هرگز به مشتری نمایش داده نمی‌شوند. لینک‌های غیرمجاز به‌صورت خودکار از پاسخ حذف یا با صفحه اصلی دامنه فروش جایگزین می‌شوند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs flex items-center gap-2 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: lp.enabled,
									onChange: (e) => setLp({ enabled: e.target.checked })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-600",
									children: "اعمال قطعی قانون لینک در همه پاسخ‌ها (سایت و ربات تلگرام)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "منابع داخلی (هر دامنه در یک خط)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									dir: "ltr",
									rows: 4,
									value: lp.internalDomains.join("\n"),
									onChange: (e) => setLp({ internalDomains: lines(e.target.value) }),
									className: inputCls$16
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "لینک‌های مجاز فروش (فقط URLهای واقعی، هر کدام در یک خط)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									dir: "ltr",
									rows: 4,
									value: lp.allowedUrls.join("\n"),
									onChange: (e) => setLp({ allowedUrls: lines(e.target.value) }),
									className: inputCls$16
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "تنها دامنه فروش قابل نمایش برای مشتری"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: lp.salesDomain,
									onChange: (e) => setLp({ salesDomain: e.target.value }),
									className: inputCls$16
								})]
							})
						]
					})
				]
			});
		})(),
		(() => {
			const ad = {
				...DEFAULT_AI_ADVISOR,
				...cfg.advisor ?? {}
			};
			const setAd = (patch) => setCfg({
				...cfg,
				advisor: {
					...ad,
					...patch
				}
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f] mb-1",
						children: "رفتار مشاوره‌ای دستیار"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 mb-3 leading-6",
						children: "با فعال بودن این گزینه‌ها، دستیار فقط اطلاعات را بازگو نمی‌کند؛ سؤال کاربر را تفسیر می‌کند، پوشش‌ها و محدودیت‌ها را تحلیل می‌کند و طرح مناسب را پیشنهاد می‌دهد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: ad.consultative,
									onChange: (e) => setAd({ consultative: e.target.checked })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-600",
									children: "پاسخ مشاوره‌ای (تفسیر و پیشنهاد طرح)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: ad.analyze,
									onChange: (e) => setAd({ analyze: e.target.checked })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-600",
									children: "تجزیه و تحلیل (مزایا، محدودیت‌ها، مقایسه)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: [
										"حدود طول پاسخ (",
										ad.maxWords,
										" کلمه)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 120,
									max: 600,
									step: 20,
									value: ad.maxWords,
									onChange: (e) => setAd({ maxWords: Number(e.target.value) }),
									className: "w-full"
								})]
							})
						]
					})
				]
			});
		})(),
		(() => {
			const ag = {
				...DEFAULT_AI_AGENCY,
				...cfg.agency ?? {}
			};
			const setAg = (patch) => setCfg({
				...cfg,
				agency: {
					...ag,
					...patch
				}
			});
			const field = (key, label, opts) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: `text-xs ${opts?.wide ? "md:col-span-2" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-bold text-slate-600 mb-1",
					children: label
				}), opts?.area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 2,
					value: ag[key],
					onChange: (e) => setAg({ [key]: e.target.value }),
					className: inputCls$16
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: opts?.ltr ? "ltr" : void 0,
					value: ag[key],
					onChange: (e) => setAg({ [key]: e.target.value }),
					className: inputCls$16
				})]
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f] mb-1",
						children: "اطلاعات فروش و تماس (فقط نمایندگی آذرخش)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 mb-3 leading-6",
						children: "دستیار برای خرید، صدور و مشاوره تنها همین اطلاعات را به کاربر می‌دهد و به هیچ نمایندگی یا وب‌سایت دیگری ارجاع نمی‌دهد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-3",
						children: [
							field("name", "نام نمایندگی", { wide: true }),
							field("address", "آدرس", {
								wide: true,
								area: true
							}),
							field("mobile", "موبایل", { ltr: true }),
							field("landline", "تلفن ثابت", { ltr: true }),
							field("email", "ایمیل", { ltr: true }),
							field("telegram", "آیدی تلگرام (اختیاری)", { ltr: true }),
							field("hours", "ساعات پاسخ‌گویی"),
							field("note", "یادآوری فروش برای دستیار")
						]
					})
				]
			});
		})(),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeSourcesSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f]",
						children: "دانش تأییدشده (اصلاح اطلاعات بیمه سامان)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void addRow(),
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " مورد جدید"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-slate-500 mb-4 leading-6",
					children: "هر موردی که اینجا ثبت شود برای هوش مصنوعی معتبرتر از دانش عمومی آن است؛ اگر پاسخی نادرست بود، اطلاعات صحیح را اینجا ثبت کنید."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "عنوان"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: r.title,
									onChange: (e) => setRows((p) => p.map((x) => x.id === r.id ? {
										...x,
										title: e.target.value
									} : x)),
									className: inputCls$16
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "برچسب‌ها"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: r.tags ?? "",
									onChange: (e) => setRows((p) => p.map((x) => x.id === r.id ? {
										...x,
										tags: e.target.value
									} : x)),
									className: inputCls$16
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "ترتیب"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: r.position,
									onChange: (e) => setRows((p) => p.map((x) => x.id === r.id ? {
										...x,
										position: Number(e.target.value)
									} : x)),
									className: inputCls$16
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 flex items-end justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-1 text-[11px] font-bold text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: r.is_active,
										onChange: (e) => setRows((p) => p.map((x) => x.id === r.id ? {
											...x,
											is_active: e.target.checked
										} : x))
									}), " فعال"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void remove(r.id),
									className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
									"aria-label": "حذف",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-12 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "متن صحیح"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: r.content,
									onChange: (e) => setRows((p) => p.map((x) => x.id === r.id ? {
										...x,
										content: e.target.value
									} : x)),
									className: inputCls$16
								})]
							})
						]
					}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-slate-500 text-center py-6",
						children: "موردی ثبت نشده است."
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesPlaybookSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f] mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "w-4 h-4" }), " آزمایش پاسخ"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: test,
						onChange: (e) => setTest(e.target.value),
						placeholder: "مثلاً: بیمه عمر و تشکیل سرمایه سامان چه پوشش‌هایی دارد؟",
						className: inputCls$16
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void runTest(),
						disabled: testing,
						className: "text-xs px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 shrink-0",
						children: testing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "ارسال"
					})]
				}),
				testOut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-xs leading-6 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap",
					children: testOut
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[11px] text-slate-500",
					children: "برای اعمال تنظیمات جدید در آزمایش، ابتدا دکمه «ذخیره» را بزنید."
				})
			]
		})
	] });
}
var inputCls$15 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function ChatRoomPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_LIVE_CHAT);
	const [msgs, setMsgs] = (0, import_react.useState)([]);
	const [reply, setReply] = (0, import_react.useState)("");
	const [activeSid, setActiveSid] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)("");
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			setCfg(await adminReadSetting("live_chat", DEFAULT_LIVE_CHAT));
			const { data } = await adminDb("chat_room_messages").select("*").order("created_at", { ascending: false }).limit(120);
			setMsgs((data ?? []).slice().reverse());
		})();
		const channel = supabase.channel("dash_chat_room").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "chat_room_messages"
		}, (p) => setMsgs((x) => [...x, p.new])).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs, activeSid]);
	const threads = (() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of msgs) {
			if (!m.session_id || m.session_id === "staff") continue;
			const prev = map.get(m.session_id);
			map.set(m.session_id, {
				sid: m.session_id,
				name: m.is_staff ? prev?.name ?? "بازدیدکننده" : m.display_name,
				last: m.body,
				at: m.created_at
			});
		}
		return [...map.values()].sort((a, b) => a.at < b.at ? 1 : -1);
	})();
	(0, import_react.useEffect)(() => {
		if (!activeSid && threads.length) setActiveSid(threads[0].sid);
	}, [threads, activeSid]);
	const thread = activeSid ? msgs.filter((m) => m.session_id === activeSid) : [];
	async function send() {
		const body = reply.trim();
		if (!body) return;
		if (!activeSid) {
			setMsg("ابتدا یک گفتگو را انتخاب کنید.");
			return;
		}
		const { error } = await adminDb("chat_room_messages").insert({
			session_id: activeSid,
			display_name: "پشتیبانی نمایندگی",
			body,
			is_staff: true
		});
		if (error) setMsg("ارسال پیام کارشناس نیاز به ورود دارد.");
		else setReply("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f]",
				children: "چت روم آنلاین"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "مشاهده و پاسخ به گفتگوهای زنده بازدیدکنندگان."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: async () => {
					const r = await adminWriteSetting("live_chat", cfg);
					setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓");
				},
				className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره تنظیمات"]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "عنوان چت روم"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.title,
						onChange: (e) => setCfg({
							...cfg,
							title: e.target.value
						}),
						className: inputCls$15
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "پیام خوش‌آمد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.welcome,
						onChange: (e) => setCfg({
							...cfg,
							welcome: e.target.value
						}),
						className: inputCls$15
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: cfg.enabled,
						onChange: (e) => setCfg({
							...cfg,
							enabled: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "نمایش چت روم در سایت"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-[220px_1fr] gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-3 h-[60vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold text-slate-600 mb-2",
						children: "گفتگوها"
					}),
					threads.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-slate-400",
						children: "گفتگویی وجود ندارد."
					}),
					threads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveSid(t.sid),
						className: `w-full text-right rounded-xl px-3 py-2 mb-1 text-[11px] ${activeSid === t.sid ? "bg-teal-600 text-white" : "bg-slate-50 hover:bg-slate-100"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold truncate",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opacity-70 truncate",
								dir: "ltr",
								children: [t.sid.slice(0, 10), "…"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opacity-70 truncate",
								children: t.last
							})
						]
					}, t.sid))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 flex flex-col h-[60vh]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50",
					children: [thread.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `max-w-[70%] rounded-2xl px-3 py-2 text-xs leading-6 ${m.is_staff ? "bg-teal-600 text-white ms-auto" : "bg-white border border-slate-200"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-[10px] mb-0.5 ${m.is_staff ? "text-white/80" : "text-slate-500"}`,
								children: [
									m.display_name,
									" — ",
									new Date(m.created_at).toLocaleTimeString("fa-IR")
								]
							}),
							m.body,
							!m.is_staff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await adminDb("chat_room_messages").delete().eq("id", m.id);
									setMsgs((p) => p.filter((x) => x.id !== m.id));
								},
								className: "ms-2 text-rose-600 align-middle",
								"aria-label": "حذف پیام",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3 inline" })
							})
						]
					}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					className: "p-3 border-t border-slate-200 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: reply,
						onChange: (e) => setReply(e.target.value),
						placeholder: "پاسخ کارشناس…",
						className: inputCls$15
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "p-2 rounded-xl bg-teal-600 text-white shrink-0",
						"aria-label": "ارسال",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
					})]
				})]
			})]
		})
	] });
}
var inputCls$14 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var STATUSES = [
	"new",
	"reviewing",
	"approved",
	"rejected"
];
var STATUS_FA = {
	new: "جدید",
	reviewing: "در بررسی",
	approved: "تأیید شده",
	rejected: "رد شده"
};
function DocsPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_DOCS);
	const [cats, setCats] = (0, import_react.useState)([]);
	const [docs, setDocs] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("");
	async function load() {
		setCfg(await adminReadSetting("docs_intake", DEFAULT_DOCS));
		const [c, d] = await Promise.all([adminDb("document_categories").select("*").order("position", { ascending: true }), adminDb("customer_documents").select("*").order("created_at", { ascending: false }).limit(200)]);
		setCats(c.data ?? []);
		setDocs(d.data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function save() {
		const s = await adminWriteSetting("docs_intake", cfg);
		const r = await Promise.all(cats.map((c) => adminDb("document_categories").update({
			label: c.label,
			position: c.position,
			is_active: c.is_active
		}).eq("id", c.id)));
		setMsg(s.error || r.some((x) => x.error) ? "ذخیره ناقص انجام شد." : "ذخیره شد ✓");
	}
	async function addCat() {
		const { data, error } = await adminDb("document_categories").insert({
			label: "دسته جدید",
			position: cats.length + 1,
			is_active: true
		}).select().single();
		if (!error && data) setCats((p) => [...p, data]);
	}
	async function open(path) {
		const res = await adminSignedUrl({ data: {
			bucket: "customer-documents",
			path
		} });
		if (!res.url) return setMsg("دریافت فایل ممکن نشد.");
		window.open(res.url, "_blank", "noopener");
	}
	async function setStatus(id, status) {
		setDocs((p) => p.map((d) => d.id === id ? {
			...d,
			status
		} : d));
		await adminDb("customer_documents").update({ status }).eq("id", id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f]",
				children: "مخزن مدارک مشتریان"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "مدارک ارسالی از چت سایت، همراه با دسته‌های قابل ویرایش."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void load(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), " بازخوانی"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void save(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره تنظیمات"]
				})]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "عنوان بخش ارسال مدارک"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.title,
						onChange: (e) => setCfg({
							...cfg,
							title: e.target.value
						}),
						className: inputCls$14
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "حداکثر حجم (مگابایت)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: cfg.maxSizeMb,
						onChange: (e) => setCfg({
							...cfg,
							maxSizeMb: Number(e.target.value)
						}),
						className: inputCls$14
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "فرمت‌های مجاز"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: cfg.acceptedTypes,
						onChange: (e) => setCfg({
							...cfg,
							acceptedTypes: e.target.value
						}),
						className: inputCls$14
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: cfg.enabled,
						onChange: (e) => setCfg({
							...cfg,
							enabled: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "فعال بودن ارسال مدارک"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f]",
					children: "دسته‌های مدارک (منوی قابل ویرایش)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void addCat(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " دسته جدید"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: c.label,
							onChange: (e) => setCats((p) => p.map((x) => x.id === c.id ? {
								...x,
								label: e.target.value
							} : x)),
							className: inputCls$14
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: c.position,
							onChange: (e) => setCats((p) => p.map((x) => x.id === c.id ? {
								...x,
								position: Number(e.target.value)
							} : x)),
							className: "w-20 text-xs rounded-lg border border-slate-300 px-2 py-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1 text-[11px] font-bold text-slate-600 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: c.is_active,
								onChange: (e) => setCats((p) => p.map((x) => x.id === c.id ? {
									...x,
									is_active: e.target.checked
								} : x))
							}), " فعال"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await adminDb("document_categories").delete().eq("id", c.id);
								setCats((p) => p.filter((x) => x.id !== c.id));
							},
							className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
							"aria-label": "حذف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}, c.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 border-b border-slate-200 text-sm font-extrabold text-[#0b1e3f]",
				children: [
					"مدارک دریافتی (",
					docs.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-slate-50 text-slate-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"نام",
							"تلفن",
							"دسته",
							"فایل",
							"وضعیت",
							"تاریخ",
							""
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-bold",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: d.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								dir: "ltr",
								children: d.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: d.category ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 max-w-[200px] truncate",
								title: d.file_name,
								children: d.file_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: d.status,
									onChange: (e) => void setStatus(d.id, e.target.value),
									className: "text-xs rounded-lg border border-slate-300 px-2 py-1",
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: STATUS_FA[s]
									}, s))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: new Date(d.created_at).toLocaleDateString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => void open(d.file_path),
									className: "flex items-center gap-1 text-teal-700 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), " دریافت"]
								})
							})
						]
					}, d.id)), docs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "px-4 py-10 text-center text-slate-500",
						children: "مدرکی دریافت نشده است."
					}) })] })]
				})
			})]
		})
	] });
}
var DEFAULT_DEPLOY = {
	domain: "example.ir",
	wwwRedirect: true,
	projectName: "azarakhsh-saman",
	buildCommand: "bun run build",
	outputDir: "dist/client",
	notes: "خروجی سرور (Worker) در dist/server/wrangler.json است و با npx wrangler deploy منتشر می‌شود. انتشار خودکار از گیت‌هاب با فایل .github/workflows/deploy-cloudflare.yml انجام می‌شود."
};
var ENV_VARS = [
	["LOVABLE_API_KEY", "کلید دروازه هوش مصنوعی — برای کارکرد همه موتورهای هوش مصنوعی در Cloudflare الزامی است (Secret)"],
	["SUPABASE_URL", "آدرس سرویس داده و مخزن مدارک (سمت سرور)"],
	["SUPABASE_PUBLISHABLE_KEY", "کلید عمومی سرویس داده (سمت سرور)"],
	["VITE_SUPABASE_URL", "همان آدرس سرویس داده برای سمت مرورگر"],
	["VITE_SUPABASE_PUBLISHABLE_KEY", "کلید عمومی سمت مرورگر"],
	["VITE_SUPABASE_PROJECT_ID", "شناسه پروژه سرویس داده"]
];
var inputCls$13 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function DeployPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_DEPLOY);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminReadSetting("cloudflare_deploy", DEFAULT_DEPLOY).then(setCfg);
	}, []);
	const copy = async (t) => {
		await navigator.clipboard.writeText(t);
		setCopied(t);
		setTimeout(() => setCopied(""), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-6 h-6" }), " انتشار در Cloudflare و دامنه اختصاصی"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "تنظیمات و کلیدهای موردنیاز تا هوش مصنوعی، چت و مخزن مدارک روی Cloudflare کار کند."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: async () => {
					const r = await adminWriteSetting("cloudflare_deploy", cfg);
					setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓");
				},
				className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "دامنه اختصاصی"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: cfg.domain,
						onChange: (e) => setCfg({
							...cfg,
							domain: e.target.value
						}),
						className: inputCls$13
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "نام پروژه در Cloudflare"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: cfg.projectName,
						onChange: (e) => setCfg({
							...cfg,
							projectName: e.target.value
						}),
						className: inputCls$13
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "دستور بیلد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: cfg.buildCommand,
						onChange: (e) => setCfg({
							...cfg,
							buildCommand: e.target.value
						}),
						className: inputCls$13
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "پوشه خروجی"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: cfg.outputDir,
						onChange: (e) => setCfg({
							...cfg,
							outputDir: e.target.value
						}),
						className: inputCls$13
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "یادداشت‌ها"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: cfg.notes,
						onChange: (e) => setCfg({
							...cfg,
							notes: e.target.value
						}),
						className: inputCls$13
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: cfg.wwwRedirect,
						onChange: (e) => setCfg({
							...cfg,
							wwwRedirect: e.target.checked
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-slate-600",
						children: "انتقال www به دامنه اصلی"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f] mb-3",
					children: "متغیرهای محیطی موردنیاز در Cloudflare"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: ENV_VARS.map(([k, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								dir: "ltr",
								className: "text-[11px] font-bold text-[#0b1e3f] shrink-0",
								children: k
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-slate-500 flex-1",
								children: d
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void copy(k),
								className: "p-1.5 rounded-lg hover:bg-slate-100 shrink-0",
								"aria-label": "کپی",
								children: copied === k ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-4 h-4 text-slate-500" })
							})
						]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-[11px] text-slate-500 leading-6",
					children: [
						"این مقادیر را در Cloudflare Pages → Settings → Variables and Secrets، برای هر دو محیط Production و Preview ثبت کنید. بدون ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							dir: "ltr",
							children: "LOVABLE_API_KEY"
						}),
						" چت هوش مصنوعی روی Cloudflare پاسخ نمی‌دهد."
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f] mb-3",
					children: "مراحل انتشار"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "text-xs text-slate-600 space-y-2 leading-6 list-decimal ps-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"در Cloudflare Pages پروژه‌ای با نام ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: cfg.projectName
							}),
							" بسازید و مخزن گیت را متصل کنید."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"دستور بیلد: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								dir: "ltr",
								children: cfg.buildCommand
							}),
							" و پوشه خروجی: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								dir: "ltr",
								children: cfg.outputDir
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "متغیرهای بالا را ثبت کنید (کلیدها را به‌صورت Secret)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"در بخش Custom domains دامنه ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: cfg.domain
							}),
							cfg.wwwRedirect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								" ",
								"و ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
									dir: "ltr",
									children: ["www.", cfg.domain]
								})
							] }),
							" ",
							"را اضافه و رکوردهای DNS پیشنهادی Cloudflare را ثبت کنید."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "پس از فعال شدن SSL، آدرس دامنه را در تنظیمات ورود/احراز هویت به فهرست مجاز اضافه کنید." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-[11px] text-slate-500",
					children: [
						"راهنمای کامل در فایل ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							dir: "ltr",
							children: "CLOUDFLARE.md"
						}),
						" پروژه موجود است."
					]
				})
			]
		})
	] });
}
var input = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function blankAccount(index) {
	return {
		id: `acc_${Date.now()}_${index}`,
		label: `اکانت ${index + 1}`,
		secretName: index === 0 ? "GITHUB_API_KEY" : `GITHUB_API_KEY_${index + 1}`,
		owner: "",
		repo: "",
		branch: "main",
		path: "lovable/site-content.json",
		isDefault: index === 0
	};
}
function GithubPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_GITHUB_SYNC);
	const [status, setStatus] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminReadSetting(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC).then((v) => setCfg({
			...v,
			accounts: v.accounts?.length ? v.accounts : [blankAccount(0)]
		}));
	}, []);
	const update = (id, patch) => setCfg((p) => ({
		...p,
		accounts: p.accounts.map((a) => a.id === id ? {
			...a,
			...patch
		} : a)
	}));
	const save = async (next = cfg) => {
		setCfg(next);
		await adminWriteSetting(GITHUB_SETTING_KEY, next);
	};
	const makeDefault = (id) => void save({
		...cfg,
		accounts: cfg.accounts.map((a) => ({
			...a,
			isDefault: a.id === id
		}))
	});
	const test = async (acc) => {
		setBusy(acc.id);
		const res = await githubCheckAccount({ data: { secretName: acc.secretName } });
		setBusy("");
		setStatus((p) => ({
			...p,
			[acc.id]: res.ok ? `متصل به حساب ${res.login || "گیت‌هاب"}` : `اتصال ناموفق: ${res.error}`
		}));
		if (res.ok) notifySaved("اتصال گیت‌هاب");
		else notifyFailed("اتصال گیت‌هاب", res.error);
	};
	const publish = async (acc) => {
		if (!acc.owner || !acc.repo) return notifyFailed("انتشار در گیت‌هاب", "نام مالک و مخزن الزامی است.");
		setBusy(acc.id);
		const res = await githubPublishSnapshot({ data: {
			secretName: acc.secretName,
			owner: acc.owner,
			repo: acc.repo,
			branch: acc.branch,
			path: acc.path,
			note: "انتشار دستی از پیشخوان"
		} });
		setBusy("");
		if (res.ok) {
			setStatus((p) => ({
				...p,
				[acc.id]: `آخرین ارسال موفق: ${res.sha.slice(0, 7)}`
			}));
			notifySaved("ارسال تغییرات به گیت‌هاب");
		} else notifyFailed("ارسال تغییرات به گیت‌هاب", res.error);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "w-6 h-6" }), " اتصال و انتشار در گیت‌هاب"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "هر تغییری که در پیشخوان ذخیره می‌شود می‌تواند به‌صورت خودکار در مخزن گیت‌هاب ثبت شود."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => void save(),
				className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره تنظیمات"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: cfg.autoSync,
					onChange: (e) => void save({
						...cfg,
						autoSync: e.target.checked
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold text-slate-700",
					children: "ارسال خودکار به گیت‌هاب پس از هر تغییر در پیشخوان"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500 leading-6",
				children: "با فعال بودن این گزینه، پس از هر ذخیره در پیشخوان یک نسخه به‌روز از محتوای سایت در مخزن پیش‌فرض ثبت می‌شود و از همان مخزن روی هر هاست (از جمله Cloudflare) قابل انتشار است."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: cfg.accounts.map((acc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-extrabold text-[#0b1e3f]",
								children: acc.label || `اکانت ${i + 1}`
							}), acc.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5",
								children: "پیش‌فرض"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								!acc.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => makeDefault(acc.id),
									className: "text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300",
									children: "انتخاب به‌عنوان پیش‌فرض"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => void test(acc),
									disabled: busy === acc.id,
									className: "text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " تست اتصال"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => void publish(acc),
									disabled: busy === acc.id,
									className: "text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0b1e3f] text-white flex items-center gap-1.5 disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-3.5 h-3.5" }), " ارسال به گیت‌هاب"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void save({
										...cfg,
										accounts: cfg.accounts.filter((a) => a.id !== acc.id)
									}),
									className: "p-1.5 rounded-lg text-rose-600 hover:bg-rose-50",
									"aria-label": "حذف",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "نام نمایشی"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: acc.label,
									onChange: (e) => update(acc.id, { label: e.target.value }),
									className: input
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "نام کلید اتصال"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: acc.secretName,
									onChange: (e) => update(acc.id, { secretName: e.target.value }),
									className: input
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "مالک مخزن (کاربر/سازمان)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: acc.owner,
									onChange: (e) => update(acc.id, { owner: e.target.value }),
									className: input
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "نام مخزن"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: acc.repo,
									onChange: (e) => update(acc.id, { repo: e.target.value }),
									className: input
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "شاخه"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: acc.branch,
									onChange: (e) => update(acc.id, { branch: e.target.value }),
									className: input
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "مسیر فایل"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: acc.path,
									onChange: (e) => update(acc.id, { path: e.target.value }),
									className: input
								})]
							})
						]
					}),
					status[acc.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-[11px] text-slate-600 flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600" }),
							" ",
							status[acc.id]
						]
					})
				]
			}, acc.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => void save({
				...cfg,
				accounts: [...cfg.accounts, blankAccount(cfg.accounts.length)]
			}),
			className: "mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن اکانت گیت‌هاب"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-[11px] text-slate-500 leading-6",
			children: [
				"برای استفاده از چند اکانت، هر اکانت گیت‌هاب را یک‌بار از بخش کانکتورهای Lovable متصل کنید؛ نام کلید اتصال هر اکانت را در همین جدول وارد کنید (مثلاً ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					children: "GITHUB_API_KEY"
				}),
				" و",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					children: " GITHUB_API_KEY_2"
				}),
				")."
			]
		})
	] });
}
var DEFAULT_GRABBER_OPTIONS = {
	mode: "clone",
	slug: "",
	images: true,
	galleries: true,
	buttons: true,
	videos: true,
	maxChars: 4e3,
	clipboard: true
};
var BODY = String.raw`
(function () {
  "use strict";
  var OPT = __OPTIONS__;
  var MAX = OPT.maxChars || 4000;

  function log(m) { try { console.log("%c[دانلود صفحه] " + m, "color:#0b1e3f;font-weight:bold"); } catch (e) {} }

  function abs(u) {
    if (!u) return "";
    try { return new URL(u, document.baseURI).href; } catch (e) { return u; }
  }

  function clean(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function visible(el) {
    if (!el || el.nodeType !== 1) return false;
    var cs;
    try { cs = window.getComputedStyle(el); } catch (e) { return true; }
    if (!cs) return true;
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    return true;
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, HEADER: 1, NAV: 1, FOOTER: 1, ASIDE: 1, FORM: 0 };
  var SKIP_HINT = /(^|[-_ ])(header|navbar|nav|footer|sidebar|breadcrumb|cookie|consent|popup|modal|drawer|chat|widget|toolbar|social-share|skip-link)([-_ ]|$)/i;

  function skippable(el) {
    if (SKIP_TAGS[el.tagName] === 1) return true;
    var id = el.getAttribute("id") || "";
    var cls = typeof el.className === "string" ? el.className : "";
    var role = el.getAttribute("role") || "";
    if (role === "navigation" || role === "banner" || role === "contentinfo" || role === "dialog") return true;
    if (SKIP_HINT.test(id) || SKIP_HINT.test(cls)) return true;
    if (el.hasAttribute("data-ve-overlay") || el.hasAttribute("data-page-grabber")) return true;
    return false;
  }

  function pickRoot() {
    var sels = ["main", "[role=main]", "#main", "#content", ".main-content", "article"];
    for (var i = 0; i < sels.length; i++) {
      var n = document.querySelector(sels[i]);
      if (n && clean(n.innerText).length > 120) return n;
    }
    return document.body;
  }

  function imgSrc(img) {
    var s = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("data-lazy-src") || "";
    var set = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
    if (!s && set) s = set.split(",")[0].trim().split(" ")[0];
    if (!s) return "";
    if (/^data:/i.test(s)) return "";
    return abs(s);
  }

  var blocks = [];
  var seq = 0;
  function id() { seq++; return "b_" + Date.now().toString(36) + "_" + seq.toString(36); }
  function push(type, props) { blocks.push({ id: id(), type: type, props: props }); }

  var buffer = [];
  function flush() {
    if (!buffer.length) return;
    var body = buffer.join("\n\n").slice(0, MAX);
    buffer = [];
    if (clean(body).length >= 2) push("text", { title: "", body: body, align: "right" });
  }

  var heroDone = false;
  function heading(el) {
    var txt = clean(el.innerText);
    if (!txt) return;
    flush();
    if (!heroDone && el.tagName === "H1") {
      heroDone = true;
      push("hero", { title: txt, subtitle: "", bgImage: "", ctaText: "", ctaHref: "", align: "right" });
    } else {
      push("text", { title: txt, body: "", align: "right" });
    }
  }

  function buttonLike(a) {
    var cls = typeof a.className === "string" ? a.className : "";
    if (/btn|button|cta/i.test(cls)) return true;
    if (a.getAttribute("role") === "button") return true;
    var cs;
    try { cs = window.getComputedStyle(a); } catch (e) { return false; }
    if (!cs) return false;
    var bg = cs.backgroundColor || "";
    var solid = bg && bg !== "transparent" && bg.indexOf("rgba(0, 0, 0, 0)") === -1;
    return !!solid && clean(a.innerText).length <= 40;
  }

  function galleryOf(el) {
    var imgs = [], kids = el.children, i;
    for (i = 0; i < kids.length; i++) {
      var inner = kids[i].tagName === "IMG" ? kids[i] : kids[i].querySelector && kids[i].querySelector("img");
      if (!inner) return null;
      var s = imgSrc(inner);
      if (!s) return null;
      imgs.push(s);
    }
    return imgs.length >= 3 ? imgs : null;
  }

  function cardsOf(el) {
    var kids = el.children, items = [], i;
    if (kids.length < 2 || kids.length > 8) return null;
    for (i = 0; i < kids.length; i++) {
      var k = kids[i];
      var h = k.querySelector && k.querySelector("h2,h3,h4,h5,strong,b");
      var p = k.querySelector && k.querySelector("p,span,div");
      var t = clean(h ? h.innerText : "");
      var x = clean(p ? p.innerText : "");
      if (!t && !x) return null;
      if (x.length > 400) return null;
      var im = k.querySelector && k.querySelector("img");
      items.push({ title: t, text: x.slice(0, 400), image: im ? imgSrc(im) : "" });
    }
    return items;
  }

  function walk(el) {
    var kids = el.children, i;
    for (i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (!visible(n) || skippable(n)) continue;
      var tag = n.tagName;

      if (/^H[1-6]$/.test(tag)) { heading(n); continue; }

      if (tag === "HR") { flush(); push("divider", {}); continue; }

      if (tag === "IMG") {
        if (OPT.images) { var s = imgSrc(n); if (s) { flush(); push("image", { src: s, alt: n.getAttribute("alt") || "", href: "", width: "boxed" }); } }
        continue;
      }

      if (tag === "FIGURE") {
        var fi = n.querySelector("img");
        if (OPT.images && fi) { var fs = imgSrc(fi); if (fs) { flush(); push("image", { src: fs, alt: fi.getAttribute("alt") || "", href: "", width: "full" }); } }
        var cap = n.querySelector("figcaption");
        if (cap) { var ct = clean(cap.innerText); if (ct) push("text", { title: "", body: ct, align: "right" }); }
        continue;
      }

      if (tag === "IFRAME" || tag === "VIDEO") {
        if (OPT.videos) {
          var vs = abs(n.getAttribute("src") || (n.querySelector && n.querySelector("source") ? n.querySelector("source").getAttribute("src") : ""));
          if (vs) { flush(); push("video", { src: vs, poster: abs(n.getAttribute("poster") || "") }); }
        }
        continue;
      }

      if (tag === "A" && OPT.buttons && buttonLike(n)) {
        var label = clean(n.innerText);
        var href = abs(n.getAttribute("href") || "");
        if (label) { flush(); push("cta", { title: "", body: "", buttonLabel: label, buttonHref: href, bg: "#0b1e3f" }); }
        continue;
      }

      if (tag === "UL" || tag === "OL") {
        var lis = n.querySelectorAll(":scope > li"), out = [], j;
        for (j = 0; j < lis.length; j++) { var lt = clean(lis[j].innerText); if (lt) out.push("• " + lt); }
        if (out.length) buffer.push(out.join("\n"));
        continue;
      }

      if (tag === "TABLE") {
        var rows = n.querySelectorAll("tr"), lines = [], r;
        for (r = 0; r < rows.length; r++) {
          var cells = rows[r].querySelectorAll("th,td"), parts = [], c;
          for (c = 0; c < cells.length; c++) parts.push(clean(cells[c].innerText));
          if (parts.join("").length) lines.push(parts.join(" | "));
        }
        if (lines.length) buffer.push(lines.join("\n"));
        continue;
      }

      if (tag === "P" || tag === "BLOCKQUOTE") {
        var pt = clean(n.innerText);
        if (pt.length >= 2) buffer.push(pt);
        continue;
      }

      if (OPT.galleries) {
        var g = galleryOf(n);
        if (g) { flush(); push("gallery", { images: g, columns: "3" }); continue; }
      }

      var cards = cardsOf(n);
      if (cards && n.children.length >= 3) {
        flush();
        push("cards", { columns: String(Math.min(n.children.length, 4)), items: cards });
        continue;
      }

      if (n.children.length === 0) {
        var t2 = clean(n.innerText);
        if (t2.length >= 2) buffer.push(t2);
        continue;
      }

      walk(n);
    }
  }

  function slugify(raw) {
    var s = String(raw || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    return s || "grabbed-page";
  }

  var root = pickRoot();
  walk(root);
  flush();

  if (!blocks.length) {
    push("text", { title: document.title || "", body: clean(document.body.innerText).slice(0, MAX), align: "right" });
  }

  function meta(sel) {
    var m = document.querySelector(sel);
    return m ? clean(m.getAttribute("content")) : "";
  }

  var h1 = document.querySelector("h1");
  var title = clean(h1 ? h1.innerText : "") || clean(document.title) || "صفحه";
  var desc = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  var fromUrl = (location.pathname.split("/").filter(Boolean).pop() || "").replace(/\.(html?|php|aspx?)$/i, "");
  var slug = slugify(OPT.slug || fromUrl || title);

  var page = {
    slug: slug,
    title: title,
    description: desc,
    blocks: blocks,
    seoTitle: clean(document.title) || title,
    seoDescription: desc,
    published: false,
    updatedAt: new Date().toISOString(),
    source: { url: location.href, grabbedAt: new Date().toISOString(), blocks: blocks.length }
  };

  var json = JSON.stringify(page, null, 2);

  try {
    var blob = new Blob([json], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.setAttribute("data-page-grabber", "1");
    a.href = URL.createObjectURL(blob);
    a.download = "page-" + slug + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  } catch (e) { log("دانلود خودکار ممکن نشد: " + e); }

  if (OPT.clipboard && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(json).then(function () { log("در کلیپ‌بورد هم کپی شد."); }, function () {});
  }

  try {
    var box = document.createElement("div");
    box.setAttribute("data-page-grabber", "1");
    box.setAttribute("dir", "rtl");
    box.style.cssText = "position:fixed;z-index:2147483647;inset-inline-end:16px;inset-block-end:16px;background:#0b1e3f;color:#fff;font:13px/1.8 Tahoma,sans-serif;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:320px";
    box.textContent = "✅ صفحه گرفته شد — " + blocks.length + " بلوک. فایل page-" + slug + ".json دانلود شد؛ آن را در «صفحه‌ساز → دانلود صفحه» بارگذاری کنید.";
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 12000);
  } catch (e) {}

  log("تعداد بلوک: " + blocks.length + " — نامک: " + slug);
  return page;
})();
`;
var CLONE_BODY = String.raw`
(function () {
  "use strict";
  var OPT = __OPTIONS__;
  function log(m) { try { console.log("%c[کپی کامل صفحه] " + m, "color:#0b1e3f;font-weight:bold"); } catch (e) {} }
  function abs(u, base) {
    if (!u) return "";
    try { return new URL(u, base || document.baseURI).href; } catch (e) { return u; }
  }
  function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }

  /* ---------- 1. what is header / footer / widget (replaced by your site's own) ---------- */
  var HINT = /(^|[-_ ])(header|site-header|topbar|top-bar|navbar|nav|menu-main|footer|site-footer|copyright|cookie|consent|popup|modal|drawer|chat|goftino|crisp|raychat|tawk|widget|back-to-top|scroll-top|toolbar|social-share|skip-link)([-_ ]|$)/i;
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, LINK: 1, META: 1, BASE: 1, HEADER: 1, FOOTER: 1, NAV: 1, DIALOG: 1, OBJECT: 1, EMBED: 1 };
  function isChrome(el) {
    if (SKIP_TAGS[el.tagName] === 1) return true;
    if (el.hasAttribute("data-page-grabber") || el.hasAttribute("data-ve-overlay")) return true;
    var role = el.getAttribute("role") || "";
    if (role === "banner" || role === "contentinfo" || role === "navigation" || role === "dialog") return true;
    var id = el.getAttribute("id") || "";
    var cls = typeof el.className === "string" ? el.className : "";
    if (HINT.test(id) || HINT.test(cls)) {
      // Never drop a big content block just because its class says "menu".
      var r = el.getBoundingClientRect();
      if (r.height < window.innerHeight * 0.9 || /header|footer|chat|cookie|popup|modal/i.test(id + " " + cls)) return true;
    }
    var cs = getComputedStyle(el);
    if (cs.position === "fixed") return true;
    return false;
  }
  function hidden(el, cs) {
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    if (Number(cs.opacity) === 0 && el.children.length === 0) return true;
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0 && el.tagName !== "SOURCE") return true;
    return false;
  }

  /* ---------- 2. pick the content root ---------- */
  function pickRoot() {
    var sels = ["main", "[role=main]", "#main", "#content", "#primary", ".main-content", ".site-content", "article"];
    for (var i = 0; i < sels.length; i++) {
      var n = document.querySelector(sels[i]);
      if (n && clean(n.innerText).length > 200) return n;
    }
    return document.body;
  }

  /* ---------- 3. computed-style inlining ---------- */
  var PROPS = ["display","position","top","right","bottom","left","z-index","float","clear","box-sizing",
    "width","min-width","max-width","height","min-height","max-height",
    "margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left",
    "flex-direction","flex-wrap","justify-content","align-items","align-content","align-self","flex-grow","flex-shrink","flex-basis","order","gap","row-gap","column-gap",
    "grid-template-columns","grid-template-rows","grid-template-areas","grid-area","grid-column","grid-row","grid-auto-flow",
    "color","background-color","background-image","background-size","background-position","background-repeat",
    "border-top","border-right","border-bottom","border-left","border-radius","box-shadow","outline",
    "font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-align","text-decoration","text-transform","text-shadow","white-space","word-break","direction","vertical-align","list-style-type",
    "opacity","overflow","overflow-x","overflow-y","object-fit","object-position","transform","filter","aspect-ratio","cursor","transition"];
  var INHERITED = { "color":1,"font-family":1,"font-size":1,"font-weight":1,"font-style":1,"line-height":1,"letter-spacing":1,"text-align":1,"text-transform":1,"text-shadow":1,"white-space":1,"word-break":1,"direction":1,"list-style-type":1,"cursor":1 };
  var DEFAULTS = { "position":"static","top":"auto","right":"auto","bottom":"auto","left":"auto","z-index":"auto","float":"none","clear":"none",
    "min-width":"0px","max-width":"none","min-height":"0px","max-height":"none","flex-grow":"0","flex-shrink":"1","flex-basis":"auto","order":"0",
    "background-color":"rgba(0, 0, 0, 0)","background-image":"none","box-shadow":"none","text-shadow":"none","transform":"none","filter":"none","opacity":"1",
    "overflow":"visible","overflow-x":"visible","overflow-y":"visible","border-radius":"0px","text-decoration":"none","aspect-ratio":"auto","object-fit":"fill","object-position":"50% 50%","transition":"all 0s ease 0s","outline":"none",
    "grid-template-columns":"none","grid-template-rows":"none","grid-template-areas":"none","grid-area":"auto","grid-area":"auto / auto / auto / auto","grid-column":"auto","grid-row":"auto","gap":"normal","row-gap":"normal","column-gap":"normal","vertical-align":"baseline" };
  var FLEXISH = /flex|grid/;

  function styleFor(el, cs, pcs, isRoot) {
    var out = [];
    for (var i = 0; i < PROPS.length; i++) {
      var k = PROPS[i];
      var v = cs.getPropertyValue(k);
      if (!v) continue;
      if (INHERITED[k] && pcs && pcs.getPropertyValue(k) === v && !isRoot) continue;
      if (DEFAULTS[k] !== undefined && DEFAULTS[k] === v) continue;
      if (/^(border-)/.test(k) && /^0px none/.test(v)) continue;
      if (k === "outline" && / none 0px$|^none/.test(v)) continue;
      if ((k === "min-width" || k === "min-height" || k === "align-self") && v === "auto") continue;
      if (/^background-(size|position|repeat)$/.test(k) && cs.backgroundImage === "none") continue;
      if (/^(top|right|bottom|left)$/.test(k) && (cs.position === "static" || (cs.position === "relative" && v === "0px"))) continue;
      if (/^(margin|padding)-/.test(k) && v === "0px") continue;
      if (/^(justify-content|align-items|align-content|flex-direction|flex-wrap|grid-auto-flow)$/.test(k) && !FLEXISH.test(cs.display)) continue;
      if (k === "position" && (v === "fixed" || v === "sticky")) v = "relative";
      // Fixed pixel widths/heights break responsiveness: keep them as max-width.
      if (k === "width") {
        if (/^(IMG|VIDEO|IFRAME|SVG|CANVAS)$/i.test(el.tagName)) { out.push("max-width:100%"); out.push("width:" + v); continue; }
        if (isRoot) { out.push("width:100%"); continue; }
        if (cs.display.indexOf("inline") === 0 || cs.display === "table-cell") continue;
        // Inside flex/grid the parent's tracks size the child already.
        if (pcs && FLEXISH.test(pcs.display)) continue;
        var pw = el.parentElement ? el.parentElement.getBoundingClientRect().width : 0;
        var w = el.getBoundingClientRect().width;
        if (pw && Math.abs(pw - w) < 2) continue;
        if (pw) { out.push("width:" + Math.round((w / pw) * 10000) / 100 + "%"); continue; }
        continue;
      }
      if (k === "height") {
        if (/^(IMG|VIDEO|IFRAME|SVG|CANVAS)$/i.test(el.tagName)) { if (el.tagName === "IFRAME") out.push("height:" + v); else out.push("height:auto"); }
        continue;
      }
      if (k === "background-image" && v.indexOf("url(") !== -1) {
        v = v.replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, q, u) { return 'url("' + abs(u) + '")'; });
      }
      out.push(k + ":" + v.replace(/"/g, "'"));
    }
    return out.join(";");
  }

  /* ---------- 4. deep clone with inlined styles ---------- */
  var KEEP_ATTR = { href:1, src:1, srcset:1, alt:1, title:1, poster:1, controls:1, loop:1, muted:1, autoplay:1, playsinline:1, type:1, colspan:1, rowspan:1, width:1, height:1, allow:1, allowfullscreen:1, frameborder:1, viewbox:1, fill:1, stroke:1, d:1, xmlns:1, target:1, rel:1, placeholder:1, value:1, name:1, "aria-label":1, dir:1, lang:1 };
  var count = 0, videos = 0, images = 0;

  function cloneNode(src, pcs, isRoot) {
    if (src.nodeType === 3) return document.createTextNode(src.nodeValue);
    if (src.nodeType !== 1) return null;
    if (!isRoot && isChrome(src)) return null;
    var cs = getComputedStyle(src);
    if (!isRoot && hidden(src, cs)) return null;
    var tag = src.tagName.toLowerCase();

    if (tag === "svg") {
      var svg = src.cloneNode(true);
      svg.setAttribute("style", styleFor(src, cs, pcs, false));
      count++;
      return svg;
    }
    if (tag === "iframe") {
      var s = abs(src.getAttribute("src") || src.getAttribute("data-src") || "");
      if (!s) return null;
      var f = document.createElement("iframe");
      f.setAttribute("src", s);
      f.setAttribute("allowfullscreen", "true");
      f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      f.setAttribute("frameborder", "0");
      f.setAttribute("style", styleFor(src, cs, pcs, false) + ";width:100%;aspect-ratio:16/9;height:auto;border:0");
      videos++;
      return f;
    }
    if (tag === "canvas") return null;

    var el = document.createElement(tag === "button" || tag === "select" || tag === "input" || tag === "textarea" || tag === "label" ? (tag === "input" || tag === "textarea" || tag === "select" ? "span" : tag) : tag);
    for (var a = 0; a < src.attributes.length; a++) {
      var at = src.attributes[a];
      var n = at.name.toLowerCase();
      if (!KEEP_ATTR[n]) continue;
      var v = at.value;
      if (n === "href" || n === "src" || n === "poster") v = abs(v);
      if (n === "srcset") v = v.split(",").map(function (p) { var bits = p.trim().split(/\s+/); bits[0] = abs(bits[0]); return bits.join(" "); }).join(", ");
      try { el.setAttribute(n, v); } catch (e) {}
    }
    if (tag === "img") {
      var real = src.currentSrc || src.getAttribute("data-src") || src.getAttribute("data-lazy-src") || src.getAttribute("src") || "";
      el.setAttribute("src", abs(real));
      el.removeAttribute("srcset");
      el.setAttribute("loading", "lazy");
      images++;
    }
    if (tag === "video") {
      var vs = src.currentSrc || src.getAttribute("src") || "";
      if (vs) el.setAttribute("src", abs(vs));
      el.setAttribute("controls", "");
      videos++;
    }
    if (tag === "input" || tag === "textarea") el.textContent = src.value || src.getAttribute("placeholder") || "";
    if (tag === "select" && src.options && src.selectedIndex >= 0) el.textContent = src.options[src.selectedIndex].text;
    if (tag === "a" && el.getAttribute("href") && el.getAttribute("href").indexOf("javascript:") === 0) el.setAttribute("href", "#");

    el.setAttribute("style", styleFor(src, cs, pcs, isRoot));
    count++;
    if (tag !== "input" && tag !== "textarea" && tag !== "select") {
      for (var c = src.firstChild; c; c = c.nextSibling) {
        var k = cloneNode(c, cs, false);
        if (k) el.appendChild(k);
      }
    }
    // Drop empty wrappers that only held removed chrome.
    if (!isRoot && tag === "div" && !el.childNodes.length && cs.backgroundImage === "none" && cs.backgroundColor === "rgba(0, 0, 0, 0)" && src.getBoundingClientRect().height < 4) return null;
    return el;
  }

  /* ---------- 5. fonts & keyframes from the page stylesheets ---------- */
  function collectCss() {
    var out = [], blocked = 0;
    for (var i = 0; i < document.styleSheets.length; i++) {
      var sh = document.styleSheets[i], rules;
      try { rules = sh.cssRules; } catch (e) { blocked++; continue; }
      if (!rules) continue;
      var base = sh.href || document.baseURI;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.type === 5 || r.type === 7) {
          out.push(r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, q, u) { return u.indexOf("data:") === 0 ? 'url("' + u + '")' : 'url("' + abs(u, base) + '")'; }));
        }
      }
    }
    if (blocked) log(blocked + " فایل CSS از دامنهٔ دیگر قابل خواندن نبود (فونت‌های آن‌ها ممکن است جایگزین شوند).");
    return out.join("\n");
  }

  // Force lazy content to load before cloning.
  var lazy = document.querySelectorAll("img[data-src],img[data-lazy-src],iframe[data-src]");
  for (var z = 0; z < lazy.length; z++) {
    var d = lazy[z].getAttribute("data-src") || lazy[z].getAttribute("data-lazy-src");
    if (d && !lazy[z].getAttribute("src")) lazy[z].setAttribute("src", d);
  }

  var root = pickRoot();
  var rootRect = root.getBoundingClientRect();
  var bodyCs = getComputedStyle(document.body);
  var cloned = cloneNode(root, bodyCs, true);
  var wrap = document.createElement("div");
  wrap.setAttribute("style", "font-family:" + bodyCs.fontFamily.replace(/"/g, "'") + ";color:" + bodyCs.color + ";background-color:" + (bodyCs.backgroundColor === "rgba(0, 0, 0, 0)" ? "#fff" : bodyCs.backgroundColor) + ";direction:" + bodyCs.direction + ";line-height:" + bodyCs.lineHeight);
  wrap.appendChild(cloned);
  var html = wrap.outerHTML;
  var css = collectCss();

  function slugify(raw) {
    var s = String(raw || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    return s || "cloned-page";
  }
  function meta(sel) { var m = document.querySelector(sel); return m ? clean(m.getAttribute("content")) : ""; }
  var h1 = document.querySelector("h1");
  var title = clean(h1 ? h1.innerText : "") || clean(document.title) || "صفحه";
  var desc = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  var fromUrl = ((OPT.sourceUrl ? new URL(OPT.sourceUrl).pathname : location.pathname).split("/").filter(Boolean).pop() || "").replace(/\.(html?|php|aspx?)$/i, "");
  var slug = slugify(OPT.slug || fromUrl || title);
  var blockId = "b_" + Date.now().toString(36) + "_clone";
  var page = {
    slug: slug, title: title, description: desc,
    blocks: [{ id: blockId, type: "clone", props: { html: html, css: css, maxWidth: Math.round(rootRect.width) >= window.innerWidth - 20 ? "" : Math.round(rootRect.width) + "px", source: OPT.sourceUrl || location.href } }],
    seoTitle: clean(document.title) || title, seoDescription: desc, published: false,
    updatedAt: new Date().toISOString(),
    source: { url: OPT.sourceUrl || location.href, grabbedAt: new Date().toISOString(), mode: "clone", elements: count, images: images, videos: videos }
  };
  var json = JSON.stringify(page);
  if (OPT.silent) return page;
  try {
    var blob = new Blob([json], { type: "application/json;charset=utf-8" });
    var a2 = document.createElement("a");
    a2.setAttribute("data-page-grabber", "1");
    a2.href = URL.createObjectURL(blob);
    a2.download = "page-" + slug + ".json";
    document.body.appendChild(a2); a2.click();
    setTimeout(function () { URL.revokeObjectURL(a2.href); a2.remove(); }, 4000);
  } catch (e) { log("دانلود خودکار ممکن نشد: " + e); }
  if (OPT.clipboard && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(json).then(function () { log("در کلیپ‌بورد هم کپی شد."); }, function () {});
  }
  try {
    var box = document.createElement("div");
    box.setAttribute("data-page-grabber", "1"); box.setAttribute("dir", "rtl");
    box.style.cssText = "position:fixed;z-index:2147483647;inset-inline-end:16px;inset-block-end:16px;background:#0b1e3f;color:#fff;font:13px/1.8 Tahoma,sans-serif;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:340px";
    box.textContent = "✅ کپی کامل صفحه آماده شد — " + count + " المان، " + images + " تصویر، " + videos + " ویدیو (" + Math.round(json.length / 1024) + " کیلوبایت). فایل page-" + slug + ".json را در «دانلود صفحه» بارگذاری کنید.";
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 12000);
  } catch (e) {}
  log("المان‌ها: " + count + " | تصاویر: " + images + " | ویدیو: " + videos + " | حجم: " + Math.round(json.length / 1024) + "KB");
  return page;
})();
`;
/** Build the ready-to-paste snippet for the given options. */
function buildGrabberScript(opts) {
	const safe = {
		...DEFAULT_GRABBER_OPTIONS,
		...opts,
		maxChars: Math.max(500, Math.min(2e4, Number(opts.maxChars) || 4e3))
	};
	return `${[
		"/* ============================================================",
		" * ویجت دانلود صفحه — پیشخوان بیمه سامان (نمایندگی آذرخش)",
		" * روش ۱: DevTools (F12) → Sources → Snippets → New snippet → چسباندن → Ctrl+Enter",
		" * روش ۲: این متن را در Notepad ذخیره کنید و در کنسول مرورگر (Console) بچسبانید و Enter بزنید.",
		" * خروجی: یک فایل JSON دانلود می‌شود که در «صفحه‌ساز → دانلود صفحه» وارد می‌شود.",
		" * ============================================================ */"
	].join("\n")}\n${(safe.mode === "blocks" ? BODY : CLONE_BODY).replace("__OPTIONS__", JSON.stringify(safe))}`.trim() + "\n";
}
/** Basic shape check for an imported grabber file. */
function looksLikeGrabbedPage(value) {
	if (!value || typeof value !== "object") return false;
	const v = value;
	return Array.isArray(v.blocks) && typeof v.title === "string";
}
/**
* Per-feature AI engine selection (client-safe).
*
* The dashboard lets the admin pick which AI engine powers each smart feature:
* the Page Builder's per-page extraction script and the SEO competitor
* analyzer. Default engine is always Lovable AI, which needs no extra token.
*
* Stored in `site_settings` under the key `ai_engines`.
*/
var AI_ENGINES_KEY = "ai_engines";
var ANALYZERS = [
	{
		id: "builtin",
		label: "آنالیزور داخلی سایت (پیش‌فرض)",
		note: "صفحات رقیب را از نقشه سایت و لینک‌های داخلی پیدا می‌کند و سیگنال‌های سئو را می‌خواند."
	},
	{
		id: "neilpatel",
		label: "Traffic Checker نیل پاتل (روش ویدیو)",
		note: "آدرس رقیب را در ابزار نیل پاتل باز می‌کند؛ صفحه پرترافیک را از «Top Pages» کپی و اینجا وارد کنید.",
		externalUrl: "https://neilpatel.com/traffic-analyzer/"
	},
	{
		id: "ai_only",
		label: "فقط هوش مصنوعی (بدون خزش)",
		note: "بدون دریافت صفحات، تحلیل را تنها بر پایه دانش موتور هوش مصنوعی انجام می‌دهد."
	}
];
var DEFAULT_ENGINE = {
	provider: "lovable",
	model: "google/gemini-3.6-flash"
};
var DEFAULT_AI_ENGINES = {
	pageBuilder: { ...DEFAULT_ENGINE },
	seoCompetitor: { ...DEFAULT_ENGINE },
	analyzer: "builtin"
};
function getAnalyzer(id) {
	return ANALYZERS.find((a) => a.id === id) ?? ANALYZERS[0];
}
/**
* Dashboard-only server functions for the SEO competitor analyzer and the
* Page Builder's AI extraction. All of them require an unlocked dashboard
* session, because they spend AI credits and fetch remote pages.
*/
var aiExtractPageBlocks = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("0aad7e8ca5f443bbaa9fa7fd8bc57195b89d4c5ef0972b568a8dcf09cb8e9e23"));
var competitorTopPages = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("96fbf1299891f04c4c0c5b6c275f0c5868c0efc56dd0f3741b44017f33efbc59"));
var analyzeCompetitorSite = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("5bf025fcb7dd01e6dbcb588c89e3ef5d8ca65c7f121d55b77297756421637d40"));
var scanSiteSeo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("07ea5359fe57739f5f2971ada9db8dc42e8459bc3a74abe90382ac9750afd057"));
var aiRewritePage = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("f1cfd3c6e541049fd195f096380d755ae3f8cf16765a085a87c13a57effe29de"));
var inputCls$12 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
/**
* Shared "which AI engine should run this feature?" picker.
*
* Used by the Page Builder (extraction script) and the SEO competitor
* analyzer. Defaults to Lovable AI, which requires no extra token.
*/
function AiEngineSelect({ value, onChange, label = "موتور هوش مصنوعی" }) {
	const provider = getProvider(value.provider);
	const models = provider.models.some((m) => m.value === value.model) ? provider.models : [{
		value: value.model,
		label: value.model
	}, ...provider.models];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block font-bold text-slate-600",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: provider.id,
					onChange: (e) => {
						const next = getProvider(e.target.value);
						onChange({
							provider: next.id,
							model: next.models[0]?.value ?? value.model
						});
					},
					className: inputCls$12,
					children: AI_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.label
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[11px] text-slate-400",
					children: provider.note
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 block font-bold text-slate-600",
					children: "مدل"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					dir: "ltr",
					value: value.model,
					onChange: (e) => onChange({
						provider: provider.id,
						model: e.target.value
					}),
					className: inputCls$12,
					children: models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: m.value,
						children: m.label
					}, m.value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					placeholder: "یا شناسه مدل دلخواه را بنویسید",
					value: value.model,
					onChange: (e) => onChange({
						provider: provider.id,
						model: e.target.value
					}),
					className: `${inputCls$12} mt-1`
				})
			]
		})]
	});
}
/**
* Page Builder pane.
*
* Workflow: create/edit a custom page from composable blocks → live preview →
* save to site_settings → open in the Visual Editor / Inspector for fine
* visual editing → publish through the existing GitHub Build/Commit/Deploy
* workflow (no parallel deploy system).
*
* Image / gallery / video fields integrate with the existing Media Library via
* `/api/admin/assets?folder=media`.
*/
function PageBuilderPane({ onOpenVisualEditor, onOpenInspector, onOpenGrabber }) {
	const [pages, setPages] = (0, import_react.useState)({});
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mediaFor, setMediaFor] = (0, import_react.useState)(null);
	const [extractUrl, setExtractUrl] = (0, import_react.useState)("");
	const [extracting, setExtracting] = (0, import_react.useState)(false);
	const [autoBuilding, setAutoBuilding] = (0, import_react.useState)(false);
	const [autoStep, setAutoStep] = (0, import_react.useState)("");
	const [previewDevice, setPreviewDevice] = (0, import_react.useState)("desktop");
	const [pagesOpen, setPagesOpen] = (0, import_react.useState)(false);
	const [previewWidth, setPreviewWidth] = (0, import_react.useState)(0);
	const [engines, setEngines] = (0, import_react.useState)(DEFAULT_AI_ENGINES);
	const [aiBuilding, setAiBuilding] = (0, import_react.useState)(false);
	const previewFrame = (0, import_react.useRef)(null);
	const previewBox = (0, import_react.useRef)(null);
	const sendPreview = () => {
		if (!draft || !previewFrame.current?.contentWindow) return;
		previewFrame.current.contentWindow.postMessage({
			type: "pb:blocks",
			blocks: draft.blocks
		}, window.location.origin);
	};
	(0, import_react.useEffect)(() => {
		const element = previewBox.current;
		if (!element || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(() => setPreviewWidth(element.clientWidth));
		observer.observe(element);
		setPreviewWidth(element.clientWidth);
		return () => observer.disconnect();
	}, [draft, previewDevice]);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(sendPreview, 80);
		return () => window.clearTimeout(timer);
	}, [draft?.blocks]);
	(0, import_react.useEffect)(() => {
		const onMessage = (event) => {
			if (event.origin === window.location.origin && event.source === previewFrame.current?.contentWindow && event.data?.type === "pb:ready") sendPreview();
		};
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [draft?.blocks]);
	async function runExtract() {
		if (!draft) return;
		const u = extractUrl.trim();
		if (!u) return notifyFailed("استخراج محتوا", "ابتدا یک URL وارد کنید.");
		setExtracting(true);
		try {
			const res = await extractPageFromUrl({ data: { url: u } });
			if (!res.ok) {
				notifyFailed("استخراج محتوا", res.error || "خطای ناشناخته");
				return;
			}
			const next = {
				...draft,
				title: res.title && res.title.trim() ? res.title : draft.title,
				description: res.description && res.description.trim() ? res.description : draft.description,
				seoTitle: res.title && res.title.trim() ? res.title : draft.seoTitle,
				seoDescription: res.description && res.description.trim() ? res.description : draft.seoDescription,
				blocks: res.blocks && res.blocks.length ? res.blocks : draft.blocks,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setDraft(next);
			setDirty(true);
			notifySaved("استخراج محتوا");
		} catch (e) {
			notifyFailed("استخراج محتوا", e?.message || String(e));
		} finally {
			setExtracting(false);
		}
	}
	async function runAutoBuild() {
		if (!draft) return;
		const u = extractUrl.trim();
		if (!u) return notifyFailed("صفحه‌ساز خودکار", "ابتدا آدرس صفحه را در کادر بالا وارد کنید.");
		setAutoBuilding(true);
		let frame = null;
		try {
			setAutoStep("در حال دریافت صفحه…");
			const res = await fetchPageHtml({ data: { url: u } });
			if (!res.ok) {
				notifyFailed("صفحه‌ساز خودکار", res.error);
				return;
			}
			setAutoStep("در حال بارگذاری طرح و فونت‌ها…");
			const base = res.finalUrl;
			let html = res.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<base\b[^>]*>/gi, "").replace(/<meta[^>]+http-equiv=["']?(refresh|content-security-policy)[^>]*>/gi, "");
			html = html.replace(/<img\b([^>]*?)\sdata-(?:lazy-)?src=(["'])([^"']+)\2/gi, (_m, a, q, src) => `<img${a} src=${q}${src}${q}`);
			const baseTag = `<base href="${base.replace(/"/g, "&quot;")}">`;
			html = /<head[^>]*>/i.test(html) ? html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`) : baseTag + html;
			frame = document.createElement("iframe");
			frame.setAttribute("aria-hidden", "true");
			frame.style.cssText = "position:fixed;left:-20000px;top:0;width:1366px;height:900px;border:0;opacity:0;pointer-events:none";
			document.body.appendChild(frame);
			await new Promise((resolve) => {
				const done = () => resolve();
				frame.addEventListener("load", done, { once: true });
				setTimeout(done, 15e3);
				frame.srcdoc = html;
			});
			await new Promise((r) => setTimeout(r, 2e3));
			try {
				await frame.contentDocument?.fonts?.ready;
			} catch {}
			setAutoStep("در حال کپی کامل صفحه…");
			const script = buildGrabberScript({
				...DEFAULT_GRABBER_OPTIONS,
				mode: "blocks",
				slug: draft.slug,
				silent: true,
				sourceUrl: base,
				clipboard: false
			});
			const page = frame.contentWindow.eval(script);
			if (!page || !Array.isArray(page.blocks) || !page.blocks.length) {
				notifyFailed("صفحه‌ساز خودکار", "محتوایی پیدا نشد. این سایت احتمالاً محتوایش را با جاوااسکریپت می‌سازد؛ از روش اسکریپت دستی استفاده کنید.");
				return;
			}
			const next = {
				...draft,
				title: page.title || draft.title,
				description: page.description || draft.description,
				seoTitle: page.seoTitle || page.title || draft.seoTitle,
				seoDescription: page.seoDescription || draft.seoDescription,
				blocks: page.blocks,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setDraft(next);
			setDirty(true);
			notifySaved("صفحه‌ساز خودکار — صفحه ساخته شد؛ برای ماندگاری «ذخیره» را بزنید");
		} catch (e) {
			notifyFailed("صفحه‌ساز خودکار", e?.message || String(e));
		} finally {
			frame?.remove();
			setAutoBuilding(false);
			setAutoStep("");
		}
	}
	/** AI extraction: the selected engine turns the source page into editable blocks. */
	async function runAiBuild() {
		if (!draft) return;
		const u = extractUrl.trim();
		if (!u) return notifyFailed("استخراج با هوش مصنوعی", "ابتدا آدرس صفحه را وارد کنید.");
		setAiBuilding(true);
		try {
			const res = await aiExtractPageBlocks({ data: {
				url: u,
				provider: engines.pageBuilder.provider,
				model: engines.pageBuilder.model
			} });
			if (!res.ok) {
				notifyFailed("استخراج با هوش مصنوعی", res.error);
				return;
			}
			setDraft({
				...draft,
				title: res.title || draft.title,
				description: res.description || draft.description,
				seoTitle: res.title || draft.seoTitle,
				seoDescription: res.description || draft.seoDescription,
				blocks: res.blocks,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			setDirty(true);
			notifySaved("هوش مصنوعی صفحه را ساخت — همه اجزا قابل ویرایش هستند؛ «ذخیره» را بزنید");
		} catch (e) {
			notifyFailed("استخراج با هوش مصنوعی", e?.message || String(e));
		} finally {
			setAiBuilding(false);
		}
	}
	async function saveEngines(next) {
		setEngines(next);
		const r = await adminWriteSetting(AI_ENGINES_KEY, next);
		if (r.error) notifyFailed("ذخیره موتور هوش مصنوعی", r.error.message);
	}
	async function reload() {
		const map = await adminReadSetting(CUSTOM_PAGES_KEY, {});
		setPages(map);
		setEngines(await adminReadSetting(AI_ENGINES_KEY, DEFAULT_AI_ENGINES));
		if (!selectedSlug) {
			const first = Object.keys(map)[0] ?? null;
			if (first) {
				setSelectedSlug(first);
				setDraft(map[first]);
				setDirty(false);
			} else {
				setSelectedSlug(null);
				setDraft(null);
			}
		}
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	function selectPage(slug) {
		setSelectedSlug(slug);
		setDirty(false);
		setDraft(slug && pages[slug] ? pages[slug] : null);
	}
	function newPage() {
		const base = `page-${Date.now().toString(36).slice(-4)}`;
		const p = emptyPage(base);
		setDraft(p);
		setSelectedSlug(null);
		setDirty(true);
	}
	function patchDraft(patch) {
		setDraft((d) => d ? {
			...d,
			...patch
		} : d);
		setDirty(true);
	}
	function addBlock(type) {
		if (!draft) return;
		patchDraft({ blocks: [...draft.blocks, makeBlock(type)] });
	}
	function setBlockProp(id, key, value) {
		if (!draft) return;
		patchDraft({ blocks: draft.blocks.map((b) => b.id === id ? {
			...b,
			props: {
				...b.props,
				[key]: value
			}
		} : b) });
	}
	function moveBlock(id, dir) {
		if (!draft) return;
		const idx = draft.blocks.findIndex((b) => b.id === id);
		const j = idx + dir;
		if (idx < 0 || j < 0 || j >= draft.blocks.length) return;
		const next = [...draft.blocks];
		const [it] = next.splice(idx, 1);
		next.splice(j, 0, it);
		patchDraft({ blocks: next });
	}
	function removeBlock(id) {
		if (!draft) return;
		patchDraft({ blocks: draft.blocks.filter((b) => b.id !== id) });
	}
	async function savePage() {
		if (!draft) return null;
		const slug = sanitizeSlug(draft.slug);
		if (!slug) {
			notifyFailed("ذخیره صفحه", "نامک (slug) معتبر نیست.");
			return null;
		}
		const next = {
			...draft,
			slug,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setBusy(true);
		const cleaned = { ...await adminReadSetting(CUSTOM_PAGES_KEY, {}) };
		if (selectedSlug && selectedSlug !== slug) delete cleaned[selectedSlug];
		cleaned[slug] = next;
		const res = await adminWriteSetting(CUSTOM_PAGES_KEY, cleaned);
		setBusy(false);
		if (res.ok === false) {
			notifyFailed("ذخیره صفحه", res.error?.message || "خطای دیتابیس");
			return null;
		}
		setPages(cleaned);
		setSelectedSlug(slug);
		setDraft(next);
		setDirty(false);
		notifySaved("صفحه");
		return slug;
	}
	/**
	* The Visual Editor / Inspector / live view all load the *public* URL
	* `/p/<slug>`, which only exists once the page is stored. Opening an unsaved
	* (or edited-but-unsaved) draft therefore showed a ۴۰۴ inside the editor
	* iframe. Save first, then hand over the real saved slug.
	*/
	async function openSaved(open) {
		if (!draft) return;
		const slug = selectedSlug && !dirty ? selectedSlug : await savePage();
		if (!slug) return;
		open(pageUrl(slug));
	}
	async function duplicatePage(slug) {
		const src = pages[slug];
		if (!src) return;
		const copy = {
			...src,
			slug: sanitizeSlug(`${src.slug}-copy`),
			title: `${src.title} (کپی)`,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			blocks: src.blocks.map((b) => ({
				...b,
				id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
			})),
			published: false
		};
		setBusy(true);
		const map = await adminReadSetting(CUSTOM_PAGES_KEY, {});
		map[copy.slug] = copy;
		await adminWriteSetting(CUSTOM_PAGES_KEY, map);
		setBusy(false);
		setPages(map);
		setSelectedSlug(copy.slug);
		setDraft(copy);
		setDirty(false);
		notifySaved("صفحه (کپی)");
	}
	async function deletePage(slug) {
		if (!confirm(`حذف صفحه «${slug}»؟ این عمل قابل بازگشت نیست.`)) return;
		setBusy(true);
		const map = await adminReadSetting(CUSTOM_PAGES_KEY, {});
		delete map[slug];
		await adminWriteSetting(CUSTOM_PAGES_KEY, map);
		setBusy(false);
		setPages(map);
		if (selectedSlug === slug) selectPage(Object.keys(map)[0] ?? null);
		notifySaved("حذف صفحه");
	}
	async function publishToGithub() {
		if (!draft) return;
		if (dirty) await savePage();
		setBusy(true);
		const cfg = await adminReadSetting(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC);
		const acc = cfg.accounts.find((a) => a.isDefault) ?? cfg.accounts[0];
		if (!acc) {
			setBusy(false);
			return notifyFailed("انتشار در گیت‌هاب", "هیچ حساب گیت‌هابی متصل نیست. ابتدا از تب «اتصال گیت‌هاب» یک حساب اضافه کنید.");
		}
		const res = await githubPublishSnapshot({ data: {
			secretName: acc.secretName,
			owner: acc.owner,
			repo: acc.repo,
			branch: acc.branch,
			path: acc.path,
			note: `انتشار صفحه‌ساز: ${draft.title}`
		} });
		setBusy(false);
		if (res.ok) notifySaved("ارسال به گیت‌هاب (Build/Commit/Deploy)");
		else notifyFailed("ارسال به گیت‌هاب", res.error);
	}
	const list = Object.values(pages).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	const inputCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm w-full";
	const btnCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50";
	const primaryBtn = "px-3 py-2 rounded-xl bg-[#0b1e3f] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#15294a] disabled:opacity-50";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4 flex flex-wrap items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "flex items-center gap-2 text-2xl font-extrabold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "h-6 w-6 shrink-0" }), " صفحه‌ساز"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "ساخت و تنظیم صفحه در کنار پیش‌نمایش زنده"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPagesOpen((open) => !open),
								className: btnCls,
								"aria-expanded": pagesOpen,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "h-4 w-4" }),
									" صفحات ساخته‌شده",
									list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-muted px-1.5 py-0.5 text-[10px]",
										children: list.length
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: newPage,
								className: primaryBtn,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " صفحه جدید"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void savePage(),
								disabled: !draft || busy,
								className: primaryBtn,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " ذخیره"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void publishToGithub(),
								disabled: !draft || busy,
								className: primaryBtn,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "h-4 w-4" }), " انتشار در گیت‌هاب"]
							})
						]
					}),
					pagesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:left-auto sm:w-[360px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border bg-muted px-3 py-2 text-xs font-bold text-card-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "صفحات ساخته‌شده" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPagesOpen(false),
								className: "rounded p-1 text-muted-foreground hover:bg-background",
								"aria-label": "بستن",
								children: "✕"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "max-h-[55vh] divide-y divide-border overflow-y-auto",
							children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-3 py-8 text-center text-xs text-muted-foreground",
								children: "هنوز صفحه‌ای نساخته‌اید."
							}), list.map((pageItem) => {
								const active = selectedSlug === pageItem.slug;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										selectPage(pageItem.slug);
										setPagesOpen(false);
									},
									className: `grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 text-right transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-bold",
											children: pageItem.title || pageItem.slug
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-[11px] opacity-70",
											dir: "ltr",
											children: ["/p/", pageItem.slug]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `shrink-0 rounded px-1.5 py-0.5 text-[10px] ${active ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground"}`,
										children: pageItem.published ? "منتشر" : "پیش‌نویس"
									})]
								}) }, pageItem.slug);
							})]
						})]
					})
				]
			}),
			!draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground",
				children: "از دکمه «صفحات ساخته‌شده» یک صفحه را انتخاب کنید یا «صفحه جدید» را بزنید."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-sm font-extrabold text-card-foreground",
								children: ["پیش‌نمایش زنده — ", draft.title || draft.slug]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-[11px] text-muted-foreground",
								dir: "ltr",
								children: ["/p/", draft.slug]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold text-amber-600",
								children: "ذخیره نشده"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex overflow-hidden rounded-lg border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPreviewDevice("desktop"),
										title: "دسکتاپ",
										"aria-label": "دسکتاپ",
										className: `p-2 ${previewDevice === "desktop" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPreviewDevice("tablet"),
										title: "تبلت",
										"aria-label": "تبلت",
										className: `p-2 ${previewDevice === "tablet" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPreviewDevice("mobile"),
										title: "موبایل",
										"aria-label": "موبایل",
										className: `p-2 ${previewDevice === "mobile" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" })
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: previewBox,
						className: "min-h-[520px] overflow-hidden bg-muted lg:min-h-[680px]",
						children: previewDevice === "desktop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full overflow-hidden",
							style: { height: Math.round(860 * (previewWidth ? Math.min(1, previewWidth / 1440) : 1)) },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								ref: previewFrame,
								src: "/p/__page-builder-preview?pbPreview=1",
								title: "پیش‌نمایش صفحه‌ساز",
								onLoad: sendPreview,
								className: "border-0 bg-background",
								style: {
									width: 1440,
									height: 860,
									transform: `scale(${previewWidth ? Math.min(1, previewWidth / 1440) : 1})`,
									transformOrigin: "top right"
								}
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: previewDevice === "mobile" ? "mx-auto w-full max-w-[390px]" : "mx-auto w-full max-w-[834px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								ref: previewFrame,
								src: "/p/__page-builder-preview?pbPreview=1",
								title: "پیش‌نمایش صفحه‌ساز",
								onLoad: sendPreview,
								className: "h-[75vh] w-full border-0 bg-background"
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-w-0 space-y-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pl-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-card-foreground",
									children: "تنظیمات صفحه"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs text-muted-foreground",
									children: ["عنوان", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inputCls,
										value: draft.title,
										onChange: (e) => patchDraft({ title: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs text-muted-foreground",
									children: ["نامک (slug) → /p/…", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										dir: "ltr",
										className: inputCls,
										value: draft.slug,
										onChange: (e) => patchDraft({ slug: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs text-muted-foreground",
									children: ["توضیح کوتاه", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: inputCls,
										rows: 2,
										value: draft.description,
										onChange: (e) => patchDraft({ description: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs text-muted-foreground",
									children: ["عنوان سئو", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inputCls,
										value: draft.seoTitle,
										onChange: (e) => patchDraft({ seoTitle: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: draft.published,
										onChange: (e) => patchDraft({ published: e.target.checked })
									}), "منتشر (index در گوگل)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void openSaved(onOpenVisualEditor),
											className: btnCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5" }), " ویرایشگر بصری"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void openSaved(onOpenInspector),
											className: btnCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "h-3.5 w-3.5" }), " موس ایرادیاب"]
										}),
										onOpenGrabber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: onOpenGrabber,
											className: btnCls,
											title: "ساخت اسکریپت دانلود کامل یک صفحه و بارگذاری خروجی آن",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-3.5 w-3.5" }), " اسکریپت دانلود صفحه"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void openSaved((p) => window.open(p, "_blank", "noopener")),
											className: btnCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " مشاهده زنده"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void duplicatePage(draft.slug),
											className: btnCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " کپی"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void deletePage(draft.slug),
											className: btnCls,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " حذف"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs font-bold text-card-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }), " استخراج محتوا از URL"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[minmax(0,1fr)_auto] gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										dir: "ltr",
										className: inputCls,
										placeholder: "https://example.com/page",
										value: extractUrl,
										onChange: (e) => setExtractUrl(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !extracting) runExtract();
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => void runExtract(),
										disabled: extracting,
										className: primaryBtn,
										children: extracting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void runAiBuild(),
									disabled: aiBuilding || autoBuilding || extracting,
									className: `${primaryBtn} w-full justify-center`,
									children: [aiBuilding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), aiBuilding ? "هوش مصنوعی در حال ساخت صفحه…" : "ساخت صفحه با هوش مصنوعی (پیشنهادی)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void runAutoBuild(),
									disabled: autoBuilding || extracting || aiBuilding,
									className: `${btnCls} w-full justify-center`,
									children: [autoBuilding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" }), autoBuilding ? autoStep || "در حال ساخت…" : "صفحه‌ساز خودکار (بدون هوش مصنوعی)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] leading-5 text-muted-foreground",
									children: "آدرس صفحه را وارد کنید؛ محتوای همان صفحه به اجزای جداگانه (تیتر، متن، تصویر، کارت…) تبدیل می‌شود و همه در ویرایشگر بصری قابل انتخاب و ویرایش هستند. هدر و فوتر سایت شما همیشه حفظ می‌شود."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-border bg-muted/40 p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiEngineSelect, {
										value: engines.pageBuilder,
										onChange: (pageBuilder) => void saveEngines({
											...engines,
											pageBuilder
										}),
										label: "موتور هوش مصنوعی صفحه‌ساز"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs font-bold text-card-foreground",
								children: "افزودن اجزای صفحه"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: BLOCK_TYPES.map((blockType) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => addBlock(blockType.type),
									className: "flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-bold hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0",
										children: blockType.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: blockType.label
									})]
								}, blockType.type))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-card-foreground",
									children: "اجزای صفحه"
								}),
								draft.blocks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-4 text-center text-xs text-muted-foreground",
									children: "یک جزء به صفحه اضافه کنید."
								}),
								draft.blocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEditor, {
									block,
									index,
									total: draft.blocks.length,
									onMove: (dir) => moveBlock(block.id, dir),
									onRemove: () => removeBlock(block.id),
									onProp: (key, value) => setBlockProp(block.id, key, value),
									onPickMedia: (apply) => setMediaFor({
										blockId: block.id,
										apply
									})
								}, block.id))
							]
						})
					]
				})]
			}),
			mediaFor && draft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
				onClose: () => setMediaFor(null),
				onPick: (url) => {
					mediaFor.apply(url);
					setMediaFor(null);
				}
			})
		]
	});
}
function BlockEditor({ block, index, total, onMove, onRemove, onProp, onPickMedia }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	block.props;
	const inputCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm w-full";
	const meta = BLOCK_TYPES.find((b) => b.type === block.type);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-slate-200 bg-slate-50/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: meta?.icon
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpen((v) => !v),
					className: "text-xs font-bold flex-1 text-right hover:underline",
					children: [
						meta?.label,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400",
							children: ["#", index + 1]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onMove(-1),
					disabled: index === 0,
					className: "p-1 rounded hover:bg-white disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onMove(1),
					disabled: index === total - 1,
					className: "p-1 rounded hover:bg-white disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-3.5 h-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onRemove,
					className: "p-1 rounded hover:bg-white text-red-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-3 space-y-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockProps, {
				block,
				onProp,
				onPickMedia,
				inputCls
			})
		})]
	});
}
function MediaButton({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold flex items-center gap-1 hover:bg-slate-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-3 h-3" }), " از کتابخانه رسانه"]
	});
}
function Field$2({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-slate-500 block",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
function BlockProps({ block, onProp, onPickMedia, inputCls }) {
	const p = block.props ?? {};
	switch (block.type) {
		case "hero": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "عنوان",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputCls,
					value: p.title ?? "",
					onChange: (e) => onProp("title", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "توضیح",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputCls,
					value: p.subtitle ?? "",
					onChange: (e) => onProp("subtitle", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "تصویر پس‌زمینه (اختیاری)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						className: inputCls,
						value: p.bgImage ?? "",
						onChange: (e) => onProp("bgImage", e.target.value),
						placeholder: "https://… یا خالی برای گرادیان"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaButton, { onClick: () => onPickMedia((url) => onProp("bgImage", url)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "متن دکمه",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: p.ctaText ?? "",
							onChange: (e) => onProp("ctaText", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "لینک دکته",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							className: inputCls,
							value: p.ctaHref ?? "",
							onChange: (e) => onProp("ctaHref", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "تراز",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputCls,
							value: p.align ?? "center",
							onChange: (e) => onProp("align", e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "center",
									children: "مرکز"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "right",
									children: "راست"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "left",
									children: "چپ"
								})
							]
						})
					})
				]
			})
		] });
		case "text": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "عنوان",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputCls,
					value: p.title ?? "",
					onChange: (e) => onProp("title", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "متن",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: inputCls,
					rows: 4,
					value: p.body ?? "",
					onChange: (e) => onProp("body", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "تراز",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: inputCls,
					value: p.align ?? "right",
					onChange: (e) => onProp("align", e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "right",
							children: "راست"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "center",
							children: "مرکز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "left",
							children: "چپ"
						})
					]
				})
			})
		] });
		case "cta": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "عنوان",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputCls,
					value: p.title ?? "",
					onChange: (e) => onProp("title", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "توضیح",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputCls,
					value: p.body ?? "",
					onChange: (e) => onProp("body", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "متن دکمه",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputCls,
							value: p.buttonLabel ?? "",
							onChange: (e) => onProp("buttonLabel", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "لینک",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							className: inputCls,
							value: p.buttonHref ?? "",
							onChange: (e) => onProp("buttonHref", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
						label: "رنگ پس‌زمینه",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							className: inputCls,
							value: p.bg ?? "#0b1e3f",
							onChange: (e) => onProp("bg", e.target.value)
						})
					})
				]
			})
		] });
		case "cards": {
			const items = Array.isArray(p.items) ? p.items : [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
					label: "تعداد ستون‌ها",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: inputCls,
						value: p.columns ?? "3",
						onChange: (e) => onProp("columns", e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "2",
								children: "۲"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "3",
								children: "۳"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "4",
								children: "۴"
							})
						]
					})
				}),
				items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 gap-2 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
								label: `کارت ${i + 1} عنوان`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputCls,
									value: it.title ?? "",
									onChange: (e) => {
										const next = [...items];
										next[i] = {
											...next[i],
											title: e.target.value
										};
										onProp("items", next);
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
								label: "متن",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: inputCls,
									value: it.text ?? "",
									onChange: (e) => {
										const next = [...items];
										next[i] = {
											...next[i],
											text: e.target.value
										};
										onProp("items", next);
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onProp("items", items.filter((_, j) => j !== i)),
							className: "col-span-1 mb-1 p-1 text-red-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
						})
					]
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onProp("items", [...items, {
						title: "کارت جدید",
						text: ""
					}]),
					className: "px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold",
					children: "+ افزودن کارت"
				})
			] });
		}
		case "image": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
			label: "آدرس تصویر",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					className: inputCls,
					value: p.src ?? "",
					onChange: (e) => onProp("src", e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaButton, { onClick: () => onPickMedia((url) => onProp("src", url)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
					label: "متن جایگزین (alt)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: p.alt ?? "",
						onChange: (e) => onProp("alt", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
					label: "لینک (اختیاری)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						className: inputCls,
						value: p.href ?? "",
						onChange: (e) => onProp("href", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
					label: "عرض",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: inputCls,
						value: p.width ?? "full",
						onChange: (e) => onProp("width", e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "full",
							children: "تمام‌عرض"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "boxed",
							children: "وسط‌چین"
						})]
					})
				})
			]
		})] });
		case "gallery": {
			const images = Array.isArray(p.images) ? p.images : [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
					label: "تعداد ستون‌ها",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: inputCls,
						value: p.columns ?? "3",
						onChange: (e) => onProp("columns", e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "2",
								children: "۲"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "3",
								children: "۳"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "4",
								children: "۴"
							})
						]
					})
				}),
				images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
								label: `تصویر ${i + 1}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									className: inputCls,
									value: src,
									onChange: (e) => {
										const next = [...images];
										next[i] = e.target.value;
										onProp("images", next);
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaButton, { onClick: () => onPickMedia((url) => {
							const next = [...images];
							next[i] = url;
							onProp("images", next);
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onProp("images", images.filter((_, j) => j !== i)),
							className: "mb-1 p-1 text-red-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
						})
					]
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onProp("images", [...images, ""]),
					className: "px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold",
					children: "+ افزودن تصویر"
				})
			] });
		}
		case "video": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
			label: "آدرس ویدیو",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					className: inputCls,
					value: p.src ?? "",
					onChange: (e) => onProp("src", e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaButton, { onClick: () => onPickMedia((url) => onProp("src", url)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
			label: "پوستر (اختیاری)",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					className: inputCls,
					value: p.poster ?? "",
					onChange: (e) => onProp("poster", e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaButton, { onClick: () => onPickMedia((url) => onProp("poster", url)) })]
			})
		})] });
		case "divider": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-slate-400",
			children: "بدون تنظیمات."
		});
		case "clone": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] leading-6 text-slate-500",
				children: "این بلوک کپی کامل صفحهٔ مبدأ است (طرح، فونت، رنگ، ویدیو). جزئیات را با «ویرایشگر بصری» روی خود صفحه ویرایش کنید."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "حداکثر عرض (مثلاً 1200px — خالی = عرض اصلی)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					className: inputCls,
					value: p.maxWidth ?? "",
					onChange: (e) => onProp("maxWidth", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "کد HTML (پیشرفته)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					dir: "ltr",
					className: inputCls,
					rows: 6,
					value: p.html ?? "",
					onChange: (e) => onProp("html", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
				label: "CSS و فونت‌ها (پیشرفته)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					dir: "ltr",
					className: inputCls,
					rows: 4,
					value: p.css ?? "",
					onChange: (e) => onProp("css", e.target.value)
				})
			})
		] });
		case "html": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$2, {
			label: "کد HTML",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				dir: "ltr",
				className: inputCls,
				rows: 6,
				value: p.html ?? "",
				onChange: (e) => onProp("html", e.target.value)
			})
		});
		default: return null;
	}
}
function MediaPicker({ onClose, onPick }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetch(`/api/admin/assets?folder=media`).then((r) => r.json()).then((j) => {
			if (alive) {
				setItems(j.files ?? []);
				setLoading(false);
			}
		}).catch(() => {
			if (alive) setLoading(false);
		});
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-3 border-b border-slate-200 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-bold text-sm",
					children: "کتابخانه رسانه"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-slate-500 hover:text-slate-800",
					children: "✕"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 overflow-y-auto",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-sm text-slate-400 py-10",
					children: "در حال بارگذاری…"
				}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center text-sm text-slate-400 py-10",
					children: [
						"رسانه‌ای در پوشه ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "media" }),
						" نیست. ابتدا از تب «کتابخانه رسانه» فایل آپلود کنید."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-3",
					children: items.map((it) => {
						const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(it.url);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onPick(it.url),
							className: "rounded-xl overflow-hidden border border-slate-200 hover:border-[#0b1e3f] aspect-square bg-slate-100",
							title: it.name,
							children: isVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: it.url,
								muted: true,
								playsInline: true,
								preload: "metadata",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: it.url,
								alt: it.name,
								loading: "lazy",
								className: "h-full w-full object-cover"
							})
						}, it.url);
					})
				})
			})]
		})
	});
}
/**
* «دانلود صفحه» pane.
*
* Generates the browser snippet that grabs a fully rendered page (including
* pages behind a login, which the server-side extractor can never reach) and
* imports the resulting JSON back into the Page Builder as a draft page.
*/
function PageGrabberPane({ onOpenBuilder }) {
	const [opts, setOpts] = (0, import_react.useState)(DEFAULT_GRABBER_OPTIONS);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [json, setJson] = (0, import_react.useState)("");
	const fileInput = (0, import_react.useRef)(null);
	const script = (0, import_react.useMemo)(() => buildGrabberScript(opts), [opts]);
	const patch = (p) => setOpts((o) => ({
		...o,
		...p
	}));
	async function copyScript() {
		try {
			await navigator.clipboard.writeText(script);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2e3);
		} catch {
			notifyFailed("کپی اسکریپت", "مرورگر اجازه کپی نداد؛ متن را دستی انتخاب و کپی کنید.");
		}
	}
	function downloadScript() {
		const blob = new Blob([script], { type: "text/javascript;charset=utf-8" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "page-grabber.js";
		document.body.appendChild(a);
		a.click();
		window.setTimeout(() => {
			URL.revokeObjectURL(a.href);
			a.remove();
		}, 3e3);
	}
	async function onPickFile(file) {
		if (!file) return;
		const text = await file.text();
		setJson(text);
	}
	async function importJson() {
		const raw = json.trim();
		if (!raw) return notifyFailed("بارگذاری صفحه", "ابتدا محتوای فایل JSON را بچسبانید یا فایل را انتخاب کنید.");
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch (e) {
			return notifyFailed("بارگذاری صفحه", "فایل JSON معتبر نیست: " + (e?.message || ""));
		}
		if (!looksLikeGrabbedPage(parsed)) return notifyFailed("بارگذاری صفحه", "ساختار فایل با خروجی ویجت دانلود صفحه همخوانی ندارد.");
		const src = parsed;
		const slug = sanitizeSlug(String(src.slug || src.title || "grabbed-page"));
		const page = {
			slug,
			title: String(src.title || slug),
			description: String(src.description || ""),
			blocks: (src.blocks || []).filter((b) => b && typeof b === "object" && typeof b.type === "string"),
			seoTitle: String(src.seoTitle || src.title || ""),
			seoDescription: String(src.seoDescription || src.description || ""),
			published: false,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (!page.blocks.length) return notifyFailed("بارگذاری صفحه", "هیچ بلوکی در فایل پیدا نشد.");
		setBusy(true);
		const next = { ...await adminReadSetting(CUSTOM_PAGES_KEY, {}) };
		let finalSlug = slug;
		if (next[finalSlug]) {
			if (!window.confirm(`صفحه‌ای با نامک «${finalSlug}» وجود دارد. جایگزین شود؟\n(لغو = ساخت نسخه جدید)`)) finalSlug = sanitizeSlug(`${slug}-${Date.now().toString(36).slice(-4)}`);
		}
		next[finalSlug] = {
			...page,
			slug: finalSlug
		};
		const res = await adminWriteSetting(CUSTOM_PAGES_KEY, next);
		setBusy(false);
		if (res.ok === false) return notifyFailed("بارگذاری صفحه", res.error?.message || "خطای دیتابیس");
		notifySaved(`صفحه «${page.title}» با ${page.blocks.length} بلوک`);
		setJson("");
		onOpenBuilder?.(finalSlug);
	}
	const card = "rounded-xl border border-border bg-card p-4 space-y-3";
	const inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
	const btn = "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-extrabold text-[#0b1e3f]",
			children: "دانلود صفحه (ویجت استخراج کامل)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-6 text-slate-500",
			children: "این ابزار یک اسکریپت آماده می‌سازد که روی هر صفحه‌ای در مرورگر خودتان اجرا می‌شود — حتی صفحه‌هایی که پشت ورود کاربری هستند یا با جاوااسکریپت ساخته می‌شوند — و کل محتوای صفحه را به شکل یک فایل JSON دانلود می‌کند. سپس همان فایل را اینجا بارگذاری می‌کنید تا به صورت یک صفحهٔ پیش‌نویس در صفحه‌ساز ساخته شود."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: card,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-extrabold text-card-foreground",
							children: "۱) اسکریپت آماده"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: copyScript,
									className: btn,
									children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "کپی شد" : "کپی اسکریپت"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: downloadScript,
									className: btn,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " دانلود page-grabber.js"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setOpts(DEFAULT_GRABBER_OPTIONS),
									className: btn,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " بازنشانی تنظیمات"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						readOnly: true,
						dir: "ltr",
						value: script,
						onFocus: (e) => e.currentTarget.select(),
						className: "h-[360px] w-full rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] leading-5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-muted/50 p-3 text-[11px] leading-6 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-card-foreground",
								children: "روش ۱ — اسکریپت‌ساز خودکار (Snippets)"
							}),
							"صفحهٔ موردنظر را باز کنید → کلید F12 → تب ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: "Sources"
							}),
							" → بخش ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: "Snippets"
							}),
							" →",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: " + New snippet"
							}),
							" → اسکریپت بالا را بچسبانید → ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: "Ctrl + Enter"
							}),
							".",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-bold text-card-foreground",
								children: "روش ۲ — تزریق دستی با Notepad"
							}),
							"دکمهٔ «دانلود page-grabber.js» را بزنید (یا اسکریپت را در Notepad ذخیره کنید) → صفحهٔ موردنظر را باز کنید → F12 → تب ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: "Console"
							}),
							" → متن فایل را بچسبانید → Enter. اگر مرورگر هشدار چسباندن داد، عبارت",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								dir: "ltr",
								children: " allow pasting"
							}),
							" را تایپ کنید و Enter بزنید.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [
									"در هر دو روش، فایل ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										dir: "ltr",
										children: "page-<slug>.json"
									}),
									" دانلود می‌شود."
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: card,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-extrabold text-card-foreground",
							children: "تنظیمات اسکریپت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [[
								"clone",
								"کپی کامل و عینِ صفحه",
								"طرح، فونت، رنگ، تصویر و ویدیو دقیقاً مثل صفحهٔ اصلی؛ هدر و فوتر با سایت شما جایگزین می‌شود."
							], [
								"blocks",
								"بلوک‌های ساده",
								"فقط متن و تصاویر به بلوک‌های صفحه‌ساز تبدیل می‌شود."
							]].map(([m, label, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => patch({ mode: m }),
								className: `rounded-lg border p-2 text-right text-xs ${opts.mode === m ? "border-primary bg-primary/10 font-bold" : "border-border"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] leading-5 text-muted-foreground",
									children: hint
								})]
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted-foreground",
							children: ["نامک پیشنهادی (خالی = از آدرس صفحه)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								className: inputCls,
								value: opts.slug,
								onChange: (e) => patch({ slug: e.target.value })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted-foreground",
							children: ["حداکثر کاراکتر هر بلوک متن", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								dir: "ltr",
								min: 500,
								max: 2e4,
								className: inputCls,
								value: opts.maxChars,
								onChange: (e) => patch({ maxChars: Number(e.target.value) })
							})]
						}),
						[
							["images", "تصاویر"],
							["galleries", "گالری‌ها"],
							["buttons", "دکمه‌ها (CTA)"],
							["videos", "ویدیو و iframe"],
							["clipboard", "کپی خروجی در کلیپ‌بورد"]
						].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs text-card-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: Boolean(opts[k]),
								onChange: (e) => patch({ [k]: e.target.checked })
							}), label]
						}, String(k)))
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: card,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-extrabold text-card-foreground",
							children: "۲) بارگذاری خروجی در صفحه‌ساز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInput,
							type: "file",
							accept: "application/json,.json",
							className: "hidden",
							onChange: (e) => void onPickFile(e.target.files?.[0])
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInput.current?.click(),
							className: btn,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-3.5 w-3.5" }), " انتخاب فایل JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							dir: "ltr",
							rows: 7,
							placeholder: "{\"slug\":\"...\",\"title\":\"...\",\"blocks\":[...]}",
							value: json,
							onChange: (e) => setJson(e.target.value),
							className: "w-full rounded-lg border border-border bg-background p-2 font-mono text-[11px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void importJson(),
							className: "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-60",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), "ساخت صفحه از این فایل"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] leading-6 text-muted-foreground",
							children: "صفحه به صورت «پیش‌نویس» ساخته می‌شود؛ بعد از بررسی در صفحه‌ساز می‌توانید آن را منتشر کنید."
						})
					]
				})]
			})]
		})]
	});
}
var KEY = "login_bot_config";
var DEF = {
	enabled: true,
	requireLogin: true,
	useSiteAi: true,
	aiEnabled: true,
	botUsername: "SamInsuranceBot",
	botTitle: "بیمه سامان لاهیجان"
};
var fmt = (d) => d ? new Date(d).toLocaleString("fa-IR") : "—";
/** Default Saman bot: same bot as the site login + website AI assistant. */
function DefaultBotCard() {
	const [cfg, setCfg] = (0, import_react.useState)(DEF);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function load() {
		const [c, s, u] = await Promise.all([
			adminReadSetting(KEY, DEF),
			defaultBotStatus().catch(() => null),
			adminDb("telegram_users").select("*").order("created_at", { ascending: false }).limit(200)
		]);
		setCfg({
			...DEF,
			...c
		});
		setStatus(s);
		setUsers(u.data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function save() {
		setBusy(true);
		const res = await adminWriteSetting(KEY, cfg);
		setBusy(false);
		setMsg(res?.error ? "ذخیره نشد" : "تنظیمات ربات ذخیره شد ✓");
	}
	async function hook() {
		setBusy(true);
		try {
			const r = await defaultBotSetWebhook({ data: { origin: window.location.origin } });
			setMsg(r.ok ? `وب‌هوک ثبت شد: ${r.url}` : r.error);
		} catch (e) {
			setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
		}
		setBusy(false);
		load();
	}
	async function toggleUser(u) {
		await adminDb("telegram_users").update({ is_active: !u.is_active }).eq("telegram_id", u.telegram_id);
		load();
	}
	const ok = status && "username" in status && status.username;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-sky-200 bg-gradient-to-l from-sky-50 to-white p-4 mb-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-extrabold text-[#0b1e3f] flex items-center gap-2",
						children: ["ربات پیش‌فرض سایت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700",
							children: "پیش‌فرض"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-slate-500",
						children: ok ? `@${status.username}` : status && !status.configured ? "توکن TELEGRAM_BOT_TOKEN در سرور تنظیم نشده" : "در حال بررسی…"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void load(),
							className: "flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), " بررسی"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: busy,
							onClick: () => void hook(),
							className: "flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-white border border-sky-300 text-sky-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-4 h-4" }), " ثبت وب‌هوک روی همین دامنه"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: busy,
							onClick: () => void save(),
							className: "flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-sky-600 text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
						})
					]
				})]
			}),
			status && "webhookUrl" in status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-slate-600 bg-white rounded-xl border border-slate-200 p-2 leading-6",
				dir: "ltr",
				children: [
					"webhook: ",
					status.webhookUrl || "—",
					" · pending: ",
					status.pending,
					status.lastError ? ` · last error: ${status.lastError}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-3 gap-2 text-xs",
				children: [
					["enabled", "ربات فعال باشد"],
					["requireLogin", "اول ورود با ارسال شماره تلگرام"],
					["useSiteAi", "پاسخ با همان هوش مصنوعی چت سایت"]
				].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: Boolean(cfg[k]),
						onChange: (e) => setCfg({
							...cfg,
							[k]: e.target.checked
						})
					}), label]
				}, k))
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-sky-800",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs font-bold text-[#0b1e3f] mb-2 flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" }),
					" کاربران واردشده با تلگرام (",
					users.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto bg-white rounded-xl border border-slate-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-slate-50 text-slate-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "نام"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "یوزرنیم"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "شماره"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "اولین ورود"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "آخرین فعالیت"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "وضعیت"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: [u.first_name, u.last_name].filter(Boolean).join(" ") || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								dir: "ltr",
								children: u.telegram_username ? `@${u.telegram_username}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 font-mono",
								dir: "ltr",
								children: u.phone_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: fmt(u.created_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: fmt(u.last_login)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void toggleUser(u),
									className: `px-2 py-0.5 rounded-full ${u.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`,
									children: u.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-3 h-3" }), " فعال"]
									}) : "غیرفعال"
								})
							})
						]
					}, u.telegram_id)), users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-4 text-center text-slate-400",
						children: "هنوز کاربری از طریق ربات وارد نشده است."
					}) })] })]
				})
			})] })
		]
	});
}
var inputCls$11 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls$5 = "bg-white rounded-2xl border border-slate-200 p-4";
function TelegramPane() {
	const [bots, setBots] = (0, import_react.useState)([]);
	const [flows, setFlows] = (0, import_react.useState)([]);
	const [runs, setRuns] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	async function load() {
		const [b, f, r] = await Promise.all([
			adminDb("telegram_bots").select("*").order("created_at", { ascending: true }),
			adminDb("telegram_flows").select("*").order("created_at", { ascending: true }),
			adminDb("telegram_runs").select("*").order("created_at", { ascending: false }).limit(30)
		]);
		setBots(b.data ?? []);
		setFlows(f.data ?? []);
		setRuns(r.data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const botName = (0, import_react.useMemo)(() => (id) => bots.find((b) => b.id === id)?.name ?? "—", [bots]);
	async function addBot() {
		await adminDb("telegram_bots").insert({
			name: "ربات جدید",
			bot_token: "",
			webhook_secret: crypto.randomUUID().replace(/-/g, ""),
			default_chat_ids: "",
			is_active: true
		});
		load();
	}
	async function saveBot(b) {
		setBusy(true);
		const secret = b.webhook_secret || crypto.randomUUID().replace(/-/g, "");
		const res = await adminDb("telegram_bots").update({
			name: b.name,
			bot_token: b.bot_token,
			bot_username: b.bot_username,
			webhook_secret: secret,
			default_chat_ids: b.default_chat_ids,
			is_active: b.is_active
		}).eq("id", b.id);
		setBusy(false);
		setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "ربات ذخیره شد ✓");
	}
	async function removeBot(id) {
		if (!confirm("این ربات و همه اتوماسیون‌هایش حذف شود؟")) return;
		await adminDb("telegram_bots").delete().eq("id", id);
		load();
	}
	async function hook(b) {
		setBusy(true);
		try {
			const url = `${origin}/api/public/telegram/webhook/${b.id}`;
			const res = await telegramSetWebhook({ data: {
				botId: b.id,
				url
			} });
			setMsg(res.ok ? `وب‌هوک متصل شد: ${url}` : "اتصال وب‌هوک ناموفق بود.");
			load();
		} catch (e) {
			setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
		}
		setBusy(false);
	}
	async function info(b) {
		setBusy(true);
		try {
			const res = await telegramGetInfo({ data: { botId: b.id } });
			setMsg(`ربات: @${res.me?.["username"] ?? "?"} — وب‌هوک: ${res.hook?.["url"] || "متصل نیست"} — در صف: ${res.hook?.["pending_update_count"] ?? 0}`);
		} catch (e) {
			setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
		}
		setBusy(false);
	}
	async function addFlow() {
		await adminDb("telegram_flows").insert({
			bot_id: bots[0]?.id ?? null,
			name: "اتوماسیون جدید",
			trigger_type: "manual",
			steps: [{
				type: "sendMessage",
				text: "سلام! این یک پیام تبلیغاتی آزمایشی است."
			}],
			is_active: true
		});
		load();
	}
	async function saveFlow(f) {
		setBusy(true);
		const res = await adminDb("telegram_flows").update({
			bot_id: f.bot_id,
			name: f.name,
			trigger_type: f.trigger_type,
			trigger_keyword: f.trigger_keyword,
			schedule_cron: f.schedule_cron,
			steps: f.steps,
			is_active: f.is_active
		}).eq("id", f.id);
		setBusy(false);
		setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "اتوماسیون ذخیره شد ✓");
	}
	async function runFlow(id) {
		setBusy(true);
		try {
			const res = await telegramRunFlow({ data: { flowId: id } });
			setMsg(res.ok ? `اجرا شد — ${res.sent} پیام ارسال شد.` : `خطا: ${res.error}`);
		} catch (e) {
			setMsg(`خطا: ${e instanceof Error ? e.message : String(e)}`);
		}
		setBusy(false);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "w-6 h-6" }), " ربات تلگرام و اتوماسیون"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-500 mt-1 leading-6",
					children: "با توکن اختصاصی خودتان ربات را متصل کنید، کانال‌ها و گروه‌ها را تعریف کنید و زنجیره‌ای از پیام‌ها را به‌صورت خودکار ارسال کنید."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void load(),
							className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), " بازخوانی"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void addBot(),
							className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " ربات جدید"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void addFlow(),
							disabled: bots.length === 0,
							className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4" }), " اتوماسیون جدید"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultBotCard, {})
			]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3 break-all",
			dir: "auto",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `${cardCls$5} mb-6 flex gap-2 text-[11px] text-slate-600 leading-6`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 shrink-0 mt-0.5 text-[#0b1e3f]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"توکن ربات را از ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					dir: "ltr",
					children: "@BotFather"
				}),
				" بگیرید. برای ارسال به کانال، ربات را ادمین کانال کنید و شناسه کانال را به شکل ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					children: "@channelname"
				}),
				" یا ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					children: "-1001234567890"
				}),
				" وارد کنید. چند شناسه را با کاما یا خط جدید از هم جدا کنید."
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-extrabold text-[#0b1e3f] mb-3",
			children: "ربات‌ها"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 mb-8",
			children: [bots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${cardCls$5} text-xs text-slate-500`,
				children: "هنوز رباتی اضافه نشده است."
			}), bots.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${cardCls$5} grid md:grid-cols-12 gap-3 items-end`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نام ربات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: b.name,
							onChange: (e) => setBots((s) => s.map((x) => x.id === b.id ? {
								...x,
								name: e.target.value
							} : x)),
							className: inputCls$11
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "توکن ربات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							type: "password",
							value: b.bot_token,
							placeholder: "123456:ABC-...",
							onChange: (e) => setBots((s) => s.map((x) => x.id === b.id ? {
								...x,
								bot_token: e.target.value
							} : x)),
							className: inputCls$11
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "کانال/گروه‌های پیش‌فرض"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: b.default_chat_ids ?? "",
							placeholder: "@mychannel, -1001234567890",
							onChange: (e) => setBots((s) => s.map((x) => x.id === b.id ? {
								...x,
								default_chat_ids: e.target.value
							} : x)),
							className: inputCls$11
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-1 flex items-center gap-1 text-[11px] font-bold text-slate-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: b.is_active,
							onChange: (e) => setBots((s) => s.map((x) => x.id === b.id ? {
								...x,
								is_active: e.target.checked
							} : x))
						}), " فعال"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-1 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void removeBot(b.id),
							className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
							"aria-label": "حذف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-12 flex flex-wrap gap-2 pt-1 border-t border-slate-100 mt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void saveBot(b),
								disabled: busy,
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void hook(b),
								disabled: busy,
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-4 h-4" }), " اتصال وب‌هوک"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void info(b),
								disabled: busy,
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4" }), " وضعیت ربات"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
								dir: "ltr",
								className: "text-[10px] text-slate-500 self-center break-all",
								children: [
									origin,
									"/api/public/telegram/webhook/",
									b.id
								]
							})
						]
					})
				]
			}, b.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-extrabold text-[#0b1e3f] mb-3",
			children: "اتوماسیون‌ها (ارسال زنجیره‌ای)"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 mb-8",
			children: [flows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${cardCls$5} text-xs text-slate-500`,
				children: "هنوز اتوماسیونی ساخته نشده است."
			}), flows.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cardCls$5,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-12 gap-3 items-end mb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "نام اتوماسیون"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.name,
									onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
										...x,
										name: e.target.value
									} : x)),
									className: inputCls$11
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "ربات"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: f.bot_id ?? "",
									onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
										...x,
										bot_id: e.target.value
									} : x)),
									className: inputCls$11,
									children: bots.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: b.id,
										children: b.name
									}, b.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "نوع اجرا"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: f.trigger_type,
									onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
										...x,
										trigger_type: e.target.value
									} : x)),
									className: inputCls$11,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "manual",
										children: "دستی"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "keyword",
										children: "با کلیدواژه در چت"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-bold text-slate-600 mb-1",
									children: "کلیدواژه"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.trigger_keyword ?? "",
									onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
										...x,
										trigger_keyword: e.target.value
									} : x)),
									className: inputCls$11
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-1 flex items-center gap-1 text-[11px] font-bold text-slate-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: f.is_active,
									onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
										...x,
										is_active: e.target.checked
									} : x))
								}), " فعال"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-1 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (!confirm("این اتوماسیون حذف شود؟")) return;
										await adminDb("telegram_flows").delete().eq("id", f.id);
										load();
									},
									className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
									"aria-label": "حذف",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: (f.steps ?? []).map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-12 gap-2 items-end bg-slate-50 rounded-xl p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "md:col-span-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block font-bold text-slate-600 mb-1",
										children: ["گام ", i + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: st.type,
										onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
											...x,
											steps: x.steps.map((y, j) => j === i ? {
												...y,
												type: e.target.value
											} : y)
										} : x)),
										className: inputCls$11,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "sendMessage",
												children: "ارسال پیام"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "sendPhoto",
												children: "ارسال تصویر"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "delay",
												children: "مکث"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "forward",
												children: "فوروارد پیام"
											})
										]
									})]
								}),
								st.type === "delay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "md:col-span-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-bold text-slate-600 mb-1",
										children: "ثانیه"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 1,
										max: 20,
										value: st.seconds ?? 2,
										onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
											...x,
											steps: x.steps.map((y, j) => j === i ? {
												...y,
												seconds: Number(e.target.value)
											} : y)
										} : x)),
										className: inputCls$11
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "md:col-span-5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-bold text-slate-600 mb-1",
											children: st.type === "sendPhoto" ? "متن زیر تصویر" : "متن پیام"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: st.text ?? "",
											onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
												...x,
												steps: x.steps.map((y, j) => j === i ? {
													...y,
													text: e.target.value
												} : y)
											} : x)),
											className: inputCls$11
										})]
									}),
									st.type === "sendPhoto" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "md:col-span-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-bold text-slate-600 mb-1",
											children: "آدرس تصویر"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											dir: "ltr",
											value: st.photoUrl ?? "",
											onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
												...x,
												steps: x.steps.map((y, j) => j === i ? {
													...y,
													photoUrl: e.target.value
												} : y)
											} : x)),
											className: inputCls$11
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "md:col-span-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-bold text-slate-600 mb-1",
											children: "مقصد (خالی = پیش‌فرض ربات)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											dir: "ltr",
											value: st.chatIds ?? "",
											onChange: (e) => setFlows((s) => s.map((x) => x.id === f.id ? {
												...x,
												steps: x.steps.map((y, j) => j === i ? {
													...y,
													chatIds: e.target.value
												} : y)
											} : x)),
											className: inputCls$11
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-1 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setFlows((s) => s.map((x) => x.id === f.id ? {
											...x,
											steps: x.steps.filter((_, j) => j !== i)
										} : x)),
										className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
										"aria-label": "حذف گام",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})
								})
							]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFlows((s) => s.map((x) => x.id === f.id ? {
									...x,
									steps: [...x.steps ?? [], {
										type: "sendMessage",
										text: ""
									}]
								} : x)),
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن گام"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void saveFlow(f),
								disabled: busy,
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void runFlow(f.id),
								disabled: busy,
								className: "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4" }), " اجرای فوری"]
							})
						]
					})
				]
			}, f.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-extrabold text-[#0b1e3f] mb-3",
			children: "تاریخچه اجرا"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `${cardCls$5} overflow-x-auto`,
			children: runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500",
				children: "هنوز اجرایی ثبت نشده است."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-slate-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2",
							children: "اتوماسیون"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2",
							children: "وضعیت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2",
							children: "پیام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right py-2",
							children: "زمان"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-slate-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2",
							children: flows.find((f) => f.id === r.flow_id)?.name ?? botName(null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `py-2 font-bold ${r.status === "ok" ? "text-emerald-600" : "text-rose-600"}`,
							children: r.status === "ok" ? "موفق" : "خطا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 text-slate-600",
							children: r.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 text-slate-500",
							children: new Date(r.created_at).toLocaleString("fa-IR")
						})
					]
				}, r.id)) })]
			})
		})
	] });
}
var LOGIN_MODES_ORDER = [
	"required",
	"optional",
	"none"
];
var TABS = [
	{
		key: "requirements",
		label: "مدیریت لاگین‌ها"
	},
	{
		key: "telegram",
		label: "لاگین تلگرام"
	},
	{
		key: "users",
		label: "کاربران لاگین شده"
	},
	{
		key: "logs",
		label: "گزارش ورودها"
	},
	{
		key: "bot",
		label: "ربات بیمه سامان"
	}
];
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl shadow-sm p-4 md:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-extrabold text-sm text-[#0b1e3f] mb-3",
			children: title
		}), children]
	});
}
function LoginsPane({ initialTab = "requirements" }) {
	const [tab, setTab] = (0, import_react.useState)(initialTab);
	(0, import_react.useEffect)(() => setTab(initialTab), [initialTab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t.key),
					className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === t.key ? "bg-[#0b1e3f] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`,
					children: t.label
				}, t.key))
			}),
			tab === "requirements" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementsTab, {}),
			tab === "telegram" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramLoginTab, {}),
			tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersTab, {}),
			tab === "logs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogsTab, {}),
			tab === "bot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotTab, {})
		]
	});
}
function RequirementsTab() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const load = async () => {
		const stored = (await adminDb("login_requirements").select("*")).data ?? [];
		const byKey = new Map(stored.map((r) => [r.module_key, r]));
		setRows(LOGIN_MODULES.map((m) => ({
			module_key: m.key,
			label: m.label,
			mode: byKey.get(m.key)?.mode ?? "none",
			methods: byKey.get(m.key)?.methods ?? ["telegram"]
		})));
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const save = async (row) => {
		setBusy(true);
		const res = await adminDb("login_requirements").upsert({
			module_key: row.module_key,
			label: row.label,
			mode: row.mode,
			methods: row.methods,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "module_key" });
		setBusy(false);
		if (res.error) notifyFailed("تنظیمات ورود", res.error.message);
		else notifySaved("تنظیمات ورود");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "ورود لازم برای هر بخش سایت",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-slate-500 leading-6 mb-3",
			children: "برای هر ماژول مشخص کنید ورود اجباری، اختیاری یا بدون نیاز به ورود باشد و کدام روش‌های ورود مجاز باشند. این تنظیم علاوه بر ظاهر سایت، در سمت سرور هم اعمال می‌شود."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-slate-100 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-[#0b1e3f]",
						children: row.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: row.mode,
							onChange: (e) => {
								const mode = e.target.value;
								setRows((prev) => prev.map((r, j) => i === j ? {
									...r,
									mode
								} : r));
							},
							className: "rounded-lg border border-slate-200 text-xs px-2 py-1.5",
							children: LOGIN_MODES_ORDER.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m,
								children: LOGIN_MODE_LABELS[m]
							}, m))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy,
							onClick: () => void save(rows[i]),
							className: "rounded-lg bg-[#0b1e3f] text-white text-xs font-bold px-3 py-1.5 disabled:opacity-40",
							children: "ذخیره"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-3",
					children: LOGIN_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5 text-[11px] text-slate-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								disabled: !p.available,
								checked: row.methods.includes(p.id),
								onChange: (e) => setRows((prev) => prev.map((r, j) => i === j ? {
									...r,
									methods: e.target.checked ? [.../* @__PURE__ */ new Set([...r.methods, p.id])] : r.methods.filter((m) => m !== p.id)
								} : r))
							}),
							p.label,
							!p.available && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-300",
								children: "(به‌زودی)"
							})
						]
					}, p.id))
				})]
			}, row.module_key))
		})]
	});
}
function TelegramLoginTab() {
	const origin = typeof window !== "undefined" ? window.location.origin : "https://saman8452.ir";
	const callback = `https://saman8452.ir${TELEGRAM_CALLBACK_PATH}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "مسیرهای ورود با تلگرام",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$3, {
						label: "Redirect URI (در تلگرام ثبت شود)",
						value: callback
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$3, {
						label: "Redirect URI این دامنه",
						value: `${origin}${TELEGRAM_CALLBACK_PATH}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$3, {
						label: "شروع ورود",
						value: `${origin}/api/public/auth/telegram/start`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$3, {
						label: "صفحه ورود کاربران",
						value: `${origin}/login`
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "کلیدهای مورد نیاز (فقط در Secrets سرور)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "text-xs text-slate-600 leading-7 list-disc pr-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "TELEGRAM_CLIENT_ID — شناسه کلاینت تلگرام" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "TELEGRAM_CLIENT_SECRET — کلید محرمانه تلگرام (هرگز در سایت نمایش داده نمی‌شود)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "TELEGRAM_LOGIN_BOT_TOKEN — توکن ربات برای اعتبارسنجی ویجت ورود" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SESSION_SECRET — کلید رمزنگاری نشست کاربران (حداقل ۳۲ کاراکتر)" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-400 mt-2",
				children: "مقدار این کلیدها هیچ‌گاه در پیشخوان یا مرورگر خوانده نمی‌شود؛ فقط در سرور استفاده می‌شوند."
			})]
		})]
	});
}
function Row$3({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 justify-between rounded-lg bg-slate-50 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-slate-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "font-mono text-[11px] text-[#0b1e3f] break-all",
			children: value
		})]
	});
}
function UsersTab() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const load = async () => {
		const res = await adminDb("telegram_users").select("*").order("last_login", { ascending: false }).limit(200);
		setRows(res.data ?? []);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const toggle = async (row) => {
		await adminDb("telegram_users").update({ is_active: !row.is_active }).eq("telegram_id", row.telegram_id);
		await load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: `کاربران واردشده با تلگرام (${rows.length})`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-slate-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "نام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "یوزرنیم"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "Telegram ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "شماره"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "آخرین ورود"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "وضعیت"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-slate-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: [r.first_name, r.last_name].filter(Boolean).join(" ") || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: r.telegram_username ? `@${r.telegram_username}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-mono",
							children: r.telegram_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: r.phone_number ?? "ثبت نشده"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: r.last_login ? new Date(r.last_login).toLocaleString("fa-IR") : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void toggle(r),
								className: `rounded-lg px-2 py-1 font-bold ${r.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`,
								children: r.is_active ? "فعال" : "غیرفعال"
							})
						})
					]
				}, r.telegram_id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-6 text-center text-slate-400",
					children: "هنوز کاربری وارد نشده است."
				}) })] })]
			})
		})
	});
}
function LogsTab() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminDb("login_logs").select("*").order("created_at", { ascending: false }).limit(300).then((res) => setRows(res.data ?? []));
	}, []);
	const shown = (0, import_react.useMemo)(() => rows.filter((r) => filter ? [
		r.login_method,
		r.module,
		r.status,
		String(r.telegram_id ?? "")
	].join(" ").includes(filter) : true), [rows, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "گزارش ورودها",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: filter,
			onChange: (e) => setFilter(e.target.value),
			placeholder: "جستجو بر اساس روش، ماژول یا وضعیت…",
			className: "mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-slate-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "زمان"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "روش"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "ماژول"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "Telegram ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "وضعیت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-right",
							children: "IP"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [shown.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-slate-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: new Date(r.created_at).toLocaleString("fa-IR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: r.login_method ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: r.module ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-mono",
							children: r.telegram_id ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded px-2 py-0.5 ${r.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`,
								children: r.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-mono",
							children: r.ip ?? "—"
						})
					]
				}, r.id)), shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-6 text-center text-slate-400",
					children: "رکوردی ثبت نشده است."
				}) })] })]
			})
		})]
	});
}
var LOGIN_BOT_SETTING_KEY = "login_bot_config";
var DEFAULT_BOT = {
	enabled: false,
	botUsername: "SamInsuranceBot",
	botTitle: "بیمه سامان لاهیجان",
	aiEnabled: false,
	aiProvider: "lovable",
	aiModel: "google/gemini-2.5-flash",
	systemPrompt: "تو دستیار هوشمند نمایندگی بیمه سامان لاهیجان هستی. فقط درباره خدمات بیمه پاسخ بده."
};
function BotTab() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_BOT);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		adminReadSetting(LOGIN_BOT_SETTING_KEY, DEFAULT_BOT).then((v) => {
			setCfg(v);
			setLoaded(true);
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "ربات بیمه سامان",
			children: !loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-slate-400",
				children: "در حال بارگذاری…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cfg.enabled,
							onChange: (e) => setCfg({
								...cfg,
								enabled: e.target.checked
							})
						}), "ربات فعال باشد"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "نام ربات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.botTitle,
							onChange: (e) => setCfg({
								...cfg,
								botTitle: e.target.value
							}),
							className: "w-full rounded-lg border border-slate-200 px-2 py-1.5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "یوزرنیم ربات",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.botUsername,
							onChange: (e) => setCfg({
								...cfg,
								botUsername: e.target.value.replace(/^@/, "")
							}),
							className: "w-full rounded-lg border border-slate-200 px-2 py-1.5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cfg.aiEnabled,
							onChange: (e) => setCfg({
								...cfg,
								aiEnabled: e.target.checked
							})
						}), "پاسخ‌گویی هوش مصنوعی در ربات فعال باشد"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "ارائه‌دهنده هوش مصنوعی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.aiProvider,
							onChange: (e) => setCfg({
								...cfg,
								aiProvider: e.target.value
							}),
							className: "w-full rounded-lg border border-slate-200 px-2 py-1.5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "مدل",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.aiModel,
							onChange: (e) => setCfg({
								...cfg,
								aiModel: e.target.value
							}),
							className: "w-full rounded-lg border border-slate-200 px-2 py-1.5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "دستور سیستمی",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: cfg.systemPrompt,
							onChange: (e) => setCfg({
								...cfg,
								systemPrompt: e.target.value
							}),
							rows: 4,
							className: "w-full rounded-lg border border-slate-200 px-2 py-1.5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void adminWriteSetting(LOGIN_BOT_SETTING_KEY, cfg),
						className: "rounded-lg bg-[#0b1e3f] text-white font-bold px-4 py-2",
						children: "ذخیره تنظیمات ربات"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "اتصال ربات به هوش مصنوعی",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$3, {
					label: "آدرس Webhook ربات",
					value: `https://saman8452.ir/api/public/telegram/bot-ai`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-slate-500 leading-6",
					children: "توکن ربات فقط از Secrets سرور (TELEGRAM_LOGIN_BOT_TOKEN) خوانده می‌شود و هرگز در پیشخوان یا مرورگر نمایش داده نمی‌شود. اطلاعات مدیریتی سایت از طریق ربات در دسترس کاربران نیست."
				})]
			})
		})]
	});
}
function Field$1({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] font-bold text-slate-600 mb-1",
		children: label
	}), children] });
}
var inputCls$10 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls$4 = "bg-white rounded-2xl border border-slate-200 p-5";
async function uploadFile$2(file, folder) {
	const fd = new FormData();
	fd.append("file", file);
	fd.append("folder", folder);
	const res = await fetch("/api/admin/upload", {
		method: "POST",
		body: fd
	});
	if (!res.ok) throw new Error(await res.text());
	return (await res.json()).url;
}
function LogoField({ label, value, fallback, height, onChange }) {
	const ref = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const src = value || fallback || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid md:grid-cols-12 gap-3 items-end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2 flex items-center justify-center bg-slate-50 rounded-xl p-2 min-h-16",
				children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: label,
					style: { height },
					className: "object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-6 h-6 text-slate-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "md:col-span-7 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-bold text-slate-600 mb-1",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					value,
					placeholder: "/api/public/asset/... یا https://...",
					onChange: (e) => onChange(e.target.value),
					className: inputCls$10
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-3 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: async (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							setBusy(true);
							try {
								onChange(await uploadFile$2(f, "branding"));
							} catch (err) {
								alert(`آپلود ناموفق: ${err instanceof Error ? err.message : String(err)}`);
							}
							setBusy(false);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => ref.current?.click(),
						disabled: busy,
						className: "flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white disabled:opacity-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }),
							" ",
							busy ? "..." : "آپلود"
						]
					}),
					value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onChange(""),
						className: "text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
						children: "حذف"
					})
				]
			})
		]
	});
}
function SplashSection() {
	const [s, setS] = (0, import_react.useState)(DEFAULT_SPLASH);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminReadSetting("splash", DEFAULT_SPLASH).then(setS);
	}, []);
	async function save() {
		const res = await adminWriteSetting("splash", s);
		setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "صفحه بارگذاری ذخیره شد ✓");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${cardCls$4} mt-6`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f]",
					children: "صفحه بارگذاری سایت (لوگو پیش از ورود)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void save(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
				})]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-8",
				style: { background: s.bgColor },
				children: [
					s.logoCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { dangerouslySetInnerHTML: { __html: s.logoCode } }) : s.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.logoUrl,
						alt: "splash",
						style: { height: s.logoHeight },
						className: "object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-8 h-8 text-slate-400" }),
					s.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-xs font-bold",
						style: { color: s.textColor },
						children: s.text
					}),
					s.showBar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-1 w-28 rounded-full overflow-hidden",
						style: { background: `${s.barColor}22` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-1/3 rounded-full",
							style: { background: s.barColor }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "لوگوی صفحه بارگذاری",
					value: s.logoUrl,
					fallback: DEFAULT_SPLASH.logoUrl,
					height: 40,
					onChange: (logoUrl) => setS({
						...s,
						logoUrl
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs block mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-bold text-slate-600 mb-1",
					children: "جاسازی کد (SVG/HTML) به‌جای آپلود لوگو — در صورت پر بودن، جایگزین تصویر می‌شود"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					dir: "ltr",
					rows: 3,
					value: s.logoCode,
					onChange: (e) => setS({
						...s,
						logoCode: e.target.value
					}),
					className: `${inputCls$10} font-mono`,
					placeholder: "<svg ...>...</svg>"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "رنگ پس‌زمینه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: s.bgColor,
								onChange: (e) => setS({
									...s,
									bgColor: e.target.value
								}),
								className: "h-9 w-12 rounded-lg border border-slate-300"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: s.bgColor,
								onChange: (e) => setS({
									...s,
									bgColor: e.target.value
								}),
								className: inputCls$10
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "رنگ نوار بارگذاری"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: s.barColor,
								onChange: (e) => setS({
									...s,
									barColor: e.target.value
								}),
								className: "h-9 w-12 rounded-lg border border-slate-300"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: s.barColor,
								onChange: (e) => setS({
									...s,
									barColor: e.target.value
								}),
								className: inputCls$10
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "رنگ متن"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: s.textColor,
								onChange: (e) => setS({
									...s,
									textColor: e.target.value
								}),
								className: "h-9 w-12 rounded-lg border border-slate-300"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: s.textColor,
								onChange: (e) => setS({
									...s,
									textColor: e.target.value
								}),
								className: inputCls$10
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "ارتفاع لوگو (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: s.logoHeight,
							onChange: (e) => setS({
								...s,
								logoHeight: Number(e.target.value)
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "مدت نمایش (میلی‌ثانیه)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: s.minMs,
							onChange: (e) => setS({
								...s,
								minMs: Number(e.target.value)
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "متن زیر لوگو (اختیاری)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: s.text,
							onChange: (e) => setS({
								...s,
								text: e.target.value
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.enabled,
							onChange: (e) => setS({
								...s,
								enabled: e.target.checked
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-600",
							children: "فعال بودن صفحه بارگذاری"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.showBar,
							onChange: (e) => setS({
								...s,
								showBar: e.target.checked
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-600",
							children: "نمایش نوار بارگذاری"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.oncePerSession,
							onChange: (e) => setS({
								...s,
								oncePerSession: e.target.checked
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-600",
							children: "فقط یک‌بار در هر بازدید"
						})]
					})
				]
			})
		]
	});
}
function WidgetsSection() {
	const [w, setW] = (0, import_react.useState)(DEFAULT_WIDGETS);
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		adminReadSetting("widgets", DEFAULT_WIDGETS).then(setW);
	}, []);
	async function save() {
		const res = await adminWriteSetting("widgets", w);
		setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "پنجره‌های شناور ذخیره شد ✓");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${cardCls$4} mt-6`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-extrabold text-[#0b1e3f]",
					children: "پنجره‌های شناور (چت آنلاین و هوش مصنوعی)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void save(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
				})]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "آیکن دایره‌ای چت آنلاین (سمت راست)",
					value: w.chatIconUrl,
					height: 40,
					onChange: (chatIconUrl) => setW({
						...w,
						chatIconUrl
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "آیکن دایره‌ای دستیار هوش مصنوعی (سمت چپ)",
					value: w.aiIconUrl,
					height: 40,
					onChange: (aiIconUrl) => setW({
						...w,
						aiIconUrl
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عرض پنجره (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: w.widthPx,
							onChange: (e) => setW({
								...w,
								widthPx: Number(e.target.value)
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "ارتفاع پنجره (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: w.heightPx,
							onChange: (e) => setW({
								...w,
								heightPx: Number(e.target.value)
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "اندازه آیکن دایره‌ای (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: w.launcherSizePx,
							onChange: (e) => setW({
								...w,
								launcherSizePx: Number(e.target.value)
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان دکمه چت آنلاین"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: w.chatLauncherLabel,
							onChange: (e) => setW({
								...w,
								chatLauncherLabel: e.target.value
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان دکمه هوش مصنوعی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: w.aiLauncherLabel,
							onChange: (e) => setW({
								...w,
								aiLauncherLabel: e.target.value
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان بخش شبکه‌های اجتماعی در چت"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: w.socialTitle,
							onChange: (e) => setW({
								...w,
								socialTitle: e.target.value
							}),
							className: inputCls$10
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-2 md:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: w.showSocialInChat,
							onChange: (e) => setW({
								...w,
								showSocialInChat: e.target.checked
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-600",
							children: "نمایش دکمه‌های شبکه‌های اجتماعی داخل پنجره چت آنلاین"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] text-slate-500 leading-6",
				children: "آیکن‌ها و فهرست شبکه‌های اجتماعی از منوی «شبکه‌های اجتماعی» پیشخوان قابل افزودن، ویرایش و حذف است."
			})
		]
	});
}
function BrandingPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_BRANDING);
	const [msg, setMsg] = (0, import_react.useState)("");
	async function load() {
		setCfg(await adminReadSetting("branding", DEFAULT_BRANDING));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function save() {
		const res = await adminWriteSetting("branding", cfg);
		setMsg(res.error ? `ذخیره نشد: ${res.error.message}` : "ذخیره شد ✓ — روی سایت اعمال شد.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-6 h-6" }), " لوگو، آیکن‌ها و عنوان سایت"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "لوگوی هدر و فوتر، آیکن نوار مرورگر (favicon) و عنوان/توضیح سایت را آپلود و ویرایش کنید."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void load(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), " بازخوانی"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void save(),
					className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
				})]
			})]
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
			children: msg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `${cardCls$4} space-y-5 mb-6`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "لوگوی هدر",
					value: cfg.headerLogoUrl,
					fallback: SITE_LOGO_HEADER,
					height: cfg.logoHeightHeader,
					onChange: (headerLogoUrl) => setCfg({
						...cfg,
						headerLogoUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "لوگوی فوتر",
					value: cfg.footerLogoUrl,
					fallback: SITE_LOGO,
					height: cfg.logoHeightFooter,
					onChange: (footerLogoUrl) => setCfg({
						...cfg,
						footerLogoUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "آیکن نوار مرورگر (favicon)",
					value: cfg.faviconUrl,
					fallback: "/favicon.png",
					height: 24,
					onChange: (faviconUrl) => setCfg({
						...cfg,
						faviconUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoField, {
					label: "لوگوی پیشخوان مدیریت",
					value: cfg.dashboardLogoUrl,
					fallback: DASHBOARD_LOGO,
					height: cfg.logoHeightDashboard,
					onChange: (dashboardLogoUrl) => setCfg({
						...cfg,
						dashboardLogoUrl
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `${cardCls$4} grid md:grid-cols-2 gap-4`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "عنوان سایت (تایتل مرورگر و نتایج جستجو)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cfg.siteTitle,
						onChange: (e) => setCfg({
							...cfg,
							siteTitle: e.target.value
						}),
						className: inputCls$10
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "توضیح کوتاه سایت"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: cfg.siteDescription,
						onChange: (e) => setCfg({
							...cfg,
							siteDescription: e.target.value
						}),
						className: inputCls$10
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "ارتفاع لوگوی هدر (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: cfg.logoHeightHeader,
						onChange: (e) => setCfg({
							...cfg,
							logoHeightHeader: Number(e.target.value)
						}),
						className: inputCls$10
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "ارتفاع لوگوی فوتر (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: cfg.logoHeightFooter,
						onChange: (e) => setCfg({
							...cfg,
							logoHeightFooter: Number(e.target.value)
						}),
						className: inputCls$10
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-bold text-slate-600 mb-1",
						children: "ارتفاع لوگوی پیشخوان (px)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: cfg.logoHeightDashboard,
						onChange: (e) => setCfg({
							...cfg,
							logoHeightDashboard: Number(e.target.value)
						}),
						className: inputCls$10
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetsSection, {})
	] });
}
/** همه مسیرهای سایت که از منوی اصلی استخراج می‌شوند (برای ویرایشگر بصری و ایرادیاب). */
function collect(items, out = [], prefix = "") {
	for (const item of items) {
		if (item.href && !out.some((p) => p.path === item.href)) out.push({
			path: item.href,
			label: prefix ? `${prefix} › ${item.label}` : item.label
		});
		if (item.children) collect(item.children, out, item.label);
	}
	return out;
}
var EXTRA = [
	{
		path: "/",
		label: "صفحه اصلی"
	},
	{
		path: "/insurance/fire",
		label: "بیمه آتش‌سوزی"
	},
	{
		path: "/insurance/car",
		label: "بیمه اتومبیل"
	},
	{
		path: "/insurance/cargo",
		label: "بیمه باربری"
	},
	{
		path: "/insurance/e-e",
		label: "بیمه تجهیزات الکترونیک"
	},
	{
		path: "/insurance/health",
		label: "بیمه درمان"
	},
	{
		path: "/insurance/life",
		label: "بیمه زندگی"
	},
	{
		path: "/insurance/liability",
		label: "بیمه مسئولیت"
	},
	{
		path: "/insurance/engineering",
		label: "بیمه مهندسی"
	},
	{
		path: "/insurance/marine-aviation",
		label: "بیمه کشتی و هواپیما"
	},
	{
		path: "/insurance/travel",
		label: "بیمه مسافرتی"
	},
	{
		path: "/insurance/special",
		label: "بیمه‌های خاص"
	}
];
/** Static pages that are not part of the main menu. */
var STATIC_PAGES = [
	{
		path: "/branches",
		label: "مراکز درمانی طرف قرارداد"
	},
	{
		path: "/blog",
		label: "وبلاگ"
	},
	{
		path: "/reporting",
		label: "گزارش خسارت"
	},
	{
		path: "/contact",
		label: "ارتباط با ما"
	},
	{
		path: "/insurance",
		label: "انواع بیمه‌ها"
	},
	{
		path: "/e-services",
		label: "خدمات الکترونیک"
	}
];
/** Pages offered in the visual editor and the code inspector toolbars. */
var EDITOR_PAGES = (() => {
	const list = [];
	const push = (p) => {
		if (!list.some((x) => x.path === p.path)) list.push(p);
	};
	for (const p of EXTRA) push(p);
	for (const p of STATIC_PAGES) push(p);
	for (const p of collect(navItems)) push(p);
	for (const [path, c] of Object.entries(hubContent)) push({
		path,
		label: c.title ?? path
	});
	for (const [path, c] of Object.entries(insuranceContent)) push({
		path,
		label: c.title ?? path
	});
	return list;
})();
/**
* Exposes custom (page-builder) pages as editor page entries, so they appear
* in the Visual Editor and Inspector page dropdowns alongside built-in pages.
*/
function useCustomPageEntries() {
	const fetchList = useServerFn(listCustomPages);
	const { data } = useQuery({
		queryKey: ["custom-pages-list"],
		queryFn: () => fetchList(),
		staleTime: 3e4
	});
	return (data ?? []).map((p) => ({
		path: `/p/${p.slug}`,
		label: `صفحه‌ساز: ${p.title || p.slug}`
	}));
}
var inputCls$9 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls$3 = "bg-white rounded-2xl border border-slate-200 p-5";
var btnCls = "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs flex items-center gap-1.5";
function toText(r) {
	return [
		"### گزارش ایرادیاب سایت",
		`صفحه: ${r.url}`,
		`المنت: <${r.tag}>  |  انتخابگر: ${r.selector}`,
		r.id ? `id: ${r.id}` : "",
		r.classes ? `class: ${r.classes}` : "",
		r.href ? `لینک: ${r.href}` : "",
		r.source ? `منبع کد: ${r.source}` : "",
		`ابعاد: ${r.box}  |  ویوپورت: ${r.viewport}`,
		r.text ? `متن: ${r.text}` : "",
		"",
		"استایل‌ها:",
		...Object.entries(r.styles).map(([k, v]) => `  ${k}: ${v}`),
		"",
		"HTML:",
		r.html,
		"",
		r.errors.length ? "خطاهای ثبت‌شده:" : "خطای جاوااسکریپتی ثبت نشد.",
		...r.errors,
		"",
		`User-Agent: ${r.userAgent}`
	].filter(Boolean).join("\n");
}
function InspectorPane({ initialPage = "/" }) {
	const [page, setPage] = (0, import_react.useState)(initialPage);
	const customEntries = useCustomPageEntries();
	const allPages = (0, import_react.useMemo)(() => {
		const next = [...EDITOR_PAGES];
		for (const c of customEntries) if (!next.some((x) => x.path === c.path)) next.push(c);
		return next;
	}, [customEntries]);
	const [customPath, setCustomPath] = (0, import_react.useState)("");
	const [currentPath, setCurrentPath] = (0, import_react.useState)("/");
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [mode, setMode] = (0, import_react.useState)("select");
	const [wide, setWide] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [savedOk, setSavedOk] = (0, import_react.useState)(false);
	const [published, setPublished] = (0, import_react.useState)(false);
	const [editHtml, setEditHtml] = (0, import_react.useState)("");
	const [editText, setEditText] = (0, import_react.useState)("");
	const [editHref, setEditHref] = (0, import_react.useState)("");
	const frame = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onMsg = (e) => {
			const d = e.data;
			if (d?.type === "ve:inspect" && d.payload) {
				setReport(d.payload);
				setEditHtml(d.payload.inner ?? "");
				setEditText(d.payload.text ?? "");
				setEditHref(d.payload.href ?? "");
				setCopied(false);
				setSavedOk(false);
			}
			if (d?.type === "ve:map" && d.map) (async () => {
				if (!(await adminWriteSetting("visual_overrides", { map: d.map })).ok) return;
				setPublished(true);
				window.setTimeout(() => setPublished(false), 2e3);
			})();
			if ((d?.type === "ve:ready" || d?.type === "ve:navigate" || d?.type === "ve:inspect-ready") && d.path) setCurrentPath(d.path.replace(/[?&]ve=1/, "").replace(/[?&]inspect=1/, "").replace(/\?$/, "") || "/");
			if (d?.type === "ve:ready" || d?.type === "ve:inspect-ready") frame.current?.contentWindow?.postMessage({
				type: "ve:mode",
				mode: modeRef.current
			}, "*");
		};
		window.addEventListener("message", onMsg);
		return () => window.removeEventListener("message", onMsg);
	}, []);
	const modeRef = (0, import_react.useRef)("select");
	(0, import_react.useEffect)(() => {
		modeRef.current = mode;
		frame.current?.contentWindow?.postMessage({
			type: "ve:mode",
			mode
		}, "*");
	}, [mode]);
	const srcFor = (p) => `${p}${p.includes("?") ? "&" : "?"}ve=1&inspect=1&veDevice=${device}`;
	async function copy() {
		if (!report) return;
		await navigator.clipboard.writeText(toText(report));
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2e3);
	}
	/** Apply the corrected markup/text/link to the live site (saved online). */
	function applyFix() {
		if (!report) return;
		const patch = {};
		if (editHtml && editHtml !== (report.inner ?? "")) patch.html = editHtml;
		else if (editText && editText !== report.text) patch.text = editText;
		if (editHref !== (report.href ?? "")) patch.href = editHref;
		frame.current?.contentWindow?.postMessage({
			type: "ve:update",
			selector: report.selector,
			patch
		}, "*");
		setSavedOk(true);
		window.setTimeout(() => setSavedOk(false), 2500);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "w-6 h-6" }), " موس ایرادیاب و کدیاب"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1 leading-6",
				children: "روی هر بخش از سایت کلیک کنید تا کد، استایل و خطاهای احتمالی همان بخش استخراج شود؛ سپس می‌توانید همان‌جا کد را اصلاح و به‌صورت آنلاین روی سایت جایگزین کنید."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: page,
					onChange: (e) => {
						setPage(e.target.value);
						setReport(null);
					},
					className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm",
					children: allPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.path,
						children: p.label
					}, p.path))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-xl overflow-hidden border border-slate-300 bg-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setDevice("desktop");
								setReport(null);
							},
							className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "desktop" ? "bg-[#0b1e3f] text-white" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-3.5 h-3.5" }), " دسکتاپ"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setDevice("tablet");
								setReport(null);
							},
							className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "tablet" ? "bg-[#0b1e3f] text-white" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "w-3.5 h-3.5" }), " تبلت"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setDevice("mobile");
								setReport(null);
							},
							className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "mobile" ? "bg-[#0b1e3f] text-white" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), " موبایل"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-xl overflow-hidden border border-slate-300 bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("select"),
						className: `px-3 py-2 text-xs font-bold ${mode === "select" ? "bg-[#0b1e3f] text-white" : ""}`,
						children: "حالت انتخاب"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("interact"),
						className: `px-3 py-2 text-xs font-bold ${mode === "interact" ? "bg-[#0b1e3f] text-white" : ""}`,
						children: "حالت تعامل"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (frame.current) frame.current.src = `${srcFor(page)}&t=${Date.now()}`;
					},
					className: btnCls,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " بازخوانی"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setWide((w) => !w),
					className: btnCls,
					children: wide ? "نمای معمولی" : "نمای بزرگ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						const p = customPath.trim();
						if (!p) return;
						const path = p.startsWith("/") ? p : `/${p}`;
						setPage(path);
						setReport(null);
						if (frame.current) frame.current.src = `${srcFor(path)}&t=${Date.now()}`;
					},
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: customPath,
						onChange: (e) => setCustomPath(e.target.value),
						dir: "ltr",
						placeholder: "/insurance/car/body",
						className: `${inputCls$9} w-56`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: btnCls,
						children: "باز کن"
					})]
				}),
				published && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-emerald-600 font-bold px-2",
					children: "روی سایت منتشر شد ✓"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-slate-500 font-mono px-2",
					dir: "ltr",
					children: currentPath
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-slate-500 mb-3 leading-6",
			children: "در «حالت تعامل» سایت کاملاً واقعی کار می‌کند و می‌توانید وارد زیرصفحه‌ها، لینک‌های بک‌لینک و دکمه‌ها شوید؛ برای گرفتن کد یک عنصر در این حالت، در کامپیوتر Alt را نگه دارید و کلیک کنید و در موبایل انگشت را روی عنصر نگه دارید."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: wide || device === "desktop" ? "grid gap-5" : "grid lg:grid-cols-3 gap-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${cardCls$3} ${wide || device === "desktop" ? "" : "lg:col-span-2"} overflow-hidden`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto",
					style: {
						width: device === "mobile" ? 390 : device === "tablet" ? 834 : "100%",
						maxWidth: "100%"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						ref: frame,
						src: srcFor(page),
						title: "inspector",
						className: `w-full rounded-xl border border-slate-200 bg-white ${wide || device === "desktop" ? "h-[85vh]" : "h-[70vh]"}`
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cardCls$3,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f]",
						children: "گزارش انتخاب‌شده"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setReport(null),
							className: "text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), " پاک"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void copy(),
							disabled: !report,
							className: "text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white disabled:opacity-50 flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }),
								" ",
								copied ? "کپی شد ✓" : "کپی گزارش"
							]
						})]
					})]
				}), report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						readOnly: true,
						dir: "ltr",
						value: toText(report),
						className: "w-full h-[26vh] text-[11px] font-mono rounded-xl border border-slate-200 p-3 bg-slate-50"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-slate-200 p-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-extrabold text-[#0b1e3f]",
								children: "اصلاح و جایگزینی آنلاین"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] text-slate-500",
								children: "کد داخلی (HTML/SVG)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 5,
								dir: "ltr",
								value: editHtml,
								onChange: (e) => setEditHtml(e.target.value),
								className: "w-full text-[11px] font-mono rounded-lg border border-slate-300 p-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] text-slate-500",
								children: "متن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: editText,
								onChange: (e) => setEditText(e.target.value),
								className: "w-full text-xs rounded-lg border border-slate-300 p-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] text-slate-500",
								children: "لینک (href / بک‌لینک)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: editHref,
								onChange: (e) => setEditHref(e.target.value),
								className: inputCls$9
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: applyFix,
								className: "w-full mt-1 px-3 py-2 rounded-xl bg-[#0b1e3f] text-white text-xs font-bold flex items-center justify-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-3.5 h-3.5" }),
									" ",
									savedOk ? "اعمال شد ✓" : "جایگزینی و انتشار آنلاین"
								]
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 leading-6",
					children: "با موس (یا لمس در موبایل) روی هر عنصر داخل پیش‌نمایش کلیک کنید تا گزارش کامل آن اینجا ساخته شود؛ سپس می‌توانید کد را اصلاح و روی سایت جایگزین کنید یا با «کپی گزارش» برای توسعه‌دهنده بفرستید."
				})]
			})]
		})
	] });
}
/** Route ids that must never show up as an editable site page. */
function isEditableRouteId(id) {
	if (!id.startsWith("/")) return false;
	if (id.includes("$")) return false;
	if (id.includes("_")) return false;
	if (id.startsWith("/api")) return false;
	if (id === "/dashboard") return false;
	if (/\.(txt|xml)$/i.test(id)) return false;
	return true;
}
/**
* Every page of the site that the visual editor can open.
*
* Built from the router itself, so any page added later (a brand-new route
* file) automatically gets its «ویرایش بصری» button — no manual list to keep
* in sync. The curated labels in EDITOR_PAGES win when both know a path.
*/
function useSitePages() {
	const router = useRouter();
	return (0, import_react.useMemo)(() => {
		const list = [];
		const push = (p) => {
			if (!p.path) return;
			if (list.some((x) => x.path === p.path)) return;
			list.push(p);
		};
		for (const p of EDITOR_PAGES) push(p);
		const byId = router.routesById ?? {};
		for (const id of Object.keys(byId)) {
			if (!isEditableRouteId(id)) continue;
			const path = id === "/" ? "/" : id.replace(/\/$/, "");
			push({
				path,
				label: path
			});
		}
		return list;
	}, [router]);
}
var OVERLAY_SETTING_KEY = "visual_overlays";
var OVERLAY_TARGETS = [
	{
		key: "header",
		label: "هدر سایت",
		selector: "header"
	},
	{
		key: "header-logo",
		label: "لوگوی هدر",
		selector: "header img"
	},
	{
		key: "header-nav",
		label: "منوی اصلی هدر",
		selector: "header nav"
	},
	{
		key: "footer",
		label: "فوتر سایت",
		selector: "footer"
	},
	{
		key: "footer-social",
		label: "شبکه‌های اجتماعی فوتر",
		selector: "footer ul"
	},
	{
		key: "hero",
		label: "بخش نخست صفحه (Hero)",
		selector: "main section:first-of-type"
	},
	{
		key: "first-image",
		label: "نخستین تصویر صفحه",
		selector: "main img"
	},
	{
		key: "first-video",
		label: "نخستین ویدیو صفحه",
		selector: "video"
	},
	{
		key: "first-iframe",
		label: "نخستین iframe صفحه",
		selector: "iframe"
	},
	{
		key: "first-button",
		label: "نخستین دکمه صفحه",
		selector: "main button"
	},
	{
		key: "first-link",
		label: "نخستین لینک صفحه",
		selector: "main a"
	},
	{
		key: "first-heading",
		label: "نخستین تیتر صفحه",
		selector: "main h1, main h2"
	},
	{
		key: "first-form",
		label: "نخستین فرم صفحه",
		selector: "form"
	},
	{
		key: "main",
		label: "کل محتوای صفحه",
		selector: "main"
	},
	{
		key: "body",
		label: "تمام صفحه",
		selector: "body"
	}
];
/**
* Right-hand settings panel for overlay layers (visual editor).
* Sends patches to the editor iframe; the iframe owns the live list and
* reports it back (ve:ov-list) for publishing.
*/
var inputCls$8 = "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm";
var labelCls = "block text-[11px] font-bold text-slate-600 mb-1";
function Row$2({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: labelCls,
		children: label
	}), children] });
}
/** Native color input + eyedropper (where the browser supports it). */
function ColorField({ value, onChange }) {
	const pick = async () => {
		const EyeDropperCtor = window.EyeDropper;
		if (!EyeDropperCtor) return;
		try {
			onChange((await new EyeDropperCtor().open()).sRGBHex);
		} catch {}
	};
	const hex = /^#([0-9a-f]{6})$/i.test(value) ? value : "#0b1e3f";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value: hex,
				onChange: (e) => onChange(e.target.value),
				className: "w-9 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				dir: "ltr",
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder: "#0b1e3f یا rgba(...)",
				className: inputCls$8
			}),
			"EyeDropper" in window && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void pick(),
				title: "قطره‌چکان",
				className: "p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pipette, { className: "w-4 h-4 text-slate-600" })
			})
		]
	});
}
function OverlayPanel({ item, onPatch, onDelete, onClose }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const c = item.content ?? { kind: "none" };
	const s = item.style ?? {};
	const it = item.interaction ?? {
		block: true,
		action: "none"
	};
	const patchContent = (p) => onPatch(item.id, { content: {
		...c,
		...p
	} });
	const patchStyle = (p) => onPatch(item.id, { style: {
		...s,
		...p
	} });
	const patchInteraction = (p) => onPatch(item.id, { interaction: {
		...it,
		...p
	} });
	const onZip = async (file) => {
		setBusy(true);
		try {
			const files = unzipSync(new Uint8Array(await file.arrayBuffer()));
			const names = Object.keys(files);
			const entry = names.find((n) => /(^|\/)index\.html?$/i.test(n)) ?? names.find((n) => /\.html?$/i.test(n));
			if (!entry) {
				alert("داخل فایل ZIP هیچ فایل HTML پیدا نشد.");
				return;
			}
			patchContent({
				kind: "widget",
				widget: {
					name: file.name,
					html: strFromU8(files[entry])
				}
			});
		} catch {
			alert("خواندن فایل ZIP ممکن نشد.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 rounded-2xl border-2 border-blue-600/40 bg-blue-50/40 p-3 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-extrabold text-[#0b1e3f]",
					children: "لایه پوشاننده"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (confirm("این لایه حذف شود؟")) onDelete(item.id);
						},
						className: "p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200",
						title: "حذف لایه",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-lg border border-slate-300 bg-white",
						title: "بستن",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "نام لایه",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: item.label ?? "",
					onChange: (e) => onPatch(item.id, { label: e.target.value }),
					className: inputCls$8
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "حالت لایه",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: item.mode,
						onChange: (e) => onPatch(item.id, { mode: e.target.value }),
						className: inputCls$8,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cover",
								children: "فقط پوشش (بدون محتوا)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cover-content",
								children: "پوشش + محتوا"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "interactive",
								children: "تعاملی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "transparent",
								children: "شفاف (نامرئی)"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "ترتیب لایه (z-index)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						dir: "ltr",
						value: item.zIndex,
						onChange: (e) => onPatch(item.id, { zIndex: Number(e.target.value) || 0 }),
						className: inputCls$8
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: item.visible,
							onChange: (e) => onPatch(item.id, { visible: e.target.checked })
						}), "نمایش لایه"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: item.locked,
							onChange: (e) => onPatch(item.id, { locked: e.target.checked })
						}), "قفل (جابه‌جایی ممنوع)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: item.responsive?.sameForAll !== false,
							onChange: (e) => onPatch(item.id, { responsive: {
								...item.responsive,
								sameForAll: e.target.checked
							} })
						}), "یکسان در همه اندازه‌ها"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "نوع محتوا",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: c.kind,
					onChange: (e) => patchContent({ kind: e.target.value }),
					className: inputCls$8,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "none",
							children: "بدون محتوا"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "text",
							children: "متن"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "image",
							children: "تصویر"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "html",
							children: "HTML / CSS / JS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "iframe",
							children: "iframe (صفحه دیگر)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "widget",
							children: "ویجت (فایل ZIP)"
						})
					]
				})
			}),
			c.kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "متن",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: c.text ?? "",
						onChange: (e) => patchContent({ text: e.target.value }),
						className: inputCls$8
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "رنگ متن",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
						value: c.textStyle?.["color"] ?? "#ffffff",
						onChange: (v) => patchContent({ textStyle: {
							...c.textStyle,
							color: v
						} })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "اندازه فونت",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: c.textStyle?.["font-size"] ?? "16px",
							onChange: (e) => patchContent({ textStyle: {
								...c.textStyle,
								"font-size": e.target.value
							} }),
							className: inputCls$8
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
						label: "تراز متن",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: c.textStyle?.["text-align"] ?? "center",
							onChange: (e) => patchContent({ textStyle: {
								...c.textStyle,
								"text-align": e.target.value
							} }),
							className: inputCls$8,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "right",
									children: "راست"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "center",
									children: "وسط"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "left",
									children: "چپ"
								})
							]
						})
					})]
				})
			] }),
			c.kind === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "آدرس تصویر",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					value: c.image?.src ?? "",
					onChange: (e) => patchContent({ image: {
						...c.image,
						src: e.target.value
					} }),
					className: inputCls$8,
					placeholder: "https://…"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "لینک تصویر (اختیاری)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					value: c.image?.href ?? "",
					onChange: (e) => patchContent({ image: {
						...c.image,
						href: e.target.value
					} }),
					className: inputCls$8,
					placeholder: "https://…"
				})
			})] }),
			c.kind === "html" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "HTML",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						dir: "ltr",
						rows: 4,
						value: c.html ?? "",
						onChange: (e) => patchContent({ html: e.target.value }),
						className: `${inputCls$8} font-mono text-xs`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "CSS",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						dir: "ltr",
						rows: 3,
						value: c.css ?? "",
						onChange: (e) => patchContent({ css: e.target.value }),
						className: `${inputCls$8} font-mono text-xs`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "JavaScript (در محیط امن اجرا می‌شود)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						dir: "ltr",
						rows: 3,
						value: c.js ?? "",
						onChange: (e) => patchContent({ js: e.target.value }),
						className: `${inputCls$8} font-mono text-xs`
					})
				})
			] }),
			c.kind === "iframe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "آدرس iframe",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					value: c.iframeSrc ?? "",
					onChange: (e) => patchContent({ iframeSrc: e.target.value }),
					className: inputCls$8,
					placeholder: "https://…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-2 text-xs rounded-xl border border-blue-200 bg-blue-50/60 p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-0.5",
					checked: c.iframeProxy === true,
					onChange: (e) => patchContent({ iframeProxy: e.target.checked })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold",
					children: "حالت سازگاری برای لینک خارجی / بک‌لینک"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[10px] text-slate-500 leading-5",
					children: "یک نسخهٔ فقط‌خواندنی از مسیر سازگاری درخواست می‌شود. اگر سایت مقصد تأیید انسانی بخواهد، مقصد را در تب جدا باز کنید؛ سامانهٔ امنیتی آن سایت دور زده نمی‌شود."
				})] })]
			}),
			c.kind === "widget" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: c.widget?.name ? `ویجت فعلی: ${c.widget.name}` : "فایل ZIP ویجت (دارای index.html)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".zip",
					disabled: busy,
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) onZip(f);
					},
					className: "w-full text-xs"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded-xl border border-slate-200 bg-white p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "text-[11px] font-bold text-slate-600 cursor-pointer",
					children: "دکمه داخل لایه (اختیاری)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: c.button?.label ?? "",
							onChange: (e) => patchContent({ button: {
								...c.button,
								label: e.target.value
							} }),
							placeholder: "متن دکمه",
							className: inputCls$8
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							value: c.button?.href ?? "",
							onChange: (e) => patchContent({ button: {
								...c.button,
								href: e.target.value
							} }),
							placeholder: "https://…",
							className: inputCls$8
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							value: c.button?.bg ?? "#0b1e3f",
							onChange: (v) => patchContent({ button: {
								...c.button,
								bg: v
							} })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "رنگ پس‌زمینه لایه",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
					value: s.background ?? "rgba(11,30,63,0.55)",
					onChange: (v) => patchStyle({ background: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: `شفافیت: ${Math.round((s.opacity ?? 1) * 100)}٪`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: Math.round((s.opacity ?? 1) * 100),
						onChange: (e) => patchStyle({ opacity: Number(e.target.value) / 100 }),
						className: "w-full",
						dir: "ltr"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
					label: "گردی گوشه‌ها",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						value: s.radius ?? "",
						onChange: (e) => patchStyle({ radius: e.target.value }),
						placeholder: "12px",
						className: inputCls$8
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: it.block,
					onChange: (e) => patchInteraction({ block: e.target.checked })
				}), "مسدود کردن کلیک روی عنصر زیرین"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$2, {
				label: "کنش کلیک روی لایه",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: it.action,
					onChange: (e) => patchInteraction({ action: e.target.value }),
					className: inputCls$8,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "none",
							children: "هیچ‌کدام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "url",
							children: "باز کردن لینک"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "popup",
							children: "پاپ‌آپ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "modal",
							children: "مودال"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "js",
							children: "اجرای کد"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "toggle",
							children: "نمایش / مخفی"
						})
					]
				})
			}),
			it.action === "url" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					value: it.url ?? "",
					onChange: (e) => patchInteraction({ url: e.target.value }),
					placeholder: "https://…",
					className: inputCls$8
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: it.target ?? "_self",
					onChange: (e) => patchInteraction({ target: e.target.value }),
					className: inputCls$8,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "_self",
						children: "همین صفحه"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "_blank",
						children: "تب جدید"
					})]
				})]
			}),
			(it.action === "popup" || it.action === "modal") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				rows: 3,
				value: it.popupHtml ?? "",
				onChange: (e) => patchInteraction({ popupHtml: e.target.value }),
				placeholder: "متن یا HTML پاپ‌آپ",
				className: inputCls$8
			}),
			it.action === "js" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				dir: "ltr",
				rows: 3,
				value: it.js ?? "",
				onChange: (e) => patchInteraction({ js: e.target.value }),
				placeholder: "کد JavaScript",
				className: `${inputCls$8} font-mono text-xs`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-slate-500 leading-5",
				children: "برای جابه‌جایی یا تغییر اندازه، لایه را داخل پیش‌نمایش بکشید یا از دستگیره‌های گوشه استفاده کنید."
			})
		]
	});
}
/**
* Applies a new order for the header's main (root) menu items.
*
* The visual editor reports the labels of the top-level items in their new
* order; here they are matched against the stored rows and only `position`
* is rewritten (never an INSERT, never a label change).
*/
async function applyRootMenuOrder(order, device) {
	const { data, error } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
	if (error) return {
		ok: false,
		error: error.message
	};
	const rows = (data || []).filter((r) => !r.parent_id);
	if (rows.length === 0) return {
		ok: false,
		error: "منوی سایت هنوز در پایگاه داده ذخیره نشده است؛ ابتدا «همگام‌سازی با منوی سایت» را بزنید."
	};
	const visible = rows.filter((r) => r.device === "both" || r.device === device);
	const byLabel = /* @__PURE__ */ new Map();
	for (const r of visible) if (!byLabel.has(r.label.trim())) byLabel.set(r.label.trim(), r);
	const ordered = [];
	for (const label of order) {
		const row = byLabel.get(label.trim());
		if (row && !ordered.includes(row)) ordered.push(row);
	}
	for (const r of visible) if (!ordered.includes(r)) ordered.push(r);
	let updated = 0;
	for (let i = 0; i < ordered.length; i++) {
		const row = ordered[i];
		if (row.position === i) continue;
		const { error: upErr } = await adminDb("site_menu_items").update({ position: i }).eq("id", row.id);
		if (upErr) return {
			ok: false,
			error: upErr.message
		};
		updated++;
	}
	return {
		ok: true,
		updated
	};
}
var inputCls$7 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls$2 = "bg-white rounded-2xl border border-slate-200 p-5";
async function uploadFile$1(file, folder) {
	const fd = new FormData();
	fd.append("file", file);
	fd.append("folder", folder);
	const res = await fetch("/api/admin/upload", {
		method: "POST",
		body: fd
	});
	if (!res.ok) throw new Error(await res.text());
	return (await res.json()).url;
}
function Row$1({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] font-bold text-slate-600 mb-1",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[10px] text-slate-400 mt-1 leading-5",
				children: hint
			})
		]
	});
}
/** Slider + wheel-intro animation settings, editable from the visual editor menu. */
function SliderPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_HERO_SLIDER);
	const [wheel, setWheel] = (0, import_react.useState)(DEFAULT_WHEEL_INTRO);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const targetIdx = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		(async () => {
			setCfg(await adminReadSetting("hero_slider", DEFAULT_HERO_SLIDER));
			setWheel(await adminReadSetting("wheel_intro", DEFAULT_WHEEL_INTRO));
		})();
	}, []);
	const slides = cfg.slides ?? [];
	const setSlide = (i, patch) => setCfg((p) => ({
		...p,
		slides: p.slides.map((s, idx) => idx === i ? {
			...s,
			...patch
		} : s)
	}));
	const save = async () => {
		setBusy(true);
		setMsg("");
		const a = await adminWriteSetting("hero_slider", cfg);
		const b = await adminWriteSetting("wheel_intro", wheel);
		setBusy(false);
		setMsg(a.error || b.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: async (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					setBusy(true);
					try {
						const url = await uploadFile$1(f, "slider");
						setSlide(targetIdx.current, { img: url });
					} catch {
						setMsg("آپلود ناموفق بود");
					}
					setBusy(false);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "اسلایدر صفحه اصلی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "تصاویر اسلایدر را آپلود یا آدرس‌دهی کنید، ابعاد و سرعت گردش را تعیین کنید و اسلاید اضافه یا حذف کنید. ابعاد پیشنهادی تصویر: ۱۹۲۰×۵۸۰ پیکسل (نسبت ۱۲۰۰×۳۶۰)، حجم کمتر از ۸ مگابایت، فرمت JPG یا WEBP. اگر هیچ اسلایدی اضافه نکنید، تصاویر پیش‌فرض سایت نمایش داده می‌شوند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-4 gap-3 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "گردش خودکار",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cfg.autoplay ? "1" : "0",
									onChange: (e) => setCfg({
										...cfg,
										autoplay: e.target.value === "1"
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "فعال"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "غیرفعال"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: `سرعت اسلایدر: ${cfg.autoplayMs} میلی‌ثانیه`,
								hint: "هرچه عدد کمتر، گردش سریع‌تر",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1500,
									max: 12e3,
									step: 250,
									value: cfg.autoplayMs,
									onChange: (e) => setCfg({
										...cfg,
										autoplayMs: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "نحوه نمایش تصویر",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cfg.fit,
									onChange: (e) => setCfg({
										...cfg,
										fit: e.target.value
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cover",
										children: "پر کردن کادر (Cover)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "contain",
										children: "نمایش کامل تصویر (Contain)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "حلقه بی‌پایان",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cfg.loop ? "1" : "0",
									onChange: (e) => setCfg({
										...cfg,
										loop: e.target.value === "1"
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "فعال"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "غیرفعال"
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-4 gap-3 mb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "نوع ابعاد",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cfg.heightMode,
									onChange: (e) => setCfg({
										...cfg,
										heightMode: e.target.value
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ratio",
										children: "نسبت تصویر"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fixed",
										children: "ارتفاع ثابت"
									})]
								})
							}),
							cfg.heightMode === "ratio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "عرض نسبت",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: cfg.ratioW,
									onChange: (e) => setCfg({
										...cfg,
										ratioW: Number(e.target.value) || 1200
									}),
									className: inputCls$7
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "ارتفاع نسبت",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: cfg.ratioH,
									onChange: (e) => setCfg({
										...cfg,
										ratioH: Number(e.target.value) || 360
									}),
									className: inputCls$7
								})
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "ارتفاع (پیکسل)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: cfg.heightPx,
									onChange: (e) => setCfg({
										...cfg,
										heightPx: Number(e.target.value) || 420
									}),
									className: inputCls$7
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: `اندازه دکمه در موبایل: ${cfg.mobileCtaScale ?? 75}%`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 50,
									max: 110,
									step: 5,
									value: cfg.mobileCtaScale ?? 75,
									onChange: (e) => setCfg({
										...cfg,
										mobileCtaScale: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: `اندازه نقاط در موبایل: ${cfg.mobileDotsScale ?? 70}%`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 50,
									max: 120,
									step: 5,
									value: cfg.mobileDotsScale ?? 70,
									onChange: (e) => setCfg({
										...cfg,
										mobileDotsScale: Number(e.target.value)
									}),
									className: "w-full"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [slides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-200 p-3 grid md:grid-cols-12 gap-3 items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-2 bg-slate-50 rounded-lg h-20 flex items-center justify-center overflow-hidden",
									children: s.img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.img,
										alt: "",
										className: "w-full h-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-6 h-6 text-slate-400" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-6 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											dir: "ltr",
											placeholder: "آدرس تصویر",
											value: s.img,
											onChange: (e) => setSlide(i, { img: e.target.value }),
											className: inputCls$7
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											placeholder: "عنوان",
											value: s.title,
											onChange: (e) => setSlide(i, { title: e.target.value }),
											className: inputCls$7
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											placeholder: "زیرعنوان",
											value: s.subtitle,
											onChange: (e) => setSlide(i, { subtitle: e.target.value }),
											className: inputCls$7
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-3 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "متن دکمه",
										value: s.cta,
										onChange: (e) => setSlide(i, { cta: e.target.value }),
										className: inputCls$7
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										dir: "ltr",
										placeholder: "لینک دکمه",
										value: s.href,
										onChange: (e) => setSlide(i, { href: e.target.value }),
										className: inputCls$7
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-1 flex md:flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											targetIdx.current = i;
											fileRef.current?.click();
										},
										className: "p-2 rounded-lg border border-slate-300 text-slate-600",
										title: "آپلود تصویر",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setCfg({
											...cfg,
											slides: slides.filter((_, idx) => idx !== i)
										}),
										className: "p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600",
										title: "حذف اسلاید",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})
							]
						}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCfg({
								...cfg,
								slides: [...slides, {
									img: "",
									title: "",
									subtitle: "",
									cta: "",
									href: ""
								}]
							}),
							className: "text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن اسلاید"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "دکمه خرید آنلاین و انیمیشن چرخ‌وفلک"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "دکمه ورودی بخش «ارائه کلیه خدمات بیمه‌ای»؛ با کلیک کاربر، چرخ‌وفلک با انیمیشن انتخابی وارد صحنه می‌شود."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "وضعیت دکمه",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: wheel.enabled ? "1" : "0",
									onChange: (e) => setWheel({
										...wheel,
										enabled: e.target.value === "1"
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "فعال (چرخ‌وفلک مخفی تا کلیک)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "غیرفعال (نمایش مستقیم)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "متن دکمه",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: wheel.buttonText,
									onChange: (e) => setWheel({
										...wheel,
										buttonText: e.target.value
									}),
									className: inputCls$7
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "متن راهنما زیر دکمه",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: wheel.hintText,
									onChange: (e) => setWheel({
										...wheel,
										hintText: e.target.value
									}),
									className: inputCls$7
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "نوع انیمیشن ورود",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: wheel.animation,
									onChange: (e) => setWheel({
										...wheel,
										animation: e.target.value
									}),
									className: inputCls$7,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "explode",
											children: "انفجاری (چرخش و بزرگ‌شدن)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "zoom",
											children: "بزرگ‌نمایی"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "spin",
											children: "چرخش کامل"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "flip",
											children: "چرخش سه‌بعدی"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fade",
											children: "محو شدن"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: `مدت انیمیشن: ${wheel.durationMs} میلی‌ثانیه`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 300,
									max: 2500,
									step: 50,
									value: wheel.durationMs,
									onChange: (e) => setWheel({
										...wheel,
										durationMs: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
								label: "ذرات انفجار",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: wheel.particles ? "1" : "0",
									onChange: (e) => setWheel({
										...wheel,
										particles: e.target.value === "1"
									}),
									className: inputCls$7,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "فعال"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "غیرفعال"
									})]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: save,
					disabled: busy,
					className: "bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره تنظیمات"]
				}), msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-emerald-600",
					children: msg
				})]
			})
		]
	});
}
/** Frosted-glass help window used by the SEO / AI-keys / Search Console panes. */
function GlassHelp({ title, children, label = "راهنما" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/70 px-2 py-1 text-[11px] font-bold text-[#0b1e3f] hover:bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" }),
			" ",
			label
		]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
		title,
		onClose: () => setOpen(false),
		children
	})] });
}
function GlassModal({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/40 bg-white/75 p-6 text-slate-700 shadow-2xl backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-extrabold text-[#0b1e3f]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-1 hover:bg-white",
					"aria-label": "بستن",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 text-xs leading-6",
				children
			})]
		})
	});
}
/** Numbered step list helper. */
function Steps({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "list-inside list-decimal space-y-1",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: it }, i))
	});
}
/** Cloudflare + cPanel env-var steps shared by every engine guide. */
function EnvVarSteps({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
			className: "font-extrabold text-[#0b1e3f]",
			children: "ثبت متغیر در Cloudflare"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { items: [
			"وارد dash.cloudflare.com شوید و از منوی چپ «Workers & Pages» را باز کنید.",
			"پروژه سایت را انتخاب کنید و به برگه «Settings» بروید.",
			"بخش «Variables and Secrets» → دکمه «Add».",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"نوع را «Secret» بگذارید، نام را دقیقاً ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					className: "rounded bg-slate-100 px-1",
					children: name
				}),
				" بنویسید و کلید را در Value بچسبانید."
			] }),
			"«Deploy» یا «Save and deploy» را بزنید تا روی سایت اعمال شود."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
			className: "font-extrabold text-[#0b1e3f]",
			children: "ثبت متغیر در سی‌پنل (cPanel)"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { items: [
			"وارد سی‌پنل هاست شوید.",
			"بخش «Setup Node.js App» (یا «Application Manager») را باز کنید.",
			"روی برنامه سایت «Edit» بزنید.",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"در قسمت «Environment variables» دکمه «Add Variable»، نام ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					dir: "ltr",
					className: "rounded bg-slate-100 px-1",
					children: name
				}),
				" و مقدار کلید را وارد کنید."
			] }),
			"«Save» و سپس «Restart» را بزنید."
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl bg-emerald-50 p-2 text-emerald-700",
			children: "راه ساده‌تر: کلید را همین‌جا در پیشخوان وارد کنید؛ در بخش خصوصی دیتابیس ذخیره می‌شود و نیازی به ثبت متغیر نیست."
		})
	] });
}
var inputCls$6 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var btn$1 = "flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold hover:bg-slate-50 disabled:opacity-50";
var primary = "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white font-bold disabled:opacity-50";
/**
* «آنالیز وب‌سایت رقیب» — lives inside the SEO menu.
*
* Step 1: target keyword + competitor URL (from Google's first result).
* Step 2: website analyzer finds the competitor's top pages (switchable source,
*         including the external Traffic Checker used in the training video).
* Step 3: the selected AI engine (default Lovable AI) reports the competitor's
*         weaknesses, our gaps, keywords, a content plan and a backlink plan.
* Step 4: one click per page rewrites our content with that plan and stores it
*         as an editable Page-Builder page.
*/
function CompetitorPane() {
	const [engines, setEngines] = (0, import_react.useState)(DEFAULT_AI_ENGINES);
	const [seo, setSeo] = (0, import_react.useState)(DEFAULT_SEO);
	const [keyword, setKeyword] = (0, import_react.useState)("");
	const [competitorUrl, setCompetitorUrl] = (0, import_react.useState)("");
	const [topPages, setTopPages] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)("");
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	const [scan, setScan] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [domain2, setDomain2] = (0, import_react.useState)(SECONDARY_DOMAIN);
	const [showResult, setShowResult] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			setEngines(await adminReadSetting(AI_ENGINES_KEY, DEFAULT_AI_ENGINES));
			setSeo(await adminReadSetting(SEO_SETTING_KEY, DEFAULT_SEO));
		})();
	}, []);
	const analyzer = getAnalyzer(engines.analyzer);
	const origin = cleanOrigin(normalizeBase(seo.siteUrl));
	const myPaths = seo.pages.map((p) => p.path);
	async function saveEngines(next) {
		setEngines(next);
		const res = await adminWriteSetting(AI_ENGINES_KEY, next);
		if (res.error) notifyFailed("ذخیره موتور هوش مصنوعی", res.error.message);
	}
	async function findTopPages() {
		if (!competitorUrl.trim()) return notifyFailed("آنالیز رقیب", "آدرس سایت رقیب را وارد کنید.");
		setBusy("top");
		try {
			const res = await competitorTopPages({ data: { url: competitorUrl.trim() } });
			setTopPages(res.pages);
			if (!res.pages.length) notifyFailed("صفحات رقیب", "صفحه‌ای پیدا نشد؛ آدرس صفحه پرترافیک را دستی وارد کنید.");
			else notifySaved(`${res.pages.length} صفحه رقیب پیدا شد`);
		} catch (e) {
			notifyFailed("صفحات رقیب", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	async function runAnalysis() {
		if (!competitorUrl.trim()) return notifyFailed("آنالیز رقیب", "آدرس صفحه رقیب را وارد کنید.");
		setBusy("analyze");
		setAnalysis(null);
		try {
			const res = await analyzeCompetitorSite({ data: {
				competitorUrl: competitorUrl.trim(),
				myUrls: origin ? myPaths.slice(0, 6).map((p) => joinUrl(origin, p)) : [],
				myAltOrigin: cleanOrigin(domain2) || void 0,
				keyword: keyword.trim(),
				analyzer: engines.analyzer,
				provider: engines.seoCompetitor.provider,
				model: engines.seoCompetitor.model,
				extraNotes: notes.trim()
			} });
			setAnalysis(res);
			if (!res.ok) notifyFailed("آنالیز رقیب", res.error);
			else {
				notifySaved("تحلیل رقیب آماده شد");
				setShowResult(true);
			}
		} catch (e) {
			notifyFailed("آنالیز رقیب", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	async function runScan() {
		if (!origin) return notifyFailed("اسکن سایت", "ابتدا آدرس دامنه را در تنظیمات سئو ذخیره کنید.");
		setBusy("scan");
		setScan(null);
		try {
			const res = await scanSiteSeo({ data: {
				origin,
				paths: myPaths,
				competitorUrl: competitorUrl.trim() || void 0,
				keyword: keyword.trim() || void 0,
				analyzer: engines.analyzer,
				provider: engines.seoCompetitor.provider,
				model: engines.seoCompetitor.model,
				altOrigin: cleanOrigin(domain2) || void 0
			} });
			setScan(res);
			if (!res.ok) notifyFailed("اسکن سایت", res.error);
			else {
				if (res.analysis) {
					setAnalysis(res.analysis);
					setShowResult(true);
				}
				notifySaved("اسکن کلی سایت انجام شد");
			}
		} catch (e) {
			notifyFailed("اسکن سایت", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	/** Rewrites one of our pages with the plan and stores it as an editable page. */
	async function rewritePage(path, guidance, title, description) {
		if (!origin) return notifyFailed("به‌روزرسانی محتوا", "ابتدا آدرس دامنه را در تنظیمات سئو ذخیره کنید.");
		setBusy(`rewrite:${path}`);
		try {
			const res = await aiRewritePage({ data: {
				targetUrl: joinUrl(origin, path),
				competitorUrl: competitorUrl.trim() || void 0,
				keyword: keyword.trim() || void 0,
				guidance,
				provider: engines.seoCompetitor.provider,
				model: engines.seoCompetitor.model
			} });
			if (!res.ok) return notifyFailed("به‌روزرسانی محتوا", res.error);
			const slug = sanitizeSlug(`seo-${path.replace(/^\//, "") || "home"}`);
			const map = await adminReadSetting(CUSTOM_PAGES_KEY, {});
			const base = map[slug] ?? emptyPage(slug);
			map[slug] = {
				...base,
				slug,
				title: title || res.title || base.title,
				description: description || res.description || base.description,
				seoTitle: title || res.title || base.seoTitle,
				seoDescription: description || res.description || base.seoDescription,
				blocks: res.blocks,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const saved = await adminWriteSetting(CUSTOM_PAGES_KEY, map);
			if (saved.error) return notifyFailed("ذخیره صفحه", saved.error.message);
			notifySaved(`محتوای سئو‌شده ساخته شد: /p/${slug} — در صفحه‌ساز و ویرایشگر بصری قابل ویرایش است`);
		} catch (e) {
			notifyFailed("به‌روزرسانی محتوا", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	const report = analysis?.ok ? analysis.report : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-1 flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "h-4 w-4" }),
							" آنالیز وب‌سایت رقیب (ترفند سه‌مرحله‌ای)",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mr-auto flex gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassHelp, {
										title: "راهنمای آنالیز رقیب",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { items: [
											"کلمه کلیدی هدف (مثلاً «بیمه بدنه لاهیجان») را در گوگل جستجو کنید.",
											"آدرس اولین سایت رقیب را در کادر «آدرس سایت یا صفحه رقیب» بچسبانید.",
											"«یافتن صفحات پرترافیک رقیب» را بزنید و از فهرست، مهم‌ترین صفحه را با «تحلیل این صفحه» انتخاب کنید.",
											"موتور هوش مصنوعی و ابزار آنالیز را انتخاب کنید (پیش‌فرض Lovable AI و آنالیزور داخلی).",
											"«تحلیل نقاط ضعف رقیب» را بزنید؛ پنجره نتیجه نشان می‌دهد با کدام موتور و کدام روش تحلیل شده.",
											"در «برنامه محتوا» برای هر صفحه «ساخت محتوای قوی‌تر» را بزنید؛ صفحه در صفحه‌ساز قابل ویرایش است."
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassHelp, {
										title: "دامنه دوم و خطای ۵۲۲",
										label: "دامنه دوم / خطاها",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "سایت شما دو دامنه دارد. اگر صفحه‌ای از دامنه اول باز نشود، همان صفحه از دامنه دوم خوانده می‌شود و در نتیجه ذکر می‌شود." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "خطای ۵۲۲" }), " یعنی Cloudflare نتوانسته به هاست سایت وصل شود. معمولاً هاست خاموش یا کند است، یا IP هاست در بخش DNS کلودفلر اشتباه ثبت شده. از پشتیبانی هاست بپرسید سرور روشن است و IP درست را در Cloudflare → DNS ثبت کنید."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"آدرس‌های تکراری مثل ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													dir: "ltr",
													children: "https://site.ir/https://site.ir"
												}),
												" به‌صورت خودکار اصلاح می‌شوند."
											] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassHelp, {
										title: "روش‌های آنالیز",
										label: "روش‌ها",
										children: ANALYZERS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [a.label, ":"] }),
											" ",
											a.note
										] }, a.id))
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-[11px] text-slate-500",
						children: "۱) کلمه کلیدی را در گوگل جستجو کنید و آدرس رقیب اول را اینجا بگذارید. ۲) پرترافیک‌ترین صفحه‌اش را پیدا کنید. ۳) هوش مصنوعی نقاط ضعف آن را می‌گوید و محتوای شما را قوی‌تر می‌سازد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-bold text-slate-600",
									children: "کلمه کلیدی هدف"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: keyword,
									onChange: (e) => setKeyword(e.target.value),
									className: inputCls$6,
									placeholder: "مثلاً بیمه مسافرتی لاهیجان"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-bold text-slate-600",
									children: "آدرس سایت یا صفحه رقیب"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: competitorUrl,
									onChange: (e) => setCompetitorUrl(e.target.value),
									className: inputCls$6,
									placeholder: "https://competitor.ir/insurance"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-bold text-slate-600",
									children: "دامنه دوم سایت من (اگر دامنه اول باز نشد از این خوانده می‌شود)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: domain2,
									onChange: (e) => setDomain2(e.target.value),
									className: inputCls$6,
									placeholder: "https://saman8452.ir"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block font-bold text-slate-600",
									children: "یادداشت برای هوش مصنوعی (اختیاری)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									className: inputCls$6,
									placeholder: "مثلاً روی بیمه درمان تکمیلی و شهر لاهیجان تمرکز کن."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiEngineSelect, {
								value: engines.seoCompetitor,
								onChange: (seoCompetitor) => void saveEngines({
									...engines,
									seoCompetitor
								}),
								label: "موتور هوش مصنوعی این بخش"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block font-bold text-slate-600",
										children: "ابزار آنالیز وب‌سایت (قابل تغییر)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: engines.analyzer,
										onChange: (e) => void saveEngines({
											...engines,
											analyzer: e.target.value
										}),
										className: inputCls$6,
										children: ANALYZERS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: a.id,
											children: a.label
										}, a.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] text-slate-400",
										children: analyzer.note
									})
								]
							}),
							analyzer.externalUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								dir: "ltr",
								href: `${analyzer.externalUrl}${competitorUrl.trim() ? `?domain=${encodeURIComponent(competitorUrl.trim())}` : ""}`,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b1e3f]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " باز کردن Traffic Checker برای این دامنه"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2 text-[11px] text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " انتخاب موتور و ابزار به‌صورت خودکار ذخیره می‌شود."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void findTopPages(),
								disabled: !!busy,
								className: btn$1,
								children: [busy === "top" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), " یافتن صفحات پرترافیک رقیب"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void runAnalysis(),
								disabled: !!busy,
								className: primary,
								children: [busy === "analyze" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " تحلیل نقاط ضعف رقیب"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void runScan(),
								disabled: !!busy,
								className: btn$1,
								children: [busy === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4" }), " اسکن کلی سئوی سایت من"]
							})
						]
					}),
					topPages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-3 text-[11px]",
						children: topPages.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								dir: "ltr",
								href: u,
								target: "_blank",
								rel: "noreferrer",
								className: "truncate text-slate-600 hover:underline",
								children: u
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCompetitorUrl(u),
								className: "shrink-0 rounded-lg border border-slate-300 px-2 py-1 font-bold",
								children: "تحلیل این صفحه"
							})]
						}, u))
					})
				]
			}),
			showResult && analysis?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassModal, {
				title: "نتیجه آنالیز رقیب",
				onClose: () => setShowResult(false),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/70 p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "موتور هوش مصنوعی:" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										dir: "ltr",
										children: analysis.engine
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/70 p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "روش آنالیز:" }),
									" ",
									getAnalyzer(analysis.analyzer).label
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/70 p-2 sm:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "صفحه رقیب:" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										dir: "ltr",
										children: analysis.competitor.url
									}),
									" ",
									analysis.competitor.ok ? "✓ خوانده شد" : `— ${analysis.competitor.error ?? ""}`
								]
							})
						]
					}),
					analysis.mine.some((m) => m.via || !m.ok) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-inside list-disc text-amber-700",
						children: analysis.mine.map((m) => (m.via || !m.ok) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								dir: "ltr",
								children: m.url
							}),
							": ",
							m.via || m.error
						] }, m.url))
					}),
					analysis.report.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line rounded-xl bg-white/70 p-3",
						children: analysis.report.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "نقاط ضعف رقیب",
						items: analysis.report.competitorWeaknesses.slice(0, 5),
						tone: "rose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "کارهای سریع",
						items: analysis.report.quickWins.slice(0, 5),
						tone: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "جزئیات کامل و برنامه محتوا زیر همین صفحه نمایش داده شده است."
					})
				]
			}),
			scan?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-extrabold text-[#0b1e3f]",
					children: "نتیجه اسکن کلی سایت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: scan.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-slate-200 p-3 text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								dir: "ltr",
								className: "font-bold text-slate-700",
								children: p.url
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-slate-500",
								children: [
									"کلمات: ",
									p.words ?? 0,
									" | تیترها: ",
									p.headings?.length ?? 0,
									" | تصاویر: ",
									p.images ?? 0
								]
							}),
							p.issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-1 list-inside list-disc text-rose-600",
								children: p.issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-emerald-600",
								children: "ایراد آشکاری پیدا نشد ✓"
							})
						]
					}, p.url))
				})]
			}),
			report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-2xl border border-slate-200 bg-white p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] text-slate-400",
						children: [
							"موتور: ",
							analysis?.ok ? analysis.engine : "",
							" — ابزار آنالیز: ",
							analyzer.label
						]
					}),
					report.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-700",
						children: report.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "نقاط ضعف رقیب (فرصت‌های شما)",
						items: report.competitorWeaknesses,
						tone: "rose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "نقاط قوت رقیب (باید جبران شود)",
						items: report.competitorStrengths,
						tone: "slate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "کمبودهای سایت ما",
						items: report.myGaps,
						tone: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "کارهای سریع و زودبازده",
						items: report.quickWins,
						tone: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListCard, {
						title: "برنامه لینک‌سازی",
						items: report.backlinks,
						tone: "slate"
					}),
					report.keywords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-2 text-xs font-extrabold text-[#0b1e3f]",
						children: "کلمات کلیدی هدف"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-slate-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-1 text-right",
										children: "کلمه"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-1 text-right",
										children: "نیت کاربر"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-1 text-right",
										children: "صفحه پیشنهادی"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: report.keywords.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-slate-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1 font-bold text-slate-700",
										children: k.keyword
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-1 text-slate-500",
										children: k.intent
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										dir: "ltr",
										className: "p-1 text-slate-500",
										children: k.where
									})
								]
							}, `${k.keyword}-${i}`)) })]
						})
					})] }),
					report.contentPlan.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-2 text-xs font-extrabold text-[#0b1e3f]",
						children: "برنامه محتوا — هر صفحه با یک کلیک به‌روز می‌شود"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: report.contentPlan.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-200 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											dir: "ltr",
											className: "text-[11px] font-bold text-slate-700",
											children: c.path
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold text-[#0b1e3f]",
											children: c.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-500",
											children: [
												c.action,
												" — ",
												c.description
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => void rewritePage(c.path, [c.description, ...c.outline].filter(Boolean).join("\n"), c.title, c.description),
									disabled: !!busy,
									className: primary,
									children: [busy === `rewrite:${c.path}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" }), " ساخت محتوای قوی‌تر"]
								})]
							}), c.outline.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 list-inside list-disc text-[11px] text-slate-600",
								children: c.outline.map((o, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: o }, `${o}-${j}`))
							})]
						}, `${c.path}-${i}`))
					})] })
				]
			})
		]
	});
}
function ListCard({ title, items, tone }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
		className: "mb-1 text-xs font-extrabold text-[#0b1e3f]",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: `list-inside list-disc space-y-1 text-[11px] leading-5 ${tone === "rose" ? "text-rose-600" : tone === "emerald" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : "text-slate-600"}`,
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: it }, `${it}-${i}`))
	})] });
}
/** Where to get each AI engine's key (client-safe data for the help windows). */
var KEY_GUIDES = {
	lovable: {
		url: "https://lovable.dev",
		steps: ["این موتور کلید جداگانه نمی‌خواهد؛ متغیر LOVABLE_API_KEY روی میزبانی Lovable خودکار تنظیم است.", "اگر سایت روی Cloudflare خودتان است، از بخش تنظیمات پروژه Lovable کلید بسازید."]
	},
	cloudflare: {
		url: "https://dash.cloudflare.com/profile/api-tokens",
		steps: [
			"dash.cloudflare.com → آیکون پروفایل → «API Tokens» → «Create Token».",
			"قالب «Workers AI» را انتخاب و توکن را بسازید.",
			"شناسه حساب (Account ID) را از صفحه اصلی داشبورد، ستون راست، کپی کنید و در فیلد دوم وارد کنید."
		]
	},
	google: {
		url: "https://aistudio.google.com/app/apikey",
		steps: [
			"به aistudio.google.com بروید و با حساب گوگل وارد شوید.",
			"«Get API key» → «Create API key».",
			"کلید (شروع با AIza) را کپی کنید."
		]
	},
	groq: {
		url: "https://console.groq.com/keys",
		steps: [
			"وارد console.groq.com شوید.",
			"«API Keys» → «Create API Key».",
			"کلید (شروع با gsk_) را همان لحظه کپی کنید."
		]
	},
	openrouter: {
		url: "https://openrouter.ai/keys",
		steps: [
			"وارد openrouter.ai شوید.",
			"منوی «Keys» → «Create Key».",
			"کلید (شروع با sk-or-) را کپی کنید."
		]
	},
	mistral: {
		url: "https://console.mistral.ai/api-keys",
		steps: [
			"وارد console.mistral.ai شوید.",
			"«API Keys» → «Create new key».",
			"کلید را کپی کنید."
		]
	},
	deepseek: {
		url: "https://platform.deepseek.com/api_keys",
		steps: [
			"وارد platform.deepseek.com شوید.",
			"«API keys» → «Create new API key».",
			"کلید (شروع با sk-) را کپی کنید."
		]
	},
	together: {
		url: "https://api.together.ai/settings/api-keys",
		steps: [
			"وارد together.ai شوید.",
			"«Settings» → «API Keys».",
			"کلید را کپی کنید."
		]
	},
	cerebras: {
		url: "https://cloud.cerebras.ai",
		steps: [
			"وارد cloud.cerebras.ai شوید.",
			"منوی «API Keys» → «Generate».",
			"کلید (شروع با csk-) را کپی کنید."
		]
	},
	github: {
		url: "https://github.com/settings/personal-access-tokens",
		steps: [
			"github.com → Settings → Developer settings → Personal access tokens → Fine-grained.",
			"«Generate new token» و در بخش Permissions دسترسی «Models: Read» را بدهید.",
			"توکن (شروع با github_pat_) را کپی کنید."
		]
	},
	nvidia: {
		url: "https://build.nvidia.com",
		steps: [
			"وارد build.nvidia.com شوید.",
			"یک مدل را باز کنید و «Get API Key» را بزنید.",
			"کلید (شروع با nvapi-) را کپی کنید."
		]
	},
	huggingface: {
		url: "https://huggingface.co/settings/tokens",
		steps: [
			"وارد huggingface.co شوید.",
			"Settings → Access Tokens → «Create new token» (نوع Read یا Inference).",
			"توکن (شروع با hf_) را کپی کنید."
		]
	}
};
/**
* Dashboard-only: manage AI provider keys (masked listing, save, delete, test).
* Every call requires an unlocked dashboard session.
*/
var listAiKeys = createServerFn({ method: "POST" }).handler(createSsrRpc("403714a7e8eb5f6af1ed7898821c0c0caeab90e6065ca8447b83bd8c6e7e7292"));
var saveAiKey = createServerFn({ method: "POST" }).inputValidator((d) => {
	if (!d?.provider || typeof d.key !== "string" || d.key.trim().length < 8 || d.key.length > 4e3) throw new Error("کلید معتبر نیست.");
	return d;
}).handler(createSsrRpc("238e5c93e0dc348e4f9a2b1ba675696892783ebf5b792e56af34753beb4f158d"));
var deleteAiKey = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("c226965fae99a379e11c7d23f2c18199ab7d2ede26a80b42ebde00c2a3e9868f"));
var testAiKey = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("e963acd95e03f9328d6b2f0ed5cf1f0bc6a1668e6117df8e690040190db897d5"));
var inputCls$5 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var btn = "flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold hover:bg-slate-50 disabled:opacity-50";
/** «کلیدهای هوش مصنوعی» — enter / edit / delete / test each engine's key. */
function AiKeysPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [editing, setEditing] = (0, import_react.useState)("");
	const [key, setKey] = (0, import_react.useState)("");
	const [extra, setExtra] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)("");
	const [tests, setTests] = (0, import_react.useState)({});
	async function load() {
		try {
			setRows(await listAiKeys());
		} catch (e) {
			notifyFailed("کلیدهای هوش مصنوعی", e?.message || String(e));
		}
	}
	(0, import_react.useEffect)(() => void load(), []);
	async function save(id) {
		setBusy(`save:${id}`);
		try {
			const r = await saveAiKey({ data: {
				provider: id,
				key,
				extra
			} });
			if (!r.ok) return notifyFailed("ذخیره کلید", r.error || "");
			notifySaved("کلید در بخش خصوصی ذخیره شد");
			setEditing("");
			setKey("");
			setExtra("");
			await load();
		} catch (e) {
			notifyFailed("ذخیره کلید", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	async function remove(id) {
		if (!confirm("کلید این موتور حذف شود؟")) return;
		setBusy(`del:${id}`);
		const r = await deleteAiKey({ data: { provider: id } });
		setBusy("");
		if (!r.ok) return notifyFailed("حذف کلید", r.error || "");
		notifySaved("کلید حذف شد");
		await load();
	}
	async function test(id) {
		setBusy(`test:${id}`);
		try {
			const r = await testAiKey({ data: { provider: id } });
			setTests((t) => ({
				...t,
				[id]: r
			}));
		} finally {
			setBusy("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-slate-200 bg-white p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-1 flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), " کلیدهای API موتورهای هوش مصنوعی"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500",
				children: "کلیدها در بخش خصوصی دیتابیس ذخیره می‌شوند و بازدیدکننده سایت هرگز آن‌ها را نمی‌بیند؛ اینجا هم فقط چند حرف اول و آخر نمایش داده می‌شود."
			})]
		}), AI_PROVIDERS.map((p) => {
			const row = rows.find((r) => r.id === p.id);
			const guide = KEY_GUIDES[p.id];
			const t = tests[p.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold text-[#0b1e3f]",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[11px] text-slate-500",
							children: row?.stored ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["ذخیره‌شده: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								dir: "ltr",
								children: row.masked
							})] }) : row?.inEnv ? "از متغیر سرور خوانده می‌شود" : "کلیدی ثبت نشده"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassHelp, {
									title: `راهنمای کلید ${p.label}`,
									children: [
										guide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-extrabold text-[#0b1e3f]",
												children: "محل گرفتن کلید"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												dir: "ltr",
												href: guide.url,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1 font-bold text-[#0b1e3f] underline",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }),
													" ",
													guide.url
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { items: guide.steps })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnvVarSteps, { name: p.keyNames[0] }),
										p.extraNames?.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"متغیر دوم لازم: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												dir: "ltr",
												className: "rounded bg-slate-100 px-1",
												children: n
											}),
											" (همان مراحل بالا)."
										] }, n))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: btn,
									onClick: () => {
										setEditing(editing === p.id ? "" : p.id);
										setKey("");
										setExtra("");
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }),
										" ",
										row?.stored ? "ویرایش" : "وارد کردن"
									]
								}),
								row?.stored && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: btn,
									disabled: !!busy,
									onClick: () => void remove(p.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " حذف"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: btn,
									disabled: !!busy,
									onClick: () => void test(p.id),
									children: [busy === `test:${p.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlugZap, { className: "h-3.5 w-3.5" }), " آزمایش اتصال"]
								})
							]
						})]
					}),
					editing === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-[1fr_auto]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								type: "password",
								autoComplete: "off",
								value: key,
								onChange: (e) => setKey(e.target.value),
								className: inputCls$5,
								placeholder: `${p.keyNames[0]} را اینجا بچسبانید`
							}), p.extraNames?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: extra,
								onChange: (e) => setExtra(e.target.value),
								className: inputCls$5,
								placeholder: p.extraNames[0]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex items-center justify-center gap-1 rounded-lg bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-50",
							disabled: !key.trim() || !!busy,
							onClick: () => void save(p.id),
							children: [busy === `save:${p.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " ذخیره"]
						})]
					}),
					t && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-3 flex items-start gap-2 rounded-xl p-2 text-[11px] ${t.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
						children: [t.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.ok ? `اتصال برقرار است (${t.ms} میلی‌ثانیه، مدل ${t.model}). پاسخ: ${t.reply}` : `اتصال ناموفق: ${t.error}` })]
					})
				]
			}, p.id);
		})]
	});
}
var gscStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("01b6dc6cb10fc413a9f507d4c659eebdc7fb7e0dd4f44f6253512530b8a329d1"));
var saveGscKey = createServerFn({ method: "POST" }).inputValidator((d) => {
	const parsed = JSON.parse(d?.json || "{}");
	if (!parsed.client_email || !parsed.private_key) throw new Error("فایل JSON کلید سرویس گوگل معتبر نیست.");
	return d;
}).handler(createSsrRpc("d575ccf66974465d962616b1e744a26b1a96f559e06b0e2f27b909ab1fcf7c0e"));
var deleteGscKey = createServerFn({ method: "POST" }).handler(createSsrRpc("4140ee2e486bb1ffd55f39a21832d9084983f40c6870a27b96036b353bd531c9"));
/** Registers + analyzes both domains, then asks the chosen AI engine for guidance. */
var gscAutoRun = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createSsrRpc("9b7a546f9e6c0c294a36ed2fb37250cfe340683eafe758f1a1754564f9d652b0"));
var inputCls$4 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
/** «سرچ کنسول گوگل» — one-click register + analyze for both domains. */
function SearchConsolePane() {
	const [status, setStatus] = (0, import_react.useState)({
		configured: false,
		email: ""
	});
	const [json, setJson] = (0, import_react.useState)("");
	const [d1, setD1] = (0, import_react.useState)(PRIMARY_DOMAIN);
	const [d2, setD2] = (0, import_react.useState)(SECONDARY_DOMAIN);
	const [engine, setEngine] = (0, import_react.useState)(DEFAULT_AI_ENGINES.seoCompetitor);
	const [busy, setBusy] = (0, import_react.useState)("");
	const [run, setRun] = (0, import_react.useState)(null);
	async function load() {
		try {
			setStatus(await gscStatus());
			const e = await adminReadSetting(AI_ENGINES_KEY, DEFAULT_AI_ENGINES);
			setEngine(e.seoCompetitor);
		} catch (e) {
			notifyFailed("سرچ کنسول", e?.message || String(e));
		}
	}
	(0, import_react.useEffect)(() => void load(), []);
	async function saveKey() {
		setBusy("save");
		try {
			const r = await saveGscKey({ data: { json: json.trim() } });
			if (!r.ok) return notifyFailed("کلید گوگل", r.error || "");
			notifySaved("کلید گوگل در بخش خصوصی ذخیره شد");
			setJson("");
			await load();
		} catch (e) {
			notifyFailed("کلید گوگل", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	async function autoRun() {
		setBusy("run");
		try {
			const r = await gscAutoRun({ data: {
				domains: [d1, d2].filter(Boolean),
				provider: engine.provider,
				model: engine.model
			} });
			if (!r.ok) return notifyFailed("سرچ کنسول", r.error);
			setRun(r);
		} catch (e) {
			notifyFailed("سرچ کنسول", e?.message || String(e));
		} finally {
			setBusy("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-extrabold text-[#0b1e3f]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }), " سرچ کنسول گوگل"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassHelp, {
						title: "راهنمای قدم‌به‌قدم ساخت کلید گوگل",
						label: "راهنمای ساخت کلید",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { items: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"به ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									dir: "ltr",
									className: "underline",
									href: "https://console.cloud.google.com",
									target: "_blank",
									rel: "noreferrer",
									children: "console.cloud.google.com"
								}),
								" بروید و یک پروژه جدید بسازید."
							] }),
							"از «APIs & Services → Library» دو سرویس «Google Search Console API» و «Site Verification API» را جستجو و Enable کنید.",
							"به «IAM & Admin → Service Accounts» بروید، «Create service account» بزنید و یک نام دلخواه بدهید.",
							"روی حساب ساخته‌شده کلیک کنید → برگه «Keys» → «Add key → Create new key» → نوع JSON. یک فایل دانلود می‌شود.",
							"محتوای کامل فایل JSON را در کادر همین صفحه بچسبانید و «ذخیره کلید» را بزنید.",
							"اگر سایت قبلاً در سرچ کنسول با حساب دیگری ثبت شده: در search.google.com/search-console → Settings → Users and permissions، ایمیل حساب سرویس را با دسترسی Owner اضافه کنید.",
							"دکمه «ثبت و آنالیز خودکار هر دو دامنه» را بزنید. اگر تأیید مالکیت نیاز به DNS داشت، رکورد TXT نمایش‌داده‌شده را در Cloudflare → DNS → Add record (نوع TXT، نام @) ثبت و دوباره دکمه را بزنید."
						] })
					})]
				}), status.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-700",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["کلید گوگل ثبت شده: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: status.email
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2 py-1 font-bold",
						onClick: async () => {
							if (!confirm("کلید گوگل حذف شود؟")) return;
							await deleteGscKey();
							await load();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " حذف"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						dir: "ltr",
						rows: 5,
						value: json,
						onChange: (e) => setJson(e.target.value),
						className: inputCls$4,
						placeholder: "{\"type\":\"service_account\",\"client_email\":\"...\",\"private_key\":\"...\"}"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void saveKey(),
						disabled: !json.trim() || !!busy,
						className: "flex items-center gap-2 rounded-xl bg-[#0b1e3f] px-3 py-2 text-xs font-bold text-white disabled:opacity-50",
						children: [busy === "save" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " ذخیره کلید"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block font-bold text-slate-600",
								children: "دامنه اول"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: d1,
								onChange: (e) => setD1(e.target.value),
								className: inputCls$4
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block font-bold text-slate-600",
								children: "دامنه دوم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: d2,
								onChange: (e) => setD2(e.target.value),
								className: inputCls$4
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiEngineSelect, {
							value: engine,
							onChange: setEngine,
							label: "موتور هوش مصنوعی برای تحلیل"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void autoRun(),
						disabled: !status.configured || !!busy,
						className: "mt-4 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50",
						children: [busy === "run" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-4 w-4" }), " ثبت و آنالیز خودکار هر دو دامنه"]
					}),
					!status.configured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[11px] text-slate-400",
						children: "ابتدا کلید گوگل را ثبت کنید."
					})
				]
			}),
			run?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassModal, {
				title: "نتیجه ثبت و آنالیز سرچ کنسول",
				onClose: () => setRun(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-xl bg-[#0b1e3f]/5 p-2",
						children: ["تحلیل با موتور: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							dir: "ltr",
							children: run.engine
						})]
					}),
					run.reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/60 bg-white/60 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								dir: "ltr",
								className: "mb-2 font-extrabold text-[#0b1e3f]",
								children: r.domain
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: r.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-1.5",
									children: [s.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 shrink-0 text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [s.step, ":"] }),
										" ",
										s.detail
									] })]
								}, s.step))
							}),
							"verifyToken" in r && r.verifyToken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								dir: "ltr",
								className: "mt-2 break-all rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800",
								children: ["TXT: ", r.verifyToken]
							}),
							"stats" in r && r.stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-[11px]",
								children: [
									"کلیک: ",
									r.stats.clicks,
									" | نمایش: ",
									r.stats.impressions,
									" | CTR: ",
									(r.stats.ctr * 100).toFixed(1),
									"٪ | میانگین رتبه: ",
									r.stats.position.toFixed(1)
								]
							}),
							r.topQueries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-[11px]",
								children: ["پرتکرارترین جستجوها: ", r.topQueries.slice(0, 8).map((q) => q.query).join("، ")]
							})
						]
					}, r.domain)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-extrabold text-[#0b1e3f]",
						children: "راهنمایی‌های هوش مصنوعی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line rounded-xl bg-white/70 p-3",
						children: run.advice
					})
				]
			})
		]
	});
}
var inputCls$3 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function SeoPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_SEO);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("settings");
	(0, import_react.useEffect)(() => {
		adminReadSetting(SEO_SETTING_KEY, DEFAULT_SEO).then(setCfg);
	}, []);
	const setPage = (i, patch) => setCfg((c) => ({
		...c,
		pages: c.pages.map((p, idx) => idx === i ? {
			...p,
			...patch
		} : p)
	}));
	const move = (i, dir) => setCfg((c) => {
		const pages = [...c.pages];
		const j = i + dir;
		if (j < 0 || j >= pages.length) return c;
		[pages[i], pages[j]] = [pages[j], pages[i]];
		return {
			...c,
			pages
		};
	});
	const add = () => setCfg((c) => ({
		...c,
		pages: [...c.pages, {
			id: `p-${Date.now()}`,
			path: "/",
			title: "صفحه جدید",
			description: "",
			sitelink: true,
			inSitemap: true,
			priority: "0.8",
			changefreq: "weekly"
		}]
	}));
	const base = normalizeBase(cfg.siteUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-extrabold text-[#0b1e3f] flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-6 h-6" }), " سئو و نمایش صفحات در نتایج گوگل"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-slate-500 mt-1",
				children: "صفحه‌هایی که می‌خواهید زیر دامنه اصلی در نتایج گوگل (سایت‌لینک) دیده شوند را اینجا بسازید و مرتب کنید."
			})] }), tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: async () => {
					const r = await adminWriteSetting("seo_config", cfg);
					setMsg(r.error ? "ذخیره نشد." : "ذخیره شد ✓ (نقشه سایت به‌روز شد)");
				},
				className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("settings"),
					className: `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${tab === "settings" ? "bg-[#0b1e3f] text-white" : "border border-slate-300 bg-white text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" }), " تنظیمات سئو و سایت‌لینک"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("competitor"),
					className: `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${tab === "competitor" ? "bg-[#0b1e3f] text-white" : "border border-slate-300 bg-white text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "w-4 h-4" }), " آنالیز وب‌سایت رقیب"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("aikeys"),
					className: `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${tab === "aikeys" ? "bg-[#0b1e3f] text-white" : "border border-slate-300 bg-white text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4 h-4" }), " کلیدهای هوش مصنوعی"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("gsc"),
					className: `flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${tab === "gsc" ? "bg-[#0b1e3f] text-white" : "border border-slate-300 bg-white text-slate-600"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4" }), " سرچ کنسول گوگل"]
				})
			]
		}),
		tab === "competitor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompetitorPane, {}),
		tab === "aikeys" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiKeysPane, {}),
		tab === "gsc" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchConsolePane, {}),
		tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid md:grid-cols-2 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "آدرس دامنه اصلی (با https)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							placeholder: "https://example.ir",
							value: cfg.siteUrl,
							onChange: (e) => setCfg({
								...cfg,
								siteUrl: e.target.value
							}),
							className: inputCls$3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نام سایت (برای گوگل)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.siteName,
							onChange: (e) => setCfg({
								...cfg,
								siteName: e.target.value
							}),
							className: inputCls$3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "عنوان پیش‌فرض صفحه اصلی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cfg.defaultTitle,
							onChange: (e) => setCfg({
								...cfg,
								defaultTitle: e.target.value
							}),
							className: inputCls$3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "آدرس جستجوی داخلی (اختیاری)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							dir: "ltr",
							placeholder: "https://example.ir/search?q={search_term_string}",
							value: cfg.searchUrlTemplate,
							onChange: (e) => setCfg({
								...cfg,
								searchUrlTemplate: e.target.value
							}),
							className: inputCls$3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "توضیح پیش‌فرض (متنی که زیر عنوان در گوگل دیده می‌شود)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: cfg.defaultDescription,
							onChange: (e) => setCfg({
								...cfg,
								defaultDescription: e.target.value
							}),
							className: inputCls$3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex flex-wrap gap-3 text-[11px] text-slate-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								dir: "ltr",
								href: "/sitemap.xml",
								target: "_blank",
								rel: "noreferrer",
								className: "flex items-center gap-1 text-[#0b1e3f] font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), " /sitemap.xml"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								dir: "ltr",
								href: "/robots.txt",
								target: "_blank",
								rel: "noreferrer",
								className: "flex items-center gap-1 text-[#0b1e3f] font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), " /robots.txt"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "پس از ذخیره، نقشه سایت را در Google Search Console ثبت کنید تا صفحات سریع‌تر ایندکس شوند." })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-slate-200 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-extrabold text-[#0b1e3f]",
						children: "صفحات سایت (ترتیب = اولویت نمایش زیر نتیجه اصلی)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: add,
						className: "flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن صفحه"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: cfg.pages.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-2 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									dir: "ltr",
									value: p.path,
									onChange: (e) => setPage(i, { path: e.target.value }),
									className: inputCls$3,
									placeholder: "/insurance"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: p.title,
									onChange: (e) => setPage(i, { title: e.target.value }),
									className: inputCls$3,
									placeholder: "عنوان"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: p.description,
									onChange: (e) => setPage(i, { description: e.target.value }),
									className: inputCls$3,
									placeholder: "توضیح کوتاه"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-3 flex items-center justify-between gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: p.sitelink,
											onChange: (e) => setPage(i, { sitelink: e.target.checked })
										}), "زیر نتیجه گوگل"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: p.inSitemap !== false,
											onChange: (e) => setPage(i, { inSitemap: e.target.checked })
										}), "نقشه سایت"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => move(i, -1),
												className: "p-1.5 rounded-lg hover:bg-slate-100",
												"aria-label": "بالا",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-4 h-4 text-slate-500" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => move(i, 1),
												className: "p-1.5 rounded-lg hover:bg-slate-100",
												"aria-label": "پایین",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-4 h-4 text-slate-500" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setCfg((c) => ({
													...c,
													pages: c.pages.filter((_, idx) => idx !== i)
												})),
												className: "p-1.5 rounded-lg hover:bg-rose-50",
												"aria-label": "حذف",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-rose-500" })
											})
										]
									})
								]
							}),
							base && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								dir: "ltr",
								className: "md:col-span-12 text-[11px] text-slate-400",
								children: [base, p.path]
							})
						]
					}, p.id))
				})]
			})
		] })
	] });
}
var inputCls$2 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls$1 = "bg-white rounded-2xl border border-slate-200 p-5";
var MEDIA_FOLDERS = [
	"media",
	"images",
	"banners",
	"misc"
];
var emptyImage = () => ({
	url: "",
	label: "تصویر جدید",
	zoom: 100,
	posX: 50,
	posY: 50
});
/** Editable background (image list + zoom + timed / calendar slideshow) for the wheel section. */
function WheelBackgroundEditor() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_WHEEL_BACKGROUND);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [folder, setFolder] = (0, import_react.useState)("media");
	const [assets, setAssets] = (0, import_react.useState)([]);
	const [pickerFor, setPickerFor] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			setCfg(await adminReadSetting("wheel_background", DEFAULT_WHEEL_BACKGROUND));
		})();
	}, []);
	async function loadAssets() {
		try {
			const json = await (await fetch(`/api/admin/assets?folder=${encodeURIComponent(folder)}`)).json();
			setAssets((json.files ?? []).filter((f) => !f.mime?.startsWith("video/")));
		} catch {
			setAssets([]);
		}
	}
	(0, import_react.useEffect)(() => {
		if (pickerFor !== null) loadAssets();
	}, [pickerFor, folder]);
	const patch = (i, p) => setCfg((c) => ({
		...c,
		images: c.images.map((im, idx) => idx === i ? {
			...im,
			...p
		} : im)
	}));
	async function save() {
		setBusy(true);
		setMsg("");
		const r = await adminWriteSetting("wheel_background", cfg);
		setBusy(false);
		setMsg(r.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
	}
	const previewIndex = pickWheelBgIndex(cfg, /* @__PURE__ */ new Date(), 0);
	const preview = cfg.images[previewIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cardCls$1,
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-extrabold text-[#0b1e3f]",
					children: "تصویر پس‌زمینه سکشن «خدمات بیمه‌ای»"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCfg((c) => ({
							...c,
							images: [...c.images, emptyImage()]
						})),
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " تصویر جدید"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void save(),
						disabled: busy,
						className: "flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500 leading-6 mb-4",
				children: "تصویرها را از «کتابخانه رسانه» انتخاب کنید یا نشانی آن‌ها را بچسبانید. برای هر تصویر می‌توانید بزرگ‌نمایی و مرکز کادر را تنظیم کنید و نوع چرخش را روی اسلاید زمان‌دار، ساعتی، روزانه، ماهانه یا فصلی بگذارید (مناسب بنر ویژه و تصویر طبیعت در فصل‌های سال)."
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نوع چرخش"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: cfg.mode,
							onChange: (e) => setCfg({
								...cfg,
								mode: e.target.value
							}),
							className: inputCls$2,
							children: WHEEL_BG_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.v,
								children: m.label
							}, m.v))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "زمان هر اسلاید (ثانیه)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 2,
							max: 600,
							value: Math.round((cfg.intervalMs || 8e3) / 1e3),
							onChange: (e) => setCfg({
								...cfg,
								intervalMs: Math.max(2, Number(e.target.value)) * 1e3
							}),
							className: inputCls$2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "سرعت محوشدن (میلی‌ثانیه)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							max: 4e3,
							step: 100,
							value: cfg.fadeMs,
							onChange: (e) => setCfg({
								...cfg,
								fadeMs: Number(e.target.value)
							}),
							className: inputCls$2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: "نحوه پرشدن کادر"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: cfg.fit,
							onChange: (e) => setCfg({
								...cfg,
								fit: e.target.value
							}),
							className: inputCls$2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cover",
								children: "پر کردن کامل"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "contain",
								children: "نمایش کامل تصویر"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-bold text-slate-600 mb-1",
							children: [
								"شفافیت پرده سفید: ",
								cfg.overlay,
								"%"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 90,
							value: cfg.overlay,
							onChange: (e) => setCfg({
								...cfg,
								overlay: Number(e.target.value)
							}),
							className: "w-full"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs font-bold text-slate-600 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: cfg.enabled,
					onChange: (e) => setCfg({
						...cfg,
						enabled: e.target.checked
					})
				}), "نمایش تصویر پس‌زمینه روی سایت"]
			}),
			preview?.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-2xl overflow-hidden border border-slate-200 h-40 relative bg-slate-100",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-no-repeat",
						style: {
							backgroundImage: `url("${preview.url}")`,
							backgroundSize: cfg.fit === "contain" ? "contain" : "cover",
							backgroundPosition: `${preview.posX}% ${preview.posY}%`,
							transform: `scale(${Math.max(50, preview.zoom) / 100})`,
							transformOrigin: `${preview.posX}% ${preview.posY}%`
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-white",
						style: { opacity: cfg.overlay / 100 }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute bottom-2 right-2 text-[11px] bg-white/80 rounded px-2 py-1 font-bold",
						children: ["پیش‌نمایش تصویر فعال: ", preview.label]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [cfg.images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-slate-200 rounded-xl p-3 grid md:grid-cols-12 gap-3 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2 h-16 rounded-lg bg-slate-100 overflow-hidden",
							children: img.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img.url,
								alt: "",
								className: "h-full w-full object-cover"
							}) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "نام تصویر"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: img.label,
								onChange: (e) => patch(i, { label: e.target.value }),
								className: inputCls$2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: "نشانی تصویر"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: img.url,
								onChange: (e) => patch(i, { url: e.target.value }),
								placeholder: "/api/public/asset/media/...",
								className: inputCls$2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2 flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPickerFor(pickerFor === i ? null : i),
								className: "flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-2 py-2 text-[11px] font-bold text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "w-3.5 h-3.5" }), " کتابخانه"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCfg((c) => ({
									...c,
									images: c.images.filter((_, idx) => idx !== i)
								})),
								className: "p-2 rounded-lg text-rose-600 hover:bg-rose-50",
								"aria-label": "حذف",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: [
									"بزرگ‌نمایی: ",
									img.zoom,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 100,
								max: 300,
								value: img.zoom,
								onChange: (e) => patch(i, { zoom: Number(e.target.value) }),
								className: "w-full"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: [
									"مرکز افقی: ",
									img.posX,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 100,
								value: img.posX,
								onChange: (e) => patch(i, { posX: Number(e.target.value) }),
								className: "w-full"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "md:col-span-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-bold text-slate-600 mb-1",
								children: [
									"مرکز عمودی: ",
									img.posY,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 100,
								value: img.posY,
								onChange: (e) => patch(i, { posY: Number(e.target.value) }),
								className: "w-full"
							})]
						}),
						pickerFor === i && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-12 border-t border-slate-200 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: folder,
									onChange: (e) => setFolder(e.target.value),
									className: "text-xs rounded-lg border border-slate-300 px-2 py-1.5 bg-white",
									children: MEDIA_FOLDERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: f,
										children: f
									}, f))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void loadAssets(),
									className: "inline-flex items-center gap-1 text-[11px] font-bold text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " بازخوانی"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto",
								children: [assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										patch(i, {
											url: a.url,
											label: img.label || a.name
										});
										setPickerFor(null);
									},
									className: "rounded-lg overflow-hidden border border-slate-200 hover:border-red-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: a.url,
										alt: a.name,
										loading: "lazy",
										className: "h-16 w-full object-cover"
									})
								}, a.path)), assets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 col-span-full",
									children: "در این پوشه تصویری نیست."
								})]
							})]
						})
					]
				}, i)), cfg.images.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 bg-slate-50 rounded-xl p-6 text-center",
					children: "هنوز تصویری اضافه نشده؛ تا زمانی که تصویری ثبت نشود، پس‌زمینه فعلی سایت نمایش داده می‌شود."
				})]
			})
		]
	});
}
var inputCls$1 = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
var cardCls = "bg-white rounded-2xl border border-slate-200 p-5";
async function uploadFile(file, folder) {
	const fd = new FormData();
	fd.append("file", file);
	fd.append("folder", folder);
	const res = await fetch("/api/admin/upload", {
		method: "POST",
		body: fd
	});
	if (!res.ok) throw new Error(await res.text());
	return (await res.json()).url;
}
function Row({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] font-bold text-slate-600 mb-1",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[10px] text-slate-400 mt-1 leading-5",
				children: hint
			})
		]
	});
}
/** Floating buy-online button + wheel center logo settings. */
function WheelPane() {
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULT_WHEEL_INTRO);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			setCfg(await adminReadSetting("wheel_intro", DEFAULT_WHEEL_INTRO));
		})();
	}, []);
	const save = async () => {
		setBusy(true);
		setMsg("");
		const r = await adminWriteSetting("wheel_intro", cfg);
		setBusy(false);
		setMsg(r.error ? "خطا در ذخیره‌سازی" : "ذخیره شد و روی سایت اعمال شد ✓");
	};
	const move = (clientX, clientY) => {
		const el = stageRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const x = Math.round((clientX - r.left - r.width / 2) / r.width * 200);
		const y = Math.round((clientY - r.top - r.height / 2) / r.height * 200);
		setCfg((p) => ({
			...p,
			buttonX: Math.max(-120, Math.min(120, x)),
			buttonY: Math.max(-120, Math.min(120, y))
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: async (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					setBusy(true);
					try {
						const url = await uploadFile(f, "wheel");
						setCfg((p) => ({
							...p,
							centerImageUrl: url
						}));
					} catch {
						setMsg("آپلود ناموفق بود");
					}
					setBusy(false);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelBackgroundEditor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "دکمه شناور «خرید آنلاین»"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "دکمه را داخل کادر پیش‌نمایش بکشید تا جای آن روی پس‌زمینه چرخ‌وفلک تعیین شود؛ اندازه و حالت شناور را هم می‌توانید تغییر دهید."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-[320px_1fr] gap-5 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: stageRef,
							className: "relative aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden select-none",
							onMouseMove: (e) => dragging.current && move(e.clientX, e.clientY),
							onMouseUp: () => dragging.current = false,
							onMouseLeave: () => dragging.current = false,
							onTouchMove: (e) => {
								const t = e.touches[0];
								if (dragging.current && t) move(t.clientX, t.clientY);
							},
							onTouchEnd: () => dragging.current = false,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[8%] rounded-full border-2 border-dashed border-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onMouseDown: () => dragging.current = true,
									onTouchStart: () => dragging.current = true,
									className: "cursor-move rounded-full px-5 py-2.5 text-white font-extrabold text-xs bg-gradient-to-l from-red-700 to-red-500 shadow-lg ring-4 ring-white/70",
									style: { transform: `translate(${cfg.buttonX}%, ${cfg.buttonY}%) scale(${cfg.buttonScale})` },
									children: cfg.buttonText || "خرید آنلاین بیمه"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "متن دکمه",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: cfg.buttonText,
										onChange: (e) => setCfg({
											...cfg,
											buttonText: e.target.value
										}),
										className: inputCls$1
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "متن زیر دکمه",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: cfg.hintText,
										onChange: (e) => setCfg({
											...cfg,
											hintText: e.target.value
										}),
										className: inputCls$1
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `اندازه دکمه: ${Math.round(cfg.buttonScale * 100)}%`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 50,
										max: 200,
										step: 5,
										value: Math.round(cfg.buttonScale * 100),
										onChange: (e) => setCfg({
											...cfg,
											buttonScale: Number(e.target.value) / 100
										}),
										className: "w-full"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "حالت شناور (بالا و پایین رفتن آرام)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: cfg.float ? "1" : "0",
										onChange: (e) => setCfg({
											...cfg,
											float: e.target.value === "1"
										}),
										className: inputCls$1,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "فعال"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "0",
											children: "غیرفعال"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `جابجایی افقی: ${cfg.buttonX}%`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -120,
										max: 120,
										value: cfg.buttonX,
										onChange: (e) => setCfg({
											...cfg,
											buttonX: Number(e.target.value)
										}),
										className: "w-full"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `جابجایی عمودی: ${cfg.buttonY}%`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -120,
										max: 120,
										value: cfg.buttonY,
										onChange: (e) => setCfg({
											...cfg,
											buttonY: Number(e.target.value)
										}),
										className: "w-full"
									})
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "نمایش سکشن در صفحات داخلی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "در صفحه اصلی این سکشن همیشه کامل نمایش داده می‌شود. برای صفحات دیگر می‌توانید حالت جمع‌شده، پنجره پاپ‌آپ یا دایره کوچک شناور را انتخاب کنید؛ کاربر با یک کلیک آن را باز و با «بستن» به حالت اول برمی‌گرداند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "حالت نمایش در صفحات داخلی",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: cfg.innerMode ?? "collapse",
									onChange: (e) => setCfg({
										...cfg,
										innerMode: e.target.value
									}),
									className: inputCls$1,
									children: WHEEL_INNER_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m.v,
										children: m.label
									}, m.v))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "متن نوار / دکمه بازکننده",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: cfg.innerLabel ?? "",
									onChange: (e) => setCfg({
										...cfg,
										innerLabel: e.target.value
									}),
									className: inputCls$1
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `سرعت انیمیشن: ${cfg.innerAnimMs ?? 500} میلی‌ثانیه`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 150,
									max: 1200,
									step: 50,
									value: cfg.innerAnimMs ?? 500,
									onChange: (e) => setCfg({
										...cfg,
										innerAnimMs: Number(e.target.value)
									}),
									className: "w-full"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "نوار اعلان (حلقه‌وار)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "با نوار زیر می‌توانید فاصله خالی بین آخرین اعلان و بازگشت اعلان اول را کم و زیاد کنید؛ منوی شماتیک، سهم اعلان‌ها (قرمز) و فضای خالی (خاکستری) را در یک دور کامل نشان می‌دهد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 items-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `فاصله خالی تا اعلان اول: ${cfg.tickerGapPx ?? 320}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 1600,
									step: 20,
									value: cfg.tickerGapPx ?? 320,
									onChange: (e) => setCfg({
										...cfg,
										tickerGapPx: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `زمان یک دور کامل: ${cfg.tickerSpeedSec ?? 40} ثانیه`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 10,
									max: 120,
									step: 1,
									value: cfg.tickerSpeedSec ?? 40,
									onChange: (e) => setCfg({
										...cfg,
										tickerSpeedSec: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "نمایش منوی شماتیک زیر نوار",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: cfg.tickerSchematic ?? true ? "1" : "0",
									onChange: (e) => setCfg({
										...cfg,
										tickerSchematic: e.target.value === "1"
									}),
									className: inputCls$1,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "فعال"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "غیرفعال"
									})]
								})
							})
						]
					}),
					(() => {
						const gap = cfg.tickerGapPx ?? 320;
						const share = Math.min(60, Math.round(gap / (gap + 2940) * 100));
						const secs = Math.round((cfg.tickerSpeedSec ?? 40) * share / 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 flex items-center gap-[2px] h-2",
									children: [Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1 h-full rounded-full bg-red-400/80" }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-full rounded-full bg-slate-300",
										style: {
											width: `${share}%`,
											minWidth: 6
										}
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold text-slate-500 tabular-nums",
									children: [share, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-slate-500 mt-2",
								children: [
									"حدوداً ",
									secs,
									" ثانیه فضای خالی پیش از ورود اعلان اول."
								]
							})]
						});
					})()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "دایره وسط چرخ‌وفلک (لوگو و نوشته‌ها)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "می‌توانید به‌جای آیکن سپر، لوگو یا عکس دلخواه آپلود کنید و عنوان و زیرعنوان وسط چرخ را تغییر دهید."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-4 gap-3 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-slate-200 bg-slate-50 aspect-square grid place-items-center overflow-hidden",
							children: cfg.centerImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cfg.centerImageUrl,
								alt: "",
								className: "w-full h-full object-contain p-3"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-7 h-7 text-slate-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-3 grid sm:grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "آدرس تصویر / لوگو",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										dir: "ltr",
										value: cfg.centerImageUrl,
										onChange: (e) => setCfg({
											...cfg,
											centerImageUrl: e.target.value
										}),
										className: inputCls$1
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `اندازه تصویر: ${cfg.centerImageSize}px`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 32,
										max: 140,
										value: cfg.centerImageSize,
										onChange: (e) => setCfg({
											...cfg,
											centerImageSize: Number(e.target.value)
										}),
										className: "w-full"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "عنوان وسط چرخ",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: cfg.centerTitle,
										onChange: (e) => setCfg({
											...cfg,
											centerTitle: e.target.value
										}),
										className: inputCls$1
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "زیرعنوان وسط چرخ",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: cfg.centerSubtitle,
										onChange: (e) => setCfg({
											...cfg,
											centerSubtitle: e.target.value
										}),
										className: inputCls$1
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => fileRef.current?.click(),
										className: "text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }), " آپلود تصویر"]
									}), cfg.centerImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setCfg({
											...cfg,
											centerImageUrl: ""
										}),
										className: "text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), " حذف تصویر"]
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cardCls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-[#0b1e3f] mb-1",
						children: "عقربه و نوشته وسط چرخ‌وفلک (دسکتاپ / تبلت / موبایل)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 leading-6 mb-4",
						children: "طول عقربه و جای نوشته‌های وسط چرخ را برای هر اندازه صفحه جداگانه تنظیم کنید. این تنظیم‌ها فقط ظاهر را تغییر می‌دهند و روی حرکت عقربه با موس یا لمس هیچ اثری ندارند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `طول عقربه در دسکتاپ: ${cfg.needleLenDesktop ?? 150}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 40,
									max: 260,
									value: cfg.needleLenDesktop ?? 150,
									onChange: (e) => setCfg({
										...cfg,
										needleLenDesktop: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `طول عقربه در تبلت: ${cfg.needleLenTablet ?? 120}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 40,
									max: 260,
									value: cfg.needleLenTablet ?? 160,
									onChange: (e) => setCfg({
										...cfg,
										needleLenTablet: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `طول عقربه در موبایل: ${cfg.needleLenMobile ?? 95}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 30,
									max: 220,
									value: cfg.needleLenMobile ?? 95,
									onChange: (e) => setCfg({
										...cfg,
										needleLenMobile: Number(e.target.value)
									}),
									className: "w-full"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-3 gap-3 mt-4",
						children: [
							"Desktop",
							"Tablet",
							"Mobile"
						].map((suffix) => {
							const radiusKey = `wheelRadius${suffix}`;
							const sizeKey = `wheelItemSize${suffix}`;
							const imageKey = `centerImageSize${suffix}`;
							const label = suffix === "Desktop" ? "دسکتاپ" : suffix === "Tablet" ? "تبلت" : "موبایل";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 rounded-xl border border-slate-200 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: `شعاع حلقه در ${label}: ${cfg[radiusKey] ?? DEFAULT_WHEEL_INTRO[radiusKey]}%`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 25,
											max: 45,
											value: cfg[radiusKey] ?? DEFAULT_WHEEL_INTRO[radiusKey],
											onChange: (e) => setCfg({
												...cfg,
												[radiusKey]: Number(e.target.value)
											}),
											className: "w-full"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: `اندازه آیکن در ${label}: ${cfg[sizeKey] ?? DEFAULT_WHEEL_INTRO[sizeKey]}px`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 34,
											max: 84,
											value: cfg[sizeKey] ?? DEFAULT_WHEEL_INTRO[sizeKey],
											onChange: (e) => setCfg({
												...cfg,
												[sizeKey]: Number(e.target.value)
											}),
											className: "w-full"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: `اندازه تصویر مرکز در ${label}: ${cfg[imageKey] ?? DEFAULT_WHEEL_INTRO[imageKey]}px`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 28,
											max: 120,
											value: cfg[imageKey] ?? DEFAULT_WHEEL_INTRO[imageKey],
											onChange: (e) => setCfg({
												...cfg,
												[imageKey]: Number(e.target.value)
											}),
											className: "w-full"
										})
									})
								]
							}, suffix);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-3 gap-3 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی افقی نوشته (دسکتاپ): ${cfg.centerTextXDesktop ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextXDesktop ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextXDesktop: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی افقی نوشته (تبلت): ${cfg.centerTextXTablet ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextXTablet ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextXTablet: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی افقی نوشته (موبایل): ${cfg.centerTextXMobile ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextXMobile ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextXMobile: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی عمودی نوشته (دسکتاپ): ${cfg.centerTextYDesktop ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextYDesktop ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextYDesktop: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی عمودی نوشته (تبلت): ${cfg.centerTextYTablet ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextYTablet ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextYTablet: Number(e.target.value)
									}),
									className: "w-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `جابجایی عمودی نوشته (موبایل): ${cfg.centerTextYMobile ?? 0}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -60,
									max: 60,
									value: cfg.centerTextYMobile ?? 0,
									onChange: (e) => setCfg({
										...cfg,
										centerTextYMobile: Number(e.target.value)
									}),
									className: "w-full"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: save,
					disabled: busy,
					className: "bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " ذخیره تنظیمات"]
				}), msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-emerald-600",
					children: msg
				})]
			})
		]
	});
}
var FOLDERS = [
	"media",
	"images",
	"videos",
	"banners",
	"branding",
	"misc"
];
var inputCls = "text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";
function human(size) {
	if (!size) return "-";
	if (size < 1048576) return `${Math.round(size / 1024)} KB`;
	return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
/** Uploads one file with a real progress percentage. */
function uploadOne(file, folder, onProgress) {
	return new Promise((resolve, reject) => {
		const form = new FormData();
		form.append("file", file);
		form.append("folder", folder);
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/api/admin/upload");
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100));
		};
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress(100);
				resolve();
			} else reject(/* @__PURE__ */ new Error(`${xhr.status}`));
		};
		xhr.onerror = () => reject(/* @__PURE__ */ new Error("network"));
		xhr.send(form);
	});
}
/** Media library for the site-assets storage bucket: upload, replace, delete, copy URL. */
function MediaPane() {
	const [folder, setFolder] = (0, import_react.useState)("media");
	const [items, setItems] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const [copiedPath, setCopiedPath] = (0, import_react.useState)("");
	const [progress, setProgress] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	async function load() {
		setBusy(true);
		try {
			const json = await (await fetch(`/api/admin/assets?folder=${encodeURIComponent(folder)}`)).json();
			if (json.error) setMsg(json.error);
			setItems(json.files ?? []);
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "خطا در دریافت فهرست فایل‌ها");
		} finally {
			setBusy(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [folder]);
	async function upload(files) {
		if (!files?.length) return;
		const list = Array.from(files);
		setBusy(true);
		setMsg("");
		let done = 0;
		for (let i = 0; i < list.length; i += 1) {
			const file = list[i];
			setProgress({
				name: file.name,
				index: i + 1,
				total: list.length,
				percent: 0,
				stage: "در حال آپلود…"
			});
			try {
				await uploadOne(file, folder, (percent) => setProgress({
					name: file.name,
					index: i + 1,
					total: list.length,
					percent,
					stage: percent < 100 ? "در حال آپلود…" : "در حال ذخیره در فضای سایت…"
				}));
				done += 1;
			} catch (e) {
				setMsg(`آپلود ${file.name} ناموفق بود (${e instanceof Error ? e.message : "خطا"})`);
			}
		}
		setProgress(null);
		setBusy(false);
		if (done) setMsg(`${done} فایل با موفقیت ذخیره شد ✓`);
		if (fileRef.current) fileRef.current.value = "";
		load();
	}
	async function remove(path) {
		if (!window.confirm(`حذف قطعی «${path}»؟`)) return;
		setBusy(true);
		const res = await fetch("/api/admin/assets", {
			method: "DELETE",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ paths: [path] })
		});
		setBusy(false);
		setMsg(res.ok ? "حذف شد ✓" : "حذف ناموفق بود.");
		load();
	}
	async function copy(it) {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}${it.url}`);
			setCopiedPath(it.path);
			setMsg("کپی با موفقیت انجام شد ✓");
			window.setTimeout(() => setCopiedPath(""), 2e3);
		} catch {
			setMsg("کپی انجام نشد؛ نشانی را دستی انتخاب کنید.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4 text-slate-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputCls,
							value: folder,
							onChange: (e) => setFolder(e.target.value),
							children: FOLDERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: f,
								children: f
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							multiple: true,
							accept: "image/*,video/*",
							className: "hidden",
							onChange: (e) => void upload(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy,
							onClick: () => fileRef.current?.click(),
							className: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " آپلود عکس / ویدئو"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy,
							onClick: () => void load(),
							className: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " بازخوانی"]
						}),
						msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-600",
							children: msg
						}) : null
					]
				}),
				progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-blue-200 bg-blue-50/60 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1.5 flex items-center justify-between gap-2 text-[11px] font-bold text-blue-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: [
									"فایل ",
									progress.index,
									" از ",
									progress.total,
									" — ",
									progress.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [progress.percent, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-blue-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-blue-600 transition-[width] duration-200",
								style: { width: `${progress.percent}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[10px] text-blue-700",
							children: progress.stage
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] leading-5 text-slate-500",
					children: [
						"فایل‌ها در فضای ذخیره‌سازی سایت (باکت ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "site-assets" }),
						") نگه‌داری می‌شوند. حداکثر حجم: عکس ۱۶ مگابایت، ویدئو ۱۰۰ مگابایت. برای استفاده در صفحات، نشانی فایل را کپی کنید."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
			children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-slate-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-square bg-slate-100",
					children: it.mime?.startsWith("video/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: it.url,
						muted: true,
						playsInline: true,
						preload: "metadata",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: it.url,
						alt: it.name,
						loading: "lazy",
						className: "h-full w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 p-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[10px] font-bold text-slate-800",
							title: it.name,
							children: it.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-slate-500",
							children: human(it.size)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void copy(it),
								title: "کپی نشانی فایل",
								className: `inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border px-1.5 py-1 text-[10px] font-bold transition ${copiedPath === it.path ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`,
								children: copiedPath === it.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " کپی شد"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " کپی"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void remove(it.path),
								title: "حذف فایل",
								className: "inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-1.5 py-1 text-[10px] font-bold text-red-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
							})]
						})
					]
				})]
			}, it.path)), !items.length && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500",
				children: "در این پوشه فایلی موجود نیست."
			}) : null]
		})]
	});
}
var ENV_LABELS = {
	SUPABASE_URL: "نشانی بک‌اند",
	SUPABASE_PUBLISHABLE_KEY: "کلید عمومی",
	SUPABASE_SERVICE_ROLE_KEY: "کلید سرور (لازم برای آپلود و حذف فایل)",
	SESSION_SECRET: "کلید رمزنگاری نشست پیشخوان"
};
/** Backend (database + storage) connection panel: health, buckets and table row counts. */
function BackendPane() {
	const [status, setStatus] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [target, setTarget] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("lovable");
	const [form, setForm] = (0, import_react.useState)({
		url: "",
		serviceKey: "",
		bucket: "site-assets"
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function loadTarget() {
		try {
			const t = await storageTargetInfo();
			setTarget(t);
			setMode(t.custom ? "personal" : "lovable");
			setForm((f) => ({
				...f,
				url: t.url,
				bucket: t.bucket
			}));
		} catch {}
	}
	async function save() {
		setSaving(true);
		try {
			const res = await saveStorageTarget({ data: {
				...form,
				mode
			} });
			if (!res.ok) notify({
				kind: "error",
				title: "ذخیره نشد",
				detail: res.error
			});
			else {
				notify({
					kind: "success",
					title: mode === "personal" ? "اتصال شخصی ذخیره و آزمایش شد" : "ذخیره‌سازی روی بک‌اند لاوابل تنظیم شد"
				});
				await loadTarget();
				await load();
			}
		} catch (e) {
			notify({
				kind: "error",
				title: "خطا",
				detail: e instanceof Error ? e.message : ""
			});
		} finally {
			setSaving(false);
		}
	}
	async function reset() {
		setSaving(true);
		try {
			await clearStorageTarget();
			setForm({
				url: "",
				serviceKey: "",
				bucket: "site-assets"
			});
			setMode("lovable");
			notify({
				kind: "success",
				title: "به بک‌اند پیش‌فرض برگشت"
			});
			await loadTarget();
		} finally {
			setSaving(false);
		}
	}
	async function load() {
		setBusy(true);
		try {
			const res = await fetch("/api/admin/backend");
			setStatus(await res.json());
		} catch (e) {
			setStatus({
				env: {},
				buckets: [],
				tables: [],
				error: e instanceof Error ? e.message : "خطا در دریافت وضعیت"
			});
		} finally {
			setBusy(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
		loadTarget();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-slate-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-extrabold text-slate-800",
								children: "اتصال بک‌اند (دیتابیس و فضای فایل)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void load(),
								className: "mr-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " بررسی وضعیت"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] leading-5 text-slate-500",
						children: [
							"اگر دکمه آپلود در نسخه منتشرشده روی Cloudflare خطا می‌دهد، دلیلش نبودن «کلید سرور» در متغیرهای محیطی Worker است. کافی است مقدارهای ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SUPABASE_URL" }),
							"،",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SUPABASE_SERVICE_ROLE_KEY" }),
							"، ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SUPABASE_PUBLISHABLE_KEY" }),
							" و",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SESSION_SECRET" }),
							" در تنظیمات همان Worker ثبت شوند؛ سپس این صفحه باید همه موارد را «تنظیم شده» نشان دهد."
						]
					}),
					status?.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700",
						children: status.error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: Object.entries(status?.env ?? {}).map(([k, ok]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2",
							children: [
								ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-red-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-800",
									children: ENV_LABELS[k] ?? k
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-auto text-[11px] text-slate-500",
									children: ok ? "تنظیم شده" : "تنظیم نشده"
								})
							]
						}, k))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-extrabold text-slate-800",
							children: "اتصال Supabase شخصی (برای فایل و عکس)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] leading-5 text-slate-500",
						children: [
							"پروژه فعلی فایل‌ها را روی این سرویس ذخیره می‌کند:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "font-mono text-slate-700",
								children: target?.host || "—"
							}),
							" ",
							target?.custom ? "(اکانت شخصی شما)" : "(بک‌اند پیش‌فرض پروژه)",
							". برای استفاده از اکانت Supabase خودتان، نشانی پروژه و کلید ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "service_role" }),
							" را وارد کنید؛ از آن پس آپلود، حذف و مشاهده فایل‌ها از همان اکانت انجام می‌شود."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-slate-700",
							children: "فایل‌ها و عکس‌ها کجا ذخیره شوند؟"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: mode,
							onChange: (e) => setMode(e.target.value),
							className: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "lovable",
								children: "فضای پیش‌فرض پروژه (ساخته‌شده توسط لاوابل)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "personal",
								children: "اکانت Supabase شخصی خودم"
							})]
						})]
					}),
					mode === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: form.url,
								onChange: (e) => setForm({
									...form,
									url: e.target.value
								}),
								placeholder: "https://xxxx.supabase.co",
								className: "rounded-xl border border-slate-300 px-3 py-2 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								value: form.bucket,
								onChange: (e) => setForm({
									...form,
									bucket: e.target.value
								}),
								placeholder: "site-assets",
								className: "rounded-xl border border-slate-300 px-3 py-2 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								dir: "ltr",
								type: "password",
								value: form.serviceKey,
								onChange: (e) => setForm({
									...form,
									serviceKey: e.target.value
								}),
								placeholder: "service_role secret key",
								className: "sm:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-xs"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "پیام «ذخیره شد» فقط زمانی نمایش داده می‌شود که اتصال آزمایش و ثبت آن در دیتابیس تأیید شده باشد؛ در غیر این صورت دلیل خطا نشان داده می‌شود."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: saving,
							onClick: () => void save(),
							className: "rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50",
							children: "ذخیره و آزمایش اتصال"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: saving,
							onClick: () => void reset(),
							className: "rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50",
							children: "بازگشت به بک‌اند پیش‌فرض"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-extrabold text-slate-800",
							children: "باکت‌های فایل"
						})]
					}),
					status?.buckets.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-wrap gap-2",
						children: status.buckets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700",
							children: [
								b.name,
								" — ",
								b.public ? "عمومی" : "خصوصی"
							]
						}, b.name))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "باکتی یافت نشد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500",
						children: "ویرایش دستی عکس و ویدئو از منوی «کتابخانه رسانه (عکس/ویدئو)» انجام می‌شود."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-extrabold text-slate-800",
					children: "جدول‌های دیتابیس"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
					children: (status?.tables ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-800",
							children: t.table
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-500",
							children: [t.count ?? "-", " ردیف"]
						})]
					}, t.table))
				})]
			})
		]
	});
}
var SETTING_KEY = "third_party_si24";
var STATUS_LABELS = {
	attempted: "شروع ناقص",
	start_failed: "خطا در استعلام",
	started: "استعلام آغاز شد",
	vehicle_submitted: "مشخصات خودرو ثبت شد",
	price_failed: "خطا در قیمت‌گذاری",
	priced: "قیمت دریافت شد"
};
function faDate(value) {
	try {
		return new Date(value).toLocaleString("fa-IR");
	} catch {
		return value;
	}
}
function money(value) {
	return typeof value === "number" ? value.toLocaleString("fa-IR") + " ریال" : "—";
}
/** فروش آنلاین بیمه‌نامه → بیمه شخص ثالث: همهٔ درخواست‌ها + کلید اتصال سامانه */
function ThirdPartyPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)("");
	const [hasToken, setHasToken] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function load() {
		setBusy(true);
		const res = await adminDb("third_party_inquiries").select("*").order("created_at", { ascending: false }).limit(200);
		setError(res.error?.message ?? null);
		setRows(res.data ?? []);
		setBusy(false);
	}
	async function loadToken() {
		const saved = await adminReadSetting(SETTING_KEY, { token: "" });
		setHasToken(Boolean(saved.token));
		setToken(saved.token ?? "");
	}
	(0, import_react.useEffect)(() => {
		load();
		loadToken();
	}, []);
	async function saveToken() {
		setSaving(true);
		try {
			await adminWriteSetting(SETTING_KEY, { token: token.trim() });
			setHasToken(Boolean(token.trim()));
			notify({
				kind: "success",
				title: "کلید اتصال ذخیره شد"
			});
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-slate-200 bg-white p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 font-bold text-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5 text-sky-600" }), "کلید اتصال سامانه استعلام"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm leading-6 text-slate-600",
					children: "تا زمانی که این کلید ثبت نشود، مراحل استعلام و قیمت‌گذاری بیمه شخص ثالث با پیام «ارتباط با سامانه استعلام برقرار نشد» متوقف می‌شود، اما اطلاعات کاربر با شناسهٔ مستقل در همین صفحه ثبت خواهد شد."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[280px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: show ? "text" : "password",
								value: token,
								onChange: (e) => setToken(e.target.value),
								placeholder: hasToken ? "کلید ذخیره‌شده — برای تغییر مقدار جدید را وارد کنید" : "کلید اتصال را وارد کنید",
								className: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500",
								dir: "ltr"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShow((s) => !s),
								className: "absolute inset-y-0 left-2 my-auto h-6 text-slate-400",
								children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveToken,
							disabled: saving,
							className: "inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "ذخیره"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-bold ${hasToken ? "text-emerald-600" : "text-amber-600"}`,
							children: hasToken ? "ثبت شده" : "ثبت نشده"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-slate-200 bg-white p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-bold text-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-5 w-5 text-sky-600" }),
							"درخواست‌های بیمه شخص ثالث (",
							rows.length.toLocaleString("fa-IR"),
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: load,
						className: "inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${busy ? "animate-spin" : ""}` }), "به‌روزرسانی"]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700",
					children: error
				}),
				!error && rows.length === 0 && !busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-slate-50 p-4 text-sm text-slate-500",
					children: "هنوز درخواستی ثبت نشده است."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: rows.map((row) => {
						const owner = row.request_payload?.owner ?? {};
						const plaque = row.request_payload?.plaque ?? {};
						const isOpen = open === row.inquiry_id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpen(isOpen ? null : row.inquiry_id),
								className: "flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										dir: "ltr",
										children: row.reference_code ?? row.tracking_code ?? row.inquiry_id.slice(0, 8)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-slate-600",
										children: owner.mobile ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-500",
										children: faDate(row.created_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700",
										children: STATUS_LABELS[row.status ?? ""] ?? row.status ?? "—"
									})
								]
							}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["کد ملی: ", owner.nationalCode ?? "—"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["کد پستی: ", owner.postalCode ?? "—"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["تاریخ تولد: ", owner.birthDate ?? "—"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										"پلاک: ",
										plaque.segment2 ?? "—",
										" ",
										plaque.letter ?? "",
										" ",
										plaque.segment1 ?? "",
										" - ",
										plaque.region ?? ""
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["کد رهگیری سامانه: ", row.si24_tracking_code ?? "—"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["مدل خودرو: ", row.vehicle_data?.builtYear ?? "—"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["حق بیمه: ", money(row.quote_data?.premium ?? row.quote_data?.payableAmount)] }),
									row.error_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-rose-600 sm:col-span-2",
										children: ["وضعیت خطا: ", row.error_message]
									})
								]
							})]
						}, row.inquiry_id);
					})
				})
			]
		})]
	});
}
/**
* Turns any menu link into an internal site path when it points at this site,
* so pages the user adds by hand (no leading slash, or a full URL of our own
* domain) can still be opened in the visual editor. Returns null for links
* that really live on another website.
*/
function internalPath(href) {
	const raw = (href ?? "").trim();
	if (!raw) return null;
	if (raw.startsWith("/")) return raw;
	if (/^(mailto:|tel:|#|javascript:)/i.test(raw)) return null;
	if (/^https?:\/\//i.test(raw)) try {
		const u = new URL(raw);
		if (typeof window !== "undefined" && u.host === window.location.host) return u.pathname + u.search;
		return null;
	} catch {
		return null;
	}
	return "/" + raw.replace(/^\/+/, "");
}
/**
* Some menu buttons intentionally send visitors to the external checkout,
* while their editable landing page lives inside this site.
*/
function editableMenuPath(href) {
	const path = internalPath(href);
	if (path) return path;
	const raw = (href ?? "").trim();
	try {
		if (new URL(raw).hostname === "sales.si24.ir") return "/third-party";
	} catch {
		return null;
	}
	return null;
}
function Dashboard() {
	const branding = useBranding();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [editorPage, setEditorPage] = (0, import_react.useState)("/");
	const openPageInVisualEditor = (path) => {
		setEditorPage(path);
		setTab("editor");
		setSidebarOpen(false);
	};
	const [inspectorPage, setInspectorPage] = (0, import_react.useState)("/");
	const openPageInInspector = (path) => {
		setInspectorPage(path);
		setTab("inspector");
		setSidebarOpen(false);
	};
	const nav = [
		{
			key: "overview",
			label: "پیشخوان",
			icon: LayoutDashboard
		},
		{
			key: "editor",
			label: "ویرایشگر بصری سایت",
			icon: WandSparkles
		},
		{
			key: "inspector",
			label: "موس ایرادیاب و کدیاب",
			icon: Bug
		},
		{
			key: "pagebuilder",
			label: "صفحه‌ساز",
			icon: FilePlusCorner
		},
		{
			key: "pagegrabber",
			label: "دانلود صفحه (اسکریپت استخراج)",
			icon: CloudDownload
		},
		{
			key: "contacts",
			label: "درخواست‌های مشاوره",
			icon: MessageSquare
		},
		{
			key: "suggestions",
			label: "انتقادات و پیشنهادات",
			icon: MessageSquarePlus
		},
		{
			key: "applications",
			label: "درخواست همکاری",
			icon: Users
		},
		{
			key: "damages",
			label: "گزارش‌های خسارت",
			icon: TriangleAlert
		},
		{
			key: "thirdparty",
			label: "فروش آنلاین بیمه‌نامه",
			icon: Car
		},
		{
			key: "menu",
			label: "ویرایش برگها (دسکتاپ/موبایل/تبلت)",
			icon: Menu
		},
		{
			key: "footer",
			label: "فوتر و ستون‌ها",
			icon: PanelBottom
		},
		{
			key: "social",
			label: "شبکه‌های اجتماعی",
			icon: Share2
		},
		{
			key: "ai",
			label: "چت هوش مصنوعی",
			icon: Bot
		},
		{
			key: "chat",
			label: "چت روم آنلاین",
			icon: MessagesSquare
		},
		{
			key: "docs",
			label: "مخزن مدارک مشتریان",
			icon: FolderOpen
		},
		{
			key: "branding",
			label: "لوگو، آیکن‌ها و عنوان",
			icon: Image
		},
		{
			key: "medialib",
			label: "کتابخانه رسانه (عکس/ویدئو)",
			icon: Image
		},
		{
			key: "backend",
			label: "اتصال Supabase (دیتابیس و فایل)",
			icon: Database
		},
		{
			key: "telegram",
			label: "ربات تلگرام و اتوماسیون",
			icon: Send
		},
		{
			key: "seo",
			label: "سئو و نتایج گوگل",
			icon: Search
		},
		{
			key: "deploy",
			label: "انتشار در Cloudflare",
			icon: Cloud
		},
		{
			key: "github",
			label: "اتصال گیت‌هاب",
			icon: Github
		},
		{
			key: "logins",
			label: "لاگین‌ها",
			icon: Lock
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		className: "h-screen flex flex-col overflow-hidden bg-[#eef2f8] text-slate-900 font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminToaster, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "shrink-0 z-40 bg-[#0b1e3f] text-white shadow-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 md:px-6 h-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen((v) => !v),
							className: "lg:hidden p-2 rounded-lg hover:bg-white/10",
							"aria-label": "menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: branding.dashboardLogoUrl || "/assets/logoheder-DarmsdwL.png",
								alt: "پیشخوان مدیریت",
								style: { height: branding.logoHeightDashboard },
								className: "w-auto object-contain rounded-lg bg-white/95 p-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-extrabold text-sm",
									children: "پیشخوان مدیریت"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] opacity-70",
									children: "بیمه سامان — نمایندگی آذرخش"
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								await lockDashboard();
								window.location.href = "/";
							},
							className: "text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), " خروج"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition",
							children: "مشاهده سایت"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 min-h-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: `
            fixed lg:static top-16 right-0 h-[calc(100vh-4rem)] lg:h-auto w-64 shrink-0 bg-[#0b1e3f] text-white
            transition-transform lg:translate-x-0 z-30
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "p-3 flex flex-col gap-1 h-full overflow-y-auto no-scrollbar",
						children: nav.map((n) => {
							const active = tab === n.key;
							const Icon = n.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setTab(n.key);
									setSidebarOpen(false);
								},
								className: `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-right transition
                    ${active ? "bg-white text-[#0b1e3f] shadow-lg font-bold" : "text-white/80 hover:bg-white/10 hover:text-white"}
                  `,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: n.label
									}),
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
								]
							}, n.key);
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-8 lg:mr-0",
					children: [
						tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewPane, {}),
						tab === "editor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisualEditorPane, { initialPage: editorPage }),
						tab === "inspector" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectorPane, { initialPage: inspectorPage }),
						tab === "pagebuilder" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBuilderPane, {
							onOpenVisualEditor: openPageInVisualEditor,
							onOpenInspector: openPageInInspector,
							onOpenGrabber: () => {
								setTab("pagegrabber");
								setSidebarOpen(false);
							}
						}),
						tab === "pagegrabber" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageGrabberPane, { onOpenBuilder: () => {
							setTab("pagebuilder");
							setSidebarOpen(false);
						} }),
						tab === "contacts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactsPane, {}),
						tab === "suggestions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionsPane, {}),
						tab === "applications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerApplicationsPane, {}),
						tab === "damages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DamagesPane, {}),
						tab === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPane, { onOpenPage: openPageInVisualEditor }),
						tab === "footer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterPane, {}),
						tab === "logins" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginsPane, {}),
						tab === "social" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialPane, {}),
						tab === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPane, {}),
						tab === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatRoomPane, {}),
						tab === "docs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocsPane, {}),
						tab === "branding" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandingPane, {}),
						tab === "medialib" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPane, {}),
						tab === "backend" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackendPane, {}),
						tab === "thirdparty" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThirdPartyPane, {}),
						tab === "telegram" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramPane, {}),
						tab === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoPane, {}),
						tab === "deploy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeployPane, {}),
						tab === "github" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubPane, {})
					]
				})]
			})
		]
	});
}
function DashboardGate() {
	const [state, setState] = (0, import_react.useState)("loading");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		dashboardStatus().then((r) => setState(r.unlocked ? "open" : "locked"));
	}, []);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			const res = await unlockDashboard({ data: { password } });
			if (res.ok) setState("open");
			else if (res.reason === "not-configured") setError("رمز پیشخوان روی سرور تنظیم نشده است (DASHBOARD_PASSWORD).");
			else if (res.reason === "no-session-secret") setError("متغیر SESSION_SECRET روی سرور تنظیم نشده است.");
			else if (res.reason === "server-error") setError(res.message ?? "خطای سرور در بررسی رمز.");
			else setError("رمز ورود نادرست است.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "ارتباط با سرور برقرار نشد.");
		} finally {
			setBusy(false);
		}
	}
	if (state === "open") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center bg-[#0b1e3f] px-4 font-sans",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-2xl bg-[#0b1e3f] grid place-items-center text-white mx-auto mb-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-6 h-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-extrabold text-[#0b1e3f] text-center",
					children: "ورود به پیشخوان"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 text-center mt-1 mb-6",
					children: "رمز ورود را وارد کنید."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: showPassword ? "text" : "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "رمز ورود",
						autoFocus: true,
						className: "w-full text-sm rounded-xl border border-slate-300 px-4 py-3 ps-12 text-center",
						dir: "ltr"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowPassword((v) => !v),
						"aria-label": showPassword ? "پنهان کردن رمز" : "نمایش رمز",
						title: showPassword ? "پنهان کردن رمز" : "نمایش رمز",
						className: "absolute inset-y-0 left-2 my-auto h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:text-[#0b1e3f] hover:bg-slate-100",
						children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-rose-600 text-center mb-3",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy || state === "loading",
					className: "w-full bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold py-3 rounded-xl disabled:opacity-50",
					children: busy ? "در حال بررسی..." : "ورود"
				})
			]
		})
	});
}
var FONT_OPTIONS = [
	{
		v: "",
		label: "پیش‌فرض قالب"
	},
	{
		v: "Vazirmatn, sans-serif",
		label: "وزیرمتن"
	},
	{
		v: "IRANSans, Vazirmatn, sans-serif",
		label: "ایران‌سنس"
	},
	{
		v: "Tahoma, sans-serif",
		label: "Tahoma"
	},
	{
		v: "Georgia, serif",
		label: "Georgia"
	},
	{
		v: "monospace",
		label: "Monospace"
	}
];
/** Ready-made blocks that can be inserted after any selected element. */
var BLOCK_TEMPLATES = [
	{
		key: "text",
		label: "سکشن متنی ساده",
		html: `<section style="padding:32px 16px;text-align:center"><h2 style="font-weight:800;font-size:22px;color:#0b1e3f">عنوان سکشن جدید</h2><p style="margin-top:8px;color:#475569;font-size:14px">متن توضیحی این بخش را از همین‌جا ویرایش کنید.</p></section>`
	},
	{
		key: "cta",
		label: "بنر فراخوان با دکمه",
		html: `<section style="margin:24px 16px;padding:28px;border-radius:24px;background:linear-gradient(120deg,#0b1e3f,#c81e35);color:#fff;text-align:center"><h2 style="font-weight:800;font-size:20px">همین حالا مشاوره رایگان بگیرید</h2><p style="margin-top:8px;font-size:13px;opacity:.9">کارشناسان نمایندگی آذرخش پاسخگوی شما هستند.</p><a href="/contact" style="display:inline-block;margin-top:14px;background:#fff;color:#0b1e3f;font-weight:800;font-size:13px;padding:10px 22px;border-radius:999px">تماس با ما</a></section>`
	},
	{
		key: "cards",
		label: "سه کارت کنار هم",
		html: `<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:24px 16px">${[
			1,
			2,
			3
		].map((i) => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;text-align:center"><h3 style="font-weight:800;color:#0b1e3f;font-size:15px">عنوان ${i}</h3><p style="margin-top:6px;color:#64748b;font-size:12px">توضیح کوتاه</p></div>`).join("")}</section>`
	},
	{
		key: "divider",
		label: "جداکننده",
		html: `<div style="height:1px;background:#e2e8f0;margin:24px 16px"></div>`
	},
	{
		key: "image",
		label: "تصویر تمام‌عرض",
		html: `<section style="padding:16px"><img src="${logoheder_default}" alt="بیمه سامان" style="width:100%;border-radius:20px;object-fit:cover" /></section>`
	}
];
function VisualEditorPane({ initialPage = "/" }) {
	const [page, setPage] = (0, import_react.useState)(initialPage);
	const [tab, setTab] = (0, import_react.useState)("elements");
	const sitePages = useSitePages();
	const customEntries = useCustomPageEntries();
	const [pageOptions, setPageOptions] = (0, import_react.useState)(EDITOR_PAGES);
	(0, import_react.useEffect)(() => {
		setPageOptions((prev) => {
			const next = [...prev];
			for (const p of sitePages) if (!next.some((x) => x.path === p.path)) next.push(p);
			return next.length === prev.length ? prev : next;
		});
	}, [sitePages]);
	(0, import_react.useEffect)(() => {
		if (!customEntries.length) return;
		setPageOptions((prev) => {
			const next = [...prev];
			for (const p of customEntries) if (!next.some((x) => x.path === p.path)) next.push(p);
			return next.length === prev.length ? prev : next;
		});
	}, [customEntries]);
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [mode, setMode] = (0, import_react.useState)("select");
	const [currentPath, setCurrentPath] = (0, import_react.useState)("/");
	const [customPath, setCustomPath] = (0, import_react.useState)("");
	const [wide, setWide] = (0, import_react.useState)(false);
	const [sel, setSel] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)({});
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [published, setPublished] = (0, import_react.useState)(false);
	const [overlays, setOverlays] = (0, import_react.useState)([]);
	const [selOv, setSelOv] = (0, import_react.useState)(null);
	const [ovDraw, setOvDraw] = (0, import_react.useState)(false);
	const [msTool, setMsTool] = (0, import_react.useState)(false);
	const [externalLink, setExternalLink] = (0, import_react.useState)(null);
	const pendingExternalOverlay = (0, import_react.useRef)(null);
	const deviceRef = (0, import_react.useRef)("desktop");
	const pageRef = (0, import_react.useRef)("/");
	(0, import_react.useEffect)(() => {
		deviceRef.current = device;
	}, [device]);
	(0, import_react.useEffect)(() => {
		pageRef.current = page;
	}, [page]);
	const ovSaveTimer = (0, import_react.useRef)(void 0);
	/** Last overlay list actually persisted, to avoid no-op saves. */
	const ovSavedJson = (0, import_react.useRef)(null);
	const frame = (0, import_react.useRef)(null);
	const panel = (0, import_react.useRef)(null);
	const previewBox = (0, import_react.useRef)(null);
	const [boxW, setBoxW] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let alive = true;
		adminDb("site_menu_items").select("label, href, position, is_active").order("position", { ascending: true }).then(({ data }) => {
			if (!alive || !data) return;
			const merged = [...EDITOR_PAGES];
			const seen = new Set(merged.map((item) => item.path));
			for (const item of data) {
				const path = internalPath(item.href);
				if (!path || seen.has(path)) continue;
				seen.add(path);
				merged.push({
					path,
					label: item.label
				});
			}
			if (!seen.has(pageRef.current)) merged.push({
				path: pageRef.current,
				label: pageRef.current
			});
			setPageOptions(merged);
		});
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setPageOptions((prev) => prev.some((p) => p.path === page) ? prev : [...prev, {
			path: page,
			label: page
		}]);
	}, [page]);
	(0, import_react.useEffect)(() => {
		const el = previewBox.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
		ro.observe(el);
		setBoxW(el.clientWidth);
		return () => ro.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const onMsg = (e) => {
			if (e.source !== frame.current?.contentWindow) return;
			const d = e.data;
			const m = e.data;
			if (m?.type === "ve:map" && m.map) (async () => {
				if (!(await adminWriteSetting("visual_overrides", { map: m.map })).ok) return;
				setPublished(true);
				window.setTimeout(() => setPublished(false), 2e3);
			})();
			if (d?.type === "ve:selected" && d.payload) {
				setSel(d.payload);
				setDraft({
					text: d.payload.text,
					html: d.payload.html,
					href: d.payload.href,
					...d.payload.computed,
					"bg-mode": "keep",
					"bg-alpha": "100",
					"anim-name": "",
					"anim-duration": "700",
					"anim-delay": "0",
					"anim-iteration": "1"
				});
				setSaved(false);
			}
			const external = e.data;
			if (external?.type === "ve:external-link" && external.url && external.payload) {
				setSel(external.payload);
				setDraft({
					text: external.payload.text,
					html: external.payload.html,
					href: external.payload.href,
					...external.payload.computed,
					"bg-mode": "keep",
					"bg-alpha": "100",
					"anim-name": "",
					"anim-duration": "700",
					"anim-delay": "0",
					"anim-iteration": "1"
				});
				setExternalLink({
					url: external.url,
					payload: external.payload,
					compatible: false
				});
				setSelOv(null);
				setSaved(false);
			}
			const n = e.data;
			if ((n?.type === "ve:ready" || n?.type === "ve:navigate") && n.path) setCurrentPath(n.path.split("?")[0] || "/");
			if (n?.type === "ve:ready") {
				frame.current?.contentWindow?.postMessage({
					type: "ve:mode",
					mode: modeRef.current
				}, "*");
				frame.current?.contentWindow?.postMessage({ type: "ve:ov-request" }, "*");
			}
			const ovMsg = e.data;
			if (ovMsg?.type === "ve:ov-list" && Array.isArray(ovMsg.list)) {
				const list = ovMsg.list;
				setOverlays(list);
				setSelOv((prev) => prev ? list.find((x) => x.id === prev.id) ?? null : prev);
				const json = JSON.stringify(list);
				if (ovSavedJson.current === null || ovSavedJson.current === json) {
					ovSavedJson.current = json;
					return;
				}
				ovSavedJson.current = json;
				if (ovSaveTimer.current) window.clearTimeout(ovSaveTimer.current);
				ovSaveTimer.current = window.setTimeout(() => {
					adminWriteSetting(OVERLAY_SETTING_KEY, { list });
				}, 800);
			}
			if (ovMsg?.type === "ve:ov-selected") {
				const externalUrl = pendingExternalOverlay.current;
				if (ovMsg.item && externalUrl) {
					pendingExternalOverlay.current = null;
					const patched = {
						...ovMsg.item,
						label: "لینک خارجی سازگار",
						mode: "interactive",
						content: {
							...ovMsg.item.content,
							iframeProxy: true
						},
						interaction: {
							...ovMsg.item.interaction,
							block: true,
							action: "url",
							url: externalUrl,
							target: "_blank"
						}
					};
					setSelOv(patched);
					frame.current?.contentWindow?.postMessage({
						type: "ve:ov-patch",
						id: patched.id,
						patch: patched
					}, "*");
				} else setSelOv(ovMsg.item ?? null);
				if (ovMsg.item) setOvDraw(false);
			}
			const ms = e.data;
			if (ms?.type === "ve:ms-order" && Array.isArray(ms.order)) {
				const order = ms.order;
				const moved = ms.moved ?? "";
				const place = (ms.index ?? 0) + 1;
				(async () => {
					if (!window.confirm(`«${moved}» به جایگاه ${place} فهرست اصلی منتقل شود؟\n\nترتیب جدید:\n${order.join(" ← ")}`)) {
						if (frame.current) frame.current.src = previewSrc(pageRef.current, Date.now());
						return;
					}
					const res = await applyRootMenuOrder(order, deviceRef.current);
					if (res.ok) notifySaved("ترتیب فهرست اصلی");
					else notifyFailed("ترتیب فهرست اصلی", res.error);
					if (frame.current) frame.current.src = previewSrc(pageRef.current, Date.now());
				})();
			}
		};
		window.addEventListener("message", onMsg);
		return () => window.removeEventListener("message", onMsg);
	}, []);
	const modeRef = (0, import_react.useRef)("select");
	(0, import_react.useEffect)(() => {
		modeRef.current = mode;
		frame.current?.contentWindow?.postMessage({
			type: "ve:mode",
			mode
		}, "*");
	}, [mode]);
	const send = (msg) => frame.current?.contentWindow?.postMessage(msg, "*");
	const patchOverlay = (id, patch) => {
		setOverlays((prev) => prev.map((o) => o.id === id ? {
			...o,
			...patch
		} : o));
		setSelOv((prev) => prev && prev.id === id ? {
			...prev,
			...patch
		} : prev);
		send({
			type: "ve:ov-patch",
			id,
			patch
		});
	};
	const deleteOverlay = (id) => {
		setOverlays((prev) => prev.filter((o) => o.id !== id));
		setSelOv(null);
		send({
			type: "ve:ov-delete",
			id
		});
	};
	const toggleMenuSort = () => {
		const next = !msTool;
		setMsTool(next);
		if (next) setMode("interact");
		send({
			type: "ve:ms-tool",
			on: next
		});
	};
	const toggleOvDraw = () => {
		const next = !ovDraw;
		setOvDraw(next);
		if (next) setMode("interact");
		send({
			type: "ve:ov-tool",
			on: next
		});
	};
	/**
	* Switching the mode must also put the special tools away: the overlay
	* catcher and the menu-drag layer sit on top of the page and would swallow
	* every click/tap, so selecting an element silently stopped working (and the
	* settings column never appeared).
	*/
	const switchMode = (next) => {
		if (msTool) {
			setMsTool(false);
			send({
				type: "ve:ms-tool",
				on: false
			});
		}
		if (ovDraw) {
			setOvDraw(false);
			send({
				type: "ve:ov-tool",
				on: false
			});
		}
		setMode(next);
		send({
			type: "ve:mode",
			mode: next
		});
	};
	const enableExternalCompatibility = () => {
		if (!externalLink) return;
		send({
			type: "ve:update",
			selector: externalLink.payload.selector,
			patch: {
				target: "_blank",
				rel: "noopener noreferrer"
			}
		});
		setDraft((prev) => ({
			...prev,
			target: "_blank",
			rel: "noopener noreferrer"
		}));
		setExternalLink((prev) => prev ? {
			...prev,
			compatible: true
		} : prev);
		setSaved(true);
	};
	const openExternalOverlaySettings = () => {
		if (!externalLink) return;
		pendingExternalOverlay.current = externalLink.url;
		send({
			type: "ve:ov-target",
			selector: externalLink.payload.selector
		});
	};
	const previewSrc = (path, bust) => {
		return `${path}${path.includes("?") ? "&" : "?"}ve=1&veDevice=${device}${bust ? `&t=${bust}` : ""}`;
	};
	(0, import_react.useEffect)(() => {
		if (!sel) return;
		if (typeof window !== "undefined" && window.innerWidth < 1024) panel.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [sel]);
	const field = (k, v) => setDraft((p) => ({
		...p,
		[k]: v
	}));
	const apply = () => {
		if (!sel) return;
		const styleKeys = [
			"color",
			"font-size",
			"font-weight",
			"font-family",
			"text-align"
		];
		const style = {};
		for (const k of styleKeys) if (draft[k]) style[k] = draft[k];
		const mode = draft["bg-mode"] ?? "keep";
		if (mode === "transparent") style["background-color"] = "transparent";
		else if (mode === "custom") {
			const hex = draft["background-color"] || "#ffffff";
			const a = Math.min(100, Math.max(0, Number(draft["bg-alpha"] ?? "100"))) / 100;
			style["background-color"] = `rgba(${parseInt(hex.slice(1, 3), 16) || 0}, ${parseInt(hex.slice(3, 5), 16) || 0}, ${parseInt(hex.slice(5, 7), 16) || 0}, ${a})`;
		}
		if (draft["anim-name"]) style["animation"] = `${draft["anim-name"]} ${draft["anim-duration"] || "700"}ms ease-out ${draft["anim-delay"] || "0"}ms ${draft["anim-iteration"] || "1"} both`;
		const hover = {};
		if (draft["hover-on"] === "1") {
			if (draft["hover-color"]) hover["color"] = draft["hover-color"];
			if (draft["hover-bg-mode"] === "transparent") hover["background-color"] = "transparent";
			else if (draft["hover-bg-mode"] === "custom") {
				const hx = draft["hover-bg"] || "#ffffff";
				const ha = Math.min(100, Math.max(0, Number(draft["hover-bg-alpha"] ?? "100"))) / 100;
				hover["background-color"] = `rgba(${parseInt(hx.slice(1, 3), 16) || 0}, ${parseInt(hx.slice(3, 5), 16) || 0}, ${parseInt(hx.slice(5, 7), 16) || 0}, ${ha})`;
			}
			if (draft["hover-border"]) hover["border-color"] = draft["hover-border"];
			if (draft["hover-underline"] === "1") hover["text-decoration"] = "underline";
		} else if (draft["hover-on"] === "0") {
			hover["color"] = "";
			hover["background-color"] = "";
			hover["border-color"] = "";
			hover["text-decoration"] = "";
		}
		const patch = {
			style,
			hover,
			hoverDeep: draft["hover-deep"] === "1"
		};
		if (sel.text && draft.text !== sel.text) patch.text = draft.text;
		if (draft.html && draft.html !== sel.html) patch.html = draft.html;
		if (draft.href !== sel.href) patch.href = draft.href;
		if (draft.target) patch.target = draft.target;
		if (draft.rel) patch.rel = draft.rel;
		send({
			type: "ve:update",
			selector: sel.selector,
			patch
		});
		setSaved(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-extrabold text-[#0b1e3f]",
				children: "ویرایشگر بصری سایت"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500 mt-1 leading-6",
				children: "روی هر عنصر داخل سایت کلیک کنید و فونت، رنگ، شفافیت، انیمیشن، متن، آیکن/SVG و لینک آن را تغییر دهید."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap rounded-xl overflow-hidden border border-slate-300 bg-white w-fit mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("elements"),
					className: `px-4 py-2 text-xs font-bold ${tab === "elements" ? "bg-[#0b1e3f] text-white" : ""}`,
					children: "ویرایش عناصر صفحه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("media"),
					className: `px-4 py-2 text-xs font-bold ${tab === "media" ? "bg-[#0b1e3f] text-white" : ""}`,
					children: "اسلایدر و انیمیشن‌ها"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("wheel"),
					className: `px-4 py-2 text-xs font-bold ${tab === "wheel" ? "bg-[#0b1e3f] text-white" : ""}`,
					children: "چرخ‌وفلک و دکمه خرید"
				})
			]
		}),
		tab === "media" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderPane, {}) : tab === "wheel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelPane, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: page,
						onChange: (e) => {
							setPage(e.target.value);
							setSel(null);
						},
						className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm",
						children: pageOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.path,
							children: p.label
						}, p.path))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-xl overflow-hidden border border-slate-300 bg-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setDevice("desktop");
									setSel(null);
								},
								className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "desktop" ? "bg-[#0b1e3f] text-white" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-3.5 h-3.5" }), " دسکتاپ"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setDevice("tablet");
									setSel(null);
								},
								className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "tablet" ? "bg-[#0b1e3f] text-white" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "w-3.5 h-3.5" }), " تبلت"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setDevice("mobile");
									setSel(null);
								},
								className: `px-3 py-2 text-xs flex items-center gap-1.5 ${device === "mobile" ? "bg-[#0b1e3f] text-white" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), " موبایل"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-xl overflow-hidden border border-slate-300 bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => switchMode("select"),
							className: `px-3 py-2 text-xs font-bold ${mode === "select" ? "bg-[#0b1e3f] text-white" : ""}`,
							children: "حالت انتخاب"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => switchMode("interact"),
							className: `px-3 py-2 text-xs font-bold ${mode === "interact" ? "bg-[#0b1e3f] text-white" : ""}`,
							children: "حالت تعامل"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: toggleMenuSort,
						className: `px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 font-bold ${msTool ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300 bg-white"}`,
						title: "آیتم‌های فهرست اصلی هدر را با موس یا انگشت بکشید و جابه‌جا کنید؛ پیش از ثبت، پیام تأیید نشان داده می‌شود.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveHorizontal, { className: "w-3.5 h-3.5" }),
							" ",
							msTool ? "در حال جابجایی فهرست…" : "جابجایی فهرست اصلی"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: toggleOvDraw,
						className: `px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 font-bold ${ovDraw ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 bg-white"}`,
						title: "با کشیدن موس روی پیش‌نمایش یک لایه پوشاننده بسازید",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }),
							" ",
							ovDraw ? "در حال کشیدن لایه…" : "لایه پوشاننده"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: "",
						onChange: (e) => {
							const t = OVERLAY_TARGETS.find((x) => x.key === e.target.value);
							if (t) send({
								type: "ve:ov-target",
								selector: t.selector
							});
							e.target.value = "";
						},
						className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs",
						title: "ساخت لایه روی یک قسمت مشخص سایت",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "پوشاندن قسمتی از سایت…"
						}), OVERLAY_TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.key,
							children: t.label
						}, t.key))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							if (frame.current) frame.current.src = previewSrc(page, Date.now());
						},
						className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " بازخوانی"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setWide((w) => !w),
						className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs",
						children: wide ? "نمای معمولی" : "نمای بزرگ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							const p = customPath.trim();
							if (!p) return;
							const path = p.startsWith("/") ? p : `/${p}`;
							setPage(path);
							setSel(null);
							if (frame.current) frame.current.src = previewSrc(path, Date.now());
						},
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: customPath,
							onChange: (e) => setCustomPath(e.target.value),
							dir: "ltr",
							placeholder: "/insurance/car/body",
							className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs w-56"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs",
							children: "باز کن"
						})]
					}),
					published && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-emerald-600 font-bold px-2",
						children: "روی سایت منتشر شد ✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							if (confirm("همه تغییرات ظاهری حذف شود؟")) send({ type: "ve:resetAll" });
						},
						className: "px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), " بازنشانی کل تغییرات"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-slate-500 font-mono px-2",
						dir: "ltr",
						children: currentPath
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500 mb-3 leading-6",
				children: "در «حالت تعامل» سایت دقیقاً مثل حالت واقعی کار می‌کند (دکمه خرید آنلاین، چرخ‌وفلک، اسلایدر و منوها)؛ برای انتخاب یک عنصر در این حالت، در کامپیوتر کلید Alt را نگه دارید و کلیک کنید و در موبایل انگشت خود را روی عنصر نگه دارید (لمس طولانی)."
			}),
			externalLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "بستن راهنمای لینک خارجی",
				onClick: () => setExternalLink(null),
				className: "fixed inset-0 z-[60] cursor-default bg-slate-950/35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `grid gap-4 ${wide ? "lg:grid-cols-[1fr_320px]" : "lg:grid-cols-[1fr_380px]"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
					children: device === "desktop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: previewBox,
						className: "w-full overflow-hidden",
						style: { height: Math.round((wide ? 1e3 : 860) * (boxW ? Math.min(1, boxW / 1440) : 1)) },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							ref: frame,
							src: previewSrc(page),
							title: "preview",
							className: "border-0 bg-white",
							style: {
								width: 1440,
								height: wide ? 1e3 : 860,
								transform: `scale(${boxW ? Math.min(1, boxW / 1440) : 1})`,
								transformOrigin: "top right"
							}
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: previewBox,
						className: device === "mobile" ? "mx-auto w-full max-w-[390px]" : "mx-auto w-full max-w-[834px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							ref: frame,
							src: previewSrc(page),
							title: "preview",
							className: `w-full border-0 bg-white ${wide ? "h-[85vh]" : "h-[75vh]"}`
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					ref: panel,
					className: `bg-white rounded-2xl border border-slate-200 shadow-sm p-4 ${externalLink ? "fixed inset-x-3 top-16 z-[70] max-h-[calc(100vh-5rem)] overflow-y-auto lg:inset-x-auto lg:left-6 lg:w-[380px]" : "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"}`,
					children: [
						externalLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-sm font-extrabold text-[#0b1e3f]",
												children: "لینک خارجی محافظت‌شده"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] leading-5 text-slate-600",
												children: "برای اینکه ویرایشگر از دسترس خارج نشود، صفحهٔ خارجی داخل پیش‌نمایش باز نشد."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate font-mono text-[10px] text-slate-500",
												dir: "ltr",
												title: externalLink.url,
												children: externalLink.url
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-0.5",
										checked: externalLink.compatible,
										onChange: (e) => {
											if (e.target.checked) enableExternalCompatibility();
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: "حالت سازگاری برای لینک خارجی / بک‌لینک"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[10px] leading-5 text-slate-500",
										children: "لینک در تب جدا باز می‌شود و صفحهٔ قابل ویرایش در پیش‌نمایش باقی می‌ماند."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: openExternalOverlaySettings,
											className: "rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white",
											children: "تنظیمات لایه پوشاننده"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => window.open(externalLink.url, "_blank", "noopener,noreferrer"),
											className: "flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " باز کردن مقصد"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setExternalLink(null),
											className: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs",
											children: "بستن"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] leading-5 text-slate-500",
									children: "این حالت خطای قاب را حذف می‌کند؛ تأیید امنیتی خود سایت مقصد قابل دور زدن نیست."
								})
							]
						}),
						selOv && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayPanel, {
							item: selOv,
							onPatch: patchOverlay,
							onDelete: deleteOverlay,
							onClose: () => {
								setSelOv(null);
								send({
									type: "ve:ov-select",
									id: null
								});
							}
						}),
						!sel ? !selOv ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 leading-6",
							children: "برای شروع، داخل پیش‌نمایش روی عنصر مورد نظر کلیک کنید."
						}) : null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-slate-500 break-all bg-slate-50 rounded-lg p-2 font-mono",
									dir: "ltr",
									children: [
										"<",
										sel.tag,
										">"
									]
								}),
								sel.text !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "متن",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: draft.text ?? "",
										onChange: (e) => field("text", e.target.value),
										className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
									})
								}),
								sel.tag === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectOptionsEditor, {
									html: draft.html ?? "",
									onChange: (h) => field("html", h)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "آیکن / SVG / محتوای HTML",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: draft.html ?? "",
										onChange: (e) => field("html", e.target.value),
										dir: "ltr",
										className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordLinkEditor, {
									html: draft.html ?? "",
									text: draft.text ?? "",
									onChange: (h) => field("html", h)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "لینک (href)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: draft.href ?? "",
										onChange: (e) => field("href", e.target.value),
										dir: "ltr",
										placeholder: "/contact یا https://...",
										className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "باز شدن",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: draft.target ?? "",
											onChange: (e) => field("target", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "همین تب"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "_blank",
												children: "تب جدید"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "rel (بک‌لینک)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: draft.rel ?? "",
											onChange: (e) => field("rel", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "پیش‌فرض"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "dofollow",
													children: "dofollow"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "nofollow",
													children: "nofollow"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "noopener noreferrer",
													children: "noopener noreferrer"
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "فونت",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: draft["font-family"] ?? "",
										onChange: (e) => field("font-family", e.target.value),
										className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
										children: FONT_OPTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: f.v,
											children: f.label
										}, f.label))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "اندازه فونت",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: draft["font-size"] ?? "",
											onChange: (e) => field("font-size", e.target.value),
											dir: "ltr",
											className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "ضخامت",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: draft["font-weight"] ?? "",
											onChange: (e) => field("font-weight", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: [
												"",
												"300",
												"400",
												"500",
												"600",
												"700",
												"800",
												"900"
											].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: w,
												children: w || "پیش‌فرض"
											}, w))
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "رنگ متن",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: draft.color || "#000000",
										onChange: (e) => field("color", e.target.value),
										className: "w-full h-10 rounded-xl border border-slate-300"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-200 p-2.5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "هاور و لمس (دسکتاپ و موبایل)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: draft["hover-on"] ?? "",
											onChange: (e) => field("hover-on", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "بدون تغییر"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "1",
													children: "فعال کردن رنگ هاور"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "0",
													children: "حذف رنگ هاور"
												})
											]
										})
									}), draft["hover-on"] === "1" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "رنگ متن در هاور",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "color",
												value: draft["hover-color"] || "#0b1e3f",
												onChange: (e) => field("hover-color", e.target.value),
												className: "w-full h-10 rounded-xl border border-slate-300"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "پس‌زمینه در هاور",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: draft["hover-bg-mode"] ?? "keep",
												onChange: (e) => field("hover-bg-mode", e.target.value),
												className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "keep",
														children: "بدون تغییر"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "transparent",
														children: "کاملاً شفاف"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "custom",
														children: "رنگی با کنترل شفافیت"
													})
												]
											})
										}),
										draft["hover-bg-mode"] === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "رنگ پس‌زمینه هاور",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "color",
												value: draft["hover-bg"] || "#ffffff",
												onChange: (e) => field("hover-bg", e.target.value),
												className: "w-full h-10 rounded-xl border border-slate-300"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: `شفافیت پس‌زمینه هاور: ${draft["hover-bg-alpha"] ?? "100"}%`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 0,
												max: 100,
												step: 1,
												value: Number(draft["hover-bg-alpha"] ?? "100"),
												onChange: (e) => field("hover-bg-alpha", e.target.value),
												className: "w-full"
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "رنگ حاشیه در هاور",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "color",
												value: draft["hover-border"] || "#0b1e3f",
												onChange: (e) => field("hover-border", e.target.value),
												className: "w-full h-10 rounded-xl border border-slate-300"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-xs text-slate-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: draft["hover-underline"] === "1",
												onChange: (e) => field("hover-underline", e.target.checked ? "1" : "")
											}), "زیرخط‌دار شدن در هاور"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-xs text-slate-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: draft["hover-deep"] === "1",
												onChange: (e) => field("hover-deep", e.target.checked ? "1" : "")
											}), "اعمال روی آیکن‌ها و زیر آیتم‌های داخل این عنصر"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-500 leading-5",
											children: "روی آیتم فهرست یا زیرآیتم کلیک کنید و رنگ دلخواه هاور را انتخاب کنید؛ در موبایل هنگام لمس همان رنگ نمایش داده می‌شود."
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-200 p-2.5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "پس‌زمینه",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: draft["bg-mode"] ?? "keep",
											onChange: (e) => field("bg-mode", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "keep",
													children: "بدون تغییر"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "transparent",
													children: "کاملاً شفاف"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "custom",
													children: "رنگی با کنترل شفافیت"
												})
											]
										})
									}), (draft["bg-mode"] ?? "keep") === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "رنگ پس‌زمینه",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: draft["background-color"] || "#ffffff",
											onChange: (e) => field("background-color", e.target.value),
											className: "w-full h-10 rounded-xl border border-slate-300"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: `میزان شفافیت: ${draft["bg-alpha"] ?? "100"}%`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 0,
											max: 100,
											step: 1,
											value: Number(draft["bg-alpha"] ?? "100"),
											onChange: (e) => field("bg-alpha", e.target.value),
											className: "w-full"
										})
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-200 p-2.5 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "انیمیشن عنصر",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: draft["anim-name"] ?? "",
											onChange: (e) => field("anim-name", e.target.value),
											className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
											children: VE_ANIMATIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: a.v,
												children: a.label
											}, a.v))
										})
									}), draft["anim-name"] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "مدت (ms)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													dir: "ltr",
													value: draft["anim-duration"] ?? "700",
													onChange: (e) => field("anim-duration", e.target.value),
													className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "تأخیر (ms)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													dir: "ltr",
													value: draft["anim-delay"] ?? "0",
													onChange: (e) => field("anim-delay", e.target.value),
													className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "تکرار",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: draft["anim-iteration"] ?? "1",
													onChange: (e) => field("anim-iteration", e.target.value),
													className: "w-full px-1 py-2 rounded-xl border border-slate-300 text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "1",
															children: "۱ بار"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "2",
															children: "۲ بار"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "3",
															children: "۳ بار"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "infinite",
															children: "بی‌نهایت"
														})
													]
												})
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "چینش متن",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: draft["text-align"] ?? "",
										onChange: (e) => field("text-align", e.target.value),
										className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
										children: [
											"",
											"right",
											"center",
											"left",
											"justify"
										].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: a,
											children: a || "پیش‌فرض"
										}, a))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-200 p-2.5 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "افزودن بلوک یا سکشن جدید (بعد از این عنصر)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: "",
												onChange: (e) => {
													const t = BLOCK_TEMPLATES.find((b) => b.key === e.target.value);
													if (t) field("block", t.html);
												},
												className: "w-full px-2 py-2 rounded-xl border border-slate-300 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "یک قالب آماده انتخاب کنید…"
												}), BLOCK_TEMPLATES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: b.key,
													children: b.label
												}, b.key))]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 4,
											dir: "ltr",
											value: draft.block ?? "",
											onChange: (e) => field("block", e.target.value),
											placeholder: "<section>…</section>",
											className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => send({
													type: "ve:update",
													selector: sel.selector,
													patch: { block: draft.block ?? "" }
												}),
												className: "flex-1 text-xs font-bold bg-emerald-600 text-white rounded-xl py-2",
												children: "افزودن / به‌روزرسانی بلوک"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													field("block", "");
													send({
														type: "ve:update",
														selector: sel.selector,
														patch: { block: "" }
													});
												},
												className: "px-3 text-xs rounded-xl border border-slate-300",
												children: "حذف بلوک"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: apply,
										className: "flex-1 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), " اعمال"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => send({
											type: "ve:reset",
											selector: sel.selector
										}),
										className: "px-3 rounded-xl border border-slate-300 text-xs",
										children: "حذف تغییر"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => send({
										type: "ve:update",
										selector: sel.selector,
										patch: { hidden: true }
									}),
									className: "w-full text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-2",
									children: "حذف / پنهان‌سازی این بخش"
								}),
								saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-emerald-600",
									children: "ذخیره شد."
								})
							]
						})
					]
				})]
			})
		] })
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-[11px] font-bold text-slate-600 mb-1",
			children: label
		}), children]
	});
}
function parseOptions(html) {
	if (typeof window === "undefined" || !html) return [];
	const doc = new DOMParser().parseFromString(`<select>${html}</select>`, "text/html");
	return Array.from(doc.querySelectorAll("option")).map((o) => ({
		label: o.textContent ?? "",
		value: o.getAttribute("value") ?? ""
	}));
}
function serializeOptions(opts) {
	const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	return opts.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
}
/**
* Native dropdowns can't be clicked open inside the editor iframe, so their
* items are edited here as a simple list (label + value, add / delete / move).
*/
function SelectOptionsEditor({ html, onChange }) {
	const opts = parseOptions(html);
	const update = (next) => onChange(serializeOptions(next));
	const edit = (i, patch) => update(opts.map((o, idx) => idx === i ? {
		...o,
		...patch
	} : o));
	const move = (i, dir) => {
		const j = i + dir;
		if (j < 0 || j >= opts.length) return;
		const next = [...opts];
		const a = next[i];
		next[i] = next[j];
		next[j] = a;
		update(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-slate-200 p-2 space-y-2 bg-slate-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-bold text-slate-600",
				children: "گزینه‌های منوی کشویی"
			}),
			opts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-500",
				children: "گزینه‌ای وجود ندارد. یک گزینه اضافه کنید."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 max-h-64 overflow-auto pr-1",
				children: opts.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: o.label,
							onChange: (e) => edit(i, { label: e.target.value }),
							placeholder: "متن گزینه",
							className: "flex-1 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: o.value,
							onChange: (e) => edit(i, { value: e.target.value }),
							placeholder: "مقدار",
							dir: "ltr",
							className: "w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move(i, -1),
							title: "بالا",
							className: "px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs",
							children: "↑"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move(i, 1),
							title: "پایین",
							className: "px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs",
							children: "↓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => update(opts.filter((_, idx) => idx !== i)),
							title: "حذف",
							className: "px-2 py-1 rounded-lg border border-red-200 text-red-600 bg-white text-xs",
							children: "✕"
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => update([...opts, {
					label: "گزینه جدید",
					value: ""
				}]),
				className: "w-full px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold",
				children: "افزودن گزینه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-slate-500 leading-5",
				children: "پس از ویرایش، دکمه «ذخیره تغییرات» را بزنید تا روی سایت اعمال شود."
			})
		]
	});
}
/**
* Turns any word or phrase inside the selected element into a real backlink.
* It rewrites the element HTML, so it works on headings, paragraphs and menu
* items alike.
*/
function WordLinkEditor({ html, text, onChange }) {
	const [word, setWord] = (0, import_react.useState)("");
	const [href, setHref] = (0, import_react.useState)("");
	const [blank, setBlank] = (0, import_react.useState)(false);
	const [nofollow, setNofollow] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const source = html || text;
	const link = () => {
		const w = word.trim();
		const u = href.trim();
		if (!w || !u) {
			setErr("کلمه و آدرس لینک را وارد کنید.");
			return;
		}
		if (!source.includes(w)) {
			setErr("این عبارت داخل متن این عنصر پیدا نشد.");
			return;
		}
		const attrs = [`href="${u}"`];
		if (blank) attrs.push("target=\"_blank\"");
		attrs.push(`rel="${nofollow ? "nofollow noopener" : "noopener"}"`);
		const anchor = `<a ${attrs.join(" ")} style="text-decoration:underline">${w}</a>`;
		onChange(source.replace(w, anchor));
		setErr("");
		setWord("");
		setHref("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-slate-200 p-2.5 space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "لینک‌دار کردن یک کلمه از متن (بک‌لینک)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: word,
					onChange: (e) => setWord(e.target.value),
					placeholder: "کلمه یا عبارت داخل متن",
					className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: href,
				onChange: (e) => setHref(e.target.value),
				dir: "ltr",
				placeholder: "/insurance/fire یا https://...",
				className: "w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-[11px] text-slate-600",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: blank,
							onChange: (e) => setBlank(e.target.checked)
						}), " تب جدید"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: nofollow,
							onChange: (e) => setNofollow(e.target.checked)
						}), " nofollow"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: link,
						className: "ms-auto px-3 py-1.5 rounded-lg bg-[#0b1e3f] text-white text-[11px] font-bold",
						children: "افزودن لینک"
					})
				]
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-rose-600",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-slate-500 leading-5",
				children: "بعد از افزودن، دکمه «ذخیره تغییرات» را بزنید تا روی سایت منتشر شود."
			})
		]
	});
}
function OverviewPane() {
	const [cCount, setCCount] = (0, import_react.useState)(null);
	const [dCount, setDCount] = (0, import_react.useState)(null);
	const [mCount, setMCount] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [c, d, m] = await Promise.all([
				adminDb("contact_messages").select("*", {
					count: "exact",
					head: true
				}),
				adminDb("damage_reports").select("*", {
					count: "exact",
					head: true
				}),
				adminDb("site_menu_items").select("*", {
					count: "exact",
					head: true
				})
			]);
			setCCount(c.count ?? 0);
			setDCount(d.count ?? 0);
			setMCount(m.count ?? 0);
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-extrabold text-[#0b1e3f] mb-2",
			children: "خوش آمدید 👋"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-slate-500 mb-8",
			children: "خلاصه‌ای از محتوای وب‌سایت شما."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
			children: [
				{
					label: "درخواست‌های مشاوره",
					value: cCount,
					icon: MessageSquare,
					color: "from-blue-500 to-indigo-600"
				},
				{
					label: "گزارش‌های خسارت",
					value: dCount,
					icon: TriangleAlert,
					color: "from-amber-500 to-orange-600"
				},
				{
					label: "آیتم‌های منو",
					value: mCount,
					icon: Menu,
					color: "from-emerald-500 to-teal-600"
				}
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-4`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-black text-[#0b1e3f]",
						children: c.value ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-slate-500 mt-1",
						children: c.label
					})
				]
			}, c.label))
		})
	] });
}
function ContactsPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async () => {
		setLoading(true);
		const { data } = await adminDb("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
		setRows(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const del = async (id) => {
		if (!confirm("حذف شود؟")) return;
		await adminDb("contact_messages").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneShell, {
		title: "درخواست‌های مشاوره",
		onRefresh: load,
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "موردی ثبت نشده." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 text-slate-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "نام" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تلفن" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ایمیل" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "استان" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "نوع بیمه" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تاریخ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-slate-100 hover:bg-slate-50/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.full_name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							dir: "ltr",
							children: r.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.email || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.province || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.insurance_type || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-slate-500",
							children: new Date(r.created_at).toLocaleDateString("fa-IR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => del(r.id),
							tone: "danger",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						}) })
					]
				}, r.id)) })]
			})
		})
	});
}
function SuggestionsPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async () => {
		setLoading(true);
		const { data } = await adminDb("suggestions").select("id, tracking_id, category, received_at").order("received_at", { ascending: false }).limit(200);
		setRows(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneShell, {
		title: "انتقادات و پیشنهادات",
		onRefresh: load,
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "موردی ثبت نشده." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 text-slate-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "کد رهگیری" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "نوع" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تاریخ دریافت" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ساعت دریافت" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
					const d = new Date(r.received_at);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-slate-100 hover:bg-slate-50/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								dir: "ltr",
								children: r.tracking_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.category === "criticism" ? "انتقاد" : "پیشنهاد" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-slate-500",
								children: d.toLocaleDateString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-slate-500",
								children: d.toLocaleTimeString("fa-IR", {
									hour: "2-digit",
									minute: "2-digit"
								})
							})
						]
					}, r.id);
				}) })]
			})
		})
	});
}
function PartnerApplicationsPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [open, setOpen] = (0, import_react.useState)(null);
	const load = async () => {
		setLoading(true);
		let res = await adminDb("partner_applications").select("*").order("received_at", { ascending: false }).limit(200);
		if (res.error || !res.data) res = await adminDb("partner_applications").select("*").order("created_at", { ascending: false }).limit(200);
		if (res.error || !res.data) res = await adminDb("partner_applications").select("*").limit(200);
		const { partnerApplicantCode } = await import("./partner-code-eZI_lnL0.mjs");
		const mapped = (res.data || []).map((r) => {
			const receivedAt = r["received_at"] ?? r["created_at"] ?? (/* @__PURE__ */ new Date()).toISOString();
			return {
				id: r["id"],
				applicant_id: r["applicant_id"] || partnerApplicantCode(r["request_key"], receivedAt),
				full_name: r["full_name"] ?? r["fullname"] ?? "",
				national_id: r["national_id"] ?? "",
				phone: r["phone"] ?? r["mobile"] ?? "",
				province: r["province"] ?? null,
				city: r["city"] ?? null,
				education: r["education"] ?? null,
				experience: r["experience"] ?? r["insurance_experience"] ?? null,
				cooperation_type: r["cooperation_type"] ?? r["type_cooperation"] ?? null,
				branches: r["branches"] ?? null,
				status: r["status"] ?? "new",
				received_at: receivedAt
			};
		});
		setRows(mapped);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const setStatus = async (id, status) => {
		await adminDb("partner_applications").update({ status }).eq("id", id);
		load();
	};
	const del = async (id) => {
		if (!confirm("حذف شود؟")) return;
		await adminDb("partner_applications").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneShell, {
		title: "درخواست همکاری در فروش",
		onRefresh: load,
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "موردی ثبت نشده." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 text-slate-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "آیدی متقاضی" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "کد ملی" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تماس" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "استان/شهر" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "سابقه" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "وضعیت" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تاریخ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ساعت" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "عملیات" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
					const d = new Date(r.received_at);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-slate-100 hover:bg-slate-50/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "font-bold text-sky-700 hover:underline",
								onClick: () => setOpen(open === r.id ? null : r.id),
								children: r.applicant_id
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								dir: "ltr",
								children: r.national_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								dir: "ltr",
								children: r.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: [r.province, r.city].filter(Boolean).join(" / ") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.experience }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: r.status,
								onChange: (e) => setStatus(r.id, e.target.value),
								className: "rounded-lg border border-slate-200 px-2 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "new",
										children: "جدید"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "reviewing",
										children: "در حال بررسی"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "accepted",
										children: "تایید شده"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rejected",
										children: "رد شده"
									})
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-slate-500",
								children: d.toLocaleDateString("fa-IR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-slate-500",
								children: d.toLocaleTimeString("fa-IR", {
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => del(r.id),
								className: "text-rose-600 hover:underline text-xs",
								children: "حذف"
							}) })
						]
					}), open === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "bg-slate-50/70 border-t border-slate-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 9,
							className: "p-4 text-xs leading-6 text-slate-600",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["نام و نام خانوادگی: ", r.full_name || "—"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"تحصیلات: ",
									r.education,
									" — نوع همکاری: ",
									r.cooperation_type
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["شاخه‌های مورد علاقه: ", (r.branches || []).join("، ") || "—"] })
							]
						})
					})] }, r.id);
				}) })]
			})
		})
	});
}
function DamagesPane() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async () => {
		setLoading(true);
		const { data } = await adminDb("damage_reports").select("*").order("created_at", { ascending: false }).limit(200);
		setRows(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const setStatus = async (id, status) => {
		await adminDb("damage_reports").update({ status }).eq("id", id);
		load();
	};
	const del = async (id) => {
		if (!confirm("حذف شود؟")) return;
		await adminDb("damage_reports").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneShell, {
		title: "گزارش‌های خسارت",
		onRefresh: load,
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "موردی ثبت نشده." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-slate-50 text-slate-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "نام" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تلفن" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "شماره بیمه‌نامه" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تاریخ حادثه" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "وضعیت" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ثبت" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-slate-100 hover:bg-slate-50/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.full_name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							dir: "ltr",
							children: r.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.policy_number || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.accident_date || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: r.status,
							onChange: (e) => setStatus(r.id, e.target.value),
							className: "text-xs bg-white border border-slate-200 rounded-lg px-2 py-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "new",
									children: "جدید"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "in_progress",
									children: "در حال رسیدگی"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "done",
									children: "رسیدگی شده"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-slate-500",
							children: new Date(r.created_at).toLocaleDateString("fa-IR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => del(r.id),
							tone: "danger",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						}) })
					]
				}, r.id)) })]
			})
		})
	});
}
function MenuPane({ onOpenPage } = {}) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const dragId = (0, import_react.useRef)(null);
	const load = async () => {
		setLoading(true);
		const { data } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
		const seen = /* @__PURE__ */ new Set();
		const rows = (data || []).filter((r) => {
			if (seen.has(r.id)) return false;
			seen.add(r.id);
			return true;
		});
		setItems(rows);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const shown = (0, import_react.useMemo)(() => items.filter((i) => i.device === "both" || i.device === device), [items, device]);
	const roots = shown.filter((i) => !i.parent_id);
	const childrenOf = (id) => shown.filter((i) => i.parent_id === id);
	const quickPages = (0, import_react.useMemo)(() => {
		const pages = [];
		const seen = /* @__PURE__ */ new Set();
		const byParent = /* @__PURE__ */ new Map();
		for (const item of shown) {
			const siblings = byParent.get(item.parent_id) ?? [];
			siblings.push(item);
			byParent.set(item.parent_id, siblings);
		}
		const walk = (item, color) => {
			const path = editableMenuPath(item.href);
			if (path && !seen.has(path)) {
				seen.add(path);
				pages.push({
					path,
					label: item.label,
					color
				});
			}
			for (const child of byParent.get(item.id) ?? []) walk(child, color);
		};
		roots.forEach((root, index) => walk(root, GROUP_COLORS[index % GROUP_COLORS.length]));
		return pages;
	}, [shown]);
	const siblingsOf = (parent_id, excludeId) => items.filter((i) => i.parent_id === parent_id && i.id !== excludeId).sort((a, b) => a.position - b.position);
	/** True when `id` sits inside the subtree of `ancestorId`. */
	const isDescendant = (id, ancestorId) => {
		let cur = items.find((i) => i.id === id)?.parent_id ?? null;
		while (cur) {
			if (cur === ancestorId) return true;
			cur = items.find((i) => i.id === cur)?.parent_id ?? null;
		}
		return false;
	};
	/** Rewrites parent_id/position for one sibling list. UPDATE only — never INSERT. */
	const persistOrder = async (parent_id, orderedIds) => {
		for (let p = 0; p < orderedIds.length; p++) await adminDb("site_menu_items").update({
			parent_id,
			position: p
		}).eq("id", orderedIds[p]);
	};
	const add = async (parent_id) => {
		if (saving) return;
		const label = prompt("عنوان آیتم منو:");
		if (!label) return;
		const href = prompt("لینک (اختیاری):") || null;
		setSaving(true);
		const siblings = items.filter((i) => i.parent_id === parent_id);
		await adminDb("site_menu_items").insert({
			label,
			href,
			parent_id,
			position: siblings.length,
			device: parent_id ? "both" : device,
			is_active: true
		});
		await load();
		setSaving(false);
	};
	/**
	* Edit/Save path. Always an UPDATE on the existing id — the id itself is
	* stripped from the patch so it can never be overwritten, and the `saving`
	* guard blocks double-clicks and re-entrant saves (the old duplicate bug).
	*/
	const update = async (id, patch) => {
		if (!id || saving) return;
		setSaving(true);
		const { id: _ignored, ...rest } = patch;
		await adminDb("site_menu_items").update(rest).eq("id", id);
		await load();
		setSaving(false);
	};
	const del = async (id) => {
		if (saving) return;
		if (!confirm("این آیتم و همه زیرآیتم‌هایش حذف شود؟")) return;
		setSaving(true);
		await adminDb("site_menu_items").delete().eq("id", id);
		await load();
		setSaving(false);
	};
	/** Moves an item one step up/down among its siblings. UPDATE on position only. */
	const move = async (item, dir) => {
		if (saving) return;
		const sibs = siblingsOf(item.parent_id);
		const swap = sibs[sibs.findIndex((s) => s.id === item.id) + dir];
		if (!swap) return;
		if (!confirm(`«${item.label}» با «${swap.label}» جابه‌جا شود؟`)) return;
		setSaving(true);
		await adminDb("site_menu_items").update({ position: swap.position }).eq("id", item.id);
		await adminDb("site_menu_items").update({ position: item.position }).eq("id", swap.id);
		await load();
		setSaving(false);
	};
	/** Drop on the strip above a row: insert dragged item right before that row. */
	const dropBefore = async (targetId) => {
		const src = dragId.current;
		dragId.current = null;
		if (!src || src === targetId || saving) return;
		if (isDescendant(targetId, src)) return;
		const target = items.find((i) => i.id === targetId);
		const srcItem = items.find((i) => i.id === src);
		if (!target || !srcItem) return;
		if (!confirm(`«${srcItem.label}» درست پیش از «${target.label}» قرار بگیرد؟`)) return;
		setSaving(true);
		await persistOrder(srcItem.parent_id, siblingsOf(srcItem.parent_id, src).map((i) => i.id));
		const newSibs = siblingsOf(target.parent_id, src);
		const at = newSibs.findIndex((i) => i.id === targetId);
		newSibs.splice(at < 0 ? newSibs.length : at, 0, srcItem);
		await persistOrder(target.parent_id, newSibs.map((i) => i.id));
		await load();
		setSaving(false);
	};
	/** Drop on a row body (or the root zone with null): make it a child of that row. */
	const dropInto = async (parentId) => {
		const src = dragId.current;
		dragId.current = null;
		if (!src || src === parentId || saving) return;
		if (parentId && isDescendant(parentId, src)) return;
		const srcItem = items.find((i) => i.id === src);
		if (!srcItem || srcItem.parent_id === parentId) return;
		const parentLabel = parentId ? items.find((i) => i.id === parentId)?.label ?? "" : "";
		const question = parentId ? `«${srcItem.label}» زیرمجموعهٔ «${parentLabel}» شود؟` : `«${srcItem.label}» به فهرست اصلی منتقل شود؟`;
		if (!confirm(question)) return;
		setSaving(true);
		await persistOrder(srcItem.parent_id, siblingsOf(srcItem.parent_id, src).map((i) => i.id));
		const newSibs = siblingsOf(parentId, src);
		newSibs.push(srcItem);
		await persistOrder(parentId, newSibs.map((i) => i.id));
		await load();
		setSaving(false);
	};
	/**
	* Syncs the built-in site menu into the table WITHOUT creating duplicates:
	* only entries that are not already stored (same parent + label + link) are
	* inserted. Running it twice is a no-op.
	*/
	const importCurrent = async () => {
		if (saving) return;
		setSaving(true);
		const { data } = await adminDb("site_menu_items").select("*");
		const existing = data || [];
		const keyOf = (parent_id, label, href) => `${parent_id ?? ""}|${label.trim()}|${(href ?? "").trim()}`;
		const byKey = /* @__PURE__ */ new Map();
		for (const r of existing) byKey.set(keyOf(r.parent_id, r.label, r.href), r);
		const rows = [];
		const walk = (list, parent_id) => {
			list.forEach((n, i) => {
				const key = keyOf(parent_id, n.label, n.href ?? null);
				let id = byKey.get(key)?.id;
				if (!id) {
					id = crypto.randomUUID();
					rows.push({
						id,
						parent_id,
						label: n.label,
						href: n.href ?? null,
						position: i,
						device: "both",
						is_active: true
					});
					byKey.set(key, {
						id,
						parent_id,
						label: n.label,
						href: n.href ?? null
					});
				}
				if (n.children?.length) walk(n.children, id);
			});
		};
		walk(navItems, null);
		if (rows.length) await adminDb("site_menu_items").insert(rows);
		await load();
		setSaving(false);
		alert(rows.length ? `${rows.length} آیتم تازه اضافه شد.` : "همه آیتم‌ها از قبل موجود بودند.");
	};
	/** Removes rows that repeat the same parent + label + link, keeping the first. */
	const cleanupDuplicates = async () => {
		if (saving) return;
		if (!confirm("آیتم‌های تکراری منو حذف شوند؟")) return;
		setSaving(true);
		const { data } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
		const rows = data || [];
		const seen = /* @__PURE__ */ new Map();
		const remap = /* @__PURE__ */ new Map();
		const doomed = [];
		for (const r of rows) {
			const key = `${r.parent_id ?? ""}|${r.label.trim()}|${(r.href ?? "").trim()}`;
			const kept = seen.get(key);
			if (kept) {
				remap.set(r.id, kept);
				doomed.push(r.id);
			} else seen.set(key, r.id);
		}
		for (const r of rows) if (r.parent_id && remap.has(r.parent_id) && !remap.has(r.id)) await adminDb("site_menu_items").update({ parent_id: remap.get(r.parent_id) }).eq("id", r.id);
		for (const id of doomed) await adminDb("site_menu_items").delete().eq("id", id);
		await load();
		setSaving(false);
		alert(doomed.length ? `${doomed.length} آیتم تکراری حذف شد.` : "آیتم تکراری پیدا نشد.");
	};
	const dnd = {
		onDragStart: (id) => {
			dragId.current = id;
		},
		dropBefore,
		dropInto
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PaneShell, {
		title: "ویرایش برگها (دسکتاپ/موبایل/تبلت)",
		onRefresh: load,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceToggle, {
					value: device,
					onChange: setDevice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: importCurrent,
					disabled: saving,
					className: "text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-50",
					children: "همگام‌سازی با منوی سایت"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: cleanupDuplicates,
					disabled: saving,
					className: "text-xs font-bold px-3 py-2 rounded-xl border border-rose-300 text-rose-600 bg-white disabled:opacity-50",
					children: "حذف آیتم‌های تکراری"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => add(null),
					disabled: saving,
					className: "flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " افزودن آیتم اصلی"]
				})
			]
		}),
		children: [onOpenPage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl border border-slate-200 bg-white p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] leading-6 text-slate-600",
				children: "دسترسی سریع به برگه‌های همین نما؛ با ثبت لینک داخلی جدید، دکمهٔ هم‌رنگ گروه آن خودکار اضافه می‌شود."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: quickPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenPage(p.path),
					title: p.path,
					style: {
						backgroundColor: p.color,
						borderColor: p.color
					},
					className: "rounded-lg border px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:opacity-85",
					children: p.label
				}, p.path))
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : roots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "هنوز آیتمی برای این نما تعریف نشده — با «افزودن آیتم اصلی» شروع کنید." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-emerald-900 leading-6",
						children: "برای جابجایی، دستهٔ ⋮⋮ را بکشید: رها روی خط نازک بالای هر آیتم = مرتب‌سازی، رها روی خود آیتم = تبدیل به زیرمجموعه. دکمه‌های ↑ ↓ هم مرتب‌سازی می‌کنند. پیش از هر جابجایی، یک پیام تأیید نشان داده می‌شود."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-emerald-900 leading-6",
						children: [
							"عددی که داخل مربع کنار هر آیتم می‌بینید، ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "شمارهٔ ترتیب همان آیتم بین هم‌گروه‌هایش" }),
							" است (۱ یعنی اولین آیتم آن گروه، از راست در فهرست اصلی و از بالا در زیرمجموعه‌ها)."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-[11px] text-emerald-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3.5 h-3.5 rounded bg-emerald-600 inline-block" }), " فهرست اصلی"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3.5 h-3.5 rounded bg-emerald-200 inline-block" }), " زیرمجموعه‌ها"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "هر گروه یک رنگ نوار کناری جداگانه دارد تا زیرمجموعه‌های هر آیتم اصلی سریع دیده شوند." })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: roots.map((r, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRow, {
					item: r,
					depth: 0,
					saving,
					dnd,
					groupColor: GROUP_COLORS[gi % GROUP_COLORS.length],
					onUpdate: update,
					onDelete: del,
					onAddChild: add,
					onMove: move,
					childrenOf,
					onOpenPage
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					dropInto(null);
				},
				className: "mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-400",
				children: "برای انتقال یک آیتم به سطح اصلی، آن را اینجا رها کنید"
			})
		] })]
	});
}
/** One distinct side-stripe color per top-level group. */
var GROUP_COLORS = [
	"#0ea5e9",
	"#f59e0b",
	"#8b5cf6",
	"#ec4899",
	"#14b8a6",
	"#ef4444",
	"#6366f1",
	"#84cc16"
];
function MenuRow({ item, depth, saving, dnd, groupColor, onUpdate, onDelete, onAddChild, onMove, childrenOf, onOpenPage }) {
	const [label, setLabel] = (0, import_react.useState)(item.label);
	const [href, setHref] = (0, import_react.useState)(item.href || "");
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const kids = childrenOf(item.id);
	const dirty = label !== item.label || (href || "") !== (item.href || "");
	const rowPath = editableMenuPath(href || item.href) ?? kids.map((k) => editableMenuPath(k.href)).find(Boolean) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onDragOver: (e) => e.preventDefault(),
			onDrop: (e) => {
				e.preventDefault();
				dnd.dropBefore(item.id);
			},
			className: "h-1.5 rounded-full bg-transparent hover:bg-[#0b1e3f]/20 transition"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { paddingRight: depth * 12 },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDragOver(true);
				},
				onDragLeave: () => setDragOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragOver(false);
					dnd.dropInto(item.id);
				},
				style: {
					borderRightWidth: 6,
					borderRightColor: groupColor
				},
				className: `flex flex-wrap items-center gap-2 rounded-xl border p-2.5 transition ${depth === 0 ? "bg-emerald-600/10 border-emerald-600/60" : "bg-emerald-50 border-emerald-200"} ${dragOver ? "ring-2 ring-emerald-600/40 border-emerald-700" : "hover:border-emerald-700/60"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						draggable: true,
						onDragStart: () => dnd.onDragStart(item.id),
						title: "برای جابجایی بکشید",
						className: "cursor-grab active:cursor-grabbing text-slate-400 hover:text-[#0b1e3f] transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: `شمارهٔ ترتیب این آیتم بین هم‌گروه‌هایش: ${item.position + 1}`,
						className: `w-6 h-6 rounded-md grid place-items-center text-[10px] font-bold ${depth === 0 ? "bg-emerald-600 text-white" : "bg-emerald-200 text-emerald-900"}`,
						children: item.position + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: label,
						onChange: (e) => setLabel(e.target.value),
						className: "flex-1 min-w-[130px] px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: href,
						onChange: (e) => setHref(e.target.value),
						placeholder: "/link",
						dir: "ltr",
						className: "w-full sm:w-40 px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: item.device,
						disabled: saving,
						onChange: (e) => onUpdate(item.id, { device: e.target.value }),
						className: "text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 disabled:opacity-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "both",
								children: "همه نماها"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "desktop",
								children: "دسکتاپ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "mobile",
								children: "موبایل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "tablet",
								children: "تبلت"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1 text-xs text-slate-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							disabled: saving,
							checked: item.is_active,
							onChange: (e) => onUpdate(item.id, { is_active: e.target.checked })
						}), "فعال"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						onClick: () => onMove(item, -1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						onClick: () => onMove(item, 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "w-4 h-4" })
					}),
					dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						tone: "primary",
						disabled: saving,
						onClick: () => onUpdate(item.id, {
							label,
							href: href || null
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" })
					}),
					onOpenPage && rowPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onOpenPage(rowPath),
						style: { backgroundColor: groupColor },
						className: "rounded-lg px-2 py-1.5 text-[11px] font-bold text-white transition hover:opacity-85",
						title: "این برگ را در ویرایشگر بصری باز کن",
						children: "ویرایش بصری"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						disabled: saving,
						onClick: () => onAddChild(item.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						tone: "danger",
						disabled: saving,
						onClick: () => onDelete(item.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					})
				]
			})
		}),
		kids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: kids.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRow, {
				item: k,
				depth: depth + 1,
				saving,
				dnd,
				groupColor,
				onUpdate,
				onDelete,
				onAddChild,
				onMove,
				childrenOf,
				onOpenPage
			}, k.id))
		})
	] });
}
function FooterPane() {
	const [sections, setSections] = (0, import_react.useState)([]);
	const [links, setLinks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async () => {
		setLoading(true);
		const [s, l] = await Promise.all([adminDb("site_footer_sections").select("*").order("position", { ascending: true }), adminDb("site_footer_links").select("*").order("position", { ascending: true })]);
		setSections(s.data || []);
		setLinks(l.data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const addSection = async () => {
		const title = prompt("عنوان ستون فوتر:");
		if (!title) return;
		await adminDb("site_footer_sections").insert({
			title,
			position: sections.length,
			is_active: true
		});
		load();
	};
	const updateSection = async (id, patch) => {
		await adminDb("site_footer_sections").update(patch).eq("id", id);
		load();
	};
	const delSection = async (id) => {
		if (!confirm("این ستون و همه لینک‌هایش حذف شود؟")) return;
		await adminDb("site_footer_sections").delete().eq("id", id);
		load();
	};
	const addLink = async (section_id) => {
		const label = prompt("عنوان لینک:");
		if (!label) return;
		const href = prompt("آدرس لینک:") || "#";
		const siblings = links.filter((l) => l.section_id === section_id);
		await adminDb("site_footer_links").insert({
			section_id,
			label,
			href,
			position: siblings.length
		});
		load();
	};
	const updateLink = async (id, patch) => {
		await adminDb("site_footer_links").update(patch).eq("id", id);
		load();
	};
	const delLink = async (id) => {
		await adminDb("site_footer_links").delete().eq("id", id);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaneShell, {
		title: "مدیریت فوتر",
		onRefresh: load,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: addSection,
			className: "flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " ستون جدید"]
		}),
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "در حال بارگذاری..." }) : sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "هنوز ستونی تعریف نشده — با «ستون جدید» شروع کنید." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-2 gap-4",
			children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-slate-200 rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: s.title,
							onChange: (e) => setSections((prev) => prev.map((x) => x.id === s.id ? {
								...x,
								title: e.target.value
							} : x)),
							onBlur: (e) => e.target.value !== s.title && updateSection(s.id, { title: e.target.value }),
							className: "flex-1 font-bold text-[#0b1e3f] px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => addLink(s.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							tone: "danger",
							onClick: () => delSection(s.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [links.filter((l) => l.section_id === s.id).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								defaultValue: l.label,
								onBlur: (e) => e.target.value !== l.label && updateLink(l.id, { label: e.target.value }),
								className: "flex-1 text-sm px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								defaultValue: l.href,
								dir: "ltr",
								onBlur: (e) => e.target.value !== l.href && updateLink(l.id, { href: e.target.value }),
								className: "w-40 text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								tone: "danger",
								onClick: () => delLink(l.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
							})
						]
					}, l.id)), links.filter((l) => l.section_id === s.id).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-slate-400 text-center py-2",
						children: "هنوز لینکی اضافه نشده."
					})]
				})]
			}, s.id))
		})
	});
}
function PaneShell({ title, children, onRefresh, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-6 flex-wrap gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl md:text-2xl font-extrabold text-[#0b1e3f]",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [extra, onRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRefresh,
				className: "flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), " به‌روزرسانی"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white rounded-3xl shadow-md border border-slate-100 p-4 md:p-6",
		children
	})] });
}
function DeviceToggle({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex bg-slate-100 rounded-xl p-1 text-xs font-bold",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange("desktop"),
				className: `flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "desktop" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-3.5 h-3.5" }), " دسکتاپ"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange("mobile"),
				className: `flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "mobile" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), " موبایل"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onChange("tablet"),
				className: `flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "tablet" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tablet, { className: "w-3.5 h-3.5" }), " تبلت"]
			})
		]
	});
}
function IconBtn({ children, onClick, tone = "default", disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		disabled,
		type: "button",
		onClick,
		className: `w-8 h-8 grid place-items-center rounded-lg transition ${tone === "danger" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : tone === "primary" ? "bg-[#0b1e3f] text-white hover:bg-[#122b57]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
		children
	});
}
function Th({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "text-right px-3 py-2.5 font-semibold text-xs",
		children
	});
}
function Td({ children, className = "", dir }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		dir,
		className: `px-3 py-2.5 whitespace-nowrap ${className}`,
		children
	});
}
function Empty({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-slate-400 py-16",
		children: text
	});
}
//#endregion
export { githubCheckAccount as a, DashboardGate as component, notifySaved as i, notify as n, githubPublishSnapshot as o, notifyFailed as r, AdminToaster as t };
