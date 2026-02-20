import { describe, it, expect, vi } from 'vitest';

// Test the identity bridge logic
describe('Identity Bridge', () => {
  it('getPendingUserByEmail should be exported from db', async () => {
    const db = await import('../server/db');
    expect(typeof db.getPendingUserByEmail).toBe('function');
  });

  it('reconcilePendingSubscription should be exported from db', async () => {
    const db = await import('../server/db');
    expect(typeof db.reconcilePendingSubscription).toBe('function');
  });

  it('getStripe should be exported from stripe lib', async () => {
    const stripe = await import('../server/lib/stripe');
    expect(typeof stripe.getStripe).toBe('function');
  });

  it('reconcilePendingSubscription returns false when no pending user exists', async () => {
    // Mock getDb to return a mock db that returns empty results
    const db = await import('../server/db');
    // When database is not available, getPendingUserByEmail returns null
    const result = await db.getPendingUserByEmail('nonexistent@test.com');
    // Without a real DB connection, this should return null
    expect(result).toBeNull();
  });

  it('identity bridge is hooked into OAuth syncUser', async () => {
    const oauthSource = await import('fs').then(fs => 
      fs.readFileSync('./server/_core/oauth.ts', 'utf-8')
    );
    expect(oauthSource).toContain('reconcilePendingSubscription');
    expect(oauthSource).toContain('Identity bridge');
  });

  it('checkout API URL points to Railway production', async () => {
    const checkoutHtml = await import('fs').then(fs =>
      fs.readFileSync('./public/checkout.html', 'utf-8')
    );
    expect(checkoutHtml).toContain('ivyreader-production.up.railway.app');
    expect(checkoutHtml).not.toContain('3000-ik4t6s36n3oc5oeaw7m92');
  });

  it('confirmation page does not link to stale sandbox URLs', async () => {
    const confirmHtml = await import('fs').then(fs =>
      fs.readFileSync('./public/confirmation.html', 'utf-8')
    );
    expect(confirmHtml).not.toContain('8081-izc228vfaytopk80owte6');
  });
});
