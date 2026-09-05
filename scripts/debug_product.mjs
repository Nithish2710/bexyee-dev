import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sb = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data: prods, error } = await sb.from('products').select('*, product_sizes(*), launches(*)');
  console.log('PRODUCTS IN DB:', JSON.stringify(prods, null, 2));
  console.log('ERROR:', error);
}

check();
