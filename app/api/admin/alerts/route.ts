import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { dispatchAlert, type AlertType, type AlertSeverity } from "../../../../src/lib/alerts";

const testAlertSchema = z.object({
  alertType: z.enum(["CHECKOUT_FAILURE_RATE", "WEBHOOK_SIGNATURE_FAILURE", "LAUNCH_DISCREPANCY", "INVENTORY_DEPLETED", "SYSTEM_ERROR"]),
  severity: z.enum(["INFO", "WARNING", "CRITICAL"]),
  message: z.string().min(3).max(500),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ alerts: [] });

  const { data: alerts, error } = await supabaseServer
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alerts: alerts || [] });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = testAlertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid alert payload.", details: parsed.error.issues }, { status: 400 });
  }

  const success = await dispatchAlert({
    alertType: parsed.data.alertType as AlertType,
    severity: parsed.data.severity as AlertSeverity,
    message: parsed.data.message,
    metadata: parsed.data.metadata,
  });

  return NextResponse.json({ ok: success });
}
