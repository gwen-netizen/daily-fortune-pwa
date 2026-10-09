import { createClient } from '@supabase/supabase-js';
import taskMatrix from './tasks.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { category, friction, email, device_id } = req.query;
    
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
        .select('premium_user, seen_task_history, active_device_id')
        .eq('email', cleanEmail)
        .maybeSingle();
      
      userProfile = data;
    }

    // Single Active Device Verification
    if (userProfile && userProfile.active_device_id && device_id && userProfile.active_device_id !== device_id) {
      return res.status(409).json({ 
        error: "Session Expired: Your account was accessed on another device.",
        code: "DEVICE_MISMATCH"
      });
    }

    const isPremiumUser = userProfile ? userProfile.premium_user : false;

    if (isPremiumDeck && !isPremiumUser) {
      return res.status(402).json({ error: "Premium subscription validation required to view this focus deck." });
    }

    const targetPool = taskMatrix[lowerCategory];
    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: "Focus Area pool mapping mismatch." });
    }

    let historyMap = (userProfile && userProfile.seen_task_history) ? userProfile.seen_task_history : {};
    if (!historyMap[lowerCategory]) {
      historyMap[lowerCategory] = [];
    }

    let availableIndices = [];
    for (let i = 0; i < targetPool.length; i++) {
      if (!historyMap[lowerCategory].includes(i)) {
        availableIndices.push(i);
      }
    }

    if (availableIndices.length === 0 || historyMap[lowerCategory].length >= 100) {
      historyMap[lowerCategory] = [];
      availableIndices = Array.from({ length: targetPool.length }, (_, i) => i);
    }

    const randomPoolIndex = Math.floor(Math.random() * availableIndices.length);
    const targetTaskIndex = availableIndices[randomPoolIndex];
    let selectedTaskData = targetPool[targetTaskIndex];

    historyMap[lowerCategory].push(targetTaskIndex);

    if (userProfile && cleanEmail && cleanEmail !== 'anonymous_tester') {
      await supabase
        .from('user_profiles')
        .update({ seen_task_history: historyMap })
        .eq('email', cleanEmail);
    }

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
    return res.status(500).json({ error: "Internal processing pipeline failure.", details: error.message });
  }
}
