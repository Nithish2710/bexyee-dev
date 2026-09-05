import { Storefront } from "../../src/components/Storefront";
import { supabase } from "../../src/lib/supabase";
import type { Metadata } from "next";

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
};

const fallbackCampaign: CityCampaign = {
  productId: "00000000-0000-0000-0000-000000000001",
  productName: "Bengaluru Tee",
  cityName: "BENGALURU",
  campaignTitle: "SIGNAL\nAFTER RAIN",
  backgroundImage: "/bengaluru-signal-after-rain.svg",
  mobileBackgroundImage: "/bengaluru-signal-after-rain.svg",
  accentColor: "#e52b20",
  productModel: process.env.NEXT_PUBLIC_MODEL_URL ?? "",
  frontImage: "/assets/products/bengaluru-tee-front.svg",
  backImage: "/assets/products/bengaluru-tee-back.svg",
  leftSleeveImage: "/assets/products/bengaluru-tee-left.svg",
  rightSleeveImage: "/assets/products/bengaluru-tee-right.svg",
  printImage: "/assets/products/bengaluru-tee-print.svg",
  edition: "001 / 100",
  price: 1799,
  compareAtPrice: 0,
  fabric: "320 GSM SUPER LOOPKNIT",
  gsm: 320,
  fit: "OVERSIZED",
  sku: "BEXYEE-BLR-001",
  sizes: ["S", "M", "L", "XL"],
  stock: { S: 10, M: 15, L: 12, XL: 8 },
  inspiration: "A city uniform shaped by wet roads, late signals, and the small hours of Bengaluru.",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "BEXYEE / Bengaluru Campaign — Drop 001",
  description: fallbackCampaign.inspiration,
  alternates: { canonical: "/bengaluru" },
  openGraph: {
    title: "BEXYEE / Bengaluru Edition — Drop 001",
    description: fallbackCampaign.inspiration,
    type: "website",
    images: [fallbackCampaign.backgroundImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEXYEE / Bengaluru Edition — Drop 001",
    description: fallbackCampaign.inspiration,
    images: [fallbackCampaign.backgroundImage],
  },
};

type CampaignRow = {
  id?: string;
  city_name?: string;
  campaign_title?: string;
  background_image?: string;
  mobile_background_image?: string;
  accent_color?: string;
  model_url?: string;
  edition?: string;
  price?: number;
  sizes?: string[];
  inspiration?: string;
};

type ProductRow = {
  id: string;
  name: string;
  edition: string;
  description: string;
  price_paise: number;
  compare_at_price_paise: number | null;
  fabric: string;
  gsm: number | null;
  fit: string;
  model_url: string | null;
  sku: string;
  city_name?: string | null;
  front_image_url?: string | null;
  back_image_url?: string | null;
  left_sleeve_image_url?: string | null;
  right_sleeve_image_url?: string | null;
  print_image_url?: string | null;
  product_images: string[];
  product_sizes: Array<{ size: string; stock_quantity: number }>;
};

export const dynamic = "force-dynamic";

async function getCampaign(): Promise<CityCampaign | null> {
  if (!supabase) return null;

  const { data: product } = await supabase
    .from("products")
    .select("*, campaigns(*), product_sizes(size, stock_quantity)")
    .eq("status", "ACTIVE")
    .or("slug.eq.bengaluru-tee,slug.eq.bengaluru,sku.eq.BEXYEE-BLR-001")
    .limit(1)
    .maybeSingle<ProductRow & { campaigns?: CampaignRow }>();

  if (!product) return null;

  const stock = Object.fromEntries((product.product_sizes ?? []).map((entry) => [entry.size, entry.stock_quantity]));
  const campaignData = product.campaigns;

  return {
    ...fallbackCampaign,
    productId: product.id,
    productName: product.name,
    cityName: product.city_name || campaignData?.city_name || "BENGALURU",
    campaignTitle: campaignData?.campaign_title || "SIGNAL AFTER RAIN",
    backgroundImage: campaignData?.background_image || "/bengaluru-signal-after-rain.svg",
    mobileBackgroundImage: campaignData?.mobile_background_image || "/bengaluru-signal-after-rain.svg",
    accentColor: campaignData?.accent_color || "#e52b20",
    productModel: product.model_url || campaignData?.model_url || fallbackCampaign.productModel,
    frontImage: product.front_image_url || fallbackCampaign.frontImage,
    backImage: product.back_image_url || fallbackCampaign.backImage,
    leftSleeveImage: product.left_sleeve_image_url || fallbackCampaign.leftSleeveImage,
    rightSleeveImage: product.right_sleeve_image_url || fallbackCampaign.rightSleeveImage,
    printImage: product.print_image_url || fallbackCampaign.printImage,
    edition: product.edition || fallbackCampaign.edition,
    price: product.price_paise / 100,
    compareAtPrice: product.compare_at_price_paise ? product.compare_at_price_paise / 100 : null,
    fabric: product.fabric || fallbackCampaign.fabric,
    gsm: product.gsm || fallbackCampaign.gsm,
    fit: product.fit || fallbackCampaign.fit,
    sku: product.sku || fallbackCampaign.sku,
    sizes: campaignData?.sizes || fallbackCampaign.sizes,
    stock: Object.keys(stock).length ? stock : fallbackCampaign.stock,
    inspiration: product.description || campaignData?.inspiration || fallbackCampaign.inspiration,
  };
}

export default async function BengaluruCampaignPage() {
  const campaign = await getCampaign();

  if (!campaign) {
    return (
      <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
        <div style={{ maxWidth: "680px", margin: "100px auto 80px", padding: "48px 32px", background: "#FFFFFF", border: "1px solid #E5E5E5", textAlign: "center" }}>
          <span style={{ fontSize: "10px", color: "#E52B20", letterSpacing: "0.16em", fontWeight: 800 }}>
            STATUS // UNPUBLISHED DROP
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.04em" }}>
            BENGALURU EDITION NOT AVAILABLE
          </h1>
          <p style={{ fontSize: "13px", color: "#666666", lineHeight: 1.7, marginBottom: "28px" }}>
            The Bengaluru drop is currently unpublished or archived. It is not available for ordering on the live storefront.
          </p>
          <a
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
            EXPLORE ACTIVE CATALOG ↗
          </a>
        </div>
      </main>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: campaign.productName,
    sku: campaign.sku,
    description: campaign.inspiration,
    brand: { "@type": "Brand", name: "BEXYEE" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: campaign.price,
      availability: "https://schema.org/InStock",
      url: "/bengaluru",
    },
  };
  return (
    <>
      <Storefront campaign={campaign} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
