/** Request/response types for the third-party (شخص ثالث) purchase flow. */

export type LookupItem = { id: string | number; title?: string; name?: string; value?: string };

export type PlaqueInput = {
  region: string;
  letter: string;
  segment1: string;
  segment2: string;
};

export type OwnerInput = {
  nationalCode: string;
  postalCode: string;
  birthDate: string;
  mobile: string;
};

export type VehicleInput = {
  carGroup: string;
  usageType: string;
  brand: string;
  vehicleKindId: string;
  fuelType: string;
  builtYear: string;
};

export type PreviousInsuranceInput = {
  previousInsuranceCorpId: string;
  previousPolicyBeginDate: string;
  previousPolicyEndDate: string;
  previousInsuranceFile: string;
};

export type DiscountInput = {
  penaltyForCarInsuranceRenewal: string;
  discountDriverYearPercent: string;
  transferredPlaque: string;
  discountFinanceYearNumber: string;
  discountLifeYearNumber: string;
  discountDriverYearNumber: string;
};

export type ThirdPartyForm = {
  plaque: PlaqueInput;
  owner: OwnerInput;
  vehicle: VehicleInput;
  previousInsurance: PreviousInsuranceInput;
  discount: DiscountInput;
};

export type StartResponse = {
  ok: boolean;
  trackingCode?: string;
  inquiryId?: string;
  customerId?: string;
  error?: string;
  message?: string;
};

export type QuoteData = {
  premium?: number;
  discount?: number;
  premiumAfterDiscount?: number;
  walletCredit?: number;
  payableAmount?: number;
  premiumAmount?: number;
};

export type SummaryResponse = {
  ok: boolean;
  quote?: QuoteData;
  raw?: unknown;
  error?: string;
  message?: string;
};
