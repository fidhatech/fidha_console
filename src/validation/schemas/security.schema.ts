import z from "zod";
import { requiredString, emailString } from "../fields";

export const securitySchema = z.object({
  
  oldPassword: requiredString,
  newPassword: requiredString,
  newEmail: emailString.optional().or(z.literal("")),
});
export type SecurityFormValues = z.infer<typeof securitySchema>;