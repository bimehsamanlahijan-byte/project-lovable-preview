import { AI_PROVIDERS, getProvider } from "@/lib/ai-providers";
import type { EngineChoice } from "@/lib/ai-engine";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

/**
 * Shared "which AI engine should run this feature?" picker.
 *
 * Used by the Page Builder (extraction script) and the SEO competitor
 * analyzer. Defaults to Lovable AI, which requires no extra token.
 */
export function AiEngineSelect({
  value,
  onChange,
  label = "موتور هوش مصنوعی",
}: {
  value: EngineChoice;
  onChange: (next: EngineChoice) => void;
  label?: string;
}) {
  const provider = getProvider(value.provider);
  const models = provider.models.some((m) => m.value === value.model)
    ? provider.models
    : [{ value: value.model, label: value.model }, ...provider.models];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <label className="text-xs">
        <span className="mb-1 block font-bold text-slate-600">{label}</span>
        <select
          value={provider.id}
          onChange={(e) => {
            const next = getProvider(e.target.value);
            onChange({ provider: next.id, model: next.models[0]?.value ?? value.model });
          }}
          className={inputCls}
        >
          {AI_PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-[11px] text-slate-400">{provider.note}</span>
      </label>
      <label className="text-xs">
        <span className="mb-1 block font-bold text-slate-600">مدل</span>
        <select
          dir="ltr"
          value={value.model}
          onChange={(e) => onChange({ provider: provider.id, model: e.target.value })}
          className={inputCls}
        >
          {models.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <input
          dir="ltr"
          placeholder="یا شناسه مدل دلخواه را بنویسید"
          value={value.model}
          onChange={(e) => onChange({ provider: provider.id, model: e.target.value })}
          className={`${inputCls} mt-1`}
        />
      </label>
    </div>
  );
}
