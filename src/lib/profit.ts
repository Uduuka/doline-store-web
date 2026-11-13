/** A batch as embedded in a sale line's batch allocation: what the whole batch cost, and its size. */
export type BatchCost = { buying_price: number | string | null; quantity: number | string | null } | null;

/**
 * What `qty` units taken from a batch cost. `buying_price` is the price paid for the whole batch
 * (40 cartons for 380,000 is 9,500 each), so the unit cost is that over the batch's quantity.
 * A batch with no buying price, or no size, counts as costing nothing.
 */
export function batchCost(batch: BatchCost, qty: number | string): number {
  const total = batch?.buying_price;
  const size = Number(batch?.quantity ?? 0);
  if (total == null || !(size > 0)) return 0;
  return (Number(total) / size) * Number(qty);
}
