import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { checkoutSchema, calculateTotals } from "../../../src/lib/commerce";
import { supabaseServer } from "../../../src/lib/supabase-server";
import { ConfiguredShippingProvider } from "../../../src/lib/shipping";
import { enforceRateLimit } from "../../../src/lib/rate-limit";
import { logServerError, logServerEvent } from "../../../src/lib/logger";

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "CHECKOUT_CREATE");
  if (!limit.allowed) return NextResponse.json({ error: "Too many checkout attempts." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!supabaseServer || !keyId || !keySecret) return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });
  const db = supabaseServer;
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "A valid cart is required." }, { status: 400 });
  try {
    const guestToken = (await cookies()).get("bexyee_guest_token")?.value;
    const { data: cart } = await db.from("carts").select("id").eq("id", parsed.data.cartId).eq("guest_token", guestToken ?? "").single();
    if (!cart) return NextResponse.json({ error: "Cart not found." }, { status: 404 });
    const { data: cartItems } = await db.from("cart_items").select("product_id, size, quantity").eq("cart_id", cart.id);
    if (!cartItems?.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    const lines = await Promise.all(cartItems.map(async (item) => {
      const { data: product } = await db.from("products").select("id, name, sku, price_paise, product_sizes(size, stock_quantity)").eq("id", item.product_id).eq("status", "ACTIVE").single();
      const available = product?.product_sizes?.find((entry: { size: string; stock_quantity: number }) => entry.size === item.size)?.stock_quantity ?? 0;
      if (!product || available < item.quantity) throw new Error("A selected size is out of stock.");
      return { ...item, product };
    }));
    const subtotal = calculateTotals(lines.map(({ product, quantity }) => ({ unitPricePaise: product.price_paise, quantity })));
    const address = parsed.data.address as { name: string; phone: string; line1: string; city: string; state: string; pincode: string } | undefined;
    if (!address?.pincode || !(await new ConfiguredShippingProvider().checkServiceability(address.pincode))) return NextResponse.json({ error: "This delivery pincode is not serviceable." }, { status: 422 });
    const shippingPaise = address ? await new ConfiguredShippingProvider().quote(address, subtotal.subtotalPaise) : 0;
    const totals = calculateTotals(lines.map(({ product, quantity }) => ({ unitPricePaise: product.price_paise, quantity })), shippingPaise);
    const { data: order, error: orderError } = await db.from("orders").insert({
      cart_id: cart.id,
      guest_token: guestToken,
      guest_email: parsed.data.guestEmail,
      subtotal_paise: totals.subtotalPaise,
      discount_paise: totals.discountPaise,
      shipping_paise: totals.shippingPaise,
      total_paise: totals.totalPaise,
      address: parsed.data.address,
      attribution: parsed.data.attribution
    }).select("id").single();
    if (orderError || !order) throw new Error("Unable to create order.");
    const { error: itemsError } = await db.from("order_items").insert(lines.map(({ product, size, quantity }) => ({ order_id: order.id, product_id: product.id, product_name: product.name, sku: product.sku, size, quantity, unit_price_paise: product.price_paise })));
    if (itemsError) throw itemsError;

    // Atomically reserve inventory with 15-minute TTL
    const { data: reservation, error: reserveError } = await db.rpc("reserve_order_stock", { requested_order: order.id, ttl_seconds: 900 });
    const reserveData = reservation as { success?: boolean; error?: string; expires_at?: string } | null;
    if (reserveError || !reserveData?.success) {
      await db.from("orders").update({ status: "CANCELLED" }).eq("id", order.id);
      return NextResponse.json({ error: "Selected size is currently out of stock or reserved by another customer." }, { status: 409 });
    }

    const razorpayOrder = await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.create({ amount: totals.totalPaise, currency: "INR", receipt: order.id });
    await db.from("orders").update({ razorpay_order_id: razorpayOrder.id }).eq("id", order.id);
    logServerEvent("payment_order_created", { orderId: order.id, amountPaise: totals.totalPaise, expiresAt: reserveData.expires_at });
    return NextResponse.json({ orderId: order.id, razorpayOrder, keyId, totals, expiresAt: reserveData.expires_at });
  } catch (error) {
    logServerError("payment_order_failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create checkout." }, { status: 409 });
  }
}