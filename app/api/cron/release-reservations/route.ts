import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { logServerError, logServerEvent } from "../../../../src/lib/logger";

/**
 * Automated Reservation Expiration & Stock Release Job (Section 5)
 * Runs periodically (e.g. every 1-2 minutes) to release expired cart/checkout reservations
 * and return inventory to the available pool.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET configured, verify authorization header
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 });
  }

  if (!supabaseServer) {
    return NextResponse.json({ message: "Database not connected. Mock release executed.", releasedCount: 0 });
  }

  const nowIso = new Date().toISOString();

  try {
    // 1. Fetch expired active reservations
    const { data: expiredReservations, error: fetchErr } = await supabaseServer
      .from("stock_reservations")
      .select("id, order_id, product_id, size, quantity")
      .eq("status", "ACTIVE")
      .lt("expires_at", nowIso);

    if (fetchErr) {
      throw fetchErr;
    }

    const count = expiredReservations?.length || 0;

    if (count > 0) {
      // 2. Mark reservations as EXPIRED
      const expiredIds = expiredReservations.map((r: { id: string }) => r.id);
      await supabaseServer
        .from("stock_reservations")
        .update({ status: "EXPIRED", updated_at: nowIso })
        .in("id", expiredIds);

      // 3. Mark abandoned pending orders as EXPIRED
      const orderIds = Array.from(new Set(expiredReservations.map((r: { order_id: string }) => r.order_id)));
      for (const orderId of orderIds) {
        await supabaseServer
          .from("orders")
          .update({ status: "CANCELLED" })
          .eq("id", orderId)
          .eq("status", "PENDING");
      }

      logServerEvent("reservations_auto_released", { count, orderIdsCount: orderIds.length });
    }

    return NextResponse.json({
      success: true,
      releasedCount: count,
      timestamp: nowIso,
    });
  } catch (error) {
    logServerError("reservation_release_job_error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reservation release job failed." },
      { status: 500 }
    );
  }
}
