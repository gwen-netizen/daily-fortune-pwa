const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  async function sanitizePassStatus(profile) {
    if (!profile) return profile;

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

  if (req.method === 'POST') {
    try {
      const { email, total_wins, focus_reclaimed, promo_claimed } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const lowerEmail = email.trim().toLowerCase();

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', lowerEmail)
        .maybeSingle();

      const updatePayload = { 
        total_wins: typeof total_wins === 'number' ? total_wins : (existingProfile?.total_wins || 0), 
        focus_reclaimed: typeof focus_reclaimed === 'number' ? focus_reclaimed : (existingProfile?.focus_reclaimed || 0.0),
        promo_claimed: promo_claimed !== undefined ? promo_claimed : (existingProfile?.promo_claimed || false)
      };

      let { data, error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('email', lowerEmail)
        .select()
        .maybeSingle();
        
      if (!data) {
         updatePayload.email = lowerEmail;
         const resInsert = await supabase.from('user_profiles').insert(updatePayload).select().single();
         data = resInsert.data;
      }

      data = await sanitizePassStatus(data);
      return res.status(200).json({ success: true, profile: data });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

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

        let { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', lowerEmail)
          .maybeSingle();

        if (!profileData) {
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({ email: lowerEmail, premium_user: false, total_wins: 0, focus_reclaimed: 0, promo_claimed: false })
            .select()
            .single();
          profileData = newProfile;
        }

        // --- INTELLIGENT PROMO CODE ENFORCEMENT ---
        // Runs cleanly only after the user account definitively exists
        let isPrem = profileData?.premium_user || false;
        let passExpiry = profileData?.pass_expires_at || null;
        let promoClaimed = profileData?.promo_claimed || false;
        let requiresUpdate = false;

        // If code is correct AND user is not premium AND they haven't used a promo code before
        if (promo_code === 'PREMIUM99' && !isPrem && !promoClaimed) {
          isPrem = true;
          passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
          promoClaimed = true;
          requiresUpdate = true;
        }

        if (requiresUpdate) {
           const { data: updatedProfile } = await supabase
             .from('user_profiles')
             .update({ premium_user: isPrem, pass_expires_at: passExpiry, promo_claimed: promoClaimed })
             .eq('email', lowerEmail)
             .select()
             .maybeSingle();
             
           if (updatedProfile) profileData = updatedProfile;
        }

        profileData = await sanitizePassStatus(profileData);

        return res.status(200).json({ 
          success: true, 
          profile: profileData || { total_wins: 0, focus_reclaimed: 0, premium_user: false, promo_claimed: false }
        });
      }

      if (action === 'get_profile') {
        let { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', lowerEmail)
          .maybeSingle();

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
