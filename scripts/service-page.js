// Malinowski Consulting — Service Page (U3-Service-Pages)
// FS-1 / FS-2 / FS-3 | BR12.1 BR13.1-13.3 BR14.2 | NFR-SEC-13/14 | TSD-U3-1/3/6 | SLI-3.1/3.2
// Selectors: [data-cta-primary] hero only (BR12.1) | [data-cta-track] track cards (BR14.2)
// SLUG via location.pathname.split('/')[1] — fragile but spec (entities.md deployment.url)
// No HTML injection — textContent only | analytics guard: optional-chain + try/catch | allow-list at write site
const ALLOWED_SLUGS = new Set(['vibe-code-cleanup', 'ai-sdlc-training']);
const ALLOWED_TRACKS = new Set(['individuals', 'team']);

function trackEvent(name, props) {
  try {
    const fn = window.analytics?.track;
    if (typeof fn === 'function') fn.call(window.analytics, name, props);
  } catch (_) {}
}

function init() {
  try { performance.mark('init-start'); } catch (_) {}
  const raw = (location.pathname.split('/')[1] || '').toLowerCase();
  const slug = raw;
  if (!ALLOWED_SLUGS.has(slug)) {
    try { performance.mark('init-end'); performance.measure('service-page-init', 'init-start', 'init-end'); } catch (_) {}
    return;
  }
  // FS-1: page view
  trackEvent('service_page_view', { service: slug });

  // FS-2: hero primary CTA — single element via querySelector (BR12.1 one hero CTA)
  const primary = document.querySelector('[data-cta-primary]');
  if (primary) {
    primary.addEventListener('click', () => {
      try { performance.mark('cta-click-start'); } catch (_) {}
      const label = (primary.textContent || '').trim();
      trackEvent('service_cta_click', { service: slug, cta_label: label });
      try { performance.mark('cta-click-end'); performance.measure('cta-click', 'cta-click-start', 'cta-click-end'); } catch (_) {}
    });
  }

  // FS-3: track-card CTAs — gated on SLUG === ai-sdlc-training (BR14.2)
  if (slug === 'ai-sdlc-training') {
    for (const btn of document.querySelectorAll('[data-cta-track]')) {
      btn.addEventListener('click', (e) => {
        try { performance.mark('cta-click-start'); } catch (_) {}
        const rawTrack = btn.getAttribute('data-cta-track') || '';
        const track = ALLOWED_TRACKS.has(rawTrack) ? rawTrack : 'individuals';
        const label = (btn.textContent || '').trim();
        // NFR-SEC-13 allow-list at write site; NFR-SEC-14 payload scrub
        trackEvent('service_cta_click', { service: slug, cta_label: label, track });
        const href = btn.getAttribute('href') || '#contact';
        const sep = href.includes('?') ? '&' : '?';
        const url = href + sep + 'service=' + encodeURIComponent(slug) + '&track=' + encodeURIComponent(track);
        e.preventDefault();
        try { performance.mark('cta-click-end'); performance.measure('cta-click', 'cta-click-start', 'cta-click-end'); } catch (_) {}
        location.assign(url);
      });
    }
  }
  try { performance.mark('init-end'); performance.measure('service-page-init', 'init-start', 'init-end'); } catch (_) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
