export type ErrorCategory =
  | "VALIDATION_ERROR"
  | "INVENTORY_ERROR"
  | "PAYMENT_ERROR"
  | "NETWORK_ERROR"
  | "PROVIDER_ERROR"
  | "AUTH_ERROR"
  | "INTERNAL_ERROR";

export type LogContext = {
  requestId?: string;
  route?: string;
  method?: string;
  durationMs?: number;
  status?: number;
  orderId?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  webhookId?: string;
  errorCode?: string;
  category?: ErrorCategory;
  [key: string]: unknown;
};

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "key",
  "razorpay_signature",
  "cvv",
  "cardNumber",
  "otp"
]);

function sanitize(obj: unknown, depth = 0): unknown {
  if (depth > 4 || obj == null) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitize(item, depth + 1));

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitize(value, depth + 1);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function logServerEvent(event: string, context: LogContext = {}) {
  const payload = {
    level: "info",
    event,
    timestamp: new Date().toISOString(),
    ...sanitize(context) as LogContext,
  };
  console.info(JSON.stringify(payload));
}

export function logServerError(event: string, error: unknown, context: LogContext = {}) {
  const payload = {
    level: "error",
    event,
    error: error instanceof Error ? error.message : "Unknown error",
    stack: process.env.NODE_ENV !== "production" && error instanceof Error ? error.stack : undefined,
    category: context.category ?? "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
    ...sanitize(context) as LogContext,
  };
  console.error(JSON.stringify(payload));
}
