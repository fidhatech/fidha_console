import { z } from "zod";
import { requiredString } from "../fields";

export const rejectionSchema = z.object({
  reason: requiredString,
});

export type RejectionFormValues = z.infer<typeof rejectionSchema>;