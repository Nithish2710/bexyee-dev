import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../../src/lib/supabase-server";

const draftPayloadSchema = z.object({
  campaignId: z.string().uuid(),
  cityName: z.string().min(2).max(80),
  campaignTitle: z.string().min(1).max(160),
  edition: z.string().min(1).max(80),
  productName: z.string().min(1).max(120),
  price: z.number().positive(),
  compareAtPrice: z.number().nonnegative().optional(),
  fabric: z.string().max(120).optional(),
  gsm: z.number().int().positive().optional(),
  fit: z.string().max(80).optional(),
  inspiration: z.string().max(1000).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  backgroundImage: z.string().url(),
  mobileBackgroundImage: z.string().url().optional(),
  productModel: z.string().url().optional().or(z.literal("")),
  frontImage: z.string().url().optional().or(z.literal("")),
  backImage: z.string().url().optional().or(z.literal("")),
  leftSleeveImage: z.string().url().optional().or(z.literal("")),
  rightSleeveImage: z.string().url().optional().or(z.literal("")),
  printImage: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const url = new URL(request.url);
  const campaignId = url.searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("campaign_drafts")
    .select("*")
    .eq("campaign_id", campaignId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ draft: data?.draft_payload ?? null, updatedAt: data?.updated_at ?? null });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database not connected." }, { status: 500 });

  const parsed = draftPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid draft payload.", details: parsed.error.issues }, { status: 400 });
  }

  const draft = parsed.data;

  const { data, error } = await supabaseServer
    .from("campaign_drafts")
    .upsert({
      campaign_id: draft.campaignId,
      draft_payload: draft,
      created_by: session!.user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "campaign_id" })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to save draft." }, { status: 409 });
  }

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "CAMPAIGN_DRAFT_SAVED",
    requested_entity: "campaign_drafts",
    requested_entity_id: data.id,
    requested_metadata: { campaignId: draft.campaignId, cityName: draft.cityName },
  });

  return NextResponse.json({ ok: true, draft: data.draft_payload, updatedAt: data.updated_at });
}
