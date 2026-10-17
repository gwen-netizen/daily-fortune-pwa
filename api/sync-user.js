const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // SANITIZER: Respects premium_user = true unconditionally
  async function sanitizePassStatus(profile) {
    if (!profile) return profile;

    // If the database has premium_user = true, they are a permanent/lifetime user. Never demote them.
    if (profile.premium_user === true) {
      return profile;
    }

    // Only temporary pass users with an active pass_expires_at can expire
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
      }
    }
    return profile;
  }

  // Prevents crashes from duplicate rows and matches case-insensitively
  async function getProfileSafely(email) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', email)
      .limit(1);
    return data && data.length > 0 ? data[0] : null;
  }

  /* ========================================================
     POST: PROGRESS & METRIC SYNCHRONIZATION
  ======================================================== */
  if (req.method === 'POST') {
    try {
      const { email, total_wins, focus_reclaimed, promo_claimed } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lowerEmail = email.trim().toLowerCase();
      let existingProfile = await getProfileSafely(lowerEmail);

      const updatePayload = { 
        total_wins: typeof total_wins === 'number' ? total_wins : (existingProfile?.total_wins || 0), 
        focus_reclaimed: typeof focus_reclaimed === 'number' ? focus_reclaimed : (existingProfile?.focus_reclaimed || 0.0),
        promo_claimed: promo_claimed !== undefined ? promo_claimed : (existingProfile?.promo_claimed || false)
      };

      let profileData = null;

      if (existingProfile) {
        const { data } = await supabase
          .from('user_profiles')
          .update(updatePayload)
          .eq('email', existingProfile.email) 
          .select()
          .limit(1);
        profileData = data && data.length > 0 ? data[0] : null;
      } else {
        updatePayload.email = lowerEmail;
        updatePayload.premium_user = false;
        const { data } = await supabase.from('user_profiles').insert(updatePayload).select().limit(1);
        profileData = data && data.length > 0 ? data[0] : null;
      }

      profileData = await sanitizePassStatus(profileData);
      return res.status(200).json({ success: true, profile: profileData });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  /* ========================================================
     GET: AUTHENTICATION, OTP VERIFICATION, PROFILE RETRIEVAL
  ======================================================== */
  if (req.method === 'GET') {
    const { email, action, token, promo_code } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.trim().toLowerCase();
    
    try {
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ 
          email: lowerEmail,
          options: { shouldCreateUser: true }
        });
        if (error) throw error;
        return res.status(200).json({ sent: true });
      }
      
      if (action === 'verify_otp') {
        if (!token) return res.status(400).json({ error: "Token missing" });

        let verifiedAuthData = null;
        const otpTypes = ['email', 'signup', 'magiclink'];

        for (const otpType of otpTypes) {
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

        if (!verifiedAuthData) {
          return res.status(401).json({ error: "Invalid or expired access code. Please try requesting a new one." });
        }

        let profileData = await getProfileSafely(lowerEmail);

        if (!profileData) {
          const { data: newProfileData } = await supabase
            .from('user_profiles')
            .insert({ email: lowerEmail, premium_user: false, total_wins: 0, focus_reclaimed: 0, promo_claimed: false })
            .select()
            .limit(1);
          profileData = newProfileData && newProfileData.length > 0 ? newProfileData[0] : null;
        }

        let isPrem = profileData?.premium_user || false;
        let passExpiry = profileData?.pass_expires_at || null;
        let promoClaimed = profileData?.promo_claimed || false;
        let requiresUpdate = false;

        if (promo_code === 'PREMIUM99' && !isPrem && !promoClaimed) {
          isPrem = true;
          passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
          promoClaimed = true;
          requiresUpdate = true;
        }

        if (requiresUpdate && profileData) {
           const { data: updatedProfiles } = await supabase
             .from('user_profiles')
             .update({ premium_user: isPrem, pass_expires_at: passExpiry, promo_claimed: promoClaimed })
             .eq('email', profileData.email)
             .select()
             .limit(1);
             
           if (updatedProfiles && updatedProfiles.length > 0) {
             profileData = updatedProfiles[0];
           }
        }

        profileData = await sanitizePassStatus(profileData);

        return res.status(200).json({ 
          success: true, 
          profile: profileData || { total_wins: 0, focus_reclaimed: 0, premium_user: false, promo_claimed: false }
        });
      }

      if (action === 'get_profile') {
        let profileData = await getProfileSafely(lowerEmail);
        profileData = await sanitizePassStatus(profileData);
          
        return res.status(200).json({ profile: profileData || { premium_user: false, promo_claimed: false } });
      }

      return res.status(400).json({ error: "Invalid action type" });
    } catch (err) {
      console.error("Supabase Auth API Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
