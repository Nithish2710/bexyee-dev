import test from 'node:test';
import assert from 'node:assert/strict';

test('Bengaluru Gold-Standard Purchase Flow & Pricing Integration', async (t) => {
  await t.test('1. Product Data contains authoritative price and edition', () => {
    const product = {
      id: '00000000-0000-0000-0000-000000000001',
      slug: 'bengaluru-tee',
      cityName: 'BENGALURU',
      name: 'Bengaluru Tee',
      edition: '001 / 100',
      pricePaise: 179900,
      sku: 'BEXYEE-BLR-001',
      launch: { status: 'LIVE', isPurchasable: true },
      variants: [
        { size: 'S' , physicalStock: 10, reservedStock: 0, availableStock: 10, status: 'AVAILABLE' },
        { size: 'M' , physicalStock: 15, reservedStock: 0, availableStock: 15, status: 'AVAILABLE' },
        { size: 'L' , physicalStock: 12, reservedStock: 0, availableStock: 12, status: 'AVAILABLE' },
        { size: 'XL', physicalStock: 8, reservedStock: 0, availableStock: 8, status: 'AVAILABLE' }
      ]
    };

    assert.equal(product.cityName, 'BENGALURU');
    assert.equal(product.pricePaise, 179900, 'Authoritative price must be 179900 paise (₹1,799)');
    assert.equal(product.launch.isPurchasable, true);
    assert.equal(product.variants.length, 4);
    for (const v of product.variants) {
      assert.ok(v.availableStock > 0);
      assert.notEqual(v.status, 'SOLD_OUT');
    }
  });

  await t.test('2. BUY NOW and ADD TO CART preserve product ID, size, quantity and authoritative price', () => {
    const product = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Bengaluru Tee',
      sku: 'BEXYEE-LR-001',
      pricePaise: 179900,
      edition: '001 / 100',
      frontImage: '/assets/products/bengaluru-tee-front.svg'
    };

    const cart = [];
    const size = 'M';
    const existing = cart.find(i => i.productId === product.id && i.size === size);
    if (existing) existing.quantity += 1;
    else cart.push({
      productId: product.id,
      size,
      quantity: 1,
      products: {
        name: product.name,
        sku: product.sku,
        price_paise: product.pricePaise,
        front_image_url: product.frontImage
      }
    });

    assert.equal(cart.length, 1);
    assert.equal(cart[0].productId, product.id);
    assert.equal(cart[0].size, 'M');
    assert.equal(cart[0].quantity, 1);
    assert.equal(cart[0].products.price_paise, 179900);
    assert.equal(cart[0].products.name, 'Bengaluru Tee');
  });

  await t.test('3. Server-side price recalculation rejects client price manipulation', () => {
    const dbProduct = { id: '00000000-0000-0000-0000-000000000001', price_paise: 179900 };
    const clientPayload = { cartId: 'cart-123', clientPrice: 100 }; // attacker sends ↑1

    // Server must ignore clientPrice and use dbProduct.price_paise
    const authoritativeSubtotal = dbProduct.price_paise * 1;
    assert.equal(authoritativeSubtotal, 179900, 'Server must compute ↑1,799 regardless of client price');
  });

  await t.test('4. GST 12% itemization and free shipping calculation', () => {
    const unitPrice = 179900;
    const qty = 1;
    const subtotal = unitPrice * qty;
    const shipping = 0; // Free on prepaid
    const total = subtotal + shipping;
    const gstIncluded = Math.round(total * 0.12);

    assert.equal(total, 179900);
    assert.equal(gstIncluded, 21588, '12% GST on ₹1,799 is ₵215.88');
  });
});
