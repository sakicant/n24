(function () {
  'use strict';

  // Photo viewer: opens over the page, arrows and swipe to move, Escape to close.
  var g = document.querySelector('.pg');
  if (!g) return;
  var id = g.getAttribute('data-id');
  var count = +g.getAttribute('data-count');
  var title = g.getAttribute('data-title');
  var current = 1;
  var box, imgEl, counter, lastFocus;

  function src(n, w) { return '/assets/img/listings/' + id + '-' + n + '-' + w + '.webp'; }

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photos: ' + title);
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close photos">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<figure class="lb-figure"><img alt=""><figcaption class="lb-count"></figcaption></figure>' +
      '<button type="button" class="lb-next" aria-label="Next photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>';
    document.body.appendChild(box);
    imgEl = box.querySelector('img');
    counter = box.querySelector('.lb-count');
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { go(-1); });
    box.querySelector('.lb-next').addEventListener('click', function () { go(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  function show(n) {
    current = (n - 1 + count) % count + 1;
    imgEl.src = src(current, 1920);
    imgEl.srcset = src(current, 1200) + ' 1200w, ' + src(current, 1920) + ' 1920w';
    imgEl.sizes = '100vw';
    imgEl.alt = title + ', photo ' + current + ' of ' + count;
    counter.textContent = current + ' / ' + count;
    // Load the neighbours early so moving feels instant.
    [current % count + 1, (current - 2 + count) % count + 1].forEach(function (k) { new Image().src = src(k, 1920); });
  }

  function go(d) { show(current + d); }

  function open(n) {
    if (!box) build();
    lastFocus = document.activeElement;
    show(n);
    box.classList.add('is-open');
    document.body.classList.add('menu-open');
    box.querySelector('.lb-close').focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (lastFocus) lastFocus.focus();
  }

  g.addEventListener('click', function (e) {
    var b = e.target.closest('[data-photo]');
    if (b) open(+b.getAttribute('data-photo'));
  });
  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();
