"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type AssetStatus = "MISSING" | "READY" | "PROCESSING" | "FAILED" | "ACTIVE" | "ARCHIVED";

export type AssetRecord = {
  id?: string;
  slot: string;
  name: string;
  purpose: string;
  required: boolean;
  acceptedFormat: string;
  recommendedDimensions: string;
  maxSizeBytes: number;
  currentUrl?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  version: number;
  uploadDate: string;
  status: AssetStatus;
  productName?: string;
  versionsHistory?: Array<{ version: number; url: string; uploadDate: string; fileSizeBytes: number }>;
};

export const INITIAL_SLOT_DEFINITIONS: AssetRecord[] = [
  {
    slot: "PRODUCT_FRONT_IMAGE",
    name: "Front Product Image",
    purpose: "Immediate photographic front view rendered before 3D loads",
    required: true,
    acceptedFormat: "WebP / PNG / SVG",
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    currentUrl: "/assets/products/bengaluru-tee-front.svg",
    fileSizeBytes: 28 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "Bengaluru Heavyweight Tee",
    versionsHistory: [
      { version: 1, url: "/assets/products/bengaluru-tee-front.svg", uploadDate: "2026-08-24", fileSizeBytes: 28 * 1024 },
    ],
  },
  {
    slot: "PRODUCT_BACK_IMAGE",
    name: "Back Product Image",
    purpose: "Immediate photographic back view displaying graphic typography",
    required: true,
    acceptedFormat: "WebP / PNG / SVG",
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    currentUrl: "/assets/products/bengaluru-tee-back.svg",
    fileSizeBytes: 32 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "Bengaluru Heavyweight Tee",
    versionsHistory: [
      { version: 1, url: "/assets/products/bengaluru-tee-back.svg", uploadDate: "2026-08-24", fileSizeBytes: 32 * 1024 },
    ],
  },
  {
    slot: "PRODUCT_LEFT_SLEEVE_IMAGE",
    name: "Left Sleeve Image",
    purpose: "Photographic profile of left sleeve and coordinates patch",
    required: true,
    acceptedFormat: "WebP / PNG / SVG",
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    currentUrl: "/assets/products/bengaluru-tee-left.svg",
    fileSizeBytes: 24 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "Bengaluru Heavyweight Tee",
    versionsHistory: [
      { version: 1, url: "/assets/products/bengaluru-tee-left.svg", uploadDate: "2026-08-24", fileSizeBytes: 24 * 1024 },
    ],
  },
  {
    slot: "PRODUCT_RIGHT_SLEEVE_IMAGE",
    name: "Right Sleeve Image",
    purpose: "Photographic profile of right sleeve and edition woven label",
    required: true,
    acceptedFormat: "WebP / PNG / SVG",
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    currentUrl: "/assets/products/bengaluru-tee-right.svg",
    fileSizeBytes: 24 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "Bengaluru Heavyweight Tee",
    versionsHistory: [
      { version: 1, url: "/assets/products/bengaluru-tee-right.svg", uploadDate: "2026-08-24", fileSizeBytes: 24 * 1024 },
    ],
  },
  {
    slot: "PRODUCT_PRINT_IMAGE",
    name: "Print & Texture Detail",
    purpose: "Macro crop of 320 GSM loopknit weave and cured puff inks",
    required: true,
    acceptedFormat: "WebP / PNG / SVG",
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    currentUrl: "/assets/products/bengaluru-tee-print.svg",
    fileSizeBytes: 24 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "Bengaluru Heavyweight Tee",
    versionsHistory: [
      { version: 1, url: "/assets/products/bengaluru-tee-print.svg", uploadDate: "2026-08-24", fileSizeBytes: 24 * 1024 },
    ],
  },
  {
    slot: "HERO_GLB",
    name: "3D Garment Model (GLB)",
    purpose: "Interactive 3D model loaded in background",
    required: false,
    acceptedFormat: "GLB / GLTF (Draco Compressed)",
    recommendedDimensions: "Real-world scale (meters)",
    maxSizeBytes: 4.5 * 1024 * 1024,
    currentUrl: process.env.NEXT_PUBLIC_MODEL_URL || undefined,
    version: 1,
    uploadDate: "2026-08-24",
    status: process.env.NEXT_PUBLIC_MODEL_URL ? "READY" : "MISSING",
    productName: "Bengaluru Heavyweight Tee",
  },
  {
    slot: "HERO_BACKGROUND",
    name: "Desktop Campaign Backdrop",
    purpose: "Atmospheric landscape backdrop artwork for campaign hero",
    required: true,
    acceptedFormat: "WebP / SVG / PNG",
    recommendedDimensions: "2560 × 1440 px",
    maxSizeBytes: 500 * 1024,
    currentUrl: "/bengaluru-signal-after-rain.svg",
    fileSizeBytes: 142 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "BENGALURU Campaign",
    versionsHistory: [
      { version: 1, url: "/bengaluru-signal-after-rain.svg", uploadDate: "2026-08-24", fileSizeBytes: 142 * 1024 },
    ],
  },
  {
    slot: "MOBILE_BACKGROUND",
    name: "Mobile Campaign Backdrop",
    purpose: "Mobile-optimized vertical backdrop for smartphone screens",
    required: true,
    acceptedFormat: "WebP / JPG / SVG",
    recommendedDimensions: "1080 × 1920 px",
    maxSizeBytes: 300 * 1024,
    currentUrl: "/bengaluru-signal-after-rain.svg",
    fileSizeBytes: 120 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "BENGALURU Campaign",
  },
  {
    slot: "OG_IMAGE",
    name: "Social Share & OG Image",
    purpose: "Social card preview displayed when sharing URL",
    required: true,
    acceptedFormat: "WebP / PNG",
    recommendedDimensions: "1200 × 630 px",
    maxSizeBytes: 300 * 1024,
    currentUrl: "/bengaluru-signal-after-rain.svg",
    fileSizeBytes: 142 * 1024,
    mimeType: "image/svg+xml",
    version: 1,
    uploadDate: "2026-08-24",
    status: "ACTIVE",
    productName: "BENGALURU Campaign",
  },
];

export function AssetControlCenter() {
  const [assets, setAssets] = useState<AssetRecord[]>(INITIAL_SLOT_DEFINITIONS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isRollbacking, setIsRollbacking] = useState(false);

  useEffect(() => {
    async function loadLiveAssets() {
      try {
        const res = await fetch("/api/admin/assets");
        if (res.ok) {
          const data = await res.json();
          if (data.productAssets?.length || data.campaignAssets?.length) {
            // merge live assets
          }
        }
      } catch {
        // preserve initial defaults
      }
    }
    void loadLiveAssets();
  }, []);

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.slot.toLowerCase().includes(search.toLowerCase()) ||
      (asset.productName || "").toLowerCase().includes(search.toLowerCase());

    let matchesCategory = true;
    if (categoryFilter === "PRODUCT") {
      matchesCategory = asset.slot.startsWith("PRODUCT_");
    } else if (categoryFilter === "3D") {
      matchesCategory = asset.slot.includes("GLB") || asset.slot.includes("3D");
    } else if (categoryFilter === "CAMPAIGN") {
      matchesCategory = asset.slot.includes("BACKGROUND") || asset.slot.includes("OG_IMAGE");
    }

    return matchesSearch && matchesCategory;
  });

  async function handleRollbackVersion(targetVersion: number) {
    if (!selectedAsset) return;
    setIsRollbacking(true);
    setFeedback("");

    try {
      if (selectedAsset.id) {
        const res = await fetch("/api/admin/assets", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedAsset.id,
            restoreVersion: targetVersion,
          }),
        });
        if (!res.ok) throw new Error("Failed to restore version.");
      }

      // Update local state
      const targetHistoryItem = selectedAsset.versionsHistory?.find((v) => v.version === targetVersion);
      const restoredUrl = targetHistoryItem?.url || selectedAsset.currentUrl;

      setAssets((prev) =>
        prev.map((item) => {
          if (item.slot !== selectedAsset.slot) return item;
          return {
            ...item,
            version: targetVersion,
            currentUrl: restoredUrl,
            status: "ACTIVE",
          };
        })
      );

      setSelectedAsset((prev) => (prev ? { ...prev, version: targetVersion, currentUrl: restoredUrl } : null));
      setFeedback(`SUCCESS: Rolled back ${selectedAsset.name} to v${targetVersion} ↗`);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Rollback failed.");
    } finally {
      setIsRollbacking(false);
    }
  }

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header & Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            CENTRAL ASSET REGISTRY &amp; VERSION LIBRARY
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff" }}>
            Visual Assets &amp; Version History
          </h2>
        </div>

        <div style={{ display: "flex", gap: "10px", fontSize: "11px" }}>
          <span style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80", padding: "6px 12px", border: "1px solid rgba(74, 222, 128, 0.3)" }}>
            {assets.filter((a) => a.status === "ACTIVE").length} ACTIVE ASSETS
          </span>
          <span style={{ background: "#141412", color: "#aaa", padding: "6px 12px", border: "1px solid #282826" }}>
            {assets.length} TOTAL REGISTERED
          </span>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: "10px 14px", background: feedback.includes("SUCCESS") ? "rgba(74, 222, 128, 0.1)" : "rgba(229, 43, 32, 0.1)", border: `1px solid ${feedback.includes("SUCCESS") ? "#4ade80" : "#e52b20"}`, color: "#fff", fontSize: "11px" }}>
          {feedback}
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: "12px", background: "#10100e", border: "1px solid #242422", padding: "12px 16px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by asset name, slot, or product..."
          style={{ flex: 1, minWidth: "220px", fontSize: "11px", background: "#0a0a09", border: "1px solid #333", color: "#fff", padding: "8px 12px" }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          {["ALL", "PRODUCT", "3D", "CAMPAIGN"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? "#e52b20" : "#1a1a18",
                color: "#fff",
                border: "1px solid #333",
                fontSize: "9.5px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: categoryFilter === cat ? 700 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredAssets.map((asset) => {
          const isUploaded = Boolean(asset.currentUrl);
          const is3d = asset.slot.includes("GLB") || asset.slot.includes("3D");

          return (
            <div
              key={asset.slot}
              style={{
                background: "#0e0e0d",
                border: "1px solid #242422",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong style={{ fontSize: "12px", color: "#fff", display: "block" }}>{asset.name}</strong>
                  <small style={{ fontSize: "9.5px", color: "#888" }}>{asset.productName || "Product Asset"}</small>
                </div>
                <span
                  style={{
                    fontSize: "8.5px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    background: asset.status === "ACTIVE" ? "rgba(74, 222, 128, 0.15)" : "rgba(229, 43, 32, 0.15)",
                    color: asset.status === "ACTIVE" ? "#4ade80" : "#ff7a73",
                  }}
                >
                  {asset.status} (v{asset.version})
                </span>
              </div>

              {/* Thumbnail Preview */}
              <div
                style={{
                  height: "140px",
                  background: "#050505",
                  border: "1px solid #1c1c1a",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAsset(asset)}
              >
                {is3d ? (
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "32px", display: "block" }}>📦</span>
                    <small style={{ color: "#888", fontSize: "10px" }}>3D GLB Model (v{asset.version})</small>
                  </div>
                ) : isUploaded && asset.currentUrl ? (
                  <Image src={asset.currentUrl} alt={asset.name} fill style={{ objectFit: "contain" }} unoptimized />
                ) : (
                  <span style={{ fontSize: "10px", color: "#555" }}>✕ No Asset Uploaded</span>
                )}
              </div>

              {/* Meta details */}
              <div style={{ fontSize: "9.5px", color: "#777", display: "flex", justifyContent: "space-between" }}>
                <span>{asset.acceptedFormat}</span>
                <span>{asset.fileSizeBytes ? `${(asset.fileSizeBytes / 1024).toFixed(1)} KB` : asset.recommendedDimensions}</span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setSelectedAsset(asset)}
                style={{
                  background: "#161614",
                  border: "1px solid #2c2c29",
                  color: "#ede9e1",
                  fontSize: "10px",
                  padding: "8px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                VIEW DETAILS &amp; VERSION HISTORY ↗
              </button>
            </div>
          );
        })}
      </div>

      {/* Details & Version Rollback Modal */}
      {selectedAsset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#11110f", border: "1px solid #333", padding: "24px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "9px", color: "#e52b20", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  ASSET INSPECTOR
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "16px", color: "#fff" }}>
                  {selectedAsset.name} (Active: v{selectedAsset.version})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                style={{ background: "transparent", border: 0, color: "#aaa", fontSize: "16px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Preview Box */}
            <div style={{ height: "200px", background: "#050505", border: "1px solid #222", position: "relative", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedAsset.slot.includes("GLB") ? (
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "40px" }}>📦</span>
                  <p style={{ color: "#aaa", fontSize: "11px", margin: "6px 0 0 0" }}>Interactive 3D Garment Model</p>
                </div>
              ) : selectedAsset.currentUrl ? (
                <Image src={selectedAsset.currentUrl} alt={selectedAsset.name} fill style={{ objectFit: "contain" }} unoptimized />
              ) : (
                <span style={{ color: "#555" }}>✕ No file</span>
              )}
            </div>

            {/* Metadata Table */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "10.5px", background: "#141412", padding: "14px", border: "1px solid #222", marginBottom: "20px" }}>
              <div>
                <span style={{ color: "#777", display: "block" }}>SLOT</span>
                <strong style={{ color: "#fff" }}>{selectedAsset.slot}</strong>
              </div>
              <div>
                <span style={{ color: "#777", display: "block" }}>PURPOSE</span>
                <strong style={{ color: "#fff" }}>{selectedAsset.purpose}</strong>
              </div>
              <div>
                <span style={{ color: "#777", display: "block" }}>RECOMMENDED DIMENSIONS</span>
                <strong style={{ color: "#fff" }}>{selectedAsset.recommendedDimensions}</strong>
              </div>
              <div>
                <span style={{ color: "#777", display: "block" }}>SIZE SPECIFICATION</span>
                <strong style={{ color: "#fff" }}>Max {(selectedAsset.maxSizeBytes / 1024).toFixed(0)} KB</strong>
              </div>
            </div>

            {/* Version History & Rollback Controls */}
            <h4 style={{ margin: "0 0 10px 0", fontSize: "11.5px", color: "#8d8982", letterSpacing: "0.12em" }}>
              VERSION HISTORY &amp; NON-DESTRUCTIVE ROLLBACK
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {(selectedAsset.versionsHistory || [
                { version: 1, url: selectedAsset.currentUrl || "", uploadDate: selectedAsset.uploadDate, fileSizeBytes: selectedAsset.fileSizeBytes || 24576 },
              ]).map((v) => (
                <div
                  key={v.version}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: v.version === selectedAsset.version ? "rgba(229, 43, 32, 0.1)" : "#141412",
                    border: `1px solid ${v.version === selectedAsset.version ? "#e52b20" : "#222"}`,
                    fontSize: "10.5px",
                  }}
                >
                  <div>
                    <strong style={{ color: "#fff" }}>Version {v.version}</strong>
                    {v.version === selectedAsset.version && (
                      <span style={{ marginLeft: "8px", fontSize: "9px", color: "#4ade80", fontWeight: 700 }}>
                        ● CURRENT ACTIVE
                      </span>
                    )}
                    <span style={{ color: "#777", display: "block", fontSize: "9px" }}>
                      Uploaded: {v.uploadDate} • {(v.fileSizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {v.version !== selectedAsset.version && (
                    <button
                      type="button"
                      disabled={isRollbacking}
                      onClick={() => handleRollbackVersion(v.version)}
                      style={{ background: "#222", border: "1px solid #444", color: "#ede9e1", fontSize: "9.5px", padding: "4px 10px", cursor: "pointer" }}
                    >
                      {isRollbacking ? "REVERTING..." : `ROLLBACK TO v${v.version}`}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedAsset(null)}
              style={{ background: "#222", color: "#fff", border: "1px solid #444", width: "100%", padding: "10px", fontSize: "11px", cursor: "pointer" }}
            >
              CLOSE INSPECTOR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
