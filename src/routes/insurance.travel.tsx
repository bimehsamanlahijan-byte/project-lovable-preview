import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plane,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BadgeCheck,
  Users,
  CalendarDays,
  Globe2,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { InsuranceWheel } from "@/components/InsuranceWheel";
import { SiteFooter } from "@/components/SiteFooter";
import { LongformSections } from "@/components/LongformSections";
import {
  AGE_BANDS,
  CEILINGS,
  DURATIONS,
  ZONES,
  calcPremium,
  formatRial,
  labelOf,
  type ZoneKey,
} from "@/lib/travel-pricing";

export const Route = createFileRoute("/insurance/travel")({
  head: () => ({
    meta: [
      { title: "خرید آنلاین بیمه مسافرتی | نمایندگی آذرخش بیمه سامان" },
      {
        name: "description",
        content:
          "استعلام لحظه‌ای نرخ و خرید آنلاین بیمه مسافرتی مورد تأیید سفارت‌ها؛ انتخاب مقصد، مدت سفر و سقف پوشش تا ۱۰۰ هزار یورو و ثبت آنی درخواست صدور.",
      },
      { property: "og:title", content: "خرید آنلاین بیمه مسافرتی — بیمه سامان آذرخش" },
      {
        property: "og:description",
        content: "نرخ لحظه‌ای بیمه مسافرتی شنگن، آسیا و آمریکا و ثبت آنلاین درخواست صدور بیمه‌نامه.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TravelPurchasePage,
});

const COVERAGES = [
  "هزینه‌های پزشکی و بستری اضطراری در خارج از کشور",
  "بازگرداندن بیمار و انتقال جسد به ایران",
  "از دست رفتن یا تأخیر چمدان",
  "تأخیر و لغو پرواز",
  "مفقود شدن مدارک مسافرتی",
  "مسئولیت مدنی در برابر اشخاص ثالث",
];

type Step = 0 | 1 | 2;

function TravelPurchasePage() {
  const [step, setStep] = useState<Step>(0);
  const [zone, setZone] = useState<ZoneKey>("schengen");
  const [duration, setDuration] = useState("15");
  const [ceiling, setCeiling] = useState("50");
  const [age, setAge] = useState("13-65");
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState("");

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [passport, setPassport] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const premium = useMemo(
    () => calcPremium({ zone, duration, ceiling, age, travelers }),
    [zone, duration, ceiling, age, travelers],
  );

  const canSubmit = fullName.trim().length > 1 && nationalId.trim().length > 4 && phone.trim().length > 7;

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/travel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          nationalId,
          passport,
          birthDate,
          phone,
          email,
          zone,
          zoneLabel: ZONES.find((z) => z.key === zone)?.label ?? zone,
          duration,
          durationLabel: labelOf(DURATIONS, duration),
          ceilingLabel: labelOf(CEILINGS, ceiling),
          ageLabel: labelOf(AGE_BANDS, age),
          travelers,
          startDate,
          premium,
          note,
        }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string };
      if (!res.ok || !data.ok) throw new Error("failed");
      setCode(data.code ?? "");
      setStep(2);
    } catch {
      setError("ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید یا با ۰۹۱۱۶۱۶۹۲۱۵ تماس بگیرید.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <InsuranceWheel />

      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center flex-wrap gap-2 text-xs opacity-85 mb-4">
            <a href="/" className="hover:underline">خانه</a>
            <ChevronLeft className="w-3 h-3" />
            <a href="/insurance" className="hover:underline">انواع بیمه‌ها</a>
            <ChevronLeft className="w-3 h-3" />
            <span>بیمه مسافرتی</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <Plane className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-extrabold">خرید آنلاین بیمه مسافرتی</h1>
          </div>
          <p className="text-sm md:text-base opacity-90 max-w-3xl leading-8">
            نرخ بیمه‌نامه را در چند ثانیه استعلام بگیرید و درخواست صدور را همین‌جا ثبت کنید. بیمه‌نامه به زبان
            انگلیسی و مورد تأیید سفارتخانه‌های حوزه شنگن صادر می‌شود.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="bg-card border border-border rounded-3xl shadow-soft p-5 md:p-8">
          <Stepper step={step} />

          {step === 0 && (
            <div className="space-y-6 mt-6">
              <Field icon={<Globe2 className="w-4 h-4" />} label="مقصد سفر">
                <div className="grid sm:grid-cols-2 gap-2">
                  {ZONES.map((z) => (
                    <Choice key={z.key} active={zone === z.key} onClick={() => setZone(z.key)} label={z.label} />
                  ))}
                </div>
              </Field>

              <Field icon={<CalendarDays className="w-4 h-4" />} label="مدت سفر">
                <div className="grid sm:grid-cols-3 gap-2">
                  {DURATIONS.map((d) => (
                    <Choice key={d.key} active={duration === d.key} onClick={() => setDuration(d.key)} label={d.label} />
                  ))}
                </div>
              </Field>

              <Field icon={<ShieldCheck className="w-4 h-4" />} label="سقف تعهد پزشکی">
                <div className="grid sm:grid-cols-3 gap-2">
                  {CEILINGS.map((c) => (
                    <Choice key={c.key} active={ceiling === c.key} onClick={() => setCeiling(c.key)} label={c.label} />
                  ))}
                </div>
              </Field>

              <Field icon={<Users className="w-4 h-4" />} label="رده سنی مسافر">
                <div className="grid sm:grid-cols-4 gap-2">
                  {AGE_BANDS.map((a) => (
                    <Choice key={a.key} active={age === a.key} onClick={() => setAge(a.key)} label={a.label} />
                  ))}
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-muted-foreground">تعداد مسافر</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-muted-foreground">تاریخ شروع سفر (اختیاری)</span>
                  <input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="مثلاً ۱۴۰۵/۰۶/۱۵"
                    className="mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
                  />
                </label>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-full hover:opacity-90 transition"
              >
                ادامه و تکمیل مشخصات
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="نام و نام خانوادگی *" value={fullName} onChange={setFullName} />
                <Input label="کد ملی *" value={nationalId} onChange={setNationalId} dir="ltr" />
                <Input label="شماره گذرنامه" value={passport} onChange={setPassport} dir="ltr" />
                <Input label="تاریخ تولد" value={birthDate} onChange={setBirthDate} placeholder="۱۳۷۰/۰۵/۰۱" />
                <Input label="شماره موبایل *" value={phone} onChange={setPhone} dir="ltr" />
                <Input label="ایمیل" value={email} onChange={setEmail} dir="ltr" />
              </div>
              <label className="block">
                <span className="text-xs font-bold text-muted-foreground">توضیحات تکمیلی</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
                />
              </label>

              {error && <div className="text-xs text-destructive font-bold">{error}</div>}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-2 border border-border text-sm font-bold px-6 py-3 rounded-full hover:bg-muted transition"
                >
                  <ChevronRight className="w-4 h-4" />
                  بازگشت
                </button>
                <button
                  onClick={submit}
                  disabled={!canSubmit || busy}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-full disabled:opacity-50 hover:opacity-90 transition"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                  ثبت نهایی درخواست صدور
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-6">
                پس از ثبت، کارشناس نمایندگی برای تأیید اطلاعات و ارسال لینک پرداخت با شما تماس می‌گیرد. مبلغ نمایش
                داده‌شده برآورد اولیه است و نرخ قطعی پس از بررسی مدارک اعلام می‌شود.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold mb-2">درخواست شما ثبت شد</h2>
              <p className="text-sm text-muted-foreground leading-7 max-w-md mx-auto">
                کد پیگیری شما <span className="font-mono font-bold text-foreground">{code}</span> است. این کد را
                نزد خود نگه دارید؛ کارشناس ما به‌زودی تماس می‌گیرد.
              </p>
              <button
                onClick={() => {
                  setStep(0);
                  setCode("");
                }}
                className="mt-6 inline-flex items-center gap-2 border border-border text-sm font-bold px-6 py-3 rounded-full hover:bg-muted transition"
              >
                ثبت درخواست جدید
              </button>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-elegant">
            <div className="text-xs opacity-85 mb-1">حق بیمه برآوردی</div>
            <div className="text-3xl font-extrabold">{formatRial(premium)}</div>
            <div className="text-xs opacity-85 mt-1">ریال</div>
            <ul className="mt-5 space-y-2 text-xs opacity-95">
              <li>مقصد: {ZONES.find((z) => z.key === zone)?.label}</li>
              <li>مدت: {labelOf(DURATIONS, duration)}</li>
              <li>سقف پوشش: {labelOf(CEILINGS, ceiling)}</li>
              <li>رده سنی: {labelOf(AGE_BANDS, age)}</li>
              <li>تعداد مسافر: {travelers}</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft">
            <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              پوشش‌های بیمه‌نامه
            </h3>
            <ul className="space-y-2">
              {COVERAGES.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs leading-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <LongformSections path="/insurance/travel" />

      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ["مشخصات سفر", "اطلاعات بیمه‌شده", "تأیید نهایی"];
  return (
    <div className="flex items-center gap-2">
      {items.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div
            className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-xs font-bold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
          {i < items.length - 1 && <div className="h-px flex-1 bg-border" />}
        </div>
      ))}
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-sm font-extrabold">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  );
}

function Choice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-bold rounded-xl border px-4 py-3 text-center transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        dir={dir}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full text-sm rounded-xl border border-border bg-background px-4 py-3"
      />
    </label>
  );
}
