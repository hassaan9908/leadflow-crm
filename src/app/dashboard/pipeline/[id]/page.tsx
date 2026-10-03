import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  getCurrentWorkspaceId,
  getCurrentWorkspaceRole,
} from "@/lib/workspace";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";

import { deleteDeal } from "./actions";

type DealDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealDetailsPage({
  params,
}: DealDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const role = await getCurrentWorkspaceRole();

  const canDelete =
    role === "owner" || role === "admin";

  const { data: deal, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      value,
      stage,
      expected_close_date,
      created_at,
      company_id,
      lead_id,
      workspace_id,
      companies (
        name
      ),
      leads (
        first_name,
        last_name,
        email,
        job_title
      ),
      activities (
        id,
        type,
        description,
        created_at,
        lead_id,
        leads (
          first_name,
          last_name
        )
      )
    `)
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  if (error || !deal) {
    notFound();
  }

  const company = Array.isArray(deal.companies)
    ? deal.companies[0]
    : deal.companies;

  const lead = Array.isArray(deal.leads)
    ? deal.leads[0]
    : deal.leads;

  const companyName =
    company?.name ?? "No company";

  const leadName = lead
    ? `${lead.first_name} ${lead.last_name ?? ""}`.trim()
    : "No lead";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {deal.title}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Sales opportunity details
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/pipeline/${deal.id}/edit`}
            className={buttonVariants()}
          >
            Edit Deal
          </Link>

          {canDelete && (
            <DeleteButton
              action={deleteDeal.bind(null, deal.id)}
              label="Delete Deal"
              itemName="this deal"
              redirectTo="/dashboard/pipeline"
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Deal Information
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Value:</span>{" "}
              ${Number(deal.value ?? 0).toLocaleString()}
            </p>

            <div className="flex items-center gap-2">
              <span className="font-medium">Stage:</span>

              <Badge variant="secondary">
                {deal.stage}
              </Badge>
            </div>

            <p>
              <span className="font-medium">
                Expected Close:
              </span>{" "}
              {deal.expected_close_date
                ? new Date(
                    deal.expected_close_date
                  ).toLocaleDateString()
                : "—"}
            </p>

            <p>
              <span className="font-medium">Created:</span>{" "}
              {deal.created_at
  ? new Date(deal.created_at).toLocaleDateString()
  : "—"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Relationships
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Company:</span>{" "}

              {deal.company_id ? (
                <Link
                  href={`/dashboard/companies/${deal.company_id}`}
                  className="text-primary hover:underline"
                >
                  {companyName}
                </Link>
              ) : (
                companyName
              )}
            </p>

            <p>
              <span className="font-medium">Lead:</span>{" "}

              {deal.lead_id ? (
                <Link
                  href={`/dashboard/leads/${deal.lead_id}`}
                  className="text-primary hover:underline"
                >
                  {leadName}
                </Link>
              ) : (
                leadName
              )}
            </p>

            {lead && (
              <>
                <p>
                  <span className="font-medium">
                    Contact:
                  </span>{" "}
                  {lead.email ?? "—"}
                </p>

                <p>
                  <span className="font-medium">
                    Job Title:
                  </span>{" "}
                  {lead.job_title ?? "—"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Activity Timeline
          </h2>

          <p className="text-sm text-muted-foreground">
            Recent activity related to this deal.
          </p>
        </div>

        <div className="space-y-4 p-6">
          {deal.activities &&
          deal.activities.length > 0 ? (
            [...deal.activities]
              .sort((a, b) => {
  const bTime = b.created_at
    ? new Date(b.created_at).getTime()
    : 0;

  const aTime = a.created_at
    ? new Date(a.created_at).getTime()
    : 0;

  return bTime - aTime;
})
              .map((activity) => {
                const activityLead = Array.isArray(
                  activity.leads
                )
                  ? activity.leads[0]
                  : activity.leads;

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
  ? new Date(activity.created_at).toLocaleString()
  : "—"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm">
                      {activity.description ??
                        "No description"}
                    </p>

                    {activityLead &&
                      activity.lead_id && (
                        <Link
                          href={`/dashboard/leads/${activity.lead_id}`}
                          className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                          Lead:{" "}
                          {activityLead.first_name}{" "}
                          {activityLead.last_name ?? ""}
                        </Link>
                      )}
                  </div>
                );
              })
          ) : (
            <p className="text-sm text-muted-foreground">
              No activities recorded for this deal.
            </p>
          )}
        </div>
      </div>

      <Link
        href="/dashboard/pipeline"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Back to Pipeline
      </Link>
    </div>
  );
}