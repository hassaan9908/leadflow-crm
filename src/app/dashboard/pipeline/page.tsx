import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { buttonVariants } from "@/components/ui/button";

type DealRow = {
  id: string;
  title: string;
  value: number;
  stage: string;
  expected_close_date: string | null;

  companies:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;

  leads:
    | {
        first_name: string;
        last_name: string | null;
      }
    | {
        first_name: string;
        last_name: string | null;
      }[]
    | null;
};

export default async function PipelinePage() {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      value,
      stage,
      expected_close_date,
      companies (
        name
      ),
      leads (
        first_name,
        last_name
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to load pipeline:", error);
  }

  const rows = (data ?? []) as unknown as DealRow[];

  const deals = rows.map((deal) => {
    const company = Array.isArray(deal.companies)
      ? deal.companies[0]
      : deal.companies;

    const lead = Array.isArray(deal.leads)
      ? deal.leads[0]
      : deal.leads;

    const leadName = lead
      ? `${lead.first_name} ${lead.last_name ?? ""}`.trim()
      : null;

    return {
      id: deal.id,
      title: deal.title,
      value: Number(deal.value ?? 0),
      stage: deal.stage,
      expected_close_date: deal.expected_close_date,
      companyName: company?.name ?? null,
      leadName,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sales Pipeline
          </h1>

          <p className="text-muted-foreground">
            Manage and track your deals across each sales stage.
          </p>
        </div>

        <Link
          href="/dashboard/pipeline/new"
          className={buttonVariants()}
        >
          Add Deal
        </Link>
      </div>

      {deals.length > 0 ? (
        <PipelineBoard
          initialDeals={deals}
          workspaceId={workspaceId}
        />
      ) : (
        <div className="rounded-lg border border-dashed bg-background p-12 text-center">
          <h2 className="text-lg font-semibold">
            No deals yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first deal to start tracking opportunities
            through the sales pipeline.
          </p>

          <Link
            href="/dashboard/pipeline/new"
            className={buttonVariants({
              className: "mt-5",
            })}
          >
            Create First Deal
          </Link>
        </div>
      )}
    </div>
  );
}