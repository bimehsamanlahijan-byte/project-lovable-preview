import { createFileRoute } from "@tanstack/react-router";
import { Users, BarChart3, MessageSquarePlus } from "lucide-react";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "همکاران تیم 8452 | بیمه سامان" },
      {
        name: "description",
        content:
          "صفحه همکاران و بازاریابان تیم 8452 بیمه سامان؛ مشاهده وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای.",
      },
      { property: "og:title", content: "همکاران تیم 8452 | بیمه سامان" },
      {
        property: "og:description",
        content: "اتوماسیون بازاریابان و همکاران معرف تیم 8452؛ مشاهده پورسانت و فروش هر همکار.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <ItemPage
      title="همکاران تیم 8452"
      subtitle="به باشگاه بازاریابان و همکاران معرف تیم 8452 بیمه سامان خوش آمدید؛ فروش خود را ثبت کنید و وضعیت پورسانت را لحظه‌ای ببینید."
      breadcrumbs={[{ label: "همکاران تیم 8452" }]}
      ctaLabel="ورود به پنل همکاران"
      ctaHref="/partners/dashboard"
      highlights={[
        "مشاهده درصد پورسانت اختصاصی هر همکار",
        "گزارش میزان فروش به تفکیک شاخه بیمه‌ای",
        "ثبت انتقاد و پیشنهاد با کد رهگیری",
      ]}
    >
      <div className="space-y-4 text-sm md:text-base leading-8 text-muted-foreground">
        <p>
          تیم ۸۴۵۲ مجموعه‌ای از بازاریابان و همکاران معرف بیمه سامان است. هر همکار با کد اختصاصی
          خود می‌تواند وارد پنل همکاران شود و وضعیت پورسانت، میزان فروش و انواع بیمه‌نامه‌هایی را
          که در هر شاخه بیمه‌ای فروخته است مشاهده کند.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-3xl p-6 shadow-elegant border border-border">
          <Users className="w-8 h-8 text-primary mb-3" />
          <h2 className="font-extrabold mb-2">عضویت در تیم</h2>
          <p className="text-sm text-muted-foreground leading-7">
            برای پیوستن به تیم ۸۴۵۲ و دریافت کد همکاری، با مدیریت نمایندگی در تماس باشید.
          </p>
        </div>
        <a
          href="/partners/dashboard"
          className="bg-card rounded-3xl p-6 shadow-elegant border border-border hover:border-primary transition block"
        >
          <BarChart3 className="w-8 h-8 text-primary mb-3" />
          <h2 className="font-extrabold mb-2">پنل فروش و پورسانت</h2>
          <p className="text-sm text-muted-foreground leading-7">
            با کد همکاری خود وارد شوید و گزارش فروش و پورسانت‌تان را ببینید.
          </p>
        </a>
        <a
          href="/suggestions"
          className="bg-card rounded-3xl p-6 shadow-elegant border border-border hover:border-primary transition block"
        >
          <MessageSquarePlus className="w-8 h-8 text-primary mb-3" />
          <h2 className="font-extrabold mb-2">انتقادات و پیشنهادات</h2>
          <p className="text-sm text-muted-foreground leading-7">
            نظر، انتقاد یا پیشنهاد خود را ثبت کنید و کد رهگیری دریافت کنید.
          </p>
        </a>
      </div>
    </ItemPage>
  );
}
