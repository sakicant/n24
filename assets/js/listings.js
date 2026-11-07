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
  // Texts and addresses of the page's language (assets/js/i18n/<lang>.js, made by the build).
  var I = window.N24_I18N;
  var T = I.t;
  var OTHER_AREAS = T.places_other;
  var TYPES = T.types;
  var TYPE_PLURAL = T.type_plural;

  var euro = new Intl.NumberFormat(I.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat(I.locale, { maximumFractionDigits: 2 });
  var plurals = new Intl.PluralRules(I.lang);

  /** "{n} houses" style text: the right plural form for n in this language. */
  function plural(n, forms) {
    return forms[plurals.select(n)] || forms.other;
  }

  function fill(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
  }

  /** A listing's texts in this language: its translation if there is one, else as entered. */
  function text(l) {
    var t = (l.tr && l.tr[I.lang]) || {};
    return { title: t.title || l.title, slug: t.slug || l.slug, status: t.status || l.status || '' };
  }

  function url(l) {
    return I.paths.property + l.id + '-' + text(l).slug + '/';
  }

  function isArea(id) {
    return AREAS.some(function (a) { return a.id === id; });
  }

  function areaName(id) {
    var a = AREAS.filter(function (x) { return x.id === id; })[0];
    return a ? a.name : (OTHER_AREAS[id] || T.place_unknown);
  }

  function planPlaceholder() {
    return '<div class="ph-plan" aria-hidden="true"><svg viewBox="0 0 100 75">' +
      '<path d="M4 8 L40 4 L44 30 L8 36 Z M44 30 L40 4 L74 6 L78 28 Z M8 36 L44 30 L48 66 L12 70 Z M78 28 L74 6 L96 10 L96 34 Z M48 66 L44 30 L78 28 L80 62 Z"/>' +
      '<path class="plot" d="M44 30 L78 28 L80 62 L48 66 Z"/></svg></div>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function card(l) {
    var t = text(l);
    var ph = l.img
      ? '<img src="/assets/img/listings/' + l.img + '-640.webp" srcset="/assets/img/listings/' + l.img + '-640.webp 640w, /assets/img/listings/' + l.img + '-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="' + esc(t.title) + '" loading="lazy" width="640" height="480">'
      : planPlaceholder();
    var tag = l.project === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '';
    var facts = [];
    var land = l.type === 'land';
    if (l.size) facts.push(num.format(l.size) + ' m²' + (land ? ' ' + T.card.plot : ''));
    if (l.beds && !land) facts.push(l.beds + ' ' + T.card.bed);
    if (l.baths && !land) facts.push(l.baths + ' ' + T.card.bath);
    if (!facts.length && t.status) facts.push(esc(t.status));
    var price = l.price ? '<span class="price">' + (l.units ? T.card.from + ' ' : '') + euro.format(l.price) + '</span>' : '<span class="price ask">' + T.card.price_request + '</span>';
    return '<li class="card"><a href="' + url(l) + '">' +
      '<div class="ph">' + ph + tag + '</div>' +
      '<p class="meta"><span>' + areaName(l.area) + '</span><span>' + TYPES[l.type] + '</span></p>' +
      '<h3>' + esc(t.title) + '</h3>' +
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

  // The first option of each select means "no limit" and shows the real lowest or
  // highest value among the listings; the steps in between come from RANGES.
  function setupRange(form, key) {
    var lo = form.elements[key + 'Min'];
    var hi = form.elements[key + 'Max'];
    var r = RANGES[key];
    var wanted = { min: '', max: '' };

    function opt(v, label) { return '<option value="' + v + '">' + label + '</option>'; }

    function fill(values) {
      var nums = (values || []).filter(function (v) { return v > 0; });
      var low = nums.length ? Math.min.apply(null, nums) : 0;
      var high = nums.length ? Math.max.apply(null, nums) : 0;
      var steps = nums.length ? r.steps.filter(function (s) { return s > low && s < high; }) : r.steps;
      // Keep a value that came from a shared link even if it is not a regular step.
      [wanted.min, wanted.max].forEach(function (v) {
        if (v && steps.indexOf(+v) === -1) steps = steps.concat(+v).sort(function (a, b) { return a - b; });
      });
      lo.innerHTML = opt('', nums.length ? r.fmt(low) + ' ' + T.range.min : T.range.any) + steps.map(function (v) { return opt(v, r.fmt(v)); }).join('');
      // The "To" list ends with the highest value, so it reads low to high like "From".
      hi.innerHTML = steps.map(function (v) { return opt(v, r.fmt(v)); }).join('') + opt('', nums.length ? r.fmt(high) + ' ' + T.range.max : T.range.any);
      lo.value = wanted.min;
      hi.value = wanted.max;
      fix();
    }

    // A "from" above the "to" is almost always a slip: swap them.
    function fix() {
      if (lo.value && hi.value && +lo.value > +hi.value) { var t = lo.value; lo.value = hi.value; hi.value = t; }
      wanted = { min: lo.value, max: hi.value };
    }
    lo.addEventListener('change', fix);
    hi.addEventListener('change', fix);
    fill([]);

    return {
      get: function () { return { min: +lo.value || 0, max: +hi.value || 0 }; },
      set: function (min, max) { wanted = { min: min ? String(+min) : '', max: max ? String(+max) : '' }; fill([]); },
      // Called once the listings are loaded, with the prices or sizes on this page.
      bounds: function (values) { fill(values); }
    };
  }

  function inRange(v, r) {
    if (r.min && (!v || v < r.min)) return false;
    if (r.max && (!v || v > r.max)) return false;
    return true;
  }

  // Listings hidden in the admin stay in the file but are not shown.
  function load() {
    return fetch('/assets/data/listings.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (all) { return all.filter(function (l) { return !l.hidden; }); });
  }

  return {
    I: I, T: T, plural: plural, fill: fill, text: text, url: url,
    AREAS: AREAS, TYPES: TYPES, TYPE_PLURAL: TYPE_PLURAL,
    isArea: isArea, areaName: areaName, card: card, blockSampleLinks: blockSampleLinks, load: load,
    setupRange: setupRange, inRange: inRange,
    euro: euro, num: num
  };
})();
