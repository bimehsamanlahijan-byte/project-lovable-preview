import { createServerFn } from "@tanstack/react-start";

export type GithubAccountInput = {
  secretName: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
};

export const githubCheckAccount = createServerFn({ method: "POST" })
  .inputValidator((data: { secretName: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { githubWhoAmI } = await import("./github.server");
    try {
      const me = await githubWhoAmI(data.secretName || "GITHUB_API_KEY");
      return { ok: true as const, login: me.login, name: me.name };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  });

export const githubPublishSnapshot = createServerFn({ method: "POST" })
  .inputValidator((data: GithubAccountInput & { note?: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked, runAdminOp } = await import("./dashboard-auth.server");
    await requireUnlocked();
    const { githubCommitFile } = await import("./github.server");

    const settings = (await runAdminOp({
      table: "site_settings",
      action: "select",
      select: "key, value, updated_at",
    })) as { data: unknown };

    const snapshot = JSON.stringify(
      { exportedAt: new Date().toISOString(), note: data.note ?? "", settings: settings.data },
      null,
      2,
    );

    try {
      const commit = await githubCommitFile({
        secretName: data.secretName || "GITHUB_API_KEY",
        owner: data.owner,
        repo: data.repo,
        branch: data.branch || "main",
        path: data.path || "lovable/site-content.json",
        content: snapshot,
        message: data.note?.trim() || "به‌روزرسانی محتوای سایت از پیشخوان",
      });
      return { ok: true as const, ...commit };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  });
