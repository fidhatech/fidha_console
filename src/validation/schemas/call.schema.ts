import { z } from "zod";
import { positiveNumber } from "../fields";

export const callRateSchema = z.object({
  audioCallRate: positiveNumber,
  videoCallRate: positiveNumber,
});

export type CallRateFormValues = z.infer<typeof callRateSchema>;