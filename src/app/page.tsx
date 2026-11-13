import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { PricingPlans } from "@/components/pricing-plans";
import { DownloadButton } from "@/components/download-button";
import { getPlans, ONLINE_ORDER_FEE_PERCENT, TRIAL_DAYS } from "@/lib/pricing";

// Plans and limits come from the cloud; refresh them hourly.
export const revalidate = 3600;

const FEATURES: { icon: IconName; tint: string; title: string; body: string }[] = [
  { icon: "sell", tint: "bg-primary-container text-primary", title: "Sell in seconds", body: "Search or tap an item, set the quantity and take cash, mobile money or credit. Every sale lands in your books the moment it's recorded." },
  { icon: "inventory", tint: "bg-blue-c text-on-blue-c", title: "Stock by the batch", body: "Know what's left of every delivery, what it cost you and when it expires. Low-stock items surface before the shelf runs empty." },
  { icon: "clients", tint: "bg-success-container text-on-success-container", title: "A credit book that adds up", body: "Every client's balance, every part-payment, in one list. See who owes what and clear it when they pay." },
  { icon: "suppliers", tint: "bg-purple-c text-on-purple-c", title: "Suppliers and wholesale", body: "Keep your own suppliers on file, or link a Doline Store shop that sells wholesale and restock straight from it." },
  { icon: "expenses", tint: "bg-amber-c text-on-amber-c", title: "Expenses in their place", body: "Log rent, transport, utilities and stock costs by category so your profit is the real number, not a guess." },
  { icon: "reports", tint: "bg-pink-c text-on-pink-c", title: "Reports you'll actually read", body: "Sales, top items, payments and outstanding credit for today, this week or any range — on one screen." },
];

const FAQ = [
  { q: "What happens when my free trial ends?", a: "Your shop moves to Free unless you choose a plan. Nothing is deleted — items over Free's limits stay in your shop; you just can't add more until you upgrade." },
  { q: "Do I need internet to make a sale?", a: "Not in the Android and desktop apps: sales are saved on the device first and sync when the connection comes back. The web dashboard needs a connection." },
  { q: "Can I use it on my phone and my computer?", a: "Yes. Sign in with the same account on Android, the Windows app or here on the web — your stores follow you." },
  { q: "What currency does it use?", a: "Whatever you set for each store. A shop in Kampala can sell in UGX while another in Nairobi sells in KES." },
  { q: "How does listing on DolineMarket work?", a: "On Duka and above, publish your store in Settings and choose which items to list. Buyers near you see them in the DolineMarket app." },
];

export default async function Home() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-ground">
      <SiteHeader home />

      <main id="top">
        {/* HERO */}
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-6 pt-16 pb-16 md:pt-[72px]">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
            <span className="self-start rounded-sm bg-primary-container px-3 py-1.5 text-[13px] font-bold tracking-[2px] text-on-primary-container">
              POINT OF SALE · INVENTORY · CREDIT
            </span>
            <h1 className="m-0 text-[clamp(36px,5.2vw,60px)] leading-[1.08] font-extrabold tracking-[0.5px] text-ink-strong">
              Run your whole shop from one counter.
            </h1>
            <p className="m-0 max-w-[34em] text-lg leading-relaxed text-ink-2">
              Doline Store rings up sales, tracks every batch on the shelf, keeps your credit book straight and shows what the week earned — on your phone,
              your desktop and the web.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn btn-primary h-[52px] px-6 text-base" style={{ letterSpacing: 3 }}>
                Create your store <Icon name="arrowRight" size={20} strokeWidth={2.5} />
              </Link>
              <Link href="/sign-in" className="btn btn-default h-[52px] px-6 text-base" style={{ letterSpacing: 3 }}>
                Sign in
              </Link>
              <DownloadButton />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm text-ink-2">
              <span className="inline-flex items-center gap-2">
                <span className="text-success"><Icon name="check" size={18} strokeWidth={2.5} /></span>
                {TRIAL_DAYS} days of Business free
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-success"><Icon name="check" size={18} strokeWidth={2.5} /></span>
                Keeps selling when the network drops
              </span>
            </div>
          </div>

          <div className="relative min-w-0 flex-[1_1_420px] pt-2 pb-10">
            <div role="img" aria-label="Preview of a sale being rung up in Doline Store" className="overflow-hidden rounded-md bg-surface shadow-[0_2px_6px_rgba(32,33,39,0.10),0_16px_40px_rgba(32,33,39,0.10)]">
              <div className="flex items-center justify-between bg-ground px-5 py-4">
                <span className="text-lg font-extrabold">New sale</span>
                <span className="pill bg-slate-c text-on-slate-c">DRAFT</span>
              </div>
              <div className="flex flex-col px-5 py-2">
                {[
                  ["Cooking oil 3L", "2 × UGX 24,500", "UGX 49,000"],
                  ["Sugar 1kg", "5 × UGX 5,200", "UGX 26,000"],
                  ["Rice 5kg", "1 × UGX 21,000", "UGX 21,000"],
                ].map(([n, u, t], i) => (
                  <div key={n} className={`flex justify-between gap-3 py-3 ${i < 2 ? "border-b border-surface-variant" : ""}`}>
                    <div>
                      <div className="text-[15px] font-bold">{n}</div>
                      <div className="text-xs text-ink-2">{u}</div>
                    </div>
                    <div className="font-bold text-primary">{t}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3.5 bg-surface-low px-5 pt-4 pb-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-ink-2">Total</span>
                  <span className="text-[26px] font-extrabold text-primary">UGX 96,000</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[13px] font-bold">
                  <span className="rounded-sm bg-primary px-3 py-2 text-white">Cash</span>
                  <span className="rounded-sm bg-surface px-3 py-2">Mobile money</span>
                  <span className="rounded-sm bg-surface px-3 py-2">Credit</span>
                </div>
                <div className="flex h-[46px] items-center justify-center rounded-sm bg-primary font-bold tracking-[3px] text-white">RECORD SALE</div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute bottom-0 -left-3 flex items-center gap-3 rounded-md bg-surface px-[18px] py-3.5 shadow-fab">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-container text-success">
                <Icon name="check" size={20} strokeWidth={2.5} />
              </span>
              <div>
                <div className="text-xs text-ink-2">Credit cleared</div>
                <div className="text-[15px] font-extrabold">
                  Okello Traders · <span className="text-success">PAID</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORMS */}
        <section aria-label="Platforms" className="bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-7">
            <p className="m-0 text-base font-bold">One store account, every screen behind your counter.</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold text-ink-2">
              {(
                [
                  ["phone", "Android"],
                  ["desktop", "Windows desktop"],
                  ["globe", "Web"],
                ] as [IconName, string][]
              ).map(([i, l]) => (
                <span key={l} className="inline-flex items-center gap-2">
                  <span className="text-primary"><Icon name={i} /></span>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pt-24 pb-8">
          <div className="flex max-w-[720px] flex-col gap-3">
            <span className="eyebrow">EVERYTHING IN ONE PLACE</span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">Built for the way a shop really runs</h2>
            <p className="m-0 text-[17px] leading-relaxed text-ink-2">
              From the first sale of the morning to the credit you chase on Friday, every part of the day has a place in Doline Store.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            {FEATURES.map((f) => (
              <article key={f.title} className="flex min-w-0 flex-[1_1_320px] flex-col gap-3 rounded-md bg-surface p-7">
                <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-sm ${f.tint}`}>
                  <Icon name={f.icon} size={26} />
                </span>
                <h3 className="m-0 text-lg font-bold">{f.title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-ink-2">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pt-8 pb-24">
          <div className="flex flex-wrap items-center gap-8 rounded-md bg-surface p-10">
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
              <h2 className="m-0 text-[28px] leading-tight font-extrabold">More than one shop? More than one pair of hands?</h2>
              <p className="m-0 text-base leading-relaxed text-ink-2">
                Run several stores from one account and switch between them in a tap. Add staff with their own sign-in, and see who sold what.
              </p>
            </div>
            <ul className="m-0 flex min-w-0 flex-[1_1_320px] list-none flex-col gap-3.5 p-0">
              {["Each store keeps its own items, prices and currency", "Staff accounts with roles for the counter and the back office", "Changes on one device show up on the others"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-normal">
                  <span className="text-primary"><Icon name="check" strokeWidth={2.5} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-24">
            <div className="flex max-w-[720px] flex-col gap-3">
              <span className="eyebrow">HOW IT WORKS</span>
              <h2 className="m-0 text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">Open for business in three steps</h2>
            </div>
            <ol className="m-0 flex list-none flex-wrap gap-5 p-0">
              {[
                ["Create your store", "Sign up, name your shop, set its location and currency."],
                ["Add what you sell", "Enter items with their price and opening stock, then receive new batches as deliveries arrive."],
                ["Start selling", "Ring up sales from any device. Stock, credit and reports update as you go."],
              ].map(([t, b], i) => (
                <li key={t} className="flex min-w-0 flex-[1_1_280px] flex-col gap-3 rounded-md bg-ground p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-white">{i + 1}</span>
                  <h3 className="m-0 text-lg font-bold">{t}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-ink-2">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* MARKET */}
        <section id="market" className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="flex flex-wrap items-center gap-10 rounded-md bg-primary px-6 py-12 text-white sm:px-10">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
              <span className="text-[13px] font-bold tracking-[3px] text-inverse-primary">PART OF THE DOLINE FAMILY</span>
              <h2 className="m-0 text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">Get found by buyers near you on DolineMarket</h2>
              <p className="m-0 text-[17px] leading-relaxed text-primary-container">
                Publish your store and the items you already manage in Doline Store appear on DolineMarket, where nearby shoppers browse stores by location.
                Orders come straight into your dashboard.
              </p>
            </div>
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
              {(
                [
                  ["pin", "Shown to buyers by distance from your shop"],
                  ["inventory", "Stock levels stay in step with your counter"],
                  ["orders", "Online orders sit beside your in-store sales"],
                ] as [IconName, string][]
              ).map(([i, t]) => (
                <div key={t} className="flex items-center gap-3.5 rounded-md bg-white/10 px-5 py-[18px]">
                  <Icon name={i} size={26} />
                  <span className="text-[15px] leading-normal">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-surface">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-24">
            <div className="flex max-w-[640px] flex-col gap-3">
              <span className="eyebrow">PRICING</span>
              <h2 className="m-0 text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">A plan for every size of shop</h2>
              <p className="m-0 text-[17px] leading-relaxed text-ink-2">
                Every new shop gets {TRIAL_DAYS} days of Business free. After that, stay on Free or pick the plan that fits — your data is never deleted
                when you change.
              </p>
            </div>
            {plans.length ? (
              <PricingPlans plans={plans} trialDays={TRIAL_DAYS} />
            ) : (
              <p className="m-0 text-ink-2">Plans couldn&apos;t be loaded just now. Please refresh in a moment.</p>
            )}
            <p className="m-0 text-sm leading-relaxed text-ink-2">
              Prices in Ugandan shillings. A year costs ten months. Orders placed online through DolineMarket carry a {ONLINE_ORDER_FEE_PERCENT}% service fee.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto flex max-w-[880px] flex-col gap-8 px-6 py-24">
          <h2 className="m-0 text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">Questions shopkeepers ask</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-md bg-surface px-6 py-1">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45">
                    <Icon name="plus" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="m-0 mb-5 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-24">
          <div className="flex flex-col items-center gap-5 rounded-md bg-surface px-6 py-14 text-center sm:px-10">
            <h2 className="m-0 max-w-[18em] text-[clamp(28px,3.6vw,40px)] leading-tight font-extrabold">Your counter, your stock, your numbers — sorted.</h2>
            <p className="m-0 text-[17px] text-ink-2">Set up your store today.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn btn-primary h-[52px] px-7 text-base" style={{ letterSpacing: 3 }}>
                Create your store
              </Link>
              <a href="https://wa.me/256777921033" className="btn btn-tonal h-[52px] px-7 text-base" style={{ letterSpacing: 3 }}>
                Talk to us on WhatsApp
              </a>
              <DownloadButton />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter home />
    </div>
  );
}
