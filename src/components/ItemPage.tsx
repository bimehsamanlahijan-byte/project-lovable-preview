import type { ReactNode } from "react";
import { CheckCircle2, ChevronLeft, Phone } from "lucide-react";

import { SiteHeader } from "./SiteHeader";
import { InsuranceWheel } from "./InsuranceWheel";
import { SiteFooter } from "./SiteFooter";

export type Crumb = { label: string; href?: string };

type ItemPageProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  highlights?: string[];
  children?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ItemPage({
  title,
  subtitle,
  breadcrumbs = [],
  highlights = [],
  children,
  ctaLabel = "مشاوره و خرید آنلاین",
  ctaHref = "/contact",
}: ItemPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />

      {/* Page hero */}
      <section className="page-hero gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4">
            <a href="/" className="hover:underline">خانه</a>
            {breadcrumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <ChevronLeft className="w-3 h-3" />
                {c.href ? (
                  <a href={c.href} className="hover:underline">{c.label}</a>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h1>
          {subtitle && <p className="text-sm md:text-base opacity-90 max-w-2xl leading-7">{subtitle}</p>}
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 mt-6 bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-sm shadow-glow hover:scale-105 transition"
          >
            <Phone className="w-4 h-4" />
            {ctaLabel}
          </a>
        </div>
      </section>

      {/* Page content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {children ?? (
              <p className="text-sm md:text-base leading-8 text-muted-foreground">
                این صفحه مربوط به «{title}» است. برای دریافت اطلاعات کامل، مشاوره رایگان و خرید
                آنلاین بیمه‌نامه با کارشناسان بیمه سامان در ارتباط باشید.
              </p>
            )}
          </div>

          {highlights.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl shadow-soft p-6 sticky top-28">
                <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <span className="w-2 h-5 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
                  پوشش‌ها و مزایا
                </h2>
                <ul className="space-y-3">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm leading-6">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
