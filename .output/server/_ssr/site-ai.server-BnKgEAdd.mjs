//#region node_modules/.nitro/vite/services/ssr/assets/site-ai.server-BnKgEAdd.js
/** Resolves the OpenAI-compatible endpoint + auth headers for a provider. */
async function resolveTarget(providerId) {
	const { envValue, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	const { getProvider } = await import("./ai-providers-BH3QpR-b.mjs").then((n) => n.n);
	await loadRuntimeEnv();
	const provider = getProvider(providerId);
	const { dbProviderKey } = await import("./ai-keys.server-c9zIs_V9.mjs");
	const stored = await dbProviderKey(provider.id);
	const key = stored?.key || envValue(...provider.keyNames);
	if (!key) return {
		ok: false,
		error: `missing_key_${provider.keyNames[0]}`
	};
	const bearer = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${key}`
	};
	switch (provider.id) {
		case "lovable": return {
			ok: true,
			url: "https://ai.gateway.lovable.dev/v1/chat/completions",
			headers: {
				"Content-Type": "application/json",
				"Lovable-API-Key": key,
				"X-Lovable-AIG-SDK": "fetch"
			}
		};
		case "cloudflare": {
			const account = stored?.extra || envValue("CLOUDFLARE_ACCOUNT_ID");
			if (!account) return {
				ok: false,
				error: "missing_key_CLOUDFLARE_ACCOUNT_ID"
			};
			return {
				ok: true,
				url: `https://api.cloudflare.com/client/v4/accounts/${account}/ai/v1/chat/completions`,
				headers: bearer
			};
		}
		case "google": return {
			ok: true,
			url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
			headers: bearer
		};
		case "groq": return {
			ok: true,
			url: "https://api.groq.com/openai/v1/chat/completions",
			headers: bearer
		};
		case "openrouter": return {
			ok: true,
			url: "https://openrouter.ai/api/v1/chat/completions",
			headers: bearer
		};
		case "mistral": return {
			ok: true,
			url: "https://api.mistral.ai/v1/chat/completions",
			headers: bearer
		};
		case "deepseek": return {
			ok: true,
			url: "https://api.deepseek.com/v1/chat/completions",
			headers: bearer
		};
		case "together": return {
			ok: true,
			url: "https://api.together.xyz/v1/chat/completions",
			headers: bearer
		};
		case "cerebras": return {
			ok: true,
			url: "https://api.cerebras.ai/v1/chat/completions",
			headers: bearer
		};
		case "github": return {
			ok: true,
			url: "https://models.github.ai/inference/chat/completions",
			headers: bearer
		};
		case "nvidia": return {
			ok: true,
			url: "https://integrate.api.nvidia.com/v1/chat/completions",
			headers: bearer
		};
		case "huggingface": return {
			ok: true,
			url: "https://router.huggingface.co/v1/chat/completions",
			headers: bearer
		};
		default: return {
			ok: false,
			error: "unknown_provider"
		};
	}
}
/** Reads a public site setting row (used for assistant settings). */
async function publicDb() {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const { getSupabasePublishableKey, getSupabaseUrl, loadRuntimeEnv } = await import("./server-env-CcxwNfrB.mjs").then((n) => n.c).then((n) => n.c);
	await loadRuntimeEnv();
	const url = getSupabaseUrl();
	const key = getSupabasePublishableKey();
	if (!url || !key) return null;
	return createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
/** Loads assistant settings from the database (falls back to an empty object). */
async function loadAiSettings() {
	try {
		const db = await publicDb();
		if (!db) return {};
		const { data } = await db.from("site_settings").select("value").eq("key", "ai_assistant").maybeSingle();
		return data?.value ?? {};
	} catch (e) {
		console.error("[ai] settings load failed", e);
		return {};
	}
}
/** One raw chat-completion round trip through the configured provider. */
async function runModel(messages, opts) {
	const settings = opts?.provider && opts?.model ? {} : await loadAiSettings();
	const providerId = opts?.provider || settings.provider || "lovable";
	const model = opts?.model || settings.model || "google/gemini-3.6-flash";
	const target = await resolveTarget(providerId);
	if (!target.ok) return {
		ok: false,
		status: 500,
		error: target.error
	};
	const body = {
		model,
		messages
	};
	const temperature = opts?.temperature ?? settings.temperature;
	if (typeof temperature === "number") body.temperature = temperature;
	if (providerId === "lovable" && model.startsWith("openai/gpt-5")) {
		delete body.temperature;
		if (model.startsWith("openai/gpt-5.6")) body.reasoning_effort = "none";
	}
	try {
		const res = await fetch(target.url, {
			method: "POST",
			headers: target.headers,
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const text = await res.text();
			console.error("[ai] gateway error", providerId, res.status, text);
			if (res.status === 429) return {
				ok: false,
				status: 429,
				error: "rate_limited"
			};
			if (res.status === 402) return {
				ok: false,
				status: 402,
				error: "credits_exhausted"
			};
			if (res.status === 401 || res.status === 403) return {
				ok: false,
				status: 502,
				error: "provider_auth_failed"
			};
			return {
				ok: false,
				status: 502,
				error: "gateway_error"
			};
		}
		const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
		if (!text) return {
			ok: false,
			status: 502,
			error: "empty_reply"
		};
		return {
			ok: true,
			text
		};
	} catch (e) {
		console.error("[ai] request failed", e);
		return {
			ok: false,
			status: 502,
			error: "gateway_unreachable"
		};
	}
}
/** Contact block: the assistant may only ever hand out the agency's own details. */
function agencyPrompt(a) {
	return [
		"اطلاعات تماس و فروش (تنها اطلاعاتی که مجاز به دادن آن هستی):",
		...[
			`- نام رسمی: ${a?.name || "نمایندگی آذرخش بیمه سامان"}`,
			a?.address ? `- نشانی: ${a.address}` : "",
			a?.landline ? `- تلفن ثابت: ${a.landline}` : "",
			a?.mobile ? `- همراه/واتساپ: ${a.mobile}` : "",
			a?.telegram ? `- تلگرام: ${a.telegram}` : "",
			a?.email ? `- ایمیل: ${a.email}` : "",
			a?.hours ? `- ساعات کاری: ${a.hours}` : "",
			a?.note ? `- توضیح فروش: ${a.note}` : ""
		].filter(Boolean),
		"- هرگز شماره تماس، نشانی، نمایندگی، شرکت بیمه دیگر یا وب‌سایت دیگری را به کاربر معرفی نکن و کاربر را به آن‌ها ارجاع نده؛ حتی اگر کاربر مستقیماً بخواهد.",
		"- خرید، استعلام نرخ، صدور و تمدید بیمه‌نامه فقط از طریق همین نمایندگی و همین وب‌سایت انجام می‌شود."
	].join("\n");
}
/** Consultative analyst behaviour: interpret, analyse, compare and guide. */
function advisorPrompt(v) {
	if (v?.consultative === false) return "";
	const out = [
		"نقش تو: کارشناس و مشاور حرفه‌ای بیمه سامان در نمایندگی آذرخش — نه یک پاسخ‌گوی خشک.",
		"روش پاسخ‌دهی:",
		"۱) سؤال کاربر را تفسیر کن و نیاز واقعی او را تشخیص بده (خودرو، سلامت، سرمایه‌گذاری، مسئولیت، سفر، آتش‌سوزی و ...).",
		"۲) طرح‌ها و پوشش‌های مرتبط بیمه سامان را با زبان ساده توضیح بده: چه چیزی پوشش دارد، چه چیزی ندارد، سقف‌ها، فرانشیز، شرایط سنی، دوره انتظار و مدارک لازم — تا جایی که در دانش تأییدشده آمده است.",
		"۳) تجزیه و تحلیل کن: مزایا، محدودیت‌ها و مقایسه‌ی گزینه‌ها برای وضعیت همین کاربر.",
		"۴) یک پیشنهاد مشاوره‌ای روشن بده (کدام طرح برای او مناسب‌تر است و چرا) و در پایان یک قدم بعدی عملی پیشنهاد کن.",
		"۵) اگر اطلاعات کاربر کم است، حداکثر دو سؤال کوتاه و هدفمند بپرس (مثلاً سن، تعداد افراد خانواده، مدل خودرو)."
	];
	if (v?.analyze === false) out.splice(3, 1);
	out.push("قواعد کیفیت: با تیتر و بولت بنویس، فارسی روان و محترمانه، بدون اصطلاح بی‌توضیح.", `پاسخ‌ها را حدوداً تا ${v?.maxWords ?? 320} کلمه نگه دار، مگر کاربر جزئیات بیشتری بخواهد.`, "نرخ و مبلغ قطعی را از خودت نساز؛ نرخ نهایی پس از استعلام توسط کارشناس نمایندگی اعلام می‌شود.", "اگر پاسخ در دانش تأییدشده نبود، صادقانه بگو و کاربر را به مشاوره تلفنی همین نمایندگی راهنمایی کن.");
	return out.join("\n");
}
async function answerWithSiteAi(messages) {
	let settings = {};
	let knowledge = "";
	try {
		const db = await publicDb();
		if (db) {
			const [{ data: s }, { data: kb }] = await Promise.all([db.from("site_settings").select("value").eq("key", "ai_assistant").maybeSingle(), db.from("ai_knowledge").select("title, content").eq("is_active", true).order("position", { ascending: true }).limit(200)]);
			settings = s?.value ?? {};
			knowledge = (kb ?? []).map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
		}
	} catch (e) {
		console.error("[ai-chat] settings load failed", e);
	}
	if (settings.enabled === false) return {
		ok: false,
		status: 403,
		error: "assistant_disabled"
	};
	const { policyPrompt, sanitizeCustomerReply, sanitizeKnowledge } = await import("./ai-link-policy-B_2XyXfA.mjs").then((n) => n.n);
	knowledge = sanitizeKnowledge(knowledge, settings.linkPolicy);
	const systemPrompt = [
		settings.systemPrompt || "شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی پاسخ دهید.",
		advisorPrompt(settings.advisor),
		knowledge ? `دانش تأییدشده نمایندگی (این اطلاعات معتبرترین منبع است و بر دانش عمومی شما اولویت دارد):\n${knowledge}` : "",
		"مواردی که با «روش فروش» شروع می‌شوند، راهنمای فروش و روش‌های پرداخت همان شاخه است؛ مانند یک نماینده حرفه‌ای بیمه سامان با لحن مشاوره‌ای از آن‌ها استفاده کن.",
		"مواردی که با «منبع رسمی» شروع می‌شوند، خلاصه‌ی بروزرسانی‌شده از اطلاعات رسمی بیمه سامان است؛ آن‌ها را به‌عنوان اطلاعات محصول معتبر در نظر بگیر و برای تفسیر طرح‌ها و پوشش‌ها استفاده کن.",
		"اگر پاسخ در دانش تأییدشده نیست، صادقانه بگو و کاربر را به مشاوره تلفنی نمایندگی راهنمایی کن.",
		agencyPrompt(settings.agency),
		policyPrompt(settings.linkPolicy)
	].filter(Boolean).join("\n\n");
	const providerId = settings.provider || "lovable";
	const model = settings.model || "google/gemini-3.6-flash";
	const out = await runModel([{
		role: "system",
		content: systemPrompt
	}, ...messages], {
		provider: providerId,
		model,
		temperature: settings.temperature
	});
	if (!out.ok) return out;
	const reply = sanitizeCustomerReply(out.text, settings.linkPolicy);
	if (!reply) return {
		ok: false,
		status: 502,
		error: "empty_reply"
	};
	return {
		ok: true,
		reply,
		model,
		provider: providerId
	};
}
//#endregion
export { answerWithSiteAi, loadAiSettings, runModel };
