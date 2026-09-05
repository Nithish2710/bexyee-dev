-- Keep all privileged stock mutations behind server-side service-role calls.
revoke execute on function public.reserve_stock(uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.adjust_inventory(uuid, text, integer, text, uuid) from public, anon, authenticated;
revoke execute on function public.record_admin_audit(uuid, text, text, text, jsonb) from public, anon, authenticated;

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.email_events enable row level security;

create policy "customers can read their own carts" on public.carts for select using (customer_id = auth.uid());
create policy "customers can read their own cart items" on public.cart_items for select using (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()));
create policy "customers can read their own orders" on public.orders for select using (customer_id = auth.uid());
create policy "customers can read their own order items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

create or replace function public.prevent_payment_status_change()
returns trigger language plpgsql as $$
begin
  if new.payment_status is distinct from old.payment_status and (coalesce(auth.jwt() ->> 'role', '') <> 'service_role') and not public.is_admin() then
    raise exception 'PAYMENT_STATUS_SERVER_ONLY';
  end if;
  return new;
end;
$$;
create trigger orders_payment_status_guard before update on public.orders for each row execute function public.prevent_payment_status_change();
