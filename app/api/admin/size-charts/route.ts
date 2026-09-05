import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { DEFAULT_APPAREL_SIZE_CHART } from "../../../../src/lib/sizing";

const sizeChartSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.enum(["APPAREL_TOPS", "APPAREL_BOTTOMS", "FOOTWEAR", "ACCESSORIES"]).default("APPAREL_TOPS"),
  unit: z.enum(["INCHES", "CM"]).default("INCHES"),
  measurements: z.record(
    z.string(),
    z.object({
      length: z.number().positive(),
      chest: z.number().positive(),
      shoulder: z.number().positive(),
      sleeve: z.number().positive(),
    })
  ),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) {
    return NextResponse.json({ sizeCharts: [DEFAULT_APPAREL_SIZE_CHART] });
  }

  const { data: charts, error } = await supabaseServer
    .from("size_charts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    sizeCharts: (charts && charts.length > 0) ? charts : [DEFAULT_APPAREL_SIZE_CHART],
  });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const body = await request.json().catch(() => null);
  const parsed = sizeChartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid size chart payload.", details: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("size_charts")
    .insert({
      name: parsed.data.name,
      category: parsed.data.category,
      unit: parsed.data.unit,
      measurements: parsed.data.measurements,
      is_default: parsed.data.isDefault,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  return NextResponse.json({ sizeChart: data, ok: true });
}
