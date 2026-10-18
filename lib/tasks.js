/**
 * 120Reset Master Task Matrix (lib/tasks.js)
 * 
 * Configured Decks:
 *  - The Charisma Deck ("Command the room.")
 *  - The Financial Reset Deck ("Unlock financial clarity.")
 *  - The Dopamine Swap Deck ("Break the freeze instantly.")
 *  - The Anti-Overwhelm Deck ("Shatter task paralysis.")
 */

const DECK_METADATA = {
  charisma: {
    name: 'The Charisma Deck',
    subheading: 'Command the room.',
    multiplier: 1,
    rounds: 1
  },
  wealth: {
    name: 'The Financial Reset Deck',
    subheading: 'Unlock financial clarity.',
    multiplier: 1,
    rounds: 1
  },
  financial_reset: {
    name: 'The Financial Reset Deck',
    subheading: 'Unlock financial clarity.',
    multiplier: 1,
    rounds: 1
  },
  dopamine: {
    name: '⚡ The Dopamine Swap Deck',
    subheading: 'Break the freeze instantly.',
    multiplier: 1,
    rounds: 1
  },
  overwhelm: {
    name: '🧠 The Anti-Overwhelm Deck',
    subheading: 'Shatter task paralysis.',
    multiplier: 4, // 4x Focus Reclaimed for 4 completed rounds
    rounds: 4
  }
};

const charismaDeck = [
  {
    text: "Pull your shoulder blades gently together and open your chest for 10 seconds.",
    focusArea: "Physical Posture & Biomechanics",
    affirmation: "Primates hunch to protect organs; charismatic leaders expose their torso because they fear nothing.",
    frictionTags: ["low_lethargy", "mindless_scrolling"],
    environment: "anywhere"
  },
  {
    text: "Plant both feet flat on the floor, shoulder-width apart, and eliminate all swaying or shuffling.",
    focusArea: "Physical Posture & Biomechanics",
    affirmation: "Anchoring your lower base eliminates nervous kinetic leakage and signals unshakeable stability.",
    frictionTags: ["task_paralysis", "mindless_scrolling"],
    environment: "anywhere"
  },
  {
    text: "Unclench your jaw, drop your tongue from the roof of your mouth, and soften your facial muscles.",
    focusArea: "Physical Posture & Biomechanics",
    affirmation: "Facial tension signals threat. A relaxed, neutral jaw reflects effortless emotional composure.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Fix your gaze at eye level on a single distant point across the room for 45 uninterrupted seconds.",
    focusArea: "Eye Contact & Steady Gaze",
    affirmation: "Calm, unhurried focal control triggers instant social gravity and presence.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  }
];

const financialResetDeck = [
  {
    text: "Open your banking app, look at your liquid balance for three seconds, and close it immediately.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Micro-exposure to your numbers without interacting eliminates avoidant dread.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  },
  {
    text: "Place both hands flat on your physical payment card or wallet without opening it.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Tactile grounding bridges the gap between abstract financial panic and concrete reality.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Identify one item currently in a digital shopping cart or wishlist and close the tab.",
    focusArea: "Focus Area: Impulsive Spending",
    affirmation: "Every withheld impulse purchase is an immediate high-yield deposit into your sovereignty.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Write down your single largest scheduled recurring bill and its due date on paper.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Externalizing upcoming obligations strips the nervous system of ambient money anxiety.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  }
];

const dopamineDeck = [
  {
    text: "Do 15 rapid vertical heel-drops or micro-jumps in place to flood your calves with blood.",
    focusArea: "Desk Play & Energy Surge",
    affirmation: "Physiological shock to large muscle groups breaks dopaminergic trance states instantly.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Splash freezing cold water directly on your eyes and temples for 10 seconds.",
    focusArea: "Energy Surge & Reset",
    affirmation: "The mammalian dive reflex slows racing heart rates and resets autonomic arousal.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  },
  {
    text: "Find the nearest physical object with intense texture and run your fingertips over it slowly.",
    focusArea: "Sensory Grounding",
    affirmation: "Tangible tactile feedback pulls dopamine circuits out of digital simulation loops.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Clear every single item off your immediate desk surface except your primary tool.",
    focusArea: "Quick Wins",
    affirmation: "Visual clutter is an ambient dopamine leak. A clear surface commands immediate execution.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  }
];

const overwhelmDeck = [
  {
    text: "Round 1/4: Exhale all air, double-inhale sharply through the nose, and sigh out for 6 seconds.",
    focusArea: "Step 1: Autonomic Down-Regulation",
    affirmation: "Two rapid inhales followed by an extended exhale re-opens collapsed alveoli in the lungs.",
    frictionTags: ["mindless_scrolling", "task_paralysis", "low_lethargy"],
    environment: "anywhere",
    roundIndex: 1
  },
  {
    text: "Round 2/4: Name three physical objects in your immediate room out loud.",
    focusArea: "Step 2: Sensory Orientation",
    affirmation: "Naming external objects shifts neural activity from the amygdala to the prefrontal cortex.",
    frictionTags: ["mindless_scrolling", "task_paralysis", "low_lethargy"],
    environment: "anywhere",
    roundIndex: 2
  },
  {
    text: "Round 3/4: Drop your shoulders, unclench your stomach, and press both heels firmly into the ground.",
    focusArea: "Step 3: Somatic Anchoring",
    affirmation: "Physical anchoring signals to your primal nervous system that immediate safety is restored.",
    frictionTags: ["mindless_scrolling", "task_paralysis", "low_lethargy"],
    environment: "anywhere",
    roundIndex: 3
  },
  {
    text: "Round 4/4: Write down only the single next physical micro-movement required for your task.",
    focusArea: "Step 4: Micro-Action Initiation",
    affirmation: "Overwhelm is contemplating the staircase; momentum is taking the first half-step.",
    frictionTags: ["mindless_scrolling", "task_paralysis", "low_lethargy"],
    environment: "anywhere",
    roundIndex: 4
  }
];

const taskMatrix = {
  charisma: charismaDeck,
  wealth: financialResetDeck,
  financial_reset: financialResetDeck,
  financial_freeze_impulse: financialResetDeck,
  dopamine: dopamineDeck,
  overwhelm: overwhelmDeck
};

function getTasksByFriction(deckKey, friction, filterOptions = {}) {
  // Normalize alias
  let key = deckKey;
  if (key === 'financial-reset' || key === 'financial_freeze_impulse' || key === 'financial_freeze' || key === 'wealth') {
    key = 'wealth';
  }

  const deck = taskMatrix[key] || taskMatrix.charisma;
  if (!deck || deck.length === 0) return [];

  // Filter tasks that include the selected friction tag
  const matched = deck.filter(task => {
    if (Array.isArray(task.frictionTags)) {
      const matchesFriction = friction ? task.frictionTags.includes(friction) : true;
      const matchesEnv = filterOptions.environment ? task.environment === filterOptions.environment : true;
      return matchesFriction && matchesEnv;
    }
    return true;
  });

  return matched.length > 0 ? matched : deck;
}

function getRandomTask(deckKey, friction) {
  const tasks = getTasksByFriction(deckKey, friction);
  const randomIndex = Math.floor(Math.random() * tasks.length);
  return tasks[randomIndex];
}

module.exports = {
  DECK_METADATA,
  taskMatrix,
  charismaDeck,
  financialResetDeck,
  dopamineDeck,
  overwhelmDeck,
  getTasksByFriction,
  getRandomTask
};

if (typeof window !== 'undefined') {
  window.DAILY_FORTUNE_TASKS = {
    DECK_METADATA,
    taskMatrix,
    getTasksByFriction,
    getRandomTask
  };
}
