import { navItems, type NavItem } from "@/components/site-data";
import { insuranceContent } from "@/components/insurance-content";
import { hubContent } from "@/components/insurance-hubs";

export type EditorPage = { path: string; label: string };

/** همه مسیرهای سایت که از منوی اصلی استخراج می‌شوند (برای ویرایشگر بصری و ایرادیاب). */
function collect(items: NavItem[], out: EditorPage[] = [], prefix = ""): EditorPage[] {
  for (const item of items) {
    if (item.href && !out.some((p) => p.path === item.href)) {
      out.push({ path: item.href, label: prefix ? `${prefix} › ${item.label}` : item.label });
    }
    if (item.children) collect(item.children, out, item.label);
  }
  return out;
}

const EXTRA: EditorPage[] = [
  { path: "/", label: "صفحه اصلی" },
  { path: "/insurance/fire", label: "بیمه آتش‌سوزی" },
  { path: "/insurance/car", label: "بیمه اتومبیل" },
  { path: "/insurance/cargo", label: "بیمه باربری" },
  { path: "/insurance/e-e", label: "بیمه تجهیزات الکترونیک" },
  { path: "/insurance/health", label: "بیمه درمان" },
  { path: "/insurance/life", label: "بیمه زندگی" },
  { path: "/insurance/liability", label: "بیمه مسئولیت" },
  { path: "/insurance/engineering", label: "بیمه مهندسی" },
  { path: "/insurance/marine-aviation", label: "بیمه کشتی و هواپیما" },
  { path: "/insurance/travel", label: "بیمه مسافرتی" },
  { path: "/insurance/special", label: "بیمه‌های خاص" },
];

/** Static pages that are not part of the main menu. */
const STATIC_PAGES: EditorPage[] = [
  { path: "/branches", label: "مراکز درمانی طرف قرارداد" },
  { path: "/blog", label: "وبلاگ" },
  { path: "/reporting", label: "گزارش خسارت" },
  { path: "/contact", label: "ارتباط با ما" },
  { path: "/insurance", label: "انواع بیمه‌ها" },
  { path: "/e-services", label: "خدمات الکترونیک" },
];

/** Pages offered in the visual editor and the code inspector toolbars. */
export const EDITOR_PAGES: EditorPage[] = (() => {
  const list: EditorPage[] = [];
  const push = (p: EditorPage) => {
    if (!list.some((x) => x.path === p.path)) list.push(p);
  };
  for (const p of EXTRA) push(p);
  for (const p of STATIC_PAGES) push(p);
  for (const p of collect(navItems)) push(p);
  // Every content page (including all sub-pages) is editable.
  for (const [path, c] of Object.entries(hubContent)) {
    push({ path, label: (c as { title?: string }).title ?? path });
  }
  for (const [path, c] of Object.entries(insuranceContent)) {
    push({ path, label: (c as { title?: string }).title ?? path });
  }
  return list;
})();
