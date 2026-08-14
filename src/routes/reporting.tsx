import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/reporting")({
  head: () => ({
    meta: [
      { title: "گزارشگری و افشای اطلاعات | بیمه سامان" },
      { name: "description", content: "گزارش‌های مالی، صورت‌های مالی و افشای اطلاعات شرکت سهامی بیمه سامان." },
    ],
  }),
  component: ReportingPage,
});

function ReportingPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", policyNumber: "", accidentDate: "", description: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p: typeof form) => ({ ...p, [key]: e.target.value }));
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
      const r = await fetch("/api/report-damage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus("ok");
        setMsg("گزارش خسارت شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس می‌گیرند.");
        setForm({ fullName: "", phone: "", policyNumber: "", accidentDate: "", description: "" });
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
      title="گزارشگری و افشای اطلاعات"
      subtitle="دسترسی به گزارش‌های مالی، صورت‌های مالی سالانه و اطلاعیه‌های سهامداران بیمه سامان."
      breadcrumbs={[{ label: "گزارشگری و افشای اطلاعات" }]}
      ctaLabel="ارتباط با امور سهام"
      ctaHref="/contact"
      highlights={[
        "صورت‌های مالی حسابرسی‌شده",
        "گزارش فعالیت هیئت مدیره",
        "اطلاعیه‌های سهامداران",
        "افشای اطلاعات با اهمیت",
      ]}
    >
      <div className="space-y-4 text-sm md:text-base leading-8 text-muted-foreground">
        <p>
          صورت‌های مالی حسابرسی‌شده، گزارش فعالیت هیئت مدیره و اطلاعیه‌های مهم سهامداران
          از طریق این بخش در دسترس است. برای دسترسی به اسناد کدال و اطلاعات بیشتر به
          وب‌سایت رسمی شرکت مراجعه کنید.
        </p>
      </div>

      <div className="mt-10 bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">ثبت گزارش خسارت</h2>
        <p className="text-muted-foreground text-sm mb-6">اطلاعات حادثه را وارد کنید تا کارشناسان ما پیگیری کنند</p>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1.5">نام و نام خانوادگی</label>
            <input value={form.fullName} onChange={update("fullName")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شماره تماس</label>
            <input type="tel" value={form.phone} onChange={update("phone")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شماره بیمه‌نامه</label>
            <input value={form.policyNumber} onChange={update("policyNumber")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">تاریخ حادثه</label>
            <input type="text" placeholder="مثلاً ۱۴۰۳/۰۱/۱۵" value={form.accidentDate} onChange={update("accidentDate")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">شرح حادثه و خسارت</label>
            <textarea rows={4} value={form.description} onChange={update("description")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          {msg && (
            <div className={`md:col-span-2 text-sm text-center rounded-xl px-4 py-3 ${status === "ok" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`}>
              {msg}
            </div>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" disabled={status === "sending"} className="gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ثبت گزارش خسارت"}
            </button>
          </div>
        </form>
      </div>
    </ItemPage>
  );
}
