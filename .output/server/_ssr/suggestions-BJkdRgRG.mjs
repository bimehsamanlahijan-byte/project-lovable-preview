import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ItemPage } from "./ItemPage-XRZNggAV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suggestions-BJkdRgRG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuggestionsPage() {
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		phone: "",
		category: "suggestion",
		message: ""
	});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("");
	const [trackingId, setTrackingId] = (0, import_react.useState)(null);
	const update = (key) => (e) => {
		setForm((p) => ({
			...p,
			[key]: e.target.value
		}));
	};
	const submit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
			setMsg("لطفاً نام، شماره تماس و متن پیام را وارد کنید.");
			setStatus("error");
			return;
		}
		setStatus("sending");
		setMsg("");
		try {
			const r = await fetch("/api/public/suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			const data = await r.json().catch(() => ({}));
			if (r.ok && data.ok) {
				setStatus("ok");
				setTrackingId(data.trackingId ?? null);
				setMsg("پیام شما با موفقیت ثبت شد.");
				setForm({
					fullName: "",
					phone: "",
					category: "suggestion",
					message: ""
				});
			} else {
				setStatus("error");
				setMsg("ارسال ناموفق بود. لطفاً دوباره تلاش کنید.");
			}
		} catch {
			setStatus("error");
			setMsg("خطا در ارتباط با سرور.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemPage, {
		title: "انتقادات و پیشنهادات",
		subtitle: "نظر شما برای ما ارزشمند است؛ انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید.",
		breadcrumbs: [{ label: "انتقادات و پیشنهادات" }],
		ctaLabel: "تماس با ما",
		ctaHref: "/contact",
		highlights: [
			"صدور کد رهگیری برای هر پیام",
			"ثبت تاریخ و ساعت دریافت در پیشخوان مدیریت",
			"بررسی همه پیام‌ها توسط تیم پشتیبانی"
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl md:text-2xl font-extrabold mb-2",
					children: "فرم ثبت انتقاد و پیشنهاد"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mb-6",
					children: "پس از ارسال، کد رهگیری برایتان نمایش داده می‌شود."
				}),
				status === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 bg-primary-soft text-primary rounded-2xl px-5 py-4 text-sm text-center",
					children: [msg, trackingId !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 font-extrabold text-lg",
						dir: "ltr",
						children: ["کد رهگیری: ", trackingId.toLocaleString("fa-IR")]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid md:grid-cols-2 gap-4",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "نام و نام خانوادگی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.fullName,
							onChange: update("fullName"),
							required: true,
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "شماره تماس"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							value: form.phone,
							onChange: update("phone"),
							required: true,
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium mb-1.5",
								children: "نوع پیام"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.category,
								onChange: update("category"),
								className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "suggestion",
									children: "پیشنهاد"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "criticism",
									children: "انتقاد"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium mb-1.5",
								children: "متن پیام"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 5,
								value: form.message,
								onChange: update("message"),
								required: true,
								className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
							})]
						}),
						msg && status !== "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2 text-sm text-center rounded-xl px-4 py-3 bg-destructive/10 text-destructive",
							children: msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: status === "sending",
								className: "gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60",
								children: status === "sending" ? "در حال ارسال..." : "ثبت پیام"
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
export { SuggestionsPage as component };
