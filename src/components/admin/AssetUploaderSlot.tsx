"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Image from "next/image";

export type UploadedAssetValue = {
  url: string;
  filename?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  slot?: string;
  mimeType?: string;
};

export type AssetSlotDef = {
  slot: string;
  name: string;
  purpose: string;
  required: boolean;
  acceptedMimeTypes: string[];
  acceptedExtensions: string[];
  recommendedDimensions: string;
  maxSizeBytes: number;
  maxSizeLabel: string;
  is3d?: boolean;
};

export const STANDARD_ASSET_SLOTS: AssetSlotDef[] = [
  {
    slot: "PRODUCT_FRONT_IMAGE",
    name: "Front Product Image",
    purpose: "Immediate photographic front view for instant LCP render",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    maxSizeLabel: "Max 350 KB",
  },
  {
    slot: "PRODUCT_BACK_IMAGE",
    name: "Back Product Image",
    purpose: "Photographic rear view displaying graphic typography",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    maxSizeLabel: "Max 350 KB",
  },
  {
    slot: "PRODUCT_LEFT_SLEEVE_IMAGE",
    name: "Left Sleeve Profile",
    purpose: "Photographic profile of left sleeve and coordinates embroidery",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    maxSizeLabel: "Max 350 KB",
  },
  {
    slot: "PRODUCT_RIGHT_SLEEVE_IMAGE",
    name: "Right Sleeve Profile",
    purpose: "Photographic profile of right sleeve and woven label",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    maxSizeLabel: "Max 350 KB",
  },
  {
    slot: "PRODUCT_PRINT_IMAGE",
    name: "Print & Texture Detail",
    purpose: "Macro crop of 320 GSM loopknit weave and cured puff inks",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1600 × 2000 px",
    maxSizeBytes: 350 * 1024,
    maxSizeLabel: "Max 350 KB",
  },
  {
    slot: "HERO_GLB",
    name: "3D Garment Model",
    purpose: "Progressive WebGL 3D model deferred after initial image paint",
    required: false,
    acceptedMimeTypes: ["model/gltf-binary", "model/gltf+json", "application/octet-stream"],
    acceptedExtensions: [".glb", ".gltf"],
    recommendedDimensions: "Draco / Meshopt compressed",
    maxSizeBytes: 4.5 * 1024 * 1024,
    maxSizeLabel: "Recommended < 4.5 MB",
    is3d: true,
  },
  {
    slot: "HERO_BACKGROUND",
    name: "Desktop Campaign Backdrop",
    purpose: "High-resolution desktop atmospheric visual",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "2560 × 1440 px",
    maxSizeBytes: 500 * 1024,
    maxSizeLabel: "Max 500 KB",
  },
  {
    slot: "MOBILE_BACKGROUND",
    name: "Mobile Campaign Backdrop",
    purpose: "Vertical mobile atmospheric background",
    required: true,
    acceptedMimeTypes: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"],
    acceptedExtensions: [".webp", ".png", ".svg", ".jpg", ".jpeg", ".avif"],
    recommendedDimensions: "1080 × 1920 px",
    maxSizeBytes: 300 * 1024,
    maxSizeLabel: "Max 300 KB",
  },
  {
    slot: "SOCIAL_SHARE_IMAGE",
    name: "OpenGraph / Social Card",
    purpose: "Shared previews on Twitter, iMessage, and WhatsApp",
    required: false,
    acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    recommendedDimensions: "1200 × 630 px",
    maxSizeBytes: 300 * 1024,
    maxSizeLabel: "Max 300 KB",
  },
];

export function AssetUploaderSlot({
  slotDef,
  value,
  onChange,
  onRemove,
}: {
  slotDef: AssetSlotDef;
  value?: {
    url: string;
    filename?: string;
    fileSizeBytes?: number;
    width?: number;
    height?: number;
  };
  onChange: (val: {
    url: string;
    filename?: string;
    fileSizeBytes?: number;
    width?: number;
    height?: number;
  }) => void;
  onRemove?: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);

    // Validate size
    if (file.size > slotDef.maxSizeBytes) {
      if (slotDef.is3d) {
        setError(`Warning: Model size is ${(file.size / (1024 * 1024)).toFixed(1)} MB (exceeds recommended 4.5 MB budget).`);
      } else {
        setError(`File size ${(file.size / 1024).toFixed(0)} KB exceeds slot budget ${slotDef.maxSizeLabel}.`);
        return;
      }
    }

    // Validate extension
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!slotDef.acceptedExtensions.includes(ext)) {
      setError(`Invalid format (${ext}). Accepted: ${slotDef.acceptedExtensions.join(", ")}`);
      return;
    }

    setIsUploading(true);

    try {
      let width: number | undefined;
      let height: number | undefined;

      if (!slotDef.is3d && file.type.startsWith("image/")) {
        const dimensions = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = document.createElement("img");
          img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ w: 0, h: 0 });
          img.src = URL.createObjectURL(file);
        });
        width = dimensions.w;
        height = dimensions.h;
      }

      // Convert to local data URL for client storage/preview
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      onChange({
        url: dataUrl,
        filename: file.name,
        fileSizeBytes: file.size,
        width,
        height,
      });
    } catch {
      setError("Failed to process asset file.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  }

  const isUploaded = Boolean(value?.url);
  const isOversized = Boolean(value && value.fileSizeBytes && value.fileSizeBytes > slotDef.maxSizeBytes);

  return (
    <div
      className={`admin-asset-slot-card ${isUploaded ? "uploaded" : ""} ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: isUploaded ? "#FFFFFF" : "#F7F7F3",
        border: `1px solid ${error ? "#E52B20" : isUploaded ? "#000000" : "#E5E5E5"}`,
        padding: "18px",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.15s ease",
      }}
    >
      {/* Header / Slot Meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <strong style={{ fontSize: "12px", color: "#000000", letterSpacing: "0.02em" }}>
              {slotDef.name}
            </strong>
            <span
              style={{
                fontSize: "8.5px",
                padding: "2px 6px",
                background: slotDef.required ? "#000000" : "#E5E5E5",
                color: slotDef.required ? "#FFFFFF" : "#000000",
                fontWeight: 700,
              }}
            >
              {slotDef.required ? "REQUIRED" : "OPTIONAL"}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "#777777", margin: 0, lineHeight: 1.4 }}>
            {slotDef.purpose}
          </p>
        </div>

        {/* Status Indicator */}
        <div>
          {isUploaded ? (
            <span style={{ fontSize: "10px", color: "#000000", fontWeight: 700 }}>
              {isOversized ? "⚠ OVERSIZED" : "✓ UPLOADED"}
            </span>
          ) : (
            <span style={{ fontSize: "10px", color: "#777777" }}>
              {slotDef.required ? "✕ MISSING" : "— EMPTY"}
            </span>
          )}
        </div>
      </div>

      {/* Constraints Specs Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          fontSize: "9.5px",
          color: "#777777",
          borderTop: "1px solid #E5E5E5",
          paddingTop: "8px",
        }}
      >
        <span>{slotDef.acceptedExtensions.join(" / ").toUpperCase()}</span>
        <span>•</span>
        <span>{slotDef.recommendedDimensions}</span>
        <span>•</span>
        <span>{slotDef.maxSizeLabel}</span>
      </div>

      {/* Preview / Dropzone */}
      {isUploaded && value ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#F7F7F3", padding: "12px", border: "1px solid #E5E5E5" }}>
          <div style={{ position: "relative", width: "54px", height: "54px", background: "#FFFFFF", border: "1px solid #E5E5E5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {slotDef.is3d ? (
              <span style={{ fontSize: "20px" }}>📦</span>
            ) : (
              <Image src={value.url} alt={value.filename || "Asset"} fill style={{ objectFit: "contain" }} unoptimized />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, fontSize: "11px" }}>
            <p style={{ margin: "0 0 2px 0", color: "#000000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 700 }}>
              {value.filename || "Uploaded File"}
            </p>
            <span style={{ color: "#777777", display: "block", fontSize: "10px" }}>
              {value.fileSizeBytes ? `${(value.fileSizeBytes / 1024).toFixed(1)} KB` : "Uploaded"}
              {value.width && value.height ? ` • ${value.width}×${value.height}px` : ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "#FFFFFF", color: "#000000", border: "1px solid #000000", fontSize: "9.5px", padding: "4px 8px", cursor: "pointer", fontWeight: 700 }}
            >
              REPLACE
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                style={{ background: "transparent", color: "#000000", border: "1px solid #E5E5E5", fontSize: "9.5px", padding: "4px 8px", cursor: "pointer" }}
              >
                REMOVE
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "1px dashed #CCCCCC",
            padding: "18px 10px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "#FFFFFF" : "transparent",
            transition: "background 0.15s ease",
          }}
        >
          <span style={{ fontSize: "11px", color: "#777777", fontWeight: 700 }}>
            {isUploading ? "PROCESSING..." : "DRAG & DROP OR CLICK TO UPLOAD"}
          </span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={slotDef.acceptedExtensions.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Validation Error Message */}
      {error && (
        <p style={{ fontSize: "10px", color: "#E52B20", margin: 0, fontWeight: 700 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
