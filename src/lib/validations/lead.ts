import { z } from "zod";

export const leadSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),

  last_name: z
    .string()
    .trim()
    .max(50, "Last name is too long.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),

  job_title: z
    .string()
    .trim()
    .max(100, "Job title is too long.")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(100, "Country name is too long.")
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "unqualified",
    "customer",
  ]),

  lead_score: z.coerce
    .number()
    .min(0, "Lead score cannot be below 0.")
    .max(100, "Lead score cannot be above 100."),

  company_id: z
    .string()
    .uuid("Invalid company selected.")
    .optional()
    .or(z.literal("")),
});

export type LeadFormData = z.infer<typeof leadSchema>;