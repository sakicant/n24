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
    src: 'search.html', out: 'properties-for-sale/index.html', path: '/properties-for-sale/', nav: 'buy', bodyClass: 'has-band-hero',
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
];

const version = createHash('md5')
  .update(read('assets/css/site.css') + read('assets/js/site.js'))
  .digest('hex').slice(0, 8);

const layout = read('src/layout.html');
const header = read('src/partials/header.html');
const footer = read('src/partials/footer.html');

for (const page of pages) {
  const lang = page.lang || 'en';
  const head = header.replace(/\{\{nav:(\w+)\}\}/g, (_, id) => (id === page.nav ? ' aria-current="page"' : ''));
  const scripts = page.scripts.map((s) => `<script src="${s}?v=${version}" defer></script>`).join('\n');
  const html = layout
    .replace('{{lang}}', lang)
    .replace('{{title}}', page.title)
    .replace('{{description}}', page.description)
    .replace('{{path}}', page.path)
    .replace('{{bodyClass}}', page.bodyClass)
    .replace('{{header}}', head.trim())
    .replace('{{footer}}', footer.trim())
    .replace('{{content}}', read(`src/pages/${page.src}`).trim())
    .replace('{{scripts}}', scripts)
    .replaceAll('{{logo_tagline}}', LOGO_TAGLINE[lang])
    .replaceAll('{{version}}', version);
  const out = join(root, page.out);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('built', page.out);
}
