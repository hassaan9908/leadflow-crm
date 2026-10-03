import { createClient } from "@/lib/supabase/server";
import { acceptInvitation } from "./actions";
import { buttonVariants } from "@/components/ui/button";

export default async function InvitationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: invitations, error } = await supabase
    .from("workspace_invitations")
    .select(`
      id,
      role,
      status,
      created_at,
      workspace_id,
      workspaces (
        name
      )
    `)
    .eq("email", user.email.toLowerCase())
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <p className="text-destructive">
          Failed to load invitations: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Invitations
        </h1>

        <p className="text-muted-foreground">
          Workspace invitations sent to your email.
        </p>
      </div>

      <div className="space-y-4">
        {invitations && invitations.length > 0 ? (
          invitations.map((invitation) => {
            const workspace = Array.isArray(invitation.workspaces)
              ? invitation.workspaces[0]
              : invitation.workspaces;

            return (
              <div
                key={invitation.id}
                className="flex items-center justify-between rounded-lg border bg-background p-5"
              >
                <div>
                  <h2 className="font-semibold">
                    {workspace?.name ?? "Workspace"}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Role: {invitation.role}
                  </p>
                </div>

                <form
                  action={acceptInvitation.bind(
                    null,
                    invitation.id
                  )}
                >
                  <button
                    type="submit"
                    className={buttonVariants()}
                  >
                    Accept Invitation
                  </button>
                </form>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            No pending invitations.
          </div>
        )}
      </div>
    </div>
  );
}