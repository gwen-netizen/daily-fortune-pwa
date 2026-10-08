// Telemetry and state parameters mapping to behavioral engine configurations
let isPremiumSelected = false;
let countdownInterval = null;
let mindFrictionStyle = 'scroll'; // Tracks Screen 2 profile choices: 'scroll', 'paralysis', 'routine'
let isAppMuted = localStorage.getItem('nudge_app_muted') === 'true'; // Global audio tracking baseline state

// METRIC STATE FRAME: Tracks your premium rebrand parameter values safely across reloads
let totalWinsCount = parseInt(localStorage.getItem('nudge_total_wins') || '0');
let totalFocusReclaimed = parseFloat(localStorage.getItem('nudge_minutes') || '0.0');

// Initial metric interface deployment bootstrap sequence
document.addEventListener("DOMContentLoaded", () => {
  updateMetricDashboard();
  checkStripeRedirectStatus();
  applyPremiumUIVisuals(); 
  initializeMuteUISystem(); // Syncs audio button text layout states on launch
});

/**
 * Metric Scaling Engine: Automatically scales presentation layout from 'min' to 'hr' based on volume milestones
 */
function updateMetricDashboard() {
  const streaksEl = document.getElementById('stat-streaks');
  const focusEl = document.getElementById('stat-focus');
  
  if (streaksEl && focusEl) {
    streaksEl.innerText = totalWinsCount;
    
    if (totalFocusReclaimed < 60) {
      // Presentation under 1 hour baseline milestone metrics
      focusEl.innerText = totalFocusReclaimed.toFixed(1) + ' min';
    } else {
      // Progressive presentation transformation to Hours metric frames
      const hoursScaled = totalFocusReclaimed / 60;
      focusEl.innerText = hoursScaled.toFixed(1) + ' hr';
    }
  }
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  if (screenId === 'screen-trigger') {
    const instructions = document.getElementById('trigger-instructions');
    const spinBtn = document.querySelector('.big-red-btn');
    if (instructions) instructions.innerText = "Take one slow, long breath before pushing.";
    if (spinBtn) spinBtn.innerText = "START";
  }
}

/**
 * Captures email input, establishes account anchors, and kicks off cloud profile initialization pipelines
 */
async function initializeUserProfile() {
  const emailInput = document.getElementById('user-auth-email');
  if (!emailInput || !emailInput.value.includes('@')) {
    alert("Please enter a valid email address to protect your focus milestones.");
    return;
  }

  const userEmail = emailInput.value.trim().toLowerCase();
  localStorage.setItem('nudge_user_email', userEmail);

  // Set up loading visual states on the primary action trigger
  const loginBtn = document.querySelector('#screen-onboarding-1 .btn-primary');
  if (loginBtn) {
    loginBtn.innerText = "SYNCHRONIZING ACCOUNT...";
    loginBtn.style.opacity = "0.7";
  }

  try {
    // Background hand-shake check requesting existing stats if user is logging into a secondary phone
    const response = await fetch(`/api/sync-user?email=${userEmail}&action=login`);
    const data = await response.json();

    if (data.exists) {
      // If user has historical data, recover stats instantly onto the new phone parameters
      totalWinsCount = data.total_wins || 0;
      totalFocusReclaimed = data.focus_reclaimed || 0.0;
      localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
      localStorage.setItem('nudge_minutes', totalFocusReclaimed.toString());
      if (data.premium_user) {
        localStorage.setItem('nudge_premium_user', 'true');
      }
      alert("Welcome back! Your lifetime focus assets have been successfully restored.");
    }
    
    // Progress cleanly down into the focus framework
    updateMetricDashboard();
    applyPremiumUIVisuals();
    switchScreen('screen-onboarding-2');
  } catch (error) {
    console.error("Cloud synchronization gateway issue encountered:", error);
    // Graceful offline failover fallback: allows avoiders to enter app if sandbox network drops
    switchScreen('screen-onboarding-2');
  }
}

/**
 * Push updates to the serverless Vercel database engine whenever metrics advance inside reward selection
 */
async function syncLifetimeProgressToCloud() {
  const userEmail = localStorage.getItem('nudge_user_email');
  const isPremium = localStorage.getItem('nudge_premium_user') === 'true';
  
  if (!userEmail) return;

  try {
    await fetch('/api/sync-user', {
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
    console.warn("Background persistence framework buffered metadata for next sync cycle:", err);
  }
}

/**
 * Maps Screen 2 selection metrics cleanly down to behavioral engine context labels
 */
function selectOption(el) {
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  
  const textContent = el.querySelector('.option-title').innerText;
  if (textContent.includes("Scrolling")) mindFrictionStyle = 'scroll';
  else if (textContent.includes("Paralysis")) mindFrictionStyle = 'paralysis';
  else mindFrictionStyle = 'routine';
}

function selectDeck(el, isPremium) {
  document.querySelectorAll('.deck-item').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  isPremiumSelected = isPremium;
  
  const deckTitleEl = document.getElementById('active-deck-title');
  if (deckTitleEl) {
    const deckName = el.querySelector('.deck-name').innerText;
    deckTitleEl.innerText = deckName;
  }
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

/**
 * Initializes and syncs mute system visual representations upon application launch loops
 */
function initializeMuteUISystem() {
  const muteBtn = document.getElementById('audio-mute-toggle');
  if (muteBtn) {
    muteBtn.innerText = isAppMuted ? "🔇 Muted" : "🔊 Sound On";
  }
}

/**
 * Toggles the application audio playback channel volumes globally
 */
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

/**
 * Functional Route Engine linking frontend Paywall Selection seamlessly to Stripe Checkout via user accounts
 */
async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-box.selected');
  if (!selectedTierBox) { alert("Please select a tracking tier to continue."); return; }

  const isLifetime = selectedTierBox.innerText.includes("Lifetime");
  const paywallBtn = document.querySelector('.paywall-modal .btn-primary');
  const originalText = paywallBtn ? paywallBtn.innerText : "Upgrade Mindset Portfolio";
  
  const userEmail = localStorage.getItem('nudge_user_email') || '';
  if (!userEmail) { alert("Auth parameter missing. Restart application to bind profile account."); return; }

  if (paywallBtn) { paywallBtn.innerText = "INITIALIZING GATEWAY..."; paywallBtn.style.opacity = "0.7"; }

  try {
    const response = await fetch('/api/create-checkout-session', {
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
    console.error(paymentError);
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

/**
 * Variable Reward Core: Sends your secure user email up to the backend router node to verify premium and prevent duplications
 */
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
// SOLUTION 2: Passes email securely as a parameters handle to let server cross-examine database status
const response = await fetch(/api/get-task?category=${categoryKey}&friction=${mindFrictionStyle}&email=${userEmail});
if (!response.ok) {
const serverErr = await response.json();
throw new Error(serverErr.error || "Server validation failure.");
}
const data = await response.json();
// Mindful 1.5s delay layout to disrupt instant checking patterns
setTimeout(() => {
if (btn) { btn.innerText = "START"; btn.style.opacity = "1"; }
const taskDisplayEl = document.getElementById('target-task-text');
if (taskDisplayEl && data.task) taskDisplayEl.innerText = data.task;
switchScreen('screen-countdown');
startActionTimer(120);
}, 1500);
} catch (err) {
console.error("Task transport framework issue:", err);
alert(Focus Engine Response: ${err.message});
switchScreen('screen-dashboard');
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
if (--timeLeft < 0) { clearInterval(countdownInterval); triggerVictoryPhase(2.0); }
}, 1000);
}
function finishEarly() {
const displayEl = document.getElementById('timer-display');
let elapsedMinutes = 2.0;
if (displayEl) {
const displayVal = displayEl.innerText;
const parts = displayVal.split(':');
if (parts.length === 2) {
// SOLUTION 1 FIXED COMPILATION MATH: Isolates the correct array split positions cleanly
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
// SOLUTION 3: Fires high-clarity success tone safely only if user hasn't toggled system mute
try {
if (!isAppMuted) {
const audioNode = document.getElementById('victory-chime');
if (audioNode) { audioNode.currentTime = 0; audioNode.play(); }
}
} catch (e) { console.warn("Audio node playback error caught:", e); }
switchScreen('screen-victory');
try {
if (typeof confetti === 'function') {
confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D4A373', '#4A7C59', '#2D2B2A'] });
}
} catch (e) { console.log("Confetti asset component exception caught:", e); }
}
function claimRewardStack() {
updateMetricDashboard();
syncLifetimeProgressToCloud(); // Triggers automated backup snapshot saving cleanly in background
switchScreen('screen-dashboard');
}
