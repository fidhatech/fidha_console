import { z } from "zod";
import { positiveNumber } from "../fields";

export const packageSchema = z.object({
  coins: positiveNumber,
  actualPrice: positiveNumber,
  offerPrice: positiveNumber
});

export type PackageFormValues = z.infer<typeof packageSchema>;
