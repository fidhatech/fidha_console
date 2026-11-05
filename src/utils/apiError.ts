import { isAxiosError } from "axios";

/** Human text for the backend's error codes (INVALID_PAYOUT_RATE, DEDUCT_REASON_REQUIRED, ...). */
const ERROR_TEXT: Record<string, string> = {
  NOTHING_TO_UPDATE: "Nothing changed",
  INVALID_COMMISSION: "Commission must be between 0 and 100",
  INVALID_PAYOUT_RATE: "Payout rate needs at least 1 coin and a rupee amount of 0 or more",
  INVALID_MINIMUM_CREDITS: "Smallest withdrawal must be a whole number of coins, at least 1",
  INVALID_FEE_PERCENT: "Fee percent must be between 0 and 100",
  INVALID_FLATFEEMINOR: "Flat fee must be 0 or more",
  INVALID_MAXPERTRANSACTIONMINOR: "Per-transaction cap must be 0 or more",
  INVALID_MAXPERDAYMINOR: "Daily cap must be 0 or more",
  INVALID_MAXPERMONTHMINOR: "Monthly cap must be 0 or more",
  INVALID_SIGNUP_BONUS: "Signup bonus must be a whole number of coins, 0 or more",
  INVALID_SIGNUP_MESSAGE: "Signup message is required (up to 200 characters)",
  BONUS_COINS_MUST_BE_POSITIVE: "Coins must be a whole number greater than 0",
  DEDUCT_COINS_MUST_BE_POSITIVE: "Coins must be a whole number greater than 0",
  DEDUCT_REASON_REQUIRED: "A reason is required",
  NO_TARGET_USERS_FOUND: "No users matched this target",
  INVALID_BONUS_TARGET_GROUP: "Unknown target group",
};

/** The backend's `{ message }` on a 4xx, made readable; `fallback` otherwise. */
export const apiErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string" && message) {
      return ERROR_TEXT[message] ? `${ERROR_TEXT[message]} (${message})` : message;
    }
  }
  return fallback;
};
