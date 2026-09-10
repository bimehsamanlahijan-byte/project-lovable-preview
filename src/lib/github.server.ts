const API_BASE = "https://api.github.com";

export type GithubAccount = {
  id: string;
  label: string;
  secretName: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  isDefault: boolean;
};

function token(secretName: string) {
  const value = process.env[secretName] || process.env["GITHUB_API_KEY"];
  if (!value) throw new Error(`GITHUB_TOKEN_MISSING:${secretName}`);
  return value;
}

export async function githubFetch(
  secretName: string,
  path: string,
  init: { method?: string; body?: unknown } = {},
) {
  const accessToken = token(secretName);
  const res = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
    method: init.method ?? "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "azarakhsh-dashboard",
    },
    ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[github] ${res.status} ${path}: ${text}`);
    throw new Error(`GITHUB_${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? (JSON.parse(text) as Record<string, unknown>) : {};
}

/** Base64 that also works for multi-byte Persian content. */
function toBase64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export async function githubWhoAmI(secretName: string) {
  const me = await githubFetch(secretName, "user");
  return { login: String(me["login"] ?? ""), name: String(me["name"] ?? "") };
}

export async function githubCommitFile(args: {
  secretName: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
}) {
  const { secretName, owner, repo, branch, path } = args;
  const target = `repos/${owner}/${repo}/contents/${encodeURI(path)}`;

  let sha: string | undefined;
  try {
    const existing = await githubFetch(secretName, `${target}?ref=${encodeURIComponent(branch)}`);
    const found = existing["sha"];
    if (typeof found === "string") sha = found;
  } catch {
    sha = undefined; // first publish: the file does not exist yet
  }

  const res = await githubFetch(secretName, target, {
    method: "PUT",
    body: {
      message: args.message,
      content: toBase64(args.content),
      branch,
      ...(sha ? { sha } : {}),
    },
  });
  const commit = (res["commit"] ?? {}) as Record<string, unknown>;
  return {
    sha: String(commit["sha"] ?? ""),
    url: String(commit["html_url"] ?? ""),
  };
}
