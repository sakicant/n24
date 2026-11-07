"""Puts the listing translations into assets/data/listings.json.

Usage:  python tools/listing_tr.py

Each listing is entered in one language (field "lang", "en" for the first ones).
Translations live in src/i18n/listings.<lang>.json as
    { "<id>": { "title", "status", "description": [], "features": [], "standards": [], "units": [] } }
and end up in the listing as tr.<lang>, with an address (slug) made from the
translated title. "tr_src" records which version of the original text was
translated, so the admin can show "Needs translation" when the text changes.

Workflow for listings added in the admin: Download backup in the admin, replace
assets/data/listings.json with it, add the translations, run this script and
upload with python tools/package.py --update --with-data.
"""
import hashlib
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'assets' / 'data' / 'listings.json'
LANGS = ['hr', 'en', 'de', 'pl', 'cs', 'sk']
FIELDS = ['title', 'status', 'description', 'features', 'standards', 'units']


def slugify(s):
    """Same result as n24_slugify() in api/lib/store.php."""
    s = s.lower()
    s = s.translate(str.maketrans({'š': 's', 'đ': 'd', 'č': 'c', 'ć': 'c', 'ž': 'z', 'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss',
                                   '²': '2', '€': 'eur'}))
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return re.sub(r'-+', '-', s)[:80] or 'listing'


def source_hash(l):
    """Fingerprint of the text as entered; it must match n24_source_hash() in api/lib/store.php."""
    src = {'title': l.get('title', ''), 'status': l.get('status', ''), 'description': l.get('description', []),
           'features': l.get('features', []), 'standards': l.get('standards') or [],
           'units': [u[0] for u in (l.get('units') or [])]}
    return hashlib.sha1(json.dumps(src, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()[:12]


def main():
    data = json.loads(DATA.read_text(encoding='utf8'))
    files = {lang: json.loads((ROOT / 'src' / 'i18n' / f'listings.{lang}.json').read_text(encoding='utf8'))
             for lang in LANGS if (ROOT / 'src' / 'i18n' / f'listings.{lang}.json').exists()}
    for l in data:
        l.setdefault('lang', 'en')
        tr = l.get('tr', {})
        for lang, items in files.items():
            if lang == l['lang'] or l['id'] not in items:
                continue
            t = {k: v for k, v in items[l['id']].items() if k in FIELDS and v}
            t['slug'] = slugify(t.get('title', l['title']))
            tr[lang] = t
        if tr:
            l['tr'] = tr
            # Translations made now are of the current text.
            l['tr_src'] = source_hash(l)
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf8')
    done = {lang: sum(1 for l in data if lang == l['lang'] or lang in l.get('tr', {})) for lang in LANGS}
    print('listings per language:', done, 'of', len(data))


if __name__ == '__main__':
    main()
