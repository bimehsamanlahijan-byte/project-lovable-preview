import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "ارتباط با ما | بیمه سامان" },
      { name: "description", content: "راه‌های ارتباط با بیمه سامان؛ شماره تماس، آدرس دفتر مرکزی و ثبت درخواست مشاوره." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) {
      setMsg("لطفاً نام و شماره تماس را وارد کنید.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      const r = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          nationalId: "-",
          phone: form.phone,
          email: form.email,
          province: "",
          insuranceType: "",
          description: form.message,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus("ok");
        setMsg("پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.");
        setForm({ fullName: "", phone: "", email: "", message: "" });
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
      title="ارتباط با ما"
      subtitle="برای مشاوره، پشتیبانی یا ثبت درخواست با کارشناسان بیمه سامان در ارتباط باشید."
      breadcrumbs={[{ label: "ارتباط با ما" }]}
      ctaLabel="تماس با ما"
      ctaHref="tel:02183132"
      highlights={[
        "مرکز تماس: ۸۳۱۳۲ - ۰۲۱",
        "ایمیل: info@si24.ir",
        "دفتر مرکزی: تهران، خیابان ولیعصر",
        "پشتیبانی ۲۴ ساعته در ۷ روز هفته",
      ]}
    >
      <div className="space-y-4 text-sm md:text-base leading-8 text-muted-foreground">
        <p>
          کارشناسان بیمه سامان آماده پاسخگویی به سوالات شما درباره انواع بیمه‌نامه‌ها، صدور،
          تمدید و پیگیری خسارت هستند. می‌توانید از طریق شماره تماس مرکز ارتباط با مشتریان یا
          ایمیل با ما در ارتباط باشید.
        </p>
        <p>
          همچنین برای دریافت مشاوره رایگان خرید بیمه، فرم درخواست مشاوره در صفحه اصلی را تکمیل
          کنید تا در اولین فرصت با شما تماس بگیریم.
        </p>
      </div>

      <div className="mt-10 bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">فرم تماس</h2>
        <p className="text-muted-foreground text-sm mb-6">پیام خود را برای ما ارسال کنید</p>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1.5">نام و نام خانوادگی</label>
            <input value={form.fullName} onChange={update("fullName")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شماره تماس</label>
            <input type="tel" value={form.phone} onChange={update("phone")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">ایمیل</label>
            <input type="email" value={form.email} onChange={update("email")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">پیام شما</label>
            <textarea rows={4} value={form.message} onChange={update("message")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          {msg && (
            <div className={`md:col-span-2 text-sm text-center rounded-xl px-4 py-3 ${status === "ok" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`}>
              {msg}
            </div>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" disabled={status === "sending"} className="gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ارسال پیام"}
            </button>
          </div>
        </form>
      </div>
    </ItemPage>
  );
}
