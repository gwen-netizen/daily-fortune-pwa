// api/get-task.js
const taskMatrix = require('./tasks.json');

module.exports = async function handler(req, res) {
  // Enforce CORS cross-origin security rules
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { category, friction } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Missing required category selection token." });
    }

    const targetPool = taskMatrix[category.toLowerCase()];
    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: "Focus Area category index mapping mismatch encountered." });
    }

    const randomIndex = Math.floor(Math.random() * targetPool.length);
    let selectedTask = targetPool[randomIndex];

    if (friction === 'scroll' && category === 'charisma') {
      selectedTask = "⚡ INTERCEPTION: " + selectedTask + " Look up from the rectangle right now and engage your physical reality.";
    } else if (friction === 'paralysis' && category === 'overwhelm') {
      selectedTask = "🧠 BREAK OUT: " + selectedTask + " Bypassing decision paralysis starts with executing this 120-second step.";
    }

    return res.status(200).json({ task: selectedTask });
  } catch (globalError) {
    console.error("Serverless Task Routing System Fault:", globalError);
    return res.status(500).json({ error: "Internal compilation pipeline failure.", details: globalError.message });
  }
};
