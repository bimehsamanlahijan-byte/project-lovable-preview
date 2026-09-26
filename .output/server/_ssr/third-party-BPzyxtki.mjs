import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/third-party-BPzyxtki.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function call(url, init) {
	let res;
	try {
		res = await fetch(url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				...init?.headers ?? {}
			}
		});
	} catch {
		throw {
			ok: false,
			status: 0,
			message: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید."
		};
	}
	let body = null;
	try {
		body = await res.json();
	} catch {
		body = null;
	}
	if (!res.ok || body?.ok === false) throw {
		ok: false,
		status: res.status,
		message: body?.message ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
		referenceCode: body?.referenceCode ?? null
	};
	return body;
}
function normalizeList(raw) {
	const list = Array.isArray(raw) ? raw : raw?.items ?? raw?.data ?? [];
	if (!Array.isArray(list)) return [];
	return list.map((item) => ({
		id: item?.id ?? item?.value ?? item?.code ?? item?.key,
		title: item?.title ?? item?.name ?? item?.label ?? item?.persianName ?? String(item?.value ?? "")
	})).filter((item) => item.id !== void 0 && item.id !== null);
}
async function fetchLookup(name, search) {
	return normalizeList((await call(`/api/third-party/lookups/${name}${search ? `?search=${encodeURIComponent(search)}` : ""}`)).data);
}
function fetchVehicleKinds(brandId) {
	return fetchLookup(`carBrand/${brandId}/kinds`);
}
async function startInquiry(payload) {
	return call("/api/third-party/start", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
async function calculatePrice(trackingCode, manualData) {
	return call(`/api/third-party/${encodeURIComponent(trackingCode)}/calculate-price`, {
		method: "POST",
		body: JSON.stringify({ manualData })
	});
}
async function fetchSummary(trackingCode) {
	return call(`/api/third-party/${encodeURIComponent(trackingCode)}/summary`);
}
/** Picks the price fields the reference widget displays. */
function extractQuote(...sources) {
	const out = {};
	const pick = (obj, key) => {
		if (out[key] !== void 0) return;
		const value = obj?.[key] ?? obj?.quote?.[key] ?? obj?.payment?.[key] ?? obj?.data?.[key];
		if (typeof value === "number") out[key] = value;
	};
	for (const source of sources) {
		if (!source) continue;
		pick(source, "premium");
		pick(source, "discount");
		pick(source, "premiumAfterDiscount");
		pick(source, "walletCredit");
		pick(source, "payableAmount");
		if (out.premiumAmount === void 0) {
			const amount = source?.quote?.premiumAmount ?? source?.data?.quote?.premiumAmount;
			if (typeof amount === "number") out.premiumAmount = amount;
		}
	}
	return out;
}
/** Static option lists taken from the captured reference widget. */
var PLATE_LETTERS = [
	"الف",
	"ب",
	"پ",
	"ت",
	"ث",
	"ج",
	"چ",
	"ح",
	"خ",
	"د",
	"ذ",
	"ر",
	"ز",
	"ژ",
	"س",
	"ش",
	"ص",
	"ض",
	"ط",
	"ظ",
	"ع",
	"غ",
	"ف",
	"ق",
	"ک",
	"گ",
	"ل",
	"م",
	"ن",
	"و",
	"ه",
	"ی",
	"D",
	"S",
	"ژ (معلولین)"
];
/** تخفیف عدم خسارت ثالث / حوادث راننده — همان درصدهای مرجع */
var DISCOUNT_PERCENTS = [
	{
		id: "0",
		label: "تخفیفی ندارم",
		value: "0"
	},
	{
		id: "5",
		label: "۵ درصد",
		value: "5"
	},
	{
		id: "10",
		label: "۱۰ درصد",
		value: "10"
	},
	{
		id: "15",
		label: "۱۵ درصد",
		value: "15"
	},
	{
		id: "20",
		label: "۲۰ درصد",
		value: "20"
	},
	{
		id: "25",
		label: "۲۵ درصد",
		value: "25"
	},
	{
		id: "30",
		label: "۳۰ درصد",
		value: "30"
	},
	{
		id: "35",
		label: "۳۵ درصد",
		value: "35"
	},
	{
		id: "40",
		label: "۴۰ درصد",
		value: "40"
	},
	{
		id: "45",
		label: "۴۵ درصد",
		value: "45"
	},
	{
		id: "50",
		label: "۵۰ درصد",
		value: "50"
	},
	{
		id: "55",
		label: "۵۵ درصد",
		value: "55"
	},
	{
		id: "60",
		label: "۶۰ درصد",
		value: "60"
	},
	{
		id: "65",
		label: "۶۵ درصد",
		value: "65"
	},
	{
		id: "70",
		label: "۷۰ درصد",
		value: "70"
	}
];
var FINANCE_DAMAGE_OPTIONS = [
	{
		id: "0",
		label: "فاقد خسارت مالی"
	},
	{
		id: "1",
		label: "یک بار خسارت مالی"
	},
	{
		id: "2",
		label: "دوبار خسارت مالی"
	},
	{
		id: "3",
		label: "سه بار خسارت مالی و یا بیشتر"
	}
];
var LIFE_DAMAGE_OPTIONS = [
	{
		id: "0",
		label: "فاقد خسارت جانی"
	},
	{
		id: "1",
		label: "یک بار خسارت جانی"
	},
	{
		id: "2",
		label: "دوبار خسارت جانی"
	},
	{
		id: "3",
		label: "سه بار خسارت جانی و یا بیشتر"
	}
];
var DRIVER_DAMAGE_OPTIONS = [
	{
		id: "0",
		label: "فاقد حوادث راننده"
	},
	{
		id: "1",
		label: "یک بار حوادث راننده"
	},
	{
		id: "2",
		label: "دوبار حوادث راننده"
	},
	{
		id: "3",
		label: "سه بار حوادث راننده و یا بیشتر"
	}
];
var STEPS = [
	{
		id: "owner",
		title: "اطلاعات متقاضی"
	},
	{
		id: "vehicle",
		title: "مشخصات خودرو"
	},
	{
		id: "previous",
		title: "بیمه‌نامه قبلی"
	},
	{
		id: "discount",
		title: "تخفیف و خسارت"
	},
	{
		id: "price",
		title: "استعلام قیمت"
	}
];
/** ارقام فارسی/عربی را به انگلیسی تبدیل می‌کند (مثل handleFaToEnDigits مرجع) */
function toEnDigits(input) {
	return (input ?? "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}
function toFaDigits(input) {
	return String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
function formatRial(value) {
	if (value === void 0 || value === null || Number.isNaN(value)) return "—";
	return toFaDigits(Math.round(value).toLocaleString("en-US")) + " ریال";
}
/** Validation rules mirrored from the captured reference widget (Persian messages). */
var REQUIRED = "پر کردن این فیلد اجباری است.";
function digits(value) {
	return toEnDigits(value ?? "").replace(/\D/g, "");
}
/** الگوریتم رسمی صحت کد ملی ایران */
function isValidNationalCode(raw) {
	const code = digits(raw);
	if (code.length !== 10) return false;
	if (/^(\d)\1{9}$/.test(code)) return false;
	const check = Number(code[9]);
	let sum = 0;
	for (let i = 0; i < 9; i += 1) sum += Number(code[i]) * (10 - i);
	const rem = sum % 11;
	return rem < 2 ? check === rem : check === 11 - rem;
}
function validateOwnerStep(form) {
	const e = {};
	const { plaque, owner } = form;
	if (!digits(plaque.segment2)) e["plaque.segment2"] = REQUIRED;
	else if (digits(plaque.segment2).length !== 2) e["plaque.segment2"] = "دو رقم اول پلاک را وارد کنید";
	if (!plaque.letter) e["plaque.letter"] = "حرف پلاک را انتخاب کنید";
	if (!digits(plaque.segment1)) e["plaque.segment1"] = REQUIRED;
	else if (digits(plaque.segment1).length !== 3) e["plaque.segment1"] = "سه رقم میانی پلاک را وارد کنید";
	if (!digits(plaque.region)) e["plaque.region"] = REQUIRED;
	else if (digits(plaque.region).length !== 2) e["plaque.region"] = "کد شهر دو رقمی است";
	if (!digits(owner.nationalCode)) e["owner.nationalCode"] = REQUIRED;
	else if (digits(owner.nationalCode).length !== 10) e["owner.nationalCode"] = "کد ملی باید ۱۰ رقم باشد";
	else if (!isValidNationalCode(owner.nationalCode)) e["owner.nationalCode"] = "کد ملی وارد شده معتبر نیست";
	if (!digits(owner.postalCode)) e["owner.postalCode"] = REQUIRED;
	else if (digits(owner.postalCode).length !== 10) e["owner.postalCode"] = "کد پستی باید ۱۰ رقم باشد";
	if (!owner.birthDate) e["owner.birthDate"] = REQUIRED;
	const mobile = digits(owner.mobile);
	if (!mobile) e["owner.mobile"] = REQUIRED;
	else if (mobile.length !== 11 || !mobile.startsWith("09")) e["owner.mobile"] = "شماره موبایل باید 11 رقم باشد";
	return e;
}
function validateVehicleStep(form) {
	const e = {};
	const v = form.vehicle;
	if (!v.carGroup) e["vehicle.carGroup"] = "نوع خودرو را انتخاب کنید";
	if (!v.usageType) e["vehicle.usageType"] = "کاربری را انتخاب کنید";
	if (!v.brand) e["vehicle.brand"] = "برند را انتخاب کنید";
	if (!v.vehicleKindId) e["vehicle.vehicleKindId"] = "تیپ را انتخاب کنید";
	if (!v.fuelType) e["vehicle.fuelType"] = "نوع سوخت را انتخاب کنید";
	if (!v.builtYear) e["vehicle.builtYear"] = "مدل را انتخاب کنید";
	return e;
}
function validatePreviousStep(form) {
	const e = {};
	const p = form.previousInsurance;
	if (!p.previousInsuranceCorpId) e["previousInsurance.previousInsuranceCorpId"] = "نام شرکت بیمه گر قبلی را انتخاب کنید";
	if (!p.previousPolicyBeginDate) e["previousInsurance.previousPolicyBeginDate"] = "تاریخ شروع بیمه‌نامه قبلی را وارد کنید.";
	if (!p.previousPolicyEndDate) e["previousInsurance.previousPolicyEndDate"] = "تاریخ پایان بیمه‌نامه قبلی را وارد کنید.";
	if (p.previousPolicyBeginDate && p.previousPolicyEndDate && p.previousPolicyEndDate <= p.previousPolicyBeginDate) e["previousInsurance.previousPolicyEndDate"] = "تاریخ پایان باید بعد از تاریخ شروع باشد.";
	return e;
}
function validateDiscountStep(form) {
	const e = {};
	const d = form.discount;
	if (!d.penaltyForCarInsuranceRenewal) e["discount.penaltyForCarInsuranceRenewal"] = "تخفیف ثالث روی بیمه‌نامه را انتخاب کنید.";
	if (!d.discountDriverYearPercent) e["discount.discountDriverYearPercent"] = "تخفیف حوادث راننده روی بیمه‌نامه را انتخاب کنید.";
	if (!d.discountFinanceYearNumber) e["discount.discountFinanceYearNumber"] = "تعداد خسارت مالی را انتخاب کنید.";
	if (!d.discountLifeYearNumber) e["discount.discountLifeYearNumber"] = "تعداد خسارت جانی را انتخاب کنید.";
	if (!d.discountDriverYearNumber) e["discount.discountDriverYearNumber"] = "تعداد خسارت حوادث راننده را انتخاب کنید.";
	return e;
}
function normalizedStartPayload(form) {
	return {
		plaque: {
			region: Number(digits(form.plaque.region)),
			letter: form.plaque.letter,
			segment1: Number(digits(form.plaque.segment1)),
			segment2: Number(digits(form.plaque.segment2))
		},
		owner: {
			nationalCode: digits(form.owner.nationalCode),
			birthDate: form.owner.birthDate,
			mobile: digits(form.owner.mobile),
			postalCode: digits(form.owner.postalCode)
		}
	};
}
function normalizedManualData(form) {
	const num = (v) => v ? Number(digits(v)) : 0;
	return {
		vehicle: {
			vehicleKindId: form.vehicle.vehicleKindId,
			builtYear: num(form.vehicle.builtYear),
			fuelType: form.vehicle.fuelType,
			usageType: form.vehicle.usageType,
			carGroup: form.vehicle.carGroup
		},
		insuranceData: {
			discountFinanceYearNumber: num(form.discount.discountFinanceYearNumber),
			penaltyForCarInsuranceRenewal: num(form.discount.penaltyForCarInsuranceRenewal),
			discountLifeYearNumber: num(form.discount.discountLifeYearNumber),
			discountDriverYearNumber: num(form.discount.discountDriverYearNumber),
			discountDriverYearPercent: num(form.discount.discountDriverYearPercent),
			previousPolicyBeginDate: form.previousInsurance.previousPolicyBeginDate,
			previousPolicyEndDate: form.previousInsurance.previousPolicyEndDate,
			previousInsuranceCorpId: form.previousInsurance.previousInsuranceCorpId,
			previousInsuranceFile: form.previousInsurance.previousInsuranceFile || null,
			transferredPlaque: form.discount.transferredPlaque === "yes"
		}
	};
}
/** ویجت چندمرحله‌ای بیمه شخص ثالث — بازسازی دقیق ویجت مرجع SI24 */
var TRACKING_KEY = "tp_tracking_code";
var REFERENCE_KEY = "tp_reference_code";
var EMPTY_FORM = {
	plaque: {
		region: "",
		letter: "",
		segment1: "",
		segment2: ""
	},
	owner: {
		nationalCode: "",
		postalCode: "",
		birthDate: "",
		mobile: ""
	},
	vehicle: {
		carGroup: "",
		usageType: "",
		brand: "",
		vehicleKindId: "",
		fuelType: "",
		builtYear: ""
	},
	previousInsurance: {
		previousInsuranceCorpId: "",
		previousPolicyBeginDate: "",
		previousPolicyEndDate: "",
		previousInsuranceFile: ""
	},
	discount: {
		penaltyForCarInsuranceRenewal: "",
		discountDriverYearPercent: "",
		transferredPlaque: "no",
		discountFinanceYearNumber: "",
		discountLifeYearNumber: "",
		discountDriverYearNumber: ""
	}
};
function useToasts() {
	const [toasts, setToasts] = import_react.useState([]);
	return {
		toasts,
		push: import_react.useCallback((kind, text) => {
			const id = Date.now() + Math.random();
			setToasts((t) => [...t, {
				id,
				kind,
				text
			}]);
			setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5e3);
		}, [])
	};
}
function errText(e) {
	const err = e;
	const base = err?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
	return err?.referenceCode ? `${base} (کد پیگیری درخواست: ${err.referenceCode})` : base;
}
function errReference(e) {
	return e?.referenceCode ?? null;
}
/** Select ساده با استایل مرجع */
function Field(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tp-field",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "tp-label",
				children: props.label
			}),
			props.children,
			props.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tp-error",
				children: props.error
			}) : props.help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tp-help",
				children: props.help
			}) : null
		]
	});
}
function LookupSelect(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		className: "tp-select",
		value: props.value,
		disabled: props.disabled || props.loading,
		"aria-invalid": props.invalid || void 0,
		onChange: (e) => props.onChange(e.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: props.loading ? "در حال دریافت..." : props.placeholder
		}), props.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: String(o.id),
			children: o.title
		}, String(o.id)))]
	});
}
function StaticSelect(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		className: "tp-select",
		value: props.value,
		"aria-invalid": props.invalid || void 0,
		onChange: (e) => props.onChange(e.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: props.placeholder
		}), props.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o.id,
			children: o.label
		}, o.id))]
	});
}
function ThirdPartyWidget() {
	const [stepIdx, setStepIdx] = import_react.useState(0);
	const [form, setForm] = import_react.useState(EMPTY_FORM);
	const [errors, setErrors] = import_react.useState({});
	const [loading, setLoading] = import_react.useState(false);
	const [trackingCode, setTrackingCode] = import_react.useState(null);
	const [referenceCode, setReferenceCode] = import_react.useState(null);
	const [quote, setQuote] = import_react.useState(null);
	const [summaryRaw, setSummaryRaw] = import_react.useState(null);
	const { toasts, push } = useToasts();
	const [carGroups, setCarGroups] = import_react.useState([]);
	const [carUsages, setCarUsages] = import_react.useState([]);
	const [brands, setBrands] = import_react.useState([]);
	const [kinds, setKinds] = import_react.useState([]);
	const [fuelTypes, setFuelTypes] = import_react.useState([]);
	const [companies, setCompanies] = import_react.useState([]);
	const [lookupsLoading, setLookupsLoading] = import_react.useState(false);
	const [kindsLoading, setKindsLoading] = import_react.useState(false);
	const step = STEPS[stepIdx].id;
	const set = import_react.useCallback((path, value) => {
		setForm((f) => {
			const [section, key] = path.split(".");
			return {
				...f,
				[section]: {
					...f[section],
					[key]: value
				}
			};
		});
		setErrors((e) => {
			if (!e[path]) return e;
			const next = { ...e };
			delete next[path];
			return next;
		});
	}, [setForm]);
	import_react.useEffect(() => {
		const saved = localStorage.getItem(TRACKING_KEY);
		setReferenceCode(localStorage.getItem(REFERENCE_KEY));
		if (!saved) return;
		setTrackingCode(saved);
		fetchSummary(saved).then((res) => {
			setSummaryRaw(res.data);
			setQuote(extractQuote(res.data));
			setStepIdx(STEPS.length - 1);
		}).catch(() => localStorage.removeItem(TRACKING_KEY));
	}, []);
	import_react.useEffect(() => {
		if (step !== "vehicle" && step !== "previous") return;
		if (carGroups.length) return;
		setLookupsLoading(true);
		Promise.allSettled([
			fetchLookup("carGroups"),
			fetchLookup("carUsages"),
			fetchLookup("vehicle-brands"),
			fetchLookup("carFuelType"),
			fetchLookup("insuranceCompanies")
		]).then(([g, u, b, f, c]) => {
			if (g.status === "fulfilled") setCarGroups(g.value);
			if (u.status === "fulfilled") setCarUsages(u.value);
			if (b.status === "fulfilled") setBrands(b.value);
			if (f.status === "fulfilled") setFuelTypes(f.value);
			if (c.status === "fulfilled") setCompanies(c.value);
			if (![
				g,
				u,
				b,
				f,
				c
			].some((r) => r.status === "fulfilled" && r.value.length > 0)) push("error", "دریافت لیست‌ها از سامانه استعلام ممکن نشد. بعداً تلاش کنید.");
			setLookupsLoading(false);
		});
	}, [
		step,
		carGroups.length,
		push
	]);
	import_react.useEffect(() => {
		if (!form.vehicle.brand) {
			setKinds([]);
			return;
		}
		setKindsLoading(true);
		fetchVehicleKinds(form.vehicle.brand).then(setKinds).catch((e) => push("error", errText(e))).finally(() => setKindsLoading(false));
	}, [form.vehicle.brand, push]);
	const goNext = async () => {
		let errs = {};
		if (step === "owner") errs = validateOwnerStep(form);
		else if (step === "vehicle") errs = validateVehicleStep(form);
		else if (step === "previous") errs = validatePreviousStep(form);
		else if (step === "discount") errs = validateDiscountStep(form);
		setErrors(errs);
		if (Object.keys(errs).length > 0) {
			push("error", "لطفاً خطاهای فرم را برطرف کنید.");
			return;
		}
		if (step === "owner") {
			setLoading(true);
			try {
				const res = await startInquiry(normalizedStartPayload(form));
				setTrackingCode(res.trackingCode);
				localStorage.setItem(TRACKING_KEY, res.trackingCode);
				if (res.referenceCode) {
					setReferenceCode(res.referenceCode);
					localStorage.setItem(REFERENCE_KEY, res.referenceCode);
				}
				setStepIdx(1);
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			} catch (e) {
				const ref = errReference(e);
				if (ref) {
					setReferenceCode(ref);
					localStorage.setItem(REFERENCE_KEY, ref);
				}
				push("error", errText(e));
			} finally {
				setLoading(false);
			}
			return;
		}
		if (step === "discount") {
			if (!trackingCode) return;
			setLoading(true);
			try {
				const calc = await calculatePrice(trackingCode, normalizedManualData(form));
				const res = await fetchSummary(trackingCode).catch(() => ({ data: calc.data }));
				setSummaryRaw(res.data);
				const q = extractQuote(res.data, calc.data);
				if (q.premium === void 0 && q.payableAmount === void 0 && q.premiumAmount === void 0) {
					push("error", "پاسخ سامانه قیمت معتبری نداشت. دوباره تلاش کنید.");
					return;
				}
				setQuote(q);
				setStepIdx(4);
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			} catch (e) {
				push("error", errText(e));
			} finally {
				setLoading(false);
			}
			return;
		}
		setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const goBack = () => setStepIdx((i) => Math.max(0, i - 1));
	const startOver = () => {
		localStorage.removeItem(TRACKING_KEY);
		localStorage.removeItem(REFERENCE_KEY);
		setReferenceCode(null);
		setForm(EMPTY_FORM);
		setQuote(null);
		setSummaryRaw(null);
		setTrackingCode(null);
		setErrors({});
		setStepIdx(0);
	};
	const er = (p) => errors[p];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tp-shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tp-badge",
					children: "فروش آنلاین"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "tp-title",
					children: "بیمه شخص ثالث"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tp-subtitle",
					children: "اطلاعات خودرو و بیمه‌گذار را وارد کنید تا قیمت دقیق بیمه‌نامه استعلام شود."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 20 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "tp-stepper",
					role: "tablist",
					"aria-label": "مراحل خرید بیمه شخص ثالث",
					children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tp-step",
						"data-state": i === stepIdx ? "active" : i < stepIdx ? "done" : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tp-step-index",
							children: toFaDigits(i + 1)
						}), s.title]
					}, s.id))
				}),
				step === "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-card tp-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "tp-card-title",
							children: "اطلاعات پلاک و بیمه‌گذار"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tp-card-hint",
							children: "پلاک خودرو و مشخصات مالک را مطابق کارت خودرو وارد کنید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-field",
							style: { marginBottom: 16 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "tp-label",
									children: "پلاک خودرو"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "tp-plate",
									"data-invalid": er("plaque.region") || er("plaque.letter") || er("plaque.segment1") || er("plaque.segment2") ? "true" : void 0,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "tp-plate-flag",
											children: "I.R."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "tp-plate-seg2",
											inputMode: "numeric",
											maxLength: 2,
											placeholder: "۱۲",
											value: toFaDigits(form.plaque.segment2),
											onChange: (e) => set("plaque.segment2", toEnDigits(e.target.value)),
											"aria-label": "دو رقم اول پلاک"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "tp-plate-letter",
											value: form.plaque.letter,
											onChange: (e) => set("plaque.letter", e.target.value),
											"aria-label": "حرف پلاک",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "حرف"
											}), PLATE_LETTERS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: l,
												children: l
											}, l))]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "tp-plate-seg1",
											inputMode: "numeric",
											maxLength: 3,
											placeholder: "۳۴۵",
											value: toFaDigits(form.plaque.segment1),
											onChange: (e) => set("plaque.segment1", toEnDigits(e.target.value)),
											"aria-label": "سه رقم میانی پلاک"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "tp-plate-region",
											inputMode: "numeric",
											maxLength: 2,
											placeholder: "۶۷",
											value: toFaDigits(form.plaque.region),
											onChange: (e) => set("plaque.region", toEnDigits(e.target.value)),
											"aria-label": "کد شهر پلاک"
										})
									]
								}),
								(er("plaque.segment2") || er("plaque.letter") || er("plaque.segment1") || er("plaque.region")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tp-error",
									children: er("plaque.segment2") || er("plaque.letter") || er("plaque.segment1") || er("plaque.region")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-grid tp-grid-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "کد ملی بیمه‌گذار",
									error: er("owner.nationalCode"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										maxLength: 10,
										placeholder: "مثال: ۰۰۲۳۴۵۶۷۸۹",
										"aria-invalid": !!er("owner.nationalCode") || void 0,
										value: toFaDigits(form.owner.nationalCode),
										onChange: (e) => set("owner.nationalCode", toEnDigits(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "کد پستی",
									error: er("owner.postalCode"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										maxLength: 10,
										placeholder: "۱۰ رقم بدون خط تیره",
										"aria-invalid": !!er("owner.postalCode") || void 0,
										value: toFaDigits(form.owner.postalCode),
										onChange: (e) => set("owner.postalCode", toEnDigits(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تاریخ تولد",
									error: er("owner.birthDate"),
									help: "به صورت شمسی؛ مثال: ۱۳۷۰/۰۵/۱۲",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										placeholder: "۱۳۷۰/۰۵/۱۲",
										"aria-invalid": !!er("owner.birthDate") || void 0,
										value: toFaDigits(form.owner.birthDate),
										onChange: (e) => set("owner.birthDate", toEnDigits(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "شماره موبایل",
									error: er("owner.mobile"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										maxLength: 11,
										placeholder: "09xxxxxxxxx",
										"aria-invalid": !!er("owner.mobile") || void 0,
										value: toFaDigits(form.owner.mobile),
										onChange: (e) => set("owner.mobile", toEnDigits(e.target.value))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "tp-btn tp-btn-primary",
								onClick: goNext,
								disabled: loading,
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tp-spinner" }), "مرحله بعد"]
							})
						})
					]
				}),
				step === "vehicle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-card tp-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "tp-card-title",
							children: "مشخصات خودرو"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tp-card-hint",
							children: "مشخصات خودرو را مطابق کارت یا سند انتخاب کنید."
						}),
						lookupsLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-skeleton",
							style: { marginBottom: 16 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-grid tp-grid-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "نوع خودرو",
									error: er("vehicle.carGroup"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.vehicle.carGroup,
										onChange: (v) => set("vehicle.carGroup", v),
										options: carGroups,
										placeholder: "انتخاب کنید",
										invalid: !!er("vehicle.carGroup"),
										loading: lookupsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "کاربری",
									error: er("vehicle.usageType"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.vehicle.usageType,
										onChange: (v) => set("vehicle.usageType", v),
										options: carUsages,
										placeholder: "انتخاب کنید",
										invalid: !!er("vehicle.usageType"),
										loading: lookupsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "برند",
									error: er("vehicle.brand"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.vehicle.brand,
										onChange: (v) => {
											set("vehicle.brand", v);
											set("vehicle.vehicleKindId", "");
										},
										options: brands,
										placeholder: "انتخاب کنید",
										invalid: !!er("vehicle.brand"),
										loading: lookupsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تیپ",
									error: er("vehicle.vehicleKindId"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.vehicle.vehicleKindId,
										onChange: (v) => set("vehicle.vehicleKindId", v),
										options: kinds,
										placeholder: form.vehicle.brand ? "انتخاب کنید" : "ابتدا برند را انتخاب کنید",
										invalid: !!er("vehicle.vehicleKindId"),
										disabled: !form.vehicle.brand,
										loading: kindsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "نوع سوخت",
									error: er("vehicle.fuelType"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.vehicle.fuelType,
										onChange: (v) => set("vehicle.fuelType", v),
										options: fuelTypes,
										placeholder: "انتخاب کنید",
										invalid: !!er("vehicle.fuelType"),
										loading: lookupsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "سال ساخت (مدل)",
									error: er("vehicle.builtYear"),
									help: "به صورت شمسی؛ مثال: ۱۴۰۲",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										maxLength: 4,
										placeholder: "۱۴۰۲",
										"aria-invalid": !!er("vehicle.builtYear") || void 0,
										value: toFaDigits(form.vehicle.builtYear),
										onChange: (e) => set("vehicle.builtYear", toEnDigits(e.target.value))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-primary",
								onClick: goNext,
								disabled: loading,
								children: "مرحله بعد"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-ghost",
								onClick: goBack,
								disabled: loading,
								children: "مرحله قبل"
							})]
						})
					]
				}),
				step === "previous" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-card tp-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "tp-card-title",
							children: "بیمه‌نامه قبلی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tp-card-hint",
							children: "اطلاعات آخرین بیمه‌نامه شخص ثالث خودرو را وارد کنید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-grid tp-grid-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "شرکت بیمه‌گر قبلی",
									error: er("previousInsurance.previousInsuranceCorpId"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupSelect, {
										value: form.previousInsurance.previousInsuranceCorpId,
										onChange: (v) => set("previousInsurance.previousInsuranceCorpId", v),
										options: companies,
										placeholder: "انتخاب کنید",
										invalid: !!er("previousInsurance.previousInsuranceCorpId"),
										loading: lookupsLoading
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "شماره بیمه‌نامه قبلی (اختیاری)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										value: form.previousInsurance.previousInsuranceFile,
										onChange: (e) => set("previousInsurance.previousInsuranceFile", toEnDigits(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تاریخ شروع بیمه‌نامه قبلی",
									error: er("previousInsurance.previousPolicyBeginDate"),
									help: "شمسی؛ مثال: ۱۴۰۳/۰۶/۰۱",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										placeholder: "۱۴۰۳/۰۶/۰۱",
										"aria-invalid": !!er("previousInsurance.previousPolicyBeginDate") || void 0,
										value: toFaDigits(form.previousInsurance.previousPolicyBeginDate),
										onChange: (e) => set("previousInsurance.previousPolicyBeginDate", toEnDigits(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تاریخ پایان بیمه‌نامه قبلی",
									error: er("previousInsurance.previousPolicyEndDate"),
									help: "شمسی؛ مثال: ۱۴۰۴/۰۶/۰۱",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "tp-input",
										inputMode: "numeric",
										placeholder: "۱۴۰۴/۰۶/۰۱",
										"aria-invalid": !!er("previousInsurance.previousPolicyEndDate") || void 0,
										value: toFaDigits(form.previousInsurance.previousPolicyEndDate),
										onChange: (e) => set("previousInsurance.previousPolicyEndDate", toEnDigits(e.target.value))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-primary",
								onClick: goNext,
								disabled: loading,
								children: "مرحله بعد"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-ghost",
								onClick: goBack,
								disabled: loading,
								children: "مرحله قبل"
							})]
						})
					]
				}),
				step === "discount" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-card tp-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "tp-card-title",
							children: "تخفیف عدم خسارت و سوابق خسارت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tp-card-hint",
							children: "درصد تخفیف و تعداد خسارات سال‌های گذشته را انتخاب کنید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-grid tp-grid-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "درصد تخفیف عدم خسارت شخص ثالث",
									error: er("discount.penaltyForCarInsuranceRenewal"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticSelect, {
										value: form.discount.penaltyForCarInsuranceRenewal,
										onChange: (v) => set("discount.penaltyForCarInsuranceRenewal", v),
										options: DISCOUNT_PERCENTS.map((d) => ({
											id: d.id,
											label: d.label
										})),
										placeholder: "انتخاب کنید",
										invalid: !!er("discount.penaltyForCarInsuranceRenewal")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "درصد تخفیف حوادث راننده",
									error: er("discount.discountDriverYearPercent"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticSelect, {
										value: form.discount.discountDriverYearPercent,
										onChange: (v) => set("discount.discountDriverYearPercent", v),
										options: DISCOUNT_PERCENTS.map((d) => ({
											id: d.id,
											label: d.label
										})),
										placeholder: "انتخاب کنید",
										invalid: !!er("discount.discountDriverYearPercent")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تعداد خسارت مالی",
									error: er("discount.discountFinanceYearNumber"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticSelect, {
										value: form.discount.discountFinanceYearNumber,
										onChange: (v) => set("discount.discountFinanceYearNumber", v),
										options: FINANCE_DAMAGE_OPTIONS,
										placeholder: "انتخاب کنید",
										invalid: !!er("discount.discountFinanceYearNumber")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تعداد خسارت جانی",
									error: er("discount.discountLifeYearNumber"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticSelect, {
										value: form.discount.discountLifeYearNumber,
										onChange: (v) => set("discount.discountLifeYearNumber", v),
										options: LIFE_DAMAGE_OPTIONS,
										placeholder: "انتخاب کنید",
										invalid: !!er("discount.discountLifeYearNumber")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "تعداد خسارت حوادث راننده",
									error: er("discount.discountDriverYearNumber"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaticSelect, {
										value: form.discount.discountDriverYearNumber,
										onChange: (v) => set("discount.discountDriverYearNumber", v),
										options: DRIVER_DAMAGE_OPTIONS,
										placeholder: "انتخاب کنید",
										invalid: !!er("discount.discountDriverYearNumber")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "آیا تخفیف از پلاک دیگری منتقل شده است؟",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tp-choices",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "tp-choice",
											"aria-pressed": form.discount.transferredPlaque === "no",
											onClick: () => set("discount.transferredPlaque", "no"),
											children: "خیر"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "tp-choice",
											"aria-pressed": form.discount.transferredPlaque === "yes",
											onClick: () => set("discount.transferredPlaque", "yes"),
											children: "بله"
										})]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tp-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "tp-btn tp-btn-primary",
								onClick: goNext,
								disabled: loading,
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tp-spinner" }), "استعلام قیمت"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-ghost",
								onClick: goBack,
								disabled: loading,
								children: "مرحله قبل"
							})]
						})
					]
				}),
				step === "price" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tp-card tp-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "tp-card-title",
							children: "استعلام قیمت بیمه شخص ثالث"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tp-card-hint",
							children: trackingCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["کد رهگیری استعلام: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: trackingCode })] }) : "خلاصه قیمت"
						}),
						referenceCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tp-card-hint",
							children: ["کد پیگیری درخواست در دفتر ما: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: referenceCode })]
						}),
						!quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-skeleton",
							style: { marginBottom: 12 }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tp-skeleton" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							quote.premium !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-summary-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حق بیمه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRial(quote.premium) })]
							}),
							quote.discount !== void 0 && quote.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-summary-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تخفیف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRial(quote.discount) })]
							}),
							quote.premiumAfterDiscount !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-summary-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حق بیمه پس از تخفیف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRial(quote.premiumAfterDiscount) })]
							}),
							quote.walletCredit !== void 0 && quote.walletCredit > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-summary-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اعتبار کیف پول" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRial(quote.walletCredit) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tp-summary-total",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مبلغ قابل پرداخت" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRial(quote.payableAmount ?? quote.premiumAfterDiscount ?? quote.premiumAmount ?? quote.premium) })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tp-btn tp-btn-ghost",
								onClick: startOver,
								children: "استعلام جدید"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tp-alert tp-alert-info",
							style: {
								marginTop: 16,
								marginBottom: 0
							},
							children: "برای نهایی‌سازی خرید و صدور بیمه‌نامه با همین کد رهگیری با کارشناسان ما در تماس باشید."
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tp-toasts",
			"aria-live": "polite",
			children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tp-toast",
				"data-kind": t.kind,
				children: t.text
			}, t.id))
		})]
	});
}
function ThirdPartyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThirdPartyWidget, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { ThirdPartyPage as component };
