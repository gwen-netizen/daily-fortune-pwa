// api/create-checkout-session.js
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

    // Injected your specific Stripe Dashboard generated Price IDs cleanly
    if (planType === 'lifetime') {
      priceId = 'price_1UNu40G617eW830nFFJbEoWY'; // Replaced with your exact Lifetime Plan Price ID
      billingMode = 'payment';
    } else {
      priceId = 'price_1UNu38G617eW830nFFJbEoWY'; // Replaced with your exact Monthly Plan Price ID
      billingMode = 'subscription';
    }

    // Assemble secure session configuration payload 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: billingMode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Enables both test coupons and real promo codes to be inputted directly into Stripe Checkout
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Serverless Handler Processing Failure:", error);
    return res.status(500).json({ error: error.message });
  }
}
