import { createFileRoute, useParams } from "@tanstack/react-router";
import { CheckCircle2, Construction, Phone, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { SiteFooter } from "@/components/SiteFooter";
import { navItems, type NavItem, SITE_CONTACT } from "@/components/site-data";
import { insuranceContent, type InsuranceContent } from "@/components/insurance-content";
import { hubContent } from "@/components/insurance-hubs";
import { LongformSections } from "@/components/LongformSections";
import { pageImage } from "@/components/page-media";

const allContent: Record<string, InsuranceContent> = { ...insuranceContent, ...hubContent };

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "صفحه" },
      { name: "description", content: "صفحه داخلی سایت" },
    ],
  }),
  component: DynamicPage,
});

function findLabel(path: string): string | null {
  const target = "/" + path.replace(/^\/+|\/+$/g, "");
  const stack: NavItem[] = [...navItems];
  while (stack.length) {
    const item = stack.shift()!;
    if (item.href === target) return item.label;
    if (item.children) stack.push(...item.children);
  }
  return null;
}

function DynamicPage() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string };
  const path = _splat ?? "";
  const fullPath = "/" + path.replace(/^\/+|\/+$/g, "");
  const content = allContent[fullPath];
  if (content) return <ContentPage path={fullPath} />;
  return <UnderConstruction />;
}

function ContentPage({ path }: { path: string }) {
  const content = allContent[path]!;
  const navLabel = findLabel(path) ?? content.title;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />

      <section className="page-hero relative overflow-hidden">
        <img
          src={pageImage(path)}
          alt={content.title}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative container mx-auto px-4 py-16 md:py-24 text-primary-foreground">
          <nav className="flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4">
            <a href="/" className="hover:underline">خانه</a>
            <span>/</span>
            <a href="/insurance" className="hover:underline">انواع بیمه‌ها</a>
            <span>/</span>
            <span>{navLabel}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow">{content.title}</h1>
          <p className="text-sm md:text-lg opacity-95 max-w-3xl leading-9">{content.intro}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a href="/insurance" className="bg-white/15 backdrop-blur border border-white/30 rounded-full px-6 py-3 text-sm font-bold hover:bg-white/25 transition">
              مشاهده همه بیمه‌ها
            </a>
            <a href={`tel:${SITE_CONTACT.mobilePhone}`} dir="ltr" className="bg-card text-primary rounded-full px-6 py-3 text-sm font-extrabold shadow-soft hover:shadow-glow transition inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> {SITE_CONTACT.mobilePhone}
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        {content.coverages.length > 0 && (
          <div className="bg-card border border-border rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-extrabold">پوشش‌های بیمه‌ای</h2>
            </div>
            <ul className="space-y-2">
              {content.coverages.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-7">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-extrabold">مزایا</h2>
          </div>
          <ul className="space-y-2">
            {content.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-7">
                <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {content.faq && content.faq.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-xl font-extrabold mb-4">سؤالات متداول</h2>
          <div className="space-y-3">
            {content.faq.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-7">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <LongformSections path={path} />

      <section className="container mx-auto px-4 pb-16">
        <div className="bg-card border border-border rounded-3xl shadow-soft p-8 text-center">
          <h2 className="text-xl font-extrabold mb-3">دریافت مشاوره و استعلام قیمت</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-7">
            جهت دریافت مشاوره رایگان و استعلام قیمت با کارشناسان ما تماس بگیرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${SITE_CONTACT.mobilePhone}`} dir="ltr"
              className="inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition">
              <Phone className="w-4 h-4" />
              {SITE_CONTACT.mobilePhone}
            </a>
            <a href={`tel:${SITE_CONTACT.landlinePhone}`} dir="ltr"
              className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition">
              <Phone className="w-4 h-4" />
              {SITE_CONTACT.landlinePhone}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function UnderConstruction() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string };
  const path = _splat ?? "";
  const segments = path.split("/").filter(Boolean);
  const title = findLabel(path) ?? decodeURIComponent(segments[segments.length - 1] ?? "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />

      <section className="page-hero gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4">
            <a href="/" className="hover:underline">خانه</a>
            <span>/</span>
            <span>{title || "صفحه"}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title || "صفحه"}</h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl leading-7">
            این بخش از سایت در حال بروزرسانی است.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-3xl shadow-soft p-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">در حال بروزرسانی و تولید محتوا</h2>
          <p className="text-muted-foreground leading-7 mb-6">
            صفحه «{title || "مورد نظر"}» در حال بروزرسانی و تولید محتوا می‌باشد. جهت کسب اطلاعات بیشتر با شماره‌های زیر تماس حاصل فرمایید:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${SITE_CONTACT.mobilePhone}`}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 gradient-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition"
            >
              <Phone className="w-4 h-4" />
              {SITE_CONTACT.mobilePhone}
            </a>
            <a
              href={`tel:${SITE_CONTACT.landlinePhone}`}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-full text-sm font-bold shadow-soft hover:shadow-glow transition"
            >
              <Phone className="w-4 h-4" />
              {SITE_CONTACT.landlinePhone}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
