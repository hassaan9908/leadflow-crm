import Link from "next/link";
import { signup } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({
  searchParams,
}: SignupPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create account</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Start managing your sales pipeline with LeadFlow.
          </p>
        </div>

        {params.error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {params.error}
          </div>
        )}

        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="Muhammad Hassaan"
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
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}