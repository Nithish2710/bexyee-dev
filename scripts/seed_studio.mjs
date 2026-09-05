import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const sb = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Seeding studio product...');
  // Ensure a studio campaign exists
  let campId = '00000000-0000-0000-0000-000000000002';
  const { data: existingCamp } = await sb.from('campaigns').select('id').eq('slug', 'studio-campaign').maybeSingle();
  if (!existingCamp) {
    const { data: c } = await sb.from('campaigns').insert({
      id: campId,
      slug: 'studio-campaign',
      city_name: '',
      campaign_title: 'STUDIO\nARCHIVE',
      background_image: '/assets/environments/bexyee-studio-neutral.svg',
      accent_color: '#E52B20',
      active: true,
    }).select('id').single();
    if (c) campId = c.id;
  } else {
    campId = existingCamp.id;
  }

  // Delete existing if any to re-create clean
  await sb.from('products').delete().eq('slug', 'studio-tee');

  const { data: prod, error } = await sb
    .from('products')
    .insert({
      campaign_id: campId,
      name: 'Studio Heavyweight Uniform',
      slug: 'studio-tee',
      sku: 'BEXYEE-STU-001',
      edition: 'ARCHIVE 001',
      collection: 'ARCHIVE CAPSULE',
      city_name: '',
      price_paise: 189900,
      description: 'Architectural 320 GSM loopknit cotton uniform in neutral obsidian studio environment.',
      fabric: '320 GSM SUPER LOOPKNIT',
      gsm: 320,
      fit: 'OVERSIZED',
      status: 'ACTIVE',
    })
    .select('*')
    .single();

  console.log('INSERT RESULT:', prod);
  console.log('INSERT ERROR:', error);

  if (prod) {
    await sb.from('product_sizes').insert([
      { product_id: prod.id, size: 'S', stock_quantity: 10 },
      { product_id: prod.id, size: 'M', stock_quantity: 15 },
      { product_id: prod.id, size: 'L', stock_quantity: 12 },
      { product_id: prod.id, size: 'XL', stock_quantity: 8 },
    ]);
    await sb.from('launches').insert({
      product_id: prod.id,
      name: 'Studio Launch',
      slug: 'studio-launch',
      status: 'LIVE',
      purchase_mode: 'BUY_NOW',
      utm_campaign: JSON.stringify({
        purchaseMode: 'BUY_NOW',
        backgroundType: 'DEFAULT_STUDIO',
        isPrebook: false,
      }),
    });
    await sb.from('product_assets').insert([
      {
        product_id: prod.id,
        slot: 'BACKGROUND_DESKTOP',
        url: '/assets/environments/bexyee-studio-neutral.svg',
        is_active: true,
        version: 1,
      },
      {
        product_id: prod.id,
        slot: 'BACKGROUND_TYPE',
        url: 'DEFAULT_STUDIO',
        is_active: true,
        version: 1,
      },
    ]);
    console.log('✓ Successfully seeded studio-tee with sizes, launch, and assets!');
  }
}

seed();
