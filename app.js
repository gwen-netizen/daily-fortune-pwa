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

// METRIC RETAINMENT LOAD: Shifted from single day-streaks to a cumulative Win Log ecosystem
let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalMinutesSaved = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

// Initial metric interface deployment bootstrap
document.addEventListener("DOMContentLoaded", () => {
  updateMetricDashboard();
  checkStripeRedirectStatus();
});

function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  
  // High-reliability structural guard checking elements exist before updating DOM strings
  if (streaksEl && focusEl) {
    streaksEl.innerText = totalWinsCount;
    focusEl.innerText = totalMinutesSaved.toFixed(1) + 'm';
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

function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
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

function startTriggerPhase() {
  if (isPremiumSelected) {
    const paywall = document.getElementById('paywall-overlay');
    if (paywall) paywall.classList.add('active');
  } else {
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

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error(session.error || "Failed to generate dynamic session payload.");
    }
  } catch (paymentError) {
    console.error("Stripe Checkout Session routing failure:", paymentError);
    alert("Could not initialize Stripe Session. Please ensure backend parameters are configured.");
    
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
    window.history.replaceState({}, document.title, window.location.pathname);
    switchScreen('screen-dashboard');
  }
}

function executeTurnaroundSpin() {
  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  
  if (btn) {
    btn.innerText = "HOLD...";
    btn.style.opacity = "0.6";
  }
  if (instruction) {
    instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";
  }
  
  setTimeout(() => {
    if (btn) {
      btn.innerText = "START";
      btn.style.opacity = "1";
    }
    
    const randomTask = taskDatabase[Math.floor(Math.random() * taskDatabase.length)];
    const taskDisplayEl = document.getElementById('target-task-text');
    if (taskDisplayEl) taskDisplayEl.innerText = randomTask;
    
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

    if (display) display.innerText = `${minutes}:${secs}`;

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
      const elapsedSeconds = 120 - (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10));
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
  totalMinutesSaved += minutesEarned;
  
  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_minutes', totalMinutesSaved.toString());
  
  try {
    const audioNode = document.getElementById('victory-chime');
    if (audioNode) {
      audioNode.currentTime = 0;
      audioNode.play().catch(err => console.log("Audio presentation skipped under current window configuration context:", err));
    }
  } catch (audioError) {
    console.warn("Audio node playback tracking catch:", audioError);
  }

  switchScreen('screen-victory');
  
  try {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
    }
  } catch (e) {
    console.log("Confetti component reference uninitialized:", e);
  }
}

function claimRewardStack() {
  updateMetricDashboard();
  switchScreen('screen-dashboard');
}
