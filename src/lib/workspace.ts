import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

const WORKSPACE_COOKIE = "leadflow_workspace_id";

export async function getCurrentWorkspaceId() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const cookieStore = await cookies();
  const selectedWorkspaceId =
    cookieStore.get(WORKSPACE_COOKIE)?.value;

  // If a workspace was previously selected,
  // make sure this user is actually a member.
  if (selectedWorkspaceId) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("workspace_id", selectedWorkspaceId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership) {
      return selectedWorkspaceId;
    }
  }

  // Otherwise use user's first workspace.
  const { data: membership, error } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !membership) {
    throw new Error("Workspace not found");
  }

  return membership.workspace_id;
}

export async function getCurrentWorkspaceRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const workspaceId = await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Workspace role not found");
  }

  return data.role as "owner" | "admin" | "member";
}

export async function canManageWorkspace() {
  const role = await getCurrentWorkspaceRole();

  return role === "owner" || role === "admin";
}

export async function canDeleteCRMRecords() {
  const role = await getCurrentWorkspaceRole();

  return role === "owner" || role === "admin";
}

export async function isWorkspaceOwner() {
  const role = await getCurrentWorkspaceRole();

  return role === "owner";
}