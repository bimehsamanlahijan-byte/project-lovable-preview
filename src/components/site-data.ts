export type NavItem = { label: string; href?: string; children?: NavItem[] };

// Menu structure mirrored from the reference site si24.ir (full sub-sub structure)
export const navItems: NavItem[] = [
  { label: "صفحه اصلی", href: "/" },
  {
    label: "انواع بیمه‌ها",
    href: "/insurance",
    children: [
      {
        label: "بیمه آتش‌سوزی",
        href: "/insurance/fire",
        children: [
          { label: "بیمه منازل مسکونی", href: "/insurance/fire/residential" },
          { label: "بیمه آتش‌سوزی صنعتی", href: "/insurance/fire/industrial" },
          { label: "بیمه آتش‌سوزی غیرصنعتی", href: "/insurance/fire/non-industrial" },
          { label: "بیمه عیوب اساسی و پنهان ساختمان", href: "/insurance/fire/hidden-defects" },
        ],
      },
      {
        label: "بیمه اتومبیل",
        href: "/insurance/car",
        children: [
          { label: "بیمه شخص ثالث", href: "/insurance/car/third-party" },
          { label: "بیمه بدنه", href: "/insurance/car/body" },
          { label: "بیمه حوادث راننده", href: "/insurance/car/driver-accident" },
        ],
      },
      {
        label: "بیمه باربری",
        href: "/insurance/cargo",
        children: [
          { label: "بیمه باربری وارداتی", href: "/insurance/cargo/import-cargo" },
          { label: "بیمه باربری صادراتی", href: "/insurance/cargo/export-cargo" },
          { label: "بیمه باربری داخلی", href: "/insurance/cargo/internal-cargo" },
        ],
      },
      {
        label: "بیمه تجهیزات الکترونیک",
        href: "/insurance/e-e",
        children: [
          { label: "بیمه موبایل و تبلت", href: "/insurance/e-e/phone" },
          { label: "بیمه تجهیزات الکترونیک", href: "/insurance/e-e/equipment" },
        ],
      },
      {
        label: "بیمه درمان",
        href: "/insurance/health",
        children: [
          { label: "بیمه درمان خانواده", href: "/insurance/health/private-health" },
          { label: "بیمه درمان گروهی", href: "/insurance/health/group" },
          { label: "بیمه درمان مسافرتی", href: "/insurance/health/travel-health" },
        ],
      },
      {
        label: "بیمه زندگی",
        href: "/insurance/life",
        children: [
          { label: "بیمه عمر بر پایه طلا (زرسام)", href: "/insurance/life/gold" },
          { label: "بیمه عمر و سرمایه‌گذاری", href: "/insurance/life/investment" },
          { label: "بیمه عمر زمانی", href: "/insurance/life/term" },
          { label: "بیمه مانده بدهکار", href: "/insurance/life/debit-balance" },
          { label: "بیمه حوادث انفرادی", href: "/insurance/life/accident/individual-personal-accident" },
          { label: "بیمه حوادث گروهی", href: "/insurance/life/accident/group-accident" },
        ],
      },
      {
        label: "بیمه کشتی و هواپیما",
        href: "/insurance/marine-aviation",
        children: [
          { label: "بیمه بدنه شناور", href: "/insurance/marine-aviation/hull" },
          { label: "بیمه بدنه هواپیما", href: "/insurance/marine-aviation/aircraft" },
        ],
      },
      {
        label: "بیمه مسئولیت",
        href: "/insurance/liability",
        children: [
          { label: "بیمه مسئولیت کارفرما", href: "/insurance/liability/employer" },
          { label: "بیمه مسئولیت حرفه‌ای پزشکان", href: "/insurance/liability/medical" },
          { label: "بیمه مسئولیت سازندگان ابنیه", href: "/insurance/liability/construction" },
          { label: "بیمه مسئولیت عمومی", href: "/insurance/liability/general" },
        ],
      },
      { label: "بیمه مسافرتی", href: "/insurance/travel" },
      {
        label: "بیمه مهندسی",
        href: "/insurance/engineering",
        children: [
          { label: "تمام خطر پیمانکاران", href: "/insurance/engineering/contractor-all-risk" },
          { label: "بیمه سازه‌های تکمیل‌شده", href: "/insurance/engineering/completed-structures" },
          { label: "بیمه ماشین‌آلات", href: "/insurance/engineering/machinery" },
        ],
      },
      { label: "بیمه‌های خاص", href: "/insurance/special" },
      { label: "انواع بیمه‌های سامان", href: "/insurance" },
    ],
  },
  { label: "شعب و نمایندگان", href: "/branches" },
  {
    label: "خدمات الکترونیک",
    href: "/e-services",
    children: [
      { label: "استعلام وضعیت بیمه‌نامه", href: "/e-services/insurance-status" },
      { label: "کارتابل بیمه‌گذاران", href: "/e-services/insured-dashboard" },
      { label: "پرداخت آنلاین حق بیمه", href: "/e-services/insurance-payment" },
    ],
  },
  { label: "گزارشگری و افشای اطلاعات", href: "/reporting" },
  { label: "ارتباط با ما", href: "/contact" },
  { label: "مجله و خبر", href: "/blog" },
];

export const SITE_LOGO = "https://si8452.ir/img/logofooter.png";
export const SITE_LOGO_HEADER = "https://si8452.ir/img/logoheder.png";

// Contact info — update these once for whole site
export const SITE_CONTACT = {
  address: "لاهیجان، خیابان امام خمینی، روبروی بانک توسعه و تعاون، مجتمع پارادایس",
  mobilePhone: "09116169215",
  landlinePhone: "01342249250",
  email: "info@parsianbimeh.ir",
};

// Webhook for the consultation form (placeholder — replace later with the real URL)
export const FORM_WEBHOOK_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FORM_WEBHOOK_URL) ||
  "https://example.com/webhook/insurance-consultation";
