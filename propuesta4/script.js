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

  const scrollToEl = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  /* ---------------- Chapter nav ---------------- */
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      scrollToEl(btn.getAttribute('data-goto'));
      closeMobileMenu();
    });
  });

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

  /* ---------------- Header contrast per chapter theme ---------------- */
  const head = document.getElementById('siteHead');
  const chapters = gsap.utils.toArray('.chapter');
  const navButtons = document.querySelectorAll('nav.chapters button');

  function applyTheme(theme) {
    head.style.setProperty('--head-color', theme === 'light' ? '#0A3DA7' : '#ffffff');
    head.dataset.theme = theme;
  }

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
    const name = current.dataset.chapter;
    navButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.goto === name));
    const idx = chapters.indexOf(current);
    document.querySelectorAll('.sig-tick').forEach((t, i) => t.classList.toggle('is-active', i === idx));
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: updateActiveChapter, onRefresh: updateActiveChapter });
  // init
  applyTheme('dark');

  ScrollTrigger.create({
    start: 60,
    onUpdate: (self) => head.classList.toggle('is-compact', self.scroll() > 60),
  });

  document.querySelectorAll('.sig-tick').forEach((t) => { t.style.top = '50%'; t.style.transform = 'translateY(-50%)'; });

  /* ---------------- Opening reveal ---------------- */
  const opening = document.getElementById('opening');
  setTimeout(() => opening.classList.add('is-revealed'), 450);

  /* ---------------- Signature line: draw with total scroll progress ---------------- */
  const sigPath = document.getElementById('sig-path');
  if (sigPath) {
    const len = sigPath.getTotalLength ? sigPath.getTotalLength() : 1000;
    sigPath.style.strokeDasharray = len;
    sigPath.style.strokeDashoffset = len;
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
  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    if (reduced) { el.classList.add('is-in'); return; }
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('is-in'),
      onEnterBack: () => el.classList.add('is-in'),
    });
  });

  /* ---------------- Hero photo subtle scale on scroll ---------------- */
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

  if (window.matchMedia('(min-width: 901px)').matches) {
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

  /* ---------------- Refresh after fonts/images settle ---------------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
