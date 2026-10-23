(function () {
  'use strict';

  var PAGE = 12;
  var form = document.getElementById('filters');
  var areasBox = document.getElementById('f-areas');
  var results = document.getElementById('results');
  var empty = document.getElementById('results-empty');
  var title = document.getElementById('results-title');
  var more = document.getElementById('load-more');
  var sort = document.getElementById('f-sort');
  var toggle = document.querySelector('.filters-toggle');
  var countBadge = document.getElementById('filters-count');
  var apply = document.getElementById('f-apply');

  var listings = [];
  var shown = PAGE;

  // Place checkboxes, in road order.
  areasBox.innerHTML = N24.AREAS.map(function (a) {
    return '<label><input type="checkbox" name="area" value="' + a.id + '"><span>' + a.name + '</span></label>';
  }).join('');

  // Read filters from the URL, e.g. ?area=primosten,vodice&type=land&price=500000
  var params = new URLSearchParams(location.search);
  function list(key) { return (params.get(key) || '').split(',').filter(Boolean); }
  list('area').forEach(function (v) { check('area', v); });
  list('type').forEach(function (v) { check('type', v); });
  var price = N24.setupRange(form, 'price');
  var size = N24.setupRange(form, 'size');
  // Older links used price= (a maximum) and size= (a minimum).
  price.set(params.get('pmin'), params.get('pmax') || params.get('price'));
  size.set(params.get('smin') || params.get('size'), params.get('smax'));
  if (params.get('beds')) form.elements.beds.value = params.get('beds');
  if (params.get('sort')) sort.value = params.get('sort');

  function check(name, value) {
    var el = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (el) el.checked = true;
  }

  function values(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }

  function current() {
    return {
      area: values('area'),
      type: values('type'),
      price: price.get(),
      size: size.get(),
      beds: +form.elements.beds.value || 0,
      sort: sort.value
    };
  }

  function filter(f) {
    var hits = listings.filter(function (l) {
      if (f.area.length && f.area.indexOf(l.area) === -1) return false;
      if (f.type.length && f.type.indexOf(l.type) === -1) return false;
      if (!N24.inRange(l.price, f.price)) return false;
      if (!N24.inRange(l.size, f.size)) return false;
      if (f.beds && (!l.beds || l.beds < f.beds || l.type === 'land')) return false;
      return true;
    });
    var by = {
      'price-asc': function (a, b) { return (a.price || Infinity) - (b.price || Infinity); },
      'price-desc': function (a, b) { return (b.price || 0) - (a.price || 0); }
    }[f.sort];
    return by ? hits.slice().sort(by) : hits;
  }

  var SINGULAR = { properties: 'property', houses: 'house', apartments: 'apartment', villas: 'villa', 'plots of land': 'plot of land', 'new builds': 'new build' };

  function heading(f, n) {
    var what = f.type.length === 1 ? N24.TYPE_PLURAL[f.type[0]] : 'properties';
    var where = f.area.length === 1 ? ' in ' + N24.areaName(f.area[0]) : '';
    return n + ' ' + (n === 1 ? SINGULAR[what] : what) + ' for sale' + where;
  }

  function activeCount(f) {
    return f.area.length + f.type.length + (f.price.min || f.price.max ? 1 : 0) + (f.size.min || f.size.max ? 1 : 0) + (f.beds ? 1 : 0);
  }

  function syncUrl(f) {
    var p = new URLSearchParams();
    if (f.area.length) p.set('area', f.area.join(','));
    if (f.type.length) p.set('type', f.type.join(','));
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
    var hits = filter(f);
    title.textContent = heading(f, hits.length);
    results.innerHTML = hits.slice(0, shown).map(N24.card).join('');
    results.hidden = hits.length === 0;
    empty.hidden = hits.length !== 0;
    more.hidden = hits.length <= shown;
    more.textContent = 'Show more (' + (hits.length - Math.min(shown, hits.length)) + ' left)';
    var n = activeCount(f);
    countBadge.textContent = n ? '(' + n + ')' : '';
    apply.textContent = hits.length === 1 ? 'Show 1 property' : 'Show ' + hits.length + ' properties';
    syncUrl(f);
  }

  function changed() { shown = PAGE; render(); }

  form.addEventListener('change', changed);
  sort.addEventListener('change', changed);
  form.addEventListener('reset', function () { setTimeout(changed, 0); });
  document.getElementById('empty-reset').addEventListener('click', function () { form.reset(); });
  more.addEventListener('click', function () { shown += PAGE; render(); });

  // Phones: filters fold away behind a button.
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    form.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
  apply.addEventListener('click', function () {
    setOpen(false);
    document.querySelector('.results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  N24.blockSampleLinks(results);
  N24.load()
    .then(function (data) {
      listings = data;
      price.bounds(listings.map(function (l) { return l.price; }));
      size.bounds(listings.map(function (l) { return l.size; }));
      render();
    })
    .catch(function () { empty.hidden = false; });
})();
