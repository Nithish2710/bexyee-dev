"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import type { OrderTrackingResponse } from "../api/orders/track/route";

const LIFECYCLE_STEPS = [
  "ORDER CREATED",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT FOR DELIVERY",
  "DELIVERED",
];

function money(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
          <GlobalHeader section="TRACK" />
          <div style={{ padding: "80px 24px", textAlign: "center", color: "#777777", fontSize: "12px" }}>
            LOADING DISPATCH SYSTEM...
          </div>
          <StorefrontFooter />
        </main>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("order") || "";

  const [orderId, setOrderId] = useState(() => initialOrderId);
  const [verification, setVerification] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingResponse | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !verification.trim()) {
      setError("Please enter both your Order ID and Email / Phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          verification: verification.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found or verification details did not match.");
        setOrderData(null);
      } else {
        setOrderData(data as OrderTrackingResponse);
      }
    } catch {
      setError("Unable to connect to order tracking server. Please check your connection.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  }

  function getStepStatus(step: string, currentStatus: string) {
    const currentIndex = LIFECYCLE_STEPS.indexOf(currentStatus.toUpperCase());
    const stepIndex = LIFECYCLE_STEPS.indexOf(step);

    if (currentStatus === "CANCELLED" || currentStatus === "REFUNDED") {
      return step === "ORDER CREATED" ? "completed" : "inactive";
    }

    if (currentIndex === -1) {
      return step === "ORDER CREATED" ? "completed" : "inactive";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="TRACK" />

      {/* Hero Strip (White Surface) */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 4vw, 80px)", background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <p style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".18em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            AUTHENTICATION &amp; LOGISTICS
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", margin: 0, letterSpacing: "-.06em", lineHeight: 0.95, color: "#000000" }}>
            ORDER DISPATCH LOOKUP
          </h1>
          <p style={{ fontSize: "13px", color: "#555555", maxWidth: "600px", margin: "16px 0 0 0", lineHeight: "1.7", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Direct access to production stages, courier waybills, and legal GST invoices for your numbered garment.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section style={{ maxWidth: "920px", margin: "0 auto", padding: "clamp(30px, 5vw, 60px) 24px" }}>
        {!orderData ? (
          /* Lookup Form (White Card) */
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "clamp(24px, 4vw, 40px)" }}>
            <h2 style={{ fontSize: "16px", margin: "0 0 20px 0", letterSpacing: "-.02em", color: "#000000" }}>
              ENTER ORDER DETAILS
            </h2>
            <form onSubmit={handleTrack} style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "9px", color: "#777777", letterSpacing: ".14em", marginBottom: "8px", textTransform: "uppercase" }}>
                  BEXYEE ORDER ID / RECEIPT NUMBER
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BEXYEE-BLR-001 or 550e8400-e29b-41d4..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    color: "#000000",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "9px", color: "#777777", letterSpacing: ".14em", marginBottom: "8px", textTransform: "uppercase" }}>
                  EMAIL ADDRESS OR PHONE NUMBER (USED AT CHECKOUT)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. name@example.com or 9876543210"
                  value={verification}
                  onChange={(e) => setVerification(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    color: "#000000",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {error && (
                <div style={{ padding: "12px 16px", background: "rgba(229, 43, 32, 0.08)", border: "1px solid #E52B20", color: "#E52B20", fontSize: "12px" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "16px 28px",
                  background: "#000000",
                  color: "#FFFFFF",
                  border: 0,
                  fontSize: "11px",
                  fontFamily: "var(--font-space-mono)",
                  letterSpacing: ".12em",
                  cursor: loading ? "wait" : "pointer",
                  fontWeight: 800,
                  width: "max-content",
                }}
              >
                {loading ? "VERIFYING DISPATCH..." : "TRACK ORDER ↗"}
              </button>
            </form>
          </div>
        ) : (
          /* Order Dashboard (White Cards) */
          <div style={{ display: "grid", gap: "28px" }}>
            {/* Top Bar with Status */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ fontSize: "9px", color: "#777777", letterSpacing: ".14em", display: "block" }}>
                  ORDER IDENTIFIER
                </span>
                <strong style={{ fontSize: "18px", color: "#000000", letterSpacing: "-.02em" }}>
                  {orderData.orderNumber}
                </strong>
                <span style={{ fontSize: "11px", color: "#777777", display: "block", marginTop: "4px" }}>
                  Placed on {new Date(orderData.orderDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", padding: "4px 8px", background: "#F7F7F3", border: "1px solid #E5E5E5", color: "#000000", fontWeight: 700 }}>
                  PAYMENT: {orderData.paymentStatus}
                </span>
                <span style={{ fontSize: "10px", padding: "4px 8px", background: "#000000", color: "#FFFFFF", fontWeight: 700 }}>
                  {orderData.orderStatus}
                </span>
              </div>
            </div>

            {/* Lifecycle Timeline Stepper */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
              <h3 style={{ fontSize: "11px", color: "#777777", letterSpacing: ".14em", textTransform: "uppercase", margin: "0 0 24px 0" }}>
                ORDER PROGRESS TIMELINE
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px" }}>
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const state = getStepStatus(step, orderData.orderStatus);
                  return (
                    <div
                      key={step}
                      style={{
                        padding: "12px 10px",
                        borderTop: `3px solid ${state === "completed" ? "#000000" : state === "current" ? "#E52B20" : "#E5E5E5"}`,
                        background: state === "current" ? "#F7F7F3" : "transparent",
                      }}
                    >
                      <span style={{ fontSize: "8.5px", color: state === "current" ? "#E52B20" : "#777777", display: "block" }}>
                        STEP 0{idx + 1}
                      </span>
                      <strong style={{ fontSize: "10px", color: state === "upcoming" ? "#999999" : "#000000", display: "block", marginTop: "4px" }}>
                        {step}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking */}
            {orderData.trackingNumber && (
              <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
                <span style={{ fontSize: "9px", color: "#777777", letterSpacing: ".14em", display: "block" }}>
                  LOGISTICS &amp; SHIPPING
                </span>
                <strong style={{ fontSize: "14px", color: "#000000", display: "block", marginTop: "4px" }}>
                  {orderData.courier || "Blr Express"} — Waybill #{orderData.trackingNumber}
                </strong>
                <span style={{ fontSize: "11px", color: "#777777", display: "inline-block", marginTop: "8px" }}>
                  Estimated Delivery: {orderData.estimatedDelivery}
                </span>
              </div>
            )}

            {/* Items Card */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
              <h3 style={{ fontSize: "11px", color: "#777777", letterSpacing: ".14em", textTransform: "uppercase", margin: "0 0 16px 0" }}>
                ORDER ITEMS
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {orderData.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #F0F0EE" }}>
                    <div>
                      <strong style={{ color: "#000000", fontSize: "13px" }}>{item.productName}</strong>
                      <span style={{ fontSize: "11px", color: "#777777", display: "block" }}>Size: {item.size} • Qty: {item.quantity}</span>
                    </div>
                    <strong style={{ color: "#000000", fontSize: "13px" }}>{money(item.totalPricePaise)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                style={{
                  padding: "14px 24px",
                  background: "#000000",
                  color: "#FFFFFF",
                  border: 0,
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                VIEW LEGAL GST INVOICE ↗
              </button>

              <button
                type="button"
                onClick={() => {
                  setOrderData(null);
                  setOrderId("");
                  setVerification("");
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  fontSize: "11px",
                  padding: "14px 20px",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                ← TRACK ANOTHER ORDER
              </button>
            </div>

            {/* GST INVOICE MODAL */}
            {showInvoiceModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 2000,
                  background: "rgba(0, 0, 0, 0.75)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    color: "#000000",
                    maxWidth: "680px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "clamp(24px, 4vw, 40px)",
                    fontFamily: "var(--font-space-mono), monospace",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000000", paddingBottom: "16px" }}>
                    <div>
                      <h2 style={{ fontSize: "24px", margin: 0, letterSpacing: "-.06em", color: "#000000" }}>BEXYEE</h2>
                      <p style={{ fontSize: "9px", color: "#555555", margin: "4px 0 0 0" }}>
                        BEXYEE STUDIO PRIVATE LIMITED<br />
                        GSTIN: 29AABCB1234F1Z5 • HSN: 6109<br />
                        Bengaluru, Karnataka, India
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, display: "block" }}>TAX INVOICE</span>
                      <span style={{ fontSize: "10px", color: "#555555" }}>#{orderData.orderNumber}</span>
                      <span style={{ fontSize: "9px", color: "#777777", display: "block" }}>
                        {new Date(orderData.orderDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div style={{ margin: "20px 0", fontSize: "10px", lineHeight: 1.6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <strong>BILLED &amp; SHIPPED TO:</strong><br />
                      {orderData.customerName}<br />
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.pincode}<br />
                      India
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong>PAYMENT METHOD:</strong><br />
                      Razorpay Verified<br />
                      Status: {orderData.paymentStatus}
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", margin: "20px 0" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #000000", textAlign: "left" }}>
                        <th style={{ padding: "8px 0" }}>DESCRIPTION</th>
                        <th style={{ padding: "8px 0" }}>SIZE</th>
                        <th style={{ padding: "8px 0" }}>QTY</th>
                        <th style={{ padding: "8px 0", textAlign: "right" }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #E5E5E5" }}>
                          <td style={{ padding: "8px 0" }}>{item.productName} ({item.sku})</td>
                          <td style={{ padding: "8px 0" }}>{item.size}</td>
                          <td style={{ padding: "8px 0" }}>{item.quantity}</td>
                          <td style={{ padding: "8px 0", textAlign: "right" }}>{money(item.totalPricePaise)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ borderTop: "2px solid #000000", paddingTop: "12px", display: "grid", gap: "4px", fontSize: "11px", textAlign: "right" }}>
                    <div>Subtotal: {money(orderData.totals.subtotalPaise)}</div>
                    <div>Shipping: {orderData.totals.shippingPaise === 0 ? "FREE" : money(orderData.totals.shippingPaise)}</div>
                    <div>GST (Included in price): {money(Math.round(orderData.totals.totalPaise * 12 / 112))}</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
                      TOTAL AMOUNT: {money(orderData.totals.totalPaise)}
                    </div>
                  </div>

                  <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{ padding: "10px 18px", background: "#000000", color: "#FFFFFF", border: 0, fontSize: "10px", cursor: "pointer", fontFamily: "var(--font-space-mono)", fontWeight: 700 }}
                    >
                      PRINT INVOICE 🖨
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInvoiceModal(false)}
                      style={{ padding: "10px 18px", background: "#F7F7F3", color: "#000000", border: "1px solid #E5E5E5", fontSize: "10px", cursor: "pointer", fontFamily: "var(--font-space-mono)", fontWeight: 700 }}
                    >
                      CLOSE ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <StorefrontFooter />
    </main>
  );
}
