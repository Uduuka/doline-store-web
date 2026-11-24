## 10. POS `[Both]`

The till. The POS tab, headed "New Sale", is where sales happen: find an item,
say how much of it, add it to the cart. Taking the payment is the next section.

![New Sale: the item grid, each card with its name, price, unit and stock](https://downloads.dolinesystems.com/manual/10-pos.png)

![A sale from tapping an item to the cart: pick the unit, Add to cart, open the cart](https://downloads.dolinesystems.com/manual/11-sale.gif)

### Finding an item

Three controls sit in the top bar, beside "New Sale".

- **Search items** -- opens "Search or scan an item". It matches on barcode,
  item name, description and category at once, so a partial name or a category
  word both work. The scanner is in the same place: it opens the camera to read a
  barcode. The first use asks for camera permission; if it was refused, grant it
  in the device's own app settings. A code it cannot place shows "Scan error!" --
  "No stock item matched UPC: …".
- **Filters** -- opens a sheet with two filters, and shows a count while any is
  on.
- **Cart** -- the cart icon, with a badge counting the lines in it.

The filter sheet offers **In stock only** ("Hide items with nothing left to
sell") and a **Category** chip per category actually present in this shop's
stock -- so it never offers one that would leave you with an empty grid. "Clear
all" resets both.

Filters and the search field narrow together rather than replacing each other,
so "soap" with In stock only gives the soap you can actually sell. Two filters
is all there is, deliberately: search already finds a known item fast, and these
cover the two things search cannot express -- browsing one shelf, and getting
dead lines out of the way during a rush.

Below is the item grid -- one card per item, with its name, price, the unit
that price is for and how much is in stock. An item with nothing available shows
"Out of stock" on its card. With nothing to show, the grid says "Nothing to sell
yet -- Add items in Inventory and restock them to sell them here.", or, for a
search, "No results for "…" -- Check the spelling, or scan the barcode."

### Getting to the cart

On a phone there are two ways, and both open the same thing: the cart icon in
the top bar, and the bar along the bottom that appears once something is in the
cart -- it reads like "1 item · Walk-in client · UGX 1,200", with the client's
name in place of Walk-in client once one is attached. On a tablet the cart is a permanent side pane instead and both of those
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
