const root=document.documentElement;
const savedTheme=localStorage.getItem('solsanit-theme');
const preferredDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme=savedTheme||(preferredDark?'dark':'light');
root.dataset.theme=initialTheme;

const LIGHT_LOGO='logo-solsanit-light-crisp.svg?v=10';
const DARK_LOGO='logo-solsanit-dark-crisp.svg?v=10';
const logo=document.querySelector('.brand img');
const syncLogo=()=>{
  if(!logo) return;
  const dark=root.dataset.theme==='dark';
  const nextSrc=dark?DARK_LOGO:LIGHT_LOGO;
  if(!logo.src.endsWith(nextSrc)) logo.src=nextSrc;
  logo.width=810;
  logo.height=227;
};
syncLogo();

const themeStyles=document.createElement('style');
themeStyles.textContent=`
.theme-toggle{width:44px;height:44px;flex:0 0 44px;border-radius:50%;border:1px solid rgba(8,47,117,.16);background:#f4f8fb;color:#082F75;display:grid;place-items:center;font-size:19px;cursor:pointer;transition:.25s;box-shadow:0 6px 18px rgba(8,47,117,.08)}
.theme-toggle:hover{transform:translateY(-2px);border-color:#47B649;box-shadow:0 10px 24px rgba(71,182,73,.16)}
html[data-theme='light']{color-scheme:light}
html[data-theme='dark']{color-scheme:dark}
html[data-theme='light'] body{background:#F5F9FC;color:#16355A}
html[data-theme='light'] .top{background:#fff;border-color:#DCE7F0}
html[data-theme='light'] .menu{color:#082F75}
html[data-theme='light'] .section{background:#F5F9FC;color:#16355A}
html[data-theme='light'] .section.white{background:#fff;color:#16355A}
html[data-theme='light'] .section.white h2{color:#082F75}
html[data-theme='light'] .tile{background:#fff;border-color:#DCE7F0}
html[data-theme='light'] .tile h3{color:#082F75}
html[data-theme='light'] .tile p{color:#587089}
html[data-theme='light'] .card{background:#fff;border-color:#DCE7F0;box-shadow:0 14px 30px rgba(8,47,117,.08)}
html[data-theme='light'] .card h3{color:#082F75}
html[data-theme='light'] .card p{color:#60758B}
html[data-theme='light'] .form{background:#fff;border-color:#DCE7F0;box-shadow:0 18px 44px rgba(8,47,117,.10)}
html[data-theme='light'] .form input,html[data-theme='light'] .form textarea,html[data-theme='light'] .form select{background:#F7FAFC;color:#16355A;border-color:#D5E1EC}
html[data-theme='light'] .footer{background:#fff;color:#60758B;border-color:#DCE7F0}
html[data-theme='light'] .footer strong{color:#082F75}
html[data-theme='light'] .theme-toggle{background:#F4F8FB;color:#082F75;border-color:#D8E3ED}
html[data-theme='dark'] body{background:#061F4B;color:#EEF5FB}
html[data-theme='dark'] .top{background:#051A40;border-color:rgba(255,255,255,.10);box-shadow:0 8px 24px rgba(0,0,0,.18)}
html[data-theme='dark'] .brand{background:transparent;padding:0;border-radius:0;box-shadow:none}
html[data-theme='dark'] .menu{color:#E7F0FC}
html[data-theme='dark'] .menu a:hover,html[data-theme='dark'] .menu a.active{color:#fff}
html[data-theme='dark'] .section{background:#061F4B;color:#EEF5FB}
html[data-theme='dark'] .section.white{background:#082F75;color:#EEF5FB}
html[data-theme='dark'] .section.white h2{color:#fff}
html[data-theme='dark'] .tile{background:#0A347D;border-color:rgba(255,255,255,.10);box-shadow:0 14px 30px rgba(0,0,0,.16)}
html[data-theme='dark'] .tile h3{color:#fff}
html[data-theme='dark'] .tile p{color:#DCE7F5}
html[data-theme='dark'] .tile .num{color:#65D06A}
html[data-theme='dark'] .card,html[data-theme='dark'] .white .card{background:#0A347D;border-color:rgba(255,255,255,.10);box-shadow:0 14px 30px rgba(0,0,0,.18)}
html[data-theme='dark'] .card h3,html[data-theme='dark'] .white .card h3{color:#fff}
html[data-theme='dark'] .card p,html[data-theme='dark'] .white .card p{color:#DCE7F5}
html[data-theme='dark'] .form{background:#082F75;border-color:rgba(255,255,255,.10)}
html[data-theme='dark'] .form input,html[data-theme='dark'] .form textarea,html[data-theme='dark'] .form select{background:#061F4B;color:#fff;border-color:rgba(255,255,255,.16)}
html[data-theme='dark'] .footer{background:#041A40;color:#D5E1EF;border-color:rgba(255,255,255,.10)}
html[data-theme='dark'] .footer strong{color:#fff}
html[data-theme='dark'] .theme-toggle{background:#0A347D;color:#fff;border-color:rgba(255,255,255,.16)}
@media(max-width:900px){html[data-theme='dark'] .menu{background:#051A40;border-color:rgba(255,255,255,.10)}.theme-toggle{width:40px;height:40px;flex-basis:40px;font-size:17px}}
`;
document.head.appendChild(themeStyles);

const nav=document.querySelector('.nav');
const accent=document.querySelector('.accent');
if(nav){
  const themeButton=document.createElement('button');
  themeButton.className='theme-toggle';
  themeButton.type='button';
  const syncThemeButton=()=>{
    const dark=root.dataset.theme==='dark';
    themeButton.textContent=dark?'☀':'☾';
    themeButton.setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro');
    themeButton.title=dark?'Modo claro':'Modo oscuro';
    syncLogo();
  };
  syncThemeButton();
  themeButton.addEventListener('click',()=>{
    const next=root.dataset.theme==='dark'?'light':'dark';
    root.dataset.theme=next;
    localStorage.setItem('solsanit-theme',next);
    syncThemeButton();
  });
  if(accent) accent.before(themeButton); else nav.appendChild(themeButton);
}

const toggle=document.querySelector('.mobile-toggle');
const menu=document.querySelector('.menu');
if(toggle&&menu){
  toggle.addEventListener('click',()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
