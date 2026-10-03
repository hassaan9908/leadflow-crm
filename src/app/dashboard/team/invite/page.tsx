import Link from "next/link";

import { inviteMember } from "./actions";
import { buttonVariants } from "@/components/ui/button";

type InvitePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function InvitePage({
  searchParams,
}: InvitePageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Invite Team Member
        </h1>

        <p className="text-muted-foreground">
          Invite someone to join your workspace.
        </p>
      </div>

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={inviteMember}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="text-sm font-medium"
          >
            Role
          </label>

          <select
            id="role"
            name="role"
            defaultValue="member"
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            <option value="member">
              Member
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
          Admins can help manage the workspace.
          Members can work with CRM data but won't
          receive workspace ownership.
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Create Invitation
          </button>

          <Link
            href="/dashboard/team"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}