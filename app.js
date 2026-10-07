// Neuro-calibrated text arrays mapping to the core problem solutions
const taskDatabase = [
  "Do the single task you have been avoiding for exactly two minutes. Move right now. No choices, just execution.",
  "Roll your shoulders completely back, step away from the desk, and stand fully tall. Force a clean neurological change of state.",
  "Invert your phone screen face down right now. Sit in continuous, total quiet breathing until the system chimes zero.",
  "Locate one piece of physical friction or clutter in your visual field. Trash it or store it out of sight immediately.",
  "Drink a full clean glass of water right now. Clear away physical systemic sludge and re-anchor attention fields.",
  "Isolate one capability you brought to the table this week. Write it down or state it out loud without comparing it to anyone.",
  "Take three deliberate, ultra-slow abdominal breaths. Lock focus onto the movement of your lungs. Clear the static."
];

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Momentum is yours.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

let isPremiumSelected = false;
let countdownInterval = null;
let currentStreak = parseInt(localStorage.getItem('nudge_streak') || '0');
let totalMinutesSaved = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

// Initial metric interface deployment bootstrap
document.addEventListener("DOMContentLoaded", () => {
  updateMetricDashboard();
});

function updateMetricDashboard() {
  document.getElementById('stat-streaks').innerText = currentStreak;
  document.getElementById('stat-focus').innerText = totalMinutesSaved.toFixed(1) + 'm';
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  // UX Optimization: Reset trigger screen strings if returning to start
  if(screenId === 'screen-trigger') {
    document.getElementById('trigger-instructions').innerText = "Take one slow, long breath before pushing.";
    document.querySelector('.big-red-btn').innerText = "START";
  }
}

function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectDeck(el, isPremium) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  
  const deckName = el.querySelector('.deck-name').innerText;
  document.getElementById('active-deck-title').innerText = deckName;
}

function startTriggerPhase() {
  if (isPremiumSelected) {
    document.getElementById('paywall-overlay').classList.add('active');
  } else {
    switchScreen('screen-trigger');
  }
}

function closePaywall() {
  document.getElementById('paywall-overlay').classList.remove('active');
}

function selectTier(el) {
  document.querySelectorAll('.tier-box').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function simulatePurchase() {
  alert("Premium Access Initialized! Algorithmic interceptor systems unlocked.");
  isPremiumSelected = false; 
  closePaywall();
  switchScreen('screen-trigger');
}

/**
 * Mindful Friction Interception Pattern (Inspired by One Sec app dynamics)
 */
function executeTurnaroundSpin() {
  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  
  btn.innerText = "HOLD...";
  instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";
  
  // Variable sensory feedback timing to stop impulsive looping choices
  setTimeout(() => {
    const randomTask = taskDatabase[Math.floor(Math.random() * taskDatabase.length)];
    document.getElementById('target-task-text').innerText = randomTask;
    
    switchScreen('screen-countdown');
    startActionTimer(120); 
  }, 1500);
}

function startActionTimer(seconds) {
  const display = document.getElementById('timer-display');
  let timeLeft = seconds;

  clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    secs = secs < 10 ? "0" + secs : secs;

    display.innerText = `${minutes}:${secs}`;

    if (--timeLeft < 0) {
      clearInterval(countdownInterval);
      triggerVictoryPhase(2.0); // Full 2 minutes saved allocation
    }
  }, 1000);
}

function finishEarly() {
  // UX Calibration: Calculate exactly how much active friction time was intercepted early
  const displayVal = document.getElementById('timer-display').innerText;
  const parts = displayVal.split(':');
  const elapsedSeconds = 120 - (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10));
  const elapsedMinutes = Math.max(0.2, elapsedSeconds / 60);

  clearInterval(countdownInterval);
  triggerVictoryPhase(elapsedMinutes);
}

function cancelTimer() {
  clearInterval(countdownInterval);
  currentStreak = 0; // Penalize behavior drop tracking to encourage platform value stickiness
  localStorage.setItem('nudge_streak', '0');
  updateMetricDashboard();
  switchScreen('screen-dashboard');
}

function triggerVictoryPhase(minutesEarned) {
  // Pick structural identity copy variant
  const copy = victoryValidationStrings[Math.floor(Math.random() * victoryValidationStrings.length)];
  document.getElementById('victory-validation-copy').innerText = copy;
  
  // Increment state variables
  currentStreak += 1;
  totalMinutesSaved += minutesEarned;
  
  localStorage.setItem('nudge_streak', currentStreak.toString());
  localStorage.setItem('nudge_minutes', totalMinutesSaved.toString());
  
  switchScreen('screen-victory');
  
  try {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
    }
  } catch (e) {
    console.log(e);
  }
}

function claimRewardStack() {
  updateMetricDashboard();
  switchScreen('screen-dashboard');
}
