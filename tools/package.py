"""Zips the built website for upload to the web root of n24.hr.

Usage:  node tools/build.mjs  then  python tools/package.py [--update] [--with-data] [output.zip]

Default output: n24-website.zip on the Desktop (everything, for a fresh install).
--update      leaves out the listing photos (n24-website-update.zip): for code and
              page changes.
--with-data   also includes assets/data/listings.json. Without it the listings
              on the server stay as Tomislav saved them in the admin: an upload
              must never overwrite his work.

Never in a zip: source, tools, original photos, notes, the static property pages
and sitemap (PHP makes those on the server), and api/data (login, backups).
Every entry carries Unix permissions (folders 755, files 644).
"""
import sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPDATE = '--update' in sys.argv
WITH_DATA = '--with-data' in sys.argv
args = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = Path(args[0]) if args else Path.home() / 'Desktop' / ('n24-website-update.zip' if UPDATE else 'n24-website.zip')
SKIP_DIRS = {'src', 'tools', 'content', '.git', '.claude', '.impeccable', '.vercel', 'node_modules', '__pycache__'}
ROOT_FILES = {'.htaccess', 'index.html', '404.html', 'robots.txt'}
API_FILES = {'api/contact.php', 'api/property.php', 'api/sitemap.php', 'api/data/.htaccess'}

def wanted(rel: Path) -> bool:
    parts = rel.parts
    if parts[0] in SKIP_DIRS:
        return False
    if len(parts) == 1:
        return rel.name in ROOT_FILES
    path = rel.as_posix()
    if UPDATE and path.startswith('assets/img/listings/'):
        return False
    if path == 'assets/data/listings.json':
        return WITH_DATA
    if parts[0] == 'property':
        return False
    if parts[0] == 'api':
        return path in API_FILES or (len(parts) == 3 and parts[1] in ('lib', 'views'))
    if rel.suffix in {'.md', '.py', '.mjs'} or rel.name.endswith('.webp.json'):
        return False
    return True

files = sorted(p for p in ROOT.rglob('*') if p.is_file() and wanted(p.relative_to(ROOT)))

# Unix permissions stored in the zip, so the host's Extract sets them right away:
# folders 755, files 644 (no chmod by FTP after uploading).
FILE_MODE, DIR_MODE = 0o100644, 0o040755

def add_dir(z, name, done):
    if name in done:
        return
    done.add(name)
    info = zipfile.ZipInfo(name + '/')
    info.create_system = 3  # Unix
    info.external_attr = (DIR_MODE << 16) | 0x10
    z.writestr(info, b'')

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    done = set()
    for p in files:
        rel = p.relative_to(ROOT).as_posix()
        parts = rel.split('/')
        for i in range(1, len(parts)):
            add_dir(z, '/'.join(parts[:i]), done)
        info = zipfile.ZipInfo.from_file(p, rel)
        info.create_system = 3
        info.external_attr = FILE_MODE << 16
        info.compress_type = zipfile.ZIP_DEFLATED
        with open(p, 'rb') as fh:
            z.writestr(info, fh.read())
print(f'{len(files)} files, {len(done)} folders -> {OUT} ({OUT.stat().st_size / 1e6:.1f} MB)')
