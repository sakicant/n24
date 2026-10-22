(function () {
  'use strict';

  var section = document.querySelector('[data-area]');
  var area = section.getAttribute('data-area');
  var grid = document.getElementById('area-grid');
  var empty = document.getElementById('area-empty');
  var chipsBox = document.getElementById('area-chips');
  var title = document.getElementById('area-listings-title');
  var place = N24.areaName(area);

  var ORDER = ['house', 'apartment', 'villa', 'land', 'new-build'];
  var LABEL = { all: 'All', house: 'Houses', apartment: 'Apartments', villa: 'Villas', land: 'Land', 'new-build': 'New builds' };
  var type = 'all';
  var listings = [];

  // Primošten Resort has its own page; its units show here only under New builds.
  function visible(l) {
    if (l.project === 'primosten-resort' && type !== 'new-build') return false;
    return type === 'all' || l.type === type;
  }

  function buildChips() {
    // Only types that have something for sale here get a chip.
    var types = ORDER.filter(function (t) { return listings.some(function (l) { return l.type === t; }); });
    chipsBox.innerHTML = ['all'].concat(types).map(function (t) {
      return '<button type="button" class="chip" data-type="' + t + '" aria-pressed="' + (t === type) + '">' + LABEL[t] + '</button>';
    }).join('');
    chipsBox.hidden = types.length < 2;
  }

  function render() {
    var hits = listings.filter(visible);
    var what = type === 'all' ? 'Property' : LABEL[type];
    title.textContent = what + ' for sale in ' + place + (hits.length ? ' (' + hits.length + ')' : '');
    grid.innerHTML = hits.map(N24.card).join('');
    grid.hidden = hits.length === 0;
    empty.hidden = hits.length !== 0;
    Array.prototype.forEach.call(chipsBox.children, function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-type') === type));
    });
  }

  chipsBox.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (!c) return;
    type = c.getAttribute('data-type');
    render();
  });

  N24.blockSampleLinks(grid);
  N24.load()
    .then(function (data) {
      listings = data.filter(function (l) { return l.area === area; });
      buildChips();
      render();
    })
    .catch(function () { empty.hidden = false; });
})();
