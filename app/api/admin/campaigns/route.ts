import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const input = z.object({ cityName: z.string().min(2).max(80), slug: z.string().regex(/^[a-z0-9-]+$/), edition: z.string().min(1).max(80), campaignTitle: z.string().min(1).max(160), inspiration: z.string().max(500), backgroundImage: z.string().url(), accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), seoTitle: z.string().max(160).optional(), seoDescription: z.string().max(320).optional(), active: z.boolean().default(false), productId: z.string().uuid().nullable().optional() });

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  const parsed = input.safeParse(await request.json());
  if (!parsed.success || !supabaseServer) return NextResponse.json({ error: "Invalid campaign." }, { status: 400 });
  const value = parsed.data;
  const { data, error } = await supabaseServer.from("campaigns").insert({ slug: value.slug, city_name: value.cityName, campaign_title: value.campaignTitle, background_image: value.backgroundImage, accent_color: value.accentColor, inspiration: value.inspiration, seo_title: value.seoTitle, seo_description: value.seoDescription, active: value.active, edition: value.edition, product_id: value.productId ?? null }).select("id").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Unable to create campaign." }, { status: 409 });
  await supabaseServer.rpc("record_admin_audit", { requested_admin: session!.user.id, requested_action: "CAMPAIGN_CREATED", requested_entity: "campaigns", requested_entity_id: data.id, requested_metadata: { city: value.cityName } });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  const body = await request.json() as { id?: string; active?: boolean; campaignTitle?: string; inspiration?: string; backgroundImage?: string; seoTitle?: string; seoDescription?: string; productId?: string | null };
  if (!body.id || !supabaseServer) return NextResponse.json({ error: "Campaign id is required." }, { status: 400 });
  const update = { ...(body.active === undefined ? {} : { active: body.active }), ...(body.campaignTitle === undefined ? {} : { campaign_title: body.campaignTitle }), ...(body.inspiration === undefined ? {} : { inspiration: body.inspiration }), ...(body.backgroundImage === undefined ? {} : { background_image: body.backgroundImage }), ...(body.seoTitle === undefined ? {} : { seo_title: body.seoTitle }), ...(body.seoDescription === undefined ? {} : { seo_description: body.seoDescription }), ...(body.productId === undefined ? {} : { product_id: body.productId }) };
  const { error } = await supabaseServer.from("campaigns").update(update).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  await supabaseServer.rpc("record_admin_audit", { requested_admin: session!.user.id, requested_action: body.active === undefined ? "CAMPAIGN_UPDATED" : body.active ? "CAMPAIGN_ACTIVATED" : "CAMPAIGN_DEACTIVATED", requested_entity: "campaigns", requested_entity_id: body.id, requested_metadata: update });
  return NextResponse.json({ ok: true });
}
