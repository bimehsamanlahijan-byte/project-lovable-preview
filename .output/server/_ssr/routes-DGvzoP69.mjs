import { o as __toESM } from "../_runtime.mjs";
import { c as DEFAULT_HERO_SLIDER } from "./site-config-DDR4aELm.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Plane, C as Search, Ct as CreditCard, Gt as ArrowLeft, Lt as Car, Pt as ChevronDown, R as MessageSquare, at as Headphones, b as ShieldAlert, ft as FolderOpen, g as Smartphone, it as Heart, l as Truck, m as Stethoscope, mt as FileCheck, q as LoaderCircle, rt as House, xt as Download } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { n as motion, t as useInView } from "../_libs/framer-motion+[...].mjs";
import { n as useDeviceKind, r as useSiteSetting, t as InsuranceWheel } from "./InsuranceWheel-CM9D7N44.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "../_libs/embla-carousel-autoplay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DGvzoP69.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var banner_1_default = "/assets/banner-1-CqMF0EmX.jpg";
var banner_2_default = "/assets/banner-2-BIbrC5kO.jpg";
var banner_3_default = "/assets/banner-3-DrX61gkg.jpg";
var banner_4_default = "/assets/banner-4-rynd7K9y.jpg";
var banner_5_default = "/assets/banner-5-CjhiASAb.jpg";
var banner_6_default = "/assets/banner-6-4kFlbi04.jpg";
var banner_7_default = "/assets/banner-7-DNFSqC2M.jpg";
var banner_8_default = "/assets/banner-8-TkVk__rh.jpg";
var banner_9_default = "/assets/banner-9-DSJVmi8z.jpg";
var banner_10_default = "/assets/banner-10-7yW1P5WZ.jpg";
var app_promo_default = "/assets/app-promo-Bj2vxY8W.jpg";
var PAGE_SIZE = 10;
var COL = {
	markazDarmani: 0,
	name: 1,
	ostan: 2,
	shahrestan: 3,
	phone: 4,
	address: 5,
	moarefiname: 6,
	bimePaye: 7,
	tozihat: 8
};
var FILTER_LABELS = {
	markazDarmani: "نوع مرکز درمانی",
	ostan: "استان",
	moarefinameDarad: "معرفی‌نامه آنلاین",
	bimePayeTarafQrardad: "بیمه پایه طرف قرارداد"
};
var FILTER_COL = {
	markazDarmani: COL.markazDarmani,
	ostan: COL.ostan,
	moarefinameDarad: COL.moarefiname,
	bimePayeTarafQrardad: COL.bimePaye
};
function normalize(value) {
	return value.replace(/[\u064A\u0649]/g, "ی").replace(/\u0643/g, "ک").replace(/\u200c/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
function decode(data) {
	return data.rows.map((row) => row.map((cell, index) => data.dictCols.includes(index) ? data.dicts[String(index)][cell] : cell));
}
function DarmanetCentersTable({ ostan }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [filters, setFilters] = (0, import_react.useState)({});
	const [searchInput, setSearchInput] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		let alive = true;
		import("./darmanet-centers-BHt8uxuc.mjs").then((mod) => {
			if (!alive) return;
			const loaded = mod.default ?? mod;
			setData(loaded);
			setRows(decode(loaded));
		});
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setFilters((prev) => ({
			...prev,
			ostan: ostan ?? ""
		}));
		setPage(1);
	}, [ostan]);
	(0, import_react.useEffect)(() => {
		const id = setTimeout(() => {
			setSearch(searchInput);
			setPage(1);
		}, 250);
		return () => clearTimeout(id);
	}, [searchInput]);
	const filtered = (0, import_react.useMemo)(() => {
		if (!rows) return [];
		const query = normalize(search);
		return rows.filter((row) => {
			for (const key of Object.keys(FILTER_COL)) {
				const value = filters[key];
				if (value && row[FILTER_COL[key]] !== value) return false;
			}
			if (!query) return true;
			return normalize(row.join(" ")).includes(query);
		});
	}, [
		rows,
		filters,
		search
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const current = Math.min(page, totalPages);
	const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
	const pageNumbers = (0, import_react.useMemo)(() => {
		const list = [];
		const from = Math.max(1, current - 2);
		const to = Math.min(totalPages, from + 4);
		for (let i = from; i <= to; i++) list.push(i);
		return list;
	}, [current, totalPages]);
	if (!data || !rows) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-2 py-12 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " در حال بارگذاری مراکز درمانی…"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
				children: data.filters.map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: `darmanet-${filter.key}`,
					className: "block text-xs font-semibold mb-1 text-muted-foreground",
					children: FILTER_LABELS[filter.key] ?? filter.key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: `darmanet-${filter.key}`,
					value: filters[filter.key] ?? "",
					onChange: (e) => {
						setFilters((prev) => ({
							...prev,
							[filter.key]: e.target.value
						}));
						setPage(1);
					},
					className: "w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring",
					children: filter.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: option === "-- همه --" ? "" : option,
						children: option
					}, option))
				})] }, filter.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col sm:flex-row gap-3 sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "search",
						"aria-label": "جستجو در مراکز درمانی",
						value: searchInput,
						onChange: (e) => setSearchInput(e.target.value),
						placeholder: "جستجو بر اساس نام مرکز، شهر، تلفن یا آدرس…",
						className: "w-full bg-card border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground whitespace-nowrap",
					children: [
						filtered.length.toLocaleString("fa-IR"),
						" مرکز — صفحه ",
						current.toLocaleString("fa-IR"),
						" از",
						" ",
						totalPages.toLocaleString("fa-IR")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-right text-xs md:text-sm min-w-[900px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: data.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: "px-3 py-3 font-bold whitespace-nowrap",
							children: header
						}, header)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pageRows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-t border-border align-top hover:bg-muted/40",
						children: row.map((cell, cellIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `px-3 py-3 ${cellIndex === COL.address ? "min-w-[260px]" : ""} ${cellIndex === COL.phone ? "whitespace-nowrap" : ""}`,
							children: cell
						}, cellIndex))
					}, `${current}-${index}`)), pageRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: data.headers.length,
						className: "px-3 py-10 text-center text-muted-foreground",
						children: "موردی با این فیلترها پیدا نشد."
					}) })] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "صفحه‌بندی مراکز درمانی",
				className: "mt-4 flex flex-wrap items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage(1),
						disabled: current === 1,
						className: "px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40",
						children: "اول"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: current === 1,
						className: "px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40",
						children: "قبلی"
					}),
					pageNumbers.map((number) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage(number),
						"aria-current": number === current ? "page" : void 0,
						className: `px-3 py-2 text-xs rounded-lg border transition ${number === current ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`,
						children: number.toLocaleString("fa-IR")
					}, number)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: current === totalPages,
						className: "px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40",
						children: "بعدی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage(totalPages),
						disabled: current === totalPages,
						className: "px-3 py-2 text-xs rounded-lg border border-border bg-card disabled:opacity-40",
						children: "آخر"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-[11px] text-muted-foreground",
				children: [
					"مجموع ",
					data.meta.totalRows.toLocaleString("fa-IR"),
					" مرکز درمانی در",
					" ",
					data.meta.sourcePages.toLocaleString("fa-IR"),
					" صفحه — برگرفته از darmanet.ir"
				]
			})
		]
	});
}
var slides = [
	{
		img: banner_1_default,
		title: "بیمه شخص ثالث",
		subtitle: "پوشش کامل خسارت‌های مالی و جانی به اشخاص ثالث",
		cta: "محاسبه و خرید",
		href: "/insurance/car/third-party"
	},
	{
		img: banner_2_default,
		title: "بیمه بدنه خودرو",
		subtitle: "حفاظت کامل از خودروی شما در برابر حوادث و خسارات",
		cta: "مشاهده و خرید",
		href: "/insurance/car/body"
	},
	{
		img: banner_3_default,
		title: "بیمه عمر و سرمایه‌گذاری",
		subtitle: "آینده‌ای مطمئن همراه با سرمایه‌گذاری سودمند",
		cta: "اطلاعات بیشتر",
		href: "/insurance/life/investment"
	},
	{
		img: banner_4_default,
		title: "بیمه آتش‌سوزی منازل",
		subtitle: "محافظت از خانه و دارایی شما در برابر حوادث",
		cta: "خرید آنلاین",
		href: "/insurance/fire/residential"
	},
	{
		img: banner_5_default,
		title: "بیمه درمان تکمیلی",
		subtitle: "آرامش خاطر برای شما و خانواده در زمان درمان",
		cta: "مشاهده و خرید",
		href: "/insurance/health/private-health"
	},
	{
		img: banner_6_default,
		title: "بیمه مسافرتی",
		subtitle: "همراه مطمئن شما در سفرهای داخلی و خارجی",
		cta: "خرید سریع",
		href: "/insurance/travel"
	},
	{
		img: banner_7_default,
		title: "بیمه باربری",
		subtitle: "پوشش امن کالاهای وارداتی، صادراتی و داخلی",
		cta: "اطلاعات بیشتر",
		href: "/insurance/cargo"
	},
	{
		img: banner_8_default,
		title: "بیمه حوادث انفرادی",
		subtitle: "حمایت ۲۴ ساعته در برابر حوادث ناگوار",
		cta: "محاسبه و خرید",
		href: "/insurance/life/accident/individual-personal-accident"
	},
	{
		img: banner_9_default,
		title: "بیمه مسئولیت",
		subtitle: "آرامش حرفه‌ای برای صاحبان مشاغل و کسب‌وکار",
		cta: "مشاهده و خرید",
		href: "/insurance/liability"
	},
	{
		img: banner_10_default,
		title: "بیمه مهندسی",
		subtitle: "پوشش جامع پروژه‌های ساختمانی و تأسیساتی",
		cta: "اطلاعات بیشتر",
		href: "/insurance/engineering"
	}
];
var services = [
	{
		icon: Smartphone,
		title: "بیمه موبایل و تبلت"
	},
	{
		icon: Heart,
		title: "بیمه عمر"
	},
	{
		icon: Plane,
		title: "بیمه مسافرتی"
	},
	{
		icon: House,
		title: "بیمه منازل مسکونی"
	},
	{
		icon: Car,
		title: "بیمه شخص ثالث"
	},
	{
		icon: Truck,
		title: "بیمه باربری وارداتی"
	},
	{
		icon: ShieldAlert,
		title: "بیمه حوادث انفرادی"
	},
	{
		icon: Stethoscope,
		title: "بیمه درمان خانواده"
	}
];
var eServices = [
	{
		icon: Search,
		title: "استعلام وضعیت بیمه‌نامه"
	},
	{
		icon: FolderOpen,
		title: "کارتابل بیمه‌گذاران"
	},
	{
		icon: CreditCard,
		title: "پرداخت آنلاین حق بیمه"
	}
];
var provinces = [
	"تهران",
	"آذربایجان شرقی",
	"آذربایجان غربی",
	"اردبیل",
	"اصفهان",
	"البرز",
	"ایلام",
	"بوشهر",
	"چهارمحال و بختیاری",
	"خراسان جنوبی",
	"خراسان رضوی",
	"خراسان شمالی",
	"خوزستان",
	"زنجان",
	"سمنان",
	"سیستان و بلوچستان",
	"فارس",
	"قزوین",
	"قم",
	"کردستان",
	"کرمان",
	"کرمانشاه",
	"کهگیلویه و بویراحمد",
	"گلستان",
	"گیلان",
	"لرستان",
	"مازندران",
	"مرکزی",
	"هرمزگان",
	"همدان",
	"یزد"
];
var features = [
	{
		icon: FileCheck,
		title: "صدور آنلاین بیمه",
		desc: "صدور سریع بیمه‌نامه در چند دقیقه"
	},
	{
		icon: ShieldAlert,
		title: "ثبت آنلاین خسارت",
		desc: "ثبت و پیگیری ۲۴ ساعته خسارت"
	},
	{
		icon: MessageSquare,
		title: "مشاوره خرید تخصصی",
		desc: "راهنمایی توسط کارشناسان مجرب"
	},
	{
		icon: Headphones,
		title: "پشتیبانی ۲۴/۷",
		desc: "پاسخگویی در تمام ساعات شبانه‌روز"
	}
];
var articles = [
	{
		title: "ذخایر فنی مؤسسات بیمه - مصوب ۸۷/۱۰/۲۵",
		excerpt: "شورای عالی بیمه در راستای اجرای ماده ۶۱ قانون تأسیس بیمه مرکزی ایران و بیمه‌گری..."
	},
	{
		title: "شرایط عمومی بیمه نامه تجهیزات و ماشین‌آلات پیمانکاری",
		excerpt: "نظر به پیشنهاد کتبی بیمه‌گزار مذکور مشخصات، شرکت سهامی بیمه سامان..."
	},
	{
		title: "شرایط ثبت‌نام بیمه تامین اجتماعی",
		excerpt: "داشتن بیمه تامین اجتماعی، اولین قدم برای پشتیبانی مالی و سرمایه‌گذاری روی آینده است..."
	},
	{
		title: "پرداخت دیه به نرخ روز",
		excerpt: "آیا می‌دانید اگر بین زمان حادثه و پرداخت خسارت چند ماه یا حتی چند سال فاصله بیفتد..."
	}
];
var news = [
	"زرسام بیمه سامان؛ نسل جدید بیمه‌های زندگی با سرمایه‌گذاری مبتنی بر طلا",
	"میانگین پرداخت روزانه خسارت بیمه سامان، بیش از ۳۷ میلیارد تومان",
	"رکورد ۱۴ هزار تراکنش در اپلیکیشن بیمه سامان",
	"پایداری مداوم شریان پاسخگویی بیمه سامان",
	"پرداخت ۳۷۰ میلیارد ریال خسارت به بیمه‌گزار شرکت بیمه سامان",
	"بخشودگی کامل جرایم بیمه شخص ثالث"
];
var faqs = [
	{
		q: "چگونه می‌توانم بیمه‌نامه خود را به‌صورت آنلاین خریداری کنم؟",
		a: "با مراجعه به بخش مربوط به هر نوع بیمه در سایت، اطلاعات لازم را وارد کرده و در چند گام ساده بیمه‌نامه خود را دریافت کنید."
	},
	{
		q: "آیا برای پرداخت خسارت باید به شعبه مراجعه کنم؟",
		a: "خیر، در بیشتر موارد می‌توانید از طریق اپلیکیشن یا سایت بیمه سامان، خسارت خود را ثبت و پیگیری کنید."
	},
	{
		q: "بیمه عمر طلای سامان چه ویژگی‌هایی دارد؟",
		a: "این بیمه‌نامه با پشتوانه طلا، علاوه بر پوشش‌های بیمه‌ای، امکان سرمایه‌گذاری مطمئن را برای شما فراهم می‌کند."
	},
	{
		q: "چگونه می‌توانم وضعیت بیمه‌نامه خود را استعلام کنم؟",
		a: "از طریق بخش «خدمات الکترونیک» و گزینه «استعلام وضعیت بیمه‌نامه» با وارد کردن شماره بیمه‌نامه."
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsuranceWheel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EServicesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultFormSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticlesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnersSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function HeroSlider() {
	const cfg = useSiteSetting("hero_slider", DEFAULT_HERO_SLIDER);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSliderInner, { cfg }, JSON.stringify(cfg));
}
function HeroSliderInner({ cfg }) {
	const deviceKind = useDeviceKind();
	const data = cfg.slides && cfg.slides.length > 0 ? cfg.slides : slides;
	const isEditing = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ve") === "1";
	const [emblaRef, embla] = useEmblaCarousel({
		loop: cfg.loop,
		direction: "rtl",
		watchDrag: true,
		dragFree: false
	}, cfg.autoplay && !isEditing ? [Autoplay({ delay: Math.max(1e3, cfg.autoplayMs) })] : []);
	const [idx, setIdx] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!embla) return;
		const onSel = () => setIdx(embla.selectedScrollSnap());
		embla.on("select", onSel);
		onSel();
	}, [embla]);
	const sizeStyle = cfg.heightMode === "fixed" ? { height: `${cfg.heightPx}px` } : { aspectRatio: `${cfg.ratioW} / ${cfg.ratioH}` };
	const mobileCtaScale = deviceKind === "mobile" ? Math.max(50, Math.min(110, cfg.mobileCtaScale ?? 75)) / 100 : 1;
	const mobileDotsScale = deviceKind === "mobile" ? Math.max(50, Math.min(120, cfg.mobileDotsScale ?? 70)) / 100 : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container mx-auto px-4 mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl shadow-elegant",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden",
				ref: emblaRef,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex",
					children: data.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-[0_0_100%] min-w-0",
						style: sizeStyle,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.img,
								alt: s.title,
								className: `absolute inset-0 w-full h-full ${cfg.fit === "contain" ? "object-contain bg-slate-900" : "object-cover"}`,
								loading: i === 0 ? "eager" : "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-4 md:px-14 max-w-[92%] md:max-w-2xl text-primary-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
											initial: {
												opacity: 0,
												y: 20
											},
											animate: {
												opacity: 1,
												y: 0
											},
											transition: { duration: .6 },
											className: "text-xl sm:text-2xl md:text-5xl font-extrabold mb-3 drop-shadow-lg",
											children: s.title
										}, i),
										s.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm md:text-lg mb-4 md:mb-5 opacity-90",
											children: s.subtitle
										}),
										s.cta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: s.href || "#",
											className: "inline-block bg-white/95 text-primary px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-glow hover:scale-105 transition origin-center sm:scale-100",
											style: { transform: `scale(${mobileCtaScale})` },
											children: s.cta
										})
									]
								})
							})
						]
					}, i))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 pointer-events-none origin-center sm:scale-100",
				style: { scale: mobileDotsScale },
				children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 sm:h-2 rounded-full transition-all ${i === idx ? "w-5 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/50"}` }, i))
			})]
		})
	});
}
function ServicesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-12 md:mt-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5",
			children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
				href: "#",
				initial: {
					opacity: 0,
					y: 20
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: {
					delay: i * .05,
					duration: .4
				},
				whileHover: { y: -4 },
				className: "group bg-card border border-border rounded-2xl p-5 md:p-6 shadow-soft hover:shadow-elegant transition-all text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-primary-soft flex items-center justify-center mb-4 group-hover:bg-primary transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "w-7 h-7 md:w-8 md:h-8 text-primary group-hover:text-primary-foreground transition-colors" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm md:text-base text-foreground leading-snug min-h-[2.5rem] flex items-center justify-center",
						children: s.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 pt-3 border-t border-dashed border-border flex items-center justify-center gap-1 text-link-accent text-xs md:text-sm font-semibold group-hover:gap-2 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مشاهده و خرید" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5" })]
					})
				]
			}, s.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#",
				className: "gradient-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-bold shadow-elegant hover:shadow-glow transition",
				children: "انواع بیمه‌های سامان"
			})
		})]
	});
}
function EServicesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-center text-2xl md:text-3xl font-extrabold mb-8 text-foreground",
			children: "خدمات الکترونیک"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "gradient-primary rounded-3xl p-5 md:p-10 shadow-elegant",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5",
				children: eServices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#",
					className: "bg-card hover:bg-card/95 rounded-2xl p-5 md:p-6 flex items-center gap-4 transition-all hover:scale-[1.02] shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "w-6 h-6 md:w-7 md:h-7" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-foreground text-sm md:text-base",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-link-accent text-xs mt-1 flex items-center gap-1 font-semibold",
							children: ["مشاهده ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3 h-3" })]
						})]
					})]
				}, s.title))
			})
		})]
	});
}
function BranchesSection() {
	const [sel, setSel] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-red-600",
					children: "مراکزدرمانی طرف قرارداد"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "با بیش از ۶۰۰۰ مراکز درمانی طرف قرارداد فعال در سراسر کشور"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-muted rounded-3xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-semibold mb-2",
							children: "انتخاب استان"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: sel,
							onChange: (e) => setSel(e.target.value),
							className: "w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "همه استان‌ها"
							}), provinces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: sel ? `مراکز درمانی استان ${sel} در جدول زیر نمایش داده می‌شود.` : "لطفاً یک استان انتخاب کنید یا از فیلترهای جدول استفاده کنید."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-gradient-to-br from-primary-soft to-card rounded-3xl p-6 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 w-full",
						children: provinces.slice(0, 15).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSel(p),
							className: `text-xs px-2 py-2 rounded-lg border transition ${sel === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`,
							children: p
						}, p))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarmanetCentersTable, { ostan: sel })
		]
	});
}
function AppSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl overflow-hidden grid md:grid-cols-2 items-center shadow-elegant border border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-full min-h-72 order-1 md:order-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: app_promo_default,
					alt: "اپلیکیشن بیمه سامان",
					className: "w-full h-full object-contain p-6 md:p-10",
					loading: "lazy",
					width: 1400,
					height: 700
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 md:p-12 text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl md:text-4xl font-extrabold mb-4 text-primary",
						children: "اپلیکیشن بیمه سامان"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "leading-8 text-muted-foreground mb-6 text-sm md:text-base",
						children: "با اپلیکیشن بیمه سامان، تجربه‌ای جدید از مدیریت بیمه‌های خود را در دستانتان خواهید داشت. این اپلیکیشن به شما امکان می‌دهد به راحتی و در هر زمان و مکانی به تمامی خدمات بیمه‌ای خود دسترسی پیدا کنید. از اطلاع‌رسانی‌های لحظه‌ای گرفته تا پیگیری وضعیت بیمه‌ها و درخواست خدمات، همه چیز به شکلی ساده و سریع در دسترس شماست. با دانلود این اپلیکیشن، تمامی نیازهای بیمه‌ای خود را تنها با چند لمس پاسخ دهید."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "bg-gradient-to-l from-red-600 to-red-500 text-white px-7 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-[0_10px_24px_-8px_rgba(220,38,38,0.55)] hover:scale-[1.03] transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), " دانلود اپلیکیشن"]
					})
				]
			})]
		})
	});
}
function ConsultFormSection() {
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		nationalId: "",
		phone: "",
		email: "",
		province: "",
		insuranceType: "",
		description: ""
	});
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [message, setMessage] = (0, import_react.useState)("");
	const update = (k) => (e) => setForm((p) => ({
		...p,
		[k]: e.target.value
	}));
	const submit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim() || !form.nationalId.trim() || !form.phone.trim()) {
			setStatus("error");
			setMessage("لطفاً نام، کد ملی و شماره همراه را وارد کنید.");
			return;
		}
		setStatus("sending");
		setMessage("");
		try {
			const r = await fetch("/api/consult", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			const data = await r.json().catch(() => ({}));
			if (r.ok && data.ok) {
				setStatus("ok");
				setMessage("درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.");
				setForm({
					fullName: "",
					nationalId: "",
					phone: "",
					email: "",
					province: "",
					insuranceType: "",
					description: ""
				});
			} else {
				setStatus("error");
				setMessage(data.error === "webhook_not_configured" ? "آدرس Webhook هنوز پیکربندی نشده است. لطفاً CONSULT_WEBHOOK_URL را در تنظیمات اضافه کنید." : "ارسال ناموفق بود. لطفاً دوباره تلاش کنید.");
			}
		} catch {
			setStatus("error");
			setMessage("خطا در ارتباط با سرور.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "consult",
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl md:text-3xl font-extrabold mb-2 text-center",
					children: "فرم مشاوره خرید بیمه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-center mb-8 text-sm",
					children: "کارشناسان ما در سریع‌ترین زمان با شما تماس خواهند گرفت"
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
							children: "کد ملی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.nationalId,
							onChange: update("nationalId"),
							required: true,
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "شماره همراه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							value: form.phone,
							onChange: update("phone"),
							required: true,
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "ایمیل"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: form.email,
							onChange: update("email"),
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "استان"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.province,
							onChange: update("province"),
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "انتخاب استان"
							}), provinces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p,
								children: p
							}, p))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-1.5",
							children: "نوع بیمه"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.insuranceType,
							onChange: update("insuranceType"),
							className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "نوع بیمه را انتخاب کنید"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه آتش‌سوزی" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه اتومبیل" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه باربری" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه درمان" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه زندگی" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بیمه مسافرتی" })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium mb-1.5",
								children: "توضیحات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: form.description,
								onChange: update("description"),
								className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
							})]
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `md:col-span-2 text-sm text-center rounded-xl px-4 py-3 ${status === "ok" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`,
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: status === "sending",
								className: "gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60",
								children: status === "sending" ? "در حال ارسال..." : "ارسال درخواست مشاوره"
							})
						})
					]
				})
			]
		})
	});
}
function Counter({ to, suffix = "" }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, { once: true });
	const [n, setN] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		let s = 0;
		const step = to / 50;
		const id = setInterval(() => {
			s += step;
			if (s >= to) {
				s = to;
				clearInterval(id);
			}
			setN(Math.floor(s));
		}, 30);
		return () => clearInterval(id);
	}, [inView, to]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: [
			"+",
			n.toLocaleString("fa-IR"),
			suffix
		]
	});
}
function AboutSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-10 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl md:text-3xl font-extrabold mb-4",
				children: "درباره بیمه سامان"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "leading-8 text-muted-foreground text-sm md:text-base",
				children: "کادر کارشناسی بیمه سامان با دارا بودن تحصیلات دانشگاهی و آشنایی کامل با صنعت بیمه، زیر نظر مدیران با تجربه، سعی در حفظ منافع بیمه‌گزاران داشته و با ارائه مشاوره در زمینه مدیریت ریسک، از بروز خسارات احتمالی پیشگیری می‌کنند. این شرکت با اتکا به سرمایه‌های مالی و انسانی مناسب، همواره درصدد است تا خدماتی متمایز برای بیمه‌گزاران خود فراهم آورد."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-4",
				children: [
					{
						n: 55e3,
						l: "بیمه‌شدگان بیمه عمر"
					},
					{
						n: 754,
						l: "نمایندگی فعال"
					},
					{
						n: 55e3,
						l: "بیمه‌شدگان بیمه اتومبیل"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card rounded-2xl p-5 text-center shadow-soft border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl md:text-3xl font-extrabold text-gradient",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, { to: s.n })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-2",
						children: s.l
					})]
				}, s.l))
			})]
		})
	});
}
function FeaturesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					scale: .95
				},
				whileInView: {
					opacity: 1,
					scale: 1
				},
				viewport: { once: true },
				transition: { delay: i * .08 },
				className: "bg-card border border-border rounded-2xl p-5 text-center shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "w-7 h-7 text-primary-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm md:text-base",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: f.desc
					})
				]
			}, f.title))
		})
	});
}
function ArticlesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl md:text-3xl font-extrabold mb-8 text-center",
			children: "مقاله‌های بیمه سامان"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-2 lg:grid-cols-4 gap-5",
			children: articles.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
				initial: {
					opacity: 0,
					y: 20
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: { delay: i * .07 },
				className: "bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-40 gradient-primary relative overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm leading-6 mb-2 line-clamp-2 group-hover:text-primary transition",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground line-clamp-3 leading-6",
							children: a.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "بیمه سامان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#",
								className: "text-primary text-xs font-bold flex items-center gap-1",
								children: ["ادامه مطلب ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3 h-3" })]
							})]
						})
					]
				})]
			}, a.title))
		})]
	});
}
function NewsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-xl md:text-2xl font-extrabold mb-5 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-6 bg-gradient-to-b from-primary to-primary-glow rounded-full" }), "آخرین اخبار"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid md:grid-cols-2 gap-3",
				children: news.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#",
					className: "flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm leading-6 group-hover:text-primary transition",
						children: n
					})]
				}) }, n))
			})]
		})
	});
}
var faqCategories = [
	"همه دسته‌بندی‌ها",
	"بیمه آتش سوزی",
	"بیمه اتومبیل",
	"بیمه درمان",
	"بیمه عمر",
	"بیمه مسئولیت",
	"بیمه مسافرتی",
	"بیمه مهندسی"
];
function FAQSection() {
	const [openIdx, setOpenIdx] = (0, import_react.useState)(0);
	const [cat, setCat] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl md:text-3xl font-extrabold text-center mb-6",
				children: "سوالات پرتکرار"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground mb-6",
				children: "دسته‌بندی مورد نظر خود را انتخاب کنید"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto",
				children: faqCategories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCat(i),
					className: `text-xs md:text-sm px-4 py-2 rounded-full border transition ${cat === i ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card border-border hover:border-primary hover:text-primary"}`,
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-3xl mx-auto space-y-3",
				children: faqs.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl overflow-hidden shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpenIdx(openIdx === i ? null : i),
						className: "w-full p-5 flex items-center justify-between text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm md:text-base",
							children: f.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-5 h-5 text-primary transition-transform ${openIdx === i ? "rotate-180" : ""}` })]
					}), openIdx === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 pb-5 text-sm text-muted-foreground leading-7 border-t border-border pt-4",
						children: f.a
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#",
					className: "inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:text-primary-foreground transition",
					children: ["مشاهده همه سوالات متداول ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" })]
				})
			})
		]
	});
}
var partners = [
	"بانک سامان",
	"سامان‌بوم",
	"تامین سرمایه سامان",
	"کارگزاری سامان",
	"لیزینگ سامان",
	"صرافی سامان"
];
function PartnersSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 mt-16 md:mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl md:text-3xl font-extrabold text-center mb-8",
			children: "شرکای تجاری"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
			children: partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-4 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-2 group-hover:scale-110 transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary-foreground font-extrabold text-xl",
						children: "س"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs md:text-sm font-bold text-center text-foreground leading-tight",
					children: p
				})]
			}, p))
		})]
	});
}
//#endregion
export { Home as component };
