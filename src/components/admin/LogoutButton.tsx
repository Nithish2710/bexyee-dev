"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventType: "LOGOUT" }) });
    await getSupabaseBrowser().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return <button className="admin-logout" onClick={logout}>LOG OUT ↗</button>;
}
