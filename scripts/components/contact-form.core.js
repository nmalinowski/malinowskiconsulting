const K='mc.contact.lastSubmit',W=3e4,R=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,B=/[<>&"']/,OK="Thanks — I'll be in touch within 1 business day.",RL='Please wait a bit before sending another message.',CB='Please confirm the privacy consent before sending.',HC='Please complete the verification.';
export function initContactForm(f,o={}){
let s='idle',a=null,endpoint=o.endpoint||f.getAttribute('action')||f.dataset.endpoint||'https://api.web3forms.com/submit',st=f.querySelector('[data-status],.contact-form__status,output,[role="status"]');
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
if(i.name)setE(i,m);return!m;}
const F=[...f.querySelectorAll('input,textarea,select')].filter(x=>x.type!=='hidden'&&x.name!=='botcheck'&&x.name!=='website'&&x.name!=='company_url'&&x.name!=='h-captcha-response'&&x.name!=='access_key'&&x.name!=='subject');
for(const i of F){i.addEventListener('blur',()=>{s='validating-field';vF(i);s='idle';});}
try{const p=new URL(location.href).searchParams.get('service'),se=f.querySelector('[name=service]')||f.querySelector('[name=interest]');if(p&&se&&['vibe-code-cleanup','ai-sdlc-training','other','strategy-roadmap','compliance-audit','tech-selection','general'].includes(p))se.value=p;}catch{}
// Native form submission (Web3Forms free tier) - JS only handles validation
// The form's action="https://api.web3forms.com/submit" method="POST" handles submission
function destroy(){s='idle';}
return{state:s,destroy,initialized:true}}