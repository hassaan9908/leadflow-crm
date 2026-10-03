"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  canDeleteCRMRecords,
} from "@/lib/workspace";

export async function deleteCompany(id: string) {
  const allowed = await canDeleteCRMRecords();

  if (!allowed) {
    return {
      success: false,
      message: "You do not have permission to delete companies.",
    };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("companies")
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
    message: "Company deleted successfully.",
  };
}