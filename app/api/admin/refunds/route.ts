import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { processOrderRefund } from "../../../../src/lib/refunds";

const refundSchema = z.object({
  orderId: z.string().uuid(),
  amountPaise: z.number().int().positive(),
  reason: z.string().min(2).max(500),
  restock: z.boolean().default(false),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  let query = supabaseServer
    .from("refunds")
    .select("*, orders(id, guest_email, total_paise, status, address)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (orderId) {
    query = query.eq("order_id", orderId);
  }

  const { data: refunds, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ refunds: refunds || [] });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const body = await request.json().catch(() => null);
  const parsed = refundSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid refund payload.", details: parsed.error.issues }, { status: 400 });
  }

  const result = await processOrderRefund({
    orderId: parsed.data.orderId,
    amountPaise: parsed.data.amountPaise,
    reason: parsed.data.reason,
    restock: parsed.data.restock,
    adminUserId: session?.user.id,
    adminEmail: session?.user.email,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Refund processing failed." }, { status: 400 });
  }

  return NextResponse.json(result);
}
