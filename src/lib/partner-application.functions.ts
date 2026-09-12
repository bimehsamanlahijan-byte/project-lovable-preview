import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  "";

type PartnerApplicationInput = {
  fullname: string;
  birth_date: string;
  national_id: string;
  province: string;
  city: string;
  mobile: string;
  insurance_experience: string;
  type_cooperation: string;
  company_name: string;
  description: string;
  hp_field: string;
  page_url: string;
  referrer: string;
};

function clean(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function isValidIranianMobile(value: string) {
  return /^09\d{9}$/.test(value);
}

function isValidNationalId(value: string) {
  return /^\d{10}$/.test(value);
}

function originFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-host");
  const host = forwarded || request.headers.get("host") || "bimehsaman8452.ir";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export const submitPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: PartnerApplicationInput) => input)
  .handler(async ({ data }) => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error("Partner application: Supabase server credentials are missing.");
      return {
        ok: false as const,
        message: "سامانه ثبت درخواست هنوز پیکربندی نشده است.",
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
      description: clean(data.description, 2000),
      hp_field: clean(data.hp_field, 100),
      page_url: clean(data.page_url, 1000),
      referrer: clean(data.referrer, 1000),
    };

    // Honeypot: bots that fill the hidden field are silently accepted.
    if (input.hp_field) {
      return {
        ok: true as const,
        requestKey: "accepted",
      };
    }

    if (
      !input.fullname ||
      !input.birth_date ||
      !input.national_id ||
      !input.province ||
      !input.city ||
      !input.mobile ||
      !input.insurance_experience
    ) {
      return {
        ok: false as const,
        message: "لطفاً تمام فیلدهای الزامی را تکمیل کنید.",
      };
    }

    if (!isValidIranianMobile(input.mobile)) {
      return { ok: false as const, message: "شماره همراه معتبر نیست." };
    }

    if (!isValidNationalId(input.national_id)) {
      return { ok: false as const, message: "کد ملی معتبر نیست." };
    }

    if (
      input.insurance_experience === "دارم" &&
      (!input.type_cooperation || !input.company_name)
    ) {
      return {
        ok: false as const,
        message: "لطفاً اطلاعات سابقه همکاری را تکمیل کنید.",
      };
    }

    const request = getRequest();
    const requestKey = crypto.randomUUID();
    const origin = originFromRequest(request);

    const payload = {
      request_key: requestKey,
      form_nonce: crypto.randomUUID(),
      current_post_id: null,
      fullname: input.fullname,
      birth_date: input.birth_date,
      national_id: input.national_id,
      province: input.province,
      city: input.city,
      mobile: input.mobile,
      insurance_experience: input.insurance_experience,
      type_cooperation: input.type_cooperation || null,
      company_name: input.company_name || null,
      description: input.description || null,
      page_url: input.page_url || `${origin}/partners/apply`,
      referrer: input.referrer || null,
      user_agent: request.headers.get("user-agent"),
      ip_hash: null,
      status: "new",
    };

    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/partner_applications`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Partner application insert failed:", response.status, detail);
      return {
        ok: false as const,
        message: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.",
      };
    }

    return {
      ok: true as const,
      requestKey,
    };
  });
