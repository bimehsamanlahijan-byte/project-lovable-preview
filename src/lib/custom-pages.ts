/**
 * Page Builder — shared, client-safe model for custom pages.
 *
 * Custom pages are stored as a map in the `site_settings` table under the key
 * `custom_pages` (each value = Record<slug, CustomPage>). They render at the
 * public route `/p/<slug>`, wrapped in the site's existing SiteHeader / SiteFooter,
 * and every block is a real, selectable DOM element so the Visual Editor and
 * Inspector can edit it — not raw HTML.
 */

export type BlockType =
  | "hero"
  | "text"
  | "cta"
  | "cards"
  | "image"
  | "gallery"
  | "video"
  | "divider"
  | "html";

export type Block = {
  id: string;
  type: BlockType;
  // Flexible per-type props. Arrays/objects live here directly (no JSON strings).
  props: Record<string, any>;
};

export type CustomPage = {
  slug: string;
  title: string;
  description: string;
  blocks: Block[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  updatedAt: string;
};

export type CustomPagesMap = Record<string, CustomPage>;

export const CUSTOM_PAGES_KEY = "custom_pages";
export const CUSTOM_PAGE_BASE = "/p";

export function pageUrl(slug: string): string {
  return `${CUSTOM_PAGE_BASE}/${slug}`;
}

/** Make a slug safe for use as a URL segment, preserving Persian characters. */
export function sanitizeSlug(raw: string): string {
  const s = (raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return s || "new-page";
}

export function newBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: "hero", label: "هیرو (عنوان بزرگ + دکمه)", icon: "🖼️" },
  { type: "text", label: "متن و عنوان", icon: "📝" },
  { type: "cta", label: "بنر فراخوان (CTA)", icon: "📣" },
  { type: "cards", label: "کارت‌ها", icon: "🗂️" },
  { type: "image", label: "تصویر", icon: "🖼️" },
  { type: "gallery", label: "گالری تصاویر", icon: "🎞️" },
  { type: "video", label: "ویدیو", icon: "🎬" },
  { type: "divider", label: "جداکننده", icon: "➖" },
  { type: "html", label: "کد HTML دلخواه", icon: "🧩" },
];

export function defaultBlockProps(type: BlockType): Record<string, any> {
  switch (type) {
    case "hero":
      return {
        title: "عنوان صفحه",
        subtitle: "توضیح کوتاه درباره این بخش",
        bgImage: "",
        ctaText: "مشاوره رایگان",
        ctaHref: "/contact",
        align: "center",
      };
    case "text":
      return { title: "عنوان بخش", body: "متن این بخش را اینجا بنویسید.", align: "right" };
    case "cta":
      return {
        title: "همین حالا اقدام کنید",
        body: "کارشناسان ما پاسخگوی شما هستند.",
        buttonLabel: "تماس با ما",
        buttonHref: "/contact",
        bg: "#0b1e3f",
      };
    case "cards":
      return {
        columns: "3",
        items: [
          { title: "کارت ۱", text: "توضیح کوتاه" },
          { title: "کارت ۲", text: "توضیح کوتاه" },
          { title: "کارت ۳", text: "توضیح کوتاه" },
        ],
      };
    case "image":
      return { src: "", alt: "تصویر", href: "", width: "full" };
    case "gallery":
      return { images: ["", "", ""], columns: "3" };
    case "video":
      return { src: "", poster: "" };
    case "divider":
      return {};
    case "html":
      return { html: "<p>کد HTML دلخواه</p>" };
    default:
      return {};
  }
}

export function makeBlock(type: BlockType): Block {
  return { id: newBlockId(), type, props: defaultBlockProps(type) };
}

export function emptyPage(slug = "new-page"): CustomPage {
  return {
    slug,
    title: "صفحه جدید",
    description: "",
    blocks: [makeBlock("hero")],
    seoTitle: "",
    seoDescription: "",
    published: false,
    updatedAt: new Date().toISOString(),
  };
}
