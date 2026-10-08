// api/get-task.js
const taskMatrix = require('./tasks.json');

module.exports = async function handler(req, res) {
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

    const categoryKey = category.toLowerCase();
    const targetPool = taskMatrix[categoryKey];

    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: `Category '${categoryKey}' mapping not found in task matrix.` });
    }

    const randomIndex = Math.floor(Math.random() * targetPool.length);
    let selectedTask = targetPool[randomIndex];

    if (friction === 'scroll') {
      selectedTask = "⚡ INTERCEPTION: " + selectedTask;
    } else if (friction === 'paralysis') {
      selectedTask = "🧠 BREAK OUT: " + selectedTask;
    } else if (friction === 'routine') {
      selectedTask = "🌱 GROUNDING: " + selectedTask;
    }

    return res.status(200).json({ task: selectedTask, category: categoryKey });
  } catch (globalError) {
    console.error("Serverless Task Routing System Fault:", globalError);
    return res.status(500).json({ error: "Internal compilation pipeline failure.", details: globalError.message });
  }
};
