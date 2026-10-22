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
