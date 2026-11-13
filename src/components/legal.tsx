import Link from "next/link";
import { Icon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

/** Page frame for the Terms of Service and Privacy Policy: same header and footer as the site. */
export function LegalPage({
  title,
  intro,
  effective,
  other,
  children,
}: {
  title: string;
  intro: string;
  effective: { label: string; iso: string };
  other: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ground">
      <SiteHeader />
      <main className="mx-auto max-w-[880px] px-6 pt-8 pb-24">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-bold text-ink-2 no-underline hover:text-primary">
          <span className="rotate-180">
            <Icon name="arrowRight" size={18} />
          </span>
          Doline Store
        </Link>
        <article className="mt-6 flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <span className="eyebrow">DOLINE STORE</span>
            <h1 className="m-0 text-[clamp(36px,5vw,52px)] leading-[1.05] font-extrabold text-ink-strong">{title}</h1>
            <p className="m-0 text-lg leading-relaxed text-ink-2">{intro}</p>
            <p className="m-0 text-sm font-bold text-ink-2">
              Effective <time dateTime={effective.iso}>{effective.label}</time> ·{" "}
              <Link href={other.href} className="text-primary">
                {other.label}
              </Link>
            </p>
          </header>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 text-base leading-relaxed text-ink [&_a]:font-bold [&_a]:text-primary [&_li]:pl-1 [&_ol]:m-0 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6 [&_p]:m-0 [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
      <h2 className="m-0 text-[26px] leading-tight font-extrabold text-ink-strong">{title}</h2>
      {children}
    </section>
  );
}

export function LegalTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-md bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-normal">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="border-b border-surface-variant px-4 py-3 font-bold text-ink-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className={`border-b border-surface-mid px-4 py-3 ${j === 0 ? "font-bold" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Contact({ closing }: { closing: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface p-6">
      <p>Doline Systems, Kampala, Uganda</p>
      <p>
        Email: <a href="mailto:davy.kyute@gmail.com">davy.kyute@gmail.com</a>
      </p>
      <p>
        Phone: <a href="tel:+256777921033">+256 777 921033</a>
      </p>
      <p>
        Website: <a href="https://www.dolinesystems.com">www.dolinesystems.com</a>
      </p>
      <p>{closing}</p>
    </div>
  );
}
