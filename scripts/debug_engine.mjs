import { getProductExperienceData } from '../src/lib/product-engine';

async function test() {
  const p = await getProductExperienceData('studio-tee');
  console.log('PRODUCT RESULT:', JSON.stringify(p, null, 2));
}

test();
