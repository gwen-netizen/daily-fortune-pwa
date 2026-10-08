// Category-specific fallback task arrays for offline execution
const fallbackTasksByCategory = {
  charisma: [
    "Roll your shoulders back, plant both feet firmly on the ground, and maintain high posture for 120 seconds.",
    "Unclench your jaw, soften your shoulders, and slow your breathing down to build a calm physical baseline.",
    "Practice speaking your next sentence out loud with deliberate volume and clear inflection."
  ],
  wealth: [
    "Identify one immediate, unnecessary recurring subscription in your digital accounts and cancel it right now.",
    "Open your primary bank app and review your last 5 transactions with zero judgment.",
    "Calculate your true hourly worth based on your income and weigh your next purchase against hours worked."
  ],
  dopamine: [
    "Close your eyes, clear your mind, and take 5 slow, long breaths to break the algorithmic tracking cycle.",
    "Set a timer for 2 minutes, turn your phone face down, and allow your dopamine receptors to recalibrate.",
    "Do 10 steady bodyweight squats right now to replace cheap digital stimulation with biological circulation."
  ],
  overwhelm: [
    "Identify the single absolute largest project on your desk. Write down only the very first, 2-minute micro-step.",
    "Open your task list and ruthlessly cross out three items that do not absolutely need to happen today.",
    "Isolate the single item you have been avoiding out of performance anxiety and commit to working on it for 120 seconds."
  ]
};

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

let isPremiumSelected = false;
let countdownInterval = null;

// Initialize state from sessionStorage if available, otherwise default
let mindFrictionStyle = sessionStorage.getItem('nudge_friction') || 'scroll'; 
let selectedCategory = sessionStorage.getItem('nudge_category') || 'charisma'; 

let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

document.addEventListener("DOMContentLoaded", () => {
  restoreStateFromSession();
  updateMetricDashboard();
  checkStripeRedirectStatus();
  applyPremiumUIVisuals();
});

/**
 * Restores selection states from sessionStorage across page reloads
 */
function restoreStateFromSession() {
  // Restore friction option selection on Screen 2
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach(card => {
    const textContent = card.querySelector('.option-title')?.innerText || '';
    if (
      (mindFrictionStyle === 'scroll' && textContent.includes("Scrolling")) ||
      (mindFrictionStyle === 'paralysis' && textContent.includes("Paralysis")) ||
      (mindFrictionStyle === 'routine' && !textContent.includes("Scrolling") && !textContent.includes("Paralysis"))
    ) {
      optionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
  });

  // Restore deck selection on Screen 3
  const deckItems = document.querySelectorAll('.deck-item');
  deckItems.forEach(item => {
    const categoryAttr = item.getAttribute('data-category');
    if (categoryAttr === selectedCategory) {
      deckItems.forEach(d => d.classList.remove('selected'));
      item.classList.add('selected');
      const isPremium = item.querySelector('.deck-meta')?.innerText.includes("PREMIUM") || false;
      isPremiumSelected = isPremium;
      const deckTitleEl = document.getElementById('active-deck-title');
      if (deckTitleEl) {
        deckTitleEl.innerText = item.querySelector('.deck-name')?.innerText || '';
      }
    }
  });
}

function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  
  if (streaksEl && focusEl) {
    streaksEl.innerText = totalWinsCount;
    
    if (totalFocusReclaimed < 60) {
      focusEl.innerText = totalFocusReclaimed.toFixed(1) + ' min';
    } else {
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

function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  
  const textContent = el.querySelector('.option-title').innerText;
  if (textContent.includes("Scrolling")) mindFrictionStyle = 'scroll';
  else if (textContent.includes("Paralysis")) mindFrictionStyle = 'paralysis';
  else mindFrictionStyle = 'routine';

  sessionStorage.setItem('nudge_friction', mindFrictionStyle);
}

function selectDeck(el, isPremium, categoryKey) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  
  isPremiumSelected = isPremium;
  selectedCategory = categoryKey || el.getAttribute('data-category') || 'charisma';
  sessionStorage.setItem('nudge_category', selectedCategory);
  
  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) {
    const deckName = el.querySelector('.deck-name').innerText;
    deckTitleEl.innerText = deckName;
  }
}

function startTriggerPhase() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';

  if (isPremiumSelected && !isUserPremium) {
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

function applyPremiumUIVisuals() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';
  
  if (isUserPremium) {
    document.querySelectorAll('.deck-item').forEach(item => {
      const meta = item.querySelector('.deck-meta');
      const name = item.querySelector('.deck-name');
      
      if (meta && meta.innerText.includes("PREMIUM UPGRADE")) {
        meta.innerText = "UNLOCKED PREMIUM AREA";
        meta.style.color = "var(--success-color)";
        if (name) {
          name.innerText = name.innerText.replace('⚡ ', '✅ ').replace('🧠 ', '✅ ');
        }
      }
    });
  }
}

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
    alert(`Gateway Error: ${paymentError.message}.`);
    
    if (paywallBtn) {
      paywallBtn.innerText = originalText;
      paywallBtn.style.opacity = "1";
    }
  }
}

function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    localStorage.setItem('nudge_premium_user', 'true');
    alert("Premium Portfolio Active! Algorithmic intercepts completely unlocked.");
    
    applyPremiumUIVisuals();
    
    window.history.replaceState({}, document.title, window.location.pathname);
    switchScreen('screen-dashboard');
  }
}

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

  const categoryPool = fallbackTasksByCategory[selectedCategory] || fallbackTasksByCategory['charisma'];
  let selectedTask = categoryPool[Math.floor(Math.random() * categoryPool.length)];

  try {
    const response = await fetch(`/api/get-task?category=${selectedCategory}&friction=${mindFrictionStyle}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.task) {
        selectedTask = data.task;
      }
    }
  } catch (err) {
    console.error("Task payload transport error:", err);
  }

  // Guarantees friction prefix application even on offline fallbacks
  if (!selectedTask.startsWith('⚡') && !selectedTask.startsWith('🧠') && !selectedTask.startsWith('🌱')) {
    if (mindFrictionStyle === 'scroll') selectedTask = "⚡ INTERCEPTION: " + selectedTask;
    else if (mindFrictionStyle === 'paralysis') selectedTask = "🧠 BREAK OUT: " + selectedTask;
    else if (mindFrictionStyle === 'routine') selectedTask = "🌱 GROUNDING: " + selectedTask;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerText = "START";
      btn.style.opacity = "1";
    }
    
    const taskDisplayEl = document.getElementById('target-task-text');
    if (taskDisplayEl) {
      taskDisplayEl.innerText = selectedTask;
    }
    
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
