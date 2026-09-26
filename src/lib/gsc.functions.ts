import { createServerFn } from "@tanstack/react-start";

async function gate() {
  const { requireUnlocked } = await import("./dashboard-auth.server");
  await requireUnlocked();
}

export const gscStatus = createServerFn({ method: "POST" }).handler(async () => {
  await gate();
  const { loadServiceAccount } = await import("./gsc.server");
  const sa = await loadServiceAccount();
  return { configured: Boolean(sa), email: sa?.client_email ?? "" };
});

export const saveGscKey = createServerFn({ method: "POST" })
  .inputValidator((d: { json: string }) => {
    const parsed = JSON.parse(d?.json || "{}");
    if (!parsed.client_email || !parsed.private_key) throw new Error("فایل JSON کلید سرویس گوگل معتبر نیست.");
    return d;
  })
  .handler(async ({ data }) => {
    await gate();
    const { writePrivateSetting } = await import("./dashboard-auth.server");
    const { GOOGLE_SA_SETTING } = await import("./ai-keys.server");
    const r = await writePrivateSetting(GOOGLE_SA_SETTING, { json: data.json });
    return { ok: !r.error, error: r.error };
  });

export const deleteGscKey = createServerFn({ method: "POST" }).handler(async () => {
  await gate();
  const { writePrivateSetting } = await import("./dashboard-auth.server");
  const { GOOGLE_SA_SETTING } = await import("./ai-keys.server");
  const r = await writePrivateSetting(GOOGLE_SA_SETTING, null);
  return { ok: !r.error, error: r.error };
});

/** Registers + analyzes both domains, then asks the chosen AI engine for guidance. */
export const gscAutoRun = createServerFn({ method: "POST" })
  .inputValidator((d: { domains: string[]; provider?: string; model?: string }) => d)
  .handler(async ({ data }) => {
    await gate();
    const { loadServiceAccount, registerAndAnalyze } = await import("./gsc.server");
    const { cleanOrigin } = await import("./seo-url");
    const sa = await loadServiceAccount();
    if (!sa) return { ok: false as const, error: "ابتدا کلید سرویس گوگل (فایل JSON) را ثبت کنید." };

    const reports = [];
    for (const raw of data.domains.slice(0, 2)) {
      const origin = cleanOrigin(raw);
      if (!origin) continue;
      try {
        reports.push(await registerAndAnalyze(origin, sa));
      } catch (e) {
        reports.push({
          domain: origin,
          steps: [{ step: "اتصال به گوگل", ok: false, detail: e instanceof Error ? e.message : String(e) }],
          topQueries: [],
          sitemaps: [],
        });
      }
    }

    const { getProvider } = await import("./ai-providers");
    const provider = getProvider(data.provider);
    const model = data.model || provider.models[0]?.value || "";
    const { runModel } = await import("./site-ai.server");
    const out = await runModel(
      [
        {
          role: "system",
          content:
            "تو متخصص سئوی فارسی هستی. گزارش سرچ کنسول دو دامنه یک نمایندگی بیمه را بررسی کن و به زبان ساده، فهرست‌وار و عملی بگو چه کارهایی انجام شود. حداکثر ۱۲ بند.",
        },
        { role: "user", content: JSON.stringify(reports).slice(0, 12000) },
      ],
      { provider: provider.id, model, temperature: 0.3 },
    );
    return {
      ok: true as const,
      reports,
      engine: `${provider.label} / ${model}`,
      advice: out.ok ? out.text : `تحلیل هوش مصنوعی انجام نشد: ${out.error}`,
      clientEmail: sa.client_email,
    };
  });
