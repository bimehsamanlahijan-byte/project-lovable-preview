//#region node_modules/.nitro/vite/services/ssr/assets/seo-config-B5a56N7O.js
var SEO_SETTING_KEY = "seo_config";
var p = (path, title, description, sitelink = true, priority = "0.8") => ({
	id: path,
	path,
	title,
	description,
	sitelink,
	inSitemap: true,
	priority,
	changefreq: "weekly"
});
var DEFAULT_SEO = {
	siteUrl: "",
	siteName: "بیمه سامان — نمایندگی آذرخش",
	defaultTitle: "بیمه سامان | خرید آنلاین انواع بیمه",
	defaultDescription: "خرید آنلاین انواع بیمه شخص ثالث، بدنه، عمر، درمان، مسافرتی، آتش‌سوزی و موبایل از نمایندگی آذرخش بیمه سامان.",
	searchUrlTemplate: "",
	pages: [
		p("/", "صفحه اصلی", "خرید آنلاین انواع بیمه سامان", false, "1.0"),
		p("/insurance", "انواع بیمه‌ها", "فهرست کامل انواع بیمه‌های سامان"),
		p("/insurance/travel", "بیمه مسافرتی", "خرید آنلاین بیمه مسافرتی و صدور فوری"),
		p("/branches", "شعب و نمایندگان", "آدرس و اطلاعات تماس شعب و نمایندگان"),
		p("/e-services", "خدمات الکترونیک", "استعلام بیمه‌نامه، کارتابل و پرداخت آنلاین"),
		p("/contact", "ارتباط با ما", "تماس با نمایندگی آذرخش بیمه سامان"),
		p("/blog", "مجله و خبر", "آخرین اخبار و مقالات بیمه‌ای"),
		p("/reporting", "گزارشگری و افشای اطلاعات", "گزارش‌ها و افشای اطلاعات")
	]
};
function normalizeBase(url) {
	return (url || "").trim().replace(/\/+$/, "");
}
//#endregion
export { SEO_SETTING_KEY as n, normalizeBase as r, DEFAULT_SEO as t };
