## 10. POS `[Both]`

The till. Headed "Point Of Sale", this is where sales happen: find an item, say
how much of it, add it to the cart. Taking the payment is the next section.

### Finding an item

Three controls sit in a row above the item grid.

- **Search** -- the field in the middle, "Search stock items". It matches on
  barcode, item name, description and category at once, so a partial name or a
  category word both work.
- **Scanner** -- the button on the right opens the camera to read a barcode. The
  first use asks for camera permission; if it was refused, grant it in the
  device's own app settings. A code it cannot place shows a "Scan error!"
  dialog.
- **Filters** -- the button on the left. It opens a sheet with two filters, and
  shows a count beside it while any is on.

The filter sheet offers **In stock only**, which hides items with nothing left
to sell, and a **Category** chip per category actually present in this shop's
stock -- so it never offers one that would leave you with an empty grid. "Clear
all" resets both.

Filters and the search field narrow together rather than replacing each other,
so "soap" with In stock only gives the soap you can actually sell. Two filters
is all there is, deliberately: search already finds a known item fast, and these
cover the two things search cannot express -- browsing one shelf, and getting
dead lines out of the way during a rush.

Below the row is the item grid -- one card per item, with its name and price. An
item with nothing available shows "Out of stock" in red on its card. When the
grid has nothing to show it says "No items in inventory yet.", or "No items
match ..." when a search is in play.

### Getting to the cart

On a phone there are two ways, and both open the same thing: the cart icon in
the top bar, which carries a badge counting the lines in the cart, and the
floating blue "Total Amount:" button near the bottom, which shows the running
total. On a tablet the cart is a permanent side pane instead and both of those
disappear -- nothing is missing, it is just always visible.

### Adding an item to the cart

Tapping a card opens a sheet from the bottom of the screen with the item's name
at the top, a form in the middle, and an "Add to cart" button pinned at the
bottom where it cannot be pushed off by a long form or the keyboard.

If the item has no usable stock you get "Out of stock!" and a note of why
instead of a form. Only batches that have both a price and a non-zero quantity
are offered for sale, and the prices shown come from the newest such batch.

What the form looks like depends on how the item is priced. There are five
schemes, set when the item was created:

- **Fixed** -- a flat price each. Just a quantity, with minus and plus buttons
  either side of it.
- **Unit** -- priced by a measure: per kilo, per sack, per crate. A row of price
  buttons at the top, one per unit the item is sold in; tap the one you are
  selling, then set the quantity. Switching unit re-reads the available quantity
  in that unit, so picking "per sack" caps you in sacks rather than in kilos.
- **Range** -- priced per quantity-and-spec combination: the size, colour or
  grade bands of the same item. Pick the combination, then the quantity. It
  opens on the cheapest band.
- **Recurring** -- priced per period. The quantity field is labelled with the
  period itself, so a monthly item asks for MONTHS. It opens on the cheapest
  option.
- **Menu** -- a fixed menu-style item. The sheet opens with no form at all; see
  below.

The quantity can never be pushed past what is actually available: the plus
button stops at the available stock, and minus stops at one. You can still type
a larger number into the field, and the sale is checked again on the way
through, so a line that exceeds stock is caught at checkout rather than silently
sold.

### A Menu-priced item has no add-to-cart form

The sheet opens showing the item's name and the Add to cart button and nothing
in between, so it goes into the cart at a quantity of one and that is the only
thing you can do with it. There is no way to sell two of a menu item in one line
from this sheet today.

The workaround is to add it twice, which gives you two lines of one. If a shop
prices much of its catalogue as Menu, that is worth raising rather than working
around forever.
