/**
 * 120Reset Client Engine (public/app.js)
 */

let currentActiveTask = null;
let countdownInterval = null;
let mindFrictionStyle = 'mindless_scrolling';
let selectedCategory = 'charisma';
let isPremiumSelected = false;
let overwhelmCurrentStep = 1;
let selectedTierToBuy = 'lifetime';

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0;

const DECK_SUBHEADINGS = {
  charisma: "Command the room.",
  wealth: "Unlock financial clarity.",
  financial_reset: "Unlock financial clarity.",
  dopamine: "Break the freeze instantly.",
  overwhelm: "Shatter task paralysis."
};

document.addEventListener("DOMContentLoaded", async () => {
  loadStoredPreferences();
  checkStripeRedirectStatus();
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();
  updateMetricDashboard();
});

function loadStoredPreferences() {
  const savedFriction = localStorage.getItem('nudge_friction_style');
  if (savedFriction) mindFrictionStyle = savedFriction;

  const savedWins = localStorage.getItem('nudge_total_wins');
  if (savedWins) totalWinsCount = parseInt(savedWins, 10) || 0;

  const savedFocus = localStorage.getItem('nudge_focus_reclaimed');
  if (savedFocus) totalFocusReclaimed = parseFloat(savedFocus) || 0.0;

  const userEmail = localStorage.getItem('nudge_user_email');
  if (userEmail) {
    switchScreen('screen-dashboard');
  } else {
    switchScreen('screen-onboarding-1');
  }
}

function updateMetricDashboard() {
  const focusEl = document.getElementById('stat-focus-reclaimed');
  const winsEl = document.getElementById('stat-total-wins');
  const dailyUsesEl = document.getElementById('stat-daily-uses');

  if (focusEl) focusEl.innerText = `${totalFocusReclaimed.toFixed(1)}m`;
  if (winsEl) winsEl.innerText = totalWinsCount.toString();

  const hasAccess = isUserPremiumOrPass();
  if (dailyUsesEl) {
    if (hasAccess) {
      dailyUsesEl.innerText = "UNLTD";
      dailyUsesEl.style.color = "var(--success-color)";
    } else {
      const used = getDailyClicksCount();
      dailyUsesEl.innerText = `${used}/4`;
      dailyUsesEl.style.color = used >= 4 ? "var(--timer-color)" : "var(--accent-color)";
    }
  }

  applyPremiumUIVisuals(hasAccess);
}

function applyPremiumUIVisuals(hasAccess) {
  const customMeta = document.getElementById('custom-intercept-meta');
  const customText = document.getElementById('custom-intercept-text');
  if (customMeta) {
    customMeta.innerText = hasAccess ? "UNLOCKED PREMIUM AREA" : "PREMIUM UPGRADE";
    customMeta.className = hasAccess ? "deck-meta free" : "deck-meta premium";
  }
  if (customText) {
    customText.innerHTML = hasAccess ? "✅ + Add Custom Intercept" : "⚡ + Add Custom Intercept";
  }
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function selectOption(el, frictionKey) {
  document.querySelectorAll('#screen-onboarding-2 .deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = frictionKey;
  localStorage.setItem('nudge_friction_style', frictionKey);
}

function selectDeck(el, isPremium, categoryKey) {
  if (categoryKey === 'financial_freeze_impulse' || categoryKey === 'financial-reset' || categoryKey === 'financial_reset') {
    categoryKey = 'wealth';
  }

  document.querySelectorAll('#screen-dashboard .deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  selectedCategory = categoryKey;

  if (categoryKey === 'overwhelm') {
    overwhelmCurrentStep = 1;
  }

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

async function executeTurnaroundSpin() {
  const hasAccess = isUserPremiumOrPass();
  const dailyClicks = getDailyClicksCount();

  if (!hasAccess && dailyClicks >= 4) {
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
    let endpoint = `/api/get-task?category=${encodeURIComponent(categoryKey)}&friction=${encodeURIComponent(frictionKey)}&email=${encodeURIComponent(userEmail)}`;
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

    if (!hasAccess) {
      incrementDailyClicks();
    }
    
    setTimeout(() => {
      if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      const focusAreaEl = document.getElementById('target-task-focus-area');
      
      if (taskDisplayEl && currentActiveTask) taskDisplayEl.innerText = currentActiveTask.text;
      if (focusAreaEl && currentActiveTask) {
        if (categoryKey === 'overwhelm') {
          focusAreaEl.innerText = `Move ${overwhelmCurrentStep} of 4 • ${currentActiveTask.focusArea || 'Decompression'}`;
        } else {
          focusAreaEl.innerText = currentActiveTask.focusArea || "Core Biomechanics";
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
    const parts = displayEl.innerText.split(':');
    if (parts.length === 2) {
      const currentMin = parseInt(parts[0], 10) || 0;
      const currentSec = parseInt(parts[1], 10) || 0;
      const elapsedSeconds = 120 - (currentMin * 60 + currentSec);
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
  const isOverwhelm = currentActiveTask && currentActiveTask.deck === 'overwhelm';

  if (isOverwhelm && overwhelmCurrentStep >= 4) {
    totalWinsCount += 1;
    totalFocusReclaimed += 8.0; // 4x Multiplier (480s)
  } else if (!isOverwhelm) {
    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
  }

  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

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

  const chime = document.getElementById('victory-chime');
  if (chime) {
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }

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
   CUSTOM INTERCEPTS & 12-HOUR TIMING RENDERER
======================================================== */
function formatTime12h(time24) {
  if (!time24) return "12:00 PM";
  const parts = time24.split(':');
  let hour = parseInt(parts[0], 10) || 0;
  const min = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${min} ${ampm}`;
}

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
  const frictionInput = document.getElementById('custom-friction-input').value || 'Custom Reset';
  const deckInput = document.getElementById('custom-deck-input').value || 'The Anti-Overwhelm Deck';

  if (!timeInput) {
    alert("Please select a valid time.");
    return;
  }

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  const newCustom = {
    id: `anc_${Date.now()}`,
    time: timeInput,
    friction: frictionInput,
    deck: deckInput,
    enabled: true
  };

  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  customs.push(newCustom);
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));

  closeCustomInterceptModal();
  renderCustomIntercepts();
  syncLifetimeProgressToCloud();
}

function toggleCustomInterceptState(index) {
  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  if (customs[index]) {
    customs[index].enabled = !customs[index].enabled;
    localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));
  }
}

function deleteCustomIntercept(index) {
  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  customs.splice(index, 1);
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));
  renderCustomIntercepts();
}

function renderCustomIntercepts() {
  const injectionPoint = document.getElementById('custom-intercepts-injection-point');
  if (!injectionPoint) return;
  
  injectionPoint.innerHTML = ''; 
  const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  
  customs.forEach((c, index) => {
    if (!c.time) return;
    const formattedTime = formatTime12h(c.time);
    const isChecked = c.enabled !== false ? 'checked' : '';

    const html = `
      <div class="lifeline-item" style="border-color: var(--accent-color); margin-bottom: 8px;">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--premium-color);">${formattedTime}</div>
          <div style="font-size: 11px; color: #7A7571; font-weight: 600;">Custom: ${c.friction || 'Intercept'} (${c.deck || 'Deck'})</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="toggle-switch"><input type="checkbox" ${isChecked} onchange="toggleCustomInterceptState(${index})"><span class="slider"></span></label>
          <button onclick="deleteCustomIntercept(${index})" style="background:none; border:none; color:#A8A29E; cursor:pointer; font-size:16px; padding:2px 6px;">✕</button>
        </div>
      </div>
    `;
    injectionPoint.insertAdjacentHTML('beforeend', html);
  });
}

function startBackgroundInterceptMonitor() {
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
    customs.forEach(c => {
      if (c.enabled && c.time === currentTimeStr && !c.triggeredToday) {
        c.triggeredToday = true;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("120 Reset Circuit Breaker", {
            body: `Scheduled Intercept Triggered: ${c.friction} (${c.deck}). Tap to break the loop.`
          });
        }
      }
    });
  }, 30000);
}

/* ========================================================
   AUTH & PAYWALL ENGINE
======================================================== */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email').value.trim().toLowerCase();
  const promoInput = document.getElementById('user-promo-code').value.trim().toUpperCase();

  if (!emailInput || !emailInput.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }

  localStorage.setItem('nudge_user_email', emailInput);

  if (promoInput === 'LIFETIME' || promoInput === 'PREMIUM99') {
    localStorage.setItem('nudge_is_lifetime', 'true');
    alert("🎉 Promotional Access Code Activated!");
  }

  switchScreen('screen-onboarding-2');
}

function openPaywallModal() {
  const modal = document.getElementById('paywall-modal');
  if (modal) modal.classList.add('active');
}

function closePaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) modal.classList.remove('active');
}

function selectTier(tier) {
  selectedTierToBuy = tier;
  document.querySelectorAll('.paywall-option').forEach(opt => opt.classList.remove('selected'));
  if (tier === 'pass_48h') {
    document.querySelectorAll('.paywall-option')[0].classList.add('selected');
  } else {
    document.querySelectorAll('.paywall-option')[1].classList.add('selected');
  }
}

async function simulatePurchase() {
  const btn = document.getElementById('btn-paywall-checkout');
  if (btn) { btn.innerText = "Securing Session..."; btn.disabled = true; }

  const email = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType: selectedTierToBuy, email })
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
  const savedDate = localStorage.getItem('nudge_click_date');
  if (savedDate !== today) {
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

function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session_id')) {
    localStorage.setItem('nudge_is_lifetime', 'true');
    alert("🎉 Payment Confirmed! Lifetime Access is unlocked.");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateMetricDashboard();
  }
}

async function syncLifetimeProgressToCloud() {
  const email = localStorage.getItem('nudge_user_email');
  if (!email || email === 'anonymous_tester') return;

  try {
    await fetch('/api/sync-user', {
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
