const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

  if (req.method === 'GET') {
    const { email, action, token } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter missing" });

    const lowerEmail = email.toLowerCase();
    
    try {
      if (action === 'request_otp') {
        const { error } = await supabase.auth.signInWithOtp({ email: lowerEmail });
        if (error) throw error;
        return res.status(200).json({ sent: true });
      }
      
      if (action === 'verify_otp') {
        const { data: authData, error: authErr } = await supabase.auth.verifyOtp({
          email: lowerEmail,
          token: token,
          type: 'magiclink'
        });
        
        if (authErr) return res.status(401).json({ error: "Invalid or expired code." });

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

      if (action === 'get_profile') {
        const { data: profileData, error } = await supabase
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
