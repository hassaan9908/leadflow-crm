"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function acceptInvitation(
  invitationId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const { data: invitation, error } = await supabase
    .from("workspace_invitations")
    .select(`
      id,
      workspace_id,
      email,
      role,
      status
    `)
    .eq("id", invitationId)
    .eq("email", user.email.toLowerCase())
    .eq("status", "pending")
    .single();

  if (error || !invitation) {
    redirect(
      "/dashboard/invitations?error=Invitation not found"
    );
  }

  const { error: membershipError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: invitation.workspace_id,
      user_id: user.id,
      role: invitation.role,
    });

  if (membershipError) {
    redirect(
      `/dashboard/invitations?error=${encodeURIComponent(
        membershipError.message
      )}`
    );
  }

  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({
      status: "accepted",
    })
    .eq("id", invitation.id);

  if (updateError) {
    redirect(
      `/dashboard/invitations?error=${encodeURIComponent(
        updateError.message
      )}`
    );
  }

  redirect(
    "/dashboard/invitations?success=Invitation accepted"
  );
}