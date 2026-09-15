import { createFileRoute } from "@tanstack/react-router";
import { ThirdPartyWidget } from "@/components/third-party/ThirdPartyWidget";

export const Route = createFileRoute("/third-party")({
  head: () => ({
    meta: [
      { title: "خرید آنلاین بیمه شخص ثالث | بیمه پارسیان لاهیجان" },
      {
        name: "description",
        content:
          "استعلام قیمت و خرید آنلاین بیمه شخص ثالث خودرو در چند مرحله ساده؛ ثبت پلاک، مشخصات خودرو و دریافت قیمت دقیق از سامانه استعلام.",
      },
      { property: "og:title", content: "خرید آنلاین بیمه شخص ثالث | بیمه پارسیان لاهیجان" },
      {
        property: "og:description",
        content: "استعلام قیمت واقعی بیمه شخص ثالث خودرو و خرید آنلاین بدون مراجعه حضوری.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThirdPartyPage,
});

function ThirdPartyPage() {
  return <ThirdPartyWidget />;
}
