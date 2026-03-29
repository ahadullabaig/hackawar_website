/* ================================================================
   RADCloud — Main JavaScript
   Migration-Native FinOps | Hack 'A' War
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
    rootMargin: '0px 0px -60px 0px'
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
    const duration = 1200;
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

// -------------------- Savings Aggregator Counters --------------------
(function() {
  const savingsEls = document.querySelectorAll('[data-counter-target]');
  if (!savingsEls.length) return;

  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  function animateSavings(el) {
    const target = parseInt(el.dataset.counterTarget, 10);
    if (isNaN(target)) return;
    const prefix = el.dataset.counterPrefix || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = prefix + value.toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const savingsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSavings(entry.target);
        savingsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  savingsEls.forEach(el => savingsObserver.observe(el));
})();

// -------------------- Typewriter Terminal --------------------
(function() {
  const output = document.getElementById('terminal-output');
  const cursor = document.getElementById('terminal-cursor');
  const terminal = document.getElementById('runbook-terminal');
  if (!output || !cursor || !terminal) return;

  const lines = [
    { type: 'comment', text: '# RADCloud Migration Runbook — Auto-Generated' },
    { type: 'comment', text: '# Mode: Parallel Migration + FinOps  |  Agents: 5 active' },
    { type: 'blank' },
    { type: 'command', text: 'radcloud discover --source gcp --project my-app-prod' },
    { type: 'output', text: '  ✓ Discovery Agent: IAM policies...    23 roles found' },
    { type: 'output', text: '  ✓ Discovery Agent: Compute Engine...  8 instances (40% util)' },
    { type: 'output', text: '  ✓ Discovery Agent: Cloud Storage...   12 buckets' },
    { type: 'output', text: '  ✓ Discovery Agent: Cloud SQL...       3 databases' },
    { type: 'output', text: '  ✓ Discovery Agent: VPC networks...    2 VPCs mapped' },
    { type: 'blank' },
    { type: 'command', text: 'radcloud map --parallel-finops' },
    { type: 'output', text: '  → Mapping Agent: Cloud Run  → Lambda     (right-sized)' },
    { type: 'output', text: '  → Mapping Agent: Compute    → EC2        (RI strategy)' },
    { type: 'output', text: '  → Mapping Agent: Cloud SQL  → RDS        (Reserved)' },
    { type: 'output', text: '  → FinOps Intel:  Savings Plan pre-calculated: $350K/yr' },
    { type: 'output', text: '  ⚠ Risk Agent:    1 incompatible service flagged (15%)' },
    { type: 'blank' },
    { type: 'command', text: 'radcloud generate --terraform --optimized' },
    { type: 'output', text: '  ✓ Generated main.tf              (142 resources)' },
    { type: 'output', text: '  ✓ Generated cost-strategy.tf     (RI + Savings Plans)' },
    { type: 'output', text: '  ✓ Generated migration-runbook.md (24 steps)' },
    { type: 'blank' },
    { type: 'command', text: 'radcloud deploy --day0-optimized --watchdog-enabled' },
    { type: 'output', text: '  ✓ Day 0 optimization: all resources right-sized' },
    { type: 'output', text: '  ✓ Projected savings: $350K per $1M billing' },
    { type: 'output', text: '  ✓ Watchdog Agent: monitoring active (5 agents)' },
    { type: 'blank' },
    { type: 'success', text: '  ★ Fully optimized deployment ready — zero FinOps delay' },
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

// -------------------- FinOps Donut Chart (Chart.js) --------------------
(function() {
  const canvas = document.getElementById('spend-donut');
  if (!canvas || typeof Chart === 'undefined') return;

  let chartCreated = false;

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartCreated) {
        chartCreated = true;
        createDonutChart();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  chartObserver.observe(canvas);

  function createDonutChart() {
    const ctx = canvas.getContext('2d');

    const colors = {
      bg: ['rgba(88,166,255,0.85)', 'rgba(63,185,80,0.85)', 'rgba(240,136,62,0.85)', 'rgba(188,140,255,0.85)'],
      border: ['#58a6ff', '#3fb950', '#f0883e', '#bc8cff'],
      hoverBg: ['rgba(88,166,255,1)', 'rgba(63,185,80,1)', 'rgba(240,136,62,1)', 'rgba(188,140,255,1)'],
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Amazon EC2', 'Amazon S3', 'Amazon RDS', 'Other'],
        datasets: [{
          data: [2950, 1280, 1690, 586],
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 2,
          hoverBackgroundColor: colors.hoverBg,
          hoverBorderWidth: 3,
          hoverOffset: 8,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '68%',
        radius: '90%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,17,23,0.95)',
            titleFont: { family: "'JetBrains Mono', monospace", size: 12, weight: '600' },
            bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
            titleColor: '#f0f6fc',
            bodyColor: '#c9d1d9',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            boxPadding: 4,
            callbacks: {
              label: function(context) {
                const val = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((val / total) * 100).toFixed(1);
                return ' $' + val.toLocaleString('en-US') + ' (' + pct + '%)';
              }
            }
          }
        },
        layout: { padding: 4 },
      }
    });
  }
})();

// -------------------- FinOps Line Chart + Bar Chart --------------------
(function() {
  if (typeof Chart === 'undefined') return;

  // Shared Chart.js defaults for dark theme
  const darkGrid = { color: 'rgba(255,255,255,0.06)', drawBorder: false };
  const darkTicks = { color: '#6e7681', font: { family: "'JetBrains Mono', monospace", size: 10 } };
  const darkTooltip = {
    backgroundColor: 'rgba(13,17,23,0.95)',
    titleFont: { family: "'JetBrains Mono', monospace", size: 12, weight: '600' },
    bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
    titleColor: '#f0f6fc',
    bodyColor: '#c9d1d9',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    cornerRadius: 8,
    padding: 12,
    displayColors: true,
    boxWidth: 10,
    boxHeight: 10,
    boxPadding: 4,
  };

  // ========== LINE CHART ==========
  const lineCanvas = document.getElementById('cost-trend-line');
  if (lineCanvas) {
    let lineCreated = false;
    const lineObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !lineCreated) {
          lineCreated = true;
          createLineChart();
          lineObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    lineObs.observe(lineCanvas);
  }

  function createLineChart() {
    const ctx = lineCanvas.getContext('2d');

    // Gradient fill for AWS line
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(0,200,83,0.2)');
    gradient.addColorStop(1, 'rgba(0,200,83,0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [
          {
            label: 'Traditional (Sequential)',
            data: [9430, 9430, 9430, 9430, 9430, 9430],
            borderColor: 'rgba(88,166,255,0.6)',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#58a6ff',
            tension: 0,
            fill: false,
          },
          {
            label: 'RADCloud (Day 0)',
            data: [6500, 6100, 5700, 5400, 5200, 5100],
            borderColor: '#3fb950',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#0d1117',
            pointBorderColor: '#3fb950',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#3fb950',
            tension: 0.35,
            fill: true,
            backgroundColor: gradient,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: 'easeOutQuart',
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: { ...darkGrid, display: false },
            ticks: darkTicks,
            border: { display: false },
          },
          y: {
            grid: darkGrid,
            ticks: {
              ...darkTicks,
              callback: v => '$' + (v / 1000).toFixed(1) + 'k',
            },
            border: { display: false },
            min: 4000,
            max: 10500,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#c9d1d9',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              boxWidth: 12,
              boxHeight: 2,
              padding: 16,
              usePointStyle: false,
            }
          },
          tooltip: {
            ...darkTooltip,
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString('en-US'),
            }
          }
        },
        layout: { padding: { top: 4, right: 8 } },
      }
    });
  }

  // ========== BAR CHART ==========
  const barCanvas = document.getElementById('cost-compare-bar');
  if (barCanvas) {
    let barCreated = false;
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !barCreated) {
          barCreated = true;
          createBarChart();
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    barObs.observe(barCanvas);
  }

  function createBarChart() {
    const ctx = barCanvas.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Compute', 'Storage', 'Database', 'Networking'],
        datasets: [
          {
            label: 'Before (GCP)',
            data: [4280, 1850, 2340, 960],
            backgroundColor: 'rgba(88,166,255,0.7)',
            borderColor: '#58a6ff',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.65,
          },
          {
            label: 'RADCloud Optimized',
            data: [2950, 1280, 1690, 586],
            backgroundColor: 'rgba(63,185,80,0.7)',
            borderColor: '#3fb950',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.65,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        animation: {
          duration: 1200,
          easing: 'easeOutQuart',
        },
        scales: {
          x: {
            grid: darkGrid,
            ticks: {
              ...darkTicks,
              callback: v => '$' + (v / 1000).toFixed(1) + 'k',
            },
            border: { display: false },
          },
          y: {
            grid: { ...darkGrid, display: false },
            ticks: darkTicks,
            border: { display: false },
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#c9d1d9',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              boxWidth: 12,
              boxHeight: 12,
              padding: 16,
              usePointStyle: false,
            }
          },
          tooltip: {
            ...darkTooltip,
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.x.toLocaleString('en-US'),
            }
          }
        },
        layout: { padding: { top: 4 } },
      }
    });
  }
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

