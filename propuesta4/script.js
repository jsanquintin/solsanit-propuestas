(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenu');
  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', openMobileMenu);
  closeMenuBtn.addEventListener('click', closeMobileMenu);

  /* ---------------- Page transition (curtain between real pages) ---------------- */
  const transitionEl = document.getElementById('pageTransition');
  function isInternalPageLink(a) {
    if (!a || !a.getAttribute) return false;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (a.target && a.target !== '' && a.target !== '_self') return false;
    return /\.html?($|[?#])/.test(href) || !href.includes(':');
  }
  document.querySelectorAll('a[href]').forEach((a) => {
    if (!isInternalPageLink(a)) return;
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      e.preventDefault();
      if (transitionEl && !reduced) {
        transitionEl.classList.add('is-active');
        setTimeout(() => { window.location.href = href; }, 420);
      } else {
        window.location.href = href;
      }
    });
  });
  window.addEventListener('pageshow', () => {
    if (transitionEl) transitionEl.classList.remove('is-active');
  });

  /* ---------------- Header contrast per chapter theme ---------------- */
  const head = document.getElementById('siteHead');
  const chapters = gsap.utils.toArray('.chapter');
  const navLinks = document.querySelectorAll('nav.chapters a, #mobileMenu a');

  function applyTheme(theme) {
    head.style.setProperty('--head-color', theme === 'light' ? '#0A3DA7' : '#ffffff');
    head.dataset.theme = theme;
  }

  // Mark the current page in the nav (compares each link's file name to this page's).
  const currentFile = (location.pathname.split('/').pop() || 'index.html');
  navLinks.forEach((a) => {
    const linkFile = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('is-active', linkFile === currentFile);
  });

  if (chapters.length) {
    // Robust active-chapter detection: whichever chapter's top has passed the
    // viewport midline, using live bounding boxes (works correctly regardless
    // of pinned/tall sections, unlike static top%/bottom% triggers).
    function updateActiveChapter() {
      const mid = window.innerHeight * 0.45;
      let current = chapters[0];
      for (const ch of chapters) {
        if (ch.getBoundingClientRect().top <= mid) current = ch;
        else break;
      }
      applyTheme(current.dataset.theme);
      const idx = chapters.indexOf(current);
      document.querySelectorAll('.sig-tick').forEach((t, i) => t.classList.toggle('is-active', i === idx));
    }
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: updateActiveChapter, onRefresh: updateActiveChapter });
    applyTheme(chapters[0].dataset.theme || 'dark');
  } else {
    // Plain content pages (legal, 404): honor whatever theme is set in the markup.
    applyTheme(head.dataset.theme || 'light');
  }

  ScrollTrigger.create({
    start: 60,
    onUpdate: (self) => head.classList.toggle('is-compact', self.scroll() > 60),
  });

  document.querySelectorAll('.sig-tick').forEach((t) => { t.style.top = '50%'; t.style.transform = 'translateY(-50%)'; });

  /* ---------------- Opening reveal (home hero) ---------------- */
  const opening = document.getElementById('opening');
  if (opening) setTimeout(() => opening.classList.add('is-revealed'), 450);

  /* ---------------- Interior sub-hero reveal ---------------- */
  setTimeout(() => document.body.classList.add('is-loaded'), 300);

  /* ---------------- Signature line: draw with this page's scroll progress ---------------- */
  const sigPath = document.getElementById('sig-path');
  if (sigPath) {
    gsap.set('#signature-line svg', { attr: { viewBox: `0 0 100 ${document.documentElement.scrollHeight}` } });
    sigPath.setAttribute('d', `M 14 0 L 14 ${document.documentElement.scrollHeight}`);
    const len2 = sigPath.getTotalLength();
    sigPath.style.strokeDasharray = len2;
    sigPath.style.strokeDashoffset = len2;

    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        sigPath.style.strokeDashoffset = String(len2 * (1 - self.progress));
      },
    });
  }

  /* ---------------- Generic reveal-up ---------------- */
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (reduced) { el.classList.add('is-in'); return; }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('is-in'),
      onEnterBack: () => el.classList.add('is-in'),
    });
  });

  /* ---------------- Hero photo subtle scale on scroll (home) ---------------- */
  const heroFrame = document.getElementById('heroPhotoFrame');
  if (heroFrame && !reduced) {
    gsap.fromTo(heroFrame.querySelector('img'),
      { scale: 1.06 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: heroFrame, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  }

  /* ---------------- Servicios: pinned scroll-driven reveal ---------------- */
  const svcPin = document.getElementById('svcPin');
  const svcItems = gsap.utils.toArray('.svc-item');
  const svcImgs = gsap.utils.toArray('.svc-media img');

  function setActiveService(i) {
    svcItems.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
    svcImgs.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
  }

  if (svcPin && window.matchMedia('(min-width: 901px)').matches) {
    ScrollTrigger.create({
      trigger: svcPin,
      start: 'top top',
      end: () => `+=${svcItems.length * 420}`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const i = Math.min(svcItems.length - 1, Math.floor(self.progress * svcItems.length));
        setActiveService(i);
      },
    });
  }

  /* ---------------- Proyectos: subtle photo reveal via clip ---------------- */
  gsap.utils.toArray('.project-photo').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(el, { clipPath: 'inset(6% 6% 6% 6%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: true },
    });
  });

  /* ---------------- Nosotros: numeral scrub + image strip parallax ---------------- */
  const nosNum = document.getElementById('nosNum');
  if (nosNum && !reduced) {
    gsap.fromTo(nosNum, { opacity: 0.25, x: -30 }, {
      opacity: 1, x: 0, ease: 'none',
      scrollTrigger: { trigger: '#nosotros', start: 'top 80%', end: 'top 20%', scrub: true },
    });
  }
  const nosStrip = document.getElementById('nosStrip');
  if (nosStrip && !reduced) {
    gsap.to(nosStrip, {
      x: -120, ease: 'none',
      scrollTrigger: { trigger: '#nosotros', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  /* ---------------- Contact form: no backend on this static site, so we hand off to mailto ---------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();
      const status = document.getElementById('formStatus');

      if (!name || !email || !message) {
        status.textContent = 'Por favor complete nombre, correo y mensaje.';
        status.classList.add('is-visible');
        return;
      }

      const body = `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || '—'}\n\n${message}`;
      const mailto = `mailto:info@solsanit.com?subject=${encodeURIComponent('Contacto desde solsanit.com')}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      status.textContent = 'Abriendo su cliente de correo…';
      status.classList.add('is-visible');
    });
  }

  /* ---------------- Refresh after fonts/images settle ---------------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
