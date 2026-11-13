# Doline Store — web

The web app for **Doline Store**: the public landing page, sign-in, and the store dashboard
(overview, sell, orders, inventory, suppliers, clients & credit, expenses, reports, settings).
It works on the same Doline cloud (`doline-supabase`) as the Android and desktop apps, so a sale
rung up here shows on the phone and the other way round.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Supabase (`@supabase/ssr`).
The look follows the DolineStore design system (brand blue `#013984`, white cards on a cool grey
ground) with the dolinesystems.com type: Bricolage Grotesque headings and Figtree text.

## Run it

```bash
cp .env.example .env.local     # the cloud URL and publishable key are already filled in
npm install
npm run dev                    # http://localhost:3000
```

`npm run build` makes a production build; `npm run typecheck` checks types.

### Supabase settings to check

Sign-in and sign-up are passwordless, as in the apps: **Google**, or a **one-time code** emailed
to the address (`signInWithOtp` → `verifyOtp`). In the Supabase dashboard for project
`okpjiokdkxpduvhoxcyk`:

- **Authentication → Email Templates**: the **Magic Link** template (sign-in) and the
  **Confirm signup** template (new accounts) must show the code, `{{ .Token }}`. They can keep
  the link as well; it lands on `/auth/confirm` and works too.
- **Authentication → URL Configuration**: set the **Site URL** to where this app runs, and add
  `http://localhost:3000/auth/confirm` and `https://<your-domain>/auth/confirm` to **Redirect URLs**.
- **Authentication → Providers → Google** must be on for "Continue with Google".

## How it maps onto the cloud

| Screen | Reads | Writes |
| --- | --- | --- |
| Landing → Pricing | `plan_limits` (public) | — |
| Terms, Privacy | — (copied from dolinesystems.com/products/doline-store; keep in step) | — |
| Onboarding | — | `profiles`, `stores`, `store_settings` (first store starts the 14-day Business trial) |
| Your stores (`/dashboard`) | `stores` kept by the account, today's `orders` | — (opening a store sets the `doline_store` cookie) |
| Overview (`/dashboard/overview`) | `orders`, `orders_view`, `inventory` | — |
| Sell | `inventory`, `product_pricings`, `clients` | `place_order` (channel `pos`, batches allocated first-expiring-first), `record_order_payment` |
| Orders | `orders_view` | — |
| Inventory | `inventory` | `products` + `product_pricings` + `product_batches` (add item, receive stock) |
| Suppliers | `suppliers`, `store_contacts`, `stores` | — (added and linked in the app) |
| Clients & credit | `clients`, `orders_view`, `order_payments` | `store_contacts` + `clients`; payments settle oldest credit sales first |
| Expenses | `expenses` | `expenses` |
| Reports | `orders`, `order_items`, `order_item_batches`, `order_payments`, `expenses` | — |
| Settings | `stores`, `my_plan()`, `store_staff_stores` | `stores`, `store_settings`, `set_store_published()` |

The cloud prices every sale itself (`place_order` ignores client prices), so the total shown
while building a sale is a guide; the recorded total comes back from the cloud.

**Pricing** lives in `plan_limits`: limits already, and prices once doline-supabase's
`20261112130000_plan_prices` migration is applied. Until then `src/lib/pricing.ts` falls back to
the 2026-11-11 prices.

**Who can sign in**: store owners (the account that keeps the store). Staff sign in on the
devices with their pass keys, as today. The dashboard opens on the list of stores the account
keeps; a store page only ever shows a store whose `keeper_id` is the signed-in account.

**App download**: on an Android phone the site offers "Download for Android", linking to
`NEXT_PUBLIC_ANDROID_APK_URL` (the public `apps` bucket). Bump it to the new .apk on each
release; the public key can't list the bucket, so the site can't find the latest by itself.
Other devices see a disabled "Coming soon on <platform>".

## Regenerating database types

```bash
npm run types   # needs the Supabase CLI and a login
```
