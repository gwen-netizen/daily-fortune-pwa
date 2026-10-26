/**
 * 120Reset Client Engine (public/app.js)
 * High-End Neura Friction Living Tissue Brain Engine
 * Seamless Multi-State Translucent Fog (Zero Gaps Between Shades)
 * Direct Screen 1 Entry (Login & OTP Screen 0 Bypassed Completely)
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

// Multi-select friction states (up to 3)
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

// Offline & resilient task fallback bank
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
    if (document.getElementById('screen-onboarding-1')) {
      switchScreen('screen-onboarding-1', false);
    } else {
      window.location.href = '/';
    }
  } else if (currentId === 'screen-onboarding-1') {
    window.location.href = '/';
  }
});

/* ========================================================
   TASK COMPLETION CREDIT & VISIBILITY CALIBRATION
======================================================== */
function getTasksCreditToday() {
  const today = getLocalDateString();
  const savedDate = localStorage.getItem('nudge_brain_date');
  if (savedDate !== today) {
    localStorage.setItem('nudge_tasks_credit', '0');
    return 0;
  }
  const savedCredit = localStorage.getItem('nudge_tasks_credit');
  return savedCredit ? parseInt(savedCredit, 10) : 0;
}

function incrementTasksCompletedCredit(amount = 1) {
  const current = getTasksCreditToday();
  const nextVal = current + amount;
  localStorage.setItem('nudge_tasks_credit', nextVal.toString());
  updateBrainStatusText();
  syncNeuraStates();
}

function getVisibilityMetrics() {
  const count = activeSelectedFrictions.size;

  let baseVisibility = 100;
  if (count === 1) baseVisibility = 67;
  else if (count === 2) baseVisibility = 34;
  else if (count >= 3) baseVisibility = 1;

  const tasksCredit = getTasksCreditToday();
  const earnedVisibility = tasksCredit * 16.5;

  const rawVisibility = Math.min(100, Math.max(1, baseVisibility + earnedVisibility));
  const displayVisibility = Math.floor(rawVisibility);

  let subtitle = "Clear Signal";
  if (rawVisibility >= 100) {
    subtitle = "Clear Signal";
  } else if (rawVisibility >= 67) {
    subtitle = "Mild Foggy";
  } else if (rawVisibility >= 34) {
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
    fogCoverageRatio: (100 - rawVisibility) / 100
  };
}

/* ========================================================
   NEURA FRICTION BRAIN CANVAS & FOG ENGINE
======================================================== */
const NEURA_STATES = [
  {
    id: 'mindless_scrolling',
    name: 'Mindless scrolling',
    color: '#f3c547',
    rgb: '243, 197, 71'
  },
  {
    id: 'task_paralysis',
    name: 'Task paralysis',
    color: '#ff5d5d',
    rgb: '255, 93, 93'
  },
  {
    id: 'low_lethargy',
    name: 'Brain fog & lethargy',
    color: '#f28b4b',
    rgb: '242, 139, 75'
  }
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
let strands = [];

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
    .brain-art {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
    #brainCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 20px 25px rgba(0,0,0,.4));
      animation: neuraBrainFloat 4.7s ease-in-out infinite;
    }
    #fiberCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
      mix-blend-mode: screen;
    }
    #fogCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 6;
      pointer-events: none;
      mix-blend-mode: normal;
    }
    @keyframes neuraOrbit { to { transform: rotate(388deg) rotateX(62deg); } }
    @keyframes neuraBreathe { 0%,100% { transform: scale(.96); opacity: .64; } 50% { transform: scale(1.04); opacity: 1; } }
    @keyframes neuraBrainFloat {
      0%,100% { transform: translate3d(0,-4px,0) scale(1.02) rotate(-.2deg); }
      50% { transform: translate3d(0,-10px,0) scale(1.04) rotate(.22deg); }
    }
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
    statusEl.innerText = '100% VISIBILITY • CLEAR SIGNAL';
    targetParent.appendChild(statusEl);
  }

  brainCanvas = stageElement.querySelector('#brainCanvas');
  brainCtx = brainCanvas.getContext('2d');
  fiberCanvas = stageElement.querySelector('#fiberCanvas');
  fiberCtx = fiberCanvas.getContext('2d');
  fogCanvas = stageElement.querySelector('#fogCanvas');
  fogCtx = fogCanvas.getContext('2d');

  createStrands();
  resizeNeuraCanvas();
  updateBrainStatusText();
  requestAnimationFrame(drawNeuraScene);
}

function seeded(index, salt = 1) {
  const x = Math.sin(index * 9283.37 + salt * 17.11) * 43758.5453;
  return x - Math.floor(x);
}

function createStrands() {
  strands = Array.from({ length: 48 }, (_, index) => {
    const lane = index / 47;
    return {
      lane,
      x: .15 + seeded(index, 1) * .70,
      y: .18 + seeded(index, 2) * .64,
      width: .48 + seeded(index, 3) * .42,
      height: .28 + seeded(index, 4) * .35,
      tilt: (seeded(index, 5) - .5) * .95,
      speed: .00045 + seeded(index, 6) * .00065,
      phase: seeded(index, 7) * Math.PI * 2,
      index,
      alpha: .18 + seeded(index, 8) * .30
    };
  });
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

/* ========================================================
   SEAMLESS TRANS-GREY FOG ENGINE WITH TISSUE DIMMING
======================================================== */
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

  // Gradual tissue fade beneath translucent overlay
  const count = selectedStates.length;
  const tissueAlpha = count === 0 ? 1.0 : (count === 1 ? 0.74 : (count === 2 ? 0.48 : 0.22));

  // Luminous blue/gold backdrop aura
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

  // Left hemisphere
  roundedLobePath(brainCtx, leftCx, cy, rx * .66, ry, time * .0007, breath / 100);
  const leftFill = brainCtx.createRadialGradient(leftCx - rx * .18, cy - ry * .4, 0, leftCx, cy, rx * .95);
  leftFill.addColorStop(0, 'rgba(255, 220, 177, .94)');
  leftFill.addColorStop(.22, 'rgba(151, 214, 255, .9)');
  leftFill.addColorStop(.58, 'rgba(64, 106, 210, .82)');
  leftFill.addColorStop(1, 'rgba(11, 33, 83, .7)');
  brainCtx.fillStyle = leftFill;
  brainCtx.fill();

  // Right hemisphere
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

  // Living cords and neurovascular vessels
  brainCtx.save();
  brainCtx.beginPath();
  brainCtx.ellipse(leftCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
  brainCtx.ellipse(rightCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
  brainCtx.clip();
  const cordColors = ['#ffd37d', '#ff9f75', '#79ddff', '#b699ff', '#fff2c4'];
  for (let i = 0; i < 42; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const row = Math.floor(i / 2);
    const startX = cx + side * (rx * (.58 - (row % 5) * .05));
    const startY = cy - ry * .82 + (row / 20) * ry * 1.65;
    const endX = cx - side * (rx * (.2 + (row % 4) * .08));
    const bend = side * rx * (.12 + (row % 3) * .05);
    brainCtx.beginPath();
    brainCtx.moveTo(startX, startY);
    brainCtx.bezierCurveTo(startX - bend, startY - ry * .22, endX + bend, startY + ry * .18, endX, startY + ry * .38);
    brainCtx.bezierCurveTo(endX - bend * .4, startY + ry * .64, endX + bend * .35, startY + ry * .88, cx + side * rx * .06, startY + ry * 1.1);
    brainCtx.strokeStyle = cordColors[i % cordColors.length];
    brainCtx.globalAlpha = (.3 + (i % 4) * .1) * tissueAlpha;
    brainCtx.lineWidth = 1.3 + (i % 5 === 0 ? 2.4 : .2);
    brainCtx.lineCap = 'round';
    brainCtx.shadowBlur = i % 5 === 0 ? 12 : 4;
    brainCtx.shadowColor = cordColors[i % cordColors.length];
    brainCtx.stroke();
  }
  for (let i = 0; i < 12; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const x = cx + side * rx * (.05 + (i % 6) * .06);
    brainCtx.beginPath();
    brainCtx.moveTo(x, cy - ry * .9);
    brainCtx.bezierCurveTo(x + side * rx * .18, cy - ry * .45, x - side * rx * .16, cy - ry * .05, x + side * rx * .12, cy + ry * .42);
    brainCtx.bezierCurveTo(x - side * rx * .08, cy + ry * .62, x + side * rx * .1, cy + ry * .76, x, cy + ry * .95);
    brainCtx.strokeStyle = i % 3 === 0 ? '#fff4be' : '#69d9ff';
    brainCtx.globalAlpha = .46 * tissueAlpha;
    brainCtx.lineWidth = 1.8;
    brainCtx.shadowBlur = 10;
    brainCtx.stroke();
  }
  brainCtx.restore();

  // Luminous sagittal fissure and central bridge
  brainCtx.beginPath();
  brainCtx.moveTo(cx - rx * .03, cy - ry * .82);
  brainCtx.bezierCurveTo(cx + rx * .12, cy - ry * .45, cx - rx * .12, cy - ry * .1, cx + rx * .02, cy + ry * .2);
  brainCtx.bezierCurveTo(cx + rx * .12, cy + ry * .48, cx - rx * .08, cy + ry * .72, cx - rx * .02, cy + ry * .92);
  brainCtx.strokeStyle = 'rgba(14, 28, 74, .62)';
  brainCtx.lineWidth = 5;
  brainCtx.stroke();
  brainCtx.strokeStyle = 'rgba(255, 221, 129, .7)';
  brainCtx.lineWidth = 1.2;
  brainCtx.shadowBlur = 14;
  brainCtx.shadowColor = '#ffca6e';
  brainCtx.stroke();
  brainCtx.shadowBlur = 0;

  for (let i = 0; i < 14; i += 1) {
    brainCtx.beginPath();
    brainCtx.ellipse(cx, cy + (i - 7) * 3, rx * (.66 - Math.abs(i - 7) * .025), ry * (.96 - Math.abs(i - 7) * .018), -.05, Math.PI * .08, Math.PI * .92);
    brainCtx.strokeStyle = i % 2 ? 'rgba(164, 234, 255, .2)' : 'rgba(255, 198, 120, .23)';
    brainCtx.lineWidth = 1;
    brainCtx.stroke();
  }

  // Brainstem and cerebellum
  const stem = brainCtx.createLinearGradient(cx, cy + ry * .6, cx, h);
  stem.addColorStop(0, '#ffd08a'); stem.addColorStop(.35, '#db8fb2'); stem.addColorStop(.75, '#6758bd'); stem.addColorStop(1, '#162f83');
  brainCtx.fillStyle = stem;
  brainCtx.beginPath();
  brainCtx.moveTo(cx - rx * .1, cy + ry * .58);
  brainCtx.bezierCurveTo(cx - rx * .15, cy + ry * .88, cx - rx * .05, cy + ry * 1.1, cx - rx * .025, h * .98);
  brainCtx.lineTo(cx + rx * .045, h * .98);
  brainCtx.bezierCurveTo(cx + rx * .1, cy + ry * .95, cx + rx * .18, cy + ry * .74, cx + rx * .12, cy + ry * .58);
  brainCtx.closePath();
  brainCtx.fill();
  roundedLobePath(brainCtx, cx + rx * .29, cy + ry * .65, rx * .27, ry * .2, time * .0008);
  const cerebellum = brainCtx.createRadialGradient(cx + rx * .2, cy + ry * .56, 0, cx + rx * .29, cy + ry * .65, rx * .3);
  cerebellum.addColorStop(0, '#ffe2a4'); cerebellum.addColorStop(.45, '#f39a95'); cerebellum.addColorStop(1, '#8057bd');
  brainCtx.fillStyle = cerebellum;
  brainCtx.fill();
  for (let i = 0; i < 8; i += 1) {
    brainCtx.beginPath();
    brainCtx.moveTo(cx + rx * .08, cy + ry * .55 + i * 6);
    brainCtx.quadraticCurveTo(cx + rx * .28, cy + ry * .57 + (i % 2) * 5, cx + rx * .47, cy + ry * .58 + i * 6);
    brainCtx.strokeStyle = 'rgba(255, 226, 157, .45)';
    brainCtx.lineWidth = 1.3;
    brainCtx.stroke();
  }

  brainCtx.restore();

  // Atmospheric tissue fog (Continuous coverage, zero gap between shades)
  if (selectedStates.length > 0) {
    brainCtx.save();
    brainCtx.beginPath();
    brainCtx.ellipse(leftCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
    brainCtx.ellipse(rightCx, cy, rx * .66, ry, 0, 0, Math.PI * 2);
    brainCtx.ellipse(cx + rx * .29, cy + ry * .65, rx * .34, ry * .25, 0, 0, Math.PI * 2);
    brainCtx.clip();

    if (count >= 3) {
      // 3 options selected: Soft atmospheric mist across full brain
      const fullFog = brainCtx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.25);
      fullFog.addColorStop(0, 'rgba(8, 20, 42, 0.40)');
      fullFog.addColorStop(0.65, 'rgba(8, 20, 42, 0.65)');
      fullFog.addColorStop(1, 'rgba(8, 20, 42, 0.82)');
      brainCtx.fillStyle = fullFog;
      brainCtx.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, ry * 2.4);

      selectedStates.forEach((state, i) => {
        brainCtx.beginPath();
        const offsetX = (i - 1) * rx * 0.45;
        brainCtx.ellipse(cx + offsetX, cy + Math.sin(time * 0.001 + i) * 6, rx * 0.48, ry * 0.65, 0, 0, Math.PI * 2);
        brainCtx.fillStyle = `rgba(${state.rgb}, 0.10)`;
        brainCtx.filter = 'blur(12px)';
        brainCtx.fill();
        brainCtx.filter = 'none';
      });
    } else if (count === 2) {
      // 2 options selected: UNBROKEN CONTINUOUS FOG ACROSS LEFT + CENTER (ZERO GAP)
      const state0 = selectedStates[0];
      const state1 = selectedStates[1];

      const leftX = cx - rx * 1.25;
      const rightX = cx + rx * 0.52;
      const seamX = cx + rx * 0.02;

      // 1. Unbroken continuous base fog covering the entire 70% width
      brainCtx.beginPath();
      brainCtx.moveTo(leftX, cy - ry * 1.2);
      brainCtx.lineTo(rightX, cy - ry * 1.2);
      brainCtx.bezierCurveTo(rightX + rx * 0.12, cy - ry * 0.4, rightX - rx * 0.08, cy + ry * 0.4, rightX - rx * 0.04, cy + ry * 1.2);
      brainCtx.lineTo(leftX, cy + ry * 1.2);
      brainCtx.closePath();
      
      const baseGrad = brainCtx.createLinearGradient(leftX, 0, rightX, 0);
      baseGrad.addColorStop(0.0, 'rgba(8, 20, 42, 0.55)');
      baseGrad.addColorStop(0.70, 'rgba(8, 20, 42, 0.55)');
      baseGrad.addColorStop(1.0, 'rgba(8, 20, 42, 0.0)');
      brainCtx.fillStyle = baseGrad;
      brainCtx.fill();

      // 2. Shade 0 (Left section, overlaps 10% past the center seam)
      const shade0Right = seamX + rx * 0.10;
      brainCtx.beginPath();
      brainCtx.moveTo(leftX, cy - ry * 1.2);
      brainCtx.lineTo(shade0Right, cy - ry * 1.2);
      brainCtx.bezierCurveTo(shade0Right + rx * 0.05, cy - ry * 0.4, shade0Right - rx * 0.05, cy + ry * 0.4, shade0Right, cy + ry * 1.2);
      brainCtx.lineTo(leftX, cy + ry * 1.2);
      brainCtx.closePath();

      const grad0 = brainCtx.createLinearGradient(cx - rx * 0.8, 0, shade0Right, 0);
      grad0.addColorStop(0.0, `rgba(${state0.rgb}, 0.20)`);
      grad0.addColorStop(0.75, `rgba(${state0.rgb}, 0.16)`);
      grad0.addColorStop(1.0, `rgba(${state0.rgb}, 0.04)`);
      brainCtx.fillStyle = grad0;
      brainCtx.filter = 'blur(6px)';
      brainCtx.fill();
      brainCtx.filter = 'none';

      // 3. Shade 1 (Center section, overlaps 10% before the center seam)
      const shade1Left = seamX - rx * 0.10;
      brainCtx.beginPath();
      brainCtx.moveTo(shade1Left, cy - ry * 1.2);
      brainCtx.lineTo(rightX, cy - ry * 1.2);
      brainCtx.bezierCurveTo(rightX + rx * 0.12, cy - ry * 0.4, rightX - rx * 0.08, cy + ry * 0.4, rightX - rx * 0.04, cy + ry * 1.2);
      brainCtx.lineTo(shade1Left, cy + ry * 1.2);
      brainCtx.closePath();

      const grad1 = brainCtx.createLinearGradient(shade1Left, 0, rightX, 0);
      grad1.addColorStop(0.0, `rgba(${state1.rgb}, 0.04)`);
      grad1.addColorStop(0.25, `rgba(${state1.rgb}, 0.18)`);
      grad1.addColorStop(0.70, `rgba(${state1.rgb}, 0.18)`);
      grad1.addColorStop(1.0, 'rgba(8, 20, 42, 0)');
      brainCtx.fillStyle = grad1;
      brainCtx.filter = 'blur(6px)';
      brainCtx.fill();
      brainCtx.filter = 'none';

    } else if (count === 1) {
      // 1 option selected: Left lobe covered, fades smoothly before center
      const state0 = selectedStates[0];
      const leftX = cx - rx * 1.25;
      const rightX = cx - rx * 0.25;

      brainCtx.beginPath();
      brainCtx.moveTo(leftX, cy - ry * 1.2);
      brainCtx.lineTo(rightX, cy - ry * 1.2);
      brainCtx.bezierCurveTo(rightX + rx * 0.10, cy - ry * 0.4, rightX - rx * 0.08, cy + ry * 0.4, rightX, cy + ry * 1.2);
      brainCtx.lineTo(leftX, cy + ry * 1.2);
      brainCtx.closePath();

      const grad = brainCtx.createLinearGradient(cx - rx * 0.9, 0, rightX + rx * 0.10, 0);
      grad.addColorStop(0.0, 'rgba(8, 20, 42, 0.48)');
      grad.addColorStop(0.65, 'rgba(8, 20, 42, 0.42)');
      grad.addColorStop(1.0, 'rgba(8, 20, 42, 0)');
      brainCtx.fillStyle = grad;
      brainCtx.filter = 'blur(6px)';
      brainCtx.fill();

      brainCtx.fillStyle = `rgba(${state0.rgb}, 0.18)`;
      brainCtx.fill();
      brainCtx.filter = 'none';
    }

    brainCtx.restore();
  }
}

function drawStrand(strand, time) {
  const centerX = canvasWidth * strand.x;
  const centerY = canvasHeight * strand.y;
  const radiusX = canvasWidth * strand.width * .48;
  const radiusY = canvasHeight * strand.height * .72;
  const wave = Math.sin(time * strand.speed + strand.phase);
  
  const { rawVisibility } = getVisibilityMetrics();
  const coverage = (100 - rawVisibility) / 100;
  
  const isActive = selectedStates.length > 0 && strand.index < Math.ceil(strands.length * coverage);
  const strandState = isActive ? selectedStates[strand.index % selectedStates.length] : null;
  const tension = isActive ? .74 + transition * .26 : .25 + transition * .1;
  const constriction = isActive ? 1 - tension * .075 + wave * .013 : 1 + wave * .025;
  const lineWidth = isActive ? 1.25 + transition * .9 : .75;
  const alpha = isActive ? (.18 + transition * .52) : strand.alpha * .5;
  const color = isActive ? strandState.color : '#9eeaff';
  const rgb = isActive ? strandState.rgb : '158, 234, 255';

  fiberCtx.save();
  fiberCtx.translate(centerX, centerY);
  fiberCtx.rotate(strand.tilt + wave * .03);
  fiberCtx.scale(constriction, 1 - (constriction - 1) * .32);
  fiberCtx.beginPath();
  for (let i = 0; i <= 72; i += 1) {
    const t = i / 72;
    const theta = Math.PI * 2 * t;
    const wobble = Math.sin(theta * 3 + strand.phase + time * strand.speed * 1.3) * (isActive ? 2.5 : 1.3);
    const x = Math.cos(theta) * (radiusX + wobble) + Math.sin(theta * 2 + strand.phase) * 6;
    const y = Math.sin(theta) * (radiusY + wobble * .55) + Math.cos(theta * 3 + strand.phase) * 4;
    if (i === 0) fiberCtx.moveTo(x, y); else fiberCtx.lineTo(x, y);
  }
  fiberCtx.closePath();
  fiberCtx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  fiberCtx.lineWidth = lineWidth;
  fiberCtx.shadowBlur = isActive ? 14 : 5;
  fiberCtx.shadowColor = color;
  fiberCtx.stroke();

  if (isActive && (strand.lane * 41) % 2 < 1) {
    const nodeTheta = (time * strand.speed * 2 + strand.phase) % (Math.PI * 2);
    const nodeX = Math.cos(nodeTheta) * radiusX;
    const nodeY = Math.sin(nodeTheta) * radiusY;
    fiberCtx.beginPath();
    fiberCtx.arc(nodeX, nodeY, 1.4 + transition * 1.2, 0, Math.PI * 2);
    fiberCtx.fillStyle = `rgba(255, 250, 215, ${.65 + transition * .3})`;
    fiberCtx.shadowBlur = 15;
    fiberCtx.shadowColor = color;
    fiberCtx.fill();
  }
  fiberCtx.restore();
}

function drawConstrictionLayer(time) {
  if (selectedStates.length === 0) return;
  const w = canvasWidth;
  const h = canvasHeight;
  const minDim = Math.min(w, h);
  const centerX = w * .5;
  const centerY = h * .47;
  const radiusX = minDim * .39;
  const radiusY = minDim * .29;
  
  const { rawVisibility } = getVisibilityMetrics();
  const coverage = (100 - rawVisibility) / 100;

  fiberCtx.save();
  fiberCtx.beginPath();
  fiberCtx.ellipse(centerX - radiusX * .27, centerY, radiusX * .63, radiusY, 0, 0, Math.PI * 2);
  fiberCtx.ellipse(centerX + radiusX * .27, centerY, radiusX * .63, radiusY, 0, 0, Math.PI * 2);
  fiberCtx.clip();

  const bandsPerState = Math.ceil(12 * coverage);
  selectedStates.forEach((state, stateIndex) => {
    for (let i = 0; i < bandsPerState; i += 1) {
      const lane = (i + stateIndex * .43) / Math.max(bandsPerState, 1);
      const y = centerY - radiusY * .78 + lane * radiusY * 1.58;
      const squeeze = 1 - Math.sin(time * .001 + i + stateIndex) * .035 - coverage * .035;
      const span = radiusX * (.62 + Math.sin(i * 1.7) * .035) * squeeze;
      const wave = Math.sin(time * .0012 + i * .7 + stateIndex) * radiusY * .055;
      fiberCtx.beginPath();
      fiberCtx.moveTo(centerX - span, y);
      fiberCtx.bezierCurveTo(centerX - span * .42, y + wave, centerX - span * .05, y - wave, centerX + span * .08, y + wave * .3);
      fiberCtx.bezierCurveTo(centerX + span * .3, y + wave, centerX + span * .63, y - wave, centerX + span, y + wave * .15);
      fiberCtx.strokeStyle = `rgba(${state.rgb}, ${.24 + coverage * .2})`;
      fiberCtx.lineWidth = 1.05 + coverage * 1.7;
      fiberCtx.lineCap = 'round';
      fiberCtx.shadowBlur = 10 + coverage * 7;
      fiberCtx.shadowColor = state.color;
      fiberCtx.stroke();
    }
  });
  fiberCtx.restore();

  selectedStates.forEach((state, index) => {
    fiberCtx.save();
    fiberCtx.beginPath();
    fiberCtx.ellipse(centerX, centerY, radiusX * (1.02 - index * .025), radiusY * (1.05 - index * .025), -.03, 0, Math.PI * 2);
    fiberCtx.strokeStyle = `rgba(${state.rgb}, ${.27 + coverage * .12})`;
    fiberCtx.lineWidth = 1.2 + coverage * 1.1;
    fiberCtx.shadowBlur = 14;
    fiberCtx.shadowColor = state.color;
    fiberCtx.stroke();
    fiberCtx.restore();
  });
}

function drawFogLayer(time) {
  fogCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (selectedStates.length === 0) return;

  const w = canvasWidth;
  const h = canvasHeight;
  const minDim = Math.min(w, h);
  const centerX = w * .5;
  const centerY = h * .47;
  const radiusX = minDim * .38;
  const radiusY = minDim * .30;

  fogCtx.save();
  fogCtx.beginPath();
  fogCtx.ellipse(centerX - radiusX * .27, centerY, radiusX * .66, radiusY, 0, 0, Math.PI * 2);
  fogCtx.ellipse(centerX + radiusX * .27, centerY, radiusX * .66, radiusY, 0, 0, Math.PI * 2);
  fogCtx.ellipse(centerX + radiusX * .29, centerY + radiusY * .65, radiusX * .34, radiusY * .25, 0, 0, Math.PI * 2);
  fogCtx.clip();

  const count = selectedStates.length;

  if (count >= 3) {
    // 3 options selected: Ethereal atmospheric mist across the full brain
    const softGlow = fogCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusX * 1.3);
    softGlow.addColorStop(0, 'rgba(8, 20, 42, 0.28)');
    softGlow.addColorStop(0.65, 'rgba(8, 20, 42, 0.45)');
    softGlow.addColorStop(1, 'rgba(8, 20, 42, 0.62)');
    fogCtx.fillStyle = softGlow;
    fogCtx.fillRect(centerX - radiusX * 1.2, centerY - radiusY * 1.2, radiusX * 2.4, radiusY * 2.4);

    for (let i = 0; i < 9; i += 1) {
      const state = selectedStates[i % selectedStates.length];
      fogCtx.beginPath();
      fogCtx.ellipse(
        centerX + Math.sin(time * .0006 + i * 1.2) * radiusX * .48,
        centerY + Math.cos(time * .0008 + i * 1.4) * radiusY * .55,
        radiusX * (.18 + (i % 3) * .04),
        radiusY * (.10 + (i % 2) * .04),
        i * 0.4,
        0,
        Math.PI * 2
      );
      fogCtx.fillStyle = `rgba(${state.rgb}, 0.08)`;
      fogCtx.filter = 'blur(10px)';
      fogCtx.fill();
    }
    fogCtx.filter = 'none';

  } else if (count === 2) {
    // 2 options selected: Seamlessly merged overlay (ZERO GAP between shades)
    const state0 = selectedStates[0];
    const state1 = selectedStates[1];
    const leftX = centerX - radiusX * 1.25;
    const rightX = centerX + radiusX * 0.52;

    // Unbroken base fog covering left and center continuously
    fogCtx.beginPath();
    fogCtx.moveTo(leftX, centerY - radiusY * 1.2);
    fogCtx.lineTo(rightX, centerY - radiusY * 1.2);
    fogCtx.bezierCurveTo(rightX + radiusX * 0.12, centerY - radiusY * 0.4, rightX - radiusX * 0.08, centerY + radiusY * 0.4, rightX - radiusX * 0.04, centerY + radiusY * 1.2);
    fogCtx.lineTo(leftX, centerY + radiusY * 1.2);
    fogCtx.closePath();

    const baseGrad = fogCtx.createLinearGradient(leftX, 0, rightX, 0);
    baseGrad.addColorStop(0.0, 'rgba(8, 20, 42, 0.42)');
    baseGrad.addColorStop(0.70, 'rgba(8, 20, 42, 0.42)');
    baseGrad.addColorStop(1.0, 'rgba(8, 20, 42, 0.0)');
    fogCtx.fillStyle = baseGrad;
    fogCtx.fill();

    fogCtx.strokeStyle = `rgba(${state1.rgb}, 0.16)`;
    fogCtx.lineWidth = 6;
    fogCtx.filter = 'blur(8px)';
    fogCtx.stroke();
    fogCtx.filter = 'none';

    // Left shade color cloud
    fogCtx.beginPath();
    fogCtx.ellipse(centerX - radiusX * 0.52, centerY, radiusX * 0.42, radiusY * 0.65, 0, 0, Math.PI * 2);
    fogCtx.fillStyle = `rgba(${state0.rgb}, 0.14)`;
    fogCtx.filter = 'blur(12px)';
    fogCtx.fill();

    // Right shade color cloud (overlaps across the center seam so center is fully shaded, zero gap)
    fogCtx.beginPath();
    fogCtx.ellipse(centerX + radiusX * 0.15, centerY, radiusX * 0.42, radiusY * 0.65, 0, 0, Math.PI * 2);
    fogCtx.fillStyle = `rgba(${state1.rgb}, 0.14)`;
    fogCtx.filter = 'blur(12px)';
    fogCtx.fill();
    fogCtx.filter = 'none';

  } else if (count === 1) {
    const state0 = selectedStates[0];
    const leftX = centerX - radiusX * 1.25;
    const rightX = centerX - radiusX * 0.25;

    fogCtx.beginPath();
    fogCtx.moveTo(leftX, centerY - radiusY * 1.2);
    fogCtx.lineTo(rightX, centerY - radiusY * 1.2);
    fogCtx.bezierCurveTo(rightX + radiusX * 0.10, centerY - radiusY * 0.4, rightX - radiusX * 0.08, centerY + radiusY * 0.4, rightX, centerY + radiusY * 1.2);
    fogCtx.lineTo(leftX, centerY + radiusY * 1.2);
    fogCtx.closePath();

    const grad = fogCtx.createLinearGradient(centerX - radiusX * 0.9, 0, rightX + radiusX * 0.10, 0);
    grad.addColorStop(0.0, 'rgba(8, 20, 42, 0.38)');
    grad.addColorStop(0.70, 'rgba(8, 20, 42, 0.38)');
    grad.addColorStop(1.0, 'rgba(8, 20, 42, 0)');
    fogCtx.fillStyle = grad;
    fogCtx.fill();

    fogCtx.strokeStyle = `rgba(${state0.rgb}, 0.15)`;
    fogCtx.lineWidth = 6;
    fogCtx.filter = 'blur(8px)';
    fogCtx.stroke();
    fogCtx.filter = 'none';

    fogCtx.beginPath();
    fogCtx.ellipse(centerX - radiusX * 0.55, centerY, radiusX * 0.38, radiusY * 0.65, 0, 0, Math.PI * 2);
    fogCtx.fillStyle = `rgba(${state0.rgb}, 0.12)`;
    fogCtx.filter = 'blur(10px)';
    fogCtx.fill();
    fogCtx.filter = 'none';
  }

  fogCtx.restore();
}

function drawNeuraScene(time) {
  if (!previousTime) previousTime = time;
  const delta = Math.min(time - previousTime, 48);
  previousTime = time;
  transition += (targetTransition - transition) * Math.min(delta * .008, .12);

  drawBrain(time);
  fiberCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  strands.forEach((strand) => drawStrand(strand, time));
  drawConstrictionLayer(time);
  drawFogLayer(time);

  // Outer neural field perimeter ring
  fiberCtx.save();
  fiberCtx.translate(canvasWidth / 2, canvasHeight / 2);
  fiberCtx.beginPath();
  fiberCtx.ellipse(0, 0, canvasWidth * .42, canvasHeight * .40, -.06, 0, Math.PI * 2);
  fiberCtx.strokeStyle = `rgba(${activeState.rgb}, ${.12 + transition * .23})`;
  fiberCtx.lineWidth = 1.1 + transition * .8;
  fiberCtx.shadowBlur = 17;
  fiberCtx.shadowColor = activeState.color;
  fiberCtx.stroke();
  fiberCtx.restore();

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

function checkDailyRollover() {
  const today = getLocalDateString();
  const savedDate = localStorage.getItem('nudge_brain_date');
  if (savedDate !== today) {
    initBrainConstrictionState();
    updateMetricDashboard();
  }
}

/* ========================================================
   INITIALIZATION & BOOT ROUTING
======================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem('120reset_returning_user', 'true');

  renderPresetIntercepts();
  renderCustomIntercepts();
  startBackgroundInterceptMonitor();
  await checkStripeRedirectStatus();
  initBrainConstrictionState();
  initNeuraBrainDOM();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkDailyRollover();
    }
  });
  window.addEventListener('focus', checkDailyRollover);

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('paywall-modal')) {
      e.target.classList.remove('active');
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref') || urlParams.get('promo');
  if (refParam) {
    localStorage.setItem('nudge_saved_ref', refParam.trim().toUpperCase());
  }

  // Pre-select friction passed via URL
  const frictionParam = urlParams.get('friction');
  if (frictionParam && ['mindless_scrolling', 'task_paralysis', 'low_lethargy'].includes(frictionParam)) {
    activeSelectedFrictions.add(frictionParam);
    const count = activeSelectedFrictions.size;
    brainConstrictionRatio = count === 1 ? 0.33 : (count === 2 ? 0.66 : 1.0);
    const today = getLocalDateString();
    localStorage.setItem('nudge_brain_date', today);
    localStorage.setItem('nudge_brain_constriction', brainConstrictionRatio.toFixed(2));
    localStorage.setItem('nudge_selected_frictions', JSON.stringify(Array.from(activeSelectedFrictions)));
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

        if (data.profile.last_click_date === localDate) {
          const cloudClicks = parseInt(data.profile.daily_clicks, 10) || 0;
          localStorage.setItem('nudge_click_count', cloudClicks.toString());
          localStorage.setItem('nudge_click_date', localDate);
        }
      }
    }
  } catch (e) {
    if (!currentUserProfile) {
      currentUserProfile = { email: savedEmail, premium_user: true, pass_expires_at: null };
    }
  }

  startPassTicker();
  updateMetricDashboard();

  // Bypasses login / OTP (screen-welcome) and enters Screen 1 directly
  const screen1Id = document.getElementById('screen-onboarding-1') 
    ? 'screen-onboarding-1' 
    : (document.getElementById('screen-1') ? 'screen-1' : 'screen-onboarding-2');
  
  switchScreen(screen1Id, false);
});

// Screen Navigators (Bypass authentication and move directly to Brain Canvas)
function handleWelcomeContinue() {
  switchScreen('screen-onboarding-2', true);
}

function handleOnboarding1Continue() {
  switchScreen('screen-onboarding-2', true);
}

function handleAuthAction() {
  switchScreen('screen-onboarding-2', true);
}

/* ========================================================
   FRICTION SELECTION & FOG RETENTION LOGIC
======================================================== */
function initBrainConstrictionState() {
  const today = getLocalDateString();
  const savedDate = localStorage.getItem('nudge_brain_date');

  // Next-day local rollover: resets visibility to 100%
  if (savedDate !== today) {
    localStorage.setItem('nudge_brain_date', today);
    localStorage.setItem('nudge_brain_constriction', '0.0');
    localStorage.setItem('nudge_tasks_credit', '0');
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
  const { displayVisibility, subtitle } = getVisibilityMetrics();
  const label = `${displayVisibility}% Visibility • ${subtitle}`;

  const textS2 = document.getElementById('brain-status-s2');
  const textS3 = document.getElementById('brain-status-s3');

  if (textS2) textS2.innerText = label;
  if (textS3) textS3.innerText = label;
}

function confirmFrictionsAndOpenDashboard() {
  switchScreen('screen-dashboard', true);
}

/* ========================================================
   TASK EXECUTION & PROGRESSION (OVERWHELM 4-STEP SYSTEM)
======================================================== */
function triggerVictoryPhase(minutesEarned) {
  const isOverwhelm = currentActiveTask && currentActiveTask.deck === 'overwhelm';
  const overwhelmActions = document.getElementById('overwhelm-victory-actions');
  const standardActions = document.getElementById('standard-victory-actions');
  const btnOverwhelmNext = document.getElementById('btn-overwhelm-next');
  const btnOverwhelmReset = document.getElementById('btn-overwhelm-reset');
  const victoryTitle = document.getElementById('victory-title-text');
  const victoryPoints = document.getElementById('victory-points-reclaimed-badge');
  const noticeEl = document.getElementById('victory-unwind-notice');

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
        noticeEl.innerHTML = `✨ Step ${overwhelmCurrentStep} cleared! Complete all 4 moves to claim the full 4x protocol stack.`;
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

      totalWinsCount += 1;
      totalFocusReclaimed += 8.0;
      incrementTasksCompletedCredit(2);
      localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
      localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

      const { displayVisibility, rawVisibility } = getVisibilityMetrics();
      if (noticeEl) {
        if (rawVisibility >= 100) {
          noticeEl.innerHTML = "🌟 <b>100% UNLOCKED!</b> Brain fog dissolved. Signal fully restored.";
          noticeEl.style.color = "var(--accent-safe)";
        } else {
          noticeEl.innerHTML = `✨ Full 4x stack cleared! Brain visibility increased to ${displayVisibility}%.`;
          noticeEl.style.color = "var(--accent-safe)";
        }
      }
    }
  } else {
    if (overwhelmActions) overwhelmActions.style.display = 'none';
    if (standardActions) standardActions.style.display = 'flex';
    if (victoryTitle) victoryTitle.innerText = "Impact Calibrated.";
    if (victoryPoints) victoryPoints.innerText = "+120s Focus Reclaimed";

    totalWinsCount += 1;
    totalFocusReclaimed += minutesEarned;
    incrementTasksCompletedCredit(1);
    localStorage.setItem('nudge_total_wins', totalWinsCount.toString());
    localStorage.setItem('nudge_focus_reclaimed', totalFocusReclaimed.toString());

    const { displayVisibility, rawVisibility } = getVisibilityMetrics();
    if (noticeEl) {
      if (rawVisibility >= 100) {
        noticeEl.innerHTML = "🌟 <b>100% UNLOCKED!</b> Brain fog dissolved. Signal fully restored.";
        noticeEl.style.color = "var(--accent-safe)";
      } else {
        noticeEl.innerHTML = `✨ Signal clearing! Brain visibility increased to ${displayVisibility}%.`;
        noticeEl.style.color = "var(--accent-gold)";
      }
    }
  }

  const today = getLocalDateString();
  localStorage.setItem('nudge_brain_date', today);
  syncNeuraStates();
  updateBrainStatusText();

  const validationCopyEl = document.getElementById('victory-validation-copy');
  if (validationCopyEl) {
    const rawAffirmation = (currentActiveTask && currentActiveTask.affirmation)
      ? currentActiveTask.affirmation
      : "The freeze is broken. Action clears anxiety.";
    validationCopyEl.innerHTML = formatSpacedSentences(rawAffirmation);
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

/* ========================================================
   MODAL CONTROLLERS & DOCK HANDLERS
======================================================== */
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
      if (currentUserProfile && (currentUserProfile.premium_user === true || currentUserProfile.premium_user === 'true') && !currentUserProfile.pass_expires_at) {
        passCard.innerHTML = `<span style="color:var(--accent-safe); font-weight:800;">✅ FULL UNLIMITED ACCESS</span><br><span style="color:var(--text-muted);">Permanent unrestricted daily resets.</span>`;
      } else if (remainingSecs > 0) {
        const hours = Math.floor(remainingSecs / 3600);
        const mins = Math.floor((remainingSecs % 3600) / 60);
        passCard.innerHTML = `<span style="color:var(--accent-gold); font-weight:800;">⚡ 48-HOUR PASS ACTIVE</span><br><span style="color:var(--text-muted);">⏱️ <b>${hours}h ${mins}m</b> remaining</span>`;
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
    localStorage.removeItem('nudge_total_wins');
    localStorage.removeItem('nudge_focus_reclaimed');
    localStorage.removeItem('nudge_click_count');
    localStorage.removeItem('nudge_brain_constriction');
    localStorage.removeItem('nudge_tasks_credit');
    localStorage.removeItem('nudge_selected_frictions');
    localStorage.removeItem('120reset_returning_user');
    totalWinsCount = 0;
    totalFocusReclaimed = 0.0;
    brainConstrictionRatio = 0.0;
    activeSelectedFrictions.clear();
    syncNeuraStates();
    syncFrictionChipsUI();
    updateBrainStatusText();
    closeModal('profile-drawer-modal');
    window.location.href = '/';
  }
}

async function shareReferralLink() {
  const refCode = currentUserProfile?.referral_code || '';
  const shareUrl = refCode ? `https://120reset.vercel.app/?ref=${encodeURIComponent(refCode)}` : 'https://120reset.vercel.app';
  const shareText = 'A quick 2-minute reset for when you hit a mental wall today:';

  if (navigator.share) {
    try {
      await navigator.share({
        title: '120Reset — Fast Relief for Mental Friction',
        text: shareText,
        url: shareUrl
      });
    } catch (e) {}
  } else {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert("📋 Invite link copied to clipboard!");
    } catch (err) {
      prompt("Copy your invite link:", shareUrl);
    }
  }
}

function isUserPremiumOrPass() {
  if (!currentUserProfile) return true;
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
  const refCountEl = document.getElementById('referral-completed-count');
  if (refCodeEl && currentUserProfile?.referral_code) {
    refCodeEl.innerText = currentUserProfile.referral_code;
  }
  if (refCountEl) {
    const count = currentUserProfile?.total_referrals_completed || 0;
    refCountEl.innerText = `${count} Friend${count === 1 ? '' : 's'} Helped`;
  }
}

function updateMetricDashboard() {
  updatePassCountdown();
}

/* ========================================================
   SCREEN SWITCHER (SAFELY REPARENTING STAGE)
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

    if (screenId === 'screen-onboarding-2' || screenId === 'screen-dashboard') {
      const targetContainer = document.getElementById(screenId === 'screen-onboarding-2' ? 'brain-viewport-s2' : 'brain-viewport-s3');
      if (targetContainer && stageElement) {
        if (stageElement.parentElement !== targetContainer) {
          targetContainer.appendChild(stageElement);
        }
        resizeNeuraCanvas();
      }
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

/* ========================================================
   TASK FETCHING & EXECUTION (FAULT TOLERANT)
======================================================== */
async function executeTurnaroundSpin() {
  const hasAccess = isUserPremiumOrPass();
  const dailyClicks = getDailyClicksCount();

  if (!hasAccess && dailyClicks >= 4) {
    alert("🔒 Daily Limit Reached (4/4 Free Resets Used Today)!\n\nInvite 1 friend for a free 48h pass or unlock the 2-Day Pass ($0.99).");
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
  const frictionKey = Array.from(activeSelectedFrictions)[0] || 'mindless_scrolling';
  const userEmail = localStorage.getItem('nudge_user_email') || 'beta_tester@120reset.app';

  const seenKey = `nudge_seen_${categoryKey}`;
  const lastFocusKey = `nudge_last_focus_${categoryKey}`;
  const seenIndices = JSON.parse(localStorage.getItem(seenKey) || '[]');
  const lastFocus = localStorage.getItem(lastFocusKey) || '';

  try {
    let endpoint = `/api/get-task?category=${encodeURIComponent(categoryKey)}&friction=${encodeURIComponent(frictionKey)}&email=${encodeURIComponent(userEmail)}&seen=${encodeURIComponent(seenIndices.join(','))}&lastFocusArea=${encodeURIComponent(lastFocus)}`;
    if (categoryKey === 'overwhelm') {
      endpoint += `&step=${overwhelmCurrentStep}`;
    }

    let taskData = null;

    try {
      const response = await fetch(endpoint);
      const text = await response.text();
      
      if (response.ok && text.startsWith('{')) {
        taskData = JSON.parse(text);
      }
    } catch (netErr) {
      console.warn("Network endpoint fallback:", netErr);
    }

    if (!taskData || !taskData.task) {
      const deckFallbacks = CLIENT_FALLBACK_TASKS[categoryKey] || CLIENT_FALLBACK_TASKS.charisma;
      let matchedTask;
      if (categoryKey === 'overwhelm') {
        matchedTask = deckFallbacks.find(t => t.step === overwhelmCurrentStep) || deckFallbacks[0];
      } else {
        matchedTask = deckFallbacks[Math.floor(Math.random() * deckFallbacks.length)];
      }

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
    if (taskData.task.focusArea) {
      localStorage.setItem(lastFocusKey, taskData.task.focusArea);
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
   LOCAL DATE & QUOTA ENGINE
======================================================== */
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
    console.warn("Silent sync fallback:", e);
  }
}

/* ========================================================
   PRESET & CUSTOM INTERCEPTS
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
      <div class="lifeline-item" style="margin-bottom: 6px;">
        <div>
          <div style="font-weight: 800; font-size: 13.5px; color: #FFF;">${formatted}</div>
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
    closeModal('intercepts-drawer-modal');
    openPaywallModal();
  } else {
    const modal = document.getElementById('custom-intercept-modal');
    if (modal) modal.classList.add('active');
  }
}

function closeCustomInterceptModal() {
  closeModal('custom-intercept-modal');
}

function saveCustomIntercept() {
  const timeInput = document.getElementById('custom-time-input').value;
  const frictionInput = document.getElementById('custom-friction-input').value || 'Mindless Scrolling';
  const deckInput = document.getElementById('custom-deck-input').value || 'The Anti-Overwhelm Deck';

  if (!timeInput) {
    alert("Please select a valid time.");
    return;
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
      <div class="lifeline-item" style="border-color: #F97316; margin-bottom: 6px;">
        <div>
          <div style="font-weight: 800; font-size: 13.5px; color: #F97316;">${formattedTime}</div>
          <div style="font-size: 11px; color: #71717A; font-weight: 600;">Custom: ${c.friction}</div>
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

function startBackgroundInterceptMonitor() {
  setInterval(() => {
    try {
      checkDailyRollover();

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;
      const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
      const dateStr = now.toDateString();

      const presets = getStoredPresetIntercepts();
      presets.forEach(p => {
        if (!p.enabled || !p.time) return;
        const [pHour, pMin] = p.time.split(':').map(Number);
        const targetTotalMin = pHour * 60 + pMin;
        const timeDiff = currentTotalMin - targetTotalMin;
        const isTimeMatch = (p.time === currentTimeStr) || (timeDiff >= 0 && timeDiff <= 5);
        const triggerTag = `${dateStr}_${p.id || p.time}`;

        if (isTimeMatch && p.lastTriggerTag !== triggerTag) {
          p.lastTriggerTag = triggerTag;
          localStorage.setItem('nudge_preset_intercepts', JSON.stringify(presets));

          const activeScreen = document.querySelector('.screen.active');
          if (activeScreen && activeScreen.id !== 'screen-countdown') {
            selectedCategory = mapDeckNameToCategory(p.deck);
            updateStartScreenHeading(selectedCategory);
            const chime = document.getElementById('victory-chime');
            if (chime) { chime.currentTime = 0; chime.play().catch(() => {}); }
            switchScreen('screen-trigger', true);
          }
        }
      });
    } catch (err) {}
  }, 10000);
}

/* ========================================================
   PAYWALL & STRIPE GATEWAY
======================================================== */
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
    else throw new Error(data.error || "Unable to initialize Stripe session.");
  } catch (err) {
    alert(`Checkout Notice: ${err.message}`);
    if (paywallBtn) { paywallBtn.innerText = "Unlock Access Now"; paywallBtn.disabled = false; }
  }
}

async function checkStripeRedirectStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'success') {
    alert("🎉 Payment confirmed! Synchronizing access with Supabase...");
    window.history.replaceState({}, document.title, window.location.pathname);
    await syncLifetimeProgressToCloud();
  }
}
