/**
 * 120Reset Master Task Aggregator (lib/tasks.js)
 */

const {
  CORE_DECK_METADATA,
  charismaDeck,
  financialResetDeck
} = require('./tasks-core.js');

const {
  PREMIUM_DECK_METADATA,
  dopamineDeck,
  overwhelmDeck
} = require('./tasks-premium.js');

const DECK_METADATA = {
  ...CORE_DECK_METADATA,
  ...PREMIUM_DECK_METADATA
};

const taskMatrix = {
  charisma: charismaDeck,
  charismaDeck: charismaDeck,
  wealth: financialResetDeck,
  financial_reset: financialResetDeck,
  financialResetDeck: financialResetDeck,
  financial_freeze_impulse: financialResetDeck,
  dopamine: dopamineDeck,
  dopamineDeck: dopamineDeck,
  overwhelm: overwhelmDeck,
  overwhelmDeck: overwhelmDeck
};

function getTasksByFriction(deckKey, friction, filterOptions = {}) {
  let key = (deckKey || 'charisma').toLowerCase();
  if (key === 'wealth' || key === 'financial-reset' || key === 'financial_freeze' || key === 'financial_freeze_impulse') {
    key = 'financial_reset';
  }

  const deck = taskMatrix[key] || taskMatrix[deckKey] || charismaDeck;
  if (!deck || deck.length === 0) return [];

  if (key === 'overwhelm') {
    const stepNum = filterOptions.step ? parseInt(filterOptions.step, 10) : 1;
    let pool = deck;
    if (friction) {
      const filtered = deck.filter(task => Array.isArray(task.frictionTags) && task.frictionTags.includes(friction));
      if (filtered.length > 0) pool = filtered;
    }
    const stepTask = pool.find(task => task.step === stepNum) || pool[stepNum - 1] || pool[0];
    return [stepTask];
  }

  const matched = deck.filter(task => {
    if (Array.isArray(task.frictionTags)) {
      const matchesFriction = friction ? task.frictionTags.includes(friction) : true;
      const matchesEnv = filterOptions.environment
        ? task.environment === filterOptions.environment
        : true;
      return matchesFriction && matchesEnv;
    }
    return true;
  });

  return matched.length > 0 ? matched : deck;
}

function getRandomTask(deckKey, friction, filterOptions = {}) {
  const tasks = getTasksByFriction(deckKey, friction, filterOptions);
  if (!tasks || tasks.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * tasks.length);
  return tasks[randomIndex];
}

module.exports = {
  DECK_METADATA,
  taskMatrix,
  charisma: charismaDeck,
  charismaDeck,
  wealth: financialResetDeck,
  financial_reset: financialResetDeck,
  financialResetDeck,
  dopamine: dopamineDeck,
  dopamineDeck,
  overwhelm: overwhelmDeck,
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
