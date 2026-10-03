import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { updateLead } from "./actions";

type EditLeadPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditLeadPage({
  params,
  searchParams,
}: EditLeadPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const [
  { data: lead },
  { data: companies },
] = await Promise.all([
  supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single(),

  supabase
    .from("companies")
    .select("id, name")
    .eq("workspace_id", workspaceId)
    .order("name"),
]);

  if (!lead) {
    notFound();
  }

  const updateLeadWithId = updateLead.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Lead
        </h1>

        <p className="text-muted-foreground">
          Update lead information.
        </p>
      </div>

      {query.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {query.error}
        </div>
      )}

      <form
        action={updateLeadWithId}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="First Name"
            name="first_name"
            defaultValue={lead.first_name}
            required
          />

          <InputField
            label="Last Name"
            name="last_name"
            defaultValue={lead.last_name ?? ""}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            defaultValue={lead.email ?? ""}
          />

          <InputField
            label="Phone"
            name="phone"
            defaultValue={lead.phone ?? ""}
          />

          <InputField
            label="Job Title"
            name="job_title"
            defaultValue={lead.job_title ?? ""}
          />

          <InputField
            label="Country"
            name="country"
            defaultValue={lead.country ?? ""}
          />

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
              defaultValue={lead.company_id ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2"
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
            <label
              htmlFor="status"
              className="text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={lead.status ?? ""}
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <InputField
            label="Lead Score"
            name="lead_score"
            type="number"
            defaultValue={lead.lead_score ?? 0}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Save Changes
          </button>

          <Link
            href={`/dashboard/leads/${id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string | number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 100 : undefined}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}