/* contact-form.js — entry + form binding (U2) */
/* BR9.5, BR10.1, BR10.4, NFR-SEC-8 | dynamic import ./contact-form.core.js */
/**
 * @param {HTMLFormElement} rootFormEl - form with [data-contact-form]
 * @param {object} [options]
 * @returns {Promise<{initialized:boolean,destroy:Function}|*>}
 */
export default async function init(rootFormEl, options = {}) {
  if (!rootFormEl || rootFormEl.tagName !== 'FORM') {
    console.warn('[contact-form] rootFormEl must be a <form> element');
    return { initialized: false, destroy() {} };
  }
  const endpoint = rootFormEl.getAttribute('action') || rootFormEl.dataset.endpoint || rootFormEl.getAttribute('data-endpoint') || 'https://api.web3forms.com/submit';
  if (!endpoint) console.warn('[contact-form] missing endpoint; submit will fail');
  const honeypot = rootFormEl.querySelector('[name=botcheck]') || rootFormEl.elements.namedItem('website') || rootFormEl.querySelector('[name=website]');
  if (!honeypot) console.warn('[contact-form] honeypot [name=botcheck] not found (BR10.4/NFR-SEC-8)');
  else if (honeypot.getAttribute('tabindex') !== '-1') {
    try { honeypot.setAttribute('tabindex', '-1'); } catch {}
  }
  try {
    const mod = await import('./contact-form.core.js');
    const res = mod.initContactForm(rootFormEl, { ...options, endpoint });
    return res;
  } catch (e) {
    console.warn('[contact-form] core load failed', e);
    return { initialized: false, reason: 'core-load-failed', destroy() {} };
  }
}
