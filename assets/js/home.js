(function () {
  'use strict';

  var AREAS = N24.AREAS;
  var TYPES = N24.TYPES;
  var TYPE_PLURAL = N24.TYPE_PLURAL;
  var areaName = N24.areaName;
  var card = N24.card;
  var MAX_CARDS = 6;

  var areaGrid = document.querySelector('.area-grid');
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

  function matches(l, area, type) {
    return (!area || l.area === area) && (type === 'all' || l.type === type);
  }

  function buildPlaces() {
    // Grid order: Šibenik and Brodarica first, then Vodice and Srima.
    var GRID_ORDER = ['sibenik', 'brodarica', 'vodice', 'srima', 'zaboric', 'grebastica', 'primosten', 'rogoznica'];
    GRID_ORDER.map(function (id) { return AREAS.filter(function (a) { return a.id === id; })[0]; })
      .concat([{ id: null, name: 'All properties' }]).forEach(function (a) {
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

    // The full search page opens with the same filters already set.
    var p = new URLSearchParams();
    if (state.area) p.set('area', state.area);
    if (state.type !== 'all') p.set('type', state.type);
    var href = '/properties-for-sale/' + (p.toString() ? '?' + p.toString() : '');
    moreLink.href = href;
    moreLink.textContent = hits.length > MAX_CARDS
      ? 'Show all ' + hits.length + ' ' + what + (place ? ' in ' + place : '')
      : 'Search all properties';
    showAll.href = href;
    showAll.textContent = 'Show ' + hits.length + ' ' + (hits.length === 1 ? what.replace(/s$/, '').replace('plots of land', 'plot') : what);
  }

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function paintFilters() {
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
    paintFilters();
    syncUrl();
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { render(); return; }
    clearTimeout(swapTimer);
    grid.classList.add('is-swapping');
    swapTimer = setTimeout(function () { render(); grid.classList.remove('is-swapping'); }, 180);
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () { state.type = c.dataset.type; update(true); });
  });

  N24.blockSampleLinks(grid);

  buildPlaces();
  N24.load()
    .then(function (data) {
      // Homepage shows only the 8 coast areas; other places live on their own pages.
      listings = data.filter(function (l) { return AREAS.some(function (a) { return a.id === l.area; }); });
      update(false);
    })
    .catch(function () {
      countEl.textContent = '';
      empty.hidden = false;
    });
})();
