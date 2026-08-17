import { WORKFLOWS, INDUSTRIES } from './examples-content.data.js';
import { renderWorkflowCards, trackWorkflowClicks, filterByIndustry, highlightCard } from './examples-content.core.js';

export { WORKFLOWS, INDUSTRIES };
export { renderWorkflowCards, trackWorkflowClicks, filterByIndustry, highlightCard };

document.addEventListener('DOMContentLoaded', function () {
  renderWorkflowCards(WORKFLOWS);
  trackWorkflowClicks(WORKFLOWS);
});
