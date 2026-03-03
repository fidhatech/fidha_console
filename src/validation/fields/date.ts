import { z } from "zod";

export const requiredDate = z
    .string()
    .min(1, "Date is required")