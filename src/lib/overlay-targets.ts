/**
 * Named areas of the site that an overlay can be attached to directly from the
 * dashboard menu (header, footer, hero image, video, links …). The runtime
 * resolves the first matching element and creates an overlay with exactly its
 * bounding box.
 */
export type OverlayTarget = { key: string; label: string; selector: string };

export const OVERLAY_TARGETS: OverlayTarget[] = [
  { key: "header", label: "هدر سایت", selector: "header" },
  { key: "header-logo", label: "لوگوی هدر", selector: "header img" },
  { key: "header-nav", label: "منوی اصلی هدر", selector: "header nav" },
  { key: "footer", label: "فوتر سایت", selector: "footer" },
  { key: "footer-social", label: "شبکه‌های اجتماعی فوتر", selector: "footer ul" },
  { key: "hero", label: "بخش نخست صفحه (Hero)", selector: "main section:first-of-type" },
  { key: "first-image", label: "نخستین تصویر صفحه", selector: "main img" },
  { key: "first-video", label: "نخستین ویدیو صفحه", selector: "video" },
  { key: "first-iframe", label: "نخستین iframe صفحه", selector: "iframe" },
  { key: "first-button", label: "نخستین دکمه صفحه", selector: "main button" },
  { key: "first-link", label: "نخستین لینک صفحه", selector: "main a" },
  { key: "first-heading", label: "نخستین تیتر صفحه", selector: "main h1, main h2" },
  { key: "first-form", label: "نخستین فرم صفحه", selector: "form" },
  { key: "main", label: "کل محتوای صفحه", selector: "main" },
  { key: "body", label: "تمام صفحه", selector: "body" },
];
