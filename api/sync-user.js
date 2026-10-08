const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // ----------------------------------------------------
  // 1. CLOUD PROGRESS BACKUP (POST)
  // ----------------------------------------------------
  if (req.method === 'POST') {
    try {
      const { email, total_wins, focus_reclaimed, premium_user } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({ 
          email: email.toLowerCase(), 
          total_wins: total_wins || 0, 
          focus_reclaimed: focus_reclaimed || 0.0, 
          premium_user: premium_user || false 
        }, { onConflict: 'email' });

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ----------------------------------------------------
  // 2. AUTHENTICATION & PROFILE RETRIEVAL (GET)
  // ----------------------------------------------------
  if (req.method === 'GET') {
    const { email, action, token } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.toLowerCase();
    
    try {
      // Action A: Request 6-digit OTP Code
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ 
          email: lowerEmail,
          options: {
            shouldCreateUser: true // Automatically registers new users
          }
        });
        if (error) throw error;
        return res.status(200).json({ sent: true });
      }
      
      // Action B: Verify 6-digit OTP Code (Fail-Safe Matrix)
      if (action === 'verify_otp') {
        if (!token) return res.status(400).json({ error: "Token missing" });

        const otpTypes = ['email', 'signup', 'magiclink'];
        let verifiedAuthData = null;
        let lastAuthError = null;

        // Iterates through all possible Supabase OTP token types to guarantee verification
        for (const otpType of otpTypes) {
          const { data, error } = await supabase.auth.verifyOtp({
            email: lowerEmail,
            token: token.trim(),
            type: otpType
          });

          if (!error && data?.session) {
            verifiedAuthData = data;
            break;
          } else {
            lastAuthError = error;
          }
        }

        if (!verifiedAuthData) {
          console.warn("OTP verification rejected on all types for:", lowerEmail, lastAuthError);
          return res.status(401).json({ error: "Invalid or expired code. Please try requesting a new one." });
        }

        // Fetch or initialize user profile from DB
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', lowerEmail)
          .single();

        return res.status(200).json({ 
          success: true, 
          profile: profileData || { total_wins: 0, focus_reclaimed: 0, premium_user: false }
        });
      }

      // Action C: Secure Premium Check after Payment
      if (action === 'get_profile') {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', lowerEmail)
          .single();
          
        return res.status(200).json({ profile: profileData || { premium_user: false } });
      }

      return res.status(400).json({ error: "Invalid action type" });
    } catch (err) {
      console.error("Supabase Auth API Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
