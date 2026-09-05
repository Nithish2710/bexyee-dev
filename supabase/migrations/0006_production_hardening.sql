-- Migration 0006: Comprehensive Enterprise Production Hardening
-- Adds webhook_events, payments, refunds, shipments, audit triggers, and state transition guards

-- 1. Payment Status and Order Status Type Extensions
do $$ begin
  alter type public.payment_status add value if not exists 'PARTIALLY_REFUNDED';
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.shipment_status as enum (
    'PENDING', 'READY', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED', 'RETURNED'
  );
exception when duplicate_object then null;
end $$;

-- 2. Webhook Events Table (Strict Distributed Idempotency)
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

-- 3. Dedicated Payments Ledger Table
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

-- 4. Dedicated Refunds Table
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

-- 5. Dedicated Shipments Table
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'CONFIGURED',
  provider_shipment_id text,
  awb text,
  courier_name text,
  tracking_url text,
  label_url text,
  status public.shipment_status not null default 'PENDING',
  shipping_address jsonb not null,
  shipping_fee_paise integer not null default 0 check (shipping_fee_paise >= 0),
  estimated_delivery timestamptz,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_order_id_idx on public.shipments(order_id);
create index if not exists shipments_awb_idx on public.shipments(awb);

-- 6. Order Status Transition Guard Trigger
create or replace function public.validate_order_status_transition()
returns trigger language plpgsql as $$
begin
  -- Prevent modifying completed terminal states
  if old.status in ('DELIVERED', 'REFUNDED') and new.status is distinct from old.status then
    raise exception 'ILLEGAL_ORDER_STATUS_TRANSITION: Terminal status % cannot be changed.', old.status;
  end if;

  -- Enforce valid transition paths
  if old.status = 'PENDING' and new.status not in ('PENDING', 'PAID', 'CANCELLED', 'REQUIRES_REFUND') then
    raise exception 'ILLEGAL_ORDER_STATUS_TRANSITION: % cannot transition to % directly.', old.status, new.status;
  end if;

  if old.status = 'PAID' and new.status not in ('PAID', 'PROCESSING', 'CANCELLED', 'REFUNDED') then
    raise exception 'ILLEGAL_ORDER_STATUS_TRANSITION: % cannot transition to % directly.', old.status, new.status;
  end if;

  if old.status = 'PROCESSING' and new.status not in ('PROCESSING', 'SHIPPED', 'CANCELLED', 'REFUNDED') then
    raise exception 'ILLEGAL_ORDER_STATUS_TRANSITION: % cannot transition to % directly.', old.status, new.status;
  end if;

  if old.status = 'SHIPPED' and new.status not in ('SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') then
    raise exception 'ILLEGAL_ORDER_STATUS_TRANSITION: % cannot transition to % directly.', old.status, new.status;
  end if;

  return new;
end;
$$;

drop trigger if exists order_status_transition_guard on public.orders;
create trigger order_status_transition_guard
  before update on public.orders
  for each row execute function public.validate_order_status_transition();

-- 7. Automatic updated_at Trigger
create or replace function public.set_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at_column();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at_column();

drop trigger if exists set_campaigns_updated_at on public.campaigns;
create trigger set_campaigns_updated_at before update on public.campaigns for each row execute function public.set_updated_at_column();

-- 8. Refund Atomic Execution Stored Procedure
create or replace function public.process_order_refund(
  requested_order uuid,
  requested_amount_paise integer,
  requested_reason text,
  requested_refund_id text,
  requested_admin uuid,
  should_restock boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  target_order record;
  already_refunded integer;
  item record;
begin
  if not public.is_admin(requested_admin) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select * into target_order from public.orders where id = requested_order for update;
  if target_order is null then
    return jsonb_build_object('success', false, 'error', 'ORDER_NOT_FOUND');
  end if;

  if target_order.payment_status not in ('CAPTURED', 'PARTIALLY_REFUNDED') then
    return jsonb_build_object('success', false, 'error', 'ORDER_NOT_REFUNDABLE');
  end if;

  select coalesce(sum(amount_paise), 0) into already_refunded
  from public.refunds
  where order_id = requested_order and status = 'PROCESSED';

  if (already_refunded + requested_amount_paise) > target_order.total_paise then
    return jsonb_build_object('success', false, 'error', 'REFUND_EXCEEDS_CAPTURED_AMOUNT', 'max_allowed', target_order.total_paise - already_refunded);
  end if;

  insert into public.refunds(order_id, razorpay_refund_id, amount_paise, reason, status, restocked, admin_user_id)
  values (requested_order, requested_refund_id, requested_amount_paise, requested_reason, 'PROCESSED', should_restock, requested_admin);

  -- Restock if requested
  if should_restock then
    for item in (select product_id, size, quantity from public.order_items where order_id = requested_order) loop
      update public.product_sizes
      set stock_quantity = stock_quantity + item.quantity
      where product_id = item.product_id and size = item.size;

      insert into public.inventory_adjustments(product_id, size, delta, stock_before, stock_after, reason, admin_user_id)
      values (
        item.product_id, item.size, item.quantity,
        (select stock_quantity - item.quantity from public.product_sizes where product_id = item.product_id and size = item.size),
        (select stock_quantity from public.product_sizes where product_id = item.product_id and size = item.size),
        'REFUND_RESTOCK: ' || requested_order, requested_admin
      );
    end loop;
  end if;

  -- Update order payment status
  if (already_refunded + requested_amount_paise) = target_order.total_paise then
    update public.orders set payment_status = 'REFUNDED', status = 'REFUNDED' where id = requested_order;
  else
    update public.orders set payment_status = 'PARTIALLY_REFUNDED' where id = requested_order;
  end if;

  insert into public.order_status_history(order_id, from_status, to_status, admin_user_id)
  values (requested_order, target_order.status, case when (already_refunded + requested_amount_paise) = target_order.total_paise then 'REFUNDED'::public.order_status else target_order.status end, requested_admin);

  insert into public.audit_logs(admin_user_id, action, entity, entity_id, metadata)
  values (requested_admin, 'ORDER_REFUNDED', 'orders', requested_order::text, jsonb_build_object('amount_paise', requested_amount_paise, 'refund_id', requested_refund_id, 'restocked', should_restock));

  return jsonb_build_object('success', true, 'total_refunded', already_refunded + requested_amount_paise);
end;
$$;

-- 9. Row Level Security for New Tables
alter table public.webhook_events enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;
alter table public.shipments enable row level security;

create policy "admins can read webhook events" on public.webhook_events for select using (public.is_admin());
create policy "admins can read payments" on public.payments for select using (public.is_admin());
create policy "customers can read their own payments" on public.payments for select using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy "admins can read refunds" on public.refunds for select using (public.is_admin());
create policy "customers can read their own refunds" on public.refunds for select using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy "admins can read shipments" on public.shipments for select using (public.is_admin());
create policy "customers can read their own shipments" on public.shipments for select using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

-- Restrict privileged execution
revoke execute on function public.process_order_refund(uuid, integer, text, text, uuid, boolean) from public, anon, authenticated;
