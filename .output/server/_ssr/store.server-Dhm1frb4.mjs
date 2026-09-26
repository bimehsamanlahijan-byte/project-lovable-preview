import { a as getSupabaseServiceKey, o as getSupabaseUrl, s as loadRuntimeEnv } from "./server-env-CcxwNfrB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-Dhm1frb4.js
/**
* Local persistence for the third-party flow: customers and inquiries live in
* our own database, independent from the SI24 tracking code.
* All failures are non-fatal: the purchase flow keeps working even when the
* tables are not created yet, but the problem is logged server-side.
*/
async function db() {
	await loadRuntimeEnv();
	const url = getSupabaseUrl();
	const key = getSupabaseServiceKey();
	if (!url || !key) {
		console.error("[third-party] database credentials are not configured");
		return null;
	}
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	return createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
/** Finds an existing customer by national code, or creates a new one. */
async function upsertCustomer(owner) {
	const client = await db();
	if (!client) return null;
	try {
		const { data: existing } = await client.from("third_party_customers").select("customer_id").eq("national_code", owner.nationalCode).maybeSingle();
		if (existing?.customer_id) {
			await client.from("third_party_customers").update({
				mobile: owner.mobile,
				birth_date: owner.birthDate,
				postal_code: owner.postalCode,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("customer_id", existing.customer_id);
			return existing.customer_id;
		}
		const { data, error } = await client.from("third_party_customers").insert({
			national_code: owner.nationalCode,
			mobile: owner.mobile,
			birth_date: owner.birthDate,
			postal_code: owner.postalCode
		}).select("customer_id").single();
		if (error) throw error;
		return data?.customer_id ?? null;
	} catch (err) {
		console.error("[third-party] upsertCustomer failed", err);
		return null;
	}
}
/** Unique local reference code shown in the dashboard (independent from SI24). */
function newReferenceCode() {
	return `TP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
/**
* Records the attempt as soon as the customer submits the first step, so even
* failed or abandoned purchases are visible in the dashboard.
*/
async function createAttempt(params) {
	const client = await db();
	if (!client) return null;
	try {
		const { data, error } = await client.from("third_party_inquiries").insert({
			customer_id: params.customerId,
			tracking_code: params.referenceCode,
			reference_code: params.referenceCode,
			status: "attempted",
			request_payload: params.requestPayload
		}).select("inquiry_id").single();
		if (error) throw error;
		return data?.inquiry_id ?? null;
	} catch (err) {
		console.error("[third-party] createAttempt failed", err);
		return null;
	}
}
/** Updates a row by its local reference code (used before SI24 answers). */
async function updateAttempt(referenceCode, patch) {
	const client = await db();
	if (!client) return;
	try {
		const { error } = await client.from("third_party_inquiries").update({
			...patch,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("reference_code", referenceCode);
		if (error) throw error;
	} catch (err) {
		console.error("[third-party] updateAttempt failed", err);
	}
}
async function updateInquiry(trackingCode, patch) {
	const client = await db();
	if (!client) return;
	try {
		const { error } = await client.from("third_party_inquiries").update({
			...patch,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("tracking_code", trackingCode);
		if (error) throw error;
	} catch (err) {
		console.error("[third-party] updateInquiry failed", err);
	}
}
async function getInquiry(trackingCode) {
	const client = await db();
	if (!client) return null;
	try {
		const { data } = await client.from("third_party_inquiries").select("*").eq("tracking_code", trackingCode).maybeSingle();
		return data;
	} catch (err) {
		console.error("[third-party] getInquiry failed", err);
		return null;
	}
}
//#endregion
export { createAttempt, getInquiry, newReferenceCode, updateAttempt, updateInquiry, upsertCustomer };
