// ================= MW WEB STUDIO — script.js =================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case load event already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------- CUSTOM CURSOR ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(max-width: 900px)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      spawnTrail(mouseX, mouseY);
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .project-card, .price-card, .accordion-head');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });

    // mouse trail (subtle gold dust)
    let trailCount = 0;
    function spawnTrail(x, y) {
      trailCount++;
      if (trailCount % 3 !== 0) return; // throttle
      const dot = document.createElement('span');
      dot.style.position = 'fixed';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.width = '3px';
      dot.style.height = '3px';
      dot.style.borderRadius = '50%';
      dot.style.background = 'rgba(201,169,97,0.55)';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = '9998';
      dot.style.transform = 'translate(-50%,-50%)';
      dot.style.transition = 'opacity .6s ease, transform .6s ease';
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%,-50%) scale(0.3)';
      });
      setTimeout(() => dot.remove(), 650);
    }
  }

  /* ---------- FLOATING PARTICLES ---------- */
  const particlesEl = document.getElementById('particles');
  const particleCount = window.innerWidth < 700 ? 16 : 32;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 14) + 's';
    p.style.opacity = (0.2 + Math.random() * 0.4).toFixed(2);
    particlesEl.appendChild(p);
  }

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById('navbar');
  const toTopBtn = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    toTopBtn.classList.toggle('visible', window.scrollY > 600);
    updateGoldThread();
  }, { passive: true });

  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- GOLD THREAD SCROLL PROGRESS ---------- */
  const threadFg = document.getElementById('threadPathFg');
  const threadLength = 3000;
  function updateGoldThread() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;
    const offset = threadLength - (threadLength * Math.min(pct, 1));
    if (threadFg) threadFg.style.strokeDashoffset = offset;
  }
  updateGoldThread();

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------- SKILL BARS ---------- */
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        const level = entry.target.dataset.level;
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillRows.forEach(row => skillObserver.observe(row));

  /* ---------- TYPING ANIMATION ---------- */
  const typedEl = document.getElementById('typedText');
  const words = ['Grow Businesses.', 'Convert Visitors.', 'Earn Trust.', 'Impress Clients.'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = words[wordIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 75);
  }
  typeLoop();

  /* ---------- ACCORDION (FAQ) ---------- */
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      accordionItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- TESTIMONIAL DOTS (mobile) ---------- */
  const track = document.querySelector('.testimonial-track');
  const dotsWrap = document.getElementById('testiDots');
  if (track && dotsWrap) {
    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsWrap.appendChild(dot);
    });
    track.addEventListener('scroll', () => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 20;
      const index = Math.round(scrollLeft / cardWidth);
      dotsWrap.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === index));
    }, { passive: true });
  }

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- CONTACT FORM (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Thank you — your message has been noted. I will reply within 24 hours.';
      form.reset();
    });
  }

});
