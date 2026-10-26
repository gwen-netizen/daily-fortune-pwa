const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL || 'https://rwrwppyhatzflivzgwve.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  function generateUniqueRefCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `120R-${suffix}`;
  }

  async function ensureReferralCode(profile) {
    if (!profile) return profile;
    if (!profile.referral_code) {
      const code = generateUniqueRefCode();
      const { data } = await supabase
        .from('user_profiles')
        .update({ referral_code: code })
        .eq('email', profile.email)
        .select()
        .limit(1);
      if (data && data.length > 0) return data[0];
      profile.referral_code = code;
    }
    return profile;
  }

  const { email, action, clientDate } = (req.method === 'POST') ? req.body : req.query;

  if (!email) {
    return res.status(400).json({ error: "Email parameter required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    if (req.method === 'GET' || action === 'get_profile') {
      let { data } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('email', cleanEmail)
        .limit(1);

      let profile = data && data.length > 0 ? data[0] : null;

      if (!profile) {
        const newCode = generateUniqueRefCode();
        const { data: created } = await supabase
          .from('user_profiles')
          .insert([{
            email: cleanEmail,
            daily_clicks: 0,
            last_click_date: clientDate || new Date().toISOString().split('T')[0],
            premium_user: false,
            total_wins: 0,
            focus_reclaimed: 0,
            referral_code: newCode
          }])
          .select()
          .limit(1);

        profile = created && created.length > 0 ? created[0] : null;
      } else {
        profile = await ensureReferralCode(profile);
      }

      return res.status(200).json({ profile });
    }

    if (req.method === 'POST') {
      const { total_wins, focus_reclaimed, daily_clicks } = req.body;

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          email: cleanEmail,
          total_wins: parseInt(total_wins, 10) || 0,
          focus_reclaimed: parseFloat(focus_reclaimed) || 0.0,
          daily_clicks: parseInt(daily_clicks, 10) || 0,
          last_click_date: clientDate || new Date().toISOString().split('T')[0]
        }, { onConflict: 'email' })
        .select()
        .limit(1);

      if (error) throw error;
      const updatedProfile = data && data.length > 0 ? data[0] : null;
      return res.status(200).json({ profile: updatedProfile });
    }

  } catch (err) {
    console.error("Supabase Sync Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
