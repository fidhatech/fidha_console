import { z } from "zod";
import { requiredString, positiveNumber, requiredDate } from "../fields";

export const offerSchema = z.object({
  title: requiredString,

  coins: positiveNumber,
  actualPrice: positiveNumber,
  offerPrice: positiveNumber,

  type: requiredString,

  startDate: requiredDate,
  endDate: requiredDate,
});

export type OfferFormValues = z.infer<typeof offerSchema>;