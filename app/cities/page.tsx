import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / CITIES — Drops, Coordinates & Architecture",
  description: "City-by-city drop schedules, cultural coordinates, and architectural narratives by BEXYEE.",
};

const CITIES = [
  {
    city: "BENGALURU",
    state: "KARNATAKA",
    coords: "12.9716° N, 77.5946° E",
    drop: "DROP 001",
    status: "LIVE NOW",
    title: "SIGNAL AFTER RAIN",
    fabric: "320 GSM Super Loopknit",
    palette: "#e52b20 / Asphalt / Neon Amber",
    href: "/",
    active: true,
  },
  {
    city: "MUMBAI",
    state: "MAHARASHTRA",
    coords: "18.9220° N, 72.8347° E",
    drop: "DROP 002",
    status: "NOVEMBER 2026",
    title: "COASTAL CONCRETE & DUSK",
    fabric: "320 GSM Heavy Loopknit",
    palette: "#0055ff / Sea Salt / Seafoam",
    href: "/products/mumbai-tee",
    active: false,
  },
  {
    city: "DELHI",
    state: "NCR",
    coords: "28.6139° N, 77.2090° E",
    drop: "DROP 003",
    status: "DECEMBER 2026",
    title: "MONUMENTAL FOG & NEON",
    fabric: "340 GSM Heavy Knit",
    palette: "#d97706 / Smog Gray / Rust",
    href: "/products/delhi-tee",
    active: false,
  },
  {
    city: "CHENNAI",
    state: "TAMIL NADU",
    coords: "13.0827° N, 80.2707° E",
    drop: "DROP 004",
    status: "JANUARY 2027",
    title: "MARINA HEATWAVE",
    fabric: "300 GSM Breathable Knit",
    palette: "#059669 / Sand / Carbon",
    href: "/cities",
    active: false,
  },
  {
    city: "HYDERABAD",
    state: "TELANGANA",
    coords: "17.3850° N, 78.4867° E",
    drop: "DROP 005",
    status: "FEBRUARY 2027",
    title: "CYBER ROCK & SHADOW",
    fabric: "320 GSM Loopknit",
    palette: "#7c3aed / Granite / Neon Violet",
    href: "/cities",
    active: false,
  },
];

export default function CitiesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="CITIES" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          INDIAN URBAN TOPOGRAPHY
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          CITY ROSTER
        </h1>
        <p style={{ fontSize: "12px", color: "#a5a098", maxWidth: "550px", margin: "24px 0 0 0", lineHeight: "1.7" }}>
          Every city in the BEXYEE roster receives an authentic, micro-batch uniform shaped by its late-night atmosphere, infrastructure, and architectural pulse.
        </p>
      </section>

      <section style={{ padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 80px)" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          {CITIES.map((c) => (
            <div
              key={c.city}
              style={{
                border: "1px solid #242422",
                background: "#121210",
                padding: "24px 28px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <span className={`status-pill ${c.active ? "live" : ""}`} style={{ marginBottom: "6px" }}>
                  {c.status}
                </span>
                <h2 style={{ fontSize: "24px", margin: "4px 0 0 0", letterSpacing: "-.06em", color: "#ede9e1" }}>
                  {c.city}
                </h2>
                <small style={{ color: "#77736d", fontSize: "10px" }}>{c.state}</small>
              </div>

              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#ede9e1", fontWeight: 700 }}>
                  {c.title}
                </p>
                <small style={{ color: "#8d8982", fontSize: "10px" }}>{c.coords}</small>
              </div>

              <div>
                <span style={{ fontSize: "10px", color: "#8d8982", display: "block" }}>FABRIC &amp; PALETTE</span>
                <span style={{ fontSize: "11px", color: "#ccc8c0" }}>{c.fabric}</span>
              </div>

              <div style={{ textAlign: "right" }}>
                {c.active ? (
                  <Link
                    href={c.href}
                    style={{
                      padding: "10px 18px",
                      background: "#e52b20",
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "9px",
                      display: "inline-block",
                      letterSpacing: ".1em",
                    }}
                  >
                    ENTER DROP ↗
                  </Link>
                ) : (
                  <span style={{ fontSize: "9px", color: "#666" }}>LOCKED UNTIL LAUNCH</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
