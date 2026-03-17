/* ============================================================
   GREY'S GIFT LODGE — Main JavaScript
   Navigation, scroll behaviour, interactive UI
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll: make header opaque when page scrolls ─────────── */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 50;

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ── Mobile menu toggle ────────────────────────────────────── */
  const menuToggle  = document.getElementById('menu-toggle');
  const mobileNav   = document.getElementById('mobile-nav');
  const backdrop    = document.getElementById('nav-backdrop');
  const mobileClose = document.getElementById('mobile-nav-close');

  function openMenu() {
    mobileNav.classList.add('is-open');
    backdrop.classList.add('show');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    backdrop.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ── Mobile sub-menu accordions ────────────────────────────── */
  const expandBtns = document.querySelectorAll('.mobile-nav__expand');

  expandBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const subMenu = this.closest('.mobile-nav__item').querySelector('.mobile-nav__sub');
      const isOpen  = subMenu.classList.contains('show');

      // Close all open submenus
      document.querySelectorAll('.mobile-nav__sub.show').forEach(function (sub) {
        sub.classList.remove('show');
      });
      document.querySelectorAll('.mobile-nav__expand.is-open').forEach(function (b) {
        b.classList.remove('is-open');
      });

      if (!isOpen) {
        subMenu.classList.add('show');
        this.classList.add('is-open');
      }
    });
  });

  /* ── Active nav link: highlight based on current page ──────── */
  (function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--book), .mobile-nav__link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop().split('#')[0] || 'index.html';
      if (linkFile === currentPath) {
        link.classList.add('is-active');
      }
    });
  })();

  /* ── Smooth scroll for anchor links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
        if (mobileNav && mobileNav.classList.contains('is-open')) closeMenu();
      }
    });
  });

  /* ── Simple fade-in on scroll (Intersection Observer) ──────── */
  const fadeEls = document.querySelectorAll(
    '.card, .split__body, .highlight, .stat, .info-card'
  );

  if ('IntersectionObserver' in window && fadeEls.length) {
    // Prime elements
    fadeEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── Booking form: set min date to today ───────────────────── */
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(function (input) {
    input.setAttribute('min', today);
  });

  /* ── Newsletter form stub ──────────────────────────────────── */
  const nlForms = document.querySelectorAll('.footer__newsletter-form');
  nlForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('.footer__nl-input');
      if (input && input.value) {
        input.value = '';
        input.placeholder = 'Thank you — we\'ll be in touch!';
      }
    });
  });

  /* ── Contact form stub ─────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Enquiry Sent — Thank You!';
        btn.disabled = true;
        btn.style.background = '#4A5D3A';
      }
    });
  }

})();
