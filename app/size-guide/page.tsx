import type { Metadata } from "next";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / SIZE GUIDE — Heavyweight Oversized Cut Measurements",
  description: "Accurate physical garment dimensions (Chest, Length, Shoulder, Sleeve) for BEXYEE heavyweight garments.",
};

export default function SizeGuidePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="SIZING" />

      <section style={{ padding: "clamp(48px, 6vw, 90px) clamp(20px, 4vw, 80px)", background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ fontSize: "9px", color: "#777777", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            GARMENT ARCHITECTURE &amp; PROPORTIONS
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", margin: 0, letterSpacing: "-.08em", lineHeight: .95, color: "#000000" }}>
            SIZE MATRIX
          </h1>
          <p style={{ fontSize: "13px", color: "#555555", maxWidth: "600px", margin: "20px 0 0 0", lineHeight: "1.7", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            All BEXYEE garments feature an engineered oversized cut with dropped shoulders and a structured boxy torso. We recommend taking your true size for the intended streetwear silhouette.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "36px" }}>
        <div style={{ overflowX: "auto", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left", color: "#000000" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #000000", color: "#777777" }}>
                <th style={{ padding: "14px 16px" }}>SIZE</th>
                <th style={{ padding: "14px 16px" }}>CHEST (INCHES)</th>
                <th style={{ padding: "14px 16px" }}>LENGTH (INCHES)</th>
                <th style={{ padding: "14px 16px" }}>SHOULDER (INCHES)</th>
                <th style={{ padding: "14px 16px" }}>SLEEVE (INCHES)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td style={{ padding: "14px 16px", color: "#000000", fontWeight: 700 }}>S (SMALL)</td>
                <td style={{ padding: "14px 16px" }}>44″</td>
                <td style={{ padding: "14px 16px" }}>29″</td>
                <td style={{ padding: "14px 16px" }}>21.5″</td>
                <td style={{ padding: "14px 16px" }}>9.5″</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td style={{ padding: "14px 16px", color: "#000000", fontWeight: 700 }}>M (MEDIUM)</td>
                <td style={{ padding: "14px 16px" }}>46″</td>
                <td style={{ padding: "14px 16px" }}>30″</td>
                <td style={{ padding: "14px 16px" }}>22.5″</td>
                <td style={{ padding: "14px 16px" }}>10.0″</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td style={{ padding: "14px 16px", color: "#000000", fontWeight: 700 }}>L (LARGE)</td>
                <td style={{ padding: "14px 16px" }}>48″</td>
                <td style={{ padding: "14px 16px" }}>31″</td>
                <td style={{ padding: "14px 16px" }}>23.5″</td>
                <td style={{ padding: "14px 16px" }}>10.5″</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <td style={{ padding: "14px 16px", color: "#000000", fontWeight: 700 }}>XL (EXTRA LARGE)</td>
                <td style={{ padding: "14px 16px" }}>50″</td>
                <td style={{ padding: "14px 16px" }}>32″</td>
                <td style={{ padding: "14px 16px" }}>24.5″</td>
                <td style={{ padding: "14px 16px" }}>11.0″</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: "28px", background: "#FFFFFF", border: "1px solid #E5E5E5" }}>
          <strong style={{ fontSize: "14px", color: "#000000", display: "block", marginBottom: "12px" }}>
            HOW TO MEASURE
          </strong>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#555555", lineHeight: "1.8", fontFamily: "var(--font-space-grotesk)" }}>
            <li><strong>Chest</strong>: Measure flat across the fullest part of the chest from armpit to armpit.</li>
            <li><strong>Length</strong>: Measure from the highest point of the collar ribbing to the bottom hemline.</li>
            <li><strong>Shoulder</strong>: Measure seam to seam across the back.</li>
          </ul>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
