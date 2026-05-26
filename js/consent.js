/* ============================================================
   SPIKE SECURITY — Cookie Consent
   Manages user cookie preferences via localStorage.
   Exposes window.SpikeConsent for the contact-page map script.
   ============================================================ */

(function () {
  'use strict';

  /* ── Constants ── */
  var STORAGE_KEY = 'spike-consent-v1';
  var VERSION = 1;
  var EVENTS = {
    CHANGE: 'spike:consent-change',
    OPEN:   'spike:open-cookie-preferences'
  };

  /* ── Storage helpers ── */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed.version !== VERSION) return null;
      return parsed;
    } catch (_) { return null; }
  }

  function writeConsent(input) {
    var state = {
      essential:  true,
      functional: !!input.functional,
      timestamp:  Date.now(),
      version:    VERSION
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    window.dispatchEvent(new CustomEvent(EVENTS.CHANGE, { detail: state }));
    return state;
  }

  function openCookiePreferences() {
    window.dispatchEvent(new Event(EVENTS.OPEN));
  }

  /* ── Public API ── */
  window.SpikeConsent = { readConsent: readConsent, writeConsent: writeConsent, openCookiePreferences: openCookiePreferences, EVENTS: EVENTS };

  /* ── Banner ── */
  function buildBanner() {
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'ck-title');
    el.setAttribute('aria-describedby', 'ck-desc');
    el.setAttribute('hidden', '');
    el.innerHTML = [
      '<div class="ck-backdrop" aria-hidden="true"></div>',
      '<div class="ck-card">',

      /* ── MAIN VIEW ── */
      '<div class="ck-view" id="ck-main">',
        '<p class="ck-kicker">Privacy</p>',
        '<h2 class="ck-title" id="ck-title">About cookies on this site.</h2>',
        '<div class="ck-body" id="ck-desc">',
          '<p>We store a small preference locally to remember the choice you make below. With your permission, we also load an interactive map from a third-party service on our Contact page.</p>',
          '<p>We don&rsquo;t use analytics, advertising, or cross-site tracking.</p>',
        '</div>',
        '<div class="ck-actions">',
          '<button type="button" class="ck-btn ck-btn-secondary" id="ck-reject">Reject all</button>',
          '<button type="button" class="ck-btn ck-btn-primary" id="ck-accept" data-cookie-primary>Accept all</button>',
        '</div>',
        '<div class="ck-links">',
          '<button type="button" class="ck-text-btn" id="ck-customise">Customise preferences</button>',
          '<a class="ck-policy-link" href="privacy.html">Privacy policy <span aria-hidden="true">↗</span></a>',
        '</div>',
      '</div>',

      /* ── PREFERENCES VIEW ── */
      '<div class="ck-view" id="ck-prefs" hidden>',
        '<button type="button" class="ck-back-btn" id="ck-back"><span aria-hidden="true">←</span> Back</button>',
        '<p class="ck-kicker">Privacy</p>',
        '<h2 class="ck-title" id="ck-title-prefs">Customise preferences.</h2>',
        '<div class="ck-categories">',

          /* Strictly necessary */
          '<div class="ck-category">',
            '<div class="ck-cat-text">',
              '<p class="ck-cat-name">Strictly necessary</p>',
              '<p class="ck-cat-desc">A single local preference that remembers your choice on this banner. The site cannot function without it.</p>',
            '</div>',
            '<span class="ck-always-on">Always on</span>',
          '</div>',

          /* Functional */
          '<div class="ck-category">',
            '<div class="ck-cat-text">',
              '<p class="ck-cat-name">Functional</p>',
              '<p class="ck-cat-desc">Loads our interactive office map from CartoDB on the Contact page. Without this you see a static placeholder — the address is still shown.</p>',
            '</div>',
            '<button type="button" class="ck-toggle" id="ck-functional-toggle" role="switch" aria-checked="false" aria-label="Toggle Functional cookies">',
              '<span class="ck-toggle-thumb" aria-hidden="true"></span>',
            '</button>',
          '</div>',

        '</div>',
        '<button type="button" class="ck-btn ck-btn-primary ck-btn-full" id="ck-save" data-cookie-primary>Save preferences</button>',
      '</div>',

      '</div>' /* /ck-card */
    ].join('');
    return el;
  }

  function showView(banner, viewId) {
    banner.querySelectorAll('.ck-view').forEach(function (v) {
      v.hidden = (v.id !== viewId);
    });
    /* Move focus to primary action */
    setTimeout(function () {
      var primary = banner.querySelector('[data-cookie-primary]');
      if (primary) primary.focus();
    }, 50);
  }

  function initBanner() {
    /* Skip auto-show on privacy page */
    var path = window.location.pathname;
    var isPrivacyPage = path === '/privacy' || path.indexOf('privacy.html') !== -1;

    var banner = buildBanner();
    document.body.appendChild(banner);

    var toggle    = banner.querySelector('#ck-functional-toggle');
    var functional = false;

    function setToggle(val) {
      functional = val;
      toggle.setAttribute('aria-checked', String(val));
      toggle.classList.toggle('ck-toggle--on', val);
    }

    function openBanner(startView) {
      banner.removeAttribute('hidden');
      document.body.classList.add('ck-open');
      showView(banner, startView || 'ck-main');
    }

    function closeBanner() {
      banner.setAttribute('hidden', '');
      document.body.classList.remove('ck-open');
    }

    /* Accept / Reject */
    banner.querySelector('#ck-accept').addEventListener('click', function () {
      writeConsent({ functional: true });
      closeBanner();
    });
    banner.querySelector('#ck-reject').addEventListener('click', function () {
      writeConsent({ functional: false });
      closeBanner();
    });

    /* Switch to prefs view */
    banner.querySelector('#ck-customise').addEventListener('click', function () {
      var current = readConsent();
      setToggle(current ? current.functional : false);
      showView(banner, 'ck-prefs');
    });

    /* Back to main */
    banner.querySelector('#ck-back').addEventListener('click', function () {
      showView(banner, 'ck-main');
    });

    /* Toggle */
    toggle.addEventListener('click', function () {
      setToggle(!functional);
    });

    /* Save prefs */
    banner.querySelector('#ck-save').addEventListener('click', function () {
      writeConsent({ functional: functional });
      closeBanner();
    });

    /* Re-open via footer link */
    window.addEventListener(EVENTS.OPEN, function () {
      var current = readConsent();
      setToggle(current ? current.functional : false);
      openBanner('ck-main');
    });

    /* Esc — only close if consent already recorded */
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !banner.hidden && readConsent()) {
        closeBanner();
      }
    });

    /* Auto-show if no decision yet and not on privacy page */
    if (!readConsent() && !isPrivacyPage) {
      openBanner('ck-main');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }

})();
