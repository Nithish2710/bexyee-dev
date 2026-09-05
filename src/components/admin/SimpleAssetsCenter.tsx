"use client";

import { useState } from "react";

export type SimpleAssetsCenterProps = {
  initialProduct?: {
    name: string;
    model_url?: string;
    front_image_url?: string;
    back_image_url?: string;
    left_sleeve_image_url?: string;
    right_sleeve_image_url?: string;
    print_image_url?: string;
  };
};

export function SimpleAssetsCenter({ initialProduct }: SimpleAssetsCenterProps) {
  const [productImages, setProductImages] = useState({
    front: initialProduct?.front_image_url || "/assets/products/bengaluru-tee-front.svg",
    back: initialProduct?.back_image_url || "/assets/products/bengaluru-tee-back.svg",
    left: initialProduct?.left_sleeve_image_url || "/assets/products/bengaluru-tee-left.svg",
    right: initialProduct?.right_sleeve_image_url || "/assets/products/bengaluru-tee-right.svg",
    print: initialProduct?.print_image_url || "/assets/products/bengaluru-tee-print.svg",
  });

  const [modelGlb, setModelGlb] = useState(initialProduct?.model_url || "");
  const [campaignVisuals, setCampaignVisuals] = useState({
    desktop: "/bengaluru-signal-after-rain.svg",
    mobile: "/bengaluru-signal-after-rain.svg",
    social: "/bengaluru-signal-after-rain.svg",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
      {toastMessage && (
        <div
          style={{
            padding: "12px 18px",
            background: "#F7F7F3",
            border: "1px solid #000000",
            color: "#000000",
            fontSize: "11.5px",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 1. HEADER (White Surface) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".16em", fontWeight: 700 }}>
            VISUAL MEDIA &amp; 3D
          </span>
          <h1 style={{ fontSize: "24px", color: "#000000", margin: "4px 0 6px 0" }}>
            ASSETS
          </h1>
          <p style={{ fontSize: "12.5px", color: "#555555", margin: 0 }}>
            Manage your high-resolution product photography, 3D garments, and campaign visuals.
          </p>
        </div>
      </div>

      {/* 2. 3D GARMENT MODEL CARD (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".14em", fontWeight: 700 }}>
          3D GARMENT MODEL
        </span>
        <h2 style={{ fontSize: "18px", color: "#000000", margin: "4px 0 16px 0" }}>
          Interactive 3D Garment Model
        </h2>

        {!modelGlb ? (
          <div
            style={{
              background: "#F7F7F3",
              border: "1px dashed #CCCCCC",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "13px", color: "#000000", margin: "0 0 12px 0", fontWeight: 700 }}>
              No 3D GLB Model Uploaded
            </p>
            <p style={{ fontSize: "11.5px", color: "#777777", maxWidth: "480px", margin: "0 auto 16px", lineHeight: 1.6 }}>
              The storefront automatically uses 0ms 2D photography as fallback. Uploading a GLB model enables interactive 3D rotation.
            </p>
            <input
              type="text"
              placeholder="Paste public URL to .glb file..."
              onChange={(e) => setModelGlb(e.target.value)}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                color: "#000000",
                padding: "8px 14px",
                fontSize: "11px",
                minWidth: "300px",
                fontFamily: "var(--font-space-mono)",
              }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F7F7F3", padding: "16px 20px", border: "1px solid #E5E5E5" }}>
            <div>
              <strong style={{ color: "#000000", fontSize: "13px" }}>Active GLB Model</strong>
              <span style={{ color: "#777777", fontSize: "11px", display: "block" }}>{modelGlb}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModelGlb("");
                notify("✓ 3D Model unlinked. Storefront will use high-res 2D photos.");
              }}
              style={{ background: "#FFFFFF", border: "1px solid #000000", color: "#000000", padding: "8px 12px", fontSize: "10px", cursor: "pointer", fontWeight: 700 }}
            >
              REMOVE
            </button>
          </div>
        )}
      </div>

      {/* 3. 2D PRODUCT VIEWS */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".14em", fontWeight: 700 }}>
          PRODUCT PHOTOGRAPHY
        </span>
        <h2 style={{ fontSize: "18px", color: "#000000", margin: "4px 0 20px 0" }}>
          5-Angle Photographic Gallery
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {Object.entries(productImages).map(([angle, url]) => (
            <div key={angle} style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "100%", height: "140px", background: "#FFFFFF", border: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={angle} style={{ maxHeight: "110px", maxWidth: "80%", objectFit: "contain" }} />
              </div>
              <strong style={{ fontSize: "11px", color: "#000000", textTransform: "uppercase" }}>{angle} VIEW</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CAMPAIGN BACKGROUNDS */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".14em", fontWeight: 700 }}>
          ENVIRONMENT BACKGROUNDS
        </span>
        <h2 style={{ fontSize: "18px", color: "#000000", margin: "4px 0 20px 0" }}>
          City Environment Assets
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {Object.entries(campaignVisuals).map(([screen, url]) => (
            <div key={screen} style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", padding: "16px", display: "grid", gap: "8px" }}>
              <strong style={{ fontSize: "11px", color: "#000000", textTransform: "uppercase" }}>{screen} BACKGROUND</strong>
              <input
                type="text"
                value={url}
                onChange={(e) => setCampaignVisuals((p) => ({ ...p, [screen]: e.target.value }))}
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "8px", color: "#000000", fontSize: "11px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
