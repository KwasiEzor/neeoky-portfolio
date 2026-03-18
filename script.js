/* ═══════════════════════════════════════════
   NEEOKY PORTFOLIO — SCRIPT.JS
   Curseur, animations, FAQ, formulaire
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ── 1. Custom Cursor ──
  initCursor();

  // ── 2. Navbar scroll ──
  initNavbar();

  // ── 3. Progress bar ──
  initProgressBar();

  // ── 4. Mobile menu ──
  initMobileMenu();

  // ── 5. Scroll animations ──
  initScrollAnimations();

  // ── 6. FAQ accordion ──
  initFAQ();

  // ── 7. Smooth scroll ──
  initSmoothScroll();

  // ── 8. Contact form ──
  initContactForm();

  // ── 9. Counter animation ──
  initCounters();

  // ── 10. Skill bars animation ──
  initSkillBars();

  // ── 11. Active nav link ──
  initActiveNavLink();

  // ── 12. Hero video background ──
  initHeroVideo();

  // ── 13. Showcase video ──
  initShowcaseVideo();

  // ── 14. Testimonials carousel ──
  initTestimonials();

  // ── 15. Magnetic Buttons ──
  initMagneticButtons();
});


/* ═══════════════ 1. CUSTOM CURSOR ═══════════════ */
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

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
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
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
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}


/* ═══════════════ 3. PROGRESS BAR ═══════════════ */
function initProgressBar() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ═══════════════ 4. MOBILE MENU ═══════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.querySelector('.nav-overlay');
  if (!hamburger || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('visible');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
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
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu if window resized past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
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
        const el = entry.target;
        const delay = el.dataset.delay || 0;
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


/* ═══════════════ 6. FAQ ACCORDION ═══════════════ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      items.forEach((i) => {
        i.classList.remove('open');
        const answer = i.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
        const btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}


/* ═══════════════ 7. SMOOTH SCROLL ═══════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


/* ═══════════════ 8. CONTACT FORM ═══════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset errors
    form.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));

    // Validate
    let isValid = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const projectType = form.querySelector('#project-type');
    const message = form.querySelector('#message');

    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      email.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!projectType.value) {
      projectType.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!message.value.trim()) {
      message.closest('.form-group').classList.add('error');
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Erreur réseau');

      form.reset();
      if (successMsg) successMsg.classList.add('visible');
      lucide.createIcons();

      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('visible');
      }, 5000);
    } catch (err) {
      // Create and show a temporary error toast
      showFormError('Une erreur est survenue. Veuillez réessayer ou me contacter directement.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function showFormError(message) {
  const existing = document.querySelector('.form-toast-error');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'form-toast-error glass animate-on-scroll visible';
  toast.innerHTML = `
    <i data-lucide="alert-circle"></i>
    <p>${message}</p>
  `;
  document.body.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ═══════════════ 9. COUNTER ANIMATION ═══════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ═══════════════ 10. SKILL BARS ANIMATION ═══════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-level]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.width = level + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach((fill) => observer.observe(fill));
}


/* ═══════════════ 11. ACTIVE NAV LINK ═══════════════ */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const linkPage = href.split('#')[0] || 'index.html';

    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}


/* ═══════════════ 12. HERO VIDEO BACKGROUND ═══════════════ */
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }

  // Fade in when video is ready to play
  function showVideo() {
    video.classList.add('loaded');
  }

  video.addEventListener('canplay', showVideo, { once: true });

  // Fallback: if canplay doesn't fire within 5s, show anyway
  const fallbackTimer = setTimeout(() => {
    if (!video.classList.contains('loaded')) {
      showVideo();
    }
  }, 5000);

  video.addEventListener('canplay', () => clearTimeout(fallbackTimer), { once: true });

  // Pause/play based on visibility (IntersectionObserver)
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


/* ═══════════════ 13. SHOWCASE VIDEO ═══════════════ */
function initShowcaseVideo() {
  const wrapper = document.querySelector('.showcase-video-wrapper');
  const video = document.querySelector('.showcase-video');
  const playBtn = document.querySelector('.showcase-play-btn');
  if (!wrapper || !video || !playBtn) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function togglePlay() {
    if (video.paused) {
      video.play().then(() => {
        wrapper.classList.add('playing');
      }).catch(() => {});
    } else {
      video.pause();
      wrapper.classList.remove('playing');
    }
  }

  playBtn.addEventListener('click', togglePlay);

  // Click on video to pause
  video.addEventListener('click', () => {
    if (!video.paused) {
      video.pause();
      wrapper.classList.remove('playing');
    }
  });

  // Auto-play on scroll (desktop only, respects reduced motion)
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().then(() => {
            wrapper.classList.add('playing');
          }).catch(() => {});
        } else {
          video.pause();
          wrapper.classList.remove('playing');
        }
      });
    }, { threshold: 0.5 });

    observer.observe(wrapper);
  }
}


/* ═══════════════ 14. TESTIMONIALS CAROUSEL ═══════════════ */
function initTestimonials() {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonials-track');
  const slides = track.querySelectorAll('.testimonial-slide');
  const prevBtn = carousel.querySelector('.testimonial-prev');
  const nextBtn = carousel.querySelector('.testimonial-next');
  const currentEl = carousel.querySelector('.testimonial-current');
  const totalEl = carousel.querySelector('.testimonial-total');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoScrollInterval = null;
  let touchStartX = 0;
  let touchDeltaX = 0;
  const total = slides.length;

  // Set total counter
  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

  function updateCounter() {
    if (currentEl) currentEl.textContent = String(currentIndex + 1).padStart(2, '0');
  }

  function goTo(index) {
    if (index >= total) currentIndex = 0;
    else if (index < 0) currentIndex = total - 1;
    else currentIndex = index;

    const slideWidth = slides[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateCounter();
  }

  function next() {
    goTo(currentIndex + 1);
  }
  
  function prev() {
    goTo(currentIndex - 1);
  }

  // Arrows (reset auto-scroll on click)
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prev();
    startAutoScroll();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    next();
    startAutoScroll();
  });

  // Auto-scroll
  function startAutoScroll() {
    stopAutoScroll();
    if (window.innerWidth > 768) { // Only auto-scroll on desktop
      autoScrollInterval = setInterval(next, 5000);
    }
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);

  // Touch / swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    stopAutoScroll();
    track.style.transition = 'none'; // Disable transition during drag
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
    const slideWidth = slides[0].offsetWidth;
    const currentTranslate = -currentIndex * slideWidth;
    track.style.transform = `translateX(${currentTranslate + touchDeltaX}px)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.transition = ''; // Restore transition
    if (Math.abs(touchDeltaX) > 50) {
      if (touchDeltaX < 0) next();
      else prev();
    } else {
      goTo(currentIndex);
    }
    startAutoScroll();
  });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    track.style.transition = 'none'; // Disable transition on resize
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goTo(currentIndex);
      track.style.transition = ''; // Restore transition
    }, 200);
  });

  // Init
  goTo(0);
  startAutoScroll();
}

/* ═══════════════ 15. MAGNETIC BUTTONS ═══════════════ */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary');
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
