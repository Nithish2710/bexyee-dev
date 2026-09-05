import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { sendMetaPurchase } from "../../../../src/lib/marketing-server";
import { enforceRateLimit } from "../../../../src/lib/rate-limit";
import { logServerEvent } from "../../../../src/lib/logger";

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "PAYMENT_VERIFY");
  if (!limit.allowed) return NextResponse.json({ error: "Too many verification attempts." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  if (!supabaseServer || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  const body = await request.json() as { orderId?: string; razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
  if (!body.orderId || !body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) return NextResponse.json({ error: "Incomplete payment response." }, { status: 400 });
  const digest = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`).digest("hex");
  const valid = digest.length === body.razorpay_signature.length && timingSafeEqual(Buffer.from(digest), Buffer.from(body.razorpay_signature));
  if (!valid) return NextResponse.json({ error: "Payment signature is invalid." }, { status: 400 });
  const { data: order } = await supabaseServer.from("orders").select("id, payment_status").eq("id", body.orderId).eq("razorpay_order_id", body.razorpay_order_id).single();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.payment_status === "CAPTURED") return NextResponse.json({ ok: true, orderId: order.id, alreadyVerified: true });
  const { data: confirmResult, error: confirmError } = await supabaseServer.rpc("confirm_order_stock_reservation", { requested_order: order.id });
  const confirmData = confirmResult as { success?: boolean; error?: string } | null;

  if (confirmError || !confirmData?.success) {
    // Zero-loss payment reconciliation: record payment captured but flag order as REQUIRES_REFUND
    await supabaseServer.from("orders").update({ razorpay_payment_id: body.razorpay_payment_id, payment_status: "CAPTURED", status: "REQUIRES_REFUND" }).eq("id", order.id);
    await supabaseServer.from("email_events").insert({ event_type: "ORDER_CONFIRMATION", order_id: order.id, payload: { orderId: order.id, paymentId: body.razorpay_payment_id, status: "REQUIRES_REFUND", reason: "STOCK_EXPIRED_DURING_CHECKOUT" } });
    return NextResponse.json({ ok: false, reconciled: true, orderId: order.id, error: "Payment was received, but inventory reservation expired. Your payment reference is recorded and an automatic refund is being processed." }, { status: 409 });
  }

  await supabaseServer.from("orders").update({ razorpay_payment_id: body.razorpay_payment_id, payment_status: "CAPTURED", status: "PAID" }).eq("id", order.id);
  const purchaseEventId = `purchase-${order.id}`;
  await supabaseServer.from("analytics_events").upsert({ event_name: "purchase", event_id: purchaseEventId, properties: { orderId: order.id }, attribution: {} }, { onConflict: "event_id" });
  const { data: paidOrder } = await supabaseServer.from("orders").select("total_paise, guest_email").eq("id", order.id).single();
  await sendMetaPurchase({ eventId: purchaseEventId, orderId: order.id, value: (paidOrder?.total_paise ?? 0) / 100, currency: "INR", email: paidOrder?.guest_email ?? undefined });
  await supabaseServer.from("email_events").insert({ event_type: "PAYMENT_CONFIRMATION", order_id: order.id, email: paidOrder?.guest_email, payload: { orderId: order.id } });
  logServerEvent("payment_verified", { orderId: order.id });
  return NextResponse.json({ ok: true, orderId: order.id });
}