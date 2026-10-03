export default function LeadsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-10 w-24 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-lg border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b p-4 last:border-b-0"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-56 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}