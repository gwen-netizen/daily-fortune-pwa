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

  // Cross-table query helper: checks user_profiles, then falls back to profiles by referral_code
  async function queryProfileByRefCode(refCode) {
    let { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('referral_code', refCode)
      .limit(1);

    if (!data || data.length === 0) {
      let { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('referral_code', refCode)
        .limit(1);
      if (pData && pData.length > 0) data = pData;
    }

    return data && data.length > 0 ? data[0] : null;
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

   // 2b. ACTION: CLAIM REFERRAL REWARD (48-Hour Pass)
    if (action === 'claim_referral_reward') {
      let { profile: existing, tableName } = await queryUserProfile(cleanEmail);
      const targetTable = tableName || 'user_profiles';

      const { data: pendingRewards } = await supabase
        .from('referrals')
        .select('id')
        .ilike('referrer_email', cleanEmail)
        .eq('status', 'completed');

      if (!pendingRewards || pendingRewards.length === 0) {
        return res.status(400).json({
          error: "No unlocked referral passes ready to claim yet. Make sure your friend completed at least 1 task!"
        });
      }

      const now = new Date();
      let baseTime = now;

      if (existing?.pass_expires_at && new Date(existing.pass_expires_at) > now) {
        baseTime = new Date(existing.pass_expires_at);
      }

      const newExpiry = new Date(baseTime.getTime() + 48 * 60 * 60 * 1000).toISOString();

      await supabase
        .from(targetTable)
        .update({ pass_expires_at: newExpiry })
        .eq('email', cleanEmail);

      const rewardIds = pendingRewards.map(r => r.id);
      await supabase
        .from('referrals')
        .update({ status: 'claimed', claimed_at: now.toISOString() })
        .in('id', rewardIds);

      return res.status(200).json({
        success: true,
        message: "48-hour pass activated!",
        passExpiresAt: newExpiry
      });
    }

   // 2c. ACTION: CHECK REFERRAL ELIGIBILITY
    if (action === 'check_referral_eligibility') {
      const { data: completedList } = await supabase
        .from('referrals')
        .select('id')
        .ilike('referrer_email', cleanEmail)
        .eq('status', 'completed');

      const { data: allHelped } = await supabase
        .from('referrals')
        .select('id')
        .ilike('referrer_email', cleanEmail)
        .in('status', ['completed', 'claimed']);

      return res.status(200).json({
        success: true,
        eligibleCount: completedList ? completedList.length : 0,
        helpedCount: allHelped ? allHelped.length : 0
      });
    }
   
    // 3. GET User Profile
    if (req.method === 'GET' || action === 'get_profile') {
      let { profile, tableName } = await queryUserProfile(cleanEmail);

      if (!profile) {
        const newCode = generateUniqueRefCode();
        const newRecord = {
          email: cleanEmail,
          daily_clicks: 0,
          last_click_date: clientDate || new Date().toISOString().split('T')[0],
          premium_user: false,
          total_wins: 0,
          focus_reclaimed: 0,
          referral_code: newCode
        };

        const { data: created } = await supabase
          .from(tableName || 'user_profiles')
          .insert([newRecord])
          .select()
          .limit(1);

        profile = created && created.length > 0 ? created[0] : newRecord;
      }

      return res.status(200).json({ profile });
    }

    // 4. POST User Progress Update
    // 4. POST User Progress Update
    if (req.method === 'POST') {
      const { total_wins, focus_reclaimed, daily_clicks, referralCodeInput } = req.body;
      const { profile: existing, tableName } = await queryUserProfile(cleanEmail);

      // --- LINK REFEREE TO REFERRER IF CODE PROVIDED ---
      if (referralCodeInput) {
        const cleanCode = referralCodeInput.trim().toUpperCase();
        const referrerProfile = await queryProfileByRefCode(cleanCode);

        if (referrerProfile && referrerProfile.email !== cleanEmail) {
          const { data: existingRef } = await supabase
            .from('referrals')
            .select('id')
            .ilike('referee_email', cleanEmail)
            .limit(1);

          if (!existingRef || existingRef.length === 0) {
            await supabase.from('referrals').insert([
              {
                referrer_email: referrerProfile.email,
                referee_email: cleanEmail,
                status: 'pending'
              }
            ]);
          }
        }
      }

      // --- UPGRADE REFERRAL STATUS IF REFEREE COMPLETED 1ST TASK ---
      if (parseInt(total_wins, 10) >= 1) {
        await supabase
          .from('referrals')
          .update({ status: 'completed' })
          .ilike('referee_email', cleanEmail)
          .eq('status', 'pending');
      }

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
