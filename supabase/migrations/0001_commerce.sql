create extension if not exists pgcrypto;

create type public.product_status as enum ('DRAFT', 'ACTIVE', 'ARCHIVED');
create type public.order_status as enum ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
create type public.payment_status as enum ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  city_name text not null,
  campaign_title text not null,
  background_image text not null,
  accent_color text not null default '#e52b20',
  inspiration text not null default '',
  active boolean not null default false,
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  slug text not null unique,
  name text not null,
  edition text not null,
  description text not null default '',
  price_paise integer not null check (price_paise >= 0),
  compare_at_price_paise integer check (compare_at_price_paise is null or compare_at_price_paise >= price_paise),
  fabric text not null default '',
  gsm integer check (gsm is null or gsm > 0),
  fit text not null default '',
  model_url text,
  product_images jsonb not null default '[]'::jsonb,
  sku text not null unique,
  status public.product_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_sizes (
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  primary key (product_id, size)
);

create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  guest_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or guest_token is not null)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  quantity integer not null check (quantity > 0),
  unique (cart_id, product_id, size)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  guest_email text,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  subtotal_paise integer not null check (subtotal_paise >= 0),
  discount_paise integer not null default 0 check (discount_paise >= 0),
  shipping_paise integer not null default 0 check (shipping_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  payment_status public.payment_status not null default 'PENDING',
  status public.order_status not null default 'PENDING',
  address jsonb,
  tracking_number text,
  attribution jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  sku text not null,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  quantity integer not null check (quantity > 0),
  unit_price_paise integer not null check (unit_price_paise >= 0)
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_id text not null unique,
  session_id text,
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  properties jsonb not null default '{}'::jsonb,
  attribution jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('ABANDONED_CART', 'CHECKOUT_ABANDONMENT', 'ORDER_CONFIRMATION', 'PAYMENT_CONFIRMATION', 'SHIPPING', 'DELIVERY', 'REVIEW_REQUEST')),
  customer_id uuid references public.customers(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  email text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index products_campaign_status_idx on public.products(campaign_id, status);
create index orders_created_at_idx on public.orders(created_at desc);
create index analytics_events_name_created_idx on public.analytics_events(event_name, created_at desc);
create index email_events_pending_idx on public.email_events(processed_at, created_at);

create or replace function public.reserve_stock(requested_product uuid, requested_size text, requested_quantity integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare available integer;
begin
  select stock_quantity into available from public.product_sizes where product_id = requested_product and size = requested_size for update;
  if available is null or available < requested_quantity then return false; end if;
  update public.product_sizes set stock_quantity = stock_quantity - requested_quantity where product_id = requested_product and size = requested_size;
  return true;
end;
$$;

alter table public.campaigns enable row level security;
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.analytics_events enable row level security;
create policy "published campaigns are public" on public.campaigns for select using (active = true);
create policy "active products are public" on public.products for select using (status = 'ACTIVE');
create policy "active product sizes are public" on public.product_sizes for select using (exists (select 1 from public.products p where p.id = product_id and p.status = 'ACTIVE'));
