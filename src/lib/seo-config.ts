export type SeoPage = {
  id: string;
  path: string;
  title: string;
  description: string;
  /** Show as a Google sitelink candidate (SiteNavigationElement JSON-LD) */
  sitelink: boolean;
  /** Include in sitemap.xml */
  inSitemap: boolean;
  priority: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

export type SeoConfig = {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  searchUrlTemplate: string;
  pages: SeoPage[];
};

export const SEO_SETTING_KEY = "seo_config";

const p = (
  path: string,
  title: string,
  description: string,
  sitelink = true,
  priority = "0.8",
): SeoPage => ({
  id: path,
  path,
  title,
  description,
  sitelink,
  inSitemap: true,
  priority,
  changefreq: "weekly",
});

export const DEFAULT_SEO: SeoConfig = {
  siteUrl: "",
  siteName: "بیمه سامان — نمایندگی آذرخش",
  defaultTitle: "بیمه سامان | خرید آنلاین انواع بیمه",
  defaultDescription:
    "خرید آنلاین انواع بیمه شخص ثالث، بدنه، عمر، درمان، مسافرتی، آتش‌سوزی و موبایل از نمایندگی آذرخش بیمه سامان.",
  searchUrlTemplate: "",
  pages: [
    p("/", "صفحه اصلی", "خرید آنلاین انواع بیمه سامان", false, "1.0"),
    p("/insurance", "انواع بیمه‌ها", "فهرست کامل انواع بیمه‌های سامان"),
    p("/insurance/travel", "بیمه مسافرتی", "خرید آنلاین بیمه مسافرتی و صدور فوری"),
    p("/branches", "شعب و نمایندگان", "آدرس و اطلاعات تماس شعب و نمایندگان"),
    p("/e-services", "خدمات الکترونیک", "استعلام بیمه‌نامه، کارتابل و پرداخت آنلاین"),
    p("/contact", "ارتباط با ما", "تماس با نمایندگی آذرخش بیمه سامان"),
    p("/blog", "مجله و خبر", "آخرین اخبار و مقالات بیمه‌ای"),
    p("/reporting", "گزارشگری و افشای اطلاعات", "گزارش‌ها و افشای اطلاعات"),
  ],
};

export function normalizeBase(url: string) {
  return (url || "").trim().replace(/\/+$/, "");
}
