## 9. Dashboard `[Both]`

The Store tab, and the screen you land on after unlocking. It answers "how is
the shop doing?" in one scroll, and it is the way in to the menu drawer.

![The dashboard: today's sales card, then Revenue this month, Credit owed to you, Active orders and Total clients](https://downloads.dolinesystems.com/manual/09-dashboard.png)

The shop's name sits in the top bar with the menu button on its left. Everything
below is read-only: the dashboard reports, it does not change anything. On a
phone, pulling it down syncs (see the overview).

### Sales today

The blue card at the top is headed with today's date and "SALES TODAY" -- for
example "MONDAY, 23 NOVEMBER · SALES TODAY". The large figure is what the shop
has sold today, and the pill under it counts today's orders. Drafts and
cancelled orders are not counted: a draft has not sold anything, and a
cancelled order un-sold it.

### The four figures

Four cards under it, two by two:

- **Revenue this month** -- sales so far this calendar month, with a comparison
  such as "73% vs last month" (an arrow up or down) and how many orders made it.
  Early in a month the comparison looks poor for the ordinary reason that the
  month has barely started; it disappears when last month had no sales at all.
- **Credit owed to you** -- what clients still owe on credit orders, and how many
  orders are on credit. Clients (section 16) shows who.
- **Active orders** -- orders that are not finished: pending, ready or out for
  delivery, with "N ready" for those a customer could collect now.
- **Total clients** -- how many clients the shop has on file, with how many are
  new this week ("None new this week" when none are).

### Performance trend

![Performance trend: the Sales bars and the Profit bars for the past seven days](https://downloads.dolinesystems.com/manual/09-dashboard-lower.png)

Headed "Performance trend", with **Reports** on the right to open the full
reports (section 19, for admins and staff with the Reports permission). Two
charts, each a bar per day for the last seven days, today included:

- **Sales** -- the money taken each day, with the week's total, for example
  "UGX 134K · past 7 days". With nothing to draw it says "No sales recorded in
  the past week."
- **Profit** -- each day's profit and the week's total. It needs sales *and*
  what each batch cost, so a shop that has not entered buying prices sees "No
  profit to show yet. Profit needs sales and what each batch cost." Profit is
  shown only to those allowed to see costs.

A single flat day in a row of busy ones usually means a day somebody sold
without unlocking, or a day of drafts nobody completed.

### Top selling

When items have sold recently, "Top selling" shows them by units sold, not by
money. A shop selling many cheap things and a few expensive ones will see the
cheap ones dominate. That is the honest answer to "what moves?" -- for "what
earns?" go to Reports.

### Quick actions

![Quick actions: New sale, Inventory, Add item, Expenses, Clients, Suppliers, Reports and Notes](https://downloads.dolinesystems.com/manual/09-dashboard-quick-actions.png)

Eight shortcuts in two columns: New sale (the POS tab), Inventory, Add item,
Expenses, Clients, Suppliers, Reports and Notes. Each opens the same screen as
its tab or menu entry; the ones that need a permission ask for an admin's pass
key when you do not have it.

### Recent orders

Headed "Recent orders", with **See all** to open the Orders tab: the most recent
orders, newest first, whatever their state -- drafts and cancellations appear here
even though they are left out of the figures above. Each row shows the client's
name, or "Walk-in client", the order number, items, total, date and status.
Tapping a row opens that order (section 15). Empty, it says "No orders yet. Sales
from the till and DolineMarket show up here."

### The menu

![The menu drawer: Dashboard, Inbox, Notifications with its unread count, Reports, Expenses, Clients, Suppliers, Notes, Settings, Help and feedback, and the person on shift at the foot](https://downloads.dolinesystems.com/manual/09-menu.png)

The menu button at the top left opens a drawer headed with the shop's name and
address:

- **Dashboard** -- back here.
- **Inbox** -- the store's messages (section 25), with a count when some are
  unread.
- **Notifications** -- with the unread count beside it. Opens the list below.
- **Reports**, **Expenses**, **Clients**, **Suppliers**, **Notes** -- sections
  19, 18, 16, 17 and 18.
- **Settings** -- section 20.
- **Help and feedback** -- section 23.

At the foot of the drawer is the person on shift -- their initials, name and role.

### Notifications

![Notifications: stock alerts such as Out of stock and Running low, and a plan notice](https://downloads.dolinesystems.com/manual/09-notifications.png)

"Notifications" lists alerts newest first -- an item out of stock or running low,
marketplace orders, reviews, and notices about the plan -- with "Mark all read" at
the top right. Empty, it says "Nothing yet. Marketplace orders, reviews and stock
alerts show up here." What gets notified is set in Settings (section 20).

### Your own menu -- profile, lock, sign out

![The menu that opens from your name: Edit profile, Change pass key, Switch store, Lock the till and Sign out](https://downloads.dolinesystems.com/manual/09-profile-menu.png)

Tapping your name at the foot of the drawer opens a short menu:

- **Edit profile** -- your own name and details.
- **Change pass key** -- your current pass key once, the new one twice.
- **Switch store** -- to another shop installed on this device. Admins only;
  staff are kept to the shop they are on.
- **Lock the till** -- ends your shift immediately and returns the device to
  "Who's on shift?". Use this when you step away from the counter rather than
  waiting for the automatic lock.
- **Sign out** -- in red, and a far bigger action than locking. See below.

### Sign out -- read the dialog

![Sign out?: what signing out removes from this device, and what happens to its messages](https://downloads.dolinesystems.com/manual/24-sign-out.png)

**Locking and signing out are not the same thing.** Locking hands the till to the
next person. Signing out un-provisions the device. The confirmation says so --
"Sign out?" / "This removes every store, order and setting this account has on
this device. Nothing is deleted from the cloud, and you can sign back in here or
on any other device."

When the device holds messages, the dialog adds what happens to them: "Messages:
this device holds N messages and N MB of photos and voice notes. Signing out
deletes them here. Messages from the last 30 days, and photos and voice notes
from the last 7, come back when you sign in again; anything older is only on this
device and is lost." If they are not in a Google Drive backup it says "They
aren't backed up. To keep them, cancel and connect Google Drive in Settings >
Message backup, or share them with another device." (the screen it means is
Settings > Google Drive backup, section 20). With Drive connected, the dialog
offers **Back up, then sign out** -- "Sending this device's messages and records
to your Google Drive before signing out. Keep the app open." -- and **Just sign
out**.

Signing back in means doing the whole setup again: the emailed code, the admin
pass key, the store picker, and a full download. Cancel is the right answer
unless you meant it.

If anything is still waiting to sync, you get a different dialog. "Changes
haven't synced yet" tells you how many changes this device has that have not
reached the cloud, and that signing out now *would lose them for good*. Make
sure you are online, wait a moment, and look again. "Sign out anyway" is there
because sometimes you must, but it is throwing away real sales. This is the one
dialog in Doline worth reading the number on.

### If your profile failed to save

A warning sometimes appears near the top: "Your profile couldn't be saved after
several tries. Review it in Edit profile." with Review. It means your own profile
edit never reached the cloud -- not that anything is wrong with the shop's data.
