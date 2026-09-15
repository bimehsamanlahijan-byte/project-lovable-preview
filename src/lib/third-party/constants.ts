/** Static option lists taken from the captured reference widget. */

export const PLATE_LETTERS = [
  "الف", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ",
  "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م",
  "ن", "و", "ه", "ی", "D", "S", "ژ (معلولین)",
];

/** تخفیف عدم خسارت ثالث / حوادث راننده — همان درصدهای مرجع */
export const DISCOUNT_PERCENTS = [
  { id: "0", label: "تخفیفی ندارم", value: "0" },
  { id: "5", label: "۵ درصد", value: "5" },
  { id: "10", label: "۱۰ درصد", value: "10" },
  { id: "15", label: "۱۵ درصد", value: "15" },
  { id: "20", label: "۲۰ درصد", value: "20" },
  { id: "25", label: "۲۵ درصد", value: "25" },
  { id: "30", label: "۳۰ درصد", value: "30" },
  { id: "35", label: "۳۵ درصد", value: "35" },
  { id: "40", label: "۴۰ درصد", value: "40" },
  { id: "45", label: "۴۵ درصد", value: "45" },
  { id: "50", label: "۵۰ درصد", value: "50" },
  { id: "55", label: "۵۵ درصد", value: "55" },
  { id: "60", label: "۶۰ درصد", value: "60" },
  { id: "65", label: "۶۵ درصد", value: "65" },
  { id: "70", label: "۷۰ درصد", value: "70" },
];

export const FINANCE_DAMAGE_OPTIONS = [
  { id: "0", label: "فاقد خسارت مالی" },
  { id: "1", label: "یک بار خسارت مالی" },
  { id: "2", label: "دوبار خسارت مالی" },
  { id: "3", label: "سه بار خسارت مالی و یا بیشتر" },
];

export const LIFE_DAMAGE_OPTIONS = [
  { id: "0", label: "فاقد خسارت جانی" },
  { id: "1", label: "یک بار خسارت جانی" },
  { id: "2", label: "دوبار خسارت جانی" },
  { id: "3", label: "سه بار خسارت جانی و یا بیشتر" },
];

export const DRIVER_DAMAGE_OPTIONS = [
  { id: "0", label: "فاقد حوادث راننده" },
  { id: "1", label: "یک بار حوادث راننده" },
  { id: "2", label: "دوبار حوادث راننده" },
  { id: "3", label: "سه بار حوادث راننده و یا بیشتر" },
];

export const STEPS = [
  { id: "owner", title: "اطلاعات متقاضی" },
  { id: "vehicle", title: "مشخصات خودرو" },
  { id: "previous", title: "بیمه‌نامه قبلی" },
  { id: "discount", title: "تخفیف و خسارت" },
  { id: "price", title: "استعلام قیمت" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/** ارقام فارسی/عربی را به انگلیسی تبدیل می‌کند (مثل handleFaToEnDigits مرجع) */
export function toEnDigits(input: string): string {
  return (input ?? "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function toFaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

export function formatRial(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return toFaDigits(Math.round(value).toLocaleString("en-US")) + " ریال";
}
