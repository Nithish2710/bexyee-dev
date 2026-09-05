import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const brandAssetSlotEnum = z.enum([
  "LOGO_2D",
  "LOGO_GLB",
  "LOGO_DARK",
  "LOGO_LIGHT",
  "FAVICON",
  "BRAND_WATERMARK",
]);

const createBrandAssetSchema = z.object({
  slot: brandAssetSlotEnum,
  url: z.string().url(),
  filename: z.string().max(255).optional(),
  mimeType: z.string().max(100).default("image/svg+xml"),
  fileSizeBytes: z.number().int().positive().optional(),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const { data: assets, error } = await supabaseServer
    .from("brand_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ brandAssets: assets || [] });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const parsed = createBrandAssetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid brand asset payload.", details: parsed.error.issues }, { status: 400 });
  }

  const { slot, url, filename, mimeType, fileSizeBytes } = parsed.data;

  // Get max version for this brand slot
  const { data: latest } = await supabaseServer
    .from("brand_assets")
    .select("version")
    .eq("slot", slot)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version ?? 0) + 1;

  // Deactivate existing versions of this brand asset slot
  await supabaseServer.from("brand_assets").update({ is_active: false }).eq("slot", slot);

  const { data, error } = await supabaseServer
    .from("brand_assets")
    .insert({
      slot,
      url,
      original_filename: filename || url.split("/").pop() || "brand_asset",
      mime_type: mimeType,
      file_size_bytes: fileSizeBytes || 1024,
      version: nextVersion,
      is_active: true,
      uploaded_by: session!.user.id,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to save brand asset." }, { status: 409 });
  }

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "BRAND_ASSET_UPLOADED",
    requested_entity: "brand_assets",
    requested_entity_id: data.id,
    requested_metadata: { slot, version: nextVersion, url },
  });

  return NextResponse.json(data);
}
