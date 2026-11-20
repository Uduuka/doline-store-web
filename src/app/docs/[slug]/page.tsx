import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { getChapter, getChapters } from "@/lib/manual";

export const dynamicParams = false;

export function generateStaticParams() {
  return getChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getChapter((await params).slug);
  return c ? { title: `${c.title} · User manual`, description: c.summary } : {};
}

const ACCESS_NOTE: Record<string, string> = {
  "Admins only": "Only an admin can use this screen.",
  "Partly admin": "Parts of this screen are for admins only.",
};

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapters = getChapters();
  const i = chapters.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const c = chapters[i]!;
  const prev = chapters[i - 1];
  const next = chapters[i + 1];

  return (
    <article className="flex max-w-[760px] flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="eyebrow">USER MANUAL · SECTION {c.number}</span>
        <h1 className="m-0 text-[clamp(32px,4.6vw,46px)] leading-[1.08] font-extrabold text-ink-strong">{c.title}</h1>
        {ACCESS_NOTE[c.access] && (
          <p className="m-0 inline-flex items-center gap-2 self-start rounded-sm bg-amber-c px-3 py-2 text-sm font-bold text-on-amber-c">
            <Icon name="lock" size={16} strokeWidth={2.5} /> {ACCESS_NOTE[c.access]}
          </p>
        )}
      </header>

      {c.parts.length > 2 && (
        <nav aria-label="On this page" className="flex flex-col gap-2 rounded-md bg-surface p-5">
          <span className="text-[12px] font-bold tracking-[2px] text-ink-2">ON THIS PAGE</span>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {c.parts.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="text-[15px] font-semibold text-primary no-underline hover:underline">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="manual" dangerouslySetInnerHTML={{ __html: c.html }} />

      <nav aria-label="More of the manual" className="mt-6 grid gap-3 border-t border-surface-variant pt-8 sm:grid-cols-2">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="flex flex-col gap-1 rounded-md bg-surface p-5 no-underline hover:shadow-card">
            <span className="text-[13px] font-bold text-ink-2">← Previous</span>
            <span className="font-bold text-primary">
              {prev.number}. {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/docs/${next.slug}`} className="flex flex-col gap-1 rounded-md bg-surface p-5 text-right no-underline hover:shadow-card">
            <span className="text-[13px] font-bold text-ink-2">Next →</span>
            <span className="font-bold text-primary">
              {next.number}. {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
