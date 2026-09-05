import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

const themeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#e52b20"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0b0b0a"),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#ede9e1"),
  surfaceColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#141412"),
  typographyPreset: z.string().default("MODERNIST_CONDENSED"),
  buttonStyle: z.string().default("SHARP_SOLID"),
  spacingDensity: z.string().default("COMPACT_ARCHITECTURAL"),
  atmosphericEffect: z.string().default("NEON_RAIN"),
});

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const { data: themes, error } = await supabaseServer
    .from("themes")
    .select("*")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ themes: themes || [] });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const parsed = themeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid theme configuration.", details: parsed.error.issues }, { status: 400 });
  }

  const val = parsed.data;

  const { data, error } = await supabaseServer
    .from("themes")
    .insert({
      name: val.name,
      slug: val.slug,
      accent_color: val.accentColor,
      background_color: val.backgroundColor,
      text_color: val.textColor,
      surface_color: val.surfaceColor,
      typography_preset: val.typographyPreset,
      button_style: val.buttonStyle,
      spacing_density: val.spacingDensity,
      atmospheric_effect: val.atmosphericEffect,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create theme." }, { status: 409 });
  }

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "THEME_CREATED",
    requested_entity: "themes",
    requested_entity_id: data.id,
    requested_metadata: { slug: val.slug, accentColor: val.accentColor },
  });

  return NextResponse.json(data);
}
