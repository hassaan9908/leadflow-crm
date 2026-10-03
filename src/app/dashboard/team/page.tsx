import Link from "next/link";
import { Mail, UserPlus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  getCurrentWorkspaceRole,
} from "@/lib/workspace";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import { updateMemberRole } from "./actions";

export default async function TeamPage() {
  const role = await getCurrentWorkspaceRole();

  const canManage =
    role === "owner" || role === "admin";

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data: members, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      role,
      created_at,
      user_id,
      profiles (
        full_name
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Team
            </h1>

            <p className="text-muted-foreground">
              Manage members of your LeadFlow workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/invitations"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              <Mail className="h-4 w-4" />
              Invitations
            </Link>

            {canManage && (
              <Link
                href="/dashboard/team/invite"
                className={buttonVariants()}
              >
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Link>
            )}
          </div>
        </div>

        <p className="text-destructive">
          Failed to load team members: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Team
          </h1>

          <p className="text-muted-foreground">
            Manage members of your LeadFlow workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/invitations"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <Mail className="h-4 w-4" />
            Invitations
          </Link>

          {canManage && (
            <Link
              href="/dashboard/team/invite"
              className={buttonVariants()}
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Member
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Role
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Joined
              </th>

              {canManage && (
                <th className="px-4 py-3 text-left font-medium">
                  Manage
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {members && members.length > 0 ? (
              members.map((member) => {
                const profile = member.profiles;

                const targetRole = member.role;

                const canEditThisMember =
                  targetRole !== "owner" &&
                  (
                    role === "owner" ||
                    (
                      role === "admin" &&
                      targetRole === "member"
                    )
                  );

                return (
                  <tr
                    key={member.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-4 font-medium">
                      {profile?.full_name ?? "Unknown user"}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="secondary">
                        {member.role}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      {member.created_at
                        ? new Date(
                            member.created_at
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    {canManage && (
                      <td className="px-4 py-4">
                        {canEditThisMember ? (
                          <form
                            action={updateMemberRole}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="hidden"
                              name="member_id"
                              value={member.id}
                            />

                            <select
                              name="role"
                              defaultValue={member.role}
                              className="rounded-md border bg-background px-3 py-2 text-sm"
                            >
                              <option value="member">
                                Member
                              </option>

                              {role === "owner" && (
                                <option value="admin">
                                  Admin
                                </option>
                              )}
                            </select>

                            <button
                              type="submit"
                              className={buttonVariants({
                                variant: "outline",
                                size: "sm",
                              })}
                            >
                              Update
                            </button>
                          </form>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={canManage ? 4 : 3}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No workspace members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}