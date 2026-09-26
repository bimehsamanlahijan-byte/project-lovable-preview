import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getCustomPage } from "./custom-pages.functions-BBnFzSYw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._slug-B0OFFzme.js
var $$splitComponentImporter = () => import("./p._slug-Dglmd9z4.mjs");
/**
* Public route for Page-Builder pages: `/p/<slug>`.
*
* Renders the page's blocks wrapped in the site's existing SiteHeader /
* SiteFooter so custom pages look native. Blocks are real DOM, so the Visual
* Editor (`?ve=1`) and Inspector (`?inspect=1`) work on them like any page.
* Unpublished pages still render (so they can be edited) but carry
* `noindex,nofollow` so they won't be indexed.
*/
var Route = createFileRoute("/p/$slug")({
	/**
	* Keep the Visual Editor / Inspector params alive.
	*
	* TanStack Router drops every search param `validateSearch` does not return,
	* so returning only `pbPreview` silently stripped `?ve=1&veDevice=…` when the
	* dashboard opened a builder page in the Visual Editor: the editor runtime
	* never started inside the iframe and the frame reloaded as a plain page.
	*/
	validateSearch: (search) => {
		const str = (v) => typeof v === "string" ? v : v == null ? void 0 : String(v);
		return {
			pbPreview: search.pbPreview === "1" || search.pbPreview === 1 || search.pbPreview === true,
			ve: str(search.ve),
			veDevice: str(search.veDevice),
			inspect: str(search.inspect),
			t: str(search.t)
		};
	},
	loader: async ({ params }) => {
		try {
			return await getCustomPage({ data: { slug: params.slug } });
		} catch {
			return null;
		}
	},
	head: ({ loaderData }) => {
		const page = loaderData;
		return { meta: [
			{ title: page?.seoTitle || page?.title || "صفحه" },
			{
				name: "description",
				content: page?.seoDescription || page?.description || ""
			},
			{
				name: "robots",
				content: page?.published ? "index, follow" : "noindex, nofollow"
			},
			{
				property: "og:title",
				content: page?.seoTitle || page?.title || "صفحه"
			},
			{
				property: "og:description",
				content: page?.seoDescription || page?.description || ""
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
