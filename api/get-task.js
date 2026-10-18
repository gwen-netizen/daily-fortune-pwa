// api/get-task.js
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
    const { category, friction, email, step } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: "Missing required category parameter." });
    }

    const lowerCategory = category.toLowerCase();
    const isPremiumDeck = (lowerCategory === 'dopamine' || lowerCategory === 'overwhelm');

    let userProfile = null;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (cleanEmail && cleanEmail !== 'anonymous_tester') {
      const { data } = await supabase
        .from('user_profiles')
        .select('premium_user, pass_expires_at')
        .ilike('email', cleanEmail)
        .limit(1);
      
      userProfile = data && data.length > 0 ? data[0] : null;
    }

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

    let selectedTaskData;

    // --- OVERWHELM DECK SEQUENTIAL ENGINE (CARDS 1-4) ---
    if (lowerCategory === 'overwhelm') {
      const targetStep = parseInt(step, 10) || 1;
      
      // Match friction track if provided (e.g. task_paralysis, mindless_scrolling)
      let pool = targetPool;
      if (friction) {
        const filtered = targetPool.filter(t => t.frictionTags && t.frictionTags.includes(friction));
        if (filtered.length > 0) pool = filtered;
      }
      
      selectedTaskData = pool.find(t => t.step === targetStep) || pool[targetStep - 1] || pool[0];
    } else {
      // Standard random draw for all other decks
      const randomTaskIndex = Math.floor(Math.random() * targetPool.length);
      selectedTaskData = targetPool[randomTaskIndex];
    }

    return res.status(200).json({ 
      task: {
        text: selectedTaskData.text,
        focusArea: selectedTaskData.focusArea || selectedTaskData.label || "Core Biomechanics",
        affirmation: selectedTaskData.affirmation || selectedTaskData.text,
        step: selectedTaskData.step || 1
      }
    });
  } catch (error) {
    console.error("Task Engine Failure:", error);
    return res.status(500).json({ error: "Internal processing pipeline failure.", details: error.message });
  }
};
