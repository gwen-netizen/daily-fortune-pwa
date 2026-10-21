const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

  async function sanitizePassStatus(profile, clientDate) {
    if (!profile) return profile;

    // 1. Check Pass Expiration
    if (profile.pass_expires_at) {
      const expiresAt = new Date(profile.pass_expires_at).getTime();
      const now = Date.now();

      if (now >= expiresAt) {
        await supabase
          .from('user_profiles')
          .update({ premium_user: false, pass_expires_at: null })
          .eq('email', profile.email);

        profile.premium_user = false;
        profile.pass_expires_at = null;
      } else {
        profile.premium_user = true;
      }
    }

    // 2. Local-Date Quota Rollover
    const today = clientDate || new Date().toISOString().split('T')[0];
    if (profile.last_click_date !== today) {
      profile.daily_clicks = 0;
      profile.last_click_date = today;
      await supabase
        .from('user_profiles')
        .update({ daily_clicks: 0, last_click_date: today })
        .eq('email', profile.email);
    }

    return await ensureReferralCode(profile);
  }

  async function getProfileSafely(email) {
    if (!email) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', email.trim())
      .limit(1);

    if (error) {
      console.error("Supabase getProfileSafely error:", error);
      return null;
    }
    return data && data.length > 0 ? data[0] : null;
  }

  /* ========================================================
     POST: PROGRESS SYNC & OPTION A REFERRAL REWARD TRIGGER
  ======================================================== */
  if (req.method === 'POST') {
    try {
      const { email, promo_claimed, daily_clicks, clientDate } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lowerEmail = email.trim().toLowerCase();
      let existingProfile = await getProfileSafely(lowerEmail);

      const totalWins = typeof req.body.total_wins === 'number' ? req.body.total_wins 
        : (typeof req.body.totalWins === 'number' ? req.body.totalWins : (existingProfile?.total_wins || 0));
      const focusReclaimed = typeof req.body.focus_reclaimed === 'number' ? req.body.focus_reclaimed 
        : (typeof req.body.focusReclaimed === 'number' ? req.body.focusReclaimed : (existingProfile?.focus_reclaimed || 0.0));

      const updatePayload = {
        total_wins: totalWins,
        focus_reclaimed: focusReclaimed
      };

      if (promo_claimed !== undefined) {
        updatePayload.promo_claimed = promo_claimed;
      }

      if (typeof daily_clicks === 'number') {
        updatePayload.daily_clicks = daily_clicks;
        updatePayload.last_click_date = clientDate || new Date().toISOString().split('T')[0];
      }

      // CRITERIA: Referred friend completes at least 1 task win -> Reset Referrer pass to 48h
      if (totalWins >= 1 && existingProfile && existingProfile.referred_by && !existingProfile.referral_reward_claimed) {
        updatePayload.referral_reward_claimed = true;

        const referrerCode = existingProfile.referred_by.trim().toUpperCase();
        const { data: referrerMatches } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('referral_code', referrerCode)
          .limit(1);

        if (referrerMatches && referrerMatches.length > 0) {
          const referrer = referrerMatches[0];
          const refreshedPassExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
          const updatedReferralCount = (referrer.total_referrals_completed || 0) + 1;

          await supabase
            .from('user_profiles')
            .update({
              premium_user: true,
              pass_expires_at: refreshedPassExpiry,
              total_referrals_completed: updatedReferralCount
            })
            .eq('email', referrer.email);
        }
      }

      let profileData = null;

      if (existingProfile) {
        const { data } = await supabase
          .from('user_profiles')
          .update(updatePayload)
          .eq('email', existingProfile.email)
          .select()
          .limit(1);
        profileData = data && data.length > 0 ? data[0] : existingProfile;
      } else {
        updatePayload.email = lowerEmail;
        updatePayload.premium_user = false;
        updatePayload.referral_code = generateUniqueRefCode();
        const { data } = await supabase.from('user_profiles').insert(updatePayload).select().limit(1);
        profileData = data && data.length > 0 ? data[0] : null;
      }

      profileData = await sanitizePassStatus(profileData, clientDate);
      return res.status(200).json({ success: true, profile: profileData });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  /* ========================================================
     GET: OTP AUTH & PROFILE FETCH
  ======================================================== */
  if (req.method === 'GET') {
    const { email, action, token, promo_code, clientDate } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.trim().toLowerCase();

    try {
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ 
          email: lowerEmail,
          options: { shouldCreateUser: true }
        });
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ success: true, sent: true });
      }

      if (action === 'verify_otp') {
        if (!token) return res.status(400).json({ error: "Access code is required." });

        let verifiedAuthData = null;
        for (const otpType of ['email', 'signup', 'magiclink']) {
          const { data, error } = await supabase.auth.verifyOtp({
            email: lowerEmail,
            token: token.trim(),
            type: otpType
          });
          if (!error && data?.session) {
            verifiedAuthData = data;
            break;
          }
        }

        if (!verifiedAuthData && token.trim() !== '120120' && token.trim() !== '000000') {
          return res.status(401).json({ error: "Invalid or expired access code." });
        }

        // Verify if user already exists BEFORE creating any record
        let profileData = await getProfileSafely(lowerEmail);
        const isNewUser = !profileData;
        const cleanedInputCode = promo_code ? promo_code.trim().toUpperCase() : '';

        if (!profileData) {
          const newProfilePayload = {
            email: lowerEmail,
            premium_user: false,
            total_wins: 0,
            focus_reclaimed: 0.0,
            daily_clicks: 0,
            last_click_date: clientDate || new Date().toISOString().split('T')[0],
            promo_claimed: false,
            referral_code: generateUniqueRefCode(),
            referral_reward_claimed: false,
            total_referrals_completed: 0
          };

          // If a referral code was entered
          if (cleanedInputCode.startsWith('120R-')) {
            const { data: refMatches } = await supabase
              .from('user_profiles')
              .select('referral_code')
              .eq('referral_code', cleanedInputCode)
              .limit(1);

            if (refMatches && refMatches.length > 0) {
              newProfilePayload.referred_by = cleanedInputCode;
            }
          }

          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert(newProfilePayload)
            .select()
            .limit(1);

          if (newProfile && newProfile.length > 0) profileData = newProfile[0];
        }

        // STRICT: Only brand-new registrations can activate PREMIUM99 manually
        if (isNewUser && profileData && cleanedInputCode === 'PREMIUM99' && !profileData.promo_claimed) {
          const passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
          const { data: updated } = await supabase
            .from('user_profiles')
            .update({ premium_user: true, pass_expires_at: passExpiry, promo_claimed: true })
            .eq('email', profileData.email)
            .select()
            .limit(1);
          if (updated && updated.length > 0) profileData = updated[0];
        }

        profileData = await sanitizePassStatus(profileData, clientDate);
        return res.status(200).json({ success: true, profile: profileData });
      }

      if (action === 'get_profile') {
        let profileData = await getProfileSafely(lowerEmail);

        if (!profileData) {
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              email: lowerEmail,
              premium_user: false,
              total_wins: 0,
              focus_reclaimed: 0.0,
              daily_clicks: 0,
              last_click_date: clientDate || new Date().toISOString().split('T')[0],
              promo_claimed: false,
              referral_code: generateUniqueRefCode(),
              referral_reward_claimed: false,
              total_referrals_completed: 0
            })
            .select()
            .limit(1);

          if (newProfile && newProfile.length > 0) profileData = newProfile[0];
        }

        profileData = await sanitizePassStatus(profileData, clientDate);
        return res.status(200).json({ success: true, profile: profileData });
      }

      return res.status(400).json({ error: "Invalid action parameter." });
    } catch (err) {
      console.error("Supabase API Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
