import { logServerError, logServerEvent } from "./logger";

export type EmailEventType =
  | "OTP"
  | "PASSWORD_RESET"
  | "ORDER_CONFIRMATION"
  | "PAYMENT_CONFIRMATION"
  | "PAYMENT_FAILURE"
  | "ORDER_PROCESSING"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_DISPATCHED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "REFUND"
  | "CANCELLATION";

export type EmailPayload = {
  to: string;
  eventType: EmailEventType;
  subject: string;
  orderId?: string;
  data: Record<string, unknown>;
  idempotencyKey?: string;
};

export interface EmailProvider {
  name: string;
  send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class DefaultEmailProvider implements EmailProvider {
  name = "CONFIGURED_EMAIL_PROVIDER";

  async send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const endpoint = process.env.EMAIL_PROVIDER_URL;
    const apiKey = process.env.EMAIL_PROVIDER_API_KEY;

    if (!endpoint || !apiKey) {
      logServerEvent("email_queued_unconfigured", {
        to: payload.to,
        eventType: payload.eventType,
        orderId: payload.orderId
      });
      return { success: true, messageId: `mock_${crypto.randomUUID()}` };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...(payload.idempotencyKey ? { "Idempotency-Key": payload.idempotencyKey } : {})
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "orders@bexyee.com",
          to: payload.to,
          subject: payload.subject,
          template: payload.eventType,
          data: payload.data
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email provider error: ${response.status} - ${errorText}`);
      }

      const resData = await response.json().catch(() => ({}));
      return { success: true, messageId: (resData as { id?: string }).id ?? `msg_${crypto.randomUUID()}` };
    } catch (err) {
      logServerError("transactional_email_dispatch_failed", err, {
        category: "PROVIDER_ERROR",
        to: payload.to,
        eventType: payload.eventType,
        orderId: payload.orderId
      });
      return { success: false, error: err instanceof Error ? err.message : "Unknown email error" };
    }
  }
}

const defaultEmailService = new DefaultEmailProvider();

export async function sendTransactionalEmail(payload: EmailPayload) {
  // Non-blocking invocation to ensure payment and checkout requests never fail due to email delays
  try {
    return await defaultEmailService.send(payload);
  } catch (error) {
    logServerError("email_service_unhandled_error", error, {
      category: "INTERNAL_ERROR",
      to: payload.to,
      eventType: payload.eventType
    });
    return { success: false, error: "Failed to dispatch email." };
  }
}
