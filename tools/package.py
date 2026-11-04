"""Zips the built website for upload to the web root of n24.hr.

Usage:  node tools/build.mjs  then  python tools/package.py [--update] [output.zip]
Default output: n24-website.zip on the Desktop. With --update the listing photos
are left out (n24-website-update.zip): for uploads where no listing photo changed. Contains only what the live
site needs: pages, assets, brand icons, .htaccess, robots, sitemap and the
contact form script. Source, tools, original photos and notes stay out.
"""
import sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPDATE = '--update' in sys.argv
args = [a for a in sys.argv[1:] if a != '--update']
OUT = Path(args[0]) if args else Path.home() / 'Desktop' / ('n24-website-update.zip' if UPDATE else 'n24-website.zip')
SKIP_DIRS = {'src', 'tools', 'content', '.git', '.claude', '.impeccable', '.vercel', 'node_modules', '__pycache__'}
ROOT_FILES = {'.htaccess', 'index.html', '404.html', 'robots.txt', 'sitemap.xml'}
API_FILES = {'api/contact.php'}

def wanted(rel: Path) -> bool:
    parts = rel.parts
    if parts[0] in SKIP_DIRS:
        return False
    if len(parts) == 1:
        return rel.name in ROOT_FILES
    if UPDATE and rel.as_posix().startswith('assets/img/listings/'):
        return False
    if parts[0] == 'api':
        return rel.as_posix() in API_FILES
    if rel.suffix in {'.md', '.py', '.mjs'} or rel.name.endswith('.webp.json'):
        return False
    return True

files = sorted(p for p in ROOT.rglob('*') if p.is_file() and wanted(p.relative_to(ROOT)))
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, p.relative_to(ROOT).as_posix())
print(f'{len(files)} files -> {OUT} ({OUT.stat().st_size / 1e6:.1f} MB)')
