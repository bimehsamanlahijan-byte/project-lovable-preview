import { readPrivateSetting } from "./dashboard-auth.server-Q5OP7V4S.mjs";
import { GOOGLE_SA_SETTING } from "./ai-keys.server-c9zIs_V9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gsc.server-DB1SX6P6.js
/**
* Google Search Console automation (server-only).
*
* Uses a Google Cloud service-account JSON key (stored privately) to:
*   1. request a DNS/META verification token and verify ownership
*   2. add the site to Search Console
*   3. submit sitemap.xml
*   4. read the site's Google status (clicks, impressions, top queries, sitemaps)
* Signing is done with WebCrypto so it runs on Cloudflare Workers.
*/
var SCOPES = ["https://www.googleapis.com/auth/webmasters", "https://www.googleapis.com/auth/siteverification"].join(" ");
function b64url(input) {
	const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function pemToBuffer(pem) {
	const body = pem.replace(/-----[^-]+-----/g, "").replace(/\\n/g, "").replace(/\s+/g, "");
	const bin = atob(body);
	const buf = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
	return buf.buffer;
}
async function loadServiceAccount() {
	const raw = await readPrivateSetting(GOOGLE_SA_SETTING);
	if (!raw?.json) return null;
	try {
		const sa = JSON.parse(raw.json);
		return sa.client_email && sa.private_key ? sa : null;
	} catch {
		return null;
	}
}
async function accessToken(sa) {
	const now = Math.floor(Date.now() / 1e3);
	const header = b64url(JSON.stringify({
		alg: "RS256",
		typ: "JWT"
	}));
	const claim = b64url(JSON.stringify({
		iss: sa.client_email,
		scope: SCOPES,
		aud: "https://oauth2.googleapis.com/token",
		iat: now,
		exp: now + 3600
	}));
	const key = await crypto.subtle.importKey("pkcs8", pemToBuffer(sa.private_key), {
		name: "RSASSA-PKCS1-v1_5",
		hash: "SHA-256"
	}, false, ["sign"]);
	const jwt = `${header}.${claim}.${b64url(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`)))}`;
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: jwt
		})
	});
	const json = await res.json();
	if (!json.access_token) throw new Error(`ورود به گوگل ناموفق: ${json.error_description || res.status}`);
	return json.access_token;
}
async function g(token, method, url, body) {
	const res = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: body ? JSON.stringify(body) : void 0
	});
	const text = await res.text();
	let json = null;
	try {
		json = text ? JSON.parse(text) : null;
	} catch {}
	return {
		ok: res.ok,
		status: res.status,
		json,
		text: text.slice(0, 500)
	};
}
async function registerAndAnalyze(origin, sa) {
	const token = await accessToken(sa);
	const domain = origin.replace(/\/+$/, "");
	const host = new URL(domain).hostname;
	const siteUrl = `${domain}/`;
	const enc = encodeURIComponent(siteUrl);
	const steps = [];
	const rep = {
		domain,
		steps,
		topQueries: [],
		sitemaps: []
	};
	let verified = false;
	const meta = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/token", {
		site: {
			type: "SITE",
			identifier: siteUrl
		},
		verificationMethod: "META"
	});
	if (meta.ok) {
		verified = (await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=META", { site: {
			type: "SITE",
			identifier: siteUrl
		} })).ok;
		if (!verified) rep.verifyToken = String(meta.json?.token || "");
	}
	if (!verified) {
		const dns = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/token", {
			site: {
				type: "INET_DOMAIN",
				identifier: host
			},
			verificationMethod: "DNS_TXT"
		});
		if (dns.ok) {
			verified = (await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=DNS_TXT", { site: {
				type: "INET_DOMAIN",
				identifier: host
			} })).ok;
			if (!verified) rep.verifyToken = String(dns.json?.token || rep.verifyToken || "");
		}
	}
	steps.push({
		step: "تأیید مالکیت سایت",
		ok: verified,
		detail: verified ? "مالکیت تأیید شد." : `هنوز تأیید نشده. رکورد TXT زیر را در بخش DNS کلودفلر برای ${host} اضافه کنید و دوباره دکمه را بزنید.`
	});
	const add = await g(token, "PUT", `https://www.googleapis.com/webmasters/v3/sites/${enc}`);
	steps.push({
		step: "افزودن به سرچ کنسول",
		ok: add.ok,
		detail: add.ok ? "سایت اضافه شد." : `خطا ${add.status}: ${add.json?.error?.message || add.text}`
	});
	const sub = await g(token, "PUT", `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps/${encodeURIComponent(`${domain}/sitemap.xml`)}`);
	steps.push({
		step: "ارسال نقشه سایت",
		ok: sub.ok,
		detail: sub.ok ? `${domain}/sitemap.xml ارسال شد.` : `خطا ${sub.status}: ${sub.json?.error?.message || sub.text}`
	});
	const end = /* @__PURE__ */ new Date();
	const start = /* @__PURE__ */ new Date(end.getTime() - 24192e5);
	const d = (x) => x.toISOString().slice(0, 10);
	const total = await g(token, "POST", `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
		startDate: d(start),
		endDate: d(end)
	});
	const row = total.json?.rows?.[0];
	if (row) rep.stats = {
		clicks: row.clicks,
		impressions: row.impressions,
		ctr: row.ctr,
		position: row.position
	};
	rep.topQueries = ((await g(token, "POST", `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
		startDate: d(start),
		endDate: d(end),
		dimensions: ["query"],
		rowLimit: 15
	})).json?.rows ?? []).map((r) => ({
		query: r.keys?.[0] ?? "",
		clicks: r.clicks,
		impressions: r.impressions,
		position: r.position
	}));
	rep.sitemaps = ((await g(token, "GET", `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`)).json?.sitemap ?? []).map((s) => ({
		path: s.path,
		errors: Number(s.errors || 0),
		warnings: Number(s.warnings || 0),
		lastDownloaded: s.lastDownloaded
	}));
	steps.push({
		step: "خواندن وضعیت در گوگل",
		ok: total.ok,
		detail: total.ok ? "آمار ۲۸ روز اخیر خوانده شد." : `خطا ${total.status}: ${total.json?.error?.message || total.text}`
	});
	return rep;
}
//#endregion
export { loadServiceAccount, registerAndAnalyze };
