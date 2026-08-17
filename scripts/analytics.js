// Malinowski Consulting — Analytics loader (U1-Foundation)
// FS-3 | BR4.1-4.5 | NFR5.1-5.3 | NFR-SEC-1/3/4 | TSD-4
import { PROJECT_KEY, API_HOST } from './analytics.config.js';

const NAME_RE = /^[a-z_][a-z0-9_]{0,63}$/;
const HOST = API_HOST || 'https://us.i.posthog.com';
const SCRIPT_SRC = 'https://us.i.posthog.com/static/array.js';

function dntActive() {
  try {
    return (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1' ||
      navigator.globalPrivacyControl === true
    );
  } catch (_) { return false; }
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;
}

// Ensure stub exists so downstream track() never throws (FS-3 idle guard)
if (!window.analytics) {
  window.analytics = { track() {}, identify() {} };
} else {
  if (typeof window.analytics.track !== 'function') window.analytics.track = function () {};
  if (typeof window.analytics.identify !== 'function') window.analytics.identify = function () {};
}

function sanitizeProps(props) {
  if (props == null) return {};
  if (!isPlainObject(props)) { console.warn('[analytics] props must be a plain object'); return {}; }
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    else console.warn('[analytics] dropping non-primitive prop: ' + k);
  }
  return out;
}

function initialise() {
  const ph = window.posthog;
  if (!ph || typeof ph.init !== 'function') return;
  ph.init(PROJECT_KEY, {
    api_host: HOST,
    capture_pageview: true,
    capture_pageleave: true,
    disable_compression: true,
    person_profiles: 'never',
    disable_session_recording: true
  });
  window.analytics = {
    track(name, props) {
      if (typeof name !== 'string' || !NAME_RE.test(name)) { console.warn('[analytics] invalid event name: ' + name); return; }
      const clean = sanitizeProps(props);
      ph.capture(name, clean);
    },
    identify() {}
  };
}

export function boot() {
  if (dntActive()) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = SCRIPT_SRC;
  s.addEventListener('load', initialise);
  document.head.appendChild(s);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
