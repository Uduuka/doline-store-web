## 20. Settings `[Mixed]`

Headed "Settings", from the menu drawer. Fourteen screens grouped into five
sections, with a "Search settings" field that matches a screen's name, its
description or its section.

Settings opens for admins and for staff given the "Store settings" permission
(section 21); anyone else is asked for an admin's pass key. Even then, five
screens stay hidden from non-admins: Store Details, Staff & Security, Activity,
Plan and Active devices. Activity is also left out on a plan without an activity
log (Free).

### What is where

- **Store** -- Store Details `[Admin only]`: name, category, address and other
  store info. Working hours: when the shop is open.
- **Operations** -- Notifications, Inventory, Reports & Analytics, Payments &
  Tenders, Shipping & Deliveries, Taxation.
- **Access** -- Staff & Security and Activity `[Admin only]`; see section 21.
- **Account** -- Plan and Active devices `[Admin only]`, and Backup & sync; see
  section 24.
- **Device** -- POS Hardware: printers, scanners, drawers and scales.

At the very end of the list, "Doline Store 1.6.5 (10605)" is the version on this
device -- the thing to quote to support, and the way to check a phone has
updated (section 23). On a computer it is at the foot of the section list.

### Read this before changing anything here

Most of these screens record a preference and sync it to the cloud, but
**nothing in the till reads it back yet**. The switches move, the values save,
and the app behaves exactly as it did before.

What genuinely takes effect today: **Default Currency**, which sets the currency
every price in the app is shown and entered in; **Store Details**, which is the
shop name at the top of the dashboard and whether the store is on DolineMarket;
everything under **Account** (section 24); and the facts that are published for
buyers on the Doline marketplace -- your working hours, whether you deliver, your
delivery zones, the payment methods you accept and the currencies you price in.

Notifications do take effect: what to be told about (marketplace orders, stock,
reviews) and which of those pop up, on this phone or computer and on the
account's others.

Tips take effect too: the tip rules add a tip to the cart at the till (section
11).

What does not take effect: auto re-order, the barcode toggles, VAT and EFRIS,
and the loyalty program. No tax is added to a sale, and no loyalty point is ever
calculated. The negative stock policy is a special case; see Inventory below. Setting them is
harmless, and recording what you *want* is not pointless, but do not rely on any
of them.

### Store Details `[Admin only]`

Headed "Edit store", the same form as creating one (section 7): STORE FRONT
IMAGE, CATEGORY, NAME, SLUG, DESCRIPTION, ADDRESS, then Save. An incomplete form
is refused with "Fill out all required fields". The name and cover image reach
the marketplace, so this is the shop's public face as well as its label on the
dashboard.

**Show on DolineMarket** puts the store on DolineMarket, or takes it off, at
once. It takes a paid plan; the line under the switch says whether the store is
on and since when. See section 24, Selling on DolineMarket.

### Working hours

Headed "Working hours": an Opening time and Closing time per day, each set from
a time picker, with days markable as closed. These are published so buyers can
see when you are open; the app itself does not lock the till outside them.

### Notifications

Headed "Alerts & Notifications". Toggles for New marketplace orders, Stock (out,
low or expiring) and Reviews and ratings; and a Pop-ups mode of "Everything",
"Urgent only" (marketplace orders and stuck changes) or "Off". Shared by every
device on the store.

Notifications collect in the account menu on the dashboard, and on a computer also
on the sidebar's Notifications page, which shows how many are unread. A marketplace order
reaches the phone even with the app closed. Sound and vibration for each kind
are set in the phone's own notification settings for Doline Store.

### Inventory

Headed "Inventory Settings". A Negative stock policy of "Allow negative stock",
"Deny negative stock" or "Ask manager's approval"; an Auto re-order switch; and
under Barcode settings, Auto generate barcodes, Allow barcode scanning and Print
barcode labels.

Worth being explicit, because these sound consequential: Auto re-order orders
nothing, and the POS scanner works whether or not barcode scanning is switched
on here.

**Leave the negative stock policy on "Ask manager's approval" (or Allow).** The
till does not check it: with any setting, a sale can take more than the records
say a batch holds -- most often because another till sold the last units before
this one synced. With Allow or Ask, the cloud records that sale as it happened
and the batch shows below zero until a stock count settles it. With **Deny**,
the cloud refuses to record the sale at all, and it sits in Backup & sync's "Not
backed up yet" (section 24) with "insufficient stock" as its problem, never
reaching the cloud.

### Reports & Analytics

An "Automatic reporting schedule" -- Daily close-out report, Weekly summary
report with a "Send on" day, and Monthly report with "Send on Day" as "First
Day", "Last Day" or "Or specify Date" -- plus a "Time to send". Below, Email
Recipients with "Add Recipient" and a remove button per address.

The schedule and the recipients are saved and sent up to the cloud. Whether an
email actually arrives is not something the app does -- it is up to the server --
so treat a report you have not seen in your inbox as not arriving, and share
reports by hand from the Reports screen (section 19) in the meantime.

### Payments & Tenders

Headed "Payment & Tenders".

- **Accepted Payment Methods** -- what the shop takes: cash, mobile money,
  cards. Published for buyers.
- **Supported Currencies** -- which currencies the shop prices in. Published for
  buyers.
- **Default Currency** -- the one that matters inside the app: "Used for
  expenses and anywhere a price is entered without picking a currency." Change
  it and every price on every screen is read and shown in the new currency. Only
  an accepted currency can be the default, and choosing one accepts it
  automatically.
- **Currency converter** -- converts any amount between UGX, KES, TZS and USD at
  the rates the device last fetched, saying how old they are, so it works
  offline; "Refresh rates" fetches new ones. Where the store has a locked rate
  for the pair (from changing its default currency), it shows that too. Use it to
  see what a switch would do to prices before making it. On a computer it is the
  "Currency converter" button on the Default currency card. The same converter
  opens from the cart with the total filled in -- on a computer, "Convert
  currency" under the total in New sale.
- **Enable tips** -- then one or more tip rules, each an "Order amount from" and
  a "Tip": orders from that amount take that tip, and an order takes the highest
  rule it reaches (say 5% from 50,000 and 7% from 100,000). "Amount" and
  "Percentage" choose how every rule's tip is read -- a flat sum or a share of
  the order. "Save tip rules" saves them all, with "Add tip rule" beside it to add
  a row and the cross on a row to remove it; a row missing either figure is left
  out. Shared by every device on the store, and applied in the cart (section 11).
- **Enable loyalty program** -- with Points per Amount spent, and "Save loyalty
  rule". No points are awarded anywhere; a client's total always reads "0
  Points".

### Shipping & Deliveries

Headed "Shipping & Delivery". "Do you offer delivery?" is the switch buyers see.
Under "Delivery zone Pricing", each zone reads as a distance and a price -- "Up
to 5 km", "UGX 3,000" -- with "Add delivery zone", "Edit delivery zone" and
"Delete delivery zone".

These are published to the marketplace, where they are what a buyer is actually
charged. Of everything in Settings, this and the payment methods are the parts
most worth keeping accurate, because a customer sees them.

### Taxation

Headed "Taxation & Compliance". A "VAT/Sales tax configuration" with a VAT (%)
rate and a choice of Inclusive or Exclusive, saved with "Save VAT settings"; and
"Enable EFRIS integration" with "Enter your EFRIS API key" and "Save EFRIS
settings".

Neither is wired to anything. **No VAT is added to or extracted from any sale,
and nothing is filed with EFRIS.** A shop with a tax obligation cannot meet it
through Doline today, and should not read the presence of this screen as
evidence otherwise.

### POS Hardware

Headed "POS Hardware devices", in four groups -- Receipt Printers, Barcode
Scanners, Cash Drawers and Weighing Scales -- each with "Add device" (one field,
Device name) and, per device, Activate, Deactivate and Remove.

Devices you add here are saved on this device and survive closing the app, but
they are **local to this till only** -- they are not synced, so a second counter
in the same shop has its own separate list. Adding the shop's printer on one
device does not add it on the other.

What the list does not do is connect to anything. **Doline does not talk to
printers, scanners, drawers or scales at all**, so a device recorded here, active
or not, changes nothing about how the app behaves. Sales are not printed as
receipts, and the POS scanner uses the phone's own camera rather than any scanner
named here. Treat this as a note of what hardware the till is meant to have, not
as a working integration.
