(function () {
  'use strict';

  var section = document.querySelector('[data-area]');
  var area = section.getAttribute('data-area');
  var form = document.getElementById('area-filters');
  var grid = document.getElementById('area-grid');
  var empty = document.getElementById('area-empty');
  var chipsBox = document.getElementById('area-chips');
  var title = document.getElementById('area-listings-title');
  var place = N24.areaName(area);

  var ORDER = ['house', 'apartment', 'villa', 'land', 'new-build'];
  var LABEL = { all: 'All', house: 'Houses', apartment: 'Apartments', villa: 'Villas', land: 'Land', 'new-build': 'New builds' };
  var type = 'all';
  var listings = [];

  // Filters live in the URL, so a filtered view can be shared: ?type=land&price=300000
  var params = new URLSearchParams(location.search);
  if (LABEL[params.get('type')]) type = params.get('type');
  var price = N24.setupRange(form, 'price');
  var size = N24.setupRange(form, 'size');
  price.set(params.get('pmin'), params.get('pmax') || params.get('price'));
  size.set(params.get('smin'), params.get('smax'));
  ['beds', 'sort'].forEach(function (k) { if (params.get(k)) form.elements[k].value = params.get(k); });

  function current() {
    return {
      price: price.get(),
      size: size.get(),
      beds: +form.elements.beds.value || 0,
      sort: form.elements.sort.value
    };
  }

  function visible(l, f) {
    // Primošten Resort has its own page; its units show here only under New builds.
    if (l.project === 'primosten-resort' && type !== 'new-build') return false;
    if (type !== 'all' && l.type !== type) return false;
    if (!N24.inRange(l.price, f.price)) return false;
    if (!N24.inRange(l.size, f.size)) return false;
    if (f.beds && (!l.beds || l.beds < f.beds || l.type === 'land')) return false;
    return true;
  }

  function sorted(hits, by) {
    var fn = {
      'price-asc': function (a, b) { return (a.price || Infinity) - (b.price || Infinity); },
      'price-desc': function (a, b) { return (b.price || 0) - (a.price || 0); },
      'size-desc': function (a, b) { return (b.size || 0) - (a.size || 0); }
    }[by];
    return fn ? hits.slice().sort(fn) : hits;
  }

  function buildChips() {
    // Only types that have something for sale here get a chip.
    var types = ORDER.filter(function (t) { return listings.some(function (l) { return l.type === t; }); });
    if (type !== 'all' && types.indexOf(type) === -1) type = 'all';
    chipsBox.innerHTML = ['all'].concat(types).map(function (t) {
      return '<button type="button" class="chip" data-type="' + t + '" aria-pressed="' + (t === type) + '">' + LABEL[t] + '</button>';
    }).join('');
    chipsBox.hidden = types.length < 2;
  }

  function syncUrl(f) {
    var p = new URLSearchParams();
    if (type !== 'all') p.set('type', type);
    if (f.price.min) p.set('pmin', f.price.min);
    if (f.price.max) p.set('pmax', f.price.max);
    if (f.size.min) p.set('smin', f.size.min);
    if (f.size.max) p.set('smax', f.size.max);
    if (f.beds) p.set('beds', f.beds);
    if (f.sort !== 'newest') p.set('sort', f.sort);
    var qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    var f = current();
    var hits = sorted(listings.filter(function (l) { return visible(l, f); }), f.sort);
    var what = type === 'all' ? 'Property' : LABEL[type];
    title.textContent = what + ' for sale in ' + place + (hits.length ? ' (' + hits.length + ')' : '');
    grid.innerHTML = hits.map(N24.card).join('');
    grid.hidden = hits.length === 0;
    empty.hidden = hits.length !== 0;
    Array.prototype.forEach.call(chipsBox.children, function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-type') === type));
    });
    syncUrl(f);
  }

  chipsBox.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (!c) return;
    type = c.getAttribute('data-type');
    render();
  });
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  N24.blockSampleLinks(grid);
  N24.load()
    .then(function (data) {
      // Only this area's listings are ever shown on its page.
      listings = data.filter(function (l) { return l.area === area; });
      buildChips();
      render();
    })
    .catch(function () { empty.hidden = false; });
})();
