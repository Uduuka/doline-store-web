import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { PlatformHint } from "@/components/platform-hint";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { formatDate, getReleases, latestByPlatform, type Release } from "@/lib/releases";

// New releases appear once published in the cloud; check every ten minutes.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Download",
  description: "Download Doline Store for Android. Free to download and use.",
};

const PLATFORMS: { key: string; label: string; icon: IconName; needs: string; soon: string }[] = [
  { key: "android", label: "Android", icon: "phone", needs: "Phones and tablets", soon: "Coming soon" },
  { key: "windows", label: "Windows", icon: "desktop", needs: "Windows 10 and 11 computers", soon: "Coming soon" },
];

export default async function DownloadPage() {
  const releases = await getReleases();
  const latest = latestByPlatform(releases);

  return (
    <div className="min-h-screen bg-ground">
      <SiteHeader />
      <main className="mx-auto flex max-w-[960px] flex-col gap-10 px-4 pt-12 pb-24 sm:px-6">
        <header className="flex flex-col gap-4">
          <span className="eyebrow">DOWNLOAD</span>
          <h1 className="m-0 text-[clamp(34px,5vw,52px)] leading-[1.05] font-extrabold text-ink-strong">Get Doline Store</h1>
          <p className="m-0 max-w-[38em] text-lg leading-relaxed text-ink-2">
            <strong className="text-ink">Free to download and free to use.</strong> You only pay for the paid services listed under{" "}
            <Link href="/#pricing" className="font-bold text-primary">
              Pricing
            </Link>
            , and only if you choose them.
          </p>
          <PlatformHint available={PLATFORMS.filter((p) => latest[p.key]).map((p) => p.key)} />
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORMS.map((p) => (
            <PlatformCard key={p.key} label={p.label} icon={p.icon} needs={p.needs} soon={p.soon} release={latest[p.key]} />
          ))}
        </div>

        {latest.android && (
          <section className="flex flex-col gap-4 rounded-md bg-surface p-6 sm:p-8">
            <h2 className="m-0 text-[24px] font-extrabold">Installing on Android</h2>
            <ol className="m-0 flex list-decimal flex-col gap-3 pl-6 text-base leading-relaxed">
              <li>On your Android phone or tablet, open this page and tap <strong>Download for Android</strong>.</li>
              <li>
                Open the downloaded file. If Android asks, allow your browser to <strong>install unknown apps</strong> — the app comes straight from us
                rather than from the Play Store.
              </li>
              <li>Tap <strong>Install</strong>, then open Doline Store and create your account or sign in.</li>
            </ol>
            <p className="m-0 text-[15px] leading-relaxed text-ink-2">
              Already installed? The app tells you when there&apos;s a new version, and you can check yourself in Settings. New to the app? The{" "}
              <Link href="/docs" className="font-bold text-primary">
                user manual
              </Link>{" "}
              walks through every screen.
            </p>
          </section>
        )}

        <p className="m-0 text-[15px] text-ink-2">
          Looking for an earlier version, or what changed?{" "}
          <Link href="/whats-new" className="font-bold text-primary">
            See what&apos;s new
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlatformCard({ label, icon, needs, soon, release }: { label: string; icon: IconName; needs: string; soon: string; release?: Release }) {
  return (
    <section className="flex flex-col gap-5 rounded-md bg-surface p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-sm bg-primary-container text-primary">
          <Icon name={icon} size={26} />
        </span>
        <div className="flex flex-col">
          <h2 className="m-0 text-[22px] font-extrabold">{label}</h2>
          <span className="text-[14px] text-ink-2">{needs}</span>
        </div>
      </div>
      {release ? (
        <>
          <p className="m-0 text-[15px] text-ink-2">
            Version <strong className="text-ink">{release.version}</strong> · released {formatDate(release.publishedAt)}
          </p>
          <div className="mt-auto flex flex-wrap gap-3">
            <a href={release.downloadUrl} download className="btn btn-primary h-[52px] px-6 text-base" style={{ letterSpacing: 1 }}>
              <Icon name="download" size={20} strokeWidth={2.5} /> Download for {label}
            </a>
            <Link href={`/whats-new?v=${encodeURIComponent(release.version)}`} className="btn btn-tonal h-[52px]">
              What&apos;s new
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="m-0 text-[15px] text-ink-2">Not available yet. We&apos;ll put it here as soon as it&apos;s ready.</p>
          <span className="btn btn-tonal mt-auto h-[52px] cursor-default self-start opacity-70">{soon}</span>
        </>
      )}
    </section>
  );
}
