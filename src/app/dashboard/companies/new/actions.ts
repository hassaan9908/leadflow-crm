"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { companySchema } from "@/lib/validations/company";

export async function createCompany(formData: FormData) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const rawData = {
    name: String(formData.get("name") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    website: String(formData.get("website") ?? ""),
    country: String(formData.get("country") ?? ""),
    company_size: String(formData.get("company_size") ?? "0"),
  };

  const result = companySchema.safeParse(rawData);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ??
      "Please check the form fields.";

    redirect(
      `/dashboard/companies/new?error=${encodeURIComponent(
        message
      )}`
    );
  }

  const data = result.data;

  const { error } = await supabase
    .from("companies")
    .insert({
      name: data.name,
      industry: data.industry || null,
      website: data.website || null,
      country: data.country || null,
      company_size:
        data.company_size > 0
          ? data.company_size
          : null,
      workspace_id: workspaceId,
    });

  if (error) {
    redirect(
      `/dashboard/companies/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  redirect(
    "/dashboard/companies?success=" +
      encodeURIComponent(
        "Company created successfully."
      )
  );
}