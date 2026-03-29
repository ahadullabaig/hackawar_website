/* ================================================================
   CloudShift — Main JavaScript
   ByteMyOps | Hack 'A' War
   ================================================================ */

// -------------------- Navigation Scroll Behavior --------------------
(function() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  updateNav();
})();

// -------------------- Smooth Anchor Scrolling --------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// -------------------- Service Mapping Hover Interactions --------------------
(function() {
  const grid = document.getElementById('mapping-grid');
  if (!grid) return;

  let activeRow = null;

  grid.addEventListener('mouseenter', function(e) {
    const card = e.target.closest('.mapping__card');
    if (!card) return;

    const row = card.dataset.row;
    if (!row || row === activeRow) return;
    activeRow = row;

    // Highlight all elements in the same row
    const siblings = grid.querySelectorAll('[data-row="' + row + '"]');
    siblings.forEach(el => {
      if (el.classList.contains('mapping__card') && el !== card) {
        el.classList.add('mapping__card--highlight');
      }
      if (el.classList.contains('mapping__connector')) {
        el.classList.add('mapping__connector--active');
      }
    });
  }, true);

  grid.addEventListener('mouseleave', function(e) {
    const card = e.target.closest('.mapping__card');
    if (!card) return;

    const row = card.dataset.row;
    if (!row) return;

    // Check if we're moving to another element in the same row
    const related = e.relatedTarget?.closest?.('[data-row="' + row + '"]');
    if (related) return;

    activeRow = null;
    const siblings = grid.querySelectorAll('[data-row="' + row + '"]');
    siblings.forEach(el => {
      el.classList.remove('mapping__card--highlight', 'mapping__connector--active');
    });
  }, true);
})();

// -------------------- Intersection Observer for Reveal Animations --------------------
(function() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// -------------------- Animated Number Counters --------------------
(function() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    const prefix = el.textContent.startsWith('$') ? '$' : '';

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = prefix + value.toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => counterObserver.observe(el));
})();

// -------------------- Typewriter Terminal --------------------
(function() {
  const output = document.getElementById('terminal-output');
  const cursor = document.getElementById('terminal-cursor');
  const terminal = document.getElementById('runbook-terminal');
  if (!output || !cursor || !terminal) return;

  const lines = [
    { type: 'comment', text: '# CloudShift Migration Runbook — Auto-Generated' },
    { type: 'comment', text: '# Target: GCP → AWS  |  Confidence: 94.2%' },
    { type: 'blank' },
    { type: 'command', text: 'cloudshift scan --source gcp --project my-app-prod' },
    { type: 'output', text: '  ✓ Scanning IAM policies...          23 roles found' },
    { type: 'output', text: '  ✓ Scanning Compute Engine...         8 instances' },
    { type: 'output', text: '  ✓ Scanning Cloud Storage...          12 buckets' },
    { type: 'output', text: '  ✓ Scanning Cloud SQL...              3 databases' },
    { type: 'output', text: '  ✓ Scanning VPC networks...           2 VPCs mapped' },
    { type: 'blank' },
    { type: 'command', text: 'cloudshift analyze --compatibility' },
    { type: 'output', text: '  → Compute Engine  →  EC2          98% compatible' },
    { type: 'output', text: '  → Cloud Storage   →  S3           99% compatible' },
    { type: 'output', text: '  → Cloud SQL       →  RDS          95% compatible' },
    { type: 'output', text: '  → Cloud Functions →  Lambda       92% compatible' },
    { type: 'blank' },
    { type: 'command', text: 'cloudshift generate --output terraform --format hcl' },
    { type: 'output', text: '  ✓ Generated main.tf              (142 resources)' },
    { type: 'output', text: '  ✓ Generated variables.tf         (38 variables)' },
    { type: 'output', text: '  ✓ Generated migration-runbook.md (24 steps)' },
    { type: 'blank' },
    { type: 'command', text: 'cloudshift deploy --strategy blue-green --dry-run' },
    { type: 'output', text: '  ✓ Estimated downtime: < 4 minutes' },
    { type: 'output', text: '  ✓ Projected savings: $2,924/mo (31%)' },
    { type: 'output', text: '  ✓ Rollback plan: auto-configured' },
    { type: 'blank' },
    { type: 'success', text: '  ★ Migration plan ready — run `cloudshift deploy --execute`' },
  ];

  let hasTyped = false;

  function typeChar(text, el, i, cb) {
    if (i < text.length) {
      el.textContent += text[i];
      scrollToBottom();
      setTimeout(() => typeChar(text, el, i + 1, cb), 25 + Math.random() * 15);
    } else {
      cb();
    }
  }

  function scrollToBottom() {
    const body = terminal.querySelector('.terminal__body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  function processLine(idx) {
    if (idx >= lines.length) {
      cursor.style.display = 'none';
      return;
    }

    const line = lines[idx];

    if (line.type === 'blank') {
      output.textContent += '\n';
      scrollToBottom();
      setTimeout(() => processLine(idx + 1), 200);
      return;
    }

    if (line.type === 'comment') {
      const span = document.createElement('span');
      span.className = 't-muted';
      span.textContent = line.text;
      output.appendChild(span);
      output.appendChild(document.createTextNode('\n'));
      scrollToBottom();
      setTimeout(() => processLine(idx + 1), 300);
      return;
    }

    if (line.type === 'command') {
      const prefix = document.createElement('span');
      prefix.className = 't-green';
      prefix.textContent = '$ ';
      output.appendChild(prefix);

      const cmdSpan = document.createElement('span');
      cmdSpan.className = 't-bold';
      output.appendChild(cmdSpan);

      typeChar(line.text, cmdSpan, 0, () => {
        output.appendChild(document.createTextNode('\n'));
        scrollToBottom();
        setTimeout(() => processLine(idx + 1), 400);
      });
      return;
    }

    if (line.type === 'output') {
      const span = document.createElement('span');
      span.textContent = line.text;
      output.appendChild(span);
      output.appendChild(document.createTextNode('\n'));
      scrollToBottom();
      setTimeout(() => processLine(idx + 1), 80);
      return;
    }

    if (line.type === 'success') {
      const span = document.createElement('span');
      span.className = 't-green t-bold';
      span.textContent = line.text;
      output.appendChild(span);
      output.appendChild(document.createTextNode('\n'));
      scrollToBottom();
      setTimeout(() => processLine(idx + 1), 200);
      return;
    }
  }

  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTyped) {
        hasTyped = true;
        processLine(0);
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  termObserver.observe(terminal);
})();

// -------------------- Scroll-Driven Color Transition Engine (Tasks 5a–5d) --------------------
(function() {
  'use strict';

  // ========== Phase Color Schemes ==========
  // RGB(A) arrays for each CSS custom property, per phase.
  // The scroll engine interpolates between these as the user scrolls.
  const SCHEMES = {
    gcp: {
      bgPrimary:       [255, 255, 255],       // #ffffff
      bgSecondary:     [244, 245, 247],       // #f4f5f7
      bgTertiary:      [232, 234, 237],       // #e8eaed
      textPrimary:     [26, 26, 46],          // #1a1a2e
      textSecondary:   [95, 99, 104],         // #5f6368
      textMuted:       [154, 160, 166],       // #9aa0a6
      accentPrimary:   [66, 133, 244],        // #4285F4
      accentSecondary: [52, 168, 83],         // #34A853
      accentGlow:      [66, 133, 244, 0.3],
      grad1:           [66, 133, 244, 0.12],  // blue radial glow
      grad2:           [52, 168, 83, 0.08],   // green radial glow
    },
    transition: {
      bgPrimary:       [30, 40, 56],
      bgSecondary:     [24, 34, 48],
      bgTertiary:      [38, 52, 68],
      textPrimary:     [242, 243, 243],
      textSecondary:   [175, 180, 190],
      textMuted:       [125, 133, 145],
      accentPrimary:   [255, 153, 0],         // #FF9900
      accentSecondary: [255, 184, 77],
      accentGlow:      [255, 153, 0, 0.3],
      grad1:           [255, 153, 0, 0.1],    // orange radial glow
      grad2:           [255, 120, 0, 0.06],   // warm amber glow
    },
    aws: {
      bgPrimary:       [22, 30, 45],          // #161E2D
      bgSecondary:     [30, 40, 58],
      bgTertiary:      [42, 56, 75],
      textPrimary:     [242, 243, 243],       // #F2F3F3
      textSecondary:   [175, 180, 190],
      textMuted:       [125, 133, 145],
      accentPrimary:   [255, 153, 0],         // #FF9900
      accentSecondary: [255, 184, 77],
      accentGlow:      [255, 153, 0, 0.3],
      grad1:           [255, 153, 0, 0.07],   // subtle orange accent
      grad2:           [100, 130, 180, 0.04], // faint blue depth
    },
    finops: {
      bgPrimary:       [14, 22, 34],
      bgSecondary:     [20, 30, 44],
      bgTertiary:      [30, 44, 60],
      textPrimary:     [242, 243, 243],
      textSecondary:   [175, 180, 190],
      textMuted:       [125, 133, 145],
      accentPrimary:   [0, 200, 83],          // #00C853
      accentSecondary: [105, 240, 174],       // #69F0AE
      accentGlow:      [0, 200, 83, 0.3],
      grad1:           [0, 200, 83, 0.1],     // green radiance
      grad2:           [105, 240, 174, 0.06], // emerald accent
    }
  };

  // Maps scheme keys → CSS custom property names
  const CSS_MAP = {
    bgPrimary:       '--bg-primary',
    bgSecondary:     '--bg-secondary',
    bgTertiary:      '--bg-tertiary',
    textPrimary:     '--text-primary',
    textSecondary:   '--text-secondary',
    textMuted:       '--text-muted',
    accentPrimary:   '--accent-primary',
    accentSecondary: '--accent-secondary',
    accentGlow:      '--accent-glow',
    grad1:           '--grad-1',
    grad2:           '--grad-2',
  };
  const CSS_KEYS = Object.keys(CSS_MAP);

  // ========== Element References ==========
  const sections = Array.from(document.querySelectorAll('[data-phase]'));
  if (!sections.length) return;

  const root = document.documentElement;
  const nav = document.getElementById('main-nav');
  const navLinks = nav ? nav.querySelectorAll('.nav__link[href^="#"]') : [];
  let ticking = false;

  // Disable body CSS transitions — they cause lag with continuous
  // scroll-driven updates (the 0.6s transition "chases" the value)
  document.body.style.transition = 'none';

  // ========== Accessibility: Reduced Motion (Task 5d) ==========
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
    prefersReducedMotion = e.matches;
    requestUpdate();
  });

  // ========== Math Utilities ==========

  // Linear interpolation
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Ease-in-out cubic — smooth natural curve for color blending
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Interpolate two color arrays [r,g,b] or [r,g,b,a] with easing
  function lerpColor(a, b, t) {
    var et = prefersReducedMotion ? (t > 0.5 ? 1 : 0) : easeInOutCubic(t);
    return a.map(function(v, i) {
      var val = lerp(v, b[i], et);
      return i === 3 ? Math.round(val * 100) / 100 : Math.round(val);
    });
  }

  // Convert color array to CSS string
  function toCSS(c) {
    return c.length === 4
      ? 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + c[3] + ')'
      : 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')';
  }

  // ========== Position Cache (Task 5d) ==========
  // Cache section positions to avoid per-frame layout reflow.
  // Only recalculated on resize.
  var posCache = [];  // { top, height }

  function cachePositions() {
    posCache = [];
    for (var i = 0; i < sections.length; i++) {
      posCache.push({
        top: sections[i].offsetTop,
        height: sections[i].offsetHeight,
      });
    }
  }

  // ========== Boundary Detection (Task 5c, optimized 5d) ==========
  // Pre-compute boundaries where the phase CHANGES between adjacent sections.
  // Transition zones are clamped to prevent overlap with adjacent boundaries.

  var boundaries = [];

  function calculateBoundaries() {
    // Refresh position cache first
    cachePositions();

    boundaries = [];
    for (var i = 1; i < sections.length; i++) {
      var prevPhase = sections[i - 1].dataset.phase;
      var currPhase = sections[i].dataset.phase;
      if (prevPhase !== currPhase) {
        boundaries.push({
          position: posCache[i].top,
          from: prevPhase,
          to: currPhase,
        });
      }
    }

    // Clamp transition zones so adjacent boundaries don't overlap (Task 5d)
    for (var j = 1; j < boundaries.length; j++) {
      var gap = boundaries[j].position - boundaries[j - 1].position;
      // Store max allowed half-zone for each boundary
      boundaries[j].maxHalf = gap * 0.5;
      if (!boundaries[j - 1].maxHalf || boundaries[j - 1].maxHalf > gap * 0.5) {
        boundaries[j - 1].maxHalf = gap * 0.5;
      }
    }
  }

  // Initial calculation
  calculateBoundaries();

  // ========== CSS Variable Dirty Cache (Task 5d) ==========
  // Only call setProperty when the computed value actually changed.
  // Avoids unnecessary style recalculation.
  var cssCache = {};

  function setIfChanged(prop, value) {
    if (cssCache[prop] !== value) {
      cssCache[prop] = value;
      root.style.setProperty(prop, value);
    }
  }

  // ========== Active Nav Link Tracking (Task 5c) ==========
  var SECTION_NAV_MAP = {
    'hero':             '#hero',
    'transition':       '#transition',
    'service-mapping':  '#transition',
    'pipeline':         '#transition',
    'cost-comparison':  '#transition',
    'finops':           '#finops',
    'terminal':         '#aws-services',
    'aws-services':     '#aws-services',
  };
  var lastActiveHref = '';

  function updateActiveNavLink(sectionId) {
    var href = SECTION_NAV_MAP[sectionId] || '#' + sectionId;
    if (href === lastActiveHref) return;

    lastActiveHref = href;
    for (var i = 0; i < navLinks.length; i++) {
      var linkHref = navLinks[i].getAttribute('href');
      if (linkHref === href) {
        navLinks[i].classList.add('nav__link--active');
      } else {
        navLinks[i].classList.remove('nav__link--active');
      }
    }
  }

  // ========== Body Phase Class (Task 5c) ==========
  var lastBodyPhase = '';

  function updateBodyPhase(phase) {
    if (phase === lastBodyPhase) return;
    if (lastBodyPhase) document.body.classList.remove('phase-' + lastBodyPhase);
    document.body.classList.add('phase-' + phase);
    lastBodyPhase = phase;
  }

  // ========== Core Update Loop ==========
  function update() {
    var scrollY = window.scrollY;
    var vh = window.innerHeight;

    // "Sense point" — 40% down viewport
    var sense = scrollY + vh * 0.4;

    // ---- Find current section (using cached positions) ----
    var currentIdx = 0;
    for (var i = 0; i < posCache.length; i++) {
      if (posCache[i].top <= sense) currentIdx = i;
    }

    // Update active nav link
    updateActiveNavLink(sections[currentIdx].id);

    // ---- Boundary-Centered Phase Detection ----
    var defaultHalfZone = vh * 0.3;

    // Start with the first section's phase
    var activePhase = sections[0].dataset.phase;
    var fromScheme = SCHEMES[activePhase];
    var toScheme = SCHEMES[activePhase];
    var t = 1;

    for (var b = 0; b < boundaries.length; b++) {
      var bnd = boundaries[b];
      // Use clamped half-zone if available, else default (Task 5d)
      var halfZone = bnd.maxHalf ? Math.min(defaultHalfZone, bnd.maxHalf) : defaultHalfZone;
      var zoneStart = bnd.position - halfZone;
      var zoneEnd = bnd.position + halfZone;

      if (sense < zoneStart) {
        break;
      } else if (sense >= zoneEnd) {
        activePhase = bnd.to;
        fromScheme = SCHEMES[bnd.to];
        toScheme = SCHEMES[bnd.to];
        t = 1;
      } else {
        fromScheme = SCHEMES[bnd.from];
        toScheme = SCHEMES[bnd.to];
        t = (sense - zoneStart) / (zoneEnd - zoneStart);
        activePhase = t > 0.5 ? bnd.to : bnd.from;
        break;
      }
    }

    // ---- Blend & Apply CSS Variables (dirty-checked) ----
    for (var k = 0; k < CSS_KEYS.length; k++) {
      var key = CSS_KEYS[k];
      var blended = lerpColor(fromScheme[key], toScheme[key], t);
      setIfChanged(CSS_MAP[key], toCSS(blended));
    }

    // Scroll progress
    var maxScroll = document.documentElement.scrollHeight - vh;
    setIfChanged('--scroll-progress',
      maxScroll > 0 ? (scrollY / maxScroll).toFixed(4) : '0'
    );

    // ---- Nav Dark Mode ----
    if (nav) {
      var bg = lerpColor(fromScheme.bgPrimary, toScheme.bgPrimary, t);
      var luminance = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255;
      nav.classList.toggle('nav--dark', luminance < 0.5);
    }

    // ---- Body Phase Class ----
    updateBodyPhase(activePhase);

    ticking = false;
  }

  // ========== Event Binding (Task 5d — optimized) ==========
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  // Scroll drives the engine
  window.addEventListener('scroll', requestUpdate, { passive: true });

  // Debounced resize — avoids excessive recalculation during drag (Task 5d)
  var resizeTimer = null;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      calculateBoundaries();
      cssCache = {}; // Invalidate cache — positions changed
      requestUpdate();
    }, 150);
  }, { passive: true });

  // Visibility API — pause when tab hidden, resume on show (Task 5d)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      cssCache = {}; // Force full repaint on tab focus
      requestUpdate();
    }
  });

  // Initial paint (handles page load at scrolled position)
  update();
})();

