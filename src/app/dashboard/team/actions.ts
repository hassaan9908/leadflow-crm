"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  getCurrentWorkspaceRole,
} from "@/lib/workspace";

export async function updateMemberRole(formData: FormData) {
  const supabase = await createClient();

  const workspaceId = await getCurrentWorkspaceId();
  const currentRole = await getCurrentWorkspaceRole();

  const memberId = String(formData.get("member_id") ?? "");
  const newRole = String(formData.get("role") ?? "");

  if (!memberId) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "Invalid team member."
      )}`
    );
  }

  if (!["admin", "member"].includes(newRole)) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "Invalid role selected."
      )}`
    );
  }

  if (currentRole !== "owner" && currentRole !== "admin") {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "You do not have permission to manage team roles."
      )}`
    );
  }

  const {
    data: targetMembership,
    error: targetError,
  } = await supabase
    .from("workspace_members")
    .select("id, user_id, role")
    .eq("id", memberId)
    .eq("workspace_id", workspaceId)
    .single();

  if (targetError || !targetMembership) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "Team member not found."
      )}`
    );
  }

  if (targetMembership.role === "owner") {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "The workspace owner role cannot be changed."
      )}`
    );
  }

  if (
    currentRole === "admin" &&
    targetMembership.role === "admin"
  ) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "Only the workspace owner can manage admins."
      )}`
    );
  }

  if (
    currentRole === "admin" &&
    newRole === "admin"
  ) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        "Only the workspace owner can promote members to admin."
      )}`
    );
  }

  const { error } = await supabase
    .from("workspace_members")
    .update({
      role: newRole,
    })
    .eq("id", memberId)
    .eq("workspace_id", workspaceId);

  if (error) {
    redirect(
      `/dashboard/team?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath("/dashboard/team");

  redirect(
    `/dashboard/team?success=${encodeURIComponent(
      "Member role updated successfully."
    )}`
  );
}