"use client";

import { useEffect, useState } from "react";

type RefundRecord = {
  id: string;
  order_id: string;
  razorpay_refund_id: string;
  amount_paise: number;
  reason: string;
  status: string;
  restocked: boolean;
  created_at: string;
  orders?: {
    guest_email: string;
    total_paise: number;
    status: string;
  };
};

export function RefundsCenter() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [amountInr, setAmountInr] = useState("");
  const [reason, setReason] = useState("");
  const [restock, setRestock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadRefunds() {
    try {
      const res = await fetch("/api/admin/refunds");
      const data = await res.json();
      if (data.refunds) setRefunds(data.refunds);
    } catch {
      // Ignore in offline/demo mode
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRefunds();
  }, []);

  async function handleRefundSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId || !amountInr || !reason) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const amountPaise = Math.round(parseFloat(amountInr) * 100);
      const res = await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          amountPaise,
          reason: reason.trim(),
          restock,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process refund.");

      setMessage({ type: "success", text: `Refund of ₹${amountInr} processed successfully (Status: ${data.status}).` });
      setOrderId("");
      setAmountInr("");
      setReason("");
      void loadRefunds();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error processing refund." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px 28px" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000000" }}>Refund Management Engine</h2>
        <p style={{ margin: 0, fontSize: "12px", color: "#777777" }}>
          Complaint/Request → Admin Review → Razorpay Refund API → Order status updated → Optional automatic stock restock.
        </p>
      </div>

      {/* Refund Submission Form (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px", borderRadius: "2px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#000000" }}>Process New Refund</h3>

        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              background: message.type === "success" ? "#F7F7F3" : "rgba(229, 43, 32, 0.08)",
              border: `1px solid ${message.type === "success" ? "#000000" : "#E52B20"}`,
              color: message.type === "success" ? "#000000" : "#E52B20",
              fontSize: "11.5px",
              fontWeight: 700,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleRefundSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "end" }}>
          <label style={{ fontSize: "11px", color: "#555555", fontWeight: 700, display: "grid", gap: "6px" }}>
            Order ID (UUID) *
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 00000000-0000-0000-0000-000000000001"
              required
              style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "10px", color: "#000000", fontSize: "12px" }}
            />
          </label>

          <label style={{ fontSize: "11px", color: "#555555", fontWeight: 700, display: "grid", gap: "6px" }}>
            Refund Amount (INR) *
            <input
              type="number"
              step="0.01"
              value={amountInr}
              onChange={(e) => setAmountInr(e.target.value)}
              placeholder="e.g. 1799"
              required
              style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "10px", color: "#000000", fontSize: "12px" }}
            />
          </label>

          <label style={{ fontSize: "11px", color: "#555555", fontWeight: 700, display: "grid", gap: "6px" }}>
            Reason for Refund *
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer size exchange / cancellation"
              required
              style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "10px", color: "#000000", fontSize: "12px" }}
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
            <input
              type="checkbox"
              id="restock-check"
              checked={restock}
              onChange={(e) => setRestock(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="restock-check" style={{ fontSize: "11.5px", color: "#000000", cursor: "pointer", fontWeight: 700 }}>
              Restock Physical Inventory
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                background: "#000000",
                color: "#FFFFFF",
                border: 0,
                padding: "12px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                cursor: isSubmitting ? "wait" : "pointer",
              }}
            >
              {isSubmitting ? "PROCESSING WITH RAZORPAY..." : "EXECUTE REFUND ↗"}
            </button>
          </div>
        </form>
      </div>

      {/* Refunds History Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#000000" }}>Audit Log &amp; Processed Refunds</h3>
        {loading ? (
          <div style={{ color: "#777777", fontSize: "12px" }}>Loading refunds history...</div>
        ) : refunds.length === 0 ? (
          <div style={{ background: "#F7F7F3", padding: "30px", textAlign: "center", color: "#777777", border: "1px dashed #E5E5E5", fontSize: "12px" }}>
            NO REFUNDS PROCESSED YET
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: "#000000" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #000000", color: "#777777" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Amount</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Reason</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Restocked</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #E5E5E5" }}>
                  <td style={{ padding: "10px" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", fontFamily: "var(--font-space-mono)" }}>{r.order_id.slice(0, 8)}...</td>
                  <td style={{ padding: "10px" }}>{r.orders?.guest_email || "Customer"}</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: 700, color: "#000000" }}>₹{(r.amount_paise / 100).toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px" }}>{r.reason}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{r.restocked ? "✓ Yes" : "—"}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "9.5px", padding: "2px 6px", background: "#000000", color: "#FFFFFF", fontWeight: 700 }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
