import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const assetSlotEnum = z.enum([
  "PRODUCT_FRONT_IMAGE",
  "PRODUCT_BACK_IMAGE",
  "PRODUCT_LEFT_SLEEVE_IMAGE",
  "PRODUCT_RIGHT_SLEEVE_IMAGE",
  "PRODUCT_PRINT_IMAGE",
  "HERO_GLB",
  "HERO_BACKGROUND",
  "MOBILE_BACKGROUND",
  "OG_IMAGE",
  "CAMPAIGN_BANNER",
  "DETAIL_GALLERY_IMAGE",
]);

const createAssetSchema = z.object({
  productId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  slot: assetSlotEnum,
  url: z.string().url(),
  filename: z.string().max(255).optional(),
  mimeType: z.string().max(100).optional(),
  fileSizeBytes: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const patchAssetSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
  restoreVersion: z.number().int().positive().optional(),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const campaignId = url.searchParams.get("campaignId");

  const [productAssetsRes, campaignAssetsRes] = await Promise.all([
    productId
      ? supabaseServer.from("product_assets").select("*").eq("product_id", productId).order("version", { ascending: false })
      : supabaseServer.from("product_assets").select("*").order("created_at", { ascending: false }).limit(100),
    campaignId
      ? supabaseServer.from("campaign_assets").select("*").eq("campaign_id", campaignId).order("created_at", { ascending: false })
      : supabaseServer.from("campaign_assets").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return NextResponse.json({
    productAssets: productAssetsRes.data ?? [],
    campaignAssets: campaignAssetsRes.data ?? [],
  });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const parsed = createAssetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid asset data.", details: parsed.error.issues }, { status: 400 });
  }

  const { productId, campaignId, slot, url, filename, mimeType, fileSizeBytes, width, height } = parsed.data;

  if (slot.startsWith("PRODUCT_") || slot === "HERO_GLB" || slot === "DETAIL_GALLERY_IMAGE") {
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required for product assets." }, { status: 400 });
    }

    // Get current maximum version for this product slot
    const { data: latest } = await supabaseServer
      .from("product_assets")
      .select("version")
      .eq("product_id", productId)
      .eq("slot", slot)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersion = (latest?.version ?? 0) + 1;

    // Deactivate previous active versions of this slot
    await supabaseServer
      .from("product_assets")
      .update({ is_active: false })
      .eq("product_id", productId)
      .eq("slot", slot);

    const { data, error } = await supabaseServer
      .from("product_assets")
      .insert({
        product_id: productId,
        slot,
        url,
        filename: filename ?? url.split("/").pop() ?? "asset",
        mime_type: mimeType ?? "image/webp",
        file_size_bytes: fileSizeBytes ?? 1024,
        width,
        height,
        version: nextVersion,
        is_active: true,
        uploaded_by: session!.user.id,
      })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to save product asset." }, { status: 409 });
    }

    // Update denormalized high-speed read columns on products table
    const columnMap: Record<string, string> = {
      PRODUCT_FRONT_IMAGE: "front_image_url",
      PRODUCT_BACK_IMAGE: "back_image_url",
      PRODUCT_LEFT_SLEEVE_IMAGE: "left_sleeve_image_url",
      PRODUCT_RIGHT_SLEEVE_IMAGE: "right_sleeve_image_url",
      PRODUCT_PRINT_IMAGE: "print_image_url",
      HERO_GLB: "model_url",
    };

    if (columnMap[slot]) {
      await supabaseServer
        .from("products")
        .update({ [columnMap[slot]]: url })
        .eq("id", productId);
    }

    await supabaseServer.rpc("record_admin_audit", {
      requested_admin: session!.user.id,
      requested_action: "ASSET_UPLOADED",
      requested_entity: "product_assets",
      requested_entity_id: data.id,
      requested_metadata: { slot, version: nextVersion, url },
    });

    return NextResponse.json(data);
  } else {
    // Campaign assets (HERO_BACKGROUND, MOBILE_BACKGROUND, OG_IMAGE, CAMPAIGN_BANNER)
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required for campaign assets." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("campaign_assets")
      .upsert({
        campaign_id: campaignId,
        slot,
        url,
        filename: filename ?? url.split("/").pop() ?? "asset",
        mime_type: mimeType ?? "image/webp",
        file_size_bytes: fileSizeBytes ?? 1024,
        width,
        height,
        is_active: true,
        uploaded_by: session!.user.id,
      }, { onConflict: "campaign_id,slot" })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to save campaign asset." }, { status: 409 });
    }

    if (slot === "HERO_BACKGROUND") {
      await supabaseServer.from("campaigns").update({ background_image: url }).eq("id", campaignId);
    } else if (slot === "MOBILE_BACKGROUND") {
      await supabaseServer.from("campaigns").update({ mobile_background_image: url }).eq("id", campaignId);
    }

    await supabaseServer.rpc("record_admin_audit", {
      requested_admin: session!.user.id,
      requested_action: "ASSET_UPLOADED",
      requested_entity: "campaign_assets",
      requested_entity_id: data.id,
      requested_metadata: { slot, url },
    });

    return NextResponse.json(data);
  }
}

export async function PATCH(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const parsed = patchAssetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch request." }, { status: 400 });
  }

  const { id, isActive, restoreVersion } = parsed.data;

  // Check product_assets first
  const { data: asset } = await supabaseServer
    .from("product_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (asset) {
    if (restoreVersion !== undefined) {
      // Deactivate all versions of this slot
      await supabaseServer
        .from("product_assets")
        .update({ is_active: false })
        .eq("product_id", asset.product_id)
        .eq("slot", asset.slot);

      // Activate the requested version
      const { data: restored, error } = await supabaseServer
        .from("product_assets")
        .update({ is_active: true })
        .eq("product_id", asset.product_id)
        .eq("slot", asset.slot)
        .eq("version", restoreVersion)
        .select("*")
        .single();

      if (error || !restored) {
        return NextResponse.json({ error: "Failed to restore version." }, { status: 409 });
      }

      await supabaseServer.rpc("record_admin_audit", {
        requested_admin: session!.user.id,
        requested_action: "ASSET_VERSION_RESTORED",
        requested_entity: "product_assets",
        requested_entity_id: restored.id,
        requested_metadata: { slot: asset.slot, restoredVersion: restoreVersion },
      });

      return NextResponse.json(restored);
    } else if (isActive !== undefined) {
      const { data: updated, error } = await supabaseServer
        .from("product_assets")
        .update({ is_active: isActive })
        .eq("id", id)
        .select("*")
        .single();

      if (error || !updated) {
        return NextResponse.json({ error: "Failed to update asset status." }, { status: 409 });
      }

      await supabaseServer.rpc("record_admin_audit", {
        requested_admin: session!.user.id,
        requested_action: isActive ? "ASSET_ACTIVATED" : "ASSET_DEACTIVATED",
        requested_entity: "product_assets",
        requested_entity_id: updated.id,
        requested_metadata: { slot: asset.slot, isActive },
      });

      return NextResponse.json(updated);
    }
  }

  return NextResponse.json({ error: "Asset not found." }, { status: 404 });
}
