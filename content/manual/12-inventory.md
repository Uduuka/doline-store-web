## 12. Inventory `[Both]`

The Inventory tab: everything the shop stocks, one card per item, under
"Inventory" in the top bar. On a phone, pulling the list down syncs it (see the
overview).

### Prices live on batches, not on items

This is the one idea to hold on to. An item is the thing you sell -- its name,
its description, its category, its barcode. A batch is one delivery of it, and
it is the batch that carries what you paid, what you charge, and how much is
left. So an item with no batches has no price and no stock, and the way to give
it one is to restock it.

This is why the app sends you to Restock in places you might expect an "edit
price" button, and why correcting a price means opening the batch it belongs to.

### The stock filters

A row of chips across the top, scrollable sideways. Tapping one narrows the list
below.

- **All** -- everything, however much of it is left.
- **In stock** -- more than five available.
- **Low stock** -- five or fewer available.
- **Out of stock** -- none at all.

Two things about those chips are worth knowing, because neither is obvious from
looking at them. **Low stock includes zero** -- an item with nothing left shows
up under both Low stock and Out of stock, so Low stock is "needs attention", not
"nearly gone". And **the line is drawn at five for every item in every shop**:
it is a fixed number in the app, not something you can set per item or change in
Settings. For a shop selling bread by the loaf that is probably too low; for one
selling fridges it is far too high. Read the chip as a rough sweep and the
actual quantity on the card as the truth.

### Searching

The Search box beside the title opens the search bar, "Search inventory". The
arrow (or back) closes it and clears the search; the x clears the text and
keeps it open. It matches on barcode, item name, description, category
*and* sub-category at once, so a category word finds a whole shelf.

Search and the filter chips work together rather than cancelling each other out:
Low stock plus the word "soap" gives you the soap that is running out.

### Reading an item card

Each card carries the item's cover image, its name, its prices, and a line like
"24 Kilograms in stock" -- the total available across all of that item's batches,
in the item's own stock unit.

A small marketplace mark on a card means that item is listed on the Doline
marketplace (see Marketing below, and Storefront listing in section 13).

A card showing "No prices set!" in blue where the prices should be is an item
that cannot be sold: there is nothing on the POS screen to tap a price for. That
happens to an item created but never stocked, and the fix is to restock it
(section 14).

An empty list says "No items in inventory yet.", or "No items match ..." when a
search is in play. Tapping a card opens the item (section 13); the blue +
button at the bottom creates a new one.

### The inventory menu

On a phone, the ⋮ menu in the top bar holds five ways of acting on the stock this screen
lists:

- **Physical count** -- count the whole shop against the shelf; see Counting
  stock below.
- **Restock** -- pick several items, then stock them or order them in one pass
  (section 14, Restocking several items at once).
- **Marketing** -- pick items to put on the Doline marketplace.
- **Suppliers** -- opens Suppliers (section 17).
- **Damages** -- opens the store's damage write-offs.

On a computer, Physical count is the "Physical count" button at the top of
Inventory.

### Counting stock

Counting stock against the shelf is open to every staff member. **Saving a
count never changes stock.** It records what was found, and anything off waits
for someone allowed to settle it.

There are three ways in:

- **Physical count**, from Inventory -- the whole shop at once. One row per
  item, with what the app says is in stock. Under each
  item, one line per batch: BATCH NO., SYSTEM COUNT, and a box to type what is on
  the SHELF. Batches with nothing left are hidden ("Show all batches (N more)"
  brings them back). The VARIANCE column works out the difference as you type.
  Leave a batch blank if you did not count it.
- **Stock count**, from an item's menu (section 13) -- one item's batches, with
  when it was last counted.
- **Count stock**, on a batch's details (section 13) -- on a phone the
  calculator button opens the item's Stock count, this batch among the rest; on
  a computer it counts that one batch in place.

"NOTE (OPTIONAL)" keeps anything worth remembering about the count, then "Save
count". The answer says what was found: "Everything matched.", or how many
lines are off and that nothing has been changed yet. A count with lines off
also raises a "Stock count" notification.

Counts that are refused say why: "Enter what you counted for at least one
batch." or "A count can't be less than nothing." An item with no batches has
nothing to count against -- restock it first.

### Past counts

"Past counts", from Physical count or Stock count, lists every count as it was
saved: when, how many items and batches, how much was short or over, "Everything
matched", or how many lines are still "to decide". Opening one shows each
batch's SHELF, SYSTEM and VARIANCE.

Each line that is off has two buttons. **Write off N** (a shortfall) or **Add
back N** (a surplus) accepts it: the batch moves by the difference, a shortfall
written off at what the stock cost. **Dismiss** leaves the batch as it is --
for a miscount, say. Either way the line then shows "Accepted" or "Dismissed"
with when.

Deciding needs the "Settle stock counts" permission (section 21), or an admin's
pass key. Every decision goes in the Activity log.

### Picking items

Restock and Marketing both start by picking. The top bar changes to "Select
items to restock" (or "to list") and then counts what is picked ("3
selected"); tapping a card picks it instead of opening it, and the + button
hides. "All" picks every card on screen -- what the filters and search leave
showing, not the whole stock. The x cancels; back does too.

- For Restock, **Next** carries the picked items to the restock screen.
- For Marketing, **List** puts each one on the marketplace, showing
  "Listing..." while it works. A banner then reports the result -- "3 items are
  now on the marketplace.", or how many could not be listed, which stay
  unlisted to try again. The banner clears itself after a while, or with its x.

