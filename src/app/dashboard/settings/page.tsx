import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { updateSettings } from "./actions";
import { buttonVariants } from "@/components/ui/button";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const workspaceId = await getCurrentWorkspaceId();

  const [
    { data: profile },
    { data: workspace },
    { data: membership },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),

    supabase
      .from("workspaces")
      .select("name, owner_id")
      .eq("id", workspaceId)
      .single(),

    supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .single(),
  ]);

  const isOwner = workspace?.owner_id === user.id;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage your profile and workspace settings.
        </p>
      </div>

      {params.success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm">
          {params.success}
        </div>
      )}

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={updateSettings}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="full_name"
            className="text-sm font-medium"
          >
            Full Name
          </label>

          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile?.full_name ?? ""}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={user.email ?? ""}
            disabled
            className="w-full rounded-md border bg-muted px-3 py-2 text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Role
          </label>

          <input
            type="text"
            value={membership?.role ?? "member"}
            disabled
            className="w-full rounded-md border bg-muted px-3 py-2 capitalize text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="workspace_name"
            className="text-sm font-medium"
          >
            Workspace Name
          </label>

          <input
            id="workspace_name"
            name="workspace_name"
            type="text"
            defaultValue={workspace?.name ?? ""}
            required
            disabled={!isOwner}
            className="w-full rounded-md border px-3 py-2 disabled:bg-muted"
          />

          {!isOwner && (
            <p className="text-xs text-muted-foreground">
              Only the workspace owner can rename this workspace.
            </p>
          )}
        </div>

        <button
          type="submit"
          className={buttonVariants()}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}