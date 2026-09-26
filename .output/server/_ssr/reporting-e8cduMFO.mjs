import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ItemPage } from "./ItemPage-XRZNggAV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reporting-e8cduMFO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportingPage() {
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		phone: "",
		policyNumber: "",
		accidentDate: "",
		description: ""
	});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("");
	const update = (key) => (e) => {
		setForm((p) => ({
			...p,
			[key]: e.target.value
		}));
	};
	const submit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim() || !form.phone.trim()) {
			setMsg("لطفاً نام و شماره تماس را وارد کنید.");
			setStatus("error");
			return;
		}
		setStatus("sending");
		setMsg("");
		try {
			const r = await fetch("/api/report-damage", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			const data = await r.json().catch(() => ({}));
			if (r.ok && data.ok) {
				setStatus("ok");
				setMsg("گزارش خسارت شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.");
				setForm({
					fullName: "",
					phone: "",
					policyNumber: "",
					accidentDate: "",
					description: ""
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ItemPage, {
		title: "گزارشگری و افشای اطلاعات",
		subtitle: "دسترسی به گزارش‌های مالی، صورت‌های مالی سالانه و اطلاعیه‌های سهامداران بیمه سامان.",
		breadcrumbs: [{ label: "گزارشگری و افشای اطلاعات" }],
		ctaLabel: "ارتباط با امور سهام",
		ctaHref: "/contact",
		highlights: [
			"صورت‌های مالی حسابرسی‌شده",
			"گزارش فعالیت هیئت مدیره",
			"اطلاعیه‌های سهامداران",
			"افشای اطلاعات با اهمیت"
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 text-sm md:text-base leading-8 text-muted-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "صورت‌های مالی حسابرسی‌شده، گزارش فعالیت هیئت مدیره و اطلاعیه‌های مهم سهامداران از طریق این بخش در دسترس است. برای دسترسی به اسناد کدال و اطلاعات بیشتر به وب‌سایت رسمی شرکت مراجعه کنید." })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl md:text-2xl font-extrabold mb-2",
					children: "ثبت گزارش خسارت"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mb-6",
					children: "اطلاعات حادثه را وارد کنید تا کارشناسان ما پیگیری کنند"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "شماره بیمه‌نامه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.policyNumber,
							onChange: update("policyNumber"),
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "تاریخ حادثه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "مثلاً ۱۴۰۳/۰۱/۱۵",
							value: form.accidentDate,
							onChange: update("accidentDate"),
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium mb-1.5",
								children: "شرح حادثه و خسارت"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: form.description,
								onChange: update("description"),
								className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
							})]
						}),
						msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `md:col-span-2 text-sm text-center rounded-xl px-4 py-3 ${status === "ok" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`,
							children: msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: status === "sending",
								className: "gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60",
								children: status === "sending" ? "در حال ارسال..." : "ثبت گزارش خسارت"
							})
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ReportingPage as component };
