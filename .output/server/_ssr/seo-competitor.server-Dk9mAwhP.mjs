import { readPageForAi } from "./ai-blocks.server-Dz_eENGG.mjs";
import { a as joinUrl, i as explainFetchError, r as cleanOrigin, s as swapOrigin } from "./seo-url-u7NDYTbH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo-competitor.server-Dk9mAwhP.js
/**
* Competitor SEO analysis (server-only).
*
* Implements the workflow the admin asked for — the same three-step technique
* taught in the training video:
*   1. search keyword → pick the top competitor URL
*   2. run the competitor domain through a website analyzer and find its
*      highest-traffic ("Top Pages") URL
*   3. hand that page to the AI engine with a "find this page's weaknesses so I
*      can turn them into my strengths" prompt, then apply the result to our
*      own pages.
*
* The analyzer source is switchable (`ai-engine.ts` → AnalyzerId):
*   builtin    — our own crawler: sitemap.xml + internal links + SEO signals
*   neilpatel  — the external Traffic Checker; admin pastes the Top Page URL
*   ai_only    — no crawling, the AI engine reasons from the URL alone
* and the AI engine itself is switchable too (default: Lovable AI).
*/
/**
* Reads a page; when it fails on one domain, tries the same path on the
* second domain (bimehsaman8452.ir <-> saman8452.ir) before giving up.
*/
async function pageSignalsWithFallback(url, altOrigin) {
	const first = await pageSignals(url);
	if (first.ok) return first;
	const origin = cleanOrigin(url);
	const alt = cleanOrigin(altOrigin) || (origin === cleanOrigin("https://bimehsaman8452.ir") ? "https://saman8452.ir" : origin === cleanOrigin("https://saman8452.ir") ? "https://bimehsaman8452.ir" : "");
	if (alt && cleanOrigin(alt) !== origin) {
		const second = await pageSignals(swapOrigin(url, alt));
		if (second.ok) return {
			...second,
			via: `از دامنه دوم خوانده شد (${cleanOrigin(alt)}) چون ${explainFetchError(first.error)}`
		};
	}
	return {
		...first,
		error: explainFetchError(first.error)
	};
}
function absolute(href, base) {
	try {
		const u = new URL(href, base);
		if (!/^https?:$/.test(u.protocol)) return null;
		u.hash = "";
		return u.href;
	} catch {
		return null;
	}
}
/** Collects light SEO signals for one page. */
async function pageSignals(url) {
	const page = await readPageForAi(url);
	if (!page.ok) return {
		url,
		ok: false,
		error: page.error
	};
	const headings = page.text.split("\n").filter((l) => l.startsWith("#")).map((l) => l.replace(/^#+\s*/, "")).slice(0, 40);
	return {
		url: page.finalUrl,
		ok: true,
		title: page.title,
		description: page.description,
		h1: headings[0] || "",
		headings,
		words: page.text.split(/\s+/).filter(Boolean).length,
		images: page.images.length,
		text: page.text.slice(0, 9e3)
	};
}
/**
* Finds a competitor's most important pages.
* sitemap.xml first (ordered as the site itself prioritises them), then the
* home page's internal links as a fallback — the crawl-based stand-in for the
* video's "Top Pages" list.
*/
async function discoverTopPages(rawUrl, limit = 12) {
	let origin;
	try {
		origin = new URL(rawUrl.trim()).origin;
	} catch {
		return [];
	}
	const found = [];
	const pushUrl = (u) => {
		if (!u || found.includes(u)) return;
		if (!u.startsWith(origin)) return;
		if (/\.(jpg|jpeg|png|webp|gif|svg|pdf|zip|mp4|css|js)(\?|$)/i.test(u)) return;
		found.push(u);
	};
	for (const path of [
		"/sitemap.xml",
		"/sitemap_index.xml",
		"/wp-sitemap.xml"
	]) {
		if (found.length >= limit) break;
		try {
			const res = await fetch(origin + path, { headers: { "User-Agent": "Mozilla/5.0" } });
			if (!res.ok) continue;
			const xml = (await res.text()).slice(0, 15e5);
			const locs = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)).map((m) => m[1]);
			const nested = locs.filter((l) => /\.xml(\?|$)/i.test(l)).slice(0, 3);
			locs.filter((l) => !/\.xml(\?|$)/i.test(l)).forEach((l) => pushUrl(absolute(l, origin)));
			for (const child of nested) {
				if (found.length >= limit) break;
				try {
					const r2 = await fetch(child, { headers: { "User-Agent": "Mozilla/5.0" } });
					if (!r2.ok) continue;
					const x2 = (await r2.text()).slice(0, 15e5);
					Array.from(x2.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)).forEach((m) => pushUrl(absolute(m[1], origin)));
				} catch {}
			}
		} catch {}
	}
	if (found.length < limit) try {
		const res = await fetch(origin, { headers: { "User-Agent": "Mozilla/5.0" } });
		if (res.ok) {
			const html = (await res.text()).slice(0, 15e5);
			Array.from(html.matchAll(/href=["']([^"'#]+)["']/gi)).forEach((m) => pushUrl(absolute(m[1], origin)));
		}
	} catch {}
	return found.slice(0, limit);
}
function firstJson(raw) {
	const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const body = fenced ? fenced[1] : raw;
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		return JSON.parse(body.slice(start, end + 1));
	} catch {
		return null;
	}
}
var strArray = (v, max = 12) => (Array.isArray(v) ? v : []).filter((x) => typeof x === "string" && x.trim()).slice(0, max).map((x) => String(x).trim());
function signalsBlock(label, s) {
	if (!s.ok) return `${label}: قابل دریافت نبود (${s.error})`;
	return [
		`${label} — ${s.url}`,
		`عنوان: ${s.title}`,
		`توضیح متا: ${s.description}`,
		`تعداد کلمات: ${s.words} | تصاویر: ${s.images}`,
		`تیترها: ${(s.headings ?? []).slice(0, 25).join(" | ")}`,
		s.text ? `بخشی از متن:\n${s.text.slice(0, 4500)}` : ""
	].filter(Boolean).join("\n");
}
/**
* Full competitor analysis: competitor page + our pages → actionable plan.
*/
async function analyzeCompetitor(args) {
	const competitorUrl = (args.competitorUrl || "").trim();
	if (!competitorUrl) return {
		ok: false,
		error: "آدرس سایت رقیب را وارد کنید."
	};
	const analyzer = args.analyzer || "builtin";
	const topPages = analyzer === "ai_only" ? [] : await discoverTopPages(competitorUrl);
	const competitor = analyzer === "ai_only" ? {
		url: competitorUrl,
		ok: false,
		error: "حالت «فقط هوش مصنوعی» — صفحه خزش نشد."
	} : await pageSignalsWithFallback(competitorUrl);
	const mine = [];
	for (const url of (args.myUrls || []).slice(0, 8)) mine.push(await pageSignalsWithFallback(url, args.myAltOrigin));
	const { runModel } = await import("./site-ai.server-BnKgEAdd.mjs");
	const system = [
		"تو یک متخصص ارشد سئو فارسی‌زبان در حوزه بیمه هستی.",
		"وظیفه: تحلیل صفحه رقیب و صفحه‌های سایت کارفرما، پیدا کردن نقاط ضعف رقیب و تبدیل آن‌ها به نقاط قوت سایت کارفرما تا در گوگل بالاتر از رقیب دیده شود.",
		"تحلیل باید عملی و قابل اجرا باشد: چه محتوایی کم است، چه تیترهایی اضافه شود، چه کلمات کلیدی هدف‌گذاری شود، چه لینک‌سازی و چه اصلاح سئوی فنی لازم است.",
		"فقط JSON معتبر و فارسی برگردان، بدون توضیح اضافه، با این ساختار:",
		"{\"summary\":\"\",\"competitorWeaknesses\":[],\"competitorStrengths\":[],\"myGaps\":[],\"keywords\":[{\"keyword\":\"\",\"intent\":\"\",\"where\":\"/path\"}],\"contentPlan\":[{\"path\":\"/path\",\"action\":\"افزودن|بازنویسی|گسترش\",\"title\":\"\",\"description\":\"\",\"outline\":[\"تیتر H2\"]}],\"backlinks\":[],\"quickWins\":[]}"
	].join("\n");
	const user = [
		args.keyword ? `کلمه کلیدی هدف: ${args.keyword}` : "",
		`روش آنالیز وب‌سایت: ${analyzer}`,
		signalsBlock("صفحه رقیب", competitor),
		topPages.length ? `مهم‌ترین صفحات رقیب (نقشه سایت/لینک‌های داخلی):\n${topPages.join("\n")}` : "",
		"صفحات سایت ما:",
		mine.map((m, i) => signalsBlock(`صفحه ما ${i + 1}`, m)).join("\n\n") || "(صفحه‌ای ارسال نشد)",
		args.extraNotes ? `یادداشت مدیر سایت: ${args.extraNotes}` : ""
	].filter(Boolean).join("\n\n");
	const out = await runModel([{
		role: "system",
		content: system
	}, {
		role: "user",
		content: user
	}], {
		provider: args.provider,
		model: args.model,
		temperature: .4
	});
	if (!out.ok) return {
		ok: false,
		error: `هوش مصنوعی پاسخ نداد (${out.error})`
	};
	const json = firstJson(out.text);
	if (!json) return {
		ok: false,
		error: "پاسخ هوش مصنوعی قابل خواندن نبود؛ دوباره تلاش کنید."
	};
	return {
		ok: true,
		engine: `${args.provider || "lovable"} / ${args.model || "پیش‌فرض"}`,
		analyzer,
		competitor,
		mine,
		topPages,
		report: {
			summary: String(json.summary || "").slice(0, 4e3),
			competitorWeaknesses: strArray(json.competitorWeaknesses),
			competitorStrengths: strArray(json.competitorStrengths),
			myGaps: strArray(json.myGaps),
			keywords: (Array.isArray(json.keywords) ? json.keywords : []).slice(0, 25).map((k) => ({
				keyword: String(k?.keyword || "").slice(0, 120),
				intent: String(k?.intent || "").slice(0, 120),
				where: String(k?.where || "").slice(0, 200)
			})),
			contentPlan: (Array.isArray(json.contentPlan) ? json.contentPlan : []).slice(0, 25).map((c) => ({
				path: String(c?.path || "").slice(0, 200),
				action: String(c?.action || "").slice(0, 60),
				title: String(c?.title || "").slice(0, 200),
				description: String(c?.description || "").slice(0, 400),
				outline: strArray(c?.outline, 15)
			})),
			backlinks: strArray(json.backlinks, 15),
			quickWins: strArray(json.quickWins, 15)
		},
		raw: out.text.slice(0, 2e4)
	};
}
/**
* Whole-site scan: reads every page listed in the SEO settings, scores the
* obvious on-page issues, and (when a competitor is supplied) asks the AI
* engine for a prioritised plan to outrank it.
*/
async function scanMySite(args) {
	const origin = cleanOrigin(args.origin);
	if (!origin) return {
		ok: false,
		error: "آدرس دامنه سایت در تنظیمات سئو خالی است."
	};
	const altOrigin = cleanOrigin(args.altOrigin) || (origin === cleanOrigin("https://bimehsaman8452.ir") ? "https://saman8452.ir" : "https://bimehsaman8452.ir");
	const urls = Array.from(new Set((args.paths || []).slice(0, 12).map((p) => joinUrl(origin, p))));
	const pages = [];
	for (const url of urls) {
		const s = await pageSignalsWithFallback(url, altOrigin);
		const issues = [];
		if (!s.ok) issues.push(`صفحه از هیچ‌کدام از دو دامنه دریافت نشد: ${s.error}`);
		else if (s.via) issues.push(s.via);
		else {
			if (!s.title) issues.push("عنوان صفحه (title) خالی است.");
			else if (s.title.length < 25) issues.push("عنوان صفحه بسیار کوتاه است (زیر ۲۵ کاراکتر).");
			else if (s.title.length > 65) issues.push("عنوان صفحه بلندتر از حد نمایش گوگل است.");
			if (!s.description) issues.push("توضیح متا (description) ندارد.");
			else if (s.description.length < 70) issues.push("توضیح متا کوتاه است (زیر ۷۰ کاراکتر).");
			if (!s.h1) issues.push("تیتر H1 پیدا نشد.");
			if ((s.words ?? 0) < 300) issues.push("حجم محتوا کم است (زیر ۳۰۰ کلمه).");
			if ((s.headings?.length ?? 0) < 3) issues.push("ساختار تیترها (H2/H3) ضعیف است.");
			if ((s.images ?? 0) === 0) issues.push("هیچ تصویری در محتوا نیست.");
		}
		pages.push({
			...s,
			issues
		});
	}
	let analysis;
	if (args.competitorUrl?.trim()) {
		const res = await analyzeCompetitor({
			keyword: args.keyword,
			competitorUrl: args.competitorUrl,
			myUrls: urls.slice(0, 6),
			myAltOrigin: altOrigin,
			analyzer: args.analyzer,
			provider: args.provider,
			model: args.model,
			extraNotes: `ایرادهای یافته‌شده در سایت ما:\n${pages.map((p) => `${p.url}: ${p.issues.join("؛ ") || "بدون ایراد آشکار"}`).join("\n")}`
		});
		if (res.ok) analysis = res;
	}
	return {
		ok: true,
		pages,
		analysis
	};
}
/**
* Rewrites one of our pages so it beats the competitor page for the target
* keyword. Returns Page Builder blocks plus SEO title/description, so the
* result stays fully editable in the Visual Editor.
*/
async function aiRewritePageForSeo(args) {
	const mine = args.targetUrl ? await pageSignals(args.targetUrl) : {
		url: "",
		ok: false
	};
	const competitor = args.competitorUrl ? await pageSignals(args.competitorUrl) : null;
	const { aiExtractPage } = await import("./ai-blocks.server-Dz_eENGG.mjs");
	const instructions = [
		args.keyword ? `کلمه کلیدی اصلی: ${args.keyword}` : "",
		competitor?.ok ? `صفحه رقیب برای مقایسه: ${competitor.url} — عنوان: ${competitor.title} — تیترها: ${(competitor.headings ?? []).slice(0, 20).join(" | ")}` : "",
		mine.ok ? `ایرادهای محتوای فعلی ما: کلمات ${mine.words}، تیترها ${(mine.headings ?? []).length}` : "",
		"محتوا را کامل‌تر، دقیق‌تر و سئو‌محورتر از رقیب بنویس: پوشش کامل موضوع، پرسش‌های پرتکرار، جدول مقایسه در قالب فهرست، و یک فراخوان پایانی به مشاوره نمایندگی.",
		args.guidance || ""
	].filter(Boolean).join("\n");
	const source = mine.ok ? mine.url : args.competitorUrl || args.targetUrl;
	if (!source) return {
		ok: false,
		error: "آدرس صفحه مقصد را وارد کنید."
	};
	const out = await aiExtractPage({
		url: source,
		provider: args.provider,
		model: args.model,
		instructions
	});
	if (!out.ok) return {
		ok: false,
		error: out.error
	};
	return {
		ok: true,
		title: out.title,
		description: out.description,
		blocks: out.blocks
	};
}
//#endregion
export { aiRewritePageForSeo, analyzeCompetitor, discoverTopPages, scanMySite };
