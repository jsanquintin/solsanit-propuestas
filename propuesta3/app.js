const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* ---- scroll-triggered entrance: stagger siblings within each revealing group ---- */
(function initReveal() {
  const groups = new Map(); // parent -> ordered list of its .reveal children
  document.querySelectorAll('.reveal').forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(list => {
    list.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 5) * 60}ms`);
    });
  });

  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ---- project detail modal: opens from the clicked card, closes fast ---- */
(function initProjectModal() {
  const backdrop = document.getElementById('projectModal');
  if (!backdrop) return;
  const panel = backdrop.querySelector('.modal-panel');
  const imgEl = backdrop.querySelector('[data-field="image"]');
  const catEl = backdrop.querySelector('[data-field="category"]');
  const titleEl = backdrop.querySelector('[data-field="title"]');
  const descEl = backdrop.querySelector('[data-field="desc"]');
  const scopeEl = backdrop.querySelector('[data-field="scope"]');
  const locationEl = backdrop.querySelector('[data-field="location"]');
  const closeBtn = backdrop.querySelector('[data-close]');
  let lastTrigger = null;

  function open(card) {
    lastTrigger = card;
    imgEl.src = card.dataset.img || '';
    imgEl.alt = card.dataset.title || '';
    catEl.textContent = card.dataset.category || '';
    titleEl.textContent = card.dataset.title || '';
    descEl.textContent = card.dataset.desc || '';
    scopeEl.textContent = card.dataset.scope || '';
    locationEl.textContent = card.dataset.location || '';
    backdrop.removeAttribute('data-closing');
    backdrop.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    backdrop.setAttribute('data-closing', 'true');
    backdrop.removeAttribute('data-state');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastTrigger) lastTrigger.focus();
    window.setTimeout(() => backdrop.removeAttribute('data-closing'), reduceMotion ? 0 : 200);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  closeBtn.addEventListener('click', close);
})();
