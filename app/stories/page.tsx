import type { Metadata } from "next";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / STORIES — City Dispatches & Street Culture",
  description: "Chronicles and photographic stories of creators, skaters, and late-night city culture across India.",
};

const STORIES = [
  {
    title: "The Midnight Cyclists of MG Road",
    city: "BENGALURU",
    date: "AUG 2026",
    summary: "Documenting the fixed-gear and courier crew navigating Bangalore's arterial flyovers after the traffic lights turn to amber flashers.",
  },
  {
    title: "Under the Bandra-Worli Sea Link",
    city: "MUMBAI",
    date: "JUL 2026",
    summary: "Skate sessions against the salt air and monsoon mist beneath the concrete pillars of the Western Freeway.",
  },
  {
    title: "Neon Alleyways of Chandni Chowk",
    city: "DELHI",
    date: "JUN 2026",
    summary: "Capturing the interplay of Mughal red stone, tangled overhead cabling, and vibrant neon signage at 3 AM.",
  },
];

export default function StoriesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="STORIES" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          CULTURAL DISPATCHES
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          CITY STORIES
        </h1>
      </section>

      <section style={{ padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 80px)" }}>
        <div style={{ display: "grid", gap: "20px" }}>
          {STORIES.map((s) => (
            <div
              key={s.title}
              style={{
                border: "1px solid #242422",
                background: "#121210",
                padding: "28px",
                display: "grid",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8d8982" }}>
                <span>{s.city}</span>
                <span>{s.date}</span>
              </div>
              <h2 style={{ fontSize: "20px", margin: 0, color: "#fff", letterSpacing: "-.04em" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: "12px", color: "#a5a098", margin: 0, lineHeight: "1.6" }}>
                {s.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
