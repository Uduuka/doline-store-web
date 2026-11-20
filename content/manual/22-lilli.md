## 22. Lilli `[Both]`

The fifth bottom tab, and also an entry in the menu drawer. A chat screen that
opens with "Hi, I'm Lilli! Ask me about your store's sales, inventory, or
orders, or how to do something in the app."

Type a question and send it; "Clear conversation" starts again. Lilli answers in
plain language, and the two things she is good at are looking something up in
your own data and explaining how to do something in the app.

### What she can look up

- **Inventory** -- finding items and what is in stock. "Do we have any 20-litre
  jerrycans left?"
- **Low stock** -- what is running out, including items sold below zero.
- **Why stock doesn't add up** -- for one item: its batches, its recent sales with
  what each batch held before and after, its write-offs and counts, and where
  stock moved between two sales with nothing recorded. "Why does Coke 500ml
  show 3 when we have 5?"
- **Expiry** -- batches expiring soon (the next 30 days unless you say), and
  batches with no expiry or manufacture date recorded.
- **Orders** -- searching orders. "Which orders still have a balance?"
- **Credit** -- who owes the shop what, by client. "Who owes me money?"
- **Clients** -- finding a customer's record.
- **Suppliers** -- finding a supplier, and supplier orders by status.
- **Reports** -- the Reports screen's figures for this week, this month or dates
  you name: sales, write-offs, stock counts, and prices that sell at a loss or
  have no price. `[Mixed]`
- **Sales summaries and profit on an item** -- how the shop or one item has done.
  `[Mixed]`
- **Expenses** -- what was spent over a period. `[Mixed]`
- **Activity** -- who did what, and which admin allowed it, over a period.
  `[Admin only]`
- **Backup** -- whether this device's changes have reached the cloud, what is
  still waiting and why, and when it backs up. "Has today's sale synced?"
- **DolineMarket** -- whether the store is on DolineMarket, its listings against
  the plan, and online orders waiting to be marked ready.
- **Your plan** -- the plan, when a trial ends or renews, how much of each limit
  is used, and what the next plan allows. "How many more items can I add?"
  `[Admin only]`
- **Devices** -- every phone and computer on the account, when each was last
  seen and whether it has backed up. "Has the second till backed up today?"
  `[Admin only]`
- **Restocking** -- stock a delivery by describing it; see below. `[Admin only]`
- **How to do something** -- navigation and procedure, answered from this
  manual.

Sales summaries, item profit, report profit figures, pricing problems and
expenses follow the "See costs and profit" permission (section 21), the same rule
that hides cost figures on every screen; write-offs, counts and supplier orders
leave their cost values out for anyone without it. Someone without it who asks is
told it needs permission to see costs and profit, which an admin can give them in
staff settings, rather than given a number.

Restocking through Lilli stays with admins, whatever a staff member's
permissions. Staff allowed to receive stock restock from Inventory instead
(section 14).

### Restocking by describing a delivery `[Admin only]`

An admin can tell Lilli what was bought and have it go into stock, without
opening the restock form for each product. For example:

> Bought 3 cartons of Coke 500ml at 1,200 each and 10kg sugar for 1,500 from
> Mama Njeri.

Lilli matches each thing to a product in Inventory and works out one new batch
per product: how many came, what they are counted in, and what they cost. Say
the price either per unit ("at 1,200 each") or for the lot ("for 1,500"); the
batch records the total for the lot either way, as the restock form does. Leave
the price out and she uses what one unit cost on the product's last batch. A
supplier, a batch number, and manufacture or expiry dates (yyyy-mm-dd) can be
given too.

**She asks about selling prices.** For each product she lists what it sells
at now and asks whether this batch keeps those prices or sells at new ones.
Say "same prices" to keep them, or describe new ones -- "sell it at 1,400",
"1,400 a carton and 250 a bottle" -- and she compares them before going on:

- with **what this delivery cost**, flagging a price that would sell at a loss
  and saying what each price makes per unit;
- with **the current price**, saying how far it is up or down.

Talk it through until you agree; she only puts the card up once every product
has its prices settled. New prices can replace the current ones or be added
alongside them ("keep the bottle price and add 1,400 a carton"). A price you
give that the product already sells at is reused, not copied. The rules follow
the item's pricing scheme, as on the restock form: a fixed-price item sells at
one price, so it is the current one or a new one, not both; a unit price says
what it is per, and how many stock units that is when it is not one; a
recurring price says its period. Range-priced items can keep their prices
through Lilli, but new range prices are set from the restock form.

**Nothing is stocked until you tap Confirm.** Once every line is worked out, a
card appears in the chat, headed "Restock 2 items?", listing each batch, its
cost and what it sells at, with **Confirm** and **Cancel**. Confirm writes the batches; Cancel drops
them. Typing "yes" does not stock anything -- only the button does. If you
change your mind about a line, say so and Lilli puts up a new card in place of
the old one.

She asks rather than guesses when:

- **A name matches more than one product** ("Coke" when there is Coke 500ml and
  Coke 300ml) -- she lists the matches and asks which.
- **No product matches.** A product has to exist in Inventory before it can be
  restocked; add it there first.
- **The units differ from the product's stock.** If Coke 500ml is counted in
  cartons and you say 72 pcs, she asks how many cartons that is. Stock adds up
  across batches, so mixing units would miscount it.
- **The supplier is not recorded**, or the name matches more than one supplier.
  Add them from Suppliers (section 17), or restock without one.
- **The product has no selling price yet** -- she asks what this batch will sell
  at. Menu-priced items are restocked from the item itself (section 14).

Each confirmed batch is exactly what the restock form would have written: it
carries the selling prices you agreed (kept ones are linked as they are, new
ones are saved and synced like prices added on the form), a batch received
while stock is below zero first covers what was oversold, the supplier is
recorded against the product, and the batch syncs and counts in Reports like
any other.

Only the admin on shift can do this. A staff member who asks is told it
requires admin access, and the Confirm button checks again when it is tapped --
a card left open when the till locks cannot be confirmed by whoever signs in
next unless they are the admin.

### What she cannot do

- **She cannot act for you**, apart from the restock above. No placing an
  order, editing an item, adding a client, changing a setting, signing a device
  out, publishing the store or backing up. She looks
  things up and explains how you would do it yourself.
- **She cannot tell you a pass key.** Not yours, not anybody's, under any
  phrasing. Pass keys are stored as one-way hashes; nothing in the app can read
  one back. An admin resetting it (section 21) is the only route.
- **She needs internet.** Lilli is the one part of Doline that does not work
  offline, because the answering happens on a server. With no connection you get
  "Sorry, I couldn't reach the server just now. Please try again in a moment."
  Everything else -- selling, stock, orders -- carries on as normal.
- **She needs you signed in.** "You need to be signed in to chat with Lilli."
- **She has a monthly allowance.** Each plan includes a number of Lilli messages a
  month, counted across the whole account: 5 on Free, 100 on Duka, 1,000 on
  Business and 3,000 on Enterprise (section 24). Once plans start, a message past
  the month's allowance gets the plan's message ("Lilli's count starts again on
  the 1st.") instead of an answer. Settings > Plan shows how many are used.

Lilli answers as whoever is on shift, with that person's access, so the answers
a staff member gets are not the answers an admin gets. Ask her the question you
would otherwise go hunting through four screens for -- she is at her best as a
shortcut, not as an authority.
