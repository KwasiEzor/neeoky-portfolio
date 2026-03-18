/* ═══════════════════════════════════════════
   NEEOKY PORTFOLIO — MAIN CLIENT SCRIPTS
   Cursor, navbar, progress, mobile menu,
   scroll animations, smooth scroll, counters,
   skill bars, active nav, hero video, magnetic btns
   ═══════════════════════════════════════════ */

function initAll() {
  initCursor();
  initNavbar();
  initProgressBar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initCounters();
  initSkillBars();
  initActiveNavLink();
  initHeroVideo();
  initMagneticButtons();
}

// Run on initial load
initAll();

// Re-run after Astro view transitions
document.addEventListener('astro:after-swap', initAll);


/* ═══════════════ 1. CUSTOM CURSOR ═══════════════ */
function initCursor() {
  const dot = document.querySelector('.cursor-dot') as HTMLElement | null;
  const ring = document.querySelector('.cursor-ring') as HTMLElement | null;

  if (!dot || !ring) return;

  // Disable on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  // Activate custom cursor CSS (hides default cursor)
  document.documentElement.classList.add('custom-cursor-active');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring!.style.left = ringX + 'px';
    ring!.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .service-card, .tool-item, .niche-pill, .why-card, .addon');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}


/* ═══════════════ 2. NAVBAR SCROLL ═══════════════ */
function initNavbar() {
  const navbar = document.querySelector('.navbar') as HTMLElement | null;
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar!.classList.add('scrolled');
    } else {
      navbar!.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ═══════════════ 3. PROGRESS BAR ═══════════════ */
function initProgressBar() {
  const bar = document.querySelector('.progress-bar') as HTMLElement | null;
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar!.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ═══════════════ 4. MOBILE MENU ═══════════════ */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger') as HTMLElement | null;
  const navLinks = document.querySelector('.nav-links') as HTMLElement | null;
  const overlay = document.querySelector('.nav-overlay') as HTMLElement | null;
  if (!hamburger || !navLinks) return;

  function closeMenu() {
    navLinks!.classList.remove('open');
    hamburger!.classList.remove('open');
    hamburger!.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('visible');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks!.classList.toggle('open');
    hamburger!.classList.toggle('open');
    hamburger!.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    if (overlay) overlay.classList.toggle('visible', isOpen);
  });

  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks!.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu if window resized past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks!.classList.contains('open')) {
      closeMenu();
    }
  });
}


/* ═══════════════ 5. SCROLL ANIMATIONS ═══════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('visible');
        }, delay * 120);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}


/* ═══════════════ 6. SMOOTH SCROLL ═══════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


/* ═══════════════ 7. COUNTER ANIMATION ═══════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el: HTMLElement) {
  const target = parseInt(el.dataset.target || '0', 10);
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = String(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ═══════════════ 8. SKILL BARS ANIMATION ═══════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill') as NodeListOf<HTMLElement>;
  if (!fills.length) return;

  // Set initial width to 0 for animation
  fills.forEach((fill) => {
    const targetWidth = fill.style.width;
    fill.dataset.level = targetWidth;
    fill.style.width = '0%';
    fill.style.transition = 'width 1s ease-out';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target as HTMLElement;
        fill.style.width = fill.dataset.level || '0%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach((fill) => observer.observe(fill));
}


/* ═══════════════ 9. ACTIVE NAV LINK ═══════════════ */
function initActiveNavLink() {
  const pathname = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip hash-only links (e.g. /#services) — they shouldn't get a permanent active state
    if (href.includes('#')) {
      link.classList.remove('active');
      return;
    }

    if (href === pathname) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


/* ═══════════════ 10. HERO VIDEO ═══════════════ */
function initHeroVideo() {
  const video = document.querySelector('.hero-video') as HTMLVideoElement | null;
  if (!video) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }

  // Fade in when video is ready to play
  function showVideo() {
    video!.classList.add('loaded');
  }

  video.addEventListener('canplay', showVideo, { once: true });

  // Fallback: if canplay doesn't fire within 5s, show anyway
  const fallbackTimer = setTimeout(() => {
    if (!video.classList.contains('loaded')) {
      showVideo();
    }
  }, 5000);

  video.addEventListener('canplay', () => clearTimeout(fallbackTimer), { once: true });

  // Pause/play based on visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(video);
}


/* ═══════════════ 11. MAGNETIC BUTTONS ═══════════════ */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary') as NodeListOf<HTMLElement>;
  if (!btns.length || window.innerWidth < 768) return;

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
