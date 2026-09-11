import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronLeft } from "lucide-react";

const posts = [
  "زرسام بیمه سامان؛ نسل جدید بیمه‌های زندگی با سرمایه‌گذاری مبتنی بر طلا",
  "میانگین پرداخت روزانه خسارت بیمه سامان، بیش از ۳۷ میلیارد تومان",
  "رکورد ۱۴ هزار تراکنش در اپلیکیشن بیمه سامان؛ خدمات پایدار",
  "پایداری مداوم شریان پاسخگویی بیمه سامان در دوران بحران",
  "پرداخت ۳۷۰ میلیارد ریال خسارت به بیمه‌گزار شرکت بیمه سامان",
  "شرایط عمومی بیمه تمام خطر نصب",
  "مالیات نقل و انتقال خودرو",
  "تفاوت برگ سبز و سند خودرو",
  "شرایط عمومی بیمه‌نامه عیوب اساسی و پنهان ساختمان",
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "مجله و خبر | بیمه سامان" },
      { name: "description", content: "آخرین اخبار، مقالات آموزشی و راهنمای بیمه‌های سامان در مجله و خبر بیمه سامان." },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />
      <section className="page-hero gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">مجله و خبر</h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl leading-7">
            آخرین اخبار، مقالات آموزشی و راهنمای بیمه‌های سامان را اینجا دنبال کنید.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <a
              key={p}
              href="#"
              className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all flex flex-col gap-4"
            >
              <span className="font-bold text-sm md:text-base leading-7 group-hover:text-primary transition">{p}</span>
              <span className="inline-flex items-center gap-1 text-xs text-primary opacity-80">
                ادامه مطلب <ChevronLeft className="w-4 h-4" />
              </span>
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
