## 17. Suppliers `[Both]`

Who the shop buys from, reached from Suppliers in the menu drawer. It mirrors
Clients almost exactly, with one addition: a supplier can be linked to the items
they supply.

Anyone can look suppliers up. Adding or changing one needs the "Suppliers"
permission, and placing an order with a supplier needs "Receive stock" (section
21); without them an admin is asked to allow it.

### The list and the form

Headed "Suppliers", a row per supplier with their name and phone or address, or
"No contact details" ("On Doline" for a store on Doline). The search icon in the
top bar opens "Search suppliers". On a phone, pulling the list down syncs
(see the overview). Empty states read "No suppliers added yet." and
"None of your suppliers match ...".

The + button opens "Add a supplier". Its "Find them on Doline" button opens the
stores on Doline that supply others, with All, Suppliers and Wholesalers filters
and the same top-bar search. Tapping one adds it as a supplier and opens it.
Below that button, a supplier who is not on Doline is recorded with Name, Phone
and Address, then Save.

### A supplier's own screen

Headed with the supplier's name and a search icon (searching their items), the
screen lists the items linked to this supplier, each with a remove button, or
"No items linked yet."
A supplier on Doline also has a "Place order" button floating at the bottom
(see Placing an order).

The top-bar menu holds:

- **Details** opens a sheet with their name, the date they were added, Phone
  and Address. Phone carries the same call button as a client's, handing the
  number to the phone's dialler -- which is the point of keeping suppliers here
  at all, since reordering starts with a phone call. "Edit" turns the sheet into
  the form, with Name, Phone, Address and Save. When the supplier looks like a
  store on Doline, the suggestion to link them sits at the top of the sheet.
- **Add items** opens "Add item supplied", listing the shop's items to pick
  from -- or "All items are already linked to this supplier." when there is
  nothing left to add. For a supplier on Doline it opens their products instead
  (see below).
- **Delete supplier** in red, which confirms by name ("Remove supplier" for a
  store on Doline).

Linking is for your own reference: it answers "who do I call about this?" from
the supplier's side. It does not feed restocking, and it is not what the batch
details screen shows in its Supplier field -- that line is a placeholder
(section 13).

### Mapping items to a Doline supplier's products

When the supplier is a store on Doline, linking starts from **their** products,
so you only link what they actually sell. "Link from their products" (Add items
in the menu on a phone) lists what they have listed on Doline, each showing
which of your items it is linked to ("Your Sugar · 1 bag = 50 kg") or what they sell it
by and for. If they have listed nothing, there is nothing to link yet.

Pick one of their products, then which of **your** items it is. The likeliest
item comes first, marked "Suggested": the same barcode, or else the closest
name. Say how many of your item's stock keeping units one of theirs holds -- "1
carton of theirs = 24 pieces" -- and "Link". Picking a product already linked
lets you change or remove its mapping.

Each linked item shows its mapping under its name, or "Not mapped to their
products" for items linked before this existed, with "Map" or "Change" beside
it. One of their products links to only one of your items, and one of your
items to only one of theirs; an item already linked to another of their
products reads "Already linked to their" product. A supplier that is only a
contact links your own items as before, with nothing to map.

The mapping is what ordering from a Doline supplier uses, so the order names
their product in their units.

### Placing an order

Only a supplier that is a store on Doline can be ordered from. Their screen
carries a floating "Place order" button (on desktop, the supplier panel has
it); a supplier that is only a contact has none, and is recorded against stock
as it is received instead.

"Order from" the supplier lists their listed products that are mapped to your
items, each with what it is sold by and for, with a search icon in the top bar. Tap one to add it, then set how
many; the total, an optional note and "Place order" sit below. If none of their
products is mapped yet, it says to link some first. A placed order is saved on
this device only -- it is not sent to the supplier through Doline yet, so let
them know.
