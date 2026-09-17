/** Browser-side API client — talks only to our own backend, never to SI24 directly. */
import type { LookupItem, QuoteData } from "./types";

export type ApiError = { ok: false; message: string; status: number; referenceCode?: string | null };

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw { ok: false, status: 0, message: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید." } as ApiError;
  }
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok || body?.ok === false) {
    throw {
      ok: false,
      status: res.status,
      message: body?.message ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
      referenceCode: body?.referenceCode ?? null,
    } as ApiError;
  }
  return body as T;
}

function normalizeList(raw: any): LookupItem[] {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => ({
      id: item?.id ?? item?.value ?? item?.code ?? item?.key,
      title: item?.title ?? item?.name ?? item?.label ?? item?.persianName ?? String(item?.value ?? ""),
    }))
    .filter((item: LookupItem) => item.id !== undefined && item.id !== null);
}

export async function fetchLookup(name: string, search?: string): Promise<LookupItem[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await call<{ ok: true; data: unknown }>(`/api/third-party/lookups/${name}${query}`);
  return normalizeList(res.data);
}

export function fetchVehicleKinds(brandId: string | number) {
  return fetchLookup(`carBrand/${brandId}/kinds`);
}

export async function startInquiry(payload: unknown) {
  return call<{
    ok: true;
    trackingCode: string;
    referenceCode: string | null;
    customerId: string | null;
    inquiryId: string | null;
  }>(
    "/api/third-party/start",
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export async function calculatePrice(trackingCode: string, manualData: unknown) {
  return call<{ ok: true; data: any }>(
    `/api/third-party/${encodeURIComponent(trackingCode)}/calculate-price`,
    { method: "POST", body: JSON.stringify({ manualData }) },
  );
}

export async function fetchSummary(trackingCode: string) {
  return call<{ ok: true; data: any; stale?: boolean }>(
    `/api/third-party/${encodeURIComponent(trackingCode)}/summary`,
  );
}

/** Picks the price fields the reference widget displays. */
export function extractQuote(...sources: any[]): QuoteData {
  const out: QuoteData = {};
  const pick = (obj: any, key: keyof QuoteData) => {
    if (out[key] !== undefined) return;
    const value = obj?.[key] ?? obj?.quote?.[key] ?? obj?.payment?.[key] ?? obj?.data?.[key];
    if (typeof value === "number") out[key] = value;
  };
  for (const source of sources) {
    if (!source) continue;
    pick(source, "premium");
    pick(source, "discount");
    pick(source, "premiumAfterDiscount");
    pick(source, "walletCredit");
    pick(source, "payableAmount");
    if (out.premiumAmount === undefined) {
      const amount = source?.quote?.premiumAmount ?? source?.data?.quote?.premiumAmount;
      if (typeof amount === "number") out.premiumAmount = amount;
    }
  }
  return out;
}
