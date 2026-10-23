// Shared listing data and card markup for the homepage and the search page.
window.N24 = (function () {
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
  var OTHER_AREAS = { tisno: 'Tisno' };
  var TYPES = { house: 'House', apartment: 'Apartment', villa: 'Villa', land: 'Land', 'new-build': 'New build' };
  var TYPE_PLURAL = { all: 'properties', house: 'houses', apartment: 'apartments', villa: 'villas', land: 'plots of land', 'new-build': 'new builds' };

  var euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('en-GB');

  function isArea(id) {
    return AREAS.some(function (a) { return a.id === id; });
  }

  function areaName(id) {
    var a = AREAS.filter(function (x) { return x.id === id; })[0];
    return a ? a.name : (OTHER_AREAS[id] || 'Location to confirm');
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

  // Sample listings link nowhere yet.
  function blockSampleLinks(container) {
    container.addEventListener('click', function (e) {
      if (e.target.closest('a[aria-disabled="true"]')) e.preventDefault();
    });
  }

  // Price and size filters: a "from" and a "to" select. Only "to" means "up to X",
  // only "from" means "at least X", both make a range.
  var RANGES = {
    price: { steps: [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000], fmt: function (v) { return euro.format(v); } },
    size: { steps: [50, 75, 100, 150, 200, 300, 500, 1000, 2000, 5000], fmt: function (v) { return num.format(v) + ' m²'; } }
  };

  function setupRange(form, key) {
    var lo = form.elements[key + 'Min'];
    var hi = form.elements[key + 'Max'];
    var r = RANGES[key];
    lo.innerHTML = '<option value="">No min</option>' + r.steps.map(function (v) { return '<option value="' + v + '">' + r.fmt(v) + '</option>'; }).join('');
    hi.innerHTML = '<option value="">No max</option>' + r.steps.map(function (v) { return '<option value="' + v + '">' + r.fmt(v) + '</option>'; }).join('');
    // A "from" above the "to" is almost always a slip: swap them.
    function fix() {
      if (lo.value && hi.value && +lo.value > +hi.value) { var t = lo.value; lo.value = hi.value; hi.value = t; }
    }
    lo.addEventListener('change', fix);
    hi.addEventListener('change', fix);
    return {
      get: function () { return { min: +lo.value || 0, max: +hi.value || 0 }; },
      set: function (min, max) { lo.value = min || ''; hi.value = max || ''; fix(); }
    };
  }

  function inRange(v, r) {
    if (r.min && (!v || v < r.min)) return false;
    if (r.max && (!v || v > r.max)) return false;
    return true;
  }

  function load() {
    return fetch('/assets/data/listings.json').then(function (r) { return r.json(); });
  }

  return {
    AREAS: AREAS, TYPES: TYPES, TYPE_PLURAL: TYPE_PLURAL,
    isArea: isArea, areaName: areaName, card: card, blockSampleLinks: blockSampleLinks, load: load,
    setupRange: setupRange, inRange: inRange,
    euro: euro, num: num
  };
})();
