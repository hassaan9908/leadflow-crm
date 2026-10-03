import Link from "next/link";
import { Plus } from "lucide-react";

import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type LeadsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    country?: string;
  }>;
};

type LeadRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  job_title: string | null;
  country: string | null;
  status: string | null;
  lead_score: number | null;
  created_at: string | null;
  company: {
    name: string;
  } | null;
};

export default async function LeadsPage({
  searchParams,
}: LeadsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status ?? "";
  const country = params.country ?? "";

  const hasFilters = Boolean(search || status || country);

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  let query = supabase
    .from("leads")
    .select(`
      id,
      first_name,
      last_name,
      email,
      job_title,
      country,
      status,
      lead_score,
      created_at,
      company:companies (
        name
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (country) {
    query = query.eq("country", country);
  }

  const { data, error } = await query;

  const leads = (data ?? []) as unknown as LeadRow[];

  const { data: countryRows } = await supabase
    .from("leads")
    .select("country")
    .eq("workspace_id", workspaceId)
    .not("country", "is", null);

  const countries = Array.from(
    new Set(
      countryRows
        ?.map((lead) => lead.country)
        .filter((value): value is string => Boolean(value))
    )
  ).sort();

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Leads
        </h1>

        <p className="text-destructive">
          Failed to load leads: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leads
          </h1>

          <p className="text-muted-foreground">
            Manage and track your sales leads.
          </p>
        </div>

        <Link
          href="/dashboard/leads/new"
          className={buttonVariants()}
        >
          <Plus
            data-icon="inline-start"
            className="h-4 w-4"
          />

          Add Lead
        </Link>
      </div>

      <form className="grid gap-3 rounded-lg border bg-background p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium"
          >
            Search
          </label>

          <input
            id="search"
            name="search"
            type="text"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={status}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="unqualified">Unqualified</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <select
            id="country"
            name="country"
            defaultValue={country}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All countries</option>

            {countries.map((countryName) => (
              <option
                key={countryName}
                value={countryName}
              >
                {countryName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 md:col-span-4">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Apply Filters
          </button>

          <Link
            href="/dashboard/leads"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Reset
          </Link>
        </div>
      </form>

      {leads.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border bg-background">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Lead
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Company
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Title
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Country
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.first_name} {lead.last_name}
                      </Link>

                      <div className="text-muted-foreground">
                        {lead.email ?? "No email"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {lead.company?.name ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      {lead.job_title ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      {lead.country ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="secondary">
                        {lead.status ?? "new"}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {lead.lead_score ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {leads.length} lead
            {leads.length === 1 ? "" : "s"}
          </p>
        </>
      ) : (
        <div className="rounded-lg border border-dashed bg-background p-12 text-center">
          <h2 className="text-lg font-semibold">
            {hasFilters
              ? "No leads found"
              : "No leads yet"}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {hasFilters
              ? "No leads match your current search or filters."
              : "Start building your sales pipeline by adding your first lead."}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            {hasFilters ? (
              <Link
                href="/dashboard/leads"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                Clear Filters
              </Link>
            ) : (
              <Link
                href="/dashboard/leads/new"
                className={buttonVariants()}
              >
                <Plus className="h-4 w-4" />
                Add First Lead
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}