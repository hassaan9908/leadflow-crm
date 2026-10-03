import Link from "next/link";
import { Plus } from "lucide-react";

import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

import { buttonVariants } from "@/components/ui/button";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data: companies, error } = await supabase
    .from("companies")
    .select(`
      id,
      name,
      industry,
      website,
      country,
      company_size,
      created_at,
      leads (
        id
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Companies
        </h1>

        <p className="text-destructive">
          Failed to load companies: {error.message}
        </p>
      </div>
    );
  }

  const hasCompanies =
    companies && companies.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Companies
          </h1>

          <p className="text-muted-foreground">
            Manage companies and their associated leads.
          </p>
        </div>

        <Link
          href="/dashboard/companies/new"
          className={buttonVariants()}
        >
          <Plus
            data-icon="inline-start"
            className="h-4 w-4"
          />

          Add Company
        </Link>
      </div>

      {hasCompanies ? (
        <>
          <div className="overflow-x-auto rounded-lg border bg-background">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Company
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Industry
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Country
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Size
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Leads
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Website
                  </th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        className="font-medium hover:underline"
                      >
                        {company.name}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      {company.industry ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      {company.country ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      {company.company_size ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      {company.leads?.length ?? 0}
                    </td>

                    <td className="px-4 py-4">
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            Total companies: {companies.length}
          </p>
        </>
      ) : (
        <div className="rounded-lg border border-dashed bg-background p-12 text-center">
          <h2 className="text-lg font-semibold">
            No companies yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add your first company to start organizing leads
            and sales opportunities.
          </p>

          <Link
            href="/dashboard/companies/new"
            className={buttonVariants({
              className: "mt-5",
            })}
          >
            <Plus className="h-4 w-4" />
            Add First Company
          </Link>
        </div>
      )}
    </div>
  );
}