import { filterByIndustry, highlightCard } from './examples-content.core.js';
import { WORKFLOWS } from './examples-content.data.js';

var VALID_INDUSTRIES = ['healthcare', 'finance', 'other'];
var WF_SET = new Set(WORKFLOWS.map(function (w) { return w.id; }));
var pendingAnnounce = null;

export function parseHash(hash) {
  var h = (hash || '').replace(/^#/, '');
  if (!h) return { kind: 'none' };
  var m = h.match(/industry=([a-z]+)/);
  if (m) {
    var v = m[1];
    if (VALID_INDUSTRIES.indexOf(v) !== -1) return { kind: 'industry', value: v };
    return { kind: 'none' };
  }
  var w = h.match(/^(wf-[a-z0-9-]+)$/);
  if (w) {
    var slug = w[1];
    if (WF_SET.has(slug)) return { kind: 'workflow', value: slug };
    return { kind: 'none' };
  }
  return { kind: 'none' };
}

export function applyHashOnLoad(parsed) {
  if (!parsed) parsed = { kind: 'none' };
  if (parsed.kind === 'industry') setActiveChip(parsed.value);
  else if (parsed.kind === 'workflow') { setActiveChip('all'); highlightCard(parsed.value); }
  else setActiveChip('all');
}

function setActiveChip(id) {
  var chips = document.querySelectorAll('[role="tab"]');
  for (var i = 0; i < chips.length; i++) {
    var c = chips[i];
    var cid = c.getAttribute('data-industry') || '';
    var active = cid === id;
    c.setAttribute('aria-selected', active ? 'true' : 'false');
    c.setAttribute('tabindex', active ? '0' : '-1');
  }
  filterByIndustry(id);
  announceFilterChange(id);
}

export function onChipActivate(activatedChipId) {
  var activeEl = document.querySelector('[role="tab"][aria-selected="true"]');
  var activeId = activeEl ? activeEl.getAttribute('data-industry') : null;
  if (activeId === activatedChipId) return;
  try { performance.mark('chip-activate-start'); } catch (_) {}
  var chips = document.querySelectorAll('[role="tab"]');
  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i];
    var isActive = chip.getAttribute('data-industry') === activatedChipId;
    chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
    chip.setAttribute('tabindex', isActive ? '0' : '-1');
  }
  var hash = activatedChipId === 'all' ? '' : 'industry=' + activatedChipId;
  try { history.replaceState(null, '', location.pathname + location.search + (hash ? '#' + hash : '')); } catch (_) {}
  filterByIndustry(activatedChipId);
  announceFilterChange(activatedChipId);
  try {
    var payload = activatedChipId === 'all' ? { filter_action: 'clear' } : { industry: activatedChipId };
    window.analytics.track?.('examples_filter_use', payload);
  } catch (e) { console.warn('analytics track failed', e); }
  try {
    performance.mark('chip-activate-end');
    performance.measure('chip-activate', 'chip-activate-start', 'chip-activate-end');
    var e2 = performance.getEntriesByName('chip-activate').pop();
    if (e2 && e2.duration > 50) console.info('chip-activate budget exceeded', e2.duration);
  } catch (_) {}
}

export function renderChips(containerEl, industries) {
  if (!containerEl) return;
  containerEl.textContent = '';
  containerEl.setAttribute('role', 'tablist');
  containerEl.setAttribute('aria-label', 'Industry filter');
  if (!containerEl.classList.contains('examples-filter')) containerEl.classList.add('examples-filter');
  var list = [{ id: 'all', label: 'All' }].concat(industries || []);
  for (var i = 0; i < list.length; i++) {
    var ind = list[i];
    var btn = document.createElement('button');
    btn.className = 'examples-filter__chip';
    btn.setAttribute('role', 'tab');
    btn.id = 'chip-' + ind.id;
    btn.setAttribute('aria-selected', ind.id === 'all' ? 'true' : 'false');
    btn.setAttribute('aria-controls', 'workflow-grid');
    btn.setAttribute('aria-describedby', 'filter-live');
    btn.setAttribute('tabindex', ind.id === 'all' ? '0' : '-1');
    btn.setAttribute('data-industry', ind.id);
    btn.type = 'button';
    btn.textContent = ind.label;
    containerEl.appendChild(btn);
  }
  var live = document.getElementById('filter-live');
  if (!live) {
    live = document.createElement('div');
    live.id = 'filter-live';
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    containerEl.insertAdjacentElement('afterend', live);
  }
}

export function announceFilterChange(activeFilter) {
  function run() {
    pendingAnnounce = null;
    var live = document.getElementById('filter-live');
    if (!live) return;
    var count = 0;
    try { count = document.querySelectorAll('[data-workflow]:not(.is-hidden):not([hidden])').length; } catch (_) { count = document.querySelectorAll('[data-workflow]').length; }
    if (!count) {
      var cards = document.querySelectorAll('[data-workflow]');
      for (var i = 0; i < cards.length; i++) { if (!cards[i].hidden && !cards[i].classList.contains('is-hidden')) count++; }
    }
    var label = activeFilter === 'all' ? 'all' : activeFilter;
    live.textContent = 'Showing ' + count + ' ' + label + ' workflow' + (count === 1 ? '' : 's') + '.';
  }
  if (pendingAnnounce) cancelAnimationFrame(pendingAnnounce);
  try { pendingAnnounce = requestAnimationFrame(run); } catch (_) { run(); }
}

function focusChip(chips, idx) {
  if (idx < 0) idx = chips.length - 1;
  if (idx >= chips.length) idx = 0;
  for (var i = 0; i < chips.length; i++) chips[i].setAttribute('tabindex', i === idx ? '0' : '-1');
  try { chips[idx].focus(); } catch (_) {}
}

export function initExamplesFilter(workflows) {
  var filterEl = document.querySelector('[data-examples-filter]');
  if (!filterEl) return;
  var parsed = parseHash(location.hash);
  applyHashOnLoad(parsed);

  var chips = filterEl.querySelectorAll('[role="tab"]');
  for (var i = 0; i < chips.length; i++) {
    (function (chip) {
      chip.addEventListener('click', function () {
        var id = chip.getAttribute('data-industry') || 'all';
        onChipActivate(id);
      });
      chip.addEventListener('keydown', function (e) {
        var id = chip.getAttribute('data-industry') || 'all';
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChipActivate(id); return; }
        var list = Array.prototype.slice.call(filterEl.querySelectorAll('[role="tab"]'));
        var idx = list.indexOf(chip);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          focusChip(list, e.key === 'ArrowRight' ? idx + 1 : idx - 1);
        } else if (e.key === 'Home') { e.preventDefault(); focusChip(list, 0); }
        else if (e.key === 'End') { e.preventDefault(); focusChip(list, list.length - 1); }
      });
    })(chips[i]);
  }

  window.addEventListener('hashchange', function () {
    var p = parseHash(location.hash);
    applyHashOnLoad(p);
  });
  window.addEventListener('popstate', function () {
    var p2 = parseHash(location.hash);
    applyHashOnLoad(p2);
  });
}
