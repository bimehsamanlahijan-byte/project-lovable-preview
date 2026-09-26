import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as stringType, r as literalType } from "../_libs/zod.mjs";
import { r as LOGIN_PROVIDERS } from "./registry-DLN8hP8L.mjs";
import { t as createSsrRpc } from "./createSsrRpc-kcIQd4y9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BN_ABnyf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Client-callable server functions for the central login system. */
var authMe = createServerFn({ method: "GET" }).handler(createSsrRpc("98c5bcb3b72fbe2099cc9ac391d03bc87b126212406abe7e768aefeb16f8a303"));
var authLogout = createServerFn({ method: "POST" }).handler(createSsrRpc("be81e5a401961bbfe224593f60636087be35b75a6984dd9a10e238c19055ae99"));
createServerFn({ method: "GET" }).inputValidator((d) => objectType({ module: stringType().min(1) }).parse(d)).handler(createSsrRpc("fdc8e3045e4193e2c6a325df5a82aaed2aeefc164a9db37d2f889812a504a773"));
var authSavePhone = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	phone: stringType().trim().min(8).max(20),
	consent: literalType(true)
}).parse(d)).handler(createSsrRpc("c19e588b0ac9cbfa2e3bceffe02cb89dcb1c3ff8aa1d0dcd5f96fe1a2ffe21de"));
var authRemovePhone = createServerFn({ method: "POST" }).handler(createSsrRpc("2a1e3bf2d00be27b1b6b26c582c617d51b03d5773365033a0876ff1e18c6d8de"));
createServerFn({ method: "GET" }).handler(createSsrRpc("e2d24556c8dd51c755a580ac415b75aaee3a91ab3a066ef42a441ce213b01c70"));
function LoginPage() {
	const search = useSearch({ from: "/login" });
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [phone, setPhone] = (0, import_react.useState)("");
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		authMe().then((r) => setUser(r.user)).catch(() => setUser(null)).finally(() => setLoading(false));
	}, []);
	const startUrl = (path) => {
		const p = new URLSearchParams();
		if (search.module) p.set("module", search.module);
		if (search.next) p.set("next", search.next);
		return `${path}?${p.toString()}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen bg-[#eef2f8] flex items-center justify-center p-4 font-sans",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-extrabold text-[#0b1e3f] text-center",
					children: "ورود به خدمات آنلاین"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-slate-500 text-center",
					children: "بیمه سامان — نمایندگی آذرخش لاهیجان"
				}),
				search.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl bg-red-50 text-red-700 text-xs p-3",
					children: search.error
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 text-center text-sm text-slate-400",
					children: "در حال بررسی وضعیت ورود…"
				}) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-slate-50 p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-[#0b1e3f]",
									children: [
										user.displayName ?? "کاربر",
										" ",
										user.telegram?.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-400 text-xs",
											children: ["@", user.telegram.username]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-slate-500 mt-1",
									children: ["روش ورود: ", user.provider === "telegram" ? "تلگرام" : user.provider]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-slate-500 mt-1",
									children: ["شماره تماس: ", user.phone ?? "ثبت نشده"]
								})
							]
						}),
						!user.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-slate-200 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold text-[#0b1e3f]",
									children: "ثبت اختیاری شماره تماس"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 mt-1 leading-6",
									children: "ثبت شماره کاملاً اختیاری است و تلگرام آن را به‌صورت خودکار در اختیار سایت نمی‌گذارد. فقط در صورتی که خودتان بخواهید، برای پیگیری خدمات ذخیره می‌شود."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "مثلاً 09121234567",
									className: "mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-3 flex items-center gap-2 text-xs text-slate-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: consent,
										onChange: (e) => setConsent(e.target.checked)
									}), "با ذخیره شماره تماسم موافقم."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: !consent || phone.trim().length < 8,
									onClick: async () => {
										const res = await authSavePhone({ data: {
											phone: phone.trim(),
											consent: true
										} });
										setMsg(res.ok ? "شماره ذخیره شد." : res.error ?? "ذخیره نشد.");
										if (res.ok) setUser((u) => u ? {
											...u,
											phone: phone.trim(),
											hasPhoneConsent: true
										} : u);
									},
									className: "mt-3 w-full rounded-xl bg-[#0b1e3f] text-white text-sm font-bold py-2.5 disabled:opacity-40",
									children: "ذخیره شماره"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await authRemovePhone();
								setUser((u) => u ? {
									...u,
									phone: null,
									hasPhoneConsent: false
								} : u);
								setMsg("شماره حذف شد.");
							},
							className: "w-full rounded-xl border border-slate-200 text-sm py-2.5",
							children: "حذف شماره تماس من"
						}),
						msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-emerald-600 text-center",
							children: msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: search.next ?? "/",
								className: "flex-1 text-center rounded-xl bg-[#c81e35] text-white text-sm font-bold py-2.5",
								children: "ادامه"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await authLogout();
									window.location.href = "/";
								},
								className: "flex-1 rounded-xl border border-slate-200 text-sm py-2.5",
								children: "خروج از حساب"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [LOGIN_PROVIDERS.map((p) => p.available && p.startPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: startUrl(p.startPath),
						className: "block text-center rounded-xl bg-[#229ED9] text-white text-sm font-bold py-3",
						children: p.label
					}, p.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs text-center py-3",
						children: [p.label, " — به‌زودی"]
					}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-400 leading-6 text-center",
						children: "ورود از طریق حساب تلگرام شما انجام می‌شود. شماره تلفن فقط با اجازه خودتان و در مرحله بعد ثبت می‌شود."
					})]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
