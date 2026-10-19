/**
 * 120Reset Client Engine (public/app.js)
 */

let currentUserProfile = null;
let currentActiveTask = null;
let countdownInterval = null;
let passTickerInterval = null;
let mindFrictionStyle = 'mindless_scrolling';
let selectedCategory = 'charisma';
let isPremiumSelected = false;
let overwhelmCurrentStep = 1;

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0;

const DECK_SUBHEADINGS = {
  charisma: "Command the room.",
  wealth: "Unlock financial clarity.",
  financial_reset: "Unlock financial clarity.",
  dopamine: "Break the freeze instantly.",
  overwhelm: "Shatter task paralysis."
};

const DEFAULT_PRESET_INTERCEPTS = [
  { id: 'pre_1', time: '08:15', label: 'Morning Bed-Lock', deck: 'The Charisma Deck', enabled: true },
  { id: 'pre_2', time: '14:30', label: 'Post-Lunch Brain Fog', deck: 'The Financial Reset Deck', enabled: true },
  { id: 'pre_3', time: '23:15', label: 'Bedtime Loop', deck: 'The Anti-Overwhelm Deck', enabled: true }
];

function parseDbTimestamp(ts) {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  return new Date(ts).getTime();
}

/**
 * Splits text into paragraphs spaced with comfortable margins.
 */
function formatSpacedSentences(text) {
  if (!text) return '';
  const cleaned = text.trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);
  if (sentences.length > 1) {
    return sentences.map(s => `<p class="sentence-paragraph">${s}</p>`).join('');
  }
  return `<p class="sentence-paragraph">${cleaned}</p>`;
}

/* ========================================================
   HARDWARE / SYSTEM BACK BUTTON HANDLER
======================================================== */
function pushNavigationState(screenId) {
  try {
    window.history.pushState({ screen: screenId }, "", window.location.pathname);
  } catch (e) {}
}

window.addEventListener('popstate', () => {
  const activeScreen = document.querySelector('.screen.active');
  const currentId = activeScreen ? activeScreen.id : '';

  if (currentId === 'screen-countdown') {
    cancelTimer();
  } else if (currentId === 'screen-trigger' || currentId === 'screen-victory') {
    switchScreen('screen-dashboard', false);
  } else if (currentId === 'screen-dashboard') {
    switchScreen('screen-onboarding-2', false);
  } else if (currentId === 'screen-onboarding-2') {
    switchScreen('screen-welcome', false);
  }
});

/* ========================================================
   INITIALIZATION & BOOT TALLY
======================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  renderPresetIntercepts();
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();
  await checkStripeRedirectStatus();

  const savedEmail = localStorage.getItem('nudge_user_email');
  
  if (savedEmail && savedEmail.includes('@')) {
    try {
      const endpoint = `/api/sync-user?email=${encodeURIComponent(savedEmail)}&action=get_profile`;
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.profile) {
          currentUserProfile = data.profile;
          totalWinsCount = parseInt(data.profile.total_wins, 10) || totalWinsCount;
          totalFocusReclaimed = parseFloat(data.profile.focus_reclaimed) || totalFocusReclaimed;
        }
      }
    } catch (e) {
      console.warn("Supabase sync fallback:", e);
      if (!currentUserProfile) {
        currentUserProfile = { email: savedEmail, premium_user: false, pass_expires_at: null };
      }
    }

    startPassTicker();
    updateMetricDashboard();
    switchScreen('screen-welcome', false);
  } else {
    switchScreen('screen-welcome', false);
  }
});

/* ========================================================
   LOGIN & SUPABASE TALLY
======================================================== */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }

  const userEmail = emailInput.value.trim().toLowerCase();
  const promoInput = document.getElementById('user-promo-code');
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';

  const loginBtn = document.querySelector('#screen-onboarding-1 .btn-primary');
  const originalText = loginBtn ? loginBtn.innerText : "Continue →";
  
  if (loginBtn) {
    loginBtn.innerText = "VERIFYING ACCOUNT...";
    loginBtn.disabled = true;
  }

  try {
    const endpoint = `/api/sync-user?email=${encodeURIComponent(userEmail)}&action=get_profile&promo_code=${encodeURIComponent(promoCode)}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (response.ok && data.profile) {
      currentUserProfile = data.profile;
      localStorage.setItem('nudge_user_email', userEmail);
      
      totalWinsCount = parseInt(data.profile.total_wins, 10) || 0;
      totalFocusReclaimed = parseFloat(data.profile.focus_reclaimed) || 0.0;
      localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
      localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

      startPassTicker();
      updateMetricDashboard();
      switchScreen('screen-onboarding-2', true);
    } else {
      throw new Error(data.error || "Profile initialization response invalid.");
    }
  } catch (error) {
    console.warn("Supabase fallback:", error);
    localStorage.setItem('nudge_user_email', userEmail);
    currentUserProfile = { 
      email: userEmail, 
      premium_user: false, 
      pass_expires_at: null,
      total_wins: totalWinsCount,
      focus_reclaimed: totalFocusReclaimed
    };
    
    startPassTicker();
    updateMetricDashboard();
    switchScreen('screen-onboarding-2', true);
  } finally {
    if (loginBtn) {
      loginBtn.innerText = originalText;
      loginBtn.disabled = false;
    }
  }
}

/* ========================================================
   PREMIUM & PASS STATUS ENGINE
======================================================== */
function isUserPremiumOrPass() {
  if (!currentUserProfile) return false;

  if (currentUserProfile.pass_expires_at) {
    const expiryMs = parseDbTimestamp(currentUserProfile.pass_expires_at);
    if (Date.now() < expiryMs) {
      return true;
    } else {
      return false;
    }
  }

  if (currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true') {
    return true;
  }

  return false;
}

function getPassRemainingSeconds() {
  if (!currentUserProfile || !currentUserProfile.pass_expires_at) return 0;
  const expiryMs = parseDbTimestamp(currentUserProfile.pass_expires_at);
  return Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
}

function startPassTicker() {
  if (passTickerInterval) clearInterval(passTickerInterval);
  updatePassCountdown();
  passTickerInterval = setInterval(updatePassCountdown, 1000);
}

function updatePassCountdown() {
  const banners = [
    document.getElementById('screen2-status-banner'),
    document.getElementById('screen3-status-banner')
  ];

  const hasAccess = isUserPremiumOrPass();
  const remainingSecs = getPassRemainingSeconds();

  banners.forEach(banner => {
    if (!banner) return;
    
    if (currentUserProfile && (currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true') && !currentUserProfile.pass_expires_at) {
      banner.style.display = 'block';
      banner.style.background = '#E8F5E9';
      banner.style.borderColor = 'var(--success-color)';
      banner.style.color = 'var(--success-color)';
      banner.innerHTML = '✅ <b>FULL PREMIUM UNLOCKED</b><br>Unlimited Daily Intercepts & All Decks';
    } else if (remainingSecs > 0) {
      banner.style.display = 'block';
      banner.style.background = '#FFF8E1';
      banner.style.borderColor = '#FFB300';
      banner.style.color = '#B78103';
      
      const hours = Math.floor(remainingSecs / 3600);
      const mins = Math.floor((remainingSecs % 3600) / 60);
      const secs = remainingSecs % 60;
      
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');
      
      banner.innerHTML = `⚡ <b>48-HOUR PASS ACTIVE</b><br>⏱️ <b>${hStr}h ${mStr}m ${sStr}s</b> remaining`;
    } else {
      const clicksUsed = getDailyClicksCount();
      banner.style.display = 'block';
      banner.style.background = '#FAF7F2';
      banner.style.borderColor = 'var(--border-color)';
      banner.style.color = '#7A7571';
      banner.innerHTML = `🌱 <b>Free Account (${clicksUsed}/4 Daily Intercepts Used)</b><br><span style="text-decoration:underline; cursor:pointer; color:var(--text-color); font-weight:700;" onclick="openPaywallModal()">Get 2-Day Pass ($0.99)</span>`;
    }
  });
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
  updatePassCountdown();
}

/**
 * TALLIES WITH SUPABASE STATUS:
 * Turns every "PREMIUM UPGRADE" on Target Focus Area screen to "UNLOCKED PREMIUM AREA" in green font.
 */
function applyPremiumUIVisuals(hasAccess) {
  const allMetas = document.querySelectorAll('#screen-dashboard .deck-meta');
  allMetas.forEach(m => {
    const text = m.innerText.trim();
    if (text === 'PREMIUM UPGRADE' || text === 'UNLOCKED PREMIUM AREA') {
      if (hasAccess) {
        m.innerText = "UNLOCKED PREMIUM AREA";
        m.className = "deck-meta free";
        m.style.color = "var(--success-color)";
      } else {
        m.innerText = "PREMIUM UPGRADE";
        m.className = "deck-meta premium";
        m.style.color = "";
      }
    }
  });

  const dopamineDeck = document.querySelector('.deck-item[data-category="dopamine"]');
  if (dopamineDeck) {
    const name = dopamineDeck.querySelector('.deck-name');
    if (name) name.innerHTML = hasAccess ? "✅ The Dopamine Swap Deck" : "⚡ The Dopamine Swap Deck";
  }

  const overwhelmDeck = document.querySelector('.deck-item[data-category="overwhelm"]');
  if (overwhelmDeck) {
    const name = overwhelmDeck.querySelector('.deck-name');
    if (name) name.innerHTML = hasAccess ? "✅ The Anti-Overwhelm Deck" : "🧠 The Anti-Overwhelm Deck";
  }

  const customText = document.getElementById('custom-intercept-text');
  if (customText) {
    customText.innerHTML = hasAccess ? "✅ + Add Custom Intercept" : "⚡ + Add Custom Intercept";
  }
}

/* ========================================================
   SCREEN SWITCHER (3.0s SLOW-MOTION SLIDE UP DIVERSION)
======================================================== */
function switchScreen(screenId, shouldPushHistory = true) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (shouldPushHistory) {
      pushNavigationState(screenId);
    }

    const toast = document.getElementById('trigger-slideup-notification');
    if (screenId === 'screen-trigger') {
      if (toast) {
        toast.style.transition = 'none';
        toast.classList.remove('slide-up-show');
        toast.offsetHeight;
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            toast.style.transition = 'transform 3.0s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 2.2s ease';
            toast.classList.add('slide-up-show');
          }, 150);
        });
      }
    } else {
      if (toast) {
        toast.classList.remove('slide-up-show');
      }
    }

    if (screenId === 'screen-dashboard' || screenId === 'screen-onboarding-2') {
      updatePassCountdown();
      renderPresetIntercepts();
      renderCustomIntercepts();
      updateMetricDashboard();
    }
  }
}

function selectOption(el, frictionKey) {
  document.querySelectorAll('#screen-onboarding-2 .deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = frictionKey;
  localStorage.setItem('nudge_friction_style', frictionKey);
  switchScreen('screen-dashboard', true);
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
    switchScreen('screen-trigger', true);
  }
}

/* ========================================================
   TASK FETCHING: NON-REPEATING DIVERSE FOCUS ROTATION
======================================================== */
async function executeTurnaroundSpin() {
  const hasAccess = isUserPremiumOrPass();
  const dailyClicks = getDailyClicksCount();

  if (!hasAccess && dailyClicks >= 4) {
    alert("🔒 Daily Limit Reached (4/4 Intercepts Used Today)!\n\nUpgrade or get a 2-Day Pass ($0.99) for unlimited daily access.");
    openPaywallModal();
    return;
  }

  const timerDisplayEl = document.getElementById('timer-display');
  if (timerDisplayEl) timerDisplayEl.innerText = "02:00";

  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  if (btn) { btn.innerText = "HOLD..."; btn.style.opacity = "0.6"; }
  if (instruction) instruction.innerText = "Exhale slowly... allowing your focus to narrow down completely.";

  const categoryKey = selectedCategory || 'charisma';
  const frictionKey = mindFrictionStyle || 'mindless_scrolling';
  const userEmail = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  // Read non-repeating seen task indices and last focus area from persistent storage
  const seenKey = `nudge_seen_${categoryKey}`;
  const lastFocusKey = `nudge_last_focus_${categoryKey}`;
  const seenIndices = JSON.parse(localStorage.getItem(seenKey) || '[]');
  const lastFocus = localStorage.getItem(lastFocusKey) || '';

  try {
    let endpoint = `/api/get-task?category=${encodeURIComponent(categoryKey)}&friction=${encodeURIComponent(frictionKey)}&email=${encodeURIComponent(userEmail)}&seen=${encodeURIComponent(seenIndices.join(','))}&lastFocusArea=${encodeURIComponent(lastFocus)}`;
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

    // Track non-repeating sequence
    if (typeof data.taskIndex === 'number') {
      if (data.historyReset) {
        localStorage.setItem(seenKey, JSON.stringify([data.taskIndex]));
      } else {
        seenIndices.push(data.taskIndex);
        localStorage.setItem(seenKey, JSON.stringify(seenIndices));
      }
    }
    if (data.task.focusArea) {
      localStorage.setItem(lastFocusKey, data.task.focusArea);
    }

    if (!hasAccess) {
      incrementDailyClicks();
    }
    
    setTimeout(() => {
      if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      const focusAreaEl = document.getElementById('target-task-focus-area');
      
      if (taskDisplayEl && currentActiveTask) {
        taskDisplayEl.innerHTML = formatSpacedSentences(currentActiveTask.text);
      }
      
      if (focusAreaEl && currentActiveTask) {
        const rawArea = currentActiveTask.focusArea || "Energy Surge";
        const cleanArea = rawArea.replace(/^(focus\s*area\s*[:\-–—]?\s*)+/i, '').trim();

        if (categoryKey === 'overwhelm') {
          focusAreaEl.innerText = `FOCUS AREA: MOVE ${overwhelmCurrentStep} OF 4 • ${cleanArea.toUpperCase()}`;
        } else {
          focusAreaEl.innerText = `FOCUS AREA: ${cleanArea.toUpperCase()}`;
        }
      }
      
      switchScreen('screen-countdown', true);
      startActionTimer(120);
    }, 1500);
  } catch (err) {
    alert(`Focus Engine Response: ${err.message}`);
    switchScreen('screen-dashboard', true);
    if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
  }
}

function startActionTimer(seconds) {
  const display = document.getElementById('timer-display');
  clearInterval(countdownInterval);
  let timeLeft = seconds;

  const renderTime = (t) => {
    let m = Math.floor(t / 60);
    let s = t % 60;
    if (display) {
      display.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  };

  renderTime(timeLeft);
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) { 
      clearInterval(countdownInterval); 
      triggerVictoryPhase(2.0); 
      return;
    }
    renderTime(timeLeft);
  }, 1000);
}

function cancelTimer() {
  clearInterval(countdownInterval);
  const display = document.getElementById('timer-display');
  if (display) display.innerText = "02:00";
  updateMetricDashboard();
  switchScreen('screen-dashboard', false);
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
    displayEl.innerText = "02:00";
  }
  clearInterval(countdownInterval);
  triggerVictoryPhase(elapsedMinutes);
}

function triggerVictoryPhase(minutesEarned) {
  const isOverwhelm = currentActiveTask && currentActiveTask.deck === 'overwhelm';

  if (isOverwhelm && overwhelmCurrentStep >= 4) {
    totalWinsCount += 1;
    totalFocusReclaimed += 8.0;
  } else if (!isOverwhelm) {
    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
  }

  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

  const validationCopyEl = document.getElementById('victory-validation-copy');
  if (validationCopyEl) {
    const rawAffirmation = (currentActiveTask && currentActiveTask.affirmation)
      ? currentActiveTask.affirmation
      : "The freeze is broken. Action clears anxiety.";
    validationCopyEl.innerHTML = formatSpacedSentences(rawAffirmation);
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
        btnNext.innerText = `Continue to Move ${overwhelmCurrentStep + 1} →`;
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

  switchScreen('screen-victory', true);
}

function advanceOverwhelmNextMove() {
  if (overwhelmCurrentStep < 4) {
    overwhelmCurrentStep++;
  }
  executeTurnaroundSpin();
}

function claimRewardStack() {
  overwhelmCurrentStep = 1;
  const display = document.getElementById('timer-display');
  if (display) display.innerText = "02:00";
  updateMetricDashboard();
  syncLifetimeProgressToCloud();
  switchScreen('screen-dashboard', true);
}

function runAnotherRound() {
  updateMetricDashboard();
  syncLifetimeProgressToCloud();
  switchScreen('screen-trigger', true);
  executeTurnaroundSpin();
}

/* ========================================================
   PRESET INTERCEPTS (TOGGLEABLE & PERSISTENT AFTER CACHE CLEAR)
======================================================== */
function getStoredPresetIntercepts() {
  const stored = localStorage.getItem('nudge_preset_intercepts');
  if (!stored) {
    localStorage.setItem('nudge_preset_intercepts', JSON.stringify(DEFAULT_PRESET_INTERCEPTS));
    return DEFAULT_PRESET_INTERCEPTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PRESET_INTERCEPTS;
  }
}

function renderPresetIntercepts() {
  const container = document.getElementById('preset-intercepts-injection-point');
  if (!container) return;
  
  const presets = getStoredPresetIntercepts();
  container.innerHTML = '';

  presets.forEach((p, index) => {
    const formatted = formatTime12h(p.time);
    const isChecked = p.enabled !== false ? 'checked' : '';
    const html = `
      <div class="lifeline-item" style="margin-bottom: 8px;">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--text-color);">${formatted}</div>
          <div style="font-size: 11px; color: #7A7571; font-weight: 600;">${p.label}</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${isChecked} onchange="togglePresetInterceptState(${index})">
          <span class="slider"></span>
        </label>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

function togglePresetInterceptState(index) {
  const presets = getStoredPresetIntercepts();
  if (presets[index]) {
    presets[index].enabled = !presets[index].enabled;
    localStorage.setItem('nudge_preset_intercepts', JSON.stringify(presets));

    if (presets[index].enabled && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

/* ========================================================
   CUSTOM INTERCEPTS & NOTIFICATION MONITOR
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
  const frictionInput = document.getElementById('custom-friction-input').value || 'Mindless Scrolling';
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

function dispatchNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body: body,
          icon: '/images/icon-192.png',
          badge: '/images/icon-192.png',
          vibrate: [200, 100, 200]
        });
      });
    } else {
      new Notification(title, { body: body, icon: '/images/icon-192.png' });
    }
  }
}

function startBackgroundInterceptMonitor() {
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    // Monitor Presets
    const presets = getStoredPresetIntercepts();
    presets.forEach(p => {
      if (p.enabled && p.time === currentTimeStr && !p.triggeredToday) {
        p.triggeredToday = true;
        dispatchNotification("120 Reset Circuit Breaker", `Scheduled Intercept: ${p.label}. Tap to break the loop.`);
      }
    });

    // Monitor Customs
    const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
    customs.forEach(c => {
      if (c.enabled && c.time === currentTimeStr && !c.triggeredToday) {
        c.triggeredToday = true;
        dispatchNotification("120 Reset Circuit Breaker", `Scheduled Intercept: ${c.friction} (${c.deck}). Tap to break the loop.`);
      }
    });
  }, 30000);
}

/* ========================================================
   PAYWALL & SUBSCRIPTION GATEWAY
======================================================== */
function openPaywallModal() {
  const modal = document.getElementById('paywall-overlay');
  if (modal) modal.classList.add('active');
}

function closePaywall() {
  const modal = document.getElementById('paywall-overlay');
  if (modal) modal.classList.remove('active');
}

function selectTier(el) {
  document.querySelectorAll('.tier-box').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) { alert("Please select an option to continue."); return; }

  const planType = selectedTierBox.getAttribute('data-plan') || 'monthly';
  const paywallBtn = document.querySelector('#paywall-overlay .btn-primary');
  const userEmail = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  if (paywallBtn) { paywallBtn.innerText = "SECURING GATEWAY..."; paywallBtn.disabled = true; }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: planType,
        email: userEmail,
        successUrl: window.location.origin + '/app.html?session=success',
        cancelUrl: window.location.origin + '/app.html'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server status ${response.status}: ${errorText}`);
    }

    const session = await response.json();
    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error(session.error || "Unable to initialize Stripe session.");
    }
  } catch (err) {
    alert(`Checkout Error: ${err.message}`);
    if (paywallBtn) { paywallBtn.innerText = "Unlock Access Now"; paywallBtn.disabled = false; }
  }
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

async function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    const emailParam = urlParams.get('email');
    if (emailParam) {
      localStorage.setItem('nudge_user_email', emailParam.trim().toLowerCase());
    }
    alert("🎉 Payment confirmed! Synchronizing access with Supabase...");
    window.history.replaceState({}, document.title, window.location.pathname);
    await syncLifetimeProgressToCloud();
  }
}

async function syncLifetimeProgressToCloud() {
  const userEmail = localStorage.getItem('nudge_user_email');
  if (!userEmail || userEmail === 'anonymous_tester') return;

  try {
    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        total_wins: totalWinsCount,
        focus_reclaimed: totalFocusReclaimed
      })
    });
    const data = await response.json();
    if (data.profile) {
      currentUserProfile = data.profile;
      updatePassCountdown();
      applyPremiumUIVisuals(isUserPremiumOrPass());
    }
  } catch (e) {
    console.warn("Silent sync fallback:", e);
  }
}
