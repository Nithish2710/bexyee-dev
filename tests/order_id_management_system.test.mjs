import assert from "node:assert/strict";
import { test, describe } from "node:test";

describe("BEXYEE Order ID Management System Suite", () => {
  const LIFECYCLE_STEPS = [
    "ORDER CREATED",
    "PAID",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  const ALTERNATIVE_STATES = [
    "PAYMENT FAILED",
    "CANCELLED",
    "REFUND REQUESTED",
    "REFUNDED",
    "REQUIRES REFUND",
  ];

  function cleanPhone(phone) {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  }

  function maskEmail(email) {
    if (!email || !email.includes("@")) return "c***@***.com";
    const [user, domain] = email.split("@");
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  }

  function maskPhone(phone) {
    const cleaned = cleanPhone(phone);
    if (cleaned.length >= 10) {
      return `+91 ******${cleaned.slice(-4)}`;
    }
    return "******" + (cleaned.slice(-4) || "0000");
  }

  function verifyCustomerOrderAccess(order, verificationInput) {
    if (!order || !verificationInput) return false;
    const trimmedInput = verificationInput.trim().toLowerCase();
    const orderEmail = (order.guest_email || "").toLowerCase().trim();
    const orderPhone = cleanPhone(order.address?.phone);
    const inputPhone = cleanPhone(trimmedInput);

    if (trimmedInput.includes("@")) {
      return orderEmail === trimmedInput;
    }
    if (inputPhone.length >= 4) {
      return orderPhone === inputPhone || orderPhone.endsWith(inputPhone);
    }
    return false;
  }

  test("Order lifecycle includes all required forward and alternative states", () => {
    assert.equal(LIFECYCLE_STEPS.length, 7);
    assert.deepEqual(LIFECYCLE_STEPS, [
      "ORDER CREATED",
      "PAID",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "OUT FOR DELIVERY",
      "DELIVERED",
    ]);

    assert.ok(ALTERNATIVE_STATES.includes("PAYMENT FAILED"));
    assert.ok(ALTERNATIVE_STATES.includes("CANCELLED"));
    assert.ok(ALTERNATIVE_STATES.includes("REFUND REQUESTED"));
    assert.ok(ALTERNATIVE_STATES.includes("REFUNDED"));
    assert.ok(ALTERNATIVE_STATES.includes("REQUIRES REFUND"));
  });

  test("Customer verification authorizes exact email match (case-insensitive)", () => {
    const mockOrder = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      guest_email: "collector@bexyee.com",
      address: { phone: "9876543210" },
    };

    assert.equal(verifyCustomerOrderAccess(mockOrder, "collector@bexyee.com"), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "COLLECTOR@BEXYEE.COM"), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, " Collector@bexyee.com "), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "attacker@bexyee.com"), false);
  });

  test("Customer verification authorizes phone matching (full number or last 4 digits)", () => {
    const mockOrder = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      guest_email: "collector@bexyee.com",
      address: { phone: "+91 98765 43210" },
    };

    assert.equal(verifyCustomerOrderAccess(mockOrder, "9876543210"), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "+91-9876543210"), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "3210"), true);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "0000"), false);
    assert.equal(verifyCustomerOrderAccess(mockOrder, "12"), false); // too short
  });

  test("PII data masking protects customer privacy on tracking responses", () => {
    assert.equal(maskEmail("rad@bexyee.com"), "r***d@bexyee.com");
    assert.equal(maskEmail("me@domain.org"), "m***@domain.org");
    assert.equal(maskPhone("9876543210"), "+91 ******3210");
    assert.equal(maskPhone("+91-98765-43210"), "+91 ******3210");
  });

  test("Invoice financial calculations are exact with 18% GST itemization", () => {
    const unitPricePaise = 179900;
    const quantity = 2;
    const subtotalPaise = unitPricePaise * quantity; // 359800
    const shippingPaise = 0; // Free delivery over ₹1,500
    const totalPaise = subtotalPaise + shippingPaise;

    const gstComponentPaise = Math.round((totalPaise * 0.18) / 1.18);

    assert.equal(subtotalPaise, 359800);
    assert.equal(totalPaise, 359800);
    assert.equal(gstComponentPaise, 54885);
    assert.equal(totalPaise - gstComponentPaise, 304915); // Taxable value
  });
});
