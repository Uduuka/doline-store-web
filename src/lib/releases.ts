import { publicClient } from "@/lib/supabase";

/**
 * Doline Store's releases, from the cloud's public `app_releases` table: the same rows the apps
 * read to offer an update. A release shows here once its `published_at` has passed (RLS), so
 * publishing a new version needs no change to this site.
 */
export const APP = "doline-store";

export type Platform = "android" | "windows";

export const PLATFORM_LABELS: Record<string, string> = { android: "Android", windows: "Windows" };

export type Release = {
  platform: string;
  version: string;
  versionCode: number;
  publishedAt: string;
  downloadUrl: string;
  notes: string[];
};

/** Release notes are one line of text; show each clause as its own point. */
function splitNotes(notes: string | null): string[] {
  if (!notes) return [];
  return notes
    .split(/;\s+|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

/** Every published release, newest first. Empty if the cloud can't be reached. */
export async function getReleases(): Promise<Release[]> {
  const { data, error } = await publicClient()
    .from("app_releases")
    .select("platform, version, version_code, published_at, download_url, notes")
    .eq("app", APP)
    .order("version_code", { ascending: false })
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    platform: r.platform,
    version: r.version,
    versionCode: r.version_code,
    publishedAt: r.published_at,
    downloadUrl: r.download_url,
    notes: splitNotes(r.notes),
  }));
}

/** The newest release for each platform. */
export function latestByPlatform(releases: Release[]): Partial<Record<string, Release>> {
  const out: Partial<Record<string, Release>> = {};
  for (const r of releases) if (!out[r.platform]) out[r.platform] = r;
  return out;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" });
