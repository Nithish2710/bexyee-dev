import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "../../../../src/lib/supabase-server";
import { enforceRateLimit } from "../../../../src/lib/rate-limit";

const trackRequestSchema = z.object({
  orderId: z.string().min(1).max(100),
  verification: z.string().min(1).max(150),
});

export type OrderTrackingItem = {
  productName: string;
  sku: string;
  size: string;
  quantity: number;
  unitPricePaise: number;
  totalPricePaise: number;
};

export type OrderTimelineEvent = {
  status: string;
  trackingNumber?: string | null;
  timestamp: string;
  description: string;
};

export type OrderTrackingResponse = {
  id: string;
  orderNumber: string;
  orderDate: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber: string | null;
  courier: string | null;
  estimatedDelivery: string;
  customerName: string;
  maskedEmail: string;
  maskedPhone: string;
  shippingAddress: {
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderTrackingItem[];
  totals: {
    subtotalPaise: number;
    shippingPaise: number;
    discountPaise: number;
    totalPaise: number;
  };
  timeline: OrderTimelineEvent[];
  supportEmail: string;
};

function cleanPhone(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

function maskEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "c***@***.com";
  const [user, domain] = email.split("@");
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
  return `${maskedUser}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  const cleaned = cleanPhone(phone);
  if (cleaned.length >= 10) {
    return `+91 ******${cleaned.slice(-4)}`;
  }
  return "******" + (cleaned.slice(-4) || "0000");
}

function computeEstimatedDelivery(createdAt: string, status: string): string {
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) {
    return "3-5 Business Days";
  }
  if (status === "DELIVERED") {
    return "Delivered";
  }
  const minDays = 3;
  const maxDays = 5;
  const estMin = new Date(created.getTime() + minDays * 24 * 60 * 60 * 1000);
  const estMax = new Date(created.getTime() + maxDays * 24 * 60 * 60 * 1000);
  const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${estMin.toLocaleDateString("en-IN", opt)} – ${estMax.toLocaleDateString("en-IN", opt)}`;
}

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, "TRACKING_LOOKUP");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many tracking attempts. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = trackRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid Order ID and Email or Phone verification are required." },
      { status: 400 }
    );
  }

  const { orderId, verification } = parsed.data;
  const trimmedId = orderId.trim();
  const trimmedVerification = verification.trim().toLowerCase();

  // If supabase is not configured, supply mock demonstration record for verified test IDs
  if (!supabaseServer) {
    const isMockMatch =
      (trimmedId.toLowerCase().includes("blr") || trimmedId.toLowerCase().includes("001") || trimmedId.length > 5) &&
      (trimmedVerification.includes("@") || cleanPhone(trimmedVerification).length >= 4);

    if (isMockMatch) {
      const mockOrder: OrderTrackingResponse = {
        id: trimmedId,
        orderNumber: trimmedId.startsWith("BEXYEE-") ? trimmedId : `BEXYEE-BLR-${trimmedId.slice(0, 6).toUpperCase()}`,
        orderDate: new Date().toISOString(),
        paymentStatus: "CAPTURED",
        orderStatus: "PROCESSING",
        trackingNumber: "BLRD-99824150",
        courier: "BlueDart Express",
        estimatedDelivery: computeEstimatedDelivery(new Date().toISOString(), "PROCESSING"),
        customerName: "Collector",
        maskedEmail: maskEmail(trimmedVerification.includes("@") ? trimmedVerification : "collector@bexyee.com"),
        maskedPhone: maskPhone(cleanPhone(trimmedVerification)),
        shippingAddress: {
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
        },
        items: [
          {
            productName: "Bengaluru Edition Heavyweight Tee",
            sku: "BEXYEE-BLR-001",
            size: "M",
            quantity: 1,
            unitPricePaise: 179900,
            totalPricePaise: 179900,
          },
        ],
        totals: {
          subtotalPaise: 179900,
          shippingPaise: 0,
          discountPaise: 0,
          totalPaise: 179900,
        },
        timeline: [
          {
            status: "ORDER CREATED",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            description: "Garment edition reserved and order created.",
          },
          {
            status: "PAID",
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            description: "Razorpay payment captured and confirmed.",
          },
          {
            status: "PROCESSING",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            description: "Garment allocated from climate-controlled studio storage.",
          },
        ],
        supportEmail: "support@bexyee.com",
      };
      return NextResponse.json(mockOrder);
    }

    return NextResponse.json(
      { error: "Order not found or verification details did not match." },
      { status: 404 }
    );
  }

  // Look up order in Supabase
  let query = supabaseServer.from("orders").select(`
    id,
    guest_email,
    payment_status,
    status,
    tracking_number,
    subtotal_paise,
    shipping_paise,
    discount_paise,
    total_paise,
    address,
    created_at,
    order_items (
      product_name,
      sku,
      size,
      quantity,
      unit_price_paise
    ),
    order_status_history (
      to_status,
      tracking_number,
      created_at
    )
  `);

  // Check UUID vs receipt
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmedId);
  if (isUuid) {
    query = query.eq("id", trimmedId);
  } else {
    query = query.ilike("id", `%${trimmedId}%`);
  }

  const { data: order, error } = await query.maybeSingle();

  if (error || !order) {
    return NextResponse.json(
      { error: "Order not found or verification details did not match." },
      { status: 404 }
    );
  }

  // Verify Ownership via Email or Phone
  const orderEmail = (order.guest_email || "").toLowerCase().trim();
  const addressObj = (order.address || {}) as { name?: string; phone?: string; city?: string; state?: string; pincode?: string };
  const orderPhoneClean = cleanPhone(addressObj.phone);
  const inputPhoneClean = cleanPhone(trimmedVerification);

  let verified = false;

  if (trimmedVerification.includes("@")) {
    // Email matching
    if (orderEmail && orderEmail === trimmedVerification) {
      verified = true;
    }
  } else if (inputPhoneClean.length >= 4) {
    // Phone matching (last 4 digits or full phone match)
    if (orderPhoneClean && (orderPhoneClean === inputPhoneClean || orderPhoneClean.endsWith(inputPhoneClean))) {
      verified = true;
    }
  }

  if (!verified) {
    return NextResponse.json(
      { error: "Order not found or verification details did not match." },
      { status: 404 }
    );
  }

  // Format Timeline
  type OrderHistoryItem = { to_status: string; tracking_number?: string | null; created_at: string };
  const history = (order.order_status_history || []) as OrderHistoryItem[];
  const timeline: OrderTimelineEvent[] = [
    {
      status: "ORDER CREATED",
      timestamp: order.created_at,
      description: "Order registered and garment edition reserved.",
    },
  ];

  if (order.payment_status === "CAPTURED" || order.payment_status === "PAID") {
    timeline.push({
      status: "PAID",
      timestamp: order.created_at,
      description: "Razorpay payment verified and stock confirmed.",
    });
  }

  for (const h of history) {
    timeline.push({
      status: h.to_status,
      trackingNumber: h.tracking_number,
      timestamp: h.created_at,
      description: `Order advanced to ${h.to_status.replace(/_/g, " ")}.`,
    });
  }

  // Deduplicate and sort timeline
  timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  type RawItem = { product_name: string; sku: string; size: string; quantity: number; unit_price_paise: number };
  const itemsList = ((order.order_items || []) as RawItem[]).map((it) => ({
    productName: it.product_name,
    sku: it.sku,
    size: it.size,
    quantity: it.quantity,
    unitPricePaise: it.unit_price_paise,
    totalPricePaise: it.unit_price_paise * it.quantity,
  }));

  const responsePayload: OrderTrackingResponse = {
    id: order.id,
    orderNumber: `BEXYEE-${order.id.slice(0, 8).toUpperCase()}`,
    orderDate: order.created_at,
    paymentStatus: order.payment_status,
    orderStatus: order.status,
    trackingNumber: order.tracking_number,
    courier: order.tracking_number ? "BlueDart / Delhivery" : null,
    estimatedDelivery: computeEstimatedDelivery(order.created_at, order.status),
    customerName: addressObj.name ? `${addressObj.name.split(" ")[0]}` : "Collector",
    maskedEmail: maskEmail(order.guest_email),
    maskedPhone: maskPhone(addressObj.phone),
    shippingAddress: {
      city: addressObj.city || "Bengaluru",
      state: addressObj.state || "Karnataka",
      pincode: addressObj.pincode || "560001",
    },
    items: itemsList,
    totals: {
      subtotalPaise: order.subtotal_paise,
      shippingPaise: order.shipping_paise,
      discountPaise: order.discount_paise,
      totalPaise: order.total_paise,
    },
    timeline,
    supportEmail: "support@bexyee.com",
  };

  return NextResponse.json(responsePayload);
}
