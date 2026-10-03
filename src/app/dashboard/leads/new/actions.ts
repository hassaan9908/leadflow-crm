"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { leadSchema } from "@/lib/validations/lead";

export async function createLead(formData: FormData) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const rawData = {
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    job_title: String(formData.get("job_title") ?? ""),
    country: String(formData.get("country") ?? ""),
    status: String(formData.get("status") ?? "new"),
    lead_score: String(formData.get("lead_score") ?? "0"),
    company_id: String(formData.get("company_id") ?? ""),
  };

  const result = leadSchema.safeParse(rawData);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ??
      "Please check the form fields.";

    redirect(
      `/dashboard/leads/new?error=${encodeURIComponent(message)}`
    );
  }

  const data = result.data;

  const { error } = await supabase.from("leads").insert({
    first_name: data.first_name,
    last_name: data.last_name || null,
    email: data.email || null,
    phone: data.phone || null,
    job_title: data.job_title || null,
    country: data.country || null,
    status: data.status,
    lead_score: data.lead_score,
    company_id: data.company_id || null,
    workspace_id: workspaceId,
  });

  if (error) {
    redirect(
      `/dashboard/leads/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  redirect(
    "/dashboard/leads?success=" +
      encodeURIComponent("Lead created successfully.")
  );
}