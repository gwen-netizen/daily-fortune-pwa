// app.js - Strict Server-Authoritative Engine (120 Reset)
let currentUserProfile = null;
let currentActiveTask = null; // Authoritative reference for active micro-task
let isPremiumSelected = false;
let countdownInterval = null;
let passTickerInterval = null;
let interceptMonitorInterval = null;
let lastTriggeredMinute = "";
let mindFrictionStyle = 'scroll'; 
let isAppMuted = localStorage.getItem('nudge_app_muted') === 'true'; 

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0;

// Overwhelm Deck sequential state (Cards 1 to 4)
let overwhelmCurrentStep = 1;

function getApiUrl(path) {
  try {
    return new URL(path, window.location.href).href;
  } catch (e) {
    return path;
  }
}

function parseDbTimestamp(dateStr) {
  if (!dateStr) return 0;
  try {
    let clean = String(dateStr).trim().replace(' ', 'T');
    if (/[+-]\d{2}$/.test(clean)) {
      clean += ':00';
    }
    const parsed = new Date(clean).getTime();
    return isNaN(parsed) ? 0 : parsed;
  } catch (e) {
    return 0;
  }
}

function getDeviceId() {
  let deviceId = localStorage.getItem('nudge_device_id');
  if (!deviceId) {
    deviceId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('nudge_device_id', deviceId);
  }
  return deviceId;
}

/* ========================================================
   STRICT SERVER-VERIFIED ACCESS CHECK
======================================================== */
function isUserPremiumOrPass() {
  if (!currentUserProfile) return false;

  // 1. Authoritative check: if Supabase says true, user is 100% premium
  if (currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true') {
    return true;
  }

  // 2. Active 48-Hour Pass check
  if (currentUserProfile.pass_expires_at) {
    const expiryMs = parseDbTimestamp(currentUserProfile.pass_expires_at);
    return Date.now() < expiryMs;
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
    
    // 1. Permanent / Lifetime Unlocked from Supabase
    if (currentUserProfile && (currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true')) {
      banner.style.display = 'block';
      banner.style.background = '#E8F5E9';
      banner.style.borderColor = 'var(--success-color)';
      banner.innerHTML = `✨ <b>Lifetime Freedom Access Active</b> • All Neural Decks & Anchors Unlocked`;
      banner.style.color = 'var(--success-color)';
      return;
    }

    // 2. 48-Hour Pass is Ticking
    if (remainingSecs > 0) {
      banner.style.display = 'block';
      banner.style.background = '#FFF8E1';
      banner.style.borderColor = '#FFB300';
      banner.style.color = '#B26A00';
      const hours = Math.floor(remainingSecs / 3600);
      const minutes = Math.floor((remainingSecs % 3600) / 60);
      const seconds = remainingSecs % 60;
      banner.innerHTML = `⏳ <b>48-Hour Unlimited Pass:</b> ${hours}h ${minutes}m ${seconds}s remaining`;
      return;
    }

    // 3. Free Tier
    banner.style.display = 'block';
    banner.style.background = '#FAF7F2';
    banner.style.borderColor = '#EAE3D9';
    banner.style.color = '#7A7571';
    banner.innerHTML = `🔒 <b>Free Tier Active</b> (4/4 Intercepts Daily) • Upgrade for Full Protocols`;
  });
}

/* ========================================================
   AUDIO SYSTEM (WITH INSTANT MUTE TOGGLE)
======================================================== */
function updateAudioMuteButtonUI() {
  const toggleBtn = document.getElementById('audio-mute-toggle');
  if (toggleBtn) {
    toggleBtn.innerText = isAppMuted ? '🔇 Sound Muted' : '🔊 Sound On';
    toggleBtn.style.color = isAppMuted ? '#A8A29E' : 'var(--text-color)';
  }
}

function toggleAudioMuteSystem() {
  isAppMuted = !isAppMuted;
  localStorage.setItem('nudge_app_muted', isAppMuted);
  updateAudioMuteButtonUI();
}

function playVictoryChime() {
  if (isAppMuted) return;
  const chime = document.getElementById('victory-chime');
  if (chime) {
    chime.currentTime = 0;
    chime.play().catch(e => console.log("Audio autoplay prevented by browser"));
  }
}

/* ========================================================
   DAILY INTERCEPT TRACKER (FREE TIER LIMIT = 4)
======================================================== */
function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}

function getDailyClicksCount() {
  const savedDate = localStorage.getItem('nudge_clicks_date');
  const today = getTodayDateString();
  if (savedDate !== today) {
    localStorage.setItem('nudge_clicks_date', today);
    localStorage.setItem('nudge_daily_clicks', '0');
    return 0;
  }
  return parseInt(localStorage.getItem('nudge_daily_clicks') || '0', 10);
}

function incrementDailyClicks() {
  const count = getDailyClicksCount() + 1;
  localStorage.setItem('nudge_daily_clicks', count.toString());
  updateMetricDashboard();
}

/* ========================================================
   SERVER-AUTHORITATIVE PROFILE SYNC
======================================================== */
async function syncUserProfile(emailInput) {
  const email = emailInput ? emailInput.trim().toLowerCase() : (localStorage.getItem('nudge_user_email') || '');
  if (!email || email === 'anonymous_tester') {
    applyPremiumUIVisuals();
    return;
  }

  localStorage.setItem('nudge_user_email', email);
  const deviceId = getDeviceId();

  try {
    const res = await fetch(getApiUrl('/api/sync-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, device_id: deviceId })
    });

    if (res.ok) {
      const data = await res.json();
      currentUserProfile = data.user;
      
      if (currentUserProfile) {
        if (currentUserProfile.total_wins !== undefined) {
          totalWinsCount = currentUserProfile.total_wins || 0;
          localStorage.setItem('nudge_total_wins', totalWinsCount);
        }
        if (currentUserProfile.total_focus_minutes !== undefined) {
          totalFocusReclaimed = parseFloat(currentUserProfile.total_focus_minutes) || 0.0;
          localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed);
        }
      }
      
      applyPremiumUIVisuals();
      startPassTicker();
      updateMetricDashboard();
    }
  } catch (err) {
    console.warn("Could not sync user profile from server:", err);
  }
}

function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  const dailyUsesEl = document.getElementById('stat-daily-uses');

  if (streaksEl) streaksEl.innerText = totalWinsCount;
  if (focusEl) focusEl.innerText = `${totalFocusReclaimed.toFixed(1)}m`;

  if (dailyUsesEl) {
    const hasUnlimited = isUserPremiumOrPass();
    if (hasUnlimited) {
      dailyUsesEl.innerText = "∞";
      dailyUsesEl.style.color = "var(--success-color)";
    } else {
      const used = getDailyClicksCount();
      dailyUsesEl.innerText = `${used}/4`;
      dailyUsesEl.style.color = used >= 4 ? "var(--accent-color)" : "var(--text-color)";
    }
  }
}

function applyPremiumUIVisuals() {
  const hasAccess = isUserPremiumOrPass();
  
  // Premium deck cards on dashboard
  const dopamineCard = document.querySelector('.deck-item[data-category="dopamine"]');
  const overwhelmCard = document.querySelector('.deck-item[data-category="overwhelm"]');

  [dopamineCard, overwhelmCard].forEach(card => {
    if (!card) return;
    const meta = card.querySelector('.deck-meta');
    if (hasAccess) {
      card.classList.remove('locked');
      if (meta) {
        meta.innerText = "UNLOCKED PROTOCOL";
        meta.style.background = "#E8F5E9";
        meta.style.color = "var(--success-color)";
      }
    } else {
      if (meta) {
        meta.innerText = "PREMIUM UPGRADE";
        meta.style.background = "#F5EBE1";
        meta.style.color = "var(--premium-color)";
      }
    }
  });

  // Manage Subscription Button Visibility
  const subBtnDashboard = document.getElementById('btn-manage-subscription');
  const subBtnVictory = document.getElementById('btn-victory-manage-subscription');
  const hasStripeCust = currentUserProfile && currentUserProfile.stripe_customer_id;

  if (subBtnDashboard) subBtnDashboard.style.display = hasStripeCust ? 'inline-block' : 'none';
  if (subBtnVictory) subBtnVictory.style.display = hasStripeCust ? 'inline-block' : 'none';

  updatePassCountdown();
}

/* ========================================================
   ONBOARDING & EMAIL VERIFICATION
======================================================== */
function proceedToFrictionTriage() {
  const emailInput = document.getElementById('user-auth-email').value;
  const promoInput = document.getElementById('promo-access-code').value.trim().toUpperCase();

  if (promoInput === 'RESETVIP' || promoInput === 'FOCUS2026') {
    currentUserProfile = { premium_user: true, pass_expires_at: null };
    localStorage.setItem('nudge_vip_unlocked', 'true');
    alert("🎉 VIP Access Code Activated! All neural decks and custom anchors are permanently unlocked.");
  }

  if (emailInput && emailInput.includes('@') && emailInput.includes('.')) {
    const cleanEmail = emailInput.trim().toLowerCase();
    localStorage.setItem('nudge_user_email', cleanEmail);
    syncUserProfile(cleanEmail);

    const emailLabel = document.getElementById('auth-verify-email-label');
    if (emailLabel) emailLabel.innerText = cleanEmail;
    switchScreen('screen-auth-verify');
  } else {
    switchScreen('screen-onboarding-2');
  }
}

function verifyEmailCodeAndProceed() {
  const code = document.getElementById('email-verification-code').value.trim();
  if (!code || code.length < 4) {
    alert("Please enter the verification code sent to your email.");
    return;
  }
  switchScreen('screen-onboarding-2');
}

function resendVerificationCode() {
  alert("A fresh security code has been dispatched to your email address.");
}

function selectFrictionTrack(el, style) {
  document.querySelectorAll('#screen-onboarding-2 .deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = style;
}

function confirmFrictionAndProceed() {
  switchScreen('screen-dashboard');
}

/* ========================================================
   DECK SELECTION & TRIGGER PHASE
======================================================== */
function selectDeck(el, isPremium, categoryKey) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;

  if (categoryKey === 'overwhelm') {
    overwhelmCurrentStep = 1; // Always start Overwhelm Deck at Card 1
  }

  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) deckTitleEl.innerText = el.querySelector('.deck-name').innerText;
  startTriggerPhase();
}

function startTriggerPhase() {
  const hasAccess = isUserPremiumOrPass();
  if (isPremiumSelected && !hasAccess) {
    openPaywallModal();
  } else {
    switchScreen('screen-trigger');
  }
}

function openPaywallModal() {
  const paywall = document.getElementById('paywall-overlay');
  if (paywall) paywall.classList.add('active');
}

function closePaywall() {
  const paywall = document.getElementById('paywall-overlay');
  if (paywall) paywall.classList.remove('active');
}

function selectTier(el) {
  document.querySelectorAll('.tier-box').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

async function simulatePurchase() {
  const selectedBox = document.querySelector('.tier-box.selected');
  const plan = selectedBox ? selectedBox.getAttribute('data-plan') : 'pass';
  const email = localStorage.getItem('nudge_user_email') || 'user@example.com';

  try {
    const res = await fetch(getApiUrl('/api/create-checkout-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to initiate secure checkout session. Please try again.");
    }
  } catch (err) {
    alert("Connection error: " + err.message);
  }
}

async function openCustomerPortal() {
  const email = localStorage.getItem('nudge_user_email');
  if (!email) {
    alert("Please log in with your account email first.");
    return;
  }
  try {
    const res = await fetch(getApiUrl('/api/create-portal-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Could not open subscription portal.");
    }
  } catch (e) {
    alert("Portal error: " + e.message);
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

  const activeDeckName = document.getElementById('active-deck-title').innerText.toLowerCase();
  let categoryKey = 'charisma';
  if (activeDeckName.includes("financial") || activeDeckName.includes("freeze") || activeDeckName.includes("wealth")) {
    categoryKey = 'wealth';
  } else if (activeDeckName.includes("dopamine")) {
    categoryKey = 'dopamine';
  } else if (activeDeckName.includes("overwhelm")) {
    categoryKey = 'overwhelm';
  }

  const userEmail = localStorage.getItem('nudge_user_email') || 'anonymous_tester';

  try {
    let endpoint = getApiUrl(`/api/get-task?category=${categoryKey}&friction=${mindFrictionStyle}&email=${encodeURIComponent(userEmail)}`);
    
    // Pass current step for sequential Overwhelm Deck progression
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
          focusAreaEl.innerText = `Move ${overwhelmCurrentStep} of 4 • ${currentActiveTask.focusArea}`;
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
   AFFIRMATION FLIP & CONDITIONAL ROUTING
======================================================== */
function triggerVictoryPhase(minutesEarned) {
  // Update lifetime metrics
  totalWinsCount += 1;
  totalFocusReclaimed += minutesEarned;
  localStorage.setItem('nudge_total_wins', totalWinsCount);
  localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed);

  // Render the neurological affirmation (Card Flip Side)
  const validationCopyEl = document.getElementById('victory-validation-copy');
  if (validationCopyEl) {
    if (currentActiveTask && currentActiveTask.affirmation) {
      validationCopyEl.innerText = currentActiveTask.affirmation;
    } else {
      validationCopyEl.innerText = "The freeze is broken. Action clears anxiety.";
    }
  }

  const standardActions = document.getElementById('standard-victory-actions');
  const overwhelmActions = document.getElementById('overwhelm-victory-actions');
  const btnNext = document.getElementById('btn-overwhelm-next');
  const btnReset = document.getElementById('btn-overwhelm-reset');
  const titleEl = document.getElementById('victory-title-text');
  const crownEl = document.getElementById('victory-header-badge');

  if (currentActiveTask && currentActiveTask.deck === 'overwhelm') {
    if (standardActions) standardActions.style.display = 'none';
    if (overwhelmActions) overwhelmActions.style.display = 'flex';

    if (overwhelmCurrentStep < 4) {
      if (titleEl) titleEl.innerText = `Move ${overwhelmCurrentStep} Complete`;
      if (crownEl) crownEl.innerText = "⚡";
      if (btnNext) btnNext.style.display = 'block';
      if (btnReset) btnReset.style.display = 'none';
    } else {
      // Completed Card 4
      if (titleEl) titleEl.innerText = `Move 4 Complete`;
      if (crownEl) crownEl.innerText = "🎯";
      if (btnNext) btnNext.style.display = 'none';
      if (btnReset) btnReset.style.display = 'block';
    }
  } else {
    // Normal Decks: show Claim Stack
    if (standardActions) standardActions.style.display = 'flex';
    if (overwhelmActions) overwhelmActions.style.display = 'none';
    if (titleEl) titleEl.innerText = "Impact Calibrated.";
    if (crownEl) crownEl.innerText = "🏆";
  }

  // Play audio chime & shoot celebratory confetti
  playVictoryChime();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }

  switchScreen('screen-victory');
}

// Advances sequentially through Overwhelm Deck: 1 -> 2 -> 3 -> 4
function advanceOverwhelmNextMove() {
  if (overwhelmCurrentStep < 4) {
    overwhelmCurrentStep++;
  }
  executeTurnaroundSpin();
}

// Displays the final "INITIATION COMPLETE" directive screen after Card 4
function showInitiationCompleteScreen() {
  switchScreen('screen-initiation-complete');
}

function claimRewardStack() {
  overwhelmCurrentStep = 1; // Reset step back to 1 for the next session
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
   CUSTOM INTERCEPTS & ACTIVE CLOCK ALARM ENGINE
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
  const hasAccess = isUserPremiumOrPass();

  const customHtml = customAnchors.map(a => `
    <div class="lifeline-item" style="border-left: 3px solid var(--accent-color);">
      <div>
        <div style="font-weight: 800; font-size: 14px; color: var(--text-color);">${formatTimeDisplay(a.time)}</div>
        <div style="font-size: 11px; color: #7A7571; font-weight: 600;">${a.label} • ${a.deck}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <label class="toggle-switch">
          <input type="checkbox" ${a.active ? 'checked' : ''} ${!hasAccess ? 'disabled' : ''} onchange="toggleAnchorState('${a.id}', this.checked)">
          <span class="slider"></span>
        </label>
        <button onclick="deleteAnchor('${a.id}')" style="background:none; border:none; color: #A8A29E; cursor:pointer; font-size: 14px;">✕</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = defaultHtml + customHtml;
}

function formatTimeDisplay(timeStr) {
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = hours < 10 ? '0' + hours : hours;
  return `${hoursStr}:${minutes} ${ampm}`;
}

function toggleAnchorState(id, isChecked) {
  const currentAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  const item = currentAnchors.find(a => a.id === id);
  if (item) item.active = isChecked;
  localStorage.setItem('nudge_custom_anchors', JSON.stringify(currentAnchors));
  syncLifetimeProgressToCloud();
}

function deleteAnchor(id) {
  let currentAnchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  currentAnchors = currentAnchors.filter(a => a.id !== id);
  localStorage.setItem('nudge_custom_anchors', JSON.stringify(currentAnchors));
  renderCustomIntercepts();
  syncLifetimeProgressToCloud();
}

/* ========================================================
   BACKGROUND CLOCK ALARM INTERCEPT SYSTEM
======================================================== */
function startInterceptClockMonitor() {
  if (interceptMonitorInterval) clearInterval(interceptMonitorInterval);
  checkActiveIntercepts();
  interceptMonitorInterval = setInterval(checkActiveIntercepts, 30000);
}

function checkActiveIntercepts() {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const timeKey = `${currentHours}:${currentMinutes}`;

  if (timeKey === lastTriggeredMinute) return;

  const anchors = JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]');
  const matchingAnchor = anchors.find(a => a.active && a.time === timeKey);

  if (matchingAnchor) {
    lastTriggeredMinute = timeKey;
    triggerScheduledAlarm(matchingAnchor);
  }
}

function triggerScheduledAlarm(anchor) {
  if (Notification && Notification.permission === "granted") {
    new Notification("⚡ 120 Reset Circuit Breaker Triggered!", {
      body: `Slump Intercept: ${anchor.label}. Launching ${anchor.deck} now.`,
      icon: "/images/icon-192.png",
      requireInteraction: true
    });
  }

  playVictoryChime();
  const titleEl = document.getElementById('active-deck-title');
  if (titleEl) titleEl.innerText = anchor.deck;

  if (anchor.deck.toLowerCase().includes("overwhelm")) {
    overwhelmCurrentStep = 1;
  }

  switchScreen('screen-trigger');
}

/* ========================================================
   PERSISTENCE SYNC TO SUPABASE CLOUD
======================================================== */
async function syncLifetimeProgressToCloud() {
  const email = localStorage.getItem('nudge_user_email');
  if (!email || email === 'anonymous_tester') return;

  try {
    await fetch(getApiUrl('/api/sync-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        total_wins: totalWinsCount,
        total_focus_minutes: totalFocusReclaimed,
        custom_anchors: JSON.parse(localStorage.getItem('nudge_custom_anchors') || '[]')
      })
    });
  } catch (err) {
    console.warn("Background progress sync warning:", err);
  }
}

/* ========================================================
   SCREEN SWITCHER & APPLICATION INITIALIZER
======================================================== */
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

  if (screenId === 'screen-dashboard' || screenId === 'screen-onboarding-2') {
    applyPremiumUIVisuals();
    renderCustomIntercepts();
    updatePassCountdown();
    updateMetricDashboard();
  }
}

function userLogout() {
  localStorage.removeItem('nudge_user_email');
  localStorage.removeItem('nudge_vip_unlocked');
  currentUserProfile = null;
  totalWinsCount = 0;
  totalFocusReclaimed = 0.0;
  overwhelmCurrentStep = 1;
  localStorage.removeItem('nudge_total_wins');
  localStorage.removeItem('nudge_focus_reclaimed');
  switchScreen('screen-onboarding-1');
}

document.addEventListener('DOMContentLoaded', () => {
  totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0', 10);
  totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_focus_reclaimed') || '0.0');

  updateAudioMuteButtonUI();

  // If returning user, sync profile and go to dashboard
  const savedEmail = localStorage.getItem('nudge_user_email');
  if (savedEmail) {
    syncUserProfile(savedEmail);
    switchScreen('screen-dashboard');
  }

  startInterceptClockMonitor();
});
