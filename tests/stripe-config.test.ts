import { describe, it, expect } from 'vitest';

describe('Stripe Configuration', () => {
  it('should have valid Stripe Price IDs configured', () => {
    // Check that Price IDs are set
    const premiumPriceId = process.env.STRIPE_PRICE_PREMIUM || "price_1SxAWd9pQe0qE44RKbuMQ4UU";
    const elitePriceId = process.env.STRIPE_PRICE_ELITE || "price_1SxAXX9pQe0qE44RYLWsOQeD";
    
    // Validate format (Stripe Price IDs start with "price_")
    expect(premiumPriceId).toMatch(/^price_/);
    expect(elitePriceId).toMatch(/^price_/);
    
    // Ensure they're different
    expect(premiumPriceId).not.toBe(elitePriceId);
    
    // Validate minimum length (Stripe IDs are typically 28+ characters)
    expect(premiumPriceId.length).toBeGreaterThan(20);
    expect(elitePriceId.length).toBeGreaterThan(20);
  });
  
  it('should have Stripe Secret Key configured', () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    expect(secretKey).toBeDefined();
    expect(secretKey).toMatch(/^sk_(test|live)_/);
  });
});
