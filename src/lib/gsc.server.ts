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
import { readPrivateSetting } from "./dashboard-auth.server";
import { GOOGLE_SA_SETTING } from "./ai-keys.server";

type ServiceAccount = { client_email: string; private_key: string };

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/siteverification",
].join(" ");

function b64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToBuffer(pem: string): ArrayBuffer {
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\\n/g, "").replace(/\s+/g, "");
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function loadServiceAccount(): Promise<ServiceAccount | null> {
  const raw = await readPrivateSetting<{ json: string }>(GOOGLE_SA_SETTING);
  if (!raw?.json) return null;
  try {
    const sa = JSON.parse(raw.json) as ServiceAccount;
    return sa.client_email && sa.private_key ? sa : null;
  } catch {
    return null;
  }
}

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({ iss: sa.client_email, scope: SCOPES, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }),
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`));
  const jwt = `${header}.${claim}.${b64url(sig)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const json = (await res.json()) as { access_token?: string; error_description?: string };
  if (!json.access_token) throw new Error(`ورود به گوگل ناموفق: ${json.error_description || res.status}`);
  return json.access_token;
}

async function g(token: string, method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }
  return { ok: res.ok, status: res.status, json, text: text.slice(0, 500) };
}

export type DomainReport = {
  domain: string;
  steps: { step: string; ok: boolean; detail: string }[];
  verifyToken?: string;
  stats?: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: { query: string; clicks: number; impressions: number; position: number }[];
  sitemaps: { path: string; errors: number; warnings: number; lastDownloaded?: string }[];
};

export async function registerAndAnalyze(origin: string, sa: ServiceAccount): Promise<DomainReport> {
  const token = await accessToken(sa);
  const domain = origin.replace(/\/+$/, "");
  const host = new URL(domain).hostname;
  const siteUrl = `${domain}/`;
  const enc = encodeURIComponent(siteUrl);
  const steps: DomainReport["steps"] = [];
  const rep: DomainReport = { domain, steps, topQueries: [], sitemaps: [] };

  // 1) Ownership verification (meta tag on the site, then DNS TXT as fallback).
  let verified = false;
  const meta = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/token", {
    site: { type: "SITE", identifier: siteUrl },
    verificationMethod: "META",
  });
  if (meta.ok) {
    const v = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=META", {
      site: { type: "SITE", identifier: siteUrl },
    });
    verified = v.ok;
    if (!verified) rep.verifyToken = String(meta.json?.token || "");
  }
  if (!verified) {
    const dns = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/token", {
      site: { type: "INET_DOMAIN", identifier: host },
      verificationMethod: "DNS_TXT",
    });
    if (dns.ok) {
      const v = await g(token, "POST", "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=DNS_TXT", {
        site: { type: "INET_DOMAIN", identifier: host },
      });
      verified = v.ok;
      if (!verified) rep.verifyToken = String(dns.json?.token || rep.verifyToken || "");
    }
  }
  steps.push({
    step: "تأیید مالکیت سایت",
    ok: verified,
    detail: verified
      ? "مالکیت تأیید شد."
      : `هنوز تأیید نشده. رکورد TXT زیر را در بخش DNS کلودفلر برای ${host} اضافه کنید و دوباره دکمه را بزنید.`,
  });

  // 2) Add to Search Console.
  const add = await g(token, "PUT", `https://www.googleapis.com/webmasters/v3/sites/${enc}`);
  steps.push({ step: "افزودن به سرچ کنسول", ok: add.ok, detail: add.ok ? "سایت اضافه شد." : `خطا ${add.status}: ${add.json?.error?.message || add.text}` });

  // 3) Submit sitemap.
  const sm = encodeURIComponent(`${domain}/sitemap.xml`);
  const sub = await g(token, "PUT", `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps/${sm}`);
  steps.push({ step: "ارسال نقشه سایت", ok: sub.ok, detail: sub.ok ? `${domain}/sitemap.xml ارسال شد.` : `خطا ${sub.status}: ${sub.json?.error?.message || sub.text}` });

  // 4) Read status.
  const end = new Date();
  const start = new Date(end.getTime() - 28 * 86400_000);
  const d = (x: Date) => x.toISOString().slice(0, 10);
  const total = await g(token, "POST", `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    startDate: d(start),
    endDate: d(end),
  });
  const row = total.json?.rows?.[0];
  if (row) rep.stats = { clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position };
  const q = await g(token, "POST", `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    startDate: d(start),
    endDate: d(end),
    dimensions: ["query"],
    rowLimit: 15,
  });
  rep.topQueries = (q.json?.rows ?? []).map((r: any) => ({
    query: r.keys?.[0] ?? "",
    clicks: r.clicks,
    impressions: r.impressions,
    position: r.position,
  }));
  const maps = await g(token, "GET", `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`);
  rep.sitemaps = (maps.json?.sitemap ?? []).map((s: any) => ({
    path: s.path,
    errors: Number(s.errors || 0),
    warnings: Number(s.warnings || 0),
    lastDownloaded: s.lastDownloaded,
  }));
  steps.push({
    step: "خواندن وضعیت در گوگل",
    ok: total.ok,
    detail: total.ok ? "آمار ۲۸ روز اخیر خوانده شد." : `خطا ${total.status}: ${total.json?.error?.message || total.text}`,
  });
  return rep;
}
