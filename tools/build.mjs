// Builds the website in 6 languages from src/ into the site root.
// Usage: node tools/build.mjs
//
// Croatian is the default language at the root (/), the others live under /en/,
// /de/, /pl/, /cs/, /sk/ with their own translated addresses (see tools/i18n.mjs).
// Every page lists all its language versions (hreflang) plus x-default, and so
// does the sitemap, so Google treats them as one page in six languages.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, DEFAULT_LANG, XDEFAULT_LANG, LANG_INFO, SLUGS, AREA_PREFIX, PROPERTY_PREFIX, AREA_SLUGS,
  pathFor, localizeLinks, translateHtml, loadDict, loadUi } from './i18n.mjs';
import { listingPages } from './listing-pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const SITE = 'https://n24.hr';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));

// ------------------------------------------------------------------ clean old output
// Generated folders from earlier builds (English at the root, the old /hr/ and /de/
// placeholders). Source folders are never touched.
const GENERATED = new Set(['en', 'de', 'pl', 'cs', 'sk', 'hr', 'property', 'properties', 'services', 'about', 'contact', 'privacy-policy', 'terms', 'primosten-resort',
  ...Object.values(SLUGS).map((s) => s.hr).filter(Boolean), PROPERTY_PREFIX.hr,
  ...AREA_SLUGS.flatMap((a) => [`real-estate-${a}`, `${AREA_PREFIX.hr}-${a}`])]);
for (const dir of GENERATED) {
  if (['src', 'tools', 'assets', 'api', 'manage', 'brand', 'content'].includes(dir)) continue;
  rmSync(join(root, dir), { recursive: true, force: true });
}

// ------------------------------------------------------------------ pages
const STATIC = [
  { id: 'home', src: 'home.html', nav: null, bodyClass: 'has-photo-hero', scripts: ['/assets/js/listings.js', '/assets/js/home.js'] },
  { id: 'properties', src: 'search.html', nav: 'buy', scripts: ['/assets/js/listings.js', '/assets/js/search.js'] },
  { id: 'services', src: 'services.html', nav: 'services', scripts: [] },
  { id: 'about', src: 'about.html', nav: 'about', scripts: [] },
  { id: 'contact', src: 'contact.html', nav: 'contact', scripts: ['/assets/js/contact.js'] },
  { id: 'privacy', src: 'privacy.html', nav: null, scripts: [] },
  { id: 'terms', src: 'terms.html', nav: null, scripts: [] },
  { id: 'resort', src: 'resort.html', nav: 'area-primosten', scripts: ['/assets/js/property.js'] },
];

// Driving distances come from the route data of the owner's taxi site.
const DIST = {
  vodice: [['Šibenik', 12, 17], ['Split Airport', 65, 69], ['Zadar Airport', 64, 58]],
  srima: [['Šibenik', 11, 15], ['Split Airport', 63, 68], ['Zadar Airport', 68, 62]],
  sibenik: [['Split Airport', 54, 56], ['Zadar Airport', 76, 61], ['Primošten', 28, 37]],
  brodarica: [['Šibenik', 7, 10], ['Split Airport', 54, 56], ['Zadar Airport', 76, 60]],
  zaboric: [['Šibenik', 10, 14], ['Split Airport', 53, 53], ['Zadar Airport', 79, 63]],
  grebastica: [['Šibenik', 19, 25], ['Split Airport', 47, 56], ['Zadar Airport', 91, 72]],
  primosten: [['Šibenik', 28, 37], ['Split Airport', 39, 46], ['Zadar Airport', 100, 84]],
  rogoznica: [['Šibenik', 34, 51], ['Split Airport', 34, 44], ['Zadar Airport', 107, 98]],
};
const areasEn = JSON.parse(read('src/data/areas.json'));
function areasFor(lang) {
  const p = `src/data/areas.${lang}.json`;
  if (lang === 'en' || !existsSync(join(root, p))) return areasEn;
  const own = JSON.parse(read(p));
  return areasEn.map((a) => ({ ...a, ...(own.find((x) => x.slug === a.slug) || {}) }));
}

const listings = JSON.parse(read('assets/data/listings.json'));
const layout = read('src/layout.html');
const headerEn = read('src/partials/header.html');
const footerEn = read('src/partials/footer.html');
// Changes whenever any stylesheet, script or text changes, so browsers fetch the new files.
const version = createHash('md5').update(read('assets/css/site.css')
  + ['site', 'listings', 'home', 'search', 'area', 'contact', 'property'].map((f) => read(`assets/js/${f}.js`)).join('')
  + LANGS.map((l) => JSON.stringify(loadUi(l))).join('')).digest('hex').slice(0, 8);

const missingAll = {};
function tr(html, lang, dict) {
  if (lang === 'en') return localizeLinks(html, lang);
  const [out, missing] = translateHtml(html, dict);
  missing.forEach((m) => { (missingAll[lang] = missingAll[lang] || new Set()).add(m); });
  return localizeLinks(out, lang);
}

function areaPage(a, i, all, lang, ui, dict) {
  const inName = esc(a.in || fill(ui.in_place, { name: a.name }));
  const name = esc(a.name);
  const faq = [[a.local_q, a.local_a], ...ui.faq_common.map(([q, ans]) => [fill(q, { name: a.name, in_name: a.in || fill(ui.in_place, { name: a.name }) }), ans])]
    .map(([q, ans]) => `      <h3>${esc(q)}</h3>\n      <p>${esc(ans)}</p>`).join('\n');
  const nearby = [all[i - 1], all[i + 1]].filter(Boolean)
    .map((n) => `        <li><a href="${pathFor(lang, `area-${n.slug}`)}">${esc(fill(ui.crumb_area, { name: n.name }))}</a></li>`).join('\n');
  const resort = a.slug === 'primosten' ? `    <a class="resort-card" href="${pathFor(lang, 'resort')}">
      <span class="rc-name">Primošten Resort</span>
      <span class="rc-text">${esc(ui.resort_card.text)}</span>
      <span class="rc-go">${esc(ui.resort_card.go)}</span>
    </a>` : '';
  // The template's sentences are translated first; the place's own texts go in after.
  const tpl = tr(read('src/pages/area.html'), lang, dict);
  return tpl
    .replaceAll('{{in_name}}', inName)
    .replaceAll('{{name}}', name)
    .replaceAll('{{slug}}', a.slug)
    .replace('{{lede}}', esc(a.lede))
    .replace('{{intro}}', a.intro.map((p) => `      <p>${esc(p)}</p>`).join('\n'))
    .replace('{{homes}}', esc(a.homes))
    .replace('{{land}}', esc(a.land))
    .replace('{{faq}}', faq)
    .replace('{{highlights}}', a.highlights.map((h) => `        <li>${esc(h)}</li>`).join('\n'))
    .replace('{{distances}}', DIST[a.slug].map(([to, km, min]) => `        <div><dt>${esc(ui.dist_places[to] || to)}</dt><dd>${fill(ui.dist, { km, min })}</dd></div>`).join('\n'))
    .replace('{{nearby}}', nearby)
    .replace('{{resort}}', resort);
}

/** Every page in every language, with its alternates. */
const pages = [];
for (const lang of LANGS) {
  const ui = loadUi(lang);
  const dict = loadDict(lang);
  const alt = (id) => Object.fromEntries(LANGS.map((l) => [l, pathFor(l, id)]));
  for (const p of STATIC) {
    pages.push({ ...p, lang, ui, dict, path: pathFor(lang, p.id), alternates: alt(p.id),
      html: tr(read(`src/pages/${p.src}`), lang, dict), title: ui.meta[p.id].title, description: ui.meta[p.id].description });
  }
  const areas = areasFor(lang);
  areas.forEach((a, i) => {
    const id = `area-${a.slug}`;
    const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui.crumb_home, item: SITE + pathFor(lang, 'home') },
      { '@type': 'ListItem', position: 2, name: fill(ui.crumb_area, { name: a.name }), item: SITE + pathFor(lang, id) },
    ] };
    pages.push({ id, lang, ui, dict, path: pathFor(lang, id), alternates: alt(id), nav: id,
      scripts: ['/assets/js/listings.js', '/assets/js/area.js'], html: areaPage(a, i, areas, lang, ui, dict),
      title: fill(ui.meta.area.title, { name: a.name }),
      description: a.lede.length > 155 ? a.lede.slice(0, 152) + '...' : a.lede,
      head: `<script type="application/ld+json">${JSON.stringify(crumbs)}</script>` });
  });
  for (const lp of listingPages(listings, lang, ui)) pages.push({ ...lp, ui, dict });
  // One 404 page per language (api/notfound.php picks it by the address).
  pages.push({ id: '404', lang, ui, dict, path: (lang === DEFAULT_LANG ? '/' : `/${lang}/`) + '404.html', noindex: true, nav: null,
    scripts: [], html: tr(read('src/pages/404.html'), lang, dict), title: ui.meta['404'].title, description: ui.meta['404'].description });
}

// ------------------------------------------------------------------ language switcher and hreflang
function langSwitcher(page) {
  const cur = LANG_INFO[page.lang];
  const flag = (l) => `<img class="lang-flag" src="/assets/img/flags/${l}.svg" width="20" height="15" alt="">`;
  const link = (l) => {
    const href = (page.alternates && page.alternates[l]) || pathFor(l, 'home');
    const current = l === page.lang ? ' aria-current="true"' : '';
    return `<li><a href="${href}" hreflang="${l}" lang="${l}"${current}>${flag(l)} ${LANG_INFO[l].label}</a></li>`;
  };
  const label = `${esc(page.ui.lang_menu)}: ${esc(cur.name)}`;
  const desktop = `<div class="has-menu lang-switch">
      <button class="menu-toggle lang-toggle" type="button" aria-expanded="false" aria-controls="lang-menu" aria-label="${label}">${flag(page.lang)} ${cur.label} <svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg></button>
      <ul class="lang-menu" id="lang-menu">
          ${LANGS.map(link).join('\n          ')}
      </ul>
    </div>`;
  const mobile = `<li class="m-has-menu m-lang">
        <button class="m-toggle" type="button" aria-expanded="false" aria-controls="m-lang" aria-label="${label}">${flag(page.lang)} ${cur.label} <svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg></button>
        <ul class="m-sub" id="m-lang" hidden>
          ${LANGS.map(link).join('\n          ')}
        </ul>
      </li>`;
  return [desktop, mobile];
}

function hreflang(page) {
  if (!page.alternates) return '';
  return LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${page.alternates[l]}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE}${page.alternates[XDEFAULT_LANG]}">`;
}

const headerCache = {};
function partials(lang, dict) {
  if (!headerCache[lang]) headerCache[lang] = [tr(headerEn, lang, dict), tr(footerEn, lang, dict)];
  return headerCache[lang];
}

function render(page, { keepNav = false, switcher } = {}) {
  const [header, footer] = partials(page.lang, page.dict);
  const head = (keepNav ? header : header.replace(/\{\{nav:([\w-]+)\}\}/g, (_, id) => {
    if (id === page.nav) return ' aria-current="page"';
    if (id === 'areas' && String(page.nav).startsWith('area-')) return ' data-current="true"';
    return '';
  })).replace('{{lang_switcher}}', switcher !== undefined ? switcher : langSwitcher(page)[0])
    .replace('{{lang_switcher_mobile}}', switcher !== undefined ? '{{lang_switcher_mobile}}' : langSwitcher(page)[1]);
  const scripts = [`/assets/js/i18n/${page.lang}.js`, ...page.scripts].map((s) => `<script src="${s}?v=${version}" defer></script>`).join('\n');
  const extraHead = [page.head || '', page.hreflang !== undefined ? page.hreflang : hreflang(page), page.noindex ? '<meta name="robots" content="noindex">' : '']
    .filter(Boolean).join('\n');
  return layout
    .replace('{{lang}}', page.lang)
    .replace('{{title}}', esc(page.title).replace(/&amp;(?=[a-z]+;)/g, '&'))
    .replace('{{description}}', esc(page.description))
    .replace('{{path}}', page.path)
    .replace('{{bodyClass}}', page.bodyClass || 'has-band-hero')
    .replace('{{header}}', head.trim())
    .replace('{{footer}}', footer.trim())
    .replace('{{content}}', page.html.trim())
    .replace('{{head}}', extraHead)
    .replace('{{scripts}}', scripts)
    .replaceAll('{{logo_tagline}}', page.ui.logo_tagline)
    .replaceAll('{{version}}', version);
}

const fileFor = (path) => (path.endsWith('.html') ? path.slice(1) : `${path.slice(1)}index.html`);
for (const page of pages) {
  const out = join(root, fileFor(page.path));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(page));
}
console.log('built', pages.length, 'pages in', LANGS.length, 'languages');

// ------------------------------------------------------------------ scripts: texts and addresses
mkdirSync(join(root, 'assets/js/i18n'), { recursive: true });
for (const lang of LANGS) {
  const ui = loadUi(lang);
  const data = {
    lang, locale: LANG_INFO[lang].locale,
    paths: { home: pathFor(lang, 'home'), properties: pathFor(lang, 'properties'), contact: pathFor(lang, 'contact'), resort: pathFor(lang, 'resort'), property: pathFor(lang, 'home') + PROPERTY_PREFIX[lang] + '/' },
    t: { places_other: ui.places_other, place_unknown: ui.place_unknown, types: ui.types, type_plural: ui.type_plural, card: ui.card, range: ui.range,
      home: ui.home, search: ui.search, area: ui.area, in_place: ui.in_place, contact: ui.contact, photos: ui.photos, video: ui.video },
  };
  writeFileSync(join(root, `assets/js/i18n/${lang}.js`), `// Generated by tools/build.mjs from src/i18n/ui.${lang}.json\nwindow.N24_I18N = ${JSON.stringify(data)};\n`);
}

// ------------------------------------------------------------------ server side (PHP)
// Property pages and the sitemap are made by PHP on the live server from the listings
// saved in the admin. It fills these templates (same layout, header and footer).
mkdirSync(join(root, 'api/views'), { recursive: true });
const phpUi = {};
for (const lang of LANGS) {
  const ui = loadUi(lang);
  const dict = loadDict(lang);
  writeFileSync(join(root, `api/views/property-shell.${lang}.html`), render(
    { lang, ui, dict, path: '{{path}}', bodyClass: 'has-band-hero', scripts: ['/assets/js/property.js'], title: '{{title}}', description: '{{description}}', head: '{{head}}', hreflang: '{{hreflang}}', html: '{{content}}' },
    { keepNav: true, switcher: '{{lang_switcher}}' },
  ).replace('&lbrace;', '{'));
  phpUi[lang] = { locale: LANG_INFO[lang].locale, label: LANG_INFO[lang].label, name: LANG_INFO[lang].name,
    home: pathFor(lang, 'home'), properties: pathFor(lang, 'properties'), contact_url: pathFor(lang, 'contact'), resort: pathFor(lang, 'resort'),
    areas: Object.fromEntries(AREA_SLUGS.map((a) => [a, pathFor(lang, `area-${a}`)])), property_prefix: PROPERTY_PREFIX[lang],
    lang_menu: ui.lang_menu, crumb_home: ui.crumb_home, crumb_area: ui.crumb_area, crumb_properties: ui.crumb_properties,
    types: ui.types, places_other: ui.places_other, place_unknown: ui.place_unknown, card: ui.card, property: ui.property, unit_status: ui.unit_status, contact: ui.contact };
}
writeFileSync(join(root, 'api/views/i18n.json'), JSON.stringify({ langs: LANGS, default: DEFAULT_LANG, xdefault: XDEFAULT_LANG, ui: phpUi }, null, 1));
writeFileSync(join(root, 'api/views/sitemap-static.json'), JSON.stringify(
  pages.filter((p) => p.lang === DEFAULT_LANG && !p.noindex && !p.listing).map((p) => p.alternates), null, 1));

// ------------------------------------------------------------------ sitemap and robots
const today = new Date().toISOString().slice(0, 10);
const entries = pages.filter((p) => !p.noindex).map((p) => {
  const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p.alternates[l]}"/>`).join('\n');
  return `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p.alternates[XDEFAULT_LANG]}"/>\n  </url>`;
});
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('built sitemap.xml with', entries.length, 'addresses');

for (const [lang, set] of Object.entries(missingAll)) {
  console.log(`  ${lang}: ${set.size} texts not translated yet (shown in English)`);
}
