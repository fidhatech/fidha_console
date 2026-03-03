import z from "zod";
import { requiredDate } from "../fields";

export const filterDateSchema = z.object({
  from: requiredDate,
  to: requiredDate,
});
