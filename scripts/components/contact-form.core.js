const K='mc.contact.lastSubmit',W=3e4,R=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,B=/[<>&"']/,OK="Thanks — I'll be in touch within 1 business day.",RL='Please wait a bit before sending another message.',CB='Please confirm the privacy consent before sending.',HC='Please complete the verification.';
export function initContactForm(f,o={}){
let s='idle',a=null,ep=o.endpoint||f.getAttribute('action')||f.dataset.endpoint||'https://api.web3forms.com/submit',st=f.querySelector('[data-status],.contact-form__status,output,[role="status"]');
if(!st){st=document.createElement('output');st.className='contact-form__status';st.setAttribute('aria-live','polite');f.appendChild(st);}
const tr=(n,p)=>{try{if(window.analytics?.track)window.analytics.track(n,p);}catch{}};
function setSt(v,m){s=v;st.dataset.state=v;st.textContent=m||'';if(v!=='idle'&&v!=='submitting')try{st.focus();}catch{}}
function eFor(i){return document.getElementById(i.getAttribute('aria-describedby'))||document.getElementById(i.id+'-err');}
function setE(i,m){const v=!!m;i.setAttribute('aria-invalid',String(v));const e=eFor(i);if(e){e.textContent=m||'';e.dataset.shown=v?'true':'false';}}
function rst(){for(const i of f.querySelectorAll('input,textarea,select')){if(i.name==='botcheck'||i.name==='website'||i.name==='company_url'||i.type==='hidden')continue;i.setAttribute('aria-invalid','false');const e=eFor(i);if(e){e.textContent='';e.dataset.shown='false';}}const c=document.getElementById('cf-consent-err');if(c){c.textContent='';c.dataset.shown='false';}const he=document.getElementById('hcaptcha-err');if(he){he.textContent='';he.dataset.shown='false';}}
function vF(i){let m='';if(i.name==='name'){const t=i.value.trim();if(!t)m='Required.';else if(t.length>100)m='Max 100.';else if(B.test(t))m='Invalid chars.';}
else if(i.name==='email'){const t=i.value.trim();if(!t)m='Required.';else if(!R.test(t))m='Invalid email.';}
else if(i.name==='service'||i.name==='interest'){if(!i.value)m='Required.';else if(i.value.length>64)m='Max 64.';}
else if(i.name==='message'){const t=i.value.trim();if(!t)m='Required.';else if(t.length<20)m='Min 20 chars.';else if(t.length>2000)m='Truncated.';else if(B.test(t))m='Invalid chars.';}
else if(i.name==='consent'){if(!i.checked)m='Required.';}
if(i.name) setE(i,m);return!m;}
const F=[...f.querySelectorAll('input,textarea,select')].filter(x=>x.type!=='hidden'&&x.name!=='botcheck'&&x.name!=='website'&&x.name!=='company_url'&&x.name!=='h-captcha-response'&&x.name!=='access_key'&&x.name!=='subject');
for(const i of F){i.addEventListener('blur',()=>{s='validating-field';vF(i);s='idle';});}
try{const p=new URL(location.href).searchParams.get('service'),se=f.querySelector('[name=service]')||f.querySelector('[name=interest]');if(p&&se&&['vibe-code-cleanup','ai-sdlc-training','other','strategy-roadmap','compliance-audit','tech-selection','general'].includes(p))se.value=p;}catch{}
async function sub(e){e.preventDefault();rst();
const hp=f.querySelector('[name=botcheck]');if(hp&&((hp.type==='checkbox'&&hp.checked)||(hp.value&&hp.value.trim()!==''))){s='honeypot-tripped';f.reset();setSt('success',OK);return;}
const hp2=f.querySelector('[name=website]')||f.querySelector('[name=company_url]');if(hp2&&hp2.value.trim()!==''){s='honeypot-tripped';f.reset();setSt('success',OK);return;}
try{const l=Number(localStorage.getItem(K)||'0');if(l&&Date.now()-l<W){s='rate-limited';setSt('rate-limited',RL);return;}}catch{}
const ce=f.querySelector('[name=consent]');if(ce&&!ce.checked){s='consent-blocked';ce.setAttribute('aria-invalid','true');let er=document.getElementById('cf-consent-err');if(er){er.textContent='Required.';er.dataset.shown='true';}setSt('consent-blocked',CB);try{ce.focus();}catch{}return;}
const capWrap=f.querySelector('.h-captcha,[data-captcha]');if(capWrap){const cap=f.querySelector('[name="h-captcha-response"]');if(cap&&!cap.value.trim()){s='captcha-required';let er=document.getElementById('hcaptcha-err');if(!er){er=document.createElement('small');er.id='hcaptcha-err';er.className='contact-form__error';er.setAttribute('aria-live','polite');er.dataset.shown='false';capWrap.insertAdjacentElement('afterend',er);}er.textContent=HC;er.dataset.shown='true';setSt('error',HC);return;}let er=document.getElementById('hcaptcha-err');if(er){er.textContent='';er.dataset.shown='false';}}
s='validating-submit';let fi=null;for(const i of F)if(!vF(i)&&!fi)fi=i;if(fi){try{fi.focus();}catch{}s='idle';return;}
s='submitting';setSt('submitting','Sending your message…');const btn=f.querySelector('button[type=submit]');if(btn)btn.disabled=true;
a=new AbortController();
try{
const fd=new FormData(f);
if(!fd.get('access_key')) fd.set('access_key','242de28a-455b-4a89-ade9-82d5b3876782');
if(!fd.get('subject')) fd.set('subject',f.querySelector('[name=subject]')?.value||'New Inquiry');
const r=await fetch(ep,{method:'POST',body:fd,signal:a.signal,headers:{'Accept':'application/json'}});
let j=null;try{j=await r.json();}catch{}
if(r.ok&&(j?.success||j?.message?.includes('success')||r.status===200)){try{localStorage.setItem(K,String(Date.now()));}catch{}s='success';f.reset();rst();if(window.hcaptcha)try{hcaptcha.reset();}catch{}setSt('success',OK);const svc=fd.get('service')||fd.get('interest')||'general';tr('contact_submit_success',{service:String(svc)});}
else if(r.status===422||j?.message?.includes('consent')){s='consent-blocked';setSt('consent-blocked',CB);}
else if(r.status===429){const ra=r.headers.get('Retry-After');s='rate-limited';setSt('rate-limited',ra?`Too many requests. Try again in ${ra}s.`:RL);tr('contact_submit_error',{status:429});}
else{s='error';const msg=j?.message||'Something went wrong. Please try again in a moment.';setSt('error',msg);tr('contact_submit_error',{status:r.status});}
}catch(err){if(err&&err.name==='AbortError')s='idle';else{s='error';setSt('error','Network error. Please check your connection.');tr('contact_submit_error',{status:'network'});}}finally{if(btn)btn.disabled=false;}}
f.addEventListener('submit',sub);
function destroy(){f.removeEventListener('submit',sub);if(a)try{a.abort();}catch{}s='idle';}
return{state:s,destroy,initialized:true}}
