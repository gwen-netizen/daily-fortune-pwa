// app.js - Full Core Application Controller Engine
let isPremiumSelected = false;
let countdownInterval = null;
let mindFrictionStyle = 'scroll'; 
let isAppMuted = localStorage.getItem('nudge_app_muted') === 'true'; 

let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

const victoryValidationStrings = [
  "You chose active alignment while the rest of the world remained paralyzed on the couch scrolling algorithms. Focus Reclaimed.",
  "Friction broken. By taking action for 120 seconds, you proved to your brain that execution is entirely safe.",
  "The dopamine loop has been successfully redirected. You are now running on true clean execution energy."
];

document.addEventListener("DOMContentLoaded", () => {
  updateMetricDashboard();
  checkStripeRedirectStatus();
  applyPremiumUIVisuals(); 
  initializeMuteUISystem(); 
  renderCustomLifelines();
});

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

/* ========================================================
   1. AUTHENTICATION & OTP FLOW (ABSOLUTE URL FIX)
======================================================== */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert("Please enter a valid email address to protect your focus milestones.");
    return;
  }

  const userEmail = emailInput.value.trim().toLowerCase();
  localStorage.setItem('nudge_user_email', userEmail);

  const loginBtn = document.getElementById('btn-take-control');
  const originalText = loginBtn ? loginBtn.innerText : "Take Control";
  
  if (loginBtn) {
    loginBtn.innerText = "REQUESTING ACCESS CODE...";
    loginBtn.style.opacity = "0.7";
    loginBtn.disabled = true;
  }

  try {
    // Explicit origin prefix prevents WebKit / PWA relative URL pattern errors
    const endpoint = `${window.location.origin}/api/sync-user?email=${encodeURIComponent(userEmail)}&action=request_otp`;
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
    alert(`Network Error: ${error.message}`);
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
    // Explicit origin prefix prevents WebKit / PWA relative URL pattern errors
    const endpoint = `${window.location.origin}/api/sync-user?email=${encodeURIComponent(userEmail)}&action=verify_otp&token=${encodeURIComponent(token)}`;
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
          applyPremiumUIVisuals();
        }
      }

      updateMetricDashboard();
      switchScreen('screen-onboarding-2');
    } else {
      alert(`Verification Error: ${data.error || "Invalid or expired access code."}`);
    }
  } catch (err) {
    alert(`Network Error: ${err.message}`);
  } finally {
    if (verifyBtn) {
      verifyBtn.innerText = originalText;
      verifyBtn.style.opacity = "1";
      verifyBtn.disabled = false;
    }
  }
}

function bypassToDiagnostic() {
  const emailInput = document.getElementById('user-auth-email');
  if (emailInput && emailInput.value.includes('@')) {
    localStorage.setItem('nudge_user_email', emailInput.value.trim().toLowerCase());
  }
  updateMetricDashboard();
  applyPremiumUIVisuals();
  switchScreen('screen-onboarding-2');
}

async function syncLifetimeProgressToCloud() {
  const userEmail = localStorage.getItem('nudge_user_email');
  const isPremium = localStorage.getItem('nudge_premium_user') === 'true';
  if (!userEmail) return;

  try {
    await fetch(`${window.location.origin}/api/sync-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        total_wins: totalWinsCount,
        focus_reclaimed: totalFocusReclaimed,
        premium_user: isPremium
      })
    });
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

/* ========================================================
   3. STRIPE PAYWALL GATEWAY (ABSOLUTE URL FIX)
======================================================== */
async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) { alert("Please select a tracking tier to continue."); return; }

  const isLifetime = selectedTierBox.innerText.includes("Lifetime");
  const paywallBtn = document.querySelector('.paywall-modal .btn-primary');
  const originalText = paywallBtn ? paywallBtn.innerText : "Upgrade Mindset Portfolio";
  const userEmail = localStorage.getItem('nudge_user_email') || '';

  if (paywallBtn) { paywallBtn.innerText = "INITIALIZING GATEWAY..."; paywallBtn.style.opacity = "0.7"; }

  try {
    const response = await fetch(`${window.location.origin}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: isLifetime ? 'lifetime' : 'monthly',
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

/* ========================================================
   4. TASK EXECUTION & METRICS ENGINE (MOD 3)
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

  try {
    const endpoint = `${window.location.origin}/api/get-task?category=${categoryKey}&friction=${mindFrictionStyle}&email=${encodeURIComponent(userEmail)}`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const serverErr = await response.json();
      throw new Error(serverErr.error || "Server validation failure.");
    }
    
    const data = await response.json();
    
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
   5. CUSTOM LIFELINES ENGINE
======================================================== */
function openCustomLifelineModal() {
  const isUserPremium = localStorage.getItem('nudge_premium_user') === 'true';
  if (!isUserPremium) {
    const paywall = document.getElementById('paywall-overlay');
    if (paywall) paywall.classList.add('active');
  } else {
    const modal = document.getElementById('custom-lifeline-modal');
    if (modal) modal.classList.add('active');
  }
}

function closeCustomLifelineModal() {
  const modal = document.getElementById('custom-lifeline-modal');
  if (modal) modal.classList.remove('active');
}

function saveCustomLifeline() {
  const timeInput = document.getElementById('custom-time-input').value;
  const frictionInput = document.getElementById('custom-friction-input').value;
  const deckInput = document.getElementById('custom-deck-input').value;

  if (!timeInput) {
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
  
  injectionPoint.innerHTML = ''; 
  const customs = JSON.parse(localStorage.getItem('nudge_custom_lifelines') || '[]');
  
  customs.forEach(c => {
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
