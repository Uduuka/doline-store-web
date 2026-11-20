## 14. Restocking `[Both]`

Headed "Stock - <item name>". Reached from an item's Re-Stock menu, from
"Restock now!" on an item with no prices, and from the Need Restocking list in
Reports.

**Every restock creates a new batch.** It does not top up the last one. That is
deliberate: this delivery may have cost a different amount or be sold at a
different price, and keeping them apart is what lets the app tell you the margin
on each. An item with six deliveries has six batches, and sales draw down the
one they were allocated from.

Restocking needs the "Receive stock" permission (section 21). Without it, saving
asks for an admin's pass key.

### The form

- **QUANTITY** -- how much arrived.
- **UNITS** -- what it arrived in, for example kg or pcs.
- **TOTAL BUYING PRICE** -- what you paid for the whole batch; see below.
- **MANUFACTURE DATE** -- optional. A date picker headed "Select Manufacture
  Date", in YY-MM-DD.
- **EXPIRY DATE** -- optional, picked the same way. Worth filling in for
  anything perishable.
- **SELLING PRICES** -- what this batch sells for. The form here follows the
  item's pricing scheme, so a Unit-priced item asks for a price and a conversion
  factor per measure, and a Recurring one asks per period.

"Save to Stock" at the bottom commits the batch and its prices together, and
returns you to the item.

### The buying price is for the whole batch, not for one unit

The field says so in its own label -- "TOTAL BUYING PRICE (ALL 20 CRATES)" -- and
its placeholder repeats it: "What you paid for the whole batch".

Getting this wrong is the most expensive mistake available on this screen, and
it is silent. The figure is divided by the quantity to get a unit cost, and that
unit cost is what every profit, margin and below-cost warning in the app is
built on. Enter one crate's price next to a quantity of twenty and the app
believes your stock cost a twentieth of what it did -- so every margin reads
beautifully and none of them is real. If you notice afterwards, Edit Batch
(section 13) is the fix.

### Reusing the last batch's prices

Where the item has been stocked before, the pricing section offers "Add Previous
Prices" and, inside the picker, "Use Previous Price". These copy what the last
batch sold for, which is usually what you want and saves retyping a long price
list.

Copied prices are still new prices on the new batch, so changing them here does
not touch the old batch. And a price copied forward onto a batch that cost more
than the last one is exactly the case the below-cost warning is there to catch.

### If it will not save

Each field flags its own problem -- a missing quantity, missing units, a pricing
error under the price list -- with a general message at the foot for anything
broader. Nothing is written until the form is clean, so a refused save has not
half-created a batch.

### Restocking several items at once `[Android]`

From the inventory menu's Restock (section 12): pick the items, tap Next, and
the "Restock" screen lists them together, for one delivery or one order.

A switch at the top says which of two jobs this is, and they are not the same:

- **Received** -- the goods are here. Saving writes a new batch per item, as a
  single restock does, and the stock can be sold straight away.
- **Order** -- the goods are being asked for. Saving records the order and
  moves no stock at all; nothing can be sold from it until it is received.

**SUPPLIER** asks "Who delivered this?" or "Who is this order for?". When
receiving it is optional, and the supplier chosen is recorded against each item
stocked. When ordering, only suppliers that are stores on Doline are offered,
and one has to be chosen -- a supplier that is only a contact can't be ordered
from (section 17). Switching to Order clears a contact chosen while receiving.

Each item then asks for **QUANTITY**, in the units of its last batch ("How many
came" or "How many to order"). Nothing else is asked: the cost is worked out
from the last batch's unit cost times the quantity -- COST when receiving,
EXPECTED COST when ordering, or "Not recorded" when there is no earlier cost --
and the new batch carries the same selling prices as the last one. To change
prices, restock the item on its own instead.

An item that has never had a price can't be received here ("No price set yet,
so it can't be stocked here...") -- a batch with no price is stock nobody can
sell. It can still be ordered.

The button counts what will be saved -- "Stock 3 items" or "Place order for 3
items". Items left blank are skipped rather than refused: picking twelve and
filling in nine means three did not arrive. If none has a quantity, it says
"Enter a quantity for at least one item."

When ordering without a supplier on Doline, it says "Orders go to suppliers on
Doline. Add one from Suppliers first.", or "Choose the supplier on Doline this
order is going to." when there are some to choose from. A placed order is saved
on this device only for now -- it is not sent to the supplier through Doline,
so let them know.

If some items fail to stock, the ones that went in come off the list and it
says "The rest went in and are off this list; save again to retry these." --
saving again does not stock the others twice.

### Restocking by telling Lilli `[Admin only]`

An admin can also describe a delivery to Lilli -- "bought 3 cartons of Coke
500ml at 1,200 each and 10kg sugar for 1,500 from Mama Njeri" -- and confirm
the batches she works out, instead of filling in this form per product. The
batches are the same as this form's: one per product. She asks whether each
keeps its current selling prices or sells at new ones, and compares new ones
with the current price and this delivery's cost first. See section 22.
