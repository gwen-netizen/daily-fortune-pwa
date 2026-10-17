// app.js - Strict Server-Authoritative Engine (120 Reset)
let currentUserProfile = null;
let isPremiumSelected = false;
let countdownInterval = null;
let passTickerInterval = null;
let interceptMonitorInterval = null;
let lastTriggeredMinute = "";
let mindFrictionStyle = 'scroll'; 
let isAppMuted = localStorage.getItem('nudge_app_muted') === 'true'; 

let totalWinsCount = 0;
let totalFocusReclaimed = 0.0;

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is safe.",
  "The dopamine loop has been successfully redirected. You are now running on clean execution energy."
];

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
      banner.style.color = 'var(--success-color)';
      banner.innerHTML = '✅ <b>FULL PREMIUM UNLOCKED</b><br>Unlimited Daily Intercepts';
    }
    // 2. 48-Hour Pass Countdown
    else if (remainingSecs > 0) {
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
    } 
    // 3. Free Account
    else {
      const clicksUsed = getDailyClicksCount();
      banner.style.display = 'block';
      banner.style.background = '#FAF7F2';
      banner.style.borderColor = '#EAE3D9';
      banner.style.color = '#7A7571';
      banner.innerHTML = `🌱 <b>Free Account (${clicksUsed}/4 Daily Intercepts Used)</b><br><span style="text-decoration:underline; cursor:pointer; color:var(--text-color); font-weight:700;" onclick="openPaywallModal()">Get 2-Day Pass ($0.99)</span>`;
    }
  });
}

function applyPremiumUIVisuals() {
  const hasAccess = isUserPremiumOrPass();
  
  const dopamineDeck = document.querySelector('.deck-item[data-category="dopamine"]');
  if (dopamineDeck) {
    const meta = dopamineDeck.querySelector('.deck-meta');
    const name = dopamineDeck.querySelector('.deck-name');
    if (meta) {
      meta.innerText = hasAccess ? "UNLOCKED PREMIUM AREA" : "PREMIUM UPGRADE";
      meta.className = hasAccess ? "deck-meta free" : "deck-meta premium";
      meta.style.color = hasAccess ? "var(--success-color)" : "";
    }
    if (name) name.innerHTML = hasAccess ? "✅ The Dopamine Swap Deck" : "⚡ The Dopamine Swap Deck";
  }

  const overwhelmDeck = document.querySelector('.deck-item[data-category="overwhelm"]');
  if (overwhelmDeck) {
    const meta = overwhelmDeck.querySelector('.deck-meta');
    const name = overwhelmDeck.querySelector('.deck-name');
    if (meta) {
      meta.innerText = hasAccess ? "UNLOCKED PREMIUM AREA" : "PREMIUM UPGRADE";
      meta.className = hasAccess ? "deck-meta free" : "deck-meta premium";
      meta.style.color = hasAccess ? "var(--success-color)" : "";
    }
    if (name) name.innerHTML = hasAccess ? "✅ The Anti-Overwhelm Deck" : "🧠 The Anti-Overwhelm Deck";
  }

  const customMeta = document.getElementById('custom-intercept-meta');
  const customText = document.getElementById('custom-intercept-text');
  if (customMeta) {
    customMeta.innerText = hasAccess ? "UNLOCKED PREMIUM AREA" : "PREMIUM UPGRADE";
    customMeta.className = hasAccess ? "deck-meta free" : "deck-meta premium";
    customMeta.style.color = hasAccess ? "var(--success-color)" : "";
  }
  if (customText) {
    customText.innerHTML = hasAccess ? "✅ + Add Custom Intercept" : "⚡ + Add Custom Intercept";
  }

  const victoryManageBtn = document.getElementById('btn-victory-manage-subscription');
  if (victoryManageBtn) {
    victoryManageBtn.style.display = hasAccess ? 'inline-block' : 'none';
  }
}

/* ========================================================
   CLICK TRACKER (ONLY FOR VERIFIED FREE TIER)
======================================================== */
function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDailyClicksCount() {
  const today = getTodayDateString();
  const savedDate = localStorage.getItem('nudge_click_date');
  if (savedDate !== today) {
    localStorage.setItem('nudge_click_date', today);
    localStorage.setItem('nudge_click_count', '0');
    return 0;
  }
  return parseInt(localStorage.getItem('nudge_click_count') || '0', 10);
}

function incrementDailyClicks() {
  const current = getDailyClicksCount();
  const updated = current + 1;
  localStorage.setItem('nudge_click_count', updated.toString());
  updateMetricDashboard();
  return updated;
}

/* ========================================================
   STRICT BOOT GATE (NO ENTRY WITHOUT SUPABASE)
======================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  initializeMuteUISystem(); 
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();

  const claimed = localStorage.getItem('nudge_promo_claimed') === 'true';
  const promoInput = document.getElementById('user-promo-code');
  if (promoInput) {
    if (!claimed) {
      promoInput.value = 'PREMIUM99';
    } else {
      promoInput.value = '';
      promoInput.placeholder = 'Promo Code Claimed';
      promoInput.disabled = true;
      promoInput.style.opacity = '0.6';
    }
  }

  await checkStripeRedirectStatus();

  const savedEmail = localStorage.getItem('nudge_user_email');
  
  if (savedEmail && savedEmail.includes('@')) {
    try {
      const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(savedEmail)}&action=get_profile`);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.profile) {
        throw new Error("Missing profile from Supabase verification gate.");
      }

      currentUserProfile = data.profile;
      totalWinsCount = parseInt(data.profile.total_wins, 10) || 0;
      totalFocusReclaimed = parseFloat(data.profile.focus_reclaimed) || 0.0;

      applyPremiumUIVisuals();
      updateMetricDashboard();
      startPassTicker();
      switchScreen('screen-dashboard');
    } catch (e) {
      console.error("Strict Login Gate Block:", e);
      alert("⚠️ Connection Failure: Unable to verify account credentials with Supabase. Please check your internet connection.");
      switchScreen('screen-onboarding-1');
    }
  } else {
    switchScreen('screen-onboarding-1');
  }
});

function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  const dailyUsesEl = document.getElementById('stat-daily-uses');
  
  if (streaksEl) streaksEl.innerText = totalWinsCount;

  if (focusEl) {
    if (totalFocusReclaimed < 60) {
      focusEl.innerText = totalFocusReclaimed.toFixed(1) + 'm';
    } else {
      const hoursScaled = totalFocusReclaimed / 60;
      focusEl.innerText = hoursScaled.toFixed(1) + 'h';
    }
  }

  if (dailyUsesEl) {
    if (isUserPremiumOrPass()) {
      dailyUsesEl.innerText = "Unlimited ⚡";
      dailyUsesEl.style.color = "var(--success-color)";
    } else {
      const clicks = getDailyClicksCount();
      dailyUsesEl.innerText = `${clicks}/4`;
      dailyUsesEl.style.color = clicks >= 4 ? "var(--timer-color)" : "var(--text-color)";
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

  if (screenId === 'screen-dashboard' || screenId === 'screen-onboarding-2') {
    applyPremiumUIVisuals();
    renderCustomIntercepts();
    updatePassCountdown();
    updateMetricDashboard();
  }
}

function userLogout() {
  localStorage.removeItem('nudge_user_email');
  currentUserProfile = null;
  totalWinsCount = 0;
  totalFocusReclaimed = 0.0;
  updateMetricDashboard();
  switchScreen('screen-onboarding-1');
}

/* ========================================================
   STRICT AUTHENTICATION GATE (NO ENTRY ON ERROR)
======================================================== */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }

  const userEmail = emailInput.value.trim().toLowerCase();
  const loginBtn = document.getElementById('btn-take-control');
  const originalText = loginBtn ? loginBtn.innerText : "Take Control";
  
  if (loginBtn) {
    loginBtn.innerText = "REQUESTING ACCESS CODE...";
    loginBtn.style.opacity = "0.7";
    loginBtn.disabled = true;
  }

  try {
    const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(userEmail)}&action=request_otp`);
    const response = await fetch(endpoint);
    const data = await response.json();

    if (response.ok && data.sent) {
      localStorage.setItem('nudge_user_email', userEmail);
      const noticeEl = document.getElementById('verification-notice-text');
      if (noticeEl) noticeEl.innerText = `We sent a secure access code to ${userEmail}.`;
      switchScreen('screen-auth-verify');
    } else {
      alert(`OTP Request Failed: ${data.error || "Unable to dispatch verification code via Supabase."}`);
    }
  } catch (error) {
    alert("Connection Error: Unable to communicate with the verification server. Please check your connection.");
  } finally {
    if (loginBtn) {
      loginBtn.innerText = originalText;
      loginBtn.style.opacity = "1";
      loginBtn.disabled = false;
    }
  }
}

async function verifyOTP() {
  const userEmail = localStorage.getItem('nudge_user_email');
  const otpInput = document.getElementById('user-otp-input');
  
  if (!otpInput || otpInput.value.trim().length < 6) {
    alert("Please enter the full access code sent to your email.");
    return;
  }

  const token = otpInput.value.trim();
  const promoInput = document.getElementById('user-promo-code');
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';

  const verifyBtn = document.querySelector('#screen-auth-verify .btn-primary');
  const originalText = verifyBtn ? verifyBtn.innerText : "Verify Identity";
  
  if (verifyBtn) {
    verifyBtn.innerText = "VERIFYING WITH SUPABASE...";
    verifyBtn.style.opacity = "0.7";
    verifyBtn.disabled = true;
  }

  try {
    const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(userEmail)}&action=verify_otp&token=${encodeURIComponent(token)}&promo_code=${encodeURIComponent(promoCode)}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.error || `Server verification rejected (HTTP ${response.status})`);
    }

    const data = await response.json();

    if (data.success && data.profile) {
      currentUserProfile = data.profile;
      totalWinsCount = parseInt(data.profile.total_wins, 10) || 0;
      totalFocusReclaimed = parseFloat(data.profile.focus_reclaimed) || 0.0;

      if (data.profile.promo_claimed) {
        localStorage.setItem('nudge_promo_claimed', 'true');
      }

      applyPremiumUIVisuals();
      updateMetricDashboard();
      startPassTicker();

      if (totalWinsCount > 0) {
        switchScreen('screen-dashboard');
      } else {
        switchScreen('screen-onboarding-2');
      }
    } else {
      alert(`Verification Error: ${data.error || "Invalid or expired access code."}`);
    }
  } catch (err) {
    alert(`Login Failed: ${err.message}. Connection could not be verified.`);
  } finally {
    if (verifyBtn) {
      verifyBtn.innerText = originalText;
      verifyBtn.style.opacity = "1";
      verifyBtn.disabled = false;
    }
  }
}

async function syncLifetimeProgressToCloud() {
  const userEmail = localStorage.getItem('nudge_user_email');
  if (!userEmail) return;

  const claimed = localStorage.getItem('nudge_promo_claimed') === 'true';

  try {
    const response = await fetch(getApiUrl('/api/sync-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        total_wins: totalWinsCount,
        focus_reclaimed: totalFocusReclaimed,
        promo_claimed: claimed
      })
    });
    const data = await response.json();
    if (data.profile) {
      currentUserProfile = data.profile;
      applyPremiumUIVisuals();
      updatePassCountdown();
    }
  } catch (err) {
    console.warn("Cloud synchronization paused: Network unavailable.", err);
  }
}

/* ========================================================
   DASHBOARD SELECTION & MODALS
======================================================== */
function selectOption(el, frictionKey) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  mindFrictionStyle = frictionKey || 'scroll';
  switchScreen('screen-dashboard');
}

function selectDeck(el, isPremium, categoryKey) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
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

function initializeMuteUISystem() {
  const muteBtn = document.getElementById('audio-mute-toggle');
  if (muteBtn) {
    muteBtn.innerText = isAppMuted ? "🔇 Muted" : "🔊 Sound On";
  }
}

function toggleAudioMuteSystem() {
  isAppMuted = !isAppMuted;
  localStorage.setItem('nudge_app_muted', isAppMuted.toString());
  const muteBtn = document.getElementById('audio-mute-toggle');
  if (muteBtn) {
    muteBtn.innerText = isAppMuted ? "🔇 Muted" : "🔊 Sound On";
  }
}

/* ========================================================
   STRIPE GATEWAY
======================================================== */
async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) { alert("Please select an option to continue."); return; }

  const planType = selectedTierBox.getAttribute('data-plan') || 'monthly';
  const paywallBtn = document.querySelector('.paywall-modal .btn-primary');
  const originalText = paywallBtn ? paywallBtn.innerText : "Unlock Access Now";
  const userEmail = localStorage.getItem('nudge_user_email') || '';

  if (paywallBtn) { paywallBtn.innerText = "INITIALIZING GATEWAY..."; paywallBtn.style.opacity = "0.7"; }

  try {
    const response = await fetch(getApiUrl('/api/create-checkout-session'), {
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
    if (session.url) window.location.href = session.url;
    else throw new Error("Missing routing session parameters.");
  } catch (paymentError) {
    alert(`Gateway Error: ${paymentError.message}`);
    if (paywallBtn) { paywallBtn.innerText = originalText; paywallBtn.style.opacity = "1"; }
  }
}

async function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    const returnedEmail = urlParams.get('email') || localStorage.getItem('nudge_user_email');
    if (returnedEmail) {
      localStorage.setItem('nudge_user_email', returnedEmail.trim().toLowerCase());
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function openCustomerPortal() {
  const userEmail = localStorage.getItem('nudge_user_email');
  if (!userEmail) {
    alert("Please log in with your email first.");
    return;
  }

  const victoryPortalBtn = document.getElementById('btn-victory-manage-subscription');
  if (victoryPortalBtn) { victoryPortalBtn.innerText = "Loading Portal..."; victoryPortalBtn.style.opacity = "0.4"; }

  try {
    const response = await fetch(getApiUrl('/api/create-portal-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        returnUrl: window.location.origin + '/app.html'
      })
    });

    const data = await response.json();
    if (response.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(`Portal Access Error: ${data.error || "Unable to open billing portal."}`);
    }
  } catch (err) {
    alert(`Network Error: ${err.message}`);
  } finally {
    if (victoryPortalBtn) { victoryPortalBtn.innerText = "Manage Subscription"; victoryPortalBtn.style.opacity = "0.6"; }
  }
}

/* ========================================================
   TASK EXECUTION & FORCED PHYSICAL INTERVENTION
======================================================== */
function renderSingleChallengeRating(label, ratingScore) {
  const labelNode = document.getElementById('target-metric-label');
  const starsNode = document.getElementById('target-metric-stars');
  
  if (labelNode && starsNode) {
    labelNode.innerText = `${label || "Impact"}:`;
    let starString = '';
    const cleanScore = parseInt(ratingScore, 10) || 3;
    for (let i = 0; i < 5; i++) {
      starString += i < cleanScore ? '★' : '☆';
    }
    starsNode.innerText = starString;
  }
}

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

  try {
    if (!hasUnlimitedAccess) {
      incrementDailyClicks();
    }
    
    setTimeout(() => {
      if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      if (taskDisplayEl) {
        taskDisplayEl.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 14px; line-height: 1.45; color: var(--text-color);">
            Squeeze your stomach and thigh muscles as hard as you can without moving. Hold it for 15 seconds, then relax for 5 seconds. Repeat this 4 times. Squeezing your muscles wakes up your brain and breaks your scrolling habit.
          </div>
          <div style="font-size: 13px; color: #6E6A67; font-weight: 500; line-height: 1.4; border-top: 1px dashed #EAE3D9; padding-top: 12px; text-align: left;">
            💡 <b>Why it works:</b> It proves that the app uses physical, biological hacks rather than demanding mental willpower.
          </div>
        `;

        renderSingleChallengeRating("Bio-Hack", 5);
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

function triggerVictoryPhase(minutesEarned) {
  const copy = victoryValidationStrings[Math.floor(Math.random() * victoryValidationStrings.length)];
  const validationCopyEl = document.getElementById('victory-validation-copy');
  if (validationCopyEl) validationCopyEl.innerText = copy;
  
  totalWinsCount += 1;
  totalFocusReclaimed += minutesEarned;
  
  updateMetricDashboard();
  
  try {
    if (!isAppMuted) {
      const audioNode = document.getElementById('victory-chime');
      if (audioNode) { audioNode.currentTime = 0; audioNode.play().catch(e=>{}); }
    }
  } catch (e) { console.warn(e); }
  
  switchScreen('screen-victory');
  
  try {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
    }
  } catch (e) { console.log(e); }
}

function claimRewardStack() {
  updateMetricDashboard();
  syncLifetimeProgressToCloud();
  switchScreen('screen-dashboard');
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

  const newCustom = { time: timeInput, friction: frictionInput, deck: deckInput, enabled: true };
  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  customs.push(newCustom);
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));

  closeCustomInterceptModal();
  renderCustomIntercepts();
  alert(`⚡ Intercept set for ${timeInput}! The app will actively trigger when this time arrives.`);
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
    const parts = c.time.split(':');
    let hour = parseInt(parts[0], 10) || 0;
    let min = parts[1] || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${min} ${ampm}`;
    const isChecked = c.enabled !== false ? 'checked' : '';

    const html = `
      <div class="lifeline-item" style="border-color: var(--accent-color); margin-bottom: 8px;">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--premium-color);">${formattedTime}</div>
          <div style="font-size: 11px; color: #7A7571; font-weight: 600;">Custom: ${c.friction || 'Intercept'} (${c.deck || 'Deck'})</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="toggle-switch"><input type="checkbox" ${isChecked} onchange="toggleCustomInterceptState(${index})"><span class="slider"></span></label>
          <button onclick="deleteCustomIntercept(${index})" style="background:none; border:none; color:#A8A29E; cursor:pointer; font-size:14px; padding:2px 6px;">✕</button>
        </div>
      </div>
    `;
    injectionPoint.insertAdjacentHTML('beforeend', html);
  });
}

/* ========================================================
   ACTIVE BACKGROUND MONITOR (CHECKS SYSTEM CLOCK)
======================================================== */
function startBackgroundInterceptMonitor() {
  if (interceptMonitorInterval) clearInterval(interceptMonitorInterval);

  interceptMonitorInterval = setInterval(() => {
    const now = new Date();
    const currentHH = String(now.getHours()).padStart(2, '0');
    const currentMM = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHH}:${currentMM}`;

    if (currentTimeStr === lastTriggeredMinute) return;

    const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
    for (const c of customs) {
      if (c.enabled !== false && c.time === currentTimeStr) {
        lastTriggeredMinute = currentTimeStr;
        fireInterceptAlarm(c.friction || "Behavioral Circuit Breaker", c.deck || "The Anti-Overwhelm Deck");
        return;
      }
    }

    const defaultAnchors = {
      "08:15": "Morning Bed-Lock",
      "09:45": "Workspace Inertia",
      "15:45": "Willpower Exhaustion",
      "23:15": "Bedtime Loop"
    };

    if (defaultAnchors[currentTimeStr]) {
      lastTriggeredMinute = currentTimeStr;
      fireInterceptAlarm(defaultAnchors[currentTimeStr], "The Dopamine Swap Deck");
    }
  }, 20000);
}

function fireInterceptAlarm(reason, deckName) {
  try {
    if (!isAppMuted) {
      const audioNode = document.getElementById('victory-chime');
      if (audioNode) { audioNode.currentTime = 0; audioNode.play().catch(e=>{}); }
    }
  } catch (e) {}

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⚡ 120 Reset: Circuit Breaker Triggered", {
      body: `Slump detected: ${reason}. Bypassing paralysis with ${deckName}.`,
      icon: "/images/icon-192.png"
    });
  }

  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) deckTitleEl.innerText = deckName;
  
  switchScreen('screen-trigger');
}
