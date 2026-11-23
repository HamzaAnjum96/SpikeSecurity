/* Spike Security website. Small, dependency-free, progressive: every page works without it. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  function ready(fn) { if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }

  // Runs last (see the end of the file), once every variable below has its value
  function init() {
    menu();
    dock();
    consent();
    doc.querySelectorAll('form[data-form]').forEach(form);
    doc.querySelectorAll('[data-map]').forEach(map);
    prefill();
  }

  /* ── Menu (tablets and phones) ───────────────────────────── */
  function menu() {
    var btn = doc.querySelector('.menu-btn');
    var panel = doc.getElementById('menu');
    if (!btn || !panel) return;
    function set(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
      panel.hidden = !open;
      if (open) { var first = panel.querySelector('a'); if (first) first.focus(); }
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches) set(false); });
  }

  /* ── Phone dock: shows once the page's own actions scroll away, hides at the finale ── */
  function dock() {
    var el = doc.getElementById('dock');
    var target = doc.querySelector('.cover-actions, .page-actions, .page-head');
    if (!el || !target || !('IntersectionObserver' in window)) return;
    var finale = doc.querySelector('.sec--signal, #quote, #apply');
    var gone = false, finaleIn = false;
    function set() {
      var on = gone && !finaleIn;
      el.classList.toggle('on', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
      el.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
    }
    new IntersectionObserver(function (e) { gone = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; set(); }).observe(target);
    if (finale) new IntersectionObserver(function (e) { finaleIn = e[0].isIntersecting; set(); }).observe(finale);
  }

  /* ── Forms ───────────────────────────────────────────────── */
  var PHONE = /^(\+44\s?|0)[0-9\s]{9,13}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldLabel(el) {
    var group = el.closest('fieldset.choices');
    if (group && group.querySelector('legend')) return group.querySelector('legend').firstChild.textContent.trim();
    var l = el.id && doc.querySelector('label[for="' + el.id + '"]');
    return l ? l.firstChild.textContent.trim() : el.name;
  }

  function showError(el, msg) {
    var host = el.closest('.field') || el.closest('fieldset.choices');
    var id = (el.id || el.name.replace(/\W+/g, '-')) + '-error';
    var err = doc.getElementById(id);
    if (!err) {
      err = doc.createElement('p');
      err.className = 'field-error';
      err.id = id;
      host.appendChild(err);
    }
    err.innerHTML = '<span class="sr-only">Error: </span>' + msg;
    var targets = el.type === 'radio' ? host.querySelectorAll('input') : [el];
    Array.prototype.forEach.call(targets, function (t) {
      t.setAttribute('aria-invalid', 'true');
      var d = (t.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (d.indexOf(id) < 0) { d.push(id); t.setAttribute('aria-describedby', d.join(' ')); }
    });
  }

  function clearError(el) {
    var host = el.closest('.field') || el.closest('fieldset.choices');
    if (!host) return;
    var err = host.querySelector('.field-error');
    if (err) err.remove();
    host.querySelectorAll('[aria-invalid]').forEach(function (t) { t.removeAttribute('aria-invalid'); });
  }

  function check(el) {
    var v = (el.value || '').trim();
    var name = fieldLabel(el).toLowerCase();
    if (el.type === 'radio') {
      var picked = el.form.querySelector('input[name="' + el.name + '"]:checked');
      if (el.required && !picked) return 'Choose an answer';
      return '';
    }
    if (el.required && !v) {
      if (el.tagName === 'SELECT') return 'Choose ' + (name === 'service' ? 'a service' : name === 'role' ? 'a role' : 'one');
      if (el.hasAttribute('data-phone')) return 'Enter a phone number so we can call you back';
      return 'Enter ' + (name === 'your name' || name === 'full name' ? 'your name' : 'the ' + name.replace(/^the /, ''));
    }
    if (v && el.hasAttribute('data-phone') && !PHONE.test(v)) return 'Enter a UK phone number, like 07700 900123';
    if (v && el.type === 'email' && !EMAIL.test(v)) return 'Enter an email address, like name@company.co.uk';
    if (v && el.dataset.pattern && !new RegExp(el.dataset.pattern).test(v)) return el.dataset.patternMessage || 'Check this answer';
    if (v && el.type === 'number' && (Number(v) < Number(el.min || 1))) return 'Enter a number of 1 or more';
    return '';
  }

  function compose(f) {
    var lines = [], seen = {};
    Array.prototype.forEach.call(f.elements, function (el) {
      if (!el.name || el.type === 'submit' || el.closest('.form-status') || seen[el.name]) return;
      var value;
      if (el.type === 'checkbox' || el.type === 'radio') {
        seen[el.name] = true;
        value = Array.prototype.filter.call(f.querySelectorAll('input[name="' + el.name + '"]'), function (i) { return i.checked; })
          .map(function (i) { return i.value; }).join(', ');
      } else value = el.value.trim();
      if (el.name === 'Message') return;
      lines.push(el.name + ': ' + (value || 'not given'));
    });
    var msg = f.querySelector('[name="Message"]');
    if (msg && msg.value.trim()) lines.push('', msg.value.trim());
    return lines.join('\n');
  }

  function form(f) {
    var status = f.querySelector('.form-status');
    var btn = f.querySelector('[type="submit"]');
    var to = f.dataset.to;
    var endpoint = f.dataset.endpoint;

    // Check a field when you leave it, but never move the layout while a tap is still in progress:
    // an error appearing on pointerdown would push the next control away before the click lands.
    var pointerDown = false, queued = [];
    doc.addEventListener('pointerdown', function () { pointerDown = true; }, true);
    doc.addEventListener('pointerup', function () {
      pointerDown = false;
      setTimeout(function () { queued.splice(0).forEach(function (fn) { fn(); }); }, 0);
    }, true);
    f.addEventListener('focusout', function (e) {
      var el = e.target;
      if (!el.name || el.type === 'radio' || el.type === 'checkbox') return;
      var run = function () { if (el.value.trim() || el.hasAttribute('aria-invalid')) { var m = check(el); clearError(el); if (m) showError(el, m); } };
      if (pointerDown) queued.push(run); else run();
    });
    f.addEventListener('change', function (e) { if (e.target.hasAttribute('aria-invalid') || e.target.type === 'radio') { clearError(e.target); } });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      var done = {};
      Array.prototype.forEach.call(f.elements, function (el) {
        if (!el.name || el.closest('.form-status') || el.type === 'checkbox') return;
        if (el.type === 'radio') { if (done[el.name]) return; done[el.name] = true; }
        clearError(el);
        var m = check(el);
        if (m) { showError(el, m); if (!first) first = el; }
      });
      if (first) { first.focus(); return; }

      var subjectBits = [f.dataset.subject];
      var svc = f.querySelector('[name="Service"], [name="Role"]');
      if (svc && svc.value) subjectBits.push(svc.value);
      var where = f.querySelector('[name="Where"], [name="Name"]');
      if (where && where.value.trim()) subjectBits.push(where.value.trim());
      var subject = subjectBits.join(': ').replace(/: ([^:]*)$/, ', $1');
      var body = compose(f);

      if (endpoint) return post(subject, body);
      handoff(subject, body);
    });

    function show(state) {
      status.hidden = false;
      status.querySelectorAll('[data-state]').forEach(function (s) { s.hidden = s.dataset.state !== state; });
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }

    function handoff(subject, body) {
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var copy = status.querySelector('.copy-text');
      var copyLabel = status.querySelector('[data-copy-label]');
      copy.id = copy.id || (f.closest('[id]').id + '-copy');
      copyLabel.setAttribute('for', copy.id);
      copy.value = 'To: ' + to + '\nSubject: ' + subject + '\n\n' + body;
      var toLink = status.querySelector('[data-to-link]');
      toLink.href = 'mailto:' + to; toLink.textContent = to;
      status.querySelector('[data-reopen]').href = href;
      var copyBtn = status.querySelector('[data-copy]');
      copyBtn.onclick = function () {
        var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy the message'; }, 2500); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(copy.value).then(done, function () { copy.select(); });
        else { copy.select(); try { if (doc.execCommand('copy')) done(); } catch (err) { /* text stays selected */ } }
      };
      show('handoff');
      window.location.href = href;
    }

    function post(subject, body) {
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending…';
      var data = new FormData(f);
      data.append('_subject', subject);
      data.append('_summary', body);
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          var refLine = status.querySelector('[data-ref-line]');
          if (res.ref) { status.querySelector('[data-ref]').textContent = res.ref; refLine.hidden = false; } else refLine.hidden = true;
          show('sent');
          f.querySelectorAll('input:not([type=checkbox]):not([type=radio]), textarea, select').forEach(function (el) { if (!el.closest('.form-status')) el.value = ''; });
        })
        .catch(function () { show('failed'); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    }
  }

  /* /contact?service=door-supervisors and Apply links preselect the right option */
  function prefill() {
    var params = new URLSearchParams(location.search);
    var slug = params.get('service');
    var sel = doc.getElementById('q-service');
    if (slug && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.dataset.slug === slug) sel.value = o.value; });
    var role = doc.getElementById('a-role');
    if (role) doc.querySelectorAll('a[data-role]').forEach(function (a) {
      a.addEventListener('click', function () {
        Array.prototype.forEach.call(role.options, function (o) { if (o.dataset.code === a.dataset.role) role.value = o.value; });
      });
    });
  }

  /* ── Cookies and maps ──────────────────────────────────────
     The site needs no cookies. The one optional extra is the map: its tiles come from
     OpenStreetMap, so maps stay off until the visitor allows them in the cookie prompt. */
  var KEY = 'spike-consent-v1';
  var sessionChoice = null;   // used if the browser blocks storage
  var maps = [];
  var openConsent = function () {};

  function choice() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && typeof c.functional === 'boolean') return c.functional;
    } catch (e) { /* storage unavailable */ }
    return sessionChoice;
  }
  function setChoice(on) {
    sessionChoice = !!on;
    try { localStorage.setItem(KEY, JSON.stringify({ essential: true, functional: !!on, timestamp: Date.now(), version: 1 })); } catch (e) { /* this page only */ }
    maps.forEach(function (m) { if (on) m.on(false); else m.off(); });
  }

  function consent() {
    var box = doc.getElementById('consent');
    if (!box) return;
    var opener = null;
    var allow = box.querySelector('[data-allow]');
    var phone = window.matchMedia('(max-width: 699px)');
    // On phones the prompt is a bottom sheet: pad the page so nothing can be stuck behind it
    function pad() { doc.body.style.paddingBottom = (!box.hidden && phone.matches) ? box.offsetHeight + 'px' : ''; }
    function show() { box.hidden = false; doc.body.classList.add('consent-open'); pad(); }
    window.addEventListener('resize', pad);
    function close() {
      box.hidden = true;
      doc.body.classList.remove('consent-open');
      pad();
      if (opener && doc.contains(opener)) opener.focus({ preventScroll: true });
      opener = null;
    }
    openConsent = function (from) { opener = from || null; show(); allow.focus({ preventScroll: true }); };
    allow.addEventListener('click', function () { setChoice(true); close(); });
    box.querySelector('[data-deny]').addEventListener('click', function () { setChoice(false); close(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
    doc.querySelectorAll('[data-consent-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openConsent(b); });
    });
    // First visit: show the prompt, without taking focus away from the page
    if (choice() === null) show();
  }

  var leaflet = null;
  function loadLeaflet() {
    if (leaflet) return leaflet;
    leaflet = new Promise(function (resolve, reject) {
      var css = doc.createElement('link');
      css.rel = 'stylesheet'; css.href = '/assets/vendor/leaflet/leaflet.css';
      doc.head.appendChild(css);
      var s = doc.createElement('script');
      s.src = '/assets/vendor/leaflet/leaflet.js';
      s.onload = function () { resolve(window.L); };
      s.onerror = function (e) { leaflet = null; reject(e); };
      doc.head.appendChild(s);
    });
    return leaflet;
  }

  // The towns we cover most, used only to frame the area map
  var AREAS = [[53.5769, -2.4282], [53.5933, -2.2966], [53.4875, -2.2901], [53.4794, -2.2453], [53.4466, -2.3086], [53.4083, -2.1494]];

  function map(fig) {
    var canvas = fig.querySelector('.map-canvas');
    var credit = fig.querySelector('.map-credit');
    var status = fig.querySelector('.map-gate-note');
    var note = status ? status.textContent : '';
    var instance = null;
    var mode = fig.dataset.map;
    var lat = parseFloat(fig.dataset.lat), lon = parseFloat(fig.dataset.lon);

    function on(focus) {
      fig.classList.add('is-on');
      credit.hidden = false;
      loadLeaflet().then(function (L) {
        if (instance) return;
        instance = L.map(canvas, {
          zoomControl: true, scrollWheelZoom: false, attributionControl: false,
          dragging: !L.Browser.mobile, tap: false, keyboard: true, zoomSnap: 0.5
        });
        // OpenStreetMap tiles, darkened in CSS; retina tiles keep phones sharp
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, detectRetina: true }).addTo(instance);
        var pin = L.divIcon({
          className: 'map-pin',
          html: '<svg viewBox="0 0 351.64 453.19" aria-hidden="true"><use href="#ss-shield"/></svg>',
          iconSize: [30, 39], iconAnchor: [15, 39]
        });
        L.marker([lat, lon], { icon: pin, keyboard: false, title: 'Spike Security office', zIndexOffset: 2000 }).addTo(instance);
        if (canvas.clientWidth >= 480) {
          L.marker([lat, lon], { keyboard: false, interactive: false, zIndexOffset: 1000,
            icon: L.divIcon({ className: 'map-plate', html: '<span class="map-label">Our office</span>', iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(instance);
        }
        if (mode === 'area') instance.fitBounds(L.latLngBounds(AREAS), { padding: [28, 28], maxZoom: 11 });
        else instance.setView([lat, lon], 15);
        if (status) status.textContent = note;
        if (focus) canvas.focus({ preventScroll: true });
      }).catch(function () {
        fig.classList.remove('is-on');
        credit.hidden = true;
        if (status) status.textContent = 'The map didn’t load. Check your connection and try again.';
      });
    }

    function off() {
      if (instance) { instance.remove(); instance = null; }
      canvas.innerHTML = '';
      canvas.className = 'map-canvas';
      fig.classList.remove('is-on');
      credit.hidden = true;
    }

    maps.push({ on: on, off: off });
    var button = fig.querySelector('.map-on');
    button.addEventListener('click', function () { if (choice()) on(true); else openConsent(button); });
    fig.querySelector('.map-off').addEventListener('click', function () { setChoice(false); button.focus(); });
    if (choice()) on(false);
  }
  ready(init);
})();
