const { createClient } = require('@supabase/supabase-js');
const taskMatrix = require('../lib/tasks.js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { category, friction, email } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: "Missing required category parameter." });
    }

    const lowerCategory = category.toLowerCase();
    const isPremiumDeck = (lowerCategory === 'dopamine' || lowerCategory === 'overwhelm');

    let userProfile = null;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (cleanEmail && cleanEmail !== 'anonymous_tester') {
      // Safely handles case-insensitivity and prevents duplicate row crashes
      const { data } = await supabase
        .from('user_profiles')
        .select('premium_user, pass_expires_at')
        .ilike('email', cleanEmail)
        .limit(1);
      
      userProfile = data && data.length > 0 ? data[0] : null;
    }

    // PASS EXPIRATION CHECK: Only demote if the user is NOT permanently premium
    if (userProfile && userProfile.pass_expires_at) {
      const expiresAt = new Date(userProfile.pass_expires_at).getTime();
      if (Date.now() >= expiresAt) {
        if (userProfile.premium_user !== true) {
          await supabase
            .from('user_profiles')
            .update({ premium_user: false, pass_expires_at: null })
            .ilike('email', cleanEmail);

          userProfile.premium_user = false;
        } else {
          // If already premium_user = true, only clear the expired pass date
          await supabase
            .from('user_profiles')
            .update({ pass_expires_at: null })
            .ilike('email', cleanEmail);
        }
        userProfile.pass_expires_at = null;
      }
    }

    const isPremiumUser = Boolean(userProfile && userProfile.premium_user);

    if (isPremiumDeck && !isPremiumUser) {
      return res.status(402).json({ error: "Premium subscription validation required to view this focus deck." });
    }

    const targetPool = taskMatrix[lowerCategory];
    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: "Focus Area pool mapping mismatch." });
    }

    const randomTaskIndex = Math.floor(Math.random() * targetPool.length);
    let selectedTaskData = targetPool[randomTaskIndex];

    let finalTaskText = selectedTaskData.text;
    if (friction === 'scroll' && lowerCategory === 'charisma') {
      finalTaskText = "⚡ INTERCEPTION: " + finalTaskText + " Look up from the rectangle right now and engage your physical reality.";
    } else if (friction === 'paralysis' && lowerCategory === 'overwhelm') {
      finalTaskText = "🧠 BREAK OUT: " + finalTaskText + " Bypassing decision paralysis starts with executing this 120-second step.";
    }

    return res.status(200).json({ 
      task: {
        text: finalTaskText,
        metricLabel: selectedTaskData.label || selectedTaskData.metricLabel || "Impact",
        rating: selectedTaskData.rating || 3
      }
    });
  } catch (error) {
    console.error("Task Engine Failure:", error);
    return res.status(500).json({ error: "Internal processing pipeline failure.", details: error.message });
  }
};
