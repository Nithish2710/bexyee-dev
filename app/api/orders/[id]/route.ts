import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { enforceRateLimit } from "../../../../src/lib/rate-limit";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limit = enforceRateLimit(request, "TRACKING_LOOKUP");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many tracking attempts." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const { id } = await params;
  if (!supabaseServer) {
    return NextResponse.json({ error: "Order tracking is not configured." }, { status: 503 });
  }

  // UUID format check to prevent unnecessary DB load
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) {
    return NextResponse.json({ error: "Invalid order identifier format." }, { status: 400 });
  }

  const { data: order } = await supabaseServer
    .from("orders")
    .select("id, status, payment_status, tracking_number, created_at, order_status_history(to_status, tracking_number, created_at)")
    .eq("id", id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    paymentStatus: order.payment_status,
    trackingNumber: order.tracking_number,
    createdAt: order.created_at,
    history: order.order_status_history
  });
}
