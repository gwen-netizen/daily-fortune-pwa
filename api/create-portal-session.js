const stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  
  if (!secretKey) {
    return res.status(500).json({ error: "Server configuration error: Missing Stripe API Key." });
  }

  const stripeClient = stripe(secretKey);

  try {
    const { email, returnUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required to access the billing portal." });
    }

    const customers = await stripeClient.customers.list({
      email: email.toLowerCase(),
      limit: 1
    });

    if (!customers.data || customers.data.length === 0) {
      return res.status(404).json({ error: "No active Stripe subscription found for this email address." });
    }

    const return_url = returnUrl || (req.headers.origin ? req.headers.origin : 'https://' + req.headers.host);

    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: return_url
    });

    res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe Portal Session Error:", err);
    res.status(500).json({ error: err.message });
  }
};
