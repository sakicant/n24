(function () {
  'use strict';

  // Header: transparent over the hero, solid once the page scrolls.
  var header = document.querySelector('.site-header');
  var menuBtn = header.querySelector('.menu-btn');
  var mobileNav = document.getElementById('mobile-nav');

  function paint() {
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-solid', open || window.scrollY > 24);
  }
  window.addEventListener('scroll', paint, { passive: true });
  paint();

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    paint();
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); }
  });
  // Email links: the address is not in the HTML, so scrapers cannot harvest it.
  // Each .js-email link carries the two halves reversed; they are joined here.
  // Without JavaScript the link still works and points to the contact form.
  function rev(s) { return (s || '').split('').reverse().join(''); }
  Array.prototype.forEach.call(document.querySelectorAll('.js-email'), function (a) {
    var addr = rev(a.getAttribute('data-u')) + String.fromCharCode(64) + rev(a.getAttribute('data-h'));
    a.href = 'mailto:' + addr;
    (a.querySelector('.js-email-text') || a).textContent = addr;
  });

  // Areas dropdown: hover opens it on desktop; click and keyboard work too.
  Array.prototype.forEach.call(document.querySelectorAll('.menu-toggle'), function (btn) {
    btn.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
    });
  });
  document.addEventListener('click', function (e) {
    Array.prototype.forEach.call(document.querySelectorAll('.menu-toggle[aria-expanded="true"]'), function (btn) {
      if (!btn.parentNode.contains(e.target)) btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll('.menu-toggle[aria-expanded="true"]'), function (btn) {
      btn.setAttribute('aria-expanded', 'false'); btn.focus();
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.m-toggle'), function (btn) {
    var sub = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      sub.hidden = open;
    });
  });

  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) {
    if (m.matches) setMenu(false);
  });

  // Cookie consent. The site sets no cookies and loads no tracking, so there is
  // nothing to ask about yet. When an optional service is added (for example
  // analytics), list it here: the banner then appears until the visitor chooses,
  // and "Cookie settings" links ([data-cookie-settings]) reopen it.
  var OPTIONAL_SERVICES = [];
  var KEY = 'n24-cookie-choice';

  function readChoice() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function saveChoice(accepted) {
    try { localStorage.setItem(KEY, JSON.stringify({ accepted: accepted, date: new Date().toISOString().slice(0, 10) })); } catch (e) {}
  }

  var banner;
  function closeBanner() { if (banner) { banner.remove(); banner = null; } }
  function choose(accepted) {
    saveChoice(accepted);
    closeBanner();
    if (accepted) OPTIONAL_SERVICES.forEach(function (load) { load(); });
  }
  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie choice');
    banner.innerHTML =
      '<p><strong>Cookies</strong> We would like to use cookies to see how visitors use this website. Nothing is set unless you accept. <a href="/privacy-policy/#cookies">Cookie policy</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-navy" data-choice="accept">Accept</button>' +
      '<button type="button" class="btn btn-line" data-choice="decline">Decline</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-choice]');
      if (b) choose(b.getAttribute('data-choice') === 'accept');
    });
    document.body.appendChild(banner);
  }

  if (OPTIONAL_SERVICES.length) {
    var choice = readChoice();
    if (!choice) showBanner();
    else if (choice.accepted) OPTIONAL_SERVICES.forEach(function (load) { load(); });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-settings]')) { closeBanner(); showBanner(); }
    });
  }
})();
