import { createServerFn } from "@tanstack/react-start";

/**
 * Dashboard-only: manage AI provider keys (masked listing, save, delete, test).
 * Every call requires an unlocked dashboard session.
 */

async function gate() {
  const { requireUnlocked } = await import("./dashboard-auth.server");
  await requireUnlocked();
}

export const listAiKeys = createServerFn({ method: "POST" }).handler(async () => {
  await gate();
  const { readAllKeys, mask } = await import("./ai-keys.server");
  const { AI_PROVIDERS } = await import("./ai-providers");
  const { envValue, loadRuntimeEnv } = await import("./server-env");
  await loadRuntimeEnv();
  const stored = await readAllKeys(true);
  return AI_PROVIDERS.map((p) => ({
    id: p.id,
    stored: Boolean(stored[p.id]?.key),
    masked: mask(stored[p.id]?.key),
    extraMasked: stored[p.id]?.extra ? mask(stored[p.id]?.extra) : "",
    updatedAt: stored[p.id]?.updatedAt ?? "",
    inEnv: Boolean(envValue(...p.keyNames)),
  }));
});

export const saveAiKey = createServerFn({ method: "POST" })
  .inputValidator((d: { provider: string; key: string; extra?: string }) => {
    if (!d?.provider || typeof d.key !== "string" || d.key.trim().length < 8 || d.key.length > 4000)
      throw new Error("کلید معتبر نیست.");
    return d;
  })
  .handler(async ({ data }) => {
    await gate();
    const { saveProviderKey } = await import("./ai-keys.server");
    const r = await saveProviderKey(data.provider, data.key, data.extra);
    return { ok: !r.error, error: r.error };
  });

export const deleteAiKey = createServerFn({ method: "POST" })
  .inputValidator((d: { provider: string }) => d)
  .handler(async ({ data }) => {
    await gate();
    const { deleteProviderKey } = await import("./ai-keys.server");
    const r = await deleteProviderKey(data.provider);
    return { ok: !r.error, error: r.error };
  });

export const testAiKey = createServerFn({ method: "POST" })
  .inputValidator((d: { provider: string; model?: string }) => d)
  .handler(async ({ data }) => {
    await gate();
    const { getProvider } = await import("./ai-providers");
    const { runModel } = await import("./site-ai.server");
    const p = getProvider(data.provider);
    const model = data.model || p.models[0]?.value || "";
    const started = Date.now();
    const out = await runModel([{ role: "user", content: "فقط بنویس: سلام" }], { provider: p.id, model });
    const ms = Date.now() - started;
    if (!out.ok) {
      const err = String(out.error);
      const hint = err.startsWith("missing_key")
        ? "کلیدی برای این موتور ثبت نشده است."
        : /401|403|invalid|unauthor/i.test(err)
          ? "کلید اشتباه است یا دسترسی ندارد."
          : /429/.test(err)
            ? "سهمیه این کلید تمام شده است (۴۲۹)."
            : err.slice(0, 300);
      return { ok: false as const, error: hint, model, ms };
    }
    return { ok: true as const, reply: out.text.slice(0, 120), model, ms };
  });
