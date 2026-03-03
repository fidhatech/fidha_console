import { z } from "zod";
import { positiveNumber } from "../fields";

export const commissionSchema = z.object({
  commission: positiveNumber,
});

export type CommissionFormValues = z.infer<typeof commissionSchema>;