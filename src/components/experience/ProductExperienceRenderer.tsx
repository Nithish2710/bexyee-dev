"use client";

import React from "react";
import type { UnifiedProduct } from "../../lib/product-engine";
import { ProductPageRenderer } from "./ProductPageRenderer";

/**
 * BEXYEE 2.1 Universal Product Renderer
 * Collapses the previous 5 distinct experience branches into a single high-performance
 * responsive renderer with per-product movable backgrounds and progressive 3D/photo presentation.
 */
export function ProductExperienceRenderer({ product }: { product: UnifiedProduct }) {
  return <ProductPageRenderer product={product} />;
}
