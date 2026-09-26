import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Plane, Mt as ChevronRight, Nt as ChevronLeft, Rt as CalendarDays, Ut as BadgeCheck, bt as Earth, jt as CircleCheck, o as Users, q as LoaderCircle, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
import { t as LongformSections } from "./LongformSections-1Q75GVwA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insurance.travel-BUtKjQMN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZONES = [
	{
		key: "schengen",
		label: "اروپا / حوزه شنگن",
		factor: 1
	},
	{
		key: "asia",
		label: "آسیا و خاورمیانه",
		factor: .8
	},
	{
		key: "americas",
		label: "آمریکا و کانادا",
		factor: 1.85
	},
	{
		key: "world",
		label: "سایر نقاط جهان",
		factor: 1.25
	}
];
var CEILINGS = [
	{
		key: "30",
		label: "۳۰ هزار یورو",
		factor: 1
	},
	{
		key: "50",
		label: "۵۰ هزار یورو",
		factor: 1.3
	},
	{
		key: "100",
		label: "۱۰۰ هزار یورو",
		factor: 1.75
	}
];
var AGE_BANDS = [
	{
		key: "0-12",
		label: "زیر ۱۲ سال",
		factor: .7
	},
	{
		key: "13-65",
		label: "۱۳ تا ۶۵ سال",
		factor: 1
	},
	{
		key: "66-75",
		label: "۶۶ تا ۷۵ سال",
		factor: 2
	},
	{
		key: "76-85",
		label: "۷۶ تا ۸۵ سال",
		factor: 3.2
	}
];
var DURATIONS = [
	{
		key: "7",
		label: "تا ۷ روز",
		days: 7,
		base: 95e4
	},
	{
		key: "15",
		label: "تا ۱۵ روز",
		days: 15,
		base: 125e4
	},
	{
		key: "31",
		label: "تا ۳۱ روز",
		days: 31,
		base: 175e4
	},
	{
		key: "62",
		label: "تا ۶۲ روز",
		days: 62,
		base: 265e4
	},
	{
		key: "92",
		label: "تا ۹۲ روز",
		days: 92,
		base: 35e5
	},
	{
		key: "180",
		label: "تا ۶ ماه",
		days: 180,
		base: 54e5
	},
	{
		key: "365",
		label: "یک ساله",
		days: 365,
		base: 89e5
	}
];
function calcPremium(i) {
	const z = ZONES.find((x) => x.key === i.zone)?.factor ?? 1;
	const d = DURATIONS.find((x) => x.key === i.duration)?.base ?? 95e4;
	const c = CEILINGS.find((x) => x.key === i.ceiling)?.factor ?? 1;
	const a = AGE_BANDS.find((x) => x.key === i.age)?.factor ?? 1;
	const n = Math.max(1, Math.min(10, i.travelers || 1));
	const raw = d * z * c * a * n;
	return Math.round(raw / 1e3) * 1e3;
}
function formatRial(v) {
	return v.toLocaleString("fa-IR");
}
function labelOf(list, key) {
	return list.find((x) => x.key === key)?.label ?? key;
}
var COVERAGES = [
	"هزینه‌های پزشکی و بستری اضطراری در خارج از کشور",
	"بازگرداندن بیمار و انتقال جسد به ایران",
	"از دست رفتن یا تأخیر چمدان",
	"تأخیر و لغو پرواز",
	"مفقود شدن مدارک مسافرتی",
	"مسئولیت مدنی در برابر اشخاص ثالث"
];
function TravelPurchasePage() {
	const [step, setStep] = (0, import_react.useState)(0);
	const [zone, setZone] = (0, import_react.useState)("schengen");
	const [duration, setDuration] = (0, import_react.useState)("15");
	const [ceiling, setCeiling] = (0, import_react.useState)("50");
	const [age, setAge] = (0, import_react.useState)("13-65");
	const [travelers, setTravelers] = (0, import_react.useState)(1);
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [nationalId, setNationalId] = (0, import_react.useState)("");
	const [passport, setPassport] = (0, import_react.useState)("");
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const premium = (0, import_react.useMemo)(() => calcPremium({
		zone,
		duration,
		ceiling,
		age,
		travelers
	}), [
		zone,
		duration,
		ceiling,
		age,
		travelers
	]);
	const canSubmit = fullName.trim().length > 1 && nationalId.trim().length > 4 && phone.trim().length > 7;
	async function submit() {
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/travel-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName,
					nationalId,
					passport,
					birthDate,
					phone,
					email,
					zone,
					zoneLabel: ZONES.find((z) => z.key === zone)?.label ?? zone,
					duration,
					durationLabel: labelOf(DURATIONS, duration),
					ceilingLabel: labelOf(CEILINGS, ceiling),
					ageLabel: labelOf(AGE_BANDS, age),
					travelers,
					startDate,
					premium,
					note
				})
			});
			const data = await res.json();
			if (!res.ok || !data.ok) throw new Error("failed");
			setCode(data.code ?? "");
			setStep(2);
		} catch {
			setError("ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید یا با ۰۹۱۱۶۱۶۹۲۱۵ تماس بگیرید.");
		} finally {
			setBusy(false);
		}
	}
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3 h-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/insurance",
									className: "hover:underline",
									children: "انواع بیمه‌ها"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3 h-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "بیمه مسافرتی" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "w-8 h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl md:text-4xl font-extrabold",
								children: "خرید آنلاین بیمه مسافرتی"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm md:text-base opacity-90 max-w-3xl leading-8",
							children: "نرخ بیمه‌نامه را در چند ثانیه استعلام بگیرید و درخواست صدور را همین‌جا ثبت کنید. بیمه‌نامه به زبان انگلیسی و مورد تأیید سفارتخانه‌های حوزه شنگن صادر می‌شود."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "container mx-auto px-4 py-10 md:py-14 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-3xl shadow-soft p-5 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { step }),
						step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "w-4 h-4" }),
									label: "مقصد سفر",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-2 gap-2",
										children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: zone === z.key,
											onClick: () => setZone(z.key),
											label: z.label
										}, z.key))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-4 h-4" }),
									label: "مدت سفر",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-3 gap-2",
										children: DURATIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: duration === d.key,
											onClick: () => setDuration(d.key),
											label: d.label
										}, d.key))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }),
									label: "سقف تعهد پزشکی",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-3 gap-2",
										children: CEILINGS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: ceiling === c.key,
											onClick: () => setCeiling(c.key),
											label: c.label
										}, c.key))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" }),
									label: "رده سنی مسافر",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid sm:grid-cols-4 gap-2",
										children: AGE_BANDS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
											active: age === a.key,
											onClick: () => setAge(a.key),
											label: a.label
										}, a.key))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-muted-foreground",
											children: "تعداد مسافر"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 1,
											max: 10,
											value: travelers,
											onChange: (e) => setTravelers(Number(e.target.value)),
											className: "mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-muted-foreground",
											children: "تاریخ شروع سفر (اختیاری)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: startDate,
											onChange: (e) => setStartDate(e.target.value),
											placeholder: "مثلاً ۱۴۰۵/۰۶/۱۵",
											className: "mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStep(1),
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-full hover:opacity-90 transition",
									children: ["ادامه و تکمیل مشخصات", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })]
								})
							]
						}),
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "نام و نام خانوادگی *",
											value: fullName,
											onChange: setFullName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "کد ملی *",
											value: nationalId,
											onChange: setNationalId,
											dir: "ltr"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "شماره گذرنامه",
											value: passport,
											onChange: setPassport,
											dir: "ltr"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "تاریخ تولد",
											value: birthDate,
											onChange: setBirthDate,
											placeholder: "۱۳۷۰/۰۵/۰۱"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "شماره موبایل *",
											value: phone,
											onChange: setPhone,
											dir: "ltr"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											label: "ایمیل",
											value: email,
											onChange: setEmail,
											dir: "ltr"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground",
										children: "توضیحات تکمیلی"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: note,
										onChange: (e) => setNote(e.target.value),
										rows: 3,
										className: "mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-destructive font-bold",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setStep(0),
										className: "inline-flex items-center gap-2 border border-border text-sm font-bold px-6 py-3 rounded-full hover:bg-muted transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }), "بازگشت"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: submit,
										disabled: !canSubmit || busy,
										className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-full disabled:opacity-50 hover:opacity-90 transition",
										children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-4 h-4" }), "ثبت نهایی درخواست صدور"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-6",
									children: "پس از ثبت، کارشناس نمایندگی برای تأیید اطلاعات و ارسال لینک پرداخت با شما تماس می‌گیرد. مبلغ نمایش داده‌شده برآورد اولیه است و نرخ قطعی پس از بررسی مدارک اعلام می‌شود."
								})
							]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 text-center py-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 h-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-8 h-8" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-extrabold mb-2",
									children: "درخواست شما ثبت شد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground leading-7 max-w-md mx-auto",
									children: [
										"کد پیگیری شما ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-foreground",
											children: code
										}),
										" است. این کد را نزد خود نگه دارید؛ کارشناس ما به‌زودی تماس می‌گیرد."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setStep(0);
										setCode("");
									},
									className: "mt-6 inline-flex items-center gap-2 border border-border text-sm font-bold px-6 py-3 rounded-full hover:bg-muted transition",
									children: "ثبت درخواست جدید"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "lg:sticky lg:top-24 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-primary text-primary-foreground rounded-3xl p-6 shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs opacity-85 mb-1",
								children: "حق بیمه برآوردی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-extrabold",
								children: formatRial(premium)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs opacity-85 mt-1",
								children: "ریال"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-5 space-y-2 text-xs opacity-95",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["مقصد: ", ZONES.find((z) => z.key === zone)?.label] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["مدت: ", labelOf(DURATIONS, duration)] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["سقف پوشش: ", labelOf(CEILINGS, ceiling)] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["رده سنی: ", labelOf(AGE_BANDS, age)] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["تعداد مسافر: ", travelers] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-3xl p-6 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-sm mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-primary" }), "پوشش‌های بیمه‌نامه"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: COVERAGES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-xs leading-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
							}, c))
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LongformSections, { path: "/insurance/travel" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Stepper({ step }) {
	const items = [
		"مشخصات سفر",
		"اطلاعات بیمه‌شده",
		"تأیید نهایی"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2",
		children: items.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
					children: i + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-xs font-bold ${i <= step ? "text-foreground" : "text-muted-foreground"}`,
					children: label
				}),
				i < items.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
			]
		}, label))
	});
}
function Field({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 mb-3 text-sm font-extrabold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			children: icon
		}), label]
	}), children] });
}
function Choice({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `text-xs font-bold rounded-xl border px-4 py-3 text-center transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"}`,
		children: label
	});
}
function Input({ label, value, onChange, dir, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-bold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			dir,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
		})]
	});
}
//#endregion
export { TravelPurchasePage as component };
