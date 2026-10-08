// api/sync-user.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST: Sync user stats back to Supabase (Called silently at end of Victory Phase)
  if (req.method === 'POST') {
    try {
      const { email, total_wins, focus_reclaimed, premium_user } = req.body;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({ 
          email: email, 
          total_wins: total_wins, 
          focus_reclaimed: focus_reclaimed, 
          premium_user: premium_user 
        }, { onConflict: 'email' });

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Supabase Write Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // GET: Handle Auth Operations (Send OTP or Verify OTP)
  if (req.method === 'GET') {
    const { email, action, token } = req.query;
    
    try {
      // 1. Send OTP Magic Link
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ email: email });
        if (error) throw error;
        return res.status(200).json({ sent: true });
      }
      
      // 2. Verify OTP & Fetch User Data
      if (action === 'verify_otp') {
        const { data: authData, error: authErr } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'magiclink'
        });
        
        if (authErr) return res.status(401).json({ error: "Invalid or expired code." });

        // Retrieve existing profile if they are an old user logging into a new device
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', email)
          .single();

        return res.status(200).json({ 
          success: true, 
          profile: profileData || { total_wins: 0, focus_reclaimed: 0, premium_user: false }
        });
      }
    } catch (err) {
      console.error("Supabase Auth Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
};
