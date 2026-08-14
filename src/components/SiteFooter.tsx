import { useRef } from "react";
import { Phone, MapPin, Smartphone } from "lucide-react";

import { SITE_LOGO, SITE_CONTACT } from "./site-data";
import { SocialBar } from "./SocialBar";
import { useBranding } from "@/hooks/use-branding";

export function SiteFooter() {
  const branding = useBranding();
  /* Hidden dashboard entry: 20 taps on the mobile-number icon (works on phones). */
  const taps = useRef(0);
  const tapTimer = useRef<number | null>(null);
  const countTap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    taps.current += 1;
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => {
      taps.current = 0;
    }, 4000);
    if (taps.current >= 20) {
      taps.current = 0;
      window.location.href = "/dashboard";
    }
  };
  return (
    <footer className="mt-20 gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={branding.footerLogoUrl || SITE_LOGO}
                alt="بیمه سامان"
                style={{ height: branding.logoHeightFooter }}
                className="w-auto object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-sm leading-7 opacity-85">
              ارائه دهنده بهترین خدمات بیمه‌ای با بیش از دو دهه تجربه و ۱۰۰۰ نمایندگی فعال در سراسر کشور.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><a href="/e-services" className="hover:opacity-100 hover:underline">خدمات الکترونیک</a></li>
              <li><a href="/insurance" className="hover:opacity-100 hover:underline">انواع بیمه‌ها</a></li>
              <li><a href="/branches" className="hover:opacity-100 hover:underline">شعب و نمایندگان</a></li>
              <li><a href="/blog" className="hover:opacity-100 hover:underline">مجله و خبر</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><a href="/contact" className="hover:opacity-100 hover:underline">تماس با ما</a></li>
              <li><a href="/contact" className="hover:opacity-100 hover:underline">سوالات پرتکرار</a></li>
              <li><a href="/contact" className="hover:opacity-100 hover:underline">ثبت شکایت</a></li>
              <li><a href="/reporting" className="hover:opacity-100 hover:underline">گزارشگری و افشای اطلاعات</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">ارتباط با ما</h4>
            <ul className="space-y-3 text-sm opacity-85">
              <li className="flex items-center gap-2 ltr-num" dir="ltr">
                <Phone className="w-4 h-4" />
                <a href={`tel:${SITE_CONTACT.landlinePhone}`} className="hover:underline">
                  {SITE_CONTACT.landlinePhone}
                </a>
              </li>
              <li className="flex items-center gap-2 ltr-num" dir="ltr">
                <span
                  role="presentation"
                  onClick={countTap}
                  className="inline-flex p-1 -m-1 cursor-pointer select-none"
                >
                  <Smartphone className="w-4 h-4" />
                </span>
                <a href={`tel:${SITE_CONTACT.mobilePhone}`} className="hover:underline">
                  {SITE_CONTACT.mobilePhone}
                </a>
              </li>
              <li className="flex items-start gap-2 leading-6">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{SITE_CONTACT.address}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 mt-10 pt-6">
          <h4 className="font-bold mb-4 text-sm">ما را در شبکه‌های اجتماعی دنبال کنید</h4>
          <SocialBar />
        </div>
        <div className="border-t border-white/15 mt-10 pt-6 text-center text-xs opacity-80 leading-6">
          © {new Date().toLocaleDateString("fa-IR", { year: "numeric" })} — تمام حقوق متعلق به بیمه سامان نمایندگی آذرخش می‌باشد.
        </div>
      </div>
    </footer>
  );
}
