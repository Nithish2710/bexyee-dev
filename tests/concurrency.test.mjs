import assert from "node:assert/strict";
import { test, describe } from "node:test";

describe("Atomic Stock Reservation & Concurrency Engine", () => {
  // In-memory simulation of PostgreSQL transactional locking & stored procedures
  class InventoryDatabase {
    constructor() {
      this.inventory = new Map(); // key: `${productId}:${size}` -> physical stock
      this.reservations = new Map(); // id -> { id, orderId, productId, size, quantity, status, expiresAt }
      this.orders = new Map(); // orderId -> { id, status, paymentStatus, razorpayPaymentId, expiresAt }
      this.lockQueue = new Map(); // key -> Promise queue for row-level locking simulation
    }

    setStock(productId, size, quantity) {
      this.inventory.set(`${productId}:${size}`, quantity);
    }

    async withLock(keys, fn) {
      // Deterministic lock ordering to prevent deadlocks (order by key asc)
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

      // Clean up expired reservations
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

    async reserveOrderStock(orderId, items, ttlMs = 900000) {
      const keys = items.map((i) => `${i.productId}:${i.size}`);
      return this.withLock(keys, async () => {
        const now = Date.now();
        const expiresAt = now + ttlMs;

        // Verify all items have available stock
        for (const item of items) {
          const key = `${item.productId}:${item.size}`;
          const physical = this.inventory.get(key) ?? 0;

          // Lazily expire outdated reservations
          for (const res of this.reservations.values()) {
            if (res.productId === item.productId && res.size === item.size && res.status === "ACTIVE" && res.expiresAt < now) {
              res.status = "EXPIRED";
            }
          }

          let activeReserved = 0;
          for (const res of this.reservations.values()) {
            if (res.productId === item.productId && res.size === item.size && res.status === "ACTIVE" && res.expiresAt >= now) {
              activeReserved += res.quantity;
            }
          }

          const available = physical - activeReserved;
          if (available < item.quantity) {
            return { success: false, error: "INSUFFICIENT_STOCK", productId: item.productId, size: item.size, available, requested: item.quantity };
          }
        }

        // All items available -> create active reservations
        for (const item of items) {
          const resId = `res-${crypto.randomUUID()}`;
          this.reservations.set(resId, {
            id: resId,
            orderId,
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            status: "ACTIVE",
            expiresAt
          });
        }

        this.orders.set(orderId, { id: orderId, status: "PENDING", paymentStatus: "PENDING", expiresAt });
        return { success: true, expiresAt };
      });
    }

    async confirmOrderStockReservation(orderId, paymentId) {
      const orderRes = [...this.reservations.values()].filter((r) => r.orderId === orderId);
      const keys = orderRes.map((r) => `${r.productId}:${r.size}`);

      return this.withLock(keys, async () => {
        // Check idempotency
        const alreadyConfirmed = orderRes.length > 0 && orderRes.every((r) => r.status === "CONFIRMED");
        if (alreadyConfirmed) return { success: true, alreadyConfirmed: true };

        let allConfirmed = true;
        for (const res of orderRes) {
          const key = `${res.productId}:${res.size}`;
          const currentPhysical = this.inventory.get(key) ?? 0;

          if (currentPhysical >= res.quantity) {
            this.inventory.set(key, currentPhysical - res.quantity);
            res.status = "CONFIRMED";
          } else {
            allConfirmed = false;
            res.status = "EXPIRED";
          }
        }

        const order = this.orders.get(orderId) || { id: orderId };
        if (allConfirmed) {
          order.status = "PAID";
          order.paymentStatus = "CAPTURED";
          order.razorpayPaymentId = paymentId;
          this.orders.set(orderId, order);
          return { success: true, status: "CONFIRMED" };
        } else {
          // Zero data-loss reconciliation
          order.status = "REQUIRES_REFUND";
          order.paymentStatus = "CAPTURED";
          order.razorpayPaymentId = paymentId;
          this.orders.set(orderId, order);
          return { success: false, error: "RESERVATION_EXPIRED_STOCK_UNAVAILABLE", reconciled: true };
        }
      });
    }

    async releaseOrderStockReservation(orderId, reason = "CANCELLED") {
      for (const res of this.reservations.values()) {
        if (res.orderId === orderId && res.status === "ACTIVE") {
          res.status = "RELEASED";
        }
      }
      const order = this.orders.get(orderId);
      if (order && order.paymentStatus !== "CAPTURED") {
        order.status = "CANCELLED";
      }
      return { success: true, reason };
    }
  }

  // ----------------------------------------------------
  // TEST CASES
  // ----------------------------------------------------

  test("AVAILABLE -> RESERVED -> PAYMENT -> SOLD happy path", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "M", 10);

    // 1. Initial available stock = 10
    assert.equal(await db.getAvailableStock(prodId, "M"), 10);

    // 2. Reserve 2 units for Order 101
    const res = await db.reserveOrderStock("order-101", [{ productId: prodId, size: "M", quantity: 2 }]);
    assert.equal(res.success, true);
    assert.equal(await db.getAvailableStock(prodId, "M"), 8);

    // 3. Confirm payment for Order 101
    const confirm = await db.confirmOrderStockReservation("order-101", "pay_test_101");
    assert.equal(confirm.success, true);
    assert.equal(confirm.status, "CONFIRMED");

    // Physical stock is now 8, available is 8
    assert.equal(db.inventory.get(`${prodId}:M`), 8);
    assert.equal(await db.getAvailableStock(prodId, "M"), 8);

    const order = db.orders.get("order-101");
    assert.equal(order.status, "PAID");
    assert.equal(order.paymentStatus, "CAPTURED");
  });

  test("5 Concurrent checkouts competing for 1 available unit: exactly 1 succeeds", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "L", 1); // Only 1 unit in stock

    const attempts = [1, 2, 3, 4, 5].map((i) =>
      db.reserveOrderStock(`order-${i}`, [{ productId: prodId, size: "L", quantity: 1 }])
    );

    const results = await Promise.all(attempts);
    const succeeded = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    assert.equal(succeeded.length, 1, "Exactly 1 concurrent reservation must succeed");
    assert.equal(failed.length, 4, "Remaining 4 concurrent reservations must be rejected");
    assert.equal(await db.getAvailableStock(prodId, "L"), 0);
  });

  test("TTL Expiration: expired reservations automatically release inventory to new buyers", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "S", 1);

    // Order 1 reserves for 40ms TTL
    const res1 = await db.reserveOrderStock("order-1", [{ productId: prodId, size: "S", quantity: 1 }], 40);
    assert.equal(res1.success, true);
    assert.equal(await db.getAvailableStock(prodId, "S"), 0);

    // Immediate attempt by Order 2 should fail
    const res2 = await db.reserveOrderStock("order-2", [{ productId: prodId, size: "S", quantity: 1 }]);
    assert.equal(res2.success, false);

    // Wait for 60ms (TTL expires)
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Order 3 attempts checkout -> should succeed and claim expired unit
    const res3 = await db.reserveOrderStock("order-3", [{ productId: prodId, size: "S", quantity: 1 }]);
    assert.equal(res3.success, true, "Order 3 must claim expired reservation");
    assert.equal(await db.getAvailableStock(prodId, "S"), 0);
  });

  test("Payment Failure webhook immediately releases reservation back to pool", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "XL", 1);

    // Order 1 reserves stock
    await db.reserveOrderStock("order-1", [{ productId: prodId, size: "XL", quantity: 1 }]);
    assert.equal(await db.getAvailableStock(prodId, "XL"), 0);

    // Customer payment fails on gateway -> webhook calls release
    await db.releaseOrderStockReservation("order-1", "PAYMENT_FAILED");

    // Stock is immediately restored to available
    assert.equal(await db.getAvailableStock(prodId, "XL"), 1);

    // Order 2 can now reserve immediately
    const res2 = await db.reserveOrderStock("order-2", [{ productId: prodId, size: "XL", quantity: 1 }]);
    assert.equal(res2.success, true);
  });

  test("Zero-Loss Safety Reconciliation: Late payment after stock loss preserves payment and triggers refund workflow", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "M", 1);

    // 1. Order 1 reserves 1 unit with 30ms TTL
    await db.reserveOrderStock("order-1", [{ productId: prodId, size: "M", quantity: 1 }], 30);

    // 2. 40ms pass (Order 1 reservation expires)
    await new Promise((resolve) => setTimeout(resolve, 40));

    // 3. Order 2 arrives, reserves, and pays immediately (SOLD)
    await db.reserveOrderStock("order-2", [{ productId: prodId, size: "M", quantity: 1 }]);
    await db.confirmOrderStockReservation("order-2", "pay_order_2");
    assert.equal(db.inventory.get(`${prodId}:M`), 0); // Physical stock is 0

    // 4. Late payment capture arrives for Order 1 (e.g. slow bank webhook)
    const lateConfirm = await db.confirmOrderStockReservation("order-1", "pay_order_1_late");

    // Must NEVER crash or drop the payment details!
    assert.equal(lateConfirm.success, false);
    assert.equal(lateConfirm.reconciled, true);
    assert.equal(lateConfirm.error, "RESERVATION_EXPIRED_STOCK_UNAVAILABLE");

    // Verify order 1 is recorded as CAPTURED with REQUIRES_REFUND
    const order1 = db.orders.get("order-1");
    assert.equal(order1.paymentStatus, "CAPTURED", "Payment must be recorded as captured");
    assert.equal(order1.status, "REQUIRES_REFUND", "Status must be flagged for refund recovery");
    assert.equal(order1.razorpayPaymentId, "pay_order_1_late", "Razorpay payment ID must be retained");
  });

  test("Idempotent confirmation: duplicate verification calls do not deduct stock twice", async () => {
    const db = new InventoryDatabase();
    const prodId = "prod-1";
    db.setStock(prodId, "L", 5);

    await db.reserveOrderStock("order-1", [{ productId: prodId, size: "L", quantity: 2 }]);
    const firstConfirm = await db.confirmOrderStockReservation("order-1", "pay_1");
    assert.equal(firstConfirm.success, true);
    assert.equal(db.inventory.get(`${prodId}:L`), 3);

    // Duplicate webhook or duplicate verify call
    const secondConfirm = await db.confirmOrderStockReservation("order-1", "pay_1");
    assert.equal(secondConfirm.success, true);
    assert.equal(secondConfirm.alreadyConfirmed, true);
    assert.equal(db.inventory.get(`${prodId}:L`), 3, "Stock must NOT be deducted twice");
  });
});
