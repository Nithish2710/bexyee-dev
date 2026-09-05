import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { logServerError, logServerEvent } from "../../../../src/lib/logger";
import { dispatchAlert } from "../../../../src/lib/alerts";

/**
 * Automated Launch State Engine & Scheduler (Section 13 & Manage Panel Spec)
 * Evaluates server time against starts_at / ends_at / prebook_ends_at and stock levels.
 * Automatically flips:
 *   - SCHEDULED -> LIVE
 *   - LIVE (PREBOOK) -> LIVE (BUY_NOW) (when prebook_ends_at is reached)
 *   - LIVE -> SOLD OUT (when all variant stock = 0 and not in active pre-booking)
 *   - LIVE -> ENDED (when ends_at is reached)
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 });
  }

  if (!supabaseServer) {
    return NextResponse.json({
      message: "Database not connected. Mock launch scheduler check executed.",
      flips: 0,
    });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  let flippedToLive = 0;
  let flippedToSoldOut = 0;
  let flippedToEnded = 0;
  let flippedPrebookToBuyNow = 0;

  try {
    // 1. Check SCHEDULED Launches whose starts_at has arrived
    const { data: scheduledLaunches, error: schedErr } = await supabaseServer
      .from("launches")
      .select("id, name, product_id, starts_at, launch_at, ends_at, end_at, status")
      .eq("status", "SCHEDULED");

    if (schedErr) throw schedErr;

    for (const launch of scheduledLaunches || []) {
      const startTimeStr = launch.starts_at || launch.launch_at;
      if (startTimeStr) {
        const startTime = new Date(startTimeStr).getTime();
        const diffMs = now.getTime() - startTime;

        if (diffMs >= 0) {
          // Flip SCHEDULED -> LIVE
          await supabaseServer
            .from("launches")
            .update({ status: "LIVE", updated_at: nowIso })
            .eq("id", launch.id);

          await supabaseServer
            .from("products")
            .update({ status: "ACTIVE", updated_at: nowIso })
            .eq("id", launch.product_id);

          flippedToLive += 1;
          logServerEvent("launch_flipped_to_live", { launchId: launch.id, name: launch.name });
        } else if (Math.abs(diffMs) > 5 * 60 * 1000) {
          // Warning if scheduled launch missed start window by over 5 minutes
          void dispatchAlert({
            alertType: "LAUNCH_DISCREPANCY",
            severity: "WARNING",
            message: `Scheduled launch '${launch.name}' was not processed at scheduled time ${startTimeStr}.`,
            metadata: { launchId: launch.id, scheduledTime: startTimeStr },
          });
        }
      }
    }

    // 2. Check Pre-Book Products whose prebook_ends_at has passed
    const { data: prebookProducts, error: prebookErr } = await supabaseServer
      .from("products")
      .select("id, name, is_prebook, purchase_mode, prebook_ends_at")
      .or("is_prebook.eq.true,purchase_mode.eq.PREBOOK");

    if (!prebookErr && prebookProducts) {
      for (const prod of prebookProducts) {
        if (prod.prebook_ends_at && new Date(prod.prebook_ends_at).getTime() <= now.getTime()) {
          // Automatic transition PREBOOK -> BUY_NOW
          await supabaseServer
            .from("products")
            .update({
              is_prebook: false,
              purchase_mode: "BUY_NOW",
              updated_at: nowIso,
            })
            .eq("id", prod.id);

          await supabaseServer
            .from("launches")
            .update({
              purchase_mode: "BUY_NOW",
              is_prebook: false,
              updated_at: nowIso,
            })
            .eq("product_id", prod.id);

          flippedPrebookToBuyNow += 1;
          logServerEvent("purchase_mode_transitioned_to_buy_now", {
            productId: prod.id,
            name: prod.name,
            prebookEndsAt: prod.prebook_ends_at,
          });
        }
      }
    }

    // 3. Check LIVE Launches: check if Sold Out or Ended
    const { data: liveLaunches, error: liveErr } = await supabaseServer
      .from("launches")
      .select("id, name, product_id, ends_at, end_at, status, purchase_mode, is_prebook")
      .eq("status", "LIVE");

    if (liveErr) throw liveErr;

    for (const launch of liveLaunches || []) {
      const endTimeStr = launch.ends_at || launch.end_at;
      if (endTimeStr && new Date(endTimeStr).getTime() <= now.getTime()) {
        // Flip LIVE -> ENDED
        await supabaseServer
          .from("launches")
          .update({ status: "ENDED", updated_at: nowIso })
          .eq("id", launch.id);

        flippedToEnded += 1;
        logServerEvent("launch_flipped_to_ended", { launchId: launch.id, name: launch.name });
        continue;
      }

      // Check available stock across all sizes for product
      const { data: productSizes } = await supabaseServer
        .from("product_sizes")
        .select("stock_quantity")
        .eq("product_id", launch.product_id);

      const totalPhysical = (productSizes || []).reduce(
        (acc: number, s: { stock_quantity: number }) => acc + (s.stock_quantity || 0),
        0
      );

      const isPrebooking = launch.purchase_mode === "PREBOOK" || launch.is_prebook;

      if (productSizes && productSizes.length > 0 && totalPhysical <= 0 && !isPrebooking) {
        // Flip LIVE -> SOLD OUT
        await supabaseServer
          .from("launches")
          .update({ status: "SOLD_OUT", updated_at: nowIso })
          .eq("id", launch.id);

        flippedToSoldOut += 1;
        logServerEvent("launch_flipped_to_sold_out", { launchId: launch.id, name: launch.name });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: nowIso,
      flippedToLive,
      flippedPrebookToBuyNow,
      flippedToSoldOut,
      flippedToEnded,
    });
  } catch (error) {
    logServerError("launch_scheduler_job_error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Launch scheduler execution failed." },
      { status: 500 }
    );
  }
}
