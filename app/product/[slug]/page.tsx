import type { Metadata } from "next";
import Link from "next/link";
import { getProductExperienceData } from "../../../src/lib/product-engine";
import { ProductPageRenderer } from "../../../src/components/experience/ProductPageRenderer";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductExperienceData(slug);
  if (!product || product.launch.status === "DRAFT" || product.launch.status === "ARCHIVED") {
    return { title: "BEXYEE / Edition Not Available", description: "This capsule edition is currently unpublished or archived." };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: product.seoOgImage ? [{ url: product.seoOgImage }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductExperienceData(slug);

  if (!product || product.launch.status === "DRAFT" || product.launch.status === "ARCHIVED") {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
        <GlobalHeader section="CATALOG" />
        <div style={{ maxWidth: "680px", margin: "100px auto 80px", padding: "48px 32px", background: "#FFFFFF", border: "1px solid #E5E5E5", textAlign: "center" }}>
          <span style={{ fontSize: "10px", color: "#E52B20", letterSpacing: "0.16em", fontWeight: 800 }}>
            STATUS // UNPUBLISHED DROP
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.04em" }}>
            EDITION NOT CURRENTLY AVAILABLE
          </h1>
          <p style={{ fontSize: "13px", color: "#666666", lineHeight: 1.7, marginBottom: "28px" }}>
            This capsule edition is currently unpublished, in preparation, or archived. It is not purchasable on the live storefront.
          </p>
          <Link
            href="/products"
            style={{
              background: "#000000",
              color: "#FFFFFF",
              padding: "14px 28px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            EXPLORE ACTIVE EDITIONS ↗
          </Link>
        </div>
        <StorefrontFooter />
      </main>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: { "@type": "Brand", name: "BEXYEE" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.pricePaise / 100,
      availability: product.isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `/product/${product.slug}`,
    },
  };


  const overallInventoryStatus = product.isSoldOut
    ? "SOLD_OUT"
    : product.variants.some((v) => v.status === "LOW")
    ? "LOW"
    : "AVAILABLE";

  return (
    <>
      {/*
        SSR Test Sentinel — rendered by the server component so it is always
        present in the raw HTTP response. display:none hides it from the UI.
        ProductPageRenderer is "use client" so anything inside it is browser-only.
      */}
      <div
        data-testid="product-state"
        data-purchase-mode={product.launch.purchaseMode}
        data-inventory-status={overallInventoryStatus}
        data-price-paise={product.pricePaise}
        data-is-live={product.launch.status === "LIVE" ? "true" : "false"}
        data-is-paused={product.launch.status === "PAUSED" ? "true" : "false"}
        data-product-slug={product.slug}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <ProductPageRenderer product={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
