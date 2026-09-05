import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminApi } from "../../../../src/lib/admin-api";
import { supabaseServer } from "../../../../src/lib/supabase-server";

interface ProductSizeRow {
  product_id: string;
  size: string;
  stock_quantity: number;
  low_stock_threshold?: number;
}

interface ProductAssetRow {
  id: string;
  product_id: string;
  slot: string;
  url: string;
  is_active: boolean;
  version: number;
}

interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  sku: string;
  city_name: string;
  collection: string;
  edition: string;
  price_paise: number;
  status: string;
  created_at: string;
  size_chart_id?: string;
  is_limited_drop?: boolean;
  preorder_threshold?: number;
  background_desktop?: string;
  background_tablet?: string;
  background_mobile?: string;
  front_image_url?: string;
  back_image_url?: string;
  left_sleeve_image_url?: string;
  right_sleeve_image_url?: string;
  print_image_url?: string;
  product_sizes?: ProductSizeRow[];
  product_assets?: ProductAssetRow[];
  [key: string]: unknown;
}

interface EnrichedProduct extends ProductWithRelations {
  totalPhysicalStock: number;
  hasLowStock: boolean;
  isSoldOut: boolean;
  assetCompleteness: {
    completed: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
}

const UUID_REGEX = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;

const productInput = z.object({
  campaignId: z.string().uuid().optional(),
  name: z.preprocess((val) => (typeof val === "string" && val.trim() ? val.trim() : "Bengaluru Heavyweight Tee"), z.string().min(1).max(120)),
  slug: z.preprocess((val) => {
    if (typeof val === "string" && val.trim()) {
      return val.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || `product-${Date.now()}`;
    }
    return `product-${Date.now()}`;
  }, z.string().min(1).max(120)),
  cityName: z.string().max(80).optional().default(""),
  collection: z.string().min(1).max(80).default("STUDIO CAPSULE"),
  edition: z.string().min(1).max(80).default("DROP 001"),
  sku: z.preprocess((val) => (typeof val === "string" && val.trim() ? val.trim().toUpperCase() : `BEXYEE-BLR-${Date.now().toString().slice(-4)}`), z.string().min(1).max(80)),
  price: z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), z.number().nonnegative()).optional(),
  pricePaise: z.number().nonnegative().optional(),
  compareAtPrice: z.preprocess((val) => (val === "" || val === undefined ? null : typeof val === "string" ? parseFloat(val) : val), z.number().nonnegative().nullable().optional()),
  compareAtPricePaise: z.number().nonnegative().nullable().optional(),
  gstRate: z.preprocess((val) => (typeof val === "string" ? parseInt(val, 10) : val), z.number().min(0).max(28).optional().default(12)),
  description: z.string().max(5000).default(""),
  fabric: z.string().max(160).default("320 GSM SUPER LOOPKNIT"),
  gsm: z.preprocess((val) => (val == null || val === "" ? 320 : typeof val === "string" ? parseInt(val, 10) : val), z.number().int().positive().nullable().default(320)),
  fit: z.string().max(120).default("OVERSIZED"),
  careInstructions: z.string().max(1000).nullable().optional(),
  sizeChartId: z.preprocess(
    (v) => (typeof v === "string" && UUID_REGEX.test(v) ? v : null),
    z.string().uuid().nullable().optional()
  ),
  isLimitedDrop: z.boolean().optional().default(false),
  preorderThreshold: z.number().int().nonnegative().optional().default(0),
  purchaseMode: z.enum(["BUY_NOW", "PREBOOK"]).optional().default("BUY_NOW"),
  isPrebook: z.boolean().optional().default(false),
  prebookStartsAt: z.string().nullable().optional(),
  prebookEndsAt: z.string().nullable().optional(),
  expectedFulfillmentDate: z.string().nullable().optional(),
  prebookLimit: z.coerce.number().int().nonnegative().nullable().optional(),
  backgroundType: z.enum(["DEFAULT_STUDIO", "COLLECTION", "PRODUCT_SPECIFIC", "NONE"]).optional().default("DEFAULT_STUDIO"),
  backgroundDesktop: z.string().nullable().optional(),
  backgroundTablet: z.string().nullable().optional(),
  backgroundMobile: z.string().nullable().optional(),
  backgroundDesktopUrl: z.string().nullable().optional(),
  backgroundTabletUrl: z.string().nullable().optional(),
  backgroundMobileUrl: z.string().nullable().optional(),
  modelUrl: z.string().nullable().optional(),
  heroGlbUrl: z.string().nullable().optional(),
  artworkUrl: z.string().nullable().optional(),
  frontImageUrl: z.string().nullable().optional(),
  backImageUrl: z.string().nullable().optional(),
  leftSleeveImageUrl: z.string().nullable().optional(),
  rightSleeveImageUrl: z.string().nullable().optional(),
  printImageUrl: z.string().nullable().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  seoOgImage: z.string().nullable().optional(),
  sizes: z.union([
    z.record(z.string(), z.coerce.number().int().nonnegative()),
    z.array(z.object({
      size: z.string(),
      stock: z.coerce.number().int().nonnegative(),
      threshold: z.coerce.number().int().nonnegative().optional(),
    })),
  ]).optional(),
  stockS: z.coerce.number().int().nonnegative().optional(),
  stockM: z.coerce.number().int().nonnegative().optional(),
  stockL: z.coerce.number().int().nonnegative().optional(),
  stockXL: z.coerce.number().int().nonnegative().optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional().default(5),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  assets: z.array(z.object({
    slot: z.string(),
    url: z.string().url(),
    filename: z.string().optional(),
    mimeType: z.string().optional(),
    fileSizeBytes: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  })).optional(),
});

export async function GET(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();
  const city = url.searchParams.get("city");
  const collection = url.searchParams.get("collection");
  const status = url.searchParams.get("status");
  const stockFilter = url.searchParams.get("stock");
  const sort = url.searchParams.get("sort") || "newest";

  let query = supabaseServer
    .from("products")
    .select("*, product_sizes(*), product_assets(*)");

  if (city && city !== "ALL") {
    query = query.ilike("city_name", `%${city}%`);
  }
  if (collection && collection !== "ALL") {
    query = query.ilike("collection", `%${collection}%`);
  }
  if (status && status !== "ALL") {
    query = query.eq("status", status);
  }

  const { data: rawProducts, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let products: EnrichedProduct[] = ((rawProducts as ProductWithRelations[]) || []).map((p) => {
    const sizes = p.product_sizes || [];
    const totalPhysical = sizes.reduce((acc: number, s: ProductSizeRow) => acc + (s.stock_quantity || 0), 0);
    const hasLowStock = sizes.some((s: ProductSizeRow) => s.stock_quantity > 0 && s.stock_quantity <= (s.low_stock_threshold ?? 5));
    const isSoldOut = totalPhysical === 0;

    const requiredSlots = ["PRODUCT_FRONT_IMAGE", "PRODUCT_BACK_IMAGE", "PRODUCT_LEFT_SLEEVE_IMAGE", "PRODUCT_RIGHT_SLEEVE_IMAGE", "PRODUCT_PRINT_IMAGE"];
    const activeAssets = (p.product_assets || []).filter((a: ProductAssetRow) => a.is_active);
    const activeSlots = new Set(activeAssets.map((a: ProductAssetRow) => a.slot));
    const completedCount = requiredSlots.filter((slot) => {
      const fieldKey = slot.toLowerCase().replace(/product_|_image/g, "") + "_url";
      return activeSlots.has(slot) || Boolean(p[fieldKey]);
    }).length;
    const completenessPercent = Math.round((completedCount / requiredSlots.length) * 100);

    return {
      ...p,
      totalPhysicalStock: totalPhysical,
      hasLowStock,
      isSoldOut,
      assetCompleteness: {
        completed: completedCount,
        total: requiredSlots.length,
        percent: completenessPercent,
        isComplete: completedCount === requiredSlots.length,
      },
    };
  });

  if (q) {
    products = products.filter((p: EnrichedProduct) =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.city_name || "").toLowerCase().includes(q) ||
      (p.collection || "").toLowerCase().includes(q)
    );
  }

  if (stockFilter === "low_stock") {
    products = products.filter((p: EnrichedProduct) => p.hasLowStock);
  } else if (stockFilter === "sold_out") {
    products = products.filter((p: EnrichedProduct) => p.isSoldOut);
  } else if (stockFilter === "in_stock") {
    products = products.filter((p: EnrichedProduct) => !p.isSoldOut);
  }

  if (sort === "oldest") {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (sort === "stock_asc") {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => a.totalPhysicalStock - b.totalPhysicalStock);
  } else if (sort === "stock_desc") {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => b.totalPhysicalStock - a.totalPhysicalStock);
  } else if (sort === "price_asc") {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => a.price_paise - b.price_paise);
  } else if (sort === "price_desc") {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => b.price_paise - a.price_paise);
  } else {
    products.sort((a: EnrichedProduct, b: EnrichedProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return NextResponse.json({ products, total: products.length });
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const body = await request.json();
  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product payload.", details: parsed.error.issues }, { status: 400 });
  }

  const value = parsed.data;

  // Resolve or create campaign if campaignId not explicitly passed
  let campaignId = value.campaignId;
  const isBengaluru = (value.cityName || "").toUpperCase() === "BENGALURU";
  const campaignCity = isBengaluru ? "BENGALURU" : (value.cityName ? value.cityName.toUpperCase() : "STUDIO");
  const defaultCampaignBg = isBengaluru ? "/bengaluru-signal-after-rain.svg" : "/assets/environments/bexyee-studio-neutral.svg";

  const effectivePrice = value.price != null ? value.price : (value.pricePaise != null ? value.pricePaise / 100 : 0);
  const effectiveCompareAt = value.compareAtPrice != null ? value.compareAtPrice : (value.compareAtPricePaise != null ? value.compareAtPricePaise / 100 : null);
  const bgDesktop = value.backgroundDesktop || value.backgroundDesktopUrl || null;
  const bgTablet = value.backgroundTablet || value.backgroundTabletUrl || null;
  const bgMobile = value.backgroundMobile || value.backgroundMobileUrl || null;
  const modelUrl = value.modelUrl || value.heroGlbUrl || null;

  if (!campaignId) {
    const { data: existingCampaign } = await supabaseServer
      .from("campaigns")
      .select("id")
      .ilike("city_name", campaignCity)
      .limit(1)
      .maybeSingle();

    if (existingCampaign) {
      campaignId = existingCampaign.id;
    } else {
      const { data: newCampaign, error: campaignError } = await supabaseServer
        .from("campaigns")
        .insert({
          slug: `${campaignCity.toLowerCase()}-campaign`,
          city_name: campaignCity,
          campaign_title: `${campaignCity}\nCOLLECTION`,
          background_image: bgDesktop || defaultCampaignBg,
          active: false,
        })
        .select("id")
        .single();

      if (campaignError || !newCampaign) {
        return NextResponse.json({ error: campaignError?.message ?? "Unable to initialize campaign for product." }, { status: 500 });
      }
      campaignId = newCampaign.id;
    }
  }

  let effectiveSlug = value.slug;
  let effectiveSku = value.sku;

  let { data: product, error } = await supabaseServer
    .from("products")
    .insert({
      campaign_id: campaignId,
      name: value.name,
      slug: effectiveSlug,
      edition: value.edition,
      sku: effectiveSku,
      price_paise: Math.round(effectivePrice * 100),
      compare_at_price_paise: effectiveCompareAt == null ? null : Math.round(effectiveCompareAt * 100),
      description: value.description,
      fabric: value.fabric,
      gsm: value.gsm,
      fit: value.fit,
      care_instructions: value.careInstructions ?? null,
      model_url: modelUrl,
      front_image_url: value.frontImageUrl || null,
      back_image_url: value.backImageUrl || null,
      left_sleeve_image_url: value.leftSleeveImageUrl || null,
      right_sleeve_image_url: value.rightSleeveImageUrl || null,
      print_image_url: value.printImageUrl || null,
      product_images: value.artworkUrl ? [value.artworkUrl] : [],
      city_name: value.cityName,
      collection: value.collection,
      gst_rate: value.gstRate,
      seo_title: value.seoTitle,
      seo_description: value.seoDescription,
      seo_og_image: value.seoOgImage || null,
      status: value.status,
    })
    .select("id")
    .single();

  // If conflict due to duplicate slug/sku, auto-disambiguate with unique suffix and retry once
  if (error && (error.code === "23505" || error.message.includes("unique") || error.message.includes("duplicate"))) {
    effectiveSlug = `${value.slug}-${Date.now().toString().slice(-4)}`;
    effectiveSku = `${value.sku}-${Date.now().toString().slice(-4)}`;
    const retry = await supabaseServer
      .from("products")
      .insert({
        campaign_id: campaignId,
        name: value.name,
        slug: effectiveSlug,
        edition: value.edition,
        sku: effectiveSku,
        price_paise: Math.round(effectivePrice * 100),
        compare_at_price_paise: effectiveCompareAt == null ? null : Math.round(effectiveCompareAt * 100),
        description: value.description,
        fabric: value.fabric,
        gsm: value.gsm,
        fit: value.fit,
        care_instructions: value.careInstructions ?? null,
        model_url: modelUrl,
        front_image_url: value.frontImageUrl || null,
        back_image_url: value.backImageUrl || null,
        left_sleeve_image_url: value.leftSleeveImageUrl || null,
        right_sleeve_image_url: value.rightSleeveImageUrl || null,
        print_image_url: value.printImageUrl || null,
        product_images: value.artworkUrl ? [value.artworkUrl] : [],
        city_name: value.cityName,
        collection: value.collection,
        gst_rate: value.gstRate,
        seo_title: value.seoTitle,
        seo_description: value.seoDescription,
        seo_og_image: value.seoOgImage || null,
        status: value.status,
      })
      .select("id")
      .single();

    product = retry.data;
    error = retry.error;
  }

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? "Unable to create product." }, { status: 409 });
  }

  // Initialize linked launch row
  const purchaseMode = value.purchaseMode || (value.isPrebook ? "PREBOOK" : "BUY_NOW");
  const launchSettingsPayload = {
    purchaseMode,
    backgroundType: value.backgroundType,
    isPrebook: purchaseMode === "PREBOOK" || Boolean(value.isPrebook),
    prebookStartsAt: value.prebookStartsAt || null,
    prebookEndsAt: value.prebookEndsAt || null,
    expectedFulfillmentDate: value.expectedFulfillmentDate || "OCTOBER 2026",
    sizeLimits: { S: 20, M: 50, L: 30, XL: 20 },
    prebookLimit: value.prebookLimit || null,
    isLimitedDrop: value.isLimitedDrop,
    preorderThreshold: value.preorderThreshold,
  };

  await supabaseServer.from("launches").insert({
    product_id: product.id,
    name: `${value.name} Launch`,
    slug: `${effectiveSlug}-launch`,
    status: value.status === "ACTIVE" ? "LIVE" : "DRAFT",
    countdown_enabled: false,
    urgency_badge: "LIMITED FIRST RUN",
    utm_campaign: JSON.stringify(launchSettingsPayload),
  });

  // If custom background images are provided, insert them into product_assets
  if (bgDesktop) {
    await supabaseServer.from("product_assets").insert({
      product_id: product.id,
      slot: "BACKGROUND_DESKTOP",
      url: bgDesktop,
      version: 1,
      is_active: true,
      uploaded_by: session!.user.id,
    });
  }
  if (bgTablet) {
    await supabaseServer.from("product_assets").insert({
      product_id: product.id,
      slot: "BACKGROUND_TABLET",
      url: bgTablet,
      version: 1,
      is_active: true,
      uploaded_by: session!.user.id,
    });
  }
  if (bgMobile) {
    await supabaseServer.from("product_assets").insert({
      product_id: product.id,
      slot: "BACKGROUND_MOBILE",
      url: bgMobile,
      version: 1,
      is_active: true,
      uploaded_by: session!.user.id,
    });
  }

  const normalizedSizes: Array<{ size: string; stock: number; threshold?: number }> = value.sizes
    ? (Array.isArray(value.sizes)
        ? value.sizes
        : Object.entries(value.sizes).map(([size, stock]) => ({ size, stock })))
    : [
        { size: "S", stock: value.stockS ?? 0 },
        { size: "M", stock: value.stockM ?? 0 },
        { size: "L", stock: value.stockL ?? 0 },
        { size: "XL", stock: value.stockXL ?? 0 },
      ];

  const sizesPayload = normalizedSizes.map((item) => ({
    product_id: product.id,
    size: item.size,
    stock_quantity: item.stock,
  }));

  const { error: sizesError } = await supabaseServer.from("product_sizes").insert(sizesPayload);
  if (sizesError) return NextResponse.json({ error: sizesError.message }, { status: 409 });

  const thresholdPayload = normalizedSizes.map((item) => ({
    product_id: product.id,
    size: item.size,
    low_stock_threshold: item.threshold ?? value.lowStockThreshold,
  }));
  await supabaseServer.from("inventory_settings").upsert(thresholdPayload);

  if (value.assets && value.assets.length > 0) {
    for (const asset of value.assets) {
      await supabaseServer.from("product_assets").insert({
        product_id: product.id,
        slot: asset.slot,
        url: asset.url,
        filename: asset.filename || null,
        mime_type: asset.mimeType || null,
        file_size_bytes: asset.fileSizeBytes || null,
        width: asset.width || null,
        height: asset.height || null,
        version: 1,
        is_active: true,
        uploaded_by: session!.user.id,
      });
    }
  }

  try {
    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/search");
  } catch {}

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "PRODUCT_CREATED",
    requested_entity: "products",
    requested_entity_id: product.id,
    requested_metadata: { sku: value.sku, price: value.price, cityName: value.cityName, collection: value.collection },
  });

  return NextResponse.json({ id: product.id, ok: true });
}

export async function PATCH(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const body = (await request.json()) as {
    id?: string;
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
    price?: number;
    compareAtPrice?: number | null;
    name?: string;
    slug?: string;
    sku?: string;
    edition?: string;
    description?: string;
    fabric?: string;
    gsm?: number | null;
    fit?: string;
    careInstructions?: string | null;
    cityName?: string;
    collection?: string;
    gstRate?: number;
    sizeChartId?: string | null;
    isLimitedDrop?: boolean;
    preorderThreshold?: number;
    backgroundType?: "DEFAULT_STUDIO" | "COLLECTION" | "PRODUCT_SPECIFIC" | "NONE";
    backgroundDesktop?: string | null;
    backgroundTablet?: string | null;
    backgroundMobile?: string | null;
    modelUrl?: string | null;
    frontImageUrl?: string | null;
    backImageUrl?: string | null;
    leftSleeveImageUrl?: string | null;
    rightSleeveImageUrl?: string | null;
    printImageUrl?: string | null;
    artworkUrl?: string | null;
    purchaseMode?: "BUY_NOW" | "PREBOOK";
    isPrebook?: boolean;
    prebookStartsAt?: string | null;
    prebookEndsAt?: string | null;
    expectedFulfillmentDate?: string | null;
    prebookLimit?: number | null;
    seoTitle?: string;
    seoDescription?: string;
    seoOgImage?: string | null;
    sizes?: Record<string, number>;
    sizePrebookLimits?: Record<string, number>;
    lowStockThreshold?: number;
  };

  if (!body.id) return NextResponse.json({ error: "Product ID is required." }, { status: 400 });

  // Map requested status to valid products table status enum ('DRAFT' | 'ACTIVE' | 'ARCHIVED')
  let productStatus: "DRAFT" | "ACTIVE" | "ARCHIVED" | undefined = undefined;
  let targetLaunchStatus: "DRAFT" | "READY" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED" | "ARCHIVED" | undefined = undefined;

  if (body.status !== undefined) {
    const rawStatus = body.status as string;
    if (rawStatus === "LIVE" || rawStatus === "ACTIVE" || rawStatus === "SCHEDULED" || rawStatus === "READY" || rawStatus === "PAUSED") {
      productStatus = "ACTIVE";
      targetLaunchStatus = rawStatus === "ACTIVE" ? "LIVE" : (rawStatus as "READY" | "SCHEDULED" | "LIVE" | "PAUSED");
    } else if (rawStatus === "DRAFT") {
      productStatus = "DRAFT";
      targetLaunchStatus = "DRAFT";
    } else if (rawStatus === "ARCHIVED") {
      productStatus = "ARCHIVED";
      targetLaunchStatus = "ARCHIVED";
    } else if (rawStatus === "ENDED") {
      productStatus = "ACTIVE";
      targetLaunchStatus = "ENDED";
    }
  }

  // 1. Build sanitized products table update payload (only verified columns)
  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    ...(body.name === undefined ? {} : { name: body.name }),
    ...(body.slug === undefined ? {} : { slug: body.slug }),
    ...(body.sku === undefined ? {} : { sku: body.sku }),
    ...(body.edition === undefined ? {} : { edition: body.edition }),
    ...(body.description === undefined ? {} : { description: body.description }),
    ...(body.fabric === undefined ? {} : { fabric: body.fabric }),
    ...(body.gsm === undefined ? {} : { gsm: body.gsm }),
    ...(body.fit === undefined ? {} : { fit: body.fit }),
    ...(body.careInstructions === undefined ? {} : { care_instructions: body.careInstructions }),
    ...(body.cityName === undefined ? {} : { city_name: body.cityName }),
    ...(body.collection === undefined ? {} : { collection: body.collection }),
    ...(productStatus === undefined ? {} : { status: productStatus }),
    ...(body.gstRate === undefined ? {} : { gst_rate: body.gstRate }),
    ...(body.price === undefined ? {} : { price_paise: Math.round(body.price * 100) }),
    ...(body.compareAtPrice === undefined
      ? {}
      : { compare_at_price_paise: body.compareAtPrice == null ? null : Math.round(body.compareAtPrice * 100) }),
    ...(body.modelUrl === undefined ? {} : { model_url: body.modelUrl }),
    ...(body.frontImageUrl === undefined ? {} : { front_image_url: body.frontImageUrl }),
    ...(body.backImageUrl === undefined ? {} : { back_image_url: body.backImageUrl }),
    ...(body.leftSleeveImageUrl === undefined ? {} : { left_sleeve_image_url: body.leftSleeveImageUrl }),
    ...(body.rightSleeveImageUrl === undefined ? {} : { right_sleeve_image_url: body.rightSleeveImageUrl }),
    ...(body.printImageUrl === undefined ? {} : { print_image_url: body.printImageUrl }),
    ...(body.artworkUrl === undefined ? {} : { product_images: body.artworkUrl ? [body.artworkUrl] : [] }),
    ...(body.seoTitle === undefined ? {} : { seo_title: body.seoTitle }),
    ...(body.seoDescription === undefined ? {} : { seo_description: body.seoDescription }),
    ...(body.seoOgImage === undefined ? {} : { seo_og_image: body.seoOgImage }),
  };

  const { error: prodError } = await supabaseServer.from("products").update(update).eq("id", body.id);
  if (prodError) {
    return NextResponse.json({ error: `Database update failed: ${prodError.message}` }, { status: 409 });
  }

  // 1b. Synchronize background assets into product_assets table
  if (body.backgroundDesktop !== undefined || body.backgroundTablet !== undefined || body.backgroundMobile !== undefined || body.backgroundType !== undefined) {
    const bgSlots: Array<{ slot: string; url: string | null | undefined }> = [
      { slot: "BACKGROUND_DESKTOP", url: body.backgroundDesktop },
      { slot: "BACKGROUND_TABLET", url: body.backgroundTablet },
      { slot: "BACKGROUND_MOBILE", url: body.backgroundMobile },
      { slot: "BACKGROUND_TYPE", url: body.backgroundType },
    ];

    for (const b of bgSlots) {
      if (b.url !== undefined) {
        const { data: existingSlot } = await supabaseServer
          .from("product_assets")
          .select("id")
          .eq("product_id", body.id)
          .eq("slot", b.slot)
          .maybeSingle();

        if (existingSlot) {
          await supabaseServer
            .from("product_assets")
            .update({ url: b.url || "", is_active: Boolean(b.url), updated_at: new Date().toISOString() })
            .eq("id", existingSlot.id);
        } else if (b.url) {
          await supabaseServer.from("product_assets").insert({
            product_id: body.id,
            slot: b.slot,
            url: b.url,
            is_active: true,
            version: 1,
          });
        }
      }
    }
  }

  // 2. Synchronize launches table & persist Purchase Mode & Background settings
  const purchaseMode = body.purchaseMode || (body.isPrebook ? "PREBOOK" : "BUY_NOW");
  const launchSettingsPayload = {
    purchaseMode,
    backgroundType: body.backgroundType,
    isPrebook: purchaseMode === "PREBOOK" || Boolean(body.isPrebook),
    prebookStartsAt: body.prebookStartsAt || null,
    prebookEndsAt: body.prebookEndsAt || null,
    expectedFulfillmentDate: body.expectedFulfillmentDate || "OCTOBER 2026",
    sizeLimits: body.sizePrebookLimits || { S: 20, M: 50, L: 30, XL: 20 },
    prebookLimit: body.prebookLimit || null,
  };

  const { data: existingLaunch } = await supabaseServer
    .from("launches")
    .select("id, slug, name")
    .eq("product_id", body.id)
    .maybeSingle();

  if (existingLaunch) {
    const launchUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      utm_campaign: JSON.stringify(launchSettingsPayload),
      ...(targetLaunchStatus !== undefined ? { status: targetLaunchStatus } : {}),
    };
    const { error: launchError } = await supabaseServer
      .from("launches")
      .update(launchUpdate)
      .eq("id", existingLaunch.id);
    if (launchError) {
      return NextResponse.json({ error: `Launch update failed: ${launchError.message}` }, { status: 409 });
    }
  } else {
    const { error: createLaunchErr } = await supabaseServer.from("launches").insert({
      product_id: body.id,
      name: body.name || "Product Drop",
      slug: body.slug ? `${body.slug}-drop` : `product-launch-${body.id.slice(0, 8)}`,
      status: targetLaunchStatus || "LIVE",
      countdown_enabled: false,
      urgency_badge: "LIMITED FIRST RUN",
      utm_campaign: JSON.stringify(launchSettingsPayload),
    });
    if (createLaunchErr) {
      return NextResponse.json({ error: `Launch creation failed: ${createLaunchErr.message}` }, { status: 409 });
    }
  }

  // 3. Synchronize campaigns table
  if (productStatus !== undefined) {
    await supabaseServer
      .from("campaigns")
      .update({ active: productStatus === "ACTIVE" && targetLaunchStatus !== "DRAFT" && targetLaunchStatus !== "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("id", body.id);
  }

  // 4. Synchronize physical stock sizes
  if (body.sizes) {
    for (const [size, stock_quantity] of Object.entries(body.sizes)) {
      await supabaseServer
        .from("product_sizes")
        .upsert({ product_id: body.id, size, stock_quantity });
    }
  }

  // 5. Synchronize low stock thresholds
  if (body.lowStockThreshold !== undefined) {
    const sizes = ["S", "M", "L", "XL"];
    for (const size of sizes) {
      await supabaseServer
        .from("inventory_settings")
        .upsert({ product_id: body.id, size, low_stock_threshold: body.lowStockThreshold });
    }
  }

  // Next.js ISR & Route Cache Invalidation
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/product/[slug]", "page");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/bengaluru");
    revalidatePath("/search");
    revalidatePath("/collections/[slug]", "page");
    if (body.slug) {
      revalidatePath(`/product/${body.slug}`);
      revalidatePath(`/products/${body.slug}`);
    }
    revalidatePath("/product/bengaluru-tee");
    revalidatePath("/products/bengaluru-tee");
  } catch {
    // Non-request context fallback
  }

  const auditAction =
    targetLaunchStatus === "PAUSED"
      ? "LAUNCH_PAUSED"
      : targetLaunchStatus === "LIVE"
      ? "LAUNCH_RESUMED"
      : productStatus === "DRAFT"
      ? "PRODUCT_UNPUBLISHED"
      : productStatus === "ACTIVE"
      ? "PRODUCT_PUBLISHED"
      : "PRODUCT_UPDATED";

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: auditAction,
    requested_entity: "products",
    requested_entity_id: body.id,
    requested_metadata: { update, status: body.status, purchaseMode },
  });

  return NextResponse.json({
    ok: true,
    status: targetLaunchStatus || productStatus,
    purchaseMode,
  });
}

export async function DELETE(request: Request) {
  const { response, session } = await requireAdminApi();
  if (response) return response;
  if (!supabaseServer) return NextResponse.json({ error: "Database unavailable." }, { status: 500 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Product ID required." }, { status: 400 });

  // 1. Fetch product slug first for cache invalidation
  const { data: targetProduct } = await supabaseServer
    .from("products")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  const slug = targetProduct?.slug;

  // 2. Check for historical orders
  const { data: orderItems } = await supabaseServer
    .from("order_items")
    .select("id")
    .eq("product_id", id)
    .limit(1);

  if (orderItems && orderItems.length > 0) {
    // Preserve order history: safely transition product & launch to ARCHIVED (0 storefront visibility)
    await supabaseServer.from("products").update({ status: "ARCHIVED" }).eq("id", id);
    await supabaseServer.from("launches").update({ status: "ARCHIVED" }).eq("product_id", id);

    try {
      revalidatePath("/products");
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/search");
      if (slug) {
        revalidatePath(`/product/${slug}`);
        revalidatePath(`/products/${slug}`);
      }
    } catch {}

    await supabaseServer.rpc("record_admin_audit", {
      requested_admin: session!.user.id,
      requested_action: "PRODUCT_ARCHIVED_SAFE_DELETE",
      requested_entity: "products",
      requested_entity_id: id,
      requested_metadata: { reason: "Historical order records exist; converted to archived state." },
    });

    return NextResponse.json({
      ok: true,
      deleted: true,
      archived: true,
      message: "Product safely removed from storefront and archived to preserve order history.",
    });
  }

  // 3. If NO orders exist: Hard-delete child rows first, then product
  await supabaseServer.from("stock_reservations").delete().eq("product_id", id);
  await supabaseServer.from("product_sizes").delete().eq("product_id", id);
  await supabaseServer.from("product_assets").delete().eq("product_id", id);
  await supabaseServer.from("launches").delete().eq("product_id", id);

  const { error } = await supabaseServer.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/search");
    if (slug) {
      revalidatePath(`/product/${slug}`);
      revalidatePath(`/products/${slug}`);
    }
  } catch {}

  await supabaseServer.rpc("record_admin_audit", {
    requested_admin: session!.user.id,
    requested_action: "PRODUCT_DELETED",
    requested_entity: "products",
    requested_entity_id: id,
  });

  return NextResponse.json({ ok: true, deleted: true });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
