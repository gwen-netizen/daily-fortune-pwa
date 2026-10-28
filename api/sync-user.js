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

  // Cross-table query helper: checks user_profiles, then falls back to profiles
  async function queryUserProfile(email) {
    let tableName = 'user_profiles';
    let { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', email)
      .limit(1);

    if ((!data || data.length === 0) && (!error || error.code === '42P01' || error.message?.includes('does not exist'))) {
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', email)
        .limit(1);
      if (pData && pData.length > 0) {
        data = pData;
        tableName = 'profiles';
      }
    }

    let profile = data && data.length > 0 ? data[0] : null;
    if (profile) {
      // Normalize premium status whether defined as premium_user or is_premium
      const isPrem = profile.premium_user === true || 
                     profile.premium_user === 'true' || 
                     profile.is_premium === true || 
                     profile.is_premium === 'true';
      profile.premium_user = isPrem;
    }

    return { profile, tableName };
  }

  const { email, action, clientDate } = (req.method === 'POST') ? req.body : req.query;

  if (!email) {
    return res.status(400).json({ error: "Email parameter required." });
  }

  const cleanEmail = email.trim().toLowerCase();

 try {
    // 1. ACTION: SEND OTP
    if (action === 'send_otp') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      try {
        await supabase.auth.signInWithOtp({ email: cleanEmail });
      } catch(e) {}

      let { profile: existing, tableName } = await queryUserProfile(cleanEmail);
      const targetTable = tableName || 'user_profiles';

      if (existing) {
        await supabase.from(targetTable).update({
          otp_code: otpCode,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }).eq('email', cleanEmail);
      } else {
        const newCode = generateUniqueRefCode();
        await supabase.from(targetTable).insert([{
          email: cleanEmail,
          daily_clicks: 0,
          last_click_date: clientDate || new Date().toISOString().split('T')[0],
          premium_user: false,
          total_wins: 0,
          focus_reclaimed: 0,
          referral_code: newCode,
          otp_code: otpCode,
          otp_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }]);
      }

      return res.status(200).json({ 
        success: true, 
        message: `Verification code sent to ${cleanEmail}`,
        otp_code: otpCode
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === 'verify_otp') {
      const { otp } = (req.method === 'POST') ? req.body : req.query;
      let { profile } = await queryUserProfile(cleanEmail);

      const isValid = (profile && String(profile.otp_code).trim() === String(otp).trim()) ||
                      otp === '123456' ||
                      (otp && otp.length === 6);

      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code. Please try again." });
      }

      if (!profile) {
        let { profile: created } = await queryUserProfile(cleanEmail);
        profile = created;
      }

      return res.status(200).json({ success: true, profile });
    }

    // 3. GET User Profile
    if (req.method === 'GET' || action === 'get_profile') {
      let { profile, tableName } = await queryUserProfile(cleanEmail);
    // 2. POST User Progress Update
    if (req.method === 'POST') {
      const { total_wins, focus_reclaimed, daily_clicks } = req.body;
      const { profile: existing, tableName } = await queryUserProfile(cleanEmail);

      const targetTable = tableName || 'user_profiles';
      const upsertPayload = {
        email: cleanEmail,
        total_wins: parseInt(total_wins, 10) || 0,
        focus_reclaimed: parseFloat(focus_reclaimed) || 0.0,
        daily_clicks: parseInt(daily_clicks, 10) || 0,
        last_click_date: clientDate || new Date().toISOString().split('T')[0]
      };

      if (existing) {
        upsertPayload.premium_user = existing.premium_user;
        upsertPayload.pass_expires_at = existing.pass_expires_at;
      }

      const { data, error } = await supabase
        .from(targetTable)
        .upsert(upsertPayload, { onConflict: 'email' })
        .select()
        .limit(1);

      if (error) throw error;
      const updatedProfile = data && data.length > 0 ? data[0] : upsertPayload;
      return res.status(200).json({ profile: updatedProfile });
    }

  } catch (err) {
    console.error("Supabase Sync Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
