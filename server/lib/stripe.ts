import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(key, { apiVersion: "2026-01-28.clover" });
  }
  return _stripe;
}

export type SubscriptionTier = "premium" | "elite";

const PRICE_IDS: Record<SubscriptionTier, string> = {
  premium: process.env.STRIPE_PRICE_PREMIUM || "price_1SxAWd9pQe0qE44RKbuMQ4UU",
  elite: process.env.STRIPE_PRICE_ELITE || "price_1SxAXX9pQe0qE44RYLWsOQeD",
};

export interface CreateSubscriptionParams {
  paymentMethodId: string;
  email: string;
  tier: SubscriptionTier;
  userId: number;
}

export interface CreateSubscriptionResult {
  subscriptionId: string;
  customerId: string;
  clientSecret: string | null;
  status: Stripe.Subscription.Status;
}

export async function createSubscription(
  params: CreateSubscriptionParams
): Promise<CreateSubscriptionResult> {
  const stripe = getStripe();
  const { paymentMethodId, email, tier, userId } = params;

  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    throw new Error(`No price ID configured for tier: ${tier}`);
  }

  // Create or retrieve customer
  const customer = await stripe.customers.create({
    email,
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
    metadata: { userId: userId.toString(), tier },
  });

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      payment_method_types: ["card"],
      save_default_payment_method: "on_subscription",
    },
    expand: ["latest_invoice.payment_intent"],
    metadata: { userId: userId.toString(), tier },
  });

  let clientSecret: string | null = null;
  if (subscription.latest_invoice && typeof subscription.latest_invoice === "object") {
    const latestInvoice = subscription.latest_invoice as any;
    if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === "object") {
      clientSecret = latestInvoice.payment_intent.client_secret || null;
    }
  }

  return {
    subscriptionId: subscription.id,
    customerId: customer.id,
    clientSecret,
    status: subscription.status,
  };
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  return await stripe.subscriptions.retrieve(subscriptionId);
}
