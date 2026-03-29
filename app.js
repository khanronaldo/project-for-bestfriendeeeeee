/* ═══════════════════════════════════════════════════════════
   TANZEELA AIMAN — APP CONTROLLER
   Pure Vanilla JS · No dependencies
═══════════════════════════════════════════════════════════ */

'use strict';

import {
  initCursor,
  initHeroParticles,
  initStarField,
  initPolaroidTilt,
  initSmileParticles,
  animatePageIn,
  pageTransition,
  showToast,
  initAmbientHearts,
  initScrollReveal,
} from './animations.js';

/* ══════════════════════════════════════════════
   PAGE REGISTRY
══════════════════════════════════════════════ */
const PAGE_IDS  = ['p1', 'p2', 'p3', 'p4'];
const PAGE_LABELS = ['Welcome', 'Memories', 'Tribute', 'Promise'];
let currentPage = 0;

/* ══════════════════════════════════════════════
   SHOW / HIDE
══════════════════════════════════════════════ */
function showPage(idx, skipTransition = false) {
  if (idx === currentPage && !skipTransition) return;

  const go = () => {
    PAGE_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (i === idx) {
        el.classList.add('active');
        el.scrollTop = 0;
        setTimeout(() => animatePageIn(id), 50);
      } else {
        el.classList.remove('active');
      }
    });
    currentPage = idx;
    updateNavDots();

    // per-page init
    if (idx === 0) initAmbientHearts('p1');
    if (idx === 1) { initPolaroidTilt(); initScrollReveal(); }
    if (idx === 2) initStarField('starfield');
    if (idx === 3) initAmbientHearts('p4');
  };

  if (skipTransition) { go(); return; }
  pageTransition(go);
}

function updateNavDots() {
  document.querySelectorAll('.snav-item').forEach((item, i) => {
    item.classList.toggle('active', i === currentPage);
  });
}

/* ══════════════════════════════════════════════
   BUILD SIDE NAV
══════════════════════════════════════════════ */
function buildSideNav() {
  const nav = document.getElementById('side-nav');
  if (!nav) return;
  nav.innerHTML = '';
  PAGE_LABELS.forEach((label, i) => {
    const item = document.createElement('div');
    item.className = 'snav-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `<div class="snav-dot"></div><span class="snav-label">${label}</span>`;
    item.addEventListener('click', () => showPage(i));
    nav.appendChild(item);
  });
}

/* ══════════════════════════════════════════════
   GLOBAL DECO (floating emojis layer)
══════════════════════════════════════════════ */
function buildGlobalDeco() {
  const layer = document.getElementById('global-deco');
  if (!layer) return;

  const items = [
    { emoji: '🌸', top: '8%',  left: '3%',  size: '2rem',  dur: '7s',  delay: '0s'   },
    { emoji: '✨', top: '12%', right: '4%', size: '1.6rem', dur: '9s',  delay: '-3s'  },
    { emoji: '🌷', top: '22%', left: '92%', size: '1.8rem', dur: '11s', delay: '-5s'  },
    { emoji: '⭐', top: '75%', left: '2%',  size: '1.5rem', dur: '8s',  delay: '-2s'  },
    { emoji: '🌼', top: '82%', right: '3%', size: '2rem',   dur: '10s', delay: '-7s'  },
    { emoji: '💮', top: '45%', left: '1%',  size: '1.4rem', dur: '12s', delay: '-4s'  },
    { emoji: '🍃', top: '55%', right: '2%', size: '1.6rem', dur: '9s',  delay: '-1s'  },
    { emoji: '🌙', top: '5%',  left: '48%', size: '1.3rem', dur: '14s', delay: '-6s'  },
  ];

  items.forEach(({ emoji, top, left, right, size, dur, delay }) => {
    const el = document.createElement('div');
    el.className = 'gdeco';
    el.textContent = emoji;
    el.style.cssText = `
      top:${top};
      ${left  ? `left:${left};`   : ''}
      ${right ? `right:${right};` : ''}
      font-size:${size};
      animation-duration:${dur};
      animation-delay:${delay};
    `;
    layer.appendChild(el);
  });
}

/* ══════════════════════════════════════════════
   WIRE UP ALL BUTTONS
══════════════════════════════════════════════ */
function wireButtons() {
  // Page 1 → 2
  const beginBtn = document.getElementById('begin-btn');
  if (beginBtn) beginBtn.addEventListener('click', () => {
    showToast('💌  A letter, just for you...');
    showPage(1);
  });

  // Page 2 → 3
  const goP3 = document.getElementById('go-p3-btn');
  if (goP3) goP3.addEventListener('click', () => showPage(2));

  // Page 3 → 4
  const goP4 = document.getElementById('go-p4-btn');
  if (goP4) goP4.addEventListener('click', () => showPage(3));

  // Smile button
  const smileBtn = document.getElementById('smile-btn');
  if (smileBtn) {
    smileBtn.addEventListener('click', () => {
      window._launchSmile(smileBtn);
      showToast('🌸  For you, always! 🌸');
    });
  }

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentPage < PAGE_IDS.length - 1) showPage(currentPage + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (currentPage > 0) showPage(currentPage - 1);
    }
  });
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  buildSideNav();
  buildGlobalDeco();
  initCursor();
  initHeroParticles('p1');
  initSmileParticles();
  wireButtons();

  // Show page 1
  showPage(0, true);
});
