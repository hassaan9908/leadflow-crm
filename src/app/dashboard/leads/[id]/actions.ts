"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  canDeleteCRMRecords,
} from "@/lib/workspace";

export async function deleteLead(id: string) {
  const allowed = await canDeleteCRMRecords();

  if (!allowed) {
    return {
      success: false,
      message: "You do not have permission to delete leads.",
    };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("leads")
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
    message: "Lead deleted successfully.",
  };
}