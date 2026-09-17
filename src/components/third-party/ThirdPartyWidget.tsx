/** ویجت چندمرحله‌ای بیمه شخص ثالث — بازسازی دقیق ویجت مرجع SI24 */
import * as React from "react";
import {
  fetchLookup,
  fetchVehicleKinds,
  startInquiry,
  calculatePrice,
  fetchSummary,
  extractQuote,
  type ApiError,
} from "@/lib/third-party/client";
import {
  PLATE_LETTERS,
  DISCOUNT_PERCENTS,
  FINANCE_DAMAGE_OPTIONS,
  LIFE_DAMAGE_OPTIONS,
  DRIVER_DAMAGE_OPTIONS,
  STEPS,
  toEnDigits,
  toFaDigits,
  formatRial,
  type StepId,
} from "@/lib/third-party/constants";
import {
  validateOwnerStep,
  validateVehicleStep,
  validatePreviousStep,
  validateDiscountStep,
  normalizedStartPayload,
  normalizedManualData,
  type Errors,
} from "@/lib/third-party/validation";
import type { LookupItem, ThirdPartyForm, QuoteData } from "@/lib/third-party/types";

const TRACKING_KEY = "tp_tracking_code";
const REFERENCE_KEY = "tp_reference_code";

const EMPTY_FORM: ThirdPartyForm = {
  plaque: { region: "", letter: "", segment1: "", segment2: "" },
  owner: { nationalCode: "", postalCode: "", birthDate: "", mobile: "" },
  vehicle: { carGroup: "", usageType: "", brand: "", vehicleKindId: "", fuelType: "", builtYear: "" },
  previousInsurance: {
    previousInsuranceCorpId: "",
    previousPolicyBeginDate: "",
    previousPolicyEndDate: "",
    previousInsuranceFile: "",
  },
  discount: {
    penaltyForCarInsuranceRenewal: "",
    discountDriverYearPercent: "",
    transferredPlaque: "no",
    discountFinanceYearNumber: "",
    discountLifeYearNumber: "",
    discountDriverYearNumber: "",
  },
};

type Toast = { id: number; kind: "error" | "info"; text: string };

function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const push = React.useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);
  return { toasts, push };
}

function errText(e: unknown): string {
  const err = e as ApiError;
  const base = err?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  return err?.referenceCode ? `${base} (کد پیگیری درخواست: ${err.referenceCode})` : base;
}

function errReference(e: unknown): string | null {
  return (e as ApiError)?.referenceCode ?? null;
}

/** Select ساده با استایل مرجع */
function Field(props: {
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tp-field">
      <label className="tp-label">{props.label}</label>
      {props.children}
      {props.error ? (
        <span className="tp-error">{props.error}</span>
      ) : props.help ? (
        <span className="tp-help">{props.help}</span>
      ) : null}
    </div>
  );
}

function LookupSelect(props: {
  value: string;
  onChange: (v: string) => void;
  options: LookupItem[];
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <select
      className="tp-select"
      value={props.value}
      disabled={props.disabled || props.loading}
      aria-invalid={props.invalid || undefined}
      onChange={(e) => props.onChange(e.target.value)}
    >
      <option value="">{props.loading ? "در حال دریافت..." : props.placeholder}</option>
      {props.options.map((o) => (
        <option key={String(o.id)} value={String(o.id)}>
          {o.title}
        </option>
      ))}
    </select>
  );
}

function StaticSelect(props: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <select
      className="tp-select"
      value={props.value}
      aria-invalid={props.invalid || undefined}
      onChange={(e) => props.onChange(e.target.value)}
    >
      <option value="">{props.placeholder}</option>
      {props.options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ThirdPartyWidget() {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [form, setForm] = React.useState<ThirdPartyForm>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Errors>({});
  const [loading, setLoading] = React.useState(false);
  const [trackingCode, setTrackingCode] = React.useState<string | null>(null);
  const [referenceCode, setReferenceCode] = React.useState<string | null>(null);
  const [quote, setQuote] = React.useState<QuoteData | null>(null);
  const [summaryRaw, setSummaryRaw] = React.useState<any>(null);
  const { toasts, push } = useToasts();

  const [carGroups, setCarGroups] = React.useState<LookupItem[]>([]);
  const [carUsages, setCarUsages] = React.useState<LookupItem[]>([]);
  const [brands, setBrands] = React.useState<LookupItem[]>([]);
  const [kinds, setKinds] = React.useState<LookupItem[]>([]);
  const [fuelTypes, setFuelTypes] = React.useState<LookupItem[]>([]);
  const [companies, setCompanies] = React.useState<LookupItem[]>([]);
  const [lookupsLoading, setLookupsLoading] = React.useState(false);
  const [kindsLoading, setKindsLoading] = React.useState(false);

  const step: StepId = STEPS[stepIdx]!.id;

  const set = React.useCallback(
    (path: string, value: string) => {
      setForm((f) => {
        const [section, key] = path.split(".") as [keyof ThirdPartyForm, string];
        return { ...f, [section]: { ...(f[section] as any), [key]: value } };
      });
      setErrors((e) => {
        if (!e[path]) return e;
        const next = { ...e };
        delete next[path];
        return next;
      });
    },
    [setForm],
  );

  // بازیابی استعلام قبلی پس از رفرش
  React.useEffect(() => {
    const saved = localStorage.getItem(TRACKING_KEY);
    setReferenceCode(localStorage.getItem(REFERENCE_KEY));
    if (!saved) return;
    setTrackingCode(saved);
    fetchSummary(saved)
      .then((res) => {
        setSummaryRaw(res.data);
        setQuote(extractQuote(res.data));
        setStepIdx(STEPS.length - 1);
      })
      .catch(() => localStorage.removeItem(TRACKING_KEY));
  }, []);

  // بارگذاری lookupهای پایه هنگام ورود به مراحل خودرو/بیمه قبلی
  React.useEffect(() => {
    if (step !== "vehicle" && step !== "previous") return;
    if (carGroups.length) return;
    setLookupsLoading(true);
    Promise.allSettled([
      fetchLookup("carGroups"),
      fetchLookup("carUsages"),
      fetchLookup("vehicle-brands"),
      fetchLookup("carFuelType"),
      fetchLookup("insuranceCompanies"),
    ]).then(([g, u, b, f, c]) => {
      if (g.status === "fulfilled") setCarGroups(g.value);
      if (u.status === "fulfilled") setCarUsages(u.value);
      if (b.status === "fulfilled") setBrands(b.value);
      if (f.status === "fulfilled") setFuelTypes(f.value);
      if (c.status === "fulfilled") setCompanies(c.value);
      const anyOk = [g, u, b, f, c].some((r) => r.status === "fulfilled" && r.value.length > 0);
      if (!anyOk) push("error", "دریافت لیست‌ها از سامانه استعلام ممکن نشد. بعداً تلاش کنید.");
      setLookupsLoading(false);
    });
  }, [step, carGroups.length, push]);

  // تیپ‌ها بر اساس برند
  React.useEffect(() => {
    if (!form.vehicle.brand) {
      setKinds([]);
      return;
    }
    setKindsLoading(true);
    fetchVehicleKinds(form.vehicle.brand)
      .then(setKinds)
      .catch((e) => push("error", errText(e)))
      .finally(() => setKindsLoading(false));
  }, [form.vehicle.brand, push]);

  const goNext = async () => {
    let errs: Errors = {};
    if (step === "owner") errs = validateOwnerStep(form);
    else if (step === "vehicle") errs = validateVehicleStep(form);
    else if (step === "previous") errs = validatePreviousStep(form);
    else if (step === "discount") errs = validateDiscountStep(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      push("error", "لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }

    if (step === "owner") {
      setLoading(true);
      try {
        const res = await startInquiry(normalizedStartPayload(form));
        setTrackingCode(res.trackingCode);
        localStorage.setItem(TRACKING_KEY, res.trackingCode);
        if (res.referenceCode) {
          setReferenceCode(res.referenceCode);
          localStorage.setItem(REFERENCE_KEY, res.referenceCode);
        }
        setStepIdx(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        const ref = errReference(e);
        if (ref) {
          setReferenceCode(ref);
          localStorage.setItem(REFERENCE_KEY, ref);
        }
        push("error", errText(e));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === "discount") {
      if (!trackingCode) return;
      setLoading(true);
      try {
        const calc = await calculatePrice(trackingCode, normalizedManualData(form));
        const res = await fetchSummary(trackingCode).catch(() => ({ data: calc.data }));
        setSummaryRaw(res.data);
        const q = extractQuote(res.data, calc.data);
        if (q.premium === undefined && q.payableAmount === undefined && q.premiumAmount === undefined) {
          push("error", "پاسخ سامانه قیمت معتبری نداشت. دوباره تلاش کنید.");
          return;
        }
        setQuote(q);
        setStepIdx(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        push("error", errText(e));
      } finally {
        setLoading(false);
      }
      return;
    }

    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => setStepIdx((i) => Math.max(0, i - 1));

  const startOver = () => {
    localStorage.removeItem(TRACKING_KEY);
    localStorage.removeItem(REFERENCE_KEY);
    setReferenceCode(null);
    setForm(EMPTY_FORM);
    setQuote(null);
    setSummaryRaw(null);
    setTrackingCode(null);
    setErrors({});
    setStepIdx(0);
  };

  const er = (p: string) => errors[p];

  return (
    <div className="tp">
      <div className="tp-shell">
        <span className="tp-badge">فروش آنلاین</span>
        <h1 className="tp-title">بیمه شخص ثالث</h1>
        <p className="tp-subtitle">اطلاعات خودرو و بیمه‌گذار را وارد کنید تا قیمت دقیق بیمه‌نامه استعلام شود.</p>

        <div style={{ height: 20 }} />

        {/* Stepper */}
        <div className="tp-stepper" role="tablist" aria-label="مراحل خرید بیمه شخص ثالث">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="tp-step"
              data-state={i === stepIdx ? "active" : i < stepIdx ? "done" : undefined}
            >
              <span className="tp-step-index">{toFaDigits(i + 1)}</span>
              {s.title}
            </div>
          ))}
        </div>

        {/* مرحله ۱: پلاک و بیمه‌گذار */}
        {step === "owner" && (
          <div className="tp-card tp-fade-in">
            <h2 className="tp-card-title">اطلاعات پلاک و بیمه‌گذار</h2>
            <p className="tp-card-hint">پلاک خودرو و مشخصات مالک را مطابق کارت خودرو وارد کنید.</p>

            <div className="tp-field" style={{ marginBottom: 16 }}>
              <label className="tp-label">پلاک خودرو</label>
              <div
                className="tp-plate"
                data-invalid={
                  er("plaque.region") || er("plaque.letter") || er("plaque.segment1") || er("plaque.segment2")
                    ? "true"
                    : undefined
                }
              >
                <div className="tp-plate-flag">I.R.</div>
                <input
                  className="tp-plate-seg2"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="۱۲"
                  value={toFaDigits(form.plaque.segment2)}
                  onChange={(e) => set("plaque.segment2", toEnDigits(e.target.value))}
                  aria-label="دو رقم اول پلاک"
                />
                <select
                  className="tp-plate-letter"
                  value={form.plaque.letter}
                  onChange={(e) => set("plaque.letter", e.target.value)}
                  aria-label="حرف پلاک"
                >
                  <option value="">حرف</option>
                  {PLATE_LETTERS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  className="tp-plate-seg1"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="۳۴۵"
                  value={toFaDigits(form.plaque.segment1)}
                  onChange={(e) => set("plaque.segment1", toEnDigits(e.target.value))}
                  aria-label="سه رقم میانی پلاک"
                />
                <input
                  className="tp-plate-region"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="۶۷"
                  value={toFaDigits(form.plaque.region)}
                  onChange={(e) => set("plaque.region", toEnDigits(e.target.value))}
                  aria-label="کد شهر پلاک"
                />
              </div>
              {(er("plaque.segment2") || er("plaque.letter") || er("plaque.segment1") || er("plaque.region")) && (
                <span className="tp-error">
                  {er("plaque.segment2") || er("plaque.letter") || er("plaque.segment1") || er("plaque.region")}
                </span>
              )}
            </div>

            <div className="tp-grid tp-grid-2">
              <Field label="کد ملی بیمه‌گذار" error={er("owner.nationalCode")}>
                <input
                  className="tp-input"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="مثال: ۰۰۲۳۴۵۶۷۸۹"
                  aria-invalid={!!er("owner.nationalCode") || undefined}
                  value={toFaDigits(form.owner.nationalCode)}
                  onChange={(e) => set("owner.nationalCode", toEnDigits(e.target.value))}
                />
              </Field>
              <Field label="کد پستی" error={er("owner.postalCode")}>
                <input
                  className="tp-input"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="۱۰ رقم بدون خط تیره"
                  aria-invalid={!!er("owner.postalCode") || undefined}
                  value={toFaDigits(form.owner.postalCode)}
                  onChange={(e) => set("owner.postalCode", toEnDigits(e.target.value))}
                />
              </Field>
              <Field label="تاریخ تولد" error={er("owner.birthDate")} help="به صورت شمسی؛ مثال: ۱۳۷۰/۰۵/۱۲">
                <input
                  className="tp-input"
                  inputMode="numeric"
                  placeholder="۱۳۷۰/۰۵/۱۲"
                  aria-invalid={!!er("owner.birthDate") || undefined}
                  value={toFaDigits(form.owner.birthDate)}
                  onChange={(e) => set("owner.birthDate", toEnDigits(e.target.value))}
                />
              </Field>
              <Field label="شماره موبایل" error={er("owner.mobile")}>
                <input
                  className="tp-input"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="09xxxxxxxxx"
                  aria-invalid={!!er("owner.mobile") || undefined}
                  value={toFaDigits(form.owner.mobile)}
                  onChange={(e) => set("owner.mobile", toEnDigits(e.target.value))}
                />
              </Field>
            </div>

            <div className="tp-actions">
              <button className="tp-btn tp-btn-primary" onClick={goNext} disabled={loading}>
                {loading && <span className="tp-spinner" />}
                مرحله بعد
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۲: خودرو */}
        {step === "vehicle" && (
          <div className="tp-card tp-fade-in">
            <h2 className="tp-card-title">مشخصات خودرو</h2>
            <p className="tp-card-hint">مشخصات خودرو را مطابق کارت یا سند انتخاب کنید.</p>
            {lookupsLoading && <div className="tp-skeleton" style={{ marginBottom: 16 }} />}
            <div className="tp-grid tp-grid-2">
              <Field label="نوع خودرو" error={er("vehicle.carGroup")}>
                <LookupSelect
                  value={form.vehicle.carGroup}
                  onChange={(v) => set("vehicle.carGroup", v)}
                  options={carGroups}
                  placeholder="انتخاب کنید"
                  invalid={!!er("vehicle.carGroup")}
                  loading={lookupsLoading}
                />
              </Field>
              <Field label="کاربری" error={er("vehicle.usageType")}>
                <LookupSelect
                  value={form.vehicle.usageType}
                  onChange={(v) => set("vehicle.usageType", v)}
                  options={carUsages}
                  placeholder="انتخاب کنید"
                  invalid={!!er("vehicle.usageType")}
                  loading={lookupsLoading}
                />
              </Field>
              <Field label="برند" error={er("vehicle.brand")}>
                <LookupSelect
                  value={form.vehicle.brand}
                  onChange={(v) => {
                    set("vehicle.brand", v);
                    set("vehicle.vehicleKindId", "");
                  }}
                  options={brands}
                  placeholder="انتخاب کنید"
                  invalid={!!er("vehicle.brand")}
                  loading={lookupsLoading}
                />
              </Field>
              <Field label="تیپ" error={er("vehicle.vehicleKindId")}>
                <LookupSelect
                  value={form.vehicle.vehicleKindId}
                  onChange={(v) => set("vehicle.vehicleKindId", v)}
                  options={kinds}
                  placeholder={form.vehicle.brand ? "انتخاب کنید" : "ابتدا برند را انتخاب کنید"}
                  invalid={!!er("vehicle.vehicleKindId")}
                  disabled={!form.vehicle.brand}
                  loading={kindsLoading}
                />
              </Field>
              <Field label="نوع سوخت" error={er("vehicle.fuelType")}>
                <LookupSelect
                  value={form.vehicle.fuelType}
                  onChange={(v) => set("vehicle.fuelType", v)}
                  options={fuelTypes}
                  placeholder="انتخاب کنید"
                  invalid={!!er("vehicle.fuelType")}
                  loading={lookupsLoading}
                />
              </Field>
              <Field label="سال ساخت (مدل)" error={er("vehicle.builtYear")} help="به صورت شمسی؛ مثال: ۱۴۰۲">
                <input
                  className="tp-input"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="۱۴۰۲"
                  aria-invalid={!!er("vehicle.builtYear") || undefined}
                  value={toFaDigits(form.vehicle.builtYear)}
                  onChange={(e) => set("vehicle.builtYear", toEnDigits(e.target.value))}
                />
              </Field>
            </div>
            <div className="tp-actions">
              <button className="tp-btn tp-btn-primary" onClick={goNext} disabled={loading}>
                مرحله بعد
              </button>
              <button className="tp-btn tp-btn-ghost" onClick={goBack} disabled={loading}>
                مرحله قبل
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۳: بیمه قبلی */}
        {step === "previous" && (
          <div className="tp-card tp-fade-in">
            <h2 className="tp-card-title">بیمه‌نامه قبلی</h2>
            <p className="tp-card-hint">اطلاعات آخرین بیمه‌نامه شخص ثالث خودرو را وارد کنید.</p>
            <div className="tp-grid tp-grid-2">
              <Field label="شرکت بیمه‌گر قبلی" error={er("previousInsurance.previousInsuranceCorpId")}>
                <LookupSelect
                  value={form.previousInsurance.previousInsuranceCorpId}
                  onChange={(v) => set("previousInsurance.previousInsuranceCorpId", v)}
                  options={companies}
                  placeholder="انتخاب کنید"
                  invalid={!!er("previousInsurance.previousInsuranceCorpId")}
                  loading={lookupsLoading}
                />
              </Field>
              <Field label="شماره بیمه‌نامه قبلی (اختیاری)">
                <input
                  className="tp-input"
                  value={form.previousInsurance.previousInsuranceFile}
                  onChange={(e) => set("previousInsurance.previousInsuranceFile", toEnDigits(e.target.value))}
                />
              </Field>
              <Field
                label="تاریخ شروع بیمه‌نامه قبلی"
                error={er("previousInsurance.previousPolicyBeginDate")}
                help="شمسی؛ مثال: ۱۴۰۳/۰۶/۰۱"
              >
                <input
                  className="tp-input"
                  inputMode="numeric"
                  placeholder="۱۴۰۳/۰۶/۰۱"
                  aria-invalid={!!er("previousInsurance.previousPolicyBeginDate") || undefined}
                  value={toFaDigits(form.previousInsurance.previousPolicyBeginDate)}
                  onChange={(e) => set("previousInsurance.previousPolicyBeginDate", toEnDigits(e.target.value))}
                />
              </Field>
              <Field
                label="تاریخ پایان بیمه‌نامه قبلی"
                error={er("previousInsurance.previousPolicyEndDate")}
                help="شمسی؛ مثال: ۱۴۰۴/۰۶/۰۱"
              >
                <input
                  className="tp-input"
                  inputMode="numeric"
                  placeholder="۱۴۰۴/۰۶/۰۱"
                  aria-invalid={!!er("previousInsurance.previousPolicyEndDate") || undefined}
                  value={toFaDigits(form.previousInsurance.previousPolicyEndDate)}
                  onChange={(e) => set("previousInsurance.previousPolicyEndDate", toEnDigits(e.target.value))}
                />
              </Field>
            </div>
            <div className="tp-actions">
              <button className="tp-btn tp-btn-primary" onClick={goNext} disabled={loading}>
                مرحله بعد
              </button>
              <button className="tp-btn tp-btn-ghost" onClick={goBack} disabled={loading}>
                مرحله قبل
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۴: تخفیف و خسارت */}
        {step === "discount" && (
          <div className="tp-card tp-fade-in">
            <h2 className="tp-card-title">تخفیف عدم خسارت و سوابق خسارت</h2>
            <p className="tp-card-hint">درصد تخفیف و تعداد خسارات سال‌های گذشته را انتخاب کنید.</p>

            <div className="tp-grid tp-grid-2">
              <Field label="درصد تخفیف عدم خسارت شخص ثالث" error={er("discount.penaltyForCarInsuranceRenewal")}>
                <StaticSelect
                  value={form.discount.penaltyForCarInsuranceRenewal}
                  onChange={(v) => set("discount.penaltyForCarInsuranceRenewal", v)}
                  options={DISCOUNT_PERCENTS.map((d) => ({ id: d.id, label: d.label }))}
                  placeholder="انتخاب کنید"
                  invalid={!!er("discount.penaltyForCarInsuranceRenewal")}
                />
              </Field>
              <Field label="درصد تخفیف حوادث راننده" error={er("discount.discountDriverYearPercent")}>
                <StaticSelect
                  value={form.discount.discountDriverYearPercent}
                  onChange={(v) => set("discount.discountDriverYearPercent", v)}
                  options={DISCOUNT_PERCENTS.map((d) => ({ id: d.id, label: d.label }))}
                  placeholder="انتخاب کنید"
                  invalid={!!er("discount.discountDriverYearPercent")}
                />
              </Field>
              <Field label="تعداد خسارت مالی" error={er("discount.discountFinanceYearNumber")}>
                <StaticSelect
                  value={form.discount.discountFinanceYearNumber}
                  onChange={(v) => set("discount.discountFinanceYearNumber", v)}
                  options={FINANCE_DAMAGE_OPTIONS}
                  placeholder="انتخاب کنید"
                  invalid={!!er("discount.discountFinanceYearNumber")}
                />
              </Field>
              <Field label="تعداد خسارت جانی" error={er("discount.discountLifeYearNumber")}>
                <StaticSelect
                  value={form.discount.discountLifeYearNumber}
                  onChange={(v) => set("discount.discountLifeYearNumber", v)}
                  options={LIFE_DAMAGE_OPTIONS}
                  placeholder="انتخاب کنید"
                  invalid={!!er("discount.discountLifeYearNumber")}
                />
              </Field>
              <Field label="تعداد خسارت حوادث راننده" error={er("discount.discountDriverYearNumber")}>
                <StaticSelect
                  value={form.discount.discountDriverYearNumber}
                  onChange={(v) => set("discount.discountDriverYearNumber", v)}
                  options={DRIVER_DAMAGE_OPTIONS}
                  placeholder="انتخاب کنید"
                  invalid={!!er("discount.discountDriverYearNumber")}
                />
              </Field>
              <Field label="آیا تخفیف از پلاک دیگری منتقل شده است؟">
                <div className="tp-choices">
                  <button
                    type="button"
                    className="tp-choice"
                    aria-pressed={form.discount.transferredPlaque === "no"}
                    onClick={() => set("discount.transferredPlaque", "no")}
                  >
                    خیر
                  </button>
                  <button
                    type="button"
                    className="tp-choice"
                    aria-pressed={form.discount.transferredPlaque === "yes"}
                    onClick={() => set("discount.transferredPlaque", "yes")}
                  >
                    بله
                  </button>
                </div>
              </Field>
            </div>

            <div className="tp-actions">
              <button className="tp-btn tp-btn-primary" onClick={goNext} disabled={loading}>
                {loading && <span className="tp-spinner" />}
                استعلام قیمت
              </button>
              <button className="tp-btn tp-btn-ghost" onClick={goBack} disabled={loading}>
                مرحله قبل
              </button>
            </div>
          </div>
        )}

        {/* مرحله ۵: قیمت */}
        {step === "price" && (
          <div className="tp-card tp-fade-in">
            <h2 className="tp-card-title">استعلام قیمت بیمه شخص ثالث</h2>
            <p className="tp-card-hint">
              {trackingCode ? <>کد رهگیری استعلام: <b>{trackingCode}</b></> : "خلاصه قیمت"}
            </p>
            {referenceCode && (
              <p className="tp-card-hint">
                کد پیگیری درخواست در دفتر ما: <b>{referenceCode}</b>
              </p>
            )}
            {!quote ? (
              <div>
                <div className="tp-skeleton" style={{ marginBottom: 12 }} />
                <div className="tp-skeleton" />
              </div>
            ) : (
              <>
                {quote.premium !== undefined && (
                  <div className="tp-summary-row">
                    <span>حق بیمه</span>
                    <span>{formatRial(quote.premium)}</span>
                  </div>
                )}
                {quote.discount !== undefined && quote.discount > 0 && (
                  <div className="tp-summary-row">
                    <span>تخفیف</span>
                    <span>{formatRial(quote.discount)}</span>
                  </div>
                )}
                {quote.premiumAfterDiscount !== undefined && (
                  <div className="tp-summary-row">
                    <span>حق بیمه پس از تخفیف</span>
                    <span>{formatRial(quote.premiumAfterDiscount)}</span>
                  </div>
                )}
                {quote.walletCredit !== undefined && quote.walletCredit > 0 && (
                  <div className="tp-summary-row">
                    <span>اعتبار کیف پول</span>
                    <span>{formatRial(quote.walletCredit)}</span>
                  </div>
                )}
                <div className="tp-summary-total">
                  <span>مبلغ قابل پرداخت</span>
                  <span>{formatRial(quote.payableAmount ?? quote.premiumAfterDiscount ?? quote.premiumAmount ?? quote.premium)}</span>
                </div>
              </>
            )}
            <div className="tp-actions">
              <button className="tp-btn tp-btn-ghost" onClick={startOver}>
                استعلام جدید
              </button>
            </div>
            <div className="tp-alert tp-alert-info" style={{ marginTop: 16, marginBottom: 0 }}>
              برای نهایی‌سازی خرید و صدور بیمه‌نامه با همین کد رهگیری با کارشناسان ما در تماس باشید.
            </div>
          </div>
        )}
      </div>

      {/* Toastها */}
      <div className="tp-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="tp-toast" data-kind={t.kind}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
