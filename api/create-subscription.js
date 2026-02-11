const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { paymentMethodId, email, tier, fullName } = req.body;

    if (!paymentMethodId || !email || !tier) {
      return res.status(400).json({ error: 'Missing required fields: paymentMethodId, email, tier' });
    }

    // Get the price ID based on tier
    const priceId = tier === 'elite'
      ? process.env.STRIPE_PRICE_ELITE
      : process.env.STRIPE_PRICE_PREMIUM;

    if (!priceId) {
      return res.status(500).json({ error: `Price not configured for tier: ${tier}` });
    }

    // Create or get Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name: fullName || email.split('@')[0],
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
    });

    return res.status(200).json({
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: error.message });
  }
};
