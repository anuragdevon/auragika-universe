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
  tryRun(initCursor);
  tryRun(initHeroAnimations);
  tryRun(initNavbar);
  tryRun(initNavActiveState);
  tryRun(initMobileMenu);
  tryRun(initTheme);
  tryRun(initTiltCards);
  tryRun(initSectionCards);
  tryRun(initContactForm);
  tryRun(initChatFab);
}

function tryRun(fn) {
  try { fn(); } catch (e) { console.warn('[AU]', fn.name, e); }
}

/* bgScene removed — light-only, image-based backgrounds */
var _unused = (function () {
  var canvas, ctx;
  var W, H;
  var stars = [];
  var clouds = [];
  var scrollRatio = 0;

  /* darkT: 1 = fully dark/night, 0 = fully light/day. Lerps smoothly on theme change. */
  var darkT = 1;

  var mtLayers = [
    { points: [0,0.72, 0.08,0.48, 0.16,0.56, 0.25,0.38, 0.34,0.52, 0.42,0.40, 0.52,0.56, 0.60,0.42, 0.68,0.54, 0.76,0.38, 0.85,0.50, 1,0.58, 1,1, 0,1], speed: 0.06,  dk:[13,26,58],   lt:[184,200,232] },
    { points: [0,0.80, 0.10,0.60, 0.20,0.68, 0.30,0.55, 0.40,0.64, 0.50,0.54, 0.62,0.66, 0.72,0.56, 0.82,0.64, 0.92,0.58, 1,0.66, 1,1, 0,1], speed: 0.035, dk:[10,20,40],   lt:[200,216,240] },
    { points: [0,0.86, 0.12,0.72, 0.24,0.78, 0.36,0.70, 0.48,0.76, 0.60,0.70, 0.72,0.76, 0.84,0.72, 1,0.78, 1,1, 0,1], speed: 0.015,  dk:[8,16,30],    lt:[218,230,248] }
  ];

  /* sky color stops: [dark, light] as [r,g,b] */
  var skyStops = [
    { dk:[2,5,16],    lt:[91,184,245],  pos:0   },
    { dk:[4,6,15],    lt:[168,216,240], pos:0.5 },
    { dk:[6,8,24],    lt:[212,236,255], pos:1   }
  ];

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  /* lerp two [r,g,b] arrays, return css rgb() string */
  function lerpRGB(a, b, t) {
    return 'rgb(' +
      Math.round(a[0] + (b[0]-a[0]) * t) + ',' +
      Math.round(a[1] + (b[1]-a[1]) * t) + ',' +
      Math.round(a[2] + (b[2]-a[2]) * t) + ')';
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;width:100%;height:100%';
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
    darkT = isDark() ? 1 : 0;
    resize();
    buildStars();
    buildClouds();
    updateScrollRatio();
    window.addEventListener('resize', function () { resize(); buildStars(); buildClouds(); }, { passive: true });
    window.addEventListener('scroll', updateScrollRatio, { passive: true });
    loop();
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function updateScrollRatio() {
    var max = document.body.scrollHeight - window.innerHeight;
    scrollRatio = max > 0 ? window.scrollY / max : 0;
  }

  function buildStars() {
    stars = [];
    var n = Math.min(Math.floor(W * 0.14), 260);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random(), y: Math.random() * 0.65,
        r: Math.random() * 1.6 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.025 + 0.008,
        base: Math.random() * 0.55 + 0.25,
        col: Math.random() > 0.85 ? '#c4b5fd' : Math.random() > 0.7 ? '#7dd3fc' : '#fff'
      });
    }
  }

  function buildClouds() {
    clouds = [];
    var n = 5 + Math.floor(Math.random() * 4);
    for (var i = 0; i < n; i++) {
      clouds.push({ x: Math.random(), y: 0.06 + Math.random() * 0.30, w: 0.12 + Math.random() * 0.14, h: 0.04 + Math.random() * 0.06, speed: 0.00004 + Math.random() * 0.00003, alpha: 0.55 + Math.random() * 0.30 });
    }
  }

  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    skyStops.forEach(function (s) {
      g.addColorStop(s.pos, lerpRGB(s.lt, s.dk, darkT));
    });
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars() {
    if (darkT < 0.05) return;
    stars.forEach(function (s) {
      s.twinkle += s.ts;
      var op = (s.base + Math.sin(s.twinkle) * 0.28) * darkT;
      op = Math.max(0, Math.min(1, op));
      var px = s.x * W, py = s.y * H;
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col; ctx.globalAlpha = op; ctx.fill();
      if (s.r > 1 && op > 0.1) {
        var glow = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
        glow.addColorStop(0, s.col + '50'); glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.globalAlpha = op * 0.3; ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }

  function drawMoon() {
    if (darkT < 0.05) return;
    var cx = W * 0.80, cy = H * 0.14;
    var r  = Math.min(W, H) * 0.065;
    var a  = darkT;
    var g1 = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.8);
    g1.addColorStop(0, 'rgba(200,210,255,' + (0.18 * a) + ')');
    g1.addColorStop(0.5, 'rgba(150,170,240,' + (0.08 * a) + ')');
    g1.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.globalAlpha = 1; ctx.fill();
    var g2 = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
    g2.addColorStop(0, '#e8eeff'); g2.addColorStop(1, '#b0bce8');
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.globalAlpha = a; ctx.fill();
    [{x:0.25,y:-0.3,r:0.15},{x:-0.35,y:0.25,r:0.1},{x:0.1,y:0.35,r:0.08}].forEach(function (c) {
      ctx.beginPath(); ctx.arc(cx + c.x * r, cy + c.y * r, c.r * r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,140,200,0.30)'; ctx.globalAlpha = a; ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawSun() {
    var a = 1 - darkT;
    if (a < 0.05) return;
    var cx = W * 0.82, cy = H * 0.13;
    var r  = Math.min(W, H) * 0.06;
    var t  = Date.now() / 1000;
    for (var i = 0; i < 12; i++) {
      var angle = (i / 12) * Math.PI * 2 + t * 0.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r * 1.45, cy + Math.sin(angle) * r * 1.45);
      ctx.lineTo(cx + Math.cos(angle) * r * 2.1,  cy + Math.sin(angle) * r * 2.1);
      ctx.strokeStyle = 'rgba(255,200,60,' + (0.22 * a) + ')'; ctx.lineWidth = 3; ctx.stroke();
    }
    var g1 = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 3);
    g1.addColorStop(0, 'rgba(255,220,80,' + (0.40 * a) + ')');
    g1.addColorStop(0.5, 'rgba(255,170,40,' + (0.12 * a) + ')');
    g1.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.globalAlpha = 1; ctx.fill();
    var g2 = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
    g2.addColorStop(0, '#fff5aa'); g2.addColorStop(0.6, '#ffd740'); g2.addColorStop(1, '#ffb300');
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.globalAlpha = a; ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawClouds() {
    var a = 1 - darkT;
    if (a < 0.05) return;
    clouds.forEach(function (c) {
      c.x += c.speed;
      if (c.x - c.w * 0.5 > 1) { c.x = -c.w * 0.5; c.y = 0.06 + Math.random() * 0.30; }
      var cx = c.x * W, cy = c.y * H, cw = c.w * W, ch = c.h * H;
      ctx.globalAlpha = c.alpha * a;
      ctx.fillStyle = 'rgba(255,255,255,0.90)';
      ctx.beginPath(); ctx.ellipse(cx, cy, cw * 0.5, ch * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - cw * 0.28, cy + ch * 0.1, cw * 0.32, ch * 0.38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + cw * 0.28, cy + ch * 0.1, cw * 0.34, ch * 0.38, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + cw * 0.14, cy - ch * 0.12, cw * 0.28, ch * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawMountains() {
    mtLayers.forEach(function (layer) {
      var offset = scrollRatio * layer.speed * H;
      var pts = layer.points;
      ctx.beginPath();
      ctx.moveTo(pts[0] * W, pts[1] * H + offset);
      for (var i = 2; i < pts.length; i += 2) {
        ctx.lineTo(pts[i] * W, pts[i + 1] * H + offset);
      }
      ctx.closePath();
      ctx.fillStyle = lerpRGB(layer.lt, layer.dk, darkT);
      ctx.globalAlpha = 1;
      ctx.fill();
    });
  }

  function loop() {
    /* smoothly lerp darkT toward target */
    var target = isDark() ? 1 : 0;
    darkT += (target - darkT) * 0.04;

    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars();
    drawMoon();
    drawSun();
    drawClouds();
    drawMountains();
    requestAnimationFrame(loop);
  }

  return { init: init };
})();

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
   CUSTOM CURSOR
═══════════════════════════════════════════ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var dotX = 0, dotY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', function (e) { dotX = e.clientX; dotY = e.clientY; });

  (function animCursor() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    dot.style.left  = dotX + 'px'; dot.style.top  = dotY + 'px';
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(animCursor);
  })();

  var els = document.querySelectorAll('a, button, [data-tilt], .tool-card, .travel-card, .recipe-card, .social-link-item, .atag, input, textarea');
  els.forEach(function (el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
  });
  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });
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
   NAVBAR
═══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   SECTION CARD ANIMATIONS (ScrollTrigger)
═══════════════════════════════════════════ */
function initSectionCards() {
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* each editorial card slides up + fades in on scroll */
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

  /* content cards: fade-only (no y-movement — avoids double-up with hover lift) */
  gsap.utils.toArray('.section-content').forEach(function (content) {
    var items = content.querySelectorAll(
      '.travel-card, .recipe-card, .tool-card, .social-link-item, .contact-form-card'
    );
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      clearProps: 'opacity',   /* let CSS own opacity after animation ends */
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
  /* light-only — ensure the attribute is set */
  document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.style.colorScheme = 'light';
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
