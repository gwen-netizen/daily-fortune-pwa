const { createClient } = require('@supabase/supabase-js');
const taskMatrix = require('../lib/tasks.js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://rwrwppyhatzflivzgwve.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { category, friction, email, step, seen, lastFocusArea } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: "Missing required category parameter." });
    }

    let lowerCategory = category.toLowerCase();
    if (['financial-reset', 'financial_freeze_impulse', 'financial_freeze', 'financial_reset'].includes(lowerCategory)) {
      lowerCategory = 'wealth';
    }

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
        await supabase
          .from('user_profiles')
          .update({ premium_user: false, pass_expires_at: null })
          .ilike('email', cleanEmail);

        userProfile.premium_user = false;
        userProfile.pass_expires_at = null;
      } else {
        userProfile.premium_user = true;
      }
    }

    const isPremiumUser = Boolean(userProfile && userProfile.premium_user);

    if (isPremiumDeck && !isPremiumUser) {
      return res.status(402).json({ error: "Premium subscription validation required for this focus deck." });
    }

    const targetPool = taskMatrix[lowerCategory];
    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: "Focus Area pool mapping mismatch." });
    }

    let selectedTaskData;
    let selectedOriginalIndex = 0;
    let historyReset = false;

    if (lowerCategory === 'overwhelm') {
      const targetStep = parseInt(step, 10) || 1;
      const stepCandidates = targetPool.map((t, idx) => ({ ...t, originalIndex: idx })).filter(t => t.step === targetStep);
      
      let pool = stepCandidates;
      if (friction) {
        const filtered = stepCandidates.filter(t => Array.isArray(t.frictionTags) && t.frictionTags.includes(friction));
        if (filtered.length > 0) pool = filtered;
      }

      const randomIdx = Math.floor(Math.random() * pool.length);
      selectedTaskData = pool[randomIdx] || stepCandidates[0] || targetPool[0];
      selectedOriginalIndex = selectedTaskData.originalIndex || 0;
    } else {
      let candidatesWithIdx = targetPool.map((t, idx) => ({ ...t, originalIndex: idx }));
      
      if (friction) {
        const filtered = candidatesWithIdx.filter(t => Array.isArray(t.frictionTags) && t.frictionTags.includes(friction));
        if (filtered.length > 0) candidatesWithIdx = filtered;
      }

      const seenSet = new Set();
      if (seen) {
        seen.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)).forEach(n => seenSet.add(n));
      }

      let unseen = candidatesWithIdx.filter(t => !seenSet.has(t.originalIndex));

      if (unseen.length === 0) {
        unseen = candidatesWithIdx;
        historyReset = true;
      }

      let diverseCandidates = unseen;
      if (lastFocusArea) {
        const cleanLast = lastFocusArea.replace(/^(focus\s*area\s*[:\-–—]?\s*)+/i, '').trim().toLowerCase();
        const differentFocus = unseen.filter(t => {
          const tArea = (t.focusArea || '').replace(/^(focus\s*area\s*[:\-–—]?\s*)+/i, '').trim().toLowerCase();
          return tArea && tArea !== cleanLast;
        });
        if (differentFocus.length > 0) {
          diverseCandidates = differentFocus;
        }
      }

      const pickIndex = Math.floor(Math.random() * diverseCandidates.length);
      selectedTaskData = diverseCandidates[pickIndex];
      selectedOriginalIndex = selectedTaskData.originalIndex;
    }

    const rawFocusArea = selectedTaskData.focusArea || selectedTaskData.label || "Core Biomechanics";
    const cleanFocusArea = rawFocusArea.replace(/^(focus\s*area\s*[:\-–—]?\s*)+/i, '').trim();

    return res.status(200).json({ 
      taskIndex: selectedOriginalIndex,
      historyReset: historyReset,
      task: {
        text: selectedTaskData.text,
        focusArea: cleanFocusArea,
        affirmation: selectedTaskData.affirmation || selectedTaskData.text,
        step: selectedTaskData.step || 1
      }
    });
  } catch (error) {
    console.error("Task Engine Error:", error);
    return res.status(500).json({ error: "Internal processing failure.", details: error.message });
  }
};
