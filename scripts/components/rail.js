// Malinowski Consulting — Night Audit scrollspy index rail.
// Highlights the rail link for the section in view. No-op without .rail.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var sections = document.querySelectorAll('.exhibit[id], .service-section[id]');
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (a) {
          a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id));
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(function (s) { spy.observe(s); });
})();
