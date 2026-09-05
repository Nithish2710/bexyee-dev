import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "../src/lib/supabase-server";
import { getProductExperienceData, getStorefrontCatalogProducts, type UnifiedProduct } from "../src/lib/product-engine";
import { GlobalHeader } from "../src/components/navigation/GlobalHeader";
import { StorefrontFooter } from "../src/components/navigation/StorefrontFooter";
import { HomeHero } from "../src/components/home/HomeHero";

export const revalidate = 0; // Dynamic server rendering to always reflect live database state

export type CityCampaign = {
  productId: string;
  productName: string;
  cityName: string;
  campaignTitle: string;
  backgroundImage: string;
  mobileBackgroundImage?: string;
  accentColor: string;
  productModel: string;
  frontImage: string;
  backImage: string;
  leftSleeveImage: string;
  rightSleeveImage: string;
  printImage: string;
  edition: string;
  price: number;
  compareAtPrice: number | null;
  fabric: string;
  gsm: number;
  fit: string;
  sku: string;
  sizes: string[];
  stock: Record<string, number>;
  inspiration: string;
  status?: string;
  launchDateNote?: string;
  href?: string;
  pricePaise?: number;
  isLive?: boolean;
};

const LOOKBOOK_CARDS = [
  {
    src: "/assets/products/bengaluru-tee-front.svg",
    title: "BENGALURU // FRONT PROFILE",
    location: "MG Road Signal (12.9756° N, 77.6066° E)",
    tag: "320 GSM LOOPKNIT",
  },
  {
    src: "/assets/products/bengaluru-tee-back.svg",
    title: "TYPOGRAPHIC BACK ARCHITECTURE",
    location: "Indiranagar 100ft Road (12.9784° N, 77.6408° E)",
    tag: "HIGH-DENSITY SILKSCREEN",
  },
  {
    src: "/assets/products/bengaluru-tee-print.svg",
    title: "HIGH-DENSITY EMBLEM DETAIL",
    location: "Silk Board Dusk Junction (12.9172° N, 77.6227° E)",
    tag: "CURED PLASTISOL",
  },
];

const METROPOLIS_NETWORK = [
  {
    city: "BENGALURU",
    coords: "12.9716° N, 77.5946° E",
    drop: "DROP 001",
    status: "LIVE STOREFRONT",
    href: "/product/bengaluru-tee",
    isLive: true,
  },
  {
    city: "MUMBAI",
    coords: "18.9220° N, 72.8347° E",
    drop: "DROP 002",
    status: "SCHEDULED",
    href: "/cities/mumbai",
    isLive: false,
  },
  {
    city: "DELHI",
    coords: "28.6139° N, 77.2090° E",
    drop: "DROP 003",
    status: "DEVELOPMENT",
    href: "/cities/delhi",
    isLive: false,
  },
  {
    city: "CHENNAI",
    coords: "13.0827° N, 80.2707° E",
    drop: "DROP 004",
    status: "SCHEDULED",
    href: "/cities/chennai",
    isLive: false,
  },
  {
    city: "KOLKATA",
    coords: "22.5726° N, 88.3639° E",
    drop: "DROP 005",
    status: "PLANNED",
    href: "/cities/kolkata",
    isLive: false,
  },
];

export default async function HomePage() {
  const supabase = supabaseServer;
  let featuredProduct: UnifiedProduct | null = null;
  let catalogProducts: UnifiedProduct[] = [];

  try {
    // 1. Fetch the primary featured product (Bengaluru or first active)
    featuredProduct = await getProductExperienceData("bengaluru-tee", { allowDraft: false });

    // 2. Fetch all active storefront products using single source of truth
    const rawCatalogItems = await getStorefrontCatalogProducts();
    if (rawCatalogItems.length > 0) {
      const productPromises = rawCatalogItems.slice(0, 6).map((item) =>
        getProductExperienceData(item.slug || item.id, { allowDraft: false }).catch(() => null)
      );
      const resolved = await Promise.all(productPromises);
      catalogProducts = resolved.filter((p): p is UnifiedProduct => p !== null);
    }

    // Fallback: If no catalog products in list query, use featured product if active
    if (catalogProducts.length === 0 && featuredProduct) {
      catalogProducts = [featuredProduct];
    }
  } catch (error) {
    console.error("HomePage data resolution failed:", error);
  }

  // Determine active product for New Drop highlight
  const spotlightProduct = featuredProduct || (catalogProducts.length > 0 ? catalogProducts[0] : null);

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      {/* 1. Global Header */}
      <GlobalHeader section="HOME" />

      {/* 2. Hero Section: Product-First Immersive Campaign Canvas */}
      <HomeHero product={featuredProduct} />

      {/* 3. Section: NEW DROP // CAPSULE SPOTLIGHT */}
      {spotlightProduct && (
        <section className="home-section" aria-label="Active Capsule Drop">
          <div className="section-header-row">
            <div>
              <p className="section-kicker">ACTIVE DROP // NUMBERED CAPSULE</p>
              <h2 className="section-heading">NEW DROP // {spotlightProduct.cityName}</h2>
            </div>
            <Link href={`/product/${spotlightProduct.slug}`} className="section-header-link">
              EXPLORE CAPSULE ↗
            </Link>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              overflow: "hidden",
            }}
          >
            {/* Left: Product Visual */}
            <div
              style={{
                position: "relative",
                aspectRatio: "1/1",
                background: "#F0F0EC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "36px",
              }}
            >
              <Image
                src={spotlightProduct.assets.frontImage || "/assets/products/bengaluru-tee-front.svg"}
                alt={spotlightProduct.name}
                width={500}
                height={500}
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
                priority
              />
              <div style={{ position: "absolute", top: "20px", left: "20px" }}>
                <span className="card-status-pill">
                  {spotlightProduct.launch.purchaseMode === "PREBOOK" ? "PRE-BOOK ACTIVE" : "LIMITED EDITION"}
                </span>
              </div>
            </div>

            {/* Right: Technical & Purchase Details */}
            <div
              style={{
                padding: "clamp(32px, 5vw, 64px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                borderLeft: "1px solid #F0F0EE",
              }}
            >
              <div>
                <span style={{ font: "9.5px var(--font-space-mono), monospace", color: "#888888", letterSpacing: ".14em", textTransform: "uppercase" }}>
                  EDITION {spotlightProduct.edition} // 100 NUMBERED UNITS
                </span>
                <h3 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, margin: "8px 0 16px 0", letterSpacing: "-.04em", textTransform: "uppercase" }}>
                  {spotlightProduct.name}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#555555", margin: 0 }}>
                  {spotlightProduct.description ||
                    "Engineered from 320 GSM Super Loopknit combed cotton. Designed around the wet asphalt, neon reflections, and late-night geometry of MG Road after heavy monsoon showers."}
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" }}>
                  <span className="spec-pill">{spotlightProduct.fabric || "320 GSM SUPER LOOPKNIT"}</span>
                  <span className="spec-pill">{spotlightProduct.fit || "OVERSIZED SILHOUETTE"}</span>
                  <span className="spec-pill">ZERO-PLASTIC PACKAGING</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
                  <span style={{ font: "28px/1 var(--font-space-mono), monospace", fontWeight: 800, color: "#000000" }}>
                    ₹{(spotlightProduct.pricePaise / 100).toLocaleString("en-IN")}
                  </span>
                  <span style={{ font: "10px var(--font-space-mono), monospace", color: "#888888" }}>
                    INCL. 12% GST &amp; DISPATCH
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href={`/product/${spotlightProduct.slug}`}
                    className="hero-primary-cta"
                    style={{ flex: "1 1 200px" }}
                  >
                    {spotlightProduct.isSoldOut
                      ? "SOLD OUT // VIEW ARCHIVE ↗"
                      : spotlightProduct.launch.purchaseMode === "PREBOOK"
                      ? "PRE-BOOK NOW ↗"
                      : "BUY NOW ↗"}
                  </Link>
                  <Link
                    href={`/product/${spotlightProduct.slug}`}
                    className="hero-secondary-cta"
                  >
                    DETAILS →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Section: ARCHITECTURAL RELEASES // ASYMMETRIC CATALOG GRID */}
      <section className="home-section" aria-label="Product Catalog">
        <div className="section-header-row">
          <div>
            <p className="section-kicker">ARCHITECTURAL CATALOG // STREETWEAR</p>
            <h2 className="section-heading">RELEASES &amp; ARCHIVE</h2>
          </div>
          <Link href="/products" className="section-header-link">
            VIEW ALL ({catalogProducts.length}) ↗
          </Link>
        </div>

        {catalogProducts.length > 0 ? (
          <div className="asymmetric-product-grid">
            {catalogProducts.map((prod, index) => {
              const isLarge = index % 3 === 0;
              const isPre = prod.launch.purchaseMode === "PREBOOK";
              const isSold = prod.isSoldOut || prod.totalAvailableStock <= 0;

              return (
                <Link
                  key={prod.id || prod.slug}
                  href={`/product/${prod.slug}`}
                  className="home-product-card"
                  style={{ gridColumn: isLarge ? "span 1" : "span 1" }}
                >
                  <div className="card-image-stage">
                    <div className="card-badge-top">
                      <span className={`card-status-pill ${isSold ? "sold-out" : ""}`}>
                        {isSold ? "SOLD OUT" : isPre ? "PRE-BOOK" : "AVAILABLE"}
                      </span>
                    </div>

                    <Image
                      src={prod.assets.frontImage || "/assets/products/bengaluru-tee-front.svg"}
                      alt={prod.name}
                      width={440}
                      height={550}
                      className="card-product-img"
                    />
                  </div>

                  <div className="card-details">
                    <div>
                      <h3 className="card-title">{prod.name}</h3>
                      <p className="card-subtext">
                        {prod.cityName} <span className="text-accent">/</span> {prod.edition}
                      </p>
                    </div>
                    <div className="card-price">
                      ₹{(prod.pricePaise / 100).toLocaleString("en-IN")}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: "60px 20px", textAlign: "center", background: "#FFFFFF", border: "1px solid #E5E5E5" }}>
            <p style={{ font: "12px var(--font-space-mono), monospace", color: "#888888" }}>
              NO PUBLIC RELEASES CURRENTLY SCHEDULED.
            </p>
          </div>
        )}
      </section>

      {/* 5. Section: EDITORIAL CAMPAIGN STORY (MADE FOR THE CITY) */}
      <section className="editorial-story-banner" aria-label="Brand Story">
        <div className="editorial-story-container">
          <div>
            <span style={{ font: "10px var(--font-space-mono), monospace", color: "#E52B20", letterSpacing: ".18em", fontWeight: 800, display: "block", marginBottom: "12px" }}>
              MANIFESTO // MONSOON 2026
            </span>
            <h2 className="story-huge-headline">
              MADE FOR THE CITY.
            </h2>
            <p className="story-body-copy">
              We design uniforms for the small hours and urban geography. Heavyweight 320 GSM Super Loopknit combed cotton engineered with boxy architectural drape to withstand midnight humidity, monsoons, and daily wear without losing silhouette.
            </p>
            <Link href="/about" className="story-link-cta">
              READ DESIGN PHILOSOPHY →
            </Link>
          </div>

          <div className="story-visual-box">
            <Image
              src="/assets/products/bengaluru-tee-back.svg"
              alt="BEXYEE Architectural Garment Drape"
              width={500}
              height={500}
              style={{ width: "85%", height: "85%", objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      {/* 6. Section: LIVING CITY DESTINATION EXPERIENCE */}
      <section className="home-section" aria-label="Metropolis Geographic Network">
        <div className="section-header-row">
          <div>
            <p className="section-kicker">GEOGRAPHIC NETWORK // URBAN UNIFORMS</p>
            <h2 className="section-heading">METROPOLIS ROSTER</h2>
          </div>
          <Link href="/cities" className="section-header-link">
            ALL CITIES ↗
          </Link>
        </div>

        <div className="city-matrix-grid">
          {METROPOLIS_NETWORK.map((cityItem) => (
            <Link
              key={cityItem.city}
              href={cityItem.href}
              className={`city-matrix-card ${cityItem.isLive ? "active-city" : ""}`}
            >
              <div>
                <h3 className="city-name">{cityItem.city}</h3>
                <p className="city-coords">{cityItem.coords}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`city-status-badge ${cityItem.isLive ? "live" : "scheduled"}`}>
                  {cityItem.status}
                </span>
                <span style={{ font: "9px var(--font-space-mono), monospace", color: "#888888" }}>
                  {cityItem.drop}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Section: TEXTILE CRAFT & MATERIAL ARCHITECTURE */}
      <section className="home-section" aria-label="Textile Engineering Standards">
        <div className="section-header-row">
          <div>
            <p className="section-kicker">ENGINEERING &amp; STANDARDS // 10-YEAR LIFECYCLE</p>
            <h2 className="section-heading">TEXTILE ARCHITECTURE</h2>
          </div>
          <Link href="/blog" className="section-header-link">
            MATERIAL JOURNAL ↗
          </Link>
        </div>

        <div className="specs-quad-grid">
          <div className="spec-quad-card">
            <span className="spec-quad-num">01 / FABRIC DENSITY</span>
            <h3 className="spec-quad-title">320 GSM Super Loopknit</h3>
            <p className="spec-quad-desc">
              High-gauge combed cotton looped knit for breathability and structural weight that never shrinks or distorts.
            </p>
          </div>

          <div className="spec-quad-card">
            <span className="spec-quad-num">02 / SILHOUETTE</span>
            <h3 className="spec-quad-title">Architectural Boxy Cut</h3>
            <p className="spec-quad-desc">
              Tailored drop-shoulder pattern with relaxed chest width and ribbed crew neckline engineered to hold form.
            </p>
          </div>

          <div className="spec-quad-card">
            <span className="spec-quad-num">03 / PRINT SYSTEM</span>
            <h3 className="spec-quad-title">High-Density Plastisol</h3>
            <p className="spec-quad-desc">
              Multiple screen passes with heat-cured pigment formula resistant to cracking, stretching, and fading.
            </p>
          </div>

          <div className="spec-quad-card">
            <span className="spec-quad-num">04 / SUSTAINABILITY</span>
            <h3 className="spec-quad-title">Zero-Plastic Delivery</h3>
            <p className="spec-quad-desc">
              100% biodegradable cassava starch mailers, organic unbleached cotton dust bags, and recyclable box craft.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Section: VISUAL LOOKBOOK GALLERY */}
      <section className="home-section" aria-label="Visual Lookbook Archive">
        <div className="section-header-row">
          <div>
            <p className="section-kicker">DOCUMENTATION // STREET CAPTURES</p>
            <h2 className="section-heading">VISUAL LOOKBOOK</h2>
          </div>
          <Link href="/lookbook" className="section-header-link">
            LOOKBOOK ARCHIVE ↗
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {LOOKBOOK_CARDS.map((card, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  background: "#F0F0EC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                }}
              >
                <Image
                  src={card.src}
                  alt={card.title}
                  width={400}
                  height={400}
                  style={{ width: "85%", height: "85%", objectFit: "contain" }}
                />
              </div>

              <div style={{ padding: "18px 20px", borderTop: "1px solid #F0F0EE" }}>
                <span style={{ font: "8.5px var(--font-space-mono), monospace", color: "#E52B20", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>
                  {card.tag}
                </span>
                <h4 style={{ fontSize: "14px", fontWeight: 800, margin: "4px 0 6px 0", textTransform: "uppercase" }}>
                  {card.title}
                </h4>
                <p style={{ font: "9.5px var(--font-space-mono), monospace", color: "#777777", margin: 0 }}>
                  {card.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Section: MONOLITHIC BRAND STATEMENT */}
      <section className="brand-monolith-banner" aria-label="Brand Commitment">
        <div className="monolith-inner">
          <span style={{ font: "10px var(--font-space-mono), monospace", color: "#888888", letterSpacing: ".2em", fontWeight: 800, textTransform: "uppercase" }}>
            BEXYEE ARCHIVE // LIMITED PRODUCTION
          </span>
          <h2 className="monolith-quote">
            BUILT FOR THE CITY. CRAFTED TO LAST A DECADE.
          </h2>
          <p className="monolith-subtext">
            Numbered drops. Zero compromises on fiber weight or construction. Engineered for collectors across the metropolis.
          </p>
          <div className="monolith-actions">
            <Link href="/products" className="hero-primary-cta">
              EXPLORE CATALOG ↗
            </Link>
            <Link href="/about" className="hero-secondary-cta">
              BRAND PHILOSOPHY ↗
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Storefront Footer */}
      <StorefrontFooter />
    </main>
  );
}
