import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / COLLECTIONS — Micro-Batch Capsules",
  description: "Curated seasonal capsules and spatial collections by BEXYEE.",
};

const COLLECTIONS = [
  {
    slug: "monsoon-2026",
    title: "MONSOON 2026 / CITY TRANSIT",
    season: "AUTUMN / MONSOON 2026",
    totalUnits: "100 Units Worldwide",
    summary: "Heavyweight 320 GSM loopknit uniforms tailored for wet roads and high-humidity evening transits.",
    featuredCity: "Bengaluru",
    colorway: "Asphalt Black / Reflective Red",
  },
  {
    slug: "winter-grid-2026",
    title: "WINTER GRID / NORTHERN CORRIDORS",
    season: "WINTER 2026",
    totalUnits: "100 Units Worldwide",
    summary: "High-density 340 GSM architectural fleece and structured knitwear for northern city temperatures.",
    featuredCity: "Delhi NCR",
    colorway: "Smog Gray / Rust Red",
  },
  {
    slug: "coastal-dusk-2027",
    title: "COASTAL DUSK / TIDE LINE",
    season: "SPRING 2027",
    totalUnits: "100 Units Worldwide",
    summary: "Breathable combed cotton silhouettes engineered for humid coastal evenings.",
    featuredCity: "Mumbai & Chennai",
    colorway: "Sea Salt / Carbon",
  },
];

export default function CollectionsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="COLLECTIONS" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          SEASONAL RELEASES
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          COLLECTIONS
        </h1>
      </section>

      <section style={{ padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 80px)" }}>
        <div style={{ display: "grid", gap: "24px" }}>
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #242422",
                background: "#121210",
                padding: "32px 28px",
                display: "grid",
                gap: "12px",
                transition: "border-color 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8d8982" }}>
                <span>{col.season}</span>
                <span>{col.totalUnits}</span>
              </div>
              <h2 style={{ fontSize: "22px", margin: 0, letterSpacing: "-.04em", color: "#ede9e1" }}>
                {col.title}
              </h2>
              <p style={{ fontSize: "12px", color: "#a5a098", margin: 0, lineHeight: "1.6" }}>
                {col.summary}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "10px" }}>
                <span style={{ color: "#77736d" }}>PALETTE: {col.colorway}</span>
                <span style={{ color: "#e52b20" }}>EXPLORE CAPSULE ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
