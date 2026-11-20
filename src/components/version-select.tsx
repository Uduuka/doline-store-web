"use client";

import { useRouter } from "next/navigation";

/**
 * Picks the release shown on What's new. A plain GET form underneath, so it also works before
 * the page's script has loaded: the button submits it, and is hidden once script takes over.
 */
export function VersionSelect({ versions, value, latest }: { versions: string[]; value: string; latest: string }) {
  const router = useRouter();
  return (
    <form action="/whats-new" method="get" className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="label">Version</span>
        <select
          name="v"
          defaultValue={value}
          onChange={(e) => router.push(e.target.value === latest ? "/whats-new" : `/whats-new?v=${encodeURIComponent(e.target.value)}`, { scroll: false })}
          className="field w-auto min-w-[220px] pr-10"
        >
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
              {v === latest ? " (latest)" : ""}
            </option>
          ))}
        </select>
      </label>
      <noscript>
        <button type="submit" className="btn btn-default">
          Show
        </button>
      </noscript>
    </form>
  );
}
