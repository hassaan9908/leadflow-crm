"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  isWorkspaceOwner,
} from "@/lib/workspace";
import { redirect } from "next/navigation";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const owner = await isWorkspaceOwner();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceId = await getCurrentWorkspaceId();

  const fullName = formData.get("full_name") as string;
  const workspaceName = formData.get("workspace_name") as string;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
    })
    .eq("id", user.id);

  if (profileError) {
    redirect(
      `/dashboard/settings?error=${encodeURIComponent(
        profileError.message
      )}`
    );
  }

  if (owner) {
  const { error: workspaceError } = await supabase
    .from("workspaces")
    .update({
      name: workspaceName,
    })
    .eq("id", workspaceId)
    .eq("owner_id", user.id);

  if (workspaceError) {
    redirect(
      `/dashboard/settings?error=${encodeURIComponent(
        workspaceError.message
      )}`
    );
  }
}

  redirect(
  "/dashboard/settings?success=" +
    encodeURIComponent("Settings updated successfully.")
);
}