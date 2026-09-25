/**
 * Independent knowledge pipeline for the site assistant.
 *
 * Each row in `ai_sources` points at an official Saman Insurance page. A refresh
 * downloads the page, turns it into plain Persian text, asks the configured model to
 * rewrite it as a product/coverage briefing, and stores the result in `ai_knowledge`
 * under a "منبع رسمی ..." title. The agency stays in control: every source can be
 * disabled, edited or re-synced, and entries can require manual approval.
 */

export type AiSource = {
  id: string;
  title: string;
  url: string;
  branch: string | null;
  is_active: boolean;
  auto_approve: boolean;
  interval_hours: number;
  position: number;
  last_synced_at: string | null;
  last_status: string | null;
  last_error: string | null;
  last_chars: number | null;
  knowledge_id: string | null;
};

const KB_TAG_PREFIX = "source:";
const MAX_INPUT_CHARS = 18000;

/** Strips scripts/styles/tags and collapses whitespace so the model gets readable text. */
export function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function db() {
  const { getSupabaseAdmin } = await import("@/lib/cloud-admin.server");
  return await getSupabaseAdmin();
}

export async function listSources(): Promise<AiSource[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("ai_sources" as never)
    .select("*")
    .order("position", { ascending: true });
  return (data ?? []) as unknown as AiSource[];
}

export async function addSource(input: {
  title: string;
  url: string;
  branch?: string | null;
  interval_hours?: number;
  auto_approve?: boolean;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const supabase = await db();
  const rows = await listSources();
  const { data, error } = await supabase
    .from("ai_sources" as never)
    .insert({
      title: input.title.trim() || "منبع جدید",
      url: input.url.trim(),
      branch: input.branch?.trim() || null,
      interval_hours: input.interval_hours ?? 168,
      auto_approve: input.auto_approve ?? true,
      position: rows.length + 1,
    } as never)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: (data as { id: string }).id };
}

export async function updateSource(
  id: string,
  patch: Partial<Pick<AiSource, "title" | "url" | "branch" | "is_active" | "auto_approve" | "interval_hours" | "position">>,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await db();
  const { error } = await supabase.from("ai_sources" as never).update(patch as never).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function removeSource(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await db();
  const { error } = await supabase.from("ai_sources" as never).delete().eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

async function fetchPageText(url: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SamanAgencyBot/1.0; +https://saman8452.ir)",
        "Accept-Language": "fa-IR,fa;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const html = await res.text();
    const text = htmlToText(html);
    if (text.length < 200) return { ok: false, error: "page_too_small" };
    return { ok: true, text: text.slice(0, MAX_INPUT_CHARS) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

/** Rewrites raw page text into an agency-safe Persian product briefing. */
async function summarise(source: AiSource, pageText: string) {
  const { runModel } = await import("@/lib/site-ai.server");
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
    "چیزی از خودت اضافه نکن؛ فقط آنچه در متن آمده را مرتب و قابل فهم بنویس. اگر بخشی در متن نبود، آن سرفصل را حذف کن.",
  ].join("\n");
  const user = [
    `عنوان منبع: ${source.title}`,
    source.branch ? `شاخه بیمه: ${source.branch}` : "",
    "متن خام صفحه:",
    pageText,
  ]
    .filter(Boolean)
    .join("\n");
  return await runModel([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);
}

/** Downloads one source, summarises it and stores the result as approved knowledge. */
export async function syncSource(id: string): Promise<{ ok: boolean; error?: string; chars?: number }> {
  const supabase = await db();
  const { data } = await supabase.from("ai_sources" as never).select("*").eq("id", id).maybeSingle();
  const source = data as unknown as AiSource | null;
  if (!source) return { ok: false, error: "source_not_found" };

  const stamp = async (patch: Record<string, unknown>) => {
    await supabase
      .from("ai_sources" as never)
      .update({ last_synced_at: new Date().toISOString(), ...patch } as never)
      .eq("id", id);
  };

  const page = await fetchPageText(source.url);
  if (!page.ok) {
    await stamp({ last_status: "error", last_error: page.error });
    return { ok: false, error: page.error };
  }

  const out = await summarise(source, page.text);
  if (!out.ok) {
    await stamp({ last_status: "error", last_error: out.error });
    return { ok: false, error: out.error };
  }

  const { sanitizeKnowledge } = await import("@/lib/ai-link-policy");
  const { loadAiSettings } = await import("@/lib/site-ai.server");
  const settings = await loadAiSettings();
  const content = sanitizeKnowledge(out.text, settings.linkPolicy).trim();
  const title = `منبع رسمی — ${source.title}`;
  const tags = `${KB_TAG_PREFIX}${source.id}`;

  const { data: existing } = await supabase
    .from("ai_knowledge" as never)
    .select("id")
    .eq("tags", tags)
    .maybeSingle();

  let knowledgeId = (existing as { id: string } | null)?.id ?? null;
  if (knowledgeId) {
    const { error } = await supabase
      .from("ai_knowledge" as never)
      .update({ title, content, is_active: source.auto_approve !== false } as never)
      .eq("id", knowledgeId);
    if (error) {
      await stamp({ last_status: "error", last_error: error.message });
      return { ok: false, error: error.message };
    }
  } else {
    const { data: created, error } = await supabase
      .from("ai_knowledge" as never)
      .insert({
        title,
        content,
        tags,
        position: 200 + (source.position ?? 0),
        is_active: source.auto_approve !== false,
      } as never)
      .select("id")
      .single();
    if (error) {
      await stamp({ last_status: "error", last_error: error.message });
      return { ok: false, error: error.message };
    }
    knowledgeId = (created as { id: string }).id;
  }

  await stamp({
    last_status: source.auto_approve === false ? "pending_review" : "ok",
    last_error: null,
    last_chars: content.length,
    knowledge_id: knowledgeId,
  });
  return { ok: true, chars: content.length };
}

/** Refreshes every active source whose interval has elapsed (used by the scheduler). */
export async function syncDueSources(limit = 4) {
  const rows = (await listSources()).filter((s) => s.is_active);
  const now = Date.now();
  const due = rows
    .filter((s) => {
      if (!s.last_synced_at) return true;
      const age = now - new Date(s.last_synced_at).getTime();
      return age >= Math.max(1, s.interval_hours ?? 168) * 3600_000;
    })
    .slice(0, limit);

  const results: { id: string; title: string; ok: boolean; error?: string }[] = [];
  for (const s of due) {
    const r = await syncSource(s.id);
    results.push({ id: s.id, title: s.title, ok: r.ok, error: r.error });
  }
  return { checked: rows.length, synced: results.length, results };
}

/** Refreshes all active sources one after another (dashboard "update everything"). */
export async function syncAllSources() {
  const rows = (await listSources()).filter((s) => s.is_active);
  const results: { id: string; title: string; ok: boolean; error?: string }[] = [];
  for (const s of rows) {
    const r = await syncSource(s.id);
    results.push({ id: s.id, title: s.title, ok: r.ok, error: r.error });
  }
  return { synced: results.length, results };
}
