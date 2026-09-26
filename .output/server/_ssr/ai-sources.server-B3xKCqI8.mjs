//#region node_modules/.nitro/vite/services/ssr/assets/ai-sources.server-B3xKCqI8.js
var KB_TAG_PREFIX = "source:";
var MAX_INPUT_CHARS = 18e3;
/** Strips scripts/styles/tags and collapses whitespace so the model gets readable text. */
function htmlToText(html) {
	return html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ").replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/[ \t\u00a0]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
async function db() {
	const { getSupabaseAdmin } = await import("./cloud-admin.server-C2hTQ8dd.mjs");
	return await getSupabaseAdmin();
}
async function listSources() {
	const { data } = await (await db()).from("ai_sources").select("*").order("position", { ascending: true });
	return data ?? [];
}
async function addSource(input) {
	const supabase = await db();
	const rows = await listSources();
	const { data, error } = await supabase.from("ai_sources").insert({
		title: input.title.trim() || "منبع جدید",
		url: input.url.trim(),
		branch: input.branch?.trim() || null,
		interval_hours: input.interval_hours ?? 168,
		auto_approve: input.auto_approve ?? true,
		position: rows.length + 1
	}).select("id").single();
	if (error) return {
		ok: false,
		error: error.message
	};
	return {
		ok: true,
		id: data.id
	};
}
async function updateSource(id, patch) {
	const { error } = await (await db()).from("ai_sources").update(patch).eq("id", id);
	return error ? {
		ok: false,
		error: error.message
	} : { ok: true };
}
async function removeSource(id) {
	const { error } = await (await db()).from("ai_sources").delete().eq("id", id);
	return error ? {
		ok: false,
		error: error.message
	} : { ok: true };
}
async function fetchPageText(url) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; SamanAgencyBot/1.0; +https://saman8452.ir)",
				"Accept-Language": "fa-IR,fa;q=0.9",
				Accept: "text/html,application/xhtml+xml"
			},
			redirect: "follow"
		});
		if (!res.ok) return {
			ok: false,
			error: `http_${res.status}`
		};
		const text = htmlToText(await res.text());
		if (text.length < 200) return {
			ok: false,
			error: "page_too_small"
		};
		return {
			ok: true,
			text: text.slice(0, MAX_INPUT_CHARS)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "fetch_failed"
		};
	}
}
/** Rewrites raw page text into an agency-safe Persian product briefing. */
async function summarise(source, pageText) {
	const { runModel } = await import("./site-ai.server-BnKgEAdd.mjs");
	const system = [
		"تو کارشناس فنی بیمه سامان هستی و وظیفه‌ات تبدیل متن خام یک صفحه‌ی رسمی بیمه سامان به یک «برگه دانش» دقیق فارسی است.",
		"خروجی فقط متن فارسی ساختاریافته باشد، بدون مقدمه و بدون توضیح درباره‌ی خودت.",
		"ساختار خروجی:",
		"معرفی طرح: (دو تا سه جمله)",
		"پوشش‌ها: (بولت)",
		"استثناها و محدودیت‌ها: (بولت)",
		"شرایط و مدارک: (بولت)",
		"نکات مشاوره‌ای برای فروش: (بولت، برای استفاده‌ی کارشناس)",
		"قواعد قطعی: هیچ آدرس اینترنتی، نام دامنه، شماره تماس، نام شرکت بیمه دیگر یا نام نمایندگی دیگری را در خروجی نیاور.",
		"چیزی از خودت اضافه نکن؛ فقط آنچه در متن آمده را مرتب و قابل فهم بنویس. اگر بخشی در متن نبود، آن سرفصل را حذف کن."
	].join("\n");
	const user = [
		`عنوان منبع: ${source.title}`,
		source.branch ? `شاخه بیمه: ${source.branch}` : "",
		"متن خام صفحه:",
		pageText
	].filter(Boolean).join("\n");
	return await runModel([{
		role: "system",
		content: system
	}, {
		role: "user",
		content: user
	}]);
}
/** Downloads one source, summarises it and stores the result as approved knowledge. */
async function syncSource(id) {
	const supabase = await db();
	const { data } = await supabase.from("ai_sources").select("*").eq("id", id).maybeSingle();
	const source = data;
	if (!source) return {
		ok: false,
		error: "source_not_found"
	};
	const stamp = async (patch) => {
		await supabase.from("ai_sources").update({
			last_synced_at: (/* @__PURE__ */ new Date()).toISOString(),
			...patch
		}).eq("id", id);
	};
	const page = await fetchPageText(source.url);
	if (!page.ok) {
		await stamp({
			last_status: "error",
			last_error: page.error
		});
		return {
			ok: false,
			error: page.error
		};
	}
	const out = await summarise(source, page.text);
	if (!out.ok) {
		await stamp({
			last_status: "error",
			last_error: out.error
		});
		return {
			ok: false,
			error: out.error
		};
	}
	const { sanitizeKnowledge } = await import("./ai-link-policy-B_2XyXfA.mjs").then((n) => n.n);
	const { loadAiSettings } = await import("./site-ai.server-BnKgEAdd.mjs");
	const settings = await loadAiSettings();
	const content = sanitizeKnowledge(out.text, settings.linkPolicy).trim();
	const title = `منبع رسمی — ${source.title}`;
	const tags = `${KB_TAG_PREFIX}${source.id}`;
	const { data: existing } = await supabase.from("ai_knowledge").select("id").eq("tags", tags).maybeSingle();
	let knowledgeId = existing?.id ?? null;
	if (knowledgeId) {
		const { error } = await supabase.from("ai_knowledge").update({
			title,
			content,
			is_active: source.auto_approve !== false
		}).eq("id", knowledgeId);
		if (error) {
			await stamp({
				last_status: "error",
				last_error: error.message
			});
			return {
				ok: false,
				error: error.message
			};
		}
	} else {
		const { data: created, error } = await supabase.from("ai_knowledge").insert({
			title,
			content,
			tags,
			position: 200 + (source.position ?? 0),
			is_active: source.auto_approve !== false
		}).select("id").single();
		if (error) {
			await stamp({
				last_status: "error",
				last_error: error.message
			});
			return {
				ok: false,
				error: error.message
			};
		}
		knowledgeId = created.id;
	}
	await stamp({
		last_status: source.auto_approve === false ? "pending_review" : "ok",
		last_error: null,
		last_chars: content.length,
		knowledge_id: knowledgeId
	});
	return {
		ok: true,
		chars: content.length
	};
}
/** Refreshes every active source whose interval has elapsed (used by the scheduler). */
async function syncDueSources(limit = 4) {
	const rows = (await listSources()).filter((s) => s.is_active);
	const now = Date.now();
	const due = rows.filter((s) => {
		if (!s.last_synced_at) return true;
		return now - new Date(s.last_synced_at).getTime() >= Math.max(1, s.interval_hours ?? 168) * 36e5;
	}).slice(0, limit);
	const results = [];
	for (const s of due) {
		const r = await syncSource(s.id);
		results.push({
			id: s.id,
			title: s.title,
			ok: r.ok,
			error: r.error
		});
	}
	return {
		checked: rows.length,
		synced: results.length,
		results
	};
}
/** Refreshes all active sources one after another (dashboard "update everything"). */
async function syncAllSources() {
	const rows = (await listSources()).filter((s) => s.is_active);
	const results = [];
	for (const s of rows) {
		const r = await syncSource(s.id);
		results.push({
			id: s.id,
			title: s.title,
			ok: r.ok,
			error: r.error
		});
	}
	return {
		synced: results.length,
		results
	};
}
//#endregion
export { addSource, listSources, removeSource, syncAllSources, syncDueSources, syncSource, updateSource };
