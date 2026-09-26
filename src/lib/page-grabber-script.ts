/**
 * Page Grabber — browser snippet generator.
 *
 * The Page Builder can already extract a page server-side (`extractPageFromUrl`),
 * but that only works for pages the server can fetch: public, static HTML.
 * Pages behind a login, rendered by JavaScript, or on an intranet never work
 * that way.
 *
 * This module builds a **self-contained browser snippet**. The admin opens the
 * target page in their own browser (already logged in, fully rendered), runs
 * the snippet from DevTools → Sources → Snippets → New snippet (or pastes it
 * from Notepad into the console), and the snippet downloads a `.json` file in
 * the exact Page Builder `CustomPage` shape. That file is then imported back in
 * the dashboard.
 *
 * The generated code is plain ES5-ish JavaScript with no imports, no template
 * literals and no optional chaining, so it also runs in older browsers and in
 * restricted console contexts.
 */

export type GrabberOptions = {
  /**
   * "clone" = exact copy of the page (layout, fonts, colors, videos) with
   * header/footer removed; "blocks" = simplified editable Page Builder blocks.
   */
  mode: "clone" | "blocks";
  /** Slug suggested for the imported page. Empty → derived from the URL. */
  slug: string;
  /** Include <img> blocks (absolute URLs). */
  images: boolean;
  /** Include galleries (image groups) instead of separate image blocks. */
  galleries: boolean;
  /** Include button-like links as CTA blocks. */
  buttons: boolean;
  /** Include iframes/videos. */
  videos: boolean;
  /** Maximum characters kept per text block. */
  maxChars: number;
  /** Also copy the JSON to the clipboard, not just download it. */
  clipboard: boolean;
  /** Silent mode for the one-click builder: no download/clipboard/toast. */
  silent?: boolean;
  /** Original page URL (used when the page is rendered from a copy). */
  sourceUrl?: string;
};

export const DEFAULT_GRABBER_OPTIONS: GrabberOptions = {
  mode: "clone",
  slug: "",
  images: true,
  galleries: true,
  buttons: true,
  videos: true,
  maxChars: 4000,
  clipboard: true,
};

const BODY = String.raw`
(function () {
  "use strict";
  var OPT = __OPTIONS__;
  var MAX = OPT.maxChars || 4000;

  function log(m) { try { console.log("%c[دانلود صفحه] " + m, "color:#0b1e3f;font-weight:bold"); } catch (e) {} }

  function abs(u) {
    if (!u) return "";
    try { return new URL(u, document.baseURI).href; } catch (e) { return u; }
  }

  function clean(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function visible(el) {
    if (!el || el.nodeType !== 1) return false;
    var cs;
    try { cs = window.getComputedStyle(el); } catch (e) { return true; }
    if (!cs) return true;
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    return true;
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, HEADER: 1, NAV: 1, FOOTER: 1, ASIDE: 1, FORM: 0 };
  var SKIP_HINT = /(^|[-_ ])(header|navbar|nav|footer|sidebar|breadcrumb|cookie|consent|popup|modal|drawer|chat|widget|toolbar|social-share|skip-link)([-_ ]|$)/i;

  function skippable(el) {
    if (SKIP_TAGS[el.tagName] === 1) return true;
    var id = el.getAttribute("id") || "";
    var cls = typeof el.className === "string" ? el.className : "";
    var role = el.getAttribute("role") || "";
    if (role === "navigation" || role === "banner" || role === "contentinfo" || role === "dialog") return true;
    if (SKIP_HINT.test(id) || SKIP_HINT.test(cls)) return true;
    if (el.hasAttribute("data-ve-overlay") || el.hasAttribute("data-page-grabber")) return true;
    return false;
  }

  function pickRoot() {
    var sels = ["main", "[role=main]", "#main", "#content", ".main-content", "article"];
    for (var i = 0; i < sels.length; i++) {
      var n = document.querySelector(sels[i]);
      if (n && clean(n.innerText).length > 120) return n;
    }
    return document.body;
  }

  function imgSrc(img) {
    var s = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("data-lazy-src") || "";
    var set = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
    if (!s && set) s = set.split(",")[0].trim().split(" ")[0];
    if (!s) return "";
    if (/^data:/i.test(s)) return "";
    return abs(s);
  }

  var blocks = [];
  var seq = 0;
  function id() { seq++; return "b_" + Date.now().toString(36) + "_" + seq.toString(36); }
  function push(type, props) { blocks.push({ id: id(), type: type, props: props }); }

  var buffer = [];
  function flush() {
    if (!buffer.length) return;
    var body = buffer.join("\n\n").slice(0, MAX);
    buffer = [];
    if (clean(body).length >= 2) push("text", { title: "", body: body, align: "right" });
  }

  var heroDone = false;
  function heading(el) {
    var txt = clean(el.innerText);
    if (!txt) return;
    flush();
    if (!heroDone && el.tagName === "H1") {
      heroDone = true;
      push("hero", { title: txt, subtitle: "", bgImage: "", ctaText: "", ctaHref: "", align: "right" });
    } else {
      push("text", { title: txt, body: "", align: "right" });
    }
  }

  function buttonLike(a) {
    var cls = typeof a.className === "string" ? a.className : "";
    if (/btn|button|cta/i.test(cls)) return true;
    if (a.getAttribute("role") === "button") return true;
    var cs;
    try { cs = window.getComputedStyle(a); } catch (e) { return false; }
    if (!cs) return false;
    var bg = cs.backgroundColor || "";
    var solid = bg && bg !== "transparent" && bg.indexOf("rgba(0, 0, 0, 0)") === -1;
    return !!solid && clean(a.innerText).length <= 40;
  }

  function galleryOf(el) {
    var imgs = [], kids = el.children, i;
    for (i = 0; i < kids.length; i++) {
      var inner = kids[i].tagName === "IMG" ? kids[i] : kids[i].querySelector && kids[i].querySelector("img");
      if (!inner) return null;
      var s = imgSrc(inner);
      if (!s) return null;
      imgs.push(s);
    }
    return imgs.length >= 3 ? imgs : null;
  }

  function cardsOf(el) {
    var kids = el.children, items = [], i;
    if (kids.length < 2 || kids.length > 8) return null;
    for (i = 0; i < kids.length; i++) {
      var k = kids[i];
      var h = k.querySelector && k.querySelector("h2,h3,h4,h5,strong,b");
      var p = k.querySelector && k.querySelector("p,span,div");
      var t = clean(h ? h.innerText : "");
      var x = clean(p ? p.innerText : "");
      if (!t && !x) return null;
      if (x.length > 400) return null;
      var im = k.querySelector && k.querySelector("img");
      items.push({ title: t, text: x.slice(0, 400), image: im ? imgSrc(im) : "" });
    }
    return items;
  }

  function walk(el) {
    var kids = el.children, i;
    for (i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (!visible(n) || skippable(n)) continue;
      var tag = n.tagName;

      if (/^H[1-6]$/.test(tag)) { heading(n); continue; }

      if (tag === "HR") { flush(); push("divider", {}); continue; }

      if (tag === "IMG") {
        if (OPT.images) { var s = imgSrc(n); if (s) { flush(); push("image", { src: s, alt: n.getAttribute("alt") || "", href: "", width: "boxed" }); } }
        continue;
      }

      if (tag === "FIGURE") {
        var fi = n.querySelector("img");
        if (OPT.images && fi) { var fs = imgSrc(fi); if (fs) { flush(); push("image", { src: fs, alt: fi.getAttribute("alt") || "", href: "", width: "full" }); } }
        var cap = n.querySelector("figcaption");
        if (cap) { var ct = clean(cap.innerText); if (ct) push("text", { title: "", body: ct, align: "right" }); }
        continue;
      }

      if (tag === "IFRAME" || tag === "VIDEO") {
        if (OPT.videos) {
          var vs = abs(n.getAttribute("src") || (n.querySelector && n.querySelector("source") ? n.querySelector("source").getAttribute("src") : ""));
          if (vs) { flush(); push("video", { src: vs, poster: abs(n.getAttribute("poster") || "") }); }
        }
        continue;
      }

      if (tag === "A" && OPT.buttons && buttonLike(n)) {
        var label = clean(n.innerText);
        var href = abs(n.getAttribute("href") || "");
        if (label) { flush(); push("cta", { title: "", body: "", buttonLabel: label, buttonHref: href, bg: "#0b1e3f" }); }
        continue;
      }

      if (tag === "UL" || tag === "OL") {
        var lis = n.querySelectorAll(":scope > li"), out = [], j;
        for (j = 0; j < lis.length; j++) { var lt = clean(lis[j].innerText); if (lt) out.push("• " + lt); }
        if (out.length) buffer.push(out.join("\n"));
        continue;
      }

      if (tag === "TABLE") {
        var rows = n.querySelectorAll("tr"), lines = [], r;
        for (r = 0; r < rows.length; r++) {
          var cells = rows[r].querySelectorAll("th,td"), parts = [], c;
          for (c = 0; c < cells.length; c++) parts.push(clean(cells[c].innerText));
          if (parts.join("").length) lines.push(parts.join(" | "));
        }
        if (lines.length) buffer.push(lines.join("\n"));
        continue;
      }

      if (tag === "P" || tag === "BLOCKQUOTE") {
        var pt = clean(n.innerText);
        if (pt.length >= 2) buffer.push(pt);
        continue;
      }

      if (OPT.galleries) {
        var g = galleryOf(n);
        if (g) { flush(); push("gallery", { images: g, columns: "3" }); continue; }
      }

      var cards = cardsOf(n);
      if (cards && n.children.length >= 3) {
        flush();
        push("cards", { columns: String(Math.min(n.children.length, 4)), items: cards });
        continue;
      }

      if (n.children.length === 0) {
        var t2 = clean(n.innerText);
        if (t2.length >= 2) buffer.push(t2);
        continue;
      }

      walk(n);
    }
  }

  function slugify(raw) {
    var s = String(raw || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    return s || "grabbed-page";
  }

  var root = pickRoot();
  walk(root);
  flush();

  if (!blocks.length) {
    push("text", { title: document.title || "", body: clean(document.body.innerText).slice(0, MAX), align: "right" });
  }

  function meta(sel) {
    var m = document.querySelector(sel);
    return m ? clean(m.getAttribute("content")) : "";
  }

  var h1 = document.querySelector("h1");
  var title = clean(h1 ? h1.innerText : "") || clean(document.title) || "صفحه";
  var desc = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  var fromUrl = (location.pathname.split("/").filter(Boolean).pop() || "").replace(/\.(html?|php|aspx?)$/i, "");
  var slug = slugify(OPT.slug || fromUrl || title);

  var page = {
    slug: slug,
    title: title,
    description: desc,
    blocks: blocks,
    seoTitle: clean(document.title) || title,
    seoDescription: desc,
    published: false,
    updatedAt: new Date().toISOString(),
    source: { url: location.href, grabbedAt: new Date().toISOString(), blocks: blocks.length }
  };

  var json = JSON.stringify(page, null, 2);

  try {
    var blob = new Blob([json], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.setAttribute("data-page-grabber", "1");
    a.href = URL.createObjectURL(blob);
    a.download = "page-" + slug + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  } catch (e) { log("دانلود خودکار ممکن نشد: " + e); }

  if (OPT.clipboard && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(json).then(function () { log("در کلیپ‌بورد هم کپی شد."); }, function () {});
  }

  try {
    var box = document.createElement("div");
    box.setAttribute("data-page-grabber", "1");
    box.setAttribute("dir", "rtl");
    box.style.cssText = "position:fixed;z-index:2147483647;inset-inline-end:16px;inset-block-end:16px;background:#0b1e3f;color:#fff;font:13px/1.8 Tahoma,sans-serif;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:320px";
    box.textContent = "✅ صفحه گرفته شد — " + blocks.length + " بلوک. فایل page-" + slug + ".json دانلود شد؛ آن را در «صفحه‌ساز → دانلود صفحه» بارگذاری کنید.";
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 12000);
  } catch (e) {}

  log("تعداد بلوک: " + blocks.length + " — نامک: " + slug);
  return page;
})();
`;

const CLONE_BODY = String.raw`
(function () {
  "use strict";
  var OPT = __OPTIONS__;
  function log(m) { try { console.log("%c[کپی کامل صفحه] " + m, "color:#0b1e3f;font-weight:bold"); } catch (e) {} }
  function abs(u, base) {
    if (!u) return "";
    try { return new URL(u, base || document.baseURI).href; } catch (e) { return u; }
  }
  function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }

  /* ---------- 1. what is header / footer / widget (replaced by your site's own) ---------- */
  var HINT = /(^|[-_ ])(header|site-header|topbar|top-bar|navbar|nav|menu-main|footer|site-footer|copyright|cookie|consent|popup|modal|drawer|chat|goftino|crisp|raychat|tawk|widget|back-to-top|scroll-top|toolbar|social-share|skip-link)([-_ ]|$)/i;
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, LINK: 1, META: 1, BASE: 1, HEADER: 1, FOOTER: 1, NAV: 1, DIALOG: 1, OBJECT: 1, EMBED: 1 };
  function isChrome(el) {
    if (SKIP_TAGS[el.tagName] === 1) return true;
    if (el.hasAttribute("data-page-grabber") || el.hasAttribute("data-ve-overlay")) return true;
    var role = el.getAttribute("role") || "";
    if (role === "banner" || role === "contentinfo" || role === "navigation" || role === "dialog") return true;
    var id = el.getAttribute("id") || "";
    var cls = typeof el.className === "string" ? el.className : "";
    if (HINT.test(id) || HINT.test(cls)) {
      // Never drop a big content block just because its class says "menu".
      var r = el.getBoundingClientRect();
      if (r.height < window.innerHeight * 0.9 || /header|footer|chat|cookie|popup|modal/i.test(id + " " + cls)) return true;
    }
    var cs = getComputedStyle(el);
    if (cs.position === "fixed") return true;
    return false;
  }
  function hidden(el, cs) {
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    if (Number(cs.opacity) === 0 && el.children.length === 0) return true;
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0 && el.tagName !== "SOURCE") return true;
    return false;
  }

  /* ---------- 2. pick the content root ---------- */
  function pickRoot() {
    var sels = ["main", "[role=main]", "#main", "#content", "#primary", ".main-content", ".site-content", "article"];
    for (var i = 0; i < sels.length; i++) {
      var n = document.querySelector(sels[i]);
      if (n && clean(n.innerText).length > 200) return n;
    }
    return document.body;
  }

  /* ---------- 3. computed-style inlining ---------- */
  var PROPS = ["display","position","top","right","bottom","left","z-index","float","clear","box-sizing",
    "width","min-width","max-width","height","min-height","max-height",
    "margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left",
    "flex-direction","flex-wrap","justify-content","align-items","align-content","align-self","flex-grow","flex-shrink","flex-basis","order","gap","row-gap","column-gap",
    "grid-template-columns","grid-template-rows","grid-template-areas","grid-area","grid-column","grid-row","grid-auto-flow",
    "color","background-color","background-image","background-size","background-position","background-repeat",
    "border-top","border-right","border-bottom","border-left","border-radius","box-shadow","outline",
    "font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-align","text-decoration","text-transform","text-shadow","white-space","word-break","direction","vertical-align","list-style-type",
    "opacity","overflow","overflow-x","overflow-y","object-fit","object-position","transform","filter","aspect-ratio","cursor","transition"];
  var INHERITED = { "color":1,"font-family":1,"font-size":1,"font-weight":1,"font-style":1,"line-height":1,"letter-spacing":1,"text-align":1,"text-transform":1,"text-shadow":1,"white-space":1,"word-break":1,"direction":1,"list-style-type":1,"cursor":1 };
  var DEFAULTS = { "position":"static","top":"auto","right":"auto","bottom":"auto","left":"auto","z-index":"auto","float":"none","clear":"none",
    "min-width":"0px","max-width":"none","min-height":"0px","max-height":"none","flex-grow":"0","flex-shrink":"1","flex-basis":"auto","order":"0",
    "background-color":"rgba(0, 0, 0, 0)","background-image":"none","box-shadow":"none","text-shadow":"none","transform":"none","filter":"none","opacity":"1",
    "overflow":"visible","overflow-x":"visible","overflow-y":"visible","border-radius":"0px","text-decoration":"none","aspect-ratio":"auto","object-fit":"fill","object-position":"50% 50%","transition":"all 0s ease 0s","outline":"none",
    "grid-template-columns":"none","grid-template-rows":"none","grid-template-areas":"none","grid-area":"auto","grid-area":"auto / auto / auto / auto","grid-column":"auto","grid-row":"auto","gap":"normal","row-gap":"normal","column-gap":"normal","vertical-align":"baseline" };
  var FLEXISH = /flex|grid/;

  function styleFor(el, cs, pcs, isRoot) {
    var out = [];
    for (var i = 0; i < PROPS.length; i++) {
      var k = PROPS[i];
      var v = cs.getPropertyValue(k);
      if (!v) continue;
      if (INHERITED[k] && pcs && pcs.getPropertyValue(k) === v && !isRoot) continue;
      if (DEFAULTS[k] !== undefined && DEFAULTS[k] === v) continue;
      if (/^(border-)/.test(k) && /^0px none/.test(v)) continue;
      if (k === "outline" && / none 0px$|^none/.test(v)) continue;
      if ((k === "min-width" || k === "min-height" || k === "align-self") && v === "auto") continue;
      if (/^background-(size|position|repeat)$/.test(k) && cs.backgroundImage === "none") continue;
      if (/^(top|right|bottom|left)$/.test(k) && (cs.position === "static" || (cs.position === "relative" && v === "0px"))) continue;
      if (/^(margin|padding)-/.test(k) && v === "0px") continue;
      if (/^(justify-content|align-items|align-content|flex-direction|flex-wrap|grid-auto-flow)$/.test(k) && !FLEXISH.test(cs.display)) continue;
      if (k === "position" && (v === "fixed" || v === "sticky")) v = "relative";
      // Fixed pixel widths/heights break responsiveness: keep them as max-width.
      if (k === "width") {
        if (/^(IMG|VIDEO|IFRAME|SVG|CANVAS)$/i.test(el.tagName)) { out.push("max-width:100%"); out.push("width:" + v); continue; }
        if (isRoot) { out.push("width:100%"); continue; }
        if (cs.display.indexOf("inline") === 0 || cs.display === "table-cell") continue;
        // Inside flex/grid the parent's tracks size the child already.
        if (pcs && FLEXISH.test(pcs.display)) continue;
        var pw = el.parentElement ? el.parentElement.getBoundingClientRect().width : 0;
        var w = el.getBoundingClientRect().width;
        if (pw && Math.abs(pw - w) < 2) continue;
        if (pw) { out.push("width:" + Math.round((w / pw) * 10000) / 100 + "%"); continue; }
        continue;
      }
      if (k === "height") {
        if (/^(IMG|VIDEO|IFRAME|SVG|CANVAS)$/i.test(el.tagName)) { if (el.tagName === "IFRAME") out.push("height:" + v); else out.push("height:auto"); }
        continue;
      }
      if (k === "background-image" && v.indexOf("url(") !== -1) {
        v = v.replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, q, u) { return 'url("' + abs(u) + '")'; });
      }
      out.push(k + ":" + v.replace(/"/g, "'"));
    }
    return out.join(";");
  }

  /* ---------- 4. deep clone with inlined styles ---------- */
  var KEEP_ATTR = { href:1, src:1, srcset:1, alt:1, title:1, poster:1, controls:1, loop:1, muted:1, autoplay:1, playsinline:1, type:1, colspan:1, rowspan:1, width:1, height:1, allow:1, allowfullscreen:1, frameborder:1, viewbox:1, fill:1, stroke:1, d:1, xmlns:1, target:1, rel:1, placeholder:1, value:1, name:1, "aria-label":1, dir:1, lang:1 };
  var count = 0, videos = 0, images = 0;

  function cloneNode(src, pcs, isRoot) {
    if (src.nodeType === 3) return document.createTextNode(src.nodeValue);
    if (src.nodeType !== 1) return null;
    if (!isRoot && isChrome(src)) return null;
    var cs = getComputedStyle(src);
    if (!isRoot && hidden(src, cs)) return null;
    var tag = src.tagName.toLowerCase();

    if (tag === "svg") {
      var svg = src.cloneNode(true);
      svg.setAttribute("style", styleFor(src, cs, pcs, false));
      count++;
      return svg;
    }
    if (tag === "iframe") {
      var s = abs(src.getAttribute("src") || src.getAttribute("data-src") || "");
      if (!s) return null;
      var f = document.createElement("iframe");
      f.setAttribute("src", s);
      f.setAttribute("allowfullscreen", "true");
      f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      f.setAttribute("frameborder", "0");
      f.setAttribute("style", styleFor(src, cs, pcs, false) + ";width:100%;aspect-ratio:16/9;height:auto;border:0");
      videos++;
      return f;
    }
    if (tag === "canvas") return null;

    var el = document.createElement(tag === "button" || tag === "select" || tag === "input" || tag === "textarea" || tag === "label" ? (tag === "input" || tag === "textarea" || tag === "select" ? "span" : tag) : tag);
    for (var a = 0; a < src.attributes.length; a++) {
      var at = src.attributes[a];
      var n = at.name.toLowerCase();
      if (!KEEP_ATTR[n]) continue;
      var v = at.value;
      if (n === "href" || n === "src" || n === "poster") v = abs(v);
      if (n === "srcset") v = v.split(",").map(function (p) { var bits = p.trim().split(/\s+/); bits[0] = abs(bits[0]); return bits.join(" "); }).join(", ");
      try { el.setAttribute(n, v); } catch (e) {}
    }
    if (tag === "img") {
      var real = src.currentSrc || src.getAttribute("data-src") || src.getAttribute("data-lazy-src") || src.getAttribute("src") || "";
      el.setAttribute("src", abs(real));
      el.removeAttribute("srcset");
      el.setAttribute("loading", "lazy");
      images++;
    }
    if (tag === "video") {
      var vs = src.currentSrc || src.getAttribute("src") || "";
      if (vs) el.setAttribute("src", abs(vs));
      el.setAttribute("controls", "");
      videos++;
    }
    if (tag === "input" || tag === "textarea") el.textContent = src.value || src.getAttribute("placeholder") || "";
    if (tag === "select" && src.options && src.selectedIndex >= 0) el.textContent = src.options[src.selectedIndex].text;
    if (tag === "a" && el.getAttribute("href") && el.getAttribute("href").indexOf("javascript:") === 0) el.setAttribute("href", "#");

    el.setAttribute("style", styleFor(src, cs, pcs, isRoot));
    count++;
    if (tag !== "input" && tag !== "textarea" && tag !== "select") {
      for (var c = src.firstChild; c; c = c.nextSibling) {
        var k = cloneNode(c, cs, false);
        if (k) el.appendChild(k);
      }
    }
    // Drop empty wrappers that only held removed chrome.
    if (!isRoot && tag === "div" && !el.childNodes.length && cs.backgroundImage === "none" && cs.backgroundColor === "rgba(0, 0, 0, 0)" && src.getBoundingClientRect().height < 4) return null;
    return el;
  }

  /* ---------- 5. fonts & keyframes from the page stylesheets ---------- */
  function collectCss() {
    var out = [], blocked = 0;
    for (var i = 0; i < document.styleSheets.length; i++) {
      var sh = document.styleSheets[i], rules;
      try { rules = sh.cssRules; } catch (e) { blocked++; continue; }
      if (!rules) continue;
      var base = sh.href || document.baseURI;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.type === 5 || r.type === 7) {
          out.push(r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, q, u) { return u.indexOf("data:") === 0 ? 'url("' + u + '")' : 'url("' + abs(u, base) + '")'; }));
        }
      }
    }
    if (blocked) log(blocked + " فایل CSS از دامنهٔ دیگر قابل خواندن نبود (فونت‌های آن‌ها ممکن است جایگزین شوند).");
    return out.join("\n");
  }

  // Force lazy content to load before cloning.
  var lazy = document.querySelectorAll("img[data-src],img[data-lazy-src],iframe[data-src]");
  for (var z = 0; z < lazy.length; z++) {
    var d = lazy[z].getAttribute("data-src") || lazy[z].getAttribute("data-lazy-src");
    if (d && !lazy[z].getAttribute("src")) lazy[z].setAttribute("src", d);
  }

  var root = pickRoot();
  var rootRect = root.getBoundingClientRect();
  var bodyCs = getComputedStyle(document.body);
  var cloned = cloneNode(root, bodyCs, true);
  var wrap = document.createElement("div");
  wrap.setAttribute("style", "font-family:" + bodyCs.fontFamily.replace(/"/g, "'") + ";color:" + bodyCs.color + ";background-color:" + (bodyCs.backgroundColor === "rgba(0, 0, 0, 0)" ? "#fff" : bodyCs.backgroundColor) + ";direction:" + bodyCs.direction + ";line-height:" + bodyCs.lineHeight);
  wrap.appendChild(cloned);
  var html = wrap.outerHTML;
  var css = collectCss();

  function slugify(raw) {
    var s = String(raw || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    return s || "cloned-page";
  }
  function meta(sel) { var m = document.querySelector(sel); return m ? clean(m.getAttribute("content")) : ""; }
  var h1 = document.querySelector("h1");
  var title = clean(h1 ? h1.innerText : "") || clean(document.title) || "صفحه";
  var desc = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  var fromUrl = ((OPT.sourceUrl ? new URL(OPT.sourceUrl).pathname : location.pathname).split("/").filter(Boolean).pop() || "").replace(/\.(html?|php|aspx?)$/i, "");
  var slug = slugify(OPT.slug || fromUrl || title);
  var blockId = "b_" + Date.now().toString(36) + "_clone";
  var page = {
    slug: slug, title: title, description: desc,
    blocks: [{ id: blockId, type: "clone", props: { html: html, css: css, maxWidth: Math.round(rootRect.width) >= window.innerWidth - 20 ? "" : Math.round(rootRect.width) + "px", source: OPT.sourceUrl || location.href } }],
    seoTitle: clean(document.title) || title, seoDescription: desc, published: false,
    updatedAt: new Date().toISOString(),
    source: { url: OPT.sourceUrl || location.href, grabbedAt: new Date().toISOString(), mode: "clone", elements: count, images: images, videos: videos }
  };
  var json = JSON.stringify(page);
  if (OPT.silent) return page;
  try {
    var blob = new Blob([json], { type: "application/json;charset=utf-8" });
    var a2 = document.createElement("a");
    a2.setAttribute("data-page-grabber", "1");
    a2.href = URL.createObjectURL(blob);
    a2.download = "page-" + slug + ".json";
    document.body.appendChild(a2); a2.click();
    setTimeout(function () { URL.revokeObjectURL(a2.href); a2.remove(); }, 4000);
  } catch (e) { log("دانلود خودکار ممکن نشد: " + e); }
  if (OPT.clipboard && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(json).then(function () { log("در کلیپ‌بورد هم کپی شد."); }, function () {});
  }
  try {
    var box = document.createElement("div");
    box.setAttribute("data-page-grabber", "1"); box.setAttribute("dir", "rtl");
    box.style.cssText = "position:fixed;z-index:2147483647;inset-inline-end:16px;inset-block-end:16px;background:#0b1e3f;color:#fff;font:13px/1.8 Tahoma,sans-serif;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:340px";
    box.textContent = "✅ کپی کامل صفحه آماده شد — " + count + " المان، " + images + " تصویر، " + videos + " ویدیو (" + Math.round(json.length / 1024) + " کیلوبایت). فایل page-" + slug + ".json را در «دانلود صفحه» بارگذاری کنید.";
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 12000);
  } catch (e) {}
  log("المان‌ها: " + count + " | تصاویر: " + images + " | ویدیو: " + videos + " | حجم: " + Math.round(json.length / 1024) + "KB");
  return page;
})();
`;

/** Build the ready-to-paste snippet for the given options. */
export function buildGrabberScript(opts: GrabberOptions): string {
  const safe: GrabberOptions = {
    ...DEFAULT_GRABBER_OPTIONS,
    ...opts,
    maxChars: Math.max(500, Math.min(20000, Number(opts.maxChars) || 4000)),
  };
  const header = [
    "/* ============================================================",
    " * ویجت دانلود صفحه — پیشخوان بیمه سامان (نمایندگی آذرخش)",
    " * روش ۱: DevTools (F12) → Sources → Snippets → New snippet → چسباندن → Ctrl+Enter",
    " * روش ۲: این متن را در Notepad ذخیره کنید و در کنسول مرورگر (Console) بچسبانید و Enter بزنید.",
    " * خروجی: یک فایل JSON دانلود می‌شود که در «صفحه‌ساز → دانلود صفحه» وارد می‌شود.",
    " * ============================================================ */",
  ].join("\n");
  return `${header}\n${(safe.mode === "blocks" ? BODY : CLONE_BODY).replace("__OPTIONS__", JSON.stringify(safe))}`.trim() + "\n";
}

/** Basic shape check for an imported grabber file. */
export function looksLikeGrabbedPage(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.blocks) && typeof v.title === "string";
}
