import { z } from "zod";

export const sizes = ["S", "M", "L", "XL"] as const;
export const productStatus = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export const orderStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "REQUIRES_REFUND"] as const;
export const reservationStatuses = ["ACTIVE", "CONFIRMED", "RELEASED", "EXPIRED"] as const;
export const RESERVATION_TTL_SECONDS = 900;

export const sizeSchema = z.enum(sizes);
export const cartItemSchema = z.object({ productId: z.string().min(1).max(128), size: sizeSchema, quantity: z.number().int().min(1).max(20) });
export const checkoutSchema = z.object({ cartId: z.string().min(1).max(128), guestEmail: z.string().email().optional(), address: z.record(z.string(), z.string()).optional(), attribution: z.record(z.string(), z.string()).default({}) });
export const eventSchema = z.object({ eventName: z.string().min(1).max(80), eventId: z.string().min(8).max(120), sessionId: z.string().max(120).optional(), productId: z.string().min(1).max(128).optional(), properties: z.record(z.string(), z.unknown()).default({}), attribution: z.record(z.string(), z.string()).default({}) });

export type Size = z.infer<typeof sizeSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ReservationStatus = (typeof reservationStatuses)[number];

export type ProductConfig = {
  id: string;
  campaignId: string;
  slug: string;
  name: string;
  city: string;
  edition: string;
  pricePaise: number;
  compareAtPricePaise: number | null;
  description: string;
  fabric: string;
  gsm: number | null;
  fit: string;
  availableSizes: Size[];
  stock: Record<Size, number>;
  modelUrl: string | null;
  productImages: string[];
  sku: string;
  status: (typeof productStatus)[number];
};

export function calculateTotals(items: Array<{ unitPricePaise: number; quantity: number }>, shippingPaise = 0, discountPaise = 0) {
  const subtotalPaise = items.reduce((total, item) => total + item.unitPricePaise * item.quantity, 0);
  return { subtotalPaise, shippingPaise, discountPaise, totalPaise: Math.max(0, subtotalPaise - discountPaise + shippingPaise) };
}

/**
 * Splits an inclusive-GST paise amount into base + GST components.
 * All values remain integers (paise).
 * @param inclusivePricePaise - Price already includes GST
 * @param gstPercent - GST rate (e.g. 12 for 12%)
 */
export function splitGst(inclusivePricePaise: number, gstPercent: number): {
  basePaise: number;
  gstPaise: number;
  gstPercent: number;
} {
  const divisor = 1 + gstPercent / 100;
  const basePaise = Math.round(inclusivePricePaise / divisor);
  const gstPaise = inclusivePricePaise - basePaise;
  return { basePaise, gstPaise, gstPercent };
}

/**
 * Formats paise to a locale-aware INR string (e.g. ₹1,799).
 */
export function formatPriceINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
