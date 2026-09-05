"use client";

import type { UnifiedProduct } from "../../lib/product-engine";
import { ProductPageRenderer } from "./ProductPageRenderer";

/**
 * BEXYEE 2.1: Collapsed into Universal ProductPageRenderer (Section 2)
 */
export function EditorialProductExperience({ product }: { product: UnifiedProduct }) {
  return <ProductPageRenderer product={product} />;
}
