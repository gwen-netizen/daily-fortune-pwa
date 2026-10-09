const stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  
  if (!secretKey) {
    console.error("Vercel Environment Variable Missing: Stripe Secret Key is undefined.");
    return res.status(500).json({ error: "Server configuration error: Missing Stripe API Key. A redeploy is required." });
  }

  const stripeClient = stripe(secretKey);

  const prices = {
    test: { 
      lifetime: process.env.STRIPE_TEST_LIFETIME_PRICE_ID || 'price_1UO7PUG617eW830nZMDod1D8',
      monthly: process.env.STRIPE_TEST_MONTHLY_PRICE_ID || 'price_1UO7QCG617eW830n2gCXVDmY',
      pass: process.env.STRIPE_TEST_PASS_PRICE_ID || 'price_1UO7PUG617eW830nZMDod1D8' // 2-Day Pass Price ID
    },
    live: { 
      lifetime: process.env.STRIPE_LIVE_LIFETIME_PRICE_ID || 'price_YOUR_LIVE_LIFETIME_ID', 
      monthly: process.env.STRIPE_LIVE_MONTHLY_PRICE_ID || 'price_YOUR_LIVE_MONTHLY_ID',
      pass: process.env.STRIPE_LIVE_PASS_PRICE_ID || 'price_YOUR_LIVE_PASS_ID'
    }
  };

  try {
    const { planType, successUrl, cancelUrl, email, promoCode } = req.body;
    const activePrices = isLive ? prices.live : prices.test;
    
    let targetPriceId = activePrices.monthly;
    let mode = 'subscription';

    if (planType === 'lifetime') {
      targetPriceId = activePrices.lifetime;
      mode = 'payment';
    } else if (planType === 'pass' || planType === '2day') {
      targetPriceId = activePrices.pass;
      mode = 'payment';
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const finalSuccessUrl = successUrl.includes('?') 
      ? `${successUrl}&email=${encodeURIComponent(cleanEmail)}&plan=${encodeURIComponent(planType)}` 
      : `${successUrl}?session=success&email=${encodeURIComponent(cleanEmail)}&plan=${encodeURIComponent(planType)}`;

    const sessionPayload = {
      payment_method_types: ['card'],
      mode: mode,
      line_items: [{ price: targetPriceId, quantity: 1 }],
      success_url: finalSuccessUrl,
      cancel_url: cancelUrl,
      client_reference_id: cleanEmail,
      customer_email: cleanEmail || undefined,
      allow_promotion_codes: true // Enables Native Promotional Coupon Input at Stripe Checkout
    };

    const session = await stripeClient.checkout.sessions.create(sessionPayload);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};
