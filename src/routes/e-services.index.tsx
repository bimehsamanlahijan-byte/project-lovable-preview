import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { SiteFooter } from "@/components/SiteFooter";
import { navItems } from "@/components/site-data";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/e-services/")({
  head: () => ({
    meta: [
      { title: "خدمات الکترونیک | بیمه سامان" },
      { name: "description", content: "خدمات الکترونیک بیمه سامان؛ استعلام وضعیت بیمه‌نامه، کارتابل بیمه‌گذاران و پرداخت آنلاین حق بیمه." },
    ],
  }),
  component: EServicesIndex,
});

function EServicesIndex() {
  const items = navItems.find((n) => n.label === "خدمات الکترونیک")?.children ?? [];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">خدمات الکترونیک</h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl leading-7">
            خدمات آنلاین بیمه سامان را به‌صورت شبانه‌روزی و بدون مراجعه حضوری دریافت کنید.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <a
              key={c.label}
              href={c.href ?? "#"}
              className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all flex items-center justify-between"
            >
              <span className="font-bold text-sm md:text-base group-hover:text-primary transition">{c.label}</span>
              <ChevronLeft className="w-5 h-5 text-primary opacity-70 group-hover:-translate-x-1 transition" />
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
