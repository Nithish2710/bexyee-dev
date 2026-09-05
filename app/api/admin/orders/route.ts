import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const input = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  trackingNumber: z.string().max(120).optional(),
});

export async function PATCH(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;

  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !supabaseServer) {
    return NextResponse.json({ error: "Invalid order update parameters." }, { status: 400 });
  }

  const { data: order } = await supabaseServer
    .from("orders")
    .select("id, status, payment_status")
    .eq("id", parsed.data.orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (
    parsed.data.status === "REFUNDED" &&
    order.payment_status !== "CAPTURED" &&
    order.payment_status !== "REFUNDED"
  ) {
    return NextResponse.json({ error: "Only captured payments can be marked as refunded." }, { status: 409 });
  }

  const { error } = await supabaseServer
    .from("orders")
    .update({
      status: parsed.data.status,
      tracking_number: parsed.data.trackingNumber ?? undefined,
      payment_status: parsed.data.status === "REFUNDED" ? "REFUNDED" : undefined,
    })
    .eq("id", order.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  // Record status transition in order history
  await supabaseServer.from("order_status_history").insert({
    order_id: order.id,
    from_status: order.status,
    to_status: parsed.data.status,
    tracking_number: parsed.data.trackingNumber,
    admin_user_id: session!.user.id,
  });

  // Record audit log entry
  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "ORDER_STATUS_CHANGED",
    requested_entity: "orders",
    requested_entity_id: order.id,
    requested_metadata: {
      from: order.status,
      to: parsed.data.status,
      tracking_number: parsed.data.trackingNumber,
    },
  });

  return NextResponse.json({ ok: true, status: parsed.data.status, trackingNumber: parsed.data.trackingNumber });
}
