import { getProductExperienceData } from '../src/lib/product-engine';

async function test() {
  const p1 = await getProductExperienceData('00000000-0000-0000-0000-000000000001', { allowDraft: true });
  console.log('UUID QUERY RESULT:', p1 ? p1.name : 'NULL');

  const p2 = await getProductExperienceData('bengaluru-tee', { allowDraft: true });
  console.log('SLUG QUERY RESULT:', p2 ? p2.name : 'NULL');
}

test();
