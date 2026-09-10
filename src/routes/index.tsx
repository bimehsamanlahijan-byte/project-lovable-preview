import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { VE_EDIT_PARAM } from "@/lib/visual-editor";
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView } from "framer-motion";
import {
  Smartphone, Heart, Plane, Home as HomeIcon, Car, Truck, ShieldAlert, Stethoscope,
  Search, FolderOpen, CreditCard, MapPin,
  Phone, FileCheck, Headphones, MessageSquare, Download, ChevronDown, ArrowLeft,
} from "lucide-react";

import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import banner4 from "@/assets/banner-4.jpg";
import banner5 from "@/assets/banner-5.jpg";
import banner6 from "@/assets/banner-6.jpg";
import banner7 from "@/assets/banner-7.jpg";
import banner8 from "@/assets/banner-8.jpg";
import banner9 from "@/assets/banner-9.jpg";
import banner10 from "@/assets/banner-10.jpg";
import appPromo from "@/assets/app-promo.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { DarmanetCentersTable } from "@/components/DarmanetCentersTable";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { DEFAULT_HERO_SLIDER, type HeroSliderSettings } from "@/lib/site-config";


export const Route = createFileRoute("/")({
  loader: async () => {
    const { getSeoConfig } = await import("@/lib/seo.functions");
    try {
      return await getSeoConfig();
    } catch {
      return null;
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData ?? null;
    const base = seo?.origin ?? "";
    const title = seo?.defaultTitle || "بیمه سامان | خرید آنلاین انواع بیمه";
    const description =
      seo?.defaultDescription ||
      "خرید آنلاین انواع بیمه شخص ثالث، عمر، درمان، مسافرتی، آتش‌سوزی و موبایل از بیمه سامان.";
    const sitelinks = (seo?.pages ?? []).filter((p) => p.sitelink && p.path !== "/");

    const graph: Record<string, unknown>[] = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: seo?.siteName || "بیمه سامان — نمایندگی آذرخش",
        url: base ? `${base}/` : "/",
        inLanguage: "fa-IR",
        ...(seo?.searchUrlTemplate
          ? {
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: seo.searchUrlTemplate },
                "query-input": "required name=search_term_string",
              },
            }
          : {}),
      },
      ...sitelinks.map((p) => ({
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        name: p.title,
        description: p.description,
        url: `${base}${p.path}`,
      })),
    ];

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: base ? `${base}/` : "/" }],
      scripts: graph.map((g) => ({
        type: "application/ld+json",
        children: JSON.stringify(g),
      })),
    };
  },
  component: Home,
});


const slides = [
  { img: banner1, title: "بیمه شخص ثالث", subtitle: "پوشش کامل خسارت‌های مالی و جانی به اشخاص ثالث", cta: "محاسبه و خرید", href: "/insurance/car/third-party" },
  { img: banner2, title: "بیمه بدنه خودرو", subtitle: "حفاظت کامل از خودروی شما در برابر حوادث و خسارات", cta: "مشاهده و خرید", href: "/insurance/car/body" },
  { img: banner3, title: "بیمه عمر و سرمایه‌گذاری", subtitle: "آینده‌ای مطمئن همراه با سرمایه‌گذاری سودمند", cta: "اطلاعات بیشتر", href: "/insurance/life/investment" },
  { img: banner4, title: "بیمه آتش‌سوزی منازل", subtitle: "محافظت از خانه و دارایی شما در برابر حوادث", cta: "خرید آنلاین", href: "/insurance/fire/residential" },
  { img: banner5, title: "بیمه درمان تکمیلی", subtitle: "آرامش خاطر برای شما و خانواده در زمان درمان", cta: "مشاهده و خرید", href: "/insurance/health/private-health" },
  { img: banner6, title: "بیمه مسافرتی", subtitle: "همراه مطمئن شما در سفرهای داخلی و خارجی", cta: "خرید سریع", href: "/insurance/travel" },
  { img: banner7, title: "بیمه باربری", subtitle: "پوشش امن کالاهای وارداتی، صادراتی و داخلی", cta: "اطلاعات بیشتر", href: "/insurance/cargo" },
  { img: banner8, title: "بیمه حوادث انفرادی", subtitle: "حمایت ۲۴ ساعته در برابر حوادث ناگوار", cta: "محاسبه و خرید", href: "/insurance/life/accident/individual-personal-accident" },
  { img: banner9, title: "بیمه مسئولیت", subtitle: "آرامش حرفه‌ای برای صاحبان مشاغل و کسب‌وکار", cta: "مشاهده و خرید", href: "/insurance/liability" },
  { img: banner10, title: "بیمه مهندسی", subtitle: "پوشش جامع پروژه‌های ساختمانی و تأسیساتی", cta: "اطلاعات بیشتر", href: "/insurance/engineering" },
];

const services = [
  { icon: Smartphone, title: "بیمه موبایل و تبلت" },
  { icon: Heart, title: "بیمه عمر" },
  { icon: Plane, title: "بیمه مسافرتی" },
  { icon: HomeIcon, title: "بیمه منازل مسکونی" },
  { icon: Car, title: "بیمه شخص ثالث" },
  { icon: Truck, title: "بیمه باربری وارداتی" },
  { icon: ShieldAlert, title: "بیمه حوادث انفرادی" },
  { icon: Stethoscope, title: "بیمه درمان خانواده" },
];

const eServices = [
  { icon: Search, title: "استعلام وضعیت بیمه‌نامه" },
  { icon: FolderOpen, title: "کارتابل بیمه‌گذاران" },
  { icon: CreditCard, title: "پرداخت آنلاین حق بیمه" },
];

const provinces = [
  "تهران", "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی",
  "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان",
  "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان",
  "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

const features = [
  { icon: FileCheck, title: "صدور آنلاین بیمه", desc: "صدور سریع بیمه‌نامه در چند دقیقه" },
  { icon: ShieldAlert, title: "ثبت آنلاین خسارت", desc: "ثبت و پیگیری ۲۴ ساعته خسارت" },
  { icon: MessageSquare, title: "مشاوره خرید تخصصی", desc: "راهنمایی توسط کارشناسان مجرب" },
  { icon: Headphones, title: "پشتیبانی ۲۴/۷", desc: "پاسخگویی در تمام ساعات شبانه‌روز" },
];

const articles = [
  { title: "ذخایر فنی مؤسسات بیمه - مصوب ۸۷/۱۰/۲۵", excerpt: "شورای عالی بیمه در راستای اجرای ماده ۶۱ قانون تأسیس بیمه مرکزی ایران و بیمه‌گری..." },
  { title: "شرایط عمومی بیمه نامه تجهیزات و ماشین‌آلات پیمانکاری", excerpt: "نظر به پیشنهاد کتبی بیمه‌گزار مذکور مشخصات، شرکت سهامی بیمه سامان..." },
  { title: "شرایط ثبت‌نام بیمه تامین اجتماعی", excerpt: "داشتن بیمه تامین اجتماعی، اولین قدم برای پشتیبانی مالی و سرمایه‌گذاری روی آینده است..." },
  { title: "پرداخت دیه به نرخ روز", excerpt: "آیا می‌دانید اگر بین زمان حادثه و پرداخت خسارت چند ماه یا حتی چند سال فاصله بیفتد..." },
];

const news = [
  "زرسام بیمه سامان؛ نسل جدید بیمه‌های زندگی با سرمایه‌گذاری مبتنی بر طلا",
  "میانگین پرداخت روزانه خسارت بیمه سامان، بیش از ۳۷ میلیارد تومان",
  "رکورد ۱۴ هزار تراکنش در اپلیکیشن بیمه سامان",
  "پایداری مداوم شریان پاسخگویی بیمه سامان",
  "پرداخت ۳۷۰ میلیارد ریال خسارت به بیمه‌گزار شرکت بیمه سامان",
  "بخشودگی کامل جرایم بیمه شخص ثالث",
];

const faqs = [
  { q: "چگونه می‌توانم بیمه‌نامه خود را به‌صورت آنلاین خریداری کنم؟", a: "با مراجعه به بخش مربوط به هر نوع بیمه در سایت، اطلاعات لازم را وارد کرده و در چند گام ساده بیمه‌نامه خود را دریافت کنید." },
  { q: "آیا برای پرداخت خسارت باید به شعبه مراجعه کنم؟", a: "خیر، در بیشتر موارد می‌توانید از طریق اپلیکیشن یا سایت بیمه سامان، خسارت خود را ثبت و پیگیری کنید." },
  { q: "بیمه عمر طلای سامان چه ویژگی‌هایی دارد؟", a: "این بیمه‌نامه با پشتوانه طلا، علاوه بر پوشش‌های بیمه‌ای، امکان سرمایه‌گذاری مطمئن را برای شما فراهم می‌کند." },
  { q: "چگونه می‌توانم وضعیت بیمه‌نامه خود را استعلام کنم؟", a: "از طریق بخش «خدمات الکترونیک» و گزینه «استعلام وضعیت بیمه‌نامه» با وارد کردن شماره بیمه‌نامه." },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <HeroSlider />
      <InsuranceWheel />
      <ServicesSection />
      <EServicesSection />
      <BranchesSection />
      <AppSection />
      <ConsultFormSection />
      <AboutSection />
      <FeaturesSection />
      <ArticlesSection />
      <NewsSection />
      <FAQSection />
      <PartnersSection />
      <SiteFooter />
    </div>
  );
}



/* ---------------- HERO SLIDER ---------------- */
function HeroSlider() {
  const cfg = useSiteSetting<HeroSliderSettings>("hero_slider", DEFAULT_HERO_SLIDER);
  return <HeroSliderInner key={JSON.stringify(cfg)} cfg={cfg} />;
}

function HeroSliderInner({ cfg }: { cfg: HeroSliderSettings }) {
  const data = cfg.slides && cfg.slides.length > 0 ? cfg.slides : slides;
  /* Inside the visual editor (?ve=1) autoplay is switched off so the admin can
     calmly edit a slide, while touch/drag stays on for moving between slides. */
  const isEditing =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get(VE_EDIT_PARAM) === "1";
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: cfg.loop, direction: "rtl", watchDrag: true, dragFree: false },
    cfg.autoplay && !isEditing ? [Autoplay({ delay: Math.max(1000, cfg.autoplayMs) })] : [],
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!embla) return;
    const onSel = () => setIdx(embla.selectedScrollSnap());
    embla.on("select", onSel);
    onSel();
  }, [embla]);

  const sizeStyle =
    cfg.heightMode === "fixed"
      ? { height: `${cfg.heightPx}px` }
      : { aspectRatio: `${cfg.ratioW} / ${cfg.ratioH}` };

  return (
    <section className="container mx-auto px-4 mt-6">
      <div className="relative overflow-hidden rounded-3xl shadow-elegant">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {data.map((s, i) => (
              <div key={i} className="relative flex-[0_0_100%] min-w-0" style={sizeStyle}>
                <img src={s.img} alt={s.title} className={`absolute inset-0 w-full h-full ${cfg.fit === "contain" ? "object-contain bg-slate-900" : "object-cover"}`} loading={i === 0 ? "eager" : "lazy"} />
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 md:px-14 max-w-2xl text-primary-foreground">
                    <motion.h2
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-2xl md:text-5xl font-extrabold mb-3 drop-shadow-lg"
                    >
                      {s.title}
                    </motion.h2>
                    {s.subtitle && <p className="text-sm md:text-lg mb-5 opacity-90">{s.subtitle}</p>}
                    {s.cta && (
                      <a href={s.href || "#"} className="inline-block bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-sm shadow-glow hover:scale-105 transition">
                        {s.cta}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation arrows removed on purpose: slides move only by touch / drag. */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
          {data.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------------- SERVICES ---------------- */
function ServicesSection() {
  return (
    <section className="container mx-auto px-4 mt-12 md:mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {services.map((s, i) => (
          <motion.a
            key={s.title}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group bg-card border border-border rounded-2xl p-5 md:p-6 shadow-soft hover:shadow-elegant transition-all text-center"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-primary-soft flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <s.icon className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-bold text-sm md:text-base text-foreground leading-snug min-h-[2.5rem] flex items-center justify-center">{s.title}</h3>
            <div className="mt-3 pt-3 border-t border-dashed border-border flex items-center justify-center gap-1 text-link-accent text-xs md:text-sm font-semibold group-hover:gap-2 transition-all">
              <span>مشاهده و خرید</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </motion.a>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <a href="#" className="gradient-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-bold shadow-elegant hover:shadow-glow transition">
          انواع بیمه‌های سامان
        </a>
      </div>
    </section>
  );
}

/* ---------------- E-SERVICES ---------------- */
function EServicesSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-8 text-foreground">خدمات الکترونیک</h2>
      <div className="gradient-primary rounded-3xl p-5 md:p-10 shadow-elegant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {eServices.map((s) => (
            <a key={s.title} href="#" className="bg-card hover:bg-card/95 rounded-2xl p-5 md:p-6 flex items-center gap-4 transition-all hover:scale-[1.02] shadow-soft">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-shrink-0">
                <s.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground text-sm md:text-base">{s.title}</div>
                <div className="text-link-accent text-xs mt-1 flex items-center gap-1 font-semibold">
                  مشاهده <ArrowLeft className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- MEDICAL CENTERS ---------------- */
function BranchesSection() {
  const [sel, setSel] = useState("");
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-red-600">مراکزدرمانی طرف قرارداد</h2>
        <p className="mt-2 text-muted-foreground">با بیش از ۶۰۰۰ مراکز درمانی طرف قرارداد فعال در سراسر کشور</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-muted rounded-3xl p-6">
          <label className="block text-sm font-semibold mb-2">انتخاب استان</label>
          <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring">
            <option value="">همه استان‌ها</option>
            {provinces.map((p) => <option key={p}>{p}</option>)}
          </select>
          <p className="mt-4 text-sm text-muted-foreground">
            {sel ? `مراکز درمانی استان ${sel} در جدول زیر نمایش داده می‌شود.` : "لطفاً یک استان انتخاب کنید یا از فیلترهای جدول استفاده کنید."}
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary-soft to-card rounded-3xl p-6 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-full">
            {provinces.slice(0, 15).map((p) => (
              <button key={p} onClick={() => setSel(p)} className={`text-xs px-2 py-2 rounded-lg border transition ${sel === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <DarmanetCentersTable ostan={sel} />
    </section>
  );
}

/* ---------------- APP ---------------- */
function AppSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="bg-card rounded-3xl overflow-hidden grid md:grid-cols-2 items-center shadow-elegant border border-border">
        <div className="relative h-full min-h-72 order-1 md:order-none">
          <img
            src={appPromo}
            alt="اپلیکیشن بیمه سامان"
            className="w-full h-full object-contain p-6 md:p-10"
            loading="lazy"
            width={1400}
            height={700}
          />
        </div>
        <div className="p-8 md:p-12 text-foreground">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-primary">اپلیکیشن بیمه سامان</h2>
          <p className="leading-8 text-muted-foreground mb-6 text-sm md:text-base">
            با اپلیکیشن بیمه سامان، تجربه‌ای جدید از مدیریت بیمه‌های خود را در دستانتان خواهید داشت.
            این اپلیکیشن به شما امکان می‌دهد به راحتی و در هر زمان و مکانی به تمامی خدمات بیمه‌ای خود
            دسترسی پیدا کنید. از اطلاع‌رسانی‌های لحظه‌ای گرفته تا پیگیری وضعیت بیمه‌ها و درخواست خدمات،
            همه چیز به شکلی ساده و سریع در دسترس شماست. با دانلود این اپلیکیشن، تمامی نیازهای بیمه‌ای
            خود را تنها با چند لمس پاسخ دهید.
          </p>
          <button className="bg-gradient-to-l from-red-600 to-red-500 text-white px-7 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-[0_10px_24px_-8px_rgba(220,38,38,0.55)] hover:scale-[1.03] transition">
            <Download className="w-4 h-4" /> دانلود اپلیکیشن
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONSULT FORM ---------------- */
function ConsultFormSection() {
  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    email: "",
    province: "",
    insuranceType: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.nationalId.trim() || !form.phone.trim()) {
      setStatus("error");
      setMessage("لطفاً نام، کد ملی و شماره همراه را وارد کنید.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const r = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus("ok");
        setMessage("درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.");
        setForm({ fullName: "", nationalId: "", phone: "", email: "", province: "", insuranceType: "", description: "" });
      } else {
        setStatus("error");
        setMessage(
          data.error === "webhook_not_configured"
            ? "آدرس Webhook هنوز پیکربندی نشده است. لطفاً CONSULT_WEBHOOK_URL را در تنظیمات اضافه کنید."
            : "ارسال ناموفق بود. لطفاً دوباره تلاش کنید.",
        );
      }
    } catch {
      setStatus("error");
      setMessage("خطا در ارتباط با سرور.");
    }
  };

  return (
    <section id="consult" className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">فرم مشاوره خرید بیمه</h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">کارشناسان ما در سریع‌ترین زمان با شما تماس خواهند گرفت</p>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1.5">نام و نام خانوادگی</label>
            <input value={form.fullName} onChange={update("fullName")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">کد ملی</label>
            <input value={form.nationalId} onChange={update("nationalId")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">شماره همراه</label>
            <input type="tel" value={form.phone} onChange={update("phone")} required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">ایمیل</label>
            <input type="email" value={form.email} onChange={update("email")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">استان</label>
            <select value={form.province} onChange={update("province")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring">
              <option value="">انتخاب استان</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">نوع بیمه</label>
            <select value={form.insuranceType} onChange={update("insuranceType")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring">
              <option value="">نوع بیمه را انتخاب کنید</option>
              <option>بیمه آتش‌سوزی</option><option>بیمه اتومبیل</option><option>بیمه باربری</option>
              <option>بیمه درمان</option><option>بیمه زندگی</option><option>بیمه مسافرتی</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">توضیحات</label>
            <textarea rows={3} value={form.description} onChange={update("description")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          {message && (
            <div className={`md:col-span-2 text-sm text-center rounded-xl px-4 py-3 ${status === "ok" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`}>
              {message}
            </div>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" disabled={status === "sending"} className="gradient-primary text-primary-foreground px-10 py-3.5 rounded-full font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
              {status === "sending" ? "در حال ارسال..." : "ارسال درخواست مشاوره"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------------- ABOUT + STATS ---------------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = to / 50;
    const id = setInterval(() => {
      s += step;
      if (s >= to) { s = to; clearInterval(id); }
      setN(Math.floor(s));
    }, 30);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>+{n.toLocaleString("fa-IR")}{suffix}</span>;
}

function AboutSection() {
  const stats = [
    { n: 55000, l: "بیمه‌شدگان بیمه عمر" },
    { n: 754, l: "نمایندگی فعال" },
    { n: 55000, l: "بیمه‌شدگان بیمه اتومبیل" },
  ];
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">درباره بیمه سامان</h2>
          <p className="leading-8 text-muted-foreground text-sm md:text-base">
            کادر کارشناسی بیمه سامان با دارا بودن تحصیلات دانشگاهی و آشنایی کامل با صنعت بیمه،
            زیر نظر مدیران با تجربه، سعی در حفظ منافع بیمه‌گزاران داشته و با ارائه مشاوره در زمینه
            مدیریت ریسک، از بروز خسارات احتمالی پیشگیری می‌کنند. این شرکت با اتکا به سرمایه‌های مالی
            و انسانی مناسب، همواره درصدد است تا خدماتی متمایز برای بیمه‌گزاران خود فراهم آورد.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-card rounded-2xl p-5 text-center shadow-soft border border-border">
              <div className="text-2xl md:text-3xl font-extrabold text-gradient">
                <Counter to={s.n} />
              </div>
              <div className="text-xs text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5 text-center shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-glow">
              <f.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-sm md:text-base">{f.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ARTICLES ---------------- */
function ArticlesSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center">مقاله‌های بیمه سامان</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {articles.map((a, i) => (
          <motion.article
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all group"
          >
            <div className="h-40 gradient-primary relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,white,transparent_60%)]" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-sm leading-6 mb-2 line-clamp-2 group-hover:text-primary transition">{a.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-6">{a.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">بیمه سامان</span>
                <a href="#" className="text-primary text-xs font-bold flex items-center gap-1">ادامه مطلب <ArrowLeft className="w-3 h-3" /></a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- NEWS TICKER ---------------- */
function NewsSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft">
        <h2 className="text-xl md:text-2xl font-extrabold mb-5 flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
          آخرین اخبار
        </h2>
        <ul className="grid md:grid-cols-2 gap-3">
          {news.map((n) => (
            <li key={n}>
              <a href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition group">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition" />
                <span className="text-sm leading-6 group-hover:text-primary transition">{n}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqCategories = ["همه دسته‌بندی‌ها", "بیمه آتش سوزی", "بیمه اتومبیل", "بیمه درمان", "بیمه عمر", "بیمه مسئولیت", "بیمه مسافرتی", "بیمه مهندسی"];

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [cat, setCat] = useState(0);
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">سوالات پرتکرار</h2>
      <p className="text-center text-sm text-muted-foreground mb-6">دسته‌بندی مورد نظر خود را انتخاب کنید</p>
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
        {faqCategories.map((c, i) => (
          <button
            key={c}
            onClick={() => setCat(i)}
            className={`text-xs md:text-sm px-4 py-2 rounded-full border transition ${
              cat === i ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card border-border hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-5 flex items-center justify-between text-right">
              <span className="font-bold text-sm md:text-base">{f.q}</span>
              <ChevronDown className={`w-5 h-5 text-primary transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-7 border-t border-border pt-4">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <a href="#" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:text-primary-foreground transition">
          مشاهده همه سوالات متداول <ArrowLeft className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

/* ---------------- PARTNERS ---------------- */
const partners = ["بانک سامان", "سامان‌بوم", "تامین سرمایه سامان", "کارگزاری سامان", "لیزینگ سامان", "صرافی سامان"];
function PartnersSection() {
  return (
    <section className="container mx-auto px-4 mt-16 md:mt-24">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">شرکای تجاری</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {partners.map((p) => (
          <div key={p} className="aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-4 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-primary-foreground font-extrabold text-xl">س</span>
            </div>
            <div className="text-xs md:text-sm font-bold text-center text-foreground leading-tight">{p}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

