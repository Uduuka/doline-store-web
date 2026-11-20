import { ManualNav } from "@/components/manual-nav";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { GROUPS, getChapters } from "@/lib/manual";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters();
  const groups = GROUPS.map((g) => ({
    title: g.title,
    chapters: chapters.filter((c) => c.number >= g.from && c.number <= g.to).map(({ slug, number, title }) => ({ slug, number, title })),
  }));

  return (
    <div className="min-h-screen bg-ground">
      <SiteHeader />
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0">
          <ManualNav groups={groups} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
