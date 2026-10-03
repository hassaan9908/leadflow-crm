import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(100, "Company name is too long."),

  industry: z
    .string()
    .trim()
    .max(100, "Industry is too long.")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Please enter a valid website URL.")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(100, "Country name is too long.")
    .optional()
    .or(z.literal("")),

  company_size: z.coerce
    .number()
    .int("Company size must be a whole number.")
    .min(0, "Company size cannot be negative."),
});

export type CompanyFormData = z.infer<typeof companySchema>;