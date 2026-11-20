## 24. Plans, devices and backup `[Mixed]`

Three screens under Settings, in the Account group: **Plan** and **Active
devices** for admins, and **Backup & sync** for everyone. Together they answer
"what does my shop's plan allow?", "which phones and computers are signed in?"
and "is everything on this device safe in the cloud?".

### The plans

Every account is on one of four plans. What each costs is kept in one place,
Doline's cloud, and can change without an app update, so it isn't written here:
the Plan screen shows it (below), and so does the pricing page. A year always
costs ten months' price, and Enterprise includes five stores, each one more at a
monthly price of its own.

| | Free | Duka | Business | Enterprise |
|---|---|---|---|---|
| Stores | 1 | 1 | 2 | 5, then more at a price each |
| Devices | 1 | 3 | 6 | 5 per store |
| Staff | Admin only | 3 | 10 | Unlimited |
| Items on sale | 50 | 1,000 | Unlimited | Unlimited |
| DolineMarket listings | None | 50 | Unlimited | Unlimited |
| Lilli messages a month | 5 | 100 | 1,000 | 3,000 |
| Cloud backup | Once a day | Continuous | Continuous | Continuous |

Paid plans also bring promotions and flash sales, staff permissions, the
Activity log, full report history, scheduled report emails and, from Business
up, reports as PDF. Every plan runs the till offline and keeps its full sales
history. The current details are at dolinesystems.com/products/doline-store/pricing.

A new account gets **14 days of Business** from its first store, then moves to
Free unless a plan is chosen. A paid plan whose payment is late keeps working for
**7 days**, then moves to Free. **Nothing is ever deleted by a plan change**:
anything over the new plan's limit can still be sold and edited; you just can't
add more until you're under the limit or upgrade.

Paid plans can't be bought inside the app yet. To move to one, contact Doline
(section 23) and it is set up for you; the app picks it up on its next sync.

### Plan `[Admin only]`

Headed "Plan". At the top, the plan's name ("Business trial", "Duka", "Free")
and one line on where it stands -- when a trial ends, when a paid plan renews,
or that a late payment is in its grace period -- then what the plan costs ("Duka
is UGX 15,000 a month, or UGX 150,000 a year."; nothing for Free). The button
under it reads "Upgrade to ...", "Choose a plan" or "Renew ...", with what the
next plan costs beneath it, and for now explains that paid plans can't be bought
in the app yet. When a limit is reached, the message that says so also names the
next plan up and what it costs.

- **What you're using** -- one bar per limit: items on sale, staff, stores,
  devices, DolineMarket listings, suppliers and Lilli messages this month, each
  as "38 of 50", "1,200 · unlimited" or "Not included". A bar turns red only
  when the shop is *over* its limit (after a downgrade, say); using exactly what
  the plan allows -- a Free shop's one store -- is the plan working.
- **Included in ...** -- a tick or a cross for each thing the plan includes:
  selling on DolineMarket, promotions, staff permissions, the Activity log,
  scheduled report emails, PDF reports, combined reports and full report
  history.
- **Check my plan again** -- asks the cloud now, for after a plan has been
  changed. The line under the bars says when it was last checked.

Before plans start, the screen already shows each shop's plan, but nothing is
limited: every shop works as it always has until the launch date, which shops
are told about in advance.

### When a limit stops you

Adding something the plan has no room for -- the 51st item on Free, a staff
member, a listing, a device, a Lilli message past the month's allowance -- is
refused before anything is saved, with a message such as "You've reached Free's
50 items" or "Staff accounts start on Duka". Under it, what you can do about it
("Delete items you no longer sell to make room.", "Lilli's count starts again on
the 1st.") and what the next plan allows. **See plans** opens the Plan screen;
**Not now** (or OK) closes it.

### Selling on DolineMarket

A store is seen by buyers on DolineMarket only after its owner publishes it:
**Show on DolineMarket** in Store Details (section 20). Under the switch:

- "On DolineMarket since <date>. Buyers can find the store and the items you
  list."
- "Not on DolineMarket. Buyers can't find this store or its listings until you
  publish it."
- Before plans start: "For now every store shows on DolineMarket. Publish it to
  stay there once plans start."

Publishing takes a paid plan (Duka and up); on Free the switch brings up the
plan's message. Taking a store off is always allowed. Items are then listed one
by one (section 13, Storefront listing). Every online order carries a 0.5%
service fee for Doline; counter sales never do.

### When a device is turned away

Each plan allows a number of devices signed in at once. A device over the limit
shows one of these instead of the app:

- **"This account is on its device limit"** -- this device is new and there is
  no room. Sign one of the listed devices out to use this one.
- **"Too many devices for your plan"** -- more are signed in than the plan now
  allows (after a downgrade). Choose which to sign out.
- **"This device was signed out"** -- someone signed it out from another device.
  It sends anything it hasn't backed up first, then signs out.

Each lists the account's devices with **Sign out** beside the others, **Check
again**, and a way to sign out of this device instead. A device not seen for 60
days stops counting on its own, so a lost phone frees its place.

### Active devices `[Admin only]`

Headed "Active devices": how many are signed in and how many the plan allows,
then each phone and computer on the account --

- its name, when it was last seen, and its app version;
- its backup state: "Everything backed up, today at 21:00", or "4 changes not
  backed up as of 10 minutes ago. Last full backup yesterday at 21:00".
  Devices on versions before 1.6.2 show "Backup status not reported yet";
- **This device**, or **Sign out**.

Sign out asks first, then signs that device out the next time it is online --
after it has sent everything it holds, so nothing is lost. Someone there can
sign in again if the plan has room. **Refresh** asks the cloud again.

Watch the backup line on a device that sells a lot: a till that has not backed
up for days is a till whose sales exist nowhere else.

### Backup & sync

Headed "Backup & sync". At the top, how this device backs up:

- **Backs up continuously** (paid plans) -- every change goes to the cloud moments
  after it is made, whenever the device is online.
- **Backs up once a day** (Free) -- changes wait on the device and go up once a
  day. "Back up every day at 21:00 ▾" sets the time; pick an hour when the
  device is usually on and online. A phone that is off at that time backs up
  when it is next on and online; a computer that was closed for more than a day
  backs up shortly after it opens.

"Last full backup" says when everything on this device was last in the cloud.

**Back up now** sends everything straight away, on any plan, and also retries
changes that had stopped trying. **Signing out always backs up first**, so a Free
device never loses its day by being signed out.

**Not backed up yet** lists every change on this device that has not reached
the cloud, by kind -- "3 sales and orders", "1 item" -- with the oldest one's
time. Two warnings can appear under a kind:

- "N stopped trying after repeated failures. Back up now tries them again." --
  the cloud refused them several times. Back up now gives them another go; if
  they still fail, the "Last problem" line underneath is the thing to report.
- "Last problem: ..." -- the cloud's own reason, worth quoting in feedback
  (section 23).

"Everything on this device is in the cloud." means there is nothing to lose if
this device were lost.

Changes that haven't backed up are safe on the device -- selling carries on
without a connection -- but they exist nowhere else until they go up. Losing,
wiping or uninstalling the device before then loses them.
