"use client";

import { useEffect, useState } from "react";
import { AssetUploaderSlot, type AssetSlotDef, type UploadedAssetValue } from "./AssetUploaderSlot";
import type { BrandAssetRecord, BrandAssetSlot } from "../../lib/brand-assets";

const BRAND_SLOT_DEFS: Record<BrandAssetSlot, AssetSlotDef> = {
  LOGO_2D: {
    slot: "LOGO_2D",
    name: "Master 2D Logo",
    purpose: "Vector wordmark or emblem for global brand identity",
    required: true,
    acceptedMimeTypes: ["image/svg+xml", "image/png", "image/webp"],
    acceptedExtensions: [".svg", ".png", ".webp"],
    recommendedDimensions: "500 × 500 px",
    maxSizeBytes: 2 * 1024 * 1024,
    maxSizeLabel: "Max 2 MB",
  },
  LOGO_GLB: {
    slot: "LOGO_GLB",
    name: "3D Rotating Coin Emblem",
    purpose: "Brand 3D interactive coin emblem model",
    required: false,
    acceptedMimeTypes: ["model/gltf-binary", ".glb", ".gltf"],
    acceptedExtensions: [".glb", ".gltf"],
    recommendedDimensions: "Low-poly 3D coin",
    maxSizeBytes: 3 * 1024 * 1024,
    maxSizeLabel: "Max 3 MB",
    is3d: true,
  },
  LOGO_DARK: {
    slot: "LOGO_DARK",
    name: "Dark Background Logo",
    purpose: "Monochrome vector for dark mode surfaces",
    required: true,
    acceptedMimeTypes: ["image/svg+xml", "image/png"],
    acceptedExtensions: [".svg", ".png"],
    recommendedDimensions: "500 × 500 px",
    maxSizeBytes: 2 * 1024 * 1024,
    maxSizeLabel: "Max 2 MB",
  },
  LOGO_LIGHT: {
    slot: "LOGO_LIGHT",
    name: "Light Background Logo",
    purpose: "Monochrome vector for light mode surfaces",
    required: true,
    acceptedMimeTypes: ["image/svg+xml", "image/png"],
    acceptedExtensions: [".svg", ".png"],
    recommendedDimensions: "500 × 500 px",
    maxSizeBytes: 2 * 1024 * 1024,
    maxSizeLabel: "Max 2 MB",
  },
  FAVICON: {
    slot: "FAVICON",
    name: "Browser Favicon",
    purpose: "Browser tab icon",
    required: true,
    acceptedMimeTypes: ["image/x-icon", "image/svg+xml", "image/png"],
    acceptedExtensions: [".ico", ".svg", ".png"],
    recommendedDimensions: "32 × 32 px",
    maxSizeBytes: 100 * 1024,
    maxSizeLabel: "Max 100 KB",
  },
  BRAND_WATERMARK: {
    slot: "BRAND_WATERMARK",
    name: "Brand Watermark",
    purpose: "Subtle background brand mark",
    required: false,
    acceptedMimeTypes: ["image/svg+xml", "image/png"],
    acceptedExtensions: [".svg", ".png"],
    recommendedDimensions: "1000 × 1000 px",
    maxSizeBytes: 2 * 1024 * 1024,
    maxSizeLabel: "Max 2 MB",
  },
};

export function BrandAssetsCenter() {
  const [brandAssets, setBrandAssets] = useState<BrandAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBrandAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brand-assets");
      if (res.ok) {
        const data = await res.json();
        setBrandAssets(data.brandAssets || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brand assets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/brand-assets")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.brandAssets) setBrandAssets(data.brandAssets);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load brand assets.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleBrandUpload(val: UploadedAssetValue) {
    setError(null);
    try {
      const res = await fetch("/api/admin/brand-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: val.slot,
          url: val.url,
          filename: val.filename,
          mimeType: val.mimeType,
          fileSizeBytes: val.fileSizeBytes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save brand asset.");
      }

      await loadBrandAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving brand asset.");
    }
  }

  function getActiveAssetValue(slot: BrandAssetSlot): UploadedAssetValue | undefined {
    const found = brandAssets.find((a) => a.slot === slot && a.isActive);
    if (!found) return undefined;
    return {
      slot: found.slot,
      url: found.url,
      filename: found.originalFilename || found.url,
      mimeType: found.mimeType,
      fileSizeBytes: found.fileSizeBytes,
    };
  }

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          GLOBAL BRAND IDENTITY &amp; EMBLEM REGISTRY
        </span>
        <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff" }}>
          Brand Assets (2D Vectors &amp; 3D Emblems)
        </h2>
        <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0 0" }}>
          Brand assets are global and decoupled from product garments. A 3D Logo Coin is never a product GLB.
        </p>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(229, 43, 32, 0.15)", border: "1px solid #e52b20", color: "#ff8580", fontSize: "11px" }}>
          ⚠ {error}
        </div>
      )}

      {/* Grid of Brand Slots */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {(["LOGO_2D", "LOGO_GLB", "LOGO_DARK", "LOGO_LIGHT", "FAVICON", "BRAND_WATERMARK"] as BrandAssetSlot[]).map((slotKey) => (
          <div key={slotKey} style={{ background: "#11110f", border: "1px solid #222", padding: "16px" }}>
            <h3 style={{ fontSize: "12px", color: "#fff", margin: "0 0 12px 0" }}>{BRAND_SLOT_DEFS[slotKey].name}</h3>
            <AssetUploaderSlot
              slotDef={BRAND_SLOT_DEFS[slotKey]}
              value={getActiveAssetValue(slotKey)}
              onChange={(val) => void handleBrandUpload(val)}
            />
          </div>
        ))}
      </div>

      {/* Brand Asset Version Log */}
      <div style={{ background: "#0e0e0d", border: "1px solid #242422", padding: "16px" }}>
        <h3 style={{ fontSize: "12px", color: "#fff", margin: "0 0 12px 0" }}>BRAND ASSET VERSION HISTORY</h3>
        {loading ? (
          <p style={{ fontSize: "11px", color: "#666" }}>Loading versions...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {brandAssets.map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#141412", padding: "8px 12px", fontSize: "11px" }}>
                <div>
                  <strong style={{ color: "#fff" }}>{a.slot} (v{a.version})</strong>
                  <span style={{ color: "#777", marginLeft: "10px" }}>{a.originalFilename || a.url}</span>
                </div>
                <div>
                  <span style={{ fontSize: "9px", padding: "2px 6px", background: a.isActive ? "rgba(74, 222, 128, 0.15)" : "#222", color: a.isActive ? "#4ade80" : "#666" }}>
                    {a.isActive ? "ACTIVE" : "ARCHIVED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
