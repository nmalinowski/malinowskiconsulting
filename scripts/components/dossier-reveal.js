// Malinowski Consulting - Audit dossier reveal-on-scroll.
// Gentle 12px fade-up for each .reveal section. Content is complete without
// JS and under prefers-reduced-motion. Adapted from the approved preview.
(function () {
  var items = document.querySelectorAll('.dossier .reveal');
  if (!items.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
  // Safety: reveal anything still hidden after 1.2s if observer stalls
  setTimeout(function () {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-visible');
    });
  }, 1200);
})();
