import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

type CityDetail = {
  slug: string;
  cityName: string;
  state: string;
  coordinates: string;
  editionNumber: string;
  status: string;
  themeTitle: string;
  inspiration: string;
  palette: string;
  fabricSpec: string;
  dropDate: string;
  productSlug?: string;
};

const CITY_DETAILS: Record<string, CityDetail> = {
  bengaluru: {
    slug: "bengaluru",
    cityName: "BENGALURU",
    state: "KARNATAKA",
    coordinates: "12.9716° N, 77.5946° E",
    editionNumber: "DROP 001",
    status: "LIVE NOW",
    themeTitle: "SIGNAL AFTER RAIN",
    inspiration: "Shaped by wet asphalt, late amber signal flashers, and the nocturnal hum of the Outer Ring Road.",
    palette: "#e52b20 / Asphalt Black / Neon Amber",
    fabricSpec: "320 GSM Super Loopknit Combed Cotton",
    dropDate: "AUGUST 2026",
    productSlug: "bengaluru-tee",
  },
  mumbai: {
    slug: "mumbai",
    cityName: "MUMBAI",
    state: "MAHARASHTRA",
    coordinates: "18.9220° N, 72.8347° E",
    editionNumber: "DROP 002",
    status: "NOVEMBER 2026",
    themeTitle: "COASTAL CONCRETE & DUSK",
    inspiration: "Inspired by sea salt mist, tetrapods lining Marine Drive, and the golden hour reflection across Bandra.",
    palette: "#0055ff / Sea Salt / Seafoam Gray",
    fabricSpec: "320 GSM Heavy Loopknit Combed Cotton",
    dropDate: "NOVEMBER 2026",
    productSlug: "mumbai-tee",
  },
  delhi: {
    slug: "delhi",
    cityName: "DELHI",
    state: "NCR",
    coordinates: "28.6139° N, 77.2090° E",
    editionNumber: "DROP 003",
    status: "DECEMBER 2026",
    themeTitle: "MONUMENTAL FOG & NEON",
    inspiration: "Capturing the architectural weight of red sandstone monuments shrouded in winter fog with sharp neon contrast.",
    palette: "#d97706 / Smog Gray / Rust Red",
    fabricSpec: "340 GSM Heavyweight Knit Cotton",
    dropDate: "DECEMBER 2026",
    productSlug: "delhi-tee",
  },
  chennai: {
    slug: "chennai",
    cityName: "CHENNAI",
    state: "TAMIL NADU",
    coordinates: "13.0827° N, 80.2707° E",
    editionNumber: "DROP 004",
    status: "JANUARY 2027",
    themeTitle: "MARINA HEATWAVE",
    inspiration: "Coastal humidity, modernist railway arches, and high-contrast night light along Marina beach.",
    palette: "#059669 / Sand / Carbon Black",
    fabricSpec: "300 GSM Breathable High-Twist Knit",
    dropDate: "JANUARY 2027",
  },
  hyderabad: {
    slug: "hyderabad",
    cityName: "HYDERABAD",
    state: "TELANGANA",
    coordinates: "17.3850° N, 78.4867° E",
    editionNumber: "DROP 005",
    status: "FEBRUARY 2027",
    themeTitle: "CYBER ROCK & SHADOW",
    inspiration: "Ancient granite rock formations meeting cybernetic glass corridors in Hitec City.",
    palette: "#7c3aed / Granite / Neon Violet",
    fabricSpec: "320 GSM Super Loopknit Cotton",
    dropDate: "FEBRUARY 2027",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = CITY_DETAILS[slug.toLowerCase()];
  if (!city) return { title: "BEXYEE / City Drop Not Found" };
  return {
    title: `BEXYEE / ${city.cityName} — ${city.themeTitle}`,
    description: city.inspiration,
  };
}

export function generateStaticParams() {
  return Object.keys(CITY_DETAILS).map((slug) => ({ slug }));
}

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = CITY_DETAILS[slug.toLowerCase()];

  if (!city) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section={city.cityName} />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <span className={`status-pill ${city.status === "LIVE NOW" ? "live" : ""}`}>
            {city.status} • {city.editionNumber}
          </span>
          <span style={{ fontSize: "10px", color: "#8d8982" }}>{city.coordinates}</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          {city.cityName}
        </h1>
        <p style={{ fontSize: "18px", color: "#fff", margin: "16px 0 0 0", letterSpacing: "-.04em" }}>
          {city.themeTitle}
        </p>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "32px" }}>
        <div style={{ fontSize: "13px", lineHeight: "1.8", color: "#ccc8c0" }}>
          <p style={{ fontSize: "16px", color: "#ede9e1", lineHeight: "1.7", margin: "0 0 20px 0" }}>
            {city.inspiration}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              padding: "20px",
              background: "#121210",
              border: "1px solid #242422",
              marginTop: "24px",
            }}
          >
            <div>
              <span style={{ fontSize: "9px", color: "#8d8982", display: "block" }}>TEXTILE SPECIFICATION</span>
              <strong style={{ fontSize: "12px", color: "#fff" }}>{city.fabricSpec}</strong>
            </div>
            <div>
              <span style={{ fontSize: "9px", color: "#8d8982", display: "block" }}>PALETTE SYSTEM</span>
              <strong style={{ fontSize: "12px", color: "#fff" }}>{city.palette}</strong>
            </div>
            <div>
              <span style={{ fontSize: "9px", color: "#8d8982", display: "block" }}>RELEASE SCHEDULE</span>
              <strong style={{ fontSize: "12px", color: "#fff" }}>{city.dropDate}</strong>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px", background: "#121210", border: "1px solid #242422", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <strong style={{ fontSize: "14px", color: "#fff" }}>
              {city.status === "LIVE NOW" ? "UNIFORM AVAILABLE FOR PURCHASE" : "REGISTER FOR DROP ALERT"}
            </strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#8d8982" }}>
              Strictly capped at 100 individually numbered units.
            </p>
          </div>
          {city.productSlug ? (
            <Link
              href={`/products/${city.productSlug}`}
              style={{
                padding: "10px 18px",
                background: "#e52b20",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: ".1em",
              }}
            >
              VIEW GARMENT ↗
            </Link>
          ) : (
            <Link
              href="/cities"
              style={{
                padding: "10px 18px",
                background: "transparent",
                border: "1px solid #444",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: ".1em",
              }}
            >
              BACK TO ROSTER ↗
            </Link>
          )}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
