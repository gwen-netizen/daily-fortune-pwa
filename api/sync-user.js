const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // SANITIZER: Evaluates temporary pass timestamps before permanent flags
  async function sanitizePassStatus(profile) {
    if (!profile) return profile;

    if (profile.pass_expires_at) {
      const expiresAt = new Date(profile.pass_expires_at).getTime();
      const now = Date.now();

      if (now >= expiresAt) {
        // Pass expired: demote in Supabase
        await supabase
          .from('user_profiles')
          .update({ premium_user: false, pass_expires_at: null })
          .eq('email', profile.email);

        profile.premium_user = false;
        profile.pass_expires_at = null;
      } else {
        // Pass is still active
        profile.premium_user = true;
      }
    }

    return profile;
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
     POST: METRIC & PROGRESS SYNCHRONIZATION
  ======================================================== */
  if (req.method === 'POST') {
    try {
      const { email, promo_claimed } = req.body;
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
     GET: LOGIN TALLY & PROFILE RETRIEVAL
  ======================================================== */
  if (req.method === 'GET') {
    const { email, action, promo_code } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.trim().toLowerCase();

    try {
      let profileData = await getProfileSafely(lowerEmail);

      // If user does not exist in Supabase yet, initialize entry
      if (!profileData) {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            email: lowerEmail,
            premium_user: false,
            total_wins: 0,
            focus_reclaimed: 0.0,
            promo_claimed: false
          })
          .select()
          .limit(1);

        if (!insertError && newProfile && newProfile.length > 0) {
          profileData = newProfile[0];
        }
      }

      // Handle promo code (PREMIUM99)
      if (profileData && promo_code === 'PREMIUM99' && !profileData.premium_user && !profileData.promo_claimed) {
        const passExpiry = new Date(Date.now() + (48 * 3600 * 1000)).toISOString();
        const { data: updated } = await supabase
          .from('user_profiles')
          .update({ premium_user: true, pass_expires_at: passExpiry, promo_claimed: true })
          .eq('email', profileData.email)
          .select()
          .limit(1);
        if (updated && updated.length > 0) profileData = updated[0];
      }

      profileData = await sanitizePassStatus(profileData);

      return res.status(200).json({
        success: true,
        profile: profileData || { email: lowerEmail, premium_user: false, pass_expires_at: null, total_wins: 0, focus_reclaimed: 0.0 }
      });
    } catch (err) {
      console.error("Supabase Profile Retrieval Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
