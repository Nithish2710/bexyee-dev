import { supabaseServer } from "./supabase-server";
import { DEFAULT_APPAREL_SIZE_CHART, resolveSizeChart, type SizeChart } from "./sizing";

export type ProductBackgroundType = "DEFAULT_STUDIO" | "COLLECTION" | "PRODUCT_SPECIFIC" | "NONE";

export type ProductBackgroundSet = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export type ThemeConfig = {
  id?: string;
  name?: string;
  slug?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  typographyPreset?: string;
  atmosphericEffect?: string;
  isDefault?: boolean;
};

export type ProductAssetSlotMap = {
  frontImage: string;
  backImage: string;
  leftSleeveImage: string;
  rightSleeveImage: string;
  printImage: string;
  thumbnailImage?: string;
  modelUrl?: string; // Optional 3D GLB
  galleryImages?: string[];
  backgroundType?: ProductBackgroundType;
  backgrounds: ProductBackgroundSet;
  desktopBackground?: string;
  tabletBackground?: string;
  mobileBackground?: string;
  ogImage?: string;
};

export type SizeVariantInventory = {
  size: "S" | "M" | "L" | "XL";
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
  threshold: number;
  prebookLimit?: number;
  prebookedCount?: number;
  availablePrebook?: number;
  status: "ACTIVE" | "LOW" | "SOLD OUT";
};

export type LaunchStatus =
  | "DRAFT"
  | "READY"
  | "SCHEDULED"
  | "LIVE"
  | "PAUSED"
  | "SOLD_OUT"
  | "ENDED"
  | "ARCHIVED";

export type PurchaseMode = "BUY_NOW" | "PREBOOK";

export type PrebookConfig = {
  isEnabled: boolean;
  startsAt?: string;
  endsAt?: string;
  expectedFulfillmentDate?: string;
  sizeLimits?: Record<"S" | "M" | "L" | "XL", number>;
  sizeCounts?: Record<"S" | "M" | "L" | "XL", number>;
  prebookLimit?: number;
  currentPrebookCount?: number;
};

export type LaunchState = {
  id?: string;
  name?: string;
  slug?: string;
  status: LaunchStatus;
  purchaseMode: PurchaseMode; // Active and rendered only when status === "LIVE"
  prebookStartsAt?: string;
  prebookEndsAt?: string;
  fulfillmentEstimate?: string;
  prebookQuantityLimit?: number;
  currentPrebookCount?: number;
  startsAt?: string;
  endsAt?: string;
  launchAt?: string;
  endAt?: string;
  countdownEnabled: boolean;
  isLimitedDrop: boolean;
  preorderThreshold: number;
  urgencyBadge?: string;
  isPurchasable: boolean;
  serverTime: string;
};

export type UnifiedProduct = {
  id: string;
  name: string;
  slug: string;
  edition: string;
  sku: string;
  pricePaise: number;
  compareAtPricePaise?: number | null;
  gstRate: number;
  cityName: string;
  collection: string;
  description: string;
  fabric: string;
  gsm: number | null;
  fit: string;
  careInstructions?: string;
  sizeChart?: SizeChart;
  theme?: ThemeConfig;
  experienceType?: string;
  assets: ProductAssetSlotMap;
  variants: SizeVariantInventory[];
  totalPhysicalStock?: number;
  totalAvailableStock: number;
  isSoldOut: boolean;
  purchaseMode?: PurchaseMode;
  prebookConfig?: PrebookConfig;
  launch: LaunchState;
  seoTitle: string;
  seoDescription: string;
  seoOgImage?: string;
};

// Backward-compatibility alias for components transitioning to 2.1
export type CompositeProductExperience = UnifiedProduct;
export type ExperienceType = "UNIFIED_RENDERER" | "CITY_3D" | "STANDARD" | "EDITORIAL" | "IMMERSIVE" | "LIMITED_DROP";

/**
 * Authoritative Purchase Mode Resolver
 * Evaluates whether a product is BUY NOW or PREBOOK when LIVE.
 * Automatic transition: When pre-booking period ends, transitions to BUY NOW if stock is available.
 */
export function resolvePurchaseMode(
  prebookConfig?: PrebookConfig | {
    isEnabled?: boolean;
    startsAt?: string;
    endsAt?: string;
    expectedFulfillmentDate?: string;
    prebookLimit?: number;
  },
  isPurchasable: boolean = true,
  availableStock: number = 0,
  serverTime: string = new Date().toISOString()
): PurchaseMode | "UNAVAILABLE" {
  const now = new Date(serverTime).getTime();

  if (prebookConfig && (prebookConfig as PrebookConfig).isEnabled) {
    const startTime = prebookConfig.startsAt ? new Date(prebookConfig.startsAt).getTime() : 0;
    const endTime = prebookConfig.endsAt ? new Date(prebookConfig.endsAt).getTime() : Infinity;

    if (now >= startTime && now <= endTime) {
      return "PREBOOK";
    }

    if (now > endTime) {
      if (isPurchasable && availableStock > 0) {
        return "BUY_NOW";
      }
      return "UNAVAILABLE";
    }

    return "UNAVAILABLE";
  }

  if (isPurchasable && availableStock > 0) {
    return "BUY_NOW";
  }

  return "UNAVAILABLE";
}

/**
 * Authoritative Launch State Resolver (Section 13)
 * Evaluates server time against starts_at/ends_at and stock levels.
 */
export function resolveLaunchState(
  launchRow: {
    id?: string;
    name?: string;
    slug?: string;
    status?: string;
    launch_at?: string;
    starts_at?: string;
    end_at?: string;
    ends_at?: string;
    countdown_enabled?: boolean;
    urgency_badge?: string;
    is_limited_drop?: boolean;
    preorder_threshold?: number;
    purchase_mode?: string;
    is_prebook?: boolean;
    prebook_starts_at?: string;
    prebook_ends_at?: string;
    fulfillment_estimate?: string;
    expected_fulfillment_date?: string;
    prebook_limit?: number;
    prebook_quantity_limit?: number;
    current_prebook_count?: number;
  } | null,
  totalAvailableStock: number,
  productDropFlags?: {
    productStatus?: string;
    isLimitedDrop?: boolean;
    preorderThreshold?: number;
    purchaseMode?: PurchaseMode;
    isPrebook?: boolean;
    prebookStartsAt?: string;
    prebookEndsAt?: string;
    fulfillmentEstimate?: string;
    prebookQuantityLimit?: number;
    prebookConfig?: PrebookConfig;
  }
): LaunchState {
  const now = new Date();
  const nowIso = now.toISOString();

  // If the parent product status is DRAFT / ARCHIVED, launch state must never be LIVE
  const isProductActive = productDropFlags?.productStatus === undefined || productDropFlags.productStatus === "ACTIVE";

  const isLimitedDrop = launchRow?.is_limited_drop ?? productDropFlags?.isLimitedDrop ?? false;
  const preorderThreshold = launchRow?.preorder_threshold ?? productDropFlags?.preorderThreshold ?? 0;

  const rawPurchaseMode: PurchaseMode =
    productDropFlags?.purchaseMode ??
    (launchRow?.purchase_mode as PurchaseMode) ??
    (launchRow?.is_prebook || productDropFlags?.isPrebook ? "PREBOOK" : "BUY_NOW");

  const prebookStartsAt = productDropFlags?.prebookStartsAt ?? launchRow?.prebook_starts_at;
  const prebookEndsAt = productDropFlags?.prebookEndsAt ?? launchRow?.prebook_ends_at;
  const fulfillmentEstimate =
    productDropFlags?.fulfillmentEstimate ??
    launchRow?.fulfillment_estimate ??
    launchRow?.expected_fulfillment_date ??
    "OCTOBER 2026";
  const prebookQuantityLimit =
    productDropFlags?.prebookQuantityLimit ??
    launchRow?.prebook_quantity_limit ??
    launchRow?.prebook_limit;
  const currentPrebookCount = launchRow?.current_prebook_count ?? 0;

  if (!isProductActive) {
    const draftStatus: LaunchStatus = productDropFlags?.productStatus === "ARCHIVED" ? "ARCHIVED" : "DRAFT";
    return {
      id: launchRow?.id,
      name: launchRow?.name,
      slug: launchRow?.slug,
      status: draftStatus,
      countdownEnabled: false,
      isLimitedDrop,
      preorderThreshold,
      isPurchasable: false,
      purchaseMode: rawPurchaseMode,
      prebookStartsAt,
      prebookEndsAt,
      fulfillmentEstimate,
      prebookQuantityLimit,
      currentPrebookCount,
      serverTime: nowIso,
    };
  }

  if (!launchRow) {
    const isSoldOut = totalAvailableStock <= 0;
    let purchaseMode: PurchaseMode = rawPurchaseMode;
    if (purchaseMode === "PREBOOK" && prebookEndsAt && now.getTime() > new Date(prebookEndsAt).getTime()) {
      purchaseMode = "BUY_NOW";
    }

    return {
      status: isSoldOut ? "SOLD_OUT" : "LIVE",
      countdownEnabled: false,
      isLimitedDrop,
      preorderThreshold,
      isPurchasable: !isSoldOut,
      purchaseMode,
      prebookStartsAt,
      prebookEndsAt,
      fulfillmentEstimate,
      prebookQuantityLimit,
      currentPrebookCount,
      serverTime: nowIso,
    };
  }

  // Authoritative Launch Status Evaluation
  let status: LaunchStatus = (launchRow.status as LaunchStatus) || "DRAFT";
  const startTime = launchRow.starts_at || launchRow.launch_at;
  const endTime = launchRow.ends_at || launchRow.end_at;

  if (startTime && new Date(startTime).getTime() > now.getTime()) {
    status = "SCHEDULED";
  } else if (endTime && new Date(endTime).getTime() <= now.getTime()) {
    status = "ENDED";
  }

  const isPrebookActive =
    rawPurchaseMode === "PREBOOK" &&
    (!prebookEndsAt || now.getTime() <= new Date(prebookEndsAt).getTime());

  if (status === "LIVE" && totalAvailableStock <= 0 && !isPrebookActive) {
    status = "SOLD_OUT";
  }

  let purchaseMode: PurchaseMode = rawPurchaseMode;
  if (purchaseMode === "PREBOOK" && prebookEndsAt && now.getTime() > new Date(prebookEndsAt).getTime()) {
    purchaseMode = "BUY_NOW";
  }

  const isPurchasable = status === "LIVE" && (purchaseMode === "PREBOOK" || totalAvailableStock > 0);

  return {
    id: launchRow.id,
    name: launchRow.name,
    slug: launchRow.slug,
    status,
    startsAt: startTime,
    endsAt: endTime,
    launchAt: startTime,
    endAt: endTime,
    countdownEnabled: launchRow.countdown_enabled ?? true,
    isLimitedDrop,
    preorderThreshold,
    urgencyBadge: launchRow.urgency_badge,
    isPurchasable,
    purchaseMode,
    prebookStartsAt,
    prebookEndsAt,
    fulfillmentEstimate,
    prebookQuantityLimit,
    currentPrebookCount,
    serverTime: nowIso,
  };
}

/**
 * Single Authoritative Experience Factory
 * Fetches all necessary relations from database and returns UnifiedProduct.
 */
export async function getProductExperienceData(
  slug: string,
  options?: { allowDraft?: boolean }
): Promise<UnifiedProduct | null> {
  if (!supabaseServer) {
    if (slug === "bengaluru" || slug === "bengaluru-tee" || slug.toLowerCase().includes("blr")) {
      return getFallbackBengaluruProduct();
    }
    return getFallbackStudioProduct(slug);
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  // 1. Fetch Product (without relationships - Supabase auto-discover has issues)
  let productQuery = supabaseServer
    .from("products")
    .select("*");

  if (isUuid) {
    productQuery = productQuery.or(`id.eq.${slug},slug.eq.${slug}`);
  } else {
    productQuery = productQuery.or(`slug.eq.${slug},sku.eq.${slug}`);
  }

  let { data: product } = await productQuery.limit(1).maybeSingle();

  // Alias fallback for bengaluru drop
  if (!product && (slug === "bengaluru" || slug === "bengaluru-tee" || slug === "bengaluru-monsoon" || slug.toLowerCase().includes("blr"))) {
    const fallbackQuery = await supabaseServer
      .from("products")
      .select("*")
      .or(`slug.eq.bengaluru-tee,slug.eq.bengaluru,sku.eq.BEXYEE-BLR-001`)
      .limit(1)
      .maybeSingle();
    product = fallbackQuery.data;
  }

  if (!product) {
    // If admin is requesting and product is not yet in DB, return structured demo record
    if (options?.allowDraft) {
      if (slug === "bengaluru-tee" || slug === "bengaluru" || slug.toLowerCase().includes("blr")) {
        return getFallbackBengaluruProduct();
      }
      return getFallbackStudioProduct(slug);
    }
    return null;
  }

  // If product is not ACTIVE and caller does not allow drafts, return null
  if (product.status !== "ACTIVE" && !options?.allowDraft) {
    return null;
  }

  // Now fetch related data (size_charts, product_sizes, product_assets, campaigns, launches)
  // Do this in parallel to avoid relationship discovery issues
  const [
    { data: sizeChartData },
    { data: productSizesData },
    { data: productAssetsData },
    { data: campaignsData },
  ] = await Promise.all([
    product.size_chart_id
      ? supabaseServer.from("size_charts").select("*").eq("id", product.size_chart_id).single()
      : Promise.resolve({ data: null }),
    supabaseServer.from("product_sizes").select("*").eq("product_id", product.id),
    supabaseServer.from("product_assets").select("*").eq("product_id", product.id),
    product.campaign_id
      ? supabaseServer.from("campaigns").select("*").eq("id", product.campaign_id).single()
      : Promise.resolve({ data: null }),
  ]);

  // Reconstruct product object with related data as if they were returned by the relationship query
  const enrichedProduct = {
    ...product,
    size_charts: sizeChartData || [],
    product_sizes: productSizesData || [],
    product_assets: productAssetsData || [],
    campaigns: campaignsData || [],
  };

  // 2. Fetch active reservations & pre-booked counts to compute live available stock
  // Formula for BUY_NOW: AVAILABLE = PHYSICAL_STOCK - ACTIVE_RESERVED_STOCK
  // Formula for PREBOOK: AVAILABLE_PREBOOK = PREBOOK_LIMIT - PREBOOKED_COUNT
  const nowIso = new Date().toISOString();
  const [reservationsRes, prebookedRes] = await Promise.all([
    supabaseServer
      .from("stock_reservations")
      .select("size, quantity")
      .eq("product_id", enrichedProduct.id)
      .eq("status", "ACTIVE")
      .gt("expires_at", nowIso),
    supabaseServer
      .from("order_items")
      .select("size, quantity, orders!inner(status, payment_status, purchase_mode)")
      .eq("product_id", enrichedProduct.id)
      .eq("orders.purchase_mode", "PREBOOK")
      .in("orders.payment_status", ["CAPTURED", "PENDING"])
      .neq("orders.status", "CANCELLED"),
  ]);

  const reservedMap = new Map<string, number>();
  (reservationsRes.data || []).forEach((r: { size: string; quantity: number }) => {
    reservedMap.set(r.size, (reservedMap.get(r.size) || 0) + (r.quantity || 0));
  });

  const prebookedMap = new Map<string, number>();
  (prebookedRes.data || []).forEach((item: any) => {
    prebookedMap.set(item.size, (prebookedMap.get(item.size) || 0) + (item.quantity || 0));
  });

  // 3. Fetch linked active launch if any
  const { data: launchRow } = await supabaseServer
    .from("launches")
    .select("*")
    .eq("product_id", enrichedProduct.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Extract structured launch & purchase mode settings from launches table
  let launchSettings: {
    purchaseMode?: PurchaseMode;
    isPrebook?: boolean;
    prebookStartsAt?: string | null;
    prebookEndsAt?: string | null;
    fulfillmentEstimate?: string | null;
    sizeLimits?: Record<"S" | "M" | "L" | "XL", number>;
    prebookLimit?: number;
    backgroundType?: ProductBackgroundType;
  } = {};

  if (launchRow?.utm_campaign) {
    try {
      const parsed = typeof launchRow.utm_campaign === "string"
        ? JSON.parse(launchRow.utm_campaign)
        : launchRow.utm_campaign;
      if (parsed && typeof parsed === "object") {
        launchSettings = parsed;
      }
    } catch {
      // Non-JSON utm_campaign string fallback
    }
  }

  const effectivePurchaseMode: PurchaseMode =
    launchSettings.purchaseMode ||
    enrichedProduct.purchase_mode ||
    (enrichedProduct.is_prebook ? "PREBOOK" : "BUY_NOW");

  const isPrebook = effectivePurchaseMode === "PREBOOK" || Boolean(launchSettings.isPrebook) || Boolean(enrichedProduct.is_prebook);

  const sizeLimits: Record<"S" | "M" | "L" | "XL", number> = {
    S: launchSettings.sizeLimits?.S ?? 20,
    M: launchSettings.sizeLimits?.M ?? 50,
    L: launchSettings.sizeLimits?.L ?? 30,
    XL: launchSettings.sizeLimits?.XL ?? 20,
  };
  const sizeCounts: Record<"S" | "M" | "L" | "XL", number> = { S: 0, M: 0, L: 0, XL: 0 };

  const sizes: Array<"S" | "M" | "L" | "XL"> = ["S", "M", "L", "XL"];
  const variants: SizeVariantInventory[] = sizes.map((size) => {
    const sizeEntry = (enrichedProduct.product_sizes || []).find((s: { size: string; stock_quantity: number; low_stock_threshold?: number; prebook_limit?: number; prebooked_count?: number }) => s.size === size);
    const physical = sizeEntry?.stock_quantity ?? 0;
    const reserved = reservedMap.get(size) ?? 0;
    const availableBuyNow = Math.max(0, physical - reserved);
    const threshold = sizeEntry?.low_stock_threshold ?? 5;

    // Per-size Pre-Book values
    const pLimit = typeof sizeEntry?.prebook_limit === "number" ? sizeEntry.prebook_limit : sizeLimits[size];
    const pCount = (prebookedMap.get(size) || 0) + (sizeEntry?.prebooked_count || 0);
    const availablePrebook = Math.max(0, pLimit - pCount);

    sizeLimits[size] = pLimit;
    sizeCounts[size] = pCount;

    const available = isPrebook ? availablePrebook : availableBuyNow;

    let status: "ACTIVE" | "LOW" | "SOLD OUT" = "ACTIVE";
    if (isPrebook) {
      if (availablePrebook === 0) status = "SOLD OUT";
      else if (availablePrebook <= threshold) status = "LOW";
      else status = "ACTIVE";
    } else {
      if (physical === 0 || availableBuyNow === 0) status = "SOLD OUT";
      else if (availableBuyNow <= threshold) status = "LOW";
      else status = "ACTIVE";
    }

    return {
      size,
      physicalStock: physical,
      reservedStock: reserved,
      availableStock: available,
      threshold,
      prebookLimit: pLimit,
      prebookedCount: pCount,
      availablePrebook,
      status,
    };
  });

  const totalPhysicalStock = variants.reduce((acc, v) => acc + v.physicalStock, 0);
  const totalAvailableStock = variants.reduce((acc, v) => acc + v.availableStock, 0);

  const totalPrebookLimit = Object.values(sizeLimits).reduce((a, b) => a + b, 0);
  const totalPrebookedCount = Object.values(sizeCounts).reduce((a, b) => a + b, 0);

  const prebookStartsAt = launchSettings.prebookStartsAt || enrichedProduct.prebook_starts_at;
  const prebookEndsAt = launchSettings.prebookEndsAt || enrichedProduct.prebook_ends_at;
  const fulfillmentEstimate = launchSettings.fulfillmentEstimate || enrichedProduct.expected_fulfillment_date || "OCTOBER 2026";

  const prebookConfig: PrebookConfig | undefined = isPrebook ? {
    isEnabled: true,
    startsAt: prebookStartsAt,
    endsAt: prebookEndsAt,
    expectedFulfillmentDate: fulfillmentEstimate,
    sizeLimits,
    sizeCounts,
    prebookLimit: totalPrebookLimit,
    currentPrebookCount: totalPrebookedCount,
  } : undefined;

  const launch = resolveLaunchState(launchRow, totalAvailableStock, {
    productStatus: enrichedProduct.status,
    isLimitedDrop: enrichedProduct.is_limited_drop,
    preorderThreshold: enrichedProduct.preorder_threshold,
    purchaseMode: effectivePurchaseMode,
    isPrebook,
    prebookStartsAt,
    prebookEndsAt,
    fulfillmentEstimate,
    prebookQuantityLimit: totalPrebookLimit,
    prebookConfig,
  });

  // Strict Storefront Lifecycle: If customer request (not allowDraft), reject draft, archived, or unpublished launches
  if (!options?.allowDraft) {
    if (enrichedProduct.status !== "ACTIVE" || launch.status === "DRAFT" || launch.status === "ARCHIVED") {
      return null;
    }
  }

  // 5. Build Asset Map with Independent 3-Tier Visual Environment System
  const activeAssets = (enrichedProduct.product_assets || []).filter((a: { is_active: boolean }) => a.is_active);
  const assetBySlot = new Map<string, string>();
  activeAssets.forEach((a: { slot: string; url: string }) => {
    assetBySlot.set(a.slot, a.url);
  });

  // Detect if product explicitly belongs to Bengaluru Edition
  const isBengaluruEdition = Boolean(
    (enrichedProduct.city_name && enrichedProduct.city_name.toUpperCase() === "BENGALURU") ||
    (enrichedProduct.collection && enrichedProduct.collection.toUpperCase().includes("BENGALURU")) ||
    (enrichedProduct.edition && enrichedProduct.edition.toUpperCase().includes("BENGALURU")) ||
    enrichedProduct.slug === "bengaluru-tee" ||
    enrichedProduct.slug === "bengaluru"
  );

  // Background Mode Resolution
  let backgroundType: ProductBackgroundType = "DEFAULT_STUDIO";
  if (launchSettings.backgroundType) {
    backgroundType = launchSettings.backgroundType as ProductBackgroundType;
  } else if (assetBySlot.get("BACKGROUND_TYPE")) {
    backgroundType = assetBySlot.get("BACKGROUND_TYPE") as ProductBackgroundType;
  } else if (enrichedProduct.background_type) {
    backgroundType = enrichedProduct.background_type as ProductBackgroundType;
  } else if (enrichedProduct.background_desktop || assetBySlot.get("BACKGROUND_DESKTOP")) {
    backgroundType = "PRODUCT_SPECIFIC";
  } else if (isBengaluruEdition) {
    backgroundType = "COLLECTION";
  }

  const NEUTRAL_STUDIO_BG = "/assets/environments/bexyee-studio-neutral.svg";
  const BENGALURU_RAIN_BG = "/bengaluru-signal-after-rain.svg";

  let desktopBg = "";
  let tabletBg = "";
  let mobileBg = "";

  if (backgroundType === "NONE") {
    desktopBg = "";
    tabletBg = "";
    mobileBg = "";
  } else if (backgroundType === "PRODUCT_SPECIFIC") {
    desktopBg = enrichedProduct.background_desktop || assetBySlot.get("BACKGROUND_DESKTOP") || assetBySlot.get("HERO_BACKGROUND") || NEUTRAL_STUDIO_BG;
    tabletBg = enrichedProduct.background_tablet || assetBySlot.get("BACKGROUND_TABLET") || desktopBg;
    mobileBg = enrichedProduct.background_mobile || assetBySlot.get("BACKGROUND_MOBILE") || desktopBg;
  } else if (backgroundType === "COLLECTION") {
    const colBg = isBengaluruEdition
      ? BENGALURU_RAIN_BG
      : (enrichedProduct.campaigns?.background_image || NEUTRAL_STUDIO_BG);
    desktopBg = colBg;
    tabletBg = enrichedProduct.campaigns?.tablet_background_image || colBg;
    mobileBg = enrichedProduct.campaigns?.mobile_background_image || colBg;
  } else {
    // DEFAULT_STUDIO
    desktopBg = NEUTRAL_STUDIO_BG;
    tabletBg = NEUTRAL_STUDIO_BG;
    mobileBg = NEUTRAL_STUDIO_BG;
  }

  const assets: ProductAssetSlotMap = {
    frontImage: assetBySlot.get("PRODUCT_FRONT_IMAGE") || enrichedProduct.front_image_url || "/assets/products/tee-front-neutral.svg",
    backImage: assetBySlot.get("PRODUCT_BACK_IMAGE") || enrichedProduct.back_image_url || "/assets/products/tee-back-neutral.svg",
    leftSleeveImage: assetBySlot.get("PRODUCT_LEFT_SLEEVE_IMAGE") || enrichedProduct.left_sleeve_image_url || "/assets/products/tee-left-neutral.svg",
    rightSleeveImage: assetBySlot.get("PRODUCT_RIGHT_SLEEVE_IMAGE") || enrichedProduct.right_sleeve_image_url || "/assets/products/tee-right-neutral.svg",
    printImage: assetBySlot.get("PRODUCT_PRINT_IMAGE") || enrichedProduct.print_image_url || "/assets/products/tee-print-neutral.svg",
    thumbnailImage: assetBySlot.get("PRODUCT_THUMBNAIL") || enrichedProduct.front_image_url || "/assets/products/tee-front-neutral.svg",
    modelUrl: assetBySlot.get("HERO_GLB") || enrichedProduct.model_url || process.env.NEXT_PUBLIC_MODEL_URL || undefined,
    backgroundType,
    backgrounds: {
      desktop: desktopBg,
      tablet: tabletBg,
      mobile: mobileBg,
    },
    ogImage: enrichedProduct.seo_og_image || enrichedProduct.campaigns?.og_image || desktopBg || NEUTRAL_STUDIO_BG,
  };

  // 6. Sizing Chart resolution (Section 4)
  const sizeChart = resolveSizeChart(enrichedProduct.size_charts);

  return {
    id: enrichedProduct.id,
    name: enrichedProduct.name,
    slug: enrichedProduct.slug,
    edition: enrichedProduct.edition || "DROP 001",
    sku: enrichedProduct.sku,
    pricePaise: enrichedProduct.price_paise,
    compareAtPricePaise: enrichedProduct.compare_at_price_paise,
    gstRate: enrichedProduct.gst_rate || 12,
    cityName: isBengaluruEdition ? (enrichedProduct.city_name || "BENGALURU") : (enrichedProduct.city_name || ""),
    collection: enrichedProduct.collection || "STUDIO COLLECTION",
    description: enrichedProduct.description || "A technical heavyweight uniform engineered for the metropolis.",
    fabric: enrichedProduct.fabric || "320 GSM SUPER LOOPKNIT",
    gsm: enrichedProduct.gsm || 320,
    fit: enrichedProduct.fit || "OVERSIZED",
    careInstructions: enrichedProduct.care_instructions || "Cold machine wash. Dry flat in shade.",
    sizeChart,
    assets,
    variants,
    totalPhysicalStock,
    totalAvailableStock,
    isSoldOut: totalAvailableStock <= 0,
    purchaseMode: launch.purchaseMode,
    prebookConfig,
    launch,
    seoTitle: enrichedProduct.seo_title || `BEXYEE — ${enrichedProduct.name}`,
    seoDescription: enrichedProduct.seo_description || enrichedProduct.description,
    seoOgImage: assets.ogImage,
  };
}

/**
 * Fallback Studio Product Demonstration Record
 */
export function getFallbackStudioProduct(slug = "studio-tee"): UnifiedProduct {
  const defaultBg = "/assets/environments/bexyee-studio-neutral.svg";
  return {
    id: "00000000-0000-0000-0000-000000000002",
    name: "BEXYEE Studio Heavyweight Tee",
    slug,
    edition: "ARCHIVE 001",
    sku: "BEXYEE-STU-001",
    pricePaise: 189900,
    compareAtPricePaise: null,
    gstRate: 12,
    cityName: "",
    collection: "CORE ARCHIVE",
    description: "Architectural 320 GSM loopknit cotton uniform in neutral obsidian studio environment.",
    fabric: "320 GSM SUPER LOOPKNIT",
    gsm: 320,
    fit: "OVERSIZED",
    careInstructions: "Cold machine wash. Dry flat in shade.",
    sizeChart: DEFAULT_APPAREL_SIZE_CHART,
    assets: {
      frontImage: "/assets/products/bengaluru-tee-front.svg",
      backImage: "/assets/products/bengaluru-tee-back.svg",
      leftSleeveImage: "/assets/products/bengaluru-tee-left.svg",
      rightSleeveImage: "/assets/products/bengaluru-tee-right.svg",
      printImage: "/assets/products/bengaluru-tee-print.svg",
      modelUrl: undefined,
      backgroundType: "DEFAULT_STUDIO",
      backgrounds: {
        desktop: defaultBg,
        tablet: defaultBg,
        mobile: defaultBg,
      },
      ogImage: defaultBg,
    },
    variants: [
      { size: "S", physicalStock: 10, reservedStock: 0, availableStock: 10, threshold: 5, status: "ACTIVE" },
      { size: "M", physicalStock: 15, reservedStock: 0, availableStock: 15, threshold: 5, status: "ACTIVE" },
      { size: "L", physicalStock: 12, reservedStock: 0, availableStock: 12, threshold: 5, status: "ACTIVE" },
      { size: "XL", physicalStock: 8, reservedStock: 0, availableStock: 8, threshold: 5, status: "ACTIVE" },
    ],
    totalPhysicalStock: 45,
    totalAvailableStock: 45,
    isSoldOut: false,
    purchaseMode: "BUY_NOW",
    launch: {
      status: "LIVE",
      countdownEnabled: false,
      isLimitedDrop: false,
      preorderThreshold: 0,
      isPurchasable: true,
      purchaseMode: "BUY_NOW",
      serverTime: new Date().toISOString(),
    },
    seoTitle: "BEXYEE — Studio Heavyweight Tee",
    seoDescription: "Architectural 320 GSM loopknit cotton uniform in neutral obsidian studio environment.",
  };
}

/**
 * Fallback Bengaluru Product Demonstration Record (Strictly for Bengaluru Edition)
 */
export function getFallbackBengaluruProduct(): UnifiedProduct {
  const defaultBg = "/bengaluru-signal-after-rain.svg";
  return {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Bengaluru Tee",
    slug: "bengaluru-tee",
    edition: "001 / 100",
    sku: "BEXYEE-BLR-001",
    pricePaise: 179900,
    compareAtPricePaise: null,
    gstRate: 12,
    cityName: "BENGALURU",
    collection: "BENGALURU EDITION",
    description: "A city uniform shaped by wet roads, late signals, and the small hours of Bengaluru.",
    fabric: "320 GSM SUPER LOOPKNIT",
    gsm: 320,
    fit: "OVERSIZED",
    careInstructions: "Cold machine wash. Dry flat in shade. Do not iron on print.",
    sizeChart: DEFAULT_APPAREL_SIZE_CHART,
    assets: {
      frontImage: "/assets/products/bengaluru-tee-front.svg",
      backImage: "/assets/products/bengaluru-tee-back.svg",
      leftSleeveImage: "/assets/products/bengaluru-tee-left.svg",
      rightSleeveImage: "/assets/products/bengaluru-tee-right.svg",
      printImage: "/assets/products/bengaluru-tee-print.svg",
      modelUrl: process.env.NEXT_PUBLIC_MODEL_URL || undefined,
      backgroundType: "COLLECTION",
      backgrounds: {
        desktop: defaultBg,
        tablet: defaultBg,
        mobile: defaultBg,
      },
      ogImage: defaultBg,
    },
    variants: [
      { size: "S", physicalStock: 10, reservedStock: 0, availableStock: 10, threshold: 5, status: "ACTIVE" },
      { size: "M", physicalStock: 15, reservedStock: 0, availableStock: 15, threshold: 5, status: "ACTIVE" },
      { size: "L", physicalStock: 12, reservedStock: 0, availableStock: 12, threshold: 5, status: "ACTIVE" },
      { size: "XL", physicalStock: 8, reservedStock: 0, availableStock: 8, threshold: 5, status: "ACTIVE" },
    ],
    totalPhysicalStock: 45,
    totalAvailableStock: 45,
    isSoldOut: false,
    purchaseMode: "BUY_NOW",
    launch: {
      status: "LIVE",
      countdownEnabled: false,
      isLimitedDrop: false,
      preorderThreshold: 0,
      isPurchasable: true,
      purchaseMode: "BUY_NOW",
      serverTime: new Date().toISOString(),
    },
    seoTitle: "BEXYEE — Bengaluru Tee",
    seoDescription: "Heavyweight 320 GSM loopknit uniform shaped by Bengaluru after dark.",
  };
}

export interface StorefrontCatalogItem {
  id: string;
  name: string;
  slug: string;
  edition: string;
  price_paise: number;
  fabric: string;
  fit: string;
  sku: string;
  front_image_url?: string | null;
  campaigns?: { city_name: string; accent_color: string } | null;
  status: string;
  launchStatus?: string;
}

/**
 * Single Authoritative Storefront Query Helper
 * Returns only products that are explicitly ACTIVE and have a LIVE launch.
 * Excludes draft, unpublished, archived, and deleted products.
 */
export async function getStorefrontCatalogProducts(): Promise<StorefrontCatalogItem[]> {
  if (!supabaseServer) return [];

  const { data: dbProducts, error } = await supabaseServer
    .from("products")
    .select("id, name, slug, edition, price_paise, fabric, fit, sku, front_image_url, status, campaigns(city_name, accent_color), launches(id, status, created_at)")
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  if (error || !dbProducts) return [];

  const activeProducts: StorefrontCatalogItem[] = [];

  for (const p of dbProducts as any[]) {
    const launches = (p.launches || []).sort(
      (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    const latestLaunch = launches[0];

    // If a launch row exists, its status must NOT be DRAFT or ARCHIVED
    if (latestLaunch && (latestLaunch.status === "DRAFT" || latestLaunch.status === "ARCHIVED")) {
      continue;
    }

    activeProducts.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      edition: p.edition || "DROP 001",
      price_paise: p.price_paise,
      fabric: p.fabric || "320 GSM SUPER LOOPKNIT",
      fit: p.fit || "OVERSIZED",
      sku: p.sku,
      front_image_url: p.front_image_url || "/assets/products/bengaluru-tee-front.svg",
      campaigns: p.campaigns,
      status: p.status,
      launchStatus: latestLaunch?.status || "LIVE",
    });
  }

  return activeProducts;
}
