import Link from "next/link";

import { createCompany } from "./actions";
import { buttonVariants } from "@/components/ui/button";

type NewCompanyPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewCompanyPage({
  searchParams,
}: NewCompanyPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add Company
        </h1>

        <p className="text-muted-foreground">
          Add a new company to your CRM.
        </p>
      </div>

      {params.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </div>
      )}

      <form
        action={createCompany}
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
              placeholder="Acme Inc"
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
              placeholder="SaaS"
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
              placeholder="https://example.com"
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
              placeholder="USA"
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
              placeholder="500"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={buttonVariants()}
          >
            Create Company
          </button>

          <Link
            href="/dashboard/companies"
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