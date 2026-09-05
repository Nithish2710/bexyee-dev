"use client";

import { useState } from "react";
import { type SizeChart, inchesToCm } from "../../lib/sizing";

export function SizeGuideModal({
  sizeChart,
  isOpen,
  onClose,
}: {
  sizeChart: SizeChart;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [unit, setUnit] = useState<"INCHES" | "CM">("INCHES");

  if (!isOpen) return null;

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          color: "#111111",
          maxWidth: "580px",
          width: "100%",
          padding: "32px",
          borderRadius: "2px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          fontFamily: "var(--font-space-mono), monospace",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "2px solid #111", paddingBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "#666", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
              FIT &amp; MEASUREMENTS
            </span>
            <h2 id="size-guide-title" style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {sizeChart.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f0f0f0",
              border: 0,
              color: "#111",
              fontSize: "14px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* Unit Toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setUnit("INCHES")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              background: unit === "INCHES" ? "#111" : "#f4f4f4",
              color: unit === "INCHES" ? "#fff" : "#666",
              border: 0,
              cursor: "pointer",
            }}
          >
            INCHES
          </button>
          <button
            type="button"
            onClick={() => setUnit("CM")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 700,
              background: unit === "CM" ? "#111" : "#f4f4f4",
              color: unit === "CM" ? "#fff" : "#666",
              border: 0,
              cursor: "pointer",
            }}
          >
            CM
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
          <thead>
            <tr style={{ background: "#f8f8f8", borderBottom: "2px solid #111" }}>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 800 }}>SIZE</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800 }}>CHEST</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800 }}>LENGTH</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800 }}>SHOULDER</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800 }}>SLEEVE</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => {
              const m = sizeChart.measurements[s] || { chest: 0, length: 0, shoulder: 0, sleeve: 0 };
              const val = (inch: number) => (unit === "INCHES" ? `${inch}"` : `${inchesToCm(inch)} cm`);

              return (
                <tr key={s} style={{ borderBottom: "1px solid #e5e5e5" }}>
                  <td style={{ padding: "12px", fontWeight: 800 }}>{s}</td>
                  <td style={{ textAlign: "right", padding: "12px" }}>{val(m.chest)}</td>
                  <td style={{ textAlign: "right", padding: "12px" }}>{val(m.length)}</td>
                  <td style={{ textAlign: "right", padding: "12px" }}>{val(m.shoulder)}</td>
                  <td style={{ textAlign: "right", padding: "12px" }}>{val(m.sleeve)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ background: "#f8f8f8", padding: "14px 16px", fontSize: "11px", color: "#555", lineHeight: 1.6, borderLeft: "3px solid #111" }}>
          <strong>FIT ADVICE:</strong> Engineered with a structured boxy streetwear drape. For an intended oversized fit, order your true size. For a standard tailored fit, size down by one.
        </div>
      </div>
    </div>
  );
}
