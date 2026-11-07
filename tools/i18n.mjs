// Languages, translated addresses and page translation for the build.
//
// The English pages in src/ are the single source. For every other language the
// build swaps each piece of visible text for its translation from
// src/i18n/<lang>.json (keyed by an id made from the English text, see
// src/i18n/catalog.json) and rewrites every internal link to that language's
// address. Croatian is the default language and lives at the root (/), the
// others under /en/, /de/, /pl/, /cs/, /sk/.
//
//   node tools/i18n.mjs extract   refresh src/i18n/catalog.json from the English pages
//   node tools/i18n.mjs missing   list texts that still need a translation, per language

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

export const LANGS = ['hr', 'en', 'de', 'pl', 'cs', 'sk'];
export const DEFAULT_LANG = 'hr';
// Visitors whose language is none of these get English: the buyers are mostly foreign.
export const XDEFAULT_LANG = 'en';
export const LANG_INFO = {
  hr: { label: 'HR', name: 'Hrvatski', locale: 'hr-HR', og: 'hr_HR' },
  en: { label: 'EN', name: 'English', locale: 'en-IE', og: 'en_GB' },
  de: { label: 'DE', name: 'Deutsch', locale: 'de-DE', og: 'de_DE' },
  pl: { label: 'PL', name: 'Polski', locale: 'pl-PL', og: 'pl_PL' },
  // "cs" is the language code (hreflang, /cs/); visitors know the country as CZ.
  cs: { label: 'CZ', name: 'Čeština', locale: 'cs-CZ', og: 'cs_CZ' },
  sk: { label: 'SK', name: 'Slovenčina', locale: 'sk-SK', og: 'sk_SK' },
};

// Address of every page in every language. Area and property pages add the
// place or listing to their prefix.
export const SLUGS = {
  home: { hr: '', en: '', de: '', pl: '', cs: '', sk: '' },
  properties: { hr: 'nekretnine', en: 'properties', de: 'immobilien', pl: 'nieruchomosci', cs: 'nemovitosti', sk: 'nehnutelnosti' },
  services: { hr: 'usluge', en: 'services', de: 'leistungen', pl: 'uslugi', cs: 'sluzby', sk: 'sluzby' },
  about: { hr: 'o-nama', en: 'about', de: 'ueber-uns', pl: 'o-nas', cs: 'o-nas', sk: 'o-nas' },
  contact: { hr: 'kontakt', en: 'contact', de: 'kontakt', pl: 'kontakt', cs: 'kontakt', sk: 'kontakt' },
  privacy: { hr: 'politika-privatnosti', en: 'privacy-policy', de: 'datenschutz', pl: 'polityka-prywatnosci', cs: 'ochrana-osobnich-udaju', sk: 'ochrana-osobnych-udajov' },
  terms: { hr: 'uvjeti-koristenja', en: 'terms', de: 'nutzungsbedingungen', pl: 'regulamin', cs: 'podminky-uzivani', sk: 'podmienky-pouzivania' },
  resort: { hr: 'primosten-resort', en: 'primosten-resort', de: 'primosten-resort', pl: 'primosten-resort', cs: 'primosten-resort', sk: 'primosten-resort' },
};
export const AREA_PREFIX = { hr: 'nekretnine', en: 'real-estate', de: 'immobilien', pl: 'nieruchomosci', cs: 'nemovitosti', sk: 'nehnutelnosti' };
export const PROPERTY_PREFIX = { hr: 'nekretnina', en: 'property', de: 'immobilie', pl: 'oferta', cs: 'nemovitost', sk: 'nehnutelnost' };
export const AREA_SLUGS = ['vodice', 'srima', 'sibenik', 'brodarica', 'zaboric', 'grebastica', 'primosten', 'rogoznica'];

const langRoot = (lang) => (lang === DEFAULT_LANG ? '/' : `/${lang}/`);

/** Path of a page in a language: pathFor('de', 'contact') -> '/de/kontakt/'. */
export function pathFor(lang, id) {
  if (id.startsWith('area-')) return `${langRoot(lang)}${AREA_PREFIX[lang]}-${id.slice(5)}/`;
  const slug = SLUGS[id][lang];
  return slug ? `${langRoot(lang)}${slug}/` : langRoot(lang);
}

export function propertyPath(lang, id, slug) {
  return `${langRoot(lang)}${PROPERTY_PREFIX[lang]}/${id}-${slug}/`;
}

// The English source pages link to the English addresses at the root
// (/contact/, /real-estate-vodice/ ...). These map them to page ids.
const EN_PATHS = {};
for (const id of Object.keys(SLUGS)) EN_PATHS[SLUGS[id].en ? `/${SLUGS[id].en}/` : '/'] = id;
for (const a of AREA_SLUGS) EN_PATHS[`/real-estate-${a}/`] = `area-${a}`;

/** Rewrites every internal link in the English HTML to the language's addresses. */
export function localizeLinks(html, lang) {
  return html.replace(/(href|action)="(\/[^"#?]*)([?#][^"]*)?"/g, (m, attr, path, rest = '') => {
    if (EN_PATHS[path] !== undefined) return `${attr}="${pathFor(lang, EN_PATHS[path])}${rest}"`;
    return m;
  });
}

// ------------------------------------------------------------------ text translation

// Words that stay the same in every language are not put in the catalog.
const KEEP = new Set(['N24', 'WhatsApp', 'Vodice', 'Srima', 'Šibenik', 'Brodarica', 'Žaborić', 'Grebaštica', 'Primošten', 'Rogoznica',
  'Primošten Resort', 'Nekretnine 24 d.o.o.', 'Bože Peričića 26', 'OIB', 'MB', 'IBAN', 'BIC', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok',
  'Antonio Digital', 'Hrvatska poštanska banka d.d.', '100+', 'Tomislav Plenča', 'Nekretnine 24 d.o.o., Bože Peričića 26, 22000 Šibenik']);

export const keyOf = (text) => createHash('sha1').update(text).digest('hex').slice(0, 10);
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const hasWords = (s) => /[A-Za-zÀ-žА-я]{2,}/.test(s.replace(/\{\{[^}]*\}\}/g, '').replace(/&[a-z]+;/g, ''));
const translatable = (s) => hasWords(s) && !KEEP.has(s) && !/^[\s\d.,+€m²()/–-]*$/.test(s);

// Parts of a page that hold no visible text to translate.
const SKIP_BLOCKS = /<(script|style|svg)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/g;
const ATTRS = /\b(alt|aria-label|placeholder|title|data-title)="([^"]*)"/g;

/** Every translatable text in an English page, in order. */
export function extractTexts(html) {
  const out = [];
  const body = html.replace(SKIP_BLOCKS, '<i></i>');
  for (const m of body.matchAll(/>([^<]+)</g)) {
    const t = norm(m[1]);
    if (translatable(t)) out.push(t);
  }
  for (const m of body.matchAll(ATTRS)) {
    const t = norm(m[2]);
    if (translatable(t)) out.push(t);
  }
  return out;
}

/** Replaces each English text with its translation; returns [html, missing texts]. */
export function translateHtml(html, dict) {
  const missing = [];
  const swap = (raw) => {
    const t = norm(raw);
    if (!translatable(t)) return raw;
    const tr = dict[keyOf(t)];
    if (tr === undefined) { missing.push(t); return raw; }
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    return lead + tr + trail;
  };
  // Script, style and svg blocks are set aside (as empty markers, so the text right
  // before an icon still ends at a tag) and put back after the replacement.
  const kept = [];
  const masked = html.replace(SKIP_BLOCKS, (m) => `<i data-kept="${kept.push(m) - 1}"></i>`);
  const out = masked
    .replace(/>([^<]+)</g, (m, t) => '>' + swap(t) + '<')
    .replace(ATTRS, (m, a, v) => `${a}="${swap(v)}"`)
    .replace(/<i data-kept="(\d+)"><\/i>/g, (m, n) => kept[+n]);
  return [out, missing];
}

export function loadDict(lang) {
  const p = join(root, 'src/i18n', `${lang}.json`);
  return lang === 'en' || !existsSync(p) ? {} : JSON.parse(readFileSync(p, 'utf8'));
}

/** UI strings for scripts, PHP and the build (src/i18n/ui.<lang>.json), English as fallback. */
export function loadUi(lang) {
  const en = JSON.parse(read('src/i18n/ui.en.json'));
  const p = join(root, 'src/i18n', `ui.${lang}.json`);
  const own = lang === 'en' || !existsSync(p) ? {} : JSON.parse(readFileSync(p, 'utf8'));
  const merge = (a, b) => {
    const o = { ...a };
    for (const [k, v] of Object.entries(b)) o[k] = v && typeof v === 'object' && !Array.isArray(v) && a[k] ? merge(a[k], v) : v;
    return o;
  };
  return merge(en, own);
}

// ------------------------------------------------------------------ catalog

export const SOURCE_FILES = () => [
  ...readdirSync(join(root, 'src/pages')).filter((f) => f.endsWith('.html')).map((f) => `src/pages/${f}`),
  'src/partials/header.html', 'src/partials/footer.html',
];

function extractAll() {
  const catalog = {};
  for (const f of SOURCE_FILES()) {
    for (const t of extractTexts(read(f))) catalog[keyOf(t)] = t;
  }
  return catalog;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmd = process.argv[2];
  if (cmd === 'extract') {
    const c = extractAll();
    writeFileSync(join(root, 'src/i18n/catalog.json'), JSON.stringify(c, null, 1) + '\n');
    console.log(Object.keys(c).length, 'texts in src/i18n/catalog.json');
  } else if (cmd === 'missing') {
    const c = extractAll();
    for (const lang of LANGS.filter((l) => l !== 'en')) {
      const d = loadDict(lang);
      const miss = Object.keys(c).filter((k) => d[k] === undefined);
      console.log(lang, miss.length ? `${miss.length} missing` : 'complete');
    }
  } else {
    console.log('Usage: node tools/i18n.mjs extract | missing');
  }
}
