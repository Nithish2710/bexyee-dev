"use client";

import { useEffect, useState } from "react";

export type InventoryRow = {
  productId: string;
  productName: string;
  productSku: string;
  cityName: string;
  size: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
  threshold: number;
  status: "ACTIVE" | "LOW" | "SOLD OUT";
};

export type AdjustmentAudit = {
  id: string;
  product_id: string;
  size: string;
  delta: number;
  stock_before: number;
  stock_after: number;
  reason: string;
  created_at: string;
  products?: { name: string; sku: string };
};

export function InventoryControlRoom({
  products,
}: {
  products: Array<{ id: string; name: string; sku: string }>;
}) {
  const [matrix, setMatrix] = useState<InventoryRow[]>([]);
  const [adjustments, setAdjustments] = useState<AdjustmentAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single Adjustment Modal / State
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk Adjustment Mode
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkProductId, setBulkProductId] = useState(products[0]?.id || "");
  const [bulkS, setBulkS] = useState("0");
  const [bulkM, setBulkM] = useState("0");
  const [bulkL, setBulkL] = useState("0");
  const [bulkXL, setBulkXL] = useState("0");
  const [bulkReason, setBulkReason] = useState("Factory restock drop");

  async function refreshInventory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch inventory.");
      setMatrix(data.matrix || []);
      setAdjustments(data.recentAdjustments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.error) setError(data.error);
        else {
          setMatrix(data.matrix || []);
          setAdjustments(data.recentAdjustments || []);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Error fetching inventory.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRow) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedRow.productId,
          size: selectedRow.size,
          delta: Number(delta),
          reason: reason || "Manual adjustment via admin control center",
          lowStockThreshold: threshold ? Number(threshold) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Adjustment failed.");

      setSelectedRow(null);
      setDelta("");
      setReason("");
      setThreshold("");
      await refreshInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving adjustment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBulkSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetProductId = bulkProductId || products[0]?.id;
    if (!targetProductId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const adjustmentsList = [
        { productId: targetProductId, size: "S" as const, delta: Number(bulkS) },
        { productId: targetProductId, size: "M" as const, delta: Number(bulkM) },
        { productId: targetProductId, size: "L" as const, delta: Number(bulkL) },
        { productId: targetProductId, size: "XL" as const, delta: Number(bulkXL) },
      ].filter((item) => item.delta !== 0);

      if (adjustmentsList.length === 0) {
        setError("Enter at least one non-zero stock adjustment.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adjustments: adjustmentsList,
          defaultReason: bulkReason || "Bulk stock intake",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bulk adjustment failed.");

      setBulkMode(false);
      setBulkS("0");
      setBulkM("0");
      setBulkL("0");
      setBulkXL("0");
      await refreshInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error performing bulk adjustment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            INVENTORY COMMAND &amp; STOCK MATRIX
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff" }}>
            Stock Allocations &amp; Reservations
          </h2>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setBulkMode((prev) => !prev)}
            style={{
              background: bulkMode ? "#e52b20" : "#1a1a18",
              color: "#fff",
              border: "1px solid #333",
              fontSize: "10px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {bulkMode ? "✕ CLOSE BULK INTAKE" : "⚡ BULK STOCK INTAKE"}
          </button>

          <button
            type="button"
            onClick={refreshInventory}
            style={{ background: "#111", color: "#ede9e1", border: "1px solid #333", fontSize: "10px", padding: "8px 14px", cursor: "pointer" }}
          >
            REFRESH MATRIX ↺
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(229, 43, 32, 0.15)", border: "1px solid #e52b20", color: "#ff8580", fontSize: "11px" }}>
          ⚠ {error}
        </div>
      )}

      {/* Bulk Intake Modal / Panel */}
      {bulkMode && (
        <form onSubmit={handleBulkSubmit} style={{ background: "#11110f", border: "1px solid #333", padding: "20px", borderRadius: "4px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#fff", letterSpacing: "0.04em" }}>
            BULK STOCK ADJUSTMENT (BATCH INTAKE)
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <label>
              Target Product
              <select value={bulkProductId} onChange={(e) => setBulkProductId(e.target.value)}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Size S Delta (+ / -)
              <input type="number" value={bulkS} onChange={(e) => setBulkS(e.target.value)} />
            </label>

            <label>
              Size M Delta (+ / -)
              <input type="number" value={bulkM} onChange={(e) => setBulkM(e.target.value)} />
            </label>

            <label>
              Size L Delta (+ / -)
              <input type="number" value={bulkL} onChange={(e) => setBulkL(e.target.value)} />
            </label>

            <label>
              Size XL Delta (+ / -)
              <input type="number" value={bulkXL} onChange={(e) => setBulkXL(e.target.value)} />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              Batch Reason / Factory PO Reference
              <input
                type="text"
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                placeholder="e.g. Factory Batch #004 delivery from Tiruppur unit"
                required
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ background: "#e52b20", color: "#fff", border: 0, padding: "10px 20px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
            >
              {isSubmitting ? "PROCESSING BATCH..." : "COMMIT BULK ADJUSTMENT ↗"}
            </button>
            <button
              type="button"
              onClick={() => setBulkMode(false)}
              style={{ background: "transparent", border: "1px solid #444", color: "#aaa", padding: "10px 16px", fontSize: "11px", cursor: "pointer" }}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Main Stock Matrix Table */}
      <div style={{ background: "#0e0e0d", border: "1px solid #242422", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "11px" }}>
          <thead>
            <tr style={{ background: "#141412", borderBottom: "1px solid #282826", color: "#8d8982" }}>
              <th style={{ padding: "12px 16px" }}>PRODUCT</th>
              <th style={{ padding: "12px" }}>SIZE</th>
              <th style={{ padding: "12px" }}>PHYSICAL</th>
              <th style={{ padding: "12px" }}>RESERVED</th>
              <th style={{ padding: "12px" }}>AVAILABLE</th>
              <th style={{ padding: "12px" }}>THRESHOLD</th>
              <th style={{ padding: "12px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                  Calculating live stock matrix...
                </td>
              </tr>
            ) : matrix.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                  No inventory entries registered. Create your first product above.
                </td>
              </tr>
            ) : (
              matrix.map((row) => (
                <tr key={`${row.productId}-${row.size}`} style={{ borderBottom: "1px solid #1a1a18" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <strong style={{ color: "#fff", display: "block" }}>{row.productName}</strong>
                    <small style={{ color: "#777" }}>{row.productSku} • {row.cityName}</small>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontWeight: 700, color: "#ede9e1" }}>{row.size}</span>
                  </td>
                  <td style={{ padding: "12px", color: "#fff" }}>{row.physicalStock}</td>
                  <td style={{ padding: "12px", color: row.reservedStock > 0 ? "#f59e0b" : "#666" }}>
                    {row.reservedStock}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <strong style={{ color: row.availableStock === 0 ? "#ef4444" : "#4ade80" }}>
                      {row.availableStock}
                    </strong>
                  </td>
                  <td style={{ padding: "12px", color: "#888" }}>{row.threshold}</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "2px",
                        background:
                          row.status === "ACTIVE"
                            ? "rgba(74, 222, 128, 0.1)"
                            : row.status === "LOW"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        color:
                          row.status === "ACTIVE"
                            ? "#4ade80"
                            : row.status === "LOW"
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRow(row);
                        setDelta("");
                        setThreshold(String(row.threshold));
                      }}
                      style={{ background: "#1a1a18", border: "1px solid #333", color: "#fff", fontSize: "9.5px", padding: "4px 10px", cursor: "pointer" }}
                    >
                      ADJUST ✎
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Single Adjustment Modal */}
      {selectedRow && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <form onSubmit={handleSingleSubmit} style={{ background: "#121210", border: "1px solid #333", padding: "24px", maxWidth: "450px", width: "100%" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#fff" }}>
              ADJUST STOCK: {selectedRow.productName} ({selectedRow.size})
            </h3>
            <p style={{ fontSize: "10px", color: "#888", marginBottom: "16px" }}>
              Current Physical: {selectedRow.physicalStock} | Reserved: {selectedRow.reservedStock} | Available: {selectedRow.availableStock}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <label>
                Stock Delta (+ to add units, - to deduct) *
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  placeholder="e.g. +10 or -5"
                  required
                />
              </label>

              <label>
                Low-Stock Threshold
                <input
                  type="number"
                  min="0"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="5"
                />
              </label>

              <label>
                Adjustment Reason *
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Returned parcel, damaged item, physical audit count"
                  required
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ background: "#e52b20", color: "#fff", border: 0, padding: "10px 18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
              >
                {isSubmitting ? "SAVING..." : "COMMIT ADJUSTMENT"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                style={{ background: "transparent", border: "1px solid #444", color: "#888", padding: "10px 14px", fontSize: "11px", cursor: "pointer" }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Audit History Log */}
      <div style={{ background: "#0e0e0d", border: "1px solid #242422", padding: "20px" }}>
        <h3 style={{ margin: "0 0 14px 0", fontSize: "12px", color: "#8d8982", letterSpacing: "0.14em" }}>
          IMMUTABLE INVENTORY AUDIT LOG (RECENT 50 ADJUSTMENTS)
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
          {adjustments.length === 0 ? (
            <p style={{ fontSize: "10.5px", color: "#666", margin: 0 }}>No adjustment logs recorded yet.</p>
          ) : (
            adjustments.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "10.5px",
                  padding: "8px 12px",
                  background: "#141412",
                  border: "1px solid #1f1f1d",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <strong style={{ color: "#fff" }}>
                    {a.products?.name ?? a.product_id.slice(0, 8)} ({a.size})
                  </strong>
                  <span style={{ color: "#888", marginLeft: "8px" }}>{a.reason}</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ color: a.delta > 0 ? "#4ade80" : "#ff7a73", fontWeight: 700 }}>
                    {a.delta > 0 ? `+${a.delta}` : a.delta} ({a.stock_before} → {a.stock_after})
                  </span>
                  <span style={{ color: "#555", fontSize: "9px" }}>
                    {new Date(a.created_at).toLocaleDateString()} {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
