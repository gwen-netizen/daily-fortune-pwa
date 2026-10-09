// app.js - Full Core Application Controller Engine
let isPremiumSelected = false;
let countdownInterval = null;
let passTickerInterval = null;
let mindFrictionStyle = 'scroll'; 
let isAppMuted = localStorage.getItem('nudge_app_muted') === 'true'; 

let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

function getApiUrl(path) {
  try {
    return new URL(path, window.location.href).href;
  } catch (e) {
    return path;
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
   DAILY CLICK TRACKER & PASS COUNTDOWN ENGINE
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

function isPassActive() {
  const expiry = parseInt(localStorage.getItem('nudge_pass_expiry') || '0', 10);
  return Date.now() < expiry;
}

function isUserPremiumOrPass() {
  const isPrem = localStorage.getItem('nudge_premium_user') === 'true';
  return isPrem || isPassActive();
}

async function checkAndTriggerScreen1Promo(email) {
  const promoInput = document.getElementById('user-promo-code');
  if (!promoInput) return;

  const code = promoInput.value.trim().toUpperCase();
  const alreadyClaimed = localStorage.getItem('nudge_promo_claimed') === 'true';

  if (code === 'PREMIUM99' && !alreadyClaimed) {
    const expiry = Date.now() + (48 * 3600 * 1000);
    localStorage.setItem('nudge_pass_expiry', expiry.toString());
    localStorage.setItem('nudge_promo_claimed', 'true');

    // Sync to Supabase directly
    if (email) {
      try {
        await fetch(getApiUrl('/api/sync-user'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, promo_code: 'PREMIUM99', device_id: getDeviceId() })
        });
      } catch (e) {}
    }

    alert("🎉 Promotional Code Redeemed! 48-Hour Free Premium Pass Unlocked.");
  }
}

function startPassTicker() {
  if (passTickerInterval) clearInterval(passTickerInterval);
  updatePassCountdown();
  passTickerInterval = setInterval(updatePassCountdown, 1000);
}

function updatePassCountdown() {
  const isPrem = localStorage.getItem('nudge_premium_user') === 'true';
  const passActive = isPassActive();
  
  const banners = [
    document.getElementById('screen2-status-banner'),
    document.getElementById('screen3-status-banner')
  ];

  banners.forEach(banner => {
    if (!banner) return;
    
    if (isPrem) {
      banner.style.display = 'block';
      banner.style.background = '#E8F5E9';
      banner.style.borderColor = 'var(--success-color)';
      banner.style.color = 'var(--success-color)';
      banner.innerHTML = '✅ <b>FULL PREMIUM UNLOCKED</b> • Unlimited Daily Intercepts';
    } else if (passActive) {
      banner.style.display = 'block';
      banner.style.background = '#FFF8E1';
      banner.style.borderColor = '#FFB300';
      banner.style.color = '#B78103';
      
      const expiry = parseInt(localStorage.getItem('nudge_pass_expiry') || '0', 10);
      const diffSec = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      const hours = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;
      
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');
      
      banner.innerHTML = `⚡ <b>2-DAY PASS ACTIVE</b> • ⏱️ <b>${hStr}h ${mStr}m ${sStr}s</b> remaining`;
    } else {
      const clicksUsed = getDailyClicksCount();
      banner.style.display = 'block';
      banner.style.background = '#FAF7F2';
      banner.style.borderColor = '#EAE3D9';
      banner.style.color = '#7A7571';
      banner.innerHTML = `🌱 <b>Free Account (${clicksUsed}/4 Daily Intercepts Used)</b> • <span style="text-decoration:underline; cursor:pointer; color:var(--text-color); font-weight:700;" onclick="openPaywallModal()">Get 2-Day Pass ($0.99)</span>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  updateMetricDashboard();
  await checkStripeRedirectStatus();
  applyPremiumUIVisuals(); 
  initializeMuteUISystem(); 
  renderCustomIntercepts();
  startPassTicker();

  const savedEmail = localStorage.getItem('nudge_user_email');
  const deviceId = getDeviceId();

  if (savedEmail && savedEmail.includes('@')) {
    try {
      const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(savedEmail)}&action=get_profile&device_id=${encodeURIComponent(deviceId)}`);
      const response = await fetch(endpoint);
      
      if (response.status === 409) {
        alert("🔒 Session Expired: Your account was accessed on another device.");
        userLogout();
        return;
      }

      const data = await response.json();
      if (response.ok && data.profile) {
        totalWinsCount = data.profile.total_wins || 0;
        totalFocusReclaimed = data.profile.focus_reclaimed || 0.0;
        localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
        localStorage.setItem('nudge_minutes', totalFocusReclaimed.toString());

        if (data.profile.premium_user) {
          localStorage.setItem('nudge_premium_user', 'true');
        } else {
          localStorage.removeItem('nudge_premium_user');
        }

        if (data.profile.pass_expires_at) {
          const passExp = new Date(data.profile.pass_expires_at).getTime();
          if (Date.now() < passExp) {
            localStorage.setItem('nudge_pass_expiry', passExp.toString());
          } else {
            localStorage.removeItem('nudge_pass_expiry');
          }
        }
      }
      updateMetricDashboard();
      switchScreen('screen-dashboard');
    } catch (e) {
      switchScreen('screen-dashboard');
    }
  } else {
    switchScreen('screen-onboarding-1');
  }
});

function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  const dailyUsesEl = document.getElementById('stat-daily-uses');
  
  if (streaksEl && focusEl) {
    streaksEl.innerText = totalWinsCount;
    if (totalFocusReclaimed < 60) {
      focusEl.innerText = totalFocusReclaimed.toFixed(1) + ' min';
    } else {
      const hoursScaled = totalFocusReclaimed / 60;
      focusEl.innerText = hoursScaled.toFixed(1) + ' hr';
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
  }
}

function userLogout() {
  localStorage.removeItem('nudge_user_email');
  localStorage.removeItem('nudge_premium_user');
  localStorage.removeItem('nudge_pass_expiry');
  localStorage.removeItem('nudge_promo_claimed');
  localStorage.removeItem('nudge_total_wins');
  localStorage.removeItem('nudge_minutes');
  totalWinsCount = 0;
  totalFocusReclaimed = 0.0;
  updateMetricDashboard();
  switchScreen('screen-onboarding-1');
}

/* ========================================================
   1. AUTHENTICATION & OTP FLOW
======================================================== */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert("Please enter a valid email address to protect your focus milestones.");
    return;
  }

  const userEmail = emailInput.value.trim().toLowerCase();
  localStorage.setItem('nudge_user_email', userEmail);
  await checkAndTriggerScreen1Promo(userEmail);

  const promoInput = document.getElementById('user-promo-code');
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';

  const loginBtn = document.getElementById('btn-take-control');
  const originalText = loginBtn ? loginBtn.innerText : "Take Control";
  
  if (loginBtn) {
    loginBtn.innerText = "REQUESTING ACCESS CODE...";
    loginBtn.style.opacity = "0.7";
    loginBtn.disabled = true;
  }

  try {
    const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(userEmail)}&action=request_otp&promo_code=${encodeURIComponent(promoCode)}`);
    const response = await fetch(endpoint);
    const data = await response.json();

    if (response.ok && data.sent) {
      const noticeEl = document.getElementById('verification-notice-text');
      if (noticeEl) noticeEl.innerText = `We sent a secure 6-digit access code to ${userEmail}.`;
      switchScreen('screen-auth-verify');
    } else {
      alert(`OTP Request Failed: ${data.error || "Unable to dispatch verification code via Supabase."}`);
    }
  } catch (error) {
    alert(`Network Request Error: ${error.message}`);
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
  const deviceId = getDeviceId();
  
  if (!otpInput || otpInput.value.trim().length < 6) {
    alert("Please enter the full 6-digit access code sent to your email.");
    return;
  }

  const token = otpInput.value.trim();
  const verifyBtn = document.querySelector('#screen-auth-verify .btn-primary');
  const originalText = verifyBtn ? verifyBtn.innerText : "Verify Identity";
  
  if (verifyBtn) {
    verifyBtn.innerText = "VERIFYING CODE...";
    verifyBtn.style.opacity = "0.7";
    verifyBtn.disabled = true;
  }

  try {
    const endpoint = getApiUrl(`/api/sync-user?email=${encodeURIComponent(userEmail)}&action=verify_otp&token=${encodeURIComponent(token)}&device_id=${encodeURIComponent(deviceId)}`);
    const response = await fetch(endpoint);
    const data = await response.json();

    if (response.ok && data.success) {
      if (data.profile) {
        totalWinsCount = data.profile.total_wins || 0;
        totalFocusReclaimed = data.profile.focus_reclaimed || 0.0;
        localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
        localStorage.setItem('nudge_minutes', totalFocusReclaimed.toString());

        if (data.profile.premium_user) {
          localStorage.setItem('nudge_premium_user', 'true');
        }
      }

      applyPremiumUIVisuals();
      updateMetricDashboard();
      switchScreen('screen-onboarding-2');
    } else {
      alert(`Verification Error: ${data.error || "Invalid or expired access code."}`);
    }
  } catch (err) {
    alert(`Network Request Error: ${err.message}`);
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
  const deviceId = getDeviceId();
  if (!userEmail) return;

  try {
    const response = await fetch(getApiUrl('/api/sync-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        total_wins: totalWinsCount,
        focus_reclaimed: totalFocusReclaimed,
        device_id: deviceId
      })
    });

    if (response.status === 409) {
      alert("🔒 Session Expired: Your account was accessed on another device.");
      userLogout();
    }
  } catch (err) {
    console.warn(err);
  }
}

/* ========================================================
   2. DASHBOARD & UI SELECTIONS
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

function applyPremiumUIVisuals() {
  const hasAccess = isUserPremiumOrPass();
  if (hasAccess) {
    const dopamineDeck = document.querySelector('.deck-item[data-category="dopamine"]');
    if (dopamineDeck) {
      const meta = dopamineDeck.querySelector('.deck-meta');
      const name = dopamineDeck.querySelector('.deck-name');
      if (meta) {
        meta.innerText = "UNLOCKED PREMIUM AREA";
        meta.className = "deck-meta free";
        meta.style.color = "var(--success-color)";
      }
      if (name) name.innerHTML = "✅ The Dopamine Swap Deck";
    }

    const overwhelmDeck = document.querySelector('.deck-item[data-category="overwhelm"]');
    if (overwhelmDeck) {
      const meta = overwhelmDeck.querySelector('.deck-meta');
      const name = overwhelmDeck.querySelector('.deck-name');
      if (meta) {
        meta.innerText = "UNLOCKED PREMIUM AREA";
        meta.className = "deck-meta free";
        meta.style.color = "var(--success-color)";
      }
      if (name) name.innerHTML = "✅ The Anti-Overwhelm Deck";
    }

    const customMeta = document.getElementById('custom-intercept-meta');
    const customText = document.getElementById('custom-intercept-text');
    if (customMeta) {
      customMeta.innerText = "UNLOCKED PREMIUM AREA";
      customMeta.className = "deck-meta free";
      customMeta.style.color = "var(--success-color)";
    }
    if (customText) {
      customText.innerHTML = "✅ + Add Custom Intercept";
    }

    const victoryManageBtn = document.getElementById('btn-victory-manage-subscription');
    if (victoryManageBtn) {
      victoryManageBtn.style.display = 'inline-block';
    }
  }
}

/* ========================================================
   3. STRIPE GATEWAY
======================================================== */
async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) { alert("Please select an option to continue."); return; }

  const planType = selectedTierBox.getAttribute('data-plan') || (selectedTierBox.innerText.includes("Lifetime") ? 'lifetime' : (selectedTierBox.innerText.includes("Pass") ? 'pass' : 'monthly'));
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
        successUrl: window.location.origin + '/?session=success',
        cancelUrl: window.location.origin
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
    const planType = urlParams.get('plan') || 'monthly';

    if (returnedEmail) {
      const cleanEmail = returnedEmail.trim().toLowerCase();
      localStorage.setItem('nudge_user_email', cleanEmail);
    }

    if (planType === 'pass' || planType === '2day') {
      const expiry = Date.now() + (48 * 3600 * 1000);
      localStorage.setItem('nudge_pass_expiry', expiry.toString());
      applyPremiumUIVisuals();
      updatePassCountdown();
      alert("🎉 2-Day Unlimited Premium Pass Activated! Full access unlocked for 48 hours.");
    } else {
      localStorage.setItem('nudge_premium_user', 'true');
      applyPremiumUIVisuals();
      await syncLifetimeProgressToCloud();
      alert("🎉 Premium Area is Now Unlocked!");
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    switchScreen('screen-dashboard');
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
        returnUrl: window.location.origin
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
   4. TASK EXECUTION & METRICS ENGINE
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

  const activeDeckName = document.getElementById('active-deck-title').innerText.toLowerCase();
  let categoryKey = 'charisma';
  if (activeDeckName.includes("wealth")) categoryKey = 'wealth';
  else if (activeDeckName.includes("dopamine")) categoryKey = 'dopamine';
  else if (activeDeckName.includes("overwhelm")) categoryKey = 'overwhelm';

  const userEmail = localStorage.getItem('nudge_user_email') || 'anonymous_tester';
  const deviceId = getDeviceId();

  try {
    const endpoint = getApiUrl(`/api/get-task?category=${categoryKey}&friction=${mindFrictionStyle}&email=${encodeURIComponent(userEmail)}&device_id=${encodeURIComponent(deviceId)}`);
    const response = await fetch(endpoint);
    
    if (response.status === 409) {
      alert("🔒 Session Expired: Your account was accessed on another device.");
      userLogout();
      return;
    }

    if (!response.ok) {
      const serverErr = await response.json();
      throw new Error(serverErr.error || "Server validation failure.");
    }
    
    const data = await response.json();

    if (!hasUnlimitedAccess) {
      incrementDailyClicks();
    }
    
    setTimeout(() => {
      if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
      
      const taskDisplayEl = document.getElementById('target-task-text');
      if (taskDisplayEl && data.task) {
        taskDisplayEl.innerText = data.task.text;
        renderSingleChallengeRating(data.task.metricLabel, data.task.rating);
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
  localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
  localStorage.setItem('nudge_minutes', totalFocusReclaimed.toString());
  
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
   5. CUSTOM INTERCEPTS ENGINE
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

  const newCustom = { time: timeInput, friction: frictionInput, deck: deckInput };
  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || localStorage.getItem('nudge_custom_lifelines') || '[]');
  customs.push(newCustom);
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));

  closeCustomInterceptModal();
  renderCustomIntercepts();
}

function deleteCustomIntercept(index) {
  let customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || localStorage.getItem('nudge_custom_lifelines') || '[]');
  customs.splice(index, 1);
  localStorage.setItem('nudge_custom_intercepts', JSON.stringify(customs));
  renderCustomIntercepts();
}

function renderCustomIntercepts() {
  const injectionPoint = document.getElementById('custom-intercepts-injection-point');
  if (!injectionPoint) return;
  
  injectionPoint.innerHTML = ''; 
  const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || localStorage.getItem('nudge_custom_lifelines') || '[]');
  
  customs.forEach((c, index) => {
    if (!c.time) return;
    const parts = c.time.split(':');
    let hour = parseInt(parts[0], 10) || 0;
    let min = parts[1] || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${min} ${ampm}`;

    const html = `
      <div class="lifeline-item" style="border-color: var(--accent-color); margin-bottom: 8px;">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--premium-color);">${formattedTime}</div>
          <div style="font-size: 11px; color: #7A7571; font-weight: 600;">Custom: ${c.friction || 'Intercept'}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="toggle-switch"><input type="checkbox" checked><span class="slider"></span></label>
          <button onclick="deleteCustomIntercept(${index})" style="background:none; border:none; color:#A8A29E; cursor:pointer; font-size:14px; padding:2px 6px;">✕</button>
        </div>
      </div>
    `;
    injectionPoint.insertAdjacentHTML('beforeend', html);
  });
}
