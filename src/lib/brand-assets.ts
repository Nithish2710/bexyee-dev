import { supabaseServer } from "./supabase-server";

export type BrandAssetSlot = "LOGO_2D" | "LOGO_GLB" | "LOGO_DARK" | "LOGO_LIGHT" | "FAVICON" | "BRAND_WATERMARK";

export type BrandAssetRecord = {
  id: string;
  slot: BrandAssetSlot;
  url: string;
  originalFilename?: string;
  mimeType: string;
  fileSizeBytes: number;
  version: number;
  isActive: boolean;
};

export const DEFAULT_BRAND_ASSETS: Record<BrandAssetSlot, { url: string; mimeType: string }> = {
  LOGO_2D: { url: "/assets/environments/bexyee-studio-neutral.svg", mimeType: "image/svg+xml" },
  LOGO_GLB: { url: "", mimeType: "model/gltf-binary" },
  LOGO_DARK: { url: "/assets/environments/bexyee-studio-neutral.svg", mimeType: "image/svg+xml" },
  LOGO_LIGHT: { url: "/assets/environments/bexyee-studio-neutral.svg", mimeType: "image/svg+xml" },
  FAVICON: { url: "/favicon.ico", mimeType: "image/x-icon" },
  BRAND_WATERMARK: { url: "/assets/environments/bexyee-studio-neutral.svg", mimeType: "image/svg+xml" },
};

export async function getActiveBrandAssets(): Promise<Record<BrandAssetSlot, string>> {
  const result: Record<BrandAssetSlot, string> = {
    LOGO_2D: DEFAULT_BRAND_ASSETS.LOGO_2D.url,
    LOGO_GLB: DEFAULT_BRAND_ASSETS.LOGO_GLB.url,
    LOGO_DARK: DEFAULT_BRAND_ASSETS.LOGO_DARK.url,
    LOGO_LIGHT: DEFAULT_BRAND_ASSETS.LOGO_LIGHT.url,
    FAVICON: DEFAULT_BRAND_ASSETS.FAVICON.url,
    BRAND_WATERMARK: DEFAULT_BRAND_ASSETS.BRAND_WATERMARK.url,
  };

  if (!supabaseServer) return result;

  const { data } = await supabaseServer
    .from("brand_assets")
    .select("slot, url")
    .eq("is_active", true);

  if (data) {
    data.forEach((row: { slot: string; url: string }) => {
      if (row.slot in result) {
        result[row.slot as BrandAssetSlot] = row.url;
      }
    });
  }

  return result;
}
