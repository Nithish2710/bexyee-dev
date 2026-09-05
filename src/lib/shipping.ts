export type ShippingStatus =
  | "PENDING"
  | "READY"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED"
  | "RETURNED";

export type ShippingAddress = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

export type ShipmentItem = {
  sku: string;
  productName: string;
  size: string;
  quantity: number;
  pricePaise: number;
};

export type ShipmentDetails = {
  provider: string;
  providerShipmentId: string;
  awb: string;
  courierName?: string;
  trackingUrl?: string;
  labelUrl?: string;
  status: ShippingStatus;
  estimatedDelivery?: string;
  shippingFeePaise: number;
};

export interface ShippingProvider {
  name: string;
  checkServiceability(pincode: string, country?: string): Promise<boolean>;
  quote(address: ShippingAddress, subtotalPaise: number): Promise<number>;
  createShipment(orderId: string, address: ShippingAddress, items: ShipmentItem[]): Promise<ShipmentDetails>;
  cancelShipment(awbOrShipmentId: string): Promise<boolean>;
  trackShipment(awb: string): Promise<{ status: ShippingStatus; trackingUrl?: string; history: Array<{ timestamp: string; location: string; activity: string }> }>;
}

export class DefaultDomesticShippingProvider implements ShippingProvider {
  name = "BEXYEE_STANDARD_LOGISTICS";

  async checkServiceability(pincode: string, country = "IN"): Promise<boolean> {
    if (country !== "IN" && country !== "India") return false;
    // Standard Indian 6-digit PIN code format
    return /^[1-9][0-9]{5}$/.test(pincode);
  }

  async quote(address: ShippingAddress, subtotalPaise: number): Promise<number> {
    const freeThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD_PAISE ?? 500000); // Free above ₹5,000
    if (subtotalPaise >= freeThreshold) return 0;
    return Number(process.env.DEFAULT_SHIPPING_PAISE ?? 6000); // Standard ₹60 flat rate
  }

  async createShipment(orderId: string, address: ShippingAddress, items: ShipmentItem[]): Promise<ShipmentDetails> {
    const isServiceable = await this.checkServiceability(address.pincode, address.country);
    if (!isServiceable) {
      throw new Error(`Pincode ${address.pincode} is not serviceable.`);
    }

    const shortId = orderId.slice(0, 8).toUpperCase();
    const awb = `BX${Date.now().toString().slice(-8)}${shortId.slice(0, 4)}`;

    return {
      provider: this.name,
      providerShipmentId: `shp_${crypto.randomUUID()}`,
      awb,
      courierName: "BEXYEE Express Carrier",
      trackingUrl: `/track?awb=${awb}`,
      status: "READY",
      shippingFeePaise: items.reduce((sum, i) => sum + i.pricePaise * i.quantity, 0) >= 500000 ? 0 : 6000,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async cancelShipment(_awbOrShipmentId: string): Promise<boolean> {
    void _awbOrShipmentId;
    return true;
  }

  async trackShipment(awb: string) {
    return {
      status: "IN_TRANSIT" as ShippingStatus,
      trackingUrl: `/track?awb=${awb}`,
      history: [
        { timestamp: new Date().toISOString(), location: "Bengaluru Hub", activity: "Manifested and Dispatched" }
      ]
    };
  }
}

export class ConfiguredShippingProvider implements ShippingProvider {
  private fallback = new DefaultDomesticShippingProvider();
  name = process.env.SHIPPING_PROVIDER_NAME ?? "CONFIGURED";

  async checkServiceability(pincode: string, country = "IN"): Promise<boolean> {
    const endpoint = process.env.SHIPPING_SERVICEABILITY_URL;
    if (!endpoint) return this.fallback.checkServiceability(pincode, country);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.SHIPPING_API_KEY ? { Authorization: `Bearer ${process.env.SHIPPING_API_KEY}` } : {})
        },
        body: JSON.stringify({ pincode, country })
      });
      if (!response.ok) return this.fallback.checkServiceability(pincode, country);
      const data = await response.json();
      return data.serviceable === true;
    } catch {
      return this.fallback.checkServiceability(pincode, country);
    }
  }

  async quote(address: ShippingAddress, subtotalPaise: number): Promise<number> {
    const freeThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD_PAISE ?? 500000);
    if (subtotalPaise >= freeThreshold) return 0;

    const endpoint = process.env.SHIPPING_QUOTE_URL;
    if (!endpoint) return this.fallback.quote(address, subtotalPaise);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.SHIPPING_API_KEY ? { Authorization: `Bearer ${process.env.SHIPPING_API_KEY}` } : {})
        },
        body: JSON.stringify({ address, subtotalPaise })
      });
      if (!response.ok) return this.fallback.quote(address, subtotalPaise);
      const data = await response.json();
      return Number(data.shippingPaise ?? 6000);
    } catch {
      return this.fallback.quote(address, subtotalPaise);
    }
  }

  async createShipment(orderId: string, address: ShippingAddress, items: ShipmentItem[]): Promise<ShipmentDetails> {
    const endpoint = process.env.SHIPPING_CREATE_URL;
    if (!endpoint) return this.fallback.createShipment(orderId, address, items);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SHIPPING_API_KEY ? { Authorization: `Bearer ${process.env.SHIPPING_API_KEY}` } : {})
      },
      body: JSON.stringify({ orderId, address, items })
    });

    if (!response.ok) throw new Error("Shipping provider failed to generate shipment.");
    return await response.json() as ShipmentDetails;
  }

  async cancelShipment(awbOrShipmentId: string): Promise<boolean> {
    return this.fallback.cancelShipment(awbOrShipmentId);
  }

  async trackShipment(awb: string) {
    return this.fallback.trackShipment(awb);
  }
}
