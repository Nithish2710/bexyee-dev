"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type UnifiedProduct, type SizeVariantInventory, type LaunchStatus, type PurchaseMode, type ProductBackgroundType } from "../../lib/product-engine";
import { MovableBackground } from "../hero/MovableBackground";
import { HeroProduct3D } from "../hero/HeroProduct3D";

export type ProductControlCenterProps = {
  initialProduct: UnifiedProduct;
  auditLogs?: Array<{
    id: string;
    action: string;
    entity: string;
    entity_id: string;
    performed_by: string;
    created_at: string;
    metadata?: Record<string, unknown>;
  }>;
  analyticsData?: {
    views?: number;
    addToCart?: number;
    checkoutStarts?: number;
    purchases?: number;
    revenuePaise?: number;
    unitsSold?: number;
    refundsCount?: number;
    totalRevenuePaise?: number;
    totalUnitsSold?: number;
    selloutPercentage?: number;
    cartConversionRate?: number;
  };
};

type SectionTab =
  | "PRODUCT"
  | "INVENTORY"
  | "ASSETS"
  | "BACKGROUND"
  | "LAUNCH"
  | "PURCHASE_MODE"
  | "PREVIEW"
  | "PERFORMANCE"
  | "ACTIVITY";

type ViewportKey = "1920" | "1440" | "1024" | "768" | "414" | "375";

const VIEWPORTS: Record<ViewportKey, { label: string; width: string; height: string }> = {
  "1920": { label: "1920px (Desktop)", width: "100%", height: "800px" },
  "1440": { label: "1440px (Laptop)", width: "100%", height: "760px" },
  "1024": { label: "1024px (Tablet)", width: "1024px", height: "700px" },
  "768": { label: "768px (Tablet Portrait)", width: "768px", height: "700px" },
  "414": { label: "414px (Mobile Large)", width: "414px", height: "700px" },
  "375": { label: "375px (Mobile)", width: "375px", height: "700px" },
};

export function ProductControlCenter({
  initialProduct,
  auditLogs = [],
  analyticsData,
  initialSection = "PRODUCT",
}: ProductControlCenterProps & { initialSection?: SectionTab }) {
  const router = useRouter();
  const [product, setProduct] = useState<UnifiedProduct>(initialProduct);
  const [activeTab, setActiveTab] = useState<SectionTab>(initialSection);
  const [viewport, setViewport] = useState<ViewportKey>("1440");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDeleteProduct() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete product.");
      }

      notify("✓ Product successfully removed from storefront.");
      setTimeout(() => {
        router.push("/admin");
      }, 800);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error deleting product.", "error");
    } finally {
      setIsSaving(false);
      setConfirmDelete(false);
    }
  }

  // Section 1: Product Form State
  const [formState, setFormState] = useState({
    name: initialProduct.name,
    slug: initialProduct.slug,
    sku: initialProduct.sku,
    cityName: initialProduct.cityName,
    collection: initialProduct.collection,
    edition: initialProduct.edition,
    pricePaise: initialProduct.pricePaise,
    compareAtPricePaise: initialProduct.compareAtPricePaise,
    gstRate: initialProduct.gstRate,
    description: initialProduct.description,
    fabric: initialProduct.fabric,
    gsm: initialProduct.gsm,
    fit: initialProduct.fit,
    careInstructions: initialProduct.careInstructions || "",
    seoTitle: initialProduct.seoTitle,
    seoDescription: initialProduct.seoDescription,
  });

  // Section 2: Inventory Adjust Modal State
  const [adjustModal, setAdjustModal] = useState<{
    isOpen: boolean;
    size: "S" | "M" | "L" | "XL";
    mode: "SET" | "ADD" | "REMOVE";
    amount: string;
    reason: string;
  }>({
    isOpen: false,
    size: "M",
    mode: "SET",
    amount: "",
    reason: "Standard inventory audit",
  });

  // Section 3: Assets State
  const [assetSlots, setAssetSlots] = useState(initialProduct.assets);

  // Section 4: Movable Background State & Modes
  const [bgType, setBgType] = useState<ProductBackgroundType>(
    initialProduct.assets.backgroundType || "DEFAULT_STUDIO"
  );
  const [bgDesktop, setBgDesktop] = useState(initialProduct.assets.backgrounds.desktop || "");
  const [bgTablet, setBgTablet] = useState(initialProduct.assets.backgrounds.tablet || "");
  const [bgMobile, setBgMobile] = useState(initialProduct.assets.backgrounds.mobile || "");

  // Section 5: Launch & Purchase Mode State
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>(initialProduct.launch.status);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>(initialProduct.launch.purchaseMode || "BUY_NOW");
  const [prebookStart, setPrebookStart] = useState(initialProduct.launch.prebookStartsAt || "");
  const [prebookEnd, setPrebookEnd] = useState(initialProduct.launch.prebookEndsAt || "");
  const [fulfillmentEstimate, setFulfillmentEstimate] = useState(initialProduct.launch.fulfillmentEstimate || "OCTOBER 2026");
  const [sizePrebookLimits, setSizePrebookLimits] = useState<Record<"S" | "M" | "L" | "XL", number>>(() => {
    const map: Record<"S" | "M" | "L" | "XL", number> = { S: 20, M: 50, L: 30, XL: 20 };
    (initialProduct.variants || []).forEach((v) => {
      if (v.size && v.size in map) {
        map[v.size as "S" | "M" | "L" | "XL"] = typeof v.prebookLimit === "number" ? v.prebookLimit : (v.size === "M" ? 50 : v.size === "L" ? 30 : 20);
      }
    });
    if (initialProduct.prebookConfig?.sizeLimits) {
      return { ...map, ...initialProduct.prebookConfig.sizeLimits };
    }
    return map;
  });

  function notify(text: string, type: "success" | "error" = "success") {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  }

  // 1. SAVE PRODUCT DETAILS
  async function handleSaveProduct() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: formState.name,
          slug: formState.slug,
          sku: formState.sku,
          cityName: formState.cityName,
          collection: formState.collection,
          edition: formState.edition,
          price: formState.pricePaise / 100,
          compareAtPrice: formState.compareAtPricePaise ? formState.compareAtPricePaise / 100 : null,
          gstRate: formState.gstRate,
          description: formState.description,
          fabric: formState.fabric,
          gsm: formState.gsm,
          fit: formState.fit,
          careInstructions: formState.careInstructions,
          seoTitle: formState.seoTitle,
          seoDescription: formState.seoDescription,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to persist product updates.");
      }

      setProduct((prev) => ({
        ...prev,
        ...formState,
      }));
      notify("✓ Product identity, pricing, and SEO persisted to database.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error updating product.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // 1b. SAVE ASSETS & 3D GLB
  async function handleSaveAssets() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          modelUrl: assetSlots.modelUrl || null,
          frontImageUrl: assetSlots.frontImage,
          backImageUrl: assetSlots.backImage,
          leftSleeveImageUrl: assetSlots.leftSleeveImage,
          rightSleeveImageUrl: assetSlots.rightSleeveImage,
          printImageUrl: assetSlots.printImage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to persist asset configuration.");
      }

      setProduct((prev) => ({
        ...prev,
        assets: {
          ...prev.assets,
          ...assetSlots,
        },
      }));
      notify("✓ Visual assets and 3D GLB configuration persisted to database.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error saving assets.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // 1c. SAVE BACKGROUND ENVIRONMENT
  async function handleSaveBackgrounds() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          backgroundType: bgType,
          backgroundDesktop: bgType === "PRODUCT_SPECIFIC" ? (bgDesktop || null) : null,
          backgroundTablet: bgType === "PRODUCT_SPECIFIC" ? (bgTablet || null) : null,
          backgroundMobile: bgType === "PRODUCT_SPECIFIC" ? (bgMobile || null) : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to persist background environment.");
      }

      setProduct((prev) => ({
        ...prev,
        assets: {
          ...prev.assets,
          backgroundType: bgType,
          backgrounds: {
            desktop: bgType === "NONE" ? "" : (bgType === "PRODUCT_SPECIFIC" ? bgDesktop : (bgType === "COLLECTION" ? (product.cityName === "BENGALURU" ? "/bengaluru-signal-after-rain.svg" : "/assets/environments/bexyee-studio-neutral.svg") : "/assets/environments/bexyee-studio-neutral.svg")),
            tablet: bgType === "NONE" ? "" : (bgType === "PRODUCT_SPECIFIC" ? (bgTablet || bgDesktop) : "/assets/environments/bexyee-studio-neutral.svg"),
            mobile: bgType === "NONE" ? "" : (bgType === "PRODUCT_SPECIFIC" ? (bgMobile || bgDesktop) : "/assets/environments/bexyee-studio-neutral.svg"),
          },
        },
      }));
      notify("✓ Product visual environment configuration persisted to database.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error saving background environment.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // 2. INVENTORY ADJUSTMENT ACTION
  async function handleExecuteInventoryAdjustment() {
    const val = parseInt(adjustModal.amount);
    if (isNaN(val) || val <= 0) {
      notify("Please enter a valid stock quantity amount.", "error");
      return;
    }
    if (!adjustModal.reason.trim()) {
      notify("Adjustment reason is mandatory for audit trail compliance.", "error");
      return;
    }

    const currentVariant = product.variants.find((v) => v.size === adjustModal.size);
    const currentPhysical = currentVariant?.physicalStock ?? 0;
    let delta = 0;

    if (adjustModal.mode === "SET") {
      delta = val - currentPhysical;
    } else if (adjustModal.mode === "ADD") {
      delta = val;
    } else if (adjustModal.mode === "REMOVE") {
      delta = -val;
    }

    if (delta === 0) {
      notify("Stock quantity remains unchanged (delta = 0).", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: adjustModal.size,
          delta,
          reason: adjustModal.reason.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Inventory adjustment failed.");
      }

      // Update local matrix
      setProduct((prev) => {
        const updatedVariants = prev.variants.map((v) => {
          if (v.size === adjustModal.size) {
            const nextPhysical = Math.max(0, v.physicalStock + delta);
            const nextAvail = Math.max(0, nextPhysical - v.reservedStock);
            const nextStatus: "ACTIVE" | "LOW" | "SOLD OUT" =
              nextPhysical === 0 || nextAvail === 0 ? "SOLD OUT" : nextAvail <= v.threshold ? "LOW" : "ACTIVE";
            return {
              ...v,
              physicalStock: nextPhysical,
              availableStock: nextAvail,
              status: nextStatus,
            };
          }
          return v;
        });

        const totalAvail = updatedVariants.reduce((acc, v) => acc + v.availableStock, 0);
        return {
          ...prev,
          variants: updatedVariants,
          totalAvailableStock: totalAvail,
          isSoldOut: totalAvail === 0,
        };
      });

      setAdjustModal((prev) => ({ ...prev, isOpen: false, amount: "" }));
      notify(`✓ Stock for size ${adjustModal.size} adjusted by ${delta > 0 ? "+" : ""}${delta} units.`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Adjustment error.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // 4. LAUNCH & PURCHASE MODE ACTION
  async function handleSaveLaunchAndPurchaseMode(newStatus?: LaunchStatus) {
    const targetStatus = newStatus || launchStatus;
    setIsSaving(true);
    const totalLimit = (sizePrebookLimits.S || 0) + (sizePrebookLimits.M || 0) + (sizePrebookLimits.L || 0) + (sizePrebookLimits.XL || 0);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          status: targetStatus,
          purchaseMode,
          isPrebook: purchaseMode === "PREBOOK",
          prebookStartsAt: prebookStart ? new Date(prebookStart).toISOString() : null,
          prebookEndsAt: prebookEnd ? new Date(prebookEnd).toISOString() : null,
          expectedFulfillmentDate: fulfillmentEstimate,
          sizePrebookLimits,
          prebookLimit: totalLimit,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to update launch and purchase mode.");
      }

      setLaunchStatus(targetStatus);
      setProduct((prev) => {
        const updatedVariants = prev.variants.map((v) => {
          const limit = sizePrebookLimits[v.size as "S" | "M" | "L" | "XL"] ?? v.prebookLimit ?? 50;
          const prebooked = v.prebookedCount ?? 0;
          const availablePrebook = Math.max(0, limit - prebooked);
          return {
            ...v,
            prebookLimit: limit,
            availablePrebook,
            availableStock: purchaseMode === "PREBOOK" ? availablePrebook : v.availableStock,
            status: (purchaseMode === "PREBOOK" ? (availablePrebook === 0 ? "SOLD OUT" : availablePrebook <= v.threshold ? "LOW" : "ACTIVE") : v.status) as "ACTIVE" | "LOW" | "SOLD OUT",
          };
        });

        const totalAvailable = updatedVariants.reduce((acc, v) => acc + v.availableStock, 0);

        return {
          ...prev,
          variants: updatedVariants,
          totalAvailableStock: totalAvailable,
          isSoldOut: totalAvailable <= 0,
          launch: {
            ...prev.launch,
            status: targetStatus,
            purchaseMode,
            prebookStartsAt: prebookStart || undefined,
            prebookEndsAt: prebookEnd || undefined,
            fulfillmentEstimate,
            prebookQuantityLimit: totalLimit,
            isPurchasable: targetStatus === "LIVE" && (purchaseMode === "PREBOOK" || totalAvailable > 0),
          },
          prebookConfig: purchaseMode === "PREBOOK" ? {
            isEnabled: true,
            startsAt: prebookStart || undefined,
            endsAt: prebookEnd || undefined,
            expectedFulfillmentDate: fulfillmentEstimate,
            sizeLimits: sizePrebookLimits,
            prebookLimit: totalLimit,
          } : undefined,
        };
      });

      notify(`✓ Launch state updated to ${targetStatus} (${purchaseMode}).`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error updating launch status.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  const isLive = launchStatus === "LIVE";
  const isPaused = launchStatus === "PAUSED";
  const viewButtonLabel = isLive || isPaused ? "VIEW STOREFRONT ↗" : "VIEW PREVIEW ↗";

  return (
    <div className="product-control-center" style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      {/* Top Breadcrumbs & Master Status Bar */}
      <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5", padding: "24px clamp(20px, 4vw, 48px)" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#777777", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <Link href="/admin" style={{ color: "#000000", textDecoration: "none", fontWeight: 700 }}>BEXYEE</Link>
              <span>/</span>
              <span>PRODUCTS</span>
              <span>/</span>
              <strong style={{ color: "#000000" }}>{product.sku}</strong>
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {product.name}
            </h1>
          </div>

          {/* Quick Master Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                padding: "6px 12px",
                background: isLive ? "#000000" : isPaused ? "#FFFBEB" : "#F7F7F3",
                color: isLive ? "#FFFFFF" : isPaused ? "#B45309" : "#555555",
                border: isPaused ? "1px solid #FCD34D" : "1px solid #E5E5E5",
              }}
            >
              STATE: {launchStatus} {isLive || isPaused ? `(${purchaseMode})` : ""}
            </span>

            {isLive ? (
              <button
                type="button"
                onClick={() => handleSaveLaunchAndPurchaseMode("PAUSED")}
                disabled={isSaving}
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#E52B20", padding: "8px 14px", fontSize: "10.5px", fontWeight: 700, cursor: "pointer" }}
              >
                PAUSE LAUNCH
              </button>
            ) : isPaused ? (
              <button
                type="button"
                onClick={() => handleSaveLaunchAndPurchaseMode("LIVE")}
                disabled={isSaving}
                style={{ background: "#000000", border: "1px solid #000000", color: "#FFFFFF", padding: "8px 16px", fontSize: "10.5px", fontWeight: 800, cursor: "pointer" }}
              >
                RESUME LAUNCH ↗
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveLaunchAndPurchaseMode("LIVE")}
                disabled={isSaving}
                style={{ background: "#000000", border: "1px solid #000000", color: "#FFFFFF", padding: "8px 16px", fontSize: "10.5px", fontWeight: 800, cursor: "pointer" }}
              >
                PUBLISH LIVE ↗
              </button>
            )}

            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#FFFFFF",
                border: "1px solid #000000",
                color: "#000000",
                padding: "8px 14px",
                fontSize: "10.5px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {viewButtonLabel}
            </Link>

            <button
              type="button"
              id="pcc-delete-product-btn"
              onClick={() => setConfirmDelete(true)}
              style={{
                background: "#FFF1F0",
                border: "1px solid #FFA39E",
                color: "#E52B20",
                padding: "8px 14px",
                fontSize: "10.5px",
                fontWeight: 800,
                cursor: "pointer",
              }}
              title="Delete or safely archive product"
            >
              DELETE ✕
            </button>
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #E52B20",
              maxWidth: "500px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ fontSize: "10px", color: "#E52B20", letterSpacing: "0.14em", fontWeight: 800 }}>
              DANGER // PERMANENT ACTION
            </span>
            <h3 style={{ fontSize: "20px", color: "#000000", margin: "8px 0 12px 0" }}>
              Delete {product.name}?
            </h3>
            <p style={{ fontSize: "12.5px", color: "#444444", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              This product will be removed from the active catalog and immediately hidden across all customer storefront pages.
            </p>
            <p style={{ fontSize: "11px", color: "#777777", background: "#F7F7F3", padding: "10px 14px", border: "1px solid #E5E5E5", margin: "0 0 24px 0" }}>
              ℹ If customer orders exist for this product, it will be automatically archived to preserve financial records with <strong>zero storefront visibility</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                id="cancel-pcc-delete-btn"
                onClick={() => setConfirmDelete(false)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  padding: "10px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                id="confirm-pcc-delete-btn"
                onClick={handleDeleteProduct}
                disabled={isSaving}
                style={{
                  background: "#E52B20",
                  border: "1px solid #E52B20",
                  color: "#FFFFFF",
                  padding: "10px 22px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isSaving ? "DELETING..." : "PERMANENTLY DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Status Toast */}
      {statusMessage && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: statusMessage.type === "success" ? "#000000" : "#DC2626",
            color: "#FFFFFF",
            padding: "12px 24px",
            fontSize: "11.5px",
            fontWeight: 700,
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Main Section Navigation Bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", overflowX: "auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
          {[
            { id: "PRODUCT", label: "1. Product Identity" },
            { id: "INVENTORY", label: "2. Inventory Matrix" },
            { id: "ASSETS", label: "3. Assets & 3D GLB" },
            { id: "BACKGROUND", label: "4. Movable Background" },
            { id: "LAUNCH", label: "5. Launch & Purchase Mode" },
            { id: "PREVIEW", label: "6. Multi-Device Preview" },
            { id: "PERFORMANCE", label: "7. Performance" },
            { id: "ACTIVITY", label: "8. Activity Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id.toLowerCase()}`}
              data-testid={`tab-${tab.id.toLowerCase()}`}
              data-tab-id={tab.id}
              type="button"
              onClick={() => {
                console.log("SWITCHING TO TAB:", tab.id);
                setActiveTab(tab.id as SectionTab);
              }}
              style={{
                background: "transparent",
                border: "0",
                borderBottom: activeTab === tab.id ? "3px solid #000000" : "3px solid transparent",
                color: activeTab === tab.id ? "#000000" : "#777777",
                padding: "16px 20px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel Content Container */}
      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "36px clamp(20px, 4vw, 48px) 80px" }}>
        {/* SECTION 1: PRODUCT IDENTITY & COMMERCIALS */}
        {activeTab === "PRODUCT" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 01 // IDENTITY &amp; COMMERCIALS</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Master Product Attributes</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Product Name
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                URL Slug
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Master SKU
                <input
                  type="text"
                  value={formState.sku}
                  onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                City Designation
                <input
                  type="text"
                  value={formState.cityName}
                  onChange={(e) => setFormState({ ...formState, cityName: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Collection / Capsule
                <input
                  type="text"
                  value={formState.collection}
                  onChange={(e) => setFormState({ ...formState, collection: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Edition Batch Tag
                <input
                  type="text"
                  value={formState.edition}
                  onChange={(e) => setFormState({ ...formState, edition: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>
            </div>

            {/* Pricing Matrix */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", borderTop: "1px solid #F0F0EE", paddingTop: "20px" }}>
              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Retail Price (₹ INR)
                <input
                  type="number"
                  value={formState.pricePaise / 100}
                  onChange={(e) => setFormState({ ...formState, pricePaise: (parseFloat(e.target.value) || 0) * 100 })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Compare-at Price (₹ INR)
                <input
                  type="number"
                  value={formState.compareAtPricePaise ? formState.compareAtPricePaise / 100 : ""}
                  onChange={(e) => setFormState({ ...formState, compareAtPricePaise: e.target.value ? (parseFloat(e.target.value) || 0) * 100 : null })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Apparel GST Rate %
                <select
                  value={formState.gstRate}
                  onChange={(e) => setFormState({ ...formState, gstRate: parseInt(e.target.value) || 12 })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit", background: "#FFFFFF" }}
                >
                  <option value="12">12% (Standard Apparel GST)</option>
                  <option value="5">5% (Sub-₹1000 items)</option>
                  <option value="18">18% (Technical Apparel)</option>
                </select>
              </label>
            </div>

            {/* Narrative & Textile Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", borderTop: "1px solid #F0F0EE", paddingTop: "20px" }}>
              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Fabric Construction
                <input
                  type="text"
                  value={formState.fabric}
                  onChange={(e) => setFormState({ ...formState, fabric: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Density (GSM)
                <input
                  type="number"
                  value={formState.gsm || 320}
                  onChange={(e) => setFormState({ ...formState, gsm: parseInt(e.target.value) || 320 })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>

              <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                Silhouette Fit
                <input
                  type="text"
                  value={formState.fit}
                  onChange={(e) => setFormState({ ...formState, fit: e.target.value })}
                  style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit" }}
                />
              </label>
            </div>

            <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
              Editorial Description
              <textarea
                rows={3}
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                style={{ padding: "12px", border: "1px solid #E5E5E5", fontFamily: "inherit", fontSize: "12px" }}
              />
            </label>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #F0F0EE", paddingTop: "20px" }}>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSaving}
                style={{
                  background: "#000000",
                  color: "#FFFFFF",
                  border: "1px solid #000000",
                  padding: "12px 24px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                {isSaving ? "PERSISTING..." : "SAVE & PERSIST TO DATABASE ↗"}
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: INVENTORY MATRIX & AUDIT LOG */}
        {activeTab === "INVENTORY" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 02 // INVENTORY SYSTEM</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Live Stock Breakdown &amp; Adjustment Engine</h2>
              <p style={{ fontSize: "12px", color: "#666666", margin: "4px 0 0" }}>
                Formula Invariant: <code>Available = Physical Stock - Active Reserved Stock</code>
              </p>
            </div>

            {/* Variants Matrix Table */}
            <div style={{ overflowX: "auto", border: "1px solid #E5E5E5" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F7F7F3", borderBottom: "1px solid #E5E5E5" }}>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777" }}>SIZE</th>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777" }}>PHYSICAL</th>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777" }}>RESERVED</th>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777" }}>AVAILABLE</th>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777" }}>STATUS</th>
                    <th style={{ padding: "12px 16px", fontSize: "10px", color: "#777777", textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.size} style={{ borderBottom: "1px solid #F0F0EE" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 800 }}>{v.size}</td>
                      <td style={{ padding: "14px 16px" }}>{v.physicalStock} units</td>
                      <td style={{ padding: "14px 16px", color: "#777777" }}>{v.reservedStock} holds</td>
                      <td style={{ padding: "14px 16px", fontWeight: 800, color: v.availableStock <= 3 ? "#E52B20" : "#000000" }}>
                        {v.availableStock} units
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            padding: "3px 6px",
                            background: v.status === "ACTIVE" ? "#EBFDF2" : v.status === "LOW" ? "#FEF3C7" : "#F3F4F6",
                            color: v.status === "ACTIVE" ? "#15803D" : v.status === "LOW" ? "#D97706" : "#4B5563",
                          }}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => setAdjustModal({ isOpen: true, size: v.size, mode: "SET", amount: String(v.physicalStock), reason: "Stock recount" })}
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid #000000",
                            color: "#000000",
                            padding: "6px 12px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ADJUST ✎
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inventory Adjustment Inline Modal */}
            {adjustModal.isOpen && (
              <div style={{ background: "#F7F7F3", border: "1px solid #000000", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "12px", letterSpacing: "0.06em" }}>
                    INVENTORY ADJUSTMENT: SIZE {adjustModal.size}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setAdjustModal({ ...adjustModal, isOpen: false })}
                    style={{ background: "transparent", border: "0", cursor: "pointer", fontWeight: 700 }}
                  >
                    ✕ CLOSE
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Adjustment Mode
                    <select
                      value={adjustModal.mode}
                      onChange={(e) => setAdjustModal({ ...adjustModal, mode: e.target.value as "SET" | "ADD" | "REMOVE" })}
                      style={{ padding: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF" }}
                    >
                      <option value="SET">SET EXACT STOCK</option>
                      <option value="ADD">ADD UNITS (+)</option>
                      <option value="REMOVE">REMOVE UNITS (-)</option>
                    </select>
                  </label>

                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Quantity Amount
                    <input
                      type="number"
                      min={0}
                      value={adjustModal.amount}
                      onChange={(e) => setAdjustModal({ ...adjustModal, amount: e.target.value })}
                      style={{ padding: "8px", border: "1px solid #E5E5E5" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Mandatory Audit Reason
                    <input
                      type="text"
                      placeholder="e.g. Warehouse batch count verification"
                      value={adjustModal.reason}
                      onChange={(e) => setAdjustModal({ ...adjustModal, reason: e.target.value })}
                      style={{ padding: "8px", border: "1px solid #E5E5E5" }}
                      required
                    />
                  </label>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleExecuteInventoryAdjustment}
                    disabled={isSaving}
                    style={{
                      background: "#000000",
                      color: "#FFFFFF",
                      border: "1px solid #000000",
                      padding: "10px 18px",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    CONFIRM &amp; RECORD AUDIT ENTRY ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: ASSETS & 3D GLB */}
        {activeTab === "ASSETS" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 03 // VISUAL ASSETS</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>2D Photographic Views &amp; 3D Garment Models</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {[
                { slot: "FRONT", label: "Front View", url: assetSlots.frontImage },
                { slot: "BACK", label: "Back View", url: assetSlots.backImage },
                { slot: "LEFT SLEEVE", label: "Left Sleeve", url: assetSlots.leftSleeveImage },
                { slot: "RIGHT SLEEVE", label: "Right Sleeve", url: assetSlots.rightSleeveImage },
                { slot: "PRINT", label: "Graphic Print Detail", url: assetSlots.printImage },
              ].map((item) => (
                <div key={item.slot} style={{ border: "1px solid #E5E5E5", padding: "16px", background: "#F7F7F3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "10px", fontWeight: 800 }}>
                    <span>{item.label}</span>
                    <span style={{ color: "#16A34A" }}>ACTIVE v1</span>
                  </div>
                  <div style={{ height: "140px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: "1px solid #E5E5E5", marginBottom: "10px" }}>
                    <Image src={item.url} alt={item.label} width={100} height={100} style={{ objectFit: "contain" }} unoptimized />
                  </div>
                  <div style={{ fontSize: "10px", color: "#777777", wordBreak: "break-all" }}>{item.url}</div>
                </div>
              ))}

              {/* 3D GLB Garment Slot */}
              <div style={{ border: "1px solid #E5E5E5", padding: "16px", background: "#F7F7F3", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "10px", fontWeight: 800 }}>
                    <span>HERO 3D GLB MODEL</span>
                    {assetSlots.modelUrl ? <span style={{ color: "#16A34A" }}>ACTIVE 3D</span> : <span style={{ color: "#E52B20" }}>NOT UPLOADED</span>}
                  </div>
                  <div style={{ height: "140px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: "1px dashed #CCCCCC", marginBottom: "10px", padding: "16px", textAlign: "center" }}>
                    {assetSlots.modelUrl ? (
                      <span style={{ fontSize: "11px", fontWeight: 700 }}>✓ GLB Model Attached</span>
                    ) : (
                      <div style={{ fontSize: "11px", color: "#777777" }}>
                        <strong>3D ASSET NOT UPLOADED</strong>
                        <p style={{ margin: "4px 0 0", fontSize: "9.5px" }}>Storefront gracefully renders high-res photography until GLB is supplied.</p>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="GLB Asset URL (e.g. /models/tee.glb)"
                  value={assetSlots.modelUrl || ""}
                  onChange={(e) => setAssetSlots({ ...assetSlots, modelUrl: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #E5E5E5", fontSize: "11px", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAssets}
              disabled={isSaving}
              style={{
                alignSelf: "flex-start",
                background: "#000000",
                color: "#FFFFFF",
                border: "1px solid #000000",
                padding: "12px 24px",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              SAVE ASSETS &amp; 3D MODEL ↗
            </button>
          </div>
        )}

        {/* SECTION 4: INDEPENDENT VISUAL ENVIRONMENT & BACKGROUND MODES */}
        {activeTab === "BACKGROUND" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 04 // VISUAL ENVIRONMENT</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Product Visual Environment &amp; Background Architecture</h2>
              <p style={{ fontSize: "12px", color: "#666666", margin: "4px 0 0" }}>
                Every product controls its own independent backdrop. The global brand fallback is neutral BEXYEE studio.
              </p>
            </div>

            {/* 4 Background Modes Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              {[
                {
                  id: "DEFAULT_STUDIO" as ProductBackgroundType,
                  title: "A. DEFAULT BEXYEE STUDIO",
                  desc: "Neutral obsidian architectural studio grid with subtle ambient light. Recommended default for all standard products.",
                  badge: "BRAND DEFAULT",
                },
                {
                  id: "COLLECTION" as ProductBackgroundType,
                  title: "B. COLLECTION ENVIRONMENT",
                  desc: `Inherits contextual backdrop of collection (${formState.collection || "Assigned Capsule"})${formState.cityName === "BENGALURU" ? " — Bengaluru Rain Signal" : ""}.`,
                  badge: formState.cityName === "BENGALURU" ? "BENGALURU EDITION" : "COLLECTION",
                },
                {
                  id: "PRODUCT_SPECIFIC" as ProductBackgroundType,
                  title: "C. PRODUCT-SPECIFIC",
                  desc: "Independent custom multi-breakpoint URLs (Desktop 1440px+, Tablet 768px, Mobile 375px) exclusive to this product.",
                  badge: "CUSTOM ASSET",
                },
                {
                  id: "NONE" as ProductBackgroundType,
                  title: "D. NO BACKGROUND / CLEAN",
                  desc: "Pure darkroom minimal studio canvas with zero image overlays. Fastest performance and maximum garment focus.",
                  badge: "MINIMAL CANVAS",
                },
              ].map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setBgType(mode.id)}
                  style={{
                    border: bgType === mode.id ? "2px solid #000000" : "1px solid #E5E5E5",
                    background: bgType === mode.id ? "#F7F7F3" : "#FFFFFF",
                    padding: "16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "11px", letterSpacing: "0.04em" }}>{mode.title}</strong>
                      <span style={{ fontSize: "9px", background: bgType === mode.id ? "#000000" : "#EAEAE8", color: bgType === mode.id ? "#FFFFFF" : "#666666", padding: "2px 6px", fontWeight: 700 }}>
                        {mode.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#666666", margin: "0 0 12px", lineHeight: "1.4" }}>
                      {mode.desc}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: 700 }}>
                    <input
                      type="radio"
                      name="bgTypeSelector"
                      checked={bgType === mode.id}
                      onChange={() => setBgType(mode.id)}
                    />
                    <span>{bgType === mode.id ? "ACTIVE MODE" : "SELECT"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Multi-Breakpoint URLs (Rendered if PRODUCT_SPECIFIC) */}
            {bgType === "PRODUCT_SPECIFIC" && (
              <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <strong style={{ fontSize: "11px", letterSpacing: "0.06em" }}>CUSTOM MULTI-BREAKPOINT ASSET PATHS</strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Desktop Background URL (1440px+)
                    <input
                      type="text"
                      placeholder="/assets/environments/custom-desktop.svg"
                      value={bgDesktop}
                      onChange={(e) => setBgDesktop(e.target.value)}
                      style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit", background: "#FFFFFF" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Tablet Background URL (768–1024px)
                    <input
                      type="text"
                      placeholder="/assets/environments/custom-tablet.svg"
                      value={bgTablet}
                      onChange={(e) => setBgTablet(e.target.value)}
                      style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit", background: "#FFFFFF" }}
                    />
                  </label>

                  <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                    Mobile Background URL (&lt;768px)
                    <input
                      type="text"
                      placeholder="/assets/environments/custom-mobile.svg"
                      value={bgMobile}
                      onChange={(e) => setBgMobile(e.target.value)}
                      style={{ padding: "10px", border: "1px solid #E5E5E5", fontFamily: "inherit", background: "#FFFFFF" }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Live Environment Status Info */}
            <div style={{ padding: "14px 18px", border: "1px dashed #CCCCCC", background: "#FAFAFA", fontSize: "11px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>ACTIVE RESOLUTION:</strong>{" "}
                <span style={{ color: "#000000" }}>
                  {bgType === "DEFAULT_STUDIO" && "Default BEXYEE Obsidian Studio (/assets/environments/bexyee-studio-neutral.svg)"}
                  {bgType === "COLLECTION" && (formState.cityName === "BENGALURU" ? "Bengaluru Rain Edition Environment (/bengaluru-signal-after-rain.svg)" : `Collection Backdrop (${formState.collection})`)}
                  {bgType === "PRODUCT_SPECIFIC" && `Product-Specific Custom (${bgDesktop || "No URL provided — defaults to neutral studio"})`}
                  {bgType === "NONE" && "Clean Solid Studio (Zero Image Requests)"}
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "#777777" }}>PREVIEW READY ↗</span>
            </div>

            <button
              type="button"
              onClick={handleSaveBackgrounds}
              disabled={isSaving}
              style={{
                alignSelf: "flex-start",
                background: "#000000",
                color: "#FFFFFF",
                border: "1px solid #000000",
                padding: "12px 24px",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              {isSaving ? "PERSISTING..." : "SAVE & PERSIST BACKGROUND CONFIGURATION ↗"}
            </button>
          </div>
        )}

        {/* SECTION 5: LAUNCH & PURCHASE MODE */}
        {activeTab === "LAUNCH" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 05 // LAUNCH ENGINE</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Launch State &amp; Authoritative Purchase Mode</h2>
              <p style={{ fontSize: "12px", color: "#666666", margin: "4px 0 0" }}>
                Purchase mode is folded directly into launch state and is strictly evaluated when state is LIVE.
              </p>
            </div>

            {/* 1. PURCHASE MODE CONTROLS */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em" }}>PURCHASE MODE</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    border: purchaseMode === "BUY_NOW" ? "2px solid #000000" : "1px solid #E5E5E5",
                    background: purchaseMode === "BUY_NOW" ? "#F7F7F3" : "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="purchaseMode"
                    value="BUY_NOW"
                    checked={purchaseMode === "BUY_NOW"}
                    onChange={() => setPurchaseMode("BUY_NOW")}
                    style={{ marginTop: "3px" }}
                  />
                  <div>
                    <strong style={{ fontSize: "12px", display: "block", color: "#000000" }}>BUY NOW</strong>
                    <span style={{ fontSize: "11px", color: "#666666", display: "block", marginTop: "2px" }}>
                      Customer can purchase immediately with real-time stock allocation.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    border: purchaseMode === "PREBOOK" ? "2px solid #000000" : "1px solid #E5E5E5",
                    background: purchaseMode === "PREBOOK" ? "#F7F7F3" : "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="purchaseMode"
                    value="PREBOOK"
                    checked={purchaseMode === "PREBOOK"}
                    onChange={() => setPurchaseMode("PREBOOK")}
                    style={{ marginTop: "3px" }}
                  />
                  <div>
                    <strong style={{ fontSize: "12px", display: "block", color: "#000000" }}>PRE-BOOK</strong>
                    <span style={{ fontSize: "11px", color: "#666666", display: "block", marginTop: "2px" }}>
                      Customer reserves the product before release with variant-specific limits.
                    </span>
                  </div>
                </label>
              </div>

              {/* Pre-Book Details Form */}
              {purchaseMode === "PREBOOK" && (
                <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", borderLeft: "3px solid #E52B20", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                      Pre-Book Window Start (IST)
                      <input
                        type="datetime-local"
                        value={prebookStart}
                        onChange={(e) => setPrebookStart(e.target.value)}
                        style={{ padding: "8px", border: "1px solid #E5E5E5" }}
                      />
                    </label>

                    <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                      Pre-Book Window End (IST)
                      <input
                        type="datetime-local"
                        value={prebookEnd}
                        onChange={(e) => setPrebookEnd(e.target.value)}
                        style={{ padding: "8px", border: "1px solid #E5E5E5" }}
                      />
                    </label>

                    <label style={{ display: "grid", gap: "6px", fontSize: "11px", fontWeight: 700 }}>
                      Expected Fulfillment Estimate
                      <input
                        type="text"
                        placeholder="e.g. OCTOBER 2026"
                        value={fulfillmentEstimate}
                        onChange={(e) => setFulfillmentEstimate(e.target.value)}
                        style={{ padding: "8px", border: "1px solid #E5E5E5" }}
                      />
                    </label>
                  </div>

                  {/* PER-SIZE PRE-BOOK LIMITS (S / M / L / XL) */}
                  <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "16px" }}>
                    <span style={{ fontSize: "10px", color: "#777777", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "12px", fontWeight: 800 }}>
                      VARIANT-SPECIFIC PRE-BOOK LIMITS
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px" }}>
                      {(["S", "M", "L", "XL"] as const).map((sizeKey) => {
                        const currentVariant = product.variants.find((v) => v.size === sizeKey);
                        const prebooked = currentVariant?.prebookedCount ?? 0;
                        const limit = sizePrebookLimits[sizeKey] ?? 0;
                        const remaining = Math.max(0, limit - prebooked);

                        return (
                          <div key={sizeKey} style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <strong style={{ fontSize: "15px", color: "#000000" }}>{sizeKey}</strong>
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: 800,
                                  color: remaining === 0 ? "#DC2626" : remaining <= 3 ? "#EA580C" : "#16A34A",
                                }}
                              >
                                {remaining === 0 ? "SOLD OUT" : `${remaining} REMAINING`}
                              </span>
                            </div>
                            <label style={{ fontSize: "10.5px", color: "#444444", fontWeight: 700, display: "grid", gap: "4px" }}>
                              Pre-book limit
                              <input
                                type="number"
                                min="0"
                                value={sizePrebookLimits[sizeKey]}
                                onChange={(e) => setSizePrebookLimits({
                                  ...sizePrebookLimits,
                                  [sizeKey]: parseInt(e.target.value) || 0,
                                })}
                                style={{ padding: "8px", border: "1px solid #CCCCCC", fontSize: "12px", fontFamily: "inherit" }}
                              />
                            </label>
                            <div style={{ fontSize: "9.5px", color: "#777777" }}>
                              Pre-booked: <strong>{prebooked}</strong> / {limit}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. LAUNCH STATUS ACTIONS */}
            <div style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "#777777", letterSpacing: "0.12em", display: "block" }}>CURRENT LAUNCH STATUS</span>
                  <strong style={{ fontSize: "16px", color: "#000000" }}>{launchStatus} {launchStatus === "LIVE" || launchStatus === "PAUSED" ? `(${purchaseMode})` : ""}</strong>
                </div>
                {launchStatus === "PAUSED" && (
                  <span style={{ fontSize: "11px", background: "#FFFBEB", color: "#B45309", border: "1px solid #FCD34D", padding: "4px 10px", fontWeight: 700 }}>
                    ⚠ Product is temporarily unavailable on storefront.
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {launchStatus !== "LIVE" && (
                  <button
                    type="button"
                    onClick={() => handleSaveLaunchAndPurchaseMode("LIVE")}
                    disabled={isSaving}
                    style={{ background: "#000000", border: "1px solid #000000", color: "#FFFFFF", padding: "10px 18px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
                  >
                    {launchStatus === "PAUSED" ? "RESUME LIVE LAUNCH ↗" : "MAKE LIVE ↗"}
                  </button>
                )}

                {launchStatus === "LIVE" && (
                  <button
                    type="button"
                    onClick={() => handleSaveLaunchAndPurchaseMode("PAUSED")}
                    disabled={isSaving}
                    style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#E52B20", padding: "10px 18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    PAUSE LAUNCH
                  </button>
                )}

                {launchStatus !== "DRAFT" && (
                  <button
                    type="button"
                    onClick={() => handleSaveLaunchAndPurchaseMode("DRAFT")}
                    disabled={isSaving}
                    style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#000000", padding: "10px 18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    MOVE TO DRAFT
                  </button>
                )}

                {launchStatus !== "ENDED" && (
                  <button
                    type="button"
                    onClick={() => handleSaveLaunchAndPurchaseMode("ENDED")}
                    disabled={isSaving}
                    style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#555555", padding: "10px 18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    END DROP
                  </button>
                )}

                {launchStatus !== "ARCHIVED" && (
                  <button
                    type="button"
                    onClick={() => handleSaveLaunchAndPurchaseMode("ARCHIVED")}
                    disabled={isSaving}
                    style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", color: "#888888", padding: "10px 18px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    ARCHIVE
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveLaunchAndPurchaseMode()}
              disabled={isSaving}
              style={{
                alignSelf: "flex-start",
                background: "#000000",
                color: "#FFFFFF",
                border: "1px solid #000000",
                padding: "12px 24px",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              PERSIST LAUNCH &amp; PURCHASE MODE ↗
            </button>
          </div>
        )}

        {/* SECTION 6: STOREFRONT MULTI-DEVICE PREVIEW */}
        {activeTab === "PREVIEW" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 06 // REAL COMPONENT PREVIEW</span>
                <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Live Multi-Device Storefront Preview</h2>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {(Object.keys(VIEWPORTS) as ViewportKey[]).map((vKey) => (
                  <button
                    key={vKey}
                    type="button"
                    onClick={() => setViewport(vKey)}
                    style={{
                      background: viewport === vKey ? "#000000" : "#FFFFFF",
                      color: viewport === vKey ? "#FFFFFF" : "#000000",
                      border: "1px solid #E5E5E5",
                      padding: "6px 14px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {VIEWPORTS[vKey].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Responsive Container */}
            <div style={{ width: "100%", overflowX: "auto", background: "#E5E5E5", padding: "24px", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: VIEWPORTS[viewport].width,
                  maxWidth: "100%",
                  background: "#F7F7F3",
                  border: "1px solid #CCCCCC",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <span style={{ fontSize: "10px", color: "#777777", letterSpacing: "0.14em" }}>
                    BEXYEE // {product.cityName} EDITION
                  </span>
                  <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "8px 0" }}>{product.cityName}</h1>
                  <p style={{ fontSize: "12px", color: "#666666", maxWidth: "420px", margin: "0 auto" }}>
                    {product.description}
                  </p>
                  <div style={{ marginTop: "24px" }}>
                    <strong style={{ fontSize: "28px" }}>₹{(product.pricePaise / 100).toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    {product.launch.status === "LIVE" && product.launch.purchaseMode === "PREBOOK" ? (
                      <button type="button" style={{ background: "#000000", color: "#FFFFFF", padding: "14px 28px", fontSize: "11px", fontWeight: 800, border: 0 }}>
                        PRE-BOOK NOW ↗
                      </button>
                    ) : product.launch.status === "LIVE" ? (
                      <button type="button" style={{ background: "#000000", color: "#FFFFFF", padding: "14px 28px", fontSize: "11px", fontWeight: 800, border: 0 }}>
                        BUY NOW ↗
                      </button>
                    ) : (
                      <button type="button" disabled style={{ background: "#999999", color: "#FFFFFF", padding: "14px 28px", fontSize: "11px", fontWeight: 800, border: 0, cursor: "not-allowed" }}>
                        SOLD OUT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: PERFORMANCE METRICS */}
        {activeTab === "PERFORMANCE" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 07 // CONVERSION &amp; COMMERCIALS</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Live Product Performance</h2>
            </div>

            {analyticsData && (analyticsData.views || 0) > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ border: "1px solid #E5E5E5", padding: "20px" }}>
                  <span style={{ fontSize: "10px", color: "#777777" }}>VIEWS</span>
                  <div style={{ fontSize: "28px", fontWeight: 900 }}>{analyticsData.views ?? 0}</div>
                </div>
                <div style={{ border: "1px solid #E5E5E5", padding: "20px" }}>
                  <span style={{ fontSize: "10px", color: "#777777" }}>ADD TO CART</span>
                  <div style={{ fontSize: "28px", fontWeight: 900 }}>{analyticsData.addToCart ?? 0}</div>
                </div>
                <div style={{ border: "1px solid #E5E5E5", padding: "20px" }}>
                  <span style={{ fontSize: "10px", color: "#777777" }}>CHECKOUTS</span>
                  <div style={{ fontSize: "28px", fontWeight: 900 }}>{analyticsData.checkoutStarts ?? 0}</div>
                </div>
                <div style={{ border: "1px solid #E5E5E5", padding: "20px" }}>
                  <span style={{ fontSize: "10px", color: "#777777" }}>PURCHASES</span>
                  <div style={{ fontSize: "28px", fontWeight: 900 }}>{analyticsData.purchases ?? 0}</div>
                </div>
                <div style={{ border: "1px solid #E5E5E5", padding: "20px" }}>
                  <span style={{ fontSize: "10px", color: "#777777" }}>REVENUE</span>
                  <div style={{ fontSize: "28px", fontWeight: 900 }}>₹{(((analyticsData.revenuePaise ?? 0)) / 100).toLocaleString("en-IN")}</div>
                </div>
              </div>
            ) : (
              <div style={{ background: "#F7F7F3", border: "1px dashed #CCCCCC", padding: "48px 24px", textAlign: "center", color: "#777777" }}>
                <strong style={{ fontSize: "14px", color: "#000000", display: "block", marginBottom: "4px" }}>
                  NO DATA AVAILABLE
                </strong>
                <span style={{ fontSize: "11px" }}>No real customer engagement events have been recorded for this SKU yet.</span>
              </div>
            )}
          </div>
        )}

        {/* SECTION 8: AUDIT ACTIVITY LOG */}
        {activeTab === "ACTIVITY" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: "0.14em" }}>SECTION 08 // AUDIT LOG</span>
              <h2 style={{ margin: "4px 0 0", fontSize: "18px" }}>Historical Mutation Feed</h2>
            </div>

            {auditLogs && auditLogs.length > 0 ? (
              <div style={{ border: "1px solid #E5E5E5", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#F7F7F3", borderBottom: "1px solid #E5E5E5" }}>
                      <th style={{ padding: "10px 14px", color: "#777777" }}>ACTION</th>
                      <th style={{ padding: "10px 14px", color: "#777777" }}>PERFORMED BY</th>
                      <th style={{ padding: "10px 14px", color: "#777777" }}>TIMESTAMP (UTC)</th>
                      <th style={{ padding: "10px 14px", color: "#777777" }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid #F0F0EE" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700 }}>
                          <span style={{ background: "#000000", color: "#FFFFFF", padding: "2px 6px", fontSize: "9px" }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#555555" }}>{log.performed_by || "System"}</td>
                        <td style={{ padding: "12px 14px", color: "#777777" }}>{new Date(log.created_at).toLocaleString()}</td>
                        <td style={{ padding: "12px 14px", color: "#333333" }}>{JSON.stringify(log.metadata || {})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ background: "#F7F7F3", border: "1px dashed #CCCCCC", padding: "48px 24px", textAlign: "center", color: "#777777" }}>
                <strong style={{ fontSize: "14px", color: "#000000", display: "block", marginBottom: "4px" }}>
                  NO AUDIT ACTIVITY RECORDED YET
                </strong>
                <span style={{ fontSize: "11px" }}>All future price updates, stock changes, and launch toggles will be immutably tracked here.</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
