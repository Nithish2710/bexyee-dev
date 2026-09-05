"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type UnifiedProduct } from "../../lib/product-engine";
import { DEFAULT_APPAREL_SIZE_CHART } from "../../lib/sizing";
import { GlobalHeader } from "../navigation/GlobalHeader";
import { StorefrontFooter } from "../navigation/StorefrontFooter";
import { MovableBackground } from "../hero/MovableBackground";
import { HeroProduct3D } from "../hero/HeroProduct3D";
import { SizeGuideModal } from "../commerce/SizeGuideModal";

function track(event: string, properties?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined") {
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, properties, timestamp: Date.now() }),
      }).catch(() => {});
    }
  } catch {
    // Ignore tracking errors
  }
}

const VIEWS = [
  { id: "FRONT", label: "Front View" },
  { id: "BACK", label: "Back View" },
  { id: "LEFT SLEEVE", label: "Left Sleeve" },
  { id: "RIGHT SLEEVE", label: "Right Sleeve" },
  { id: "PRINT", label: "Graphic Print" },
] as const;

export function ProductPageRenderer({ product }: { product: UnifiedProduct }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [view, setView] = useState<string>("FRONT");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);

  // Parallax Pointer Signal (Subtle, restrained depth)
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

  const isLive = product.launch?.status === "LIVE";
  const isPaused = product.launch?.status === "PAUSED";
  const isPrebook = isLive && (product.launch?.purchaseMode === "PREBOOK" || product.purchaseMode === "PREBOOK");
  const isBuyNow = isLive && (product.launch?.purchaseMode === "BUY_NOW" || product.purchaseMode === "BUY_NOW");

  async function handleAddToCart(isInstantCheckout: boolean) {
    if (isProcessing) return;
    setIsProcessing(true);

    const purchaseMode = isPrebook ? "PREBOOK" : "BUY_NOW";

    // 1. Local Storage Cart Update
    try {
      const rawCart = window.localStorage.getItem("bexyee_cart");
      const cartItems: Array<{
        productId: string;
        productName: string;
        size: string;
        quantity: number;
        unitPricePaise: number;
        sku: string;
        purchaseMode?: string;
        expectedFulfillmentDate?: string;
      }> = rawCart ? JSON.parse(rawCart) : [];

      const existingIndex = cartItems.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        cartItems[existingIndex].quantity += 1;
        cartItems[existingIndex].purchaseMode = purchaseMode;
      } else {
        cartItems.push({
          productId: product.id,
          productName: product.name,
          size: selectedSize,
          quantity: 1,
          unitPricePaise: product.pricePaise,
          sku: product.sku,
          purchaseMode,
          expectedFulfillmentDate: product.prebookConfig?.expectedFulfillmentDate,
        });
      }

      window.localStorage.setItem("bexyee_cart", JSON.stringify(cartItems));
      const totalUnits = cartItems.reduce((acc, i) => acc + i.quantity, 0);
      setCartCount(totalUnits);
    } catch {
      // LocalStorage fallback
    }

    // 2. Server-side cart synchronization
    try {
      const guestToken =
        window.localStorage.getItem("bexyee_guest_token") ||
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "guest_" + Date.now());
      window.localStorage.setItem("bexyee_guest_token", guestToken);

      const cartRes = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          quantity: 1,
          purchaseMode,
        }),
      });
      const cartData = (await cartRes.json().catch(() => null)) as { id?: string } | null;
      if (cartData?.id) {
        window.localStorage.setItem("bexyee_cart_id", cartData.id);
      }
    } catch {
      // Graceful fallback
    }

    track(isPrebook ? "prebook_initiated" : "add_to_cart", {
      size: selectedSize,
      quantity: 1,
      buyNow: isInstantCheckout,
      purchaseMode,
    });

    if (isInstantCheckout) {
      track("checkout_started", { size: selectedSize, purchaseMode });
      router.push("/checkout");
    } else {
      setIsProcessing(false);
      setMessage(`✓ ${selectedSize} / ${product.name} added to bag`);
      setTimeout(() => setMessage(""), 3500);
    }
  }

  const viewPhotos: Record<string, string> = {
    FRONT: product.assets.frontImage,
    BACK: product.assets.backImage,
    "LEFT SLEEVE": product.assets.leftSleeveImage,
    "RIGHT SLEEVE": product.assets.rightSleeveImage,
    PRINT: product.assets.printImage,
  };

  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const isSelectedSizeInStock = (currentVariant?.availableStock ?? 0) > 0;
  const isSelectedSizeLowStock =
    (currentVariant?.availableStock ?? 0) > 0 &&
    (currentVariant?.availableStock ?? 0) <= (currentVariant?.threshold ?? 3);

  // Compute overall inventory status for the SSR sentinel
  const overallInventoryStatus = product.isSoldOut
    ? "SOLD_OUT"
    : product.variants.some((v) => v.status === "LOW")
    ? "LOW"
    : "AVAILABLE";

  return (
    <main
      className="bexyee-product-experience"
      onPointerMove={handlePointerMove}
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F3",
        color: "#000000",
        fontFamily: "var(--font-space-mono), monospace",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* SSR Test Sentinel — hidden from UI, queryable via plain HTTP for test assertions */}
      <div
        data-testid="product-state"
        data-purchase-mode={isPrebook ? "PREBOOK" : "BUY_NOW"}
        data-inventory-status={overallInventoryStatus}
        data-price-paise={product.pricePaise}
        data-is-live={isLive ? "true" : "false"}
        data-is-paused={isPaused ? "true" : "false"}
        data-product-slug={product.slug}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* 1. Universal Movable Background System */}
      <MovableBackground
        backgrounds={product.assets.backgrounds}
        backgroundType={product.assets.backgroundType}
        signal={signal}
      />

      {/* 2. Global Header */}
      <GlobalHeader
        section={product.cityName ? product.cityName.slice(0, 3).toUpperCase() : (product.collection ? product.collection.slice(0, 3).toUpperCase() : "STU")}
        cartCountOverride={cartCount}
      />

      {/* 3. CINEMATIC PRODUCT HERO STAGE (Reference Art Direction + BEXYEE Brand Palette) */}
      <div className="bexyee-product-stage-hero">
        {/* Giant Architectural Typographic Watermark across stage */}
        <div className="product-hero-watermark" aria-hidden="true">
          {product.cityName || product.collection || "BEXYEE"}
        </div>

        {/* Dynamic Notification Toast */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              top: "76px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              background: "#000000",
              color: "#FFFFFF",
              border: "1px solid #000000",
              padding: "12px 24px",
              fontSize: "11.5px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            }}
          >
            {message}
          </div>
        )}

        {/* 3-Column Asymmetric Campaign Composition */}
        <div className="product-hero-composition">
          {/* LEFT COLUMN: Editorial Typography & Studio Camera Angle Selector */}
          <div className="hero-left-col">
            <div className="hero-kicker-group">
              <span className="hero-eyebrow">
                BEXYEE <span style={{ color: "#E52B20" }}>/</span> {product.cityName ? `${product.cityName} EDITION` : (product.collection || "STUDIO CAPSULE")}
              </span>
              <div className="hero-drop-tag">
                {isPaused ? (
                  <>PAUSED <span style={{ color: "#E52B20" }}>//</span> TEMPORARILY LOCKED</>
                ) : isPrebook ? (
                  <>PRE-BOOK <span style={{ color: "#E52B20" }}>//</span> LIMITED RUN</>
                ) : (
                  <>{product.edition} <span style={{ color: "#E52B20" }}>//</span> LIMITED 100</>
                )}
              </div>
            </div>

            {/* Massive Display Title */}
            <h1 className="hero-product-title">
              {product.cityName ? (
                <>
                  <span className="title-city">{product.cityName}</span>
                  <span className="title-sub">
                    {product.name.replace(new RegExp(product.cityName, "gi"), "").trim() || "HEAVYWEIGHT TEE"}
                  </span>
                </>
              ) : (
                <span className="title-city" style={{ letterSpacing: "-0.03em" }}>{product.name}</span>
              )}
            </h1>

            <p className="hero-editorial-line">
              {product.description || "320 GSM Super Loopknit combed cotton engineered with structural boxy drape."}
            </p>

            {/* Studio View Angle Selector Pills */}
            <div className="hero-view-selector-group">
              <span className="selector-label">STUDIO VIEWS / 3D ANGLES:</span>
              <div className="hero-view-pills" role="group" aria-label="Product camera angles">
                {VIEWS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setView(item.id);
                      track("product_view_change", { view: item.id });
                    }}
                    className={`view-pill ${view === item.id ? "active" : ""}`}
                    aria-pressed={view === item.id}
                  >
                    <div className="view-pill-thumb">
                      <Image
                        src={viewPhotos[item.id] || viewPhotos.FRONT}
                        alt={item.label}
                        width={28}
                        height={28}
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </div>
                    <span>{item.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Floating 3D / Photographic Garment Stage */}
          <div className="hero-center-col">
            <div className="hero-stage-container">
              <HeroProduct3D
                modelUrl={product.assets.modelUrl || ""}
                view={view}
                signal={signal}
                viewPhotos={viewPhotos}
              />
              <div className="product-stage-shadow" aria-hidden="true" />
            </div>
          </div>

          {/* RIGHT COLUMN: Commercial Price & Mutually Exclusive Action Cluster */}
          <div className="hero-right-col">
            {/* Authoritative Price Display */}
            <div className="hero-price-box">
              <div className="price-kicker">PRICE // INCL. 12% GST &amp; DISPATCH</div>
              <div className="price-row">
                <strong className="price-amount">
                  ₹{(product.pricePaise / 100).toLocaleString("en-IN")}
                </strong>
                {product.compareAtPricePaise && (
                  <span className="price-compare">
                    ₹{(product.compareAtPricePaise / 100).toLocaleString("en-IN")}
                  </span>
                )}
                <span className="price-edition-badge">
                  {isPrebook ? "PRE-BOOK RUN" : "LIMITED DROP"}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="hero-size-box">
              <div className="size-header">
                <span className="size-title">SELECT SIZE (CHEST / LENGTH)</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="size-guide-link"
                >
                  SIZE GUIDE (INCHES) ↗
                </button>
              </div>

              <div className="size-pills-grid" role="radiogroup" aria-label="Available garment sizes">
                {(["S", "M", "L", "XL"] as const).map((s) => {
                  const variant = product.variants.find((v) => v.size === s);
                  const isAvailable = (variant?.availableStock ?? 0) > 0;
                  const isLow = isAvailable && (variant?.availableStock ?? 0) <= (variant?.threshold ?? 3);
                  const isSelected = selectedSize === s;

                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(s)}
                      className={`size-pill ${isSelected ? "selected" : ""} ${!isAvailable ? "disabled" : ""}`}
                    >
                      <span className="size-letter">{s}</span>
                      {isLow && <span className="size-low-pip">LOW</span>}
                      {!isAvailable && <span className="size-sold-label">SOLD</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MUTUALLY EXCLUSIVE ACTION BUTTONS: SINGLE BUTTON RULE */}
            {isPaused ? (
              /* PAUSED LAUNCH STATE: TEMPORARILY LOCKED */
              <div className="hero-action-buttons single-btn">
                <button
                  type="button"
                  disabled
                  className="hero-btn-buy disabled"
                  style={{ background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB", cursor: "not-allowed" }}
                >
                  PRODUCT PAUSED
                </button>
              </div>
            ) : isPrebook ? (
              /* PRE-BOOK MODE: SHOW [ PRE-BOOK NOW ] | HIDE [ BUY NOW ] & [ ADD TO CART ] */
              <div className="hero-action-cluster-prebook">
                <div className="hero-action-buttons single-btn">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={isProcessing || !isSelectedSizeInStock}
                    className="hero-btn-buy prebook-btn"
                  >
                    {isProcessing
                      ? "INITIALIZING..."
                      : !isSelectedSizeInStock
                      ? "SOLD OUT"
                      : "PRE-BOOK NOW ↗"}
                  </button>
                </div>

                <div className="hero-prebook-notice">
                  <div className="prebook-tag">PRE-BOOKING ACTIVE</div>
                  <p className="prebook-desc">
                    Allocated pre-order batch. Expected fulfillment:{" "}
                    <strong>{product.prebookConfig?.expectedFulfillmentDate || "OCTOBER 2026"}</strong>.
                    Payment is secured upon order; dispatch tracking is issued upon quality clearance.
                  </p>
                </div>
              </div>
            ) : isBuyNow ? (
              /* NORMAL BUY NOW MODE: SHOW [ BUY NOW ] + [ ADD TO CART ] | HIDE [ PRE-BOOK NOW ] */
              <div className="hero-action-cluster-normal">
                <div className="hero-action-buttons">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    disabled={isProcessing || !isSelectedSizeInStock}
                    className="hero-btn-cart"
                  >
                    ADD TO CART
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={isProcessing || !isSelectedSizeInStock}
                    className="hero-btn-buy"
                  >
                    {isProcessing
                      ? "INITIALIZING..."
                      : !isSelectedSizeInStock
                      ? "SOLD OUT"
                      : "BUY NOW ↗"}
                  </button>
                </div>
              </div>
            ) : (
              /* UNAVAILABLE / SOLD OUT STATE */
              <div className="hero-action-buttons single-btn">
                <button
                  type="button"
                  disabled
                  className="hero-btn-buy disabled"
                >
                  SOLD OUT
                </button>
              </div>
            )}

            {/* Low stock alert badge if applicable */}
            {isSelectedSizeLowStock && (
              <div className="hero-stock-warning">
                {isPrebook
                  ? `● LOW ALLOCATION: Only ${currentVariant?.availableStock} pre-book unit${(currentVariant?.availableStock ?? 0) === 1 ? "" : "s"} remaining in size ${selectedSize}`
                  : `● LOW STOCK: Only ${currentVariant?.availableStock} units remaining in size ${selectedSize}`}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM STAGE ROW: Inspiration Narrative & Coordinates */}
        <div className="hero-bottom-bar">
          <div className="hero-inspiration-card">
            <span className="inspiration-label">INSPIRATION // NARRATIVE</span>
            <p className="inspiration-text">
              {product.description ||
                "Engineered from 320 GSM Super Loopknit combed cotton. Designed around the wet asphalt, neon reflections, and late-night geometry of MG Road after heavy monsoon showers."}
            </p>
          </div>

          <div className="hero-meta-card">
            <div className="meta-coords">
              <span>LOCATION:</span> 12.9716° N, 77.5946° E
            </div>
            <div className="meta-specs">
              <span>EDITION:</span> {isPrebook ? "PRE-BOOKING ACTIVE" : product.edition}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TECHNICAL SPECIFICATIONS SECTION (White-First Architectural Grid) */}
      <section className="product-specs-section">
        <div className="specs-container">
          <div className="specs-header">
            <span className="specs-eyebrow">STRUCTURAL SPECIFICATIONS</span>
            <h2 className="specs-title">Architectural Construction.</h2>
            <p className="specs-lead">
              Every detail is engineered from scratch for high-tensile durability, thermal breathability, and non-distorting silhouette structure.
            </p>
          </div>

          <div className="specs-grid">
            <div className="spec-card">
              <span className="spec-num">01 / TEXTILE</span>
              <strong className="spec-name">320 GSM Super Loopknit</strong>
              <p className="spec-desc">
                100% combed long-staple Indian cotton woven at ultra-high density for anti-shrink drape and humidity protection.
              </p>
            </div>

            <div className="spec-card">
              <span className="spec-num">02 / SILHOUETTE</span>
              <strong className="spec-name">Sculpted Boxy Fit</strong>
              <p className="spec-desc">
                Drop-shoulder spatial geometry with reinforced collar ribbing that maintains structure wash after wash.
              </p>
            </div>

            <div className="spec-card">
              <span className="spec-num">03 / PRINTING</span>
              <strong className="spec-name">Cured Plastisol Screenprint</strong>
              <p className="spec-desc">
                Multi-layer cured ink formulation resistant to cracking, peeling, and monsoon rain exposure.
              </p>
            </div>

            <div className="spec-card">
              <span className="spec-num">04 / PACKAGING</span>
              <strong className="spec-name">100% Plastic-Free Dispatch</strong>
              <p className="spec-desc">
                Shipped in kraft water-repellent mailers with archival tissue and serialized authenticity certificate card.
              </p>
            </div>
          </div>

          {/* Size Measurement Matrix */}
          <div className="specs-table-box">
            <div className="specs-table-header">
              <h3 className="table-title">Garment Measurement Matrix (Inches)</h3>
              <span className="table-note">ALL MEASUREMENTS ARE TOLERATED TO ±0.5 INCHES</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="specs-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>CHEST (IN)</th>
                    <th>LENGTH (IN)</th>
                    <th>SHOULDER (IN)</th>
                    <th>SLEEVE (IN)</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {(["S", "M", "L", "XL"] as const).map((s) => {
                    const m = product.sizeChart?.measurements?.[s] ?? {
                      chest: 42,
                      length: 28.5,
                      shoulder: 20,
                      sleeve: 9,
                    };
                    const variant = product.variants.find((v) => v.size === s);
                    const isAvailable = (variant?.availableStock ?? 0) > 0 || isPrebook;

                    return (
                      <tr key={s} className={selectedSize === s ? "active-size-row" : ""}>
                        <td className="size-cell">
                          <strong>{s}</strong>
                        </td>
                        <td>{m.chest}&quot;</td>
                        <td>{m.length}&quot;</td>
                        <td>{m.shoulder}&quot;</td>
                        <td>{m.sleeve}&quot;</td>
                        <td>
                          {isPrebook ? (
                            <span style={{ color: "#000000", fontWeight: 700 }}>PRE-BOOK</span>
                          ) : isAvailable ? (
                            <span style={{ color: "#16A34A", fontWeight: 700 }}>IN STOCK</span>
                          ) : (
                            <span style={{ color: "#999999" }}>SOLD OUT</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Size Guide Modal */}
      {isSizeGuideOpen && (
        <SizeGuideModal
          sizeChart={product.sizeChart || DEFAULT_APPAREL_SIZE_CHART}
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      )}

      {/* 6. Global Storefront Footer */}
      <StorefrontFooter />
    </main>
  );
}
