"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { UnifiedProduct } from "../../lib/product-engine";
import { MovableBackground } from "../hero/MovableBackground";
import { HeroProduct3D } from "../hero/HeroProduct3D";

const VIEWS = [
  { id: "FRONT", label: "Front" },
  { id: "BACK", label: "Back" },
  { id: "PRINT", label: "Print" },
] as const;

export function HomeHero({ product }: { product: UnifiedProduct | null }) {
  const [view, setView] = useState<string>("FRONT");
  const [signal, setSignal] = useState({ x: 50, y: 50 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSignal({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  // Graceful Coming Soon Fallback if no product exists
  if (!product) {
    return (
      <section className="bexyee-home-hero empty-hero">
        <div className="home-hero-content text-center">
          <p className="hero-kicker">BEXYEE ARCHIVE // NEXT RELEASE</p>
          <h1 className="hero-display-title">COMING SOON</h1>
          <p className="hero-editorial-desc">
            The next architectural heavyweight capsule is currently in production.
          </p>
          <Link href="/products" className="hero-primary-btn">
            EXPLORE ARCHIVE CATALOG ↗
          </Link>
        </div>
      </section>
    );
  }

  const isLive = product.launch?.status === "LIVE";
  const isPaused = product.launch?.status === "PAUSED";
  const isPrebook = isLive && product.launch?.purchaseMode === "PREBOOK";
  const isBuyNow = isLive && product.launch?.purchaseMode === "BUY_NOW";
  const isSoldOut = product.isSoldOut || product.totalAvailableStock <= 0;

  const viewPhotos: Record<string, string> = {
    FRONT: product.assets.frontImage,
    BACK: product.assets.backImage,
    "LEFT SLEEVE": product.assets.leftSleeveImage,
    "RIGHT SLEEVE": product.assets.rightSleeveImage,
    PRINT: product.assets.printImage,
  };

  const productUrl = `/product/${product.slug || "bengaluru-tee"}`;

  return (
    <section
      className="bexyee-home-hero"
      onPointerMove={handlePointerMove}
      aria-label="Featured Product Campaign Hero"
    >
      {/* 1. Subtle Movable Background System */}
      <MovableBackground backgrounds={product.assets.backgrounds} signal={signal} />

      {/* 2. Large Architectural Watermark Background */}
      <div className="home-hero-watermark" aria-hidden="true">
        {product.cityName || "BEXYEE"}
      </div>

      {/* 3. Hero Responsive Content Container */}
      <div className="home-hero-container">
        {/* Left / Top Info Column */}
        <div className="home-hero-info">
          <div className="hero-badge-group">
            <span className="hero-status-pill">
              <span className="status-indicator-dot" />
              {isPrebook ? "PRE-BOOK ACTIVE" : isLive ? "LIVE STOREFRONT" : "COMING SOON"}
            </span>
            <span className="hero-edition-tag">
              {product.cityName} <span className="text-accent">/</span> {product.edition}
            </span>
          </div>

          <h1 className="home-hero-title">
            {product.name}
          </h1>

          <p className="home-hero-description">
            {product.description ||
              "Heavyweight 320 GSM Super Loopknit combed cotton engineered with boxy architectural drape for midnight humidity."}
          </p>

          <div className="home-hero-spec-pills">
            <span className="spec-pill">{product.fabric || "320 GSM SUPER LOOPKNIT"}</span>
            <span className="spec-pill">{product.fit || "OVERSIZED SILHOUETTE"}</span>
          </div>

          <div className="home-hero-price-row">
            <div className="price-stack">
              <span className="price-label">PRICE (INCL. GST &amp; DISPATCH)</span>
              <strong className="price-val">
                ₹{(product.pricePaise / 100).toLocaleString("en-IN")}
              </strong>
            </div>
            {product.compareAtPricePaise && (
              <span className="price-compare-val">
                ₹{(product.compareAtPricePaise / 100).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="home-hero-actions">
            <Link
              href={productUrl}
              className="hero-primary-cta"
              aria-label={`Buy or pre-book ${product.name}`}
            >
              {isPaused
                ? "LAUNCH PAUSED // VIEW DETAILS ↗"
                : isSoldOut
                ? "SOLD OUT // VIEW ARCHIVE ↗"
                : isPrebook
                ? "PRE-BOOK NOW ↗"
                : isBuyNow
                ? "BUY NOW ↗"
                : "VIEW CAPSULE ↗"}
            </Link>

            <Link
              href={productUrl}
              className="hero-secondary-cta"
            >
              EXPLORE PRODUCT →
            </Link>
          </div>
        </div>

        {/* Right / Center Garment Visual Stage */}
        <div className="home-hero-stage">
          <div className="hero-stage-inner">
            <HeroProduct3D
              modelUrl={product.assets.modelUrl || ""}
              view={view}
              signal={signal}
              viewPhotos={viewPhotos}
            />
          </div>

          {/* Studio View Pills */}
          <div className="home-hero-view-pills" role="group" aria-label="Camera angles">
            {VIEWS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`view-pill-btn ${view === item.id ? "active" : ""}`}
                aria-pressed={view === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
