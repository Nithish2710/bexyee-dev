import { NextResponse } from "next/server";
import { getAdminUser } from "../../../../../src/lib/admin-auth";

export async function GET() {
  const session = await getAdminUser();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  return NextResponse.json({ email: session.user.email, mustChangePassword: session.admin.must_change_password, emailVerifiedAt: session.admin.email_verified_at });
}
