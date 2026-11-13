"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="m-0 text-2xl font-extrabold">Something went wrong loading this page</h1>
      <p className="m-0 max-w-md text-ink-2">Your data is safe. Check your connection and try again.</p>
      <button type="button" onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </main>
  );
}
