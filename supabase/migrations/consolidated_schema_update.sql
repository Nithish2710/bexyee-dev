-- ============================================================================
-- BEXYEE MASTER SCHEMA UPDATE (Migrations 0005 -> 0011 Consolidated)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/syllbbpovvucvriezaiw/sql/new
-- ============================================================================

-- 1. ORDER & RESERVATION LIFECYCLE EXTENSIONS (0005, 0006)
do $$ begin
  alter type public.order_status add value if not exists 'REQUIRES_REFUND';
exception when duplicate_object then null; end $$;

do $$ begin
  alter type public.payment_status add value if not exists 'PARTIALLY_REFUNDED';
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reservation_status as enum ('ACTIVE', 'CONFIRMED', 'RELEASED', 'EXPIRED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.shipment_status as enum (
    'PENDING', 'READY', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED', 'RETURNED'
  );
exception when duplicate_object then null; end $$;

alter table public.orders add column if not exists guest_token text;
alter table public.orders add column if not exists cart_id uuid references public.carts(id) on delete set null;
alter table public.orders add column if not exists expires_at timestamptz;

create table if not exists public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  quantity integer not null check (quantity > 0),
  status public.reservation_status not null default 'ACTIVE',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stock_reservations_order_sku_unique unique (order_id, product_id, size)
);

create index if not exists stock_reservations_product_size_status_idx
  on public.stock_reservations(product_id, size, status, expires_at);
create index if not exists stock_reservations_order_idx
  on public.stock_reservations(order_id);

alter table public.stock_reservations enable row level security;

-- 2. DEDICATED PAYMENTS, REFUNDS, AND WEBHOOKS (0006)
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('RAZORPAY', 'SHIPROCKET', 'DELHIVERY', 'POSTMARK', 'RESEND')),
  event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default now(),
  status text not null default 'PROCESSED' check (status in ('PROCESSED', 'FAILED', 'SKIPPED')),
  error_message text,
  constraint webhook_events_provider_event_id_unique unique (provider, event_id)
);
create index if not exists webhook_events_provider_event_type_idx on public.webhook_events(provider, event_type);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'RAZORPAY',
  razorpay_order_id text not null,
  razorpay_payment_id text not null unique,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  status public.payment_status not null default 'PENDING',
  method text,
  bank text,
  wallet text,
  vpa text,
  error_code text,
  error_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists payments_status_idx on public.payments(status);

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  payment_id uuid references public.payments(id) on delete restrict,
  razorpay_refund_id text unique,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  reason text not null,
  status text not null default 'PROCESSED' check (status in ('PENDING', 'PROCESSED', 'FAILED')),
  restocked boolean not null default false,
  admin_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists refunds_order_id_idx on public.refunds(order_id);

-- 3. THEMES REGISTRY (0011)
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  accent_color text not null default '#e52b20',
  background_color text not null default '#0b0b0a',
  text_color text not null default '#ede9e1',
  surface_color text not null default '#141412',
  typography_preset text not null default 'MODERNIST_CONDENSED',
  button_style text not null default 'SHARP_SOLID',
  spacing_density text not null default 'COMPACT_ARCHITECTURAL',
  atmospheric_effect text not null default 'NEON_RAIN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.themes (name, slug, accent_color, background_color, atmospheric_effect) values
('Bengaluru Rain Signal', 'bengaluru-rain-signal', '#e52b20', '#0b0b0a', 'NEON_RAIN'),
('Mumbai Coastal Noir', 'mumbai-coastal-noir', '#38bdf8', '#070a0f', 'NOCTURNAL_HAZE'),
('Delhi Neon Alley', 'delhi-neon-alley', '#f59e0b', '#0f0c08', 'DUSK_GRADIENT'),
('Standard Industrial Monochrome', 'standard-monochrome', '#ffffff', '#000000', 'MONOCHROME_GRID')
on conflict (slug) do nothing;

-- 4. BRAND ASSETS REGISTRY (0011)
create table if not exists public.brand_assets (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('LOGO_2D', 'LOGO_GLB', 'LOGO_DARK', 'LOGO_LIGHT', 'FAVICON', 'BRAND_WATERMARK')),
  url text not null,
  storage_path text,
  original_filename text,
  mime_type text not null default 'image/svg+xml',
  file_size_bytes bigint check (file_size_bytes > 0),
  version integer not null default 1,
  is_active boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brand_assets_slot_version_unique unique (slot, version)
);
create index if not exists idx_brand_assets_slot_active on public.brand_assets(slot, is_active);

insert into public.brand_assets (slot, url, original_filename, mime_type, file_size_bytes, version, is_active) values
('LOGO_2D', '/bengaluru-signal-after-rain.svg', 'bexyee-wordmark.svg', 'image/svg+xml', 12288, 1, true),
('LOGO_DARK', '/bengaluru-signal-after-rain.svg', 'bexyee-dark.svg', 'image/svg+xml', 12288, 1, true),
('LOGO_LIGHT', '/bengaluru-signal-after-rain.svg', 'bexyee-light.svg', 'image/svg+xml', 12288, 1, true)
on conflict (slot, version) do nothing;

-- 5. EXTEND PRODUCTS TABLE (0007, 0010, 0011)
alter table public.products alter column campaign_id drop not null;
alter table public.products add column if not exists experience_type text not null default 'CITY_3D' 
  check (experience_type in ('STANDARD', 'CITY_3D', 'EDITORIAL', 'IMMERSIVE', 'LIMITED_DROP'));
alter table public.products add column if not exists theme_id uuid references public.themes(id) on delete set null;
alter table public.products add column if not exists city_name text not null default 'BENGALURU';
alter table public.products add column if not exists collection text not null default 'MONSOON 2026';
alter table public.products add column if not exists gst_rate numeric(4, 2) not null default 12.00 check (gst_rate >= 0);
alter table public.products add column if not exists care_instructions text;
alter table public.products add column if not exists artwork_url text;
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists seo_og_image text;
alter table public.products add column if not exists front_image_url text;
alter table public.products add column if not exists back_image_url text;
alter table public.products add column if not exists left_sleeve_image_url text;
alter table public.products add column if not exists right_sleeve_image_url text;
alter table public.products add column if not exists print_image_url text;

-- 6. EXTEND PRODUCT SIZES TABLE
alter table public.product_sizes add column if not exists low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0);

-- 7. PRODUCT ASSETS TABLE (0007, 0010)
create table if not exists public.product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  slot text not null check (slot in (
    'PRODUCT_FRONT_IMAGE',
    'PRODUCT_BACK_IMAGE',
    'PRODUCT_LEFT_SLEEVE_IMAGE',
    'PRODUCT_RIGHT_SLEEVE_IMAGE',
    'PRODUCT_PRINT_IMAGE',
    'PRODUCT_THUMBNAIL',
    'HERO_GLB',
    'HERO_BACKGROUND',
    'MOBILE_BACKGROUND',
    'SEO_OG_IMAGE',
    'DETAIL_GALLERY_IMAGE'
  )),
  url text not null,
  filename text,
  original_filename text,
  storage_path text,
  checksum text,
  mime_type text,
  file_size_bytes bigint check (file_size_bytes > 0),
  width integer,
  height integer,
  version integer not null default 1,
  is_active boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_assets_product_slot_unique unique (product_id, slot, version)
);
create index if not exists idx_product_assets_slot_active on public.product_assets(product_id, slot, is_active);

-- 8. LAUNCHES TABLE (0011)
create table if not exists public.launches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null check (status in ('DRAFT', 'READY', 'SCHEDULED', 'LIVE', 'PAUSED', 'ENDED', 'ARCHIVED')) default 'DRAFT',
  launch_at timestamptz,
  end_at timestamptz,
  hero_headline text,
  hero_subheadline text,
  countdown_enabled boolean not null default true,
  urgency_badge text default 'LIMITED FIRST RUN',
  utm_campaign text,
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_launches_product_id on public.launches(product_id);
create index if not exists idx_launches_slug on public.launches(slug);
create index if not exists idx_launches_status_schedule on public.launches(status, launch_at, end_at);

-- 9. CMS TABLES (0008)
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  author text not null default 'BEXYEE MATERIALS LAB',
  reading_time text not null default '4 MIN READ',
  excerpt text not null,
  content text not null,
  cover_image_url text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_slug_idx on public.articles(slug);

create table if not exists public.lookbook_items (
  id uuid primary key default gen_random_uuid(),
  edition_title text not null,
  image_url text not null,
  caption text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.city_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  city text not null,
  summary text not null,
  cover_image_url text,
  published_date text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  metric text not null,
  detail text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 10. ORDER NOTES TABLE (0009)
create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  note text not null,
  author_email text not null default 'admin@bexyee.com',
  created_at timestamptz not null default now()
);
create index if not exists idx_order_notes_order_id on public.order_notes(order_id);

-- 11. ROW-LEVEL SECURITY POLICIES
alter table public.themes enable row level security;
alter table public.brand_assets enable row level security;
alter table public.launches enable row level security;
alter table public.product_assets enable row level security;
alter table public.articles enable row level security;
alter table public.lookbook_items enable row level security;
alter table public.city_stories enable row level security;
alter table public.milestones enable row level security;
alter table public.order_notes enable row level security;

-- Public read policies
create policy "public can read themes" on public.themes for select using (true);
create policy "public can read active brand assets" on public.brand_assets for select using (is_active = true);
create policy "public can read live or scheduled launches" on public.launches for select using (status in ('SCHEDULED', 'LIVE', 'ENDED'));
create policy "public can read active product assets" on public.product_assets for select using (is_active = true);
create policy "public can read published articles" on public.articles for select using (is_published = true);
create policy "public can read published lookbook" on public.lookbook_items for select using (is_published = true);
create policy "public can read published city stories" on public.city_stories for select using (is_published = true);
create policy "public can read active milestones" on public.milestones for select using (is_active = true);

-- Admin management policies
create policy "admins manage themes" on public.themes for all using (public.is_admin());
create policy "admins manage brand assets" on public.brand_assets for all using (public.is_admin());
create policy "admins manage launches" on public.launches for all using (public.is_admin());
create policy "admins manage product assets" on public.product_assets for all using (public.is_admin());
create policy "admins manage articles" on public.articles for all using (public.is_admin());
create policy "admins manage lookbook" on public.lookbook_items for all using (public.is_admin());
create policy "admins manage city stories" on public.city_stories for all using (public.is_admin());
create policy "admins manage milestones" on public.milestones for all using (public.is_admin());
create policy "admins manage order notes" on public.order_notes for all using (true) with check (true);

-- End of consolidated migration
