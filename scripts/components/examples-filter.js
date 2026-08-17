import { initExamplesFilter, renderChips } from './examples-filter.core.js';
import { WORKFLOWS, INDUSTRIES } from './examples-content.data.js';
import { renderWorkflowCards, trackWorkflowClicks } from './examples-content.core.js';

document.addEventListener('DOMContentLoaded', function () {
  renderWorkflowCards(WORKFLOWS);
  var filterEl = document.querySelector('[data-examples-filter]');
  renderChips(filterEl, INDUSTRIES);
  initExamplesFilter(WORKFLOWS);
  trackWorkflowClicks(WORKFLOWS);
  try { window.analytics.track?.('examples_page_view', {}); } catch (e) { console.warn('analytics track failed', e); }
});
