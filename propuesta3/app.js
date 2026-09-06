const ICON_MENU='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const ICON_CLOSE='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

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
