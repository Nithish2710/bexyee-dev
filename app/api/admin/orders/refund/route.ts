import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { requireAdminApi } from "../../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../../src/lib/supabase-server";
import { enforceRateLimit } from "../../../../../src/lib/rate-limit";
import { logServerError, logServerEvent } from "../../../../../src/lib/logger";
import { sendTransactionalEmail } from "../../../../../src/lib/email";

const refundInput = z.object({
  orderId: z.string().uuid(),
  amountPaise: z.number().int().positive(),
  reason: z.string().min(3).max(500),
  shouldRestock: z.boolean().default(true)
});

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "ADMIN_API");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many admin requests." }, { status: 429 });
  }

  const { response, session } = await requireAdminApi();
  if (response) return response;

  const parsed = refundInput.safeParse(await request.json());
  if (!parsed.success || !supabaseServer) {
    return NextResponse.json({ error: "Invalid refund payload." }, { status: 400 });
  }

  const { orderId, amountPaise, reason, shouldRestock } = parsed.data;

  try {
    // 1. Fetch order details and captured payment ID
    const { data: order, error: orderFetchError } = await supabaseServer
      .from("orders")
      .select("id, status, payment_status, total_paise, razorpay_payment_id, guest_email")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (!order.razorpay_payment_id || (order.payment_status !== "CAPTURED" && order.payment_status !== "PARTIALLY_REFUNDED")) {
      return NextResponse.json({ error: "Only captured orders can be refunded." }, { status: 409 });
    }

    let razorpayRefundId = `rfnd_${crypto.randomUUID().slice(0, 14)}`;

    // 2. Call Razorpay Refund API if credentials are configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        type RazorpayRefundResponse = { id: string };
        const rzpRefund = await razorpay.payments.refund(order.razorpay_payment_id, {
          amount: amountPaise,
          notes: { reason, orderId, admin: session!.user.email ?? "" }
        }) as RazorpayRefundResponse;
        if (rzpRefund?.id) {
          razorpayRefundId = rzpRefund.id;
        }
      } catch (rzpErr) {
        logServerError("razorpay_refund_api_failed", rzpErr, {
          category: "PROVIDER_ERROR",
          orderId,
          paymentId: order.razorpay_payment_id
        });
        return NextResponse.json({ error: rzpErr instanceof Error ? rzpErr.message : "Razorpay refund failed." }, { status: 502 });
      }
    }

    // 3. Atomically record refund in database ledger and update order status
    const { data: refundResult, error: refundDbError } = await supabaseServer.rpc("process_order_refund", {
      requested_order: orderId,
      requested_amount_paise: amountPaise,
      requested_reason: reason,
      requested_refund_id: razorpayRefundId,
      requested_admin: session!.user.id,
      should_restock: shouldRestock
    });

    const refundData = refundResult as { success?: boolean; error?: string; total_refunded?: number } | null;

    if (refundDbError || !refundData?.success) {
      return NextResponse.json({ error: refundData?.error ?? "Database refund reconciliation failed." }, { status: 409 });
    }

    // 4. Send non-blocking transactional refund confirmation email
    if (order.guest_email) {
      void sendTransactionalEmail({
        to: order.guest_email,
        eventType: "REFUND",
        subject: "BEXYEE / Refund Processed",
        orderId: order.id,
        data: {
          orderId: order.id,
          amountPaise,
          reason,
          refundId: razorpayRefundId
        }
      });
    }

    logServerEvent("order_refunded", {
      orderId,
      amountPaise,
      refundId: razorpayRefundId,
      admin: session!.user.email
    });

    return NextResponse.json({
      ok: true,
      refundId: razorpayRefundId,
      amountPaise,
      totalRefunded: refundData.total_refunded
    });
  } catch (error) {
    logServerError("admin_refund_exception", error, { category: "INTERNAL_ERROR", orderId });
    return NextResponse.json({ error: "Internal refund processing error." }, { status: 500 });
  }
}
