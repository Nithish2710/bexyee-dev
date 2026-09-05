type PurchaseEvent = { eventId: string; orderId: string; value: number; currency: string; email?: string };

export async function sendMetaPurchase(event: PurchaseEvent) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION ?? "v20.0";
  if (!pixelId || !accessToken) return;
  await fetch(`https://graph.facebook.com/${apiVersion}/${pixelId}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: [{ event_name: "Purchase", event_time: Math.floor(Date.now() / 1000), event_id: event.eventId, action_source: "website", user_data: event.email ? { em: [event.email] } : undefined, custom_data: { currency: event.currency, value: event.value, order_id: event.orderId } }], access_token: accessToken }) });
}
