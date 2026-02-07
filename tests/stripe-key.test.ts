import { describe, it, expect } from "vitest";
import Stripe from "stripe";

describe("Stripe Secret Key", () => {
  it("should be set and valid", async () => {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
    expect(key).toBeTruthy();
    expect(key).toMatch(/^sk_test_/);

    const stripe = new Stripe(key!, { apiVersion: "2026-01-28.clover" });
    // Lightweight call to verify the key works
    const balance = await stripe.balance.retrieve();
    expect(balance).toBeDefined();
    expect(balance.object).toBe("balance");
  });
});
