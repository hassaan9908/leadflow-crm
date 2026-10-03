import Link from "next/link";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Login to your LeadFlow CRM account.
          </p>
        </div>

        {params.message && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm">
            {params.message}
          </div>
        )}

        {params.error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {params.error}
          </div>
        )}

        <form action={login} className="space-y-4">
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
              className="w-full rounded-md border px-3 py-2"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}