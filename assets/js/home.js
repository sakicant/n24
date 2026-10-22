(function () {
  'use strict';

  var AREAS = N24.AREAS;
  var TYPE_PLURAL = N24.TYPE_PLURAL;
  var areaName = N24.areaName;
  var LATEST = 3;

  var areaGrid = document.querySelector('.area-grid');
  var go = document.getElementById('show-all');
  var latest = document.getElementById('latest');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));

  var state = { area: null, type: 'all' };
  var listings = [];

  var SINGULAR = { properties: 'property', houses: 'house', apartments: 'apartment', villas: 'villa', 'plots of land': 'plot of land', 'new builds': 'new build' };

  function matches(l, area, type) {
    return (!area || l.area === area) && (type === 'all' || l.type === type);
  }

  // Grid order: Šibenik and Brodarica first, then Vodice and Srima.
  var GRID_ORDER = ['sibenik', 'brodarica', 'vodice', 'srima', 'zaboric', 'grebastica', 'primosten', 'rogoznica'];

  function buildPlaces() {
    GRID_ORDER.map(function (id) { return AREAS.filter(function (a) { return a.id === id; })[0]; })
      .concat([{ id: null, name: 'All properties' }]).forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'area-btn' + (a.id ? '' : ' area-all');
        b.dataset.area = a.id || '';
        b.innerHTML = '<span class="a-name">' + a.name + '</span><span class="a-n"></span>';
        b.addEventListener('click', function () { state.area = a.id; paint(); });
        areaGrid.appendChild(b);
      });
  }

  // The finder only counts; the results live on the search page.
  function paint() {
    Array.prototype.forEach.call(areaGrid.children, function (b) {
      var id = b.dataset.area || null;
      var n = listings.filter(function (l) { return matches(l, id, state.type); }).length;
      b.querySelector('.a-n').textContent = n;
      b.classList.toggle('is-empty', n === 0);
      b.setAttribute('aria-pressed', String(state.area === id));
      b.setAttribute('aria-label', (id ? areaName(id) : 'All properties') + ', ' + n + (n === 1 ? ' listing' : ' listings'));
    });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.type === state.type)); });

    var n = listings.filter(function (l) { return matches(l, state.area, state.type); }).length;
    var what = TYPE_PLURAL[state.type];
    var place = state.area ? ' in ' + areaName(state.area) : '';
    if (n === 0) {
      go.href = '/contact/?topic=buy';
      go.textContent = 'Nothing yet' + place + ', ask Tomislav';
      return;
    }
    var p = new URLSearchParams();
    if (state.area) p.set('area', state.area);
    if (state.type !== 'all') p.set('type', state.type);
    go.href = '/properties/' + (p.toString() ? '?' + p.toString() : '');
    go.textContent = 'Show ' + n + ' ' + (n === 1 ? SINGULAR[what] : what) + place;
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () { state.type = c.dataset.type; paint(); });
  });

  buildPlaces();
  N24.blockSampleLinks(latest);
  N24.load()
    .then(function (data) {
      // The homepage counts only the 8 coast areas; other places live on their own pages.
      listings = data.filter(function (l) { return N24.isArea(l.area); });
      paint();
      // Newest real listings first (the data is in newest-first order).
      latest.innerHTML = data.filter(function (l) { return !l.sample && N24.isArea(l.area); })
        .slice(0, LATEST).map(N24.card).join('');
    })
    .catch(function () { latest.closest('section').hidden = true; });
})();
