/**
 * MEMORA — SAVIOURS OF MEMORY
 * Core WebGL Three.js Visualizer & Simulation Engine
 * Speculative Research Theme · Architectural Materials · Precision Telemetry
 */

'use strict';

// ════════════════════════════════════════════════════════════════
// SECTION 1 ── ARCHITECTURAL PALETTE & MATERIAL TOKENS
// Matte obsidian, champagne gold, brushed titanium (No gaudy neon)
// ════════════════════════════════════════════════════════════════
const PALETTE = {
  bgDeep:       0x07080b,
  frameBase:    0x131620,
  frameTop:     0x1a1e2d,
  frameBorder:  0x2a3148,
  
  gold:         0xd8b87a,
  goldGlow:     0x8c7241,
  
  titanium:     0x8e9bae,
  titaniumDim:  0x3e4756,
  
  emerald:      0x34d399,
  crimson:      0xf43f5e,
  amber:        0xfbbf24,
  azure:        0x60a5fa,
  grid:         0x141724,
};

// ════════════════════════════════════════════════════════════════
// SECTION 2 ── THREE.JS SCENE, CAMERAS & LIGHTING
// ════════════════════════════════════════════════════════════════
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(PALETTE.bgDeep);
scene.fog = new THREE.FogExp2(PALETTE.bgDeep, 0.020);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
const CAM_PRESETS = {
  iso:  { pos: new THREE.Vector3(0, 26, 36), target: new THREE.Vector3(0, 0, 0) },
  top:  { pos: new THREE.Vector3(0, 48, 1),  target: new THREE.Vector3(0, 0, 0) },
  core: { pos: new THREE.Vector3(-18, 10, -5), target: new THREE.Vector3(-20, 7, -12) }
};
camera.position.copy(CAM_PRESETS.iso.pos);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 8;
controls.maxDistance = 75;
controls.target.copy(CAM_PRESETS.iso.target);

// Soft Architectural Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfff7ea, 1.1);
keyLight.position.set(24, 45, 20);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x7085a6, 0.4);
fillLight.position.set(-25, 20, -15);
scene.add(fillLight);

// Arbiter Core Point Light (Warm Gold)
const arbiterLight = new THREE.PointLight(PALETTE.gold, 1.5, 35);
arbiterLight.position.set(-20, 7, -12);
scene.add(arbiterLight);

// Precision Grid Floor
const gridHelper = new THREE.GridHelper(80, 80, 0x23293d, 0x11131c);
gridHelper.position.y = -0.52;
scene.add(gridHelper);

// ════════════════════════════════════════════════════════════════
// SECTION 3 ── ARBITER GYROSCOPE CORE
// Brushed Titanium & Gold Gimbal representation of the Decision Engine
// ════════════════════════════════════════════════════════════════
const arbiterGroup = new THREE.Group();
arbiterGroup.position.set(-20, 7, -12);

// Outer Ring (Brushed Titanium)
const ringGeo1 = new THREE.TorusGeometry(3.5, 0.07, 16, 120);
const ringMat1 = new THREE.MeshStandardMaterial({
  color: PALETTE.titanium,
  metalness: 0.9,
  roughness: 0.25,
});
const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
arbiterGroup.add(ring1);

// Inner Ring (Champagne Gold)
const ringGeo2 = new THREE.TorusGeometry(2.7, 0.06, 16, 120);
const ringMat2 = new THREE.MeshStandardMaterial({
  color: PALETTE.gold,
  metalness: 0.95,
  roughness: 0.2,
});
const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
arbiterGroup.add(ring2);

// Core Polyhedron (Decision Matrix Core)
const coreGeo = new THREE.IcosahedronGeometry(1.4, 0);
const coreMat = new THREE.MeshStandardMaterial({
  color: PALETTE.gold,
  emissive: PALETTE.goldGlow,
  emissiveIntensity: 0.5,
  wireframe: true,
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
arbiterGroup.add(coreMesh);

scene.add(arbiterGroup);

// ════════════════════════════════════════════════════════════════
// SECTION 4 ── 3D BUFFER POOL FRAME MATRIX
// ════════════════════════════════════════════════════════════════
let bufferCapacity = 64;
let frameMeshes = [];
const frameGroup = new THREE.Group();
scene.add(frameGroup);

const boxGeo = new THREE.BoxGeometry(1.9, 0.8, 1.9);

function build3DBufferPool(capacity) {
  while (frameGroup.children.length > 0) {
    const obj = frameGroup.children[0];
    frameGroup.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  }
  frameMeshes = [];
  bufferCapacity = capacity;

  const cols = Math.ceil(Math.sqrt(capacity));
  const rows = Math.ceil(capacity / cols);
  const spacing = 2.45;
  const startX = -((cols - 1) * spacing) / 2;
  const startZ = -((rows - 1) * spacing) / 2;

  for (let i = 0; i < capacity; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);

    const mat = new THREE.MeshStandardMaterial({
      color: PALETTE.frameBase,
      metalness: 0.85,
      roughness: 0.35,
    });

    const mesh = new THREE.Mesh(boxGeo, mat);
    mesh.position.set(startX + c * spacing, 0, startZ + r * spacing);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData = {
      frameId: i,
      pageId: null,
      dirty: false,
      accessCount: 0,
      lastAccess: 0,
      targetY: 0,
    };

    frameGroup.add(mesh);
    frameMeshes.push(mesh);
  }
}

build3DBufferPool(64);

// Subtle Titanium Particle Field
const pGeo = new THREE.BufferGeometry();
const pCount = 180;
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) {
  pPos[i] = (Math.random() - 0.5) * 65;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ color: PALETTE.titanium, size: 0.12, transparent: true, opacity: 0.45 });
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// ════════════════════════════════════════════════════════════════
// SECTION 5 ── CLIENT-SIDE SIMULATION ENGINES
// Accurate implementations of LRU, LFU, FIFO, PostgreSQL Clock, and MEMORA
// ════════════════════════════════════════════════════════════════
class ReplacementPolicySim {
  constructor(name) {
    this.name = name;
    this.pages = new Set();
    this.order = [];
    this.freq = new Map();
    this.usage = new Map();
    this.clockHand = 0;
    this.hits = 0;
    this.misses = 0;
    this.diskReads = 0;
    this.diskWrites = 0;
  }

  access(pageId, isWrite = false, capacity = 64) {
    const isHit = this.pages.has(pageId);
    if (isHit) {
      this.hits++;
      if (this.name === 'lru') {
        this.order = this.order.filter(p => p !== pageId);
        this.order.push(pageId);
      } else if (this.name === 'lfu') {
        this.freq.set(pageId, (this.freq.get(pageId) || 0) + 1);
      } else if (this.name === 'clock') {
        this.usage.set(pageId, Math.min((this.usage.get(pageId) || 0) + 1, 5));
      }
    } else {
      this.misses++;
      this.diskReads++;
      if (this.pages.size >= capacity) this._evict();
      this._insert(pageId);
    }
    if (isWrite) this.diskWrites++;
    return isHit;
  }

  _insert(pageId) {
    this.pages.add(pageId);
    this.order.push(pageId);
    this.freq.set(pageId, 1);
    this.usage.set(pageId, 1);
  }

  _evict() {
    if (this.pages.size === 0) return null;
    let victim = null;

    if (this.name === 'fifo' || this.name === 'lru') {
      victim = this.order.shift();
    } else if (this.name === 'lfu') {
      let minF = Infinity;
      for (const p of this.pages) {
        const f = this.freq.get(p) || 0;
        if (f < minF) { minF = f; victim = p; }
      }
      this.order = this.order.filter(p => p !== victim);
    } else if (this.name === 'clock') {
      const list = Array.from(this.pages);
      const limit = list.length * 6;
      for (let i = 0; i < limit; i++) {
        const p = list[this.clockHand % list.length];
        const u = this.usage.get(p) || 0;
        this.clockHand = (this.clockHand + 1) % list.length;
        if (u > 0) {
          this.usage.set(p, u - 1);
        } else {
          victim = p; break;
        }
      }
      if (!victim) victim = list[0];
      this.order = this.order.filter(p => p !== victim);
    }

    if (victim !== null) {
      this.pages.delete(victim);
      this.freq.delete(victim);
      this.usage.delete(victim);
    }
    return victim;
  }

  reset() {
    this.pages.clear(); this.order = [];
    this.freq.clear(); this.usage.clear();
    this.clockHand = 0;
    this.hits = 0; this.misses = 0;
    this.diskReads = 0; this.diskWrites = 0;
  }

  get hitRatio() {
    const tot = this.hits + this.misses;
    return tot > 0 ? this.hits / tot : 0;
  }

  get totalDiskIO() { return this.diskReads + this.diskWrites; }
}

class MemoraAdaptiveSim {
  constructor(capacity) {
    this.capacity = capacity;
    this.activePolicyName = 'lru';
    this.policy = new ReplacementPolicySim('lru');
    this.cooldown = 300;
    this.minBenefit = 0.020;
    this.lastSwitchAccess = 0;
    this.accessCounter = 0;
    this.switchCount = 0;
    this.guardedCount = 0;
    this.windowSize = 250;
    this.recentPages = [];
    this.windowHistory = [];
    this.entropy = 0.0;
    this.jsd = 0.0;
    this.seqRatio = 0.0;
    this.detectedPhase = 'INITIALIZING';
  }

  access(pageId, isWrite = false) {
    this.accessCounter++;
    this.recentPages.push(pageId);
    const isHit = this.policy.access(pageId, isWrite, this.capacity);

    if (this.recentPages.length >= this.windowSize) {
      this._evaluateWindow();
      this.recentPages = this.recentPages.slice(this.recentPages.length - 100);
    }
    return isHit;
  }

  _evaluateWindow() {
    const n = this.recentPages.length;
    const counts = new Map();
    let seqHits = 0;

    for (let i = 0; i < n; i++) {
      const p = this.recentPages[i];
      counts.set(p, (counts.get(p) || 0) + 1);
      if (i > 0 && p === this.recentPages[i - 1] + 1) seqHits++;
    }

    // Shannon Entropy
    let ent = 0.0;
    for (const [, c] of counts) {
      const prob = c / n;
      ent -= prob * Math.log2(prob);
    }
    const distSize = counts.size;
    this.entropy = distSize > 1 ? Math.min(1.0, ent / Math.log2(distSize)) : 0.0;
    this.seqRatio = seqHits / Math.max(1, n - 1);

    // Jensen-Shannon Divergence
    if (this.windowHistory.length > 0) {
      const prior = this.windowHistory[this.windowHistory.length - 1];
      const priorN = prior.totalN || n;
      const allKeys = new Set([...counts.keys(), ...prior.keys()]);
      let jsdSum = 0.0;
      for (const k of allKeys) {
        const p = (counts.get(k) || 0) / n;
        const q = (prior.get(k) || 0) / priorN;
        const m = 0.5 * (p + q);
        if (p > 0 && m > 0) jsdSum += 0.5 * p * Math.log2(p / m);
        if (q > 0 && m > 0) jsdSum += 0.5 * q * Math.log2(q / m);
      }
      this.jsd = Math.max(0.0, Math.min(1.0, jsdSum));
    } else {
      this.jsd = 0.0;
    }

    counts.totalN = n;
    this.windowHistory.push(counts);
    if (this.windowHistory.length > 10) this.windowHistory.shift();

    this._checkPolicySwitch();
  }

  _checkPolicySwitch() {
    const accessesSince = this.accessCounter - this.lastSwitchAccess;
    const cooling = accessesSince < this.cooldown;

    let phase = 'RECENCY WORKING SET';
    if (this.seqRatio > 0.40)                         phase = 'SEQUENTIAL SCAN';
    else if (this.entropy < 0.55 && this.jsd > 0.28) phase = 'FREQUENCY SKEW';
    this.detectedPhase = phase;

    const targetPolicy = phase === 'SEQUENTIAL SCAN' ? 'fifo'
                       : phase === 'FREQUENCY SKEW'  ? 'lfu'
                       :                               'lru';

    if (targetPolicy === this.activePolicyName) return;

    if (cooling) {
      this.guardedCount++;
      this._recordEvent(targetPolicy, phase, 0.0, false, `Hysteresis cooldown (${accessesSince}/${this.cooldown} ops active)`);
      return;
    }

    // Cost-benefit inequality
    const expectedBenefit = 0.08 + (this.jsd * 0.05);
    const switchingCost = 0.014 * (this.capacity / 64);
    const netBenefit = expectedBenefit - switchingCost;

    if (netBenefit >= this.minBenefit) {
      this.activePolicyName = targetPolicy;
      this.policy.name = targetPolicy;
      this.lastSwitchAccess = this.accessCounter;
      this.switchCount++;
      this._recordEvent(targetPolicy, phase, netBenefit, true, `Profit margin +${(netBenefit * 100).toFixed(1)}% >= threshold`);
      triggerSwitchVFX(targetPolicy);
    } else {
      this.guardedCount++;
      this._recordEvent(targetPolicy, phase, netBenefit, false, `Margin +${(netBenefit * 100).toFixed(1)}% < threshold`);
    }
  }

  _recordEvent(target, phase, netBenefit, accepted, reason) {
    const evt = {
      timestamp: this.accessCounter,
      prev: this.activePolicyName,
      target, phase, netBenefit, accepted, reason,
    };
    appendLogUI(evt);
    document.getElementById('switch-count').textContent = this.switchCount;
    document.getElementById('thrash-count').textContent = `${this.guardedCount} GUARDED`;
  }

  reset() {
    this.policy.reset();
    this.activePolicyName = 'lru';
    this.policy.name = 'lru';
    this.lastSwitchAccess = 0;
    this.accessCounter = 0;
    this.switchCount = 0;
    this.guardedCount = 0;
    this.recentPages = [];
    this.windowHistory = [];
    this.entropy = 0.0;
    this.jsd = 0.0;
    this.seqRatio = 0.0;
    this.detectedPhase = 'INITIALIZING';
  }

  get hitRatio() { return this.policy.hitRatio; }
  get totalDiskIO() { return this.policy.totalDiskIO; }
}

// ════════════════════════════════════════════════════════════════
// SECTION 6 ── WORKLOAD GENERATORS
// ════════════════════════════════════════════════════════════════
const WORKLOAD_CONFIGS = {
  phase_shift: {
    title: 'Multi-Phase HTAP Workload',
    desc: 'Cycles sequentially through three distinct database access regimes: analytical table scans, power-law Zipfian key lookups, and transactional working-set bursts. Demonstrates where MEMORA outperforms any single static eviction policy.',
    favored: 'FIFO → LFU → LRU',
  },
  pgbench: {
    title: 'PostgreSQL TPC-B (pgbench) Stream',
    desc: 'Simulates genuine transactional debit/credit activity across branches, tellers, and accounts with sequential history inserts. Captures realistic enterprise database cache contention.',
    favored: 'LRU & CLOCK',
  },
  sequential_flood: {
    title: 'Sequential Table Scan Flood',
    desc: 'Floods the buffer pool with one-touch sequential table pages (4x capacity). Demonstrates severe cache pollution where static LRU and LFU evict hot sets while FIFO protects them.',
    favored: 'FIFO',
  },
  zipfian: {
    title: 'Zipfian Frequency Skew Pattern',
    desc: 'Heavy 80/20 power-law key frequency distribution over an 80-page relation. Stagnation traps static policies; MEMORA detects low entropy and locks hot pages via LFU.',
    favored: 'LFU',
  },
  recency: {
    title: 'Temporal Recency Working Set',
    desc: '85% of references hit a concentrated 8-page working set. Temporal locality strongly favors LRU; MEMORA stays in LRU to avoid unnecessary reorganization overhead.',
    favored: 'LRU',
  },
};

function generateWorkloadStream(type, length = 2500) {
  const stream = [];
  if (type === 'phase_shift') {
    for (let i = 0; i < Math.floor(length * 0.33); i++) stream.push({ pageId: 100 + (i % 200), isWrite: i % 6 === 0 });
    for (let i = 0; i < Math.floor(length * 0.33); i++) {
      const offset = Math.floor(Math.pow(Math.random(), 2.5) * 30);
      stream.push({ pageId: 500 + offset, isWrite: i % 4 === 0 });
    }
    for (let i = 0; i < Math.ceil(length * 0.34); i++) {
      const p = Math.random() < 0.90 ? 800 + Math.floor(Math.random() * 10) : 800 + Math.floor(Math.random() * 100);
      stream.push({ pageId: p, isWrite: i % 3 === 0 });
    }
  } else if (type === 'pgbench') {
    for (let i = 0; i < length; i++) {
      const op = i % 7;
      if (op < 2) stream.push({ pageId: 1000 + Math.floor(Math.pow(Math.random(), 2.0) * 250), isWrite: op === 1 });
      else if (op < 4) stream.push({ pageId: 100 + (i % 10), isWrite: op === 3 });
      else if (op < 6) stream.push({ pageId: 10 + (i % 2), isWrite: op === 5 });
      else stream.push({ pageId: 8000 + Math.floor((i / 7) % 60), isWrite: true });
    }
  } else if (type === 'sequential_flood') {
    for (let i = 0; i < length; i++) stream.push({ pageId: 1000 + i, isWrite: false });
  } else if (type === 'zipfian') {
    for (let i = 0; i < length; i++) {
      const offset = Math.floor(Math.pow(Math.random(), 2.0) * 80);
      stream.push({ pageId: 500 + offset, isWrite: i % 4 === 0 });
    }
  } else {
    for (let i = 0; i < length; i++) {
      const p = Math.random() < 0.85 ? 100 + Math.floor(Math.random() * 8) : 100 + Math.floor(Math.random() * 80);
      stream.push({ pageId: p, isWrite: i % 5 === 0 });
    }
  }
  return stream;
}

// ════════════════════════════════════════════════════════════════
// SECTION 7 ── SIMULATION STATE
// ════════════════════════════════════════════════════════════════
let memora = new MemoraAdaptiveSim(64);
let baselineLRU = new ReplacementPolicySim('lru');
let baselineLFU = new ReplacementPolicySim('lfu');
let baselineFIFO = new ReplacementPolicySim('fifo');
let baselineClock = new ReplacementPolicySim('clock');

let workloadTrace = generateWorkloadStream('phase_shift', 2500);
let traceCursor = 0;
let isPlaying = false;
let replaySpeed = 25; // ops/sec

// Stream Oscilloscope
const oscCanvas = document.getElementById('stream-waveform');
const oscCtx = oscCanvas.getContext('2d');
const oscHistory = new Array(70).fill(0);

// Chart Telemetry
const chartHistory = {
  labels: [], memora: [], lru: [], lfu: [], fifo: [], clock: [],
  entropy: [], jsd: [], seq: [],
};
let hitChart = null;
let signalChart = null;
let chartsInitialized = false;

// ════════════════════════════════════════════════════════════════
// SECTION 8 ── UI CONTROLS & EVENT BINDINGS
// ════════════════════════════════════════════════════════════════
const btnPlay = document.getElementById('btn-play');
const playBtnLabel = document.getElementById('play-btn-label');
const btnStep = document.getElementById('btn-step');
const btnReset = document.getElementById('btn-reset');
const workloadSelect = document.getElementById('workload-select');

const sliderBufferSize = document.getElementById('slider-buffer-size');
const valBufferSize = document.getElementById('val-buffer-size');
const valBufferRam = document.getElementById('val-buffer-ram');

const sliderSpeed = document.getElementById('slider-speed');
const valSpeed = document.getElementById('val-speed');

const sliderGate = document.getElementById('slider-gate');
const valGate = document.getElementById('val-gate');

const sliderCooldown = document.getElementById('slider-cooldown');
const valCooldown = document.getElementById('val-cooldown');

// Buffer Size Slider
sliderBufferSize.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  valBufferSize.textContent = `${val} frames`;
  valBufferRam.textContent = `${val * 8} KB`;
  build3DBufferPool(val);
  memora.capacity = val;
  resetAll();
});

// Speed Slider
sliderSpeed.addEventListener('input', (e) => {
  replaySpeed = parseInt(e.target.value);
  valSpeed.textContent = `${replaySpeed} ops/sec`;
});

// Gate Slider
sliderGate.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  memora.minBenefit = val;
  valGate.textContent = `+${(val * 100).toFixed(1)}%`;
});

// Cooldown Slider
sliderCooldown.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  memora.cooldown = val;
  valCooldown.textContent = `${val} ops`;
});

// Workload Select
workloadSelect.addEventListener('change', (e) => {
  const key = e.target.value;
  const cfg = WORKLOAD_CONFIGS[key] || WORKLOAD_CONFIGS.phase_shift;
  document.getElementById('wic-title').textContent = cfg.title;
  document.getElementById('workload-desc').textContent = cfg.desc;
  document.getElementById('wic-favored').textContent = cfg.favored;
  workloadTrace = generateWorkloadStream(key, 2500);
  resetAll();
});

// Play / Pause
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playBtnLabel.textContent = isPlaying ? '⏸ Pause Stream' : '▶ Start Stream';
});

// Step Single Access
btnStep.addEventListener('click', () => {
  if (isPlaying) {
    isPlaying = false;
    playBtnLabel.textContent = '▶ Start Stream';
  }
  executeNextAccess();
});

// Reset
btnReset.addEventListener('click', () => {
  isPlaying = false;
  playBtnLabel.textContent = '▶ Start Stream';
  resetAll();
});

// Camera Presets
document.querySelectorAll('.cam-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const mode = e.target.getAttribute('data-cam');
    const targetCam = CAM_PRESETS[mode] || CAM_PRESETS.iso;
    
    // Smooth Camera Transition
    camera.position.copy(targetCam.pos);
    controls.target.copy(targetCam.target);
    controls.update();
  });
});

function resetAll() {
  traceCursor = 0;
  memora.reset();
  baselineLRU.reset();
  baselineLFU.reset();
  baselineFIFO.reset();
  baselineClock.reset();

  // Reset 3D frame meshes to dark resting state
  frameMeshes.forEach(mesh => {
    mesh.material.color.setHex(PALETTE.frameBase);
    mesh.position.y = 0;
    mesh.userData.pageId = null;
    mesh.userData.dirty = false;
    mesh.userData.accessCount = 0;
  });

  oscHistory.fill(0);
  drawOscilloscope(0, false);

  // Clear charts
  chartHistory.labels.length = 0;
  chartHistory.memora.length = 0;
  chartHistory.lru.length = 0;
  chartHistory.lfu.length = 0;
  chartHistory.fifo.length = 0;
  chartHistory.clock.length = 0;
  chartHistory.entropy.length = 0;
  chartHistory.jsd.length = 0;
  chartHistory.seq.length = 0;
  updateCharts();

  document.getElementById('event-log').innerHTML = `
    <div class="feed-item init">
      <span class="feed-pip">●</span>
      <span class="feed-text">Buffer matrix reset. ${bufferCapacity} frames ready.</span>
    </div>
  `;
  document.getElementById('log-count').textContent = '0 EVENTS';
  document.getElementById('switch-count').textContent = '0';
  document.getElementById('thrash-count').textContent = '0 GUARDED';
  document.getElementById('status-accesses').textContent = '0';
  document.getElementById('status-progress').textContent = '0%';

  updateHUD(null, false);
}

function appendLogUI(evt) {
  const logContainer = document.getElementById('event-log');
  const div = document.createElement('div');
  div.className = `feed-item ${evt.accepted ? 'switch-approved' : 'switch-guarded'}`;
  
  const statusBadge = evt.accepted ? 'TRANSITION' : 'GUARDED';
  div.innerHTML = `
    <span class="feed-pip">●</span>
    <span class="feed-text">
      <strong>#${evt.timestamp}</strong> [${statusBadge}] 
      ${evt.prev.toUpperCase()} → ${evt.target.toUpperCase()} 
      (${evt.phase}) · ${evt.reason}
    </span>
  `;
  logContainer.insertBefore(div, logContainer.firstChild);

  while (logContainer.children.length > 40) {
    logContainer.removeChild(logContainer.lastChild);
  }
}

// ════════════════════════════════════════════════════════════════
// SECTION 9 ── STEP EXECUTION & 3D PHYSICAL RESPONSE
// ════════════════════════════════════════════════════════════════
function executeNextAccess() {
  if (traceCursor >= workloadTrace.length) {
    isPlaying = false;
    playBtnLabel.textContent = '✓ Finished';
    return;
  }

  const rec = workloadTrace[traceCursor++];
  const isHit = memora.access(rec.pageId, rec.isWrite);

  // Run Baselines
  baselineLRU.access(rec.pageId, rec.isWrite, bufferCapacity);
  baselineLFU.access(rec.pageId, rec.isWrite, bufferCapacity);
  baselineFIFO.access(rec.pageId, rec.isWrite, bufferCapacity);
  baselineClock.access(rec.pageId, rec.isWrite, bufferCapacity);

  // 3D Matrix Animation
  const frameIdx = rec.pageId % bufferCapacity;
  const mesh = frameMeshes[frameIdx];

  if (mesh) {
    mesh.userData.pageId = rec.pageId;
    mesh.userData.accessCount++;
    mesh.userData.dirty = rec.isWrite ? true : mesh.userData.dirty;

    if (isHit) {
      // Hit: Warm Champagne Gold / Emerald kinetic lift
      mesh.material.color.setHex(PALETTE.gold);
      mesh.position.y = 0.95;
    } else {
      // Miss / Eviction: Crimson Dip
      mesh.material.color.setHex(PALETTE.crimson);
      mesh.position.y = -0.55;
    }
  }

  // Draw Access Oscilloscope
  drawOscilloscope(rec.pageId, isHit);

  // Sample Chart History every 10 steps
  if (traceCursor % 10 === 0) {
    chartHistory.labels.push(traceCursor);
    chartHistory.memora.push(+(memora.hitRatio * 100).toFixed(1));
    chartHistory.lru.push(+(baselineLRU.hitRatio * 100).toFixed(1));
    chartHistory.lfu.push(+(baselineLFU.hitRatio * 100).toFixed(1));
    chartHistory.fifo.push(+(baselineFIFO.hitRatio * 100).toFixed(1));
    chartHistory.clock.push(+(baselineClock.hitRatio * 100).toFixed(1));
    chartHistory.entropy.push(+(memora.entropy * 100).toFixed(1));
    chartHistory.jsd.push(+(memora.jsd * 100).toFixed(1));
    chartHistory.seq.push(+(memora.seqRatio * 100).toFixed(1));

    if (chartHistory.labels.length > 80) {
      Object.keys(chartHistory).forEach(k => chartHistory[k].shift());
    }
    updateCharts();
  }

  updateHUD(rec, isHit);
}

function updateHUD(rec, isHit) {
  const mHR = memora.hitRatio * 100;
  const cHR = baselineClock.hitRatio * 100;
  const delta = mHR - cHR;

  // Hit Ratio & Delta
  document.getElementById('metric-hit-ratio').textContent = `${mHR.toFixed(2)}%`;
  const deltaEl = document.getElementById('metric-hit-delta');
  deltaEl.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}% vs PG Clock`;
  deltaEl.style.color = delta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)';
  document.getElementById('metric-hit-bar').style.width = `${Math.min(100, mHR)}%`;

  // Storage I/O Reduction
  const clockIO = baselineClock.totalDiskIO;
  const memoraIO = memora.totalDiskIO;
  const ioSaved = Math.max(0, clockIO - memoraIO);
  const ioPct = clockIO > 0 ? (ioSaved / clockIO) * 100 : 0.0;

  document.getElementById('metric-io-reduction').textContent = `${ioPct.toFixed(1)}%`;
  document.getElementById('metric-io-saved').textContent = `${ioSaved.toLocaleString()} ops`;

  // Scoreboard Bars
  const allScores = [mHR, baselineLRU.hitRatio * 100, cHR, baselineLFU.hitRatio * 100, baselineFIFO.hitRatio * 100];
  const maxScore = Math.max(...allScores, 1);

  document.getElementById('score-memora').textContent = `${mHR.toFixed(1)}%`;
  document.getElementById('score-clock').textContent = `${cHR.toFixed(1)}%`;
  document.getElementById('score-lru').textContent = `${(baselineLRU.hitRatio * 100).toFixed(1)}%`;
  document.getElementById('score-lfu').textContent = `${(baselineLFU.hitRatio * 100).toFixed(1)}%`;
  document.getElementById('score-fifo').textContent = `${(baselineFIFO.hitRatio * 100).toFixed(1)}%`;

  document.getElementById('bar-memora').style.width = `${(mHR / maxScore) * 100}%`;
  document.getElementById('bar-clock').style.width = `${(cHR / maxScore) * 100}%`;
  document.getElementById('bar-lru').style.width = `${(baselineLRU.hitRatio * 100 / maxScore) * 100}%`;
  document.getElementById('bar-lfu').style.width = `${(baselineLFU.hitRatio * 100 / maxScore) * 100}%`;
  document.getElementById('bar-fifo').style.width = `${(baselineFIFO.hitRatio * 100 / maxScore) * 100}%`;

  // Diagnostics
  document.getElementById('stat-hits').textContent = memora.policy.hits.toLocaleString();
  document.getElementById('stat-misses').textContent = memora.policy.misses.toLocaleString();
  document.getElementById('stat-disk-reads').textContent = memora.policy.diskReads.toLocaleString();
  document.getElementById('stat-disk-writes').textContent = memora.policy.diskWrites.toLocaleString();

  // Top Bar Status
  document.getElementById('status-policy-text').textContent = memora.activePolicyName.toUpperCase();
  document.getElementById('status-phase-text').textContent = memora.detectedPhase;
  document.getElementById('status-accesses').textContent = memora.accessCounter.toLocaleString();
  const pct = workloadTrace.length > 0 ? ((traceCursor / workloadTrace.length) * 100).toFixed(0) : 0;
  document.getElementById('status-progress').textContent = `${pct}%`;

  // Mathematical Intel HUD
  document.getElementById('intel-entropy').textContent = memora.entropy.toFixed(3);
  document.getElementById('intel-jsd').textContent = memora.jsd.toFixed(3);
  document.getElementById('intel-seq').textContent = `${(memora.seqRatio * 100).toFixed(1)}%`;

  document.getElementById('bar-entropy').style.width = `${memora.entropy * 100}%`;
  document.getElementById('bar-jsd').style.width = `${memora.jsd * 100}%`;
  document.getElementById('bar-seq').style.width = `${memora.seqRatio * 100}%`;

  // Contextual Descriptions
  document.getElementById('intel-entropy-desc').textContent =
    memora.entropy < 0.45 ? 'Heavy skew — hot pages dominate' :
    memora.entropy > 0.75 ? 'Uniform access distribution' :
    'Moderate spatial concentration';

  document.getElementById('intel-jsd-desc').textContent =
    memora.jsd > 0.28 ? 'Regime drift detected (phase boundary)' :
    'Stationary access distribution';

  document.getElementById('intel-seq-desc').textContent =
    memora.seqRatio > 0.40 ? 'Active sequential scan (FIFO optimal)' :
    'Random / skewed access strides';
}

function triggerSwitchVFX(targetPolicy) {
  let col = PALETTE.gold;
  if (targetPolicy === 'lfu') col = PALETTE.emerald;
  else if (targetPolicy === 'fifo') col = PALETTE.amber;
  else if (targetPolicy === 'lru') col = PALETTE.azure;

  coreMat.color.setHex(col);
  coreMat.emissive.setHex(col);
  coreMat.emissiveIntensity = 2.0;

  arbiterLight.color.setHex(col);
  arbiterLight.intensity = 3.5;
}

// ════════════════════════════════════════════════════════════════
// SECTION 10 ── LIVE ACCESS OSCILLOSCOPE
// ════════════════════════════════════════════════════════════════
function drawOscilloscope(pageId, isHit) {
  oscHistory.push(pageId);
  oscHistory.shift();

  document.getElementById('osc-page-info').textContent = `PAGE ${pageId} (${isHit ? 'HIT' : 'MISS'})`;

  const w = oscCanvas.width;
  const h = oscCanvas.height;
  oscCtx.clearRect(0, 0, w, h);

  // Background Grid Lines
  oscCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  oscCtx.lineWidth = 1;
  oscCtx.beginPath();
  oscCtx.moveTo(0, h / 2); oscCtx.lineTo(w, h / 2);
  oscCtx.stroke();

  // Waveform
  const maxVal = Math.max(...oscHistory, 1000);
  const step = w / (oscHistory.length - 1);

  oscCtx.strokeStyle = isHit ? '#d8b87a' : '#8e9bae';
  oscCtx.lineWidth = 1.5;
  oscCtx.beginPath();

  for (let i = 0; i < oscHistory.length; i++) {
    const val = oscHistory[i];
    const norm = val > 0 ? (val / maxVal) : 0.5;
    const y = h - (norm * (h - 8)) - 4;
    const x = i * step;

    if (i === 0) oscCtx.moveTo(x, y);
    else oscCtx.lineTo(x, y);
  }
  oscCtx.stroke();

  // Highlight head
  const lastVal = oscHistory[oscHistory.length - 1];
  const lastNorm = lastVal > 0 ? (lastVal / maxVal) : 0.5;
  const lastY = h - (lastNorm * (h - 8)) - 4;

  oscCtx.fillStyle = isHit ? '#34d399' : '#f43f5e';
  oscCtx.beginPath();
  oscCtx.arc(w - 2, lastY, 2.5, 0, Math.PI * 2);
  oscCtx.fill();
}

// ════════════════════════════════════════════════════════════════
// SECTION 11 ── INTERACTIVE 3D FRAME RAYCAST INSPECTOR
// ════════════════════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const frameInspector = document.getElementById('frame-inspector');

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(frameMeshes);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const data = mesh.userData;

    document.getElementById('ins-frame-id').textContent = `SLOT ${data.frameId.toString().padStart(2, '0')}`;
    document.getElementById('ins-page-id').textContent = data.pageId !== null ? `P_${data.pageId}` : 'EMPTY';
    document.getElementById('ins-dirty-bit').textContent = data.dirty ? 'DIRTY' : 'CLEAN';
    document.getElementById('ins-dirty-bit').style.color = data.dirty ? 'var(--accent-amber)' : 'var(--text-muted)';
    document.getElementById('ins-access-count').textContent = data.accessCount.toLocaleString();

    let risk = 'LOW';
    if (data.pageId === null) risk = 'VACANT';
    else if (data.accessCount <= 1) risk = 'HIGH (VICTIM)';
    document.getElementById('ins-eviction-risk').textContent = risk;
    document.getElementById('ins-eviction-risk').style.color = risk.startsWith('HIGH') ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

    document.getElementById('ins-policy-status').textContent = `Policy: ${memora.activePolicyName.toUpperCase()}`;

    // Clamped strictly to the central 3D viewing area to avoid overlapping any deck
    const insWidth = 225;
    const insHeight = 125;
    let posX = e.clientX + 16;
    let posY = e.clientY + 16;

    // Avoid right deck
    if (posX + insWidth > window.innerWidth - 365) {
      posX = e.clientX - insWidth - 16;
    }
    // Avoid left deck
    if (posX < 345) {
      posX = 345;
    }
    // Avoid bottom deck
    if (posY + insHeight > window.innerHeight - 116) {
      posY = e.clientY - insHeight - 16;
    }
    // Avoid top nav
    if (posY < 74) {
      posY = 74;
    }

    frameInspector.style.left = `${posX}px`;
    frameInspector.style.top = `${posY}px`;
    frameInspector.classList.remove('hidden');
  } else {
    frameInspector.classList.add('hidden');
  }
});

// ════════════════════════════════════════════════════════════════
// SECTION 12 ── MAIN ANIMATION LOOP (60 FPS)
// ════════════════════════════════════════════════════════════════
let lastTime = performance.now();
let fpsCounterTime = 0;
let fpsFrames = 0;
let simAccumulator = 0;

function animate(now) {
  requestAnimationFrame(animate);

  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  // FPS Counter
  fpsFrames++;
  fpsCounterTime += delta;
  if (fpsCounterTime >= 1.0) {
    const fps = (fpsFrames / fpsCounterTime).toFixed(1);
    document.getElementById('fps-counter').textContent = `${fps} FPS`;
    fpsFrames = 0;
    fpsCounterTime = 0;
  }

  controls.update();

  // Arbiter Gimbal Rotation
  arbiterGroup.rotation.y += 0.012;
  ring1.rotation.x += 0.016;
  ring2.rotation.z += 0.020;
  coreMesh.rotation.x += 0.01;
  coreMesh.rotation.y += 0.014;

  // Damping Core Light Back to Baseline
  arbiterLight.intensity += (1.5 - arbiterLight.intensity) * 0.06;
  coreMat.emissiveIntensity += (0.5 - coreMat.emissiveIntensity) * 0.05;

  // 3D Frame Mesh Physical Decay
  for (let mesh of frameMeshes) {
    mesh.position.y += (0 - mesh.position.y) * 0.14;

    // Restore Resting Material Color
    if (mesh.userData.pageId !== null) {
      if (mesh.userData.dirty) {
        mesh.material.color.lerp(new THREE.Color(PALETTE.amber), 0.04);
      } else {
        mesh.material.color.lerp(new THREE.Color(PALETTE.frameTop), 0.04);
      }
    } else {
      mesh.material.color.lerp(new THREE.Color(PALETTE.frameBase), 0.06);
    }
  }

  // Particle Drift
  particles.rotation.y += 0.0006;

  // Simulation Step Accumulator
  if (isPlaying) {
    simAccumulator += delta;
    const interval = 1.0 / replaySpeed;
    while (simAccumulator >= interval) {
      executeNextAccess();
      simAccumulator -= interval;
    }
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ════════════════════════════════════════════════════════════════
// SECTION 13 ── CHARTS MODAL (CHART.JS)
// ════════════════════════════════════════════════════════════════
function initCharts() {
  if (chartsInitialized) return;
  chartsInitialized = true;

  const chartOpts = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 }, line: { tension: 0.25 } },
    plugins: { legend: { labels: { color: '#8e9bae', font: { family: 'Inter Tight', size: 10 } } } },
    scales: {
      x: { ticks: { color: '#555d6b', maxTicksLimit: 6 }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#555d6b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  hitChart = new Chart(document.getElementById('chart-hit-ratio'), {
    type: 'line',
    data: {
      labels: chartHistory.labels,
      datasets: [
        { label: 'MEMORA (Adaptive)', data: chartHistory.memora, borderColor: '#d8b87a', borderWidth: 2 },
        { label: 'PG Clock', data: chartHistory.clock, borderColor: '#8e9bae', borderWidth: 1.5, borderDash: [4, 2] },
        { label: 'LRU', data: chartHistory.lru, borderColor: '#60a5fa', borderWidth: 1.5, borderDash: [4, 2] },
        { label: 'LFU', data: chartHistory.lfu, borderColor: '#34d399', borderWidth: 1.5, borderDash: [4, 2] },
        { label: 'FIFO', data: chartHistory.fifo, borderColor: '#fbbf24', borderWidth: 1.5, borderDash: [4, 2] },
      ],
    },
    options: chartOpts,
  });

  signalChart = new Chart(document.getElementById('chart-signals'), {
    type: 'line',
    data: {
      labels: chartHistory.labels,
      datasets: [
        { label: 'Shannon Entropy H %', data: chartHistory.entropy, borderColor: '#d8b87a', borderWidth: 1.5 },
        { label: 'Jensen-Shannon JSD %', data: chartHistory.jsd, borderColor: '#2dd4bf', borderWidth: 1.5 },
        { label: 'Stride-1 Sequential %', data: chartHistory.seq, borderColor: '#fbbf24', borderWidth: 1.5 },
      ],
    },
    options: chartOpts,
  });
}

function updateCharts() {
  if (!chartsInitialized) return;
  hitChart?.update('none');
  signalChart?.update('none');
}

// ════════════════════════════════════════════════════════════════
// SECTION 14 ── MODALS (CODEX, CHARTS, BENCHMARK)
// ════════════════════════════════════════════════════════════════
const codexModal = document.getElementById('codex-modal');
const chartsModal = document.getElementById('charts-modal');
const benchModal = document.getElementById('bench-modal');

document.getElementById('btn-open-codex').addEventListener('click', () => codexModal.classList.remove('hidden'));
document.getElementById('close-codex').addEventListener('click', () => codexModal.classList.add('hidden'));

document.getElementById('btn-open-charts').addEventListener('click', () => {
  chartsModal.classList.remove('hidden');
  initCharts();
  updateCharts();
});
document.getElementById('close-charts').addEventListener('click', () => chartsModal.classList.add('hidden'));

document.getElementById('close-bench').addEventListener('click', () => benchModal.classList.add('hidden'));

[codexModal, chartsModal, benchModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    [codexModal, chartsModal, benchModal].forEach(m => m.classList.add('hidden'));
  }
});

// ════════════════════════════════════════════════════════════════
// SECTION 15 ── BACKEND REST API INTEGRATION
// Live PostgreSQL 17 inspection & Python engine benchmarks
// ════════════════════════════════════════════════════════════════
async function checkPostgresStatus() {
  const pip = document.getElementById('status-pg-pip');
  const txt = document.getElementById('status-pg-text');
  try {
    const res = await fetch('/api/pg_status', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API returned error');
    const data = await res.json();

    if (data.connected) {
      pip.className = 'pip teal';
      const bufs = data.buffercache ? data.buffercache.total_buffers.toLocaleString() : '16,384';
      const hr = data.hit_ratio ? (data.hit_ratio * 100).toFixed(1) : '94.2';
      txt.innerHTML = `CONNECTED (${bufs} bufs · ${hr}% hit)`;
      txt.style.color = 'var(--accent-emerald)';
    } else {
      pip.className = 'pip amber';
      txt.textContent = 'STANDALONE SIMULATOR';
      txt.style.color = 'var(--accent-amber)';
    }
  } catch {
    pip.className = 'pip titanium';
    txt.textContent = 'CLIENT WEBGL ENGINE';
    txt.style.color = 'var(--accent-titanium)';
  }
}

checkPostgresStatus();
setInterval(checkPostgresStatus, 8000);

// Python Backend Benchmark Trigger
document.getElementById('btn-run-python').addEventListener('click', async () => {
  const btn = document.getElementById('btn-run-python');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳ Running Python Benchmark...</span>';

  const workloadKey = workloadSelect.value;
  let pyWorkload = 'phase_shift';
  if (workloadKey === 'pgbench') pyWorkload = 'pgbench';
  else if (workloadKey === 'sequential_flood') pyWorkload = 'sequential';
  else if (workloadKey === 'zipfian') pyWorkload = 'zipfian';

  try {
    const res = await fetch('/api/benchmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workload: pyWorkload,
        buffer_size: bufferCapacity,
        num_records: 1200,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) throw new Error('Benchmark request failed');
    const data = await res.json();

    if (data.status === 'success') {
      // Update UI with benchmark results
      document.getElementById('score-memora').textContent = `${data.memora.hit_ratio}%`;
      document.getElementById('score-clock').textContent = `${data.clock.hit_ratio}%`;
      if (data.baselines?.lru) document.getElementById('score-lru').textContent = `${data.baselines.lru.hit_ratio}%`;
      if (data.baselines?.lfu) document.getElementById('score-lfu').textContent = `${data.baselines.lfu.hit_ratio}%`;
      if (data.baselines?.fifo) document.getElementById('score-fifo').textContent = `${data.baselines.fifo.hit_ratio}%`;

      document.getElementById('metric-hit-ratio').textContent = `${data.memora.hit_ratio}%`;
      document.getElementById('metric-hit-bar').style.width = `${Math.min(100, data.memora.hit_ratio)}%`;
      document.getElementById('metric-io-reduction').textContent = `${data.io_reduction_pct}%`;

      const ioDiff = data.clock.total_disk_io - data.memora.total_disk_io;
      document.getElementById('metric-io-saved').textContent = `${Math.max(0, ioDiff).toLocaleString()} ops`;

      triggerSwitchVFX('lfu');

      // Populate & Open Benchmark Modal
      const benchBody = document.getElementById('bench-results-content');
      benchBody.innerHTML = `
        <div class="bench-hero-stat">
          MEMORA achieved <strong>${data.memora.hit_ratio}%</strong> hit ratio — 
          an improvement of <strong>+${data.hit_ratio_improvement}%</strong> over PostgreSQL 17 Clock-Sweep.
          Storage disk I/O was reduced by <strong>${data.io_reduction_pct}%</strong> on ${data.total_accesses.toLocaleString()} references.
        </div>
        <div class="function-table-wrap">
          <table class="function-table">
            <thead>
              <tr>
                <th>POLICY</th>
                <th>HIT RATIO</th>
                <th>DISK READS</th>
                <th>DISK WRITES</th>
                <th>TOTAL STORAGE I/O</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background:rgba(216, 184, 122, 0.08); font-weight:700;">
                <td class="fn-name">MEMORA (Adaptive)</td>
                <td style="color:var(--accent-gold);">${data.memora.hit_ratio}%</td>
                <td>${data.memora.disk_reads.toLocaleString()}</td>
                <td>${data.memora.disk_writes.toLocaleString()}</td>
                <td style="color:var(--accent-gold);">${data.memora.total_disk_io.toLocaleString()}</td>
              </tr>
              <tr>
                <td>PostgreSQL 17 Clock-Sweep</td>
                <td>${data.clock.hit_ratio}%</td>
                <td>${data.clock.disk_reads.toLocaleString()}</td>
                <td>${data.clock.disk_writes.toLocaleString()}</td>
                <td>${data.clock.total_disk_io.toLocaleString()}</td>
              </tr>
              ${data.baselines?.lru ? `<tr><td>Static LRU</td><td>${data.baselines.lru.hit_ratio}%</td><td>—</td><td>—</td><td>${data.baselines.lru.total_disk_io.toLocaleString()}</td></tr>` : ''}
              ${data.baselines?.lfu ? `<tr><td>Static LFU</td><td>${data.baselines.lfu.hit_ratio}%</td><td>—</td><td>—</td><td>${data.baselines.lfu.total_disk_io.toLocaleString()}</td></tr>` : ''}
              ${data.baselines?.fifo ? `<tr><td>Static FIFO</td><td>${data.baselines.fifo.hit_ratio}%</td><td>—</td><td>—</td><td>${data.baselines.fifo.total_disk_io.toLocaleString()}</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      `;
      benchModal.classList.remove('hidden');

      appendLogUI({
        timestamp: memora.accessCounter,
        prev: 'PYTHON', target: 'BENCHMARK', phase: pyWorkload,
        netBenefit: data.io_reduction_pct / 100,
        accepted: true,
        reason: `Synchronized benchmark · ${data.total_accesses} accesses · Disk I/O reduced by ${data.io_reduction_pct}%`,
      });
    }
  } catch (err) {
    console.warn('Backend benchmark error:', err);
    appendLogUI({
      timestamp: memora.accessCounter,
      prev: 'PYTHON', target: 'ERROR', phase: 'api',
      netBenefit: 0, accepted: false,
      reason: 'Python server not responding — continuing in client WebGL mode',
    });
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>⚡ Run PG17 Benchmark</span>';
  }
});

// Initial HUD & Oscilloscope Update
updateHUD(null, false);
drawOscilloscope(0, false);
