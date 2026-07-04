// ─── INITIALIZATION & GLOBALS ───
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => [...o.querySelectorAll(s)];
const rand = (m, M) => Math.random() * (M - m) + m;

// Set Current Year in Footer
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── CUSTOM CANVAS STARFIELD (REPLACED THREE.JS) ───
function initStarfield() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const stars = [];
  const starCount = 180;
  
  let mx = 0, my = 0;
  let targetMx = 0, targetMy = 0;

  // Track mouse coordinates for parallax drift
  window.addEventListener('mousemove', (e) => {
    targetMx = (e.clientX / w - 0.5) * 50; // max 50px drift
    targetMy = (e.clientY / h - 0.5) * 50;
  });

  // Populate stars
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.55 + 0.15,
      dx: (Math.random() - 0.5) * 0.04,
      dy: (Math.random() - 0.5) * 0.04,
      color: Math.random() > 0.45 
        ? '#ffffff' 
        : (Math.random() > 0.5 ? '#7c3aed' : '#ff2d78')
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    // Smooth interpolation of mouse offset
    mx += (targetMx - mx) * 0.06;
    my += (targetMy - my) * 0.06;

    stars.forEach((s) => {
      s.x += s.dx;
      s.y += s.dy;

      // Screen boundary wrapping
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h;
      if (s.y > h) s.y = 0;

      // Apply mouse parallax drift factor based on star size (depth effect)
      const posX = s.x - mx * (s.size * 0.6);
      const posY = s.y - my * (s.size * 0.6);

      ctx.beginPath();
      ctx.arc(posX, posY, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.opacity;
      ctx.fill();
    });

    // Reset alpha for safety
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(animate);
  }

  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastW) {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      lastW = window.innerWidth;
    }
  });

  animate();
}
initStarfield();

// ─── SMOOTH CURSOR EFFECT ───
const cDot = $('#cDot'), cRing = $('#cRing');
let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  tx = e.clientX;
  ty = e.clientY;
});

function animCursor() {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;
  if (cDot) {
    cDot.style.left = cx + 'px';
    cDot.style.top = cy + 'px';
  }
  if (cRing) {
    cRing.style.left = cx + 'px';
    cRing.style.top = cy + 'px';
  }
  requestAnimationFrame(animCursor);
}
animCursor();

$$('button, a, .tl-node, .gallery-item, .q-card, .ach-item, .skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => cRing && cRing.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => cRing && cRing.classList.remove('is-hover'));
});

document.addEventListener('mousedown', () => cRing && cRing.classList.add('is-click'));
document.addEventListener('mouseup', () => cRing && cRing.classList.remove('is-click'));

// ─── AVATAR RING ANIMATION ───
const avC = $('#avatarCanvas');
if (avC) {
  const avX = avC.getContext('2d');
  let avA = 0;
  function drawRing() {
    avX.clearRect(0, 0, 200, 200);
    avA += 0.015;
    const cx = 100, cy = 100, r = 88;
    
    let g;
    try {
      g = avX.createConicGradient(avA, cx, cy);
      g.addColorStop(0, '#7c3aed');
      g.addColorStop(0.3, '#ff2d78');
      g.addColorStop(0.6, '#06f7f7');
      g.addColorStop(1, '#7c3aed');
    } catch (e) {
      // Fallback for older browsers
      g = avX.createRadialGradient(cx, cy, r - 5, cx, cy, r + 5);
      g.addColorStop(0, '#7c3aed');
      g.addColorStop(0.5, '#ff2d78');
      g.addColorStop(1, '#06f7f7');
    }
    
    avX.beginPath();
    avX.arc(cx, cy, r, 0, Math.PI * 2);
    avX.strokeStyle = g;
    avX.lineWidth = 2;
    avX.stroke();
    
    const g2 = avX.createRadialGradient(cx, cy, r + 2, 0, 0, r + 18);
    g2.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
    g2.addColorStop(1, 'transparent');
    
    avX.beginPath();
    avX.arc(cx, cy, r + 14, 0, Math.PI * 2);
    avX.fillStyle = g2;
    avX.fill();
    
    requestAnimationFrame(drawRing);
  }
  drawRing();
}

// ─── ENTRANCE & SPLASH SCREEN GSAP ───
const tlSplash = gsap.timeline({ delay: 0.2 });
tlSplash.to('#splashSup', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
  .to('#splashZH', { opacity: 1, scale: 1, duration: 1.2, ease: 'backOut(1.7)' }, '-=.4')
  .to('#splashBtn', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=.6');

function enterSite() {
  gsap.to('#splash', { opacity: 0, scale: 1.08, y: -20, duration: 1.4, ease: 'expo.inOut', pointerEvents: 'none' });
  gsap.to('#musicBtn', { opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' });
  
  const sections = $$('section .section-inner');
  gsap.to(sections, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.6,
    onComplete: () => {
      animateStats();
      animateTimeline();
      setTimeout(() => bigCelebration(), 400);
    }
  });
}
window.enterSite = enterSite; // Bind to window for HTML click trigger

// ─── SCROLLTRIGGER FADE-IN SECTIONS ───
if (typeof ScrollTrigger !== 'undefined') {
  $$('section .section-inner').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top 82%',
      onEnter: () => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
          gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
        }
      }
    });
  });
} else {
  // Fallback if ScrollTrigger CDN is blocked or unavailable
  $$('section .section-inner').forEach(el => {
    el.classList.add('is-visible');
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

// ─── STATS COUNTING ANIMATION (GSAP) ───
function animateStats() {
  $$('.h-stat .val').forEach(el => {
    const t = el.getAttribute('data-count');
    if (t === '∞') {
      el.textContent = t;
      return;
    }
    const n = parseInt(t);
    if (isNaN(n)) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: n,
      duration: 2,
      ease: 'power3.out',
      onUpdate: () => el.textContent = Math.round(obj.v)
    });
  });
}

// ─── INTERACTIVE TIMELINE STORY (RAHNUMA-E-SAFAR) ───
const timelineStory = [
  {
    title: "Dastak (The Beginning) 🚪",
    text: "Sir, jab main ne pehli baar coding ki dunya mein dastak di, toh rasta bilkul anjan tha. Ek absolute beginner jo screen ko dekh kar hairan hota tha. Lekin aap ki rehnumai ne darr ko shauq mein badal diya aur mujhe umeed di ke main bhi code kar sakta hoon! ❤️"
  },
  {
    title: "Rasta (Learning & Guidance) 🗺️",
    text: "Aap ne mujhe chalna sikhaya — HTML, CSS aur JavaScript ke raste dikhaye. Loops ko samajhna, logic banana aur code errors ko handle karna. Aap ne har dry concept ko itna interesting banaya ke coding se dilchaspi barh gayi."
  },
  {
    title: "Kamyabi (Milestones) 🏆",
    text: "React, responsive designs aur APIs par complex projects bana kar jab live kiya, toh wo kamyabi aap ke sikhaye hue sabaq aur har mushkil par hosla afzai ka phal thi. Aap ki guidance ke bina ye mumkin na tha. ⚡"
  },
  {
    title: "Pehchan (Identity as Developer) 🎓",
    text: "Aaj main jo apni pehchan bana pa raha hoon ek developer ke tor par, iske peeche aap ki azeem mehnat aur rehnumai ka hath hai. Sir, aap mere is safar ke asli rehnuma hain!"
  }
];

function animateTimeline() {
  const line = $('#tlLine');
  if (line) gsap.to(line, { scaleX: 0, duration: 0.1 }); // start zero
  
  const nodes = $$('.tl-node');
  const msgText = $('.msg-box p');
  
  // Set first node as active initially and sync the message box
  if (nodes.length > 0) {
    nodes.forEach(n => n.classList.remove('is-active'));
    nodes[0].classList.add('is-active');
    if (msgText) {
      const story = timelineStory[0];
      msgText.innerHTML = `${story.text}<br><br><span style="color:var(--text-dim)">— Journey Stage: <strong style="color:var(--pink)">${story.title}</strong></span>`;
    }
  }

  // Click handler
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.getAttribute('data-idx'));
      if (isNaN(idx)) return;
      
      nodes.forEach(n => n.classList.remove('is-active'));
      node.classList.add('is-active');
      
      // Update line fill
      const progress = idx / (nodes.length - 1);
      gsap.to(line, { scaleX: progress, duration: 0.6, ease: 'power3.inOut' });
      
      // Update narrative message text with a smooth transition
      if (msgText) {
        gsap.fromTo(msgText, 
          { opacity: 0, y: 12 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.45, 
            ease: 'power2.out',
            onStart: () => {
              const story = timelineStory[idx];
              msgText.innerHTML = `${story.text}<br><br><span style="color:var(--text-dim)">— Journey Stage: <strong style="color:var(--pink)">${story.title}</strong></span>`;
            }
          }
        );
      }
    });

    // Custom GSAP Hover animations
    node.addEventListener('mouseenter', () => gsap.to(node.querySelector('.ic'), { scale: 1.2, duration: 0.25, ease: 'backOut(2)' }));
    node.addEventListener('mouseleave', () => gsap.to(node.querySelector('.ic'), { scale: node.classList.contains('is-active') ? 1.1 : 1, duration: 0.25 }));
  });
}

// ─── HARMONIOUS HAPPY BIRTHDAY SYNTH (WEB AUDIO API) ───
let audioCtx = null;
let masterGainNode = null;
let synthInterval = null;
let musicPlaying = false;

// Note frequencies map
const notesFreq = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33
};

// Happy Birthday Sheet Music: [Note, beats]
const hbMelody = [
  ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
  ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
  ['C4', 0.75], ['C4', 0.25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
  ['Bb4', 0.75], ['Bb4', 0.25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2]
];

let currentNoteIndex = 0;
let nextNoteTime = 0.0;
const tempo = 125; // beats per minute

function playSynthNote(freq, duration, startTime) {
  if (!audioCtx || !masterGainNode) return;
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // Triangle wave gives a lovely music-box bell synth sound
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);
  
  // ADSR Envelope
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.045, startTime + 0.04); 
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.04);
  
  osc.connect(gainNode);
  gainNode.connect(masterGainNode);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function musicBoxScheduler() {
  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    const beatDuration = 60.0 / tempo;
    const noteInfo = hbMelody[currentNoteIndex];
    const freq = notesFreq[noteInfo[0]];
    const duration = noteInfo[1] * beatDuration;

    playSynthNote(freq, duration, nextNoteTime);

    nextNoteTime += duration;
    currentNoteIndex = (currentNoteIndex + 1) % hbMelody.length;
  }
  
  if (musicPlaying) {
    synthInterval = setTimeout(musicBoxScheduler, 25);
  }
}

function toggleMusic() {
  const btn = $('#musicBtn');
  if (!btn) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
  }

  if (!musicPlaying) {
    audioCtx.resume();
    musicPlaying = true;
    btn.textContent = '🎵';
    btn.style.borderColor = 'var(--pink)';
    
    // Smoothly fade in master volume
    masterGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.05);

    currentNoteIndex = 0;
    nextNoteTime = audioCtx.currentTime + 0.05;
    musicBoxScheduler();
  } else {
    musicPlaying = false;
    btn.textContent = '🔇';
    btn.style.borderColor = 'var(--border)';
    if (synthInterval) clearTimeout(synthInterval);

    // Instant smooth fade out to master volume to avoid lingering tones
    if (masterGainNode) {
      masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
      masterGainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    }
  }
}
window.toggleMusic = toggleMusic;

// ─── DIGITAL GIFT BOX SURPRISE ───
function openGift() {
  const box = $('#giftBox');
  const surprise = $('#giftSurprise');
  if (!box || box.classList.contains('is-open')) return;
  
  box.classList.add('is-open');
  setTimeout(() => {
    if (surprise) surprise.classList.add('is-show');
    fireConfetti(80);
  }, 600);
}
window.openGift = openGift;

// ─── CONFETTI SYSTEM ───
const confLayer = $('#confL');
const colors = ['#7c3aed', '#ff2d78', '#06f7f7', '#fbbf24', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#ffffff'];

function fireConfetti(n = 100) {
  if (!confLayer) return;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confP';
    c.style.left = rand(0, 100) + '%';
    c.style.background = colors[Math.floor(rand(0, colors.length))];
    
    const w = rand(4, 8);
    const h = rand(6, 14);
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
    c.style.animationDuration = rand(2, 4) + 's';
    c.style.animationDelay = rand(0, 1.2) + 's';
    c.style.opacity = rand(0.3, 0.7);
    
    confLayer.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}
window.fireConfetti = fireConfetti;

// ─── FIREWORKS SYSTEM ───
function mkFW(x, y) {
  const cols = ['#7c3aed', '#ff2d78', '#06f7f7', '#fbbf24', '#ffffff', '#f97316', '#10b981'];
  const c = document.createElement('div');
  c.className = 'fw';
  c.style.left = x + 'px';
  c.style.top = y + 'px';
  
  const n = Math.floor(rand(30, 50));
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'fw-p';
    p.style.background = cols[Math.floor(rand(0, cols.length))];
    
    const s = rand(3, 6);
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.boxShadow = `0 0 ${s * 2}px ${p.style.background}`;
    
    const a = rand(0, Math.PI * 2);
    const d = rand(50, 140);
    p.style.setProperty('--fx', Math.cos(a) * d + 'px');
    p.style.setProperty('--fy', Math.sin(a) * d + 'px');
    p.style.animationDuration = rand(0.5, 1.2) + 's';
    
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 2000);
}

function fireworkBurst(c = 12) {
  for (let i = 0; i < c; i++) {
    setTimeout(() => {
      mkFW(rand(innerWidth * 0.1, innerWidth * 0.9), rand(innerHeight * 0.1, innerHeight * 0.5));
    }, i * 130);
  }
  fireConfetti(50);
}
window.fireworkBurst = fireworkBurst;

function bigCelebration() {
  fireConfetti(200);
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      mkFW(rand(innerWidth * 0.1, innerWidth * 0.9), rand(innerHeight * 0.1, innerHeight * 0.5));
    }, i * 100);
  }
}
window.bigCelebration = bigCelebration;

// ─── BUTTONS DELEGATION ───
$$('.btn[data-action]').forEach(b => {
  b.addEventListener('click', () => {
    const action = b.getAttribute('data-action');
    if (action === 'celebrate') bigCelebration();
    else if (action === 'fireworks') fireworkBurst();
    else if (action === 'wish') openModal();
  });
});

// ─── MODAL GRATITUDE WISH ───
let modalOpen = false;

function openModal() {
  const modal = $('#modal');
  if (modal) {
    modal.classList.add('is-open');
    modalOpen = true;
    fireConfetti(25);
    typeWriter();
  }
}
window.openModal = openModal;

function closeModal() {
  const modal = $('#modal');
  if (modal) {
    modal.classList.remove('is-open');
    modalOpen = false;
  }
}
window.closeModal = closeModal;

const modal = $('#modal');
if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

function typeWriter() {
  const t = "Aap ki zindagi hamesha khushiyon, sehat aur kamyabi se bhari rahe. Aap ne mujhe jo sikhaya, main hamesha shukarguzaar rahoonga. Aap mere azeem rehnuma hain! Rahnuma-e-Safar — You made it happen! 👑";
  const el = $('#modalText');
  if (!el) return;
  
  el.innerHTML = '';
  let i = 0;
  
  function type() {
    if (!modalOpen) return;
    if (i < t.length) {
      el.innerHTML = t.slice(0, i + 1) + '<span class="blink">|</span>';
      i++;
      setTimeout(type, 30 + rand(0, 40));
    } else {
      el.innerHTML = t;
    }
  }
  type();
}

// ─── MAGNETIC BUTTONS & CARD PARALLAX (TOUCH CAPABLE) ───
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  // ─── MAGNETIC BUTTON INTERACTION ───
  $$('.btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(b, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
    b.addEventListener('mouseleave', () => {
      gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // ─── PARALLAX ON CARDS ───
  $$('.g-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(c, { rotationY: x * 3.5, rotationX: -y * 3.5, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    });
    c.addEventListener('mouseleave', () => {
      gsap.to(c, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

// Initial load check
setTimeout(() => fireConfetti(10), 1000);

console.log('%c🎂 Happy Birthday SIR SIKANDAR HAYAT BABA! 🎉', 'font-size:22px;font-weight:bold;color:#ff2d78');
console.log('%cRahnuma-e-Safar | Crafted with ❤️', 'font-size:14px;color:#7c3aed');
