"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { dealSchema } from "@/lib/validations/deal";

export async function createDeal(formData: FormData) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const rawData = {
    title: String(formData.get("title") ?? ""),
    value: String(formData.get("value") ?? "0"),
    stage: String(formData.get("stage") ?? "new"),
    company_id: String(formData.get("company_id") ?? ""),
    lead_id: String(formData.get("lead_id") ?? ""),
    expected_close_date: String(
      formData.get("expected_close_date") ?? ""
    ),
  };

  const result = dealSchema.safeParse(rawData);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ??
      "Please check the form fields.";

    redirect(
      `/dashboard/pipeline/new?error=${encodeURIComponent(
        message
      )}`
    );
  }

  const data = result.data;

  const { error } = await supabase
    .from("deals")
    .insert({
      title: data.title,
      value: data.value,
      stage: data.stage,
      company_id: data.company_id || null,
      lead_id: data.lead_id || null,
      expected_close_date:
        data.expected_close_date || null,
      workspace_id: workspaceId,
    });

  if (error) {
    redirect(
      `/dashboard/pipeline/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  redirect(
    "/dashboard/pipeline?success=" +
      encodeURIComponent("Deal created successfully.")
  );
}