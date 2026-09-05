import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../src/lib/admin-auth";
import { getProductExperienceData } from "../../../../src/lib/product-engine";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { ProductControlCenter } from "../../../../src/components/admin/ProductControlCenter";

export default async function AdminProductManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const initialSection = (sp.tab ? sp.tab.toUpperCase() : "PRODUCT") as any;

  // 1. Fetch live product experience data (allowing draft for admin)
  const product = await getProductExperienceData(slug, { allowDraft: true });
  if (!product) {
    notFound();
  }

  // 2. Fetch product-specific audit logs
  let auditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entity_id: string;
    performed_by: string;
    created_at: string;
    metadata?: Record<string, unknown>;
  }> = [];

  // 3. Fetch product-specific performance metrics
  let analyticsData = {
    views: 0,
    addToCart: 0,
    checkoutStarts: 0,
    purchases: 0,
    revenuePaise: 0,
    unitsSold: 0,
    refundsCount: 0,
  };

  if (supabaseServer) {
    try {
      const [auditRes, eventsRes, ordersRes] = await Promise.all([
        supabaseServer
          .from("admin_audit_logs")
          .select("*")
          .or(`entity_id.eq.${product.id},metadata->>sku.eq.${product.sku}`)
          .order("created_at", { ascending: false })
          .limit(50),
        supabaseServer
          .from("analytics_events")
          .select("event_name")
          .or(`properties->>productId.eq.${product.id},properties->>sku.eq.${product.sku}`),
        supabaseServer
          .from("order_items")
          .select("quantity, unit_price_paise, orders(status, payment_status)")
          .eq("product_id", product.id),
      ]);

      if (auditRes.data) {
        auditLogs = auditRes.data as typeof auditLogs;
      }

      if (eventsRes.data) {
        eventsRes.data.forEach((e: { event_name: string }) => {
          if (e.event_name === "page_view" || e.event_name === "product_view") analyticsData.views += 1;
          if (e.event_name === "add_to_cart") analyticsData.addToCart += 1;
          if (e.event_name === "checkout_started") analyticsData.checkoutStarts += 1;
          if (e.event_name === "purchase") analyticsData.purchases += 1;
        });
      }

      if (ordersRes.data) {
        ordersRes.data.forEach((item: any) => {
          const ord = Array.isArray(item.orders) ? item.orders[0] : item.orders;
          if (ord?.payment_status === "CAPTURED") {
            analyticsData.unitsSold += item.quantity || 1;
            analyticsData.revenuePaise += (item.unit_price_paise || 0) * (item.quantity || 1);
          }
          if (ord?.status === "REFUNDED") {
            analyticsData.refundsCount += 1;
          }
        });
      }
    } catch {
      // Graceful fallback to default empty records
    }
  }

  return (
    <ProductControlCenter
      initialProduct={JSON.parse(JSON.stringify(product))}
      auditLogs={JSON.parse(JSON.stringify(auditLogs))}
      analyticsData={JSON.parse(JSON.stringify(analyticsData))}
      initialSection={initialSection}
    />
  );
}
