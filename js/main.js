/* ============================================================
   SPIKE SECURITY — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR — scroll shadow & active link highlighting
     ---------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  // Add shadow when scrolled
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Mobile menu toggle
  if (hamburger && mobileNav) {
    function closeMobileMenu() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Keyboard: Escape closes menu
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMobileMenu();
        hamburger.focus();
      }
    });

    // Focus trap: keep Tab within mobile menu while open
    mobileNav.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(mobileNav.querySelectorAll('.nav-link'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        hamburger.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        hamburger.focus();
      }
    });
  }

  // Active nav link — match current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     2. SMOOTH SCROLL for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height')) || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ----------------------------------------------------------
     3. FADE-IN on scroll (IntersectionObserver)
     ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     4. CAREERS ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const body   = item.querySelector('.accordion-body');
      const isOpen = header.classList.contains('open');

      // Close all others
      document.querySelectorAll('.accordion-item').forEach(other => {
        other.querySelector('.accordion-header').classList.remove('open');
        other.querySelector('.accordion-body').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  /* ----------------------------------------------------------
     5. CONTACT FORM VALIDATION
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('error');
      });
      contactForm.querySelectorAll('.form-error').forEach(err => {
        err.classList.remove('visible');
      });

      // Validate required fields
      contactForm.querySelectorAll('[data-required]').forEach(field => {
        const val   = field.value.trim();
        const errEl = document.getElementById(field.id + 'Error');

        if (!val) {
          field.classList.add('error');
          if (errEl) {
            errEl.textContent = 'This field is required.';
            errEl.classList.add('visible');
          }
          valid = false;
        }
      });

      // Validate email format
      const emailField = document.getElementById('email');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          emailField.classList.add('error');
          const errEl = document.getElementById('emailError');
          if (errEl) {
            errEl.textContent = 'Please enter a valid email address.';
            errEl.classList.add('visible');
          }
          valid = false;
        }
      }

      // Validate phone (basic UK format)
      const phoneField = document.getElementById('phone');
      if (phoneField && phoneField.value.trim()) {
        const cleaned = phoneField.value.replace(/\s/g, '');
        const phoneRegex = /^(\+44|0)[0-9]{9,10}$/;
        if (!phoneRegex.test(cleaned)) {
          phoneField.classList.add('error');
          const errEl = document.getElementById('phoneError');
          if (errEl) {
            errEl.textContent = 'Please enter a valid UK phone number.';
            errEl.classList.add('visible');
          }
          valid = false;
        }
      }

      if (valid) {
        // Simulate successful submission
        const successEl = document.getElementById('formSuccess');
        const submitBtn = contactForm.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
        }
        setTimeout(() => {
          if (successEl) successEl.classList.add('visible');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
          contactForm.reset();
        }, 900);
      }
    });
  }

  /* ----------------------------------------------------------
     6. STAT COUNTER animation (homepage)
     ---------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('[data-target]');
  if (statEls.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => statsObserver.observe(el));
  }

  /* ----------------------------------------------------------
     8. BACK-TO-TOP — injected, scroll-aware
     ---------------------------------------------------------- */
  const btt = document.createElement('button');
  btt.type = 'button';
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>';
  document.body.appendChild(btt);

  const toggleBtt = () => btt.classList.toggle('visible', window.scrollY > 480);
  toggleBtt();
  window.addEventListener('scroll', toggleBtt, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
