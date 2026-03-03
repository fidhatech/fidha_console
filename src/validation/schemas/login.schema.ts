import z from "zod";
import { emailString, requiredString } from "../fields";

export const loginSchema = z.object({
  email: emailString,
  password: requiredString,
});
export type LoginFormValues = z.infer<typeof loginSchema>;