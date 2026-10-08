// api/create-checkout-session.js
// Dynamically reads your secure private tokens from your Vercel Dashboard parameters
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planType, successUrl, cancelUrl } = req.body;
    let priceId = '';
    let billingMode = 'payment';

    // AUTOMATED FILTER ENGINE: Swaps your price strings dynamically depending on your active key environment type
    if (planType === 'lifetime') {
      priceId = process.env.STRIPE_PRICE_LIFETIME; 
      billingMode = 'payment';
    } else {
      priceId = process.env.STRIPE_PRICE_MONTHLY; 
      billingMode = 'subscription';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: billingMode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Serverless Handler Processing Failure:", error);
    return res.status(500).json({ error: error.message });
  }
}
