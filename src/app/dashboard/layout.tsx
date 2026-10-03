import { redirect } from "next/navigation";
import { ToastMessage } from "@/components/shared/toast-message";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { switchWorkspace } from "./actions";
import { MobileNav } from "@/components/dashboard/mobile-nav";
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceId = await getCurrentWorkspaceId();

  const [
    { data: profile },
    { data: workspace },
    { data: membership },
    { data: memberships },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),

    supabase
      .from("workspaces")
      .select("id, name")
      .eq("id", workspaceId)
      .single(),

    supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .single(),

    supabase
      .from("workspace_members")
      .select(`
        workspace_id,
        role,
        workspaces (
          id,
          name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: true,
      }),
  ]);

  const availableWorkspaces =
    memberships?.map((item) => {
      const workspaceData = Array.isArray(
        item.workspaces
      )
        ? item.workspaces[0]
        : item.workspaces;

      return {
        id: item.workspace_id,
        name:
          workspaceData?.name ?? "Workspace",
        role: item.role,
      };
    }) ?? [];

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          email={user.email}
          fullName={profile?.full_name ?? null}
          workspaceName={
            workspace?.name ?? "Workspace"
          }
          workspaceId={workspaceId}
          role={membership?.role ?? "member"}
          workspaces={availableWorkspaces}
          switchWorkspaceAction={switchWorkspace}
        />
         <MobileNav />
<ToastMessage />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}