import Link from "next/link";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { createActivity } from "./actions";
import { buttonVariants } from "@/components/ui/button";

type NewActivityPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewActivityPage({
  searchParams,
}: NewActivityPageProps) {
  const params = await searchParams;

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const [
  { data: leads },
  { data: deals },
] = await Promise.all([
  supabase
    .from("leads")
    .select("id, first_name, last_name")
    .eq("workspace_id", workspaceId)
    .order("first_name"),

  supabase
    .from("deals")
    .select("id, title")
    .eq("workspace_id", workspaceId)
    .order("title"),
]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add Activity
        </h1>

        <p className="text-muted-foreground">
          Log a sales interaction or follow-up.
        </p>
      </div>

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={createActivity}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="text-sm font-medium"
          >
            Activity Type
          </label>

          <select
            id="type"
            name="type"
            defaultValue="note"
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            <option value="note">Note</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="meeting">Meeting</option>
            <option value="follow_up">Follow-up</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Discussed pricing and implementation timeline..."
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="lead_id"
              className="text-sm font-medium"
            >
              Lead
            </label>

            <select
              id="lead_id"
              name="lead_id"
              defaultValue=""
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="">No lead</option>

              {leads?.map((lead) => (
                <option
                  key={lead.id}
                  value={lead.id}
                >
                  {lead.first_name} {lead.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deal_id"
              className="text-sm font-medium"
            >
              Deal
            </label>

            <select
              id="deal_id"
              name="deal_id"
              defaultValue=""
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="">No deal</option>

              {deals?.map((deal) => (
                <option
                  key={deal.id}
                  value={deal.id}
                >
                  {deal.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Create Activity
          </button>

          <Link
            href="/dashboard/activities"
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