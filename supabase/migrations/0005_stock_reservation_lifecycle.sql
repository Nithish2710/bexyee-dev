-- Migration 0005: Stock Reservation Lifecycle & Concurrency Hardening

alter type public.order_status add value if not exists 'REQUIRES_REFUND';

do $$ begin
  create type public.reservation_status as enum ('ACTIVE', 'CONFIRMED', 'RELEASED', 'EXPIRED');
exception
  when duplicate_object then null;
end $$;

-- Track guest_token, cart_id and expires_at on orders
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

-- Atomic Order Stock Reservation (AVAILABLE -> RESERVED with TTL)
create or replace function public.reserve_order_stock(requested_order uuid, ttl_seconds integer default 900)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  item record;
  current_physical integer;
  active_reserved integer;
  available_units integer;
  expiry timestamptz;
  target_cart uuid;
  target_guest text;
begin
  expiry := now() + (ttl_seconds || ' seconds')::interval;

  -- Lookup order metadata to release prior abandoned reservations for same cart/guest
  select cart_id, guest_token into target_cart, target_guest
  from public.orders
  where id = requested_order;

  if target_cart is not null or target_guest is not null then
    -- Release any previous pending unpaid reservations for this same cart/guest token
    update public.stock_reservations sr
    set status = 'RELEASED', updated_at = now()
    from public.orders o
    where sr.order_id = o.id
      and o.id <> requested_order
      and (
        (target_cart is not null and o.cart_id = target_cart)
        or (target_guest is not null and o.guest_token = target_guest)
      )
      and o.payment_status = 'PENDING'
      and sr.status = 'ACTIVE';
  end if;

  -- 1. Sort by product_id, size to enforce deterministic locking order and prevent deadlocks
  for item in (
    select product_id, size, quantity
    from public.order_items
    where order_id = requested_order
    order by product_id asc, size asc
  ) loop
    -- 2. Lock the target inventory row in deterministic global order
    select stock_quantity into current_physical
    from public.product_sizes
    where product_id = item.product_id and size = item.size
    for update;

    if current_physical is null then
      return jsonb_build_object('success', false, 'error', 'SIZE_NOT_FOUND', 'product_id', item.product_id, 'size', item.size);
    end if;

    -- 3. Lazily expire any outdated active reservations for this SKU
    update public.stock_reservations
    set status = 'EXPIRED', updated_at = now()
    where product_id = item.product_id and size = item.size and status = 'ACTIVE' and expires_at < now();

    -- 4. Calculate total currently active reservations (excluding any existing reservation for this exact order)
    select coalesce(sum(quantity), 0) into active_reserved
    from public.stock_reservations
    where product_id = item.product_id
      and size = item.size
      and status = 'ACTIVE'
      and expires_at >= now()
      and order_id <> requested_order;

    available_units := current_physical - active_reserved;

    -- 5. Check if enough units are available
    if available_units < item.quantity then
      return jsonb_build_object(
        'success', false,
        'error', 'INSUFFICIENT_STOCK',
        'product_id', item.product_id,
        'size', item.size,
        'available', available_units,
        'requested', item.quantity
      );
    end if;
  end loop;

  -- 6. All items verified: upsert atomic reservation records
  for item in (
    select product_id, size, quantity
    from public.order_items
    where order_id = requested_order
  ) loop
    insert into public.stock_reservations(order_id, product_id, size, quantity, status, expires_at)
    values (requested_order, item.product_id, item.size, item.quantity, 'ACTIVE', expiry)
    on conflict (order_id, product_id, size)
    do update set
      quantity = excluded.quantity,
      status = 'ACTIVE',
      expires_at = excluded.expires_at,
      updated_at = now();
  end loop;

  update public.orders set expires_at = expiry where id = requested_order;

  return jsonb_build_object('success', true, 'expires_at', expiry);
end;
$$;

-- Atomic Reservation Confirmation (RESERVED -> SOLD)
create or replace function public.confirm_order_stock_reservation(requested_order uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  res record;
  current_physical integer;
  all_confirmed boolean := true;
begin
  -- Idempotency check: if all reservations for this order are already CONFIRMED
  if exists (
    select 1 from public.stock_reservations
    where order_id = requested_order and status = 'CONFIRMED'
  ) and not exists (
    select 1 from public.stock_reservations
    where order_id = requested_order and status = 'ACTIVE'
  ) then
    return jsonb_build_object('success', true, 'already_confirmed', true);
  end if;

  -- Lock product sizes in consistent deterministic order
  for res in (
    select id, product_id, size, quantity, status, expires_at
    from public.stock_reservations
    where order_id = requested_order
    order by product_id asc, size asc
  ) loop
    select stock_quantity into current_physical
    from public.product_sizes
    where product_id = res.product_id and size = res.size
    for update;

    -- If the reservation is active OR if physical stock is still sufficient to fulfill late confirmation
    if current_physical >= res.quantity then
      update public.product_sizes
      set stock_quantity = stock_quantity - res.quantity
      where product_id = res.product_id and size = res.size;

      update public.stock_reservations
      set status = 'CONFIRMED', updated_at = now()
      where id = res.id;
    else
      all_confirmed := false;
      update public.stock_reservations
      set status = 'EXPIRED', updated_at = now()
      where id = res.id;
    end if;
  end loop;

  if all_confirmed then
    return jsonb_build_object('success', true, 'status', 'CONFIRMED');
  else
    return jsonb_build_object('success', false, 'error', 'RESERVATION_EXPIRED_STOCK_UNAVAILABLE');
  end if;
end;
$$;

-- Atomic Reservation Release (RESERVED -> AVAILABLE on cancel/failed payment)
create or replace function public.release_order_stock_reservation(requested_order uuid, release_reason text default 'CANCELLED')
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  update public.stock_reservations
  set status = 'RELEASED', updated_at = now()
  where order_id = requested_order and status = 'ACTIVE';

  return jsonb_build_object('success', true, 'reason', release_reason);
end;
$$;

-- Realtime Available Stock Query (physical - active reservations)
create or replace function public.get_available_stock(requested_product uuid, requested_size text)
returns integer language plpgsql security definer set search_path = public as $$
declare
  physical_stock integer;
  active_reserved integer;
begin
  update public.stock_reservations
  set status = 'EXPIRED', updated_at = now()
  where product_id = requested_product and size = requested_size and status = 'ACTIVE' and expires_at < now();

  select stock_quantity into physical_stock
  from public.product_sizes
  where product_id = requested_product and size = requested_size;

  if physical_stock is null then return 0; end if;

  select coalesce(sum(quantity), 0) into active_reserved
  from public.stock_reservations
  where product_id = requested_product and size = requested_size and status = 'ACTIVE' and expires_at >= now();

  return greatest(0, physical_stock - active_reserved);
end;
$$;

-- Revoke public execution to ensure all reservations occur through service-role backend
revoke execute on function public.reserve_order_stock(uuid, integer) from public, anon, authenticated;
revoke execute on function public.confirm_order_stock_reservation(uuid) from public, anon, authenticated;
revoke execute on function public.release_order_stock_reservation(uuid, text) from public, anon, authenticated;
revoke execute on function public.get_available_stock(uuid, text) from public, anon, authenticated;
