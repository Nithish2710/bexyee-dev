"use client";

import Link from "next/link";
import type { AdminData } from "./AdminShell";

export type AdminHomeProps = {
  data: AdminData;
  setActiveTab: (tabId: string) => void;
  onManageProduct?: (productId: string) => void;
};

function formatMoney(paise: number) {
  if (!paise || paise <= 0) return "₹0";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function AdminHome({ data, setActiveTab, onManageProduct }: AdminHomeProps) {
  const featuredProduct = data.products.find(
    (p) => (p.name || "").toLowerCase().includes("bengaluru") || (p.sku || "").includes("BLR")
  ) || data.products[0];

  const totalStock = (featuredProduct?.product_sizes || []).reduce(
    (acc, s) => acc + (s.stock_quantity || 0),
    0
  );

  const lowStockVariants = data.products.flatMap((p) =>
    (p.product_sizes || [])
      .filter((s) => s.stock_quantity > 0 && s.stock_quantity <= 5)
      .map((s) => ({ ...s, productName: p.name, sku: p.sku }))
  );

  const isLive = featuredProduct?.status === "ACTIVE";

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "28px" }}>
      {/* 1. WELCOME & ORIENTATION BANNER (White Surface) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".18em", fontWeight: 700 }}>
            CONTROL ROOM
          </span>
          <h1 style={{ fontSize: "28px", color: "#000000", margin: "4px 0 8px 0", letterSpacing: "-.04em" }}>
            BEXYEE CONTROL CENTER
          </h1>
          <p style={{ fontSize: "13px", color: "#555555", margin: 0, maxWidth: "560px", lineHeight: 1.5 }}>
            Welcome back. Here is the current live status of your storefront, active drops, and items requiring your attention.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            style={{
              background: "#000000",
              color: "#FFFFFF",
              border: 0,
              padding: "12px 20px",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: ".08em",
            }}
          >
            + CREATE PRODUCT
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#FFFFFF",
              border: "1px solid #000000",
              color: "#000000",
              padding: "12px 18px",
              fontSize: "11px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            VIEW STOREFRONT ↗
          </Link>
        </div>
      </div>

      {/* 2. FEATURED DROP LIVE CARD (White Card with crisp monochrome accents) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "32px",
          display: "grid",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  background: isLive ? "#000000" : "#F7F7F3",
                  color: isLive ? "#FFFFFF" : "#000000",
                  border: "1px solid #E5E5E5",
                }}
              >
                {isLive ? "● LIVE STOREFRONT" : "◌ DRAFT MODE"}
              </span>
              <span style={{ fontSize: "11px", color: "#777777" }}>DROP 001</span>
            </div>

            <h2 style={{ fontSize: "32px", color: "#000000", margin: 0, letterSpacing: "-.04em" }}>
              {featuredProduct?.name || "Bengaluru Edition Heavyweight Tee"}
            </h2>
            <p style={{ fontSize: "12px", color: "#777777", margin: "6px 0 0 0" }}>
              SKU: {featuredProduct?.sku || "BEXYEE-BLR-001"} • City: {featuredProduct?.name?.includes("Bengaluru") ? "BENGALURU" : "INDIA"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/product/bengaluru-tee"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#000000",
                color: "#FFFFFF",
                border: 0,
                padding: "12px 20px",
                fontSize: "11.5px",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              VIEW LIVE ↗
            </Link>
            <Link
              href={`/admin/products/${featuredProduct?.slug || featuredProduct?.id || "bengaluru-tee"}`}
              onClick={(e) => {
                if (onManageProduct && featuredProduct) {
                  e.preventDefault();
                  onManageProduct(featuredProduct.slug || featuredProduct.id || "bengaluru-tee");
                }
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #000000",
                color: "#000000",
                padding: "12px 20px",
                fontSize: "11.5px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              MANAGE PRODUCT ✎
            </Link>
          </div>
        </div>

        {/* Quick Product Health Snapshot */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px" }}>
            <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>AVAILABLE INVENTORY</span>
            <h3 style={{ fontSize: "28px", color: "#000000", margin: "8px 0 0 0", letterSpacing: "-0.04em" }}>
              {totalStock} Units
            </h3>
            <small style={{ color: "#777777", fontSize: "11px" }}>Active for customer purchase</small>
          </div>

          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px" }}>
            <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>PRICE</span>
            <h3 style={{ fontSize: "28px", color: "#000000", margin: "8px 0 0 0", letterSpacing: "-0.04em" }}>
              {featuredProduct ? formatMoney(featuredProduct.price_paise) : "₹1,799"}
            </h3>
            <small style={{ color: "#777777", fontSize: "11px" }}>12% GST included</small>
          </div>

          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px" }}>
            <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>CAPTURED ORDERS</span>
            <h3 style={{ fontSize: "28px", color: "#000000", margin: "8px 0 0 0", letterSpacing: "-0.04em" }}>
              {data.orders.length}
            </h3>
            <small style={{ color: "#777777", fontSize: "11px" }}>Total order records</small>
          </div>

          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px" }}>
            <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>TOTAL REVENUE</span>
            <h3 style={{ fontSize: "28px", color: "#000000", margin: "8px 0 0 0", letterSpacing: "-0.04em" }}>
              {formatMoney(data.revenuePaise)}
            </h3>
            <small style={{ color: "#777777", fontSize: "11px" }}>Settled via Razorpay</small>
          </div>
        </div>
      </div>

      {/* 3. ATTENTION REQUIRED SECTION (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".16em", fontWeight: 700 }}>
              STATUS &amp; ACTIONS
            </span>
            <h2 style={{ fontSize: "18px", color: "#000000", margin: "4px 0 0 0" }}>
              ATTENTION REQUIRED
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            style={{
              background: "transparent",
              border: "1px solid #000000",
              color: "#000000",
              padding: "8px 14px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            RESOLVE ALL ↗
          </button>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {lowStockVariants.length > 0 && (
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "9.5px", color: "#E52B20", fontWeight: 700, letterSpacing: ".1em" }}>
                  LOW STOCK ALERT
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "#000000" }}>
                  {lowStockVariants.length} variant(s) are running low (≤ 5 units remaining).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                style={{
                  background: "#000000",
                  color: "#FFFFFF",
                  border: 0,
                  padding: "8px 14px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                RESTOCK INVENTORY ↗
              </button>
            </div>
          )}

          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", fontWeight: 700, letterSpacing: ".1em" }}>
                RESERVATIONS AUTO-RELEASE CRON
              </span>
              <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "#000000" }}>
                Inventory hold TTL is set to 15 minutes. Abandoned reservations are automatically restored.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              style={{
                background: "#FFFFFF",
                color: "#000000",
                border: "1px solid #000000",
                padding: "8px 14px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              VIEW INVENTORY ↗
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT ORDERS SNAPSHOT */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".16em", fontWeight: 700 }}>
              COMMERCIAL LOG
            </span>
            <h2 style={{ fontSize: "18px", color: "#000000", margin: "4px 0 0 0" }}>
              RECENT ORDERS
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            style={{
              background: "#000000",
              color: "#FFFFFF",
              border: 0,
              padding: "8px 14px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            VIEW ALL ORDERS ↗
          </button>
        </div>

        {data.orders.length === 0 ? (
          <div style={{ background: "#F7F7F3", padding: "24px", textAlign: "center", color: "#777777", fontSize: "12px", border: "1px dashed #E5E5E5" }}>
            No orders placed yet. Orders will appear here in real time as payments are verified.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {data.orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                style={{
                  background: "#F7F7F3",
                  border: "1px solid #E5E5E5",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <strong style={{ color: "#000000", fontSize: "13px" }}>#{order.id.slice(0, 8)}...</strong>
                  <span style={{ color: "#777777", fontSize: "11px", display: "block" }}>{order.guest_email || "Customer"}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: "#000000", fontSize: "13px" }}>{formatMoney(order.total_paise)}</strong>
                  <span style={{ color: "#777777", fontSize: "10px", display: "block" }}>{order.payment_status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
