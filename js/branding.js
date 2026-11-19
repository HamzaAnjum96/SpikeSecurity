/* Spike Security brand guidelines (/branding)
   Scroll-spy, copy-to-clipboard, the width-axis demo and the
   email signature builder. Everything still reads and downloads
   without JavaScript; these are enhancements. */
(function () {
  'use strict';

  /* ── Clipboard helpers ───────────────────────────────────── */
  function copyWithSelection(node, html, text) {
    var selection = window.getSelection();
    if (!selection) return false;
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    function onCopy(event) {
      if (!event.clipboardData) return;
      if (html) event.clipboardData.setData('text/html', html);
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    }
    document.addEventListener('copy', onCopy);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.removeEventListener('copy', onCopy);
    if (ok) selection.removeAllRanges();
    return ok; // when false the content stays selected for a manual copy
  }

  function copyText(text, node) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () {
        return copyWithSelection(node, null, text);
      });
    }
    return Promise.resolve(copyWithSelection(node, null, text));
  }

  function copyRich(html, text, node) {
    if (navigator.clipboard && navigator.clipboard.write && typeof window.ClipboardItem === 'function') {
      var item = new window.ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' })
      });
      return navigator.clipboard.write([item]).then(function () { return true; }, function () {
        return copyWithSelection(node, html, text);
      });
    }
    return Promise.resolve(copyWithSelection(node, html, text));
  }

  /* ── Hex values ──────────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    var timer;
    button.addEventListener('click', function () {
      copyText(button.getAttribute('data-copy'), button).then(function (ok) {
        if (!ok) return;
        button.classList.add('is-copied');
        clearTimeout(timer);
        timer = setTimeout(function () { button.classList.remove('is-copied'); }, 1800);
      });
    });
  });

  /* ── Scroll-spy for the section bar ──────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.bar-nav a'));
  var navList = document.querySelector('.bar-nav ol');
  var byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a === byId[id]) {
        a.setAttribute('aria-current', 'true');
        // keep the active item visible in the horizontally scrolling bar
        if (navList && navList.scrollWidth > navList.clientWidth) {
          var left = a.offsetLeft - (navList.clientWidth - a.offsetWidth) / 2;
          navList.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
        }
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = null;
      document.querySelectorAll('main > section[id]').forEach(function (section) {
        if (visible[section.id] && !current) current = section.id;
      });
      setCurrent(current && byId[current] ? current : null);
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ── Width axis demo ─────────────────────────────────────── */
  var range = document.getElementById('axis-range');
  var sample = document.getElementById('axis-sample');
  var out = document.getElementById('axis-out');
  if (range && sample && out) {
    var describe = function (v) {
      if (v <= 75) return 'condensed';
      if (v >= 112) return 'expanded';
      return 'normal';
    };
    var update = function () {
      var v = Number(range.value);
      sample.style.fontStretch = v + '%';
      out.textContent = v + '%, ' + describe(v);
      range.setAttribute('aria-valuetext', v + ' percent, ' + describe(v));
    };
    range.addEventListener('input', update);
    update();
  }

  /* ── Email signature builder ─────────────────────────────── */
  var form = document.getElementById('sig-form');
  var outNode = document.getElementById('sig-out');
  var status = document.getElementById('sig-status');
  var mail = document.getElementById('mail');
  if (!form || !outNode) return;

  var SITE = 'https://www.spikesecurity.co.uk';
  var LOGO_PATH = '/resources/brand/email/spike-security-email-shield.png';
  var C = { orange: '#FF5B1A', obsidian: '#0B0C0E', obsidian2: '#131417', bone: '#EEEAE0', ash: '#A39E94' };
  var FONT = 'font-family:Arial,Helvetica,sans-serif;';
  var OFFICE = '020 3757 2767';
  var LEGAL_1 = 'Spike Security Limited. Registered in England and Wales, company no. 16807138.';
  var LEGAL_2 = 'Registered office: 13 Kelvin Grove, Manchester M8 0SX.';

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function nbsp(value) { return esc(value).replace(/ /g, '&nbsp;'); }
  function telHref(value) {
    var digits = String(value).replace(/[^\d+]/g, '');
    if (/^0\d{9,10}$/.test(digits)) digits = '+44' + digits.slice(1);
    return 'tel:' + digits;
  }

  function read() {
    var data = new FormData(form);
    return {
      name: String(data.get('name') || '').trim(),
      role: String(data.get('role') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      style: data.get('style') === 'light' ? 'light' : 'dark'
    };
  }

  // Email-client-safe HTML: tables, inline styles, web-safe fonts, hosted image.
  function signatureHTML(d, logoSrc) {
    var dark = d.style === 'dark';
    var ink = dark ? C.bone : 'inherit';
    var muted = dark ? C.ash : 'inherit';
    var pad = dark ? '16px' : '0';
    var top = dark ? ' bgcolor="' + C.obsidian + '"' : '';
    var topBg = dark ? 'background-color:' + C.obsidian + ';' : '';
    var band = dark ? ' bgcolor="' + C.obsidian2 + '"' : '';
    var bandBg = dark ? 'background-color:' + C.obsidian2 + ';' : '';
    var rows = '';

    if (d.name || d.role) {
      rows += '<tr><td style="padding:0 0 14px;' + FONT + '">' +
        (d.name ? '<span style="' + FONT + 'font-size:15px;line-height:20px;font-weight:bold;color:inherit;">' + esc(d.name) + '</span>' : '') +
        (d.name && d.role ? '<br>' : '') +
        (d.role ? '<span style="' + FONT + 'font-size:13px;line-height:18px;color:inherit;">' + esc(d.role) + '</span>' : '') +
        '</td></tr>';
    }

    var mobile = d.phone
      ? ' &nbsp;&middot;&nbsp; M <a href="' + esc(telHref(d.phone)) + '" style="color:' + ink + ';text-decoration:none;">' + nbsp(d.phone) + '</a>'
      : '';

    rows +=
      '<tr><td' + top + ' style="' + topBg + 'border-top:3px solid ' + C.orange + ';padding:14px ' + pad + ' 12px;' + FONT + '">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>' +
          '<td width="34" valign="middle" style="width:34px;"><img src="' + logoSrc + '" width="34" height="44" alt="" style="display:block;width:34px;height:44px;border:0;"></td>' +
          '<td width="12" style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>' +
          '<td valign="middle" style="' + FONT + '">' +
            '<span style="' + FONT + 'font-size:17px;line-height:20px;font-weight:bold;letter-spacing:1.4px;color:' + ink + ';">SPIKE SECURITY</span><br>' +
            '<span style="' + FONT + 'font-size:10px;line-height:16px;font-weight:bold;letter-spacing:1.8px;color:' + muted + ';">LICENSED SECURITY &middot; NORTH WEST</span>' +
          '</td>' +
        '</tr></table>' +
        '<p style="margin:12px 0 0;' + FONT + 'font-size:13px;line-height:20px;color:' + ink + ';">' +
          'T <a href="tel:+442037572767" style="color:' + ink + ';text-decoration:none;">' + nbsp(OFFICE) + '</a>' + mobile + '<br>' +
          '<a href="mailto:info@spikesecurity.co.uk" style="color:' + ink + ';text-decoration:underline;">info@spikesecurity.co.uk</a> &nbsp;&middot;&nbsp; ' +
          '<a href="' + SITE + '/" style="color:' + ink + ';text-decoration:underline;">spikesecurity.co.uk</a>' +
        '</p>' +
      '</td></tr>' +
      '<tr><td' + band + ' style="' + bandBg + 'padding:9px ' + pad + ' 10px;' + FONT + 'font-size:11px;line-height:16px;color:' + muted + ';">' +
        LEGAL_1 + '<br>' + LEGAL_2 +
      '</td></tr>';

    return '<table role="presentation" width="440" cellpadding="0" cellspacing="0" border="0" style="width:440px;max-width:100%;border-collapse:collapse;' + FONT + '">' + rows + '</table>';
  }

  function signatureText(d) {
    var lines = [];
    if (d.name) lines.push(d.name);
    if (d.role) lines.push(d.role);
    if (lines.length) lines.push('');
    lines.push('SPIKE SECURITY');
    lines.push('T ' + OFFICE + (d.phone ? ' · M ' + d.phone : ''));
    lines.push('info@spikesecurity.co.uk · spikesecurity.co.uk');
    lines.push('');
    lines.push(LEGAL_1);
    lines.push(LEGAL_2);
    return lines.join('\n');
  }

  var current = read();
  function render() {
    current = read();
    // Preview uses a page-relative image so it shows before deployment; the copy uses the live URL.
    outNode.innerHTML = signatureHTML(current, LOGO_PATH.slice(1));
  }

  var DEFAULT_STATUS = status ? status.textContent : '';
  var statusTimer;
  function say(message, ok) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-ok', !!ok);
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      status.textContent = DEFAULT_STATUS;
      status.classList.remove('is-ok');
    }, 8000);
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  render();

  var htmlButton = document.getElementById('copy-html');
  var textButton = document.getElementById('copy-text');
  if (htmlButton) {
    htmlButton.addEventListener('click', function () {
      var html = signatureHTML(current, SITE + LOGO_PATH);
      copyRich(html, signatureText(current), outNode).then(function (ok) {
        say(ok
          ? 'Signature copied. Paste it into your mail app’s signature settings.'
          : 'Your browser blocked copying, so the signature is selected. Press Ctrl+C, or ⌘C on a Mac, to copy it.', ok);
      });
    });
  }
  if (textButton) {
    textButton.addEventListener('click', function () {
      copyText(signatureText(current), outNode).then(function (ok) {
        say(ok
          ? 'Plain-text signature copied.'
          : 'Your browser blocked copying, so the signature is selected. Press Ctrl+C, or ⌘C on a Mac, to copy it.', ok);
      });
    });
  }

  // Preview inside a light or dark mail app
  document.querySelectorAll('input[name="client"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.checked && mail) mail.setAttribute('data-theme', radio.value);
    });
  });
})();
