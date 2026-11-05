import { z } from "zod";

export const positiveNumber = z
  .number()
  .positive("Must be greater than 0");

export const nonNegativeNumber = z
  .number()
  .min(0, "Must be 0 or more");

export const positiveWholeNumber = z
  .number("Enter a number")
  .int("Must be a whole number")
  .positive("Must be greater than 0");
