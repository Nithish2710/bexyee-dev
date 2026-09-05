import type { Metadata } from "next";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / LOOKBOOK — Architectural Garment Photography",
  description: "Visual lookbook documenting BEXYEE city drops in real atmospheric environments.",
};

const LOOKS = [
  {
    edition: "DROP 001 — BENGALURU",
    image: "/bengaluru-signal-after-rain.svg",
    caption: "320 GSM Super Loopknit draped against the wet asphalt of MG Road flyover.",
  },
  {
    edition: "DETAIL — COORDINATE SLEEVE",
    image: "/assets/products/bengaluru-tee-left.svg",
    caption: "Tactile high-density coordinates patch (12.9716° N, 77.5946° E) on left sleeve.",
  },
  {
    edition: "DETAIL — BACK GRAPHIC",
    image: "/assets/products/bengaluru-tee-back.svg",
    caption: "Plastisol screenprint typography cured for flex resistance and zero cracking.",
  },
];

export default function LookbookPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="LOOKBOOK" />

      <section style={{ padding: "clamp(48px, 6vw, 90px) clamp(20px, 4vw, 80px)", background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "9px", color: "#777777", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            VISUAL ARCHIVE
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", margin: 0, letterSpacing: "-.08em", lineHeight: .95, color: "#000000" }}>
            EDITORIAL LOOKBOOK
          </h1>
        </div>
      </section>

      <section style={{ padding: "clamp(40px, 4vw, 60px) clamp(20px, 4vw, 80px)", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "36px" }}>
          {LOOKS.map((look, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #E5E5E5",
                background: "#FFFFFF",
                padding: "24px",
                display: "grid",
                gap: "16px",
              }}
            >
              <div style={{ background: "#F7F7F3", padding: "40px 20px", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "600px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={look.image}
                  alt={look.caption}
                  style={{ maxWidth: "100%", maxHeight: "520px", objectFit: "contain" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0F0EE", paddingTop: "14px", flexWrap: "wrap", gap: "8px" }}>
                <strong style={{ fontSize: "11px", color: "#000000" }}>{look.edition}</strong>
                <span style={{ fontSize: "12px", color: "#777777", fontFamily: "var(--font-space-grotesk)" }}>{look.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
