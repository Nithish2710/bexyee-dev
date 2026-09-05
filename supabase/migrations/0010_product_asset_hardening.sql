-- Migration 0010: Product, Asset, and Inventory Control System Hardening
-- Extends existing commerce schema without modifying core reservation, payment, or order tables.

-- 1. Extend products table with operational and marketing metadata
alter table public.products add column if not exists city_name text not null default 'BENGALURU';
alter table public.products add column if not exists collection text not null default 'MONSOON 2026';
alter table public.products add column if not exists gst_rate numeric(4, 2) not null default 12.00 check (gst_rate >= 0);
alter table public.products add column if not exists care_instructions text;
alter table public.products add column if not exists artwork_url text;
alter table public.products add column if not exists seo_og_image text;

-- 2. Extend product_assets for checksums, original filenames, and storage paths
alter table public.product_assets add column if not exists storage_path text;
alter table public.product_assets add column if not exists original_filename text;
alter table public.product_assets add column if not exists checksum text;

-- 3. Extend campaign_assets for checksums, original filenames, and storage paths
alter table public.campaign_assets add column if not exists storage_path text;
alter table public.campaign_assets add column if not exists original_filename text;
alter table public.campaign_assets add column if not exists checksum text;
alter table public.campaign_assets add column if not exists version integer not null default 1;

-- 4. High-performance indexes for product search, filtering, and asset lookups
create index if not exists idx_products_city_status on public.products(city_name, status);
create index if not exists idx_products_collection on public.products(collection);
create index if not exists idx_products_created_desc on public.products(created_at desc);
create index if not exists idx_product_assets_slot_active on public.product_assets(product_id, slot, is_active);
create index if not exists idx_campaign_assets_slot_active on public.campaign_assets(campaign_id, slot, is_active);

-- 5. Inventory Bulk Adjustment Helper Function
create or replace function public.bulk_adjust_inventory(
  requested_adjustments jsonb, -- Array of { product_id, size, delta, reason }
  requested_admin uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  prod_id uuid;
  p_size text;
  p_delta integer;
  p_reason text;
  curr_stock integer;
  new_stock integer;
  results jsonb := '[]'::jsonb;
begin
  if not public.is_admin(requested_admin) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  for item in select * from jsonb_array_elements(requested_adjustments)
  loop
    prod_id := (item->>'product_id')::uuid;
    p_size := (item->>'size')::text;
    p_delta := (item->>'delta')::integer;
    p_reason := coalesce((item->>'reason')::text, 'Bulk adjustment via admin control center');

    if p_delta <> 0 then
      select stock_quantity into curr_stock 
      from public.product_sizes 
      where product_id = prod_id and size = p_size 
      for update;

      if curr_stock is not null then
        new_stock := curr_stock + p_delta;
        if new_stock < 0 then
          raise exception 'NEGATIVE_STOCK_FOR_PRODUCT_%_SIZE_%', prod_id, p_size;
        end if;

        update public.product_sizes 
        set stock_quantity = new_stock 
        where product_id = prod_id and size = p_size;

        insert into public.inventory_adjustments(
          product_id, size, delta, stock_before, stock_after, reason, admin_user_id
        ) values (
          prod_id, p_size, p_delta, curr_stock, new_stock, p_reason, requested_admin
        );

        results := results || jsonb_build_object(
          'product_id', prod_id,
          'size', p_size,
          'stock_before', curr_stock,
          'stock_after', new_stock
        );
      end if;
    end if;
  end loop;

  return results;
end;
$$;
