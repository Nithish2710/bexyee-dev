import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase-server";

export type AdminRole = "OWNER" | "DEVELOPER" | "ADMIN";

export type AdminUserProfile = {
  user_id: string;
  role: AdminRole;
  active: boolean;
  must_change_password: boolean;
  email_verified_at?: string | null;
};

export async function getAuthClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server components cannot always write cookies. */ } },
    },
  });
}

export async function getAdminUser(): Promise<{ user: { id: string; email?: string }; admin: AdminUserProfile } | null> {
  const authClient = await getAuthClient();
  if (!authClient) return null;
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || !supabaseServer) return null;
  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("user_id, role, active, must_change_password, email_verified_at")
    .eq("user_id", user.id)
    .in("role", ["OWNER", "DEVELOPER", "ADMIN"])
    .eq("active", true)
    .maybeSingle();

  if (!admin) return null;

  return {
    user: { id: user.id, email: user.email },
    admin: {
      user_id: admin.user_id,
      role: (admin.role as AdminRole) || "OWNER",
      active: admin.active,
      must_change_password: admin.must_change_password,
      email_verified_at: admin.email_verified_at,
    },
  };
}

export async function requireAdmin(options: { allowPasswordSetup?: boolean; requireOwner?: boolean } = {}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  if (admin.admin.must_change_password && !options.allowPasswordSetup) redirect("/admin/change-password");
  if (options.requireOwner && admin.admin.role !== "OWNER" && admin.admin.role !== "ADMIN") {
    redirect("/admin");
  }
  return admin;
}

/**
 * Checks if current user has Owner permissions (payments, secrets, settings)
 */
export function isOwnerRole(role: AdminRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}
