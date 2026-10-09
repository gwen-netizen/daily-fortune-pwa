const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Helper to enforce 48h pass expiration inside Supabase
  async function sanitizePassStatus(profile) {
    if (!profile) return profile;

    if (profile.pass_expires_at) {
      const expiresAt = new Date(profile.pass_expires_at).getTime();
      const now = Date.now();

      if (now >= expiresAt) {
        // Hardcode Supabase update to set premium_user = false and pass_expires_at = null
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

  // ----------------------------------------------------
  // 1. CLOUD PROGRESS BACKUP & PROMO SYNC (POST)
  // ----------------------------------------------------
  if (req.method === 'POST') {
    try {
      const { email, total_wins, focus_reclaimed, device_id, promo_code } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lowerEmail = email.trim().toLowerCase();

      if (device_id) {
        const { data: currentProf } = await supabase
          .from('user_profiles')
          .select('active_device_id')
          .eq('email', lowerEmail)
          .maybeSingle();

        if (currentProf && currentProf.active_device_id && currentProf.active_device_id !== device_id) {
          return res.status(409).json({ 
            error: "Device Session Conflict: Account is active on another device.",
            code: "DEVICE_MISMATCH"
          });
        }
      }

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', lowerEmail)
        .maybeSingle();

      let isPremium = existingProfile ? existingProfile.premium_user : false;
      let passExpiry = existingProfile ? existingProfile.pass_expires_at : null;

      // Check for Promo Code PREMIUM99
      if (promo_code === 'PREMIUM99') {
        isPremium = true;
        passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
      }

      const updatePayload = { 
        email: lowerEmail, 
        total_wins: typeof total_wins === 'number' ? total_wins : (existingProfile?.total_wins || 0), 
        focus_reclaimed: typeof focus_reclaimed === 'number' ? focus_reclaimed : (existingProfile?.focus_reclaimed || 0.0),
        premium_user: isPremium,
        pass_expires_at: passExpiry
      };

      if (device_id) {
        updatePayload.active_device_id = device_id;
      }

      let { data, error } = await supabase
        .from('user_profiles')
        .upsert(updatePayload, { onConflict: 'email' })
        .select()
        .single();

      if (error) throw error;
      data = await sanitizePassStatus(data);

      return res.status(200).json({ success: true, profile: data });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ----------------------------------------------------
  // 2. AUTHENTICATION & PROFILE RETRIEVAL (GET)
  // ----------------------------------------------------
  if (req.method === 'GET') {
    const { email, action, token, device_id, promo_code } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.trim().toLowerCase();
    
    try {
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ 
          email: lowerEmail,
          options: { shouldCreateUser: true }
        });
        if (error) throw error;

        let passExpiry = null;
        let isPrem = false;
        if (promo_code === 'PREMIUM99') {
          isPrem = true;
          passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
        }

        await supabase
          .from('user_profiles')
          .upsert({ 
            email: lowerEmail,
            total_wins: 0,
            focus_reclaimed: 0.0,
            premium_user: isPrem,
            pass_expires_at: passExpiry
          }, { onConflict: 'email', ignoreDuplicates: !isPrem });

        return res.status(200).json({ sent: true });
      }
      
      if (action === 'verify_otp') {
        if (!token) return res.status(400).json({ error: "Token missing" });

        const otpTypes = ['email', 'signup', 'magiclink'];
        let verifiedAuthData = null;

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

        let { data: profileData } = await supabase
          .from('user_profiles')
          .upsert({ 
            email: lowerEmail, 
            active_device_id: device_id || null
          }, { onConflict: 'email' })
          .select()
          .single();

        profileData = await sanitizePassStatus(profileData);

        return res.status(200).json({ 
          success: true, 
          profile: profileData || { total_wins: 0, focus_reclaimed: 0, premium_user: false }
        });
      }

      if (action === 'get_profile') {
        let { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', lowerEmail)
          .maybeSingle();

        if (profileData && profileData.active_device_id && device_id && profileData.active_device_id !== device_id) {
          return res.status(409).json({ 
            error: "Session Conflict: Account is logged in on another device.",
            code: "DEVICE_MISMATCH"
          });
        }

        profileData = await sanitizePassStatus(profileData);
          
        return res.status(200).json({ profile: profileData || { premium_user: false } });
      }

      return res.status(400).json({ error: "Invalid action type" });
    } catch (err) {
      console.error("Supabase Auth API Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
