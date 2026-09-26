import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as Send, jt as CircleCheck, q as LoaderCircle, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-kcIQd4y9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners_.apply-DnFsZOdQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var submitPartnerApplication = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("c303e12887aa9f1ab207481ed38b4308ca02c7f6f88f40eb2b640210a239f9ee"));
function PartnerApplyPage() {
	const birthDateRef = (0, import_react.useRef)(null);
	const [form, setForm] = (0, import_react.useState)({
		fullname: "",
		birth_date: "",
		national_id: "",
		province: "",
		city: "",
		mobile: "",
		insurance_experience: "",
		type_cooperation: "",
		company_name: "",
		description: "",
		hp_field: ""
	});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [message, setMessage] = (0, import_react.useState)("");
	const [citiesData, setCitiesData] = (0, import_react.useState)({
		provinces: {},
		cities: {}
	});
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetch("/data/iran-cities.json").then((r) => r.json()).then((data) => {
			if (alive) setCitiesData(data);
		}).catch(() => void 0);
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const input = birthDateRef.current;
		if (!input) return;
		const syncBirthDate = () => {
			const value = input.value.trim();
			setForm((previous) => previous.birth_date === value ? previous : {
				...previous,
				birth_date: value
			});
			setMessage("");
			setStatus((previous) => previous === "idle" ? previous : "idle");
		};
		input.addEventListener("jdp:change", syncBirthDate);
		input.addEventListener("input", syncBirthDate);
		input.addEventListener("change", syncBirthDate);
		const start = () => {
			try {
				window.jalaliDatepicker?.startWatch({
					selector: "[data-jdp]",
					autoShow: true,
					showTodayBtn: true,
					showEmptyBtn: true,
					persianDigits: false
				});
			} catch {}
		};
		const cleanup = () => {
			input.removeEventListener("jdp:change", syncBirthDate);
			input.removeEventListener("input", syncBirthDate);
			input.removeEventListener("change", syncBirthDate);
		};
		const scriptId = "local-jalali-datepicker";
		if (document.getElementById(scriptId)) {
			start();
			return cleanup;
		}
		const script = document.createElement("script");
		script.id = scriptId;
		script.src = "/js/jalalidatepicker.min.js";
		script.onload = start;
		document.body.appendChild(script);
		return cleanup;
	}, []);
	const provinceOptions = (0, import_react.useMemo)(() => Object.entries(citiesData.provinces).map(([value, label]) => ({
		value,
		label
	})), [citiesData]);
	const cityOptions = form.province ? citiesData.cities[form.province] ?? [] : [];
	const update = (key) => (e) => {
		setForm((prev) => ({
			...prev,
			[key]: e.target.value
		}));
		setMessage("");
		if (status !== "idle") setStatus("idle");
	};
	const validate = () => {
		if (!form.fullname.trim()) return "نام و نام خانوادگی را وارد کنید.";
		if (!/^[\u0600-\u06FF\s]+$/.test(form.fullname.trim())) return "نام و نام خانوادگی باید فارسی باشد.";
		if (!/^\d{10}$/.test(form.national_id.trim())) return "کد ملی باید ۱۰ رقم باشد.";
		if (!/^09\d{9}$/.test(form.mobile.trim())) return "شماره همراه معتبر نیست.";
		const birth = form.birth_date.trim().replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/-/g, "/");
		if (!birth) return "تاریخ تولد را وارد کنید.";
		if (!/^1[34]\d{2}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/.test(birth)) return "تاریخ تولد را به صورت سال/ماه/روز وارد یا از تقویم انتخاب کنید.";
		if (!form.province) return "استان را انتخاب کنید.";
		if (!form.city) return "شهر را انتخاب کنید.";
		if (!form.insurance_experience) return "سابقه همکاری در صنعت بیمه را مشخص کنید.";
		if (form.insurance_experience === "دارم" && !form.type_cooperation) return "نوع سابقه را انتخاب کنید.";
		if (form.insurance_experience === "دارم" && !form.company_name.trim()) return "نام شرکت را وارد کنید.";
		return null;
	};
	const submit = async (e) => {
		e.preventDefault();
		const validation = validate();
		if (validation) {
			setStatus("error");
			setMessage(validation);
			return;
		}
		setStatus("sending");
		setMessage("");
		try {
			const result = await submitPartnerApplication({ data: {
				...form,
				page_url: typeof window !== "undefined" ? window.location.href : "",
				referrer: typeof document !== "undefined" ? document.referrer : ""
			} });
			if (!result.ok) {
				setStatus("error");
				setMessage(result.message || "ثبت درخواست ناموفق بود. دوباره تلاش کنید.");
				return;
			}
			setStatus("success");
			setMessage(`درخواست شما با موفقیت ثبت شد. کد پیگیری: ${result.requestKey}`);
			setForm({
				fullname: "",
				birth_date: "",
				national_id: "",
				province: "",
				city: "",
				mobile: "",
				insurance_experience: "",
				type_cooperation: "",
				company_name: "",
				description: "",
				hp_field: ""
			});
		} catch {
			setStatus("error");
			setMessage("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceWheel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container mx-auto px-4 py-10 md:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "mb-5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/partners",
									className: "hover:text-primary",
									children: "همکاران تیم ۸۴۵۲"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "درخواست همکاری" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-center text-3xl md:text-4xl font-extrabold",
							children: "درخواست نمایندگی بیمه سامان"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto w-fit rounded-tr-3xl bg-primary px-5 py-3 font-bold text-primary-foreground",
								children: "فرم درخواست نمایندگی"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3xl bg-muted p-4 md:p-6 shadow-elegant",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submit,
									className: "flex w-full flex-col gap-5 rounded-3xl bg-muted p-2 md:p-4",
									dir: "rtl",
									noValidate: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "hp_field",
											value: form.hp_field,
											onChange: update("hp_field"),
											className: "hidden",
											tabIndex: -1,
											autoComplete: "off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "partner-input",
													value: form.fullname,
													onChange: update("fullname"),
													placeholder: "نام و نام خانوادگی *",
													autoComplete: "name"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: birthDateRef,
													id: "partner-birth-date",
													name: "birth_date",
													className: "partner-input",
													value: form.birth_date,
													onChange: update("birth_date"),
													placeholder: "تاریخ تولد * (۱۳۷۰/۰۵/۱۲)",
													"data-jdp": true,
													"data-jdp-only-date": true,
													inputMode: "numeric",
													autoComplete: "off"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											required: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "partner-input",
												value: form.national_id,
												onChange: update("national_id"),
												placeholder: "کد ملی *",
												inputMode: "numeric",
												maxLength: 10
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "partner-input",
													value: form.province,
													onChange: (e) => setForm((prev) => ({
														...prev,
														province: e.target.value,
														city: ""
													})),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "انتخاب استان"
													}), provinceOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: p.value,
														children: p.label
													}, p.value))]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "partner-input",
													value: form.city,
													onChange: update("city"),
													disabled: !form.province,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "انتخاب شهر"
													}), cityOptions.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: city,
														children: city
													}, city))]
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "partner-input",
													value: form.mobile,
													onChange: update("mobile"),
													placeholder: "شماره همراه *",
													inputMode: "tel",
													maxLength: 11,
													autoComplete: "tel"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "partner-input",
													value: form.insurance_experience,
													onChange: update("insurance_experience"),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "سابقه همکاری در صنعت بیمه *"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "دارم",
															children: "دارم"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ندارم",
															children: "ندارم"
														})
													]
												})
											})]
										}),
										form.insurance_experience === "دارم" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "partner-input",
													value: form.type_cooperation,
													onChange: update("type_cooperation"),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "نوع سابقه *"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "فروش",
															children: "فروش"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "سایر",
															children: "سایر"
														})
													]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												required: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "partner-input",
													value: form.company_name,
													onChange: update("company_name"),
													placeholder: "نام شرکت *"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "partner-input min-h-32 resize-y",
											value: form.description,
											onChange: update("description"),
											placeholder: "توضیحات (اختیاری)"
										}) }),
										message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `rounded-xl px-4 py-3 text-center text-sm ${status === "success" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`,
											role: "status",
											"aria-live": "polite",
											children: [status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-1 inline-block h-5 w-5" }), message]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											disabled: status === "sending",
											className: "gradient-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-primary-foreground shadow-elegant transition hover:shadow-glow disabled:opacity-60",
											children: [status === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5" }), status === "sending" ? "در حال ارسال..." : "درخواست نمایندگی"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-2 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), "اطلاعات شما به‌صورت امن در سامانه درخواست‌های تیم ۸۴۵۲ ثبت می‌شود."]
										})
									]
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Field({ children, required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `partner-field ${required ? "required" : ""}`,
		children
	});
}
//#endregion
export { PartnerApplyPage as component };
