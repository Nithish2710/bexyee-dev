import { NextResponse } from "next/server";
import { getAdminUser } from "../../../../../src/lib/admin-auth";
import { supabaseServer } from "../../../../../src/lib/supabase-server";

export async function POST() {
  const session = await getAdminUser();
  if (!session || !supabaseServer) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { error } = await supabaseServer.rpc("complete_admin_password_setup", { requested_admin: session.user.id });
  if (error) return NextResponse.json({ error: "Unable to complete password setup." }, { status: 500 });
  await supabaseServer.auth.admin.signOut(session.user.id, "others");
  return NextResponse.json({ ok: true });
}
