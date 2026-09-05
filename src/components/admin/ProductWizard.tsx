"use client";

import { useState, useEffect } from "react";
import { type UnifiedProduct } from "../../lib/product-engine";
import { ProductPageRenderer } from "../experience/ProductPageRenderer";
import { DEFAULT_APPAREL_SIZE_CHART, type SizeChart } from "../../lib/sizing";
import { AssetUploaderSlot, STANDARD_ASSET_SLOTS, type AssetSlotDef } from "./AssetUploaderSlot";

const UUID_REGEX = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type ViewportKey = "DESKTOP" | "TABLET" | "MOBILE";

const VIEWPORTS: Record<ViewportKey, { label: string; width: string; height: string }> = {
  DESKTOP: { label: "Desktop (1440px)", width: "100%", height: "540px" },
  TABLET: { label: "Tablet (834px)", width: "834px", height: "540px" },
  MOBILE: { label: "Mobile (390px)", width: "390px", height: "540px" },
};

export function ProductWizard({
  onCreated,
  onCancel,
}: {
  onCreated?: () => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [viewport, setViewport] = useState<ViewportKey>("DESKTOP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic Info
  const [name, setName] = useState("Bengaluru Heavyweight Tee");
  const [slug, setSlug] = useState("bengaluru-heavyweight-tee");
  const [sku, setSku] = useState("BEXYEE-BLR-001");
  const [cityName, setCityName] = useState("BENGALURU");
  const [collection, setCollection] = useState("MONSOON 2026");
  const [edition, setEdition] = useState("DROP 001");
  const [price, setPrice] = useState("1799");
  const [compareAtPrice, setCompareAtPrice] = useState("2499");
  const [gstRate, setGstRate] = useState("12");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("320 GSM SUPER LOOPKNIT");
  const [gsm, setGsm] = useState("320");
  const [fit, setFit] = useState("OVERSIZED");
  const [careInstructions, setCareInstructions] = useState("Machine wash cold. Line dry inside out.");

  // Step 2: Size Chart
  const [selectedSizeChartId, setSelectedSizeChartId] = useState(DEFAULT_APPAREL_SIZE_CHART.id);
  const [availableSizeCharts, setAvailableSizeCharts] = useState<SizeChart[]>([
    DEFAULT_APPAREL_SIZE_CHART,
  ]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/size-charts")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.sizeCharts && Array.isArray(data.sizeCharts) && data.sizeCharts.length > 0) {
          setAvailableSizeCharts(data.sizeCharts);
          const defaultChart = data.sizeCharts.find((c: { isDefault?: boolean; is_default?: boolean }) => c.isDefault || c.is_default) || data.sizeCharts[0];
          if (defaultChart?.id) {
            setSelectedSizeChartId(defaultChart.id);
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Step 3: Assets
  const [assets, setAssets] = useState<Record<string, { url: string; fileSizeBytes?: number }>>({
    PRODUCT_FRONT_IMAGE: { url: "/assets/products/bengaluru-tee-front.svg" },
    PRODUCT_BACK_IMAGE: { url: "/assets/products/bengaluru-tee-back.svg" },
    PRODUCT_LEFT_SLEEVE_IMAGE: { url: "/assets/products/bengaluru-tee-left.svg" },
    PRODUCT_RIGHT_SLEEVE_IMAGE: { url: "/assets/products/bengaluru-tee-right.svg" },
    PRODUCT_PRINT_IMAGE: { url: "/assets/products/bengaluru-tee-print.svg" },
    HERO_GLB: { url: "" },
  });

  // Step 4: Movable Background Set
  const [backgroundDesktop, setBackgroundDesktop] = useState("/bengaluru-signal-after-rain.svg");
  const [backgroundTablet, setBackgroundTablet] = useState("/bengaluru-signal-after-rain.svg");
  const [backgroundMobile, setBackgroundMobile] = useState("/bengaluru-signal-after-rain.svg");

  // Step 5: Inventory
  const [stockS, setStockS] = useState("25");
  const [stockM, setStockM] = useState("35");
  const [stockL, setStockL] = useState("25");
  const [stockXL, setStockXL] = useState("15");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  // Step 6: Launch Configuration & Purchase Mode
  const [purchaseModeType, setPurchaseModeType] = useState<"BUY_NOW" | "PREBOOK">("BUY_NOW");
  const [prebookStartsAt, setPrebookStartsAt] = useState("");
  const [prebookEndsAt, setPrebookEndsAt] = useState("");
  const [expectedFulfillmentDate, setExpectedFulfillmentDate] = useState("OCTOBER 2026");
  const [prebookLimit, setPrebookLimit] = useState("100");
  const [launchStatus, setLaunchStatus] = useState<"LIVE" | "SCHEDULED" | "DRAFT">("LIVE");
  const [startsAt, setStartsAt] = useState("");
  const [isLimitedDrop, setIsLimitedDrop] = useState(false);
  const [preorderThreshold, setPreorderThreshold] = useState("50");
  const [urgencyBadge] = useState("DROP 001 // NUMBERED RUN");

  const chosenSizeChart =
    availableSizeCharts.find((c) => c.id === selectedSizeChartId) || DEFAULT_APPAREL_SIZE_CHART;

  const isPrebookEnabled = purchaseModeType === "PREBOOK";
  const prebookConfig = isPrebookEnabled
    ? {
        isEnabled: true,
        startsAt: prebookStartsAt || undefined,
        endsAt: prebookEndsAt || undefined,
        expectedFulfillmentDate: expectedFulfillmentDate || "OCTOBER 2026",
        prebookLimit: Number(prebookLimit) || 100,
      }
    : undefined;

  const computedPurchaseMode: "BUY_NOW" | "PREBOOK" = isPrebookEnabled ? "PREBOOK" : "BUY_NOW";

  // Build draft UnifiedProduct for instant preview in Step 6
  const previewProduct: UnifiedProduct = {
    id: "draft-preview-id",
    name: name || "Draft City Uniform",
    slug: slug || "draft-city-uniform",
    edition: edition || "DROP 001",
    sku: sku || "BEXYEE-BLR-001",
    pricePaise: (parseFloat(price) || 1799) * 100,
    compareAtPricePaise: compareAtPrice ? parseFloat(compareAtPrice) * 100 : null,
    gstRate: parseInt(gstRate) || 12,
    cityName,
    collection,
    description: description || "A city uniform shaped by wet roads and metropolitan architecture.",
    fabric,
    gsm: parseInt(gsm) || 320,
    fit,
    careInstructions,
    sizeChart: chosenSizeChart,
    assets: {
      frontImage: assets.PRODUCT_FRONT_IMAGE?.url || "/assets/products/bengaluru-tee-front.svg",
      backImage: assets.PRODUCT_BACK_IMAGE?.url || "/assets/products/bengaluru-tee-back.svg",
      leftSleeveImage: assets.PRODUCT_LEFT_SLEEVE_IMAGE?.url || "/assets/products/bengaluru-tee-left.svg",
      rightSleeveImage: assets.PRODUCT_RIGHT_SLEEVE_IMAGE?.url || "/assets/products/bengaluru-tee-right.svg",
      printImage: assets.PRODUCT_PRINT_IMAGE?.url || "/assets/products/bengaluru-tee-print.svg",
      modelUrl: assets.HERO_GLB?.url || undefined,
      backgrounds: {
        desktop: backgroundDesktop || "/bengaluru-signal-after-rain.svg",
        tablet: backgroundTablet || backgroundDesktop || "/bengaluru-signal-after-rain.svg",
        mobile: backgroundMobile || backgroundDesktop || "/bengaluru-signal-after-rain.svg",
      },
      ogImage: backgroundDesktop,
    },
    variants: [
      { size: "S", physicalStock: Number(stockS), reservedStock: 0, availableStock: Number(stockS), threshold: Number(lowStockThreshold), status: "ACTIVE" },
      { size: "M", physicalStock: Number(stockM), reservedStock: 0, availableStock: Number(stockM), threshold: Number(lowStockThreshold), status: "ACTIVE" },
      { size: "L", physicalStock: Number(stockL), reservedStock: 0, availableStock: Number(stockL), threshold: Number(lowStockThreshold), status: "ACTIVE" },
      { size: "XL", physicalStock: Number(stockXL), reservedStock: 0, availableStock: Number(stockXL), threshold: Number(lowStockThreshold), status: "ACTIVE" },
    ],
    totalPhysicalStock: Number(stockS) + Number(stockM) + Number(stockL) + Number(stockXL),
    totalAvailableStock: Number(stockS) + Number(stockM) + Number(stockL) + Number(stockXL),
    isSoldOut: false,
    purchaseMode: computedPurchaseMode,
    prebookConfig,
    launch: {
      status: launchStatus,
      startsAt: startsAt || undefined,
      countdownEnabled: true,
      isLimitedDrop,
      preorderThreshold: isLimitedDrop ? Number(preorderThreshold) : 0,
      urgencyBadge,
      isPurchasable: launchStatus === "LIVE",
      purchaseMode: computedPurchaseMode,
      prebookStartsAt: prebookStartsAt || undefined,
      prebookEndsAt: prebookEndsAt || undefined,
      fulfillmentEstimate: expectedFulfillmentDate || "OCTOBER 2026",
      prebookQuantityLimit: Number(prebookLimit) || 100,
      serverTime: new Date().toISOString(),
    },
    seoTitle: `BEXYEE — ${name || "Product"}`,
    seoDescription: description,
  };

  async function handleFinalPublish() {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          sku: sku.trim(),
          cityName,
          collection,
          edition,
          price: parseFloat(price) || 0,
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          gstRate: parseInt(gstRate, 10) || 12,
          description,
          fabric,
          gsm: parseInt(gsm, 10) || 320,
          fit,
          careInstructions,
          sizeChartId: UUID_REGEX.test(selectedSizeChartId) ? selectedSizeChartId : null,
          frontImageUrl: assets.PRODUCT_FRONT_IMAGE?.url || "/assets/products/bengaluru-tee-front.svg",
          backImageUrl: assets.PRODUCT_BACK_IMAGE?.url || "/assets/products/bengaluru-tee-back.svg",
          leftSleeveImageUrl: assets.PRODUCT_LEFT_SLEEVE_IMAGE?.url || "/assets/products/bengaluru-tee-left.svg",
          rightSleeveImageUrl: assets.PRODUCT_RIGHT_SLEEVE_IMAGE?.url || "/assets/products/bengaluru-tee-right.svg",
          printImageUrl: assets.PRODUCT_PRINT_IMAGE?.url || "/assets/products/bengaluru-tee-print.svg",
          modelUrl: assets.HERO_GLB?.url || null,
          backgroundDesktop: backgroundDesktop || null,
          backgroundTablet: backgroundTablet || null,
          backgroundMobile: backgroundMobile || null,
          sizes: {
            S: parseInt(stockS, 10) || 0,
            M: parseInt(stockM, 10) || 0,
            L: parseInt(stockL, 10) || 0,
            XL: parseInt(stockXL, 10) || 0,
          },
          lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
          status: launchStatus === "LIVE" ? "ACTIVE" : "DRAFT",
          isLimitedDrop,
          preorderThreshold: isLimitedDrop ? parseInt(preorderThreshold, 10) || 0 : 0,
          purchaseMode: purchaseModeType,
          isPrebook: purchaseModeType === "PREBOOK",
          prebookStartsAt: prebookStartsAt ? new Date(prebookStartsAt).toISOString() : null,
          prebookEndsAt: prebookEndsAt ? new Date(prebookEndsAt).toISOString() : null,
          expectedFulfillmentDate: expectedFulfillmentDate || "OCTOBER 2026",
          prebookLimit: parseInt(prebookLimit, 10) || 100,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product in catalog.");
      }

      if (launchStatus === "SCHEDULED" && data.id) {
        await fetch("/api/admin/launches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: data.id,
            name: `${name} Drop`,
            slug: `${slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-drop`,
            status: "SCHEDULED",
            startsAt: startsAt ? new Date(startsAt).toISOString() : null,
            isLimitedDrop,
            preorderThreshold: isLimitedDrop ? parseInt(preorderThreshold) || 0 : 0,
            urgencyBadge,
            countdownEnabled: true,
            isPrebook: purchaseModeType === "PREBOOK",
            prebookStartsAt: prebookStartsAt ? new Date(prebookStartsAt).toISOString() : null,
            prebookEndsAt: prebookEndsAt ? new Date(prebookEndsAt).toISOString() : null,
            expectedFulfillmentDate: expectedFulfillmentDate || "OCTOBER 2026",
            prebookLimit: parseInt(prebookLimit) || 100,
          }),
        });
      }

      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error publishing product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", color: "#000000" }}>
      {/* Wizard Step Progress Tracker */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #E5E5E5", paddingBottom: "16px" }}>
        <div>
          <span style={{ fontSize: "9px", color: "#777777", letterSpacing: ".14em" }}>
            PRODUCT FACTORY // STEP {step} OF 6
          </span>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "#000000" }}>
            {step === 1 && "1. Product Identity & Pricing"}
            {step === 2 && "2. Reusable Size Chart Selection"}
            {step === 3 && "3. 2D Photographic & 3D Garment Assets"}
            {step === 4 && "4. Movable Background Set (Desktop / Tablet / Mobile)"}
            {step === 5 && "5. Variant Inventory Quantities & Thresholds"}
            {step === 6 && "6. Launch Status & Multi-Device Live Preview"}
          </h2>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3, 4, 5, 6].map((sNum) => (
            <button
              key={sNum}
              type="button"
              onClick={() => setStep(sNum as Step)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: step === sNum ? "#000000" : step > sNum ? "#F7F7F3" : "#FFFFFF",
                color: step === sNum ? "#FFFFFF" : "#000000",
                border: "1px solid #E5E5E5",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {sNum}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: "#FFF0F0", border: "1px solid #FFCCCC", color: "#D32F2F", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", fontWeight: 700 }}>
          ✕ {error}
        </div>
      )}

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Product Name *
              <input
                type="text"
                placeholder="e.g. Bengaluru Tee"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  setName(val);
                  if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) {
                    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                  }
                }}
                required
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              URL Slug *
              <input
                type="text"
                placeholder="e.g. bengaluru-tee"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                required
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              SKU Reference *
              <input type="text" placeholder="e.g. BEXYEE-BLR-001" value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} required />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              City Name
              <input type="text" placeholder="e.g. BENGALURU" value={cityName} onChange={(e) => setCityName(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Collection
              <input type="text" placeholder="e.g. MONSOON 2026" value={collection} onChange={(e) => setCollection(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Edition Tag
              <input type="text" placeholder="e.g. DROP 001" value={edition} onChange={(e) => setEdition(e.target.value)} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", borderTop: "1px solid #E5E5E5", paddingTop: "18px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Price (INR ₹) *
              <input type="number" placeholder="1799" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Compare At Price (Optional ₹)
              <input type="number" placeholder="2499" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              GST Rate %
              <select value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
                <option value="12">12% (Standard Apparel GST)</option>
                <option value="5">5% (Sub-₹1000 items)</option>
                <option value="18">18% (Accessories / Technical)</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", borderTop: "1px solid #E5E5E5", paddingTop: "18px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Fabric Construction
              <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Fabric Density (GSM)
              <input type="number" value={gsm} onChange={(e) => setGsm(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Silhouette / Fit
              <input type="text" value={fit} onChange={(e) => setFit(e.target.value)} />
            </label>
          </div>

          <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
            Editorial Product Description
            <textarea
              rows={3}
              placeholder="Narrative description celebrating the city and textile."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: "10px", fontSize: "12px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
            />
          </label>
        </div>
      )}

      {/* STEP 2: Size Chart Selection */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "13px", color: "#555555", margin: 0 }}>
            Attach a reusable size chart to guarantee consistent measurement values across drops:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {availableSizeCharts.map((chart) => {
              const isSelected = selectedSizeChartId === chart.id;
              return (
                <div
                  key={chart.id}
                  onClick={() => setSelectedSizeChartId(chart.id)}
                  style={{
                    border: isSelected ? "2px solid #000000" : "1px solid #E5E5E5",
                    background: isSelected ? "#F7F7F3" : "#FFFFFF",
                    padding: "18px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "13px", color: "#000000" }}>{chart.name}</strong>
                    {chart.isDefault && (
                      <span style={{ fontSize: "9px", background: "#000000", color: "#FFFFFF", padding: "2px 6px", fontWeight: 700 }}>
                        SYSTEM DEFAULT
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#666666", margin: "0 0 12px 0" }}>
                    {chart.fitDescription || "Standard oversized drop-shoulder measurement matrix."}
                  </p>
                  <div style={{ fontSize: "10.5px", color: "#000000", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "8px" }}>
                    S: {chart.measurements.S.chest}&quot; / {chart.measurements.S.length}&quot; &nbsp;|&nbsp; M: {chart.measurements.M.chest}&quot; / {chart.measurements.M.length}&quot; &nbsp;|&nbsp; L: {chart.measurements.L.chest}&quot; / {chart.measurements.L.length}&quot;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Product Assets */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "13px", color: "#555555", margin: 0 }}>
            Upload 2D photographic views and optional 3D GLB model (&lt; 4.5 MB):
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {STANDARD_ASSET_SLOTS.filter((s) => s.slot.startsWith("PRODUCT_") || s.slot === "HERO_GLB").map((slotDef) => (
              <AssetUploaderSlot
                key={slotDef.slot}
                slotDef={slotDef}
                value={assets[slotDef.slot]}
                onChange={(val: { url: string; filename?: string; fileSizeBytes?: number }) =>
                  setAssets((prev) => ({ ...prev, [slotDef.slot]: val }))
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Movable Background Set */}
      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "13px", color: "#555555", margin: 0 }}>
            Upload Desktop, Tablet, and Mobile movable background set.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Desktop Background URL (1440px+)
              <input type="text" value={backgroundDesktop} onChange={(e) => setBackgroundDesktop(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Tablet Background URL (768–1024px)
              <input type="text" value={backgroundTablet} onChange={(e) => setBackgroundTablet(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Mobile Background URL (&lt;768px)
              <input type="text" value={backgroundMobile} onChange={(e) => setBackgroundMobile(e.target.value)} />
            </label>
          </div>
        </div>
      )}

      {/* STEP 5: Inventory Quantities */}
      {step === 5 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "13px", color: "#555555", margin: 0 }}>
            Enter physical inventory quantities per size variant:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Small (S) Units
              <input type="number" value={stockS} onChange={(e) => setStockS(e.target.value)} min={0} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Medium (M) Units
              <input type="number" value={stockM} onChange={(e) => setStockM(e.target.value)} min={0} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Large (L) Units
              <input type="number" value={stockL} onChange={(e) => setStockL(e.target.value)} min={0} />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Extra Large (XL) Units
              <input type="number" value={stockXL} onChange={(e) => setStockXL(e.target.value)} min={0} />
            </label>
          </div>

          <label style={{ maxWidth: "260px", display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
            Low-Stock Alert Threshold
            <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} min={1} />
          </label>
        </div>
      )}

      {/* STEP 6: Launch Engine, Purchase Mode & Live Preview */}
      {step === 6 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Storefront Purchase Mode
              <select
                value={purchaseModeType}
                onChange={(e) => setPurchaseModeType(e.target.value as "BUY_NOW" | "PREBOOK")}
              >
                <option value="BUY_NOW">Buy Now (Immediate Storefront Purchase)</option>
                <option value="PREBOOK">Pre-Book (Pre-Order Window with Fulfillment Date)</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Launch Status
              <select value={launchStatus} onChange={(e) => setLaunchStatus(e.target.value as "LIVE" | "SCHEDULED" | "DRAFT")}>
                <option value="LIVE">LIVE (Instant Storefront Release)</option>
                <option value="SCHEDULED">SCHEDULED (Authoritative Clock)</option>
                <option value="DRAFT">DRAFT (Admin Only)</option>
              </select>
            </label>
          </div>

          {/* Pre-book Configuration Block */}
          {purchaseModeType === "PREBOOK" && (
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", borderLeft: "3px solid #E52B20", padding: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "11.5px", color: "#E52B20", letterSpacing: "0.08em" }}>PRE-BOOK CONFIGURATION</strong>
                <span style={{ fontSize: "9.5px", background: "#000000", color: "#FFFFFF", padding: "3px 8px", fontWeight: 700 }}>
                  PRE-BOOK ACTIVE
                </span>
              </div>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Pre-book Start (IST)
                <input type="datetime-local" value={prebookStartsAt} onChange={(e) => setPrebookStartsAt(e.target.value)} />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Pre-book End (IST)
                <input type="datetime-local" value={prebookEndsAt} onChange={(e) => setPrebookEndsAt(e.target.value)} />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Expected Fulfillment Date
                <input
                  type="text"
                  placeholder="e.g. OCTOBER 2026"
                  value={expectedFulfillmentDate}
                  onChange={(e) => setExpectedFulfillmentDate(e.target.value)}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Pre-book Quantity Limit
                <input
                  type="number"
                  placeholder="100"
                  value={prebookLimit}
                  onChange={(e) => setPrebookLimit(e.target.value)}
                />
              </label>
            </div>
          )}

          {launchStatus === "SCHEDULED" && (
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Launch Date &amp; Time (IST)
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
            </label>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="limited-drop-check"
              checked={isLimitedDrop}
              onChange={(e) => setIsLimitedDrop(e.target.checked)}
            />
            <label htmlFor="limited-drop-check" style={{ fontSize: "12px", color: "#000000", cursor: "pointer", fontWeight: 700 }}>
              Limited Drop with Pre-order Threshold
            </label>
          </div>

          {isLimitedDrop && (
            <label style={{ display: "grid", gap: "6px", fontSize: "11.5px", fontWeight: 700 }}>
              Pre-order Minimum Threshold Units
              <input type="number" value={preorderThreshold} onChange={(e) => setPreorderThreshold(e.target.value)} />
            </label>
          )}

          {/* Live Preview Viewport Switcher */}
          <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", color: "#000000", fontWeight: 700 }}>LIVE MULTI-DEVICE PREVIEW</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {(Object.keys(VIEWPORTS) as ViewportKey[]).map((vKey) => (
                  <button
                    key={vKey}
                    type="button"
                    onClick={() => setViewport(vKey)}
                    style={{
                      background: viewport === vKey ? "#000000" : "#F7F7F3",
                      color: viewport === vKey ? "#FFFFFF" : "#000000",
                      border: "1px solid #E5E5E5",
                      fontSize: "10.5px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {VIEWPORTS[vKey].label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", background: "#F7F7F3", padding: "16px", border: "1px solid #E5E5E5", overflowX: "auto" }}>
              <div
                style={{
                  width: VIEWPORTS[viewport].width,
                  height: VIEWPORTS[viewport].height,
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  overflowY: "auto",
                }}
              >
                <ProductPageRenderer product={previewProduct} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px", borderTop: "1px solid #E5E5E5", paddingTop: "18px" }}>
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              style={{ background: "#FFFFFF", color: "#000000", border: "1px solid #E5E5E5", padding: "10px 18px", fontSize: "11px", cursor: "pointer", fontWeight: 700 }}
            >
              ← BACK
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ background: "transparent", border: "1px solid #E5E5E5", color: "#777777", padding: "10px 16px", fontSize: "11px", cursor: "pointer" }}
            >
              CANCEL
            </button>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as Step)}
              style={{ background: "#000000", color: "#FFFFFF", border: 0, padding: "10px 22px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
            >
              NEXT STEP →
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalPublish}
              style={{
                background: "#000000",
                color: "#FFFFFF",
                border: 0,
                padding: "14px 28px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "PUBLISHING TO PRODUCTION..." : "🚀 PUBLISH PRODUCT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
