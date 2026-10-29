const stripe = require('stripe');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  
  if (!secretKey) {
    console.error("Vercel Environment Variable Missing: Stripe Secret Key is undefined.");
    return res.status(500).json({ error: "Server configuration error: Missing Stripe API Key in Vercel." });
  }

  const stripeClient = stripe(secretKey);

  const prices = {
    test: { 
      annual: process.env.STRIPE_PRICE_ANNUAL || process.env.STRIPE_TEST_ANNUAL_PRICE_ID,
      monthly: process.env.STRIPE_TEST_MONTHLY_PRICE_ID || 'price_1UO7QCG617eW830n2gCXVDmY',
      pass: process.env.STRIPE_TEST_PASS_PRICE_ID || 'price_1UOeIWG617eW830naNZ3Dvi6'
    },
    live: { 
      annual: process.env.STRIPE_PRICE_ANNUAL || process.env.STRIPE_LIVE_ANNUAL_PRICE_ID, 
      monthly: process.env.STRIPE_LIVE_MONTHLY_PRICE_ID || process.env.STRIPE_PRICE_MONTHLY,
      pass: process.env.STRIPE_PRICE_2_DAY || process.env.STRIPE_LIVE_PASS_PRICE_ID || 'price_1UOeGrG617eW830nwxz6eHsB'
    }
  };

  try {
    const { planType, successUrl, cancelUrl, email } = req.body;
    const activePrices = isLive ? prices.live : prices.test;
    const targetPriceId = activePrices[planType] || (planType === '2day' ? activePrices.pass : undefined);

    const cleanEmail = (email && typeof email === 'string') ? email.trim().toLowerCase() : '';
    const isValidEmail = cleanEmail.includes('@') && cleanEmail !== 'anonymous_tester';

    const origin = req.headers.origin || ('https://' + req.headers.host);
    const defaultSuccessUrl = `${origin}/app.html?session=success`;
    const defaultCancelUrl = `${origin}/app.html`;

    const baseSuccess = successUrl || defaultSuccessUrl;
    const finalSuccessUrl = baseSuccess.includes('?') 
      ? `${baseSuccess}&email=${encodeURIComponent(isValidEmail ? cleanEmail : '')}&plan=${encodeURIComponent(planType)}` 
      : `${baseSuccess}?session=success&email=${encodeURIComponent(isValidEmail ? cleanEmail : '')}&plan=${encodeURIComponent(planType)}`;

    const isSubscription = (planType === 'monthly' || planType === 'annual' || planType === 'yearly');

    const sessionPayload = {
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: finalSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      allow_promotion_codes: true,
      metadata: { plan_type: planType }
    };

    if (isValidEmail) {
      sessionPayload.client_reference_id = cleanEmail;
      sessionPayload.customer_email = cleanEmail;
    }

    if (targetPriceId && typeof targetPriceId === 'string' && targetPriceId.startsWith('price_') && !targetPriceId.includes('YOUR_')) {
      sessionPayload.line_items = [{ price: targetPriceId, quantity: 1 }];
    } else {
      const fallbackCatalog = {
        pass: { name: '120Reset 2-Day Unlimited Pass', amount: 99, recurring: false },
        '2day': { name: '120Reset 2-Day Unlimited Pass', amount: 99, recurring: false },
        monthly: { name: '120Reset Continuous Momentum Plan', amount: 299, recurring: true, interval: 'month' },
        annual: { name: '120Reset Year-Round Override', amount: 1899, recurring: true, interval: 'year' },
        yearly: { name: '120Reset Year-Round Override', amount: 1899, recurring: true, interval: 'year' }
      };
      const item = fallbackCatalog[planType] || fallbackCatalog.annual;
      sessionPayload.line_items = [{
        price_data: {
          currency: 'usd',
          unit_amount: item.amount,
          product_data: { name: item.name },
          ...(item.recurring ? { recurring: { interval: item.interval || 'month' } } : {})
        },
        quantity: 1
      }];
    }

    const session = await stripeClient.checkout.sessions.create(sessionPayload);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Session Creation Error:", err);
    return res.status(500).json({ 
      error: err.message || "Failed to initialize Stripe checkout session." 
    });
  }
};
