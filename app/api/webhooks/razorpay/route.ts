import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { enforceRateLimit } from "../../../../src/lib/rate-limit";
import { logServerError, logServerEvent } from "../../../../src/lib/logger";
import { sendTransactionalEmail } from "../../../../src/lib/email";
import { calculateOrderInvoice } from "../../../../src/lib/invoicing";
import { dispatchAlert } from "../../../../src/lib/alerts";

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "WEBHOOK");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many webhook requests." }, { status: 429 });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !supabaseServer) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    logServerError("webhook_invalid_signature", new Error("Invalid signature"), { category: "AUTH_ERROR" });
    void dispatchAlert({
      alertType: "WEBHOOK_SIGNATURE_FAILURE",
      severity: "CRITICAL",
      message: "Razorpay webhook HMAC signature verification failed.",
      metadata: { signatureReceived: signature ? "provided" : "missing", bodyLength: rawBody.length },
    });
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  type WebhookBody = {
    event?: string;
    event_id?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          method?: string;
          bank?: string;
          wallet?: string;
          vpa?: string;
          email?: string;
          contact?: string;
          error_code?: string;
          error_description?: string;
        };
      };
    };
  };

  const payload = JSON.parse(rawBody) as WebhookBody;
  const payment = payload.payload?.payment?.entity;
  const eventId = payload.event_id || request.headers.get("x-razorpay-event-id") || `evt_${payment?.id}_${payload.event}`;

  // 1. Strict Webhook Idempotency: Deduplicate by (provider, event_id)
  const { error: idempotencyError } = await supabaseServer.from("webhook_events").insert({
    provider: "RAZORPAY",
    event_id: eventId,
    event_type: payload.event || "unknown",
    payload,
  });

  if (idempotencyError && idempotencyError.code === "23505") {
    // Unique violation -> Duplicate webhook delivered; return 200 OK without re-processing
    logServerEvent("webhook_duplicate_ignored", { webhookId: eventId, event: payload.event });
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (payload.event === "payment.captured" && payment?.order_id && payment.id) {
    const { data: order } = await supabaseServer
      .from("orders")
      .select("id, status, payment_status, total_paise, shipping_paise, guest_email, address, created_at, order_items(product_name, sku, size, quantity, unit_price_paise)")
      .eq("razorpay_order_id", payment.order_id)
      .single();

    if (order) {
      // 2. Record payment in payments ledger
      await supabaseServer.from("payments").upsert({
        order_id: order.id,
        provider: "RAZORPAY",
        razorpay_order_id: payment.order_id,
        razorpay_payment_id: payment.id,
        amount_paise: payment.amount ?? order.total_paise,
        currency: payment.currency ?? "INR",
        status: "CAPTURED",
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
      }, { onConflict: "razorpay_payment_id" });

      if (order.payment_status !== "CAPTURED") {
        // 3. Atomically confirm reservation and decrement stock in one transaction
        const { data: confirmResult, error: confirmError } = await supabaseServer.rpc("confirm_order_stock_reservation", { requested_order: order.id });
        const confirmData = confirmResult as { success?: boolean } | null;

        if (confirmError || !confirmData?.success) {
          await supabaseServer.from("orders").update({ razorpay_payment_id: payment.id, payment_status: "CAPTURED", status: "REQUIRES_REFUND" }).eq("id", order.id);
          await supabaseServer.from("order_status_history").insert({ order_id: order.id, from_status: order.status, to_status: "REQUIRES_REFUND" });
          void sendTransactionalEmail({
            to: order.guest_email || payment.email || "support@bexyee.com",
            eventType: "PAYMENT_FAILURE",
            subject: "BEXYEE / Order Status Update - Refund Initiated",
            orderId: order.id,
            data: { orderId: order.id, paymentId: payment.id, reason: "Inventory expired before payment capture." },
          });
        } else {
          await supabaseServer.from("orders").update({ razorpay_payment_id: payment.id, payment_status: "CAPTURED", status: "PAID" }).eq("id", order.id);
          await supabaseServer.from("order_status_history").insert({ order_id: order.id, from_status: order.status, to_status: "PAID" });

          // 4. Generate Legal GST Invoice Record (Section 11)
          try {
            const { data: nextInvNum } = await supabaseServer.rpc("generate_next_invoice_number");
            const invoiceNumber = nextInvNum || `INV-${new Date().getFullYear()}-${order.id.slice(0, 4).toUpperCase()}`;

            const addressObj = (order.address || {}) as { name?: string; phone?: string; line1?: string; city?: string; state?: string; pincode?: string };
            type RawOrderItem = { product_name: string; sku: string; size: string; quantity: number; unit_price_paise: number };
            const items = ((order.order_items || []) as RawOrderItem[]).map((it) => ({
              productName: it.product_name,
              sku: it.sku,
              size: it.size,
              quantity: it.quantity,
              unitPricePaise: it.unit_price_paise,
            }));

            const invoiceCalc = calculateOrderInvoice({
              orderId: order.id,
              invoiceNumber,
              createdAt: order.created_at || new Date().toISOString(),
              customerName: addressObj.name || "Customer",
              customerEmail: order.guest_email || payment.email || "",
              customerPhone: addressObj.phone || payment.contact || "",
              address: addressObj,
              items,
              shippingPaise: order.shipping_paise,
            });

            await supabaseServer.from("invoices").insert({
              order_id: order.id,
              invoice_number: invoiceNumber,
              gstin: invoiceCalc.seller.gstin,
              seller_name: invoiceCalc.seller.name,
              seller_address: invoiceCalc.seller.address,
              customer_name: invoiceCalc.customer.name,
              customer_email: invoiceCalc.customer.email,
              customer_phone: invoiceCalc.customer.phone,
              customer_address: addressObj,
              customer_state: invoiceCalc.customer.state,
              is_interstate: invoiceCalc.isInterstate,
              taxable_amount_paise: invoiceCalc.totals.taxableAmountPaise,
              cgst_paise: invoiceCalc.totals.cgstPaise,
              sgst_paise: invoiceCalc.totals.sgstPaise,
              igst_paise: invoiceCalc.totals.igstPaise,
              shipping_paise: invoiceCalc.totals.shippingPaise,
              total_amount_paise: invoiceCalc.totals.totalPaise,
              hsn_code: invoiceCalc.hsnCode,
              line_items: invoiceCalc.lineItems,
            });
          } catch (invErr) {
            logServerError("invoice_generation_failed", invErr, { orderId: order.id });
          }

          void sendTransactionalEmail({
            to: order.guest_email || payment.email || "orders@bexyee.com",
            eventType: "PAYMENT_CONFIRMATION",
            subject: "BEXYEE / Order Confirmed",
            orderId: order.id,
            data: { orderId: order.id, totalPaise: order.total_paise },
          });
        }
      }
    }
  }

  if (payload.event === "payment.failed" && payment?.order_id) {
    const { data: order } = await supabaseServer.from("orders").select("id, status, payment_status").eq("razorpay_order_id", payment.order_id).single();
    if (order && order.payment_status !== "CAPTURED") {
      await supabaseServer.rpc("release_order_stock_reservation", { requested_order: order.id, release_reason: "PAYMENT_FAILED" });
      await supabaseServer.from("orders").update({ payment_status: "FAILED", status: "CANCELLED" }).eq("id", order.id);
      await supabaseServer.from("order_status_history").insert({ order_id: order.id, from_status: order.status, to_status: "CANCELLED" });
      if (payment.id) {
        await supabaseServer.from("payments").upsert({
          order_id: order.id,
          provider: "RAZORPAY",
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          amount_paise: payment.amount ?? 0,
          currency: payment.currency ?? "INR",
          status: "FAILED",
          error_code: payment.error_code,
          error_description: payment.error_description,
        }, { onConflict: "razorpay_payment_id" });
      }
    }
  }

  return NextResponse.json({ received: true });
}
