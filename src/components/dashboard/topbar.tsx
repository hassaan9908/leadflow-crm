import { LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

type WorkspaceOption = {
  id: string;
  name: string;
  role: string;
};

type TopbarProps = {
  email?: string;
  fullName: string | null;
  workspaceName: string;
  workspaceId: string;
  role: string;

  workspaces: WorkspaceOption[];

  switchWorkspaceAction: (
    formData: FormData
  ) => Promise<void>;
};

export function Topbar({
  email,
  fullName,
  workspaceName,
  workspaceId,
  role,
  workspaces,
  switchWorkspaceAction,
}: TopbarProps) {
  const displayName =
    fullName?.trim() ||
    email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedRole =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="hidden lg:block">
          <p className="text-xs text-muted-foreground">
            Workspace
          </p>

          <p className="text-sm font-medium">
            {workspaceName}
          </p>
        </div>

        {workspaces.length > 1 && (
          <form
            action={switchWorkspaceAction}
            className="flex items-center gap-2"
          >
            <select
              name="workspace_id"
              defaultValue={workspaceId}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {workspaces.map((workspace) => (
                <option
                  key={workspace.id}
                  value={workspace.id}
                >
                  {workspace.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              Switch
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">
            {displayName}
          </p>

          <p className="text-xs text-muted-foreground">
            {formattedRole}
          </p>
        </div>

        <Avatar>
          <AvatarFallback>
            {initials}
          </AvatarFallback>
        </Avatar>

        <form
          action="/auth/signout"
          method="post"
        >
          <button
            type="submit"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}