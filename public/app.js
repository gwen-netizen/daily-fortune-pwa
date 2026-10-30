/**
 * 120Reset Client Engine (public/app.js)
 * Clean Architecture with Standalone NeuraBrain Canvas Module
 * Auto-Fitting Drawers, High-Contrast Visibility Engine & Enlarged Profile Metrics
 */

let currentUserProfile = null;
let currentActiveTask = null;
let countdownInterval = null;
let passTickerInterval = null;
let selectedCategory = 'charisma';
let isPremiumSelected = false;
let overwhelmCurrentStep = 1;

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0;

window.activeSelectedFrictions = new Set();
let brainConstrictionRatio = 0.0;

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

function formatSpacedSentences(text) {
  if (!text) return '';
  const cleaned = text.trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);
  if (sentences.length > 1) {
    return sentences.map(s => `<div class="task-headline-text" style="margin-bottom: 22px; line-height: 1.45;">${s}</div>`).join('');
  }
  return `<div class="task-headline-text" style="line-height: 1.45;">${cleaned}</div>`;
}

function mapDeckNameToCategory(deckName) {
  if (!deckName) return 'charisma';
  const lower = deckName.toLowerCase();
  if (lower.includes('overwhelm')) return 'overwhelm';
  if (lower.includes('dopamine')) return 'dopamine';
  if (lower.includes('financial') || lower.includes('wealth')) return 'wealth';
  return 'charisma';
}

function getLocalDateString() {
  return new Date().toLocaleDateString('en-CA');
}

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
   TASK COMPLETION CREDIT & VISIBILITY (SCREENSHOT 1)
======================================================== */
function getTasksCreditToday() {
  const storedDate = localStorage.getItem('nudge_tasks_credit_date');
  const today = getLocalDateString();
  if (storedDate !== today) {
    localStorage.setItem('nudge_tasks_credit_date', today);
    localStorage.setItem('nudge_tasks_credit', '0');
    return 0;
  }
  const savedCredit = localStorage.getItem('nudge_tasks_credit');
  return savedCredit ? parseInt(savedCredit, 10) : 0;
}

function incrementTasksCompletedCredit(amount = 1) {
  const today = getLocalDateString();
  const current = getTasksCreditToday();
  const nextVal = current + amount;
  localStorage.setItem('nudge_tasks_credit_date', today);
  localStorage.setItem('nudge_tasks_credit', nextVal.toString());
  updateBrainStatusText();
  syncNeuraFrictions();
}

function getVisibilityMetrics() {
  const count = window.activeSelectedFrictions ? window.activeSelectedFrictions.size : 0;

  let baseVisibility = 100;
  if (count === 1) baseVisibility = 67;
  else if (count === 2) baseVisibility = 34;
  else if (count >= 3) baseVisibility = 1;

  const tasksCredit = getTasksCreditToday();
  const earnedVisibility = tasksCredit * 16.5;

  // Strictly clamp raw visibility between 1% and 100%
  const rawVisibility = Math.min(100.0, Math.max(1.0, baseVisibility + earnedVisibility));
  const displayVisibility = Math.min(100, Math.floor(rawVisibility));

  let subtitle = "Clear Signal";
  if (displayVisibility >= 100) {
    subtitle = "Clear Signal";
  } else if (displayVisibility >= 67) {
    subtitle = "Mild Foggy";
  } else if (displayVisibility >= 34) {
    subtitle = "Mid Foggy";
  } else {
    subtitle = "Intense Foggy";
  }

  const effectiveFogCount = Math.max(0, count - Math.floor(tasksCredit / 2));

  return {
    rawVisibility,
    displayVisibility,
    subtitle,
    effectiveFogCount,
    fogCoverageRatio: Math.max(0, (100 - displayVisibility) / 100)
  };
}

// RESTORED: This function was accidentally deleted during the last patch
function updateBrainStatusText() {
  const { displayVisibility, subtitle } = getVisibilityMetrics();
  const label = `${displayVisibility}% VISIBILITY • ${subtitle}`;

  const textS2 = document.getElementById('brain-status-s2');
  const textS3 = document.getElementById('brain-status-s3');

  if (textS2) textS2.innerText = label;
  if (textS3) textS3.innerText = label;
}

function syncNeuraFrictions() {
  if (window.NeuraBrain && typeof window.NeuraBrain.setFrictions === 'function') {
    // Pass the active dynamic visibility % into the WebGL/Canvas rendering file!
    const { displayVisibility } = getVisibilityMetrics();
    window.NeuraBrain.setFrictions(window.activeSelectedFrictions, displayVisibility);
  }
}

function updatePremiumDeckBadges() {
  const hasAccess = isUserPremiumOrPass();
  document.querySelectorAll('.deck-meta.premium').forEach(badge => {
    if (hasAccess) {
      badge.innerText = "PREMIUM AREA UNLOCKED ✓";
      badge.style.color = "var(--accent-safe)";
    } else {
      badge.innerText = "PREMIUM UPGRADE ⚡";
      badge.style.color = "var(--accent-gold)";
    }
  });
}

function resolveCurrentAccountEmail() {
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');
  if (emailParam && emailParam.includes('@')) {
    const clean = emailParam.trim().toLowerCase();
    localStorage.setItem('nudge_user_email', clean);
    return clean;
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('auth-token') || key === 'supabase.auth.token')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        const emailFound = item?.user?.email || item?.currentSession?.user?.email;
        if (emailFound && emailFound.includes('@')) {
          const clean = emailFound.trim().toLowerCase();
          localStorage.setItem('nudge_user_email', clean);
          return clean;
        }
      } catch (e) {}
    }
  }

  return localStorage.getItem('nudge_user_email') || '';
}

/* ========================================================
   BOTTOM SHEET SWIPE-TO-DISMISS GESTURE (THUMB SLIDE DOWN)
======================================================== */
function initBottomSheetSwipeDown() {
  const sheets = document.querySelectorAll('.modal-sheet, .paywall-sheet');

  sheets.forEach(sheet => {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;

    sheet.addEventListener('touchstart', (e) => {
      if (sheet.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      currentY = startY;
      startTime = Date.now();
      isDragging = true;
    }, { passive: true });

    sheet.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0 && sheet.scrollTop <= 0) {
        if (e.cancelable) e.preventDefault();
        sheet.style.transition = 'none';
        sheet.style.transform = `translateY(${deltaY}px)`;
      } else if (deltaY < 0) {
        sheet.style.transform = '';
      }
    }, { passive: false });

    sheet.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaY = currentY - startY;
      const elapsed = Date.now() - startTime;
      const velocity = deltaY / Math.max(elapsed, 1);

      sheet.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

      if (deltaY > 75 || (velocity > 0.4 && deltaY > 30)) {
        sheet.style.transform = 'translateY(100%)';
        setTimeout(() => {
          sheet.style.transform = '';
          sheet.style.transition = '';
          const parentModal = sheet.closest('.modal-backdrop, .paywall-modal');
          if (parentModal) {
            parentModal.classList.remove('active');
          }
        }, 220);
      } else {
        sheet.style.transform = 'translateY(0)';
        setTimeout(() => {
          sheet.style.transform = '';
          sheet.style.transition = '';
        }, 250);
      }

      startY = 0;
      currentY = 0;
    }, { passive: true });
  });
}

/* ========================================================
   INITIALIZATION & SEQUENTIAL BOOT
======================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem('120reset_returning_user', 'true');

  initBottomSheetSwipeDown();
  renderPresetIntercepts();
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();
  await checkStripeRedirectStatus();
  initBrainConstrictionState();

  const s2Container = document.getElementById('brain-viewport-s2');
  if (window.NeuraBrain && s2Container) {
    window.NeuraBrain.mount(s2Container);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const frictionParam = urlParams.get('friction');
  if (frictionParam && ['mindless_scrolling', 'task_paralysis', 'low_lethargy'].includes(frictionParam)) {
    window.activeSelectedFrictions.clear();
    window.activeSelectedFrictions.add(frictionParam);
    brainConstrictionRatio = 0.33;
    localStorage.setItem('nudge_selected_frictions', JSON.stringify([frictionParam]));
    localStorage.setItem('nudge_brain_constriction', '0.33');
    syncNeuraFrictions();
    syncFrictionChipsUI();
    updateBrainStatusText();
  }

  const activeEmail = resolveCurrentAccountEmail();
  if (activeEmail) {
    // 1. Instantly load cached profile to prevent UI hang
    const cachedProfile = localStorage.getItem('nudge_cached_profile');
    if (cachedProfile) {
      try {
        currentUserProfile = JSON.parse(cachedProfile);
        totalWinsCount = parseInt(currentUserProfile.total_wins, 10) || totalWinsCount;
        totalFocusReclaimed = parseFloat(currentUserProfile.focus_reclaimed) || totalFocusReclaimed;
      } catch(e) {}
    }
    // 2. Fetch from cloud silently in the background
  } else {
    currentUserProfile = null;
  }

  startPassTicker();
  updateMetricDashboard();
  updatePremiumDeckBadges();
  updateBrainStatusText();

  switchScreen('screen-welcome', false);
});

async function fetchUserProfileFromCloud(email) {
  if (!email || !email.includes('@')) {
    throw new Error("No registered email identity found.");
  }

  const cleanEmail = email.trim().toLowerCase();
  localStorage.setItem('nudge_user_email', cleanEmail);
  const localDate = getLocalDateString();
  const endpoint = `/api/sync-user?email=${encodeURIComponent(cleanEmail)}&action=get_profile&clientDate=${encodeURIComponent(localDate)}`;

  // 10-second timeout to prevent infinite hanging if offline
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Server returned status ${response.status}`);

    const data = await response.json();
    if (!data || !data.profile) throw new Error("Database record tally incomplete.");

    // Tally real Supabase records
    currentUserProfile = data.profile;
    totalWinsCount = parseInt(data.profile.total_wins, 10) || 0;
    totalFocusReclaimed = parseFloat(data.profile.focus_reclaimed) || 0.0;

    localStorage.setItem('nudge_cached_profile', JSON.stringify(data.profile));
    localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
    localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

    updateMetricDashboard();
    updatePremiumDeckBadges();
    return data.profile;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// User Action: Tapping ENTER
async function initiateSecureAppEntry() {
  const email = resolveCurrentAccountEmail();
  
  if (!email) {
    switchScreen('screen-onboarding-1', true);
    return;
  }

  // 1. Enter the loading gateway to wait for Supabase
  switchScreen('screen-syncing', false);
  setSyncLoadingState(true);

  // Pause 3D Brain while syncing to ensure UI doesn't lag
  if (window.NeuraBrain && typeof window.NeuraBrain.unmount === 'function') {
    window.NeuraBrain.unmount();
  }

  try {
    // 2. Await verified tally from Supabase
    await fetchUserProfileFromCloud(email);
    setSyncLoadingState(false);
    switchScreen('screen-onboarding-2', true);
  } catch (error) {
    // 3. Prevent crash, expose retry UI
    console.error("Supabase tally failed:", error);
    showSyncErrorState(error.name === 'AbortError' ? "Connection timed out." : error.message);
  }
}

function retrySupabaseSync() {
  initiateSecureAppEntry();
}

function setSyncLoadingState(isLoading) {
  const spinner = document.getElementById('sync-spinner-orb');
  const headline = document.getElementById('sync-status-headline');
  const subtext = document.getElementById('sync-status-subtext');
  const errorCard = document.getElementById('sync-error-card');

  if (isLoading) {
    if (spinner) spinner.style.display = 'flex';
    if (headline) headline.innerText = "Setting Up...";
    if (subtext) subtext.innerText = "Tallying account metrics and subscription tokens.";
    if (errorCard) errorCard.style.display = 'none';
  }
}

function showSyncErrorState(msg) {
  const spinner = document.getElementById('sync-spinner-orb');
  const headline = document.getElementById('sync-status-headline');
  const subtext = document.getElementById('sync-status-subtext');
  const errorCard = document.getElementById('sync-error-card');
  const errorMsg = document.getElementById('sync-error-message');

  if (spinner) spinner.style.display = 'none';
  if (headline) headline.innerText = "Connection Failed";
  if (subtext) subtext.innerText = "Could not sync your records with the cloud.";
  if (errorMsg) errorMsg.innerText = msg || "Verification error.";
  if (errorCard) errorCard.style.display = 'block';
}

async function syncUserAccountEmail() {
  const inputEl = document.getElementById('profile-email-input');
  const msgEl = document.getElementById('sync-feedback-msg');
  if (!inputEl) return;

  const targetEmail = inputEl.value.trim().toLowerCase();
  if (!targetEmail || !targetEmail.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }

  if (msgEl) {
    msgEl.style.display = 'block';
    msgEl.style.color = 'var(--accent-gold)';
    msgEl.innerText = 'Connecting...';
  }

  const profile = await fetchUserProfileFromCloud(targetEmail);

  if (profile) {
    if (msgEl) {
      const isPrem = isUserPremiumOrPass();
      msgEl.style.color = 'var(--accent-safe)';
      msgEl.innerText = `✓ Connected: ${profile.email} (${isPrem ? 'Premium Unlocked' : 'Free Tier'})`;
    }
    openProfileModal();
  } else {
    if (msgEl) {
      msgEl.style.color = 'var(--accent-coral)';
      msgEl.innerText = 'Error syncing with database. Check API deployment.';
    }
  }
}

function handleWelcomeContinue() {
  switchScreen('screen-onboarding-2', true);
}

function confirmFrictionsAndOpenDashboard() {
  if (window.activeSelectedFrictions.size === 0) {
    return; // Stop progression if no friction is selected
  }
  switchScreen('screen-dashboard', true);
}
function initBrainConstrictionState() {
  const storedRatio = localStorage.getItem('nudge_brain_constriction');
  brainConstrictionRatio = storedRatio !== null ? parseFloat(storedRatio) : 0.0;

  const storedFrictions = localStorage.getItem('nudge_selected_frictions');
  if (storedFrictions) {
    try {
      const arr = JSON.parse(storedFrictions);
      window.activeSelectedFrictions = new Set(arr);
    } catch (e) {
      window.activeSelectedFrictions.clear();
    }
  }

  syncNeuraFrictions();
  syncFrictionChipsUI();
  updateBrainStatusText();
}

const FRICTION_TO_CATEGORY = {
  'mindless_scrolling': 'dopamine',
  'task_paralysis': 'overwhelm',
  'low_lethargy': 'charisma'
};

function updateSelectedDeckUI(categoryKey) {
  if (!categoryKey) return;
  document.querySelectorAll('#screen-dashboard .deck-item').forEach(d => {
    if (d.getAttribute('data-category') === categoryKey) {
      d.classList.add('selected');
    } else {
      d.classList.remove('selected');
    }
  });
  updateStartScreenHeading(categoryKey);
}

function toggleFrictionSelection(el, frictionKey) {
  if (window.activeSelectedFrictions.has(frictionKey)) {
    window.activeSelectedFrictions.delete(frictionKey);
  } else {
    window.activeSelectedFrictions.add(frictionKey);
  }

  // Reset task completion credits for the new friction session
  const today = getLocalDateString();
  localStorage.setItem('nudge_tasks_credit_date', today);
  localStorage.setItem('nudge_tasks_credit', '0');

  const count = window.activeSelectedFrictions.size;
  brainConstrictionRatio = count === 0 ? 0.0 : (count === 1 ? 0.33 : (count === 2 ? 0.66 : 1.0));

  localStorage.setItem('nudge_brain_constriction', brainConstrictionRatio.toFixed(2));
  localStorage.setItem('nudge_selected_frictions', JSON.stringify(Array.from(window.activeSelectedFrictions)));

  // Automatically update active category and deck selection based on selected friction
  const activeArr = Array.from(window.activeSelectedFrictions);
  const latestFriction = activeArr[activeArr.length - 1] || frictionKey;
  if (FRICTION_TO_CATEGORY[latestFriction]) {
    selectedCategory = FRICTION_TO_CATEGORY[latestFriction];
    isPremiumSelected = (selectedCategory === 'dopamine' || selectedCategory === 'overwhelm');
    updateSelectedDeckUI(selectedCategory);
  }

  syncNeuraFrictions();
  syncFrictionChipsUI();
  updateBrainStatusText();
}
function syncFrictionChipsUI() {
  document.querySelectorAll('.friction-chip').forEach(chip => {
    const key = chip.getAttribute('data-friction');
    chip.classList.remove('selected-red', 'selected-orange', 'selected-yellow');

    if (window.activeSelectedFrictions.has(key)) {
      if (key === 'mindless_scrolling') chip.classList.add('selected-red');
      else if (key === 'task_paralysis') chip.classList.add('selected-orange');
      else if (key === 'low_lethargy') chip.classList.add('selected-yellow');
    }
  });
}

function switchScreen(screenId, shouldPushHistory = true) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (shouldPushHistory) {
      pushNavigationState(screenId);
    }

    if (screenId === 'screen-onboarding-2' || screenId === 'screen-dashboard') {
      const targetContainer = document.getElementById(screenId === 'screen-onboarding-2' ? 'brain-viewport-s2' : 'brain-viewport-s3');
      if (targetContainer && window.NeuraBrain) {
        window.NeuraBrain.mount(targetContainer);
      }
    } else {
      // Pause the 3D rendering when the brain is not visible to completely eliminate lag
      if (window.NeuraBrain && typeof window.NeuraBrain.unmount === 'function') {
        window.NeuraBrain.unmount();
      }
    }

    if (screenId === 'screen-dashboard' || screenId === 'screen-onboarding-2' || screenId === 'screen-victory') {
      updatePassCountdown();
      updateBrainStatusText();
      updatePremiumDeckBadges();
      syncNeuraFrictions();
    }
  }
}

function selectDeck(el, isPremium, categoryKey) {
  if (['financial_freeze_impulse', 'financial-reset', 'financial_reset'].includes(categoryKey)) {
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

async function executeTurnaroundSpin() {
  const hasAccess = isUserPremiumOrPass();
  const dailyClicks = getDailyClicksCount();

  if (!hasAccess && dailyClicks >= 4) {
    openPaywallModal();
    return;
  }

  const timerDisplayEl = document.getElementById('timer-display');
  if (timerDisplayEl) timerDisplayEl.innerText = "02:00";

  const btn = document.querySelector('.big-red-btn');
  const instruction = document.getElementById('trigger-instructions');
  if (btn) { btn.innerText = "HOLD..."; btn.style.opacity = "0.6"; }
  if (instruction) instruction.innerText = "Exhale slowly... allowing focus to narrow completely.";

  const categoryKey = selectedCategory || 'charisma';
  const frictionKey = Array.from(window.activeSelectedFrictions)[0] || 'mindless_scrolling';
  const userEmail = resolveCurrentAccountEmail();

  const seenKey = `nudge_seen_${categoryKey}`;
  const seenIndices = JSON.parse(localStorage.getItem(seenKey) || '[]');

  try {
    let endpoint = `/api/get-task?category=${encodeURIComponent(categoryKey)}`
      + `&friction=${encodeURIComponent(frictionKey)}`
      + `&email=${encodeURIComponent(userEmail)}`
      + `&seen=${encodeURIComponent(seenIndices.join(','))}`
      + `&isPremium=${isPremiumSelected && hasAccess ? 'true' : 'false'}`;

    if (categoryKey === 'overwhelm') {
      endpoint += `&step=${overwhelmCurrentStep}`;
    }

    let taskData = null;
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        taskData = await response.json();
      }
    } catch (netErr) {
      console.error("Backend API connection failed:", netErr);
      alert("Connection lost. Please check your internet and try again. 120Reset requires an active connection.");
      return;
    }

    if (!taskData || !taskData.task) {
      alert("Task generation failed. Please try again.");
      return;
    }

    currentActiveTask = taskData.task;
    currentActiveTask.deck = categoryKey;

    if (typeof taskData.taskIndex === 'number') {
      if (taskData.historyReset) {
        localStorage.setItem(seenKey, JSON.stringify([taskData.taskIndex]));
      } else {
        seenIndices.push(taskData.taskIndex);
        localStorage.setItem(seenKey, JSON.stringify(seenIndices));
      }
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
          focusAreaEl.innerHTML = `<div>FOCUS AREA: ${cleanArea.toUpperCase()}</div><div style="margin-top: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; opacity: 0.85;">MOVE ${overwhelmCurrentStep} OF 4</div>`;
        } else {
          focusAreaEl.innerText = `FOCUS AREA: ${cleanArea.toUpperCase()}`;
        }
      }
      
      switchScreen('screen-countdown', true);
      startActionTimer(120);
    }, 1200);
  } catch (err) {
    console.error("Execution error:", err);
    if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
    switchScreen('screen-dashboard', true);
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
  const overwhelmActions = document.getElementById('overwhelm-victory-actions');
  const standardActions = document.getElementById('standard-victory-actions');
  const btnOverwhelmNext = document.getElementById('btn-overwhelm-next');
  const btnOverwhelmReset = document.getElementById('btn-overwhelm-reset');
  const victoryTitle = document.getElementById('victory-title-text');
  const victoryPoints = document.getElementById('victory-points-reclaimed-badge');
  const noticeEl = document.getElementById('victory-unwind-notice');

  if (isOverwhelm && overwhelmCurrentStep >= 4) {
    totalWinsCount += 1;
    totalFocusReclaimed += 8.0;
    incrementTasksCompletedCredit(2);
  } else if (!isOverwhelm) {
    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
    incrementTasksCompletedCredit(1);
  }

  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

  if (isOverwhelm) {
    if (standardActions) standardActions.style.display = 'none';
    if (overwhelmActions) overwhelmActions.style.display = 'flex';

    if (overwhelmCurrentStep < 4) {
      if (btnOverwhelmNext) {
        btnOverwhelmNext.style.display = 'block';
        btnOverwhelmNext.innerHTML = `Continue to Move ${overwhelmCurrentStep + 1} of 4 &rarr;`;
      }
      if (btnOverwhelmReset) btnOverwhelmReset.style.display = 'none';
      if (victoryTitle) victoryTitle.innerText = `Move ${overwhelmCurrentStep} of 4 Complete.`;
      if (victoryPoints) victoryPoints.innerText = `+120s Focus Reclaimed (Step ${overwhelmCurrentStep}/4)`;
      if (noticeEl) {
        noticeEl.innerHTML = `✨ Step ${overwhelmCurrentStep} cleared! Complete all 4 moves to clear the tension stack.`;
        noticeEl.style.color = "var(--accent-gold)";
      }
    } else {
      if (btnOverwhelmNext) btnOverwhelmNext.style.display = 'none';
      if (btnOverwhelmReset) {
        btnOverwhelmReset.style.display = 'block';
        btnOverwhelmReset.innerHTML = `Claim 4x Protocol Stack &rarr;`;
      }
      if (victoryTitle) victoryTitle.innerText = "4x Protocol Complete!";
      if (victoryPoints) victoryPoints.innerText = "+480s Focus Reclaimed (4/4 Complete)";
      if (noticeEl) {
        noticeEl.innerHTML = "🌟 <b>100% UNLOCKED!</b> Brain fog dissolved. Signal fully restored.";
        noticeEl.style.color = "var(--accent-safe)";
      }
    }
  } else {
    if (overwhelmActions) overwhelmActions.style.display = 'none';
    if (standardActions) standardActions.style.display = 'flex';
    if (victoryTitle) victoryTitle.innerText = "Impact Confirmed.";
    if (victoryPoints) victoryPoints.innerText = "+120s Focus Reclaimed";
    if (noticeEl) {
      noticeEl.innerHTML = "✨ Signal clearing! Brain visibility increasing.";
      noticeEl.style.color = "var(--accent-gold)";
    }
  }

  const chime = document.getElementById('victory-chime');
  if (chime) {
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }

  if (typeof confetti === 'function') {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }

  syncLifetimeProgressToCloud();
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

function getDailyClicksCount() {
  const today = getLocalDateString();
  const savedDate = localStorage.getItem('nudge_click_date');

  if (savedDate !== today) {
    localStorage.setItem('nudge_click_date', today);
    localStorage.setItem('nudge_click_count', '0');
    return 0;
  }

  if (currentUserProfile && currentUserProfile.last_click_date === today) {
    const cloudCount = parseInt(currentUserProfile.daily_clicks, 10) || 0;
    const localCount = parseInt(localStorage.getItem('nudge_click_count') || '0', 10);
    const highestCount = Math.max(cloudCount, localCount);
    localStorage.setItem('nudge_click_count', highestCount.toString());
    return highestCount;
  }

  return parseInt(localStorage.getItem('nudge_click_count') || '0', 10);
}

function incrementDailyClicks() {
  const count = getDailyClicksCount() + 1;
  const today = getLocalDateString();
  localStorage.setItem('nudge_click_date', today);
  localStorage.setItem('nudge_click_count', count.toString());

  if (currentUserProfile) {
    currentUserProfile.daily_clicks = count;
    currentUserProfile.last_click_date = today;
  }

  updateMetricDashboard();
  syncLifetimeProgressToCloud();
}

function isUserPremiumOrPass() {
  if (!currentUserProfile) return false;
  if (currentUserProfile.pass_expires_at) {
    const expiryMs = parseDbTimestamp(currentUserProfile.pass_expires_at);
    return Date.now() < expiryMs;
  }
  return currentUserProfile.premium_user === true || 
         currentUserProfile.premium_user === 'true' || 
         currentUserProfile.is_premium === true || 
         currentUserProfile.is_premium === 'true';
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
  const quotaBadge = document.getElementById('remedy-quota-badge');
  const hasAccess = isUserPremiumOrPass();

  if (quotaBadge) {
    if (hasAccess) {
      quotaBadge.className = "remedy-quota-pill unlimited";
      quotaBadge.innerHTML = "⚡ Unlimited";
    } else {
      const used = getDailyClicksCount();
      quotaBadge.className = "remedy-quota-pill";
      quotaBadge.innerHTML = `<div style="text-align: center; line-height: 1.2;">(${used}/4<br>Free)</div>`;
    }
  }

  // Live Updating Pass & Subscription Cards (Screen 2 & 3)
  const cardS2 = document.getElementById('pass-notification-card-s2');
  const cardS3 = document.getElementById('pass-notification-card-s3');
  const remainingSecs = getPassRemainingSeconds();
  
let cardHtml = '';
 if (hasAccess && !currentUserProfile?.pass_expires_at) {
    cardHtml = '';
  } else if (remainingSecs > 0) {
    const hours = Math.floor(remainingSecs / 3600);
    const mins = Math.floor((remainingSecs % 3600) / 60);
    const secs = remainingSecs % 60;
    cardHtml = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="color:var(--accent-gold); font-weight:800;">⚡ ACTIVE PLAN: 2-DAY PASS</span>
        <span style="color:var(--text-muted); font-size:11.5px;">⏱️ <b>${hours}h ${mins}m ${secs}s</b> remaining</span>
      </div>`;
  }

  if (cardS2) {
    cardS2.innerHTML = cardHtml;
    cardS2.style.display = cardHtml ? 'block' : 'none';
  }
  if (cardS3) {
    cardS3.innerHTML = cardHtml;
    cardS3.style.display = cardHtml ? 'block' : 'none';
  }

  const refCodeEl = document.getElementById('user-referral-code-display');
  if (refCodeEl && currentUserProfile?.referral_code) {
    refCodeEl.innerText = currentUserProfile.referral_code;
  }
}

// Screenshot 3 Fix: Update Profile Stats Card with bold enlarged values
function updateMetricDashboard() {
  updatePassCountdown();
  updatePremiumDeckBadges();
  updateBrainStatusText();
  syncNeuraFrictions();

  const winsEl = document.getElementById('profile-stat-wins');
  const focusEl = document.getElementById('profile-stat-focus');
  if (winsEl) winsEl.innerText = totalWinsCount.toString();
  if (focusEl) focusEl.innerText = `${totalFocusReclaimed.toFixed(1)}m`;

  // Render Plan & Subscription Date in Profile Card
  const planNameEl = document.getElementById('profile-plan-name');
  const planDateEl = document.getElementById('profile-plan-date');

  if (planNameEl) {
    const isPremium = isUserPremiumOrPass();
    const hasPass = currentUserProfile?.pass_expires_at && new Date(currentUserProfile.pass_expires_at) > new Date();

    if (hasPass) {
      planNameEl.innerText = "⚡ 2-Day Pass Active";
      if (planDateEl) planDateEl.style.display = 'none';
    } else if (isPremium) {
      planNameEl.innerText = "Year-Round Override";
      
      if (planDateEl && currentUserProfile?.subscribed_at) {
        const subDate = new Date(currentUserProfile.subscribed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        planDateEl.innerText = `Subscribed on: ${subDate}`;
        planDateEl.style.display = 'block';
      } else if (planDateEl) {
        planDateEl.style.display = 'none';
      }
    } else {
      planNameEl.innerText = "Free Tier";
      if (planDateEl) planDateEl.style.display = 'none';
    }
  }
}

async function syncLifetimeProgressToCloud() {
  const userEmail = resolveCurrentAccountEmail();
  if (!userEmail) return;

  const currentClicks = getDailyClicksCount();
  const today = getLocalDateString();

  try {
    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        total_wins: totalWinsCount,
        focus_reclaimed: totalFocusReclaimed,
        daily_clicks: currentClicks,
        clientDate: today
      })
    });
   const data = await response.json();
    if (data && data.profile) {
      currentUserProfile = data.profile;
      // Keep cache updated after every win
      localStorage.setItem('nudge_cached_profile', JSON.stringify(data.profile));
      updatePassCountdown();
      updatePremiumDeckBadges();
    }
  } catch (e) {
    console.warn("Supabase background sync fallback:", e);
  }
}

/* ========================================================
   MODALS, DRAWERS & ACCOUNT PROFILE
======================================================== */
function updatePaywallPillBadge() {
  const pill = document.getElementById('paywall-pill-badge');
  if (!pill) return;
  const hasAccess = isUserPremiumOrPass();
  pill.innerText = hasAccess ? "UNLIMITED ACCESS UNLOCKED" : "GET UNLIMITED ACCESS";
  pill.style.background = "rgba(255, 255, 255, 0.08)";
  pill.style.color = "#FFFFFF";
  pill.style.borderColor = "rgba(255, 255, 255, 0.22)";
}

function openPaywallModal() {
  updatePaywallPillBadge();
  const modal = document.getElementById('paywall-overlay');
  if (modal) modal.classList.add('active');
}

function closePaywall() {
  closeModal('paywall-overlay');
}

function selectTier(el) {
  document.querySelectorAll('.tier-card').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function openInterceptsDrawer() {
  const modal = document.getElementById('intercepts-drawer-modal');
  if (modal) modal.classList.add('active');
}

function openReferralModal() {
  const modal = document.getElementById('referral-reward-modal');
  if (modal) {
    modal.classList.add('active');
    const refCode = currentUserProfile?.referral_code || localStorage.getItem('nudge_cached_ref_code') || '120R-SYNC';
    const refCodeEl = document.getElementById('user-referral-code-display');
    if (refCodeEl) refCodeEl.innerText = refCode;
    checkReferralEligibility();
  }
}

// Safari & iOS-Compatible One-Touch Copy
function copyReferralCode() {
  const codeEl = document.getElementById('user-referral-code-display');
  let refCode = currentUserProfile?.referral_code || '';
  
  if (!refCode || refCode.includes('...')) {
    refCode = codeEl ? codeEl.innerText.trim() : '120R-SYNC';
  }

  const copyBtn = document.getElementById('btn-copy-ref-code');

  function showSuccess() {
    if (!copyBtn) return;
    copyBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;
    copyBtn.style.borderColor = "#22c55e";
    copyBtn.style.background = "rgba(34, 197, 94, 0.18)";

    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
      copyBtn.style.borderColor = "var(--accent-gold)";
      copyBtn.style.background = "rgba(243, 197, 71, 0.16)";
    }, 2000);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(refCode).then(showSuccess).catch(() => {
      fallbackCopyText(refCode, showSuccess);
    });
  } else {
    fallbackCopyText(refCode, showSuccess);
  }
}

function fallbackCopyText(text, onSuccess) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', '');
  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const successful = document.execCommand('copy');
    if (successful && typeof onSuccess === 'function') {
      onSuccess();
    }
  } catch (err) {
    prompt("Copy referral code:", text);
  }
  document.body.removeChild(textarea);
}

// Check if user has unlocked passes ready to claim
async function checkReferralEligibility() {
  const userEmail = resolveCurrentAccountEmail();
  const claimBtn = document.getElementById('btn-claim-referral-pass');
  const countEl = document.getElementById('referral-completed-count');
  if (!userEmail || !claimBtn) return;

  try {
    const res = await fetch(`/api/sync-user?email=${encodeURIComponent(userEmail)}&action=check_referral_eligibility`);
    if (res.ok) {
      const data = await res.json();
      const eligibleCount = data.eligibleCount || 0;
      const helpedCount = data.helpedCount || 0;

      if (countEl) countEl.innerText = `${helpedCount} Helped`;

     if (eligibleCount > 0) {
        // User is eligible: Change CTA background to Warm Gold
        claimBtn.style.background = "var(--accent-gold)";
        claimBtn.style.color = "#08111f";
        claimBtn.style.border = "1px solid var(--accent-gold)";
        claimBtn.style.fontWeight = "800";
        claimBtn.style.height = "50px";
        claimBtn.style.minHeight = "50px";
        claimBtn.innerText = `⚡ Claim Unlocked Free Pass (${eligibleCount} Ready!)`;
      } else {
        // Retain original default color
        claimBtn.style.background = "rgba(194, 243, 221, 0.12)";
        claimBtn.style.color = "var(--accent-safe)";
        claimBtn.style.border = "1px solid rgba(194, 243, 221, 0.35)";
        claimBtn.style.fontWeight = "700";
        claimBtn.style.height = "50px";
        claimBtn.style.minHeight = "50px";
        claimBtn.innerText = "⚡ Claim Free Pass";
      }
    }
  } catch (e) {}
}
async function selectTierAndCheckout(el) {
  document.querySelectorAll('.tier-card').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  await simulatePurchase();
}

function openProfileModal() {
  const modal = document.getElementById('profile-drawer-modal');
  if (modal) {
    const emailDisplay = document.getElementById('profile-email-display');
    const winsEl = document.getElementById('profile-stat-wins');
    const focusEl = document.getElementById('profile-stat-focus');
    const passCard = document.getElementById('profile-pass-status-card');

    const email = resolveCurrentAccountEmail();
    if (emailDisplay) emailDisplay.innerText = email;
    if (winsEl) winsEl.innerText = totalWinsCount.toString();
    if (focusEl) focusEl.innerText = `${totalFocusReclaimed.toFixed(1)}m`;

    const hasAccess = isUserPremiumOrPass();
    const remainingSecs = getPassRemainingSeconds();

    if (passCard) {
      if (hasAccess && !currentUserProfile?.pass_expires_at) {
        passCard.innerHTML = `<span style="color:var(--accent-safe); font-weight:800;">✅ FULL UNLIMITED ACCESS</span><br><span style="color:var(--text-muted); font-size:12px;">Permanent unrestricted daily resets.</span>`;
      } else if (remainingSecs > 0) {
        const hours = Math.floor(remainingSecs / 3600);
        const mins = Math.floor((remainingSecs % 3600) / 60);
        passCard.innerHTML = `<span style="color:var(--accent-gold); font-weight:800;">⚡ 48-HOUR PASS ACTIVE</span><br><span style="color:var(--text-muted); font-size:12px;">⏱️ <b>${hours}h ${mins}m</b> remaining</span>`;
      } else {
        const used = getDailyClicksCount();
        passCard.innerHTML = `<span style="color:var(--text-muted); font-weight:700;">Free Tier (${used}/4 Resets Used Today)</span><br><span style="color:var(--accent-coral); font-weight:700; cursor:pointer; text-decoration:underline;" onclick="closeModal('profile-drawer-modal'); openPaywallModal();">Upgrade to Unlimited ($0.99)</span>`;
      }
    }
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function handleUserSignOut() {
  if (confirm("Reset local beta session?")) {
    localStorage.clear();
    window.location.href = '/app.html';
  }
}

async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-card.selected');
  if (!selectedTierBox) { alert("Please select an option to continue."); return; }

  const planType = selectedTierBox.getAttribute('data-plan') || 'monthly';
  const paywallBtn = document.querySelector('#paywall-overlay .btn-primary');
  const userEmail = resolveCurrentAccountEmail() || 'beta_tester@120reset.app';

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

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Server status ${response.status}`);
    if (data.url) window.location.href = data.url;
    else throw new Error("Unable to initialize Stripe session.");
  } catch (err) {
    alert(`Checkout Notice: ${err.message}`);
    if (paywallBtn) { paywallBtn.innerText = "Unlock Access Now"; paywallBtn.disabled = false; }
  }
}

async function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    const returnedEmail = urlParams.get('email');
    if (returnedEmail && returnedEmail.includes('@')) {
      localStorage.setItem('nudge_user_email', returnedEmail.trim().toLowerCase());
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    await syncLifetimeProgressToCloud();
  }
}

function getStoredPresetIntercepts() {
  const stored = localStorage.getItem('nudge_preset_intercepts');
  if (!stored) {
    localStorage.setItem('nudge_preset_intercepts', JSON.stringify(DEFAULT_PRESET_INTERCEPTS));
    return DEFAULT_PRESET_INTERCEPTS;
  }
  try { return JSON.parse(stored); } catch (e) { return DEFAULT_PRESET_INTERCEPTS; }
}

function renderPresetIntercepts() {
  const container = document.getElementById('preset-intercepts-injection-point');
  if (!container) return;
  const presets = getStoredPresetIntercepts();
  container.innerHTML = '';

  presets.forEach((p, index) => {
    const isChecked = p.enabled !== false ? 'checked' : '';
    const html = `
      <div class="lifeline-item" style="margin-bottom: 6px;">
        <div>
          <div style="font-weight: 800; font-size: 13.5px; color: #FFF;">${p.time}</div>
          <div style="font-size: 11px; color: #71717A; font-weight: 600;">${p.label}</div>
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
  }
}

function renderCustomIntercepts() {
  const injectionPoint = document.getElementById('custom-intercepts-injection-point');
  if (!injectionPoint) return;
  injectionPoint.innerHTML = ''; 
  const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  
  customs.forEach((c, index) => {
    if (!c.time) return;
    const isChecked = c.enabled !== false ? 'checked' : '';

    const html = `
      <div class="lifeline-item" style="border-color: #F97316; margin-bottom: 6px;">
        <div>
          <div style="font-weight: 800; font-size: 13.5px; color: #F97316;">${c.time}</div>
          <div style="font-size: 11px; color: #71717A; font-weight: 600;">Custom: ${c.friction || 'General Intercept'}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="toggle-switch"><input type="checkbox" ${isChecked} onchange="toggleCustomInterceptState(${index})"><span class="slider"></span></label>
          <button onclick="deleteCustomIntercept(${index})" style="background:none; border:none; color:#71717A; cursor:pointer; font-size:16px;">✕</button>
        </div>
      </div>
    `;
    injectionPoint.insertAdjacentHTML('beforeend', html);
  });
}

function toggleCustomInterceptState(index) {
  if (!isUserPremiumOrPass()) {
    openPaywallModal();
    renderCustomIntercepts();
    return;
  }
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

function openCustomInterceptModal() {
  if (!isUserPremiumOrPass()) {
    closeModal('intercepts-drawer-modal');
    openPaywallModal();
    return;
  }
  const modal = document.getElementById('custom-intercept-modal');
  if (modal) modal.classList.add('active');
}

function closeCustomInterceptModal() {
  closeModal('custom-intercept-modal');
}

function saveCustomIntercept() {
  if (!isUserPremiumOrPass()) {
    closeCustomInterceptModal();
    openPaywallModal();
    return;
  }
  const timeInput = document.getElementById('custom-time-input')?.value;
  if (!timeInput) return;

  const frictionInput = document.getElementById('custom-friction-input')?.value || 'Mindless Scrolling';
  const deckInput = document.getElementById('custom-deck-input')?.value || 'The Anti-Overwhelm Deck';

  const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  customs.push({ 
    id: `anc_${Date.now()}`, 
    time: timeInput, 
    friction: frictionInput,
    deck: deckInput,
    enabled: true 
  });
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));

  closeCustomInterceptModal();
  renderCustomIntercepts();
}
function startBackgroundInterceptMonitor() {
  setInterval(() => {
    try {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
      
      const presets = getStoredPresetIntercepts();
      const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
      const allIntercepts = [...presets, ...customs];

      allIntercepts.forEach(p => {
        if (p.enabled && p.time === currentTimeStr) {
          const activeScreen = document.querySelector('.screen.active');
          if (activeScreen && activeScreen.id !== 'screen-countdown') {
            selectedCategory = mapDeckNameToCategory(p.deck || 'The Anti-Overwhelm Deck');
            updateStartScreenHeading(selectedCategory);
            switchScreen('screen-trigger', true);
          }
        }
      });
    } catch (err) {}
  }, 15000);
}

/* ========================================================
   WEB PUSH NOTIFICATION & SERVICE WORKER RECEIVER
======================================================== */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'open_referral_modal') {
      openReferralModal();
    } else if (event.data && event.data.action === 'trigger_reset_intercept') {
      const targetDeck = event.data.deck || 'The Anti-Overwhelm Deck';
      if (typeof mapDeckNameToCategory === 'function') {
        selectedCategory = mapDeckNameToCategory(targetDeck);
        updateStartScreenHeading(selectedCategory);
      }
      switchScreen('screen-trigger', true);
    }
  });
}

async function shareReferralLink() {
  const refCode = currentUserProfile?.referral_code || localStorage.getItem('nudge_cached_ref_code') || '120R-SYNC';
  const shareUrl = `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`;
  const shareText = `Use my code "${refCode}" for a free 48h unlimited reset pass on 120Reset:`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: '120Reset 48h Pass',
        text: shareText,
        url: shareUrl
      });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }

  // Fallback if system share is not supported (Desktop/Web)
  try {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    alert("📋 Invite link copied! Paste it in WhatsApp, Telegram, or any chat app.");
  } catch (err) {
    prompt("Copy and share your invite link:", `${shareText} ${shareUrl}`);
  }
}
async function checkAndClaimReferralReward() {
  const userEmail = resolveCurrentAccountEmail();
  if (!userEmail) {
    alert("Please log in to claim referral rewards.");
    return;
  }

  const claimBtn = document.getElementById('btn-claim-referral-pass');
  if (claimBtn) {
    claimBtn.innerText = "Checking Rewards...";
    claimBtn.disabled = true;
  }

  try {
    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        action: 'claim_referral_reward'
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("🎉 48-Hour Unlimited Pass Activated!");
      localStorage.setItem('nudge_pass_expires_at', data.passExpiresAt);
      updatePassTicker();
      updatePaywallPillBadge();
      closeModal('referral-reward-modal');
    } else {
      alert(data.error || "No unlocked referral passes ready to claim yet.");
    }
  } catch (err) {
    console.error("Claim Error:", err);
    alert("Network error. Could not verify referral rewards.");
  } finally {
    if (claimBtn) {
      claimBtn.innerText = "⚡ Claim Unlocked 48h Pass";
      claimBtn.disabled = false;
    }
  }
}

async function handleAuthAction() {
  const emailInput = document.getElementById('user-auth-email');
  const btn = document.getElementById('btn-auth-action');

  const email = emailInput.value.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    alert("Please enter a valid email.");
    return;
  }

  btn.innerText = "Connecting...";
  try {
    localStorage.setItem('nudge_user_email', email);
    await fetchUserProfileFromCloud(email);
    updateMetricDashboard();
    updatePremiumDeckBadges();
    
    // Log in instantly and advance to the app
    switchScreen('screen-onboarding-2', true);
  } catch (e) {
    console.error("Login Error:", e);
    localStorage.setItem('nudge_user_email', email);
    switchScreen('screen-onboarding-2', true);
  } finally {
    if (btn) btn.innerText = "Continue to App →";
  }
}

function resendOtpCode() {
  // Bypassed for direct email identity login
}
/* ========================================================
   STRIPE CUSTOMER PORTAL (MANAGE SUBSCRIPTIONS)
======================================================== */
async function openCustomerPortal() {
  const email = resolveCurrentAccountEmail();
  if (!email || email.includes('beta_tester')) {
    alert("Please log in to a registered account to manage subscriptions.");
    return;
  }
  
  try {
    const res = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, returnUrl: window.location.href })
    });
    
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirects to Stripe Portal
    } else {
      alert(data.error || "We couldn't locate an active Stripe subscription for this email.");
    }
  } catch (e) {
    alert("Connection error while accessing the billing portal. Please check your internet and try again.");
  }
}
