import { AdminShell, type AdminData } from "../../src/components/admin/AdminShell";
import { supabaseServer } from "../../src/lib/supabase-server";
import { requireAdmin } from "../../src/lib/admin-auth";

async function getAdminData(): Promise<AdminData> {
  const empty: AdminData = { orders: [], products: [], campaigns: [], customers: 0, revenuePaise: 0, eventCounts: { page_view: 0, add_to_cart: 0, checkout_started: 0, purchase: 0 } };
  if (!supabaseServer) return empty;

  const [ordersResult, productsResult, campaignsResult, customersResult, revenueResult, eventsResult] = await Promise.all([
    supabaseServer.from("orders").select("id, status, payment_status, total_paise, guest_email, created_at").order("created_at", { ascending: false }).limit(12),
    supabaseServer.from("products").select("id, name, sku, slug, status, city_name, edition, is_prebook, experience_type, front_image_url, price_paise, product_sizes(size, stock_quantity)").order("created_at", { ascending: false }),
    supabaseServer.from("campaigns").select("id, city_name, campaign_title, active, updated_at").order("updated_at", { ascending: false }),
    supabaseServer.from("customers").select("id", { count: "exact", head: true }),
    supabaseServer.from("orders").select("total_paise").eq("payment_status", "CAPTURED"),
    supabaseServer.from("analytics_events").select("event_name"),
  ]);

  const eventCounts = { ...empty.eventCounts };
  for (const event of eventsResult.data ?? []) if (event.event_name in eventCounts) eventCounts[event.event_name as keyof typeof eventCounts] += 1;
  return {
    orders: ordersResult.data ?? [],
    products: productsResult.data ?? [],
    campaigns: campaignsResult.data ?? [],
    customers: customersResult.count ?? 0,
    revenuePaise: (revenueResult.data ?? []).reduce((total, order) => total + (order.total_paise ?? 0), 0),
    eventCounts,
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const params = searchParams ? await searchParams : {};
  return <AdminShell data={await getAdminData()} initialTab={params.tab || "dashboard"} />;
}
