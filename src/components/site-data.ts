import headerLogo from "@/assets/logoheder.png";
import footerLogo from "@/assets/logofooter.png";

export type NavItem = { label: string; href?: string; children?: NavItem[] };

// Menu structure mirrored from the reference site si24.ir (full sub-sub structure)
export const navItems: NavItem[] = [
  { label: "طµظپط­ظ‡ ط§طµظ„غŒ", href: "/" },
  {
    label: "ط§ظ†ظˆط§ط¹ ط¨غŒظ…ظ‡â€Œظ‡ط§",
    href: "/insurance",
    children: [
      {
        label: "ط¨غŒظ…ظ‡ ط¢طھط´â€Œط³ظˆط²غŒ",
        href: "/insurance/fire",
        children: [
          { label: "ط¨غŒظ…ظ‡ ظ…ظ†ط§ط²ظ„ ظ…ط³ع©ظˆظ†غŒ", href: "/insurance/fire/residential" },
          { label: "ط¨غŒظ…ظ‡ ط¢طھط´â€Œط³ظˆط²غŒ طµظ†ط¹طھغŒ", href: "/insurance/fire/industrial" },
          { label: "ط¨غŒظ…ظ‡ ط¢طھط´â€Œط³ظˆط²غŒ ط؛غŒط±طµظ†ط¹طھغŒ", href: "/insurance/fire/non-industrial" },
          { label: "ط¨غŒظ…ظ‡ ط¹غŒظˆط¨ ط§ط³ط§ط³غŒ ظˆ ظ¾ظ†ظ‡ط§ظ† ط³ط§ط®طھظ…ط§ظ†", href: "/insurance/fire/hidden-defects" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ط§طھظˆظ…ط¨غŒظ„",
        href: "/insurance/car",
        children: [
          { label: "ط¨غŒظ…ظ‡ ط´ط®طµ ط«ط§ظ„ط«", href: "/insurance/car/third-party" },
          { label: "ط¨غŒظ…ظ‡ ط¨ط¯ظ†ظ‡", href: "/insurance/car/body" },
          { label: "ط¨غŒظ…ظ‡ ط­ظˆط§ط¯ط« ط±ط§ظ†ظ†ط¯ظ‡", href: "/insurance/car/driver-accident" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ط¨ط§ط±ط¨ط±غŒ",
        href: "/insurance/cargo",
        children: [
          { label: "ط¨غŒظ…ظ‡ ط¨ط§ط±ط¨ط±غŒ ظˆط§ط±ط¯ط§طھغŒ", href: "/insurance/cargo/import-cargo" },
          { label: "ط¨غŒظ…ظ‡ ط¨ط§ط±ط¨ط±غŒ طµط§ط¯ط±ط§طھغŒ", href: "/insurance/cargo/export-cargo" },
          { label: "ط¨غŒظ…ظ‡ ط¨ط§ط±ط¨ط±غŒ ط¯ط§ط®ظ„غŒ", href: "/insurance/cargo/internal-cargo" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ طھط¬ظ‡غŒط²ط§طھ ط§ظ„ع©طھط±ظˆظ†غŒع©",
        href: "/insurance/e-e",
        children: [
          { label: "ط¨غŒظ…ظ‡ ظ…ظˆط¨ط§غŒظ„ ظˆ طھط¨ظ„طھ", href: "/insurance/e-e/phone" },
          { label: "ط¨غŒظ…ظ‡ طھط¬ظ‡غŒط²ط§طھ ط§ظ„ع©طھط±ظˆظ†غŒع©", href: "/insurance/e-e/equipment" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ط¯ط±ظ…ط§ظ†",
        href: "/insurance/health",
        children: [
          { label: "ط¨غŒظ…ظ‡ ط¯ط±ظ…ط§ظ† ط®ط§ظ†ظˆط§ط¯ظ‡", href: "/insurance/health/private-health" },
          { label: "ط¨غŒظ…ظ‡ ط¯ط±ظ…ط§ظ† ع¯ط±ظˆظ‡غŒ", href: "/insurance/health/group" },
          { label: "ط¨غŒظ…ظ‡ ط¯ط±ظ…ط§ظ† ظ…ط³ط§ظپط±طھغŒ", href: "/insurance/health/travel-health" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ط²ظ†ط¯ع¯غŒ",
        href: "/insurance/life",
        children: [
          { label: "ط¨غŒظ…ظ‡ ط¹ظ…ط± ط¨ط± ظ¾ط§غŒظ‡ ط·ظ„ط§ (ط²ط±ط³ط§ظ…)", href: "/insurance/life/gold" },
          { label: "ط¨غŒظ…ظ‡ ط¹ظ…ط± ظˆ ط³ط±ظ…ط§غŒظ‡â€Œع¯ط°ط§ط±غŒ", href: "/insurance/life/investment" },
          { label: "ط¨غŒظ…ظ‡ ط¹ظ…ط± ط²ظ…ط§ظ†غŒ", href: "/insurance/life/term" },
          { label: "ط¨غŒظ…ظ‡ ظ…ط§ظ†ط¯ظ‡ ط¨ط¯ظ‡ع©ط§ط±", href: "/insurance/life/debit-balance" },
          { label: "ط¨غŒظ…ظ‡ ط­ظˆط§ط¯ط« ط§ظ†ظپط±ط§ط¯غŒ", href: "/insurance/life/accident/individual-personal-accident" },
          { label: "ط¨غŒظ…ظ‡ ط­ظˆط§ط¯ط« ع¯ط±ظˆظ‡غŒ", href: "/insurance/life/accident/group-accident" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ع©ط´طھغŒ ظˆ ظ‡ظˆط§ظ¾غŒظ…ط§",
        href: "/insurance/marine-aviation",
        children: [
          { label: "ط¨غŒظ…ظ‡ ط¨ط¯ظ†ظ‡ ط´ظ†ط§ظˆط±", href: "/insurance/marine-aviation/hull" },
          { label: "ط¨غŒظ…ظ‡ ط¨ط¯ظ†ظ‡ ظ‡ظˆط§ظ¾غŒظ…ط§", href: "/insurance/marine-aviation/aircraft" },
        ],
      },
      {
        label: "ط¨غŒظ…ظ‡ ظ…ط³ط¦ظˆظ„غŒطھ",
        href: "/insurance/liability",
        children: [
          { label: "ط¨غŒظ…ظ‡ ظ…ط³ط¦ظˆظ„غŒطھ ع©ط§ط±ظپط±ظ…ط§", href: "/insurance/liability/employer" },
          { label: "ط¨غŒظ…ظ‡ ظ…ط³ط¦ظˆظ„غŒطھ ط­ط±ظپظ‡â€Œط§غŒ ظ¾ط²ط´ع©ط§ظ†", href: "/insurance/liability/medical" },
          { label: "ط¨غŒظ…ظ‡ ظ…ط³ط¦ظˆظ„غŒطھ ط³ط§ط²ظ†ط¯ع¯ط§ظ† ط§ط¨ظ†غŒظ‡", href: "/insurance/liability/construction" },
          { label: "ط¨غŒظ…ظ‡ ظ…ط³ط¦ظˆظ„غŒطھ ط¹ظ…ظˆظ…غŒ", href: "/insurance/liability/general" },
        ],
      },
      { label: "ط¨غŒظ…ظ‡ ظ…ط³ط§ظپط±طھغŒ", href: "/insurance/travel" },
      {
        label: "ط¨غŒظ…ظ‡ ظ…ظ‡ظ†ط¯ط³غŒ",
        href: "/insurance/engineering",
        children: [
          { label: "طھظ…ط§ظ… ط®ط·ط± ظ¾غŒظ…ط§ظ†ع©ط§ط±ط§ظ†", href: "/insurance/engineering/contractor-all-risk" },
          { label: "ط¨غŒظ…ظ‡ ط³ط§ط²ظ‡â€Œظ‡ط§غŒ طھع©ظ…غŒظ„â€Œط´ط¯ظ‡", href: "/insurance/engineering/completed-structures" },
          { label: "ط¨غŒظ…ظ‡ ظ…ط§ط´غŒظ†â€Œط¢ظ„ط§طھ", href: "/insurance/engineering/machinery" },
        ],
      },
      { label: "ط¨غŒظ…ظ‡â€Œظ‡ط§غŒ ط®ط§طµ", href: "/insurance/special" },
      { label: "ط§ظ†ظˆط§ط¹ ط¨غŒظ…ظ‡â€Œظ‡ط§غŒ ط³ط§ظ…ط§ظ†", href: "/insurance" },
    ],
  },
  { label: "ط´ط¹ط¨ ظˆ ظ†ظ…ط§غŒظ†ط¯ع¯ط§ظ†", href: "/branches" },
  {
    label: "ط®ط¯ظ…ط§طھ ط§ظ„ع©طھط±ظˆظ†غŒع©",
    href: "/e-services",
    children: [
      { label: "ط§ط³طھط¹ظ„ط§ظ… ظˆط¶ط¹غŒطھ ط¨غŒظ…ظ‡â€Œظ†ط§ظ…ظ‡", href: "/e-services/insurance-status" },
      { label: "ع©ط§ط±طھط§ط¨ظ„ ط¨غŒظ…ظ‡â€Œع¯ط°ط§ط±ط§ظ†", href: "/e-services/insured-dashboard" },
      { label: "ظ¾ط±ط¯ط§ط®طھ ط¢ظ†ظ„ط§غŒظ† ط­ظ‚ ط¨غŒظ…ظ‡", href: "/e-services/insurance-payment" },
    ],
  },
  { label: "ع¯ط²ط§ط±ط´ع¯ط±غŒ ظˆ ط§ظپط´ط§غŒ ط§ط·ظ„ط§ط¹ط§طھ", href: "/reporting" },
  { label: "ط§ط±طھط¨ط§ط· ط¨ط§ ظ…ط§", href: "/contact" },
  { label: "ظ…ط¬ظ„ظ‡ ظˆ ط®ط¨ط±", href: "/blog" },
];

export const SITE_LOGO = footerLogo;
export const SITE_LOGO_HEADER = headerLogo;

// Contact info â€” update these once for whole site
export const SITE_CONTACT = {
  address: "ظ„ط§ظ‡غŒط¬ط§ظ†طŒ ط®غŒط§ط¨ط§ظ† ط§ظ…ط§ظ… ط®ظ…غŒظ†غŒطŒ ط±ظˆط¨ط±ظˆغŒ ط¨ط§ظ†ع© طھظˆط³ط¹ظ‡ ظˆ طھط¹ط§ظˆظ†طŒ ظ…ط¬طھظ…ط¹ ظ¾ط§ط±ط§ط¯ط§غŒط³",
  mobilePhone: "09116169215",
  landlinePhone: "01342249250",
  email: "info@parsianbimeh.ir",
};

// Webhook for the consultation form (placeholder â€” replace later with the real URL)
export const FORM_WEBHOOK_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_FORM_WEBHOOK_URL) ||
  "https://example.com/webhook/insurance-consultation";




