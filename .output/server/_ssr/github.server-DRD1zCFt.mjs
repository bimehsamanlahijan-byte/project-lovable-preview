//#region node_modules/.nitro/vite/services/ssr/assets/github.server-DRD1zCFt.js
var API_BASE = "https://api.github.com";
function token(secretName) {
	const value = process.env[secretName] || process.env["GITHUB_API_KEY"] || process.env["GITHUB_ACCESS_TOKEN"] || process.env["GITHUB_PAT"] || process.env["GITHUB_TOKEN"];
	if (!value) throw new Error(`GITHUB_TOKEN_MISSING:${secretName}`);
	return value;
}
async function githubFetch(secretName, path, init = {}) {
	const accessToken = token(secretName);
	const res = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
		method: init.method ?? "GET",
		headers: {
			Accept: "application/vnd.github+json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"User-Agent": "azarakhsh-dashboard"
		},
		...init.body === void 0 ? {} : { body: JSON.stringify(init.body) }
	});
	const text = await res.text();
	if (!res.ok) {
		console.error(`[github] ${res.status} ${path}: ${text}`);
		throw new Error(`GITHUB_${res.status}: ${text.slice(0, 400)}`);
	}
	return text ? JSON.parse(text) : {};
}
/** Base64 that also works for multi-byte Persian content. */
function toBase64(input) {
	const bytes = new TextEncoder().encode(input);
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary);
}
async function githubWhoAmI(secretName) {
	const me = await githubFetch(secretName, "user");
	return {
		login: String(me["login"] ?? ""),
		name: String(me["name"] ?? "")
	};
}
async function githubCommitFile(args) {
	const { secretName, owner, repo, branch, path } = args;
	const target = `repos/${owner}/${repo}/contents/${encodeURI(path)}`;
	/** Current blob sha of the file, or undefined when it does not exist yet. */
	const readSha = async () => {
		try {
			const found = (await githubFetch(secretName, `${target}?ref=${encodeURIComponent(branch)}`))["sha"];
			return typeof found === "string" ? found : void 0;
		} catch {
			return;
		}
	};
	let sha = await readSha();
	let lastError;
	for (let attempt = 0; attempt < 3; attempt++) try {
		const commit = (await githubFetch(secretName, target, {
			method: "PUT",
			body: {
				message: args.message,
				content: toBase64(args.content),
				branch,
				...sha ? { sha } : {}
			}
		}))["commit"] ?? {};
		return {
			sha: String(commit["sha"] ?? ""),
			url: String(commit["html_url"] ?? "")
		};
	} catch (err) {
		lastError = err;
		const msg = err instanceof Error ? err.message : String(err);
		if (!(msg.includes("GITHUB_409") || msg.includes("GITHUB_422"))) throw err;
		await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
		sha = await readSha();
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("GITHUB_CONFLICT: ذخیره در گیت‌هاب به دلیل تداخل نسخه‌ها انجام نشد.");
}
//#endregion
export { githubCommitFile, githubWhoAmI };
