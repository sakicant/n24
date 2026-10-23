// Builds one static page per real listing (/property/<id>-<slug>/) from assets/data/listings.json.
const AREA_NAMES = { vodice: 'Vodice', srima: 'Srima', sibenik: 'Šibenik', brodarica: 'Brodarica', zaboric: 'Žaborić', grebastica: 'Grebaštica', primosten: 'Primošten', rogoznica: 'Rogoznica', tisno: 'Tisno' };
const COAST = ['vodice', 'srima', 'sibenik', 'brodarica', 'zaboric', 'grebastica', 'primosten', 'rogoznica'];
const TYPES = { house: 'House', apartment: 'Apartment', villa: 'Villa', land: 'Land', 'new-build': 'New build' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });
const areaName = (id) => AREA_NAMES[id] || 'Location to confirm';

export const listingPath = (l) => `/property/${l.id}-${l.slug}/`;

function img(l, n, sizes, extra = '') {
  const base = `/assets/img/listings/${l.id}-${n}`;
  return `<img src="${base}-1200.webp" srcset="${base}-640.webp 640w, ${base}-1200.webp 1200w, ${base}-1920.webp 1920w" sizes="${sizes}" alt="${esc(l.title)}, photo ${n}" ${extra}>`;
}

function gallery(l) {
  const n = l.gallery || 0;
  if (!n) {
    return `<div class="pg-main pg-single">${l.img ? `<img src="/assets/img/listings/${l.img}-1200.webp" alt="${esc(l.title)}">` : ''}</div>`;
  }
  const thumbs = [];
  for (let i = 2; i <= Math.min(n, 5); i++) {
    const more = i === 5 && n > 5 ? `<span class="pg-more">+${n - 5} photos</span>` : '';
    thumbs.push(`<button type="button" class="pg-thumb" data-photo="${i}" aria-label="Open photo ${i} of ${n}">${img(l, i, '(min-width: 900px) 20vw, 50vw', 'loading="lazy" width="640" height="480"')}${more}</button>`);
  }
  return `<div class="pg" data-id="${l.id}" data-count="${n}" data-title="${esc(l.title)}">
      <button type="button" class="pg-main" data-photo="1" aria-label="Open photo 1 of ${n}">${img(l, 1, '(min-width: 900px) 60vw, 100vw', 'fetchpriority="high" width="1200" height="800"')}</button>
      ${thumbs.length ? `<div class="pg-thumbs">${thumbs.join('')}</div>` : ''}
      <button type="button" class="pg-all" data-photo="1">Show all ${n} photos</button>
    </div>`;
}

function facts(l) {
  const rows = [];
  const land = l.type === 'land';
  rows.push(['Price', l.price ? euro.format(l.price) : 'On request']);
  rows.push(['Type', TYPES[l.type]]);
  rows.push(['Place', areaName(l.area)]);
  if (l.size) rows.push([land ? 'Plot' : 'Living area', num.format(l.size) + ' m²']);
  if (l.plot && !land) rows.push(['Plot', num.format(l.plot) + ' m²']);
  if (l.beds && !land) rows.push(['Bedrooms', l.beds]);
  if (l.baths && !land) rows.push(['Bathrooms', l.baths]);
  if (l.year) rows.push(['Year built', l.year]);
  if (l.parking) rows.push(['Parking spaces', l.parking]);
  if (l.garage) rows.push(['Garage', l.garage]);
  if (l.status) rows.push(['Status', l.status]);
  rows.push(['Reference', l.id.toUpperCase()]);
  return rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('\n          ');
}

function units(l) {
  if (!l.units) return '';
  const hasGarden = l.units.some((u) => u[4]);
  const rows = l.units.map((u) => {
    const [name, size, price, status, garden] = u;
    return `<tr><th scope="row">${esc(name)}</th><td>${num.format(size)} m²</td>${hasGarden ? `<td>${garden ? num.format(garden) + ' m²' : ''}</td>` : ''}<td>${status ? `<span class="u-sold">${esc(status)}</span>` : euro.format(price)}</td></tr>`;
  }).join('\n            ');
  return `<h2>Units and prices</h2>
      <div class="units-wrap"><table class="units">
        <thead><tr><th scope="col">Unit</th><th scope="col">Size</th>${hasGarden ? '<th scope="col">Garden</th>' : ''}<th scope="col">Price</th></tr></thead>
        <tbody>
            ${rows}
        </tbody>
      </table></div>`;
}

function similar(l, all, card) {
  const pool = all.filter((x) => x.id !== l.id && !x.sample && x.slug);
  const score = (x) => (x.area === l.area ? 2 : 0) + (x.type === l.type ? 1 : 0);
  const picks = pool.sort((a, b) => score(b) - score(a)).slice(0, 3);
  if (!picks.length) return '';
  return `<section class="similar wrap" aria-labelledby="similar-title">
    <h2 id="similar-title">Similar properties</h2>
    <ul class="grid">${picks.map(card).join('')}</ul>
  </section>`;
}

// Same markup as the cards in assets/js/listings.js, rendered at build time.
export function staticCard(l) {
  const ph = l.img
    ? `<img src="/assets/img/listings/${l.img}-640.webp" srcset="/assets/img/listings/${l.img}-640.webp 640w, /assets/img/listings/${l.img}-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="${esc(l.title)}" loading="lazy" width="640" height="480">`
    : '';
  const tag = l.project === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '';
  const land = l.type === 'land';
  const f = [];
  if (l.size) f.push(num.format(l.size) + ' m²' + (land ? ' plot' : ''));
  if (l.beds && !land) f.push(l.beds + ' bed');
  if (l.baths && !land) f.push(l.baths + ' bath');
  if (!f.length && l.status) f.push(l.status);
  const price = l.price ? `<span class="price">${euro.format(l.price)}</span>` : '<span class="price ask">Price on request</span>';
  return `<li class="card"><a href="${listingPath(l)}"><div class="ph">${ph}${tag}</div><p class="meta"><span>${areaName(l.area)}</span><span>${TYPES[l.type]}</span></p><h3>${esc(l.title)}</h3><div class="row"><span class="facts-line">${f.join(' · ')}</span>${price}</div></a></li>`;
}

export function listingPages(all) {
  return all.filter((l) => !l.sample && l.slug).map((l) => {
    const place = areaName(l.area);
    const onCoast = COAST.includes(l.area);
    const ref = l.id.toUpperCase();
    const waText = encodeURIComponent(`Hello Tomislav, I'm interested in "${l.title}" (${ref}).`);
    const crumbArea = onCoast ? `<a href="/real-estate-${l.area}/">Real estate ${place}</a> <span aria-hidden="true">/</span> ` : `<a href="/properties/">Properties</a> <span aria-hidden="true">/</span> `;
    const resortNote = l.project === 'primosten-resort'
      ? `<p class="resort-note">Part of <a href="/primosten-resort/">Primošten Resort</a>. See all units, floors and availability on the resort page.</p>` : '';
    const html = `  <section class="band-hero band-hero-short property-hero" aria-labelledby="page-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> ${crumbArea}<span aria-current="page">${esc(l.title)}</span></nav>
      <div class="ph-row">
        <div>
          <h1 id="page-title">${esc(l.title)}</h1>
          <p class="ph-meta">${place} · ${TYPES[l.type]} · Ref. ${ref}</p>
        </div>
        <p class="ph-price">${l.price ? euro.format(l.price) : 'Price on request'}</p>
      </div>
    </div>
  </section>

  <div class="wrap property-gallery">
    ${gallery(l)}
  </div>

  <div class="wrap property-body">
    <article class="property-main" aria-labelledby="about-title">
      <h2 id="about-title">About this property</h2>
      ${resortNote}
      ${(l.description || []).map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
      ${units(l)}
      ${l.standards ? `<h3>Construction and finishing</h3>\n      <ul class="ticks">${l.standards.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      ${l.features && l.features.length ? `<h2>Features</h2>\n      <ul class="feature-list">${l.features.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      <h2>Key facts</h2>
      <dl class="key-facts">
          ${facts(l)}
      </dl>
    </article>

    <aside class="property-aside" aria-labelledby="ask-title">
      <div class="ask-card">
        <h2 id="ask-title">Interested in this property?</h2>
        <p>Tomislav Plenča will answer your questions and arrange a viewing.</p>
        <a class="btn btn-red" href="/contact/?topic=buy&amp;ref=${encodeURIComponent(ref)}&amp;title=${encodeURIComponent(l.title)}">Ask about this property</a>
        <div class="ask-alt">
          <a href="https://wa.me/385957007001?text=${waText}">WhatsApp</a>
          <a href="tel:+385957007001">Call</a>
        </div>
        <p class="ask-ref">Reference ${ref}</p>
      </div>
    </aside>
  </div>

  ${'{{similar}}'}`;
    const ld = [
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.realestatecroatia-n24.com/' },
        onCoast
          ? { '@type': 'ListItem', position: 2, name: `Real estate ${place}`, item: `https://www.realestatecroatia-n24.com/real-estate-${l.area}/` }
          : { '@type': 'ListItem', position: 2, name: 'Properties', item: 'https://www.realestatecroatia-n24.com/properties/' },
        { '@type': 'ListItem', position: 3, name: l.title, item: `https://www.realestatecroatia-n24.com${listingPath(l)}` },
      ] },
      { '@context': 'https://schema.org', '@type': 'RealEstateListing', name: l.title, url: `https://www.realestatecroatia-n24.com${listingPath(l)}`,
        description: (l.description || [])[0] || l.title,
        image: l.gallery ? `https://www.realestatecroatia-n24.com/assets/img/listings/${l.id}-1-1200.webp` : undefined,
        ...(l.price ? { offers: { '@type': 'Offer', price: l.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' } } : {}) },
    ];
    const desc = ((l.description || [])[0] || l.title).slice(0, 150);
    return {
      html, listing: l, out: `property/${l.id}-${l.slug}/index.html`, path: listingPath(l), nav: onCoast ? `area-${l.area}` : 'buy',
      bodyClass: 'has-band-hero', scripts: ['/assets/js/property.js'],
      title: `${l.title}, ${place} | ${l.price ? euro.format(l.price) : 'Price on request'} | N24`,
      description: desc.length < ((l.description || [])[0] || '').length ? desc.replace(/\s+\S*$/, '') + '...' : desc,
      head: ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n'),
      similarFor: (cardFn) => similar(l, all, cardFn),
    };
  });
}
