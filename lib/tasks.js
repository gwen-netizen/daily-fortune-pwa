/**
 * 120Reset Master Task Matrix (lib/tasks.js)
 * 
 * Configured Decks:
 * - The Charisma Deck: (Presence, Warmth, Vocal Authority, Biomechanics)
 * - The Financial Reset Deck: (Clarity, Impulsive Spending, Rewire, Micro-Wins)
 * - The Dopamine Swap Deck: (Sensory Grounding, Somatic Surges, Micro-Wins)
 * - The Overwhelm Deck: 4-Round Linear Decompression Pipeline
 */

const DECK_METADATA = {
  charisma: {
    name: 'The Charisma Deck',
    subheading: 'Command the room.',
    rounds: 1,
    multiplier: 1
  },
  wealth: {
    name: 'The Financial Reset Deck',
    subheading: 'Unlock financial clarity.',
    rounds: 1,
    multiplier: 1
  },
  financial_reset: {
    name: 'The Financial Reset Deck',
    subheading: 'Unlock financial clarity.',
    rounds: 1,
    multiplier: 1
  },
  dopamine: {
    name: '⚡ The Dopamine Swap Deck',
    subheading: 'Break the freeze instantly.',
    rounds: 1,
    multiplier: 1
  },
  overwhelm: {
    name: '🧠 The Anti-Overwhelm Deck',
    subheading: 'Shatter task paralysis.',
    rounds: 4,
    multiplier: 4 // 4x multiplier: 480 seconds (8.0 min)
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
    affirmation: "Anchoring your lower base eliminates nervous kinetic leakage and signals unshakeable physical stability.",
    frictionTags: ["task_paralysis", "mindless_scrolling"],
    environment: "anywhere"
  },
  {
    text: "Unclench your jaw, drop your tongue from the roof of your mouth, and soften your facial muscles.",
    focusArea: "Physical Posture & Biomechanics",
    affirmation: "Facial tension signals threat. A relaxed, neutral jaw reflects high-status ease and effortless emotional composure.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Fix your gaze at eye level on a single distant point across the room for 45 uninterrupted seconds.",
    focusArea: "Eye Contact & Steady Gaze",
    affirmation: "Calm, unhurried focal control triggers instant social gravity and commands presence.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  },
  {
    text: "Place your hand on your upper chest and hum a low, resonant tone on a slow 10-second exhale.",
    focusArea: "Vocal Authority & Resonance",
    affirmation: "A grounded chest resonance shifts speech out of high-pitch fight-or-flight cadence.",
    frictionTags: ["low_lethargy", "mindless_scrolling"],
    environment: "anywhere"
  }
];

const financialResetDeck = [
  {
    text: "Open your banking app, count to three looking only at your liquid balance, and close it immediately.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Micro-exposure to your numbers without interacting eliminates avoidant dread.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  },
  {
    text: "Place both hands flat on your physical payment card or wallet without opening it.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Tactile grounding bridges the gap between abstract financial anxiety and physical composure.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Identify one digital shopping tab, checkout bag, or saved cart item and close it immediately.",
    focusArea: "Focus Area: Impulsive Spending",
    affirmation: "Withholding an impulse buy is an immediate, compound deposit into personal autonomy.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Write down your single largest scheduled recurring bill and its due date on paper.",
    focusArea: "Focus Area: Financial Clarity",
    affirmation: "Externalizing upcoming obligations on paper strips your amygdala of ambient scarcity loops.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Audit your browser or phone auto-fill settings and delete one saved credit card.",
    focusArea: "Focus Area: Impulsive Spending",
    affirmation: "Adding physical friction between desire and checkout dismantles impulsive consumerism.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  }
];

const dopamineDeck = [
  {
    text: "Do 15 rapid vertical heel-drops or micro-jumps in place to flood your lower body with circulation.",
    focusArea: "Desk Play & Energy Surge",
    affirmation: "Somatic shock to large muscle groups shatters dopaminergic trance states instantly.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Splash cold water directly across your eyes and forehead for 10 seconds.",
    focusArea: "Sensory Shock & Awakening",
    affirmation: "The mammalian dive reflex slows autonomic racing and resets dopamine receptors.",
    frictionTags: ["mindless_scrolling", "task_paralysis"],
    environment: "anywhere"
  },
  {
    text: "Pick up the nearest textured object and trace its contours with full sensory awareness for 30 seconds.",
    focusArea: "Sensory Grounding",
    affirmation: "Concrete tactile inputs snap neural attention away from virtual simulation loops.",
    frictionTags: ["mindless_scrolling", "low_lethargy"],
    environment: "anywhere"
  },
  {
    text: "Clear every single non-essential item from your desk surface except your main work tool.",
    focusArea: "Quick Environmental Wins",
    affirmation: "Visual clutter creates subconscious micro-distractions that sap execution energy.",
    frictionTags: ["task_paralysis", "low_lethargy"],
    environment: "anywhere"
  }
];

const overwhelmDeck = [
  // 4 Rounds Pipeline for Mindless Scrolling
  {
    step: 1,
    friction: "mindless_scrolling",
    text: "Round 1/4: Shut your eyes. Inhale for 4 seconds, hold for 4, exhale for 4, hold empty for 4.",
    focusArea: "Round 1: Physiological Reset",
    affirmation: "Box breathing stops nervous system hyperarousal and terminates the feed loop.",
    frictionTags: ["mindless_scrolling"],
    environment: "anywhere"
  },
  {
    step: 2,
    friction: "mindless_scrolling",
    text: "Round 2/4: Scan and release tension in your forehead, jaw, and upper shoulders.",
    focusArea: "Round 2: Muscular Decompression",
    affirmation: "Dropping physical defense mechanisms signals safety to the autonomic system.",
    frictionTags: ["mindless_scrolling"],
    environment: "anywhere"
  },
  {
    step: 3,
    friction: "mindless_scrolling",
    text: "Round 3/4: Place your phone completely out of sight across the room or inside a drawer.",
    focusArea: "Round 3: Spatial Separation",
    affirmation: "Out of sight removes visual trigger cues from your subconscious field.",
    frictionTags: ["mindless_scrolling"],
    environment: "anywhere"
  },
  {
    step: 4,
    friction: "mindless_scrolling",
    text: "Round 4/4: Sit upright with panoramic vision and state out loud: 'I am back in the room.'",
    focusArea: "Round 4: Sovereign Re-Entry",
    affirmation: "You completed all 4 rounds. Full executive control is restored to your prefrontal cortex.",
    frictionTags: ["mindless_scrolling"],
    environment: "anywhere"
  },

  // 4 Rounds Pipeline for Task Paralysis
  {
    step: 1,
    friction: "task_paralysis",
    text: "Round 1/4: Take a sharp double-inhale through your nose, then a long audible sigh exhale.",
    focusArea: "Round 1: Autonomic Down-Regulation",
    affirmation: "Physiological sighs immediately re-expand alveoli and decrease cognitive dread.",
    frictionTags: ["task_paralysis"],
    environment: "anywhere"
  },
  {
    step: 2,
    friction: "task_paralysis",
    text: "Round 2/4: State aloud three physical items in the room right now (e.g. desk, window, lamp).",
    focusArea: "Round 2: Sensory Orientation",
    affirmation: "Orienting to physical reality pulls focus away from catastrophic internal rumination.",
    frictionTags: ["task_paralysis"],
    environment: "anywhere"
  },
  {
    step: 3,
    friction: "task_paralysis",
    text: "Round 3/4: Press your feet firmly into the floor and unclench your stomach muscles completely.",
    focusArea: "Round 3: Grounded Stability",
    affirmation: "Grounding your feet shuts down the physical freeze response.",
    frictionTags: ["task_paralysis"],
    environment: "anywhere"
  },
  {
    step: 4,
    friction: "task_paralysis",
    text: "Round 4/4: Write down only the single next physical micro-step (e.g. 'open blank document').",
    focusArea: "Round 4: Micro-Action Initiation",
    affirmation: "Action dissolves paralysis. You completed 4 rounds and established forward momentum.",
    frictionTags: ["task_paralysis"],
    environment: "anywhere"
  },

  // 4 Rounds Pipeline for Low Lethargy
  {
    step: 1,
    friction: "low_lethargy",
    text: "Round 1/4: Stand up, stretch both arms overhead as high as possible, and inhale deeply.",
    focusArea: "Round 1: Postural Activation",
    affirmation: "Vertical elongation signals alertness to your ascending reticular activating system.",
    frictionTags: ["low_lethargy"],
    environment: "anywhere"
  },
  {
    step: 2,
    friction: "low_lethargy",
    text: "Round 2/4: Shake your wrists and shoulders briskly for 20 seconds to disperse stagnation.",
    focusArea: "Round 2: Kinetic Discharge",
    affirmation: "Physical movement breaks systemic inertia far faster than cognitive willpower.",
    frictionTags: ["low_lethargy"],
    environment: "anywhere"
  },
  {
    step: 3,
    friction: "low_lethargy",
    text: "Round 3/4: Drink three large gulps of water and take three deep diaphragmatic breaths.",
    focusArea: "Round 3: Cellular Hydration",
    affirmation: "Hydration and oxygen intake instantly counter cognitive sluggishness.",
    frictionTags: ["low_lethargy"],
    environment: "anywhere"
  },
  {
    step: 4,
    friction: "low_lethargy",
    text: "Round 4/4: Sit down tall and set a timer for 10 minutes of low-expectation execution.",
    focusArea: "Round 4: Momentum Ignition",
    affirmation: "All 4 rounds complete. Your kinetic energy has bypassed lethargy.",
    frictionTags: ["low_lethargy"],
    environment: "anywhere"
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

/**
 * Universal Task Extractor matching both Deck and Friction Line
 */
function getTasksByFriction(deckKey, friction, filterOptions = {}) {
  let key = deckKey;
  if (key === 'financial-reset' || key === 'financial_freeze_impulse' || key === 'financial_freeze' || key === 'wealth') {
    key = 'wealth';
  }

  const deck = taskMatrix[key] || taskMatrix.charisma;
  if (!deck || deck.length === 0) return [];

  // Special sequential handling for Overwhelm Deck steps
  if (key === 'overwhelm') {
    const stepNum = filterOptions.step ? parseInt(filterOptions.step, 10) : 1;
    let stepMatches = deck.filter(task => {
      const matchFriction = friction ? task.frictionTags.includes(friction) : true;
      const matchStep = task.step === stepNum;
      return matchFriction && matchStep;
    });

    if (stepMatches.length === 0) {
      stepMatches = deck.filter(task => task.step === stepNum);
    }
    return stepMatches.length > 0 ? stepMatches : [deck[0]];
  }

  // Standard decks: filter strictly by the selected friction tag
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

function getRandomTask(deckKey, friction, filterOptions = {}) {
  const tasks = getTasksByFriction(deckKey, friction, filterOptions);
  if (!tasks || tasks.length === 0) {
    return {
      text: "Take a deep breath and center your focus for the next 120 seconds.",
      focusArea: "Focus Reset",
      affirmation: "Action clears anxiety."
    };
  }
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
