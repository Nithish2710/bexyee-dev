import { NextResponse } from "next/server";
import { getAdminUser, isOwnerRole } from "./admin-auth";

export async function requireAdminApi(options: { requireOwner?: boolean } = {}) {
  const session = await getAdminUser();
  if (!session) {
    return { response: NextResponse.json({ error: "Admin authentication required." }, { status: 401 }), session: null };
  }
  if (session.admin.must_change_password) {
    return { response: NextResponse.json({ error: "Password change required before accessing API." }, { status: 403 }), session: null };
  }
  if (options.requireOwner && !isOwnerRole(session.admin.role)) {
    return { response: NextResponse.json({ error: "Owner authorization required for this action." }, { status: 403 }), session: null };
  }
  return { response: null, session };
}
