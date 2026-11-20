# Doline Store — web

The public website for **Doline Store**: the landing page, the download page, what's new in each
release, the user manual, and the Terms of Service and Privacy Policy. There is no sign-in and no
dashboard here: stores are run from the app, and every call to action leads to the download page.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4, reading public tables from the
Doline cloud (`doline-supabase`) with the publishable key. The look follows the DolineStore design
system (brand blue `#013984`, white cards on a cool grey ground) with the dolinesystems.com type:
Bricolage Grotesque headings and Figtree text.

## Run it

```bash
cp .env.example .env.local     # the cloud URL and publishable key are already filled in
npm install
npm run dev                    # http://localhost:3000
```

`npm run build` makes a production build; `npm run typecheck` checks types.

## Pages

| Page | Comes from |
| --- | --- |
| Landing (`/`) | Pricing from `plan_limits` (public), refreshed hourly |
| Download (`/download`) | Newest `app_releases` row per platform, refreshed every 10 minutes. A platform with no release shows "Coming soon" |
| What's new (`/whats-new?v=1.7.0`) | Every `app_releases` row; the dropdown defaults to the newest version |
| User manual (`/docs`, `/docs/<chapter>`) | `content/manual/*.md`, built into static pages |
| Terms, Privacy | Copied from dolinesystems.com/products/doline-store; keep in step |

**Releasing an app version** needs nothing here: add its row to `app_releases` (the apps read the
same table to offer updates) and the download and what's new pages pick it up once its
`published_at` has passed. The `notes` text is split into points at each `; ` or sentence.

**The user manual** is a copy of the app repo's `docs/lilli/manual` — the text staff read in the
app's Help screen and Lilli answers from. When it changes there, copy the numbered files over:

```bash
cp ../Doline/docs/lilli/manual/[0-9]*.md content/manual/
```

Each file must open with `## N. Title `[Both|Admin only|Mixed]``; "section N" in the text becomes a
link to that chapter.

**The app is free.** The site says so wherever it asks people to download: the Free plan costs
nothing, and only the paid services listed under Pricing are charged for.

## Regenerating database types

```bash
npm run types   # needs the Supabase CLI and a login
```
