// Pool of curated tasks mapped to lower executive friction requirements
const taskDatabase = [
  "Do the thing you've been avoiding for just two minutes. Feel the absolute win of breaking the friction line.",
  "Roll your shoulders cleanly back and stand completely tall. Head up, chest wide open. Let your physical stance re-wire focus.",
  "Put your screen completely away for the remaining countdown time. Sit in absolute stillness and listen to the environment background.",
  "Clear off your immediate desk array. Snatch one loose piece of visual clutter and drop it directly into the bin.",
  "Drink a complete glass of pure water immediately. Re-hydrate your system and trigger a fresh metabolic physical reset.",
  "Write down or mentally lock in one thing you are genuinely excellent at doing. Do not compare it or reduce it for anyone.",
  "Take three deep abdominal breaths right now. Hold at the top for three counts, then let it clear away structural nervous stress."
];

let selectedDeckElement = null;
let isPremiumSelected = false;
let countdownInterval = null;

/**
 * Screen state machine swapper
 */
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/**
 * Handles choices within onboarding steps
 */
function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

/**
 * Tracks premium hooks vs free deck configs
 */
function selectDeck(el, isPremium) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  
  const deckName = el.querySelector('.deck-name').innerText;
  document.getElementById('active-deck-title').innerText = deckName;
}

/**
 * Intercepts selection process with a premium paywall modal if needed
 */
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

/**
 * Resolves paywall states on mock purchase execution
 */
function simulatePurchase() {
  alert("Subscription integrated. Premium decks unlocked successfully for sandbox deployment!");
  isPremiumSelected = false; 
  closePaywall();
  switchScreen('screen-trigger');
}

/**
 * Leverages latency intervals to produce variable reward mechanics (Slot Machine Shuffle)
 */
function executeTurnaroundSpin() {
  const btn = document.querySelector('.big-red-btn');
  btn.innerText = "SHUFFLING...";
  btn.style.opacity = "0.6";

  // Intentional 1.2s delay to maximize anticipation loops
  setTimeout(() => {
    btn.innerText = "SPIN";
    btn.style.opacity = "1";
    
    const randomTask = taskDatabase[Math.floor(Math.random() * taskDatabase.length)];
    document.getElementById('target-task-text').innerText = randomTask;
    
    switchScreen('screen-countdown');
    startActionTimer(120); // Initialize 2-minute countdown execution
  }, 1200);
}

/**
 * Core 2-minute live timer clock logic
 */
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
      triggerVictoryPhase();
    }
  }, 1000);
}

/**
 * Instantly intercepts the running clock when user finishes the activity early
 */
function finishEarly() {
  clearInterval(countdownInterval);
  triggerVictoryPhase();
}

function cancelTimer() {
  clearInterval(countdownInterval);
  switchScreen('screen-dashboard');
}

/**
 * Programmatic global check for canvas-confetti initialization
 */
function triggerVictoryPhase() {
  switchScreen('screen-victory');
  
  try {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A373', '#4A7C59', '#2D2B2A']
      });
    } else if (window.confetti) {
      window.confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A373', '#4A7C59', '#2D2B2A']
      });
    }
  } catch (error) {
    console.warn("Confetti resource initialization caught by server environment wrapper:", error);
  }
}
