(function(global) {
  // Check if WebGL could be an alternative (optional check, currently sticking to Canvas2D)
  
  const NEURA_STATES = [
    { id: 'mindless_scrolling', color: '#ff4f7a', rgb: '255, 79, 122' },
    { id: 'task_paralysis', color: '#4facff', rgb: '79, 172, 255' },
    { id: 'low_lethargy', color: '#ffd54f', rgb: '255, 213, 79' }
  ];

  let brainCanvas, brainCtx;
  let fiberCanvas, fiberCtx;
  let fogCanvas, fogCtx;
  let stageElement;

  let selectedStates = [];
  let activeState = NEURA_STATES[0];
  let transition = 1;
  let targetTransition = 1;
  let previousTime = 0;
  let canvasWidth = 380;
  let canvasHeight = 260;
  let strands = [];
  let animFrameId = null;

  function injectStyles() {
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
      .orbit::after {
        right: 5%;
        bottom: 18%;
        background: var(--brain-accent);
        box-shadow: 0 0 20px 5px rgba(var(--brain-accent-rgb), .7);
      }
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
        z-index: 1;
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

  function seeded(index, salt = 1) {
    const x = Math.sin(index * 9283.37 + salt * 17.11) * 43758.5453;
    return x - Math.floor(x);
  }

  function createStrands() {
    strands = Array.from({ length: 48 }, (_, index) => {
      const lane = index / 47;
      return {
        lane,
        x: 0.15 + seeded(index, 1) * 0.70,
        y: 0.18 + seeded(index, 2) * 0.64,
        width: 0.48 + seeded(index, 3) * 0.42,
        height: 0.28 + seeded(index, 4) * 0.35,
        tilt: (seeded(index, 5) - 0.5) * 0.95,
        speed: 0.00045 + seeded(index, 6) * 0.00065,
        phase: seeded(index, 7) * Math.PI * 2,
        index,
        alpha: 0.18 + seeded(index, 8) * 0.30
      };
    });
  }

  function resize() {
    if (!brainCanvas || !fiberCanvas || !fogCanvas || !stageElement) return;
    
    const rect = stageElement.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    [brainCanvas, fiberCanvas, fogCanvas].forEach(c => {
      c.width = canvasWidth * dpr;
      c.height = canvasHeight * dpr;
    });

    brainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fiberCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fogCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawScene(performance.now());
  }

  function roundedLobePath(ctx, x, y, rx, ry, rotation = 0, wobble = 0) {
    ctx.beginPath();
    for (let i = 0; i <= 36; i += 1) {
      const theta = (i / 36) * Math.PI * 2;
      const noise = Math.sin(theta * 6 + rotation * 8) * (rx * 0.04) +
                    Math.cos(theta * 9 - rotation * 5) * (ry * 0.03);
      const radX = rx + noise + Math.sin(theta * 2 + wobble) * (rx * 0.05);
      const radY = ry + noise + Math.cos(theta * 3 - wobble) * (ry * 0.05);
      
      const px = x + Math.cos(theta + rotation) * radX;
      const py = y + Math.sin(theta + rotation) * radY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawBrain(time) {
    const w = canvasWidth;
    const h = canvasHeight;
    brainCtx.clearRect(0, 0, w, h);

    const breath = Math.sin(time * 0.00135) * 2.2;
    const cx = w * 0.5;
    const cy = h * 0.47 + breath;

    const minDim = Math.min(w, h);
    const rx = minDim * 0.38;
    const ry = minDim * 0.30;
    const leftCx = cx - rx * 0.27;
    const rightCx = cx + rx * 0.27;

    const count = selectedStates.length;
    const tissueAlpha = count === 0 ? 1.0 : (count === 1 ? 0.74 : (count === 2 ? 0.48 : 0.22));

    const aura = brainCtx.createRadialGradient(cx, cy, ry * 0.08, cx, cy, ry * 1.45);
    aura.addColorStop(0, 'rgba(86, 205, 255, .25)');
    aura.addColorStop(0.45, 'rgba(48, 117, 210, .13)');
    aura.addColorStop(1, 'rgba(4, 15, 27, 0)');
    brainCtx.fillStyle = aura;
    brainCtx.beginPath();
    brainCtx.ellipse(cx, cy, rx * 1.35, ry * 1.25, -0.04, 0, Math.PI * 2);
    brainCtx.fill();

    brainCtx.save();
    brainCtx.globalAlpha = tissueAlpha;

    // Left hemisphere
    roundedLobePath(brainCtx, leftCx, cy, rx * 0.66, ry, time * 0.0007, breath / 100);
    const leftFill = brainCtx.createRadialGradient(leftCx - rx * 0.18, cy - ry * 0.4, 0, leftCx, cy, rx * 0.95);
    leftFill.addColorStop(0, 'rgba(255, 220, 177, .94)');
    leftFill.addColorStop(0.22, 'rgba(151, 214, 255, .9)');
    leftFill.addColorStop(0.58, 'rgba(64, 106, 210, .82)');
    leftFill.addColorStop(1, 'rgba(11, 33, 83, .7)');
    brainCtx.fillStyle = leftFill;
    brainCtx.fill();

    // Right hemisphere
    roundedLobePath(brainCtx, rightCx, cy, rx * 0.66, ry, time * 0.0007 + 0.4, breath / 100);
    const rightFill = brainCtx.createRadialGradient(rightCx + rx * 0.12, cy - ry * 0.38, 0, rightCx, cy, rx * 0.98);
    rightFill.addColorStop(0, 'rgba(255, 235, 154, .98)');
    rightFill.addColorStop(0.25, 'rgba(255, 179, 97, .92)');
    rightFill.addColorStop(0.6, 'rgba(129, 78, 193, .8)');
    rightFill.addColorStop(1, 'rgba(19, 34, 104, .72)');
    brainCtx.globalAlpha = tissueAlpha * 0.9;
    brainCtx.fillStyle = rightFill;
    brainCtx.fill();
    brainCtx.globalAlpha = tissueAlpha;

    // Living cords & neurovascular vessels
    brainCtx.save();
    brainCtx.beginPath();
    brainCtx.ellipse(leftCx, cy, rx * 0.66, ry, 0, 0, Math.PI * 2);
    brainCtx.ellipse(rightCx, cy, rx * 0.66, ry, 0, 0, Math.PI * 2);
    brainCtx.clip();
    const cordColors = ['#ffd37d', '#ff9f75', '#79ddff', '#b699ff', '#fff2c4'];
    for (let i = 0; i < 42; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const row = Math.floor(i / 2);
      const startX = cx + side * (rx * (0.58 - (row % 5) * 0.05));
      const startY = cy - ry * 0.82 + (row / 20) * ry * 1.65;
      const endX = cx - side * (rx * (0.2 + (row % 4) * 0.08));
      const bend = side * rx * (0.12 + (row % 3) * 0.05);
      brainCtx.beginPath();
      brainCtx.moveTo(startX, startY);
      brainCtx.bezierCurveTo(startX - bend, startY - ry * 0.22, endX + bend, startY + ry * 0.18, endX, startY + ry * 0.38);
      brainCtx.bezierCurveTo(endX - bend * 0.4, startY + ry * 0.64, endX + bend * 0.35, startY + ry * 0.88, cx + side * rx * 0.06, startY + ry * 1.1);
      brainCtx.strokeStyle = cordColors[i % cordColors.length];
      brainCtx.globalAlpha = (0.3 + (i % 4) * 0.1) * tissueAlpha;
      brainCtx.lineWidth = 1.3 + (i % 5 === 0 ? 2.4 : 0.2);
      brainCtx.lineCap = 'round';
      brainCtx.stroke();
    }
    for (let i = 0; i < 12; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = cx + side * rx * (0.05 + (i % 6) * 0.06);
      brainCtx.beginPath();
      brainCtx.moveTo(x, cy - ry * 0.9);
      brainCtx.bezierCurveTo(x + side * rx * 0.18, cy - ry * 0.45, x - side * rx * 0.16, cy - ry * 0.05, x + side * rx * 0.12, cy + ry * 0.42);
      brainCtx.bezierCurveTo(x - side * rx * 0.08, cy + ry * 0.62, x + side * rx * 0.1, cy + ry * 0.76, x, cy + ry * 0.95);
      brainCtx.strokeStyle = i % 3 === 0 ? '#fff4be' : '#69d9ff';
      brainCtx.globalAlpha = 0.46 * tissueAlpha;
      brainCtx.lineWidth = 1.8;
      brainCtx.stroke();
    }
    brainCtx.restore();

    // Sagittal fissure
    brainCtx.beginPath();
    brainCtx.moveTo(cx - rx * 0.03, cy - ry * 0.82);
    brainCtx.bezierCurveTo(cx + rx * 0.12, cy - ry * 0.45, cx - rx * 0.12, cy - ry * 0.1, cx + rx * 0.02, cy + ry * 0.2);
    brainCtx.bezierCurveTo(cx + rx * 0.12, cy + ry * 0.48, cx - rx * 0.08, cy + ry * 0.72, cx - rx * 0.02, cy + ry * 0.92);
    brainCtx.strokeStyle = 'rgba(14, 28, 74, .62)';
    brainCtx.lineWidth = 5;
    brainCtx.stroke();
    brainCtx.strokeStyle = 'rgba(255, 221, 129, .7)';
    brainCtx.lineWidth = 1.2;
    brainCtx.stroke();

    // Stem and cerebellum
    const stem = brainCtx.createLinearGradient(cx, cy + ry * 0.6, cx, h);
    stem.addColorStop(0, '#ffd08a');
    stem.addColorStop(0.35, '#db8fb2');
    stem.addColorStop(0.75, '#6758bd');
    stem.addColorStop(1, '#162f83');
    brainCtx.fillStyle = stem;
    brainCtx.beginPath();
    brainCtx.moveTo(cx - rx * 0.1, cy + ry * 0.58);
    brainCtx.bezierCurveTo(cx - rx * 0.15, cy + ry * 0.88, cx - rx * 0.05, cy + ry * 1.1, cx - rx * 0.025, h * 0.98);
    brainCtx.lineTo(cx + rx * 0.045, h * 0.98);
    brainCtx.bezierCurveTo(cx + rx * 0.1, cy + ry * 0.95, cx + rx * 0.18, cy + ry * 0.74, cx + rx * 0.12, cy + ry * 0.58);
    brainCtx.closePath();
    brainCtx.fill();

    roundedLobePath(brainCtx, cx + rx * 0.29, cy + ry * 0.65, rx * 0.27, ry * 0.2, time * 0.0008);
    const cerebellum = brainCtx.createRadialGradient(cx + rx * 0.2, cy + ry * 0.56, 0, cx + rx * 0.29, cy + ry * 0.65, rx * 0.3);
    cerebellum.addColorStop(0, '#ffe2a4');
    cerebellum.addColorStop(0.45, '#f39a95');
    cerebellum.addColorStop(1, '#8057bd');
    brainCtx.fillStyle = cerebellum;
    brainCtx.fill();

    brainCtx.restore();

    // Tissue fog tint (Grey out segments of the brain based on friction)
    if (selectedStates.length > 0) {
      brainCtx.save();
      brainCtx.beginPath();
      brainCtx.ellipse(leftCx, cy, rx * 0.66, ry, 0, 0, Math.PI * 2);
      brainCtx.ellipse(rightCx, cy, rx * 0.66, ry, 0, 0, Math.PI * 2);
      brainCtx.ellipse(cx + rx * 0.29, cy + ry * 0.65, rx * 0.34, ry * 0.25, 0, 0, Math.PI * 2);
      brainCtx.clip();

      if (count >= 3) {
        const fullFog = brainCtx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.25);
        fullFog.addColorStop(0, 'rgba(25, 35, 55, 0.45)');
        fullFog.addColorStop(0.7, 'rgba(25, 35, 55, 0.60)');
        fullFog.addColorStop(1, 'rgba(25, 35, 55, 0.75)');
        brainCtx.fillStyle = fullFog;
        brainCtx.fillRect(cx - rx * 1.2, cy - ry * 1.2, rx * 2.4, ry * 2.4);
      } else if (count === 2) {
        const leftX = cx - rx * 1.25;
        const rightX = cx + rx * 0.52;
        const baseGrad = brainCtx.createLinearGradient(leftX, 0, rightX, 0);
        baseGrad.addColorStop(0.0, 'rgba(25, 35, 55, 0.75)');
        baseGrad.addColorStop(0.70, 'rgba(25, 35, 55, 0.75)');
        baseGrad.addColorStop(1.0, 'rgba(25, 35, 55, 0.0)');
        brainCtx.fillStyle = baseGrad;
        brainCtx.fillRect(leftX, 0, rightX - leftX, h);
      } else if (count === 1) {
        const leftX = cx - rx * 1.25;
        const rightX = cx - rx * 0.25;
        const grad = brainCtx.createLinearGradient(cx - rx * 0.9, 0, rightX + rx * 0.10, 0);
        grad.addColorStop(0.0, 'rgba(25, 35, 55, 0.75)');
        grad.addColorStop(0.70, 'rgba(25, 35, 55, 0.75)');
        grad.addColorStop(1.0, 'rgba(25, 35, 55, 0)');
        brainCtx.fillStyle = grad;
        brainCtx.fillRect(leftX, 0, rightX - leftX, h);
      }
      brainCtx.restore();
    }
  }

  function drawStrand(strand, time) {
    const centerX = canvasWidth * strand.x;
    const centerY = canvasHeight * strand.y;
    const radiusX = canvasWidth * strand.width * 0.48;
    const radiusY = canvasHeight * strand.height * 0.72;
    const wave = Math.sin(time * strand.speed + strand.phase);

    const coverage = selectedStates.length === 0 ? 0 : (selectedStates.length === 1 ? 0.33 : (selectedStates.length === 2 ? 0.66 : 1.0));
    const isActive = selectedStates.length > 0 && strand.index < Math.ceil(strands.length * coverage);
    const strandState = isActive ? selectedStates[strand.index % selectedStates.length] : null;
    const tension = isActive ? 0.74 + transition * 0.26 : 0.25 + transition * 0.1;
    const constriction = isActive ? 1 - tension * 0.075 + wave * 0.013 : 1 + wave * 0.025;
    const lineWidth = isActive ? 1.25 + transition * 0.9 : 0.75;
    const alpha = isActive ? (0.18 + transition * 0.52) : strand.alpha * 0.5;
    const rgb = isActive ? strandState.rgb : '158, 234, 255';

    fiberCtx.save();
    fiberCtx.translate(centerX, centerY);
    fiberCtx.rotate(strand.tilt + wave * 0.03);
    fiberCtx.scale(constriction, 1 - (constriction - 1) * 0.32);
    fiberCtx.beginPath();
    for (let i = 0; i <= 72; i += 1) {
      const t = i / 72;
      const theta = Math.PI * 2 * t;
      const wobble = Math.sin(theta * 3 + strand.phase + time * strand.speed * 1.3) * (isActive ? 2.5 : 1.3);
      const x = Math.cos(theta) * (radiusX + wobble) + Math.sin(theta * 2 + strand.phase) * 6;
      const y = Math.sin(theta) * (radiusY + wobble * 0.55) + Math.cos(theta * 3 + strand.phase) * 4;
      if (i === 0) fiberCtx.moveTo(x, y); else fiberCtx.lineTo(x, y);
    }
    fiberCtx.closePath();
    
    const blurSpread = isActive ? 9 : 4;
    fiberCtx.strokeStyle = `rgba(${rgb}, ${alpha * 0.25})`;
    fiberCtx.lineWidth = lineWidth + blurSpread;
    fiberCtx.stroke();
    
    fiberCtx.strokeStyle = `rgba(${rgb}, ${alpha})`;
    fiberCtx.lineWidth = lineWidth;
    fiberCtx.stroke();

    if (isActive && (strand.lane * 41) % 2 < 1) {
      const nodeTheta = (time * strand.speed * 2 + strand.phase) % (Math.PI * 2);
      const nodeX = Math.cos(nodeTheta) * radiusX;
      const nodeY = Math.sin(nodeTheta) * radiusY;
      
      const nAlpha = 0.65 + transition * 0.3;
      const nRadius = 1.4 + transition * 1.2;
      
      fiberCtx.fillStyle = `rgba(${rgb}, ${nAlpha * 0.3})`;
      fiberCtx.beginPath();
      fiberCtx.arc(nodeX, nodeY, nRadius + 5, 0, Math.PI * 2);
      fiberCtx.fill();
      
      fiberCtx.beginPath();
      fiberCtx.arc(nodeX, nodeY, nRadius, 0, Math.PI * 2);
      fiberCtx.fillStyle = `rgba(255, 250, 215, ${nAlpha})`;
      fiberCtx.fill();
    }
    fiberCtx.restore();
  }

  function drawConstrictionLayer(time) {
    if (selectedStates.length === 0) return;
    const w = canvasWidth;
    const h = canvasHeight;
    const minDim = Math.min(w, h);
    const centerX = w * 0.5;
    const centerY = h * 0.47;
    const radiusX = minDim * 0.39;
    const radiusY = minDim * 0.29;

    const coverage = selectedStates.length === 1 ? 0.33 : (selectedStates.length === 2 ? 0.66 : 1.0);

    fiberCtx.save();
    fiberCtx.beginPath();
    fiberCtx.ellipse(centerX - radiusX * 0.27, centerY, radiusX * 0.63, radiusY, 0, 0, Math.PI * 2);
    fiberCtx.ellipse(centerX + radiusX * 0.27, centerY, radiusX * 0.63, radiusY, 0, 0, Math.PI * 2);
    fiberCtx.clip();

    const bandsPerState = Math.ceil(12 * coverage);
    selectedStates.forEach((state, stateIndex) => {
      for (let i = 0; i < bandsPerState; i += 1) {
        const lane = (i + stateIndex * 0.43) / Math.max(bandsPerState, 1);
        const y = centerY - radiusY * 0.78 + lane * radiusY * 1.58;
        const squeeze = 1 - Math.sin(time * 0.001 + i + stateIndex) * 0.035 - coverage * 0.035;
        const span = radiusX * (0.62 + Math.sin(i * 1.7) * 0.035) * squeeze;
        
        fiberCtx.beginPath();
        fiberCtx.moveTo(centerX - span, y);
        fiberCtx.quadraticCurveTo(centerX, y + radiusY * 0.15 * squeeze, centerX + span, y);
        
        const bAlpha = 0.18 * transition * (1 - Math.abs(lane - 0.5) * 1.5);
        if (bAlpha <= 0) continue;

        fiberCtx.strokeStyle = `rgba(${state.rgb}, ${bAlpha * 0.3})`;
        fiberCtx.lineWidth = 14;
        fiberCtx.stroke();
        
        fiberCtx.strokeStyle = `rgba(${state.rgb}, ${bAlpha})`;
        fiberCtx.lineWidth = 1.2 + transition;
        fiberCtx.stroke();
      }
    });
    fiberCtx.restore();
  }

  function drawFogLayer(time) {
    fogCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (selectedStates.length === 0) return;

    const w = canvasWidth;
    const h = canvasHeight;
    const minDim = Math.min(w, h);
    const centerX = w * 0.5;
    const centerY = h * 0.47;
    const radiusX = minDim * 0.38;
    const radiusY = minDim * 0.30;

    fogCtx.save();
    fogCtx.beginPath();
    fogCtx.ellipse(centerX - radiusX * 0.27, centerY, radiusX * 0.66, radiusY, 0, 0, Math.PI * 2);
    fogCtx.ellipse(centerX + radiusX * 0.27, centerY, radiusX * 0.66, radiusY, 0, 0, Math.PI * 2);
    fogCtx.ellipse(centerX + radiusX * 0.29, centerY + radiusY * 0.65, radiusX * 0.34, radiusY * 0.25, 0, 0, Math.PI * 2);
    fogCtx.clip();

    const count = selectedStates.length;
    
    // Use a murky, desaturated blue-grey for actual "fog" instead of neon colors
    const fogColorSolid = 'rgba(130, 145, 165, 0.15)';
    const fogColorStroke = 'rgba(130, 145, 165, 0.2)';

    if (count >= 3) {
      const softGlow = fogCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusX * 1.3);
      softGlow.addColorStop(0, 'rgba(30, 40, 55, 0.35)');
      softGlow.addColorStop(0.65, 'rgba(30, 40, 55, 0.55)');
      softGlow.addColorStop(1, 'rgba(30, 40, 55, 0.75)');
      fogCtx.fillStyle = softGlow;
      fogCtx.fillRect(centerX - radiusX * 1.2, centerY - radiusY * 1.2, radiusX * 2.4, radiusY * 2.4);

      for (let i = 0; i < 9; i += 1) {
        fogCtx.beginPath();
        fogCtx.ellipse(
          centerX + Math.sin(time * 0.0006 + i * 1.2) * radiusX * 0.48,
          centerY + Math.cos(time * 0.0008 + i * 1.4) * radiusY * 0.55,
          radiusX * (0.18 + (i % 3) * 0.04),
          radiusY * (0.10 + (i % 2) * 0.04),
          i * 0.4,
          0,
          Math.PI * 2
        );
        fogCtx.fillStyle = fogColorSolid;
        fogCtx.fill();
      }

    } else if (count === 2) {
      const leftX = centerX - radiusX * 1.25;
      const rightX = centerX + radiusX * 0.52;

      fogCtx.beginPath();
      fogCtx.moveTo(leftX, centerY - radiusY * 1.2);
      fogCtx.lineTo(rightX, centerY - radiusY * 1.2);
      fogCtx.bezierCurveTo(rightX + radiusX * 0.12, centerY - radiusY * 0.4, rightX - radiusX * 0.08, centerY + radiusY * 0.4, rightX - radiusX * 0.04, centerY + radiusY * 1.2);
      fogCtx.lineTo(leftX, centerY + radiusY * 1.2);
      fogCtx.closePath();

      const baseGrad = fogCtx.createLinearGradient(leftX, 0, rightX, 0);
      baseGrad.addColorStop(0.0, 'rgba(30, 40, 55, 0.55)');
      baseGrad.addColorStop(0.70, 'rgba(30, 40, 55, 0.45)');
      baseGrad.addColorStop(1.0, 'rgba(30, 40, 55, 0.0)');
      fogCtx.fillStyle = baseGrad;
      fogCtx.fill();

      fogCtx.strokeStyle = fogColorStroke;
      fogCtx.lineWidth = 6;
      fogCtx.stroke();

      fogCtx.beginPath();
      fogCtx.ellipse(centerX - radiusX * 0.52, centerY, radiusX * 0.42, radiusY * 0.65, 0, 0, Math.PI * 2);
      fogCtx.fillStyle = fogColorSolid;
      fogCtx.fill();

      fogCtx.beginPath();
      fogCtx.ellipse(centerX + radiusX * 0.15, centerY, radiusX * 0.42, radiusY * 0.65, 0, 0, Math.PI * 2);
      fogCtx.fillStyle = fogColorSolid;
      fogCtx.fill();

    } else if (count === 1) {
      const leftX = centerX - radiusX * 1.25;
      const rightX = centerX - radiusX * 0.25;

      fogCtx.beginPath();
      fogCtx.moveTo(leftX, centerY - radiusY * 1.2);
      fogCtx.lineTo(rightX, centerY - radiusY * 1.2);
      fogCtx.bezierCurveTo(rightX + radiusX * 0.10, centerY - radiusY * 0.4, rightX - radiusX * 0.08, centerY + radiusY * 0.4, rightX, centerY + radiusY * 1.2);
      fogCtx.lineTo(leftX, centerY + radiusY * 1.2);
      fogCtx.closePath();

      const grad = fogCtx.createLinearGradient(centerX - radiusX * 0.9, 0, rightX + radiusX * 0.10, 0);
      grad.addColorStop(0.0, 'rgba(30, 40, 55, 0.48)');
      grad.addColorStop(0.70, 'rgba(30, 40, 55, 0.38)');
      grad.addColorStop(1.0, 'rgba(30, 40, 55, 0)');
      fogCtx.fillStyle = grad;
      fogCtx.fill();

      fogCtx.strokeStyle = fogColorStroke;
      fogCtx.lineWidth = 6;
      fogCtx.stroke();

      fogCtx.beginPath();
      fogCtx.ellipse(centerX - radiusX * 0.55, centerY, radiusX * 0.38, radiusY * 0.65, 0, 0, Math.PI * 2);
      fogCtx.fillStyle = fogColorSolid;
      fogCtx.fill();
    }
    fogCtx.restore();
  }

  function drawScene(time) {
    if (!previousTime) previousTime = time;
    const delta = Math.min(time - previousTime, 48);
    previousTime = time;
    transition += (targetTransition - transition) * Math.min(delta * 0.008, 0.12);

    drawBrain(time);
    fiberCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    strands.forEach((strand) => drawStrand(strand, time));
    drawConstrictionLayer(time);
    drawFogLayer(time);

    fiberCtx.save();
    fiberCtx.translate(canvasWidth / 2, canvasHeight / 2);
    fiberCtx.beginPath();
    fiberCtx.ellipse(0, 0, canvasWidth * 0.42, canvasHeight * 0.40, -0.06, 0, Math.PI * 2);
    
    const ringAlpha = 0.12 + transition * 0.23;
    const ringW = 1.1 + transition * 0.8;
    
    fiberCtx.strokeStyle = `rgba(${activeState.rgb}, ${ringAlpha * 0.35})`;
    fiberCtx.lineWidth = ringW + 10;
    fiberCtx.stroke();
    
    fiberCtx.strokeStyle = `rgba(${activeState.rgb}, ${ringAlpha})`;
    fiberCtx.lineWidth = ringW;
    fiberCtx.stroke();
    fiberCtx.restore();

    animFrameId = requestAnimationFrame(drawScene);
  }

  function unmount() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }
  function mount(containerElement) {
    injectStyles();

    if (!stageElement) {
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

      brainCanvas = stageElement.querySelector('#brainCanvas');
      brainCtx = brainCanvas.getContext('2d');
      fiberCanvas = stageElement.querySelector('#fiberCanvas');
      fiberCtx = fiberCanvas.getContext('2d');
      fogCanvas = stageElement.querySelector('#fogCanvas');
      fogCtx = fogCanvas.getContext('2d');

      createStrands();
      window.addEventListener('resize', resize);
    }

    if (containerElement && stageElement.parentElement !== containerElement) {
      containerElement.appendChild(stageElement);
    }

    resize();
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(drawScene);
    }
  }

  function setFrictions(frictionKeySetOrArray) {
    const keys = Array.from(frictionKeySetOrArray || []);
    selectedStates = [];
    if (keys.includes('mindless_scrolling')) selectedStates.push(NEURA_STATES[0]);
    if (keys.includes('task_paralysis')) selectedStates.push(NEURA_STATES[1]);
    if (keys.includes('low_lethargy')) selectedStates.push(NEURA_STATES[2]);

    activeState = selectedStates[0] || NEURA_STATES[0];
    targetTransition = 0;
    setTimeout(() => { targetTransition = 1; }, 40);

    if (stageElement) {
      stageElement.style.setProperty('--brain-accent', activeState.color);
      stageElement.style.setProperty('--brain-accent-rgb', activeState.rgb);
    }
  }

  // Export globally for app.js or direct scripts
  global.NeuraBrain = {
    mount,
    unmount,
    resize,
    setFrictions,
    getStates: () => NEURA_STATES
  };

  // Backwards-compatible globals for existing app.js calls
  global.initNeuraBrainDOM = function() {
    const s2 = document.getElementById('brain-viewport-s2');
    if (s2) mount(s2);
  };
  global.syncNeuraStates = function() {
    if (global.activeSelectedFrictions) {
      setFrictions(global.activeSelectedFrictions);
    }
  };
  global.resizeNeuraCanvas = resize;
})(window);
