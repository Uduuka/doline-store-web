import type { Metadata } from "next";
import { getContext } from "@/lib/store";
import { Logo } from "@/components/logo";
import { StoreForm } from "./store-form";

export const metadata: Metadata = { title: "Set up your store" };

export default async function OnboardingPage() {
  const { stores, displayName } = await getContext();
  const first = stores.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header className="mx-auto flex w-full max-w-[1200px] items-center p-6">
        <Logo href={first ? "/" : "/dashboard"} />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-4 pb-16 sm:items-center">
        <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-md bg-surface p-8 shadow-card">
          <ol aria-label="Steps" className="m-0 flex list-none gap-2 p-0">
            <li className="flex flex-1 flex-col gap-2">
              <span className="h-1 rounded-sm bg-primary" />
              <span className="text-[13px] font-bold text-primary">1 · Your account</span>
            </li>
            <li className="flex flex-1 flex-col gap-2">
              <span className="h-1 rounded-sm bg-primary" />
              <span className="text-[13px] font-bold text-primary">2 · Your store</span>
            </li>
          </ol>
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[28px] font-extrabold">{first ? `Welcome, ${displayName.split(" ")[0]}` : "Add a store"}</h1>
            <p className="m-0 text-[15px] leading-relaxed text-ink-2">
              {first ? "Tell us about your shop. Your first store starts a 14-day Business trial." : "Each store keeps its own items, prices and currency."}
            </p>
          </div>
          <StoreForm />
        </div>
      </main>
    </div>
  );
}
