"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  canDeleteCRMRecords,
} from "@/lib/workspace";

export async function deleteDeal(id: string) {
  const allowed = await canDeleteCRMRecords();

  if (!allowed) {
    return {
      success: false,
      message: "You do not have permission to delete deals.",
    };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Deal deleted successfully.",
  };
}