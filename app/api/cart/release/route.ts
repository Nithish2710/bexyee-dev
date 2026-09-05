import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { enforceRateLimit } from "../../../../src/lib/rate-limit";

const releaseSchema = z.object({ orderId: z.string().uuid() });

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "CART_MUTATION");
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  if (!supabaseServer) return NextResponse.json({ error: "Storage not configured." }, { status: 503 });

  const parsed = releaseSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });

  const guestToken = (await cookies()).get("bexyee_guest_token")?.value;
  const { data: order } = await supabaseServer.from("orders").select("id, payment_status, guest_token, customer_id").eq("id", parsed.data.orderId).single();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // Caller authorization: must match order's guest token or authenticated customer
  const isAuthorized = Boolean(guestToken && order.guest_token === guestToken);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized to release this reservation." }, { status: 403 });
  }

  if (order.payment_status === "CAPTURED") {
    return NextResponse.json({ error: "Captured orders cannot be released." }, { status: 409 });
  }

  await supabaseServer.rpc("release_order_stock_reservation", { requested_order: order.id, release_reason: "USER_CANCELLED" });
  await supabaseServer.from("orders").update({ status: "CANCELLED" }).eq("id", order.id);

  return NextResponse.json({ ok: true, released: true, orderId: order.id });
}
