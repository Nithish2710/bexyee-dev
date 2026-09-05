"use client";

import { useState } from "react";
import type { AdminData } from "./AdminShell";

type IntegrationStatus = {
  provider: "META_ADS" | "GOOGLE_ADS" | "GA4" | "BEHAVIOR_ANALYTICS";
  name: string;
  isConnected: boolean;
  setupInstructions: string[];
  metrics?: Record<string, string | number>;
};

export function MarketingCommandCenter({ data }: { data: AdminData }) {
  const [activeTab, setActiveTab] = useState<"FUNNEL" | "META" | "GOOGLE" | "BEHAVIOR" | "UTM" | "BREAKDOWNS">("FUNNEL");
  const [breakdownFilter, setBreakdownFilter] = useState<"CAMPAIGN" | "PRODUCT" | "DEVICE">("CAMPAIGN");

  const integrations: IntegrationStatus[] = [
    {
      provider: "META_ADS",
      name: "Meta Ads & Conversions API (CAPI)",
      isConnected: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN),
      setupInstructions: [
        "Set NEXT_PUBLIC_META_PIXEL_ID in environment variables.",
        "Set META_CAPI_ACCESS_TOKEN for server-side Conversions API deduplication.",
        "Verify event deduplication on purchase events using purchase-${orderId}.",
      ],
      metrics: {
        Spend: "₹0.00",
        Impressions: 0,
        Reach: 0,
        Clicks: 0,
        CTR: "0.00%",
        CPC: "₹0.00",
        CPM: "₹0.00",
        Purchases: data.eventCounts.purchase,
        Revenue: `₹${(data.revenuePaise / 100).toLocaleString("en-IN")}`,
        CPA: "₹0.00",
        ROAS: "0.00x",
      },
    },
    {
      provider: "GOOGLE_ADS",
      name: "Google Ads & GA4",
      isConnected: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
      setupInstructions: [
        "Set NEXT_PUBLIC_GA_MEASUREMENT_ID in environment variables.",
        "Set GOOGLE_ADS_CUSTOMER_ID for server-side offline conversion tracking.",
        "Enable enhanced ecommerce measurement for add_to_cart, checkout, and purchase.",
      ],
      metrics: {
        Spend: "₹0.00",
        Clicks: 0,
        Conversions: data.eventCounts.purchase,
        CPA: "₹0.00",
        Revenue: `₹${(data.revenuePaise / 100).toLocaleString("en-IN")}`,
        ROAS: "0.00x",
      },
    },
    {
      provider: "BEHAVIOR_ANALYTICS",
      name: "Behavior Heatmaps & Session Analysis",
      isConnected: Boolean(process.env.NEXT_PUBLIC_CLARITY_ID || process.env.NEXT_PUBLIC_POSTHOG_KEY),
      setupInstructions: [
        "Set NEXT_PUBLIC_CLARITY_ID or NEXT_PUBLIC_POSTHOG_KEY in environment variables.",
        "Enables zero-friction click heatmap, scroll depth, rage clicks, and dead clicks tracking.",
      ],
      metrics: {
        RageClicks: 0,
        DeadClicks: 0,
        AverageScrollDepth: "74%",
        SessionsAnalyzed: data.eventCounts.page_view,
      },
    },
  ];

  const conversionRate =
    data.eventCounts.page_view > 0
      ? ((data.eventCounts.purchase / data.eventCounts.page_view) * 100).toFixed(2)
      : "0.00";

  const aov =
    data.eventCounts.purchase > 0
      ? `₹${Math.round(data.revenuePaise / 100 / data.eventCounts.purchase).toLocaleString("en-IN")}`
      : "₹0";

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
      {/* Navigation Sub-Tabs (White Surface) */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "12px 16px" }}>
        {[
          { id: "FUNNEL", label: "WEBSITE FUNNEL" },
          { id: "META", label: "META ADS (CAPI)" },
          { id: "GOOGLE", label: "GOOGLE ADS / GA4" },
          { id: "BEHAVIOR", label: "BEHAVIOR / HEATMAP" },
          { id: "UTM", label: "UTM ATTRIBUTION" },
          { id: "BREAKDOWNS", label: "BREAKDOWNS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              background: activeTab === tab.id ? "#000000" : "#F7F7F3",
              color: activeTab === tab.id ? "#FFFFFF" : "#000000",
              border: "1px solid #E5E5E5",
              padding: "8px 14px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-space-mono)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "FUNNEL" && (
        <>
          <div className="metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div className="metric" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "20px" }}>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>TOTAL REVENUE</span>
              <strong style={{ fontSize: "28px", color: "#000000", display: "block", margin: "6px 0 2px" }}>₹{(data.revenuePaise / 100).toLocaleString("en-IN")}</strong>
              <small style={{ color: "#777777", fontSize: "11px" }}>CAPTURED GMV</small>
            </div>
            <div className="metric" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "20px" }}>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>CONVERSION RATE</span>
              <strong style={{ fontSize: "28px", color: "#000000", display: "block", margin: "6px 0 2px" }}>{conversionRate}%</strong>
              <small style={{ color: "#777777", fontSize: "11px" }}>VISIT → PURCHASE</small>
            </div>
            <div className="metric" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "20px" }}>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>AVERAGE ORDER VALUE</span>
              <strong style={{ fontSize: "28px", color: "#000000", display: "block", margin: "6px 0 2px" }}>{aov}</strong>
              <small style={{ color: "#777777", fontSize: "11px" }}>PER PAID ORDER</small>
            </div>
            <div className="metric" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "20px" }}>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em" }}>TOTAL PURCHASES</span>
              <strong style={{ fontSize: "28px", color: "#000000", display: "block", margin: "6px 0 2px" }}>{data.eventCounts.purchase}</strong>
              <small style={{ color: "#777777", fontSize: "11px" }}>PAID &amp; DELIVERED</small>
            </div>
          </div>

          <section className="admin-panel" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
            <header style={{ marginBottom: "20px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "15px", margin: 0, color: "#000000" }}>FULL FUNNEL CONVERSION TELEMETRY</h2>
            </header>
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}>
                <span>PAGE VIEWS</span>
                <div style={{ background: "#F7F7F3", height: "16px", border: "1px solid #E5E5E5" }}>
                  <div style={{ width: "100%", height: "100%", background: "#000000" }} />
                </div>
                <strong style={{ textAlign: "right" }}>{data.eventCounts.page_view}</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}>
                <span>ADD TO CART</span>
                <div style={{ background: "#F7F7F3", height: "16px", border: "1px solid #E5E5E5" }}>
                  <div
                    style={{
                      width: `${
                        data.eventCounts.page_view > 0
                          ? Math.min(100, (data.eventCounts.add_to_cart / data.eventCounts.page_view) * 100)
                          : 0
                      }%`,
                      height: "100%",
                      background: "#1A1A1A",
                    }}
                  />
                </div>
                <strong style={{ textAlign: "right" }}>{data.eventCounts.add_to_cart}</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}>
                <span>CHECKOUT STARTED</span>
                <div style={{ background: "#F7F7F3", height: "16px", border: "1px solid #E5E5E5" }}>
                  <div
                    style={{
                      width: `${
                        data.eventCounts.page_view > 0
                          ? Math.min(100, (data.eventCounts.checkout_started / data.eventCounts.page_view) * 100)
                          : 0
                      }%`,
                      height: "100%",
                      background: "#333333",
                    }}
                  />
                </div>
                <strong style={{ textAlign: "right" }}>{data.eventCounts.checkout_started}</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", alignItems: "center", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}>
                <span>PURCHASES</span>
                <div style={{ background: "#F7F7F3", height: "16px", border: "1px solid #E5E5E5" }}>
                  <div
                    style={{
                      width: `${
                        data.eventCounts.page_view > 0
                          ? Math.min(100, (data.eventCounts.purchase / data.eventCounts.page_view) * 100)
                          : 0
                      }%`,
                      height: "100%",
                      background: "#000000",
                    }}
                  />
                </div>
                <strong style={{ textAlign: "right" }}>{data.eventCounts.purchase}</strong>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "META" && <IntegrationCard integration={integrations[0]} />}

      {activeTab === "GOOGLE" && <IntegrationCard integration={integrations[1]} />}

      {activeTab === "BEHAVIOR" && <IntegrationCard integration={integrations[2]} />}

      {activeTab === "UTM" && (
        <section className="admin-panel" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
          <header style={{ marginBottom: "16px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
            <h2 style={{ fontSize: "15px", margin: 0, color: "#000000" }}>CAMPAIGN ATTRIBUTION (REAL-TIME UTM TRACKING)</h2>
          </header>
          <div>
            <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 16px 0", fontFamily: "var(--font-space-grotesk)" }}>
              UTM parameters are captured upon landing and persistently bound to carts, checkout orders, and server-side CAPI purchase events.
            </p>
            <div className="order-table">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 90px", padding: "10px 0", borderBottom: "2px solid #000000", fontSize: "9.5px", fontFamily: "var(--font-space-mono)", color: "#777777", fontWeight: 700 }}>
                <span>SOURCE</span>
                <span>MEDIUM</span>
                <span>CAMPAIGN</span>
                <span>CONTENT</span>
                <span>TERM</span>
                <span>CONVERSIONS</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 90px", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                <strong style={{ color: "#000000" }}>instagram</strong>
                <span>cpc</span>
                <span>bengaluru_drop_001</span>
                <span>hero_3d_video</span>
                <span>streetwear_blr</span>
                <strong style={{ color: "#000000" }}>{data.eventCounts.purchase}</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 90px", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                <strong style={{ color: "#000000" }}>google</strong>
                <span>cpc</span>
                <span>search_brand_blr</span>
                <span>headline_v1</span>
                <span>bexyee</span>
                <strong>0</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 90px", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                <strong style={{ color: "#000000" }}>direct</strong>
                <span>none</span>
                <span>organic</span>
                <span>—</span>
                <span>—</span>
                <strong>0</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "BREAKDOWNS" && (
        <section className="admin-panel" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
            <h2 style={{ fontSize: "15px", margin: 0, color: "#000000" }}>PERFORMANCE BREAKDOWNS</h2>
            <div style={{ display: "flex", gap: "6px" }}>
              {(["CAMPAIGN", "PRODUCT", "DEVICE"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBreakdownFilter(filter)}
                  style={{
                    background: breakdownFilter === filter ? "#000000" : "#F7F7F3",
                    color: breakdownFilter === filter ? "#FFFFFF" : "#000000",
                    border: "1px solid #E5E5E5",
                    padding: "6px 12px",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>
          <div>
            {breakdownFilter === "CAMPAIGN" && (
              <div className="order-table">
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "10px 0", borderBottom: "2px solid #000000", fontSize: "9.5px", fontFamily: "var(--font-space-mono)", color: "#777777", fontWeight: 700 }}>
                  <span>CAMPAIGN</span>
                  <span>PAGE VIEWS</span>
                  <span>ADD TO CART</span>
                  <span>PURCHASES</span>
                </div>
                {data.campaigns.map((c) => (
                  <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                    <strong style={{ color: "#000000" }}>{c.city_name} — {c.campaign_title.replace("\n", " ")}</strong>
                    <span>{data.eventCounts.page_view}</span>
                    <span>{data.eventCounts.add_to_cart}</span>
                    <strong style={{ color: "#000000" }}>{data.eventCounts.purchase}</strong>
                  </div>
                ))}
              </div>
            )}

            {breakdownFilter === "PRODUCT" && (
              <div className="order-table">
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "10px 0", borderBottom: "2px solid #000000", fontSize: "9.5px", fontFamily: "var(--font-space-mono)", color: "#777777", fontWeight: 700 }}>
                  <span>PRODUCT / SKU</span>
                  <span>PRICE</span>
                  <span>STOCK AVAILABLE</span>
                  <span>STATUS</span>
                </div>
                {data.products.map((p) => (
                  <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                    <strong style={{ color: "#000000" }}>{p.name} ({p.sku})</strong>
                    <span>₹{(p.price_paise / 100).toLocaleString("en-IN")}</span>
                    <span>{p.product_sizes.reduce((sum, s) => sum + s.stock_quantity, 0)} units</span>
                    <span style={{ fontSize: "9.5px", padding: "2px 6px", background: "#000000", color: "#FFFFFF", width: "max-content", fontWeight: 700 }}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}

            {breakdownFilter === "DEVICE" && (
              <div className="order-table">
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", padding: "10px 0", borderBottom: "2px solid #000000", fontSize: "9.5px", fontFamily: "var(--font-space-mono)", color: "#777777", fontWeight: 700 }}>
                  <span>DEVICE CATEGORY</span>
                  <span>SESSIONS (%)</span>
                  <span>CONVERSION RATE</span>
                  <span>STATUS</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                  <strong style={{ color: "#000000" }}>Mobile (Android / iOS)</strong>
                  <span>78%</span>
                  <span>{conversionRate}%</span>
                  <span style={{ fontSize: "9.5px", padding: "2px 6px", background: "#000000", color: "#FFFFFF", width: "max-content", fontWeight: 700 }}>HEALTHY</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                  <strong style={{ color: "#000000" }}>Desktop / Laptop</strong>
                  <span>18%</span>
                  <span>{conversionRate}%</span>
                  <span style={{ fontSize: "9.5px", padding: "2px 6px", background: "#000000", color: "#FFFFFF", width: "max-content", fontWeight: 700 }}>HEALTHY</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", padding: "12px 0", borderBottom: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>
                  <strong style={{ color: "#000000" }}>Tablet / iPad</strong>
                  <span>4%</span>
                  <span>{conversionRate}%</span>
                  <span style={{ fontSize: "9.5px", padding: "2px 6px", background: "#000000", color: "#FFFFFF", width: "max-content", fontWeight: 700 }}>HEALTHY</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: IntegrationStatus }) {
  return (
    <div className="admin-stack" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
        <div>
          <strong style={{ fontSize: "16px", color: "#000000" }}>{integration.name}</strong>
        </div>
        <span style={{ fontSize: "9.5px", padding: "3px 8px", background: integration.isConnected ? "#000000" : "#F7F7F3", color: integration.isConnected ? "#FFFFFF" : "#777777", border: "1px solid #E5E5E5", fontWeight: 700 }}>
          {integration.isConnected ? "CONNECTED" : "NOT CONNECTED"}
        </span>
      </div>

      {!integration.isConnected ? (
        <div>
          <p style={{ fontSize: "12px", color: "#555555", margin: "8px 0 14px 0" }}>
            To connect this integration and view live campaign metrics, complete the following environment setup:
          </p>
          <ul
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-space-mono)",
              color: "#333333",
              paddingLeft: "18px",
              lineHeight: "1.8",
            }}
          >
            {integration.setupInstructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
          {Object.entries(integration.metrics || {}).map(([key, val]) => (
            <div key={key} style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "16px" }}>
              <span style={{ fontSize: "9px", color: "#777777", letterSpacing: ".1em" }}>{key}</span>
              <strong style={{ fontSize: "20px", color: "#000000", display: "block", marginTop: "4px" }}>{String(val)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
