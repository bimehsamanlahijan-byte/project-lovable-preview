/**
 * Per-feature AI engine selection (client-safe).
 *
 * The dashboard lets the admin pick which AI engine powers each smart feature:
 * the Page Builder's per-page extraction script and the SEO competitor
 * analyzer. Default engine is always Lovable AI, which needs no extra token.
 *
 * Stored in `site_settings` under the key `ai_engines`.
 */

export const AI_ENGINES_KEY = "ai_engines";

export type EngineChoice = {
  /** Provider id from `ai-providers.ts` (e.g. "lovable"). */
  provider: string;
  /** Model id understood by that provider. */
  model: string;
};

/** Which website-analyzer source feeds the competitor analysis. */
export type AnalyzerId = "builtin" | "neilpatel" | "ai_only";

export type AnalyzerOption = {
  id: AnalyzerId;
  label: string;
  note: string;
  /** External tool the admin can open for the manual (video) workflow. */
  externalUrl?: string;
};

export const ANALYZERS: AnalyzerOption[] = [
  {
    id: "builtin",
    label: "آنالیزور داخلی سایت (پیش‌فرض)",
    note: "صفحات رقیب را از نقشه سایت و لینک‌های داخلی پیدا می‌کند و سیگنال‌های سئو را می‌خواند.",
  },
  {
    id: "neilpatel",
    label: "Traffic Checker نیل پاتل (روش ویدیو)",
    note: "آدرس رقیب را در ابزار نیل پاتل باز می‌کند؛ صفحه پرترافیک را از «Top Pages» کپی و اینجا وارد کنید.",
    externalUrl: "https://neilpatel.com/traffic-analyzer/",
  },
  {
    id: "ai_only",
    label: "فقط هوش مصنوعی (بدون خزش)",
    note: "بدون دریافت صفحات، تحلیل را تنها بر پایه دانش موتور هوش مصنوعی انجام می‌دهد.",
  },
];

export type AiEnginesSettings = {
  /** Engine for the Page Builder's AI extraction script. */
  pageBuilder: EngineChoice;
  /** Engine for the SEO competitor analysis + content rewrites. */
  seoCompetitor: EngineChoice;
  /** Website analyzer source for competitor research. */
  analyzer: AnalyzerId;
};

export const DEFAULT_ENGINE: EngineChoice = {
  provider: "lovable",
  model: "google/gemini-3.6-flash",
};

export const DEFAULT_AI_ENGINES: AiEnginesSettings = {
  pageBuilder: { ...DEFAULT_ENGINE },
  seoCompetitor: { ...DEFAULT_ENGINE },
  analyzer: "builtin",
};

export function getAnalyzer(id: string | undefined): AnalyzerOption {
  return ANALYZERS.find((a) => a.id === id) ?? ANALYZERS[0]!;
}
