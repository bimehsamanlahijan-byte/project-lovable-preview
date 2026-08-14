import { createFileRoute } from "@tanstack/react-router";

import { ItemPage } from "@/components/ItemPage";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "شعب و نمایندگان | بیمه سامان" },
      { name: "description", content: "فهرست شعب و نمایندگان بیمه سامان در سراسر کشور؛ جستجوی نزدیک‌ترین نمایندگی به شما." },
    ],
  }),
  component: () => (
    <ItemPage
      title="شعب و نمایندگان"
      subtitle="نزدیک‌ترین شعبه یا نمایندگی بیمه سامان را در سراسر کشور پیدا کنید."
      breadcrumbs={[{ label: "شعب و نمایندگان" }]}
      ctaLabel="درخواست نمایندگی"
      highlights={[
        "بیش از ۱۰۰۰ نمایندگی فعال",
        "حضور در تمام استان‌ها",
        "پشتیبانی و صدور حضوری",
        "ثبت‌نام آنلاین نمایندگی",
      ]}
    />
  ),
});
