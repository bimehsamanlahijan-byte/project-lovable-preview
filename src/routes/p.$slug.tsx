import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CustomPageContent } from "@/components/CustomPageView";
import { getCustomPage } from "@/lib/custom-pages.functions";
import type { CustomPage } from "@/lib/custom-pages";

/**
 * Public route for Page-Builder pages: `/p/<slug>`.
 *
 * Renders the page's blocks wrapped in the site's existing SiteHeader /
 * SiteFooter so custom pages look native. Blocks are real DOM, so the Visual
 * Editor (`?ve=1`) and Inspector (`?inspect=1`) work on them like any page.
 * Unpublished pages still render (so they can be edited) but carry
 * `noindex,nofollow` so they won't be indexed.
 */
export const Route = createFileRoute("/p/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({ pbPreview: search.pbPreview === "1" }),
  loader: async ({ params }): Promise<CustomPage | null> => {
    try {
      return await getCustomPage({ data: { slug: params.slug } });
    } catch {
      return null;
    }
  },
  head: ({ loaderData }) => {
    const page = loaderData;
    return {
      meta: [
        { title: page?.seoTitle || page?.title || "صفحه" },
        {
          name: "description",
          content: page?.seoDescription || page?.description || "",
        },
        {
          name: "robots",
          content: page?.published ? "index, follow" : "noindex, nofollow",
        },
        { property: "og:title", content: page?.seoTitle || page?.title || "صفحه" },
        {
          property: "og:description",
          content: page?.seoDescription || page?.description || "",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CustomPageRoute,
});

function CustomPageRoute() {
  const page = Route.useLoaderData() as CustomPage | null;
  const { pbPreview } = Route.useSearch();

  if (!page && !pbPreview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold text-foreground">۴۰۴</h1>
          <p className="mt-3 text-sm text-muted-foreground">این صفحه پیدا نشد یا حذف شده است.</p>
          <a
            href="/"
            className="inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            بازگشت به خانه
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <SiteHeader />
      <CustomPageContent blocks={page?.blocks ?? []} acceptPreviewUpdates={pbPreview} />
      <SiteFooter />
    </div>
  );
}
