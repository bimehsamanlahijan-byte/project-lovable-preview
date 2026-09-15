/** Validation rules mirrored from the captured reference widget (Persian messages). */
import { toEnDigits } from "./constants";
import type { ThirdPartyForm } from "./types";

export const REQUIRED = "پر کردن این فیلد اجباری است.";

export type Errors = Record<string, string>;

function digits(value: string): string {
  return toEnDigits(value ?? "").replace(/\D/g, "");
}

/** الگوریتم رسمی صحت کد ملی ایران */
export function isValidNationalCode(raw: string): boolean {
  const code = digits(raw);
  if (code.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = Number(code[9]);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(code[i]) * (10 - i);
  const rem = sum % 11;
  return rem < 2 ? check === rem : check === 11 - rem;
}

export function validateOwnerStep(form: ThirdPartyForm): Errors {
  const e: Errors = {};
  const { plaque, owner } = form;

  if (!digits(plaque.segment2)) e["plaque.segment2"] = REQUIRED;
  else if (digits(plaque.segment2).length !== 2) e["plaque.segment2"] = "دو رقم اول پلاک را وارد کنید";
  if (!plaque.letter) e["plaque.letter"] = "حرف پلاک را انتخاب کنید";
  if (!digits(plaque.segment1)) e["plaque.segment1"] = REQUIRED;
  else if (digits(plaque.segment1).length !== 3) e["plaque.segment1"] = "سه رقم میانی پلاک را وارد کنید";
  if (!digits(plaque.region)) e["plaque.region"] = REQUIRED;
  else if (digits(plaque.region).length !== 2) e["plaque.region"] = "کد شهر دو رقمی است";

  if (!digits(owner.nationalCode)) e["owner.nationalCode"] = REQUIRED;
  else if (digits(owner.nationalCode).length !== 10) e["owner.nationalCode"] = "کد ملی باید ۱۰ رقم باشد";
  else if (!isValidNationalCode(owner.nationalCode)) e["owner.nationalCode"] = "کد ملی وارد شده معتبر نیست";

  if (!digits(owner.postalCode)) e["owner.postalCode"] = REQUIRED;
  else if (digits(owner.postalCode).length !== 10) e["owner.postalCode"] = "کد پستی باید ۱۰ رقم باشد";

  if (!owner.birthDate) e["owner.birthDate"] = REQUIRED;

  const mobile = digits(owner.mobile);
  if (!mobile) e["owner.mobile"] = REQUIRED;
  else if (mobile.length !== 11 || !mobile.startsWith("09"))
    e["owner.mobile"] = "شماره موبایل باید 11 رقم باشد";

  return e;
}

export function validateVehicleStep(form: ThirdPartyForm): Errors {
  const e: Errors = {};
  const v = form.vehicle;
  if (!v.carGroup) e["vehicle.carGroup"] = "نوع خودرو را انتخاب کنید";
  if (!v.usageType) e["vehicle.usageType"] = "کاربری را انتخاب کنید";
  if (!v.brand) e["vehicle.brand"] = "برند را انتخاب کنید";
  if (!v.vehicleKindId) e["vehicle.vehicleKindId"] = "تیپ را انتخاب کنید";
  if (!v.fuelType) e["vehicle.fuelType"] = "نوع سوخت را انتخاب کنید";
  if (!v.builtYear) e["vehicle.builtYear"] = "مدل را انتخاب کنید";
  return e;
}

export function validatePreviousStep(form: ThirdPartyForm): Errors {
  const e: Errors = {};
  const p = form.previousInsurance;
  if (!p.previousInsuranceCorpId)
    e["previousInsurance.previousInsuranceCorpId"] = "نام شرکت بیمه گر قبلی را انتخاب کنید";
  if (!p.previousPolicyBeginDate)
    e["previousInsurance.previousPolicyBeginDate"] = "تاریخ شروع بیمه‌نامه قبلی را وارد کنید.";
  if (!p.previousPolicyEndDate)
    e["previousInsurance.previousPolicyEndDate"] = "تاریخ پایان بیمه‌نامه قبلی را وارد کنید.";
  if (
    p.previousPolicyBeginDate &&
    p.previousPolicyEndDate &&
    p.previousPolicyEndDate <= p.previousPolicyBeginDate
  ) {
    e["previousInsurance.previousPolicyEndDate"] = "تاریخ پایان باید بعد از تاریخ شروع باشد.";
  }
  return e;
}

export function validateDiscountStep(form: ThirdPartyForm): Errors {
  const e: Errors = {};
  const d = form.discount;
  if (!d.penaltyForCarInsuranceRenewal)
    e["discount.penaltyForCarInsuranceRenewal"] = "تخفیف ثالث روی بیمه‌نامه را انتخاب کنید.";
  if (!d.discountDriverYearPercent)
    e["discount.discountDriverYearPercent"] = "تخفیف حوادث راننده روی بیمه‌نامه را انتخاب کنید.";
  if (!d.discountFinanceYearNumber) e["discount.discountFinanceYearNumber"] = "تعداد خسارت مالی را انتخاب کنید.";
  if (!d.discountLifeYearNumber) e["discount.discountLifeYearNumber"] = "تعداد خسارت جانی را انتخاب کنید.";
  if (!d.discountDriverYearNumber)
    e["discount.discountDriverYearNumber"] = "تعداد خسارت حوادث راننده را انتخاب کنید.";
  return e;
}

export function normalizedStartPayload(form: ThirdPartyForm) {
  return {
    plaque: {
      region: Number(digits(form.plaque.region)),
      letter: form.plaque.letter,
      segment1: Number(digits(form.plaque.segment1)),
      segment2: Number(digits(form.plaque.segment2)),
    },
    owner: {
      nationalCode: digits(form.owner.nationalCode),
      birthDate: form.owner.birthDate,
      mobile: digits(form.owner.mobile),
      postalCode: digits(form.owner.postalCode),
    },
  };
}

export function normalizedManualData(form: ThirdPartyForm) {
  const num = (v: string) => (v ? Number(digits(v)) : 0);
  return {
    vehicle: {
      vehicleKindId: form.vehicle.vehicleKindId,
      builtYear: num(form.vehicle.builtYear),
      fuelType: form.vehicle.fuelType,
      usageType: form.vehicle.usageType,
      carGroup: form.vehicle.carGroup,
    },
    insuranceData: {
      discountFinanceYearNumber: num(form.discount.discountFinanceYearNumber),
      penaltyForCarInsuranceRenewal: num(form.discount.penaltyForCarInsuranceRenewal),
      discountLifeYearNumber: num(form.discount.discountLifeYearNumber),
      discountDriverYearNumber: num(form.discount.discountDriverYearNumber),
      discountDriverYearPercent: num(form.discount.discountDriverYearPercent),
      previousPolicyBeginDate: form.previousInsurance.previousPolicyBeginDate,
      previousPolicyEndDate: form.previousInsurance.previousPolicyEndDate,
      previousInsuranceCorpId: form.previousInsurance.previousInsuranceCorpId,
      previousInsuranceFile: form.previousInsurance.previousInsuranceFile || null,
      transferredPlaque: form.discount.transferredPlaque === "yes",
    },
  };
}
