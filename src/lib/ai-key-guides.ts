/** Where to get each AI engine's key (client-safe data for the help windows). */
export const KEY_GUIDES: Record<string, { url: string; steps: string[] }> = {
  lovable: {
    url: "https://lovable.dev",
    steps: ["این موتور کلید جداگانه نمی‌خواهد؛ متغیر LOVABLE_API_KEY روی میزبانی Lovable خودکار تنظیم است.", "اگر سایت روی Cloudflare خودتان است، از بخش تنظیمات پروژه Lovable کلید بسازید."],
  },
  cloudflare: {
    url: "https://dash.cloudflare.com/profile/api-tokens",
    steps: ["dash.cloudflare.com → آیکون پروفایل → «API Tokens» → «Create Token».", "قالب «Workers AI» را انتخاب و توکن را بسازید.", "شناسه حساب (Account ID) را از صفحه اصلی داشبورد، ستون راست، کپی کنید و در فیلد دوم وارد کنید."],
  },
  google: {
    url: "https://aistudio.google.com/app/apikey",
    steps: ["به aistudio.google.com بروید و با حساب گوگل وارد شوید.", "«Get API key» → «Create API key».", "کلید (شروع با AIza) را کپی کنید."],
  },
  groq: { url: "https://console.groq.com/keys", steps: ["وارد console.groq.com شوید.", "«API Keys» → «Create API Key».", "کلید (شروع با gsk_) را همان لحظه کپی کنید."] },
  openrouter: { url: "https://openrouter.ai/keys", steps: ["وارد openrouter.ai شوید.", "منوی «Keys» → «Create Key».", "کلید (شروع با sk-or-) را کپی کنید."] },
  mistral: { url: "https://console.mistral.ai/api-keys", steps: ["وارد console.mistral.ai شوید.", "«API Keys» → «Create new key».", "کلید را کپی کنید."] },
  deepseek: { url: "https://platform.deepseek.com/api_keys", steps: ["وارد platform.deepseek.com شوید.", "«API keys» → «Create new API key».", "کلید (شروع با sk-) را کپی کنید."] },
  together: { url: "https://api.together.ai/settings/api-keys", steps: ["وارد together.ai شوید.", "«Settings» → «API Keys».", "کلید را کپی کنید."] },
  cerebras: { url: "https://cloud.cerebras.ai", steps: ["وارد cloud.cerebras.ai شوید.", "منوی «API Keys» → «Generate».", "کلید (شروع با csk-) را کپی کنید."] },
  github: { url: "https://github.com/settings/personal-access-tokens", steps: ["github.com → Settings → Developer settings → Personal access tokens → Fine-grained.", "«Generate new token» و در بخش Permissions دسترسی «Models: Read» را بدهید.", "توکن (شروع با github_pat_) را کپی کنید."] },
  nvidia: { url: "https://build.nvidia.com", steps: ["وارد build.nvidia.com شوید.", "یک مدل را باز کنید و «Get API Key» را بزنید.", "کلید (شروع با nvapi-) را کپی کنید."] },
  huggingface: { url: "https://huggingface.co/settings/tokens", steps: ["وارد huggingface.co شوید.", "Settings → Access Tokens → «Create new token» (نوع Read یا Inference).", "توکن (شروع با hf_) را کپی کنید."] },
};
