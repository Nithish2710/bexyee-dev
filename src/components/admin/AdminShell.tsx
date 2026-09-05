"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { AdminHome } from "./AdminHome";
import { SimpleProductsCenter } from "./SimpleProductsCenter";
import { SimpleInventoryCenter } from "./SimpleInventoryCenter";
import { SimpleAssetsCenter } from "./SimpleAssetsCenter";
import { SimpleLaunchesCenter } from "./SimpleLaunchesCenter";
import { SimpleAnalyticsCenter } from "./SimpleAnalyticsCenter";
import { MarketingCommandCenter } from "./MarketingCommandCenter";
import { OrdersCenter } from "./OrdersCenter";
import { SizeChartsCenter } from "./SizeChartsCenter";
import { RefundsCenter } from "./RefundsCenter";
import type { AdminRole } from "../../lib/admin-auth";

export type AdminData = {
  orders: Array<{ id: string; status: string; payment_status: string; total_paise: number; guest_email: string | null; created_at: string }>;
  products: Array<{
    id: string;
    name: string;
    sku: string;
    slug?: string;
    status: string;
    city_name?: string;
    edition?: string;
    is_prebook?: boolean;
    experience_type?: string;
    front_image_url?: string;
    price_paise: number;
    product_sizes: Array<{ size: string; stock_quantity: number }>;
  }>;
  campaigns: Array<{ id: string; city_name: string; campaign_title: string; active: boolean; updated_at: string }>;
  customers: number;
  revenuePaise: number;
  eventCounts: { page_view: number; add_to_cart: number; checkout_started: number; purchase: number };
  adminRole?: AdminRole;
};

type NavItem = { label: string; id: string; ownerOnly?: boolean };

const navigation: NavItem[] = [
  { label: "Dashboard", id: "dashboard" },
  { label: "Products", id: "products" },
  { label: "Inventory", id: "inventory" },
  { label: "Orders", id: "orders" },
  { label: "Customers", id: "customers" },
  { label: "Assets", id: "assets" },
  { label: "Launches", id: "launches" },
  { label: "Size Charts", id: "size_charts" },
  { label: "Refunds", id: "refunds" },
  { label: "Analytics", id: "analytics" },
  { label: "Marketing", id: "marketing" },
  { label: "Settings", id: "settings", ownerOnly: true },
];

export function AdminShell({ data, initialTab = "dashboard" }: { data: AdminData; initialTab?: string }) {
  const router = useRouter();
  const [active, setActive] = useState(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRole: AdminRole = data.adminRole || "OWNER";
  const isOwner = currentRole === "OWNER" || currentRole === "ADMIN";

  const handleManageProduct = (slugOrId: string) => {
    router.push(`/admin/products/${slugOrId}`);
  };

  return (
    <main className="admin-app">
      {/* Mobile Topbar */}
      <div
        className="admin-mobile-topbar"
        style={{
          display: "none",
          width: "100%",
          background: "#000000",
          borderBottom: "1px solid #E5E5E5",
          padding: "14px 20px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="admin-brand" style={{ fontSize: "18px" }}>BEXYEE<span>/</span>OPS</div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          style={{
            background: "#1A1A1A",
            border: "1px solid #333333",
            color: "#FFFFFF",
            padding: "8px 14px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-space-mono)",
          }}
        >
          {mobileMenuOpen ? "✕ CLOSE" : "☰ MENU"}
        </button>
      </div>

      {/* Sidebar Navigation (Black Contrast Section) */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="admin-brand">BEXYEE<span>/</span>OPS</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px 0 18px", padding: "0 4px" }}>
          <span style={{ fontSize: "9px", background: isOwner ? "#FFFFFF" : "#1A1A1A", color: isOwner ? "#000000" : "#FFFFFF", border: "1px solid #333333", padding: "2px 6px", fontWeight: 800, letterSpacing: "0.1em" }}>
            {currentRole}
          </span>
          <span style={{ fontSize: "10px", color: "#888888" }}>
            {isOwner ? "Full Access" : "Products / Assets"}
          </span>
        </div>

        <p className="admin-label">OPERATIONS</p>
        <nav>
          {navigation.map((item, idx) => {
            const isRestricted = item.ownerOnly && !isOwner;
            return (
              <div key={item.id} className="admin-nav-group">
                <button
                  disabled={isRestricted}
                  className={active === item.id ? "active" : ""}
                  style={isRestricted ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
                  onClick={() => {
                    if (!isRestricted) {
                      setActive(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="admin-nav-index">{String(idx + 1).padStart(2, "0")}</span>
                  {item.label}
                  {isRestricted ? <small style={{ fontSize: "8px", marginLeft: "auto", color: "#666" }}>🔒</small> : <b>+</b>}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <span className="status-dot" /> SYSTEM READY<br />
          <small>POSTGRES / RAZORPAY</small>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area (White-First) */}
      <section className="admin-content">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">BEXYEE 2.1 / CONTROL ROOM</p>
            <h1>{navigation.find((item) => item.id === active)?.label ?? "Dashboard"}</h1>
          </div>
          <div className="admin-header-meta">
            <span>ROLE: {currentRole}</span>
            <Link href="/" target="_blank" rel="noopener noreferrer">VIEW STORE ↗</Link>
            <button className="admin-avatar" title={`Authenticated as ${currentRole}`}>{currentRole[0]}</button>
          </div>
        </header>

        {active === "dashboard" && <AdminHome data={data} setActiveTab={setActive} onManageProduct={handleManageProduct} />}
        {active === "products" && <SimpleProductsCenter initialProducts={data.products} onManageProduct={handleManageProduct} onPreviewProduct={() => {}} />}
        {active === "inventory" && <SimpleInventoryCenter initialProducts={data.products} />}
        {active === "orders" && <OrdersCenter orders={data.orders} />}
        {active === "customers" && <CustomersCenter count={data.customers} />}
        {active === "assets" && <SimpleAssetsCenter />}
        {active === "launches" && <SimpleLaunchesCenter />}
        {active === "size_charts" && <SizeChartsCenter />}
        {active === "refunds" && <RefundsCenter />}
        {active === "analytics" && <SimpleAnalyticsCenter data={data} />}
        {active === "marketing" && <MarketingCommandCenter data={data} />}
        {active === "settings" && isOwner && (
          <EmptySection
            title="Owner Settings &amp; Store Configuration"
            description="Manage GSTIN (29AABCB1234F1Z5), Razorpay API credentials, webhook secrets, and role assignments."
            link="/admin/settings/security"
          />
        )}
      </section>
    </main>
  );
}

function CustomersCenter({ count }: { count: number }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", color: "#000000" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#000000" }}>Customer Directory</h2>
      <p style={{ margin: "0 0 20px 0", fontSize: "12px", color: "#777777" }}>
        Total Registered &amp; Guest Profiles: <strong style={{ color: "#000000" }}>{count}</strong>
      </p>
      <div style={{ background: "#F7F7F3", padding: "24px", border: "1px dashed #CCCCCC", textAlign: "center", fontSize: "12px", color: "#777777" }}>
        Customer profiles are created automatically during checkout. Privacy masking and PII protection are enforced by default.
      </div>
    </div>
  );
}

function EmptySection({ title, description, link }: { title: string; description: string; link?: string }) {
  return (
    <div className="admin-empty large" style={{ background: "#FFFFFF", border: "1px dashed #CCCCCC", padding: "48px 24px", textAlign: "center", color: "#777777" }}>
      <strong style={{ color: "#000000", fontSize: "20px", display: "block", marginBottom: "8px" }}>{title}</strong>
      <span style={{ fontSize: "12px", display: "block", marginBottom: "20px" }}>{description}</span>
      {link && (
        <Link
          href={link}
          style={{
            background: "#000000",
            color: "#FFFFFF",
            padding: "12px 24px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          SECURITY &amp; SECRETS SETTINGS ↗
        </Link>
      )}
    </div>
  );
}
