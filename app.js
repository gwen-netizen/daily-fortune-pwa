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
  if (!expiry) return false;
  
  if (Date.now() > expiry) {
    // Local expiry met -> reset local flags
    localStorage.removeItem('nudge_pass_expiry');
    localStorage.removeItem('nudge_premium_user');
    return false;
  }
  return true;
}

function isUserPremiumOrPass() {
  const isPrem = localStorage.getItem('nudge_premium_user') === 'true';
  return isPrem || isPassActive();
}

async function checkAndTriggerScreen1Promo() {
  const promoInput = document.getElementById('user-promo-code');
  if (!promoInput) return;

  const code = promoInput.value.trim().toUpperCase();
  const alreadyClaimed = localStorage.getItem('nudge_promo_claimed') === 'true';
  const userEmail = localStorage.getItem('nudge_user_email');

  if (code === 'PREMIUM99' && !alreadyClaimed) {
    const expiryMs = Date.now() + (48 * 3600 * 1000);
    const expiresIso = new Date(expiryMs).toISOString();

    localStorage.setItem('nudge_pass_expiry', expiryMs.toString());
    localStorage.setItem('nudge_promo_claimed', 'true');
    localStorage.setItem('nudge_premium_user', 'true');

    // Hardcode sync 48 hour expiration timestamp directly to Supabase
    if (userEmail) {
      try {
        await fetch(getApiUrl('/api/sync-user'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            pass_expires_at: expiresIso,
            device_id: getDeviceId()
          })
        });
      } catch (e) { console.warn(e); }
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
    
    if (isPrem && !passActive) {
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
          localStorage.removeItem('nudge_pass_expiry');
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
  await checkAndTriggerScreen1Promo();

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
  el.classList.add('selected');### Step 1: Run This SQL Command in Supabase

To store and enforce the exact 48-hour pass expiration in PostgreSQL, run this query in **Supabase Dashboard** $\rightarrow$ **SQL Editor** $\rightarrow$ **New Query**:

```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS pass_expires_at TIMESTAMPTZ;
