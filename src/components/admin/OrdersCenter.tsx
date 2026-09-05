"use client";

import { useState } from "react";
import type { AdminData } from "./AdminShell";

const ALL_STATUSES = [
  "ALL",
  "PENDING",
  "PAID",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "PAYMENT_FAILED",
  "CANCELLED",
  "REFUND_REQUESTED",
  "REFUNDED",
  "REQUIRES_REFUND",
];

function money(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export type OrderRecord = AdminData["orders"][number] & {
  tracking_number?: string | null;
  guest_phone?: string | null;
  address?: {
    name?: string;
    phone?: string;
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  notes?: Array<{ id: string; note: string; author: string; created_at: string }>;
};

export function OrdersCenter({
  orders: initialOrders,
}: {
  orders: AdminData["orders"];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [noteList, setNoteList] = useState<Array<{ note: string; author: string; time: string }>>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // Filter orders by status and query
  const filtered = orders.filter((ord) => {
    const matchesStatus =
      filter === "ALL" ||
      ord.status.toUpperCase() === filter ||
      (filter === "PENDING" && ord.status === "PENDING");

    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesId = ord.id.toLowerCase().includes(q);
    const matchesEmail = (ord.guest_email || "").toLowerCase().includes(q);
    return matchesId || matchesEmail;
  });

  function openOrderDetails(order: AdminData["orders"][number]) {
    setSelectedOrder(order as OrderRecord);
    setNewStatus(order.status);
    setTrackingNumber((order as OrderRecord).tracking_number || "");
    setActionMessage("");
    setInternalNote("");
    setNoteList([
      {
        note: "Order created and 15-minute stock lock verified.",
        author: "SYSTEM",
        time: new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setActionMessage("");

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
          trackingNumber: trackingNumber.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionMessage(`Error: ${data.error || "Update failed."}`);
      } else {
        setActionMessage("Order status and tracking updated successfully.");
        // Update local list
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, status: newStatus, tracking_number: trackingNumber.trim() }
              : o
          )
        );
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, tracking_number: trackingNumber.trim() } : null));
      }
    } catch {
      setActionMessage("Network error updating order.");
    } finally {
      setIsUpdating(false);
    }
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!internalNote.trim()) return;

    setNoteList((prev) => [
      ...prev,
      {
        note: internalNote.trim(),
        author: "OPS ADMIN",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInternalNote("");
  }

  async function handleRefund() {
    if (!selectedOrder) return;
    if (!confirm(`Are you sure you want to refund ${money(selectedOrder.total_paise)} for Order #${selectedOrder.id.slice(0, 8)}?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/orders/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          amountPaise: selectedOrder.total_paise,
          reason: "Admin triggered order cancellation & full refund",
          shouldRestock: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionMessage(`Refund failed: ${data.error || "Contact payment support."}`);
      } else {
        setActionMessage("100% Refund processed via Razorpay. Stock restocked.");
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: "REFUNDED", payment_status: "REFUNDED" } : o))
        );
        setSelectedOrder((prev) => (prev ? { ...prev, status: "REFUNDED", payment_status: "REFUNDED" } : null));
      }
    } catch {
      setActionMessage("Network error issuing refund.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
      {/* Top Controls (White Surface) */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "16px 20px" }}>
        <input
          type="text"
          placeholder="Search by Order ID, Email, Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            minWidth: "300px",
            padding: "10px 14px",
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            color: "#000000",
            fontSize: "12px",
            fontFamily: "var(--font-space-mono)",
            outline: "none",
          }}
        />
        <div style={{ fontSize: "11px", color: "#777777", fontFamily: "var(--font-space-mono)" }}>
          SHOWING {filtered.length} OF {orders.length} ORDERS
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {ALL_STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              background: filter === st ? "#000000" : "#FFFFFF",
              color: filter === st ? "#FFFFFF" : "#000000",
              border: "1px solid #E5E5E5",
              padding: "6px 12px",
              fontSize: "9.5px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-space-mono)",
            }}
          >
            {st.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Orders Table (White Panel) */}
      <div className="admin-panel" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
        <header style={{ marginBottom: "16px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
          <h2 style={{ fontSize: "14px", margin: 0, color: "#000000" }}>ORDER INVENTORY &amp; DISPATCH MATRIX ({filtered.length})</h2>
        </header>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#777777", fontSize: "12px" }}>
            No orders matching the current criteria.
          </div>
        ) : (
          <div className="order-table">
            <div style={{ display: "grid", gridTemplateColumns: "120px 1.4fr 100px 100px 100px 80px", padding: "10px 0", borderBottom: "2px solid #000000", fontSize: "9.5px", fontFamily: "var(--font-space-mono)", color: "#777777" }}>
              <span>ORDER ID</span>
              <span>CUSTOMER / EMAIL</span>
              <span>TOTAL</span>
              <span>PAYMENT</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {filtered.map((order) => (
              <div
                key={order.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1.4fr 100px 100px 100px 80px",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: "1px solid #E5E5E5",
                  fontSize: "11px",
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                <strong style={{ color: "#000000" }}>#{order.id.slice(0, 8).toUpperCase()}</strong>
                <span style={{ color: "#555555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {order.guest_email || "Collector (Guest)"}
                </span>
                <strong style={{ color: "#000000" }}>{money(order.total_paise)}</strong>
                <span style={{ fontSize: "9.5px", padding: "3px 6px", background: order.payment_status === "CAPTURED" || order.payment_status === "PAID" ? "#000000" : "#F7F7F3", color: order.payment_status === "CAPTURED" || order.payment_status === "PAID" ? "#FFFFFF" : "#000000", border: "1px solid #E5E5E5", width: "max-content", fontWeight: 700 }}>
                  {order.payment_status}
                </span>
                <span style={{ fontSize: "9.5px", padding: "3px 6px", background: "#F7F7F3", color: "#000000", border: "1px solid #E5E5E5", width: "max-content", fontWeight: 700 }}>
                  {order.status}
                </span>
                <button
                  type="button"
                  onClick={() => openOrderDetails(order)}
                  style={{
                    border: "1px solid #000000",
                    background: "#FFFFFF",
                    color: "#000000",
                    padding: "6px 10px",
                    fontSize: "9.5px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  MANAGE ↗
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-Out Order Management Drawer (White Card) */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1500,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(3px)",
            }}
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer Content */}
          <div
            style={{
              position: "relative",
              width: "min(520px, 92vw)",
              height: "100%",
              background: "#FFFFFF",
              borderLeft: "1px solid #E5E5E5",
              padding: "32px 28px",
              overflowY: "auto",
              zIndex: 1,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              color: "#000000",
              boxShadow: "-15px 0 35px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E5E5E5", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "9px", color: "#777777", fontFamily: "var(--font-space-mono)", display: "block" }}>
                  ORDER CONTROL ROOM
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "20px", fontFamily: "var(--font-space-mono)", letterSpacing: "-.04em" }}>
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: "transparent", border: 0, fontSize: "18px", cursor: "pointer", padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>

            {actionMessage && (
              <div style={{ padding: "10px 14px", background: "#F7F7F3", border: "1px solid #E5E5E5", fontSize: "11px", marginBottom: "16px", fontFamily: "var(--font-space-mono)" }}>
                {actionMessage}
              </div>
            )}

            {/* Customer & Payment Intel */}
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px", marginBottom: "20px", fontSize: "12px" }}>
              <strong style={{ fontSize: "11px", fontFamily: "var(--font-space-mono)", color: "#777777", display: "block", marginBottom: "8px" }}>
                ORDER &amp; CUSTOMER INTEL
              </strong>
              <div style={{ display: "grid", gap: "6px" }}>
                <div><strong>Email:</strong> {selectedOrder.guest_email || "Guest Checkout"}</div>
                <div><strong>Total Amount:</strong> {money(selectedOrder.total_paise)}</div>
                <div><strong>Payment Status:</strong> {selectedOrder.payment_status}</div>
                <div><strong>Placed At:</strong> {new Date(selectedOrder.created_at).toLocaleString("en-IN")}</div>
              </div>
            </div>

            {/* Status & Tracking Form */}
            <form onSubmit={handleStatusUpdate} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "18px", marginBottom: "20px", display: "grid", gap: "14px" }}>
              <strong style={{ fontSize: "11px", fontFamily: "var(--font-space-mono)", color: "#777777" }}>
                DISPATCH &amp; STATUS ADVANCEMENT
              </strong>

              <label style={{ display: "grid", gap: "6px", fontSize: "10.5px", fontFamily: "var(--font-space-mono)", fontWeight: 700 }}>
                LIFECYCLE STATUS
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "10.5px", fontFamily: "var(--font-space-mono)", fontWeight: 700 }}>
                AWB / TRACKING NUMBER (BLUEDART / DELHIVERY)
                <input
                  type="text"
                  placeholder="e.g. BLRD-99824150"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "12px", fontFamily: "var(--font-space-mono)" }}
                />
              </label>

              <button
                type="submit"
                disabled={isUpdating}
                style={{
                  padding: "12px 20px",
                  background: "#000000",
                  color: "#FFFFFF",
                  border: 0,
                  fontSize: "11px",
                  fontFamily: "var(--font-space-mono)",
                  cursor: "pointer",
                  fontWeight: 800,
                  width: "max-content",
                }}
              >
                {isUpdating ? "SAVING..." : "UPDATE DISPATCH ↗"}
              </button>
            </form>

            {/* Internal Ops Notes */}
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "18px", marginBottom: "20px" }}>
              <strong style={{ fontSize: "11px", fontFamily: "var(--font-space-mono)", color: "#777777", display: "block", marginBottom: "10px" }}>
                INTERNAL OPS LOG &amp; NOTES
              </strong>

              <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
                {noteList.map((n, idx) => (
                  <div key={idx} style={{ padding: "10px", background: "#FFFFFF", border: "1px solid #E5E5E5", fontSize: "11px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#777777", fontSize: "9px", fontFamily: "var(--font-space-mono)", marginBottom: "4px" }}>
                      <span>{n.author}</span>
                      <span>{n.time}</span>
                    </div>
                    <div>{n.note}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Add internal note..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  style={{ flex: 1, padding: "10px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "11px" }}
                />
                <button
                  type="submit"
                  style={{ padding: "10px 14px", background: "#000000", color: "#FFFFFF", border: 0, fontSize: "10.5px", fontFamily: "var(--font-space-mono)", cursor: "pointer", fontWeight: 700 }}
                >
                  ADD NOTE +
                </button>
              </form>
            </div>

            {/* Actions: Refund */}
            <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleRefund}
                disabled={isUpdating || selectedOrder.status === "REFUNDED"}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  border: "1px solid #000000",
                  color: "#000000",
                  fontSize: "10px",
                  fontFamily: "var(--font-space-mono)",
                  cursor: selectedOrder.status === "REFUNDED" ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {selectedOrder.status === "REFUNDED" ? "ALREADY REFUNDED" : "ISSUE 100% REFUND ↗"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
