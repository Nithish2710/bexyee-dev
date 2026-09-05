import type { Metadata } from "next";
import Link from "next/link";
import { getStorefrontCatalogProducts, type StorefrontCatalogItem } from "../../src/lib/product-engine";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / PRODUCTS — City Uniforms & Editions",
  description: "Explore the limited edition city-based streetwear catalog by BEXYEE.",
};

export default async function ProductsCatalogPage() {
  const products: StorefrontCatalogItem[] = await getStorefrontCatalogProducts();

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="CATALOG" />

      {/* Header Banner (White Surface) */}
      <section style={{ padding: "clamp(48px, 6vw, 90px) clamp(20px, 4vw, 80px)", background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "9px", color: "#777777", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            ARCHIVE &amp; DROPS
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", margin: 0, letterSpacing: "-0.08em", lineHeight: 0.95, color: "#000000" }}>
            ALL EDITIONS
          </h1>
          <p style={{ fontSize: "13px", color: "#555555", maxWidth: "580px", margin: "20px 0 0 0", lineHeight: "1.7", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            Numbered garments engineered with heavyweight 320 GSM Loopknit cotton, custom dyes, and tactile coordinates. Every drop is capped at 100 physical units.
          </p>
        </div>
      </section>

      {/* Product Grid / Empty State */}
      <section style={{ padding: "clamp(40px, 5vw, 80px) clamp(20px, 4vw, 80px)", maxWidth: "1280px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px dashed #CCCCCC", padding: "64px 24px", textAlign: "center", color: "#777777" }}>
            <strong style={{ fontSize: "16px", color: "#000000", display: "block", marginBottom: "8px" }}>
              NO ACTIVE DROPS CURRENTLY AVAILABLE
            </strong>
            <p style={{ fontSize: "12px", maxWidth: "420px", margin: "0 auto 20px" }}>
              All garments in previous capsules are archived or sold out. Next limited city drop announcement in progress.
            </p>
            <Link
              href="/"
              style={{
                background: "#000000",
                color: "#FFFFFF",
                padding: "12px 24px",
                fontSize: "11px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              RETURN TO HOME ↗
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {products.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #E5E5E5",
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.2s ease, transform 0.2s ease",
                }}
              >
                <div style={{ background: "#F7F7F3", padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "340px", borderBottom: "1px solid #E5E5E5" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.front_image_url || "/assets/products/bengaluru-tee-front.svg"}
                    alt={item.name}
                    style={{ maxHeight: "260px", maxWidth: "90%", objectFit: "contain" }}
                  />
                </div>
                <div style={{ padding: "24px", display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5px", color: "#777777", letterSpacing: "0.1em" }}>
                    <span>{item.campaigns?.city_name || "CITY DROP"}</span>
                    <span style={{ fontWeight: 700 }}>{item.edition}</span>
                  </div>
                  <strong style={{ fontSize: "17px", letterSpacing: "-0.03em", color: "#000000" }}>
                    {item.name}
                  </strong>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F0F0EE" }}>
                    <span style={{ fontSize: "15px", color: "#000000", fontWeight: 800 }}>
                      ₹{(item.price_paise / 100).toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: "10px", color: "#000000", fontWeight: 700, letterSpacing: "0.08em" }}>
                      VIEW UNIFORM ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <StorefrontFooter />
    </main>
  );
}
