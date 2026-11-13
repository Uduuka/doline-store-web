import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";

/** Sign in and sign up: a brand panel beside the form; the panel shrinks to a bar on phones. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-ground">
      <aside className="flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-10 bg-primary p-6 text-white sm:p-10">
        <Logo variant="white" textClass="text-[28px] text-white" />
        <div className="hidden max-w-[440px] flex-col gap-6 md:flex">
          <h2 className="m-0 text-4xl leading-tight font-extrabold">Your counter, your stock, your numbers.</h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0 text-base text-primary-container">
            {["Ring up sales from day one", "Track stock and credit in one place", "Same account on phone, desktop and web"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="text-white"><Icon name="check" strokeWidth={2.5} /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="m-0 hidden text-[13px] text-inverse-primary md:block">© {new Date().getFullYear()} Doline Systems</p>
      </aside>
      <main className="flex min-w-0 flex-[1_1_480px] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
