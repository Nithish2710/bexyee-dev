import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../../src/lib/supabase-server";

const publishActionSchema = z.object({
  campaignId: z.string().uuid(),
  action: z.enum(["PUBLISH", "UNPUBLISH", "ROLLBACK"]),
  rollbackSnapshot: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const parsed = publishActionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid publish request.", details: parsed.error.issues }, { status: 400 });
  }

  const { campaignId, action, rollbackSnapshot } = parsed.data;

  if (action === "UNPUBLISH") {
    const { error } = await supabaseServer
      .from("campaigns")
      .update({ active: false })
      .eq("id", campaignId);

    if (error) return NextResponse.json({ error: error.message }, { status: 409 });

    await supabaseServer.rpc("record_admin_audit", {
      requested_admin: session!.user.id,
      requested_action: "CAMPAIGN_UNPUBLISHED",
      requested_entity: "campaigns",
      requested_entity_id: campaignId,
      requested_metadata: { active: false },
    });

    return NextResponse.json({ ok: true, active: false });
  }

  if (action === "ROLLBACK" && rollbackSnapshot) {
    // Rollback to previous version snapshot
    const updatePayload: Record<string, unknown> = {
      campaign_title: rollbackSnapshot.campaignTitle,
      inspiration: rollbackSnapshot.inspiration,
      background_image: rollbackSnapshot.backgroundImage,
      mobile_background_image: rollbackSnapshot.mobileBackgroundImage,
      accent_color: rollbackSnapshot.accentColor,
      edition: rollbackSnapshot.edition,
      seo_title: rollbackSnapshot.seoTitle,
      seo_description: rollbackSnapshot.seoDescription,
      active: true,
    };

    const { error: campaignError } = await supabaseServer
      .from("campaigns")
      .update(updatePayload)
      .eq("id", campaignId);

    if (campaignError) return NextResponse.json({ error: campaignError.message }, { status: 409 });

    await supabaseServer.rpc("record_admin_audit", {
      requested_admin: session!.user.id,
      requested_action: "CAMPAIGN_ROLLBACK",
      requested_entity: "campaigns",
      requested_entity_id: campaignId,
      requested_metadata: rollbackSnapshot,
    });

    return NextResponse.json({ ok: true, action: "ROLLED_BACK" });
  }

  // Action is PUBLISH: Load draft and atomically apply to live store
  const { data: draftRecord, error: draftFetchError } = await supabaseServer
    .from("campaign_drafts")
    .select("*")
    .eq("campaign_id", campaignId)
    .maybeSingle();

  if (draftFetchError || !draftRecord) {
    return NextResponse.json({ error: "No draft found to publish." }, { status: 404 });
  }

  const draft = draftRecord.draft_payload as Record<string, unknown>;

  // 1. Update Campaign Record
  const { data: updatedCampaign, error: campaignError } = await supabaseServer
    .from("campaigns")
    .update({
      city_name: draft.cityName,
      campaign_title: draft.campaignTitle,
      edition: draft.edition,
      inspiration: draft.inspiration,
      background_image: draft.backgroundImage,
      mobile_background_image: draft.mobileBackgroundImage,
      accent_color: draft.accentColor,
      seo_title: draft.seoTitle,
      seo_description: draft.seoDescription,
      active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select("*")
    .single();

  if (campaignError || !updatedCampaign) {
    return NextResponse.json({ error: campaignError?.message ?? "Failed to publish campaign." }, { status: 409 });
  }

  // 2. Update Product Record if linked
  if (updatedCampaign.product_id) {
    await supabaseServer
      .from("products")
      .update({
        name: draft.productName,
        price_paise: Math.round(Number(draft.price) * 100),
        fabric: draft.fabric,
        gsm: draft.gsm,
        fit: draft.fit,
        model_url: draft.productModel || null,
        front_image_url: draft.frontImage || null,
        back_image_url: draft.backImage || null,
        left_sleeve_image_url: draft.leftSleeveImage || null,
        right_sleeve_image_url: draft.rightSleeveImage || null,
        print_image_url: draft.printImage || null,
        status: "ACTIVE",
      })
      .eq("id", updatedCampaign.product_id);
  }

  // 3. Record Audit Log with immutable snapshot
  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "CAMPAIGN_PUBLISHED",
    requested_entity: "campaigns",
    requested_entity_id: campaignId,
    requested_metadata: {
      snapshot: draft,
      publishedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({ ok: true, published: true, campaign: updatedCampaign });
}
