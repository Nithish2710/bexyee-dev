import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ABOUT — The Architectural City Uniform",
  description: "BEXYEE designs limited, numbered streetwear garments shaped by the geometry and small hours of Indian cities.",
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="ABOUT" />

      <section style={{ padding: "clamp(48px, 6vw, 90px) clamp(20px, 4vw, 80px)", background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ fontSize: "9px", color: "#777777", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            ORIGIN &amp; PHILOSOPHY
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", margin: 0, letterSpacing: "-.08em", lineHeight: .95, color: "#000000" }}>
            THE CITY UNIFORM
          </h1>
        </div>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "36px" }}>
        <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#333333", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          <p style={{ fontSize: "18px", color: "#000000", lineHeight: "1.6", margin: "0 0 24px 0", fontWeight: 700, fontFamily: "var(--font-space-mono), monospace" }}>
            BEXYEE was founded on a simple premise: Indian cities deserve authentic, heavyweight streetwear designed around their unique geometry, climate, and nightscapes.
          </p>

          <p>
            We reject the generic mass-production model of fast fashion. Instead, BEXYEE operates as a spatial design studio. Every edition is dedicated to a single city, limited to exactly 100 individually numbered units, and crafted with 320 GSM Super Loopknit combed cotton.
          </p>

          <h3 style={{ color: "#000000", fontSize: "18px", margin: "32px 0 12px 0", letterSpacing: "-.04em", fontFamily: "var(--font-space-mono), monospace" }}>
            01 / MICRO-BATCH INTEGRITY
          </h3>
          <p>
            When a drop sells out of its 100 units, the dye formulas and coordinate screens are retired. We do not re-release archival editions. This ensures that every piece remains a genuine cultural artifact for the collector.
          </p>

          <h3 style={{ color: "#000000", fontSize: "18px", margin: "32px 0 12px 0", letterSpacing: "-.04em", fontFamily: "var(--font-space-mono), monospace" }}>
            02 / TEXTILE ARCHITECTURE
          </h3>
          <p>
            Our patterns are engineered with dropped shoulders, elongated sleeves, and structured collars that retain their boxy silhouette across high humidity and frequent wear.
          </p>

          <h3 style={{ color: "#000000", fontSize: "18px", margin: "32px 0 12px 0", letterSpacing: "-.04em", fontFamily: "var(--font-space-mono), monospace" }}>
            03 / DIGITAL SOVEREIGNTY
          </h3>
          <p>
            The BEXYEE digital platform runs on a custom, high-speed Next.js and Supabase architecture with atomic inventory locks and zero-slowness progressive 3D rendering.
          </p>
        </div>

        <div style={{ padding: "28px", background: "#FFFFFF", border: "1px solid #E5E5E5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <strong style={{ fontSize: "14px", color: "#000000" }}>EXPLORE CURRENT DROP</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#777777" }}>Drop 001 — Bengaluru / Signal After Rain</p>
          </div>
          <Link
            href="/product/bengaluru-tee"
            style={{
              padding: "12px 24px",
              background: "#000000",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: ".1em",
            }}
          >
            ENTER STORE ↗
          </Link>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
