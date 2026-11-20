## 21. Staff and Security `[Admin only]`

Headed "Staff & Access", under Settings. Where staff are added, edited, given or
stripped of admin, and where a forgotten pass key is reset. Non-admins cannot
see this screen in the Settings list.

Its own blurb states the rule the rest of the app runs on: "Staff members unlock
this device with their pass key."

### Locking automatically

"Lock automatically after" sets how long this device may sit untouched before it
locks itself and asks who is on shift: Never (the default), 1 minute, 5 minutes,
15 minutes or 30 minutes. On a computer it is the "Lock screen" card in the same
section.

It belongs to the device, not the shop: a shared counter till might lock after a
minute while the owner's own laptop never does. It takes effect straight away,
and it is never synced to other devices. Whatever it is set to, Lock in the
account menu (or the sidebar's Lock button on a computer) always works.

### The staff list

One row per staff member, with an "Admin" marker on those who have it, or
"Unnamed staff" where no name was entered. "No staff members added yet." on a
shop with only its admin. "Add new staff" creates one; a per-row menu holds
"Edit staff" and "Delete staff".

### Adding or editing a staff member

- **Full names** -- required. This is the name that appears on the lock screen
  for them to tap, so use the name they are known by at the counter.
- **Username** -- required.
- **Role** -- required: their job title. It is a label, not a permission; what
  they may do is decided by the admin switch and the Permissions list below.
- **Pass key** -- six digits to start them off. When editing, "Leave blank to
  keep current pass key" -- so typing a new one here is how you reset a pass key
  somebody has forgotten.
- **Admin access** -- a switch, described as "Can manage staff and store
  settings". Only visible to admins.

- **Permissions** -- shown only while Admin access is off; see "What a staff
  member may do" below.

An incomplete form is refused with "Full names, username and role are
required."; "Could not determine the current store." means something went wrong
before the form opened, and is worth reporting rather than retrying.

Tell the new staff member their starting pass key and have them change it
themselves from the account menu (section 9). A pass key the admin also knows is
not really theirs, and the whole point of recording sales against a name is that
only that person could have made them.

### Granting and revoking admin

Because of what it hands over, the switch does not just flip -- it asks. Granting
shows "Grant admin access?" and "<name> will be able to manage staff and store
settings.", confirmed with Grant. Revoking shows "Revoke admin access?" and
"<name> will lose access to manage staff and store settings.", confirmed with
Revoke.

Granting admin gives that person the ability to add staff, grant admin to
others, edit the store, add shops to the account and reach the shop list. In a
shop with one owner, one admin is usually the right number.

The switch is not shown to non-admins, and the check is enforced on save as well
as in the display: a non-admin who somehow reaches the form cannot change
anybody's admin flag, including their own.

### What a staff member may do

The Permissions list on a staff member's form says what they may do beyond
selling. Its own note sets out the rule: "Everyone can sell, add clients and
expenses, and count stock. Tick what else this person may do; an admin's pass
key can allow the rest one action at a time."

An admin may do everything, always, so the list is hidden while Admin access is
on. Each line is a switch:

- **Sell on credit** -- give goods on credit and record credit payments.
- **Returns and cancellations** -- take returns and cancel orders.
- **Edit orders** -- change who an order is for after the sale.
- **Receive stock** -- add batches and order from suppliers.
- **Correct batches** -- change what a batch was received with or cost.
- **Write off stock** -- record damaged, expired or lost stock.
- **Settle stock counts** -- accept or dismiss what a physical count found
  (section 12).
- **Add and edit items** -- create items and change their details.
- **Prices and promotions** -- set selling prices, discounts and flash sales.
- **Marketplace listings** -- list and unlist items on DolineMarket.
- **Suppliers** -- add and change suppliers.
- **Reports** -- open Reports: sales, profit and losses (section 19).
- **See costs and profit** -- buying prices, unit costs, profit and losses at
  cost, everywhere outside Reports.
- **Store settings** -- working hours, delivery, receipts, POS hardware and the
  rest of Settings (section 20).

Above the switches are three starting points: **Manager** ticks everything,
**Cashier** ticks nothing, and **Stock keeper** ticks Receive stock, Correct
batches, Write off stock, Settle stock counts, Add and edit items and
Suppliers. Picking one only ticks its boxes; they can then be changed one by
one, and only the boxes are saved.

Staff added before permissions existed keep everything they could already do,
so an update never locks a shop out of its own till. Only an admin can change a
staff member's permissions, and only an admin can delete an item, switch
stores, edit store details, manage staff or see the Activity screen.

### Hiding costs `[Both]`

Without "See costs and profit", buying prices, unit costs, stock value at cost
and profit figures are left off the dashboard, inventory, batch, damages and
promotion screens. What is hidden is the figure, never the warning: a price
below what the stock cost is still flagged, so nobody sells at a loss without
knowing it. Lilli follows the same rule (section 22).

### When something needs an admin `[Both]`

When a staff member tries something their permissions do not cover, the app
stops and shows "Admin approval needed": the action, "isn't something you're
allowed to do. An admin can allow it this once with their pass key."

An admin who is there picks their name ("Choose which admin is allowing it." when
there is more than one), types their own pass key and taps Allow. The action
then goes ahead, recorded against the staff member with "allowed by" that admin.
A wrong key says "That pass key isn't right."; too many wrong tries lock it out
for a while ("Too many tries. Wait ...s."), as on the lock screen. Cancel
refuses the action.

An approval covers the whole action it was asked for, and lasts about two
minutes for that staff member only. It does not carry over to whoever unlocks
the till next.

Whole screens work the same way. Reports and Settings, for someone without
permission, show "You don't have permission for this. An admin can open it for
you with their pass key." and an "Ask an admin" button.

The action is refused outright, with no dialog, when no admin on this device has
a pass key set. Set one (section 6) before handing the till to staff.

### Activity `[Admin only]`

Under Settings, in the Access group, next to Staff & Security. Hidden from
non-admins.

A log of who did what: sales on credit, credit payments, returns, cancellations,
order client changes, stock received and ordered, batch corrections,
write-offs, settled stock counts, item and price changes, marketplace listings,
supplier and staff changes, and the till being unlocked, locked or locked out by
wrong pass keys. Each entry names the staff member and, where their own
permissions did not cover it, the admin who allowed it ("Grace, allowed by
Peter").

Two filters narrow it: one for the person (Everyone, or one staff member) and
one for the kind of action (Everything, or one kind). "Nothing recorded for
these filters." means just that. A batch and an order also show their own
History at the bottom of their screens.

The log syncs, so it covers every device on the shop's account, and it cannot
be edited or cleared from the app.

### Your own pass key and profile `[Both]`

These two are reached from the account menu on the dashboard, not from here, and
every staff member can use them on their own account. On a computer, click
"Profile" at the foot of the sidebar, or your own name there: it opens your
profile, with "Change pass key" under it.

"Change pass key" takes Current pass key, New pass key and Confirm new pass key.
Problems are named directly -- "Current pass key is incorrect.", "New pass keys
don't match." Do this on your first shift if an admin set your pass key for you.

"Edit profile" takes Full name, Username, Phone and About, refusing a blank name
with "Full name and username can't be blank." If this edit fails to reach the
cloud, the dashboard shows the warning described in section 9.
