// Malinowski Consulting — Theme module (U1-Foundation)
// FS-1 boot + FS-2 toggle | BR2.1-2.7 | TSD-7 SLI marks
export const STORAGE_KEY = 'mc.theme';
export const VALID = new Set(['light', 'dark', 'auto']);

export function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (VALID.has(raw)) return raw;
  } catch (_) {}
  return 'auto';
}

function syncToggleUi(choice) {
  for (const btn of document.querySelectorAll('[data-option]')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.option === choice));
  }
}

let _autoMedia = null;
let _autoListener = null;
function resolveAuto() {
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
}
function applyChoice(choice) {
  const resolved = choice === 'auto' ? resolveAuto() : choice;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.setAttribute('data-theme-choice', choice);
  syncToggleUi(choice);
}
function watchAuto(enable) {
  try {
    if (enable) {
      if (!_autoMedia) _autoMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (!_autoListener) _autoListener = () => applyChoice('auto');
      _autoMedia.addEventListener('change', _autoListener);
    } else if (_autoMedia && _autoListener) {
      _autoMedia.removeEventListener('change', _autoListener);
    }
  } catch {}
}
export function bootTheme() {
  try { performance.mark('theme-boot-start'); } catch (_) {}
  const choice = readStored();
  applyChoice(choice);
  watchAuto(choice === 'auto');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => syncToggleUi(choice), { once: true });
  } else {
    syncToggleUi(choice);
  }
  try {
    performance.mark('theme-boot-end');
    performance.measure('theme-boot', 'theme-boot-start', 'theme-boot-end');
    const e = performance.getEntriesByName('theme-boot').pop();
    if (e && e.duration > 5) console.info('theme-boot budget exceeded', e.duration);
  } catch (_) {}
}

export function setTheme(choice) {
  if (!VALID.has(choice)) return;
  applyChoice(choice);
  watchAuto(choice === 'auto');
  try { localStorage.setItem(STORAGE_KEY, choice); } catch (_) {}
}
