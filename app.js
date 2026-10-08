// Local Notification Push Strings (Triggered by client clock)
const staticLifelines = {
  "08:15": [
    "🚀 Trapped under the covers scrolling? Tap here for an immediate 120-second rescue breakout.",
    "🚀 Reclaim your morning. Open now for a zero-effort momentum win.",
    "🚀 Scrolling now wastes your evening freedom. Smash the red button to take control."
  ],
  "09:45": [
    "🧠 Frozen by a massive to-do list? Let the app pick one 2-minute step.",
    "🧠 Lower your task anxiety to zero. Spin the dial and execute for 120 seconds.",
    "🧠 Waiting for motivation is a trap. Intercept your friction line and move now."
  ],
  "15:45": [
    "📉 Staring blankly at your monitor? Tap now for a clean physical energy reset.",
    "📉 Afternoon slipping away? Stop the guilt loop and reclaim your focus instantly.",
    "📉 Your thumb is searching for a digital escape. Secure your focus stack right now."
  ],
  "23:15": [
    "🛑 Late-night scrolling hijacks your sleep. Tap this banner to execute a mental shutdown.",
    "🛑 One last scroll is a trap. Turn your screen face down and claim victory.",
    "🛑 True high-status execution requires deep sleep. Shatter the addiction loop right now."
  ]
};

const fallbackTasksByCategory = {
  charisma: [
    "Roll your shoulders back, plant both feet firmly on the ground, and maintain high posture for 120 seconds.",
    "Unclench your jaw, soften your shoulders, and slow your breathing down to build a calm physical baseline."
  ],
  wealth: [
    "Identify one immediate, unnecessary recurring subscription in your digital accounts and cancel it right now.",
    "Open your primary bank app and review your last 5 transactions with zero judgment."
  ],
  dopamine: [
    "Close your eyes, clear your mind, and take 5 slow, long breaths to break the algorithmic tracking cycle.",
    "Set a timer for 2 minutes, turn your phone face down, and allow your dopamine receptors to recalibrate."
  ],
  overwhelm: [
    "Identify the single absolute largest project on your desk. Write down only the very first, 2-minute micro-step.",
    "Open your task list and ruthlessly cross out three items that do not absolutely need to happen today."
  ]
};

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

let isPremiumSelected = false;
let countdownInterval = null;
let mindFrictionStyle = sessionStorage.getItem('nudge_friction') || 'scroll'; 
let selectedCategory = sessionStorage.getItem('nudge_category') || 'charisma'; 
let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

// Initial Routing Logic
document.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem('nudge_user_email');
  
  if (savedEmail) {
    // Existing User Default Load
    restoreStateFromSession();
    updateMetricDashboard();
    switchScreen('screen-onboarding-2');
  } else {
    // New User Onboarding Load
    switchScreen('screen-onboarding-1');
  }
  
  checkStripeRedirectStatus();
  applyPremiumUIVisuals();
  renderCustomLifelines();
  startClockTicker();
});

function submitEmailAndProceed() {
  const emailInput = document.getElementById('user-email-input');
  const errorMsg = document.getElementById('email-error-msg');
  const emailVal = emailInput ? emailInput.value.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    if (errorMsg) errorMsg.style.display = 'block';
    return;
  }

  if (errorMsg) errorMsg.style.display = 'none';
  localStorage.setItem('nudge_user_email', emailVal);
  
  // Ask for notification permission after email submit as a fallback
  if ('Notification' in window) Notification.requestPermission();
  
  switchScreen('screen-onboarding-2');
}

function restoreStateFromSession() {
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
  if (targetScreen) targetScreen.classList.add('active');
  
  if (screenId === 'screen-trigger') {
    const instructions = document.getElementById('trigger-instructions');
    const spinBtn = document.querySelector('.big-red-btn');
    if (instructions) instructions.innerText = "Take one slow, long breath before pushing.";
    if (spinBtn) spinBtn.innerText = "START";
  }
}

function selectOption(el, styleType) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = styleType || 'scroll';
  sessionStorage.setItem('nudge_friction', mindFrictionStyle);
  switchScreen('screen-dashboard');
}

function selectDeck(el, isPremium, categoryKey) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  selectedCategory = categoryKey || el.getAttribute('data-category') || 'charisma';
  sessionStorage.setItem('nudge_category', selectedCategory);
  
  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) {
    deckTitleEl.innerText = el.querySelector('.deck-name').innerText;
  }
  startTriggerPhase();
}

function startTriggerPhase() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';
  if (isPremiumSelected && !isUserPremium) {
    const paywallTitle = document.getElementById('paywall-title');
    const paywallDesc = document.getElementById('paywall-desc');
    if(paywallTitle) paywallTitle.innerText = "Break Free From the Loops";
    if(paywallDesc) paywallDesc.innerText = "Unlock behavioral overrides modeled on top neural productivity systems.";
    
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

/* ========================================================
   PREMIUM CUSTOM LIFELINE ENGINE
======================================================== */
function openCustomLifelineModal() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';
  if (!isUserPremium) {
    // Modify Paywall for Contextual Up-sell
    const paywallTitle = document.getElementById('paywall-title');
    const paywallDesc = document.getElementById('paywall-desc');
    if(paywallTitle) paywallTitle.innerText = "Build Custom Anchors";
    if(paywallDesc) paywallDesc.innerText = "Your friction doesn't wait for standard slumps. Upgrade to create unlimited custom time anchors to intercept your exact daily block hours.";
    
    const paywall = document.getElementById('paywall-overlay');
    if (paywall) paywall.classList.add('active');
  } else {
    const modal = document.getElementById('custom-lifeline-modal');
    if(modal) modal.classList.add('active');
  }
}

function closeCustomLifelineModal() {
  const modal = document.getElementById('custom-lifeline-modal');
  if(modal) modal.classList.remove('active');
}

function saveCustomLifeline() {
  const timeInput = document.getElementById('custom-time-input').value;
  const frictionInput = document.getElementById('custom-friction-input').value;
  const deckInput = document.getElementById('custom-deck-input').value;

  if(!timeInput) {
    alert("Please select a valid time.");
    return;
  }

  const newCustom = { time: timeInput, friction: frictionInput, deck: deckInput };
  let customs = JSON.parse(localStorage.getItem('nudge_custom_lifelines') || '[]');
  customs.push(newCustom);
  localStorage.setItem('nudge_custom_lifelines', JSON.stringify(customs));

  closeCustomLifelineModal();
  renderCustomLifelines();
}

function renderCustomLifelines() {
  const injectionPoint = document.getElementById('custom-lifelines-injection-point');
  if (!injectionPoint) return;
  
  injectionPoint.innerHTML = ''; // Clear out old renders
  const customs = JSON.parse(localStorage.getItem('nudge_custom_lifelines') || '[]');
  
  customs.forEach(c => {
    // Convert 24hr to 12hr visually
    const [hourStr, minStr] = c.time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${minStr} ${ampm}`;

    const html = `
      <div class="lifeline-item" style="border-color: var(--accent-color);">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--premium-color);">${formattedTime}</div>
          <div style="font-size: 11px; color: #7A7571; font-weight: 600;">Custom: ${c.friction}</div>
        </div>
        <label class="toggle-switch"><input type="checkbox" checked disabled><span class="slider"></span></label>
      </div>
    `;
    injectionPoint.insertAdjacentHTML('beforeend', html);
  });
}

/* ========================================================
   LOCAL PUSH NOTIFICATION TICKER
======================================================== */
let lastFiredTime = null;
let lastFiredDate = null;

function startClockTicker() {
  setInterval(() => {
    const now = new Date();
    // 24-hour format string (e.g., "15:45") to match inputs and static keys
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    checkAndFireNotification(timeString);
  }, 30000); // Check every 30 seconds
}

function checkAndFireNotification(timeString) {
  const today = new Date().toDateString();
  // Prevent firing multiple times in the same minute
  if (timeString === lastFiredTime && today === lastFiredDate) return;

  let pushBody = null;
  let pushTitle = "2-min Turnaround";

  // Check Static Fixed Anchors
  if (staticLifelines[timeString]) {
    const options = staticLifelines[timeString];
    pushBody = options[Math.floor(Math.random() * options.length)];
    pushTitle = "Standard Slump Intercept";
  }

  // Check Premium Custom Arrays
  const customs = JSON.parse(localStorage.getItem('nudge_custom_lifelines') || '[]');
  const matchedCustom = customs.find(c => c.time === timeString);
  
  if (matchedCustom) {
    pushBody = `⚡ Custom Intercept activated: Time to shatter your ${matchedCustom.friction} pattern. Execute now.`;
    pushTitle = "Custom Lifeline Trigger";
  }

  // Instruct Service Worker to Fire
  if (pushBody) {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(pushTitle, {
          body: pushBody,
          icon: "https://flaticon.com",
          vibrate: [100, 50, 100],
          data: { url: "/" }
        });
      });
    }
    lastFiredTime = timeString;
    lastFiredDate = today;
  }
}

/* ========================================================
   EXECUTION & UTILITY LOGIC 
======================================================== */
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
        if (name) name.innerText = name.innerText.replace('⚡ ', '✅ ').replace('🧠 ', '✅ ');
      }
    });
  }
}

async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) return alert("Please select a tracking tier to continue.");

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
    if (!response.ok) throw new Error(`Server returned status ${response.status}`);
    const session = await response.json();
    if (session.url) window.location.href = session.url;
  } catch (error) {
    alert(`Gateway Error: ${error.message}.`);
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
  
  if (btn) { btn.innerText = "HOLD..."; btn.style.opacity = "0.6"; }
  if (instruction) instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";

  const categoryPool = fallbackTasksByCategory[selectedCategory] || fallbackTasksByCategory['charisma'];
  let selectedTask = categoryPool[Math.floor(Math.random() * categoryPool.length)];

  try {
    const response = await fetch(`/api/get-task?category=${selectedCategory}&friction=${mindFrictionStyle}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.task) selectedTask = data.task;
    }
  } catch (err) {
    console.error("Task payload transport error:", err);
  }

  if (!selectedTask.startsWith('⚡') && !selectedTask.startsWith('🧠') && !selectedTask.startsWith('🌱')) {
    if (mindFrictionStyle === 'scroll') selectedTask = "⚡ INTERCEPTION: " + selectedTask;
    else if (mindFrictionStyle === 'paralysis') selectedTask = "🧠 BREAK OUT: " + selectedTask;
    else if (mindFrictionStyle === 'routine') selectedTask = "🌱 GROUNDING: " + selectedTask;
  }

  setTimeout(() => {
    if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
    const taskDisplayEl = document.getElementById('target-task-text');
    if (taskDisplayEl) taskDisplayEl.innerText = selectedTask;
    
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
    if (display) display.innerText = (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);
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
    const parts = displayEl.innerText.split(':');
    if (parts.length === 2) {
      const elapsedSeconds = 120 - ((parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0));
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
    if (audioNode) { audioNode.currentTime = 0; audioNode.play().catch(e=>{}); }
  } catch (e) {}
  
  switchScreen('screen-victory');
  
  try {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
    }
  } catch (e) {}
}

function claimRewardStack() {
  updateMetricDashboard();
  switchScreen('screen-dashboard');
}
