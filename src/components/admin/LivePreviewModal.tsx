"use client";

import { useState } from "react";
import { Storefront } from "../Storefront";
import type { CityCampaign } from "../../../app/page";

type ViewportKey =
  | "DESKTOP"
  | "LAPTOP"
  | "TABLET_1024"
  | "TABLET_834"
  | "TABLET_768"
  | "PHONE_430"
  | "PHONE_390"
  | "PHONE_375";

const PREVIEW_VIEWPORTS: Record<
  ViewportKey,
  { label: string; width: string; height: string; category: "DESKTOP" | "TABLET" | "PHONE" }
> = {
  DESKTOP: { label: "Desktop (1440 × 900)", width: "100%", height: "820px", category: "DESKTOP" },
  LAPTOP: { label: "Laptop (1280 × 800)", width: "1280px", height: "780px", category: "DESKTOP" },
  TABLET_1024: { label: "Tablet Large (1024 × 1366)", width: "1024px", height: "860px", category: "TABLET" },
  TABLET_834: { label: "iPad Pro (834 × 1194)", width: "834px", height: "840px", category: "TABLET" },
  TABLET_768: { label: "iPad Standard (768 × 1024)", width: "768px", height: "800px", category: "TABLET" },
  PHONE_430: { label: "iPhone Pro Max (430 × 932)", width: "430px", height: "800px", category: "PHONE" },
  PHONE_390: { label: "iPhone Standard (390 × 844)", width: "390px", height: "760px", category: "PHONE" },
  PHONE_375: { label: "Phone Compact (375 × 812)", width: "375px", height: "720px", category: "PHONE" },
};

export function LivePreviewModal({
  initialCampaign,
  onPublish,
  onSaveDraft,
}: {
  initialCampaign: CityCampaign;
  onPublish?: (campaign: CityCampaign) => Promise<void>;
  onSaveDraft?: (campaign: CityCampaign) => Promise<void>;
}) {
  const [viewport, setViewport] = useState<ViewportKey>("DESKTOP");
  const [isLandscape, setIsLandscape] = useState(false);
  const [draft] = useState<CityCampaign>(initialCampaign);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [missingAssets, setMissingAssets] = useState<string[]>([]);

  // Publish Safety Validator
  function validatePublishReadiness(): { isValid: boolean; missing: string[] } {
    const missing: string[] = [];

    if (!draft.frontImage) missing.push("PRODUCT_FRONT_IMAGE");
    if (!draft.backImage) missing.push("PRODUCT_BACK_IMAGE");
    if (!draft.leftSleeveImage) missing.push("PRODUCT_LEFT_SLEEVE_IMAGE");
    if (!draft.rightSleeveImage) missing.push("PRODUCT_RIGHT_SLEEVE_IMAGE");
    if (!draft.printImage) missing.push("PRODUCT_PRINT_IMAGE");
    if (!draft.backgroundImage) missing.push("HERO_BACKGROUND");
    if (!draft.productName) missing.push("PRODUCT_NAME");
    if (!draft.price || draft.price <= 0) missing.push("PRODUCT_PRICE");

    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  async function handlePublish() {
    setStatusMessage("");
    setMissingAssets([]);

    const validation = validatePublishReadiness();
    if (!validation.isValid) {
      setMissingAssets(validation.missing);
      setStatusMessage("PUBLISH BLOCKED: REQUIRED ASSET VIEWS OR PRODUCT FIELDS ARE MISSING");
      return;
    }

    setIsPublishing(true);
    try {
      if (onPublish) {
        await onPublish(draft);
      } else {
        const res = await fetch("/api/admin/campaigns/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: draft.productId || "00000000-0000-0000-0000-000000000001",
            action: "PUBLISH",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to publish.");
      }
      setStatusMessage("IMMUTABLE SNAPSHOT CREATED • CAMPAIGN IS LIVE IN PRODUCTION ↗");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Failed to publish.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleSaveDraft() {
    if (onSaveDraft) {
      await onSaveDraft(draft);
    } else {
      await fetch("/api/admin/campaigns/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: draft.productId || "00000000-0000-0000-0000-000000000001",
          payload: draft,
        }),
      });
    }
    setStatusMessage("DRAFT SAVED • PRODUCTION IS UNAFFECTED");
  }

  const activeVp = PREVIEW_VIEWPORTS[viewport];
  const frameWidth = isLandscape && activeVp.category !== "DESKTOP" ? activeVp.height : activeVp.width;

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#11110f",
          border: "1px solid #282826",
          padding: "12px 18px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Viewport Selectors */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "9px", color: "#777", marginRight: "4px", letterSpacing: "0.1em" }}>VIEWPORTS:</span>
          {(Object.keys(PREVIEW_VIEWPORTS) as ViewportKey[]).map((vKey) => (
            <button
              key={vKey}
              type="button"
              onClick={() => setViewport(vKey)}
              style={{
                background: viewport === vKey ? "#e52b20" : "#1a1a18",
                color: "#fff",
                border: "1px solid #333",
                fontSize: "9px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: viewport === vKey ? 700 : 400,
              }}
            >
              {PREVIEW_VIEWPORTS[vKey].label}
            </button>
          ))}

          {activeVp.category !== "DESKTOP" && (
            <button
              type="button"
              onClick={() => setIsLandscape((prev) => !prev)}
              style={{
                background: isLandscape ? "rgba(229, 43, 32, 0.2)" : "#222",
                color: isLandscape ? "#ff7a73" : "#aaa",
                border: `1px solid ${isLandscape ? "#e52b20" : "#444"}`,
                fontSize: "9px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              🔄 {isLandscape ? "LANDSCAPE" : "PORTRAIT"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={handleSaveDraft}
            style={{
              background: "#181816",
              border: "1px solid #3c3c39",
              color: "#ede9e1",
              fontSize: "10px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            SAVE DRAFT
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            style={{
              background: "#e52b20",
              border: 0,
              color: "#fff",
              fontSize: "10px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {isPublishing ? "PUBLISHING..." : "PUBLISH TO LIVE STORE ↗"}
          </button>
        </div>
      </div>

      {/* Safety Audit / Error Banners */}
      {statusMessage && (
        <div
          style={{
            padding: "10px 14px",
            background: statusMessage.includes("LIVE") || statusMessage.includes("SAVED")
              ? "rgba(74, 222, 128, 0.1)"
              : "rgba(229, 43, 32, 0.1)",
            border: `1px solid ${statusMessage.includes("LIVE") || statusMessage.includes("SAVED") ? "#4ade80" : "#e52b20"}`,
            color: "#fff",
            fontSize: "11px",
          }}
        >
          {statusMessage}
          {missingAssets.length > 0 && (
            <ul style={{ margin: "6px 0 0 16px", padding: 0, color: "#ff8580" }}>
              {missingAssets.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Real Live Component Preview Frame */}
      <div
        style={{
          background: "#050505",
          border: "1px solid #222",
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
          minHeight: "750px",
        }}
      >
        <div
          style={{
            width: frameWidth,
            maxWidth: "100%",
            background: "#080807",
            border: "1px solid #333",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
            overflowY: "auto",
            transition: "width 0.3s ease",
          }}
        >
          <Storefront campaign={draft} />
        </div>
      </div>
    </div>
  );
}
