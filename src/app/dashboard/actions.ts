"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function switchWorkspace(
  formData: FormData
) {
  const workspaceId = formData.get(
    "workspace_id"
  ) as string;

  if (!workspaceId) {
    redirect("/dashboard");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Security check:
  // user must actually belong to selected workspace.
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();

  cookieStore.set(
    "leadflow_workspace_id",
    workspaceId,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  revalidatePath("/dashboard", "layout");

  redirect("/dashboard");
}