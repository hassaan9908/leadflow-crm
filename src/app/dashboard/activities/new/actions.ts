"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { redirect } from "next/navigation";

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const leadId = formData.get("lead_id") as string;
  const dealId = formData.get("deal_id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("activities")
    .insert({
      type,
      description: description || null,
      lead_id: leadId || null,
      deal_id: dealId || null,
      created_by: user.id,
      workspace_id: workspaceId,
    });

  if (error) {
    redirect(
      `/dashboard/activities/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  redirect("/dashboard/activities");
}