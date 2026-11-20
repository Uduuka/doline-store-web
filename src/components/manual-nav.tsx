"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { slug: string; number: number; title: string };

/** The manual's chapter list: a sidebar on wide screens, a fold-out list on phones. */
export function ManualNav({ groups }: { groups: { title: string; chapters: Item[] }[] }) {
  const path = usePathname();
  const list = (
    <nav aria-label="User manual" className="flex flex-col gap-5">
      <Link href="/docs" aria-current={path === "/docs" ? "page" : undefined} className={linkClass(path === "/docs")}>
        Contents
      </Link>
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-1">
          <span className="px-3 text-[12px] font-bold tracking-[2px] text-ink-2 uppercase">{g.title}</span>
          {g.chapters.map((c) => {
            const on = path === `/docs/${c.slug}`;
            return (
              <Link key={c.slug} href={`/docs/${c.slug}`} aria-current={on ? "page" : undefined} className={linkClass(on)}>
                <span className="w-6 flex-none text-ink-2 tabular-nums">{c.number}</span>
                {c.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <details className="group rounded-md bg-surface lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-bold [&::-webkit-details-marker]:hidden">
          Chapters
          <span className="text-primary transition-transform group-open:rotate-180" aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className="px-2 pb-4">{list}</div>
      </details>
      <div className="sticky top-[96px] hidden max-h-[calc(100vh-112px)] overflow-y-auto pr-2 pb-8 lg:block">{list}</div>
    </>
  );
}

const linkClass = (on: boolean) =>
  `flex min-h-10 items-center rounded-sm px-3 py-1.5 text-[15px] leading-snug no-underline ${
    on ? "bg-primary-container font-bold text-on-primary-container" : "text-ink hover:bg-surface-high"
  }`;
