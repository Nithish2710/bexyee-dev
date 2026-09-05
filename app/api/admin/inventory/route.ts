import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

interface ReservationRow {
  product_id: string;
  size: string;
  quantity: number;
}

interface ProductSizeRow {
  product_id: string;
  size: string;
  stock_quantity: number;
  low_stock_threshold?: number;
}

interface ProductInventoryRow {
  id: string;
  name: string;
  sku: string;
  slug: string;
  city_name?: string;
  edition?: string;
  status: string;
  product_sizes?: ProductSizeRow[];
}

const singleInput = z.object({
  productId: z.string().uuid(),
  size: z.enum(["S", "M", "L", "XL"]),
  delta: z.number().int().refine((value) => value !== 0),
  reason: z.string().min(1).max(200),
  lowStockThreshold: z.number().int().nonnegative().optional(),
});

const bulkInput = z.object({
  adjustments: z.array(
    z.object({
      productId: z.string().uuid(),
      size: z.enum(["S", "M", "L", "XL"]),
      delta: z.number().int().refine((value) => value !== 0),
      reason: z.string().min(1).max(200).optional(),
    })
  ).min(1),
  defaultReason: z.string().min(1).max(200).optional().default("Bulk stock adjustment"),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  // 1. Fetch products & sizes
  let productQuery = supabaseServer
    .from("products")
    .select("id, name, sku, slug, city_name, edition, status, product_sizes(*)");
  if (productId) productQuery = productQuery.eq("id", productId);

  const [productsRes, adjustmentsRes] = await Promise.all([
    productQuery,
    supabaseServer
      .from("inventory_adjustments")
      .select("*, products(name, sku)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (productsRes.error) {
    return NextResponse.json({ error: productsRes.error.message }, { status: 500 });
  }

  // 2. Fetch active unexpired reservations to calculate live reserved stock
  const nowIso = new Date().toISOString();
  const { data: activeReservations } = await supabaseServer
    .from("reservations")
    .select("product_id, size, quantity")
    .eq("status", "ACTIVE")
    .gt("expires_at", nowIso);

  // Group active reservations by `${product_id}-${size}`
  const reservedMap = new Map<string, number>();
  ((activeReservations as ReservationRow[]) || []).forEach((r) => {
    const key = `${r.product_id}-${r.size}`;
    reservedMap.set(key, (reservedMap.get(key) || 0) + (r.quantity || 0));
  });

  // 3. Build live matrix
  const matrix: Array<{
    productId: string;
    productName: string;
    productSku: string;
    cityName: string;
    size: string;
    physicalStock: number;
    reservedStock: number;
    availableStock: number;
    threshold: number;
    status: "ACTIVE" | "LOW" | "SOLD OUT";
  }> = [];

  ((productsRes.data as ProductInventoryRow[]) || []).forEach((prod) => {
    (prod.product_sizes || []).forEach((s) => {
      const physical = s.stock_quantity || 0;
      const reserved = reservedMap.get(`${prod.id}-${s.size}`) || 0;
      const available = Math.max(0, physical - reserved);
      const threshold = s.low_stock_threshold ?? 5;

      let status: "ACTIVE" | "LOW" | "SOLD OUT" = "ACTIVE";
      if (physical === 0 || available === 0) {
        status = "SOLD OUT";
      } else if (available <= threshold) {
        status = "LOW";
      }

      matrix.push({
        productId: prod.id,
        productName: prod.name,
        productSku: prod.sku,
        cityName: prod.city_name || "BENGALURU",
        size: s.size,
        physicalStock: physical,
        reservedStock: reserved,
        availableStock: available,
        threshold,
        status,
      });
    });
  });

  return NextResponse.json({
    matrix,
    recentAdjustments: adjustmentsRes.data || [],
  });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const rawBody = await request.json();

  // Check if bulk adjustment
  if (Array.isArray(rawBody.adjustments)) {
    const parsedBulk = bulkInput.safeParse(rawBody);
    if (!parsedBulk.success) {
      return NextResponse.json({ error: "Invalid bulk adjustments payload.", details: parsedBulk.error.issues }, { status: 400 });
    }

    const { adjustments, defaultReason } = parsedBulk.data;
    const results: Array<{ productId: string; size: string; stock: number }> = [];

    for (const item of adjustments) {
      const reason = item.reason || defaultReason;
      const { data: stock, error } = await supabaseServer.rpc("adjust_inventory", {
        requested_product: item.productId,
        requested_size: item.size,
        requested_delta: item.delta,
        requested_reason: reason,
        requested_admin: session!.user.id,
      });

      if (error) {
        return NextResponse.json({
          error: `Adjustment failed for product ${item.productId} size ${item.size}: ${error.message}`,
        }, { status: 409 });
      }

      results.push({ productId: item.productId, size: item.size, stock });
    }

    return NextResponse.json({ ok: true, results, count: results.length });
  }

  // Single adjustment
  const parsed = singleInput.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inventory adjustment.", details: parsed.error.issues }, { status: 400 });
  }

  const { data: stock, error } = await supabaseServer.rpc("adjust_inventory", {
    requested_product: parsed.data.productId,
    requested_size: parsed.data.size,
    requested_delta: parsed.data.delta,
    requested_reason: parsed.data.reason,
    requested_admin: session!.user.id,
  });

  if (error) {
    return NextResponse.json({
      error: error.message.includes("NEGATIVE_STOCK") ? "Inventory cannot become negative." : error.message,
    }, { status: 409 });
  }

  if (parsed.data.lowStockThreshold !== undefined) {
    await supabaseServer
      .from("inventory_settings")
      .upsert(
        { product_id: parsed.data.productId, size: parsed.data.size, low_stock_threshold: parsed.data.lowStockThreshold },
        { onConflict: "product_id,size" }
      );
  }

  return NextResponse.json({ ok: true, stock });
}
