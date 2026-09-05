import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

type CollectionDetail = {
  slug: string;
  title: string;
  season: string;
  description: string;
  lookNotes: string[];
  productSlugs: Array<{ name: string; slug: string; pricePaise: number; edition: string }>;
};

const COLLECTIONS: Record<string, CollectionDetail> = {
  "monsoon-2026": {
    slug: "monsoon-2026",
    title: "MONSOON 2026 / CITY TRANSIT",
    season: "AUTUMN / MONSOON 2026",
    description: "The inaugural capsule exploring late-night Bangalore transit, high-density combed loopknit, and industrial coordinates typography.",
    lookNotes: [
      "Heavyweight 320 GSM combed cotton structured for high-humidity resistance.",
      "Dropped-shoulder boxy fit with Lycra-reinforced collar ribbing.",
      "Reflective coordinates screenprint cured for zero flaking.",
    ],
    productSlugs: [
      { name: "Bengaluru Heavyweight Tee", slug: "bengaluru-tee", pricePaise: 179900, edition: "001 / 100" },
    ],
  },
  "winter-grid-2026": {
    slug: "winter-grid-2026",
    title: "WINTER GRID / NORTHERN CORRIDORS",
    season: "WINTER 2026",
    description: "High-density 340 GSM architectural fleece and structured knitwear for northern city temperatures.",
    lookNotes: [
      "Dense weave for windchill resistance across open metro corridors.",
      "Minimalist rust-red accenting on muted charcoal bases.",
    ],
    productSlugs: [
      { name: "Delhi Winter Loopknit Tee", slug: "delhi-tee", pricePaise: 199900, edition: "003 / 100" },
    ],
  },
  "coastal-dusk-2027": {
    slug: "coastal-dusk-2027",
    title: "COASTAL DUSK / TIDE LINE",
    season: "SPRING 2027",
    description: "Breathable combed cotton silhouettes engineered for humid coastal evenings in Mumbai and Chennai.",
    lookNotes: [
      "Breathable high-twist yarn construction for maximum thermal ventilation.",
      "Sea salt and carbon gray color palette.",
    ],
    productSlugs: [
      { name: "Mumbai Coastal Heavyweight Tee", slug: "mumbai-tee", pricePaise: 189900, edition: "002 / 100" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTIONS[slug];
  if (!col) return { title: "BEXYEE / Collection Not Found" };
  return {
    title: `BEXYEE / ${col.title}`,
    description: col.description,
  };
}

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = COLLECTIONS[slug];

  if (!col) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="COLLECTIONS" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          {col.season}
        </p>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 68px)", margin: 0, letterSpacing: "-.06em", lineHeight: 1 }}>
          {col.title}
        </h1>
        <p style={{ fontSize: "14px", color: "#a5a098", maxWidth: "600px", margin: "20px 0 0 0", lineHeight: "1.7" }}>
          {col.description}
        </p>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "36px" }}>
        <div>
          <h2 style={{ fontSize: "16px", color: "#fff", marginBottom: "16px", letterSpacing: "-.02em" }}>
            CAPSULE SPECIFICATIONS
          </h2>
          <ul style={{ paddingLeft: "18px", margin: 0, display: "grid", gap: "10px", fontSize: "12px", color: "#ccc8c0", lineHeight: "1.7" }}>
            {col.lookNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "16px", color: "#fff", marginBottom: "16px", letterSpacing: "-.02em" }}>
            GARMENTS IN CAPSULE
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {col.productSlugs.map((prod) => (
              <Link
                key={prod.slug}
                href={`/products/${prod.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #242422",
                  background: "#121210",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff" }}>{prod.name}</strong>
                  <span style={{ fontSize: "10px", color: "#8d8982", display: "block", marginTop: "2px" }}>
                    {prod.edition}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: 700 }}>
                    ₹{(prod.pricePaise / 100).toLocaleString("en-IN")}
                  </span>
                  <span style={{ fontSize: "9px", color: "#e52b20", display: "block", marginTop: "2px" }}>
                    VIEW GARMENT ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
