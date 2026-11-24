## 19. Reports `[Mixed]`

Headed "Reports", from the menu drawer or from "View full report" on the
dashboard. Where the dashboard gives you the shop at a glance, this is the screen
for answering a question with a number. On a phone, pulling the report down
syncs it first (see the overview).

![Reports: This week, This month or a custom period, and the Sales trend](https://downloads.dolinesystems.com/manual/19-reports.png)

Note the tag: Reports opens for admins and for staff given the "Reports"
permission (section 21). Anyone else sees "You don't have permission for this.
An admin can open it for you with their pass key." and an "Ask an admin" button.

### Choosing the period

Three choices across the top: "This Week", "This Month" and "Custom Period", the
last opening a sheet to pick a start and end date. Everything below re-reads for
whichever is selected.

### Sales Trend

A chart of sales across the chosen period. Two messages replace it where it
cannot be drawn: "No sales recorded for this period.", and "Selected range is
too long to show a daily trend." on a custom range too wide for day-by-day bars
-- the figures below are still correct, only the chart is withheld.

### The figures

- **Total Sales** -- revenue in the period.
- **Total Orders** -- how many orders made it up.
- **Avg. Order Value** -- the first divided by the second.
- **Profit** -- revenue less what the stock sold cost, with the margin
  percentage under it. This is the figure that depends on buying prices being
  right; see the warnings below.
- **Units Sold** -- quantity across all orders, which is a different question
  from how much money came in.
- **Stock Turn Over** -- how briskly stock is moving.

### The two warnings on the Profit card

These are the most useful lines on the screen, because they tell you when not to
trust the number above them.

- "N batch(es) missing cost price -- margin may be overstated" -- stock was sold
  from batches whose buying price was never entered. The app cannot know what
  those cost, so it counts them as costing nothing and your margin reads better
  than it is. Fix it by editing those batches (section 13).
- "N price(s) set below cost -- every sale at them loses money" -- some prices
  are below what their stock cost. The profit figure is correct; the pricing is
  the problem.

A profit figure with the first warning under it is not a profit figure yet.
Treat it as a prompt to go and fill in the missing costs.

### Sales By Category and Top Selling Products

Sales By Category breaks revenue down by category, each line showing its share
as a percentage and its amount -- useful for deciding which shelf deserves more
space. Top Selling Products ranks individual items.

### Inventory Health

Three counts side by side -- Low Stock, Out of Stock and Overstocked -- plus
Total Value, what the stock on hand is worth, and Turn Over.

The thresholds behind those counts are fixed numbers, the same for every item in
every shop: **low stock is five or fewer** (but more than zero -- unlike the
Inventory tab's chip, this one excludes items already at zero, which are counted
as out of stock instead), and **overstocked is a hundred or more**. For a shop
selling bottled drinks, a hundred is a normal Tuesday. Read these as a rough
sweep rather than a verdict.

### Selling Below Cost

A section listing every price that is below what its stock cost, with the
explanation "These prices are lower than what the stock behind them cost. Each
sale at one of them loses the amount shown." Each line names the batch and the
price -- "Batch #12 -- priced UGX 2,000 per crate" -- with "Fix this price"
beside it, which takes you to that batch.

This is the same check as the warning on a batch's own screen (section 13),
gathered into one list. If the shop has been quietly losing money on a line for
weeks, this is where it shows up.

### Need Restocking

What is running low, with a "Reorder" shortcut per item that opens the restock
form (section 14). "Nothing running low right now." when there is nothing to do.

### Damages & Write-offs

What the shop lost in the period without selling it: breakage, expiry, spoilage,
theft and anything else recorded through an item's Damages screen (section 13).
Two figures -- **Units Lost** and **Cost Of The Loss** -- then the five costliest
write-offs, each naming the item, the batch, the quantity and the reason, and
each tapping through to that batch.

"Nothing was written off in this period." is shown when there is nothing, rather
than the card being hidden. Shrinkage you are not suffering is worth being able
to see next to the sales it would otherwise hide inside.

The loss is valued at **what the stock cost**, not what it would have sold for.
Valuing breakage at its selling price would book a profit the shop never had the
chance to make. A write-off that came off a batch with no recorded buying price
cannot be valued at all, and the card says how many -- "2 of 5 came off batches
with no recorded buying price, so they are not counted in it." -- rather than
counting them as no loss. Recording what those batches cost (section 13) is what
closes that gap.

### Performance Insights

A dark card headed "Performance Insights" with two figures: Credit Sales, the
share of sales made on credit, and Avg. Cart Size -- each with the change against
the previous period.

Credit Sales is the one to watch. A rising share means more of your takings
exist only as a promise, and the Credit chip in Orders (section 15) is where you
go to chase it.

The card carries an AI icon, but nothing on it is AI-generated: both numbers are
calculated from your own orders, the same as every other figure here. For actual
questions answered in words, Lilli is section 22.

### Sharing and saving a report

Two icons in the top bar (on a phone, the only two). Share builds a PDF of the report as currently shown
and hands it to the phone's own share sheet -- WhatsApp, email, anything
installed. Download builds the same PDF and opens the system file picker so you
can save it where you want.

Both capture the period you have selected, so set the period before you share
rather than after.
