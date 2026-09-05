import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / JOURNAL — Editorial, Craft & Urban Culture",
  description: "Essays, technical fabric teardowns, and cultural dispatches from the BEXYEE Design Studio.",
};

export const ARTICLES = [
  {
    slug: "engineering-320-gsm-super-loopknit",
    title: "Engineering 320 GSM Super Loopknit: The Anatomy of Indian Heavyweight Cotton",
    category: "TEXTILE CRAFT",
    date: "AUG 2026",
    readingTime: "4 MIN READ",
    excerpt: "Why standard single jersey fails Indian monsoons and humidity, and how high-density zero-slub combed yarn creates an architectural drape.",
    author: "BEXYEE MATERIALS LAB",
    content: `
# Engineering 320 GSM Super Loopknit

Standard streetwear tees are typically constructed using 180 to 220 GSM single jersey cotton. In high humidity and tropical conditions, light jersey tends to cling, lose structural drape after two washes, and distort around collar ribbing.

### 1. The Fiber Foundation
We engineered BEXYEE's proprietary **320 GSM Super Loopknit** using 100% long-staple combed cotton sourced and spun in Coimbatore. Combing eliminates fibers shorter than 28mm, yielding a tight, lint-resistant yarn.

### 2. High-Density Micro-Loop Construction
Unlike standard French Terry which has loose backing loops, our Super Loopknit features closed-loop circular knitting. This imparts three key physical qualities:
* **Structural Rigidity**: The garment maintains a boxy silhouette without requiring synthetic polyester blending.
* **Thermal Breathability**: Micro-air pockets between the closed loops allow ambient air exchange during warm Indian evenings.
* **Hydrophilic Dye Absorption**: Custom reactive dyes penetrate deeply into the yarn core, ensuring fade resistance against intense UV exposure.

### 3. Ribbed Collar Integrity
Every collar is constructed with a 2x1 heavy rib integrated with Lycra elastane yarn, pre-shrunk before cutting to prevent bacon-neck stretching over hundreds of wears.
    `,
  },
  {
    slug: "signal-after-rain-visual-system",
    title: "Signal After Rain: Translating Bengaluru's Late-Night Monsoon into a Garment",
    category: "VISUAL IDENTITY",
    date: "AUG 2026",
    readingTime: "5 MIN READ",
    excerpt: "The typography, coordinate patches, and reflective red accents that define Drop 001.",
    author: "BEXYEE ART DIRECTION",
    content: `
# Signal After Rain: The Visual System

Bengaluru after midnight has a distinct rhythm. Rain on fresh asphalt, amber signal lights reflecting on wet tarmac, and empty flyovers connecting tech corridors to historic lanes.

### Coordinate Grid & Typography
Drop 001 incorporates high-density screen printing with industrial typography set in Space Mono. The coordinate patch on the left sleeve (\`12.9716° N, 77.5946° E\`) pins the design to the geographic center of the city.

### Screenprint Durability
We utilize silicone-enhanced plastisol inks cured at 165°C. The graphic print flexes with the heavy knit weave rather than cracking or flaking.
    `,
  },
  {
    slug: "zero-plastic-delivery-standards",
    title: "Zero-Plastic Delivery: Biodegradable Cassava Mailers & Recycled Cotton Tags",
    category: "SUSTAINABILITY",
    date: "JUL 2026",
    readingTime: "3 MIN READ",
    excerpt: "Eliminating single-use polybags from our supply chain with compostable plant-based packaging.",
    author: "OPERATIONS",
    content: `
# Zero-Plastic Packaging Architecture

Every year, millions of plastic polybags enter landfills from e-commerce apparel shipments. BEXYEE has eliminated 100% of non-biodegradable plastics from our packaging stack.

* **Cassava Starch Mailers**: 100% home compostable within 180 days.
* **Recycled Kraft Paper Envelopes**: FSC-certified cardboard protection for woven tags and receipts.
* **Organic Cotton Storage Bags**: Reusable garment covers designed for long-term wardrobe storage.
    `,
  },
];

export default function BlogIndexPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="JOURNAL" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          EDITORIAL &amp; TEXTILE DISPATCHES
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          THE JOURNAL
        </h1>
      </section>

      <section style={{ padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 80px)" }}>
        <div style={{ display: "grid", gap: "24px" }}>
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
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
                <span>{article.category}</span>
                <span>{article.date} • {article.readingTime}</span>
              </div>
              <h2 style={{ fontSize: "22px", margin: 0, letterSpacing: "-.04em", color: "#ede9e1" }}>
                {article.title}
              </h2>
              <p style={{ fontSize: "12px", color: "#a5a098", margin: 0, lineHeight: "1.6" }}>
                {article.excerpt}
              </p>
              <span style={{ fontSize: "9px", color: "#e52b20", marginTop: "8px" }}>
                READ ARTICLE ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
