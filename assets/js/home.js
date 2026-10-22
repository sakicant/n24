(function () {
  'use strict';

  // The 8 areas in road order along the D8, with approximate km from Vodice.
  var AREAS = [
    { id: 'vodice', name: 'Vodice', km: 0, y: 22 },
    { id: 'srima', name: 'Srima', km: 3, y: 23 },
    { id: 'sibenik', name: 'Šibenik', km: 11, y: 22 },
    { id: 'brodarica', name: 'Brodarica', km: 17, y: 27 },
    { id: 'zaboric', name: 'Žaborić', km: 21, y: 25 },
    { id: 'grebastica', name: 'Grebaštica', km: 25, y: 27 },
    { id: 'primosten', name: 'Primošten', km: 33, y: 45 },
    { id: 'rogoznica', name: 'Rogoznica', km: 45, y: 24 }
  ];
  var ROAD_KM = 45;
  var OTHER_AREAS = { tisno: 'Tisno' };
  var TYPES = { house: 'House', apartment: 'Apartment', villa: 'Villa', land: 'Land', 'new-build': 'New build' };
  var TYPE_PLURAL = { all: 'properties', house: 'houses', apartment: 'apartments', villa: 'villas', land: 'plots of land', 'new-build': 'new builds' };
  var MAX_CARDS = 6;

  var road = document.querySelector('.road');
  var stopsEl = road.querySelector('.stops');
  var areaGrid = document.querySelector('.area-grid');
  var marker = road.querySelector('.road-marker');
  var grid = document.getElementById('grid');
  var empty = document.getElementById('empty');
  var countEl = document.getElementById('listings-count');
  var title = document.getElementById('listings-title');
  var moreLink = document.getElementById('more-link');
  var showAll = document.getElementById('show-all');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));

  var params = new URLSearchParams(location.search);
  var state = {
    area: AREAS.some(function (a) { return a.id === params.get('area'); }) ? params.get('area') : null,
    type: TYPES[params.get('type')] ? params.get('type') : 'all'
  };
  var listings = [];

  var euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('en-GB');

  function areaName(id) {
    var a = AREAS.filter(function (x) { return x.id === id; })[0];
    return a ? a.name : (OTHER_AREAS[id] || 'Location to confirm');
  }

  function matches(l, area, type) {
    return (!area || l.area === area) && (type === 'all' || l.type === type);
  }

  function buildStops() {
    AREAS.forEach(function (a, i) {
      var li = document.createElement('li');
      li.className = 'stop ' + (i % 2 ? 'down' : 'up');
      li.style.left = (a.km / ROAD_KM * 100) + '%';
      li.style.setProperty('--y', a.y);
      li.dataset.area = a.id;
      li.innerHTML =
        '<button type="button" aria-pressed="false">' +
        '<span class="pin" aria-hidden="true"></span>' +
        '<span class="label"><span class="name">' + a.name + '</span><br><span class="n"></span></span>' +
        '<span class="km" aria-hidden="true">km ' + a.km + '</span>' +
        '</button>';
      li.querySelector('button').addEventListener('click', function () {
        state.area = state.area === a.id ? null : a.id;
        update(true);
      });
      stopsEl.appendChild(li);
    });

    // Phones get a plain grid of places instead of the coast road.
    AREAS.concat([{ id: null, name: 'All properties' }]).forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'area-btn' + (a.id ? '' : ' area-all');
      b.dataset.area = a.id || '';
      b.innerHTML = '<span class="a-name">' + a.name + '</span><span class="a-n"></span>';
      b.addEventListener('click', function () {
        state.area = a.id;
        update(true);
      });
      areaGrid.appendChild(b);
    });
  }

  function planPlaceholder() {
    return '<div class="ph-plan" aria-hidden="true"><svg viewBox="0 0 100 75">' +
      '<path d="M4 8 L40 4 L44 30 L8 36 Z M44 30 L40 4 L74 6 L78 28 Z M8 36 L44 30 L48 66 L12 70 Z M78 28 L74 6 L96 10 L96 34 Z M48 66 L44 30 L78 28 L80 62 Z"/>' +
      '<path class="plot" d="M44 30 L78 28 L80 62 L48 66 Z"/></svg></div>';
  }

  function card(l) {
    var href = l.sample ? '#' : '/property/' + l.id + '-' + l.slug + '/';
    var ph = l.img
      ? '<img src="/assets/img/listings/' + l.img + '-640.webp" srcset="/assets/img/listings/' + l.img + '-640.webp 640w, /assets/img/listings/' + l.img + '-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="' + l.title + '" loading="lazy" width="640" height="480">'
      : planPlaceholder();
    var tag = l.sample ? '<span class="tag sample">Sample listing</span>'
      : (l.project === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '');
    var facts = [];
    var land = l.type === 'land';
    if (l.size) facts.push(num.format(l.size) + ' m²' + (land ? ' plot' : ''));
    if (l.beds && !land) facts.push(l.beds + ' bed');
    if (l.baths && !land) facts.push(l.baths + ' bath');
    if (!facts.length && l.note) facts.push(l.note);
    var price = l.price ? '<span class="price">' + euro.format(l.price) + '</span>' : '<span class="price ask">Price on request</span>';
    return '<li class="card"><a href="' + href + '"' + (l.sample ? ' aria-disabled="true"' : '') + '>' +
      '<div class="ph">' + ph + tag + '</div>' +
      '<p class="meta"><span>' + areaName(l.area) + '</span><span>' + TYPES[l.type] + '</span></p>' +
      '<h3>' + l.title + '</h3>' +
      '<div class="row"><span class="facts-line">' + facts.join(' · ') + '</span>' + price + '</div>' +
      '</a></li>';
  }

  function render() {
    var hits = listings.filter(function (l) { return matches(l, state.area, state.type); });
    var place = state.area ? areaName(state.area) : null;
    var what = TYPE_PLURAL[state.type];

    title.textContent = place
      ? (state.type === 'all' ? 'For sale in ' + place : capital(what) + ' for sale in ' + place)
      : (state.type === 'all' ? 'For sale on the coast' : capital(what) + ' for sale on the coast');
    countEl.textContent = hits.length === 1 ? '1 listing' : hits.length + ' listings';

    grid.innerHTML = hits.slice(0, MAX_CARDS).map(card).join('');
    grid.hidden = hits.length === 0;
    empty.hidden = hits.length !== 0;

    var base = place ? '/real-estate-' + state.area + '/' : '/properties-for-sale/';
    var q = state.type === 'all' ? '' : '?type=' + state.type;
    moreLink.href = base + q;
    moreLink.textContent = place ? 'See everything in ' + place : 'See every property for sale';
    showAll.href = base + q;
    showAll.textContent = 'Show ' + hits.length + ' ' + (hits.length === 1 ? what.replace(/s$/, '').replace('plots of land', 'plot') : what);
  }

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function paintRoad() {
    Array.prototype.forEach.call(stopsEl.children, function (li) {
      var id = li.dataset.area;
      var n = listings.filter(function (l) { return matches(l, id, state.type); }).length;
      var btn = li.querySelector('button');
      li.querySelector('.n').textContent = n === 1 ? '1 listing' : n + ' listings';
      li.classList.toggle('is-empty', n === 0);
      btn.setAttribute('aria-pressed', String(state.area === id));
      btn.setAttribute('aria-label', areaName(id) + ', ' + n + (n === 1 ? ' listing' : ' listings'));
      if (state.area === id) {
        marker.style.left = li.style.left;
        marker.style.top = (52 + +li.style.getPropertyValue('--y')) + 'px';
      }
    });
    road.classList.toggle('has-pick', !!state.area);
    Array.prototype.forEach.call(areaGrid.children, function (b) {
      var id = b.dataset.area || null;
      var n = listings.filter(function (l) { return matches(l, id, state.type); }).length;
      b.querySelector('.a-n').textContent = n;
      b.classList.toggle('is-empty', n === 0);
      b.setAttribute('aria-pressed', String(state.area === id));
      b.setAttribute('aria-label', (id ? areaName(id) : 'All properties') + ', ' + n + (n === 1 ? ' listing' : ' listings'));
    });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.type === state.type)); });
  }

  function syncUrl() {
    var p = new URLSearchParams();
    if (state.area) p.set('area', state.area);
    if (state.type !== 'all') p.set('type', state.type);
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }

  var swapTimer;
  function update(animate) {
    paintRoad();
    syncUrl();
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { render(); return; }
    clearTimeout(swapTimer);
    grid.classList.add('is-swapping');
    swapTimer = setTimeout(function () { render(); grid.classList.remove('is-swapping'); }, 180);
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () { state.type = c.dataset.type; update(true); });
  });

  // Sample listings link nowhere yet.
  grid.addEventListener('click', function (e) {
    var a = e.target.closest('a[aria-disabled="true"]');
    if (a) e.preventDefault();
  });

  buildStops();
  fetch('/assets/data/listings.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      // Homepage shows only the 8 coast areas; other places live on their own pages.
      listings = data.filter(function (l) { return AREAS.some(function (a) { return a.id === l.area; }); });
      update(false);
      // On narrow screens, bring the chosen stop into view on the coast ribbon.
      if (state.area) {
        var li = stopsEl.querySelector('[data-area="' + state.area + '"]');
        if (li) li.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    })
    .catch(function () {
      countEl.textContent = '';
      empty.hidden = false;
    });
})();
