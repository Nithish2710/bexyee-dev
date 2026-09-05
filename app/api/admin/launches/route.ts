import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const launchInput = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["DRAFT", "READY", "SCHEDULED", "LIVE", "PAUSED", "ENDED", "ARCHIVED"]).default("DRAFT"),
  launchAt: z.string().datetime().nullable().optional(),
  endAt: z.string().datetime().nullable().optional(),
  heroHeadline: z.string().max(160).optional(),
  heroSubheadline: z.string().max(250).optional(),
  countdownEnabled: z.boolean().default(true),
  urgencyBadge: z.string().max(80).optional().default("LIMITED FIRST RUN"),
  utmCampaign: z.string().max(80).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  ogImage: z.string().url().nullable().optional(),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  let query = supabaseServer
    .from("launches")
    .select("*, products(name, sku, city_name, price_paise)")
    .order("created_at", { ascending: false });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data: launches, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ launches: launches || [] });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const parsed = launchInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid launch data.", details: parsed.error.issues }, { status: 400 });
  }

  const val = parsed.data;

  // Check if launch exists for productId
  const { data: existing } = await supabaseServer
    .from("launches")
    .select("id")
    .eq("product_id", val.productId)
    .maybeSingle();

  if (existing) {
    const { error: updateErr } = await supabaseServer
      .from("launches")
      .update({
        status: val.status,
        launch_at: val.launchAt || null,
        end_at: val.endAt || null,
        hero_headline: val.heroHeadline || null,
        hero_subheadline: val.heroSubheadline || null,
        countdown_enabled: val.countdownEnabled,
        urgency_badge: val.urgencyBadge,
        utm_campaign: val.utmCampaign || null,
        seo_title: val.seoTitle || null,
        seo_description: val.seoDescription || null,
        og_image: val.ogImage || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 409 });
    }

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/product/[slug]", "page");
    } catch {}

    return NextResponse.json({ id: existing.id, ok: true });
  }

  const { data: launch, error } = await supabaseServer
    .from("launches")
    .insert({
      product_id: val.productId,
      name: val.name,
      slug: val.slug,
      status: val.status,
      launch_at: val.launchAt || null,
      end_at: val.endAt || null,
      hero_headline: val.heroHeadline || null,
      hero_subheadline: val.heroSubheadline || null,
      countdown_enabled: val.countdownEnabled,
      urgency_badge: val.urgencyBadge,
      utm_campaign: val.utmCampaign || null,
      seo_title: val.seoTitle || null,
      seo_description: val.seoDescription || null,
      og_image: val.ogImage || null,
    })
    .select("id")
    .single();

  if (error || !launch) {
    return NextResponse.json({ error: error?.message ?? "Failed to create launch." }, { status: 409 });
  }

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/product/[slug]", "page");
  } catch {}

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "LAUNCH_CREATED",
    requested_entity: "launches",
    requested_entity_id: launch.id,
    requested_metadata: { name: val.name, status: val.status, launchAt: val.launchAt },
  });

  return NextResponse.json({ id: launch.id, ok: true });
}

export async function PATCH(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const body = (await request.json()) as {
    id?: string;
    productId?: string;
    status?: "DRAFT" | "READY" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED" | "ARCHIVED";
    launchAt?: string | null;
    endAt?: string | null;
    urgencyBadge?: string;
    countdownEnabled?: boolean;
  };

  if (!body.id && !body.productId) {
    return NextResponse.json({ error: "Launch ID or Product ID required." }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...(body.status === undefined ? {} : { status: body.status }),
    ...(body.launchAt === undefined ? {} : { launch_at: body.launchAt }),
    ...(body.endAt === undefined ? {} : { end_at: body.endAt }),
    ...(body.urgencyBadge === undefined ? {} : { urgency_badge: body.urgencyBadge }),
    ...(body.countdownEnabled === undefined ? {} : { countdown_enabled: body.countdownEnabled }),
  };

  let query = supabaseServer.from("launches").update(update);
  if (body.id) {
    query = query.eq("id", body.id);
  } else if (body.productId) {
    query = query.eq("product_id", body.productId);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/product/[slug]", "page");
  } catch {}

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: body.status ? `LAUNCH_${body.status}` : "LAUNCH_UPDATED",
    requested_entity: "launches",
    requested_entity_id: body.id || body.productId || "unknown",
    requested_metadata: { update },
  });

  return NextResponse.json({ ok: true, status: body.status });
}
