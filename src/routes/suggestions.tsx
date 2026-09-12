import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/suggestions")({
  head: () => ({
    meta: [
      { title: "انتقادات و پیشنهادات | بیمه سامان" },
      {
        name: "description",
        content: "ثبت انتقاد و پیشنهاد برای بیمه سامان با کد رهگیری؛ هر پیام با تاریخ و ساعت دریافت در پیشخوان مدیریت ثبت می‌شود.",
      },
      { property: "og:title", content: "انتقادات و پیشنهادات | بیمه سامان" },
      { property: "og:description", content: "نظر، انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuggestionsPage,
});

function SuggestionsPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", category: "suggestion", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [trackingId, setTrackingId] = useState<number | null>(null);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
      setMsg("لطفاً نام، شماره تماس و متن پیام را وارد کنید.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      const r = await fetch("/api/public/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus("ok");
        setTrackingId(data.trackingId ?? null);
        setMsg("پیام شما با موفقیت ثبت شد.");
        setForm({ fullName: "", phone: "", category: "suggestion", message: "" });
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
      title="انتقادات و پیشنهادات"
      subtitle="نظر شما برای ما ارزشمند است؛ انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید."
      breadcrumbs={[{ label: "انتقادات و پیشنهادات" }]}
      ctaLabel="تماس با ما"
      ctaHref="/contact"
      highlights={[
        "صدور کد رهگیری برای هر پیام",
        "ثبت تاریخ و ساعت دریافت در پیشخوان مدیریت",
        "بررسی همه پیام‌ها توسط تیم پشتیبانی",
      ]}
    >
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">فرم ثبت انتقاد و پیشنهاد</h2>
        <p className="text-muted-foreground text-sm mb-6">پس از ارسال، کد رهگیری برایتان نمایش داده می‌شود.</p>

        {status === "ok" && (
          <div className="mb-6 bg-primary-soft text-primary rounded-2xl px-5 py-4 text-sm text-center">
            {msg}
            {trackingId !== null && (
              <div className="mt-2 font-extrabold text-lg" dir="ltr">
                کد رهگیری: {trackingId.toLocaleString("fa-IR")}
              </div>
            )}
          </div>
        )}

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
            <label className="block text-sm font-medium mb-1.5">نوع پیام</label>
            <select value={form.category} onChange={update("category")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition">
              <option value="suggestion">پیشنهاد</option>
              <option value="criticism">انتقاد</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">متن پیام</label>
            <textarea rows={5} value={form.message} onChange={update("message")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          {msg && status !== "ok" && (
            <div className="md:col-span-2 text-sm text-center rounded-xl px-4 py-3 bg-destructive/10 text-destructive">
              {msg}
            </div>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" disabled={status === "sending"} className="gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ثبت پیام"}
            </button>
          </div>
        </form>
      </div>
    </ItemPage>
  );
}
