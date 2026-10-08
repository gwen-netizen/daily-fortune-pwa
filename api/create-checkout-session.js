const stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  const stripeClient = stripe(secretKey);

  const prices = {
    test: { 
      lifetime: process.env.STRIPE_TEST_LIFETIME_PRICE_ID || 'price_YOUR_TEST_LIFETIME_ID', 
      monthly: process.env.STRIPE_TEST_MONTHLY_PRICE_ID || 'price_YOUR_TEST_MONTHLY_ID' 
    },
    live: { 
      lifetime: process.env.STRIPE_LIVE_LIFETIME_PRICE_ID || 'price_YOUR_LIVE_LIFETIME_ID', 
      monthly: process.env.STRIPE_LIVE_MONTHLY_PRICE_ID || 'price_YOUR_LIVE_MONTHLY_ID' 
    }
  };

  try {
    const { planType, successUrl, cancelUrl, email } = req.body;
    const activePrices = isLive ? prices.live : prices.test;
    const targetPriceId = planType === 'lifetime' ? activePrices.lifetime : activePrices.monthly;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: planType === 'lifetime' ? 'payment' : 'subscription',
      line_items: [{ price: targetPriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: email,
      customer_email: email || undefined
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};
