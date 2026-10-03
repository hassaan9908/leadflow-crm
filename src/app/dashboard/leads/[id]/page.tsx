import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteLead } from "./actions";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  getCurrentWorkspaceRole,
} from "@/lib/workspace";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";

type LeadDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailsPage({
  params,
}: LeadDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const role = await getCurrentWorkspaceRole();
  const canDelete =
    role === "owner" || role === "admin";

  const workspaceId = await getCurrentWorkspaceId();

  const { data: lead, error } = await supabase
    .from("leads")
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      job_title,
      country,
      status,
      lead_score,
      created_at,
      company_id,
      companies (
        name
      ),
      activities (
        id,
        type,
        description,
        created_at,
        deal_id,
        deals (
          title
        )
      )
    `)
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  if (error || !lead) {
    notFound();
  }

  const company = lead.companies;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lead.first_name} {lead.last_name}
          </h1>

          <p className="text-muted-foreground">
            {lead.job_title ?? "No job title"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/leads/${lead.id}/edit`}
            className={buttonVariants()}
          >
            Edit Lead
          </Link>

          {canDelete && (
            <DeleteButton
              action={deleteLead.bind(null, lead.id)}
              label="Delete Lead"
              itemName="this lead"
              redirectTo="/dashboard/leads"
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Contact Information
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Email:</span>{" "}
              {lead.email ?? "—"}
            </p>

            <p>
              <span className="font-medium">Phone:</span>{" "}
              {lead.phone ?? "—"}
            </p>

            <p>
              <span className="font-medium">Country:</span>{" "}
              {lead.country ?? "—"}
            </p>

            <p>
              <span className="font-medium">Company:</span>{" "}
              {company?.name ?? "—"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Lead Information
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>

              <Badge variant="secondary">
                {lead.status}
              </Badge>
            </div>

            <p>
              <span className="font-medium">Lead Score:</span>{" "}
              {lead.lead_score ?? 0}
            </p>

            <p>
              <span className="font-medium">Created:</span>{" "}
              {lead.created_at
                ? new Date(
                    lead.created_at
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Activity Timeline
          </h2>

          <p className="text-sm text-muted-foreground">
            Recent interactions with this lead.
          </p>
        </div>

        <div className="space-y-4 p-6">
          {lead.activities &&
          lead.activities.length > 0 ? (
            [...lead.activities]
              .sort((a, b) => {
                const bTime = b.created_at
                  ? new Date(
                      b.created_at
                    ).getTime()
                  : 0;

                const aTime = a.created_at
                  ? new Date(
                      a.created_at
                    ).getTime()
                  : 0;

                return bTime - aTime;
              })
              .map((activity) => {
                const activityDeal =
                  activity.deals;

                return (
                  <div
                    key={activity.id}
                    className="border-l-2 pl-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {activity.type}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {activity.created_at
                          ? new Date(
                              activity.created_at
                            ).toLocaleString()
                          : "—"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm">
                      {activity.description ??
                        "No description"}
                    </p>

                    {activityDeal &&
                      activity.deal_id && (
                        <Link
                          href={`/dashboard/pipeline/${activity.deal_id}`}
                          className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                          Deal:{" "}
                          {activityDeal.title}
                        </Link>
                      )}
                  </div>
                );
              })
          ) : (
            <p className="text-sm text-muted-foreground">
              No activities recorded for this lead.
            </p>
          )}
        </div>
      </div>

      <Link
        href="/dashboard/leads"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Back to Leads
      </Link>
    </div>
  );
}