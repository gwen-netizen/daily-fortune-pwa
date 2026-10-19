const stripe = require('stripe');

module.exports = async function handler(req, res) {
  // CORS & Preflight headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  
  if (!secretKey) {
    return res.status(500).json({ error: "Server configuration error: Missing Stripe API Key in Vercel." });
  }

  const stripeClient = stripe(secretKey);

  try {
    const { email, returnUrl } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "A valid email address is required to access the billing portal." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the customer record in Stripe associated with this email
    const customers = await stripeClient.customers.list({
      email: cleanEmail,
      limit: 1
    });

    if (!customers.data || customers.data.length === 0) {
      return res.status(404).json({ error: "No active Stripe customer found for this email address." });
    }

    const origin = req.headers.origin || ('https://' + req.headers.host);
    const defaultReturnUrl = `${origin}/app.html`;
    const finalReturnUrl = returnUrl || defaultReturnUrl;

    // Create Stripe Customer Billing Portal session
    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: finalReturnUrl
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe Portal Session Error:", err);
    return res.status(500).json({ 
      error: err.message || "Failed to create customer billing portal session." 
    });
  }
};
