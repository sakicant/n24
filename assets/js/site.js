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
})();
