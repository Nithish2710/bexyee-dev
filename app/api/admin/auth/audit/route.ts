import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "../../../../../src/lib/admin-auth";
import { supabaseServer } from "../../../../../src/lib/supabase-server";

const schema = z.object({
  eventType: z.enum([
    "FIRST_LOGIN",
    "OTP_SENT",
    "OTP_VERIFIED",
    "PASSWORD_CHANGED",
    "EMAIL_CHANGE_REQUESTED",
    "PASSWORD_RESET_REQUESTED",
    "LOGOUT",
    "SESSION_REVOKED",
  ]),
  email: z.string().email().optional(),
});

export async function GET() {
  const session = await getAdminUser();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  if (!supabaseServer) {
    return NextResponse.json({ events: [] });
  }

  const { data: events, error } = await supabaseServer
    .from("admin_security_events")
    .select("id, event_type, email, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ events: [] });
  }

  return NextResponse.json({ events: events || [] });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || !supabaseServer) {
    return NextResponse.json({ error: "Invalid security event." }, { status: 400 });
  }

  const session = await getAdminUser();
  if (!session && parsed.data.eventType !== "PASSWORD_RESET_REQUESTED") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { error } = await supabaseServer.from("admin_security_events").insert({
    admin_user_id: session?.user.id ?? null,
    email: parsed.data.email ?? session?.user.email ?? null,
    event_type: parsed.data.eventType,
  });

  return error
    ? NextResponse.json({ error: "Unable to record security event." }, { status: 500 })
    : NextResponse.json({ ok: true });
}
