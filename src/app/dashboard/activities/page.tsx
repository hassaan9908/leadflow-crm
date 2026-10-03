import Link from "next/link";
import { Plus } from "lucide-react";

import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ActivitiesPage() {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data: activities, error } = await supabase
    .from("activities")
    .select(`
      id,
      type,
      description,
      created_at,
      lead_id,
      deal_id,
      leads (
        first_name,
        last_name
      ),
      deals (
        title
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Activities
        </h1>

        <p className="text-destructive">
          Failed to load activities: {error.message}
        </p>
      </div>
    );
  }

  const hasActivities =
    activities && activities.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activities
          </h1>

          <p className="text-muted-foreground">
            Track calls, emails, meetings and follow-ups.
          </p>
        </div>

        <Link
          href="/dashboard/activities/new"
          className={buttonVariants()}
        >
          <Plus
            data-icon="inline-start"
            className="h-4 w-4"
          />

          Add Activity
        </Link>
      </div>

      {hasActivities ? (
        <div className="space-y-3">
          {activities.map((activity) => {
            const lead = activity.leads;
            const deal = activity.deals;

            return (
              <div
                key={activity.id}
                className="rounded-lg border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {activity.type}
                      </Badge>

                      <span className="text-sm text-muted-foreground">
                        {activity.created_at
                          ? new Date(
                              activity.created_at
                            ).toLocaleString()
                          : "—"}
                      </span>
                    </div>

                    <p className="mt-3">
                      {activity.description ||
                        "No description"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {lead && activity.lead_id && (
                        <Link
                          href={`/dashboard/leads/${activity.lead_id}`}
                          className="hover:underline"
                        >
                          Lead: {lead.first_name}{" "}
                          {lead.last_name ?? ""}
                        </Link>
                      )}

                      {deal && activity.deal_id && (
                        <Link
                          href={`/dashboard/pipeline/${activity.deal_id}`}
                          className="hover:underline"
                        >
                          Deal: {deal.title}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-background p-12 text-center">
          <h2 className="text-lg font-semibold">
            No activities yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Log your first call, email, meeting or follow-up
            to start building a complete sales history.
          </p>

          <Link
            href="/dashboard/activities/new"
            className={buttonVariants({
              className: "mt-5",
            })}
          >
            <Plus className="h-4 w-4" />
            Add First Activity
          </Link>
        </div>
      )}
    </div>
  );
}