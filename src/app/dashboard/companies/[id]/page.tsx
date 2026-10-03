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

import { deleteCompany } from "./actions";

type CompanyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompanyDetailsPage({
  params,
}: CompanyDetailsPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const role = await getCurrentWorkspaceRole();

  const canDelete =
    role === "owner" || role === "admin";

  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      id,
      name,
      industry,
      website,
      country,
      company_size,
      created_at,
      workspace_id,
      leads (
        id,
        first_name,
        last_name,
        email,
        job_title,
        status,
        lead_score
      )
    `)
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  if (error || !company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {company.name}
          </h1>

          <p className="text-muted-foreground">
            {company.industry ?? "No industry specified"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/companies/${company.id}/edit`}
            className={buttonVariants()}
          >
            Edit Company
          </Link>

          {canDelete && (
            <DeleteButton
              action={deleteCompany.bind(null, company.id)}
              label="Delete Company"
              itemName="this company"
              redirectTo="/dashboard/companies"
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Company Information
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Industry:</span>{" "}
              {company.industry ?? "—"}
            </p>

            <p>
              <span className="font-medium">Country:</span>{" "}
              {company.country ?? "—"}
            </p>

            <p>
              <span className="font-medium">Employees:</span>{" "}
              {company.company_size ?? "—"}
            </p>

            <p>
              <span className="font-medium">Website:</span>{" "}
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {company.website}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">
            CRM Summary
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Total Leads:</span>{" "}
              {company.leads?.length ?? 0}
            </p>

            <p>
              <span className="font-medium">Created:</span>{" "}
              {company.created_at
  ? new Date(company.created_at).toLocaleDateString()
  : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Associated Leads
          </h2>

          <p className="text-sm text-muted-foreground">
            Leads currently associated with this company.
          </p>
        </div>

        {company.leads && company.leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Lead
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Title
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
                {company.leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-b-0"
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
                      {lead.job_title ?? "—"}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="secondary">
                        {lead.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-4">
                      {lead.lead_score ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No leads associated with this company.
          </div>
        )}
      </div>

      <Link
        href="/dashboard/companies"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Back to Companies
      </Link>
    </div>
  );
}