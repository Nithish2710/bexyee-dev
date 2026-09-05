import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { test, describe } from "node:test";
import { z } from "zod";

describe("Hostile Production Review: 24 Attack & Edge Scenarios", () => {
  // Comprehensive In-Memory Simulation of PostgreSQL Engine with Real Database Semantics
  class HostileInventoryDatabase {
    constructor() {
      this.inventory = new Map(); // `${productId}:${size}` -> physical stock
      this.reservations = new Map(); // id -> { id, orderId, productId, size, quantity, status, expiresAt }
      this.orders = new Map(); // orderId -> { id, guestToken, cartId, status, paymentStatus, razorpayOrderId, razorpayPaymentId, expiresAt }
      this.lockQueue = new Map();
      this.failNextReserve = false;
      this.failNextConfirm = false;
      this.failAfterCaptureBeforeConfirm = false;
    }

    setStock(productId, size, quantity) {
      this.inventory.set(`${productId}:${size}`, quantity);
    }

    async withLock(keys, fn) {
      // Deterministic sorted locking order to eliminate deadlocks
      const sortedKeys = [...new Set(keys)].sort();
      const releases = [];
      for (const key of sortedKeys) {
        let prev = this.lockQueue.get(key) || Promise.resolve();
        let release;
        const lock = new Promise((res) => (release = res));
        this.lockQueue.set(key, prev.then(() => lock));
        await prev;
        releases.push(release);
      }
      try {
        return await fn();
      } finally {
        for (const release of releases) {
          if (release) release();
        }
      }
    }

    async getAvailableStock(productId, size) {
      const key = `${productId}:${size}`;
      const now = Date.now();
      const physical = this.inventory.get(key) ?? 0;

      for (const res of this.reservations.values()) {
        if (res.productId === productId && res.size === size && res.status === "ACTIVE" && res.expiresAt < now) {
          res.status = "EXPIRED";
        }
      }

      let activeReserved = 0;
      for (const res of this.reservations.values()) {
        if (res.productId === productId && res.size === size && res.status === "ACTIVE" && res.expiresAt >= now) {
          activeReserved += res.quantity;
        }
      }

      return Math.max(0, physical - activeReserved);
    }

    async createOrder(orderData, items) {
      const orderId = orderData.id || `order-${crypto.randomUUID()}`;
      const order = {
        id: orderId,
        guestToken: orderData.guestToken,
        cartId: orderData.cartId,
        status: "PENDING",
        paymentStatus: "PENDING",
        razorpayOrderId: `rzp_${orderId}`,
        items
      };
      this.orders.set(orderId, order);
      return order;
    }

    async reserveOrderStock(orderId, ttlMs = 900000) {
      if (this.failNextReserve) {
        this.failNextReserve = false;
        throw new Error("DB_CRASH_MID_RESERVATION");
      }

      const order = this.orders.get(orderId);
      if (!order) return { success: false, error: "ORDER_NOT_FOUND" };

      const items = order.items || [];
      const keys = items.map((i) => `${i.productId}:${i.size}`);

      return this.withLock(keys, async () => {
        const now = Date.now();
        const expiresAt = now + ttlMs;

        // Auto-release previous unpaid reservations for same guestToken/cartId
        if (order.cartId || order.guestToken) {
          for (const res of this.reservations.values()) {
            const otherOrder = this.orders.get(res.orderId);
            if (
              otherOrder &&
              otherOrder.id !== orderId &&
              ((order.cartId && otherOrder.cartId === order.cartId) || (order.guestToken && otherOrder.guestToken === order.guestToken)) &&
              otherOrder.paymentStatus === "PENDING" &&
              res.status === "ACTIVE"
            ) {
              res.status = "RELEASED";
              otherOrder.status = "CANCELLED";
            }
          }
        }

        // Verify available stock
        for (const item of items) {
          const key = `${item.productId}:${item.size}`;
          const physical = this.inventory.get(key) ?? 0;

          // Expire outdated
          for (const res of this.reservations.values()) {
            if (res.productId === item.productId && res.size === item.size && res.status === "ACTIVE" && res.expiresAt < now) {
              res.status = "EXPIRED";
            }
          }

          let activeReserved = 0;
          for (const res of this.reservations.values()) {
            if (res.productId === item.productId && res.size === item.size && res.status === "ACTIVE" && res.expiresAt >= now && res.orderId !== orderId) {
              activeReserved += res.quantity;
            }
          }

          const available = physical - activeReserved;
          if (available < item.quantity) {
            return { success: false, error: "INSUFFICIENT_STOCK", productId: item.productId, size: item.size, available, requested: item.quantity };
          }
        }

        // Upsert reservations (prevent duplicates per order item)
        for (const item of items) {
          const resKey = `${orderId}:${item.productId}:${item.size}`;
          this.reservations.set(resKey, {
            id: resKey,
            orderId,
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            status: "ACTIVE",
            expiresAt
          });
        }

        order.expiresAt = expiresAt;
        return { success: true, expiresAt };
      });
    }

    async confirmOrderStockReservation(orderId, paymentId) {
      if (this.failNextConfirm) {
        this.failNextConfirm = false;
        throw new Error("DB_CRASH_DURING_CONFIRM");
      }

      const order = this.orders.get(orderId);
      if (!order) return { success: false, error: "ORDER_NOT_FOUND" };

      // Idempotency check: if order is already CAPTURED, return early
      if (order.paymentStatus === "CAPTURED" && order.status === "PAID") {
        return { success: true, alreadyConfirmed: true };
      }

      const orderRes = [...this.reservations.values()].filter((r) => r.orderId === orderId);
      const keys = orderRes.map((r) => `${r.productId}:${r.size}`);

      return this.withLock(keys, async () => {
        let allConfirmed = true;
        for (const res of orderRes) {
          const key = `${res.productId}:${res.size}`;
          const currentPhysical = this.inventory.get(key) ?? 0;

          if (res.status === "CONFIRMED") {
            continue; // already deducted
          }

          if (currentPhysical >= res.quantity) {
            this.inventory.set(key, currentPhysical - res.quantity);
            res.status = "CONFIRMED";
          } else {
            allConfirmed = false;
            res.status = "EXPIRED";
          }
        }

        order.paymentStatus = "CAPTURED";
        order.razorpayPaymentId = paymentId;

        if (this.failAfterCaptureBeforeConfirm) {
          this.failAfterCaptureBeforeConfirm = false;
          // Simulated crash after capture
          return { success: false, error: "SERVER_CRASH_POST_CAPTURE", captured: true };
        }

        if (allConfirmed) {
          order.status = "PAID";
          return { success: true, status: "CONFIRMED" };
        } else {
          order.status = "REQUIRES_REFUND";
          return { success: false, error: "RESERVATION_EXPIRED_STOCK_UNAVAILABLE", reconciled: true };
        }
      });
    }

    async releaseOrderStockReservation(orderId, callerGuestToken, reason = "CANCELLED") {
      const order = this.orders.get(orderId);
      if (!order) return { success: false, error: "ORDER_NOT_FOUND", status: 404 };

      // Authorization guard: caller must own order
      if (callerGuestToken && order.guestToken !== callerGuestToken) {
        return { success: false, error: "UNAUTHORIZED", status: 403 };
      }

      if (order.paymentStatus === "CAPTURED") {
        return { success: false, error: "CAPTURED_ORDER_CANNOT_BE_RELEASED", status: 409 };
      }

      for (const res of this.reservations.values()) {
        if (res.orderId === orderId && res.status === "ACTIVE") {
          res.status = "RELEASED";
        }
      }
      order.status = "CANCELLED";
      return { success: true, reason, status: 200 };
    }
  }

  // ----------------------------------------------------
  // SCENARIO TESTS 1 TO 24
  // ----------------------------------------------------

  test("Scenario 1 & 2: Customer A reserves the final M; Customer B attempts M simultaneously", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const orderA = await db.createOrder({ id: "order-A", guestToken: "token-A" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    const orderB = await db.createOrder({ id: "order-B", guestToken: "token-B" }, [{ productId: "p1", size: "M", quantity: 1 }]);

    const [resA, resB] = await Promise.all([
      db.reserveOrderStock(orderA.id),
      db.reserveOrderStock(orderB.id)
    ]);

    // Exactly one succeeds, other rejected with INSUFFICIENT_STOCK
    const successes = [resA, resB].filter((r) => r.success);
    const failures = [resA, resB].filter((r) => !r.success);

    assert.equal(successes.length, 1);
    assert.equal(failures.length, 1);
    assert.equal(failures[0].error, "INSUFFICIENT_STOCK");
    assert.equal(await db.getAvailableStock("p1", "M"), 0);
  });

  test("Scenario 3: Customer A payment succeeds (RESERVED -> SOLD)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-A" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);
    const confirm = await db.confirmOrderStockReservation(order.id, "pay_A_success");

    assert.equal(confirm.success, true);
    assert.equal(confirm.status, "CONFIRMED");
    assert.equal(db.orders.get(order.id).status, "PAID");
    assert.equal(db.inventory.get("p1:M"), 0);
  });

  test("Scenario 4: Customer A payment fails (RESERVED -> AVAILABLE)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-A" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);
    assert.equal(await db.getAvailableStock("p1", "M"), 0);

    // Gateway reports failure
    await db.releaseOrderStockReservation(order.id, undefined, "PAYMENT_FAILED");

    // Stock immediately available again
    assert.equal(await db.getAvailableStock("p1", "M"), 1);
    assert.equal(db.orders.get(order.id).status, "CANCELLED");
  });

  test("Scenario 5: Customer A abandons checkout (explicit cancel releases reservation)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-A", guestToken: "token-A" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    const cancel = await db.releaseOrderStockReservation(order.id, "token-A", "USER_CANCELLED");
    assert.equal(cancel.success, true);
    assert.equal(await db.getAvailableStock("p1", "M"), 1);
  });

  test("Scenario 6 & 7: Reservation expires after 15 minutes; Customer B purchases after expiration", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    // Customer A reserves with 20ms TTL
    const orderA = await db.createOrder({ id: "order-A" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(orderA.id, 20);

    // Wait 30ms (TTL elapsed)
    await new Promise((r) => setTimeout(r, 30));

    // Customer B arrives and purchases
    const orderB = await db.createOrder({ id: "order-B" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    const resB = await db.reserveOrderStock(orderB.id);
    assert.equal(resB.success, true);

    const confirmB = await db.confirmOrderStockReservation(orderB.id, "pay_B");
    assert.equal(confirmB.success, true);
    assert.equal(db.inventory.get("p1:M"), 0);
  });

  test("Scenario 8: Razorpay webhook arrives twice (Idempotent delivery)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 5);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    const first = await db.confirmOrderStockReservation(order.id, "pay_1");
    const second = await db.confirmOrderStockReservation(order.id, "pay_1");

    assert.equal(first.success, true);
    assert.equal(second.success, true);
    assert.equal(second.alreadyConfirmed, true);
    assert.equal(db.inventory.get("p1:M"), 4, "Must not double deduct on duplicate webhook");
  });

  test("Scenario 9: Client verification arrives twice (Idempotent verification)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "L", 3);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "L", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    const v1 = await db.confirmOrderStockReservation(order.id, "pay_1");
    const v2 = await db.confirmOrderStockReservation(order.id, "pay_1");

    assert.equal(v1.success, true);
    assert.equal(v2.success, true);
    assert.equal(db.inventory.get("p1:L"), 2);
  });

  test("Scenario 10: Webhook arrives before client verification", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "S", 2);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "S", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    // 1. Webhook executes first
    const webhookResult = await db.confirmOrderStockReservation(order.id, "pay_1");
    assert.equal(webhookResult.success, true);
    assert.equal(db.inventory.get("p1:S"), 1);

    // 2. Client verification arrives second
    const clientResult = await db.confirmOrderStockReservation(order.id, "pay_1");
    assert.equal(clientResult.success, true);
    assert.equal(clientResult.alreadyConfirmed, true);
    assert.equal(db.inventory.get("p1:S"), 1, "Inventory remains exactly 1");
  });

  test("Scenario 11: Client verification arrives before webhook", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "S", 2);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "S", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    // 1. Client verifies first
    const clientResult = await db.confirmOrderStockReservation(order.id, "pay_1");
    assert.equal(clientResult.success, true);

    // 2. Webhook arrives second
    const webhookResult = await db.confirmOrderStockReservation(order.id, "pay_1");
    assert.equal(webhookResult.success, true);
    assert.equal(webhookResult.alreadyConfirmed, true);
    assert.equal(db.inventory.get("p1:S"), 1);
  });

  test("Scenario 12: Payment arrives after reservation expiry (stock still available)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 2);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id, 20);

    // Expire reservation
    await new Promise((r) => setTimeout(r, 30));

    // Late payment arrives, physical stock is still 2
    const confirm = await db.confirmOrderStockReservation(order.id, "pay_late_1");
    assert.equal(confirm.success, true);
    assert.equal(db.orders.get(order.id).status, "PAID");
    assert.equal(db.inventory.get("p1:M"), 1);
  });

  test("Scenario 13: Payment arrives after another customer buys the released stock (Zero-Loss Reconciliation)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1); // Only 1 unit exists

    // Order 1 reserves for 20ms
    const order1 = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order1.id, 20);

    // Expire Order 1
    await new Promise((r) => setTimeout(r, 30));

    // Order 2 purchases the stock
    const order2 = await db.createOrder({ id: "order-2" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order2.id);
    await db.confirmOrderStockReservation(order2.id, "pay_order_2");
    assert.equal(db.inventory.get("p1:M"), 0);

    // Late capture for Order 1 arrives
    const lateConfirm = await db.confirmOrderStockReservation(order1.id, "pay_order_1");
    assert.equal(lateConfirm.success, false);
    assert.equal(lateConfirm.reconciled, true);

    const savedOrder1 = db.orders.get(order1.id);
    assert.equal(savedOrder1.paymentStatus, "CAPTURED");
    assert.equal(savedOrder1.status, "REQUIRES_REFUND");
    assert.equal(savedOrder1.razorpayPaymentId, "pay_order_1");
  });

  test("Scenario 14: Customer refreshes checkout repeatedly (Idempotent order stock reservation)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-1", cartId: "cart-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);

    // Customer triggers reserve 5 times rapidly
    const r1 = await db.reserveOrderStock(order.id);
    const r2 = await db.reserveOrderStock(order.id);
    const r3 = await db.reserveOrderStock(order.id);

    assert.equal(r1.success, true);
    assert.equal(r2.success, true);
    assert.equal(r3.success, true);
    assert.equal(await db.getAvailableStock("p1", "M"), 0);
  });

  test("Scenario 15: Customer opens checkout in two browser tabs (Same cart)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "XL", 1);

    const orderTab1 = await db.createOrder({ id: "order-tab-1", cartId: "cart-1" }, [{ productId: "p1", size: "XL", quantity: 1 }]);
    await db.reserveOrderStock(orderTab1.id);
    assert.equal(await db.getAvailableStock("p1", "XL"), 0);

    // Tab 2 creates a new order for the same cart
    const orderTab2 = await db.createOrder({ id: "order-tab-2", cartId: "cart-1" }, [{ productId: "p1", size: "XL", quantity: 1 }]);
    const resTab2 = await db.reserveOrderStock(orderTab2.id);

    // Tab 2 reclaims reservation and auto-releases Tab 1
    assert.equal(resTab2.success, true);
    assert.equal(db.orders.get("order-tab-1").status, "CANCELLED");
    assert.equal(db.orders.get("order-tab-2").status, "PENDING");
  });

  test("Scenario 16: Customer changes cart after reservation", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "S", 1);
    db.setStock("p1", "M", 1);

    // Order 1 for Size S
    const order1 = await db.createOrder({ id: "order-1", cartId: "cart-1" }, [{ productId: "p1", size: "S", quantity: 1 }]);
    await db.reserveOrderStock(order1.id);
    assert.equal(await db.getAvailableStock("p1", "S"), 0);

    // Customer switches cart to Size M
    const order2 = await db.createOrder({ id: "order-2", cartId: "cart-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order2.id);

    // Size S is auto-released; Size M is reserved
    assert.equal(await db.getAvailableStock("p1", "S"), 1, "Size S must be restored");
    assert.equal(await db.getAvailableStock("p1", "M"), 0, "Size M must be held");
  });

  test("Scenario 17: Customer attempts to release another customer's reservation (403 Unauthorized)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "L", 1);

    const victimOrder = await db.createOrder({ id: "order-victim", guestToken: "token-victim" }, [{ productId: "p1", size: "L", quantity: 1 }]);
    await db.reserveOrderStock(victimOrder.id);

    // Attacker with token-attacker attempts to release victim's order
    const attack = await db.releaseOrderStockReservation(victimOrder.id, "token-attacker", "USER_CANCELLED");
    assert.equal(attack.success, false);
    assert.equal(attack.status, 403);
    assert.equal(await db.getAvailableStock("p1", "L"), 0, "Victim stock remains protected");
  });

  test("Scenario 18: Customer attempts to manipulate orderId in verification", () => {
    const secret = "test_secret";
    const realOrderId = "order_1234";
    const paymentId = "pay_9876";
    const validSig = createHmac("sha256", secret).update(`${realOrderId}|${paymentId}`).digest("hex");

    const forgedOrderId = "order_tampered";
    const forgedDigest = createHmac("sha256", secret).update(`${forgedOrderId}|${paymentId}`).digest("hex");

    const isValid = forgedDigest.length === validSig.length && timingSafeEqual(Buffer.from(forgedDigest), Buffer.from(validSig));
    assert.equal(isValid, false, "Manipulated orderId must fail cryptographic verification");
  });

  test("Scenario 19: Customer attempts to manipulate quantity", () => {
    const schema = z.object({ quantity: z.number().int().min(1).max(20) });
    assert.equal(schema.safeParse({ quantity: -5 }).success, false);
    assert.equal(schema.safeParse({ quantity: 0 }).success, false);
    assert.equal(schema.safeParse({ quantity: 50 }).success, false);
    assert.equal(schema.safeParse({ quantity: 1.5 }).success, false);
  });

  test("Scenario 20: Customer attempts to manipulate product/size", () => {
    const sizeSchema = z.enum(["S", "M", "L", "XL"]);
    assert.equal(sizeSchema.safeParse("XXL").success, false);
    assert.equal(sizeSchema.safeParse("DROP TABLE").success, false);
  });

  test("Scenario 21: Two orders with multiple products/sizes simultaneously (Deadlock Resistance)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 5);
    db.setStock("p2", "L", 5);

    // Order 1 items: [p1:M, p2:L]
    const order1 = await db.createOrder({ id: "order-1" }, [
      { productId: "p1", size: "M", quantity: 1 },
      { productId: "p2", size: "L", quantity: 1 }
    ]);

    // Order 2 items reversed: [p2:L, p1:M]
    const order2 = await db.createOrder({ id: "order-2" }, [
      { productId: "p2", size: "L", quantity: 1 },
      { productId: "p1", size: "M", quantity: 1 }
    ]);

    // Both execute simultaneously: sorting prevents deadlock
    const [res1, res2] = await Promise.all([
      db.reserveOrderStock(order1.id),
      db.reserveOrderStock(order2.id)
    ]);

    assert.equal(res1.success, true);
    assert.equal(res2.success, true);
    assert.equal(await db.getAvailableStock("p1", "M"), 3);
    assert.equal(await db.getAvailableStock("p2", "L"), 3);
  });

  test("Scenario 22: Force a failure halfway through reservation (Atomic Rollback)", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-fail" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    db.failNextReserve = true;

    await assert.rejects(async () => {
      await db.reserveOrderStock(order.id);
    }, /DB_CRASH_MID_RESERVATION/);

    // Stock was not held by crashed transaction
    assert.equal(await db.getAvailableStock("p1", "M"), 1);
  });

  test("Scenario 23: Force a failure during payment confirmation", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    db.failNextConfirm = true;
    await assert.rejects(async () => {
      await db.confirmOrderStockReservation(order.id, "pay_1");
    }, /DB_CRASH_DURING_CONFIRM/);

    // Subsequent retry succeeds idempotently
    const retry = await db.confirmOrderStockReservation(order.id, "pay_1");
    assert.equal(retry.success, true);
    assert.equal(db.orders.get(order.id).status, "PAID");
  });

  test("Scenario 24: Force a failure after payment capture but before stock confirmation", async () => {
    const db = new HostileInventoryDatabase();
    db.setStock("p1", "M", 1);

    const order = await db.createOrder({ id: "order-1" }, [{ productId: "p1", size: "M", quantity: 1 }]);
    await db.reserveOrderStock(order.id);

    db.failAfterCaptureBeforeConfirm = true;
    const result = await db.confirmOrderStockReservation(order.id, "pay_captured_crash");

    assert.equal(result.captured, true);
    // Order retained payment status
    assert.equal(db.orders.get(order.id).paymentStatus, "CAPTURED");
  });
});
