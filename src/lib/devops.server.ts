import { getRequestHeader } from "@tanstack/react-start/server";
import { requireUnlocked, readPrivateSetting, writePrivateSetting } from "./dashboard-auth.server";

export type DevopsConfig = {
  owner: string;
  repo: string;
  branch: string;
  snapshotPath: string;
  cfProject: string;
  workflowPath: string;
};

export const DEFAULT_DEVOPS: DevopsConfig = {
  owner: "",
  repo: "",
  branch: "main",
  snapshotPath: "lovable/site-content.json",
  cfProject: "azarakhsh-saman",
  workflowPath: ".github/workflows/deploy-cloudflare.yml",
};

const DEVOPS_KEY = "devops_config";

export async function getDevopsConfig(): Promise<DevopsConfig> {
  const stored = await readPrivateSetting<Partial<DevopsConfig>>(DEVOPS_KEY);
  return { ...DEFAULT_DEVOPS, ...(stored ?? {}) };
}

export async function saveDevopsConfig(patch: Partial<DevopsConfig>) {
  const next = { ...(await getDevopsConfig()), ...patch };
  const res = await writePrivateSetting(DEVOPS_KEY, next);
  return { config: next, error: res.error };
}

/**
 * Dashboard access gate. The unlock cookie is always required. When the caller
 * also carries a Supabase session, that user must additionally hold the `admin`
 * role (checked through the security-definer has_role function).
 */
export async function assertAdminAccess(): Promise<void> {
  await requireUnlocked();
  const auth = getRequestHeader("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return;
  const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
  const supabaseAdmin = await getSupabaseAdmin();
  const { data } = await supabaseAdmin.auth.getUser(token);
  const userId = data.user?.id;
  if (!userId) return;
  const { data: isAdmin } = await supabaseAdmin.rpc("has_role" as never, {
    _user_id: userId,
    _role: "admin",
  } as never);
  if (!isAdmin) throw new Error("FORBIDDEN_NOT_ADMIN");
}

/* ---------------- GitHub ---------------- */

export function githubTokenAvailable() {
  return Boolean(
    process.env["GITHUB_PAT"] || process.env["GITHUB_TOKEN"] || process.env["GITHUB_API_KEY"],
  );
}

/** Calls the GitHub REST API with a server-side PAT, or the Lovable connector as a fallback. */
export async function ghApi<T = Record<string, unknown>>(path: string): Promise<T> {
  const pat = process.env["GITHUB_PAT"] || process.env["GITHUB_TOKEN"];
  if (pat) {
    const res = await fetch(`https://api.github.com/${path.replace(/^\//, "")}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${pat}`,
        "User-Agent": "azarakhsh-dashboard",
      },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`GITHUB_${res.status}: ${text.slice(0, 300)}`);
    return (text ? JSON.parse(text) : {}) as T;
  }
  const { githubFetch } = await import("./github.server");
  return (await githubFetch("GITHUB_API_KEY", path)) as T;
}

export type RepoStatus = {
  fullName: string;
  defaultBranch: string;
  branch: string;
  private: boolean;
  htmlUrl: string;
  commit: { sha: string; message: string; author: string; date: string; url: string } | null;
};

export async function githubRepoStatus(cfg: DevopsConfig): Promise<RepoStatus> {
  const repo = await ghApi<Record<string, any>>(`repos/${cfg.owner}/${cfg.repo}`);
  const branch = cfg.branch || String(repo["default_branch"] ?? "main");
  let commit: RepoStatus["commit"] = null;
  try {
    const b = await ghApi<Record<string, any>>(
      `repos/${cfg.owner}/${cfg.repo}/branches/${encodeURIComponent(branch)}`,
    );
    const c = b["commit"] ?? {};
    commit = {
      sha: String(c["sha"] ?? ""),
      message: String(c["commit"]?.message ?? ""),
      author: String(c["commit"]?.author?.name ?? ""),
      date: String(c["commit"]?.author?.date ?? ""),
      url: String(c["html_url"] ?? ""),
    };
  } catch {
    commit = null;
  }
  return {
    fullName: String(repo["full_name"] ?? `${cfg.owner}/${cfg.repo}`),
    defaultBranch: String(repo["default_branch"] ?? "main"),
    branch,
    private: Boolean(repo["private"]),
    htmlUrl: String(repo["html_url"] ?? ""),
    commit,
  };
}

/* ---------------- Cloudflare Pages ---------------- */

function cfCreds() {
  const token = process.env["CLOUDFLARE_API_TOKEN"];
  const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"];
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN_MISSING");
  if (!accountId) throw new Error("CLOUDFLARE_ACCOUNT_ID_MISSING");
  return { token, accountId };
}

export function cloudflareConfigured() {
  return Boolean(process.env["CLOUDFLARE_API_TOKEN"] && process.env["CLOUDFLARE_ACCOUNT_ID"]);
}

export function buildHookConfigured() {
  return Boolean(process.env["CLOUDFLARE_BUILD_HOOK_URL"]);
}

async function cfApi<T = any>(path: string, init: { method?: string; body?: unknown } = {}) {
  const { token, accountId } = cfCreds();
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/${path.replace(/^\//, "")}`,
    {
      method: init.method ?? "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
    },
  );
  const json = (await res.json().catch(() => ({}))) as Record<string, any>;
  if (!res.ok || json["success"] === false) {
    const msg = json["errors"]?.[0]?.message ?? `CLOUDFLARE_${res.status}`;
    throw new Error(String(msg));
  }
  return json["result"] as T;
}

export type CfDeployment = {
  id: string;
  status: "success" | "failed" | "building" | "queued" | "unknown";
  environment: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  createdAt: string;
  url: string;
};

function mapStatus(d: Record<string, any>): CfDeployment["status"] {
  const stage = d["latest_stage"] ?? {};
  const status = String(stage["status"] ?? "");
  if (status === "success" && String(stage["name"]) === "deploy") return "success";
  if (status === "failure" || status === "canceled") return "failed";
  if (status === "active" || status === "running") return "building";
  if (status === "idle" || status === "queued") return "queued";
  return status === "success" ? "building" : "unknown";
}

export async function cfDeployments(project: string, limit = 5) {
  const list = await cfApi<Record<string, any>[]>(
    `pages/projects/${encodeURIComponent(project)}/deployments?per_page=${limit}`,
  );
  return (list ?? []).slice(0, limit).map<CfDeployment>((d) => ({
    id: String(d["id"] ?? ""),
    status: mapStatus(d),
    environment: String(d["environment"] ?? ""),
    branch: String(d["deployment_trigger"]?.metadata?.branch ?? ""),
    commitHash: String(d["deployment_trigger"]?.metadata?.commit_hash ?? "").slice(0, 7),
    commitMessage: String(d["deployment_trigger"]?.metadata?.commit_message ?? ""),
    createdAt: String(d["created_on"] ?? ""),
    url: String(d["url"] ?? ""),
  }));
}

export async function cfProjectUrls(project: string) {
  const p = await cfApi<Record<string, any>>(`pages/projects/${encodeURIComponent(project)}`);
  const domains: string[] = (p["domains"] ?? []) as string[];
  return {
    production: domains[0] ? `https://${domains[0]}` : String(p["subdomain"] ? `https://${p["subdomain"]}` : ""),
    preview: String(p["subdomain"] ? `https://${p["subdomain"]}` : ""),
    domains,
    productionBranch: String(p["production_branch"] ?? "main"),
  };
}

export async function cfDeploymentLog(project: string, deploymentId: string) {
  const res = await cfApi<Record<string, any>>(
    `pages/projects/${encodeURIComponent(project)}/deployments/${deploymentId}/history/logs`,
  );
  const lines: string[] = ((res?.["data"] ?? []) as Record<string, any>[]).map(
    (l) => `${String(l["ts"] ?? "").slice(11, 19)}  ${String(l["line"] ?? "")}`,
  );
  return lines;
}

export async function cfTriggerDeploy(project: string, branch: string) {
  const hook = process.env["CLOUDFLARE_BUILD_HOOK_URL"];
  if (hook) {
    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) throw new Error(`BUILD_HOOK_${res.status}`);
    return { via: "build-hook" as const };
  }
  await cfApi(`pages/projects/${encodeURIComponent(project)}/deployments`, {
    method: "POST",
    body: { branch },
  });
  return { via: "api" as const };
}
