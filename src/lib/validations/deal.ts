import { z } from "zod";

export const dealSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Deal title is required.")
    .max(120, "Deal title is too long."),

  value: z.coerce
    .number()
    .min(0, "Deal value cannot be negative."),

  stage: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ]),

  company_id: z
    .string()
    .uuid("Invalid company selected.")
    .optional()
    .or(z.literal("")),

  lead_id: z
    .string()
    .uuid("Invalid lead selected.")
    .optional()
    .or(z.literal("")),

  expected_close_date: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type DealFormData = z.infer<typeof dealSchema>;