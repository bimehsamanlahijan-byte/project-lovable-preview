/**
 * Catalog of chat providers the assistant can talk to.
 *
 * Every provider below exposes an OpenAI-compatible `/chat/completions`
 * endpoint, so one request shape covers all of them. API keys are NEVER stored
 * in the database: they live as Cloudflare Worker secrets / environment
 * variables and are read server-side only.
 */

export type AiProviderId =
  | "lovable"
  | "cloudflare"
  | "google"
  | "groq"
  | "openrouter"
  | "mistral"
  | "deepseek"
  | "together"
  | "cerebras"
  | "github"
  | "nvidia"
  | "huggingface";

export type AiProvider = {
  id: AiProviderId;
  label: string;
  /** Environment variable names holding the API key (first match wins). */
  keyNames: string[];
  /** Extra env names required besides the key (e.g. Cloudflare account id). */
  extraNames?: string[];
  /** Suggested models; the admin can also type a custom model id. */
  models: { value: string; label: string }[];
  note: string;
};

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "lovable",
    label: "Lovable AI (پیش‌فرض)",
    keyNames: ["LOVABLE_API_KEY"],
    models: [
      { value: "google/gemini-3.6-flash", label: "Gemini 3.6 Flash (سریع)" },
      { value: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (کم‌هزینه)" },
      { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (دقیق‌تر)" },
      { value: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna (سریع)" },
      { value: "openai/gpt-5.5", label: "GPT-5.5 (قوی‌ترین)" },
    ],
    note: "بدون نیاز به توکن جداگانه؛ از اعتبار Lovable استفاده می‌کند.",
  },
  {
    id: "cloudflare",
    label: "Cloudflare Workers AI",
    keyNames: ["CLOUDFLARE_AI_TOKEN", "CLOUDFLARE_API_TOKEN"],
    extraNames: ["CLOUDFLARE_ACCOUNT_ID"],
    models: [
      { value: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", label: "Llama 3.3 70B (سریع)" },
      { value: "@cf/meta/llama-3.1-8b-instruct", label: "Llama 3.1 8B" },
      { value: "@cf/qwen/qwen2.5-coder-32b-instruct", label: "Qwen 2.5 32B" },
      { value: "@cf/mistralai/mistral-small-3.1-24b-instruct", label: "Mistral Small 3.1" },
    ],
    note: "نیاز به CLOUDFLARE_API_TOKEN و CLOUDFLARE_ACCOUNT_ID در متغیرهای Worker.",
  },
  {
    id: "google",
    label: "Google Gemini (رایگان)",
    keyNames: ["GEMINI_API_KEY", "GOOGLE_AI_API_KEY"],
    models: [
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    ],
    note: "کلید رایگان از Google AI Studio؛ متغیر GEMINI_API_KEY.",
  },
  {
    id: "groq",
    label: "Groq (رایگان — بسیار سریع)",
    keyNames: ["GROQ_API_KEY"],
    models: [
      { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
      { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
      { value: "gemma2-9b-it", label: "Gemma 2 9B" },
    ],
    note: "کلید رایگان از console.groq.com؛ متغیر GROQ_API_KEY.",
  },
  {
    id: "openrouter",
    label: "OpenRouter (مدل‌های رایگان)",
    keyNames: ["OPENROUTER_API_KEY"],
    models: [
      { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash (رایگان)" },
      { value: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (رایگان)" },
      { value: "deepseek/deepseek-chat-v3:free", label: "DeepSeek V3 (رایگان)" },
    ],
    note: "کلید از openrouter.ai؛ متغیر OPENROUTER_API_KEY.",
  },
  {
    id: "mistral",
    label: "Mistral AI (رایگان)",
    keyNames: ["MISTRAL_API_KEY"],
    models: [
      { value: "mistral-small-latest", label: "Mistral Small" },
      { value: "open-mistral-nemo", label: "Mistral Nemo" },
    ],
    note: "کلید رایگان از console.mistral.ai؛ متغیر MISTRAL_API_KEY.",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    keyNames: ["DEEPSEEK_API_KEY"],
    models: [
      { value: "deepseek-chat", label: "DeepSeek Chat" },
      { value: "deepseek-reasoner", label: "DeepSeek Reasoner" },
    ],
    note: "کلید از platform.deepseek.com؛ متغیر DEEPSEEK_API_KEY.",
  },
  {
    id: "together",
    label: "Together AI",
    keyNames: ["TOGETHER_API_KEY"],
    models: [
      { value: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", label: "Llama 3.3 70B (رایگان)" },
      { value: "mistralai/Mistral-7B-Instruct-v0.3", label: "Mistral 7B" },
    ],
    note: "کلید از together.ai؛ متغیر TOGETHER_API_KEY.",
  },
  {
    id: "cerebras",
    label: "Cerebras (رایگان)",
    keyNames: ["CEREBRAS_API_KEY"],
    models: [
      { value: "llama-3.3-70b", label: "Llama 3.3 70B" },
      { value: "llama3.1-8b", label: "Llama 3.1 8B" },
    ],
    note: "کلید رایگان از cloud.cerebras.ai؛ متغیر CEREBRAS_API_KEY.",
  },
  {
    id: "github",
    label: "GitHub Models (رایگان)",
    keyNames: ["GITHUB_MODELS_TOKEN", "GITHUB_TOKEN"],
    models: [
      { value: "openai/gpt-4o-mini", label: "GPT-4o mini" },
      { value: "meta/Llama-3.3-70B-Instruct", label: "Llama 3.3 70B" },
    ],
    note: "توکن گیت‌هاب با دسترسی Models؛ متغیر GITHUB_MODELS_TOKEN.",
  },
  {
    id: "nvidia",
    label: "NVIDIA NIM (رایگان)",
    keyNames: ["NVIDIA_API_KEY"],
    models: [
      { value: "meta/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
      { value: "mistralai/mistral-small-24b-instruct", label: "Mistral Small 24B" },
    ],
    note: "کلید رایگان از build.nvidia.com؛ متغیر NVIDIA_API_KEY.",
  },
  {
    id: "huggingface",
    label: "Hugging Face (رایگان)",
    keyNames: ["HUGGINGFACE_API_KEY", "HF_TOKEN"],
    models: [
      { value: "meta-llama/Llama-3.1-8B-Instruct", label: "Llama 3.1 8B" },
      { value: "Qwen/Qwen2.5-7B-Instruct", label: "Qwen 2.5 7B" },
    ],
    note: "توکن رایگان از huggingface.co؛ متغیر HUGGINGFACE_API_KEY.",
  },
];

export function getProvider(id: string | undefined): AiProvider {
  return AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0]!;
}
