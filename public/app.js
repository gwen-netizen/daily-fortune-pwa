/**
 * 120Reset Client Engine (public/app.js)
 * 
 * Implementations:
 *  1. Correctly named 'The Financial Reset Deck'.
 *  2. Deployed tasks from all 4 decks are linked to the user's selected Friction Line.
 *  3. Start button screen heading displays the exact sub-heading of the selected deck.
 *  4. Overwhelm Deck completions calculate 4x focus reclaimed points (480s / 8.0m) across all 4 rounds.
 */

// Application State
let currentActiveTask = null;
let countdownInterval = null;
let mindFrictionStyle = 'mindless_scrolling';
let selectedCategory = 'charisma';
let isPremiumSelected = false;
let overwhelmCurrentStep = 1;

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0; // Stored in minutes

// Exact Deck Sub-Headings as shown on Target Focus Area Screen
const DECK_SUBHEADINGS = {
  charisma: "Command the room.",
  wealth: "Unlock financial clarity.",
  financial_reset: "Unlock financial clarity.",
  dopamine: "Break the freeze instantly.",
  overwhelm: "Shatter task paralysis."
};

const DECK_DISPLAY_NAMES = {
  charisma: "The Charisma Deck",
  wealth: "The Financial Reset Deck",
  financial_reset: "The Financial Reset Deck",
  dopamine: "⚡ The Dopamine Swap Deck",
  overwhelm: "🧠 The Anti-Overwhelm Deck"
};

/* ========================================================
   INITIALIZATION & PERSISTENCE
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadStoredPreferences();
  checkUrlParamsForAuth();
  initScheduledAlarmsWatcher();
  updateMetricDashboard();
});

function loadStoredPreferences() {
  const savedFriction = localStorage.getItem('nudge_friction_style');
  if (savedFriction) {
    mindFrictionStyle = savedFriction;
  }

  const savedWins = localStorage.getItem('nudge_total_wins');
  if (savedWins) {
    totalWinsCount = parseInt(savedWins, 10) || 0;
  }

  const savedFocus = localStorage.getItem('nudge_focus_reclaimed');
  if (savedFocus) {
    totalFocusReclaimed = parseFloat(savedFocus) || 0.0;
  }

  // Check onboarding status
  const onboardingCompleted = localStorage.getItem('nudge_onboarding_done');
  if (onboardingCompleted === 'true') {
    switchScreen('screen-dashboard');
  } else {
    switchScreen('screen-onboarding-1');
  }

  renderCustomIntercepts();
}

function updateMetricDashboard() {
  const focusEl = document.getElementById('stat-focus-reclaimed');
  const winsEl = document.getElementById('stat-intercepts');
  const quotaBadge = document.getElementById('daily-quota-badge');

  if (focusEl) focusEl.innerHTML = `${totalFocusReclaimed.toFixed(1)}<span class="metric-unit">m</span>`;
  if (winsEl) winsEl.innerText = totalWinsCount.toString();

  const isUnlimited = isUserPremiumOrPass();
  if (quotaBadge) {
    if (isUnlimited) {
      quotaBadge.innerText = "UNLIMITED ACCESS";
      quotaBadge.style.color = "var(--accent-green)";
    } else {
      const remaining = Math.max(0, 4 - getDailyClicksCount());
      quotaBadge.innerText = `${remaining}/4 FREE INTERCEPTS`;
    }
  }
}

/* ========================================================
   NAVIGATION & SCREEN ROUTER
======================================================== */
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ========================================================
   FRICTION LINE SELECTION
======================================================== */
function selectFrictionStyle(el, frictionKey) {
  document.querySelectorAll('#screen-onboarding-2 .deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = frictionKey;
  localStorage.setItem('nudge_friction_style', frictionKey);
}

function finishOnboarding() {
  localStorage.setItem('nudge_onboarding_done', 'true');
  updateMetricDashboard();
  switchScreen('screen-dashboard');
}

/* ========================================================
   DECK SELECTION & TRIGGER PHASE
======================================================== */
function selectDeck(el, isPremium, categoryKey) {
  // Normalize naming aliases
  if (categoryKey === 'financial_freeze_impulse' || categoryKey === 'financial-reset' || categoryKey === 'financial_reset') {
    categoryKey = 'wealth';
  }

  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  selectedCategory = categoryKey;

  if (categoryKey === 'overwhelm') {
    overwhelmCurrentStep = 1; // Always start Overwhelm Deck at Move 1
  }

  // Update Start Screen Heading to the exact deck sub-heading
  updateStartScreenHeading(categoryKey);

  startTriggerPhase();
}

function updateStartScreenHeading(categoryKey) {
  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) {
    deckTitleEl.innerText = DECK_SUBHEADINGS[categoryKey] || "Command the room.";
  }
}

function startTriggerPhase() {
  const hasAccess = isUserPremiumOrPass();
  if (isPremiumSelected && !hasAccess) {
    openPaywallModal();
  } else {
    updateStartScreenHeading(selectedCategory);
    switchScreen('screen-trigger');
  }
}

/* ========================================================
   TASK RETRIEVAL & COUNTDOWN ENGINE
======================================================== */
async function executeTurnaroundSpin() {
  const hasUnlimitedAccess = isUserPremiumOrPass();
  const dailyClicks = getDailyClicksCount();

  if (!hasUnlimitedAccess && dailyClicks >= 4) {
    alert("🔒 Daily Limit Reached (4/4 Intercepts Used Today)!\n\nUpgrade to Premium or get a 2-Day Pass ($0.99) for unlimited daily access.");
    openPaywallModal();
    return;
  }

  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  if (btn) { btn.innerText = "HOLD..."; btn.style.opacity = "0.6"; }
  if (instruction) instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";

  const categoryKey = selectedCategory || 'charisma';
  const frictionKey = mindFrictionStyle || 'mindless_scrolling';
  const userEmail = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  try {
    let endpoint = getApiUrl(`/api/get-task?category=${encodeURIComponent(categoryKey)}&friction=${encodeURIComponent(frictionKey)}&email=${encodeURIComponent(userEmail)}`);
    
    if (categoryKey === 'overwhelm') {
      endpoint += `&step=${overwhelmCurrentStep}`;
    }

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const serverErr = await response.json();
      throw new Error(serverErr.error || "Server validation failure.");
    }
    
    const data = await response.json();
    currentActiveTask = data.task;
    currentActiveTask.deck = categoryKey;

    if (!hasUnlimitedAccess) {
      incrementDailyClicks();
    }
    
    setTimeout(() => {
      if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      const focusAreaEl = document.getElementById('target-task-focus-area');
      
      if (taskDisplayEl && currentActiveTask) {
        taskDisplayEl.innerText = currentActiveTask.text;
      }
      
      if (focusAreaEl && currentActiveTask) {
        if (categoryKey === 'overwhelm') {
          focusAreaEl.innerText = `Move ${overwhelmCurrentStep} of 4 • ${currentActiveTask.focusArea || 'Decompression'}`;
        } else {
          const areaLabel = currentActiveTask.focusArea || "Pillar 3B: Physical Posture & Biomechanics";
          focusAreaEl.innerText = areaLabel.startsWith("Focus Area:") ? areaLabel : `Focus Area: ${areaLabel}`;
        }
      }
      
      switchScreen('screen-countdown');
      startActionTimer(120);
    }, 1500);
  } catch (err) {
    alert(`Focus Engine Response: ${err.message}`);
    switchScreen('screen-dashboard');
    if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
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

/* ========================================================
   VICTORY & 4X OVERWHELM POINT SYSTEM
======================================================== */
function triggerVictoryPhase(minutesEarned) {
  const isOverwhelm = currentActiveTask && currentActiveTask.deck === 'overwhelm';

  // Overwhelm Deck completion grants 4x points (8.0 minutes / 480 sec) across 4 rounds
  if (isOverwhelm && overwhelmCurrentStep >= 4) {
    totalWinsCount += 1;
    totalFocusReclaimed += 8.0;
  } else if (!isOverwhelm) {
    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
  }

  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

  // Render Neurological Affirmation
  const validationCopyEl = document.getElementById('victory-validation-copy');
  if (validationCopyEl) {
    validationCopyEl.innerText = (currentActiveTask && currentActiveTask.affirmation)
      ? currentActiveTask.affirmation
      : "The freeze is broken. Action clears anxiety.";
  }

  const badgeEl = document.getElementById('victory-points-reclaimed-badge');
  const standardActions = document.getElementById('standard-victory-actions');
  const overwhelmActions = document.getElementById('overwhelm-victory-actions');
  const btnNext = document.getElementById('btn-overwhelm-next');
  const btnReset = document.getElementById('btn-overwhelm-reset');
  const titleEl = document.getElementById('victory-title-text');
  const crownEl = document.getElementById('victory-header-badge');

  if (isOverwhelm) {
    if (standardActions) standardActions.style.display = 'none';
    if (overwhelmActions) overwhelmActions.style.display = 'flex';

    if (overwhelmCurrentStep < 4) {
      if (titleEl) titleEl.innerText = `Move ${overwhelmCurrentStep} Complete`;
      if (crownEl) crownEl.innerText = "⚡";
      if (badgeEl) badgeEl.innerText = `Move ${overwhelmCurrentStep} of 4 Complete`;
      if (btnNext) {
        btnNext.style.display = 'block';
        btnNext.innerText = `Continue to Move ${overwhelmCurrentStep + 1} &rarr;`;
      }
      if (btnReset) btnReset.style.display = 'none';
    } else {
      if (titleEl) titleEl.innerText = `4-Round Protocol Complete`;
      if (crownEl) crownEl.innerText = "🎯";
      if (badgeEl) badgeEl.innerText = "+480s Focus Reclaimed (4x Protocol)";
      if (btnNext) btnNext.style.display = 'none';
      if (btnReset) btnReset.style.display = 'block';
    }
  } else {
    if (standardActions) standardActions.style.display = 'flex';
    if (overwhelmActions) overwhelmActions.style.display = 'none';
    if (titleEl) titleEl.innerText = "Impact Calibrated.";
    if (crownEl) crownEl.innerText = "🏆";
    if (badgeEl) badgeEl.innerText = "+120s Focus Reclaimed";
  }

  playVictoryChime();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }

  switchScreen('screen-victory');
}

function advanceOverwhelmNextMove() {
  if (overwhelmCurrentStep < 4) {
    overwhelmCurrentStep++;
  }
  executeTurnaroundSpin();
}

function showInitiationCompleteScreen() {
  switchScreen('screen-initiation-complete');
}

function claimRewardStack() {
  overwhelmCurrentStep = 1;
  updateMetricDashboard();
  syncLifetimeProgressToCloud();
  switchScreen('screen-dashboard');
}

function runAnotherRound() {
  updateMetricDashboard();
  syncLifetimeProgressToCloud();
  switchScreen('screen-trigger');
  executeTurnaroundSpin();
}

/* ========================================================
   CUSTOM INTERCEPTS
======================================================== */
function openCustomInterceptModal() {
  const hasAccess = isUserPremiumOrPass();
  if (!hasAccess) {
    openPaywallModal();
  } else {
    const modal = document.getElementById('custom-intercept-modal');
    if (modal) modal.classList.add('active');
  }
}

function closeCustomInterceptModal() {
  const modal = document.getElementById('custom-intercept-modal');
  if (modal) modal.classList.remove('active');
}

function saveCustomIntercept() {
  const timeInput = document.getElementById('custom-time-input').value;
  const frictionInput = document.getElementById('custom-friction-input').value;
  const deckInput = document.getElementById('custom-deck-input').value;

  if (!timeInput) {
    alert("Please select a valid time.");
    return;
  }

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  const newAnchor = {
    id: 'anc_' + Date.now(),
    time: timeInput,
    label: frictionInput,
    deck: deckInput,
    active: true
  };

  const currentAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  currentAnchors.push(newAnchor);
  localStorage.setItem('nudge_custom_anchors', JSON.stringify(currentAnchors));

  closeCustomInterceptModal();
  renderCustomIntercepts();
  syncLifetimeProgressToCloud();
}

function renderCustomIntercepts() {
  const container = document.getElementById('lifeline-container');
  if (!container) return;

  const defaultHtml = `
    <div class="lifeline-item">
      <div><div style="font-weight: 800; font-size: 14px; color: var(--text-color);">08:15 AM</div><div style="font-size: 11px; color: #7A7571; font-weight: 600;">Morning Bed-Lock</div></div>
      <label class="toggle-switch"><input type="checkbox" checked disabled><span class="slider"></span></label>
    </div>
    <div class="lifeline-item">
      <div><div style="font-weight: 800; font-size: 14px; color: var(--text-color);">02:30 PM</div><div style="font-size: 11px; color: #7A7571; font-weight: 600;">Post-Lunch Brain Fog</div></div>
      <label class="toggle-switch"><input type="checkbox" checked disabled><span class="slider"></span></label>
    </div>
  `;

  const customAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  let customHtml = '';
  customAnchors.forEach(anc => {
    customHtml += `
      <div class="lifeline-item">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--text-color);">${anc.time}</div>
          <div style="font-size: 11px; color: var(--accent-orange); font-weight: 700;">${anc.label} &bull; ${anc.deck}</div>
        </div>
        <button onclick="deleteCustomIntercept('${anc.id}')" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #7A7571;">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = defaultHtml + customHtml;
}

function deleteCustomIntercept(id) {
  let currentAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  currentAnchors = currentAnchors.filter(a => a.id !== id);
  localStorage.setItem('nudge_custom_anchors', JSON.stringify(currentAnchors));
  renderCustomIntercepts();
}

function initScheduledAlarmsWatcher() {
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    const currentAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
    currentAnchors.forEach(anc => {
      if (anc.time === currentTimeStr && !anc.triggeredToday) {
        anc.triggeredToday = true;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("120 Reset Circuit Breaker", {
            body: `State Intercept Triggered: ${anc.label} (${anc.deck}). Tap to break the loop.`
          });
        }
      }
    });
  }, 30000);
}

/* ========================================================
   PAYWALL & CHECKOUT
======================================================== */
let selectedProductToBuy = 'lifetime';

function openPaywallModal() {
  const paywall = document.getElementById('paywall-overlay');
  if (paywall) paywall.classList.add('active');
}

function closePaywallModal() {
  const paywall = document.getElementById('paywall-overlay');
  if (paywall) paywall.classList.remove('active');
}

function checkoutProduct(productType) {
  selectedProductToBuy = productType;
  document.querySelectorAll('.paywall-option').forEach(opt => opt.classList.remove('selected'));
  if (productType === 'pass_48h') {
    document.querySelectorAll('.paywall-option')[0].classList.add('selected');
  } else {
    document.querySelectorAll('.paywall-option')[1].classList.add('selected');
  }
}

async function executeSelectedCheckout() {
  const btn = document.getElementById('btn-paywall-checkout');
  if (btn) { btn.innerText = "Securing Session..."; btn.disabled = true; }

  const email = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  try {
    const res = await fetch(getApiUrl('/api/create-checkout-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType: selectedProductToBuy, email })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Unable to initialize Stripe session.");
    }
  } catch (err) {
    alert(`Checkout Error: ${err.message}`);
    if (btn) { btn.innerText = "Unlock Now →"; btn.disabled = false; }
  }
}

function isUserPremiumOrPass() {
  const isLifetime = localStorage.getItem('nudge_is_lifetime') === 'true';
  const passExpiry = localStorage.getItem('nudge_pass_expiry');
  if (isLifetime) return true;
  if (passExpiry && new Date(passExpiry) > new Date()) return true;
  return false;
}

function getDailyClicksCount() {
  const today = new Date().toISOString().split('T')[0];
  const storedDate = localStorage.getItem('nudge_click_date');
  if (storedDate !== today) {
    localStorage.setItem('nudge_click_date', today);
    localStorage.setItem('nudge_click_count', '0');
    return 0;
  }
  return parseInt(localStorage.getItem('nudge_click_count') || '0', 10);
}

function incrementDailyClicks() {
  const count = getDailyClicksCount() + 1;
  localStorage.setItem('nudge_click_count', count.toString());
  updateMetricDashboard();
}

function playVictoryChime() {
  const chime = document.getElementById('victory-chime');
  if (chime) {
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }
}

function getApiUrl(path) {
  return path;
}

function checkUrlParamsForAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session_id')) {
    localStorage.setItem('nudge_is_lifetime', 'true');
    alert("🎉 Payment Confirmed! Unlimited Lifetime Access is unlocked.");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateMetricDashboard();
  }
}

function saveUserEmailSettings() {
  const emailInput = document.getElementById('settings-email-input').value;
  if (!emailInput || !emailInput.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }
  localStorage.setItem('nudge_user_email', emailInput);
  syncLifetimeProgressToCloud();
  alert("Identity synced successfully!");
}

async function syncLifetimeProgressToCloud() {
  const email = localStorage.getItem('nudge_user_email');
  if (!email) return;

  try {
    await fetch(getApiUrl('/api/sync-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        totalWins: totalWinsCount,
        focusReclaimed: totalFocusReclaimed,
        frictionStyle: mindFrictionStyle
      })
    });
  } catch (e) {
    console.warn("Silent sync fallback:", e);
  }
}
