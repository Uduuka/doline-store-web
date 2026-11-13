export default function Loading() {
  return (
    <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 sm:p-6" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded-sm bg-surface-high" />
      <div className="flex flex-wrap gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 flex-[1_1_220px] animate-pulse rounded-md bg-surface" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-md bg-surface" />
    </main>
  );
}
