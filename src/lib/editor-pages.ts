import { navItems, type NavItem } from "@/components/site-data";

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

/** Pages offered in the visual editor and the code inspector toolbars. */
export const EDITOR_PAGES: EditorPage[] = (() => {
  const list: EditorPage[] = [];
  for (const p of EXTRA) if (!list.some((x) => x.path === p.path)) list.push(p);
  for (const p of collect(navItems)) if (!list.some((x) => x.path === p.path)) list.push(p);
  return list;
})();
