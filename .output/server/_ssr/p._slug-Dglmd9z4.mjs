import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
import { t as Route } from "./p._slug-B0OFFzme.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._slug-Dglmd9z4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Block renderer shared by the public `/p/<slug>` route and the live preview
* inside the Page Builder pane. Each block renders as real, selectable DOM
* (not raw HTML), so the Visual Editor and Inspector can target it.
*
* Inline styles keep blocks self-contained and immune to the site's CSS so a
* custom page always looks intentional. The palette mirrors the site theme:
* navy #0b1e3f, accent red #c81e35.
*/
var NAVY = "#0b1e3f";
var RED = "#c81e35";
function sanitizeHtml(value) {
	return value.replace(/<(script|style|iframe|object|embed|form|meta|link)[\s\S]*?<\/\1\s*>/gi, "").replace(/<(script|style|iframe|object|embed|form|meta|link)\b[^>]*\/?\s*>/gi, "").replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)[\s\S]*?\2/gi, "");
}
/** Video hosts whose embeds are kept inside cloned pages. */
var VIDEO_HOSTS = /^(https?:)?\/\/([a-z0-9-]+\.)*(youtube\.com|youtube-nocookie\.com|youtu\.be|aparat\.com|vimeo\.com|player\.vimeo\.com|dailymotion\.com|arvancloud\.ir|arvancloud\.com|namava\.ir|filimo\.com|google\.com|googleusercontent\.com)\//i;
/**
* Sanitizer for full-page clones: keeps inline styles, <video>/<source>,
* <svg> and embeds from known video hosts; strips scripts, handlers and
* anything that could hijack the page. Forms become plain containers.
*/
function sanitizeCloneHtml(value) {
	return value.replace(/<(script|object|embed|meta|link|base|noscript|template)[\s\S]*?<\/\1\s*>/gi, "").replace(/<(script|object|embed|meta|link|base)\b[^>]*\/?\s*>/gi, "").replace(/<style[\s\S]*?<\/style\s*>/gi, "").replace(/<iframe\b([^>]*)>([\s\S]*?)<\/iframe\s*>/gi, (m, attrs) => {
		const src = /\ssrc\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? "";
		return VIDEO_HOSTS.test(src) ? m : "";
	}).replace(/<(\/?)form\b/gi, "<$1div").replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s(href|src|action|formaction|xlink:href)\s*=\s*(["'])\s*(javascript:|vbscript:|data:text\/html)[\s\S]*?\2/gi, "");
}
/** Only @font-face / @keyframes / plain rules; no @import or script-ish tricks. */
function sanitizeCloneCss(value) {
	return value.replace(/<\/?style[^>]*>/gi, "").replace(/@import[^;]*;/gi, "").replace(/expression\s*\(/gi, "(").replace(/javascript:/gi, "");
}
function btnPrimary(label, href) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: href || "#",
		style: {
			display: "inline-block",
			marginTop: 18,
			background: "#fff",
			color: NAVY,
			fontWeight: 800,
			fontSize: 14,
			padding: "10px 24px",
			borderRadius: 999,
			textDecoration: "none"
		},
		children: label
	});
}
function BlockRenderer({ block }) {
	const p = block.props ?? {};
	const id = block.id;
	switch (block.type) {
		case "hero": {
			const align = p.align || "center";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id,
				style: {
					position: "relative",
					overflow: "hidden",
					minHeight: 320,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					textAlign: align,
					background: p.bgImage ? NAVY : `linear-gradient(120deg, ${NAVY}, ${RED})`
				},
				children: [p.bgImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.bgImage,
					alt: "",
					style: {
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover"
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					position: "absolute",
					inset: 0,
					background: "rgba(11,30,63,0.55)"
				} })] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "relative",
						padding: "48px 16px",
						color: "#fff",
						maxWidth: 900,
						margin: "0 auto"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: {
								fontSize: 34,
								fontWeight: 800,
								lineHeight: 1.3,
								margin: 0
							},
							children: p.title
						}),
						p.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								marginTop: 12,
								fontSize: 16,
								opacity: .9,
								lineHeight: 1.9
							},
							children: p.subtitle
						}) : null,
						p.ctaText ? btnPrimary(p.ctaText, p.ctaHref || "#") : null
					]
				})]
			});
		}
		case "text": {
			const align = p.align || "right";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id,
				style: {
					padding: "32px 16px",
					maxWidth: 900,
					margin: "0 auto",
					textAlign: align
				},
				children: [p.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						fontWeight: 800,
						fontSize: 22,
						color: NAVY,
						margin: 0
					},
					children: p.title
				}) : null, p.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						marginTop: 10,
						color: "#475569",
						fontSize: 15,
						lineHeight: 2,
						whiteSpace: "pre-wrap"
					},
					children: p.body
				}) : null]
			});
		}
		case "cta": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id,
			style: {
				margin: "24px 16px",
				padding: 28,
				borderRadius: 24,
				background: p.bg || NAVY,
				color: "#fff",
				textAlign: "center"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						fontWeight: 800,
						fontSize: 20,
						margin: 0
					},
					children: p.title
				}),
				p.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						marginTop: 8,
						fontSize: 13,
						opacity: .9
					},
					children: p.body
				}) : null,
				p.buttonLabel ? btnPrimary(p.buttonLabel, p.buttonHref || "#") : null
			]
		});
		case "cards": {
			const cols = Number(p.columns) || 3;
			const items = Array.isArray(p.items) ? p.items : [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id,
				style: {
					display: "grid",
					gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
					gap: 12,
					padding: "24px 16px"
				},
				children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderRadius: 18,
						padding: 18,
						textAlign: "center"
					},
					children: [
						it.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: it.image,
							alt: "",
							style: {
								width: 60,
								height: 60,
								objectFit: "cover",
								borderRadius: 12,
								margin: "0 auto 12px"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							style: {
								fontWeight: 800,
								color: NAVY,
								fontSize: 15,
								margin: 0
							},
							children: it.title
						}),
						it.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								marginTop: 6,
								color: "#64748b",
								fontSize: 12,
								lineHeight: 1.8
							},
							children: it.text
						}) : null
					]
				}, i))
			});
		}
		case "image": {
			if (!p.src) return null;
			const wrap = p.width === "boxed" ? 900 : "100%";
			const img = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: p.src,
				alt: p.alt || "",
				style: {
					width: "100%",
					borderRadius: 16,
					display: "block",
					objectFit: "cover"
				}
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id,
				style: {
					padding: 16,
					maxWidth: wrap,
					margin: "0 auto"
				},
				children: p.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: p.href,
					children: img
				}) : img
			});
		}
		case "gallery": {
			const cols = Number(p.columns) || 3;
			const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
			if (!images.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id,
				style: {
					display: "grid",
					gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
					gap: 10,
					padding: 16
				},
				children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					style: {
						width: "100%",
						borderRadius: 14,
						objectFit: "cover",
						aspectRatio: "4 / 3"
					}
				}, i))
			});
		}
		case "video":
			if (!p.src) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id,
				style: {
					padding: 16,
					maxWidth: 900,
					margin: "0 auto"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: p.src,
					poster: p.poster || void 0,
					controls: true,
					style: {
						width: "100%",
						borderRadius: 16,
						background: "#000"
					}
				})
			});
		case "divider": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id,
			style: {
				height: 1,
				background: "#e2e8f0",
				margin: "24px 16px"
			}
		});
		case "clone": {
			const css = sanitizeCloneCss(String(p.css || ""));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id,
				"data-page-clone": "1",
				style: {
					width: "100%",
					overflow: "hidden"
				},
				children: [css ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: css } }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						maxWidth: p.maxWidth || void 0,
						margin: "0 auto",
						direction: "rtl"
					},
					dangerouslySetInnerHTML: { __html: sanitizeCloneHtml(String(p.html || "")) }
				})]
			});
		}
		case "html": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id,
			style: {
				padding: 16,
				maxWidth: 900,
				margin: "0 auto"
			},
			dangerouslySetInnerHTML: { __html: sanitizeHtml(p.html || "") }
		});
		default: return null;
	}
}
function CustomPageContent({ blocks, acceptPreviewUpdates = false }) {
	const [previewBlocks, setPreviewBlocks] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!acceptPreviewUpdates) return;
		const onMessage = (event) => {
			if (event.origin !== window.location.origin || event.source !== window.parent) return;
			const payload = event.data;
			if (payload.type === "pb:blocks" && Array.isArray(payload.blocks)) setPreviewBlocks(payload.blocks);
		};
		window.addEventListener("message", onMessage);
		window.parent.postMessage({ type: "pb:ready" }, window.location.origin);
		return () => window.removeEventListener("message", onMessage);
	}, [acceptPreviewUpdates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-page-builder-content": true,
		children: (previewBlocks ?? blocks).map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: `page-block-${block.id}`,
			"data-page-block": block.type,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockRenderer, { block })
		}, block.id))
	});
}
/**
* Public route for Page-Builder pages: `/p/<slug>`.
*
* Renders the page's blocks wrapped in the site's existing SiteHeader /
* SiteFooter so custom pages look native. Blocks are real DOM, so the Visual
* Editor (`?ve=1`) and Inspector (`?inspect=1`) work on them like any page.
* Unpublished pages still render (so they can be edited) but carry
* `noindex,nofollow` so they won't be indexed.
*/
function CustomPageRoute() {
	const page = Route.useLoaderData();
	const { pbPreview } = Route.useSearch();
	if (!page && !pbPreview) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background px-4",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-5xl font-bold text-foreground",
					children: "۴۰۴"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "این صفحه پیدا نشد یا حذف شده است."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "بازگشت به خانه"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomPageContent, {
				blocks: page?.blocks ?? [],
				acceptPreviewUpdates: pbPreview
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { CustomPageRoute as component };
