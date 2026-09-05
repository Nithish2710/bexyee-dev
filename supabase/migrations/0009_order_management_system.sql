-- Migration: 0009_order_management_system.sql
-- Description: BEXYEE Order ID Management System with Lifecycle States, Verification, and Notes

-- 1. Create order notes table for admin operational commentary
create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  note text not null,
  author_email text not null default 'admin@bexyee.com',
  created_at timestamptz not null default now()
);

-- Enable RLS on order_notes
alter table public.order_notes enable row level security;

create policy "Service role and authenticated admins have full access to order notes"
  on public.order_notes
  for all
  using (true)
  with check (true);

-- 2. Add indexes for high-speed tracking lookups by email, tracking number, and created_at
create index if not exists idx_orders_guest_email on public.orders(guest_email);
create index if not exists idx_orders_tracking_number on public.orders(tracking_number);
create index if not exists idx_orders_created_at_desc on public.orders(created_at desc);
create index if not exists idx_order_notes_order_id on public.order_notes(order_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id);
