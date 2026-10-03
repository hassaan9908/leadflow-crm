import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { updateCompany } from "./actions";

type EditCompanyPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditCompanyPage({
  params,
  searchParams,
}: EditCompanyPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const supabase = await createClient();
const workspaceId = await getCurrentWorkspaceId();

  const { data: company, error } = await supabase
  .from("companies")
  .select(`
    id,
    name,
    industry,
    website,
    country,
    company_size
  `)
  .eq("id", id)
  .eq("workspace_id", workspaceId)
  .single();

  if (error || !company) {
    notFound();
  }

  const updateCompanyWithId = updateCompany.bind(
    null,
    id
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Company
        </h1>

        <p className="text-muted-foreground">
          Update company information.
        </p>
      </div>

      {query.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {query.error}
        </div>
      )}

      <form
        action={updateCompanyWithId}
        className="space-y-6 rounded-lg border bg-background p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Company Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={company.name}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="industry"
              className="text-sm font-medium"
            >
              Industry
            </label>

            <input
              id="industry"
              name="industry"
              type="text"
              defaultValue={company.industry ?? ""}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="website"
              className="text-sm font-medium"
            >
              Website
            </label>

            <input
              id="website"
              name="website"
              type="url"
              defaultValue={company.website ?? ""}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="text-sm font-medium"
            >
              Country
            </label>

            <input
              id="country"
              name="country"
              type="text"
              defaultValue={company.country ?? ""}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company_size"
              className="text-sm font-medium"
            >
              Company Size
            </label>

            <input
              id="company_size"
              name="company_size"
              type="number"
              min="1"
              defaultValue={company.company_size ?? ""}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Save Changes
          </button>

          <Link
            href={`/dashboard/companies/${company.id}`}
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