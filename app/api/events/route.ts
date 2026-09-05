import { NextResponse } from "next/server";
import { eventSchema } from "../../../src/lib/commerce";
import { supabaseServer } from "../../../src/lib/supabase-server";

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  if (!supabaseServer) return NextResponse.json({ accepted: true, stored: false });
  const { error } = await supabaseServer.from("analytics_events").insert({ event_name: parsed.data.eventName, event_id: parsed.data.eventId, session_id: parsed.data.sessionId, product_id: parsed.data.productId, properties: parsed.data.properties, attribution: parsed.data.attribution });
  if (error && error.code !== "23505") return NextResponse.json({ error: "Unable to store event." }, { status: 500 });
  return NextResponse.json({ accepted: true, stored: !error });
}
