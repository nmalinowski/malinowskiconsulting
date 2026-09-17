// Malinowski Consulting — Night Audit shared site behavior.
// Reveal-on-scroll, ledger spotlight, hero sheen. Each feature no-ops when
// its elements are absent; safe to include on every page. Decorative only:
// content is complete without JS and under prefers-reduced-motion.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // One-shot reveal for exhibits and service sections.
  var sections = document.querySelectorAll('.exhibit, .service-section');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    sections.forEach(function (s) { io.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add('in'); });
  }

  if (reduce || !finePointer) return;

  function pct(pos, start, size) {
    return (((pos - start) / size) * 100).toFixed(1) + '%';
  }

  // Hero sheen follows the cursor (pointer-events:none overlay in CSS).
  var cover = document.querySelector('.cover');
  if (cover) {
    cover.addEventListener('pointermove', function (ev) {
      var r = cover.getBoundingClientRect();
      cover.style.setProperty('--hx', pct(ev.clientX, r.left, r.width));
      cover.style.setProperty('--hy', pct(ev.clientY, r.top, r.height));
    });
  }

  // Ledger spotlight follows the cursor within each row.
  document.querySelectorAll('.ledger__row').forEach(function (row) {
    row.addEventListener('pointermove', function (ev) {
      var r = row.getBoundingClientRect();
      row.style.setProperty('--mx', pct(ev.clientX, r.left, r.width));
    });
  });
})();
