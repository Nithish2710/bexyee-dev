-- Migration 0007: Asset Management, Campaign Drafts, Performance and Marketing Command Center

-- 1. Product Assets Table (Named Visual Slots)
create table if not exists public.product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  slot text not null check (slot in (
    'PRODUCT_FRONT_IMAGE',
    'PRODUCT_BACK_IMAGE',
    'PRODUCT_LEFT_SLEEVE_IMAGE',
    'PRODUCT_RIGHT_SLEEVE_IMAGE',
    'PRODUCT_PRINT_IMAGE',
    'HERO_GLB',
    'DETAIL_GALLERY_IMAGE'
  )),
  url text not null,
  filename text,
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

create index if not exists product_assets_product_slot_active_idx 
  on public.product_assets(product_id, slot, is_active);

-- 2. Campaign Assets Table (Backgrounds & Social)
create table if not exists public.campaign_assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  slot text not null check (slot in (
    'HERO_BACKGROUND',
    'MOBILE_BACKGROUND',
    'OG_IMAGE',
    'CAMPAIGN_BANNER'
  )),
  url text not null,
  filename text,
  mime_type text,
  file_size_bytes bigint check (file_size_bytes > 0),
  width integer,
  height integer,
  is_active boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_assets_campaign_slot_unique unique (campaign_id, slot)
);

create index if not exists campaign_assets_campaign_slot_idx 
  on public.campaign_assets(campaign_id, slot);

-- 3. Campaign Drafts Table (Preview Before Publish)
create table if not exists public.campaign_drafts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade unique,
  draft_payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Marketing Integrations Configuration & Metrics Table
create table if not exists public.marketing_integrations (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique check (provider in ('META_ADS', 'GOOGLE_ADS', 'BEHAVIOR_ANALYTICS')),
  is_connected boolean not null default false,
  credentials_encrypted text,
  configuration jsonb not null default '{}'::jsonb,
  metrics_cache jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 5. Real-Time Performance Observability Metrics Table
create table if not exists public.performance_metrics (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  device_tier text not null check (device_tier in ('MOBILE', 'TABLET', 'DESKTOP')),
  connection_type text,
  lcp_ms numeric(8, 2),
  cls numeric(6, 4),
  inp_ms numeric(8, 2),
  ttfb_ms numeric(8, 2),
  js_bundle_kb numeric(8, 2),
  glb_weight_kb numeric(8, 2),
  image_weight_kb numeric(8, 2),
  three_load_ms numeric(8, 2),
  created_at timestamptz not null default now()
);

create index if not exists performance_metrics_device_created_idx 
  on public.performance_metrics(device_tier, created_at desc);

-- 6. Row-Level Security
alter table public.product_assets enable row level security;
alter table public.campaign_assets enable row level security;
alter table public.campaign_drafts enable row level security;
alter table public.marketing_integrations enable row level security;
alter table public.performance_metrics enable row level security;

-- Public can read active assets
create policy "public can read active product assets" on public.product_assets for select using (is_active = true);
create policy "public can read active campaign assets" on public.campaign_assets for select using (is_active = true);

-- Admins have full access
create policy "admins manage product assets" on public.product_assets for all using (public.is_admin());
create policy "admins manage campaign assets" on public.campaign_assets for all using (public.is_admin());
create policy "admins manage campaign drafts" on public.campaign_drafts for all using (public.is_admin());
create policy "admins manage marketing integrations" on public.marketing_integrations for all using (public.is_admin());
create policy "admins manage performance metrics" on public.performance_metrics for select using (public.is_admin());
create policy "public can insert performance telemetry" on public.performance_metrics for insert with check (true);

-- 7. Add view photo columns to products table if not present for high-speed denormalized reads
alter table public.products add column if not exists front_image_url text;
alter table public.products add column if not exists back_image_url text;
alter table public.products add column if not exists left_sleeve_image_url text;
alter table public.products add column if not exists right_sleeve_image_url text;
alter table public.products add column if not exists print_image_url text;
alter table public.campaigns add column if not exists mobile_background_image text;
