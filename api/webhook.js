const stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const isLive = process.env.IS_STRIPE_LIVE === 'true';
  const secretKey = isLive ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
  
  const successSecret = isLive ? process.env.STRIPE_LIVE_WEBHOOK_SECRET_SUCCESS : process.env.STRIPE_TEST_WEBHOOK_SECRET_SUCCESS;
  const deletedSecret = isLive ? process.env.STRIPE_LIVE_WEBHOOK_SECRET_DELETED : process.env.STRIPE_TEST_WEBHOOK_SECRET_DELETED;

  const stripeClient = stripe(secretKey);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const rawBody = await getRawBody(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature, successSecret);
  } catch (err1) {
    try {
      event = stripeClient.webhooks.constructEvent(rawBody, signature, deletedSecret);
    } catch (err2) {
      console.error("Webhook signature verification failed:", err2.message);
      return res.status(400).send(`Webhook Signature Error: ${err2.message}`);
    }
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.client_reference_id || session.customer_email;

      if (userEmail) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({ 
            email: userEmail.toLowerCase(), 
            premium_user: true 
          }, { onConflict: 'email' });

        if (error) throw error;
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      let userEmail = subscription.customer_email;

      if (!userEmail && subscription.customer) {
        const customer = await stripeClient.customers.retrieve(subscription.customer);
        userEmail = customer.email;
      }

      if (userEmail) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ premium_user: false })
          .eq('email', userEmail.toLowerCase());

        if (error) throw error;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Database sync error in webhook:", err);
    return res.status(500).send(`Database Error: ${err.message}`);
  }
}

module.exports = handler;
module.exports.config = config;
