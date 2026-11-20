## 9. Dashboard `[Both]`

The Store tab, and the screen you land on after unlocking. It answers "how is
the shop doing?" in one scroll, and it is the only way in to the menu drawer and
the account menu.

The shop's name sits in the top bar, with the menu button on its left and your
account icon on its right. A red dot on the account icon means there are unread
notifications. Notifications is the first entry in the account menu, with how
many are unread beside it, and opens "Notifications": the list, newest first,
with "Mark all read" -- or "Nothing yet. Marketplace orders, reviews and stock
alerts show up here." What gets notified is set in Settings (section 20).

Everything below is read-only: the dashboard reports, it does not change
anything. On a phone, pulling it down syncs (see the overview).

### Total revenue

The blue card at the top, headed TOTAL REVENUE. It is the shop's revenue
across every order it has ever taken, with two deliberate exclusions: **drafts
and cancelled orders are not counted**. A draft has not sold anything, and a
cancelled order un-sold it.

Under the figure, a line like "+12.4% from last month" compares this calendar
month's revenue so far against the whole of last month, with an arrow up or
down. It disappears entirely when last month had no sales, because there is
nothing to compare against -- not because the figure is zero. Early in a month
the comparison will look grim for the ordinary reason that the month has barely
started.

The "View full report" button on the same card opens Reports (section 19), for
admins and staff given the Reports permission.

### Active orders and clients

Two smaller cards side by side.

- **ACTIVE ORDERS** -- how many orders are pending, ready or shipping; in other
  words, not finished. Underneath, "N Ready for pickup" narrows that to the ones
  a customer could walk in and collect right now.
- **TOTAL CLIENTS** -- how many clients the shop has on file, with "N new this
  week" underneath.

### Performance trend

Headed PERFORMANCE TREND with the line "Daily sales volume, past 7 days": a bar
per day for the last seven days, today included, on the same
drafts-and-cancellations-excluded basis as the revenue card. When there is
nothing to draw it says "No sales recorded in the past week." rather than
showing seven empty bars.

This is the quickest read on the shop in the app. A single flat day in a row of
busy ones usually means a day somebody sold without unlocking, or a day of
drafts nobody completed.

### Top selling items

Headed TOP SELLING ITEMS: a pie chart divided by **units sold**, not by money,
with a legend underneath naming each item and its quantity. Tapping a slice
selects it and pulls it out of the circle. Items beyond the largest few are
grouped as "Others".

Because it counts units, a shop selling many cheap things and a few expensive
ones will see the cheap ones dominate. That is the honest answer to "what
moves?" -- for "what earns?" go to Reports.

### Recent orders

Headed RECENT ORDERS: the five most recent orders, newest first, whatever their
state -- drafts and cancellations appear here even though they are left out of
the figures above. Each row shows the client's name, or "Walk-in customer" where
no client was attached, the order number and date, and the order's current
progress. Tapping a row opens that order (section 15). Empty, it says "No orders
yet."

### The account menu

The account icon at the top right opens a menu headed with your own name and, if
you have it, a note that you are an admin. Below that:

- **Notifications** -- the list above, with the unread count beside it.
- **Edit profile** -- your own name and details.
- **Lock** -- ends your shift immediately and returns the device to the staff
  lock. Use this when you step away from the counter rather than waiting for the
  automatic lock.
- **Change pass key** -- your current pass key once, the new one twice.
- **Sign out** -- in red, and a far bigger action than Lock. See below.

### Sign out -- read the dialog

**Lock and Sign out are not the same thing.** Lock hands the till to the next
person. Sign out un-provisions the device. The confirmation says so plainly --
"Sign out?" / "This removes every store, order and setting this account has on
this device. Nothing is deleted from the cloud, and you can sign back in here or
on any other device."

Signing back in means doing the whole setup again: the account password, the
admin pass key, the store picker, and a full download. On a busy counter that is
not a thing to do by accident, which is why the dialog spells it out. Cancel is
the right answer unless you meant it.

If anything is still waiting to sync, you get a different dialog. "Changes
haven't synced yet" tells you how many changes this device has that have not
reached the cloud, and that signing out now *would lose them for good* --
because signing out wipes the local copy and the cloud never received them.

The advice in it is the right advice: make sure you are online, wait a moment,
and look again. "Sign out anyway" is there because sometimes you must, but it is
throwing away real sales. This is the one dialog in Doline worth reading the
number on.

### If your profile failed to save

A warning sometimes appears near the top: "Your profile couldn't be saved" /
"It didn't sync after several tries. Tap to review it in Edit profile." Tapping
it opens Edit profile, where you can check the details and save again. It means
your own profile edit never reached the cloud -- not that anything is wrong with
the shop's data.
