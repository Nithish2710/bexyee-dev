import Razorpay from "razorpay";
import { supabaseServer } from "./supabase-server";
import { logServerError, logServerEvent } from "./logger";

export type ProcessRefundInput = {
  orderId: string;
  paymentId?: string;
  amountPaise: number;
  reason: string;
  restock?: boolean;
  restockItems?: Array<{ productId: string; size: string; quantity: number }>;
  adminUserId?: string;
  adminEmail?: string;
};

export type RefundResult = {
  success: boolean;
  refundId?: string;
  orderId: string;
  status: "REFUNDED" | "PARTIALLY_REFUNDED" | "FAILED";
  amountPaise: number;
  restocked: boolean;
  error?: string;
};

/**
 * Server-side refund processor with Razorpay API execution, database status update,
 * and optional physical stock restock.
 */
export async function processOrderRefund(input: ProcessRefundInput): Promise<RefundResult> {
  const db = supabaseServer;
  if (!db) {
    return {
      success: false,
      orderId: input.orderId,
      status: "FAILED",
      amountPaise: input.amountPaise,
      restocked: false,
      error: "Database unavailable.",
    };
  }

  try {
    // 1. Fetch Order and Payment
    const { data: order, error: orderErr } = await db
      .from("orders")
      .select("id, total_paise, status, payment_status, razorpay_payment_id, order_items(product_id, size, quantity)")
      .eq("id", input.orderId)
      .single();

    if (orderErr || !order) {
      throw new Error(`Order ${input.orderId} not found.`);
    }

    const paymentId = input.paymentId || order.razorpay_payment_id;
    let razorpayRefundId = `rfnd_mock_${Date.now()}`;

    // 2. Call Razorpay Refund API if keys are present
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && paymentId && !paymentId.startsWith("pay_mock")) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const refundResponse = await razorpay.payments.refund(paymentId, {
          amount: input.amountPaise,
          notes: {
            reason: input.reason,
            orderId: input.orderId,
            admin: input.adminEmail || "admin@bexyee.com",
          },
        });
        razorpayRefundId = refundResponse.id;
      } catch (rzpErr) {
        logServerError("razorpay_refund_api_error", rzpErr, { orderId: input.orderId, paymentId });
        throw new Error(rzpErr instanceof Error ? rzpErr.message : "Razorpay refund execution failed.");
      }
    }

    // 3. Determine new Order Status
    const isFullRefund = input.amountPaise >= order.total_paise;
    const newOrderStatus = isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED";

    // 4. Update Order and log status history
    await db.from("orders").update({
      status: newOrderStatus,
      payment_status: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
    }).eq("id", order.id);

    await db.from("order_status_history").insert({
      order_id: order.id,
      from_status: order.status,
      to_status: newOrderStatus,
    });

    // 5. Record in Refunds table
    await db.from("refunds").insert({
      order_id: order.id,
      razorpay_refund_id: razorpayRefundId,
      amount_paise: input.amountPaise,
      currency: "INR",
      reason: input.reason,
      status: "PROCESSED",
      restocked: input.restock ?? false,
      admin_user_id: input.adminUserId || null,
    });

    // 6. Restock physical inventory if requested
    let restocked = false;
    if (input.restock) {
      const itemsToRestock: Array<{ productId: string; size: string; quantity: number }> = input.restockItems
        ? input.restockItems
        : ((order.order_items || []) as Array<{ product_id?: string; productId?: string; size?: string; quantity?: number | string }>).map((item) => ({
            productId: item.productId || item.product_id || "",
            size: item.size || "M",
            quantity: typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity || 0), 10) || 0,
          }));

      for (const item of itemsToRestock) {
        if (item.productId && item.size && item.quantity > 0) {
          await db.rpc("adjust_inventory_v2", {
            requested_product: item.productId,
            requested_size: item.size,
            requested_delta: item.quantity,
            requested_reason: `Restocked from Refund: ${input.reason}`,
            requested_admin: input.adminUserId || null,
            requested_admin_email: input.adminEmail || "admin@bexyee.com",
          });
        }
      }
      restocked = true;
    }

    logServerEvent("order_refund_processed", {
      orderId: order.id,
      refundId: razorpayRefundId,
      amountPaise: input.amountPaise,
      orderStatus: newOrderStatus,
      restocked,
    });

    return {
      success: true,
      refundId: razorpayRefundId,
      orderId: order.id,
      status: newOrderStatus,
      amountPaise: input.amountPaise,
      restocked,
    };
  } catch (error) {
    logServerError("order_refund_failed", error, { orderId: input.orderId });
    return {
      success: false,
      orderId: input.orderId,
      status: "FAILED",
      amountPaise: input.amountPaise,
      restocked: false,
      error: error instanceof Error ? error.message : "Refund processing failed.",
    };
  }
}
