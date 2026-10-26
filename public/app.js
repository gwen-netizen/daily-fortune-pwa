/**
 * 120Reset Client Engine (public/app.js)
 * Full Supabase, Stripe & Multi-Deck Sequential Routing
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

let activeSelectedFrictions = new Set();
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

const CLIENT_FALLBACK_TASKS = {
  charisma: [
    { text: "Pull your shoulders back, plant both feet flat on the floor, and breathe slowly through your nose for 30 seconds.", focusArea: "Physical Posture & Biomechanics", affirmation: "A still body creates an unshakeable presence. Command the room." },
    { text: "Unclench your jaw, drop your tongue from the roof of your mouth, and sit in absolute stillness.", focusArea: "Quiet Confidence & Vocal Authority", affirmation: "Physical relaxation projects supreme situational command." },
    { text: "Open your palms flat on your desk. Exhale completely and hold silence.", focusArea: "Absolute Presence", affirmation: "Stillness is power. Stop fidgeting and take control." }
  ],
  wealth: [
    { text: "Open your banking app or wallet, count to three, and close it immediately. Take one slow breath.", focusArea: "Financial Clarity", affirmation: "Numbers on a screen cannot physically harm you. Ground yourself in the present." },
    { text: "Close your active shopping or browsing tabs right now. Drink a glass of cold water.", focusArea: "Stop Impulsive Spending", affirmation: "You just broke the digital dopamine spending loop. Keep your capital." },
    { text: "Roll your shoulders backward twice. Say aloud: 'I control my money; it does not control me.'", focusArea: "Rewire Money Habits", affirmation: "Drop the panic. You are in complete executive control." }
  ],
  dopamine: [
    { text: "Slide your phone face-down, exactly one arm's length away. Take one slow deep breath.", focusArea: "Quick Wins", affirmation: "Screen black. Brain free. The trance is broken." },
    { text: "Stand up, stretch both arms overhead for 10 seconds, then roll your neck.", focusArea: "Energy Surge", affirmation: "Oxygen flooding the brain. The afternoon slump is dead." },
    { text: "Turn your phone screen to grayscale mode right now, or close all unused background tabs.", focusArea: "Quick Wins", affirmation: "Dopamine slot machine disabled. Focus locked." }
  ],
  overwhelm: [
    { text: "Press both palms flat on your desk. Push down hard and exhale completely.", focusArea: "Physical Reset", affirmation: "Forcing air out kills acute panic. Your heart rate is slowing down.", step: 1 },
    { text: "Open the single document you are avoiding. Look only at the first sentence.", focusArea: "Dread Triage", affirmation: "It was only terrifying in your head. The first step is easy.", step: 2 },
    { text: "Full-screen your work window. Hide absolutely every other tab.", focusArea: "Visual Blinders", affirmation: "Visual clutter cleared. One single target.", step: 3 },
    { text: "Put your hands on the keyboard. Type one single word or make one click right now.", focusArea: "Motor Ignition", affirmation: "Action breaks the freeze. You made the first move. Keep going.", step: 4 }
  ]
};

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
    return sentences.map(s => `<p class="sentence-paragraph">${s}</p>`).join('');
  }
  return `<p class="sentence-paragraph">${cleaned}</p>`;
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

const NEURA_STATES = [
  { id: 'mindless_scrolling', name: 'Mindless scrolling', color: '#f3c547', rgb: '243, 197, 71' },
  { id: 'task_paralysis', name: 'Task paralysis', color: '#ff5d5d', rgb: '255, 93, 93' },
  { id: 'low_lethargy', name: 'Brain fog & lethargy', color: '#f28b4b', rgb: '242, 139, 75' }
];

let stageElement = null;
let brainCanvas = null, brainCtx = null;
let fiberCanvas = null, fiberCtx = null;
let fogCanvas = null, fogCtx = null;

let selectedStates = [];
let activeState = NEURA_STATES[0];
let transition = 1;
let targetTransition = 1;
let previousTime = 0;
let canvasWidth = 380;
let canvasHeight = 260;

function injectNeuraBrainStyles() {
  if (document.getElementById('neura-brain-injected-styles')) return;
  const style = document.createElement('style');
  style.id = 'neura-brain-injected-styles';
  style.textContent = `
    .brain-stage {
      --brain-accent: #f3c547;
      --brain-accent-rgb: 243, 197, 71;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .orbit {
      position: absolute;
      width: min(68vw, 240px);
      height: min(68vw, 240px);
      top: calc(47% - min(34vw, 120px));
      left: calc(50% - min(34vw, 120px));
      border: 1px solid rgba(114, 188, 214, 0.25);
      border-radius: 48% 52% 51% 49%;
      transform: rotate(28deg) rotateX(62deg);
      animation: neuraOrbit 17s linear infinite;
      pointer-events: none;
    }
    .orbit::before, .orbit::after {
      content: '';
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #a5f3ff;
      box-shadow: 0 0 20px 5px rgba(99,225,255,.75);
    }
    .orbit::before { top: 13%; left: 20%; }
    .orbit::after { right: 5%; bottom: 18%; background: var(--brain-accent); box-shadow: 0 0 20px 5px rgba(var(--brain-accent-rgb), .7); }
    .orbit-b {
      position: absolute;
      width: min(72vw, 255px);
      height: min(72vw, 255px);
      top: calc(47% - min(36vw, 127.5px));
      left: calc(50% - min(36vw, 127.5px));
      opacity: 0.45;
      transform: rotate(-32deg) rotateX(64deg) rotateY(11deg);
      animation: neuraOrbit 23s linear infinite reverse;
      pointer-events: none;
    }
    .orbit-b::before { top: 78%; left: 30%; background: #8de9ff; }
    .orbit-b::after { right: 23%; bottom: 4%; }
    .brain-aura {
      position: absolute;
      width: min(62vw, 220px);
      height: min(62vw, 220px);
      top: calc(47% - min(31vw, 110px));
      left: calc(50% - min(31vw, 110px));
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(93, 170, 199, 0.34), transparent 68%);
      filter: blur(18px);
      animation: neuraBreathe 4.2s ease-in-out infinite;
      pointer-events: none;
    }
    .brain-art { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; }
    #brainCanvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; filter: drop-shadow(0 20px 25px rgba(0,0,0,.4)); animation: neuraBrainFloat 4.7s ease-in-out infinite; }
    #fiberCanvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3; pointer-events: none; mix-blend-mode: screen; }
    #fogCanvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 6; pointer-events: none; mix-blend-mode: normal; }
    @keyframes neuraOrbit { to { transform: rotate(388deg) rotateX(62deg); } }
    @keyframes neuraBreathe { 0%,100% { transform: scale(.96); opacity: .64; } 50% { transform: scale(1.04); opacity: 1; } }
    @keyframes neuraBrainFloat { 0%,100% { transform: translate3d(0,-4px,0) scale(1.02) rotate(-.2deg); } 50% { transform: translate3d(0,-10px,0) scale(1.04) rotate(.22deg); } }
  `;
  document.head.appendChild(style);
}

function initNeuraBrainDOM() {
  injectNeuraBrainStyles();

  stageElement = document.createElement('div');
  stageElement.className = 'brain-stage';
  stageElement.id = 'brainStage';
  stageElement.innerHTML = `
    <div class="orbit"></div>
    <div class="orbit orbit-b"></div>
    <div class="brain-aura"></div>
    <div class="brain-art"><canvas id="brainCanvas" role="img" aria-label="Neura Friction Brain"></canvas></div>
    <canvas id="fiberCanvas" aria-hidden="true"></canvas>
    <canvas id="fogCanvas" aria-hidden="true"></canvas>
  `;

  const targetParent = document.getElementById('brain-viewport-s2');
  if (targetParent) {
    targetParent.innerHTML = '';
    targetParent.appendChild(stageElement);

    const statusEl = document.createElement('div');
    statusEl.className = 'brain-status-indicator';
    statusEl.id = 'brain-status-s2';
    statusEl.innerText = 'CLEAR SIGNAL';
    targetParent.appendChild(statusEl);
  }

  brainCanvas = stageElement.querySelector('#brainCanvas');
  brainCtx = brainCanvas.getContext('2d');
  fiberCanvas = stageElement.querySelector('#fiberCanvas');
  fiberCtx = fiberCanvas.getContext('2d');
  fogCanvas = stageElement.querySelector('#fogCanvas');
  fogCtx = fogCanvas.getContext('2d');

  resizeNeuraCanvas();
  requestAnimationFrame(drawNeuraScene);
}

function resizeNeuraCanvas() {
  if (!brainCanvas || !fiberCanvas || !fogCanvas || !stageElement) return;
  const parent = stageElement.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : stageElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  canvasWidth = rect.width || 380;
  canvasHeight = rect.height || 260;

  brainCanvas.width = Math.round(canvasWidth * dpr);
  brainCanvas.height = Math.round(canvasHeight * dpr);
  fiberCanvas.width = Math.round(canvasWidth * dpr);
  fiberCanvas.height = Math.round(canvasHeight * dpr);
  fogCanvas.width = Math.round(canvasWidth * dpr);
  fogCanvas.height = Math.round(canvasHeight * dpr);

  brainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fiberCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fogCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function roundedLobePath(context, cx, cy, rx, ry, phase, wobble = 0) {
  const points = 34;
  const outline = [];
  for (let i = 0; i <= points; i += 1) {
    const theta = (i / points) * Math.PI * 2;
    const wave = 1 + Math.sin(theta * 5 + phase) * .045 + Math.sin(theta * 9 - phase) * .026 + Math.sin(theta * 13 + phase) * .014 + wobble;
    outline.push({ x: cx + Math.cos(theta) * rx * wave, y: cy + Math.sin(theta) * ry * wave });
  }
  context.beginPath();
  const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const firstMid = midpoint(outline[0], outline[1]);
  context.moveTo(firstMid.x, firstMid.y);
  for (let i = 1; i < outline.length - 1; i += 1) {
    const nextMid = midpoint(outline[i], outline[i + 1]);
    context.quadraticCurveTo(outline[i].x, outline[i].y, nextMid.x, nextMid.y);
  }
  context.quadraticCurveTo(outline[outline.length - 1].x, outline[outline.length - 1].y, firstMid.x, firstMid.y);
  context.closePath();
}

function drawBrain(time) {
  const w = canvasWidth;
  const h = canvasHeight;
  brainCtx.clearRect(0, 0, w, h);

  const breath = Math.sin(time * .00135) * 2.2;
  const cx = w * .5;
  const cy = h * .47 + breath;
  
  const minDim = Math.min(w, h);
  const rx = minDim * .38;
  const ry = minDim * .30;
  const leftCx = cx - rx * .27;
  const rightCx = cx + rx * .27;

  const count = selectedStates.length;
  const tissueAlpha = count === 0 ? 1.0 : (count === 1 ? 0.74 : (count === 2 ? 0.48 : 0.22));

  const aura = brainCtx.createRadialGradient(cx, cy, ry * .08, cx, cy, ry * 1.45);
  aura.addColorStop(0, 'rgba(86, 205, 255, .25)');
  aura.addColorStop(.45, 'rgba(48, 117, 210, .13)');
  aura.addColorStop(1, 'rgba(4, 15, 27, 0)');
  brainCtx.fillStyle = aura;
  brainCtx.beginPath();
  brainCtx.ellipse(cx, cy, rx * 1.35, ry * 1.25, -.04, 0, Math.PI * 2);
  brainCtx.fill();

  brainCtx.save();
  brainCtx.globalAlpha = tissueAlpha;

  roundedLobePath(brainCtx, leftCx, cy, rx * .66, ry, time * .0007, breath / 100);
  const leftFill = brainCtx.createRadialGradient(leftCx - rx * .18, cy - ry * .4, 0, leftCx, cy, rx * .95);
  leftFill.addColorStop(0, 'rgba(255, 220, 177, .94)');
  leftFill.addColorStop(.22, 'rgba(151, 214, 255, .9)');
  leftFill.addColorStop(.58, 'rgba(64, 106, 210, .82)');
  leftFill.addColorStop(1, 'rgba(11, 33, 83, .7)');
  brainCtx.fillStyle = leftFill;
  brainCtx.fill();

  roundedLobePath(brainCtx, rightCx, cy, rx * .66, ry, time * .0007 + .4, breath / 100);
  const rightFill = brainCtx.createRadialGradient(rightCx + rx * .12, cy - ry * .38, 0, rightCx, cy, rx * .98);
  rightFill.addColorStop(0, 'rgba(255, 235, 154, .98)');
  rightFill.addColorStop(.25, 'rgba(255, 179, 97, .92)');
  rightFill.addColorStop(.6, 'rgba(129, 78, 193, .8)');
  rightFill.addColorStop(1, 'rgba(19, 34, 104, .72)');
  brainCtx.globalAlpha = tissueAlpha * .9;
  brainCtx.fillStyle = rightFill;
  brainCtx.fill();
  brainCtx.globalAlpha = tissueAlpha;

  brainCtx.restore();

  if (selectedStates.length > 0) {
    brainCtx.save();
    brainCtx.beginPath();
    brainCtx.ellipse(leftCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
    brainCtx.ellipse(rightCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
    brainCtx.ellipse(cx + rx * .29, cy + ry * .65, rx * .34, ry * .25, 0, 0, Math.PI * 2);
    brainCtx.clip();

    if (count >= 3) {
      const fullFog = brainCtx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.25);
      fullFog.addColorStop(0, 'rgba(8, 20, 42, 0.40)');
      fullFog.addColorStop(0.65, 'rgba(8, 20, 42, 0.65)');
      fullFog.addColorStop(1, 'rgba(8, 20, 42, 0.82)');
      brainCtx.fillStyle = fullFog;
      brainCtx.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, ry * 2.4);
    } else if (count === 2) {
      const leftX = cx - rx * 1.25;
      const rightX = cx + rx * 0.52;
      const baseGrad = brainCtx.createLinearGradient(leftX, 0, rightX, 0);
      baseGrad.addColorStop(0.0, 'rgba(8, 20, 42, 0.55)');
      baseGrad.addColorStop(0.70, 'rgba(8, 20, 42, 0.55)');
      baseGrad.addColorStop(1.0, 'rgba(8, 20, 42, 0.0)');
      brainCtx.fillStyle = baseGrad;
      brainCtx.fillRect(leftX, cy - ry * 1.2, rightX - leftX, ry * 2.4);
    } else if (count === 1) {
      const leftX = cx - rx * 1.25;
      const rightX = cx - rx * 0.25;
      const grad = brainCtx.createLinearGradient(cx - rx * 0.9, 0, rightX + rx * 0.10, 0);
      grad.addColorStop(0.0, 'rgba(8, 20, 42, 0.48)');
      grad.addColorStop(0.65, 'rgba(8, 20, 42, 0.42)');
      grad.addColorStop(1.0, 'rgba(8, 20, 42, 0)');
      brainCtx.fillStyle = grad;
      brainCtx.fillRect(leftX, cy - ry * 1.2, rightX - leftX, ry * 2.4);
    }
    brainCtx.restore();
  }
}

function drawNeuraScene(time) {
  if (!previousTime) previousTime = time;
  const delta = Math.min(time - previousTime, 48);
  previousTime = time;
  transition += (targetTransition - transition) * Math.min(delta * .008, .12);

  drawBrain(time);
  fiberCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  requestAnimationFrame(drawNeuraScene);
}

function syncNeuraStates() {
  selectedStates = [];
  if (activeSelectedFrictions.has('mindless_scrolling')) selectedStates.push(NEURA_STATES[0]);
  if (activeSelectedFrictions.has('task_paralysis')) selectedStates.push(NEURA_STATES[1]);
  if (activeSelectedFrictions.has('low_lethargy')) selectedStates.push(NEURA_STATES[2]);

  activeState = selectedStates[0] || NEURA_STATES[0];
  targetTransition = 0;
  window.setTimeout(() => { targetTransition = 1; }, 40);

  if (stageElement) {
    stageElement.style.setProperty('--brain-accent', activeState.color);
    stageElement.style.setProperty('--brain-accent-rgb', activeState.rgb);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem('120reset_returning_user', 'true');

  renderPresetIntercepts();
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();
  await checkStripeRedirectStatus();
  initBrainConstrictionState();
  initNeuraBrainDOM();

  const urlParams = new URLSearchParams(window.location.search);
  const frictionParam = urlParams.get('friction');
  if (frictionParam && ['mindless_scrolling', 'task_paralysis', 'low_lethargy'].includes(frictionParam)) {
    activeSelectedFrictions.clear();
    activeSelectedFrictions.add(frictionParam);
    brainConstrictionRatio = 0.33;
    localStorage.setItem('nudge_selected_frictions', JSON.stringify([frictionParam]));
    localStorage.setItem('nudge_brain_constriction', '0.33');
    syncNeuraStates();
    syncFrictionChipsUI();
    updateBrainStatusText();
  }

  const savedEmail = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';
  localStorage.setItem('nudge_user_email', savedEmail);

  try {
    const localDate = getLocalDateString();
    const endpoint = `/api/sync-user?email=${encodeURIComponent(savedEmail)}&action=get_profile&clientDate=${encodeURIComponent(localDate)}`;
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
    if (!currentUserProfile) {
      currentUserProfile = { email: savedEmail, premium_user: false, pass_expires_at: null };
    }
  }

  startPassTicker();
  updateMetricDashboard();

  // Sequential boot starts strictly on Screen 0
  switchScreen('screen-welcome', false);
});

function handleWelcomeContinue() {
  switchScreen('screen-onboarding-2', true);
}

function confirmFrictionsAndOpenDashboard() {
  if (activeSelectedFrictions.size === 0) {
    activeSelectedFrictions.add('mindless_scrolling');
    brainConstrictionRatio = 0.33;
    syncNeuraStates();
    syncFrictionChipsUI();
    updateBrainStatusText();
  }
  switchScreen('screen-dashboard', true);
}

function initBrainConstrictionState() {
  const today = getLocalDateString();
  const savedDate = localStorage.getItem('nudge_brain_date');

  if (savedDate !== today) {
    localStorage.setItem('nudge_brain_date', today);
    localStorage.setItem('nudge_brain_constriction', '0.0');
    localStorage.removeItem('nudge_selected_frictions');
    brainConstrictionRatio = 0.0;
    activeSelectedFrictions.clear();
  } else {
    const storedRatio = localStorage.getItem('nudge_brain_constriction');
    brainConstrictionRatio = storedRatio !== null ? parseFloat(storedRatio) : 0.0;

    const storedFrictions = localStorage.getItem('nudge_selected_frictions');
    if (storedFrictions) {
      try {
        const arr = JSON.parse(storedFrictions);
        activeSelectedFrictions = new Set(arr);
      } catch (e) {
        activeSelectedFrictions.clear();
      }
    }
  }

  syncNeuraStates();
  syncFrictionChipsUI();
  updateBrainStatusText();
}

function toggleFrictionSelection(el, frictionKey) {
  if (activeSelectedFrictions.has(frictionKey)) {
    activeSelectedFrictions.delete(frictionKey);
  } else {
    activeSelectedFrictions.add(frictionKey);
  }

  const count = activeSelectedFrictions.size;
  brainConstrictionRatio = count === 0 ? 0.0 : (count === 1 ? 0.33 : (count === 2 ? 0.66 : 1.0));

  const today = getLocalDateString();
  localStorage.setItem('nudge_brain_date', today);
  localStorage.setItem('nudge_brain_constriction', brainConstrictionRatio.toFixed(2));
  localStorage.setItem('nudge_selected_frictions', JSON.stringify(Array.from(activeSelectedFrictions)));

  syncNeuraStates();
  syncFrictionChipsUI();
  updateBrainStatusText();
}

function syncFrictionChipsUI() {
  document.querySelectorAll('.friction-chip').forEach(chip => {
    const key = chip.getAttribute('data-friction');
    chip.classList.remove('selected-red', 'selected-orange', 'selected-yellow');

    if (activeSelectedFrictions.has(key)) {
      if (key === 'mindless_scrolling') chip.classList.add('selected-red');
      else if (key === 'task_paralysis') chip.classList.add('selected-orange');
      else if (key === 'low_lethargy') chip.classList.add('selected-yellow');
    }
  });
}

function updateBrainStatusText() {
  const count = activeSelectedFrictions.size;
  const textS2 = document.getElementById('brain-status-s2');
  const textS3 = document.getElementById('brain-status-s3');

  let label = "CLEAR SIGNAL";
  if (count === 1) label = "MILD FOGGY";
  else if (count === 2) label = "MID FOGGY";
  else if (count >= 3) label = "INTENSE FOGGY";

  if (textS2) textS2.innerText = label;
  if (textS3) textS3.innerText = label;
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
      if (targetContainer && stageElement) {
        if (stageElement.parentElement !== targetContainer) {
          targetContainer.appendChild(stageElement);
        }
        resizeNeuraCanvas();
      }
    }

    if (screenId === 'screen-dashboard' || screenId === 'screen-onboarding-2' || screenId === 'screen-victory') {
      updatePassCountdown();
      updateBrainStatusText();
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
  const frictionKey = Array.from(activeSelectedFrictions)[0] || 'mindless_scrolling';
  const userEmail = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';

  const seenKey = `nudge_seen_${categoryKey}`;
  const seenIndices = JSON.parse(localStorage.getItem(seenKey) || '[]');

  try {
    let endpoint = `/api/get-task?category=${encodeURIComponent(categoryKey)}&friction=${encodeURIComponent(frictionKey)}&email=${encodeURIComponent(userEmail)}&seen=${encodeURIComponent(seenIndices.join(','))}`;
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
      console.warn("Backend API fallback:", netErr);
    }

    if (!taskData || !taskData.task) {
      const deckFallbacks = CLIENT_FALLBACK_TASKS[categoryKey] || CLIENT_FALLBACK_TASKS.charisma;
      let matchedTask = (categoryKey === 'overwhelm')
        ? (deckFallbacks.find(t => t.step === overwhelmCurrentStep) || deckFallbacks[0])
        : deckFallbacks[Math.floor(Math.random() * deckFallbacks.length)];

      taskData = {
        taskIndex: 0,
        historyReset: false,
        task: {
          text: matchedTask.text,
          focusArea: matchedTask.focusArea,
          affirmation: matchedTask.affirmation,
          step: matchedTask.step || 1
        }
      };
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

  if (isOverwhelm && overwhelmCurrentStep >= 4) {
    totalWinsCount += 1;
    totalFocusReclaimed += 8.0;
  } else if (!isOverwhelm) {
    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
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
    } else {
      if (btnOverwhelmNext) btnOverwhelmNext.style.display = 'none';
      if (btnOverwhelmReset) {
        btnOverwhelmReset.style.display = 'block';
        btnOverwhelmReset.innerHTML = `Claim 4x Protocol Stack &rarr;`;
      }
      if (victoryTitle) victoryTitle.innerText = "4x Protocol Complete!";
      if (victoryPoints) victoryPoints.innerText = "+480s Focus Reclaimed (4/4 Complete)";
    }
  } else {
    if (overwhelmActions) overwhelmActions.style.display = 'none';
    if (standardActions) standardActions.style.display = 'flex';
    if (victoryTitle) victoryTitle.innerText = "Impact Confirmed.";
    if (victoryPoints) victoryPoints.innerText = "+120s Focus Reclaimed";
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
  return currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true';
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
      quotaBadge.innerHTML = `(${used}/4 Free)`;
    }
  }

  const refCodeEl = document.getElementById('user-referral-code-display');
  if (refCodeEl && currentUserProfile?.referral_code) {
    refCodeEl.innerText = currentUserProfile.referral_code;
  }
}

function updateMetricDashboard() {
  updatePassCountdown();
}

async function syncLifetimeProgressToCloud() {
  const userEmail = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';
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
      updatePassCountdown();
    }
  } catch (e) {
    console.warn("Supabase background sync fallback:", e);
  }
}

function openPaywallModal() {
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
  if (modal) modal.classList.add('active');
}
function openProfileModal() {
  const modal = document.getElementById('profile-drawer-modal');
  if (modal) {
    const emailEl = document.getElementById('profile-email-display');
    const winsEl = document.getElementById('profile-stat-wins');
    const focusEl = document.getElementById('profile-stat-focus');
    const passCard = document.getElementById('profile-pass-status-card');

    const email = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';
    if (emailEl) emailEl.innerText = email;
    if (winsEl) winsEl.innerText = totalWinsCount.toString();
    if (focusEl) focusEl.innerText = `${totalFocusReclaimed.toFixed(1)}m`;

    const hasAccess = isUserPremiumOrPass();
    const remainingSecs = getPassRemainingSeconds();

    if (passCard) {
      if (hasAccess && !currentUserProfile.pass_expires_at) {
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
    window.location.href = '/';
  }
}

async function simulatePurchase() {
  const selectedTierBox = document.querySelector('.tier-card.selected');
  if (!selectedTierBox) { alert("Please select an option to continue."); return; }

  const planType = selectedTierBox.getAttribute('data-plan') || 'monthly';
  const paywallBtn = document.querySelector('#paywall-overlay .btn-primary');
  const userEmail = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';

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
  const modal = document.getElementById('custom-intercept-modal');
  if (modal) modal.classList.add('active');
}

function closeCustomInterceptModal() {
  closeModal('custom-intercept-modal');
}

function saveCustomIntercept() {
  const timeInput = document.getElementById('custom-time-input').value;
  if (!timeInput) return;

  const customs = JSON.parse(localStorage.getItem('nudge_custom_intercepts') || '[]');
  customs.push({ id: `anc_${Date.now()}`, time: timeInput, enabled: true });
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

      presets.forEach(p => {
        if (p.enabled && p.time === currentTimeStr) {
          const activeScreen = document.querySelector('.screen.active');
          if (activeScreen && activeScreen.id !== 'screen-countdown') {
            selectedCategory = mapDeckNameToCategory(p.deck);
            updateStartScreenHeading(selectedCategory);
            switchScreen('screen-trigger', true);
          }
        }
      });
    } catch (err) {}
  }, 15000);
}

async function shareReferralLink() {
  const refCode = currentUserProfile?.referral_code || '120R-SYNC';
  const shareUrl = `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`;
  const shareText = 'A physical 2-minute reset for when you hit a mental wall today:';

  if (navigator.share) {
    try {
      await navigator.share({ title: '120Reset', text: shareText, url: shareUrl });
    } catch (e) {}
  } else {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert("📋 Invite link copied to clipboard!");
    } catch (err) {
      prompt("Copy invite link:", shareUrl);
    }
  }
}
