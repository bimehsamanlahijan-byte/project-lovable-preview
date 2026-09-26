//#region node_modules/.nitro/vite/services/ssr/assets/custom-pages-BHkSwtZN.js
var CUSTOM_PAGES_KEY = "custom_pages";
function pageUrl(slug) {
	return `/p/${slug}`;
}
/** Make a slug safe for use as a URL segment, preserving Persian characters. */
function sanitizeSlug(raw) {
	return (raw || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "new-page";
}
function newBlockId() {
	return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
var BLOCK_TYPES = [
	{
		type: "hero",
		label: "هیرو (عنوان بزرگ + دکمه)",
		icon: "🖼️"
	},
	{
		type: "text",
		label: "متن و عنوان",
		icon: "📝"
	},
	{
		type: "cta",
		label: "بنر فراخوان (CTA)",
		icon: "📣"
	},
	{
		type: "cards",
		label: "کارت‌ها",
		icon: "🗂️"
	},
	{
		type: "image",
		label: "تصویر",
		icon: "🖼️"
	},
	{
		type: "gallery",
		label: "گالری تصاویر",
		icon: "🎞️"
	},
	{
		type: "video",
		label: "ویدیو",
		icon: "🎬"
	},
	{
		type: "divider",
		label: "جداکننده",
		icon: "➖"
	},
	{
		type: "html",
		label: "کد HTML دلخواه",
		icon: "🧩"
	},
	{
		type: "clone",
		label: "کپی کامل صفحه (طرح، فونت، ویدیو)",
		icon: "🧬"
	}
];
function defaultBlockProps(type) {
	switch (type) {
		case "hero": return {
			title: "عنوان صفحه",
			subtitle: "توضیح کوتاه درباره این بخش",
			bgImage: "",
			ctaText: "مشاوره رایگان",
			ctaHref: "/contact",
			align: "center"
		};
		case "text": return {
			title: "عنوان بخش",
			body: "متن این بخش را اینجا بنویسید.",
			align: "right"
		};
		case "cta": return {
			title: "همین حالا اقدام کنید",
			body: "کارشناسان ما پاسخگوی شما هستند.",
			buttonLabel: "تماس با ما",
			buttonHref: "/contact",
			bg: "#0b1e3f"
		};
		case "cards": return {
			columns: "3",
			items: [
				{
					title: "کارت ۱",
					text: "توضیح کوتاه"
				},
				{
					title: "کارت ۲",
					text: "توضیح کوتاه"
				},
				{
					title: "کارت ۳",
					text: "توضیح کوتاه"
				}
			]
		};
		case "image": return {
			src: "",
			alt: "تصویر",
			href: "",
			width: "full"
		};
		case "gallery": return {
			images: [
				"",
				"",
				""
			],
			columns: "3"
		};
		case "video": return {
			src: "",
			poster: ""
		};
		case "divider": return {};
		case "html": return { html: "<p>کد HTML دلخواه</p>" };
		case "clone": return {
			html: "<div style=\"padding:24px\">محتوای کپی‌شده</div>",
			css: "",
			maxWidth: "",
			source: ""
		};
		default: return {};
	}
}
function makeBlock(type) {
	return {
		id: newBlockId(),
		type,
		props: defaultBlockProps(type)
	};
}
function emptyPage(slug = "new-page") {
	return {
		slug,
		title: "صفحه جدید",
		description: "",
		blocks: [makeBlock("hero")],
		seoTitle: "",
		seoDescription: "",
		published: false,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { newBlockId as a, makeBlock as i, CUSTOM_PAGES_KEY as n, pageUrl as o, emptyPage as r, sanitizeSlug as s, BLOCK_TYPES as t };
