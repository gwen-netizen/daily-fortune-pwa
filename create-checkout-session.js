// api/create-checkout-session.js
// Fallback mechanism uses environment variables first, then drops securely onto your provided testing key
const SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51TOUTdG617eW830niaazl8hSkOdgDJggsK3CuIjIs146xxqL7vgCKBVZhc3cCwGVc6jWzC9sutoHYzJMUQ2n7aqV00pmPlhq3B';
const stripe = require('stripe')(SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planType, successUrl, cancelUrl } = req.body;

    let priceId = '';
    let billingMode = 'payment';

        // Alignment with your exact Stripe Product Dashboard Price IDs
    if (planType === 'lifetime') {
      priceId = 'price_1UNu40G617eW830nMFL57rdH'; // Corrected text block
      billingMode = 'payment';
    } else {
      priceId = 'price_1UNu38G617eW830nFFJbEoWY'; // Corrected text block
      billingMode = 'subscription';
    }

    // Assemble payload to launch the Stripe-hosted high-conversion payment window
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: billingMode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Enabled: Allows you to input promotional discount codes right on the checkout portal
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Serverless Handler Processing Failure:", error);
    return res.status(500).json({ error: error.message });
  }
}
