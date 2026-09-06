const root=document.documentElement;

const ICON_SUN='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="3.6" stroke="currentColor" stroke-width="1.6"/><path d="M9 1.2v2M9 14.8v2M16.8 9h-2M3.2 9h-2M14.5 3.5l-1.4 1.4M4.9 13.1l-1.4 1.4M14.5 14.5l-1.4-1.4M4.9 4.9L3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const ICON_MOON='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M15.5 10.3A6.3 6.3 0 1 1 7.7 2.5a5 5 0 0 0 7.8 7.8Z" fill="currentColor"/></svg>';
const ICON_MENU='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const ICON_CLOSE='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

const nav=document.querySelector('.nav');
const accent=document.querySelector('.accent');
if(nav){
  const themeButton=document.createElement('button');
  themeButton.className='theme-toggle';
  themeButton.type='button';
  const syncThemeButton=()=>{
    const dark=root.dataset.theme==='dark';
    themeButton.innerHTML=dark?ICON_SUN:ICON_MOON;
    themeButton.setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro');
    themeButton.title=dark?'Modo claro':'Modo oscuro';
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
  toggle.innerHTML=ICON_MENU;
  toggle.setAttribute('aria-expanded','false');
  toggle.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.innerHTML=open?ICON_CLOSE:ICON_MENU;
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML=ICON_MENU;
  }));
}

const contactForm=document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(contactForm);
    const body=[
      `Nombre: ${data.get('name')||''}`,
      `Correo: ${data.get('email')||''}`,
      `Teléfono: ${data.get('phone')||''}`,
      `Tipo de proyecto: ${data.get('type')||''}`,
      '',
      data.get('message')||''
    ].join('\n');
    const subject=`Cotización de proyecto — ${data.get('name')||'sitio web'}`;
    window.location.href=`mailto:info@solsanit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion){
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('show'));
}else{
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.14});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
