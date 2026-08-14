export type ZoneKey = "schengen" | "asia" | "americas" | "world";

export const ZONES: { key: ZoneKey; label: string; factor: number }[] = [
  { key: "schengen", label: "اروپا / حوزه شنگن", factor: 1 },
  { key: "asia", label: "آسیا و خاورمیانه", factor: 0.8 },
  { key: "americas", label: "آمریکا و کانادا", factor: 1.85 },
  { key: "world", label: "سایر نقاط جهان", factor: 1.25 },
];

export const CEILINGS: { key: string; label: string; factor: number }[] = [
  { key: "30", label: "۳۰ هزار یورو", factor: 1 },
  { key: "50", label: "۵۰ هزار یورو", factor: 1.3 },
  { key: "100", label: "۱۰۰ هزار یورو", factor: 1.75 },
];

export const AGE_BANDS: { key: string; label: string; factor: number }[] = [
  { key: "0-12", label: "زیر ۱۲ سال", factor: 0.7 },
  { key: "13-65", label: "۱۳ تا ۶۵ سال", factor: 1 },
  { key: "66-75", label: "۶۶ تا ۷۵ سال", factor: 2 },
  { key: "76-85", label: "۷۶ تا ۸۵ سال", factor: 3.2 },
];

export const DURATIONS: { key: string; label: string; days: number; base: number }[] = [
  { key: "7", label: "تا ۷ روز", days: 7, base: 950_000 },
  { key: "15", label: "تا ۱۵ روز", days: 15, base: 1_250_000 },
  { key: "31", label: "تا ۳۱ روز", days: 31, base: 1_750_000 },
  { key: "62", label: "تا ۶۲ روز", days: 62, base: 2_650_000 },
  { key: "92", label: "تا ۹۲ روز", days: 92, base: 3_500_000 },
  { key: "180", label: "تا ۶ ماه", days: 180, base: 5_400_000 },
  { key: "365", label: "یک ساله", days: 365, base: 8_900_000 },
];

export type QuoteInput = {
  zone: ZoneKey;
  duration: string;
  ceiling: string;
  age: string;
  travelers: number;
};

export function calcPremium(i: QuoteInput): number {
  const z = ZONES.find((x) => x.key === i.zone)?.factor ?? 1;
  const d = DURATIONS.find((x) => x.key === i.duration)?.base ?? 950_000;
  const c = CEILINGS.find((x) => x.key === i.ceiling)?.factor ?? 1;
  const a = AGE_BANDS.find((x) => x.key === i.age)?.factor ?? 1;
  const n = Math.max(1, Math.min(10, i.travelers || 1));
  const raw = d * z * c * a * n;
  return Math.round(raw / 1000) * 1000;
}

export function formatRial(v: number): string {
  return v.toLocaleString("fa-IR");
}

export function labelOf(list: { key: string; label: string }[], key: string): string {
  return list.find((x) => x.key === key)?.label ?? key;
}
