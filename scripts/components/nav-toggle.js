const MQ='(min-width: 769px)';
export function initNavToggle(root=document){
  const navs=[...root.querySelectorAll('.site-nav')];
  for(const nav of navs){
    const btn=nav.querySelector('.nav-toggle');
    const list=nav.querySelector('ul');
    if(!btn||!list) continue;
    if(btn.dataset.bound) continue;
    btn.dataset.bound='1';
    // ensure ids/aria linked
    if(!list.id) list.id='primary-nav';
    btn.setAttribute('aria-controls', list.id);
    const close=()=>{
      nav.classList.remove('nav--open');
      btn.setAttribute('aria-expanded','false');
    };
    const open=()=>{
      nav.classList.add('nav--open');
      btn.setAttribute('aria-expanded','true');
    };
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const isOpen=nav.classList.contains('nav--open');
      if(isOpen) close(); else open();
    });
    // close on link click
    list.addEventListener('click',e=>{
      const a=e.target.closest('a');
      if(a) close();
    });
    // close on Escape
    nav.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&nav.classList.contains('nav--open')){
        close();
        btn.focus();
      }
    });
    // outside click
    document.addEventListener('click',e=>{
      if(!nav.contains(e.target)) close();
    });
    // close when crossing to desktop
    try{
      const m=window.matchMedia(MQ);
      const onChange=ev=>{ if(ev.matches) close(); };
      if(m.addEventListener) m.addEventListener('change', onChange);
      else if(m.addListener) m.addListener(onChange);
    }catch{}
  }
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>initNavToggle(document));
  else initNavToggle(document);
}
export default initNavToggle;
