type Bucket = { count: number; resetAt: number };
const inMemoryBuckets = new Map<string, Bucket>();

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export const ENDPOINT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  LOGIN: { limit: 5, windowMs: 60_000 },             // 5 per minute
  OTP: { limit: 3, windowMs: 300_000 },              // 3 per 5 minutes
  PASSWORD_RESET: { limit: 3, windowMs: 900_000 },   // 3 per 15 minutes
  CART_MUTATION: { limit: 60, windowMs: 60_000 },    // 60 per minute
  CHECKOUT_CREATE: { limit: 10, windowMs: 60_000 },  // 10 per minute
  PAYMENT_VERIFY: { limit: 20, windowMs: 60_000 },   // 20 per minute
  TRACKING_LOOKUP: { limit: 30, windowMs: 60_000 },  // 30 per minute
  ADMIN_API: { limit: 120, windowMs: 60_000 },       // 120 per minute
  WEBHOOK: { limit: 240, windowMs: 60_000 },         // 240 per minute
  ANALYTICS_INGEST: { limit: 180, windowMs: 60_000 } // 180 per minute
};

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = inMemoryBuckets.get(key);

  // Clean expired buckets periodically
  if (inMemoryBuckets.size > 10_000) {
    for (const [k, v] of inMemoryBuckets.entries()) {
      if (v.resetAt <= now) inMemoryBuckets.delete(k);
    }
  }

  if (!current || current.resetAt <= now) {
    inMemoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0, current: 1, limit };
  }

  current.count += 1;
  const allowed = current.count <= limit;
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));

  return { allowed, retryAfter, current: current.count, limit };
}

export function enforceRateLimit(request: Request, endpoint: keyof typeof ENDPOINT_RATE_LIMITS, customKey?: string) {
  const ip = getClientIp(request);
  const config = ENDPOINT_RATE_LIMITS[endpoint] ?? { limit: 60, windowMs: 60_000 };
  const key = customKey ? `${endpoint}:${customKey}` : `${endpoint}:${ip}`;
  return rateLimit(key, config.limit, config.windowMs);
}
