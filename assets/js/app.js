/* ============================================================
   AURAGIKA UNIVERSE — assets/js/app.js
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', function () { initLoader(); });

/* ══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
function initLoader() {
  var loader = document.getElementById('loader');
  var fill   = document.getElementById('loader-fill');
  var logo   = document.querySelector('.loader-logo');

  gsap.to(logo, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });

  var progress = 0;
  var iv = setInterval(function () {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      setTimeout(hideLoader, 300);
    } else {
      fill.style.width = progress + '%';
    }
  }, 60);

  function hideLoader() {
    gsap.to(loader, {
      opacity: 0, duration: 0.6, ease: 'power2.inOut',
      onComplete: function () { loader.style.display = 'none'; initAll(); }
    });
  }
}

/* ══════════════════════════════════════════
   BOOT
═══════════════════════════════════════════ */
function initAll() {
  tryRun(initAboutStrip);
  tryRun(initHeroAnimations);
  tryRun(initNavbar);
  tryRun(initNavActiveState);
  tryRun(initMobileMenu);
  tryRun(initTheme);
  tryRun(initTiltCards);
  tryRun(initSectionCards);
  tryRun(initRevealCards);
  tryRun(initContactForm);
  tryRun(initChatFab);
}

function tryRun(fn) {
  try { fn(); } catch (e) { console.warn('[AU]', fn.name, e); }
}

/* ══════════════════════════════════════════
   ABOUT STRIP — IntersectionObserver reveal
═══════════════════════════════════════════ */
function initAboutStrip() {
  var strip = document.getElementById('about-strip');
  if (!strip) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        strip.classList.add('revealed');
        io.unobserve(strip);
      }
    });
  }, { threshold: 0.25 });
  io.observe(strip);
}

/* ══════════════════════════════════════════
   [data-reveal] CARDS — generic reveal
═══════════════════════════════════════════ */
function initRevealCards() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
}

/* ══════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════ */
function initHeroAnimations() {
  var tl = gsap.timeline({ delay: 0.2 });
  tl.from('#hero-label',       { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' })
    .from('.hero-title',       { opacity: 0, y: 40, duration: 1.0, ease: 'power4.out' }, '-=0.3')
    .from('#hero-sub',         { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('#hero-persons',     { opacity: 0, y: 30, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.3');
}

/* ══════════════════════════════════════════
   SECTION CARD ANIMATIONS (ScrollTrigger)
═══════════════════════════════════════════ */
function initSectionCards() {
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.sec-card').forEach(function (card) {
    gsap.from(card, {
      y: 90,
      opacity: 0,
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 84%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.section-content').forEach(function (content) {
    var items = content.querySelectorAll(
      '.travel-card, .recipe-card, .tool-card, .social-link-item, .contact-form-card, .profile-card, .kitchen-featured'
    );
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.10,
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: content,
        start: 'top 88%',
        once: true
      }
    });
  });
}

function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.style.borderBottomColor = window.scrollY > 40 ? 'var(--border)' : 'transparent';
  }, { passive: true });
}

/* ══════════════════════════════════════════
   NAV ACTIVE STATE
═══════════════════════════════════════════ */
function initNavActiveState() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { io.observe(s); });
}

/* ══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
function initMobileMenu() {
  var toggle = document.getElementById('menu-toggle');
  var menu   = document.getElementById('mobile-menu');
  var close  = document.getElementById('menu-close');
  if (!toggle || !menu || !close) return;
  function openMenu()  { menu.classList.add('open');    document.body.classList.add('menu-open'); }
  function closeMenu() { menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
  toggle.addEventListener('click', function () {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  close.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link').forEach(function (l) { l.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
}

/* ══════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════ */
function initTheme() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  var curr = document.documentElement.getAttribute('data-theme') || 'dark';
  var next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.documentElement.style.colorScheme = next;
  localStorage.setItem('au_theme', next);
}

/* ══════════════════════════════════════════
   3D TILT CARDS
═══════════════════════════════════════════ */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt], .travel-card, .tool-card, .recipe-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -10;
      var ry = ((e.clientX - r.left - r.width  / 2) / r.width)  *  10;
      card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
}

/* ══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
function initContactForm() {
  var form    = document.getElementById('contact-form');
  var btn     = document.getElementById('form-submit');
  var success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name    = document.getElementById('form-name').value.trim();
    var email   = document.getElementById('form-email').value.trim();
    var subject = document.getElementById('form-subject').value.trim();
    var message = document.getElementById('form-message').value.trim();
    if (!name || !email || !message) { shakeEl(btn); return; }
    btn.textContent = 'Sending...'; btn.disabled = true;
    var mailto = 'mailto:[AURAGIKA_EMAIL]'
      + '?subject=' + encodeURIComponent(subject || 'Message from ' + name)
      + '&body='    + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    window.location.href = mailto;
    setTimeout(showSuccess, 800);
  });

  function showSuccess() {
    form.style.display    = 'none';
    if (success) {
      success.style.display = 'block';
      gsap.from(success, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    }
  }
  function shakeEl(el) {
    gsap.timeline()
      .to(el,{x:-8,duration:0.08}).to(el,{x:8,duration:0.08})
      .to(el,{x:-5,duration:0.08}).to(el,{x:5,duration:0.08})
      .to(el,{x:0, duration:0.08});
  }
}

/* ══════════════════════════════════════════
   CHAT FAB
═══════════════════════════════════════════ */
function initChatFab() {
  var fab = document.getElementById('chat-fab');
  if (!fab) return;
  fab.addEventListener('click', function () {
    var connect = document.getElementById('connect');
    if (connect) connect.scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { var n = document.getElementById('form-name'); if (n) n.focus(); }, 700);
  });
}
