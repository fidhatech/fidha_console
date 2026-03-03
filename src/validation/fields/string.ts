import { z } from "zod";

export const requiredString = z
  .string()
  .trim()
  .min(1, "This field is required");

export const emailString = z
  .email("Invalid email format");
