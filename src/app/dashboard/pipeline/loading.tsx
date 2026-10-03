export default function PipelineLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-10 w-24 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-72 shrink-0 rounded-lg border p-4"
          >
            <div className="mb-4 h-5 w-24 animate-pulse rounded bg-muted" />

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="h-32 animate-pulse rounded-lg bg-muted/50"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}