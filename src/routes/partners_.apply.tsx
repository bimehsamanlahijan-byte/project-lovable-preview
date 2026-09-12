import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { submitPartnerApplication } from "@/lib/partner-application.functions";

type Status = "idle" | "sending" | "success" | "error";

type FormState = {
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
};

export const Route = createFileRoute("/partners_/apply")({
  head: () => ({
    meta: [
      { title: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲" },
      {
        name: "description",
        content:
          "فرم درخواست همکاری در فروش و عضویت در تیم ۸۴۵۲ بیمه سامان.",
      },
      { property: "og:title", content: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲" },
      {
        property: "og:description",
        content: "ثبت درخواست عضویت و همکاری در فروش با تیم ۸۴۵۲ بیمه سامان.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PartnerApplyPage,
});

function PartnerApplyPage() {
  const [form, setForm] = useState<FormState>({
    fullname: "",
    birth_date: "",
    national_id: "",
    province: "",
    city: "",
    mobile: "",
    insurance_experience: "",
    type_cooperation: "",
    company_name: "",
    description: "",
    hp_field: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const [citiesData, setCitiesData] = useState<{
    provinces: Record<string, string>;
    cities: Record<string, string[]>;
  }>({ provinces: {}, cities: {} });

  useEffect(() => {
    let alive = true;
    fetch("/data/iran-cities.json")
      .then((r) => r.json())
      .then((data) => {
        if (alive) setCitiesData(data);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const scriptId = "local-jalali-datepicker";
    if (document.getElementById(scriptId)) {
      try {
        (window as any).jalaliDatepicker?.startWatch({
          selector: "[data-jdp]",
          autoShow: false,
          showTodayBtn: true,
          showEmptyBtn: true,
        });
      } catch {
        // Datepicker is an enhancement; text input remains usable.
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "/js/jalalidatepicker.min.js";
    script.onload = () => {
      try {
        (window as any).jalaliDatepicker?.startWatch({
          selector: "[data-jdp]",
          autoShow: false,
          showTodayBtn: true,
          showEmptyBtn: true,
        });
      } catch {
        // no-op
      }
    };
    document.body.appendChild(script);
  }, []);

  const provinceOptions = useMemo(
    () =>
      Object.entries(citiesData.provinces).map(([value, label]) => ({
        value,
        label,
      })),
    [citiesData],
  );

  const cityOptions = form.province
    ? citiesData.cities[form.province] ?? []
    : [];

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setMessage("");
      if (status !== "idle") setStatus("idle");
    };

  const validate = () => {
    if (!form.fullname.trim()) return "نام و نام خانوادگی را وارد کنید.";
    if (!/^[\u0600-\u06FF\s]+$/.test(form.fullname.trim())) return "نام و نام خانوادگی باید فارسی باشد.";
    if (!/^\d{10}$/.test(form.national_id.trim())) return "کد ملی باید ۱۰ رقم باشد.";
    if (!/^09\d{9}$/.test(form.mobile.trim())) return "شماره همراه معتبر نیست.";
    if (!form.birth_date.trim()) return "تاریخ تولد را وارد کنید.";
    if (!form.province) return "استان را انتخاب کنید.";
    if (!form.city) return "شهر را انتخاب کنید.";
    if (!form.insurance_experience) return "سابقه همکاری در صنعت بیمه را مشخص کنید.";
    if (form.insurance_experience === "دارم" && !form.type_cooperation) return "نوع سابقه را انتخاب کنید.";
    if (form.insurance_experience === "دارم" && !form.company_name.trim()) return "نام شرکت را وارد کنید.";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      setStatus("error");
      setMessage(validation);
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const result = await submitPartnerApplication({
        data: {
          ...form,
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        },
      });

      if (!result.ok) {
        setStatus("error");
        setMessage(result.message || "ثبت درخواست ناموفق بود. دوباره تلاش کنید.");
        return;
      }

      setStatus("success");
      setMessage(
        `درخواست شما با موفقیت ثبت شد. کد پیگیری: ${result.requestKey}`,
      );
      setForm({
        fullname: "",
        birth_date: "",
        national_id: "",
        province: "",
        city: "",
        mobile: "",
        insurance_experience: "",
        type_cooperation: "",
        company_name: "",
        description: "",
        hp_field: "",
      });
    } catch {
      setStatus("error");
      setMessage("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-5 text-sm text-muted-foreground">
            <a href="/partners" className="hover:text-primary">
              همکاران تیم ۸۴۵۲
            </a>
            <span className="mx-2">/</span>
            <span>درخواست همکاری</span>
          </nav>

          <h1 className="text-center text-3xl md:text-4xl font-extrabold">
            درخواست نمایندگی بیمه سامان
          </h1>

          <div className="mt-12">
            <div className="mx-auto w-fit rounded-tr-3xl bg-primary px-5 py-3 font-bold text-primary-foreground">
              فرم درخواست نمایندگی
            </div>

            <div className="rounded-3xl bg-muted p-4 md:p-6 shadow-elegant">
              <form
                onSubmit={submit}
                className="flex w-full flex-col gap-5 rounded-3xl bg-muted p-2 md:p-4"
                dir="rtl"
                noValidate
              >
                <input
                  type="text"
                  name="hp_field"
                  value={form.hp_field}
                  onChange={update("hp_field")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field required>
                    <input
                      className="partner-input"
                      value={form.fullname}
                      onChange={update("fullname")}
                      placeholder="نام و نام خانوادگی *"
                      autoComplete="name"
                    />
                  </Field>

                  <Field required>
                    <input
                      className="partner-input"
                      value={form.birth_date}
                      onChange={update("birth_date")}
                      placeholder="تاریخ تولد *"
                      data-jdp
                      readOnly
                      inputMode="numeric"
                    />
                  </Field>
                </div>

                <Field required>
                  <input
                    className="partner-input"
                    value={form.national_id}
                    onChange={update("national_id")}
                    placeholder="کد ملی *"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field required>
                    <select
                      className="partner-input"
                      value={form.province}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          province: e.target.value,
                          city: "",
                        }))
                      }
                    >
                      <option value="">انتخاب استان</option>
                      {provinceOptions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field required>
                    <select
                      className="partner-input"
                      value={form.city}
                      onChange={update("city")}
                      disabled={!form.province}
                    >
                      <option value="">انتخاب شهر</option>
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field required>
                    <input
                      className="partner-input"
                      value={form.mobile}
                      onChange={update("mobile")}
                      placeholder="شماره همراه *"
                      inputMode="tel"
                      maxLength={11}
                      autoComplete="tel"
                    />
                  </Field>

                  <Field required>
                    <select
                      className="partner-input"
                      value={form.insurance_experience}
                      onChange={update("insurance_experience")}
                    >
                      <option value="">سابقه همکاری در صنعت بیمه *</option>
                      <option value="دارم">دارم</option>
                      <option value="ندارم">ندارم</option>
                    </select>
                  </Field>
                </div>

                {form.insurance_experience === "دارم" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field required>
                      <select
                        className="partner-input"
                        value={form.type_cooperation}
                        onChange={update("type_cooperation")}
                      >
                        <option value="">نوع سابقه *</option>
                        <option value="فروش">فروش</option>
                        <option value="سایر">سایر</option>
                      </select>
                    </Field>

                    <Field required>
                      <input
                        className="partner-input"
                        value={form.company_name}
                        onChange={update("company_name")}
                        placeholder="نام شرکت *"
                      />
                    </Field>
                  </div>
                )}

                <Field>
                  <textarea
                    className="partner-input min-h-32 resize-y"
                    value={form.description}
                    onChange={update("description")}
                    placeholder="توضیحات (اختیاری)"
                  />
                </Field>

                {message && (
                  <div
                    className={`rounded-xl px-4 py-3 text-center text-sm ${
                      status === "success"
                        ? "bg-primary-soft text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {status === "success" && (
                      <CheckCircle2 className="mx-auto mb-1 inline-block h-5 w-5" />
                    )}
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-primary-foreground shadow-elegant transition hover:shadow-glow disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {status === "sending" ? "در حال ارسال..." : "درخواست نمایندگی"}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  اطلاعات شما به‌صورت امن در سامانه درخواست‌های تیم ۸۴۵۲ ثبت می‌شود.
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className={`partner-field ${required ? "required" : ""}`}>{children}</div>
  );
}
