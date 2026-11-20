import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { GROUPS, getChapters } from "@/lib/manual";

export const metadata: Metadata = {
  title: "User manual",
  description: "How to use Doline Store, screen by screen: setting up, selling, stock, orders, clients, reports, staff and settings.",
};

export default function DocsIndex() {
  const chapters = getChapters();
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <span className="eyebrow">USER MANUAL</span>
        <h1 className="m-0 text-[clamp(34px,5vw,52px)] leading-[1.05] font-extrabold text-ink-strong">Doline Store, screen by screen</h1>
        <p className="m-0 max-w-[40em] text-lg leading-relaxed text-ink-2">
          Every screen in the app, explained in the order you meet its parts. It&apos;s the same manual you&apos;ll find under Help in the app, and the one
          Lilli answers from.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/docs/${chapters[0]?.slug ?? ""}`} className="btn btn-primary">
            Start reading <Icon name="arrowRight" size={18} strokeWidth={2.5} />
          </Link>
          <Link href="/download" className="btn btn-default">
            <Icon name="download" size={18} strokeWidth={2.5} /> Download the app
          </Link>
        </div>
      </header>

      {GROUPS.map((g) => (
        <section key={g.title} className="flex flex-col gap-4">
          <h2 className="m-0 text-[24px] font-extrabold">{g.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {chapters
              .filter((c) => c.number >= g.from && c.number <= g.to)
              .map((c) => (
                <Link key={c.slug} href={`/docs/${c.slug}`} className="flex flex-col gap-2 rounded-md bg-surface p-5 text-ink no-underline hover:shadow-card">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[17px] font-bold">
                      <span className="text-ink-2">{c.number}.</span> {c.title}
                    </span>
                    {c.access !== "Everyone" && <span className="pill bg-amber-c text-on-amber-c">{c.access}</span>}
                  </span>
                  <span className="text-[14px] leading-relaxed text-ink-2">{c.summary}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </article>
  );
}
