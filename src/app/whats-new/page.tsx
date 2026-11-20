import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { VersionSelect } from "@/components/version-select";
import { PLATFORM_LABELS, formatDate, getReleases, type Release } from "@/lib/releases";

export const metadata: Metadata = {
  title: "What's new",
  description: "What changed in each version of Doline Store.",
};

export default async function WhatsNewPage({ searchParams }: { searchParams: Promise<{ v?: string | string[] }> }) {
  const [releases, params] = await Promise.all([getReleases(), searchParams]);

  // One entry per version, newest first; a version can ship on more than one platform.
  const byVersion = new Map<string, Release[]>();
  for (const r of releases) byVersion.set(r.version, [...(byVersion.get(r.version) ?? []), r]);
  const versions = [...byVersion.keys()];
  const latest = versions[0];

  const asked = typeof params.v === "string" ? params.v : undefined;
  const version = asked && byVersion.has(asked) ? asked : latest;
  const builds = version ? byVersion.get(version)! : [];
  // Platforms share notes in practice; show each distinct set once.
  const notes = [...new Set(builds.flatMap((b) => b.notes))];
  const isLatest = version === latest;

  return (
    <div className="min-h-screen bg-ground">
      <SiteHeader />
      <main className="mx-auto flex max-w-[800px] flex-col gap-8 px-4 pt-12 pb-24 sm:px-6">
        <header className="flex flex-col gap-4">
          <span className="eyebrow">WHAT&apos;S NEW</span>
          <h1 className="m-0 text-[clamp(34px,5vw,52px)] leading-[1.05] font-extrabold text-ink-strong">What&apos;s new in Doline Store</h1>
          <p className="m-0 text-lg leading-relaxed text-ink-2">What changed in each release. Pick a version to see its changes.</p>
        </header>

        {!version ? (
          <p className="m-0 rounded-md bg-surface p-6 text-ink-2">Release notes couldn&apos;t be loaded just now. Please refresh in a moment.</p>
        ) : (
          <>
            <VersionSelect versions={versions} value={version} latest={latest!} />

            {asked && asked !== version && (
              <p className="m-0 rounded-sm bg-amber-c px-4 py-3 text-[15px] font-semibold text-on-amber-c">
                There&apos;s no version {asked}. Showing the latest, {version}.
              </p>
            )}

            <section className="flex flex-col gap-6 rounded-md bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="m-0 text-[30px] font-extrabold">Version {version}</h2>
                {isLatest && <span className="pill bg-success-container text-on-success-container">LATEST</span>}
              </div>
              <p className="m-0 -mt-3 text-[15px] text-ink-2">
                Released {formatDate(builds[0]!.publishedAt)} · {builds.map((b) => PLATFORM_LABELS[b.platform] ?? b.platform).join(", ")}
              </p>

              {notes.length ? (
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {notes.map((n) => (
                    <li key={n} className="flex items-start gap-3 text-base leading-relaxed">
                      <span className="mt-0.5 text-primary">
                        <Icon name="check" size={20} strokeWidth={2.5} />
                      </span>
                      {n}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-ink-2">No notes for this release.</p>
              )}

              <div className="flex flex-wrap gap-3 border-t border-surface-variant pt-6">
                {isLatest ? (
                  <Link href="/download" className="btn btn-primary">
                    <Icon name="download" size={18} strokeWidth={2.5} /> Download {version}
                  </Link>
                ) : (
                  <>
                    <Link href="/download" className="btn btn-primary">
                      <Icon name="download" size={18} strokeWidth={2.5} /> Get the latest, {latest}
                    </Link>
                    {builds.map((b) => (
                      <a key={b.platform} href={b.downloadUrl} download className="btn btn-tonal">
                        {version} for {PLATFORM_LABELS[b.platform] ?? b.platform}
                      </a>
                    ))}
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
