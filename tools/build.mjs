// Builds the static pages from src/ into the site root.
// Usage: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// The line under N24 in the logo, in each site language.
const LOGO_TAGLINE = { en: 'REAL ESTATE', hr: 'NEKRETNINE', de: 'IMMOBILIEN' };

const pages = [
  {
    src: 'home.html', out: 'index.html', path: '/', nav: null, bodyClass: 'has-photo-hero',
    title: 'N24 Real Estate | Houses, Villas and Land from Vodice to Rogoznica',
    description: 'Houses, villas, apartments and building land on the Šibenik coast, from Vodice to Rogoznica. Local agency since 2010. Call or WhatsApp Tomislav: +385 95 700 7001.',
    scripts: ['/assets/js/listings.js', '/assets/js/home.js'],
  },
  {
    src: 'search.html', out: 'properties/index.html', path: '/properties/', nav: 'buy', bodyClass: 'has-band-hero',
    title: 'Properties for Sale on the Šibenik Coast | Houses, Villas, Land | N24',
    description: 'Search houses, villas, apartments, new builds and building land for sale from Vodice to Rogoznica. Filter by place, type, price and size. N24 Real Estate.',
    scripts: ['/assets/js/listings.js', '/assets/js/search.js'],
  },
  {
    src: 'services.html', out: 'services/index.html', path: '/services/', nav: 'services', bodyClass: 'has-band-hero',
    title: 'Real Estate Services in Croatia | Land Consolidation & Investment | N24',
    description: 'Land consolidation, investment consulting, project management, architecture and property maintenance on the Šibenik coast. N24, local agency since 2010.',
    scripts: [],
  },
  {
    src: 'about.html', out: 'about/index.html', path: '/about/', nav: 'about', bodyClass: 'has-band-hero',
    title: 'About N24 Real Estate | Tomislav Plenča | Šibenik since 2010',
    description: 'N24 is a Šibenik real estate agency working the coast from Vodice to Rogoznica since 2010. Meet director Tomislav Plenča and see what N24 does.',
    scripts: [],
  },
  {
    src: 'contact.html', out: 'contact/index.html', path: '/contact/', nav: 'contact', bodyClass: 'has-band-hero',
    title: 'Contact N24 Real Estate | Šibenik | +385 95 700 7001',
    description: 'Call, WhatsApp or email Tomislav Plenča at N24 Real Estate, Bože Peričića 26, Šibenik. Buying, selling and land on the coast from Vodice to Rogoznica.',
    scripts: ['/assets/js/contact.js'],
  },
  {
    src: 'privacy.html', out: 'privacy-policy/index.html', path: '/privacy-policy/', nav: null, bodyClass: 'has-band-hero',
    title: 'Privacy Policy and Cookies | N24 Real Estate',
    description: 'How Nekretnine 24 d.o.o. collects, uses and protects personal data, and how this website uses cookies.',
    scripts: [],
  },
  {
    src: 'terms.html', out: 'terms/index.html', path: '/terms/', nav: null, bodyClass: 'has-band-hero',
    title: 'Terms of Use | N24 Real Estate',
    description: 'General terms of use of the N24 Real Estate website, published by Nekretnine 24 d.o.o., Šibenik.',
    scripts: [],
  },
];

// Area pages: one per place on the coast, built from src/data/areas.json.
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
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const areas = JSON.parse(read('src/data/areas.json'));
const areaTpl = read('src/pages/area.html');
const COMMON_FAQ = (name) => [
  [`Can foreigners buy property in ${name}?`, `Citizens of EU countries can buy property in Croatia under the same conditions as Croatian citizens. For citizens of other countries it depends on an agreement between Croatia and their country and on approval by the Ministry of Justice. Tomislav will check your case before you make an offer.`],
  [`What should I check before buying land in ${name}?`, `Check that the plot lies inside the building zone of the spatial plan, that the land registry and the cadastre match, who all the owners are, and that the plot has road access and utilities. N24 checks all of this for the land it sells.`],
];
areas.forEach((a, i) => {
  const faq = [[a.local_q, a.local_a], ...COMMON_FAQ(a.name)]
    .map(([q, ans]) => `      <h3>${esc(q)}</h3>\n      <p>${esc(ans)}</p>`).join('\n');
  const nearby = [areas[i - 1], areas[i + 1]].filter(Boolean)
    .map((n) => `        <li><a href="/real-estate-${n.slug}/">Real estate ${esc(n.name)}</a></li>`).join('\n');
  const resort = a.slug === 'primosten' ? `    <a class="resort-card" href="/primosten-resort/">
      <span class="rc-name">Primošten Resort</span>
      <span class="rc-text">More than 100 new apartments and villas above Primošten. See every unit, its floor, size and status.</span>
      <span class="rc-go">See the units</span>
    </a>` : '';
  const html = areaTpl
    .replaceAll('{{name}}', esc(a.name))
    .replaceAll('{{slug}}', a.slug)
    .replace('{{lede}}', esc(a.lede))
    .replace('{{intro}}', a.intro.map((p) => `      <p>${esc(p)}</p>`).join('\n'))
    .replace('{{homes}}', esc(a.homes))
    .replace('{{land}}', esc(a.land))
    .replace('{{faq}}', faq)
    .replace('{{highlights}}', a.highlights.map((h) => `        <li>${esc(h)}</li>`).join('\n'))
    .replace('{{distances}}', DIST[a.slug].map(([to, km, min]) => `        <div><dt>${to}</dt><dd>${km} km · about ${min} min</dd></div>`).join('\n'))
    .replace('{{nearby}}', nearby)
    .replace('{{resort}}', resort);
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.n24.hr/' },
    { '@type': 'ListItem', position: 2, name: `Real estate ${a.name}`, item: `https://www.n24.hr/real-estate-${a.slug}/` },
  ] };
  pages.push({
    html, out: `real-estate-${a.slug}/index.html`, path: `/real-estate-${a.slug}/`, nav: `area-${a.slug}`, bodyClass: 'has-band-hero',
    title: `Real Estate ${a.name} | Houses, Villas & Land for Sale | N24`,
    description: a.lede.length > 155 ? a.lede.slice(0, 152) + '...' : a.lede,
    scripts: ['/assets/js/listings.js', '/assets/js/area.js'],
    head: `<script type="application/ld+json">${JSON.stringify(crumbs)}</script>`,
  });
});

const version = createHash('md5')
  .update(read('assets/css/site.css') + read('assets/js/site.js'))
  .digest('hex').slice(0, 8);

const layout = read('src/layout.html');
const header = read('src/partials/header.html');
const footer = read('src/partials/footer.html');

for (const page of pages) {
  const lang = page.lang || 'en';
  const head = header.replace(/\{\{nav:([\w-]+)\}\}/g, (_, id) => {
    if (id === page.nav) return ' aria-current="page"';
    if (id === 'areas' && String(page.nav).startsWith('area-')) return ' data-current="true"';
    return '';
  });
  const scripts = page.scripts.map((s) => `<script src="${s}?v=${version}" defer></script>`).join('\n');
  const html = layout
    .replace('{{lang}}', lang)
    .replace('{{title}}', page.title)
    .replace('{{description}}', page.description)
    .replace('{{path}}', page.path)
    .replace('{{bodyClass}}', page.bodyClass)
    .replace('{{header}}', head.trim())
    .replace('{{footer}}', footer.trim())
    .replace('{{content}}', (page.html || read(`src/pages/${page.src}`)).trim())
    .replace('{{head}}', page.head || '')
    .replace('{{scripts}}', scripts)
    .replaceAll('{{logo_tagline}}', LOGO_TAGLINE[lang])
    .replaceAll('{{version}}', version);
  const out = join(root, page.out);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('built', page.out);
}
