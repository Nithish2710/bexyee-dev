import type { Metadata } from "next";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACHIEVEMENTS — Technical Milestones & Standards",
  description: "Material integrity benchmarks, zero-slowness frontend SLAs, and supply chain milestones.",
};

const MILESTONES = [
  {
    category: "FRONTEND ENGINEERING",
    title: "Zero-Slowness Progressive 3D Contract",
    metric: "0.00 CLS / < 300ms LCP",
    detail: "Immediate 0ms photographic layer rendering with non-blocking WebGL background hydration across Indian 4G connections.",
  },
  {
    category: "INVENTORY INTEGRITY",
    title: "Atomic Anti-Race Reservation Engine",
    metric: "100% Race-Safe",
    detail: "PostgreSQL row-level locking with 15-minute TTL auto-expiry preventing double selling during high-volume hype drops.",
  },
  {
    category: "TEXTILE CRAFT",
    title: "Proprietary 320 GSM Super Loopknit",
    metric: "100% Combed Cotton",
    detail: "Zero-slub circular combed loopknit eliminating synthetic polyester while preserving architectural boxy drape.",
  },
  {
    category: "SUSTAINABILITY",
    title: "100% Zero-Plastic Packaging Stack",
    metric: "180-Day Home Compostable",
    detail: "Cassava starch mailers and FSC-certified kraft paper cartons replacing conventional e-commerce polybags.",
  },
];

export default function AchievementsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="STANDARDS" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          TECHNICAL BENCHMARKS &amp; CRAFT INTEGRITY
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          ACHIEVEMENTS
        </h1>
        <p style={{ fontSize: "12px", color: "#a5a098", maxWidth: "550px", margin: "24px 0 0 0", lineHeight: "1.7" }}>
          Rigorous engineering standards applied across textile physics, high-concurrency payment safety, and digital performance.
        </p>
      </section>

      <section style={{ padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 80px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {MILESTONES.map((m) => (
            <div
              key={m.title}
              style={{
                border: "1px solid #242422",
                background: "#121210",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
              }}
            >
              <div>
                <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".1em" }}>
                  {m.category}
                </span>
                <h2 style={{ fontSize: "18px", margin: "8px 0 0 0", color: "#fff", letterSpacing: "-.04em" }}>
                  {m.title}
                </h2>
                <p style={{ fontSize: "11px", color: "#a5a098", margin: "8px 0 0 0", lineHeight: "1.6" }}>
                  {m.detail}
                </p>
              </div>

              <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #242422", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "9px", color: "#77736d" }}>BENCHMARK:</span>
                <strong style={{ fontSize: "13px", color: "#e52b20" }}>{m.metric}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
