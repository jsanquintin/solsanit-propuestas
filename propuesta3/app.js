const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const open = navMobile.classList.toggle('flex');
    navMobile.classList.toggle('hidden');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.textContent = open ? '✕' : '☰';
  });
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMobile.classList.add('hidden');
    navMobile.classList.remove('flex');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰';
  }));
}

const wordCycle = document.querySelector('.word-cycle');
if (wordCycle) {
  const words = wordCycle.querySelectorAll('span');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (words.length > 1 && !reduceMotion) {
    let i = 0;
    setInterval(() => {
      words[i].classList.remove('is-active');
      i = (i + 1) % words.length;
      words[i].classList.add('is-active');
    }, 2600);
  }
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const body = [
      `Nombre: ${data.get('name') || ''}`,
      `Correo: ${data.get('email') || ''}`,
      `Teléfono: ${data.get('phone') || ''}`,
      `Tipo de proyecto: ${data.get('type') || ''}`,
      '',
      data.get('message') || ''
    ].join('\n');
    const subject = `Cotización de proyecto — ${data.get('name') || 'sitio web'}`;
    window.location.href = `mailto:info@solsanit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
