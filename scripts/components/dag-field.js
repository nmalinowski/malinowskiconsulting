// Malinowski Consulting — Night Audit delivery-DAG field (home hero instrument).
// Decorative canvas: 26-stage chain with flow dashes, traveling packet, and
// cursor repulsion. Pauses offscreen/hidden-tab; one static frame under
// prefers-reduced-motion. Expects #cover-agents inside .panel__screen with
// optional #packet-readout / #packet-bar siblings.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var coverEl = document.querySelector('.cover');
  var screenEl = document.querySelector('.panel__screen');
  var canvas = document.getElementById('cover-agents');
  if (!coverEl || !screenEl || !canvas) return;

  var readout = document.getElementById('packet-readout');
  var bar = document.getElementById('packet-bar');
  var mouse = { x: -9999, y: -9999 };
  var ctx = canvas.getContext('2d');
  var TAU = Math.PI * 2;
  var MARGIN = 24;
  var PACKET_TICKS = 26; // frames per edge traversal
  var AW = 0, AH = 0;
  var nodes = [];
  var running = true, rafId = null;
  var tick = 0, lastEi = -1;
  var CHAIN = ['start', 'intent', 'market', 'mockups', 'feasibility', 'explore', 'clarify', 'brainstorm', 'proposal', 'design', 'ui-spec', 'component-spec', 'design-tokens', 'specs', 'review', 'adr', 'tasks', 'plan', 'apply', 'verify', 'hipaa-evidence', 'soc2-evidence', 'pci-dss-evidence', 'retrospective', 'deploy', 'archive'];
  var ACCENT = { 19: 1, 20: 1, 21: 1, 22: 1 }; // verify + evidence run
  var GATE = 19; // verify: entry to the evidence run
  var EDGES = [];
  for (var k = 0; k < CHAIN.length - 1; k++) { EDGES.push([k, k + 1]); }
  var mouseActive = finePointer && !reduce;

  function colors() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? { line: 'rgba(236,231,218,0.34)', node: '#ece7da', auditor: '#dfa63f', label: 'rgba(236,231,218,0.66)' }
      : { line: 'rgba(23,20,14,0.34)', node: '#17140e', auditor: '#9a1b1e', label: 'rgba(74,68,56,0.82)' };
  }

  function resize() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = screenEl.getBoundingClientRect();
    AW = Math.max(1, r.width); AH = Math.max(1, r.height);
    canvas.width = AW * dpr; canvas.height = AH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    nodes = [];
    var x0 = MARGIN, x1 = AW - MARGIN;
    var rows = [[0, 9], [9, 18], [18, 26]];
    var ry = [0.18, 0.5, 0.82];
    for (var row = 0; row < 3; row++) {
      var a = rows[row][0], b = rows[row][1];
      for (var i = a; i < b; i++) {
        var fx = (i - a) / (b - a - 1);
        if (row === 1) { fx = 1 - fx; }
        var bx = x0 + fx * (x1 - x0), by = AH * ry[row];
        nodes.push({
          x: bx, y: by, bx: bx, by: by,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: 3 + Math.random() * 2,
          label: CHAIN[i],
          accent: !!ACCENT[i],
          gateway: i === GATE,
          heat: 0
        });
      }
    }
  }

  function step() {
    var i, p, dx, dy, d;
    for (i = 0; i < nodes.length; i++) {
      p = nodes[i];
      if (mouseActive) {
        dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d > 1 && d < 150) {
          p.vx += (dx / d) * 0.09; p.vy += (dy / d) * 0.09;
          p.heat = Math.min(1, p.heat + 0.08);
        } else {
          p.heat = Math.max(0, p.heat - 0.03);
        }
      }
      p.vx += (p.bx - p.x) * 0.004; p.vy += (p.by - p.y) * 0.004;
      p.vx *= 0.982; p.vy *= 0.982;
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy), max = 0.8;
      if (sp > max) { p.vx = p.vx / sp * max; p.vy = p.vy / sp * max; }
      if (sp < 0.12) { p.vx += (Math.random() - 0.5) * 0.07; p.vy += (Math.random() - 0.5) * 0.07; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < MARGIN) { p.x = MARGIN; p.vx = Math.abs(p.vx); }
      if (p.x > AW - MARGIN) { p.x = AW - MARGIN; p.vx = -Math.abs(p.vx); }
      if (p.y < MARGIN) { p.y = MARGIN; p.vy = Math.abs(p.vy); }
      if (p.y > AH - MARGIN) { p.y = AH - MARGIN; p.vy = -Math.abs(p.vy); }
    }
  }

  function draw() {
    var C = colors();
    ctx.clearRect(0, 0, AW, AH);
    var i, p;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.lineDashOffset = -tick * 0.55;
    for (var e = 0; e < EDGES.length; e++) {
      var A = nodes[EDGES[e][0]], B = nodes[EDGES[e][1]];
      ctx.strokeStyle = (A.accent || B.accent) ? C.auditor : C.line;
      ctx.globalAlpha = (A.accent || B.accent) ? 0.85 : 0.6;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.font = '9px ui-monospace, Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    var showLabels = AW > 520;
    var pulse = 3.5 + Math.sin(tick / 22) * 1.6;
    for (i = 0; i < nodes.length; i++) {
      p = nodes[i];
      var ringR = p.r + 3.5 + (p.gateway ? pulse - 3.5 : 0) + p.heat * 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, ringR, 0, TAU);
      ctx.strokeStyle = (p.accent || p.heat > 0.4) ? C.auditor : C.node;
      ctx.globalAlpha = 0.5 + p.heat * 0.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + p.heat * 1.5, 0, TAU);
      ctx.fillStyle = (p.accent || p.heat > 0.4) ? C.auditor : C.node;
      ctx.globalAlpha = 1; ctx.fill();
      if (showLabels) {
        ctx.globalAlpha = 0.55 + p.heat * 0.45;
        ctx.fillStyle = C.label;
        ctx.fillText(p.label.toUpperCase(), p.x, p.y - p.r - 9, 120);
      }
    }
    // Traveling packet + instrument readout.
    var chainLen = CHAIN.length - 1;
    var ei = Math.floor(tick / PACKET_TICKS) % chainLen, et = (tick % PACKET_TICKS) / PACKET_TICKS;
    var PA = nodes[ei], PB = nodes[ei + 1];
    var px = PA.x + (PB.x - PA.x) * et, py = PA.y + (PB.y - PA.y) * et;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = C.auditor;
    ctx.beginPath(); ctx.arc(px, py, 2.6, 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    if (ei !== lastEi) {
      lastEi = ei;
      if (readout) { readout.textContent = 'Stage ' + String(ei + 1).padStart(2, '0') + '/' + CHAIN.length + ' — ' + CHAIN[ei].toUpperCase(); }
      if (bar) { bar.style.width = Math.round(((ei + 1) / CHAIN.length) * 100) + '%'; }
    }
    tick++;
  }

  function loop() {
    if (!running) { rafId = null; return; }
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (running && rafId === null) { rafId = requestAnimationFrame(loop); } }

  if (mouseActive) {
    screenEl.addEventListener('pointermove', function (ev) {
      var r = screenEl.getBoundingClientRect();
      mouse.x = ev.clientX - r.left; mouse.y = ev.clientY - r.top;
    });
    screenEl.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
  }

  // Ease the instrument out as the hero scrolls away; rAF-throttled.
  var panel = document.querySelector('.panel');
  if (panel && !reduce && finePointer) {
    var ticking = false;
    var fade = function () {
      ticking = false;
      var r = coverEl.getBoundingClientRect();
      panel.style.opacity = Math.min(1, Math.max(0.12, r.bottom / Math.max(1, r.height))).toFixed(2);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(fade); }
    }, { passive: true });
  }

  resize(); seed();
  if (reduce) {
    running = false;
    draw();
  } else {
    start();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        start();
      }, { threshold: 0.02 }).observe(coverEl);
    }
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      start();
    });
    window.addEventListener('resize', function () { resize(); seed(); }, { passive: true });
  }
})();
