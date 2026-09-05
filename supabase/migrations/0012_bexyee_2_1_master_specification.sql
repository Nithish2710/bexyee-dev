-- ============================================================================
-- BEXYEE 2.1 MASTER SPECIFICATION MIGRATION (0012)
-- Size charts, Legal GST Invoicing, Inventory Adjustments Audit, Refunds,
-- Universal Movable Backgrounds, and Two-Tier Admin Roles (Owner / Developer)
-- ============================================================================

-- 1. SIZE CHARTS REGISTRY
create table if not exists public.size_charts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'APPAREL_TOPS',
  unit text not null default 'INCHES',
  measurements jsonb not null default '{
    "S": { "length": 28.5, "chest": 42.0, "shoulder": 20.5, "sleeve": 8.5 },
    "M": { "length": 29.5, "chest": 44.0, "shoulder": 21.5, "sleeve": 9.0 },
    "L": { "length": 30.5, "chest": 46.0, "shoulder": 22.5, "sleeve": 9.5 },
    "XL": { "length": 31.5, "chest": 48.0, "shoulder": 23.5, "sleeve": 10.0 }
  }'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Insert Default Apparel Size Chart
insert into public.size_charts (name, category, unit, measurements, is_default)
values (
  'Standard Apparel Tops (S/M/L/XL)',
  'APPAREL_TOPS',
  'INCHES',
  '{
    "S": { "length": 28.5, "chest": 42.0, "shoulder": 20.5, "sleeve": 8.5 },
    "M": { "length": 29.5, "chest": 44.0, "shoulder": 21.5, "sleeve": 9.0 },
    "L": { "length": 30.5, "chest": 46.0, "shoulder": 22.5, "sleeve": 9.5 },
    "XL": { "length": 31.5, "chest": 48.0, "shoulder": 23.5, "sleeve": 10.0 }
  }'::jsonb,
  true
)
on conflict do nothing;

-- 2. EXTEND PRODUCTS TABLE FOR 2.1 SPECIFICATION
alter table public.products add column if not exists size_chart_id uuid references public.size_charts(id) on delete set null;
alter table public.products add column if not exists is_limited_drop boolean not null default false;
alter table public.products add column if not exists preorder_threshold integer not null default 0 check (preorder_threshold >= 0);
alter table public.products add column if not exists background_desktop text;
alter table public.products add column if not exists background_tablet text;
alter table public.products add column if not exists background_mobile text;

-- 3. INVENTORY ADJUSTMENTS AUDIT TRAIL TABLE
create table if not exists public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  admin_user_id uuid references auth.users(id) on delete set null,
  admin_email text not null default 'admin@bexyee.com',
  before_stock integer not null check (before_stock >= 0),
  delta integer not null,
  after_stock integer not null check (after_stock >= 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_inv_adjustments_prod_date on public.inventory_adjustments(product_id, created_at desc);

-- 4. LEGAL GST INVOICING TABLE
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  invoice_number text not null unique,
  gstin text not null,
  seller_name text not null default 'BEXYEE APPAREL LABS PRIVATE LIMITED',
  seller_address text not null default 'Bengaluru, Karnataka, 560001, India',
  customer_name text not null,
  customer_email text,
  customer_phone text,
  customer_address jsonb not null default '{}'::jsonb,
  customer_state text not null,
  is_interstate boolean not null default false,
  taxable_amount_paise integer not null check (taxable_amount_paise >= 0),
  cgst_paise integer not null default 0 check (cgst_paise >= 0),
  sgst_paise integer not null default 0 check (sgst_paise >= 0),
  igst_paise integer not null default 0 check (igst_paise >= 0),
  shipping_paise integer not null default 0 check (shipping_paise >= 0),
  total_amount_paise integer not null check (total_amount_paise >= 0),
  hsn_code text not null default '6109',
  line_items jsonb not null default '[]'::jsonb,
  pdf_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_invoices_order_id on public.invoices(order_id);
create index if not exists idx_invoices_number on public.invoices(invoice_number);

-- Sequence generator helper for sequential invoice numbering (INV-YYYY-XXXX)
create table if not exists public.invoice_sequences (
  year integer primary key,
  last_seq integer not null default 0
);

create or replace function public.generate_next_invoice_number()
returns text language plpgsql security definer as $$
declare
  curr_year integer := extract(year from current_date)::integer;
  next_val integer;
begin
  insert into public.invoice_sequences (year, last_seq)
  values (curr_year, 1)
  on conflict (year) do update
  set last_seq = public.invoice_sequences.last_seq + 1
  returning last_seq into next_val;

  return 'INV-' || curr_year || '-' || lpad(next_val::text, 4, '0');
end;
$$;

-- 5. OPERATIONAL ALERTS TABLE
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null check (alert_type in ('CHECKOUT_FAILURE_RATE', 'WEBHOOK_SIGNATURE_FAILURE', 'LAUNCH_DISCREPANCY', 'INVENTORY_DEPLETED', 'SYSTEM_ERROR')),
  severity text not null check (severity in ('INFO', 'WARNING', 'CRITICAL')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  dispatched boolean not null default false,
  dispatched_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_alerts_created on public.alerts(created_at desc);
create index if not exists idx_alerts_dispatched on public.alerts(dispatched, severity);

-- 6. ADMIN USER ROLES (OWNER / DEVELOPER)
do $$ begin
  alter type public.admin_role add value if not exists 'OWNER';
  alter type public.admin_role add value if not exists 'DEVELOPER';
exception when duplicate_object then null; end $$;

-- 7. ATOMIC STOCK ADJUSTMENT RPC FUNCTION WITH AUDIT
create or replace function public.adjust_inventory_v2(
  requested_product uuid,
  requested_size text,
  requested_delta integer,
  requested_reason text,
  requested_admin uuid,
  requested_admin_email text default 'admin@bexyee.com'
) returns integer language plpgsql security definer set search_path = public as $$
declare
  current_stock integer;
  new_stock integer;
begin
  select stock_quantity into current_stock
  from public.product_sizes
  where product_id = requested_product and size = requested_size
  for update;

  if current_stock is null then
    current_stock := 0;
    insert into public.product_sizes (product_id, size, stock_quantity)
    values (requested_product, requested_size, 0);
  end if;

  new_stock := current_stock + requested_delta;
  if new_stock < 0 then
    raise exception 'NEGATIVE_STOCK: Current stock is %, requested delta is %', current_stock, requested_delta;
  end if;

  update public.product_sizes
  set stock_quantity = new_stock
  where product_id = requested_product and size = requested_size;

  insert into public.inventory_adjustments (
    product_id, size, admin_user_id, admin_email, before_stock, delta, after_stock, reason
  ) values (
    requested_product, requested_size, requested_admin, requested_admin_email, current_stock, requested_delta, new_stock, requested_reason
  );

  return new_stock;
end;
$$;

-- 8. ROW LEVEL SECURITY POLICIES
alter table public.size_charts enable row level security;
alter table public.invoices enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.alerts enable row level security;

create policy "public can read size charts" on public.size_charts for select using (true);
create policy "admins manage size charts" on public.size_charts for all using (true) with check (true);
create policy "admins read invoices" on public.invoices for select using (true);
create policy "admins manage inventory adjustments" on public.inventory_adjustments for all using (true) with check (true);
create policy "admins read alerts" on public.alerts for all using (true) with check (true);
