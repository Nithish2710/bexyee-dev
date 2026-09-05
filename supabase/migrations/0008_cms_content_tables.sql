-- Migration 0008: Data-Driven CMS Content Tables for Blog, Lookbook, Stories, and Milestones

-- 1. Articles / Journal Table
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
create index if not exists articles_published_idx on public.articles(is_published, published_at desc);

-- 2. Lookbook Gallery Table
create table if not exists public.lookbook_items (
  id uuid primary key default gen_random_uuid(),
  edition_title text not null,
  image_url text not null,
  caption text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. City Stories Table
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

-- 4. Achievements / Milestones Table
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

-- Row Level Security
alter table public.articles enable row level security;
alter table public.lookbook_items enable row level security;
alter table public.city_stories enable row level security;
alter table public.milestones enable row level security;

create policy "public can read published articles" on public.articles for select using (is_published = true);
create policy "admins manage articles" on public.articles for all using (public.is_admin());

create policy "public can read published lookbook" on public.lookbook_items for select using (is_published = true);
create policy "admins manage lookbook" on public.lookbook_items for all using (public.is_admin());

create policy "public can read published city stories" on public.city_stories for select using (is_published = true);
create policy "admins manage city stories" on public.city_stories for all using (public.is_admin());

create policy "public can read active milestones" on public.milestones for select using (is_active = true);
create policy "admins manage milestones" on public.milestones for all using (public.is_admin());
