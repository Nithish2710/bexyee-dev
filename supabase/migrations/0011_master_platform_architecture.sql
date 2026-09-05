-- Migration 0011: Master Product, Experience, and Launch Platform Architecture

-- 1. Themes Registry Table (Configuration-driven visual treatments)
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  accent_color text not null default '#e52b20',
  background_color text not null default '#0b0b0a',
  text_color text not null default '#ede9e1',
  surface_color text not null default '#141412',
  typography_preset text not null default 'MODERNIST_CONDENSED', -- MODERNIST_CONDENSED, EDITORIAL_SERIF, MONOSPACE_INDUSTRIAL, MINIMAL_GEO
  button_style text not null default 'SHARP_SOLID', -- SHARP_SOLID, PILL_OUTLINE, GHOST_MINIMAL
  spacing_density text not null default 'COMPACT_ARCHITECTURAL', -- COMPACT_ARCHITECTURAL, EDITORIAL_EXPANSIVE
  atmospheric_effect text not null default 'NEON_RAIN', -- NEON_RAIN, NOCTURNAL_HAZE, MONOCHROME_GRID, DUSK_GRADIENT
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed default themes
insert into public.themes (name, slug, accent_color, background_color, atmospheric_effect) values
('Bengaluru Rain Signal', 'bengaluru-rain-signal', '#e52b20', '#0b0b0a', 'NEON_RAIN'),
('Mumbai Coastal Noir', 'mumbai-coastal-noir', '#38bdf8', '#070a0f', 'NOCTURNAL_HAZE'),
('Delhi Neon Alley', 'delhi-neon-alley', '#f59e0b', '#0f0c08', 'DUSK_GRADIENT'),
('Standard Industrial Monochrome', 'standard-monochrome', '#ffffff', '#000000', 'MONOCHROME_GRID')
on conflict (slug) do nothing;

-- 2. Brand Assets Table (Decoupled Global Brand Logos & 3D Emblems)
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

-- Seed default brand assets
insert into public.brand_assets (slot, url, original_filename, mime_type, file_size_bytes, version, is_active) values
('LOGO_2D', '/bengaluru-signal-after-rain.svg', 'bexyee-wordmark.svg', 'image/svg+xml', 12288, 1, true),
('LOGO_DARK', '/bengaluru-signal-after-rain.svg', 'bexyee-dark.svg', 'image/svg+xml', 12288, 1, true),
('LOGO_LIGHT', '/bengaluru-signal-after-rain.svg', 'bexyee-light.svg', 'image/svg+xml', 12288, 1, true)
on conflict (slot, version) do nothing;

-- 3. Extend products table with experience_type and theme_id
alter table public.products add column if not exists experience_type text not null default 'CITY_3D' 
  check (experience_type in ('STANDARD', 'CITY_3D', 'EDITORIAL', 'IMMERSIVE', 'LIMITED_DROP'));

alter table public.products add column if not exists theme_id uuid references public.themes(id) on delete set null;

-- 4. Launches Engine Table (Authoritative Launch Scheduling & Drop Lifecycle)
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

-- 5. Row-Level Security Policies
alter table public.themes enable row level security;
alter table public.brand_assets enable row level security;
alter table public.launches enable row level security;

-- Public read policies
create policy "public can read themes" on public.themes for select using (true);
create policy "public can read active brand assets" on public.brand_assets for select using (is_active = true);
create policy "public can read live or scheduled launches" on public.launches for select using (status in ('SCHEDULED', 'LIVE', 'ENDED'));

-- Admin management policies
create policy "admins manage themes" on public.themes for all using (public.is_admin());
create policy "admins manage brand assets" on public.brand_assets for all using (public.is_admin());
create policy "admins manage launches" on public.launches for all using (public.is_admin());
