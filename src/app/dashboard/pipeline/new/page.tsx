import Link from "next/link";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { createDeal } from "./actions";
import { buttonVariants } from "@/components/ui/button";

type NewDealPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewDealPage({
  searchParams,
}: NewDealPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const workspaceId = await getCurrentWorkspaceId();

const [
  { data: companies },
  { data: leads },
] = await Promise.all([
  supabase
    .from("companies")
    .select("id, name")
    .eq("workspace_id", workspaceId)
    .order("name"),

  supabase
    .from("leads")
    .select("id, first_name, last_name")
    .eq("workspace_id", workspaceId)
    .order("first_name"),
]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add Deal
        </h1>

        <p className="text-muted-foreground">
          Create a new sales opportunity.
        </p>
      </div>

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={createDeal}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="title"
              className="text-sm font-medium"
            >
              Deal Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Enterprise SaaS Deal"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="value"
              className="text-sm font-medium"
            >
              Deal Value
            </label>

            <input
              id="value"
              name="value"
              type="number"
              min="0"
              step="0.01"
              placeholder="10000"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stage"
              className="text-sm font-medium"
            >
              Stage
            </label>

            <select
              id="stage"
              name="stage"
              defaultValue="new"
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company_id"
              className="text-sm font-medium"
            >
              Company
            </label>

            <select
              id="company_id"
              name="company_id"
              defaultValue=""
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="">No company</option>

              {companies?.map((company) => (
                <option
                  key={company.id}
                  value={company.id}
                >
                  {company.name}
                </option>
              ))}
            </select>
          </div>

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
                <option key={lead.id} value={lead.id}>
                  {lead.first_name} {lead.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="expected_close_date"
              className="text-sm font-medium"
            >
              Expected Close Date
            </label>

            <input
              id="expected_close_date"
              name="expected_close_date"
              type="date"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Create Deal
          </button>

          <Link
            href="/dashboard/pipeline"
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