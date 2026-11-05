import { z } from "zod";

// Bounds mirror the backend's CoinSettingsUseCase.validate().
const MAX_COINS = 10_000_000;
const MAX_RUPEES = 10_000_000; // ₹1 crore, as paise 10_000_000_00

const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

const percent = z
  .number("Enter a number")
  .min(0, "Must be 0 or more")
  .max(100, "Must be 100 or less")
  .refine(hasAtMostTwoDecimals, "At most two decimals");

const wholeCoins = (min: number, max = MAX_COINS) =>
  z
    .number("Enter a number")
    .int("Must be a whole number")
    .min(min, min === 0 ? "Must be 0 or more" : `Must be at least ${min}`)
    .max(max, `Must be ${max.toLocaleString("en-IN")} or less`);

/** Rupees as typed by the admin; sent to the API as whole paise. */
const rupees = z
  .number("Enter an amount")
  .min(0, "Must be 0 or more")
  .max(MAX_RUPEES, "Too large")
  .refine(hasAtMostTwoDecimals, "At most two decimals (paise)");

export const coinSettingsSchema = z.object({
  commissionAudio: percent,
  commissionVideo: percent,

  payoutCredits: wholeCoins(1),
  payoutRupees: rupees,

  minimumCredits: wholeCoins(1, MAX_COINS * 10),
  feePercent: percent,
  flatFeeRupees: rupees,
  maxPerTransactionRupees: rupees,
  maxPerDayRupees: rupees,
  maxPerMonthRupees: rupees,

  signupBonusUser: wholeCoins(0),
  signupBonusEmployee: wholeCoins(0),
  signupMessage: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(200, "At most 200 characters"),
});

export type CoinSettingsFormValues = z.infer<typeof coinSettingsSchema>;
