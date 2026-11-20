## 13. Item and batches `[Both]`

Six screens that belong together: an item's own page, the form that creates or
edits it, its storefront listing, its damages, a batch's details, and the form
that corrects a batch.

### The item screen

The item's name is in the top bar, with a back arrow and a menu. Under it, four
figures: **Price** (what it sells at now, and per what), **Available** (what is
left, "of" what was stocked), **Batches** (how many, and when the latest
arrived) and **Pricing** (its pricing scheme, set per batch).

Then:

- **Batches and stock** -- a row per batch with what arrived and what is left.
  Tapping a row opens that batch. "Restock" beside the heading adds a new one
  (section 14).
- **Prices** -- the item's active prices. Where it has none, it says so and
  offers to restock, since prices arrive attached to a batch.
- **Description** -- and the category and Universal Product Code.
- **Recent sales** -- the last three sales of this item, each as "Order #..."
  with how many were sold (and how many came back). Under each, every batch it
  drew from: "Batch ... · took 3 cartons · 12 → 9", what the batch held just
  before the sale and just after.

### Reading Recent sales when stock doesn't add up

Read down one batch's rows from the oldest sale to the newest: each sale's
"after" should be the next sale's "before". Where it isn't, stock moved between
the two sales without a sale -- a write-off, a correction, a count, another
till's sale not yet synced here, or stock that went missing. "before not
recorded" means the sale was rung up before the app kept that figure (or came
from another device), so there is nothing to compare. Lilli can do this
comparison for you: ask her why an item's stock doesn't add up (section 22).

A batch can show less than zero. That happens when more was sold than the
records said was there -- usually two tills selling the last units before
either had synced, or a sale made with "sell anyway". It is recorded as it
happened rather than refused, and a stock count (section 12) settles it.

### The item menu

The menu in the top bar:

- **Restock** -- adds a new batch of this item; see section 14.
- **Promotions** -- discounts and flash sales on the item's prices; below.
- **Listing** -- whether buyers see this product on DolineMarket; below. The
  menu does not say which state it is in, so opening it is how you find out.
- **Write off** -- writes off stock that was lost rather than sold; see
  Damages below.
- **Stock count** -- counts this item's batches against the shelf. Saving a
  count changes nothing until someone settles it; see section 12, Counting
  stock.
- **Edit item** -- opens the item's details for editing.
- **Delete item** `[Admin only]` -- for an item the shop no longer sells; see
  below. A staff member is asked for an admin's pass key.

### Deleting an item `[Admin only]`

"Delete <item>?" explains what happens: "It comes off the till, the inventory
and DolineMarket on every device. Past sales, write-offs and reports keep it."
If some is still in stock, it adds that the stock will no longer be counted.
Delete confirms; Cancel leaves it.

Deleting does not erase the item's history. Its past orders, write-offs, counts
and reports still read correctly, and opening the item from an old order shows
"Deleted on <date>. Kept here for its past sales." What it does do is take the
item out of the till, Inventory, restocking, counts, suppliers and stock alerts,
take it out of any cart it is sitting in, and withdraw its DolineMarket listing.

A deleted item stops counting toward the plan's item limit (section 24), which is
why the limit's message suggests deleting items you no longer sell.

### Promotions: discounts and flash sales

Headed "Promotions" on a phone. On a computer, "Discounts & flash sales" on the
item's panel in Inventory opens the same thing as a panel.

A **discount** takes an amount off a price until you remove it. A **flash sale**
replaces the price for the time you set; any discount waits until it ends. Both
apply at your till and on the marketplace, from the moment they sync.

Each of the item's active prices gets its own card, starting "Listed at" its
price. Under it:

- **Discount** -- "None", or the amount off with its percentage and what it now
  sells at ("UGX 500 off (10%) · sells at UGX 4,500"). Add or Change opens the
  editor: None, "Amount off" or "Percent off", then "Save discount". A
  percentage is saved as the amount it works out to. Remove takes it off.
- **Flash sale** -- "None", the price and its window when one is coming, "now,
  until" its end while one runs, or "Ended" with what it was. Add or Change
  asks for a "Flash price", when it STARTS (Now or Later, with a date and time)
  and when it ENDS, then "Save flash sale". Remove takes it off.

The app refuses what the cloud would refuse, so nothing set here fails to sync:

- A discount can't be negative, and has to be less than the price.
- A flash price has to be above zero and below the listed price.
- The end has to be still to come, and after the start.

While you edit, the card shows what the item would sell at ("Sells at ...
instead of ..."). If that is below what the newest batch cost a unit, it warns
-- "That is UGX 200 a unit below what batch #BAT3 cost." -- but still lets you
save, since selling at a loss on purpose is a promotion too.

An item with no active prices has nothing to promote: the screen says so and
offers "Restock now".

Wherever a price shows -- the item screen, the till -- it is what the till
charges right now, with the listed price struck through beside it while a
discount or flash sale applies. The cart's total uses the charged price too.

### Storefront listing

Headed "Storefront Listing". One switch, and everything you need to decide
whether to throw it.

Every item a shop records syncs to the cloud whether or not it is listed -- that
is how a catalogue survives a reinstall, and it is not the same thing as being on
sale to the public. Listing is the separate decision: should buyers be shown this
product? New items are not listed, and nothing on an upgrade lists what was
already there.

Throwing the switch raises an **ad** for the product -- the same kind of listing
the marketplace app shows -- and buyers can see a product only while its ad is
active. That is why a shop can hold five hundred items and publish twenty without
inventing listings for the rest.

Under the switch, the state in words -- "Listed. Buyers can find this product in
the storefront." or "Not listed. Only your own shop sees this product." -- with
the date it first went up.

A listing is only seen if the **store itself is on DolineMarket**: published from
Store Details (section 20), which takes a paid plan (section 24). Once plans
start, listing an item in a store that isn't published, or listing more than the
plan allows, brings up the plan's message instead; Free has no listings at all.

Switching it off **pauses** the listing rather than deleting it: "Not listed. The
listing is paused, and switching this back on restores the same one." The ad keeps
its identity, and so its views, likes and reviews, instead of starting from
nothing each time. A listing the marketplace app has put in another state --
draft, sold or archived -- is named as such rather than reported as a plain "not
listed", because switching on from one of those is a different decision from
publishing for the first time.

The listing takes the product's own photos. If none of them have reached the
cloud yet -- the app uploads them in the background after an item is saved -- the
listing goes up without a picture, and gains one on a later sync.

Then a readiness list, which is the point of the screen. It names what a buyer
would actually run into:

- no price, so nobody can order it (prices arrive with a batch, so the fix is to
  restock);
- nothing left in stock, so it shows as sold out;
- no photo, which a listing is mostly ignored without;
- no description.

"This product is ready for the storefront." when there is nothing to say. None of
these stop you listing it -- a shop listing ahead of a delivery is a real thing
to want, and Doline does not block the commercially odd elsewhere either -- but
it will not let it happen quietly.

Below that, "What buyers see": the description, the stock figure and the prices,
read from the same fields the storefront reads, because the decision being made
here is about somebody else's screen.

The switch saves as you throw it, like the switches in Settings. If the save
fails the switch stays where it was, since what it shows is what is stored.

### Damages

Headed "Damages". Records stock that went without being sold -- broken, expired,
spoiled, lost or stolen -- and takes it off the shelf figure.

This is the right way to account for breakage, and the wrong way is tempting:
"correcting" the quantity a batch was received with (section 14) also makes the
numbers add up, but that field is the divisor behind the batch's unit cost, so
shaving it inflates the cost of everything the batch has already sold and drags
reported profit down with it. A write-off moves what is **left** and leaves what
the batch **cost** alone.

- **BATCH** -- which delivery the stock came out of, each option showing what is
  left on it. The newest batch that still has stock is picked for you. It has to
  be a batch and not just the item, because what the loss is worth is the cost of
  that particular delivery.
- **QUANTITY LOST** -- in the batch's own stocking units, named in the label.
- **REASON** -- Broken or damaged, Expired, Spoiled, Lost, Stolen, or Other.
- **NOTE (OPTIONAL)** -- anything worth remembering about it.

As you fill it in, the screen states both halves of what will happen: "Stock on
batch #BAT000012 goes from 17 to 14 crates." and "That is UGX 15,000 of stock at
what this batch cost." A batch with no recorded buying price says so instead, and
points at recording the cost.

A quantity larger than what is left on the batch is refused -- "Only 2 crates are
left on that batch." -- rather than quietly writing off less than you reported. A
figure bigger than the shelf means the count is wrong somewhere, and that is
worth knowing. The check is made again at the moment of saving, so a till that
sold the last of a batch while this form was open cannot drive stock negative.

Saving clears the form and leaves you on the screen, because breakage tends to be
counted several lines at a time. Each one appears under "Recorded write-offs"
with its quantity, reason, batch, date and cost -- or "Not valued" where the
batch has no buying price.

Write-offs are not editable. A mistyped one is corrected by moving the stock back
the other way -- restocking, or a batch correction -- so that the stock figure
and the reason it moved can never disagree. They are totalled per period under
Damages & Write-offs in Reports (section 19).

### Creating or editing an item

The same form serves both, headed "Create stock item" or "Edit stock item". It
does not touch stock or prices at all -- those come with a batch.

- **UPC** -- the barcode. Optional, but it is what the POS scanner matches
  against, so an item without one has to be found by name.
- **PRODUCT TITLE** -- required. What staff will see on the till.
- **PRODUCT DESCRIPTION** -- required.
- **SKU** -- required. The stock keeping unit, meaning what you count this item
  in: Kilograms, crates, pieces. It is the unit every stock figure for this item
  is quoted in, so get it right at the start.
- **CATEGORY** -- required, chosen from the standard list.
- **SUB-CATEGORY** -- optional, a level finer.
- **ITEM SPECIFICATIONS** -- key-and-value pairs describing variants: a key like
  Color and values like "Blue, Red". These are what a Range-priced item prices
  against.
- **PRICING SCHEME** -- Fixed, Unit, Range, Recurring or Menu, the five
  described in section 10. This decides what the add-to-cart form looks like for
  the rest of the item's life, so choose it deliberately.
- **ITEM IMAGES** -- at least one is required. "Add main cover Image" sets the
  one that appears on the cards.

"Add to stock" or "Save Changes" at the bottom submits. A missing required field
is named directly -- "The item title is required", "Add at least one image", and
so on -- with "Some fields require attention" summarising at the foot.

### Batch details

Headed "Batch Details", with the batch's own number (for example #BAT000123) in
blue and a green "Arrived" marker. The figures on this screen are where every
profit number in the app comes from, so it is worth being able to read them.

- **BUYING PRICE** -- what the **whole batch** cost, stated as "X for 20
  crates", with the per-unit cost worked out underneath. "Not recorded" in red
  means nobody entered it, and without it this batch has no margin, so no profit
  figure involving it means anything.
- **DATE RECEIVED** -- when the batch was stocked.
- **Selling Prices** -- a chip per price on this batch. The bin icon on a chip
  deletes that price, after a "Delete Pricing?" confirmation. "The price list is
  empty!" means this batch cannot be sold.
- **TOTAL ITEMS STOCKED** -- what arrived, under Tracking Status.
- **REMAINING IN STOCK** -- what is left of it. Below zero means more was sold
  than the records held; see "Reading Recent sales" above.
- **LAST COUNTED** -- when this batch was last counted, what the shelf had of
  what the app had, and who counted ("12 Nov 2026 · 8 of 10 cartons · Amina"), or
  "Never".

The edit icon beside the buying price opens the batch for correction (below).
The calculator button at the top counts the item's stock against the shelf
(section 12, Counting stock); on a computer it is "Count stock".

For a staff member without "See costs and profit" (section 21), BUYING PRICE
reads "Hidden" and the per-unit cost is left out. The below-cost warning still
appears, without the figure.

At the bottom, **History** lists what has been done to this batch and by whom:
received, corrected, prices added, changed or removed, written off, counts
settled.

Adding or removing a selling price needs "Prices and promotions", and correcting
the batch needs "Correct batches" (section 21); without them an admin is asked
to allow it.

### Supplier, and when the batch sold

Three fields here used to show fixed placeholder text on every batch in every
shop. They now read from your own data.

**ITEM SUPPLIER** lists the suppliers linked to this item, or "Not recorded"
where none are. Note the label: the link is held against the item, not the
delivery, so it answers "who do we get this from?" rather than "who brought this
particular batch?" -- Doline does not record a supplier per delivery. Linking is
done from the supplier's own screen (section 17).

**FIRST SALE** and **LAST SALE** are when this batch's stock first and last
sold, worked out from the batch each sale actually drew its stock from. A batch
nothing has sold from yet reads "Not sold yet" rather than borrowing the dates
of the item's other batches. Drafts and cancelled orders are excluded, as
everywhere else.

### The below-cost warning

When a selling price on a batch is lower than what that batch cost per unit, the
Selling Prices section says so: "One price is below cost." or "N prices are
below cost.", then "This batch cost X per crate. Selling under that loses money
on every sale." The offending chips are tinted red and carry a warning triangle,
so you can see which price is the problem.

The comparison is done properly across units: a batch costing per crate and a
price quoted per bottle are converted before being compared, so the warning
means what it says.

Either number can be the wrong one, which is why the warning offers "Fix what
this batch cost" rather than assuming the price is at fault. If the cost was
mistyped, correct the cost; if the cost is right, the price needs to go up.
Doline will not stop you selling below cost -- some shops do it deliberately --
it just refuses to let it happen silently.

### Correcting a batch

Headed "Edit Batch", showing the item's name and the batch number. It exists
mainly to fix a mistyped cost, which is invisible otherwise because the figure
that matters is a division of two fields.

- **QUANTITY RECEIVED** -- what actually arrived. Must be more than zero.
- **UNITS** -- what it arrived in, for example crate or carton. Required.
- **TOTAL BUYING PRICE** -- what you paid for the whole batch, with the label
  naming the quantity so there is no doubt. Cannot be negative.
- **MANUFACTURE DATE** -- optional, via a date picker.
- **EXPIRY DATE** -- optional, via a date picker.

As you type the price, the screen states the result -- "That works out to UGX
4,500 per crate." That derived figure is the one every margin uses, so check it
reads as you expect before saving.

Change the quantity received and the screen tells you what that will do before
you commit: "Remaining stock will change from 8 to 14 crates, keeping the 6
already sold." Correcting a count moves what is left by the same amount rather
than overwriting it, because the units already sold cannot be un-sold.

Underneath, the same cost check as on the batch details screen, stated against
the price you are typing: "Every selling price on this batch covers that cost.",
"No selling prices are attached to this batch yet.", or "One selling price is
still below that cost." with the reminder that if the cost above is right, the
prices are what need changing -- on the batch details screen, since prices are
not editable from here.
