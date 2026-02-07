import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "../db";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
    if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-01-28.clover" });
  }
  return _stripe;
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).send("No signature");
  }

  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).send("Webhook secret not configured");
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("[Stripe Webhook] Received event:", event.type);

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const tier = subscription.metadata.tier as "premium" | "elite";
  if (!userId) {
    console.error("[Stripe Webhook] No userId in subscription metadata");
    return;
  }
  const subscriptionStatus = mapStripeStatus(subscription.status);
  const subscriptionData: any = subscription;
  const currentPeriodEnd = subscriptionData.current_period_end;
  await db.updateUserSubscription(parseInt(userId), {
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus,
    subscriptionTier: tier,
    subscriptionEndsAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
  });
  console.log(`[Stripe Webhook] Updated subscription for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in subscription metadata");
    return;
  }
  await db.updateUserSubscription(parseInt(userId), {
    subscriptionStatus: "canceled",
    subscriptionTier: "free",
  });
  console.log(`[Stripe Webhook] Canceled subscription for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceData: any = invoice;
  const subscriptionId = invoiceData.subscription as string;
  if (!subscriptionId) return;
  console.log(`[Stripe Webhook] Payment succeeded for subscription ${subscriptionId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData: any = invoice;
  const subscriptionId = invoiceData.subscription as string;
  if (!subscriptionId) return;
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId;
  if (!userId) return;
  await db.updateUserSubscription(parseInt(userId), { subscriptionStatus: "past_due" });
  console.log(`[Stripe Webhook] Payment failed for user ${userId}, marked as past_due`);
}

function mapStripeStatus(status: Stripe.Subscription.Status): "active" | "canceled" | "past_due" | "trialing" {
  switch (status) {
    case "active": return "active";
    case "canceled": return "canceled";
    case "past_due": return "past_due";
    case "trialing": return "trialing";
    default: return "active";
  }
}
