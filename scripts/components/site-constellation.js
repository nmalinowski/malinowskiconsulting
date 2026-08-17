let _s='idle';
export function initSiteConstellation(canvas, opts={}){
  // gate like bubble.js — respect reduced-motion and low hardware
  try{
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      if(canvas) canvas.setAttribute('data-reduced-motion','true');
      return {state:'reduced-motion', destroy(){}, setMotion(){}};
    }
    if(typeof navigator!=='undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2){
      if(canvas) canvas.setAttribute('data-reduced-motion','true');
      return {state:'low-hardware', destroy(){}, setMotion(){}};
    }
  }catch{}
  let c = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if(!c) return {state:'no-canvas', destroy(){}, setMotion(){}};
  // ensure canvas is in DOM
  if(!canvas.isConnected) document.body.prepend(canvas);
  canvas.setAttribute('aria-hidden','true');
  _s='init';
  let B={accent:'#0550ae'};
  function updAccent(){
    try{
      let v=getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      if(v) B.accent=v;
    }catch{}
  }
  updAccent();
  let dpr = window.devicePixelRatio||1;
  // anchors as viewport ratios — spread across viewport, not document
  let N=[
    {k:'Plan', x:.14, y:.24},
    {k:'Spec', x:.36, y:.14},
    {k:'Build', x:.64, y:.18},
    {k:'Test', x:.84, y:.38},
    {k:'Ship', x:.70, y:.76},
    {k:'Govern', x:.22, y:.74}
  ];
  let S=N.map(()=>({ox:0,oy:0,vx:0,vy:0}));
  let f={x: window.innerWidth*0.5, y: window.innerHeight*0.48, tx: window.innerWidth*0.5, ty: window.innerHeight*0.48, hover:false};
  let raf=null, paused=false;
  let ticks=[];
  function resize(){
    let w=window.innerWidth, h=window.innerHeight;
    dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px';
    canvas.style.height=h+'px';
    if(c.setTransform) c.setTransform(dpr,0,0,dpr,0,0);
    // also update stored f if needed
    // keep tx/ty within bounds
    return true;
  }
  resize();
  let frameTimes=[], stallStart=0;
  function draw(){
    if(paused || _s!=='running') return;
    let t0=performance.now();
    let W=window.innerWidth, H=window.innerHeight;
    // lerp mouse
    let a = f.hover?0.18:0.06;
    f.x += (f.tx - f.x)*a;
    f.y += (f.ty - f.y)*a;
    // physics
    let cl=-1, clD=1e9;
    for(let i=0;i<N.length;i++){
      let n=N[i], s=S[i];
      let ax=n.x*W, ay=n.y*H;
      let cx=ax+s.ox, cy=ay+s.oy;
      s.vx += (ax - cx)*0.11;
      s.vy += (ay - cy)*0.11;
      if(f.hover){
        let dx=f.x - cx, dy=f.y - cy, d=Math.hypot(dx,dy);
        if(d<180 && d>6){
          let str=(1 - d/180)*0.42;
          s.vx += dx*str;
          s.vy += dy*str;
          if(d<clD){clD=d; cl=i;}
        }else if(d<=6){
          s.vx -= dx*0.5; s.vy -= dy*0.5;
        }
      }
      s.vx*=0.78; s.vy*=0.78;
      s.ox+=s.vx*0.55; s.oy+=s.vy*0.55;
      s.ox=Math.max(-60,Math.min(60,s.ox));
      s.oy=Math.max(-44,Math.min(44,s.oy));
    }
    let pts=N.map((n,i)=>({x:n.x*W+S[i].ox, y:n.y*H+S[i].oy, k:n.k}));
    c.clearRect(0,0,W,H);
    // subtle vignette wash behind constellation — very faint
    // draw edges
    c.save();
    c.lineWidth=1.05;
    c.strokeStyle=B.accent+'12'; // ~7% blueprint
    c.beginPath();
    for(let i=0;i<pts.length-1;i++){
      let a=pts[i], b=pts[i+1];
      let mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      let mdx=f.hover?f.x - mx:0, mdy=f.hover?f.y - my:0;
      let d=f.hover?Math.hypot(mdx,mdy):999, inf=f.hover?Math.max(0,1-d/320):0;
      let qx=mx+mdx*0.18*inf, qy=my+mdy*0.18*inf;
      if(i===0) c.moveTo(a.x,a.y);
      c.quadraticCurveTo(qx,qy,b.x,b.y);
    }
    c.stroke();
    // closing edge Govern->Plan dashed brass
    {
      let g=pts[5], p0=pts[0];
      let mx=(g.x+p0.x)/2, my=(g.y+p0.y)/2;
      let mdx=f.hover?f.x - mx:0, mdy=f.hover?f.y - my:0;
      let d=f.hover?Math.hypot(mdx,mdy):999, inf=f.hover?Math.max(0,1-d/340):0;
      let qx=mx+mdx*0.22*inf, qy=my+mdy*0.22*inf;
      c.save();
      c.setLineDash([6,8]);
      c.strokeStyle='#9A7B3A55';
      c.beginPath(); c.moveTo(g.x,g.y); c.quadraticCurveTo(qx,qy,p0.x,p0.y); c.stroke();
      c.restore();
    }
    // hot edges — two nearest
    if(f.hover){
      let best=[-1,-1], bd=[1e9,1e9];
      for(let i=0;i<pts.length-1;i++){
        let mx=(pts[i].x+pts[i+1].x)/2, my=(pts[i].y+pts[i+1].y)/2;
        let d=Math.hypot(f.x-mx,f.y-my);
        if(d<bd[0]){bd[1]=bd[0]; best[1]=best[0]; bd[0]=d; best[0]=i;}
        else if(d<bd[1]){bd[1]=d; best[1]=i;}
      }
      c.strokeStyle=B.accent;
      c.lineWidth=1.45;
      c.globalAlpha=0.88;
      for(let idx of best){
        if(idx<0) continue;
        let bi=best.indexOf(idx);
        if(bd[bi]>200) continue;
        let a=pts[idx], b=pts[idx+1];
        let mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
        let qx=mx+(f.x-mx)*0.20, qy=my+(f.y-my)*0.20;
        c.beginPath(); c.moveTo(a.x,a.y); c.quadraticCurveTo(qx,qy,b.x,b.y); c.stroke();
      }
      c.globalAlpha=1;
    }
    // nodes
    for(let i=0;i<pts.length;i++){
      let p=pts[i], hot=i===cl && clD<100;
      // outer
      c.beginPath(); c.arc(p.x,p.y, hot?7:4.8, 0, Math.PI*2);
      c.fillStyle=hot?B.accent+'1E' : 'rgba(255,255,255,0.96)';
      c.fill();
      c.strokeStyle=hot?B.accent : 'rgba(13,27,62,0.14)';
      c.lineWidth=hot?1.35:1.0;
      c.stroke();
      // inner
      c.beginPath(); c.arc(p.x,p.y, hot?3.0:2.2, 0, Math.PI*2);
      c.fillStyle= hot?B.accent : (p.k==='Build'||p.k==='Govern' ? '#9A7B3A' : B.accent);
      c.fill();
      // label pill
      let lb=p.k.toUpperCase();
      c.font='700 8px ui-monospace, SFMono-Regular, monospace';
      c.textAlign='center'; c.textBaseline='middle';
      let tw=c.measureText(lb).width+10, lx=p.x, ly=p.y + (hot?18:15.5);
      let rx=lx - tw/2, ry=ly - 6.5, rw=tw, rh=13;
      c.fillStyle=hot?B.accent : 'rgba(255,255,255,0.94)';
      c.strokeStyle=hot?B.accent : 'rgba(13,27,62,0.10)';
      if(c.roundRect){
        c.beginPath(); c.roundRect(rx,ry,rw,rh,6); c.fill(); c.stroke();
      }else{
        c.fillRect(rx,ry,rw,rh); c.strokeRect(rx,ry,rw,rh);
      }
      c.fillStyle=hot?'#fff':'#0d1117';
      c.fillText(lb, lx, ly - 0.3);
    }
    c.restore();
    // perf guard — pause if consistently over budget
    let dt=performance.now()-t0;
    frameTimes.push(dt);
    if(frameTimes.length>40) frameTimes.shift();
    if(frameTimes.length>=40){
      let avg=frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length;
      if(avg>16){
        if(!stallStart) stallStart=performance.now();
        if(performance.now()-stallStart>4000 && avg>16.5){
          paused=true; _s='paused'; if(raf) cancelAnimationFrame(raf); return;
        }
      }else stallStart=0;
    }
    raf=requestAnimationFrame(draw);
  }
  _s='running';
  let handlers={};
  handlers.mm=(e)=>{ f.tx=e.clientX; f.ty=e.clientY; f.hover=true; };
  handlers.tm=(e)=>{ let t=e.touches&&e.touches[0]; if(t){ f.tx=t.clientX; f.ty=t.clientY; f.hover=true; }};
  handlers.le=()=>{ f.hover=false; };
  // pause while behind any .hero (home bleed #hero included) — resume when scrolled clear
  let hiddenBehindHero=false;
  let visibleHeroes=new Set();
  let heroObs=null;
  function setBehindHero(next){
    if(next===hiddenBehindHero) return;
    hiddenBehindHero=next;
    canvas.classList.toggle('is-hidden', next);
    if(next){
      paused=true;
      if(raf) cancelAnimationFrame(raf);
      _s='paused-behind-hero';
    }else{
      if(canvas.getAttribute('data-reduced-motion')==='true') return;
      if(document.visibilityState==='hidden') return;
      paused=false;
      _s='running';
      raf=requestAnimationFrame(draw);
    }
  }
  try{
    const heroes=document.querySelectorAll('.hero, .home-header');
    if(heroes.length){
      for(const h of heroes){
        const r=h.getBoundingClientRect();
        if(r.bottom>0 && r.top < window.innerHeight) visibleHeroes.add(h);
      }
      if(visibleHeroes.size) setBehindHero(true);
      heroObs=new IntersectionObserver((entries)=>{
        for(const e of entries){
          if(e.isIntersecting) visibleHeroes.add(e.target);
          else visibleHeroes.delete(e.target);
        }
        setBehindHero(visibleHeroes.size>0);
      },{threshold:0, rootMargin:'0px'});
      heroes.forEach(h=>heroObs.observe(h));
    }
  }catch{}
  handlers.vis=()=>{
    let hid=document.visibilityState==='hidden';
    if(hid){ paused=true; if(raf) cancelAnimationFrame(raf); if(!hiddenBehindHero) _s='paused'; }
    else if(!hiddenBehindHero && (_s==='paused' || _s==='paused-behind-hero')){ _s='running'; paused=false; raf=requestAnimationFrame(draw); }
  };
  handlers.rs=()=>{ resize(); };
  handlers.mo=(e)=>{ if(e.matches){ paused=true; _s='reduced-motion'; canvas.setAttribute('data-reduced-motion','true'); if(raf) cancelAnimationFrame(raf);} else { canvas.removeAttribute('data-reduced-motion'); if(hiddenBehindHero){ _s='paused-behind-hero'; paused=true; } else { paused=false; _s='running'; raf=requestAnimationFrame(draw);} } };
  window.addEventListener('mousemove', handlers.mm);
  window.addEventListener('touchmove', handlers.tm, {passive:true});
  window.addEventListener('mouseleave', handlers.le);
  document.addEventListener('visibilitychange', handlers.vis);
  window.addEventListener('resize', handlers.rs);
  let mq=null;
  try{ mq=window.matchMedia('(prefers-reduced-motion: reduce)'); mq.addEventListener('change', handlers.mo);}catch{}
  let ro=null;
  try{ ro=new ResizeObserver(()=>resize()); ro.observe(document.documentElement);}catch{}
  let mo=null;
  try{ mo=new MutationObserver(()=>updAccent()); mo.observe(document.documentElement,{attributes:true, attributeFilter:['data-theme']});}catch{}
  raf=requestAnimationFrame(draw);
  function setMotion(on){
    if(!on){ _s='reduced-motion'; paused=true; if(raf) cancelAnimationFrame(raf); canvas.setAttribute('data-reduced-motion','true'); canvas.style.display='none'; }
    else {
      canvas.removeAttribute('data-reduced-motion'); canvas.style.display='block'; updAccent(); resize();
      if(hiddenBehindHero){ _s='paused-behind-hero'; paused=true; canvas.classList.add('is-hidden'); }
      else { _s='running'; paused=false; canvas.classList.remove('is-hidden'); raf=requestAnimationFrame(draw); }
    }
  }
  function destroy(){
    paused=true; _s='idle'; if(raf) cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', handlers.mm);
    window.removeEventListener('touchmove', handlers.tm);
    window.removeEventListener('mouseleave', handlers.le);
    document.removeEventListener('visibilitychange', handlers.vis);
    window.removeEventListener('resize', handlers.rs);
    try{ mq&&mq.removeEventListener('change', handlers.mo);}catch{}
    try{ ro&&ro.disconnect();}catch{}
    try{ mo&&mo.disconnect();}catch{}
    try{ heroObs&&heroObs.disconnect();}catch{}
    visibleHeroes.clear();
  }
  return {state:_s, destroy, setMotion, initialized:true, reason:'running'};
}
export default initSiteConstellation;

// auto-boot if canvas already in DOM
try{
  let el=document.getElementById('site-constellation');
  if(el) initSiteConstellation(el);
}catch{}
