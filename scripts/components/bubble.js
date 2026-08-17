/* bubble.js — entry + capability gate (U2) */
/* BR8.1, BR8.3, BR8.7 | dynamically imports ./bubble.core.js only when needed */
/**
 * @param {HTMLElement} rootEl - element with [data-bubble-target]
 * @param {object} [options]
 * @returns {Promise<{initialized:boolean,reason?:string,destroy:Function,setMotion?:Function}>}
 */
export default async function init(rootEl, options = {}) {
  if (!rootEl) return { initialized: false, reason: 'no-root', destroy() {} };
  const reduced = (() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  })();
  const hasRAF = typeof window.requestAnimationFrame === 'function';
  const cores = navigator.hardwareConcurrency || 4;
  if (reduced) {
    rootEl.dataset.reducedMotion = 'true';
    return { initialized: false, reason: 'reduced-motion', destroy() {} };
  }
  if (!hasRAF || cores < 2) {
    rootEl.dataset.capability = 'low';
    rootEl.dataset.reducedMotion = 'true';
    return { initialized: false, reason: 'low-capability', destroy() {} };
  }
  try {
    const mod = await import('./bubble.core.js');
    const res = mod.initBubble(rootEl, options);
    return res;
  } catch (e) {
    rootEl.dataset.capability = 'low';
    return { initialized: false, reason: 'core-load-failed', destroy() {} };
  }
}
