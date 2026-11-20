import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";

/** The public site's header, shared by every page. */
export function SiteHeader({ home = false }: { home?: boolean }) {
  const anchor = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <header className="sticky top-0 z-20 bg-ground shadow-appbar">
      <nav aria-label="Main" className="mx-auto flex min-h-[72px] max-w-[1200px] items-center gap-6 px-6 py-3">
        <Logo />
        <div className="ml-4 hidden gap-2 md:flex">
          {[
            [anchor("features"), "Features"],
            [anchor("pricing"), "Pricing"],
            ["/docs", "User manual"],
            ["/whats-new", "What's new"],
          ].map(([href, label]) => (
            <Link key={label} href={href!} className="p-3 text-[15px] font-semibold text-ink no-underline hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/docs" className="btn hidden text-primary sm:inline-flex md:hidden">
            Manual
          </Link>
          <Link href="/download" className="btn btn-primary">
            <Icon name="download" size={18} strokeWidth={2.5} /> Download
          </Link>
        </div>
      </nav>
    </header>
  );
}

/** The public site's footer, on brand blue. */
export function SiteFooter({ home = false }: { home?: boolean }) {
  const anchor = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pt-14 pb-8">
        <div className="flex flex-wrap gap-10">
          <div className="flex min-w-0 flex-[2_1_280px] flex-col gap-3">
            <Logo variant="white" textClass="text-[26px] text-white" />
            <p className="m-0 max-w-[28em] text-sm leading-relaxed text-primary-container">
              Point of sale, inventory and credit for small retailers. A product of Doline Technologies.
            </p>
          </div>
          <FooterCol title="PRODUCT" links={[[anchor("features"), "Features"], [anchor("pricing"), "Pricing"], ["/download", "Download"], ["/docs", "User manual"], ["/whats-new", "What's new"]]} />
          <FooterCol title="COMPANY" links={[["https://www.dolinesystems.com", "Doline Technologies"], ["/terms", "Terms of Service"], ["/privacy", "Privacy Policy"]]} />
          <FooterCol title="CONTACT" links={[["tel:+256777921033", "+256 777 921 033"], ["https://wa.me/256777921033", "WhatsApp"], ["mailto:davy.kyute@gmail.com", "davy.kyute@gmail.com"]]} />
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/20 pt-6 text-[13px] text-primary-container">
          <span>© {new Date().getFullYear()} Doline Technologies Limited · Kampala, Uganda</span>
          <span className="flex gap-4">
            <Link href="/terms" className="text-primary-container no-underline hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="text-primary-container no-underline hover:text-white">
              Privacy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex min-w-0 flex-[1_1_160px] flex-col gap-2.5 text-sm">
      <span className="font-bold tracking-[2px] text-white">{title}</span>
      {links.map(([href, label]) => (
        <a key={label} href={href} className="py-1 text-primary-container no-underline hover:text-white">
          {label}
        </a>
      ))}
    </div>
  );
}
