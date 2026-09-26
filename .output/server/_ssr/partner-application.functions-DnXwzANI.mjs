import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as getRequest } from "./request-response-DrMnHfig.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partner-application.functions-DnXwzANI.js
var SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
var SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY || "";
function clean(value, max = 2e3) {
	return String(value ?? "").trim().slice(0, max);
}
function isValidIranianMobile(value) {
	return /^09\d{9}$/.test(value);
}
function isValidNationalId(value) {
	return /^\d{10}$/.test(value);
}
function originFromRequest(request) {
	const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "bimehsaman8452.ir";
	return `${request.headers.get("x-forwarded-proto") || "https"}://${host}`;
}
var submitPartnerApplication_createServerFn_handler = createServerRpc({
	id: "c303e12887aa9f1ab207481ed38b4308ca02c7f6f88f40eb2b640210a239f9ee",
	name: "submitPartnerApplication",
	filename: "src/lib/partner-application.functions.ts"
}, (opts) => submitPartnerApplication.__executeServer(opts));
var submitPartnerApplication = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(submitPartnerApplication_createServerFn_handler, async ({ data }) => {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		console.error("Partner application: Supabase server credentials are missing.");
		return {
			ok: false,
			message: "سامانه ثبت درخواست هنوز پیکربندی نشده است."
		};
	}
	const input = {
		fullname: clean(data.fullname, 120),
		birth_date: clean(data.birth_date, 32),
		national_id: clean(data.national_id, 10),
		province: clean(data.province, 100),
		city: clean(data.city, 100),
		mobile: clean(data.mobile, 11),
		insurance_experience: clean(data.insurance_experience, 32),
		type_cooperation: clean(data.type_cooperation, 64),
		company_name: clean(data.company_name, 160),
		description: clean(data.description, 2e3),
		hp_field: clean(data.hp_field, 100),
		page_url: clean(data.page_url, 1e3),
		referrer: clean(data.referrer, 1e3)
	};
	if (input.hp_field) return {
		ok: true,
		requestKey: "accepted"
	};
	if (!input.fullname || !input.birth_date || !input.national_id || !input.province || !input.city || !input.mobile || !input.insurance_experience) return {
		ok: false,
		message: "لطفاً تمام فیلدهای الزامی را تکمیل کنید."
	};
	if (!isValidIranianMobile(input.mobile)) return {
		ok: false,
		message: "شماره همراه معتبر نیست."
	};
	if (!isValidNationalId(input.national_id)) return {
		ok: false,
		message: "کد ملی معتبر نیست."
	};
	if (input.insurance_experience === "دارم" && (!input.type_cooperation || !input.company_name)) return {
		ok: false,
		message: "لطفاً اطلاعات سابقه همکاری را تکمیل کنید."
	};
	const request = getRequest();
	const requestKey = crypto.randomUUID();
	const origin = originFromRequest(request);
	const now = /* @__PURE__ */ new Date();
	`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
	const { partnerApplicantCode } = await import("./partner-code-eZI_lnL0.mjs");
	const applicantId = partnerApplicantCode(requestKey, now);
	const payload = {
		applicant_id: applicantId,
		request_key: requestKey,
		form_nonce: crypto.randomUUID(),
		current_post_id: null,
		full_name: input.fullname,
		national_id: input.national_id,
		birth_year: input.birth_date.slice(0, 4),
		gender: "male",
		phone: input.mobile,
		email: "",
		province: input.province,
		city: input.city,
		address: "",
		education: "",
		field_of_study: "",
		experience: input.insurance_experience,
		insurance_license: "no",
		cooperation_type: input.type_cooperation || "",
		branches: [],
		monthly_target: "",
		description: input.description || "",
		fullname: input.fullname,
		birth_date: input.birth_date,
		mobile: input.mobile,
		insurance_experience: input.insurance_experience,
		type_cooperation: input.type_cooperation || null,
		company_name: input.company_name || null,
		page_url: input.page_url || `${origin}/partners/apply`,
		referrer: input.referrer || null,
		user_agent: request.headers.get("user-agent"),
		ip_hash: null,
		status: "new"
	};
	const headers = {
		apikey: SUPABASE_SERVICE_KEY,
		...SUPABASE_SERVICE_KEY.startsWith("sb_") ? {} : { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
		"Content-Type": "application/json",
		Prefer: "return=minimal"
	};
	const body = { ...payload };
	let lastDetail = "";
	let inserted = false;
	for (let attempt = 0; attempt < 30; attempt += 1) {
		const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/partner_applications`, {
			method: "POST",
			headers,
			body: JSON.stringify(body)
		});
		if (response.ok) {
			inserted = true;
			break;
		}
		lastDetail = await response.text().catch(() => "");
		const unknownColumn = lastDetail.match(/Could not find the '([^']+)' column/)?.[1];
		if (unknownColumn && unknownColumn in body) {
			delete body[unknownColumn];
			continue;
		}
		const missingColumn = lastDetail.match(/null value in column \\?"([^"\\]+)\\?"/)?.[1];
		if (missingColumn && !body[missingColumn]) {
			body[missingColumn] = /(key|nonce|uuid)$/.test(missingColumn) ? crypto.randomUUID() : "-";
			continue;
		}
		break;
	}
	if (!inserted) {
		console.error("Partner application insert failed:", lastDetail);
		return {
			ok: false,
			message: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید."
		};
	}
	return {
		ok: true,
		requestKey: applicantId,
		applicantId
	};
});
//#endregion
export { submitPartnerApplication_createServerFn_handler };
