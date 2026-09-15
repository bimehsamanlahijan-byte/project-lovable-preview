/**
 * Local persistence for the third-party flow: customers and inquiries live in
 * our own database, independent from the SI24 tracking code.
 * All failures are non-fatal: the purchase flow keeps working even when the
 * tables are not created yet, but the problem is logged server-side.
 */
import { getSupabaseServiceKey, getSupabaseUrl, loadRuntimeEnv } from "@/lib/server-env";

async function db() {
  await loadRuntimeEnv();
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    console.error("[third-party] database credentials are not configured");
    return null;
  }
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type OwnerRecord = {
  nationalCode: string;
  mobile: string;
  birthDate: string;
  postalCode: string;
};

/** Finds an existing customer by national code, or creates a new one. */
export async function upsertCustomer(owner: OwnerRecord): Promise<string | null> {
  const client = await db();
  if (!client) return null;
  try {
    const { data: existing } = await client
      .from("third_party_customers")
      .select("customer_id")
      .eq("national_code", owner.nationalCode)
      .maybeSingle();

    if (existing?.customer_id) {
      await client
        .from("third_party_customers")
        .update({
          mobile: owner.mobile,
          birth_date: owner.birthDate,
          postal_code: owner.postalCode,
          updated_at: new Date().toISOString(),
        })
        .eq("customer_id", existing.customer_id);
      return existing.customer_id as string;
    }

    const { data, error } = await client
      .from("third_party_customers")
      .insert({
        national_code: owner.nationalCode,
        mobile: owner.mobile,
        birth_date: owner.birthDate,
        postal_code: owner.postalCode,
      })
      .select("customer_id")
      .single();
    if (error) throw error;
    return (data?.customer_id as string) ?? null;
  } catch (err) {
    console.error("[third-party] upsertCustomer failed", err);
    return null;
  }
}

/** Unique local reference code shown in the dashboard (independent from SI24). */
export function newReferenceCode(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TP-${stamp}-${rand}`;
}

/**
 * Records the attempt as soon as the customer submits the first step, so even
 * failed or abandoned purchases are visible in the dashboard.
 */
export async function createAttempt(params: {
  customerId: string | null;
  referenceCode: string;
  requestPayload: unknown;
}): Promise<string | null> {
  const client = await db();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("third_party_inquiries")
      .insert({
        customer_id: params.customerId,
        tracking_code: params.referenceCode,
        reference_code: params.referenceCode,
        status: "attempted",
        request_payload: params.requestPayload,
      })
      .select("inquiry_id")
      .single();
    if (error) throw error;
    return (data?.inquiry_id as string) ?? null;
  } catch (err) {
    console.error("[third-party] createAttempt failed", err);
    return null;
  }
}

/** Updates a row by its local reference code (used before SI24 answers). */
export async function updateAttempt(
  referenceCode: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const client = await db();
  if (!client) return;
  try {
    const { error } = await client
      .from("third_party_inquiries")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("reference_code", referenceCode);
    if (error) throw error;
  } catch (err) {
    console.error("[third-party] updateAttempt failed", err);
  }
}

export async function createInquiry(params: {
  customerId: string | null;
  trackingCode: string;
  requestPayload: unknown;
}): Promise<string | null> {
  const client = await db();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("third_party_inquiries")
      .insert({
        customer_id: params.customerId,
        tracking_code: params.trackingCode,
        status: "started",
        request_payload: params.requestPayload,
      })
      .select("inquiry_id")
      .single();
    if (error) throw error;
    return (data?.inquiry_id as string) ?? null;
  } catch (err) {
    console.error("[third-party] createInquiry failed", err);
    return null;
  }
}

export async function updateInquiry(
  trackingCode: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const client = await db();
  if (!client) return;
  try {
    const { error } = await client
      .from("third_party_inquiries")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("tracking_code", trackingCode);
    if (error) throw error;
  } catch (err) {
    console.error("[third-party] updateInquiry failed", err);
  }
}

export async function getInquiry(trackingCode: string) {
  const client = await db();
  if (!client) return null;
  try {
    const { data } = await client
      .from("third_party_inquiries")
      .select("*")
      .eq("tracking_code", trackingCode)
      .maybeSingle();
    return data;
  } catch (err) {
    console.error("[third-party] getInquiry failed", err);
    return null;
  }
}
