"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  canManageWorkspace,
} from "@/lib/workspace";

export async function inviteMember(formData: FormData) {
 const allowed = await canManageWorkspace();

if (!allowed) {
  redirect(
    "/dashboard/team?error=You do not have permission to invite members"
  );
}
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceId = await getCurrentWorkspaceId();

  const email = (
    formData.get("email") as string
  )
    .trim()
    .toLowerCase();

  const role = formData.get("role") as string;

  if (!email) {
    redirect(
      "/dashboard/team/invite?error=Email is required"
    );
  }

  if (!["admin", "member"].includes(role)) {
    redirect(
      "/dashboard/team/invite?error=Invalid role"
    );
  }

  const { error } = await supabase
    .from("workspace_invitations")
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: user.id,
    });

  if (error) {
    redirect(
      `/dashboard/team/invite?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

 redirect(
  "/dashboard/team?success=" +
    encodeURIComponent("Invitation sent successfully.")
);
}