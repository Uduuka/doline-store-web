## 11. Cart and checkout `[Both]`

Where a cart becomes an order. It opens as a panel over the POS screen on a
phone, and sits permanently beside it on a tablet.

![The cart: one line with its quantity buttons, the Total, Amount received, Change, Save as draft and Complete sale](https://downloads.dolinesystems.com/manual/11-cart.png)

The header reads "Cart", with how many lines it holds ("1 line"), until you
attach a client, at which point it shows that client's name -- the quickest check
that you have the right person on a credit sale. With nothing in it, it says
"Cart is empty".

### The lines

Each line shows the item's name, any specs it was bought with, and its quantity
with minus and plus buttons. The bin icon on a line removes it, after a "Delete
Item?" confirmation naming the item.

### Cart Actions

![Cart Actions: Add Client and Clear cart](https://downloads.dolinesystems.com/manual/11-cart-actions.png)

The menu button in the cart's own header opens Cart Actions:

- **Add Client / Change Client** -- attaches a customer to the sale. The form
  lists the shop's saved clients to pick from, with "Create new client" for one
  you do not have yet: Name, Phone and Address, then Save Client. The new client
  is saved to the shop, not just to this sale.
- **Remove Client** -- only appears once a client is attached. Returns the sale
  to a walk-in.
- **Clear cart** -- empties it, after a "Clear cart?" confirmation that warns
  the action cannot be undone.

When the shop has no clients on file yet, the picker says "No saved clients
yet."

### Taking the payment

Below the lines: Total in blue, then an "Amount received" field for you to
type what the customer handed over, and a "Change:" line that updates as you
type. Change is simply received minus total, so it reads negative while the
amount is short -- which is a useful signal in itself.

When the shop's tip rules (section 20) give the cart a tip, a Subtotal and a
"Tip" line (with its percentage, for a percentage rule) appear above the Total,
and the Total includes the tip. The tip is recorded apart from the goods, so it
never counts in sales or profit:

- Paid the whole Total: the whole tip is recorded.
- Paid at least the goods but less than the Total: whatever was paid over the
  goods is the tip, and the sale is still paid.
- Paid less than the goods: the sale goes on credit as usual, with no tip.

Two buttons finish the sale:

- **Save as draft** -- parks the cart as an unfinished order. Nothing is sold:
  no stock moves, no money is recorded, and the order is not sent to the cloud,
  because there is nothing to report yet. Use it for an order being assembled,
  or a customer who has gone to fetch cash.
- **Complete sale** -- rings the sale up. Stock is taken from the batches the
  lines came from, the order is written, and it is queued for the cloud.

### The questions it asks

Finishing a sale puts up one of three dialogs, depending on what you entered.
Each is a genuine fork, so read which one you got.

- "Are you sure you want to save this order as a draft?" -- from Save as draft.
  Save or Cancel.
- "Was this order paid or offered at credit?" -- from Complete sale with the
  Amount received box left empty. Paid records it as settled in full; Credit
  records the whole amount as owed.
- "The amount received is less than the order amount. Do you want to offer the
  balance as a credit?" -- from Complete sale with a short payment. Yes records
  the shortfall as credit; No cancels so you can correct the amount.
- "The cart is empty." -- nothing to sell.
- "... belongs to another store. Take it out of the cart to finish this sale."
  -- the cart holds an item from a different shop on this device. Nothing has
  been sold or taken off any shelf; remove the named item and try again.

Selling on credit, including the short-payment case above, needs the "Sell on
credit" permission (section 21). Without it, an admin is asked to allow the sale
with their pass key.

### Credit, and why the client matters

A credit sale records the unpaid part as a balance on the order. That balance is
what the Orders list shows in red, and what you later clear by recording
payments against the order (section 15). All of it depends on a client being
attached -- **a credit sale to a walk-in customer leaves a balance with nobody's
name on it.** Attach the client before you complete the sale, not after.

The balance lives on the *order*, and the client's screen adds those balances
up: Clients shows what each client owes, and a client's own screen shows "Owes"
with how many orders are on credit (section 16).

The "is this fully paid?" test is made against the price actually charged, not
the list price, so a discounted line does not make the app think a correct
payment fell short.

### After a sale

The cart empties and the order appears in the Orders tab immediately --
including with no internet, since it was written to the device first. It reaches
the cloud, and so any other till in the shop, whenever the connection comes
back. A draft never goes up at all until it is completed.
