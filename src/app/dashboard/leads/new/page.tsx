import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { createLead } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentWorkspaceId } from "@/lib/workspace";
type NewLeadPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewLeadPage({
  searchParams,
}: NewLeadPageProps) {
  const params = await searchParams;

  const supabase = await createClient();

  const workspaceId = await getCurrentWorkspaceId();

const { data: companies } = await supabase
  .from("companies")
  .select("id, name")
  .eq("workspace_id", workspaceId)
  .order("name");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Lead</h1>

        <p className="text-muted-foreground">
          Create a new sales lead.
        </p>
      </div>

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={createLead}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="Ahmed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="Khan"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border px-3 py-2"
              placeholder="ahmed@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="+92 300 0000000"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="job_title" className="text-sm font-medium">
              Job Title
            </label>

            <input
              id="job_title"
              name="job_title"
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="CTO"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>

            <input
              id="country"
              name="country"
              type="text"
              className="w-full rounded-md border px-3 py-2"
              placeholder="USA"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company_id" className="text-sm font-medium">
              Company
            </label>

            <select
              id="company_id"
              name="company_id"
              className="w-full rounded-md border bg-background px-3 py-2"
              defaultValue=""
            >
              <option value="">No company</option>

              {companies?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>

            <select
              id="status"
              name="status"
              className="w-full rounded-md border bg-background px-3 py-2"
              defaultValue="new"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="lead_score" className="text-sm font-medium">
              Lead Score
            </label>

            <input
              id="lead_score"
              name="lead_score"
              type="number"
              min="0"
              max="100"
              defaultValue="0"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Create Lead
          </button>

          <Link
            href="/dashboard/leads"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}