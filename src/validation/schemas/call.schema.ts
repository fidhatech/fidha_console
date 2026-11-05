import { z } from "zod";
import { positiveWholeNumber } from "../fields";

// Coins per minute. Whole numbers only: the mobile app parses these as int.
export const callRateSchema = z.object({
  audioCallRate: positiveWholeNumber,
  videoCallRate: positiveWholeNumber,
});

export type CallRateFormValues = z.infer<typeof callRateSchema>;
