"use client";

import { useEffect, useState } from "react";
import { type SizeChart, DEFAULT_APPAREL_SIZE_CHART } from "../../lib/sizing";

export function SizeChartsCenter() {
  const [charts, setCharts] = useState<SizeChart[]>([DEFAULT_APPAREL_SIZE_CHART]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChartName, setNewChartName] = useState("");
  const [newMeasurements, setNewMeasurements] = useState({
    S: { length: 28.5, chest: 42.0, shoulder: 20.5, sleeve: 8.5 },
    M: { length: 29.5, chest: 44.0, shoulder: 21.5, sleeve: 9.0 },
    L: { length: 30.5, chest: 46.0, shoulder: 22.5, sleeve: 9.5 },
    XL: { length: 31.5, chest: 48.0, shoulder: 23.5, sleeve: 10.0 },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCharts() {
      try {
        const res = await fetch("/api/admin/size-charts");
        const data = await res.json();
        if (data.sizeCharts) setCharts(data.sizeCharts);
      } catch {
        // Fallback default remains
      } finally {
        setLoading(false);
      }
    }
    void loadCharts();
  }, []);

  async function handleCreateChart(e: React.FormEvent) {
    e.preventDefault();
    if (!newChartName.trim()) return;

    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/size-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChartName.trim(),
          category: "APPAREL_TOPS",
          unit: "INCHES",
          measurements: newMeasurements,
          isDefault: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create size chart.");

      if (data.sizeChart) {
        setCharts((prev) => [data.sizeChart, ...prev]);
        setShowCreateModal(false);
        setNewChartName("");
        setMessage("Size chart created successfully.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error saving size chart.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "20px 24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000000" }}>Reusable Size Charts</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#777777" }}>
            Size charts are reusable references. New products reuse existing charts to eliminate measurement drift.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "#000000",
            color: "#FFFFFF",
            border: 0,
            padding: "10px 18px",
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          + CREATE NEW SIZE CHART
        </button>
      </div>

      {message && (
        <div style={{ padding: "10px 14px", background: "#F7F7F3", border: "1px solid #000000", color: "#000000", fontSize: "11.5px", fontWeight: 700 }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#777777", fontSize: "12px", padding: "20px" }}>Loading size charts...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
          {charts.map((chart) => (
            <div
              key={chart.id || chart.name}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                padding: "24px",
                borderRadius: "2px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
                <strong style={{ color: "#000000", fontSize: "15px" }}>{chart.name}</strong>
                {chart.isDefault && (
                  <span style={{ fontSize: "9px", background: "#000000", color: "#FFFFFF", padding: "2px 8px", fontWeight: 700, letterSpacing: "0.1em" }}>
                    DEFAULT
                  </span>
                )}
              </div>

              <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", color: "#000000" }}>
                <thead>
                  <tr style={{ color: "#777777", borderBottom: "1px solid #E5E5E5" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Size</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Length</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Chest</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Shoulder</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {["S", "M", "L", "XL"].map((s) => {
                    const m = chart.measurements[s] || { length: 0, chest: 0, shoulder: 0, sleeve: 0 };
                    return (
                      <tr key={s} style={{ borderBottom: "1px solid #F0F0EE" }}>
                        <td style={{ padding: "8px 4px", fontWeight: 700, color: "#000000" }}>{s}</td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>{m.length}&quot;</td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>{m.chest}&quot;</td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>{m.shoulder}&quot;</td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>{m.sleeve}&quot;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Modal to create custom size chart (White Surface) */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleCreateChart}
            style={{
              background: "#FFFFFF",
              border: "1px solid #000000",
              padding: "32px",
              maxWidth: "540px",
              width: "100%",
              color: "#000000",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px" }}>Create Reusable Size Chart</h3>
            <label style={{ fontSize: "11px", color: "#555555", fontWeight: 700 }}>
              Chart Name *
              <input
                type="text"
                value={newChartName}
                onChange={(e) => setNewChartName(e.target.value)}
                placeholder="e.g. Heavyweight Boxy Tee (2026 Edition)"
                required
                style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "10px", color: "#000000", marginTop: "4px" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {(["S", "M", "L", "XL"] as const).map((s) => (
                <div key={s} style={{ background: "#F7F7F3", padding: "12px", border: "1px solid #E5E5E5" }}>
                  <strong style={{ fontSize: "12px", display: "block", marginBottom: "6px" }}>Size {s}</strong>
                  <label style={{ fontSize: "9px", color: "#777777" }}>Len: <input type="number" step="0.1" value={newMeasurements[s].length} onChange={(e) => setNewMeasurements((p) => ({ ...p, [s]: { ...p[s], length: parseFloat(e.target.value) || 0 } }))} style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000", padding: "4px" }} /></label>
                  <label style={{ fontSize: "9px", color: "#777777" }}>Chest: <input type="number" step="0.1" value={newMeasurements[s].chest} onChange={(e) => setNewMeasurements((p) => ({ ...p, [s]: { ...p[s], chest: parseFloat(e.target.value) || 0 } }))} style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000", padding: "4px" }} /></label>
                  <label style={{ fontSize: "9px", color: "#777777" }}>Shldr: <input type="number" step="0.1" value={newMeasurements[s].shoulder} onChange={(e) => setNewMeasurements((p) => ({ ...p, [s]: { ...p[s], shoulder: parseFloat(e.target.value) || 0 } }))} style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000", padding: "4px" }} /></label>
                  <label style={{ fontSize: "9px", color: "#777777" }}>Slv: <input type="number" step="0.1" value={newMeasurements[s].sleeve} onChange={(e) => setNewMeasurements((p) => ({ ...p, [s]: { ...p[s], sleeve: parseFloat(e.target.value) || 0 } }))} style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000", padding: "4px" }} /></label>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: "transparent", border: "1px solid #E5E5E5", color: "#777777", padding: "8px 16px", cursor: "pointer" }}>Cancel</button>
              <button type="submit" disabled={isSaving} style={{ background: "#000000", border: 0, color: "#FFFFFF", padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}>{isSaving ? "Saving..." : "Save Chart"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
