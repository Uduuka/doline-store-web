## 15. Orders `[Both]`

The Orders tab and an order's own screen. Everything the shop has sold, plus the
drafts it has not, plus the money it is still owed.

Orders rung up at the counter and orders placed through the Doline marketplace
both land here, in the same list. On a phone, pulling the list down syncs it (see the overview).

### The list

![Orders: grouped by day, each card with the client, order number and time, its status and whether it is paid](https://downloads.dolinesystems.com/manual/15-orders.png)

Orders are grouped by date with a heading per day, newest first, each row
showing the order number, its progress as a coloured chip, and the time it was
placed. Underneath, the amount and one of three things on the right:

- **PAID or CREDIT** -- the order's payment status, where no credit balance is
  recorded against it.
- **CLEARED** -- in green: it was sold on credit and the balance has since been
  paid off in full.
- **Balance: ...** -- in red, with the amount: money still owed on this order.
  This is the one to look for.

Tapping a row opens the order.

### Finding an order

The search icon in the top bar opens "Search orders", which matches the order
number, the client's name, or the name of any item on the order -- so "who bought
the blue paint?" is a searchable question. The calendar icon beside it filters to
a single date.

Then a row of chips: All, Paid and Credit, followed by one chip per progress
state -- PENDING, READY, SHIPPING, COMPLETED, RETURNED, DRAFT and CANCELLED.
Search, date and chip all apply together.

**Credit is the chip that earns its keep.** It is the shop's debtors list: every
order with money outstanding, in one place. For one customer's total, the
Clients list and the client's own screen show what they owe (section 16).

An empty result reads "No ... orders found." naming the filter, or "No orders
match ..." when searching.

### An order's own screen

![A marketplace order: its status, Ask Lilli about the order, Items and Payment, and the Message the buyer button in the top bar](https://downloads.dolinesystems.com/manual/15-order-marketplace.png)

Headed with the order number. It lists the items with their quantities -- in the
order's own units, so a Unit-priced line reads in kilos and a Recurring one in
months -- and anything already returned shown in red beside them. Each line is
priced *as of the sale*, not as of today, so a later price change does not
rewrite history.

An **Ask Lilli about order #…** row near the top opens a chat with Lilli about
this order, with suggestions such as "Is order #0003 paid?" (section 22).

Under the items, the Payment part shows the order amount and what has been
received. On a credit order a further line follows: "Credit balance" with the
outstanding amount in red, or "Cleared" in green once it is settled.

### Marketplace orders

An order a buyer places on DolineMarket arrives in the same list. It reads
"Marketplace" where a counter sale shows the client, and starts as **Not paid**:
the buyer has paid nothing and nothing has been handed over yet.

- **No stock moves when it arrives.** The order takes its stock, oldest batch
  first, when you tap **Mark as Ready**. That is the moment to check the shelf.
- **It counts in sales and profit only once it is ready.** An order that is
  never readied -- cancelled, or left waiting -- never appears in Reports.
- **Fees.** Under the items, "Delivery fee" and "Service fee" show what
  DolineMarket added to the buyer's total. The service fee (0.5% of the order)
  goes to Doline, not to the shop, so it is left out of your revenue. Counter
  sales never carry it.

A shipping order is finished with **Deliver order** once the customer has it.

**Message the buyer.** A marketplace order has a chat icon, "Message the
buyer", in the top bar. It opens this order's conversation with the buyer in
the Inbox (section 25), made the first time it is opened. It shows for the owner
and for staff with the "Message clients" permission (section 21), on a plan with
messaging. When it cannot open the conversation it says why: "This order's
messages were cleared a day after it was settled.", "This order has no
DolineMarket buyer to message.", "Messaging isn't on this store's plan.", "You
need the Message clients permission.", or "You're offline. Try again when this
till is online."

### The order menu

The menu in the top bar changes with the order's state -- an action that makes no
sense for this order is not shown rather than shown and refused. Under Actions:

- **Complete Order** -- on a pending, draft or ready order: rings it up. It asks
  the same payment questions as the till does; see below.
- **Mark as Ready** -- on a pending order: ready for the customer to collect.
- **Deliver order** -- on a shipping order: mark it delivered.
- **Make payment** -- on an order with a credit balance: record money received
  against it.
- **Payments** -- on a credit order: the history of what has been paid so far.
- **View client** -- opens the attached client. Only when there is one.
- **Add client / Change client** -- attaches or swaps the customer, useful for a
  credit sale completed as a walk-in by mistake.
- **Return order** -- on a shipping, completed or returned order that still has
  un-returned items. Pick the lines and quantities coming back.
- **Cancel order** -- on a pending, draft or ready order. Confirms by number.
- **Delete order** -- on anything not completed or shipping. Confirms by number.
  Deletion is final: cancelling keeps the record, deleting removes it.

Some of these need a permission (section 21): Make payment and completing on
credit need "Sell on credit"; Return order and Cancel order need "Returns and
cancellations"; changing the client of a finished order needs "Edit orders".
Without one, an admin is asked to allow it with their pass key. At the bottom of
the order, **History** shows who did what to it.

### Completing an order from here

Completing a pending or draft order asks the same two questions the till does,
for the same reasons: "There is no amount received. Do you want to completed
this order as a credit?" when nothing was entered, and "The amount received is
less than the order amount. Do you want to offer the balance (...) as a credit?"
when it falls short -- this one naming the exact shortfall.

### Recording a payment against credit

Make payment opens a sheet headed with the current "Balance:", one field for
"Amount received", and a Save button. Part payments are the point: pay what the
customer brought today and the balance drops by that much, until it reaches zero
and the order shows as cleared.

- "The amount received is required." -- Save was pressed with the field empty.
- "You can not pay more than the credit balance!" -- Doline will not take an
  overpayment against an order. Record what clears the balance.

Payments in the same menu lists what has been paid, newest first, or says "No
payments recorded yet." That list is the answer to "has she paid anything off?",
which is a question worth being able to settle at the counter.

### Returns

Return order lets you take back part of an order rather than all of it: tap the
lines coming back and adjust the quantity on each. A line already returned in
full drops out, because each line can be returned separately and over several
visits -- so returning two of five today leaves three returnable later.

A partial return leaves the order as it was -- completed, say -- with the
returned lines shown in red. The order reads RETURNED only once everything on it
has come back. What the customer still owes on a credit order counts any
delivery fee as well as the items.
