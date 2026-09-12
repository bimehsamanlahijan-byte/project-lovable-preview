import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/partners/apply")({
  head: () => ({
    meta: [
      { title: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲" },
      {
        name: "description",
        content:
          "فرم درخواست همکاری در فروش بیمه سامان نمایندگی ۸۴۵۲؛ مشخصات فردی، سوابق کاری و شاخه‌های مورد علاقه را ثبت کنید.",
      },
      { property: "og:title", content: "درخواست همکاری در فروش | بیمه سامان ۸۴۵۲" },
      { property: "og:description", content: "علاقه‌مندان به فروش بیمه فرم درخواست همکاری را تکمیل کنند." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerApplyPage,
});

const PROVINCES = [
  "گیلان", "تهران", "مازندران", "البرز", "قزوین", "اردبیل", "آذربایجان شرقی", "آذربایجان غربی",
  "اصفهان", "فارس", "خراسان رضوی", "خوزستان", "کرمان", "کرمانشاه", "سمنان", "زنجان", "قم",
  "همدان", "یزد", "مرکزی", "لرستان", "گلستان", "بوشهر", "هرمزگان", "کردستان", "سیستان و بلوچستان",
  "چهارمحال و بختیاری", "کهگیلویه و بویراحمد", "ایلام", "خراسان شمالی", "خراسان جنوبی", "سایر",
];

const EDUCATION = ["زیر دیپلم", "دیپلم", "کاردانی", "کارشناسی", "کارشناسی ارشد", "دکتری"];
const EXPERIENCE = ["بدون سابقه", "کمتر از ۱ سال", "۱ تا ۳ سال", "۳ تا ۵ سال", "بیش از ۵ سال"];
const COOPERATION = ["تمام‌وقت", "پاره‌وقت", "دورکاری", "پروژه‌ای"];
const BRANCHES = [
  "بیمه اتومبیل (ثالث و بدنه)",
  "بیمه عمر و سرمایه‌گذاری",
  "بیمه درمان تکمیلی",
  "بیمه آتش‌سوزی",
  "بیمه مسئولیت",
  "بیمه مهندسی",
  "بیمه مسافرتی",
  "بیمه باربری",
];

const inputCls =
  "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition";

function PartnerApplyPage() {
  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    birthYear: "",
    gender: "male",
    phone: "",
    email: "",
    province: "گیلان",
    city: "",
    address: "",
    education: "کارشناسی",
    fieldOfStudy: "",
    experience: "بدون سابचه",
    insuranceLicense: "no",
    cooperationType: "پاره‌وقت",
    branches: [] as string[],
    monthlyTarget: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const toggleBranch = (b: string) =>
    setForm((p) => ({
      ...p,
      branches: p.branches.includes(b) ? p.branches.filter((x) => x !== b) : [...p.branches, b],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !/^\d{10}$/.test(form.nationalId.trim()) || !form.phone.trim()) {
      setMsg("لطفاً نام و نام خانوادگی، کد ملی ۱۰ رقمی و شماره تماس را درست وارد کنید.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      const r = await fetch("/api/public/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus("ok");
        setApplicantId(data.applicantId ?? null);
        setMsg("درخواست همکاری شما ثبت شد؛ کارشناسان نمایندگی با شما تماس می‌گیرند.");
      } else {
        setStatus("error");
        setMsg("ارسال ناموفق بود. لطفاً دوباره تلاش کنید.");
      }
    } catch {
      setStatus("error");
      setMsg("خطا در ارتباط با سرور.");
    }
  };

  return (
    <ItemPage
      title="درخواست همکاری در فروش"
      subtitle="علاقه‌مندان به فروش بیمه سامان، فرم زیر را تکمیل کنند تا پس از گزینش با آن‌ها تماس گرفته شود."
      breadcrumbs={[{ label: "همکاران تیم 8452", href: "/partners" }, { label: "درخواست همکاری در فروش" }]}
      ctaLabel="پنل فروش و پورسانت همکاران"
      ctaHref="/partners/dashboard"
      highlights={[
        "پورسانت رقابتی و پرداخت منظم",
        "آموزش رایگان فروش و صدور",
        "پشتیبانی کامل نمایندگی ۸۴۵۲ آذرخش",
      ]}
    >
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">فرم درخواست همکاری در فروش</h2>
        <p className="text-muted-foreground text-sm mb-6">
          اطلاعات را با دقت وارد کنید؛ پس از ثبت، شناسه متقاضی برای پیگیری نمایش داده می‌شود.
        </p>

        {status === "ok" && (
          <div className="mb-6 bg-primary-soft text-primary rounded-2xl px-5 py-4 text-sm text-center">
            {msg}
            {applicantId && <div className="mt-2 font-extrabold text-lg">شناسه متقاضی: {applicantId}</div>}
          </div>
        )}

        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1.5">نام و نام خانوادگی</label>
            <input value={form.fullName} onChange={update("fullName")} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">کد ملی</label>
            <input dir="ltr" inputMode="numeric" maxLength={10} value={form.nationalId} onChange={update("nationalId")} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">سال تولد</label>
            <input dir="ltr" inputMode="numeric" maxLength={4} placeholder="1370" value={form.birthYear} onChange={update("birthYear")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">جنسیت</label>
            <select value={form.gender} onChange={update("gender")} className={inputCls}>
              <option value="male">آقا</option>
              <option value="female">خانم</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شماره تماس</label>
            <input type="tel" dir="ltr" value={form.phone} onChange={update("phone")} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">ایمیل (اختیاری)</label>
            <input type="email" dir="ltr" value={form.email} onChange={update("email")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">استان</label>
            <select value={form.province} onChange={update("province")} className={inputCls}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شهر</label>
            <input value={form.city} onChange={update("city")} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">نشانی محل سکونت</label>
            <input value={form.address} onChange={update("address")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">میزان تحصیلات</label>
            <select value={form.education} onChange={update("education")} className={inputCls}>
              {EDUCATION.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">رشته تحصیلی</label>
            <input value={form.fieldOfStudy} onChange={update("fieldOfStudy")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">سابقه فروش بیمه</label>
            <select value={form.experience} onChange={update("experience")} className={inputCls}>
              {EXPERIENCE.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">کد بازاریابی / مجوز بیمه مرکزی</label>
            <select value={form.insuranceLicense} onChange={update("insuranceLicense")} className={inputCls}>
              <option value="no">ندارم</option>
              <option value="yes">دارم</option>
              <option value="in_progress">در حال اخذ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">نوع همکاری</label>
            <select value={form.cooperationType} onChange={update("cooperationType")} className={inputCls}>
              {COOPERATION.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">هدف فروش ماهانه (تومان)</label>
            <input dir="ltr" inputMode="numeric" value={form.monthlyTarget} onChange={update("monthlyTarget")} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">شاخه‌های بیمه‌ای مورد علاقه</label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((b) => {
                const active = form.branches.includes(b);
                return (
                  <button
                    type="button"
                    key={b}
                    onClick={() => toggleBranch(b)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">توضیحات و سوابق کاری</label>
            <textarea rows={5} value={form.description} onChange={update("description")} className={`${inputCls} resize-none`} />
          </div>
          {msg && status !== "ok" && (
            <div className="md:col-span-2 text-sm text-center rounded-xl px-4 py-3 bg-destructive/10 text-destructive">{msg}</div>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" disabled={status === "sending"} className="gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ارسال درخواست همکاری"}
            </button>
          </div>
        </form>
      </div>
    </ItemPage>
  );
}
