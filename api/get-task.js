```javascript
// api/get-task.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enforce CORS cross-origin security rules
  res.setHeader('Access-Control-Allow-Credentials', true);
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
    // Extract state variables passed by the front-end telemetry bundle
    const { category, friction } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Missing required category selection token." });
    }

    // Resolve path mapping securely under Vercel environment constraints
    const jsonPath = path.join(process.cwd(), 'api', 'tasks.json');
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    const taskMatrix = JSON.parse(fileContents);

    // Guard matching category fields inside data schema bounds
    const targetPool = taskMatrix[category.toLowerCase()];
    if (!targetPool || targetPool.length === 0) {
      return res.status(404).json({ error: "Focus Area category index mapping mismatch encountered." });
    }

    // Isolate a randomized element out of the 100-item sub-array
    const randomIndex = Math.floor(Math.random() * targetPool.length);
    let selectedTask = targetPool[randomIndex];

    // Context Modification: If specific friction targets match, append psychological context text anchors
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
}
