import { supabaseServer } from "./supabase-server";
import { logServerError, logServerEvent } from "./logger";

export type AlertType =
  | "CHECKOUT_FAILURE_RATE"
  | "WEBHOOK_SIGNATURE_FAILURE"
  | "LAUNCH_DISCREPANCY"
  | "INVENTORY_DEPLETED"
  | "SYSTEM_ERROR";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertPayload = {
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  metadata?: Record<string, unknown>;
};

/**
 * Records and dispatches real-time operational alerts
 */
export async function dispatchAlert(payload: AlertPayload): Promise<boolean> {
  const db = supabaseServer;

  logServerEvent("operational_alert_triggered", {
    type: payload.alertType,
    severity: payload.severity,
    message: payload.message,
    metadata: payload.metadata,
  });

  if (!db) {
    return false;
  }

  try {
    const { error } = await db.from("alerts").insert({
      alert_type: payload.alertType,
      severity: payload.severity,
      message: payload.message,
      metadata: payload.metadata || {},
      dispatched: true,
      dispatched_at: new Date().toISOString(),
    });

    if (error) {
      logServerError("alert_insert_failed", error);
      return false;
    }

    // If external webhook or notification URL configured in env, trigger it asynchronously
    const alertWebhookUrl = process.env.OPS_ALERT_WEBHOOK_URL;
    if (alertWebhookUrl) {
      void fetch(alertWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "BEXYEE_OPS_MONITOR",
          timestamp: new Date().toISOString(),
          ...payload,
        }),
      }).catch((err) => logServerError("alert_webhook_dispatch_failed", err));
    }

    return true;
  } catch (err) {
    logServerError("alert_dispatch_error", err);
    return false;
  }
}
