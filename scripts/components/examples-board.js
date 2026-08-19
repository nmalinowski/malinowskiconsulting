import { WORKFLOWS, INDUSTRIES } from './examples-content.data.js';

const INDUSTRIES_ALL = [{ id: 'all', label: 'All' }, ...INDUSTRIES];
const SUITS = [
  { id: 'all', label: 'All fits' },
  { id: 'good_fit', label: 'Good fit' },
  { id: 'context_dependent', label: 'Context-dependent' },
  { id: 'poor_fit', label: 'Poor fit' }
];
const SUIT_RANK = { good_fit: 2, context_dependent: 1, poor_fit: 0 };
const SUIT_LABEL = { good_fit: 'Good fit', context_dependent: 'Context-dependent', poor_fit: 'Poor fit' };

function parsePayback(display){
  const m = String(display).match(/(\d+)\s*[–—-]\s*(\d+)/);
  if(m) return (parseInt(m[1],10)+parseInt(m[2],10))/2;
  const s = String(display).match(/(\d+)/);
  if(s) return parseInt(s[1],10);
  return 9.5;
}
function paybackLabel(d){
  const m = String(d).match(/(\d+\s*[–—-]\s*\d+\s*months?|Limited[^.]*\.)/i);
  return m ? m[0] : d;
}

let state = { industry: 'all', suit: 'all', q: '', sort: 'industry' };
let filtered = [...WORKFLOWS];

const grid = document.getElementById('workflow-grid');
const countEl = document.getElementById('examples-count');
const liveEl = document.getElementById('filter-live');
const searchEl = document.getElementById('examples-search');
const sortEl = document.getElementById('examples-sort');
const indChips = document.getElementById('industry-chips');
const suitChips = document.getElementById('suit-chips');
const canvas = document.getElementById('strategy-canvas');
const tooltip = document.getElementById('strategy-tooltip');

// Modal elements
let modal = null;
let modalBackdrop = null;
let modalPanel = null;
let modalClose = null;
let lastFocused = null;

function initModal(){
  if(modal) return;
  modal = document.createElement('div');
  modal.className = 'workflow-modal';
  modal.innerHTML = `
    <div class="workflow-modal__backdrop"></div>
    <div class="workflow-modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="workflow-modal__header">
        <div></div>
        <button class="workflow-modal__close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="workflow-modal__body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modalBackdrop = modal.querySelector('.workflow-modal__backdrop');
  modalPanel = modal.querySelector('.workflow-modal__panel');
  modalClose = modal.querySelector('.workflow-modal__close');

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', onModalKeydown);
}

function openModal(w){
  initModal();
  lastFocused = document.activeElement;

  const indLabel = INDUSTRIES.find(x=>x.id===w.industry)?.label || w.industry;
  const suitLabel = SUIT_LABEL[w.ai_suitability] || w.ai_suitability;
  const mid = parsePayback(w.roi.display);
  const pct = Math.max(8, Math.min(96, ((10-mid)/9)*100));

  const body = modal.querySelector('.workflow-modal__body');
  body.innerHTML = `
    <span class="workflow-modal__industry" data-industry="${w.industry}"><i aria-hidden="true"></i> ${indLabel}</span>
    <span class="workflow-modal__suit" data-suit="${w.ai_suitability}">${suitLabel}</span>
    <h2 id="modal-title" class="workflow-modal__title">${w.title}</h2>
    <p class="workflow-modal__summary">${w.summary}</p>
    <div class="workflow-modal__section">
      <div class="workflow-modal__section-title">Payback</div>
      <div class="workflow-modal__roi">
        <div class="workflow-modal__roi-bar"><div class="workflow-modal__roi-fill" style="width:${pct}%"></div></div>
        <p class="workflow-modal__roi-note">${paybackLabel(w.roi.display)} — ${w.roi.note}</p>
      </div>
    </div>
    <div class="workflow-modal__section workflow-modal__alternatives">
      <div class="workflow-modal__section-title">Programmatic Alternatives</div>
      <ul>${w.alternatives.map(a=>`<li>${a}</li>`).join('')}</ul>
    </div>
  `;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal(){
  if(!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  if(lastFocused) lastFocused.focus();
  lastFocused = null;
}

function onModalKeydown(e){
  if(!modal || !modal.classList.contains('is-open')) return;
  if(e.key === 'Escape'){ closeModal(); }
  if(e.key === 'Tab'){
    const focusable = modalPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
}

function renderChips(container, items, active, kind){
  container.textContent='';
  container.setAttribute('role','tablist');
  for(const it of items){
    const b=document.createElement('button');
    b.type='button';
    b.className='examples-filter__chip' + (kind==='suit' && it.id!=='all' ? ' examples-filter__chip--'+it.id.replace('_','-') : '');
    b.setAttribute('role','tab');
    b.setAttribute('aria-selected', String(it.id===active));
    b.setAttribute('data-id', it.id);
    b.setAttribute('data-kind', kind);
    b.textContent=it.label;
    b.addEventListener('click', ()=>{ state[kind==='industry'?'industry':'suit']=it.id; apply(); });
    container.appendChild(b);
  }
}

function matches(w){
  if(state.industry!=='all' && w.industry!==state.industry) return false;
  if(state.suit!=='all' && w.ai_suitability!==state.suit) return false;
  if(state.q){
    const q=state.q.toLowerCase();
    const hay=[w.title,w.summary,w.industry,w.ai_suitability,...w.alternatives].join(' ').toLowerCase();
    if(!hay.includes(q)) return false;
  }
  return true;
}
function sortFn(a,b){
  if(state.sort==='payback') return parsePayback(a.roi.display)-parsePayback(b.roi.display);
  if(state.sort==='suitability') return (SUIT_RANK[b.ai_suitability]||0)-(SUIT_RANK[a.ai_suitability]||0);
  if(state.sort==='title') return a.title.localeCompare(b.title);
  // industry then title
  if(a.industry!==b.industry) return a.industry.localeCompare(b.industry);
  return a.title.localeCompare(b.title);
}

function renderCards(){
  filtered = WORKFLOWS.filter(matches).sort(sortFn);
  grid.textContent='';
  const frag=document.createDocumentFragment();
  for(const w of filtered){
    const card=document.createElement('article');
    card.className='workflow-card';
    card.id=w.id;
    card.setAttribute('data-workflow', w.id);
    card.setAttribute('data-industry', w.industry);
    card.setAttribute('data-suit', w.ai_suitability);
    card.tabIndex=0;

    const top=document.createElement('div'); top.className='workflow-card__top';
    const ind=document.createElement('span'); ind.className='workflow-card__industry'; ind.setAttribute('data-industry', w.industry);
    const dot=document.createElement('i'); dot.setAttribute('aria-hidden','true');
    ind.appendChild(dot); ind.appendChild(document.createTextNode(' '+(INDUSTRIES.find(x=>x.id===w.industry)?.label||w.industry)));
    const suit=document.createElement('span'); suit.className='workflow-card__suit'; suit.setAttribute('data-suit', w.ai_suitability);
    suit.textContent=SUIT_LABEL[w.ai_suitability]||w.ai_suitability;
    top.appendChild(ind); top.appendChild(suit);
    card.appendChild(top);

    const h3=document.createElement('h3'); h3.className='workflow-card__title'; h3.textContent=w.title; card.appendChild(h3);
    const p=document.createElement('p'); p.className='workflow-card__summary'; p.textContent=w.summary; card.appendChild(p);

    const roi=document.createElement('div'); roi.className='workflow-card__roi';
    const bar=document.createElement('div'); bar.className='workflow-card__roi-bar';
    const fill=document.createElement('div'); fill.className='workflow-card__roi-fill';
    const mid=parsePayback(w.roi.display);
    const pct=Math.max(8, Math.min(96, ((10-mid)/9)*100));
    fill.style.width=pct+'%';
    fill.style.opacity = w.ai_suitability==='good_fit' ? '1' : w.ai_suitability==='context_dependent' ? '.72' : '.38';
    bar.appendChild(fill); roi.appendChild(bar);
    const note=document.createElement('p'); note.className='workflow-card__roi-note';
    note.textContent=paybackLabel(w.roi.display)+' — '+w.roi.note;
    roi.appendChild(note); card.appendChild(roi);

    const alt=document.createElement('div'); alt.className='workflow-card__alt';
    const altL=document.createElement('div'); altL.className='workflow-card__alt-label'; altL.textContent='Programmatic alternative';
    const ul=document.createElement('ul');
    for(const a of w.alternatives){ const li=document.createElement('li'); li.textContent=a; ul.appendChild(li); }
    alt.appendChild(altL); alt.appendChild(ul); card.appendChild(alt);

    const a=document.createElement('a'); a.className='workflow-card__anchor'; a.href='#'; a.textContent='Open';
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      try{ window.analytics.track?.('examples_workflow_click', { workflow_id:w.id, industry:w.industry }); }catch{}
      openModal(w);
    });
    card.appendChild(a);
    card.addEventListener('click', (e)=>{
      if(e.target.closest('a')) return;
      openModal(w);
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){ openModal(w); }
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){ location.hash=w.id; }
    });
    frag.appendChild(card);
  }
  grid.appendChild(frag);
  // count
  const n=filtered.length;
  if(countEl) countEl.innerHTML='<strong>'+n+'</strong> showing';
  if(liveEl) liveEl.textContent='Showing '+n+' '+(state.industry==='all'?'':state.industry+' ')+(state.suit==='all'?'':SUIT_LABEL[state.suit]+' ')+'workflow'+(n===1?'':'s')+'.';
  drawMap();
}

function apply(){
  renderChips(indChips, INDUSTRIES_ALL, state.industry, 'industry');
  renderChips(suitChips, SUITS, state.suit, 'suit');
  renderCards();
  const h = state.industry==='all' ? '' : 'industry='+state.industry;
  try{ history.replaceState(null,'', location.pathname+location.search+(h?'#'+h:'')); }catch{}
}

// Canvas map
let dpr=1; let points=[]; let hover=null;
function drawMap(){
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  if(!ctx) return;
  const rect=canvas.getBoundingClientRect();
  const w=rect.width||900; const h=rect.height||340;
  dpr=window.devicePixelRatio||1;
  canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
  canvas.style.width=w+'px'; canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);

  // grid
  ctx.strokeStyle='rgba(13,17,23,0.08)';
  ctx.lineWidth=1;
  for(let i=1;i<4;i++){ const x=(w-80)*(i/4)+40; ctx.beginPath(); ctx.moveTo(x,30); ctx.lineTo(x,h-40); ctx.stroke(); }
  for(let i=1;i<3;i++){ const y=30+(h-70)*(i/3); ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(w-40,y); ctx.stroke(); }

  // axes labels
  ctx.fillStyle='rgba(13,17,23,0.55)'; ctx.font='10px ui-monospace, monospace'; ctx.textAlign='center';
  ctx.fillText('Payback → (months)', w/2, h-14);
  ctx.save(); ctx.translate(14, h/2); ctx.rotate(-Math.PI/2); ctx.fillText('AI fit ↑', 0, 0); ctx.restore();
  ctx.textAlign='left'; ctx.fillStyle='rgba(13,17,23,0.45)'; ctx.fillText('1–3', 40, h-22); ctx.textAlign='right'; ctx.fillText('9–12 / limited', w-40, h-22);
  ctx.textAlign='left'; ctx.fillText('poor', 44, 38); ctx.textAlign='right'; ctx.fillText('good', w-44, 38);

  // points
  points=[];
  const padX=40, padY=30, plotW=w-80, plotH=h-70;
  for(const wflow of WORKFLOWS){
    const isVisible = filtered.some(f=>f.id===wflow.id);
    const mid=parsePayback(wflow.roi.display);
    const xNorm = Math.max(0, Math.min(1, (mid-1)/9));
    const yNorm = (SUIT_RANK[wflow.ai_suitability]||0)/2;
    const x=padX + xNorm*plotW;
    const y=padY + (1 - yNorm)*plotH; // good at top
    const r = wflow.ai_suitability==='good_fit' ? 9 : wflow.ai_suitability==='poor_fit' ? 6 : 7.5;
    points.push({ x, y, r, w:wflow, visible:isVisible });
    // glow
    if(isVisible){
      ctx.beginPath(); ctx.arc(x,y,r+7,0,Math.PI*2); ctx.fillStyle='rgba(5,80,174,0.07)'; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    const col = wflow.industry==='healthcare' ? '#0a7a6a' : wflow.industry==='finance' ? '#6b3fd6' : '#9a6700';
    ctx.fillStyle = isVisible ? col : 'rgba(120,120,120,0.28)';
    ctx.fill();
    ctx.strokeStyle = isVisible ? 'white' : 'rgba(255,255,255,0.6)';
    ctx.lineWidth=1.5; ctx.stroke();
    if(hover && hover.w.id===wflow.id){
      ctx.beginPath(); ctx.arc(x,y,r+10,0,Math.PI*2); ctx.strokeStyle='rgba(5,80,174,0.45)'; ctx.lineWidth=1.2; ctx.stroke();
    }
  }
}

function hitTest(mx,my){
  for(const p of points){ const d=Math.hypot(mx-p.x, my-p.y); if(d<=p.r+9) return p; }
  return null;
}
function showTip(p, clientX, clientY){
  if(!p || !tooltip) return;
  tooltip.textContent = p.w.title + ' — ' + SUIT_LABEL[p.w.ai_suitability] + ' • ' + paybackLabel(p.w.roi.display);
  tooltip.style.left = clientX+'px'; tooltip.style.top = clientY+'px';
  tooltip.classList.add('is-visible'); tooltip.setAttribute('aria-hidden','false');
}
function hideTip(){ if(tooltip){ tooltip.classList.remove('is-visible'); tooltip.setAttribute('aria-hidden','true'); } }

if(canvas){
  canvas.addEventListener('mousemove', (e)=>{
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const p=hitTest(mx,my);
    canvas.style.cursor = p ? 'pointer' : 'crosshair';
    if(p!==hover){ hover=p; drawMap(); }
    if(p) showTip(p, e.clientX, e.clientY); else hideTip();
  });
  canvas.addEventListener('mouseleave', ()=>{ hover=null; hideTip(); drawMap(); canvas.style.cursor='crosshair'; });
  canvas.addEventListener('click', (e)=>{
    const rect=canvas.getBoundingClientRect();
    const p=hitTest(e.clientX-rect.left, e.clientY-rect.top);
    if(p){ openModal(p.w); }
  });
  let dragging=false;
  canvas.addEventListener('mousedown', ()=> dragging=true);
  window.addEventListener('mouseup', ()=> dragging=false);
  canvas.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    const rect=canvas.getBoundingClientRect();
    const p=hitTest(e.clientX-rect.left, e.clientY-rect.top);
    if(p) showTip(p, e.clientX, e.clientY);
  });
  window.addEventListener('resize', drawMap);
}

if(searchEl){
  searchEl.addEventListener('input', ()=>{ state.q=searchEl.value.trim(); renderCards(); });
}
if(sortEl){
  sortEl.addEventListener('change', ()=>{ state.sort=sortEl.value; renderCards(); });
}

// hash deep-link on load
function handleHash(){
  const h=(location.hash||'').replace('#','');
  if(!h) return;
  if(h.startsWith('industry=')){ const v=h.split('=')[1]; if(['healthcare','finance','other'].includes(v)) state.industry=v; }
  else if(h.startsWith('wf-')){
    const w = WORKFLOWS.find(x=>x.id===h);
    if(w) openModal(w);
  }
}
window.addEventListener('hashchange', handleHash);

// init
renderChips(indChips, INDUSTRIES_ALL, state.industry, 'industry');
renderChips(suitChips, SUITS, state.suit, 'suit');
if(location.hash.includes('industry=')) handleHash();
renderCards();
try{ window.analytics.track?.('examples_page_view', {});}catch{}

let ro; try{ ro=new ResizeObserver(()=> drawMap()); ro.observe(canvas);}catch{}
