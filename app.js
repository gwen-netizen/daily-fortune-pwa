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
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

let isPremiumSelected = false;
let countdownInterval = null;
let mindFrictionStyle = 'scroll'; // Tracks Screen 2 profile choices: 'scroll', 'paralysis', 'routine'

// METRIC STATE FRAME: Tracks your new premium rebrand parameter values safely across reloads
let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

// High-reliability page setup engine load sequence
document.addEventListener("DOMContentLoaded", () => {
  updateMetricDashboard();
  checkStripeRedirectStatus();
  applyPremiumUIVisuals(); // Checks authorization and handles menu aesthetics instantly
});

/**
 * Metric Scaling Engine: Automatically scales presentation layout from 'min' to 'hr' based on volume milestones
 */
function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  
  if (streaksEl && focusEl) {
    streaksEl.innerText = totalWinsCount;
    
    if (totalFocusReclaimed < 60) {
      // Presentation under 1 hour baseline milestone metrics
      focusEl.innerText = totalFocusReclaimed.toFixed(1) + ' min';
    } else {
      // Progressive presentation transformation to Hours metric frames
      const hoursScaled = totalFocusReclaimed / 60;
      focusEl.innerText = hoursScaled.toFixed(1) + ' hr';
    }
  }
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  if (screenId === 'screen-trigger') {
    const instructions = document.getElementById('trigger-instructions');
    const spinBtn = document.querySelector('.big-red-btn');
    if (instructions) instructions.innerText = "Take one slow, long breath before pushing.";
    if (spinBtn) spinBtn.innerText = "START";
  }
}

/**
 * Maps Screen 2 selection metrics cleanly down to behavioral engine context labels
 */
function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  
  const textContent = el.querySelector('.option-title').innerText;
  if (textContent.includes("Scrolling")) mindFrictionStyle = 'scroll';
  else if (textContent.includes("Paralysis")) mindFrictionStyle = 'paralysis';
  else mindFrictionStyle = 'routine';
}

function selectDeck(el, isPremium) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  
  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) {
    const deckName = el.querySelector('.deck-name').innerText;
    deckTitleEl.innerText = deckName;
  }
}

/**
 * Intercepts deck routing selection and verifies active subscription access authorizations
 */
function startTriggerPhase() {
  // HIGH-RELIABILITY AUTH ENGINE: Checks browser local storage token values
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';

  if (isPremiumSelected && !isUserPremium) {
    // If the tier is premium and user has NOT paid, activate lock paywall overlay view frame
    const paywall = document.getElementById('paywall-overlay');
    if (paywall) paywall.classList.add('active');
  } else {
    // Standard bypass loop: If it's a free tier OR paid user is active, forward cleanly onto the spin wheel
    switchScreen('screen-trigger');
  }
}

function closePaywall() {
  const paywall = document.getElementById('paywall-overlay');
  if (paywall) paywall.classList.remove('active');
}

function selectTier(el) {
  document.querySelectorAll('.tier-box').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

/**
 * Strips lock emoji design components if user is authorized inside local profile cache logs
 */
function applyPremiumUIVisuals() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';
  
  if (isUserPremium) {
    document.querySelectorAll('.deck-item').forEach(item => {
      const meta = item.querySelector('.deck-meta');
      const name = item.querySelector('.deck-name');
      
      if (meta && meta.innerText.includes("PREMIUM UPGRADE")) {
        meta.innerText = "UNLOCKED PREMIUM AREA";
        meta.style.color = "var(--success-color)";
        // Strips out text lock string glyph markers smoothly into success checkmarks
        if (name) {
          name.innerText = name.innerText.replace('⚡ ', '✅ ').replace('🧠 ', '✅ ');
        }
      }
    });
  }
}

/**
 * Functional Route Engine linking the frontend Paywall Selection seamlessly to Stripe Checkout
 */
async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) {
    alert("Please select a tracking tier to continue.");
    return;
  }

  const isLifetime = selectedTierBox.innerText.includes("Lifetime");
  const paywallBtn = document.querySelector('.paywall-modal .btn-primary');
  const originalText = paywallBtn ? paywallBtn.innerText : "Upgrade Mindset Portfolio";
  
  if (paywallBtn) {
    paywallBtn.innerText = "INITIALIZING SECURE GATEWAY...";
    paywallBtn.style.opacity = "0.7";
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: isLifetime ? 'lifetime' : 'monthly',
        successUrl: window.location.origin + '/?session=success',
        cancelUrl: window.location.origin
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERVER LOG INFRASTRUCTURE ERROR [Status ${response.status}]:`, errorText);
      throw new Error(`Server returned status ${response.status}: ${errorText}`);
    }

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error(session.error || "Failed to generate dynamic session payload.");
    }
  } catch (paymentError) {
    console.error("Stripe Checkout Session routing failure details:", paymentError);
    alert(`Gateway Error: ${paymentError.message}. Open browser inspect console for full stack trace parameters.`);
    
    if (paywallBtn) {
      paywallBtn.innerText = originalText;
      paywallBtn.style.opacity = "1";
    }
  }
}

/**
 * Handles validation status parameter checks when landing back from Stripe domains
 */
function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    localStorage.setItem('nudge_premium_user', 'true');
    alert("Premium Portfolio Active! Algorithmic intercepts completely unlocked.");
    
    // Dynamically updates UI without requiring a hard window reload routine
    applyPremiumUIVisuals();
    
    window.history.replaceState({}, document.title, window.location.pathname);
    switchScreen('screen-dashboard');
  }
}

/**
 * Variable Reward Core: Sends asynchronous tracking requests to fetch one task programmatically from the 400 matrix
 */
async function executeTurnaroundSpin() {
  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  
  if (btn) {
    btn.innerText = "HOLD...";
    btn.style.opacity = "0.6";
  }
  if (instruction) {
    instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";
  }

  const activeDeckName = document.getElementById('active-deck-title').innerText.toLowerCase();
  let categoryKey = 'charisma';
  if (activeDeckName.includes("wealth")) categoryKey = 'wealth';
  else if (activeDeckName.includes("dopamine")) categoryKey = 'dopamine';
  else if (activeDeckName.includes("overwhelm")) categoryKey = 'overwhelm';

  try {
    const response = await fetch(`/api/get-task?category=${categoryKey}&friction=${mindFrictionStyle}`);
    const data = await response.json();

    setTimeout(() => {
      if (btn) {
        btn.innerText = "START";
        btn.style.opacity = "1";
      }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      if (taskDisplayEl && data.task) {
        taskDisplayEl.innerText = data.task;
      } else {
        taskDisplayEl.innerText = "Do the single task you have been avoiding for exactly two minutes. Move right now.";
      }
      
      switchScreen('screen-countdown');
      startActionTimer(120); 
}, 1500);
} catch (err) {
console.error("Task payload transport error:", err);
switchScreen('screen-dashboard');
}
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
if (display) display.innerText = minutes + ":" + secs;
if (--timeLeft < 0) {
clearInterval(countdownInterval);
triggerVictoryPhase(2.0);
}
}, 1000);
}
function finishEarly() {
const displayEl = document.getElementById('timer-display');
let elapsedMinutes = 2.0;
if (displayEl) {
const displayVal = displayEl.innerText;
const parts = displayVal.split(':');
if (parts.length === 2) {
const currentMinutesVal = parseInt(parts[0], 10) || 0;
const currentSecondsVal = parseInt(parts[1], 10) || 0;
const elapsedSeconds = 120 - (currentMinutesVal * 60 + currentSecondsVal);
elapsedMinutes = Math.max(0.2, elapsedSeconds / 60);
}
}
clearInterval(countdownInterval);
triggerVictoryPhase(elapsedMinutes);
}
function cancelTimer() {
clearInterval(countdownInterval);
updateMetricDashboard();
switchScreen('screen-dashboard');
}
function triggerVictoryPhase(minutesEarned) {
const copy = victoryValidationStrings[Math.floor(Math.random() * victoryValidationStrings.length)];
const validationCopyEl = document.getElementById('victory-validation-copy');
if (validationCopyEl) validationCopyEl.innerText = copy;
totalWinsCount += 1;
totalFocusReclaimed += minutesEarned;
localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
localStorage.setItem('nudge_minutes', totalFocusReclaimed.toString());
try {
const audioNode = document.getElementById('victory-chime');
if (audioNode) {
audioNode.currentTime = 0;
audioNode.play().catch(err => console.log("Audio presentation skipped:", err));
}
} catch (audioError) {
console.warn("Audio catch execution layer bypassed:", audioError);
}
switchScreen('screen-victory');
try {
if (typeof confetti === 'function') {
confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
}
} catch (e) {
console.log("Confetti library processing bypass:", e);
}
}
function claimRewardStack() {
updateMetricDashboard();
switchScreen('screen-dashboard');
}
