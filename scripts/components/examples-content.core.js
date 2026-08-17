// ExamplesContent core — render + filter + highlight + analytics (U4)
// No innerHTML — textContent only | DocumentFragment single reflow | perf marks SLI-4.3

export function renderWorkflowCards(workflows) {
  try { performance.mark('render-start'); } catch (_) {}
  var grid = document.getElementById('workflow-grid');
  if (!grid) return;
  grid.textContent = '';
  var frag = document.createDocumentFragment();
  for (var i = 0; i < workflows.length; i++) {
    var w = workflows[i];
    var card = document.createElement('article');
    card.className = 'workflow-card';
    card.id = w.id;
    card.setAttribute('data-workflow', w.id);
    card.setAttribute('data-industry', w.industry);

    var h3 = document.createElement('h3');
    h3.className = 'workflow-card__title';
    h3.textContent = w.title;
    card.appendChild(h3);

    var sum = document.createElement('p');
    sum.className = 'workflow-card__summary';
    sum.id = w.id + '-summary';
    sum.textContent = w.summary;
    card.appendChild(sum);

    var suit = document.createElement('p');
    suit.className = 'workflow-card__suitability';
    var suitLabel = document.createElement('span');
    suitLabel.className = 'workflow-card__suitability-label';
    suitLabel.textContent = 'AI suitability: ';
    var suitVal = document.createElement('span');
    suitVal.className = 'workflow-card__suitability-value';
    suitVal.setAttribute('data-suitability', w.ai_suitability);
    suitVal.textContent = w.ai_suitability.replace('_', ' ');
    suit.appendChild(suitLabel);
    suit.appendChild(suitVal);
    card.appendChild(suit);

    var roi = document.createElement('div');
    roi.className = 'workflow-card__roi';
    roi.setAttribute('data-roi-kind', w.roi.kind);
    var roiDisplay = document.createElement('p');
    roiDisplay.textContent = w.roi.display;
    var roiNote = document.createElement('p');
    roiNote.className = 'workflow-card__roi-note';
    roiNote.textContent = w.roi.note;
    roi.appendChild(roiDisplay);
    roi.appendChild(roiNote);
    card.appendChild(roi);

    var altWrap = document.createElement('div');
    altWrap.className = 'workflow-card__alternatives';
    var altLabel = document.createElement('p');
    altLabel.className = 'workflow-card__alternatives-label';
    altLabel.textContent = 'Cheaper, less risky alternatives:';
    altWrap.appendChild(altLabel);
    var ul = document.createElement('ul');
    for (var j = 0; j < w.alternatives.length; j++) {
      var li = document.createElement('li');
      li.textContent = w.alternatives[j];
      ul.appendChild(li);
    }
    altWrap.appendChild(ul);
    card.appendChild(altWrap);

    var anchor = document.createElement('a');
    anchor.className = 'workflow-card__anchor';
    anchor.href = w.deepLinkHref;
    anchor.setAttribute('aria-describedby', w.id + '-summary');
    anchor.textContent = 'Read more';
    card.appendChild(anchor);

    frag.appendChild(card);
  }
  grid.appendChild(frag);
  try {
    performance.mark('render-end');
    performance.measure('render-cards', 'render-start', 'render-end');
    var e = performance.getEntriesByName('render-cards').pop();
    if (e && e.duration > 100) console.info('render-cards budget exceeded', e.duration);
  } catch (_) {}
}

export function trackWorkflowClicks(workflows) {
  var cards = document.querySelectorAll('[data-workflow]');
  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      var link = card.querySelector('a[href]');
      if (!link) return;
      var wid = card.getAttribute('data-workflow') || '';
      var ind = card.getAttribute('data-industry') || '';
      link.addEventListener('click', function () {
        try { window.analytics.track?.('examples_workflow_click', { workflow_id: wid, industry: ind }); } catch (e) { console.warn('analytics track failed', e); }
      });
    })(cards[i]);
  }
}

export function filterByIndustry(industryId) {
  var cards = document.querySelectorAll('[data-workflow]');
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var matches = industryId === 'all' || card.getAttribute('data-industry') === industryId;
    if (reduce) {
      card.hidden = !matches;
      card.classList.toggle('is-hidden', !matches);
    } else {
      card.hidden = false;
      card.classList.toggle('is-hidden', !matches);
    }
  }
}

export function highlightCard(workflowId) {
  var card = document.getElementById(workflowId);
  if (!card) return;
  try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) { try { card.scrollIntoView(); } catch (_) {} }
  card.setAttribute('data-anchor-highlight', '');
  setTimeout(function () { try { card.removeAttribute('data-anchor-highlight'); } catch (_) {} }, 2000);
}
