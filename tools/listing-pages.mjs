// Builds one page per listing and language (/nekretnina/<id>-<slug>/, /en/property/...,
// /de/immobilie/...) from assets/data/listings.json. On the live server PHP makes the
// same pages (api/lib/render.php): change both together.
import { LANGS, LANG_INFO, AREA_SLUGS, pathFor, propertyPath } from './i18n.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
const SITE = 'https://n24.hr';
const AREA_NAMES = { vodice: 'Vodice', srima: 'Srima', sibenik: 'Šibenik', brodarica: 'Brodarica', zaboric: 'Žaborić', grebastica: 'Grebaštica', primosten: 'Primošten', rogoznica: 'Rogoznica' };

export function formatters(lang) {
  const locale = LANG_INFO[lang].locale;
  const euro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  return { euro: (v) => euro.format(v), num: (v) => num.format(v) };
}

/** A listing's texts in a language: its translation if there is one, else the text as entered. */
export function listingText(l, lang) {
  const t = (l.tr && l.tr[lang]) || {};
  return {
    title: t.title || l.title,
    slug: t.slug || l.slug,
    description: t.description || l.description || [],
    features: t.features || l.features || [],
    standards: t.standards || l.standards || null,
    status: t.status || l.status || '',
    units: t.units || null, // translated unit names, same order as l.units
  };
}

export const listingUrl = (l, lang) => propertyPath(lang, l.id, listingText(l, lang).slug);

function ctx(lang, ui) {
  const f = formatters(lang);
  const areaName = (id) => AREA_NAMES[id] || ui.places_other[id] || ui.place_unknown;
  const priceText = (l, none) => (l.price ? (l.units ? ui.card.from + ' ' : '') + f.euro(l.price) : none);
  return { lang, ui, ...f, areaName, priceText, p: ui.property };
}

function img(c, title, name, n, sizes, extra = '') {
  const base = `/assets/img/listings/${name}`;
  return `<img src="${base}-1200.webp" srcset="${base}-640.webp 640w, ${base}-1200.webp 1200w, ${base}-1920.webp 1920w" sizes="${sizes}" alt="${esc(fill(c.p.photo_alt, { title, n }))}" ${extra}>`;
}

function gallery(c, l, title) {
  const photos = l.photos || [];
  const n = photos.length;
  if (!n) return '';
  const thumbs = [];
  for (let i = 2; i <= Math.min(n, 5); i++) {
    const more = i === 5 && n > 5 ? `<span class="pg-more">${esc(fill(c.p.more_photos, { n: n - 5 }))}</span>` : '';
    thumbs.push(`<button type="button" class="pg-thumb" data-photo="${i}" aria-label="${esc(fill(c.p.open_photo, { n: i, total: n }))}">${img(c, title, photos[i - 1], i, '(min-width: 900px) 20vw, 50vw', 'loading="lazy" width="640" height="480"')}${more}</button>`);
  }
  return `<div class="pg" data-photos="${photos.join(',')}" data-title="${esc(title)}">
      <button type="button" class="pg-main" data-photo="1" aria-label="${esc(fill(c.p.open_photo, { n: 1, total: n }))}">${img(c, title, photos[0], 1, '(min-width: 900px) 60vw, 100vw', 'fetchpriority="high" width="1200" height="800"')}</button>
      ${thumbs.length ? `<div class="pg-thumbs">${thumbs.join('')}</div>` : ''}
      <button type="button" class="pg-all" data-photo="1">${esc(fill(c.p.all_photos, { n }))}</button>
    </div>`;
}

function facts(c, l, t) {
  const p = c.p;
  const land = l.type === 'land';
  const rows = [];
  rows.push([p.f_price, l.price ? c.priceText(l) : p.on_request]);
  rows.push([p.f_type, c.ui.types[l.type]]);
  rows.push([p.f_place, c.areaName(l.area)]);
  if (l.size) rows.push([land ? p.f_plot : p.f_living, c.num(l.size) + ' m²']);
  if (l.plot && !land) rows.push([p.f_plot, c.num(l.plot) + ' m²']);
  if (l.beds && !land) rows.push([p.f_bedrooms, l.beds]);
  if (l.baths && !land) rows.push([p.f_bathrooms, l.baths]);
  if (l.year) rows.push([p.f_year, l.year]);
  if (l.parking) rows.push([p.f_parking, l.parking]);
  if (l.garage) rows.push([p.f_garage, l.garage]);
  if (t.status) rows.push([p.f_status, t.status]);
  rows.push([p.f_ref, l.id.toUpperCase()]);
  return rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n          ');
}

function units(c, l, t) {
  if (!l.units) return '';
  const p = c.p;
  const hasGarden = l.units.some((u) => u[4]);
  const hasBeds = l.units.some((u) => u[5]);
  const rows = l.units.map((u, i) => {
    const [name, size, price, status, garden, beds] = u;
    const shown = (t.units && t.units[i]) || name;
    const cell = status ? `<span class="u-sold">${esc(c.ui.unit_status[status] || status)}</span>` : price ? c.euro(price) : esc(p.on_request);
    return `<tr><th scope="row">${esc(shown)}</th><td>${size ? c.num(size) + ' m²' : ''}</td>${hasBeds ? `<td>${beds || ''}</td>` : ''}${hasGarden ? `<td>${garden ? c.num(garden) + ' m²' : ''}</td>` : ''}<td>${cell}</td></tr>`;
  }).join('\n            ');
  const land = l.type === 'land';
  return `<h2>${esc(land ? p.plots_title : p.units_title)}</h2>
      <div class="units-wrap"><table class="units">
        <thead><tr><th scope="col">${esc(land ? p.plot : p.unit)}</th><th scope="col">${esc(p.size)}</th>${hasBeds ? `<th scope="col">${esc(p.bedrooms)}</th>` : ''}${hasGarden ? `<th scope="col">${esc(p.garden)}</th>` : ''}<th scope="col">${esc(p.price)}</th></tr></thead>
        <tbody>
            ${rows}
        </tbody>
      </table></div>`;
}

function similar(c, l, all) {
  const pool = all.filter((x) => x.id !== l.id && !x.hidden && x.slug);
  const score = (x) => (x.area === l.area ? 2 : 0) + (x.type === l.type ? 1 : 0);
  const picks = pool.sort((a, b) => score(b) - score(a)).slice(0, 3);
  if (!picks.length) return '';
  return `<section class="similar wrap" aria-labelledby="similar-title">
    <h2 id="similar-title">${esc(c.p.similar)}</h2>
    <ul class="grid">${picks.map((x) => card(c, x)).join('')}</ul>
  </section>`;
}

// Same markup as the cards in assets/js/listings.js, rendered at build time.
function card(c, l) {
  const t = listingText(l, c.lang);
  const ph = l.img
    ? `<img src="/assets/img/listings/${l.img}-640.webp" srcset="/assets/img/listings/${l.img}-640.webp 640w, /assets/img/listings/${l.img}-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="${esc(t.title)}" loading="lazy" width="640" height="480">`
    : '';
  const tag = l.project === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '';
  const land = l.type === 'land';
  const f = [];
  if (l.size) f.push(c.num(l.size) + ' m²' + (land ? ' ' + c.ui.card.plot : ''));
  if (l.beds && !land) f.push(l.beds + ' ' + c.ui.card.bed);
  if (l.baths && !land) f.push(l.baths + ' ' + c.ui.card.bath);
  if (!f.length && t.status) f.push(esc(t.status));
  const price = l.price ? `<span class="price">${c.priceText(l)}</span>` : `<span class="price ask">${esc(c.ui.card.price_request)}</span>`;
  return `<li class="card"><a href="${listingUrl(l, c.lang)}"><div class="ph">${ph}${tag}</div><p class="meta"><span>${c.areaName(l.area)}</span><span>${c.ui.types[l.type]}</span></p><h3>${esc(t.title)}</h3><div class="row"><span class="facts-line">${f.join(' · ')}</span>${price}</div></a></li>`;
}

/** One page object per visible listing, in one language. */
export function listingPages(all, lang, ui) {
  const c = ctx(lang, ui);
  const p = c.p;
  return all.filter((l) => !l.hidden && l.slug).map((l) => {
    const t = listingText(l, lang);
    const place = c.areaName(l.area);
    const onCoast = AREA_SLUGS.includes(l.area);
    const ref = l.id.toUpperCase();
    const path = listingUrl(l, lang);
    const waText = encodeURIComponent(fill(p.wa_text, { title: t.title, ref }));
    const areaUrl = onCoast ? pathFor(lang, `area-${l.area}`) : pathFor(lang, 'properties');
    const areaLabel = onCoast ? fill(ui.crumb_area, { name: place }) : ui.crumb_properties;
    const contactUrl = pathFor(lang, 'contact');
    const resortNote = l.project === 'primosten-resort'
      ? `<p class="resort-note">${fill(p.resort_note, { url: pathFor(lang, 'resort') })}</p>` : '';
    const html = `  <section class="band-hero band-hero-short property-hero" aria-labelledby="page-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="${esc(p.breadcrumb)}"><a href="${pathFor(lang, 'home')}">${esc(ui.crumb_home)}</a> <span aria-hidden="true">/</span> <a href="${areaUrl}">${esc(areaLabel)}</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(t.title)}</span></nav>
      <div class="ph-row">
        <div>
          <h1 id="page-title">${esc(t.title)}</h1>
          <p class="ph-meta">${place} · ${c.ui.types[l.type]} · ${esc(fill(p.ref_short, { ref }))}</p>
        </div>
        <p class="ph-price">${c.priceText(l, esc(ui.card.price_request))}</p>
      </div>
    </div>
  </section>

  <div class="wrap property-gallery">
    ${gallery(c, l, t.title)}
    ${l.renders ? `<p class="render-note">${esc(p.renders)}</p>` : ''}
  </div>

  <div class="wrap property-body">
    <article class="property-main" aria-labelledby="about-title">
      <h2 id="about-title">${esc(p.about)}</h2>
      ${resortNote}
      ${t.description.map((x) => `<p>${esc(x)}</p>`).join('\n      ')}
      ${units(c, l, t)}
      ${t.standards ? `<h3>${esc(p.standards)}</h3>\n      <ul class="ticks">${t.standards.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      ${t.features.length ? `<h2>${esc(p.features)}</h2>\n      <ul class="feature-list">${t.features.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      <h2>${esc(p.key_facts)}</h2>
      <dl class="key-facts">
          ${facts(c, l, t)}
      </dl>
    </article>

    <aside class="property-aside" aria-labelledby="ask-title">
      <div class="ask-card">
        <h2 id="ask-title">${esc(p.ask_title)}</h2>
        <p>${esc(p.ask_text)}</p>
        <a class="btn btn-red" href="${contactUrl}?topic=buy&amp;ref=${encodeURIComponent(ref)}&amp;title=${encodeURIComponent(t.title)}">${esc(p.ask_button)}</a>
        <div class="ask-alt">
          <a href="https://wa.me/385957007001?text=${waText}">WhatsApp</a>
          <a href="tel:+385957007001">${esc(p.call)}</a>
        </div>
        <p class="ask-ref">${esc(fill(p.reference, { ref }))}</p>
      </div>
    </aside>
  </div>

  ${similar(c, l, all)}`;
    const ld = [
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.crumb_home, item: SITE + pathFor(lang, 'home') },
        { '@type': 'ListItem', position: 2, name: areaLabel, item: SITE + areaUrl },
        { '@type': 'ListItem', position: 3, name: t.title, item: SITE + path },
      ] },
      { '@context': 'https://schema.org', '@type': 'RealEstateListing', name: t.title, url: SITE + path,
        description: t.description[0] || t.title,
        image: l.img ? `${SITE}/assets/img/listings/${l.img}-1200.webp` : undefined,
        ...(l.price ? { offers: { '@type': 'Offer', price: l.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' } } : {}) },
    ];
    const first = t.description[0] || t.title;
    const desc = first.slice(0, 150);
    const alternates = Object.fromEntries(LANGS.map((lg) => [lg, listingUrl(l, lg)]));
    return {
      id: `property-${l.id}`, listing: l, lang, path, alternates, nav: onCoast ? `area-${l.area}` : 'buy',
      html, bodyClass: 'has-band-hero', scripts: ['/assets/js/property.js'],
      title: `${t.title}, ${place} | ${c.priceText(l, ui.card.price_request)} | N24`,
      description: desc.length < first.length ? desc.replace(/\s+\S*$/, '') + '...' : desc,
      head: ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n'),
    };
  });
}
