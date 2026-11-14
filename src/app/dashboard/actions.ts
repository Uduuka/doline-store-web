"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdminPassKey, passKeyError, type PassKeyCheck } from "@/lib/admin-pass-key";
import { STORE_COOKIE, requireStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/server";

/**
 * Opens one of the account's stores. Only a store this account keeps can be chosen: any other id
 * sends the person back to their list.
 */
export async function openStore(form: FormData) {
  const id = String(form.get("store_id") ?? "");
  // Checked with a fresh query, not getContext: that is cached for the whole request, so calling
  // it here would hand the overview this redirect renders the store that was open BEFORE this
  // choice (none, on a new browser) and send the person straight back to their store list.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const { data: mine } = await supabase.from("stores").select("id").eq("id", id).eq("keeper_id", user.id).is("deleted_at", null).maybeSingle();
  if (!mine) redirect("/dashboard");
  (await cookies()).set(STORE_COOKIE, id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect("/dashboard/overview");
}

// ---------------------------------------------------------------- Admin pass key

/**
 * Checks the admin pass key typed into the web's prompt before the write it guards is sent, so a
 * wrong key is answered in the prompt. The write's own action checks it again: this one only
 * spares the form a round trip.
 */
export async function verifyAdminPassKey(passKey: string): Promise<PassKeyCheck> {
  return checkAdminPassKey(passKey);
}

// ---------------------------------------------------------------- Sell

export type SaleLine = { productId: string; pricingId: string; quantity: number };
export type SaleResult = { ok: true; orderId: string; total: number; currency: string } | { ok: false; error: string };

/**
 * Records a counter sale exactly as the apps do:
 *  1. place_order (channel 'pos', fulfilment COMPLETED) with each line's batch allocations —
 *     the cloud prices every line itself from product_pricings and moves stock;
 *  2. record_order_payment for the total, unless the sale is on credit.
 *
 * Batches are allocated first-expiring-first, then oldest-first. A line asking for more than the
 * batches hold puts the shortfall on its last batch; the store's negative-stock policy decides
 * whether the cloud accepts that.
 */
export async function recordSale(input: {
  lines: SaleLine[];
  method: "cash" | "mobile_money" | "credit";
  clientId?: string | null;
  adminPassKey: string;
}): Promise<SaleResult> {
  const pass = await checkAdminPassKey(input.adminPassKey);
  if (!pass.ok) return { ok: false, error: pass.error };
  const { supabase, store, currency } = await requireStore();
  const lines = input.lines.filter((l) => l.quantity > 0);
  if (!lines.length) return { ok: false, error: "Add at least one item." };
  if (input.method === "credit" && !input.clientId) return { ok: false, error: "Choose the client this sale is on credit to." };

  const { data: batches, error: bErr } = await supabase
    .from("product_batches")
    .select("id, product_id, available, expiry_date, created_at")
    .in("product_id", [...new Set(lines.map((l) => l.productId))])
    .is("deleted_at", null)
    .order("expiry_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (bErr) return { ok: false, error: "Couldn't read stock. Check your connection and try again." };

  const items = [];
  for (const line of lines) {
    const own = (batches ?? []).filter((b) => b.product_id === line.productId);
    if (!own.length) return { ok: false, error: "One of the items has no stock batches yet. Receive stock for it first." };
    let left = line.quantity;
    const alloc: { batch_id: string; quantity: number }[] = [];
    for (const b of own) {
      if (left <= 0) break;
      const take = Math.min(left, Math.max(0, Number(b.available)));
      if (take > 0) {
        alloc.push({ batch_id: b.id, quantity: take });
        left -= take;
      }
    }
    if (left > 0) {
      const last = own[own.length - 1]!;
      const existing = alloc.find((a) => a.batch_id === last.id);
      if (existing) existing.quantity += left;
      else alloc.push({ batch_id: last.id, quantity: left });
    }
    items.push({ id: randomUUID(), product_id: line.productId, pricing_id: line.pricingId, quantity: line.quantity, units: "units", batches: alloc });
  }

  const orderId = randomUUID();
  const { error: oErr } = await supabase.rpc("place_order", {
    p_order: {
      id: orderId,
      store_id: store.id,
      channel: "pos",
      currency,
      fulfilment_status: "COMPLETED",
      client_id: input.clientId || null,
      items,
    },
  });
  if (oErr) {
    if (/insufficient stock/i.test(oErr.message)) return { ok: false, error: "There isn't enough stock for that sale, and this store doesn't allow selling below zero." };
    return { ok: false, error: "The sale couldn't be recorded. Please try again." };
  }

  const { data: placed } = await supabase.from("orders").select("amount").eq("id", orderId).single();
  const total = Number(placed?.amount ?? 0);

  if (input.method !== "credit" && total > 0) {
    await supabase.rpc("record_order_payment", { p_order_id: orderId, p_amount: total, p_method: input.method, p_payment_id: randomUUID() });
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true, orderId, total, currency };
}

// ---------------------------------------------------------------- Clients

export type FormState = { error?: string; message?: string } | undefined;

export async function addClient(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store, user } = await requireStore();
  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  if (!name) return { error: "Enter the client's name." };
  const { data: contact, error } = await supabase
    .from("store_contacts")
    .insert({ keeper_id: user.id, name, phone: phone || null })
    .select("id")
    .single();
  if (error || !contact) return { error: "The client couldn't be saved." };
  const { error: cErr } = await supabase.from("clients").insert({ store_id: store.id, contact_id: contact.id });
  if (cErr) return { error: "The client couldn't be saved." };
  revalidatePath("/dashboard/clients");
  return { message: `${name} added.` };
}

/**
 * Takes a payment from a client and settles their oldest credit sales first, one
 * record_order_payment per order, until the amount runs out.
 */
export async function recordClientPayment(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const clientId = String(form.get("client_id") ?? "");
  let amount = Number(String(form.get("amount") ?? "").replace(/[, ]/g, ""));
  const method = String(form.get("method") ?? "cash");
  if (!clientId || !(amount > 0)) return { error: "Enter an amount greater than zero." };

  const { data: open } = await supabase
    .from("orders_view")
    .select("id, balance, created_at")
    .eq("store_id", store.id)
    .eq("client_id", clientId)
    .eq("payment_status", "CREDIT")
    .gt("balance", 0)
    .order("created_at", { ascending: true });

  if (!open?.length) return { error: "This client has no unpaid sales." };
  for (const o of open) {
    if (amount <= 0) break;
    const pay = Math.min(amount, Number(o.balance));
    const { error } = await supabase.rpc("record_order_payment", { p_order_id: o.id!, p_amount: pay, p_method: method, p_payment_id: randomUUID() });
    if (error) return { error: "Part of the payment couldn't be recorded. Check the client's balance and try again." };
    amount -= pay;
  }
  revalidatePath("/dashboard", "layout");
  return { message: amount > 0 ? "Payment recorded. It was more than the client owed; the extra wasn't recorded." : "Payment recorded." };
}

// ---------------------------------------------------------------- Expenses

export async function addExpense(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store, currency } = await requireStore();
  const description = String(form.get("description") ?? "").trim();
  const category = String(form.get("category") ?? "OTHERS");
  const amount = Number(String(form.get("amount") ?? "").replace(/[, ]/g, ""));
  if (!description) return { error: "Say what the expense was for." };
  if (!(amount > 0)) return { error: "Enter an amount greater than zero." };
  const { error } = await supabase.from("expenses").insert({ store_id: store.id, description, category, amount, currency });
  if (error) return { error: "The expense couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Expense added." };
}

// ---------------------------------------------------------------- Settings

export async function updateStore(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Your store needs a name." };
  const address = String(form.get("address") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const { error } = await supabase.from("stores").update({ name, address: address || null, description: description || null }).eq("id", store.id);
  if (error) return { error: "Your changes couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Saved." };
}

export async function setPublished(form: FormData) {
  if (await passKeyError(form)) return;
  const { supabase, store } = await requireStore();
  const publish = String(form.get("publish")) === "true";
  await supabase.rpc("set_store_published", { p_store_id: store.id, p_published: publish });
  revalidatePath("/dashboard/settings");
}

// ---------------------------------------------------------------- Inventory

/**
 * Adds an item the way the apps do: a FIXED-price product, its pricing row and its opening
 * batch. Plan limits on items are enforced by the cloud once pricing is switched on.
 */
export async function addItem(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store, currency } = await requireStore();
  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim() || "General";
  const price = Number(String(form.get("price") ?? "").replace(/[, ]/g, ""));
  const qty = Number(String(form.get("quantity") ?? "0").replace(/[, ]/g, "")) || 0;
  const cost = Number(String(form.get("cost") ?? "").replace(/[, ]/g, ""));
  const lowAt = Number(String(form.get("low_stock_threshold") ?? "5")) || 0;
  if (!name) return { error: "Give the item a name." };
  if (!(price > 0)) return { error: "Enter a selling price." };

  const { data: product, error } = await supabase
    .from("products")
    .insert({ store_id: store.id, name, category_label: category, pricing_scheme: "FIXED", low_stock_threshold: lowAt })
    .select("id")
    .single();
  if (error || !product) return { error: /limit/i.test(error?.message ?? "") ? "Your plan's item limit is reached. Upgrade to add more." : "The item couldn't be saved." };

  const { error: pErr } = await supabase.from("product_pricings").insert({ product_id: product.id, amount: price, currency });
  if (pErr) return { error: "The item was saved without a price. Set one in the app." };
  if (qty > 0) {
    await supabase.from("product_batches").insert({
      product_id: product.id,
      batch_number: "1",
      quantity: qty,
      available: qty,
      units: "units",
      // buying_price is what the whole batch cost; the form asks for the cost of one.
      buying_price: cost > 0 ? cost * qty : null,
      currency,
    });
  }
  revalidatePath("/dashboard", "layout");
  return { message: `${name} added.` };
}

/** Records a delivery of an item as a new batch, numbered after its last one. */
export async function receiveStock(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store, currency } = await requireStore();
  const productId = String(form.get("product_id") ?? "");
  const qty = Number(String(form.get("quantity") ?? "").replace(/[, ]/g, ""));
  const cost = Number(String(form.get("cost") ?? "").replace(/[, ]/g, ""));
  const expiry = String(form.get("expiry_date") ?? "").trim();
  if (!productId) return { error: "Choose the item." };
  if (!(qty > 0)) return { error: "Enter how many arrived." };
  const { data: own } = await supabase.from("products").select("id").eq("id", productId).eq("store_id", store.id).is("deleted_at", null).maybeSingle();
  if (!own) return { error: "That item isn't in this store." };

  const { count } = await supabase.from("product_batches").select("id", { count: "exact", head: true }).eq("product_id", productId);
  const { error } = await supabase.from("product_batches").insert({
    product_id: productId,
    batch_number: String((count ?? 0) + 1),
    quantity: qty,
    available: qty,
    units: "units",
    // buying_price is what the whole batch cost; the form asks for the cost of one.
    buying_price: cost > 0 ? cost * qty : null,
    currency,
    expiry_date: expiry || null,
  });
  if (error) return { error: "The delivery couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Stock received." };
}

// ---------------------------------------------------------------- Orders

/** The order, if it belongs to the store that's open: every order action checks this first. */
async function ownOrder(orderId: string) {
  const ctx = await requireStore();
  if (!orderId) return { ctx, order: null };
  const { data: order } = await ctx.supabase
    .from("orders")
    .select("id, store_id, amount, discount, delivery_fee, service_fee, received, fulfilment_status, payment_status")
    .eq("id", orderId)
    .eq("store_id", ctx.store.id)
    .is("deleted_at", null)
    .maybeSingle();
  return { ctx, order };
}

/** Takes a payment against one order (record_order_payment works out PAID / CREDIT itself). */
export async function recordOrderPayment(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { ctx, order } = await ownOrder(String(form.get("order_id") ?? ""));
  if (!order) return { error: "That order isn't in this store." };
  const amount = Number(String(form.get("amount") ?? "").replace(/[, ]/g, ""));
  const method = String(form.get("method") ?? "cash");
  if (!(amount > 0)) return { error: "Enter an amount greater than zero." };
  const due = Number(order.amount) - Number(order.discount) + Number(order.delivery_fee) + Number(order.service_fee) - Number(order.received);
  if (amount > due + 0.005) return { error: `That's more than the ${Math.round(due).toLocaleString("en-US")} still owed.` };
  const { error } = await ctx.supabase.rpc("record_order_payment", { p_order_id: order.id, p_amount: amount, p_method: method, p_payment_id: randomUUID() });
  if (error) return { error: "The payment couldn't be recorded. Please try again." };
  revalidatePath("/dashboard", "layout");
  return { message: "Payment recorded." };
}

const MOVES: Record<string, string[]> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["READY", "COMPLETED", "CANCELLED"],
  READY: ["SHIPPING", "COMPLETED", "CANCELLED"],
  SHIPPING: ["COMPLETED"],
};

/**
 * Moves an order along (set_order_fulfilment). Leaving PENDING commits stock: lines without
 * batches take the oldest ones. Cancelling puts back what the order took. Returns go through
 * returnOrderItems, which restocks, rather than a bare move to RETURNED.
 */
export async function setOrderStatus(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { ctx, order } = await ownOrder(String(form.get("order_id") ?? ""));
  if (!order) return { error: "That order isn't in this store." };
  const target = String(form.get("target") ?? "");
  if (!MOVES[order.fulfilment_status]?.includes(target)) return { error: "The order can't move to that stage from where it is now." };
  const { error } = await ctx.supabase.rpc("set_order_fulfilment", { p_order_id: order.id, p_target: target });
  if (error) return { error: "The order couldn't be updated. Please try again." };
  revalidatePath("/dashboard", "layout");
  return { message: target === "CANCELLED" ? "Order cancelled. Its stock is back on the shelf." : "Order updated." };
}

/** Puts a sale on a client's account, or takes it off (set_order_client). */
export async function setOrderClient(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { ctx, order } = await ownOrder(String(form.get("order_id") ?? ""));
  if (!order) return { error: "That order isn't in this store." };
  const clientId = String(form.get("client_id") ?? "") || null;
  const { error } = await ctx.supabase.rpc("set_order_client", { p_order_id: order.id, p_client_id: clientId as string });
  if (error) return { error: "The client couldn't be changed." };
  revalidatePath("/dashboard", "layout");
  return { message: clientId ? "Client saved." : "Client removed." };
}

/**
 * Takes items back (record_order_return): each returned quantity goes back to the batches the
 * line came from, and an order with everything returned becomes RETURNED. Fields are named
 * `return_<order item id>`.
 */
export async function returnOrderItems(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { ctx, order } = await ownOrder(String(form.get("order_id") ?? ""));
  if (!order) return { error: "That order isn't in this store." };
  if (order.fulfilment_status !== "COMPLETED") return { error: "Only a completed order can take returns." };
  const returns = [...form.entries()]
    .filter(([k]) => k.startsWith("return_"))
    .map(([k, v]) => ({ id: randomUUID(), order_item_id: k.slice(7), quantity: Number(String(v).replace(/[, ]/g, "")) || 0 }))
    .filter((r) => r.quantity > 0);
  if (!returns.length) return { error: "Enter how many of an item came back." };
  const { error } = await ctx.supabase.rpc("record_order_return", { p_returns: returns });
  if (error) return { error: /exceeds/.test(error.message) ? "That's more than is left on the line to return." : "The return couldn't be recorded." };
  revalidatePath("/dashboard", "layout");
  return { message: "Return recorded. The items are back in stock." };
}

// ---------------------------------------------------------------- Item details

/** Edits an item's name, category, description and low-stock level. Only an item of the open store. */
export async function updateItem(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const id = String(form.get("product_id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const lowAt = Number(String(form.get("low_stock_threshold") ?? "").replace(/[, ]/g, ""));
  if (!name) return { error: "The item needs a name." };
  if (!(lowAt >= 0)) return { error: "Enter a low-stock level of zero or more." };

  const { data, error } = await supabase
    .from("products")
    .update({ name, category_label: category || "General", description: description || null, low_stock_threshold: lowAt })
    .eq("id", id)
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .select("id");
  if (error) return { error: "Your changes couldn't be saved." };
  if (!data?.length) return { error: "That item isn't in this store." };
  revalidatePath("/dashboard", "layout");
  return { message: "Saved." };
}

/**
 * Edits a batch: its number, cost, dates and a stock count. The cost is asked per item and
 * stored for the whole batch (buying_price), like every other batch. Only a batch of an item in
 * the open store. The change syncs to the store's devices (product_batches broadcasts updates).
 */
export async function updateBatch(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const id = String(form.get("batch_id") ?? "");
  const { data: batch } = await supabase
    .from("product_batches")
    .select("id, quantity, products!inner(store_id)")
    .eq("id", id)
    .eq("products.store_id", store.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!batch) return { error: "That batch isn't in this store." };

  const num = (k: string) => String(form.get(k) ?? "").replace(/[, ]/g, "");
  const batchNumber = String(form.get("batch_number") ?? "").trim();
  const costRaw = num("cost");
  const cost = Number(costRaw);
  const available = Number(num("available"));
  const date = (k: string) => String(form.get(k) ?? "").trim() || null;
  if (!batchNumber) return { error: "The batch needs a number or name." };
  if (costRaw && !(cost >= 0)) return { error: "Enter a cost of zero or more, or leave it empty." };
  if (!(available >= 0)) return { error: "Stock left can't be below zero." };

  const { error } = await supabase
    .from("product_batches")
    .update({
      batch_number: batchNumber,
      buying_price: costRaw ? cost * Number(batch.quantity) : null,
      available,
      expiry_date: date("expiry_date"),
      manufacture_date: date("manufacture_date"),
    })
    .eq("id", batch.id);
  if (error) return { error: "Your changes couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Batch saved." };
}

// ---------------------------------------------------------------- Client details

/**
 * Edits a client's contact: name, phone, email and address. The contact is the shop owner's
 * (store_contacts), so a client kept in more than one store shows the change in each.
 */
export async function updateClient(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const id = String(form.get("client_id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const field = (k: string) => String(form.get(k) ?? "").trim() || null;
  if (!name) return { error: "The client needs a name." };
  const email = field("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "That email address doesn't look right." };

  const { data: client } = await supabase.from("clients").select("contact_id").eq("id", id).eq("store_id", store.id).is("deleted_at", null).maybeSingle();
  if (!client) return { error: "That client isn't in this store." };
  const { error } = await supabase.from("store_contacts").update({ name, phone: field("phone"), email, address: field("address") }).eq("id", client.contact_id);
  if (error) return { error: "Your changes couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Saved." };
}

// ---------------------------------------------------------------- Supplier details

/** Edits a supplier's contact: name, phone, email and address. Only a supplier of the open store. */
export async function updateSupplier(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const id = String(form.get("supplier_id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const field = (k: string) => String(form.get(k) ?? "").trim() || null;
  if (!name) return { error: "The supplier needs a name." };
  const email = field("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "That email address doesn't look right." };

  const { data: supplier } = await supabase.from("suppliers").select("contact_id").eq("id", id).eq("store_id", store.id).is("deleted_at", null).maybeSingle();
  if (!supplier) return { error: "That supplier isn't in this store." };
  const { error } = await supabase.from("store_contacts").update({ name, phone: field("phone"), email, address: field("address") }).eq("id", supplier.contact_id);
  if (error) return { error: "Your changes couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return { message: "Saved." };
}

// ---------------------------------------------------------------- Notes

/** Adds a note to the open store. A title or some text is enough. */
export async function addNote(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!title && !body) return { error: "Write something first." };
  const { error } = await supabase.from("notes").insert({ store_id: store.id, title, body });
  if (error) return { error: "The note couldn't be saved." };
  revalidatePath("/dashboard/notes");
  return { message: "Note saved." };
}

/** Edits a note of the open store. */
export async function updateNote(_: FormState, form: FormData): Promise<FormState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const id = String(form.get("note_id") ?? "");
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!title && !body) return { error: "A note can't be empty. Delete it instead." };
  const { data, error } = await supabase
    .from("notes")
    .update({ title, body })
    .eq("id", id)
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .select("id");
  if (error) return { error: "Your changes couldn't be saved." };
  if (!data?.length) return { error: "That note isn't in this store." };
  revalidatePath("/dashboard/notes");
  return { message: "Saved." };
}

/** Deletes a note the way the apps do (deleted_at), so the deletion syncs to every device. */
export async function deleteNote(form: FormData) {
  if (await passKeyError(form)) return;
  const { supabase, store } = await requireStore();
  const id = String(form.get("note_id") ?? "");
  await supabase.from("notes").update({ deleted_at: new Date().toISOString() }).eq("id", id).eq("store_id", store.id);
  revalidatePath("/dashboard/notes");
  redirect("/dashboard/notes");
}

// ---------------------------------------------------------------- Supplier orders

export type SupplierOrderState = { error?: string; message?: string; total?: string } | undefined;

/**
 * Places a restock order in a linked supplier's Doline Store shop (place_marketplace_order, as
 * the apps do). The supplier's shop prices every line itself, checks its stock and adds its fees;
 * this account is the buyer. Lines come as JSON: [{ pricing_id, quantity }].
 */
export async function placeSupplierOrder(_: SupplierOrderState, form: FormData): Promise<SupplierOrderState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("supplier_store_id")
    .eq("id", String(form.get("supplier_id") ?? ""))
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!supplier?.supplier_store_id) return { error: "Orders can only be placed with a supplier on Doline Store." };

  let items: { pricing_id: string; quantity: number }[] = [];
  try {
    items = (JSON.parse(String(form.get("items") ?? "[]")) as { pricing_id: string; quantity: number }[]).filter((i) => i.pricing_id && Number(i.quantity) > 0);
  } catch {
    items = [];
  }
  if (!items.length) return { error: "Add at least one item to the order." };

  const fulfilment = String(form.get("fulfilment") ?? "pickup");
  const method = String(form.get("payment_method") ?? "cash");
  const addressId = String(form.get("address_id") ?? "");
  if (fulfilment === "delivery" && !addressId) return { error: "Choose the address to deliver to." };

  const { data, error } = await supabase.rpc("place_marketplace_order", {
    p_order: {
      id: randomUUID(),
      store_id: supplier.supplier_store_id,
      fulfilment,
      payment_method: method,
      momo_network: method === "momo" ? String(form.get("momo_network") ?? "MTN") : undefined,
      address_id: fulfilment === "delivery" ? addressId : undefined,
      message: String(form.get("message") ?? "").trim() || undefined,
      items,
    },
  });
  if (error) {
    const m = error.message;
    if (/not enough stock/i.test(m)) return { error: "The supplier doesn't have enough stock for one of those items. Lower the quantity and try again." };
    if (/isn't taking orders/i.test(m)) return { error: "This supplier's shop isn't taking orders right now." };
    if (/delivery unavailable/i.test(m)) return { error: "The supplier can't deliver to that address. Choose pickup or another address." };
    if (/one currency/i.test(m)) return { error: "All the items in one order must be in the same currency." };
    return { error: "The order couldn't be placed. Please try again." };
  }
  const r = data as { total?: number; currency?: string } | null;
  revalidatePath("/dashboard/suppliers");
  return { message: "Order placed. The supplier has been sent it.", total: r?.total != null ? `${r.currency ?? ""} ${Math.round(Number(r.total)).toLocaleString("en-US")}`.trim() : undefined };
}
