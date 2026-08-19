import { createServerFn } from "@tanstack/react-start";
import type { CfDeployment, DevopsConfig, RepoStatus } from "./devops.server";

export type HealthItem = { key: string; label: string; ok: boolean; detail: string };

export const devopsGetConfig = createServerFn({ method: "GET" }).handler(async () => {
  const s = await import("./devops.server");
  await s.assertAdminAccess();
  return {
    config: await s.getDevopsConfig(),
    secrets: {
      github: s.githubTokenAvailable(),
      cloudflare: s.cloudflareConfigured(),
      buildHook: s.buildHookConfigured(),
    },
  };
});

export const devopsSaveConfig = createServerFn({ method: "POST" })
  .inputValidator((data: Partial<DevopsConfig>) => data)
  .handler(async ({ data }) => {
    const s = await import("./devops.server");
    await s.assertAdminAccess();
    const res = await s.saveDevopsConfig(data);
    return { ok: !res.error, error: res.error, config: res.config };
  });

export const devopsRepoStatus = createServerFn({ method: "GET" }).handler(async () => {
  const s = await import("./devops.server");
  await s.assertAdminAccess();
  const cfg = await s.getDevopsConfig();
  if (!cfg.owner || !cfg.repo)
    return { ok: false as const, error: "نام مالک و مخزن را در همین صفحه وارد و ذخیره کنید." };
  try {
    return { ok: true as const, status: await s.githubRepoStatus(cfg) };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
  }
});

export const devopsManualSync = createServerFn({ method: "POST" })
  .inputValidator((data: { note?: string }) => data)
  .handler(async ({ data }) => {
    const s = await import("./devops.server");
    await s.assertAdminAccess();
    const cfg = await s.getDevopsConfig();
    if (!cfg.owner || !cfg.repo)
      return { ok: false as const, error: "نام مالک و مخزن مشخص نیست." };
    const { runAdminOp } = await import("./dashboard-auth.server");
    const { githubCommitFile } = await import("./github.server");
    const settings = (await runAdminOp({
      table: "site_settings",
      action: "select",
      select: "key, value, updated_at",
    })) as { data: unknown };
    try {
      const commit = await githubCommitFile({
        secretName: "GITHUB_API_KEY",
        owner: cfg.owner,
        repo: cfg.repo,
        branch: cfg.branch || "main",
        path: cfg.snapshotPath || "lovable/site-content.json",
        content: JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            note: data.note ?? "sync دستی از پیشخوان",
            settings: settings.data,
          },
          null,
          2,
        ),
        message: data.note?.trim() || "sync دستی محتوای سایت از پیشخوان",
      });
      return { ok: true as const, sha: commit.sha, url: commit.url };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  });

export const devopsDeployments = createServerFn({ method: "GET" }).handler(async () => {
  const s = await import("./devops.server");
  await s.assertAdminAccess();
  const cfg = await s.getDevopsConfig();
  try {
    const [deployments, urls] = await Promise.all([
      s.cfDeployments(cfg.cfProject, 5),
      s.cfProjectUrls(cfg.cfProject),
    ]);
    return { ok: true as const, deployments, urls };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
  }
});

export const devopsDeployLog = createServerFn({ method: "POST" })
  .inputValidator((data: { deploymentId: string }) => data)
  .handler(async ({ data }) => {
    const s = await import("./devops.server");
    await s.assertAdminAccess();
    const cfg = await s.getDevopsConfig();
    try {
      return { ok: true as const, lines: await s.cfDeploymentLog(cfg.cfProject, data.deploymentId) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  });

export const devopsTriggerDeploy = createServerFn({ method: "POST" }).handler(async () => {
  const s = await import("./devops.server");
  await s.assertAdminAccess();
  const cfg = await s.getDevopsConfig();
  try {
    const res = await s.cfTriggerDeploy(cfg.cfProject, cfg.branch || "main");
    return { ok: true as const, via: res.via };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
  }
});

export const devopsHealthCheck = createServerFn({ method: "POST" }).handler(async () => {
  const s = await import("./devops.server");
  await s.assertAdminAccess();
  const cfg = await s.getDevopsConfig();
  const items: HealthItem[] = [];
  const push = (key: string, label: string, ok: boolean, detail: string) =>
    items.push({ key, label, ok, detail });

  push(
    "github-secret",
    "کلید دسترسی گیت‌هاب (سمت سرور)",
    s.githubTokenAvailable(),
    s.githubTokenAvailable() ? "ثبت شده است." : "GITHUB_PAT یا GITHUB_API_KEY ثبت نشده است.",
  );
  push(
    "cf-secret",
    "توکن و شناسه حساب Cloudflare",
    s.cloudflareConfigured(),
    s.cloudflareConfigured()
      ? "ثبت شده است."
      : "CLOUDFLARE_API_TOKEN یا CLOUDFLARE_ACCOUNT_ID ثبت نشده است.",
  );
  push(
    "cf-hook",
    "Build Hook کلودفلر",
    s.buildHookConfigured(),
    s.buildHookConfigured()
      ? "ثبت شده است؛ deploy دستی از همین hook استفاده می‌کند."
      : "ثبت نشده؛ deploy دستی از API انجام می‌شود.",
  );

  let repo: RepoStatus | null = null;
  try {
    repo = await s.githubRepoStatus(cfg);
    push("repo", "دسترسی به مخزن", true, `${repo.fullName} • شاخه ${repo.branch}`);
  } catch (e) {
    push("repo", "دسترسی به مخزن", false, e instanceof Error ? e.message : String(e));
  }

  if (repo) {
    push(
      "branch-match",
      "هم‌خوانی شاخه پیکربندی با شاخه اصلی مخزن",
      repo.branch === repo.defaultBranch,
      repo.branch === repo.defaultBranch
        ? `هر دو ${repo.branch} هستند.`
        : `شاخه پیکربندی ${repo.branch} با شاخه اصلی ${repo.defaultBranch} یکسان نیست؛ احتمال عدم انتشار خودکار.`,
    );
    try {
      await s.ghApi(
        `repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(cfg.workflowPath)}?ref=${encodeURIComponent(cfg.branch)}`,
      );
      push("workflow", "فایل workflow انتشار خودکار", true, `${cfg.workflowPath} در مخزن موجود است.`);
    } catch {
      push(
        "workflow",
        "فایل workflow انتشار خودکار",
        false,
        `${cfg.workflowPath} در مخزن پیدا نشد؛ انتشار خودکار انجام نمی‌شود.`,
      );
    }
    try {
      const hooks = (await s.ghApi<Record<string, any>[]>(
        `repos/${cfg.owner}/${cfg.repo}/hooks`,
      )) as unknown as Record<string, any>[];
      const count = Array.isArray(hooks) ? hooks.length : 0;
      push(
        "webhook",
        "Webhook گیت‌هاب",
        count > 0,
        count > 0 ? `${count} webhook فعال است.` : "هیچ webhookی ثبت نشده است.",
      );
    } catch (e) {
      push(
        "webhook",
        "Webhook گیت‌هاب",
        false,
        `قابل بررسی نبود (نیاز به دسترسی admin:repo_hooks): ${e instanceof Error ? e.message : ""}`,
      );
    }
    try {
      const prs = (await s.ghApi<Record<string, any>[]>(
        `repos/${cfg.owner}/${cfg.repo}/pulls?state=open&per_page=20`,
      )) as unknown as Record<string, any>[];
      const dirty = (Array.isArray(prs) ? prs : []).filter(
        (p) => p["mergeable_state"] === "dirty",
      ).length;
      push(
        "conflict",
        "تضاد (conflict) در درخواست‌های باز",
        dirty === 0,
        dirty === 0
          ? `${Array.isArray(prs) ? prs.length : 0} درخواست باز و بدون تضاد.`
          : `${dirty} درخواست دارای تضاد است.`,
      );
    } catch {
      push("conflict", "تضاد (conflict) در درخواست‌های باز", true, "درخواست بازی یافت نشد.");
    }
  }

  let deployments: CfDeployment[] = [];
  try {
    deployments = await s.cfDeployments(cfg.cfProject, 1);
    const last = deployments[0];
    push(
      "deployment",
      "آخرین انتشار Cloudflare",
      last ? last.status !== "failed" : false,
      last ? `${last.status} • ${last.environment} • ${last.commitHash}` : "انتشاری یافت نشد.",
    );
  } catch (e) {
    push("deployment", "آخرین انتشار Cloudflare", false, e instanceof Error ? e.message : String(e));
  }

  return { items, healthy: items.every((i) => i.ok) };
});
