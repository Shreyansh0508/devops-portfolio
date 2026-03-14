'use strict';

/* ============================================================
   SHREYANSH SINGH — DEVOPS TERMINAL PORTFOLIO SCRIPT
   ============================================================ */

/* ====================================================
   1. GRID CANVAS — Animated dot matrix background
   ==================================================== */
const canvas = document.getElementById('grid-canvas');
const ctx    = canvas.getContext('2d');
let W, H, cols, rows, dots;
const SPACING = 36;

function buildGrid() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cols = Math.ceil(W / SPACING) + 1;
  rows = Math.ceil(H / SPACING) + 1;
  dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: c * SPACING, y: r * SPACING, a: Math.random() * 0.4 + 0.05, phase: Math.random() * Math.PI * 2 });
    }
  }
}

let mouseX = -999, mouseY = -999;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function renderGrid(t) {
  ctx.clearRect(0, 0, W, H);
  const time = t * 0.001;
  dots.forEach(d => {
    const dx = d.x - mouseX, dy = d.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / 160);
    const pulse = Math.sin(time * 1.2 + d.phase) * 0.15 + 0.85;
    const alpha = d.a * pulse + proximity * 0.35;
    const radius = 1.2 + proximity * 2.5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = proximity > 0.1
      ? `rgba(0,255,65,${alpha})`
      : `rgba(0,255,65,${alpha * 0.5})`;
    ctx.fill();
  });
  requestAnimationFrame(renderGrid);
}

buildGrid();
window.addEventListener('resize', buildGrid);
requestAnimationFrame(renderGrid);


/* ====================================================
   2. CUSTOM CURSOR
   ==================================================== */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});
(function cursorLoop() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();

const hoverSel = 'a, button, .deploy-card, .container-card, .node-card, .npod, .magnetic, .contact-cmd';
document.querySelectorAll(hoverSel).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});


/* ====================================================
   3. NAVBAR
   ==================================================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  // nav stays static (already styled)
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open', open);
});
document.querySelectorAll('.mob-cmd').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobMenu.classList.remove('open');
  });
});


/* ====================================================
   4. UPTIME COUNTER
   ==================================================== */
const uptimeEl = document.getElementById('uptime');
const startTime = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  if (uptimeEl) uptimeEl.textContent = `${h}:${m}:${sec}`;
}, 1000);


/* ====================================================
   5. TERMINAL TYPEWRITER — Hero
   ==================================================== */
const termOut = document.getElementById('term-out');
const termLive = document.getElementById('term-live');

const termLines = [
  { type: 'out',  text: 'NAME        : Shreyansh Singh' },
  { type: 'out',  text: 'ROLE        : Associate DevOps Engineer' },
  { type: 'out',  text: 'COMPANY     : SAP Labs India' },
  { type: 'out',  text: 'LOCATION    : Bangalore, India' },
  { type: 'out',  text: '─────────────────────────────────────' },
  { type: 'out',  text: 'CLOUDS      : AWS · Azure · GCP' },
  { type: 'out',  text: 'INFRA       : Kubernetes · Terraform · Docker' },
  { type: 'out',  text: 'CI/CD       : Jenkins · SAP BTP · GitHub' },
  { type: 'out',  text: '─────────────────────────────────────' },
  { type: 'out',  text: 'DEPLOY_TIME : ↓20%    REL_FREQ : ↑30%' },
  { type: 'out',  text: 'ENV_ISSUES  : ↓25%    UPTIME   : 99.9%' },
  { type: 'out',  text: '─────────────────────────────────────' },
  { type: 'green', text: 'STATUS      : Available for opportunities ●' },
];

function colorLine(text) {
  if (text.startsWith('─')) return `<span style="color:var(--txt3)">${text}</span>`;
  if (text.includes('↓') || text.includes('↑') || text.includes('●') || text.includes('STATUS')) {
    return text.replace(/(↓\d+%|↑\d+%|●)/g, '<span style="color:var(--green);text-shadow:0 0 10px var(--green)">$1</span>');
  }
  const [key, ...rest] = text.split(':');
  if (rest.length) {
    return `<span style="color:var(--txt2)">${key}:</span><span style="color:var(--txtwh)">${rest.join(':')}</span>`;
  }
  return `<span style="color:var(--txtwh)">${text}</span>`;
}

let lineIdx = 0;
function printNextLine() {
  if (!termOut || lineIdx >= termLines.length) {
    if (termLive) termLive.style.display = 'block';
    return;
  }
  const line = termLines[lineIdx++];
  const div = document.createElement('div');
  div.className = 'term-line';
  div.style.opacity = '0';
  div.style.transform = 'translateX(-4px)';
  div.style.transition = 'opacity 0.2s, transform 0.2s';
  div.innerHTML = colorLine(line.text);
  termOut.appendChild(div);
  requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateX(0)';
  });
  setTimeout(printNextLine, 75);
}
setTimeout(printNextLine, 600);


/* ====================================================
   6. FADE-UP OBSERVER
   ==================================================== */
function initFadeUps() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}
initFadeUps();


/* ====================================================
   7. METRIC & SKILL BARS ANIMATE ON SCROLL
   ==================================================== */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.m-bar[data-w], .sbar-fill[data-w]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.dashboard, .skill-bars').forEach(el => barObs.observe(el));


/* ====================================================
   8. COUNT-UP STATS
   ==================================================== */
function countUp(el, target, dur = 1400) {
  let n = 0, step = target / (dur / 16);
  const run = () => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n);
    if (n < target) requestAnimationFrame(run);
    else el.textContent = target;
  };
  requestAnimationFrame(run);
}

const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, parseInt(e.target.dataset.count));
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.dstat-num[data-count]').forEach(el => cObs.observe(el));


/* ====================================================
   9. MAGNETIC BUTTONS
   ==================================================== */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) * 0.28;
    const dy = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});


/* ====================================================
   10. DEPLOY CARD — LOG STREAM EFFECT
   ==================================================== */
document.querySelectorAll('.deploy-card').forEach(card => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        card.querySelectorAll('.log-line').forEach((line, i) => {
          line.style.opacity = '0';
          line.style.transform = 'translateX(-8px)';
          line.style.transition = `opacity 0.3s ${i * 100}ms, transform 0.3s ${i * 100}ms`;
          setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
          }, 50 + i * 100);
        });
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(card);
});


/* ====================================================
   11. SMOOTH ANCHOR SCROLL
   ==================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const t = document.querySelector(link.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ====================================================
   12. SCROLL SPY
   ==================================================== */
const navCmds = document.querySelectorAll('.nav-cmd');
const spyObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navCmds.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-cmd[href="#${e.target.id}"]`);
      if (a) a.style.color = 'var(--green)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(s => spyObs.observe(s));


/* ====================================================
   13. POD TABLE — LIVE PULSE ROW HIGHLIGHT
   ==================================================== */
let podRowIdx = 0;
const podRows = document.querySelectorAll('.pod-row:not(.header)');
if (podRows.length) {
  setInterval(() => {
    podRows.forEach(r => r.style.background = '');
    podRows[podRowIdx].style.background = 'rgba(0,255,65,0.05)';
    podRowIdx = (podRowIdx + 1) % podRows.length;
  }, 1800);
}


/* ====================================================
   14. CONTAINER CARDS — SUBTLE TILT
   ==================================================== */
document.querySelectorAll('.container-card, .deploy-card, .node-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${dy * -1.5}deg) rotateY(${dx * 1.5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ====================================================
   15. NPOD CLICK — TERMINAL FLASH
   ==================================================== */
document.querySelectorAll('.npod').forEach(pod => {
  pod.addEventListener('click', () => {
    pod.style.background = 'rgba(0,255,65,0.2)';
    pod.style.color = 'var(--green)';
    setTimeout(() => {
      pod.style.background = '';
      pod.style.color = '';
    }, 400);
  });
});


/* ====================================================
   16. CONSOLE EASTER EGG
   ==================================================== */
console.log('%c\n██████╗ ███████╗██╗   ██╗ ██████╗ ██████╗ ███████╗\n██╔══██╗██╔════╝██║   ██║██╔═══██╗██╔══██╗██╔════╝\n██║  ██║█████╗  ██║   ██║██║   ██║██████╔╝███████╗\n██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║██╔═══╝ ╚════██║\n██████╔╝███████╗ ╚████╔╝ ╚██████╔╝██║     ███████║\n╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚═╝     ╚══════╝\n', 'color:#00ff41; font-size:8px; font-family:monospace;');
console.log('%c shreyansh@sap:~$ whoami', 'color:#00ff41; font-family:monospace; font-size:1rem;');
console.log('%c Associate DevOps Engineer @ SAP Labs India', 'color:#00d4ff; font-family:monospace;');
console.log('%c singhshreyansh80@gmail.com', 'color:#5a8a5a; font-family:monospace;');
console.log('%c\nBuilding cloud-native infra. One pipeline at a time. 🚀', 'color:#00ff41;');
