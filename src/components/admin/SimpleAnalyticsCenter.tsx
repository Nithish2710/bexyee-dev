"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdminData } from "./AdminShell";

export type SimpleAnalyticsCenterProps = {
  data: AdminData;
};

function formatMoney(paise: number) {
  if (!paise || paise <= 0) return "₹0";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function SimpleAnalyticsCenter({ data }: SimpleAnalyticsCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<"PRODUCTS" | "BRAND" | "MARKETING">("PRODUCTS");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const pageViews = data.eventCounts.page_view || 0;
  const addCart = data.eventCounts.add_to_cart || 0;
  const checkout = data.eventCounts.checkout_started || 0;
  const purchases = data.eventCounts.purchase || 0;

  const convRate = pageViews > 0 ? ((purchases / pageViews) * 100).toFixed(1) + "%" : "0.0%";

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
      {/* 1. HEADER (White Surface) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".16em", fontWeight: 700 }}>
            PERFORMANCE &amp; CONVERSIONS
          </span>
          <h1 style={{ fontSize: "24px", color: "#000000", margin: "4px 0 6px 0" }}>
            ANALYTICS
          </h1>
          <p style={{ fontSize: "12.5px", color: "#555555", margin: 0 }}>
            Track sales, visitors, product interest, and conversion funnels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          style={{
            background: showAdvanced ? "#000000" : "#FFFFFF",
            border: "1px solid #000000",
            color: showAdvanced ? "#FFFFFF" : "#000000",
            padding: "10px 18px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {showAdvanced ? "✓ SIMPLE VIEW" : "⚙ SHOW ADVANCED METRICS"}
        </button>
      </div>

      {/* 2. TOP-LEVEL PERFORMANCE METRICS (White Cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
          <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>TOTAL REVENUE</span>
          <h3 style={{ fontSize: "28px", color: "#000000", margin: "6px 0 0 0", letterSpacing: "-0.04em" }}>
            {formatMoney(data.revenuePaise)}
          </h3>
          <small style={{ color: "#777777", fontSize: "11px" }}>Captured order value</small>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
          <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>TOTAL ORDERS</span>
          <h3 style={{ fontSize: "28px", color: "#000000", margin: "6px 0 0 0", letterSpacing: "-0.04em" }}>
            {data.orders.length}
          </h3>
          <small style={{ color: "#777777", fontSize: "11px" }}>Paid &amp; processed orders</small>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
          <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>VISITORS &amp; VIEWS</span>
          <h3 style={{ fontSize: "28px", color: "#000000", margin: "6px 0 0 0", letterSpacing: "-0.04em" }}>
            {pageViews > 0 ? pageViews.toLocaleString() : "—"}
          </h3>
          <small style={{ color: "#777777", fontSize: "11px" }}>Storefront page sessions</small>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
          <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>CONVERSION RATE</span>
          <h3 style={{ fontSize: "28px", color: "#000000", margin: "6px 0 0 0", letterSpacing: "-0.04em" }}>
            {convRate}
          </h3>
          <small style={{ color: "#777777", fontSize: "11px" }}>Visitor-to-purchase ratio</small>
        </div>
      </div>

      {/* 3. SUB-TABS */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E5E5E5",
          background: "#FFFFFF",
        }}
      >
        {[
          { id: "PRODUCTS", label: "PRODUCT PERFORMANCE" },
          { id: "BRAND", label: "BRAND LIFETIME" },
          { id: "MARKETING", label: "CAMPAIGNS & CHANNELS" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            style={{
              padding: "14px 22px",
              background: activeSubTab === tab.id ? "#F7F7F3" : "transparent",
              color: activeSubTab === tab.id ? "#000000" : "#777777",
              border: 0,
              borderBottom: activeSubTab === tab.id ? "2px solid #000000" : "2px solid transparent",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: PRODUCT PERFORMANCE */}
      {activeSubTab === "PRODUCTS" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
          <h2 style={{ fontSize: "18px", color: "#000000", margin: "0 0 20px 0" }}>
            Bengaluru Edition Heavyweight Tee
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px" }}>
              <span style={{ fontSize: "9px", color: "#777777" }}>PAGE VIEWS</span>
              <h4 style={{ fontSize: "20px", color: "#000000", margin: "4px 0 0 0" }}>{pageViews > 0 ? pageViews : "—"}</h4>
            </div>
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px" }}>
              <span style={{ fontSize: "9px", color: "#777777" }}>ADD TO CART</span>
              <h4 style={{ fontSize: "20px", color: "#000000", margin: "4px 0 0 0" }}>{addCart > 0 ? addCart : "—"}</h4>
            </div>
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px" }}>
              <span style={{ fontSize: "9px", color: "#777777" }}>CHECKOUTS</span>
              <h4 style={{ fontSize: "20px", color: "#000000", margin: "4px 0 0 0" }}>{checkout > 0 ? checkout : "—"}</h4>
            </div>
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px" }}>
              <span style={{ fontSize: "9px", color: "#777777" }}>ORDERS</span>
              <h4 style={{ fontSize: "20px", color: "#000000", margin: "4px 0 0 0" }}>{purchases > 0 ? purchases : "—"}</h4>
            </div>
          </div>

          {pageViews === 0 && (
            <div style={{ border: "1px dashed #CCCCCC", padding: "32px 20px", textAlign: "center", background: "#F7F7F3" }}>
              <span style={{ fontSize: "10px", color: "#777777", fontWeight: 700 }}>NO LIVE DATA RECORDED YET</span>
              <p style={{ fontSize: "12px", color: "#555555", margin: "6px 0 16px 0" }}>
                Analytics will populate automatically as visitors view and purchase products.
              </p>
              <Link
                href="/admin/settings/security"
                style={{ background: "#FFFFFF", border: "1px solid #000000", color: "#000000", padding: "8px 14px", fontSize: "10px", textDecoration: "none", fontWeight: 700 }}
              >
                CHECK TRACKING KEYS ↗
              </Link>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: BRAND LIFETIME */}
      {activeSubTab === "BRAND" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
          <h2 style={{ fontSize: "18px", color: "#000000", margin: "0 0 16px 0" }}>
            BEXYEE Brand Performance
          </h2>
          <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 20px 0" }}>
            Monthly historical totals across all capsule collections.
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #000000", textAlign: "left", color: "#777777" }}>
                <th style={{ padding: "10px" }}>MONTH</th>
                <th style={{ padding: "10px" }}>ORDERS</th>
                <th style={{ padding: "10px" }}>REVENUE</th>
                <th style={{ padding: "10px" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td style={{ padding: "12px 10px", color: "#000000", fontWeight: 700 }}>August 2026 (Monsoon Drop)</td>
                <td style={{ padding: "12px 10px" }}>{data.orders.length}</td>
                <td style={{ padding: "12px 10px", color: "#000000", fontWeight: 700 }}>{formatMoney(data.revenuePaise)}</td>
                <td style={{ padding: "12px 10px", color: "#000000", fontWeight: 700 }}>● LIVE ACTIVE</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 3: MARKETING */}
      {activeSubTab === "MARKETING" && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
          <h2 style={{ fontSize: "18px", color: "#000000", margin: "0 0 16px 0" }}>
            Marketing Campaigns &amp; Attribution
          </h2>

          <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px", marginBottom: "16px" }}>
            <strong style={{ color: "#000000", fontSize: "13px" }}>Bengaluru Monsoon Launch Campaign</strong>
            <p style={{ fontSize: "11.5px", color: "#777777", margin: "4px 0 0 0" }}>
              Channels: Organic Direct, Instagram Drop Announcement, Meta Ads.
            </p>
          </div>
        </div>
      )}

      {/* 4. ADVANCED TELEMETRY */}
      {showAdvanced && (
        <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "24px 28px" }}>
          <h3 style={{ fontSize: "12px", color: "#000000", letterSpacing: ".14em", margin: "0 0 12px 0", fontWeight: 700 }}>
            ADVANCED TECHNICAL TELEMETRY
          </h3>
          <p style={{ fontSize: "11px", color: "#555555", lineHeight: 1.6 }}>
            Raw event counts: <code>page_view={pageViews}</code>, <code>add_to_cart={addCart}</code>, <code>checkout_started={checkout}</code>, <code>purchase={purchases}</code>.
            Server edge response time: &lt; 95ms TTFB.
          </p>
        </div>
      )}
    </div>
  );
}
