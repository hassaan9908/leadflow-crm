import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { updateDeal } from "./actions";

type EditDealPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditDealPage({
  params,
  searchParams,
}: EditDealPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const [
  { data: deal },
  { data: companies },
  { data: leads },
] = await Promise.all([
  supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single(),

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

  if (!deal) {
    notFound();
  }

  const updateDealWithId = updateDeal.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Deal
        </h1>

        <p className="text-muted-foreground">
          Update this sales opportunity.
        </p>
      </div>

      {query.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {query.error}
        </div>
      )}

      <form
        action={updateDealWithId}
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
              defaultValue={deal.title}
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
              defaultValue={deal.value ?? 0}
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
              defaultValue={deal.stage?? ""}
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
              defaultValue={deal.company_id ?? ""}
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
              defaultValue={deal.lead_id ?? ""}
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
              htmlFor="expected_close_date"
              className="text-sm font-medium"
            >
              Expected Close Date
            </label>

            <input
              id="expected_close_date"
              name="expected_close_date"
              type="date"
              defaultValue={
                deal.expected_close_date ?? ""
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Save Changes
          </button>

          <Link
            href={`/dashboard/pipeline/${deal.id}`}
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