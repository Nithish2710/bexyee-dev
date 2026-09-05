create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'ADMIN' check (role = 'ADMIN'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.campaigns add column if not exists edition text not null default '001';
alter table public.campaigns add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.inventory_settings (
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  primary key (product_id, size)
);

create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  size text not null check (size in ('S', 'M', 'L', 'XL')),
  delta integer not null check (delta <> 0),
  stock_before integer not null check (stock_before >= 0),
  stock_after integer not null check (stock_after >= 0),
  reason text not null,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  tracking_number text,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.audit_logs enable row level security;
alter table public.inventory_settings enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.order_status_history enable row level security;

create or replace function public.is_admin(requested_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = requested_user and role = 'ADMIN' and active = true);
$$;

create policy "admins can read their admin record" on public.admin_users for select using (user_id = auth.uid());
create policy "admins can read audit logs" on public.audit_logs for select using (public.is_admin());
create policy "admins can read inventory settings" on public.inventory_settings for select using (public.is_admin());
create policy "admins can read inventory adjustments" on public.inventory_adjustments for select using (public.is_admin());
create policy "admins can read order history" on public.order_status_history for select using (public.is_admin());

create or replace function public.adjust_inventory(requested_product uuid, requested_size text, requested_delta integer, requested_reason text, requested_admin uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare current_stock integer;
new_stock integer;
begin
  if not public.is_admin(requested_admin) then raise exception 'ADMIN_REQUIRED'; end if;
  if requested_delta = 0 then raise exception 'DELTA_REQUIRED'; end if;
  select stock_quantity into current_stock from public.product_sizes where product_id = requested_product and size = requested_size for update;
  if current_stock is null then raise exception 'SIZE_NOT_FOUND'; end if;
  new_stock := current_stock + requested_delta;
  if new_stock < 0 then raise exception 'NEGATIVE_STOCK'; end if;
  update public.product_sizes set stock_quantity = new_stock where product_id = requested_product and size = requested_size;
  insert into public.inventory_adjustments(product_id, size, delta, stock_before, stock_after, reason, admin_user_id) values (requested_product, requested_size, requested_delta, current_stock, new_stock, requested_reason, requested_admin);
  return new_stock;
end;
$$;

create or replace function public.record_admin_audit(requested_admin uuid, requested_action text, requested_entity text, requested_entity_id text, requested_metadata jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare audit_id uuid;
begin
  if not public.is_admin(requested_admin) then raise exception 'ADMIN_REQUIRED'; end if;
  insert into public.audit_logs(admin_user_id, action, entity, entity_id, metadata) values (requested_admin, requested_action, requested_entity, requested_entity_id, requested_metadata) returning id into audit_id;
  return audit_id;
end;
$$;
